/**
 * Penguin Gym Linux - Virtual Ansible Automation Engine
 * Simula inventários INI, execução ad-hoc (ansible) e playbooks YAML (ansible-playbook)
 * com múltiplos nós gerenciados (web1, web2, db1), controle de privilégios (--become),
 * dry-run (--check --diff), handlers/notify, loops, condicionais e idempotência real.
 */

class AnsibleEngine {
  constructor(fs) {
    this.fs = fs;
    this.reset();
  }

  reset() {
    this.nodes = {
      web1: {
        host: 'web1',
        ip: '10.0.1.11',
        osFamily: 'Debian',
        distribution: 'Ubuntu',
        version: '22.04',
        packages: new Set(['python3', 'openssh-server', 'bash']),
        services: {
          nginx: { active: false, enabled: false },
          ssh: { active: true, enabled: true },
          cron: { active: true, enabled: true }
        },
        files: {
          '/etc/app.conf': { content: '# app config\n', mode: '0644' },
          '/etc/nginx/nginx.conf': { content: 'worker_processes auto;\n', mode: '0644' }
        },
        users: new Set(['ubuntu']),
        ufwRules: new Set(),
        reachable: true
      },
      web2: {
        host: 'web2',
        ip: '10.0.1.12',
        osFamily: 'Debian',
        distribution: 'Ubuntu',
        version: '22.04',
        packages: new Set(['python3', 'openssh-server', 'bash']),
        services: {
          nginx: { active: false, enabled: false },
          ssh: { active: true, enabled: true },
          cron: { active: true, enabled: true }
        },
        files: {
          '/etc/app.conf': { content: '# app config\n', mode: '0644' },
          '/etc/nginx/nginx.conf': { content: 'worker_processes auto;\n', mode: '0644' }
        },
        users: new Set(['ubuntu']),
        ufwRules: new Set(),
        reachable: true
      },
      db1: {
        host: 'db1',
        ip: '10.0.1.21',
        osFamily: 'Debian',
        distribution: 'Debian',
        version: '12',
        packages: new Set(['python3', 'openssh-server', 'postgresql']),
        services: {
          postgresql: { active: true, enabled: true },
          ssh: { active: true, enabled: true },
          cron: { active: true, enabled: true }
        },
        files: {
          '/etc/app.conf': { content: '# db config\n', mode: '0644' }
        },
        users: new Set(['ubuntu', 'postgres']),
        ufwRules: new Set(),
        reachable: true
      }
    };
    this.defaultInventoryGroups = {
      webservers: ['web1', 'web2'],
      databases: ['db1'],
      all: ['web1', 'web2', 'db1']
    };
    this.lastRecap = null;
    this.lastCommand = null;
    this.lastCheckMode = false;
    this.playbookRuns = [];
  }

  /**
   * Lê e interpreta arquivo de inventário INI do VirtualFS.
   */
  parseInventory(invPath) {
    const resolved = invPath || (this.fs.getNode('inventory.ini') ? 'inventory.ini' : '/etc/ansible/hosts');
    const node = this.fs.getNode(resolved);
    if (!node || node.type !== 'file') {
      throw new Error(`ERROR! Unable to parse ${resolved} as an inventory source`);
    }

    const groups = { all: [] };
    const hostVars = {};
    let currentGroup = 'ungrouped';
    groups[currentGroup] = [];

    const lines = (node.content || '').split('\n');
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#') || line.startsWith(';')) continue;
      const groupMatch = line.match(/^\[([A-Za-z0-9_.-]+)(?::vars)?\]$/);
      if (groupMatch) {
        currentGroup = groupMatch[1];
        if (!groups[currentGroup]) groups[currentGroup] = [];
        continue;
      }
      if (line.includes('=') && currentGroup.endsWith(':vars')) continue;

      const tokens = line.split(/\s+/);
      const hostAlias = tokens[0];
      if (!hostAlias) continue;

      if (!groups[currentGroup].includes(hostAlias)) {
        groups[currentGroup].push(hostAlias);
      }
      if (!groups.all.includes(hostAlias)) {
        groups.all.push(hostAlias);
      }

      const vars = {};
      for (const tok of tokens.slice(1)) {
        const eq = tok.indexOf('=');
        if (eq !== -1) {
          vars[tok.slice(0, eq)] = tok.slice(eq + 1);
        }
      }
      hostVars[hostAlias] = vars;
    }

    return { groups, hostVars, path: resolved };
  }

  resolveTargets(pattern, inventory) {
    if (!pattern) return [];
    const selectors = pattern.split(',').map(s => s.trim()).filter(Boolean);
    const selected = [];
    for (const sel of selectors) {
      if (sel === 'all' || sel === '*') {
        for (const h of inventory.groups.all) {
          if (!selected.includes(h)) selected.push(h);
        }
      } else if (inventory.groups[sel]) {
        for (const h of inventory.groups[sel]) {
          if (!selected.includes(h)) selected.push(h);
        }
      } else if (inventory.groups.all.includes(sel)) {
        if (!selected.includes(sel)) selected.push(sel);
      }
    }
    return selected;
  }

  /**
   * Obtém estado de um nó conhecido ou cria mapeamento para IP/alias apontado ao nó correspondente.
   */
  getHostNode(hostName, inventory) {
    if (this.nodes[hostName]) return this.nodes[hostName];
    const vars = (inventory && inventory.hostVars && inventory.hostVars[hostName]) || {};
    const targetIp = vars.ansible_host || hostName;
    const matchByIp = Object.values(this.nodes).find(n => n.ip === targetIp);
    if (matchByIp) return matchByIp;
    return null;
  }

  parseKeyValueArgs(argStr) {
    const res = {};
    if (!argStr || typeof argStr !== 'string') return res;
    if (!argStr.includes('=')) {
      res._raw = argStr;
      return res;
    }
    const regex = /([A-Za-z_][A-Za-z0-9_]*)=("([^"]*)"|'([^']*)'|(\S+))/g;
    let m;
    let consumed = 0;
    while ((m = regex.exec(argStr)) !== null) {
      const val = m[3] !== undefined ? m[3] : (m[4] !== undefined ? m[4] : m[5]);
      res[m[1]] = val;
      consumed += m[0].length;
    }
    if (Object.keys(res).length === 0) {
      res._raw = argStr;
    }
    return res;
  }

  interpolateVars(val, vars) {
    if (typeof val === 'string') {
      return val.replace(/\{\{\s*([A-Za-z0-9_.]+)\s*\}\}/g, (m, key) => {
        if (Object.prototype.hasOwnProperty.call(vars, key)) return String(vars[key]);
        return m;
      });
    }
    if (Array.isArray(val)) return val.map(v => this.interpolateVars(v, vars));
    if (val && typeof val === 'object') {
      const out = {};
      for (const [k, v] of Object.entries(val)) {
        out[k] = this.interpolateVars(v, vars);
      }
      return out;
    }
    return val;
  }

  normalizeBool(v, def = false) {
    if (v === undefined || v === null) return def;
    if (typeof v === 'boolean') return v;
    const s = String(v).trim().toLowerCase();
    return s === 'yes' || s === 'true' || s === '1';
  }

  /**
   * Executa um único módulo Ansible contra um host específico respeitando idempotência e --check.
   */
  runModuleOnHost(hostAlias, moduleName, rawParams, opts = {}) {
    const { become = false, checkMode = false, inventory = null } = opts;
    const node = this.getHostNode(hostAlias, inventory);
    if (!node || !node.reachable) {
      return {
        unreachable: true,
        failed: false,
        changed: false,
        msg: `Failed to connect to the host via ssh: ssh: Could not resolve hostname ${hostAlias}`
      };
    }

    const mod = moduleName.replace(/^ansible\.builtin\./, '');
    const params = typeof rawParams === 'string'
      ? this.parseKeyValueArgs(rawParams)
      : { ...(rawParams || {}) };

    if (mod === 'ping') {
      return { changed: false, ping: 'pong' };
    }

    if (mod === 'setup') {
      const facts = {
        ansible_hostname: node.host,
        ansible_distribution: node.distribution,
        ansible_distribution_version: node.version,
        ansible_os_family: node.osFamily,
        ansible_default_ipv4: { address: node.ip },
        ansible_python_version: '3.10.12',
        ansible_memtotal_mb: node.host === 'db1' ? 4096 : 2048
      };
      if (params.filter && facts[params.filter] !== undefined) {
        return { changed: false, ansible_facts: { [params.filter]: facts[params.filter] } };
      }
      return { changed: false, ansible_facts: facts };
    }

    if (mod === 'debug') {
      const msg = params.msg !== undefined ? params.msg : (params.var !== undefined ? String(params.var) : 'Hello from Ansible!');
      return { changed: false, msg };
    }

    if (mod === 'command' || mod === 'shell') {
      const cmdText = params._raw || params.cmd || '';
      if (!cmdText.trim()) {
        return { failed: true, changed: false, msg: 'no command given' };
      }
      if (checkMode) {
        return { changed: false, skipped: true, msg: 'remote command skipped in check mode' };
      }
      const outs = [];
      for (const sub of cmdText.split('&&').map(s => s.trim()).filter(Boolean)) {
        if (sub === 'uptime') outs.push(' 10:45:00 up 12 days,  3:14,  1 user,  load average: 0.08, 0.05, 0.01');
        else if (sub.startsWith('df')) outs.push('/dev/sda1        50G   12G   38G  24% /');
        else if (sub === 'whoami') outs.push(become ? 'root' : 'ubuntu');
        else if (sub === 'hostname') outs.push(node.host);
        else if (sub.startsWith('echo ')) outs.push(sub.slice(5).replace(/^['"]|['"]$/g, ''));
        else outs.push(`[${node.host}] executed: ${sub}`);
      }
      return { changed: true, rc: 0, stdout: outs.join('\n') };
    }

    if (mod === 'apt') {
      if (!become) {
        return { failed: true, changed: false, msg: 'Permission denied (are you root? Use --become / become: yes)' };
      }
      const pkg = params.name || params.pkg;
      const state = params.state || 'present';
      if (!pkg) return { failed: true, changed: false, msg: 'missing required argument: name' };

      const pkgList = Array.isArray(pkg) ? pkg : [pkg];
      let anyChanged = false;
      for (const p of pkgList) {
        const hasPkg = node.packages.has(p);
        if (state === 'absent' || state === 'removed') {
          if (hasPkg) {
            anyChanged = true;
            if (!checkMode) {
              node.packages.delete(p);
              if (node.services[p]) node.services[p].active = false;
            }
          }
        } else {
          if (!hasPkg) {
            anyChanged = true;
            if (!checkMode) {
              node.packages.add(p);
              if (!node.services[p] && (p === 'nginx' || p === 'postgresql' || p === 'docker.io')) {
                node.services[p] = { active: false, enabled: false };
              }
            }
          }
        }
      }
      return { changed: anyChanged, cache_updated: false };
    }

    if (mod === 'service' || mod === 'systemd') {
      if (!become) {
        return { failed: true, changed: false, msg: 'Interactive authentication required. Use --become / become: yes' };
      }
      const svcName = (params.name || '').replace(/\.service$/, '');
      const state = params.state;
      const wantEnabled = params.enabled !== undefined ? this.normalizeBool(params.enabled) : null;
      if (!svcName) return { failed: true, changed: false, msg: 'missing required argument: name' };
      if (!node.packages.has(svcName) && !node.services[svcName]) {
        return { failed: true, changed: false, msg: `Could not find the requested service ${svcName}: host` };
      }
      const svc = node.services[svcName] || (node.services[svcName] = { active: false, enabled: false });
      let changed = false;

      if (state === 'started') {
        if (!svc.active) {
          changed = true;
          if (!checkMode) svc.active = true;
        }
      } else if (state === 'stopped') {
        if (svc.active) {
          changed = true;
          if (!checkMode) svc.active = false;
        }
      } else if (state === 'restarted' || state === 'reloaded') {
        changed = true;
        if (!checkMode) svc.active = true;
      }

      if (wantEnabled !== null && svc.enabled !== wantEnabled) {
        changed = true;
        if (!checkMode) svc.enabled = wantEnabled;
      }

      return { changed, name: svcName, state: state || (svc.active ? 'started' : 'stopped') };
    }

    if (mod === 'copy') {
      const dest = params.dest;
      const mode = params.mode || '0644';
      let newContent = params.content;
      if (newContent === undefined && params.src) {
        const srcNode = this.fs.getNode(params.src);
        if (!srcNode || srcNode.type !== 'file') {
          return { failed: true, changed: false, msg: `Could not find or access '${params.src}' on the Ansible Controller.` };
        }
        newContent = srcNode.content || '';
      }
      if (!dest || newContent === undefined) {
        return { failed: true, changed: false, msg: 'copy requires src/content and dest' };
      }
      if (!become && (dest.startsWith('/etc/') || dest.startsWith('/var/'))) {
        return { failed: true, changed: false, msg: `Destination ${dest} not writable (use --become)` };
      }

      const existing = node.files[dest];
      const before = existing ? existing.content : '';
      const changed = !existing || existing.content !== newContent || existing.mode !== mode;
      if (changed && !checkMode) {
        node.files[dest] = { content: newContent, mode };
      }
      return {
        changed,
        dest,
        diff: changed ? { before, after: newContent } : null
      };
    }

    if (mod === 'file') {
      const targetPath = params.path || params.dest;
      const state = params.state || 'file';
      const mode = params.mode || '0755';
      if (!targetPath) return { failed: true, changed: false, msg: 'missing required argument: path' };
      if (!become && (targetPath.startsWith('/etc/') || targetPath.startsWith('/var/'))) {
        return { failed: true, changed: false, msg: `Permission denied for ${targetPath} (use --become)` };
      }

      const exists = Boolean(node.files[targetPath]);
      if (state === 'absent') {
        if (exists && !checkMode) delete node.files[targetPath];
        return { changed: exists, path: targetPath, state: 'absent' };
      }
      if (!exists || node.files[targetPath].mode !== mode) {
        if (!checkMode) node.files[targetPath] = { content: state === 'directory' ? '[dir]' : (node.files[targetPath]?.content || ''), mode, isDir: state === 'directory' };
        return { changed: true, path: targetPath, state };
      }
      return { changed: false, path: targetPath, state };
    }

    if (mod === 'lineinfile') {
      const targetPath = params.path || params.dest;
      const line = params.line;
      const regexpStr = params.regexp;
      const state = params.state || 'present';
      const create = this.normalizeBool(params.create, true);
      if (!targetPath) return { failed: true, changed: false, msg: 'missing required argument: path' };
      if (!become && targetPath.startsWith('/etc/')) {
        return { failed: true, changed: false, msg: `Permission denied editing ${targetPath} (use --become)` };
      }

      const fileObj = node.files[targetPath];
      if (!fileObj && !create) {
        return { failed: true, changed: false, msg: `Destination ${targetPath} does not exist !` };
      }
      const before = fileObj ? fileObj.content : '';
      const lines = before ? before.replace(/\n$/, '').split('\n') : [];
      let changed = false;

      if (state === 'absent') {
        const filtered = lines.filter(l => (regexpStr ? !new RegExp(regexpStr).test(l) : l !== line));
        if (filtered.length !== lines.length) {
          changed = true;
          const after = filtered.join('\n') + (filtered.length ? '\n' : '');
          if (!checkMode) node.files[targetPath] = { content: after, mode: fileObj?.mode || '0644' };
          return { changed, diff: { before, after } };
        }
        return { changed: false };
      }

      if (line === undefined) return { failed: true, changed: false, msg: 'line is required with state=present' };
      if (lines.includes(line)) {
        return { changed: false };
      }

      changed = true;
      let nextLines;
      if (regexpStr && lines.some(l => new RegExp(regexpStr).test(l))) {
        nextLines = lines.map(l => (new RegExp(regexpStr).test(l) ? line : l));
      } else {
        nextLines = [...lines, line];
      }
      const after = nextLines.join('\n') + '\n';
      if (!checkMode) node.files[targetPath] = { content: after, mode: fileObj?.mode || '0644' };
      return { changed, msg: 'line added', diff: { before, after } };
    }

    if (mod === 'user') {
      if (!become) return { failed: true, changed: false, msg: 'Permission denied (use --become)' };
      const uName = params.name;
      const state = params.state || 'present';
      if (!uName) return { failed: true, changed: false, msg: 'missing required argument: name' };
      const hasUser = node.users.has(uName);
      if (state === 'absent') {
        if (hasUser && !checkMode) node.users.delete(uName);
        return { changed: hasUser, name: uName, state: 'absent' };
      }
      if (!hasUser) {
        if (!checkMode) node.users.add(uName);
        return { changed: true, name: uName, state: 'present' };
      }
      return { changed: false, name: uName, state: 'present' };
    }

    if (mod === 'ufw') {
      if (!become) return { failed: true, changed: false, msg: 'Permission denied (use --become)' };
      const rule = `${params.rule || 'allow'}:${params.port || params.name || '80'}`;
      if (!node.ufwRules.has(rule)) {
        if (!checkMode) node.ufwRules.add(rule);
        return { changed: true, msg: `Rule added (${rule})` };
      }
      return { changed: false, msg: `Skipping duplicate rule (${rule})` };
    }

    return { failed: true, changed: false, msg: `couldn't resolve module/action '${mod}'.` };
  }

  /**
   * Interpreta comandos ad-hoc `ansible <target> [opções]`
   */
  executeAdHoc(args) {
    if (!args || args.length === 0) {
      return {
        output: 'usage: ansible <host-pattern> [-i INVENTORY] [-m MODULE_NAME] [-a MODULE_ARGS] [-b] [-C]',
        type: 'error',
        code: 1
      };
    }

    let pattern = null;
    let invPath = null;
    let moduleName = 'command';
    let moduleArgs = '';
    let become = false;
    let checkMode = false;

    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if ((a === '-i' || a === '--inventory') && args[i + 1]) invPath = args[++i];
      else if ((a === '-m' || a === '--module-name') && args[i + 1]) moduleName = args[++i];
      else if ((a === '-a' || a === '--args') && args[i + 1] !== undefined) moduleArgs = args[++i];
      else if (a === '-b' || a === '--become') become = true;
      else if (a === '-C' || a === '--check') checkMode = true;
      else if (!a.startsWith('-') && !pattern) pattern = a;
    }

    if (!pattern) {
      return { output: 'ERROR! Missing target host pattern', type: 'error', code: 1 };
    }

    let inventory;
    try {
      inventory = this.parseInventory(invPath);
    } catch (err) {
      return { output: err.message, type: 'error', code: 4 };
    }

    const targets = this.resolveTargets(pattern, inventory);
    if (targets.length === 0) {
      return { output: `[WARNING]: No hosts matched, nothing to do`, code: 0 };
    }

    const outBlocks = [];
    let hasFailure = false;

    for (const h of targets) {
      const res = this.runModuleOnHost(h, moduleName, moduleArgs, { become, checkMode, inventory });
      if (res.unreachable) {
        hasFailure = true;
        outBlocks.push(`\x1b[31m${h} | UNREACHABLE! => ${JSON.stringify({ changed: false, msg: res.msg, unreachable: true }, null, 4)}\x1b[0m`);
      } else if (res.failed) {
        hasFailure = true;
        outBlocks.push(`\x1b[31m${h} | FAILED! => ${JSON.stringify(res, null, 4)}\x1b[0m`);
      } else if (moduleName === 'command' || moduleName === 'shell') {
        const label = res.changed ? '\x1b[33mCHANGED\x1b[0m' : '\x1b[32mSUCCESS\x1b[0m';
        outBlocks.push(`${h} | ${label} | rc=${res.rc ?? 0} >>\n${res.stdout || ''}`);
      } else if (res.changed) {
        outBlocks.push(`\x1b[33m${h} | CHANGED => ${JSON.stringify(res, null, 4)}\x1b[0m`);
      } else {
        outBlocks.push(`\x1b[32m${h} | SUCCESS => ${JSON.stringify(res, null, 4)}\x1b[0m`);
      }
    }

    this.lastCommand = { type: 'adhoc', pattern, moduleName, targets };
    this.lastCheckMode = checkMode;
    return { output: outBlocks.join('\n'), code: hasFailure ? 2 : 0, type: hasFailure ? 'error' : 'text' };
  }

  /**
   * Parser YAML didático para playbooks Ansible com 1 ou mais plays.
   */
  parseYamlPlaybook(yamlText) {
    const rawLines = (yamlText || '').split('\n');
    const lines = [];
    for (const raw of rawLines) {
      const noDoc = raw.replace(/\r$/, '');
      const trimmed = noDoc.trim();
      if (!trimmed || trimmed === '---' || trimmed === '...' || trimmed.startsWith('#')) continue;
      const indent = noDoc.search(/\S/);
      lines.push({ indent, text: trimmed });
    }

    const parseScalar = (s) => {
      const t = s.trim();
      if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
        return t.slice(1, -1);
      }
      if (t === 'true' || t === 'yes') return true;
      if (t === 'false' || t === 'no') return false;
      if (/^-?\d+$/.test(t)) return parseInt(t, 10);
      if (t.startsWith('[') && t.endsWith(']')) {
        return t.slice(1, -1).split(',').map(x => parseScalar(x)).filter(x => x !== '');
      }
      return t;
    };

    const plays = [];
    let i = 0;

    const parseBlockDict = (minIndent) => {
      const obj = {};
      while (i < lines.length && lines[i].indent >= minIndent && !lines[i].text.startsWith('- ')) {
        const { indent, text } = lines[i];
        const colIdx = text.indexOf(':');
        if (colIdx === -1) { i++; continue; }
        const k = text.slice(0, colIdx).trim();
        const rest = text.slice(colIdx + 1).trim();
        i++;
        if (rest === '') {
          if (i < lines.length && lines[i].indent > indent) {
            if (lines[i].text.startsWith('- ')) {
              obj[k] = parseList(lines[i].indent);
            } else {
              obj[k] = parseBlockDict(lines[i].indent);
            }
          } else {
            obj[k] = {};
          }
        } else {
          obj[k] = parseScalar(rest);
        }
      }
      return obj;
    };

    const parseList = (listIndent) => {
      const items = [];
      while (i < lines.length && lines[i].indent === listIndent && lines[i].text.startsWith('- ')) {
        const afterDash = lines[i].text.slice(2).trim();
        i++;
        const colIdx = afterDash.indexOf(':');
        if (colIdx === -1) {
          items.push(parseScalar(afterDash));
          continue;
        }
        const itemObj = {};
        const firstKey = afterDash.slice(0, colIdx).trim();
        const firstVal = afterDash.slice(colIdx + 1).trim();
        if (firstVal === '') {
          if (i < lines.length && lines[i].indent > listIndent) {
            itemObj[firstKey] = lines[i].text.startsWith('- ') ? parseList(lines[i].indent) : parseBlockDict(lines[i].indent);
          } else {
            itemObj[firstKey] = {};
          }
        } else {
          itemObj[firstKey] = parseScalar(firstVal);
        }
        if (i < lines.length && lines[i].indent > listIndent && !lines[i].text.startsWith('- ')) {
          Object.assign(itemObj, parseBlockDict(lines[i].indent));
        }
        items.push(itemObj);
      }
      return items;
    };

    while (i < lines.length) {
      if (lines[i].text.startsWith('- ')) {
        const parsed = parseList(lines[i].indent);
        plays.push(...parsed);
      } else {
        i++;
      }
    }

    return plays;
  }

  evalWhenCondition(expr, hostAlias, node, inventory, playVars) {
    if (!expr) return true;
    const raw = String(expr).trim();
    const inGroup = raw.match(/^inventory_hostname\s+in\s+groups\[['"]([^'"]+)['"]\]$/);
    if (inGroup) {
      const grpHosts = inventory.groups[inGroup[1]] || [];
      return grpHosts.includes(hostAlias);
    }
    const notInGroup = raw.match(/^inventory_hostname\s+not\s+in\s+groups\[['"]([^'"]+)['"]\]$/);
    if (notInGroup) {
      const grpHosts = inventory.groups[notInGroup[1]] || [];
      return !grpHosts.includes(hostAlias);
    }
    const eqMatch = raw.match(/^([A-Za-z0-9_]+)\s*(==|!=)\s*['"]?([^'"]+)['"]?$/);
    if (eqMatch) {
      const [, lhsKey, op, rhsVal] = eqMatch;
      const factsMap = {
        ansible_os_family: node.osFamily,
        ansible_distribution: node.distribution,
        inventory_hostname: hostAlias,
        ...playVars
      };
      const leftVal = factsMap[lhsKey] !== undefined ? String(factsMap[lhsKey]) : '';
      return op === '==' ? leftVal === rhsVal : leftVal !== rhsVal;
    }
    return true;
  }

  /**
   * Executa um Playbook YAML (`ansible-playbook playbook.yml [opções]`)
   */
  executePlaybook(args) {
    if (!args || args.length === 0) {
      return { output: 'usage: ansible-playbook [-i INVENTORY] [--check] [--diff] playbook.yml ...', type: 'error', code: 1 };
    }

    let playbookPath = null;
    let invPath = null;
    let checkMode = false;
    let diffMode = false;
    let syntaxCheck = false;
    const extraVars = {};

    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if ((a === '-i' || a === '--inventory') && args[i + 1]) invPath = args[++i];
      else if (a === '--check' || a === '-C') checkMode = true;
      else if (a === '--diff' || a === '-D') diffMode = true;
      else if (a === '--syntax-check') syntaxCheck = true;
      else if ((a === '-e' || a === '--extra-vars') && args[i + 1]) {
        const kv = this.parseKeyValueArgs(args[++i]);
        Object.assign(extraVars, kv);
      } else if (!a.startsWith('-') && !playbookPath) playbookPath = a;
    }

    if (!playbookPath) {
      return { output: 'ERROR! the playbook path was not specified.', type: 'error', code: 1 };
    }

    const pbNode = this.fs.getNode(playbookPath);
    if (!pbNode || pbNode.type !== 'file') {
      return { output: `ERROR! the playbook: ${playbookPath} could not be found`, type: 'error', code: 1 };
    }

    let inventory;
    try {
      inventory = this.parseInventory(invPath);
    } catch (err) {
      return { output: err.message, type: 'error', code: 4 };
    }

    let plays;
    try {
      plays = this.parseYamlPlaybook(pbNode.content || '');
      if (!plays || plays.length === 0) {
        return { output: `ERROR! Playbook '${playbookPath}' está vazio ou sem plays YAML válidos.`, type: 'error', code: 4 };
      }
    } catch (err) {
      return { output: `ERROR! Syntax Error while loading YAML: ${err.message}`, type: 'error', code: 4 };
    }

    if (syntaxCheck) {
      return { output: `playbook: ${playbookPath} (syntax OK)`, code: 0 };
    }

    const out = [];
    const recapByHost = {};
    const handlersTriggered = [];
    const knownDirectives = new Set(['name', 'become', 'when', 'loop', 'with_items', 'notify', 'register', 'vars']);

    for (const play of plays) {
      const playName = play.name || play.hosts || 'Unnamed play';
      const playHosts = this.resolveTargets(String(play.hosts || 'all'), inventory);
      const playBecome = this.normalizeBool(play.become, false);
      const playVars = { ...(play.vars || {}), ...extraVars };
      const handlerMap = {};
      for (const h of (play.handlers || [])) {
        if (h.name) handlerMap[h.name] = h;
      }

      out.push(`\nPLAY [${playName}] ************************************************************`);

      for (const h of playHosts) {
        if (!recapByHost[h]) recapByHost[h] = { ok: 0, changed: 0, unreachable: 0, failed: 0, skipped: 0 };
      }

      // Gathering Facts
      if (play.gather_facts !== false) {
        out.push(`\nTASK [Gathering Facts] *********************************************************`);
        for (const h of playHosts) {
          const n = this.getHostNode(h, inventory);
          if (!n || !n.reachable) {
            recapByHost[h].unreachable++;
            out.push(`\x1b[31mfatal: [${h}]: UNREACHABLE!\x1b[0m`);
          } else {
            recapByHost[h].ok++;
            out.push(`\x1b[32mok: [${h}]\x1b[0m`);
          }
        }
      }

      const notifiedHandlers = new Map(); // handlerName -> Set(hosts)

      for (const task of (play.tasks || [])) {
        const taskName = task.name || 'Unnamed task';
        const taskBecome = task.become !== undefined ? this.normalizeBool(task.become, playBecome) : playBecome;
        const modKey = Object.keys(task).find(k => !knownDirectives.has(k));
        if (!modKey) continue;

        out.push(`\nTASK [${taskName}] *********************************************************`);
        const loopItems = task.loop || task.with_items || [null];

        for (const h of playHosts) {
          if (recapByHost[h].unreachable > 0 || recapByHost[h].failed > 0) continue;
          const node = this.getHostNode(h, inventory);
          if (!node) {
            recapByHost[h].unreachable++;
            out.push(`\x1b[31mfatal: [${h}]: UNREACHABLE!\x1b[0m`);
            continue;
          }

          const hostVars = {
            ...playVars,
            inventory_hostname: h,
            ansible_os_family: node.osFamily,
            ansible_distribution: node.distribution
          };

          if (task.when && !this.evalWhenCondition(task.when, h, node, inventory, hostVars)) {
            recapByHost[h].skipped++;
            out.push(`\x1b[36mskipping: [${h}]\x1b[0m`);
            continue;
          }

          let hostChanged = false;
          let hostFailed = null;
          let lastDiff = null;
          let extraMsg = '';

          for (const item of loopItems) {
            const iterVars = item !== null ? { ...hostVars, item } : hostVars;
            const modParams = this.interpolateVars(task[modKey], iterVars);
            const res = this.runModuleOnHost(h, modKey, modParams, {
              become: taskBecome,
              checkMode,
              inventory
            });
            if (res.failed) {
              hostFailed = res.msg;
              break;
            }
            if (res.changed) hostChanged = true;
            if (res.diff) lastDiff = res.diff;
            if (modKey.includes('debug') && res.msg) extraMsg = ` => {"msg": "${res.msg}"}`;
          }

          if (hostFailed) {
            recapByHost[h].failed++;
            out.push(`\x1b[31mfatal: [${h}]: FAILED! => {"changed": false, "msg": ${JSON.stringify(hostFailed)}}\x1b[0m`);
          } else {
            if (diffMode && lastDiff) {
              out.push(`--- before: ${h}\n+++ after: ${h}\n\x1b[31m-${lastDiff.before.trimEnd()}\x1b[0m\n\x1b[32m+${lastDiff.after.trimEnd()}\x1b[0m`);
            }
            if (hostChanged) {
              recapByHost[h].changed++;
              recapByHost[h].ok++;
              out.push(`\x1b[33mchanged: [${h}]${extraMsg}\x1b[0m`);
              if (task.notify) {
                const notifyList = Array.isArray(task.notify) ? task.notify : [task.notify];
                for (const hn of notifyList) {
                  if (!notifiedHandlers.has(hn)) notifiedHandlers.set(hn, new Set());
                  notifiedHandlers.get(hn).add(h);
                }
              }
            } else {
              recapByHost[h].ok++;
              out.push(`\x1b[32mok: [${h}]${extraMsg}\x1b[0m`);
            }
          }
        }
      }

      // Run notified handlers
      for (const [hName, hHosts] of notifiedHandlers.entries()) {
        const handler = handlerMap[hName];
        if (!handler) continue;
        const modKey = Object.keys(handler).find(k => !knownDirectives.has(k));
        if (!modKey) continue;
        const hBecome = handler.become !== undefined ? this.normalizeBool(handler.become, playBecome) : playBecome;

        out.push(`\nRUNNING HANDLER [${hName}] ************************************************`);
        handlersTriggered.push(hName);
        for (const h of hHosts) {
          const modParams = this.interpolateVars(handler[modKey], { ...playVars, inventory_hostname: h });
          const res = this.runModuleOnHost(h, modKey, modParams, { become: hBecome, checkMode, inventory });
          if (res.failed) {
            recapByHost[h].failed++;
            out.push(`\x1b[31mfatal: [${h}]: FAILED! => {"msg": ${JSON.stringify(res.msg)}}\x1b[0m`);
          } else if (res.changed) {
            recapByHost[h].changed++;
            recapByHost[h].ok++;
            out.push(`\x1b[33mchanged: [${h}]\x1b[0m`);
          } else {
            recapByHost[h].ok++;
            out.push(`\x1b[32mok: [${h}]\x1b[0m`);
          }
        }
      }
    }

    out.push('\nPLAY RECAP *********************************************************************');
    let totalOk = 0;
    let totalChanged = 0;
    let totalFailed = 0;
    let totalSkipped = 0;

    for (const [h, st] of Object.entries(recapByHost)) {
      totalOk += st.ok;
      totalChanged += st.changed;
      totalFailed += st.failed;
      totalSkipped += st.skipped;
      const color = st.failed > 0 || st.unreachable > 0 ? '\x1b[31m' : (st.changed > 0 ? '\x1b[33m' : '\x1b[32m');
      out.push(
        `${color}${h.padEnd(26)}\x1b[0m : ok=${st.ok}    changed=${st.changed}    unreachable=${st.unreachable}    failed=${st.failed}    skipped=${st.skipped}`
      );
    }

    this.lastRecap = {
      playbook: playbookPath,
      checkMode,
      byHost: recapByHost,
      totalOk,
      totalChanged,
      totalFailed,
      totalSkipped,
      handlersTriggered
    };
    this.lastCheckMode = checkMode;
    this.lastCommand = { type: 'playbook', playbook: playbookPath, checkMode };
    this.playbookRuns.push(this.lastRecap);

    return {
      output: out.join('\n').trimStart(),
      code: totalFailed > 0 ? 2 : 0,
      type: totalFailed > 0 ? 'error' : 'text'
    };
  }
}

if (typeof window !== 'undefined') {
  window.AnsibleEngine = AnsibleEngine;
}
