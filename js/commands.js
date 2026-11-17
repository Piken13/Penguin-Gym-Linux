/**
 * Penguin Gym Linux - Command Execution Engine
 * Interpreta e executa comandos Linux com suporte completo a aspas, escapes,
 * pipes (|), redirecionamentos (<, > e >>) e integração com VirtualFS, Git, Docker e SQLite.
 */

class CommandEngine {
  constructor(fs, git, docker, sql, manPages, ansible) {
    this.fs = fs;
    this.git = git;
    this.docker = docker;
    this.sql = sql;
    this.ansible = ansible || (typeof AnsibleEngine !== 'undefined' ? new AnsibleEngine(this.fs) : null);
    this.history = [];
    this.resetEnvironment();
  }

  /**
   * Restaura variáveis, aliases, serviços, pacotes e estado do firewall para o padrão inicial
   */
  resetEnvironment(clearHistory = false) {
    if (clearHistory) this.history = [];
    if (this.ansible && typeof this.ansible.reset === 'function') this.ansible.reset();
    this.killedProcesses = new Set();
    this.backgroundJobs = [];
    this.nextJobPid = 501;
    this.lastExitCode = 0;
    this.shellPid = 42;
    this.envVars = {
      USER: 'user',
      LOGNAME: 'user',
      HOME: '/home/user',
      SHELL: '/bin/bash',
      PATH: '/usr/local/bin:/usr/bin:/bin',
      LANG: 'pt_BR.UTF-8',
      TERM: 'xterm-256color',
      HOSTNAME: 'penguin-gym',
      PS1: '\\u@\\h:\\w\\$ '
    };
    this.shellVars = { ...this.envVars };
    this.sessionStack = [];
    this.aliases = {
      ll: 'ls -la',
      la: 'ls -A',
      l: 'ls -CF'
    };
    this.services = {
      nginx: { active: true, enabled: true, pid: 123, desc: 'A high performance web server and a reverse proxy server' },
      ssh: { active: true, enabled: true, pid: 88, desc: 'OpenBSD Secure Shell server' },
      docker: { active: true, enabled: true, pid: 210, desc: 'Docker Application Container Engine' },
      cron: { active: true, enabled: true, pid: 74, desc: 'Regular background program processing daemon' },
      postgresql: { active: false, enabled: false, pid: 280, desc: 'PostgreSQL RDBMS' }
    };
    this.installedPackages = new Set([
      'bash', 'coreutils', 'grep', 'sed', 'gawk', 'findutils', 'tar', 'gzip',
      'zip', 'unzip', 'procps', 'psmisc', 'iproute2', 'net-tools', 'iputils-ping',
      'curl', 'wget', 'git', 'docker.io', 'sqlite3', 'nginx', 'openssh-client',
      'openssh-server', 'nano', 'man-db', 'ufw', 'sudo', 'systemd', 'cron'
    ]);
    this.ufwState = {
      enabled: false,
      rules: ['22/tcp                     ALLOW IN    Anywhere', '80/tcp                     ALLOW IN    Anywhere']
    };
    this.userCrontab = '# m h  dom mon dow   command\n0 3 * * * /usr/local/bin/backup.sh\n';
  }

  /**
   * Configura o estado inicial do CommandEngine esperado por missões específicas.
   */
  prepareForLesson(lessonId) {
    if (!lessonId) return;
    this.killedProcesses.clear();
    this.backgroundJobs = [];

    if (lessonId === 'process-ps-aux' || lessonId === 'process-ps-grep' || lessonId === 'process-pgrep' || lessonId === 'process-kill-sigterm' || lessonId === 'process-kill-sigkill' || lessonId === 'process-pkill') {
      this.services.nginx.active = true;
      this.services.ssh.active = true;
      this.services.cron.active = true;
      this.services.docker.active = true;
    }
    if (lessonId === 'bash-history-exec') {
      const lastCmd = this.history[this.history.length - 1];
      if (!lastCmd || lastCmd.startsWith('unalias') || lastCmd === '!!') {
        this.history.push('echo "Linux"');
      }
    }
    if (lessonId === 'bash-alias-remove') {
      this.aliases['c'] = 'clear';
    }
    if (lessonId === 'sys-apt-remove' || lessonId === 'sys-apt-purge') {
      this.installedPackages.add('cowsay');
      const prevSudo = this.fs.sudoMode;
      this.fs.sudoMode = true;
      try {
        if (!this.fs.getNode('/usr/bin/cowsay')) {
          this.fs.createFile('/usr/bin/cowsay', '#!/bin/sh\n# Binário do pacote cowsay\n', 'root', 'rwxr-xr-x');
        }
      } finally {
        this.fs.sudoMode = prevSudo;
      }
    }
    if (lessonId === 'sys-systemctl-stop' || lessonId === 'sys-systemctl-disable') {
      this.services.nginx.active = true;
      this.services.nginx.enabled = true;
    }
    if (lessonId === 'sys-systemctl-start' || lessonId === 'inc-postgresql-down') {
      this.services.postgresql.active = false;
      this.services.postgresql.enabled = false;
    }
    if (lessonId === 'sys-crontab-list' || lessonId === 'sys-crontab-remove' || lessonId === 'sys-crontab-edit' || lessonId === 'auto-bash-cron-schedule' || lessonId === 'auto-bash-boss-pipeline') {
      this.userCrontab = '# m h  dom mon dow   command\n0 3 * * * /usr/local/bin/backup.sh\n';
    }
    if (lessonId === 'auto-bash-service-watchdog') {
      this.services.nginx.active = false;
    }
    if (lessonId.startsWith('net-curl-') || lessonId === 'net-nc-port' || lessonId === 'net-ss-netstat' || lessonId === 'inc-nginx-404') {
      this.services.nginx.active = true;
      this.services.nginx.enabled = true;
      this.services.ssh.active = true;
      if (this.ufwState.enabled && !this.ufwState.rules.some(r => /^(80(\/tcp)?|http)\s+ALLOW/i.test(r.trim()))) {
        this.ufwState.rules.push('80/tcp                     ALLOW IN    Anywhere');
      }
    }
    if (lessonId === 'net-ufw-delete' || lessonId === 'net-ufw-disable') {
      this.ufwState.enabled = true;
      if (!this.ufwState.rules.some(r => r.startsWith('80/tcp'))) {
        this.ufwState.rules.push('80/tcp                     ALLOW IN    Anywhere');
      }
    }
  }

  /**
   * Obtém o valor de uma variável de ambiente ou especial do Bash ($USER, $PWD, $?, $$, etc.)
   */
  getVar(name) {
    if (name === '?') return String(this.lastExitCode);
    if (name === '$') return String(this.shellPid);
    if (name === 'PWD') return this.fs.currentPath;
    if (name === 'OLDPWD') return this.fs.oldPath || this.fs.currentPath;
    if (name === 'RANDOM') return String(Math.floor(Math.random() * 32768));
    if (name === 'UID' || name === 'EUID') return this.fs.sudoMode ? '0' : '1000';
    if (Object.prototype.hasOwnProperty.call(this.shellVars, name)) {
      return this.shellVars[name];
    }
    if (Object.prototype.hasOwnProperty.call(this.envVars, name)) {
      return this.envVars[name];
    }
    return '';
  }

  /**
   * Formata a string de prompt de acordo com a variável $PS1
   */
  formatPrompt() {
    const ps1 = this.envVars.PS1 !== undefined ? this.envVars.PS1 : '\\u@\\h:\\w\\$ ';
    const user = this.envVars.USER || (this.fs.sudoMode ? 'root' : 'penguin');
    const fullHost = this.envVars.HOSTNAME || 'penguin-gym';
    const host = fullHost.split('.')[0] === 'penguin-gym' ? 'gym' : fullHost.split('.')[0];
    const home = this.envVars.HOME || '/home/user';
    const path = this.fs.currentPath;

    let relPath = path;
    if (path === home) {
      relPath = '~';
    } else if (path.startsWith(home + '/')) {
      relPath = '~' + path.slice(home.length);
    }

    const baseDir = path === '/' ? '/' : path.split('/').filter(Boolean).pop() || '';
    const dirW = path === home ? '~' : (baseDir || '/');
    const sign = (user === 'root' || this.fs.sudoMode) ? '#' : '$';

    let result = '';
    let i = 0;
    while (i < ps1.length) {
      if (ps1[i] === '\\' && i + 1 < ps1.length) {
        let next = ps1[i + 1];
        if (next === '\\' && i + 2 < ps1.length && /[uhHwW$ne]/.test(ps1[i + 2])) {
          i++;
          next = ps1[i + 1];
        }
        if (next === 'u') { result += user; i += 2; continue; }
        if (next === 'h') { result += host; i += 2; continue; }
        if (next === 'H') { result += fullHost; i += 2; continue; }
        if (next === 'w') { result += relPath; i += 2; continue; }
        if (next === 'W') { result += dirW; i += 2; continue; }
        if (next === '$') { result += sign; i += 2; continue; }
        if (next === 'n') { result += '\n'; i += 2; continue; }
        if (next === 'e') { result += '\x1b'; i += 2; continue; }
        if (next === '\\') { result += '\\'; i += 2; continue; }
        result += next;
        i += 2;
        continue;
      }
      result += ps1[i];
      i++;
    }
    return result;
  }

  /**
   * Inicia uma sessão de usuário interativa (ex: sudo -i ou su)
   */
  enterUserSession(username, isLogin = false) {
    this.sessionStack.push({
      user: this.envVars.USER,
      home: this.envVars.HOME,
      sudoMode: this.fs.sudoMode,
      path: this.fs.currentPath
    });
    this.envVars.USER = username;
    this.shellVars.USER = username;
    const newHome = username === 'root' ? '/root' : `/home/${username}`;
    this.envVars.HOME = newHome;
    this.shellVars.HOME = newHome;
    this.fs.sudoMode = (username === 'root');
    if (isLogin) {
      this.fs.currentPath = newHome;
    }
    return { output: '', code: 0, sessionChange: true };
  }

  /**
   * Restaura a sessão para o usuário padrão (penguin / user) ao trocar ou reiniciar lição
   */
  resetSessionToDefaultUser() {
    this.sessionStack = [];
    this.envVars.USER = 'user';
    this.shellVars.USER = 'user';
    this.envVars.HOME = '/home/user';
    this.shellVars.HOME = '/home/user';
    this.fs.sudoMode = false;
  }

  /**
   * Expande referências de histórico do Bash: !!, !n, !-n fora de aspas simples
   */
  expandHistory(line) {
    let result = '';
    let inSingleQuote = false;
    let expanded = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '\\' && i + 1 < line.length && !inSingleQuote) {
        result += ch + line[i + 1];
        i++;
        continue;
      }
      if (ch === "'") {
        inSingleQuote = !inSingleQuote;
        result += ch;
        continue;
      }
      if (!inSingleQuote && ch === '!') {
        // !! -> último comando
        if (line[i + 1] === '!') {
          if (this.history.length === 0) {
            return { error: 'bash: !!: evento não encontrado' };
          }
          result += this.history[this.history.length - 1];
          expanded = true;
          i++;
          continue;
        }
        // !n ou !-n
        const numMatch = line.slice(i + 1).match(/^(-?\d+)/);
        if (numMatch) {
          const numStr = numMatch[1];
          const n = parseInt(numStr, 10);
          const idx = n < 0 ? this.history.length + n : n - 1;
          if (idx < 0 || idx >= this.history.length) {
            return { error: `bash: !${numStr}: evento não encontrado` };
          }
          result += this.history[idx];
          expanded = true;
          i += numStr.length;
          continue;
        }
      }
      result += ch;
    }

    return { line: result, expanded };
  }

  executeLine(line, isSubshell = false) {
    line = (line || '').trim();
    if (!line) return { output: '', code: 0 };

    const originalCommand = line;
    let historyEcho = null;
    let wasHistoryExpansion = false;
    if (!isSubshell) {
      const histRes = this.expandHistory(line);
      if (histRes.error) {
        this.lastExitCode = 1;
        return { output: histRes.error, code: 1, type: 'error', rawCommand: originalCommand };
      }
      if (histRes.expanded) {
        line = histRes.line;
        historyEcho = line;
        wasHistoryExpansion = true;
      }
      this.history.push(line);
    }

    const parts = this.splitSequential(line);
    const combinedOutput = [];
    if (historyEcho) combinedOutput.push(historyEcho);

    let lastCode = 0;
    let lastType = 'text';
    let historyCleared = false;
    let wasSubshell = false;
    let subshellInner = null;

    for (let i = 0; i < parts.length; i++) {
      const item = parts[i];
      if (i > 0) {
        const prevOp = parts[i - 1].nextOp;
        if (prevOp === '&&' && lastCode !== 0) continue;
        if (prevOp === '||' && lastCode === 0) continue;
      }

      if (!isSubshell && item.nextOp === '&') {
        const jobId = this.backgroundJobs.length + 1;
        const jobPid = this.nextJobPid++;
        this.backgroundJobs.push({ id: jobId, pid: String(jobPid), cmd: item.cmd, state: 'Em execução' });
        combinedOutput.push(`[${jobId}] ${jobPid}`);
        lastCode = 0;
        lastType = 'text';
        this.lastExitCode = 0;
        continue;
      }

      const res = this.executeSinglePipeline(item.cmd);
      if (res.output) combinedOutput.push(res.output);
      if (res.historyCleared) historyCleared = true;
      if (res.wasSubshell) {
        wasSubshell = true;
        subshellInner = res.subshellInner;
      }
      lastCode = res.code !== undefined ? res.code : (res.type === 'error' ? 1 : 0);
      lastType = res.type || 'text';
      this.lastExitCode = lastCode;

      if (res.action || res.sessionChange) {
        return res;
      }
    }

    return {
      output: combinedOutput.join('\n'),
      code: lastCode,
      type: lastCode !== 0 && lastType === 'error' ? 'error' : 'text',
      expandedCommand: historyEcho,
      rawCommand: originalCommand,
      wasHistoryExpansion,
      wasSubshell,
      subshellInner,
      historyCleared
    };
  }

  /**
   * Executa um comando dentro de $(...) ou `...` sem poluir o history
   */
  executeSubshell(subCmd) {
    const savedExit = this.lastExitCode;
    const res = this.executeLine(subCmd, true);
    this.lastExitCode = res.code !== undefined ? res.code : savedExit;
    return (res.output || '').replace(/\n+$/, '');
  }

  /**
   * Divide comandos por ';', '&&', '||' ou '&' APENAS fora de aspas, fora de (...) e fora de blocos for/if/while
   */
  splitSequential(str) {
    const parts = [];
    let curr = '';
    let inQuote = null;
    let parenDepth = 0;
    let blockDepth = 0;
    let atCommandPos = true;

    const checkKeywordAt = (idx) => {
      const prevCh = idx > 0 ? str[idx - 1] : ';';
      if (!/[\s;&|(){}]/.test(prevCh)) return null;
      const rest = str.slice(idx);
      const m = rest.match(/^(for|while|until|if|then|do|else|elif|done|fi)(?=[\s;&|()]|$)/);
      return m ? m[1] : null;
    };

    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === '\\' && i + 1 < str.length && inQuote !== "'") {
        curr += ch + str[i + 1];
        i++;
        atCommandPos = false;
        continue;
      }
      if (ch === '"' || ch === "'") {
        if (inQuote === ch) inQuote = null;
        else if (!inQuote) inQuote = ch;
        curr += ch;
        atCommandPos = false;
        continue;
      }
      if (!inQuote) {
        if (ch === '(') {
          parenDepth++;
          curr += ch;
          atCommandPos = true;
          continue;
        }
        if (ch === ')' && parenDepth > 0) {
          parenDepth--;
          curr += ch;
          atCommandPos = false;
          continue;
        }
        if (parenDepth === 0) {
          const kw = checkKeywordAt(i);
          if (kw && atCommandPos) {
            if (kw === 'for' || kw === 'while' || kw === 'until' || kw === 'if') {
              blockDepth++;
              atCommandPos = false;
              curr += kw;
              i += kw.length - 1;
              continue;
            }
            if ((kw === 'then' || kw === 'do' || kw === 'else' || kw === 'elif') && blockDepth > 0) {
              atCommandPos = true;
              curr += kw;
              i += kw.length - 1;
              continue;
            }
            if ((kw === 'done' || kw === 'fi') && blockDepth > 0) {
              blockDepth--;
              atCommandPos = false;
              curr += kw;
              i += kw.length - 1;
              continue;
            }
          }
        }
      }
      if (!inQuote && parenDepth === 0 && blockDepth === 0) {
        if (ch === '&' && str[i + 1] === '&') {
          if (curr.trim()) parts.push({ cmd: curr.trim(), nextOp: '&&' });
          curr = '';
          i++;
          atCommandPos = true;
          continue;
        }
        if (ch === '|' && str[i + 1] === '|') {
          if (curr.trim()) parts.push({ cmd: curr.trim(), nextOp: '||' });
          curr = '';
          i++;
          atCommandPos = true;
          continue;
        }
        if (ch === '&' && str[i + 1] !== '>' && (i === 0 || str[i - 1] !== '>')) {
          if (curr.trim()) parts.push({ cmd: curr.trim(), nextOp: '&' });
          curr = '';
          atCommandPos = true;
          continue;
        }
        if (ch === ';' || ch === '\n') {
          if (curr.trim()) parts.push({ cmd: curr.trim(), nextOp: ';' });
          curr = '';
          atCommandPos = true;
          continue;
        }
      }
      if (!inQuote && parenDepth === 0 && blockDepth > 0 && (ch === ';' || ch === '\n')) {
        atCommandPos = true;
      } else if (!inQuote && /\s/.test(ch)) {
        // Keep atCommandPos if still before any non-whitespace command word
      } else {
        atCommandPos = false;
      }
      curr += ch;
    }
    if (curr.trim()) parts.push({ cmd: curr.trim(), nextOp: null });
    return parts;
  }

  /**
   * Executa estruturas de controle Bash (subshells (...), for ... do ... done, if ... then ... fi)
   */
  executeControlStructure(stmt) {
    const trimmed = stmt.trim();

    // 1. Subshell isolado: ( ... )
    if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
      const inner = trimmed.slice(1, -1).trim();
      const savedPath = this.fs.currentPath;
      const savedOld = this.fs.oldPath;
      const savedVars = { ...this.shellVars };
      const savedEnv = { ...this.envVars };
      const savedAliases = { ...this.aliases };
      try {
        const subRes = this.executeLine(inner, true);
        return {
          ...subRes,
          wasSubshell: true,
          subshellInner: inner,
          subshellSavedPath: savedPath
        };
      } finally {
        this.fs.currentPath = savedPath;
        this.fs.oldPath = savedOld;
        this.shellVars = savedVars;
        this.envVars = savedEnv;
        this.aliases = savedAliases;
      }
    }

    // 2. Laço for: for VAR in LISTA; do COMANDOS; done
    const forMatch = trimmed.match(/^for\s+([A-Za-z_][A-Za-z0-9_]*)\s+in\s+(.*?)(?:;|\n)\s*do(?:\s+|;|\n)(.*?)(?:;|\n|\s)\s*done$/s);
    if (forMatch) {
      const varName = forMatch[1];
      const listExpr = forMatch[2].trim();
      const bodyCmd = forMatch[3].trim();
      const items = this.tokenizeAndExpand(listExpr);
      const outputs = [];
      let lastCode = 0;
      for (const item of items) {
        this.shellVars[varName] = item;
        if (Object.prototype.hasOwnProperty.call(this.envVars, varName)) {
          this.envVars[varName] = item;
        }
        const res = this.executeLine(bodyCmd, true);
        if (res.output) outputs.push(res.output);
        lastCode = res.code || 0;
      }
      return { output: outputs.join('\n'), code: lastCode };
    }

    // 3. Condicional if: if COND; then CMD1; [elif COND2; then CMD2;]* [else CMD3;] fi
    if (/^if(?=\s|;|\n|$)/.test(trimmed)) {
      const splitIfBranches = (src) => {
        let inQ = null;
        let depth = 0;
        let pDepth = 0;
        const hits = [];
        for (let i = 0; i < src.length; i++) {
          const ch = src[i];
          if (ch === '\\' && i + 1 < src.length && inQ !== "'") { i++; continue; }
          if (ch === '"' || ch === "'") { inQ = inQ === ch ? null : (inQ || ch); continue; }
          if (inQ) continue;
          if (ch === '(') { pDepth++; continue; }
          if (ch === ')' && pDepth > 0) { pDepth--; continue; }
          if (pDepth !== 0) continue;
          const prev = i === 0 ? ';' : src[i - 1];
          if (!/[\s;\n]/.test(prev)) continue;
          const m = src.slice(i).match(/^(if|for|while|until|then|elif|else|fi|done)(?=[\s;\n]|$)/);
          if (!m) continue;
          const kw = m[1];
          if (kw === 'if' || kw === 'for' || kw === 'while' || kw === 'until') {
            if (kw === 'if' && depth === 0) hits.push({ kw: 'if', start: i, end: i + kw.length });
            depth++;
          } else if (kw === 'fi' || kw === 'done') {
            depth--;
            if (kw === 'fi' && depth === 0) hits.push({ kw: 'fi', start: i, end: i + kw.length });
          } else if (depth === 1 && (kw === 'then' || kw === 'elif' || kw === 'else')) {
            hits.push({ kw, start: i, end: i + kw.length });
          }
          i += kw.length - 1;
        }
        return hits;
      };

      const hits = splitIfBranches(trimmed);
      const fiHit = hits[hits.length - 1];
      if (hits.length >= 3 && hits[0].kw === 'if' && fiHit && fiHit.kw === 'fi') {
        const branches = [];
        let curCond = null;
        let curThenIdx = null;
        for (let idx = 0; idx < hits.length; idx++) {
          const h = hits[idx];
          if (h.kw === 'if' || h.kw === 'elif') {
            const nextThen = hits[idx + 1];
            if (!nextThen || nextThen.kw !== 'then') break;
            curCond = trimmed.slice(h.end, nextThen.start).replace(/^[;\s]+|[;\s]+$/g, '');
            curThenIdx = nextThen.end;
          } else if (h.kw === 'then') {
            const nextSep = hits[idx + 1];
            const bodyEnd = nextSep ? nextSep.start : fiHit.start;
            branches.push({ cond: curCond, body: trimmed.slice(curThenIdx, bodyEnd).replace(/^[;\s]+|[;\s]+$/g, '') });
          } else if (h.kw === 'else') {
            branches.push({ cond: null, body: trimmed.slice(h.end, fiHit.start).replace(/^[;\s]+|[;\s]+$/g, '') });
          }
        }
        for (const br of branches) {
          if (br.cond === null || this.executeLine(br.cond, true).code === 0) {
            return br.body ? this.executeLine(br.body, true) : { output: '', code: 0 };
          }
        }
        return { output: '', code: 0 };
      }
    }

    return null;
  }

  executeSinglePipeline(pipeline) {
    const ctrlRes = this.executeControlStructure(pipeline);
    if (ctrlRes !== null) {
      this.lastExitCode = ctrlRes.code !== undefined ? ctrlRes.code : 0;
      return ctrlRes;
    }

    const segments = this.splitPipes(pipeline);
    let currentInput = '';
    let lastRes = { output: '', code: 0 };

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i].trim();
      lastRes = this.executeSingleCommandWithRedirection(seg, currentInput);
      const out = lastRes.output || '';
      currentInput = out && lastRes.trailingNewline !== false && !out.endsWith('\n') ? out + '\n' : out;
      this.lastExitCode = lastRes.code !== undefined ? lastRes.code : 0;
      if (lastRes.action) {
        if (lastRes.action === 'less' && i < segments.length - 1) {
          delete lastRes.action;
        } else {
          return lastRes;
        }
      }
    }

    return lastRes;
  }

  splitPipes(str) {
    const parts = [];
    let curr = '';
    let inQuote = null;
    let parenDepth = 0;

    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === '\\' && i + 1 < str.length) {
        curr += ch + str[i + 1];
        i++;
        continue;
      }
      if (ch === '"' || ch === "'") {
        inQuote = inQuote === ch ? null : (inQuote || ch);
        curr += ch;
      } else if (inQuote !== "'" && ch === '$' && str[i + 1] === '(') {
        parenDepth++;
        curr += '$(';
        i++;
      } else if (inQuote !== "'" && ch === ')' && parenDepth > 0) {
        parenDepth--;
        curr += ch;
      } else if (ch === '|' && !inQuote && parenDepth === 0) {
        parts.push(curr);
        curr = '';
      } else {
        curr += ch;
      }
    }
    if (curr) parts.push(curr);
    return parts;
  }

  /**
   * Expande aliases no primeiro token (e após sudo)
   */
  expandAliases(cmdStr, seen = new Set()) {
    const trimmed = cmdStr.trimStart();
    if (!trimmed) return cmdStr;
    const match = trimmed.match(/^([A-Za-z0-9_.-]+)(\s+.*|$)/s);
    if (!match) return cmdStr;

    const firstWord = match[1];
    const rest = match[2] || '';

    if (firstWord === 'sudo' && rest.trim()) {
      return 'sudo ' + this.expandAliases(rest.trimStart(), seen);
    }

    if (Object.prototype.hasOwnProperty.call(this.aliases, firstWord) && !seen.has(firstWord)) {
      seen.add(firstWord);
      const replacement = this.aliases[firstWord];
      return this.expandAliases(replacement + rest, seen);
    }

    return cmdStr;
  }

  /**
   * Analisa redirecionamentos (<, <<<, <<, >, >>, 2>, 2>>, &>, 2>&1) fora de aspas e fora de $(...)
   */
  parseRedirections(cmdStr) {
    let inQuote = null;
    let parenDepth = 0;
    let redirectOutMode = null;
    let targetOutFile = null;
    let redirectErrMode = null;
    let targetErrFile = null;
    let mergeErrToOut = false;
    let targetInFile = null;
    let hereString = null;
    let cleanCmd = '';

    const readNextToken = (startIdx) => {
      let j = startIdx;
      while (j < cmdStr.length && /\s/.test(cmdStr[j])) j++;
      let tokRaw = '';
      let q = null;
      let pDepth = 0;
      while (j < cmdStr.length) {
        const c = cmdStr[j];
        if (c === '\\' && j + 1 < cmdStr.length && q !== "'") {
          tokRaw += c + cmdStr[j + 1];
          j += 2;
          continue;
        }
        if (c === '"' || c === "'") {
          q = q === c ? null : (q || c);
          tokRaw += c;
          j++;
          continue;
        }
        if (q !== "'") {
          if (c === '$' && cmdStr[j + 1] === '(') {
            pDepth++;
            tokRaw += '$(';
            j += 2;
            continue;
          }
          if (pDepth > 0 && c === '(') {
            pDepth++;
            tokRaw += c;
            j++;
            continue;
          }
          if (pDepth > 0 && c === ')') {
            pDepth--;
            tokRaw += c;
            j++;
            continue;
          }
        }
        if (!q && pDepth === 0 && (/\s/.test(c) || c === '>' || c === '<' || c === ';' || c === '|')) {
          break;
        }
        tokRaw += c;
        j++;
      }
      const expanded = this.tokenizeAndExpand(tokRaw);
      return { value: expanded[0] !== undefined ? expanded[0] : '', nextIdx: j - 1 };
    };

    for (let i = 0; i < cmdStr.length; i++) {
      const ch = cmdStr[i];
      if (ch === '\\' && i + 1 < cmdStr.length) {
        cleanCmd += ch + cmdStr[i + 1];
        i++;
        continue;
      }
      if (ch === '"' || ch === "'") {
        inQuote = inQuote === ch ? null : (inQuote || ch);
        cleanCmd += ch;
        continue;
      }
      if (inQuote !== "'" && ch === '$' && cmdStr[i + 1] === '(') {
        parenDepth++;
        cleanCmd += '$(';
        i++;
        continue;
      }
      if (inQuote !== "'" && ch === ')' && parenDepth > 0) {
        parenDepth--;
        cleanCmd += ch;
        continue;
      }

      if (!inQuote && parenDepth === 0) {
        // 2>&1
        if (cmdStr.slice(i, i + 4) === '2>&1' && (i === 0 || /\s/.test(cmdStr[i - 1]))) {
          mergeErrToOut = true;
          i += 3;
          continue;
        }
        // &>> ou &>
        if (ch === '&' && cmdStr[i + 1] === '>') {
          const isApp = cmdStr[i + 2] === '>';
          const opLen = isApp ? 3 : 2;
          const { value, nextIdx } = readNextToken(i + opLen);
          redirectOutMode = isApp ? '>>' : '>';
          targetOutFile = value;
          redirectErrMode = isApp ? '>>' : '>';
          targetErrFile = value;
          mergeErrToOut = true;
          i = nextIdx;
          continue;
        }
        // 2>> ou 2>
        if (ch === '2' && cmdStr[i + 1] === '>' && (i === 0 || /\s/.test(cmdStr[i - 1]))) {
          const isApp = cmdStr[i + 2] === '>';
          const opLen = isApp ? 3 : 2;
          const { value, nextIdx } = readNextToken(i + opLen);
          redirectErrMode = isApp ? '>>' : '>';
          targetErrFile = value;
          i = nextIdx;
          continue;
        }
        // 1>> ou 1>
        if (ch === '1' && cmdStr[i + 1] === '>' && (i === 0 || /\s/.test(cmdStr[i - 1]))) {
          const isApp = cmdStr[i + 2] === '>';
          const opLen = isApp ? 3 : 2;
          const { value, nextIdx } = readNextToken(i + opLen);
          redirectOutMode = isApp ? '>>' : '>';
          targetOutFile = value;
          i = nextIdx;
          continue;
        }
        // >> ou >
        if (ch === '>') {
          const isApp = cmdStr[i + 1] === '>';
          const opLen = isApp ? 2 : 1;
          const { value, nextIdx } = readNextToken(i + opLen);
          redirectOutMode = isApp ? '>>' : '>';
          targetOutFile = value;
          i = nextIdx;
          continue;
        }
        // <<< (Here-String)
        if (cmdStr.slice(i, i + 3) === '<<<') {
          const { value, nextIdx } = readNextToken(i + 3);
          hereString = value;
          i = nextIdx;
          continue;
        }
        // << (Here-Doc inline)
        if (cmdStr.slice(i, i + 2) === '<<') {
          const { value, nextIdx } = readNextToken(i + 2);
          hereString = value;
          i = nextIdx;
          continue;
        }
        // <
        if (ch === '<') {
          const { value, nextIdx } = readNextToken(i + 1);
          targetInFile = value;
          i = nextIdx;
          continue;
        }
      }
      cleanCmd += ch;
    }

    return {
      baseCmd: cleanCmd.trim(),
      redirectOutMode,
      targetOutFile,
      redirectErrMode,
      targetErrFile,
      mergeErrToOut,
      targetInFile,
      hereString
    };
  }

  /**
   * Avalia expressão aritmética do Bash $(( ... ))
   */
  evalArithmetic(expr) {
    let expanded = this.expandVarsAndSubshells(expr);
    expanded = expanded.replace(/\b([A-Za-z_][A-Za-z0-9_]*)\b/g, (_, varName) => {
      const val = this.getVar(varName);
      const num = parseInt(val, 10);
      return Number.isNaN(num) ? '0' : String(num);
    });
    if (!/^[0-9+\-*/%()><=!&|\s]+$/.test(expanded)) {
      return '0';
    }
    try {
      const res = Function(`"use strict"; return Math.trunc(${expanded});`)();
      return Number.isFinite(res) ? String(res) : '0';
    } catch {
      return '0';
    }
  }

  /**
   * Expande $VAR, ${VAR}, $?, $$, $(comando) e `comando` em um texto
   */
  expandVarsAndSubshells(text) {
    if (!text) return '';
    let out = '';
    let i = 0;

    while (i < text.length) {
      const ch = text[i];

      // Backtick command substitution `...`
      if (ch === '`') {
        const endIdx = text.indexOf('`', i + 1);
        if (endIdx !== -1) {
          const subCmd = text.slice(i + 1, endIdx);
          out += this.executeSubshell(subCmd);
          i = endIdx + 1;
          continue;
        }
      }

      if (ch === '$') {
        // Arithmetic expansion $((...))
        if (text[i + 1] === '(' && text[i + 2] === '(') {
          const endArith = text.indexOf('))', i + 3);
          if (endArith !== -1) {
            const expr = text.slice(i + 3, endArith);
            out += this.evalArithmetic(expr);
            i = endArith + 2;
            continue;
          }
        }

        // Command substitution $(...)
        if (text[i + 1] === '(') {
          let depth = 1;
          let j = i + 2;
          let inQ = null;
          while (j < text.length && depth > 0) {
            if (text[j] === '\\' && j + 1 < text.length) {
              j += 2;
              continue;
            }
            if (text[j] === '"' || text[j] === "'") {
              inQ = inQ === text[j] ? null : (inQ || text[j]);
            } else if (!inQ) {
              if (text[j] === '(') depth++;
              else if (text[j] === ')') depth--;
            }
            if (depth > 0) j++;
          }
          if (depth === 0) {
            const subCmd = text.slice(i + 2, j);
            out += this.executeSubshell(subCmd);
            i = j + 1;
            continue;
          }
        }

        // ${VAR}
        if (text[i + 1] === '{') {
          const endBrace = text.indexOf('}', i + 2);
          if (endBrace !== -1) {
            const varName = text.slice(i + 2, endBrace);
            out += this.getVar(varName);
            i = endBrace + 1;
            continue;
          }
        }

        // $?, $$, $#, $@ ou parâmetros posicionais $1..$9
        if (text[i + 1] === '?' || text[i + 1] === '$' || text[i + 1] === '#' || text[i + 1] === '@' || /^[0-9]/.test(text[i + 1])) {
          out += this.getVar(text[i + 1]);
          i += 2;
          continue;
        }

        // $VAR_NAME
        const match = text.slice(i + 1).match(/^([A-Za-z_][A-Za-z0-9_]*)/);
        if (match) {
          const varName = match[1];
          out += this.getVar(varName);
          i += 1 + varName.length;
          continue;
        }
      }

      out += ch;
      i++;
    }

    return out;
  }

  /**
   * Tokeniza preservando metadados de aspas por segmento para permitir:
   * - Brace expansion {a,b} apenas fora de aspas
   * - Expansão de variáveis/subshells fora de aspas simples
   * - Globbing (* e ?) apenas fora de aspas
   */
  tokenizeRaw(str) {
    const tokens = [];
    let currentSegments = [];
    let currText = '';
    let inQuote = null;
    let parenDepth = 0;

    const flushSegment = (forceEmpty = false) => {
      if (currText.length > 0 || forceEmpty) {
        currentSegments.push({ text: currText, quote: inQuote });
        currText = '';
      }
    };

    const flushToken = () => {
      flushSegment(false);
      if (currentSegments.length > 0) {
        tokens.push(currentSegments);
        currentSegments = [];
      }
    };

    for (let i = 0; i < str.length; i++) {
      const ch = str[i];

      if (ch === '\\' && i + 1 < str.length && inQuote !== "'") {
        const nextCh = str[i + 1];
        // Se escapou um caractere curinga fora de aspas, guarda como segmento quotado para não sofrer globbing
        if (!inQuote && /[*?\[{}\s~$]/.test(nextCh)) {
          flushSegment(false);
          currentSegments.push({ text: nextCh, quote: "'" });
        } else if (inQuote === '"' && !/[$`"\\]/.test(nextCh)) {
          currText += '\\' + nextCh;
        } else {
          currText += nextCh;
        }
        i++;
        continue;
      }

      if (inQuote !== "'" && ch === '$' && str[i + 1] === '(') {
        if (str[i + 2] === '(') {
          parenDepth += 2;
          currText += '$((';
          i += 2;
          continue;
        }
        parenDepth++;
        currText += '$(';
        i++;
        continue;
      }

      if (inQuote !== "'" && parenDepth > 0 && ch === '(') {
        parenDepth++;
        currText += ch;
        continue;
      }

      if (inQuote !== "'" && ch === ')' && parenDepth > 0) {
        parenDepth--;
        currText += ch;
        continue;
      }

      if ((ch === '"' || ch === "'") && parenDepth === 0) {
        if (inQuote === ch) {
          flushSegment(true);
          inQuote = null;
        } else if (!inQuote) {
          flushSegment(false);
          inQuote = ch;
        } else {
          currText += ch;
        }
      } else if (/\s/.test(ch) && !inQuote && parenDepth === 0) {
        flushToken();
      } else {
        currText += ch;
      }
    }

    flushToken();
    return tokens;
  }

  /**
   * Expande chaves estilo Bash: projeto/{src,bin,doc} ou arq{1..3}.txt
   */
  expandBraceString(str) {
    // Encontra o primeiro par { ... } válido
    const match = str.match(/\{([^{}]+)\}/);
    if (!match) return [str];

    const inner = match[1];
    const prefix = str.slice(0, match.index);
    const suffix = str.slice(match.index + match[0].length);

    let items = null;
    if (inner.includes(',')) {
      items = inner.split(',');
    } else {
      const rangeMatch = inner.match(/^(-?\d+)\.\.(-?\d+)$/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1], 10);
        const end = parseInt(rangeMatch[2], 10);
        const step = start <= end ? 1 : -1;
        if (Math.abs(end - start) <= 100) {
          items = [];
          for (let n = start; step > 0 ? n <= end : n >= end; n += step) {
            items.push(String(n));
          }
        }
      } else {
        const charRange = inner.match(/^([a-zA-Z])\.\.([a-zA-Z])$/);
        if (charRange) {
          const startCode = charRange[1].charCodeAt(0);
          const endCode = charRange[2].charCodeAt(0);
          const step = startCode <= endCode ? 1 : -1;
          if (Math.abs(endCode - startCode) <= 52) {
            items = [];
            for (let c = startCode; step > 0 ? c <= endCode : c >= endCode; c += step) {
              items.push(String.fromCharCode(c));
            }
          }
        }
      }
    }

    if (!items) return [str];

    const results = [];
    for (const item of items) {
      for (const expanded of this.expandBraceString(prefix + item + suffix)) {
        results.push(expanded);
      }
    }
    return results;
  }

  /**
   * Tokeniza e aplica todas as expansões do Bash:
   * 1. Brace expansion ({a,b}, {1..3})
   * 2. Tilde expansion (~)
   * 3. Parameter & Command substitution ($VAR, ${VAR}, $(cmd))
   * 4. Pathname expansion / Globbing (*.txt, documents/*, doc?.txt)
   */
  tokenizeAndExpand(str) {
    const rawTokens = this.tokenizeRaw(str);
    const braceExpandedTokens = [];

    for (const segs of rawTokens) {
      const isAllUnquoted = segs.every(s => s.quote === null);
      const joinedRaw = segs.map(s => s.text).join('');
      if (isAllUnquoted && /\{[^{}]*(,|\.\.)[^{}]*\}/.test(joinedRaw)) {
        const expandedStrings = this.expandBraceString(joinedRaw);
        for (const s of expandedStrings) {
          braceExpandedTokens.push([{ text: s, quote: null }]);
        }
      } else {
        braceExpandedTokens.push(segs);
      }
    }

    const finalTokens = [];
    for (let tIdx = 0; tIdx < braceExpandedTokens.length; tIdx++) {
      const segs = braceExpandedTokens[tIdx];
      let combined = '';
      let hasUnquotedWildcard = false;
      let hasUnquotedSubstOrVar = false;

      for (let sIdx = 0; sIdx < segs.length; sIdx++) {
        const seg = segs[sIdx];
        let text = seg.text;

        if (seg.quote === null) {
          if (sIdx === 0 && (text === '~' || text.startsWith('~/'))) {
            const home = this.getVar('HOME') || '/home/user';
            text = home + text.slice(1);
          } else if (sIdx === 0 && /^[A-Za-z_][A-Za-z0-9_]*=~/.test(text)) {
            const eqIdx = text.indexOf('=');
            const restVal = text.slice(eqIdx + 1);
            if (restVal === '~' || restVal.startsWith('~/')) {
              const home = this.getVar('HOME') || '/home/user';
              text = text.slice(0, eqIdx + 1) + home + restVal.slice(1);
            }
          }
          if ((text.includes('$') || text.includes('`')) && !(sIdx === 0 && /^[A-Za-z_][A-Za-z0-9_]*=/.test(text))) {
            hasUnquotedSubstOrVar = true;
          }
          text = this.expandVarsAndSubshells(text);
          if (/[*?]|\[.+?\]/.test(text)) {
            hasUnquotedWildcard = true;
          }
        } else if (seg.quote === '"') {
          text = this.expandVarsAndSubshells(text);
        }

        combined += text;
      }

      const prevToken = finalTokens[finalTokens.length - 1];
      const isFindNameArg = finalTokens[0] === 'find' && (prevToken === '-name' || prevToken === '-iname');

      // Word splitting para expansões sem aspas ($VAR, $(cmd), `cmd`)
      if (hasUnquotedSubstOrVar && segs.every(s => s.quote === null)) {
        const splitPieces = combined.trim().split(/\s+/).filter(Boolean);
        for (const piece of splitPieces) {
          if (hasUnquotedWildcard && !isFindNameArg && /[*?]|\[.+?\]/.test(piece)) {
            const matches = this.fs.expandGlob(piece);
            if (matches.length > 0) finalTokens.push(...matches);
            else finalTokens.push(piece);
          } else {
            finalTokens.push(piece);
          }
        }
        continue;
      }

      if (hasUnquotedWildcard && !isFindNameArg) {
        const matches = this.fs.expandGlob(combined);
        if (matches.length > 0) {
          finalTokens.push(...matches);
        } else {
          finalTokens.push(combined);
        }
      } else {
        finalTokens.push(combined);
      }
    }

    return finalTokens;
  }

  tokenize(str) {
    return this.tokenizeAndExpand(str);
  }

  executeSingleCommandWithRedirection(cmdStr, stdin = '') {
    const aliasExpanded = this.expandAliases(cmdStr);
    const {
      baseCmd,
      redirectOutMode,
      targetOutFile,
      redirectErrMode,
      targetErrFile,
      mergeErrToOut,
      targetInFile,
      hereString
    } = this.parseRedirections(aliasExpanded);

    if (hereString !== null) {
      stdin = hereString;
    } else if (targetInFile) {
      try {
        stdin = this.fs.readFile(targetInFile);
      } catch (err) {
        return { output: `bash: ${targetInFile}: ${err.message}`, code: 1, type: 'error' };
      }
    }

    const rawTokens = this.tokenizeRaw(baseCmd);
    if (rawTokens.length === 0) return { output: '', code: 0 };

    // Verifica atribuições de variáveis no início (ex: NOME="Linux" ou PORT=8080)
    let assignCount = 0;
    const pendingAssignments = [];
    for (const segs of rawTokens) {
      if (segs.length > 0 && segs[0].quote === null && /^[A-Za-z_][A-Za-z0-9_]*=/.test(segs[0].text)) {
        const eqIdx = segs[0].text.indexOf('=');
        const varName = segs[0].text.slice(0, eqIdx);
        const firstValPart = segs[0].text.slice(eqIdx + 1);
        const valSegs = [{ text: firstValPart, quote: null }, ...segs.slice(1)];
        let expandedVal = '';
        for (let i = 0; i < valSegs.length; i++) {
          const s = valSegs[i];
          let t = s.text;
          if (s.quote === null) {
            if (i === 0 && (t === '~' || t.startsWith('~/'))) {
              t = (this.getVar('HOME') || '/home/user') + t.slice(1);
            }
            t = this.expandVarsAndSubshells(t);
          } else if (s.quote === '"') {
            t = this.expandVarsAndSubshells(t);
          }
          expandedVal += t;
        }
        pendingAssignments.push([varName, expandedVal]);
        assignCount++;
      } else {
        break;
      }
    }

    if (assignCount === rawTokens.length) {
      for (const [k, v] of pendingAssignments) {
        this.shellVars[k] = v;
        if (Object.prototype.hasOwnProperty.call(this.envVars, k)) {
          this.envVars[k] = v;
        }
      }
      return { output: '', code: 0 };
    }

    const tokens = this.tokenizeAndExpand(baseCmd);
    const effectiveTokens = tokens.slice(assignCount);
    if (effectiveTokens.length === 0) return { output: '', code: 0 };

    // Se houver atribuição inline antes do comando (ex: USER=admin env), aplica temporariamente
    const savedEnv = {};
    for (const [k, v] of pendingAssignments) {
      savedEnv[k] = { env: this.envVars[k], shell: this.shellVars[k] };
      this.envVars[k] = v;
      this.shellVars[k] = v;
    }

    const cmd = effectiveTokens[0];
    const args = effectiveTokens.slice(1);

    let result;
    try {
      result = this.dispatchCommand(cmd, args, stdin);
    } finally {
      for (const [k] of pendingAssignments) {
        if (savedEnv[k].env === undefined) delete this.envVars[k];
        else this.envVars[k] = savedEnv[k].env;
        if (savedEnv[k].shell === undefined) delete this.shellVars[k];
        else this.shellVars[k] = savedEnv[k].shell;
      }
    }

    const isError = result.type === 'error' || (result.code && result.code !== 0 && result.type === 'error');
    const stdoutText = result.output || '';
    const stderrText = result.stderr || (isError ? stdoutText : '');

    // Tratamento de redirecionamento de erro (2>, 2>>, &>, 2>&1) e saída mista stdout+stderr
    if (redirectErrMode || mergeErrToOut) {
      if (mergeErrToOut && redirectOutMode && targetOutFile) {
        try {
          const isAppend = redirectOutMode === '>>';
          const pieces = [];
          if (stdoutText && (!isError || result.stderr)) pieces.push(stdoutText);
          if (stderrText) pieces.push(stderrText);
          const merged = pieces.join('\n');
          const contentToWrite = merged ? (merged + (merged.endsWith('\n') ? '' : '\n')) : '';
          this.fs.writeFile(targetOutFile, contentToWrite, isAppend);
          return { output: '', code: result.code || 0 };
        } catch (err) {
          return { output: `bash: ${targetOutFile}: ${err.message}`, code: 1, type: 'error' };
        }
      }
      if (mergeErrToOut && !redirectOutMode) {
        const pieces = [];
        if (stdoutText && (!isError || result.stderr)) pieces.push(stdoutText);
        if (stderrText) pieces.push(stderrText);
        return { output: pieces.join('\n'), code: result.code || 0 };
      }
      if (redirectErrMode && targetErrFile) {
        try {
          const isAppend = redirectErrMode === '>>';
          if (stderrText) {
            const contentToWrite = stderrText + (stderrText.endsWith('\n') ? '' : '\n');
            this.fs.writeFile(targetErrFile, contentToWrite, isAppend);
          } else if (!isAppend) {
            this.fs.writeFile(targetErrFile, '');
          }
          const remainingOut = (isError && !result.stderr) ? '' : stdoutText;
          if (redirectOutMode && targetOutFile) {
            const outAppend = redirectOutMode === '>>';
            const outContent = remainingOut ? (remainingOut + (remainingOut.endsWith('\n') ? '' : '\n')) : '';
            this.fs.writeFile(targetOutFile, outContent, outAppend);
            return { output: '', code: result.code || 0 };
          }
          return { output: remainingOut, code: result.code || 0 };
        } catch (err) {
          return { output: `bash: ${targetErrFile}: ${err.message}`, code: 1, type: 'error' };
        }
      }
    }

    if (!isError && redirectOutMode && targetOutFile) {
      try {
        const isAppend = redirectOutMode === '>>';
        const needsNl = result.trailingNewline !== false && !stdoutText.endsWith('\n');
        const contentToWrite = stdoutText + (needsNl ? '\n' : '');
        this.fs.writeFile(targetOutFile, contentToWrite, isAppend);
        return { output: '', code: result.code || 0 };
      } catch (err) {
        return { output: `bash: ${targetOutFile}: ${err.message}`, code: 1, type: 'error' };
      }
    }

    if (result.stderr && stdoutText) {
      return { ...result, output: `${stdoutText}\n${result.stderr}` };
    }
    if (result.stderr && !stdoutText) {
      return { ...result, output: result.stderr };
    }

    return result;
  }

  dispatchCommand(cmd, args, stdin = '') {
    try {
      // Interceptador universal para --help e --version
      if (args.includes('--help') && cmd !== 'echo' && cmd !== 'printf') {
        const reg = this.getManPagesRegistry();
        if (reg[cmd]) {
          const p = reg[cmd];
          const opts = p.options && p.options.length > 0 ? `\n\nOpções:\n  ${p.options.join('\n  ')}` : '';
          return {
            output: `Uso: ${p.synopsis}\n${p.description}${opts}\n\nPara documentação completa, execute: man ${cmd}`,
            code: 0
          };
        }
        return this.cmdMan([cmd]);
      }
      if (args.includes('--version') && !['bash', 'sh', 'echo', 'git', 'docker', 'sqlite3'].includes(cmd)) {
        return { output: `${cmd} (GNU coreutils / Penguin Gym Linux) 9.1`, code: 0 };
      }

      switch (cmd) {
        case 'man':
          return this.cmdMan(args);

        case 'whatis':
          return this.cmdWhatis(args);

        case 'apropos':
          return this.cmdApropos(args);

        case 'pwd':
          return { output: this.fs.currentPath, code: 0 };

        case 'clear':
          return { output: '', code: 0, action: 'clear' };

        case 'reset-fs':
        case 'clean-env':
          return { output: '', code: 0, action: 'reset_env' };

        case 'cd': {
          const path = args[0] || this.getVar('HOME') || '~';
          const isDash = path === '-';
          const newPath = this.fs.changeDirectory(path);
          return { output: isDash ? newPath : '', code: 0 };
        }

        case 'pushd': {
          const out = this.fs.pushd(args[0]);
          return { output: out, code: 0 };
        }

        case 'popd': {
          const out = this.fs.popd();
          return { output: out, code: 0 };
        }

        case 'dirs': {
          if (args.includes('-c')) {
            this.fs.dirStack = [];
            return { output: '', code: 0 };
          }
          const verbose = args.includes('-v');
          return { output: this.fs.getDirsOutput(verbose), code: 0 };
        }

        case 'realpath': {
          const targets = args.filter(a => !a.startsWith('-'));
          if (targets.length === 0) throw new Error('realpath: operando ausente');
          const resolved = targets.map(t => this.fs.resolveCanonicalPath(t));
          return { output: resolved.join('\n'), code: 0 };
        }

        case 'readlink': {
          const canonical = args.some(a => a === '-f' || a === '--canonicalize');
          const targets = args.filter(a => !a.startsWith('-'));
          if (targets.length === 0) throw new Error('readlink: operando ausente');
          const out = [];
          for (const t of targets) {
            if (canonical) {
              out.push(this.fs.resolveCanonicalPath(t));
            } else {
              const raw = this.fs.getRawNode(t);
              if (!raw || raw.type !== 'symlink') return { output: '', code: 1 };
              out.push(raw.rawTarget || raw.target);
            }
          }
          return { output: out.join('\n'), code: 0 };
        }

        case 'basename': {
          const clean = args.filter(a => !a.startsWith('-'));
          if (clean.length === 0) throw new Error('basename: operando ausente');
          const p = clean[0].replace(/\/+$/, '');
          let base = p.includes('/') ? p.slice(p.lastIndexOf('/') + 1) : p;
          if (!base && clean[0].startsWith('/')) base = '/';
          const suffix = clean[1];
          if (suffix && base.endsWith(suffix) && base !== suffix) {
            base = base.slice(0, -suffix.length);
          }
          return { output: base, code: 0 };
        }

        case 'dirname': {
          const clean = args.filter(a => !a.startsWith('-'));
          if (clean.length === 0) throw new Error('dirname: operando ausente');
          const out = clean.map(p => {
            const stripped = p.replace(/\/+$/, '');
            if (!stripped && p.startsWith('/')) return '/';
            const idx = stripped.lastIndexOf('/');
            if (idx === -1) return '.';
            if (idx === 0) return '/';
            return stripped.slice(0, idx);
          });
          return { output: out.join('\n'), code: 0 };
        }

        case 'export':
          return this.cmdExport(args);

        case 'unset':
          return this.cmdUnset(args);

        case 'alias':
          return this.cmdAlias(args);

        case 'unalias':
          return this.cmdUnalias(args);

        case 'true':
        case ':':
          return { output: '', code: 0 };

        case 'false':
          return { output: '', code: 1 };

        case 'test':
        case '[':
        case '[[':
          return this.cmdTest(cmd, args);

        case 'bash':
        case 'sh':
          return this.cmdBash(args);

        case 'source':
        case '.':
          return this.cmdSource(args);

        case 'expr':
          return this.cmdExpr(args);

        case 'seq':
          return this.cmdSeq(args);

        case 'sleep':
          return { output: '', code: 0 };

        case 'type': {
          if (args.length === 0) return { output: '', code: 0 };
          const builtins = ['cd', 'pwd', 'echo', 'export', 'unset', 'alias', 'unalias', 'history', 'source', '.', 'test', '[', 'true', 'false', 'type', 'pushd', 'popd', 'dirs', 'help'];
          const out = [];
          let code = 0;
          for (const t of args) {
            if (Object.prototype.hasOwnProperty.call(this.aliases, t)) {
              out.push(`${t} sofre alias para '${this.aliases[t]}'`);
            } else if (builtins.includes(t)) {
              out.push(`${t} é um comando interno do shell`);
            } else if (this.fs.getNode(`/usr/bin/${t}`) || this.fs.getNode(`/bin/${t}`)) {
              out.push(`${t} é /usr/bin/${t}`);
            } else {
              out.push(`bash: type: ${t}: não encontrado`);
              code = 1;
            }
          }
          return { output: out.join('\n'), code, type: code !== 0 ? 'error' : 'text' };
        }

        case 'command':
        case 'builtin':
          if (args.length === 0) return { output: '', code: 0 };
          return this.dispatchCommand(args[0], args.slice(1), stdin);

        case 'ls':
          return this.cmdLs(args);

        case 'tree':
          return this.cmdTree(args);

        case 'stat':
          return this.cmdStat(args);

        case 'file':
          return this.cmdFile(args);

        case 'mkdir':
          return this.cmdMkdir(args);

        case 'touch':
          return this.cmdTouch(args);

        case 'cat':
          return this.cmdCat(args, stdin);

        case 'echo':
          return this.cmdEcho(args);

        case 'printf':
          return this.cmdPrintf(args);

        case 'cp':
          return this.cmdCp(args);

        case 'mv':
          return this.cmdMv(args);

        case 'rm':
          return this.cmdRm(args);

        case 'rmdir':
          return this.cmdRmdir(args);

        case 'grep':
          return this.cmdGrep(args, stdin);

        case 'find':
          return this.cmdFind(args);

        case 'head':
          return this.cmdHead(args, stdin);

        case 'tail':
          return this.cmdTail(args, stdin);

        case 'cut':
          return this.cmdCut(args, stdin);

        case 'tr':
          return this.cmdTr(args, stdin);

        case 'sort':
          return this.cmdSort(args, stdin);

        case 'uniq':
          return this.cmdUniq(args, stdin);

        case 'wc':
          return this.cmdWc(args, stdin);

        case 'diff':
          return this.cmdDiff(args);

        case 'sed':
          return this.cmdSed(args, stdin);

        case 'awk':
          return this.cmdAwk(args, stdin);

        case 'xargs':
          return this.cmdXargs(args, stdin);

        case 'tee':
          return this.cmdTee(args, stdin);

        case 'tac':
          return this.cmdTac(args, stdin);

        case 'rev':
          return this.cmdRev(args, stdin);

        case 'nl':
          return this.cmdNl(args, stdin);

        case 'paste':
          return this.cmdPaste(args, stdin);

        case 'column':
          return this.cmdColumn(args, stdin);

        case 'md5sum':
        case 'sha256sum':
          return this.cmdChecksum(cmd, args, stdin);

        case 'base64':
          return this.cmdBase64(args, stdin);

        case 'env':
        case 'printenv':
          return this.cmdEnv(args);

        case 'chmod':
          return this.cmdChmod(args);

        case 'umask':
          return this.cmdUmask(args);

        case 'chown':
          return this.cmdChown(args);

        case 'sudo': {
          const cleanArgs = [...args];
          if (cleanArgs.length === 1 && (cleanArgs[0] === '-i' || cleanArgs[0] === '-s')) {
            return this.enterUserSession('root', cleanArgs[0] === '-i');
          }
          if (cleanArgs[0] === 'su') {
            const isLogin = cleanArgs.includes('-') || cleanArgs.includes('-l');
            const targetUser = cleanArgs.find((a, idx) => idx > 0 && !a.startsWith('-')) || 'root';
            return this.enterUserSession(targetUser, isLogin);
          }
          let targetUser = 'root';
          while (cleanArgs.length > 0 && (cleanArgs[0] === '-u' || cleanArgs[0] === '-E' || cleanArgs[0] === '-s')) {
            if (cleanArgs[0] === '-u') {
              targetUser = cleanArgs[1] || 'root';
              cleanArgs.splice(0, 2);
            } else {
              cleanArgs.shift();
            }
          }
          if (cleanArgs.length === 0) return { output: 'sudo: comando ausente', code: 1, type: 'error' };
          const prevSudo = this.fs.sudoMode;
          const prevUser = this.envVars.USER;
          this.fs.sudoMode = targetUser === 'root';
          this.envVars.USER = targetUser;
          this.shellVars.USER = targetUser;
          try {
            return this.dispatchCommand(cleanArgs[0], cleanArgs.slice(1), stdin);
          } finally {
            this.fs.sudoMode = prevSudo;
            this.envVars.USER = prevUser;
            this.shellVars.USER = prevUser;
          }
        }

        case 'exit':
        case 'logout': {
          if (this.sessionStack && this.sessionStack.length > 0) {
            const prev = this.sessionStack.pop();
            this.envVars.USER = prev.user;
            this.shellVars.USER = prev.user;
            this.envVars.HOME = prev.home;
            this.shellVars.HOME = prev.home;
            this.fs.sudoMode = prev.sudoMode;
            this.fs.currentPath = prev.path;
            return { output: 'exit', code: 0, sessionChange: true };
          }
          return { output: 'logout\n(Sessão principal mantida)', code: 0 };
        }

        case 'whoami':
          if (this.envVars.USER && this.envVars.USER !== 'user') {
            return { output: this.fs.sudoMode ? 'root' : this.envVars.USER, code: 0 };
          }
          return { output: this.fs.sudoMode ? 'root' : 'user', code: 0 };

        case 'id':
          return this.cmdId(args);

        case 'groups':
          return this.cmdGroups(args);

        case 'who':
          return { output: 'user     pts/0        2026-01-15 07:31 (192.168.1.10)', code: 0 };

        case 'w':
          return {
            output: ` 10:45:00 up 12 days,  3:14,  1 user,  load average: 0.08, 0.03, 0.01
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
user     pts/0    192.168.1.10     07:31    0.00s  0.12s  0.00s w`,
            code: 0
          };

        case 'last':
          return {
            output: `user     pts/0        192.168.1.10     Thu Jan 15 07:31   still logged in
reboot   system boot  6.1.0-21-amd64   Sat Jan  3 07:31   still running

wtmp begins Sat Jan  3 07:31:00 2026`,
            code: 0
          };

        case 'hostname':
          if (args.length > 0 && !args[0].startsWith('-')) {
            if (!this.fs.sudoMode) {
              return { output: 'hostname: você deve ser root para alterar o nome do host', code: 1, type: 'error' };
            }
            this.envVars.HOSTNAME = args[0];
            this.shellVars.HOSTNAME = args[0];
            try { this.fs.writeFile('/etc/hostname', args[0] + '\n'); } catch {}
            return { output: '', code: 0 };
          }
          if (args.includes('-I') || args.includes('-i')) {
            return { output: '192.168.1.100 172.17.0.1', code: 0 };
          }
          return { output: this.envVars.HOSTNAME || 'penguin-gym', code: 0 };

        case 'hostnamectl':
          return {
            output: ` Static hostname: ${this.envVars.HOSTNAME || 'penguin-gym'}
       Icon name: computer-vm
         Chassis: vm 🖴
      Machine ID: 8f4b2c1a9d0e4f6a8b2c1d4e5f6a7b8c
         Boot ID: 3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d
  Virtualization: kvm
Operating System: Debian GNU/Linux 12 (bookworm)
          Kernel: Linux 6.1.0-21-amd64
    Architecture: x86-64`,
            code: 0
          };

        case 'su': {
          const isLogin = args.includes('-') || args.includes('-l');
          const targetUser = args.find(a => !a.startsWith('-')) || 'root';
          if (this.fs.sudoMode || this.envVars.USER === 'root') {
            return this.enterUserSession(targetUser, isLogin);
          }
          return { output: 'su: Falha de autenticação (Dica: use "sudo su" ou "sudo -i")', code: 1, type: 'error' };
        }

        case 'useradd':
        case 'adduser':
          return this.cmdUseradd(args);

        case 'userdel':
          return this.cmdUserdel(args);

        case 'passwd':
          return this.cmdPasswd(args);

        case 'usermod':
          return this.cmdUsermod(args);

        case 'groupadd':
          return this.cmdGroupadd(args);

        case 'date': {
          const fmtArg = args.find(a => a.startsWith('+'));
          const now = new Date();
          if (fmtArg) {
            const pad = (n) => String(n).padStart(2, '0');
            const out = fmtArg.slice(1)
              .replace(/%F/g, `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`)
              .replace(/%T/g, `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`)
              .replace(/%Y/g, String(now.getFullYear()))
              .replace(/%m/g, pad(now.getMonth() + 1))
              .replace(/%d/g, pad(now.getDate()))
              .replace(/%H/g, pad(now.getHours()))
              .replace(/%M/g, pad(now.getMinutes()))
              .replace(/%S/g, pad(now.getSeconds()))
              .replace(/%s/g, String(Math.floor(now.getTime() / 1000)));
            return { output: out, code: 0 };
          }
          return { output: now.toString(), code: 0 };
        }

        case 'which': {
          const target = args[0];
          if (!target) return { output: '', code: 1 };
          if (this.fs.getNode(`/usr/bin/${target}`)) return { output: `/usr/bin/${target}`, code: 0 };
          if (this.fs.getNode(`/bin/${target}`)) return { output: `/bin/${target}`, code: 0 };
          if (this.fs.getNode(`/sbin/${target}`)) return { output: `/sbin/${target}`, code: 0 };
          if (this.fs.getNode(`/usr/sbin/${target}`)) return { output: `/usr/sbin/${target}`, code: 0 };
          const builtins = ['cd', 'pwd', 'echo', 'alias', 'unalias', 'export', 'unset', 'history', 'type', 'help', 'pushd', 'popd', 'dirs', 'exit', 'source', 'test'];
          if (builtins.includes(target)) {
            return { output: `${target}: shell built-in command`, code: 0 };
          }
          const binaries = [
            'pwd', 'ls', 'cd', 'clear', 'whoami', 'date', 'echo', 'cat', 'head', 'tail', 'wc', 'sort', 'uniq', 'grep', 'which', 'env', 'printenv', 'help',
            'mkdir', 'touch', 'cp', 'mv', 'rm', 'rmdir', 'diff', 'find', 'chmod', 'chown', 'sudo', 'su', 'less', 'more', 'nano', 'vi', 'vim', 'man', 'whatis', 'apropos', 'neofetch', 'hostname', 'hostnamectl', 'uname', 'uptime',
            'lscpu', 'lsblk', 'free', 'df', 'fdisk', 'blkid', 'systemctl', 'service', 'journalctl', 'apt', 'apt-get', 'dpkg', 'useradd', 'usermod', 'userdel', 'groupadd', 'passwd', 'groups', 'id', 'crontab', 'dmesg', 'vmstat', 'last', 'w', 'who', 'exit',
            'tee', 'cut', 'tr', 'sed', 'awk', 'xargs', 'column', 'paste', 'tree', 'ps', 'top', 'htop', 'kill', 'pkill', 'killall', 'pgrep', 'du', 'jq',
            'tar', 'gzip', 'gunzip', 'zcat', 'zip', 'unzip', 'ln', 'stat', 'file', 'nl', 'tac', 'rev', 'md5sum', 'sha256sum', 'cksum', 'base64',
            'git', 'docker', 'sqlite3', 'ansible', 'ansible-playbook', 'ssh-keygen', 'logger',
            'bash', 'sh', 'source', 'alias', 'unalias', 'history', 'pushd', 'popd', 'dirs', 'seq', 'bc', 'expr', 'test', 'type', 'sleep', 'cowsay',
            'ip', 'ifconfig', 'route', 'ping', 'curl', 'wget', 'dig', 'nslookup', 'host', 'traceroute', 'tracepath', 'ss', 'netstat', 'nc', 'netcat', 'nmap', 'telnet', 'ufw', 'iptables', 'nftables',
            'realpath', 'readlink', 'basename', 'dirname', 'reset-fs', 'clean-env'
          ];
          if (binaries.includes(target)) {
            return { output: `/usr/bin/${target}`, code: 0 };
          }
          return { output: `which: nenhum ${target} em (/usr/local/bin:/usr/bin:/bin)`, code: 1, type: 'error' };
        }

        case 'ps':
          return this.cmdPs(args);

        case 'top':
        case 'htop':
          return this.cmdTop();

        case 'pgrep':
          return this.cmdPgrep(args);

        case 'pkill':
        case 'killall':
          return this.cmdPkill(args);

        case 'jobs': {
          if (this.backgroundJobs.length === 0) return { output: '', code: 0 };
          return {
            output: this.backgroundJobs.map(j => `[${j.id}]+  ${j.state.padEnd(16)} ${j.cmd} &`).join('\n'),
            code: 0
          };
        }

        case 'fg':
        case 'bg': {
          if (this.backgroundJobs.length === 0) {
            return { output: `bash: ${cmd}: atual: trabalho inexistente`, code: 1, type: 'error' };
          }
          const job = this.backgroundJobs[this.backgroundJobs.length - 1];
          if (cmd === 'fg') {
            this.backgroundJobs.pop();
            return { output: job.cmd, code: 0 };
          }
          job.state = 'Em execução';
          return { output: `[${job.id}]+ ${job.cmd} &`, code: 0 };
        }

        case 'nohup':
          if (args.length === 0) return { output: 'nohup: operando ausente', code: 1, type: 'error' };
          return this.dispatchCommand(args[0], args.slice(1), stdin);

        case 'sleep':
          return { output: '', code: 0 };

        case 'kill': {
          let isForce = false;
          let pidArg = null;
          for (let i = 0; i < args.length; i++) {
            const a = args[i];
            if (a === '-9' || a === '-KILL' || a === '-SIGKILL') {
              isForce = true;
            } else if ((a === '-s' || a === '-n') && args[i + 1]) {
              const sig = args[++i].toUpperCase();
              if (sig === '9' || sig === 'KILL' || sig === 'SIGKILL') isForce = true;
            } else if (!a.startsWith('-')) {
              pidArg = a;
              break;
            }
          }
          if (!pidArg) return { output: 'kill: uso: kill [-s sigspec | -n signum | -sigspec] pid', code: 1, type: 'error' };
          if (pidArg.startsWith('%')) {
            const jobId = parseInt(pidArg.slice(1), 10);
            const idx = this.backgroundJobs.findIndex(j => j.id === jobId);
            if (idx === -1) return { output: `bash: kill: ${pidArg}: trabalho inexistente`, code: 1, type: 'error' };
            const removed = this.backgroundJobs.splice(idx, 1)[0];
            this.killedProcesses.add(removed.pid);
            return { output: `[${removed.id}]+  ${isForce ? 'Morto' : 'Terminado'}               ${removed.cmd}`, code: 0 };
          }
          this.killedProcesses.add(pidArg);
          if (pidArg === '123' || pidArg === '124') {
            this.services.nginx.active = false;
          } else if (pidArg === '88') {
            this.services.ssh.active = false;
          } else if (pidArg === '74') {
            this.services.cron.active = false;
          } else if (pidArg === '210') {
            this.services.docker.active = false;
          }
          this.backgroundJobs = this.backgroundJobs.filter(j => j.pid !== pidArg);
          return { output: `[1]+  ${isForce ? 'Morto (SIGKILL)' : 'Terminado'}               processo ${pidArg}`, code: 0 };
        }

        case 'free':
          return this.cmdFree(args);

        case 'lscpu':
          return this.cmdLscpu();

        case 'lsblk':
          return this.cmdLsblk();

        case 'dmesg':
          return {
            output: `[    0.000000] Linux version 6.1.0-21-amd64 (debian-kernel@lists.debian.org)
[    0.042110] Command line: BOOT_IMAGE=/boot/vmlinuz-6.1.0-21-amd64 root=/dev/sda1 ro quiet
[    0.415200] EXT4-fs (sda1): mounted filesystem with ordered data mode. Quota mode: none.
[    1.102400] systemd[1]: Detected architecture x86-64.
[    1.854120] eth0: Link is Up - 1Gbps/Full - flow control rx/tx`,
            code: 0
          };

        case 'mount':
          return { output: this.fs.readFile('/proc/mounts').trim(), code: 0 };

        case 'umount':
          if (!this.fs.sudoMode) return { output: 'umount: somente root pode fazer isso', code: 1, type: 'error' };
          return { output: '', code: 0 };

        case 'systemctl':
          return this.cmdSystemctl(args);

        case 'service':
          return this.cmdService(args);

        case 'journalctl':
          return this.cmdJournalctl(args);

        case 'crontab':
          return this.cmdCrontab(args, stdin);

        case 'apt':
        case 'apt-get':
          return this.cmdApt(args);

        case 'dpkg':
          return this.cmdDpkg(args);

        case 'ip':
          return this.cmdIp(args);

        case 'ifconfig':
          return this.cmdIfconfig(args);

        case 'ping':
          return this.cmdPing(args);

        case 'traceroute':
          return this.cmdTraceroute(args);

        case 'curl':
          return this.cmdCurl(args);

        case 'wget':
          return this.cmdWget(args);

        case 'ss':
        case 'netstat':
          return this.cmdNetstat(cmd, args);

        case 'dig':
          return this.cmdDig(args);

        case 'nslookup':
          return this.cmdNslookup(args);

        case 'host': {
          const domain = args.find(a => !a.startsWith('-')) || 'penguin-gym.local';
          return { output: `${domain} has address 93.184.216.34\n${domain} mail is handled by 10 mail.${domain}.`, code: 0 };
        }

        case 'nc':
        case 'netcat':
          return this.cmdNc(args);

        case 'ufw':
          return this.cmdUfw(args);

        case 'ssh':
          if (args.length === 0) return { output: 'usage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] destination [command]', code: 1, type: 'error' };
          return { output: `ssh: conectado a ${args[args.length - 1]} (Fingerprint SHA256:4b8c... OK)`, code: 0 };

        case 'ssh-keygen':
          return this.cmdSshKeygen(args);

        case 'scp': {
          const clean = args.filter(a => !a.startsWith('-'));
          if (clean.length < 2) return { output: `${cmd}: argumentos de origem e destino necessários`, code: 1, type: 'error' };
          return { output: `${clean[0]}                                  100% 1024     1.2MB/s   00:00`, code: 0 };
        }

        case 'rsync':
          return this.cmdRsync(args);

        case 'ansible':
          if (!this.ansible) return { output: 'ansible: motor Ansible não carregado', code: 1, type: 'error' };
          return this.ansible.executeAdHoc(args);

        case 'ansible-playbook':
          if (!this.ansible) return { output: 'ansible-playbook: motor Ansible não carregado', code: 1, type: 'error' };
          return this.ansible.executePlaybook(args);

        case 'logger': {
          const msg = args.filter(a => !a.startsWith('-')).join(' ').trim() || 'automacao';
          const logLine = `Jan 15 10:45:00 ${this.envVars.HOSTNAME || 'penguin-gym'} ${this.envVars.USER || 'user'}: ${msg}\n`;
          const prevSudo = this.fs.sudoMode;
          this.fs.sudoMode = true;
          try {
            const cur = this.fs.getNode('/var/log/syslog') ? this.fs.readFile('/var/log/syslog') : '';
            this.fs.writeFile('/var/log/syslog', cur + logLine);
          } finally {
            this.fs.sudoMode = prevSudo;
          }
          return { output: '', code: 0 };
        }

        case 'sleep':
          return { output: '', code: 0 };

        case 'df':
          return this.cmdDf(args);

        case 'du':
          return this.cmdDu(args);

        case 'uname':
          if (args.includes('-a')) {
            return { output: 'Linux penguin-gym 6.1.0-21-amd64 #1 SMP PREEMPT_DYNAMIC Debian x86_64 GNU/Linux', code: 0 };
          }
          if (args.includes('-r')) {
            return { output: '6.1.0-21-amd64', code: 0 };
          }
          if (args.includes('-m')) {
            return { output: 'x86_64', code: 0 };
          }
          return { output: 'Linux', code: 0 };

        case 'uptime':
          if (args.includes('-p')) {
            return { output: 'up 12 days, 3 hours, 14 minutes', code: 0 };
          }
          return { output: ' 10:45:00 up 12 days,  3:14,  1 user,  load average: 0.08, 0.03, 0.01', code: 0 };

        case 'history':
          if (args.includes('-c')) {
            this.history = [];
            return { output: '', code: 0, historyCleared: true };
          }
          return { output: this.history.map((h, i) => `  ${i + 1}  ${h}`).join('\n'), code: 0 };

        case 'more':
        case 'less': {
          const files = args.filter(a => !a.startsWith('-'));
          if (files.length === 0 && !stdin) {
            return { output: `${cmd}: nome de arquivo ausente ("${cmd} --help" para ajuda)`, code: 1, type: 'error' };
          }
          const catRes = this.cmdCat(args, stdin);
          return {
            output: catRes.output,
            code: catRes.code,
            action: 'less',
            pagerMode: cmd,
            content: catRes.output,
            title: files.join(' ') || 'entrada padrão'
          };
        }

        case 'ln':
          return this.cmdLn(args);

        case 'tar':
          return this.cmdTar(args);

        case 'gzip':
          return this.cmdGzip(args);

        case 'gunzip':
          return this.cmdGunzip(args);

        case 'zcat':
          return this.cmdZcat(args);

        case 'zip':
          return this.cmdZip(args);

        case 'unzip':
          return this.cmdUnzip(args);

        case 'git':
          return this.git.execute(args);

        case 'docker':
          return this.docker.execute(args, this.fs);

        case 'sqlite3':
          if (args.length === 1 && !args[0].startsWith('-')) {
            return {
              output: `SQLite version 3.40.1 2022-12-28 14:03:47\nDigite ".help" para instruções de uso.\nDigite ".exit" ou ".quit" para sair do prompt sqlite>.\nConectado ao banco "${args[0]}".`,
              code: 0,
              action: 'sqlite_interactive',
              dbName: args[0]
            };
          }
          return this.sql.execute(args);

        case 'nano':
        case 'vim':
        case 'vi': {
          const targetFile = args.find(a => !a.startsWith('-')) || 'untitled.txt';
          return {
            output: '',
            code: 0,
            action: 'nano',
            filePath: targetFile
          };
        }

        case 'neofetch':
          return this.cmdNeofetch();

        case 'cowsay':
          return this.cmdCowsay(args, stdin);

        case 'jq':
          return this.cmdJq(args, stdin);

        case 'nmap': {
          const host = args.find(a => !a.startsWith('-')) || 'localhost';
          const portLines = [];
          if (this.services.ssh.active) portLines.push('22/tcp   open  ssh');
          if (this.services.nginx.active) portLines.push('80/tcp   open  http');
          if (this.services.postgresql.active) portLines.push('5432/tcp open  postgresql');
          return {
            output: `Starting Nmap 7.93 ( https://nmap.org )
Nmap scan report for ${host} (127.0.0.1)
Host is up (0.00012s latency).
${portLines.length > 0 ? 'PORT     STATE SERVICE\n' + portLines.join('\n') : 'All 1000 scanned ports on ' + host + ' are closed'}

Nmap done: 1 IP address (1 host up) scanned in 0.08 seconds`,
            code: 0
          };
        }

        case 'bc': {
          const expr = (args.filter(a => !a.startsWith('-')).join(' ') || stdin || '').trim();
          if (!expr) return { output: 'bc 1.07.1 (modo não-interativo: use echo "2+2" | bc)', code: 0 };
          return { output: this.evalArithmetic(expr), code: 0 };
        }

        case 'cksum': {
          const files = args.filter(a => !a.startsWith('-'));
          const text = files.length > 0 ? this.fs.readFile(files[0]) : stdin;
          let crc = 0;
          for (let i = 0; i < text.length; i++) crc = ((crc * 31) + text.charCodeAt(i)) >>> 0;
          return { output: `${crc} ${text.length}${files[0] ? ' ' + files[0] : ''}`, code: 0 };
        }

        case 'route':
          return {
            output: `Tabela de Roteamento IP do Kernel\nDestino         Roteador        MáscaraGen.    Opções Métrica Ref   Uso Iface\ndefault         192.168.1.1     0.0.0.0         UG    100    0        0 eth0\n172.17.0.0      0.0.0.0         255.255.0.0     U     0      0        0 docker0\n192.168.1.0     0.0.0.0         255.255.255.0   U     100    0        0 eth0`,
            code: 0
          };

        case 'tracepath':
          return this.cmdTraceroute(args);

        case 'telnet': {
          const clean = args.filter(a => !a.startsWith('-'));
          const host = clean[0] || 'localhost';
          const port = clean[1] || '80';
          return { output: `Trying 127.0.0.1...\nConnected to ${host}.\nEscape character is '^]'.`, code: 0 };
        }

        case 'iptables':
        case 'nftables':
          if (!this.fs.sudoMode) return { output: `${cmd}: Permissão negada (necessário root)`, code: 1, type: 'error' };
          return { output: `Chain INPUT (policy ACCEPT)\ntarget     prot opt source               destination`, code: 0 };

        case 'fdisk':
          if (!this.fs.sudoMode) return { output: 'fdisk: não foi possível abrir /dev/sda: Permissão negada', code: 1, type: 'error' };
          return {
            output: `Disk /dev/sda: 20 GiB, 21474836480 bytes, 41943040 sectors\nDevice     Boot Start      End  Sectors Size Id Type\n/dev/sda1  *     2048 41943006 41940959  20G 83 Linux`,
            code: 0
          };

        case 'blkid':
          return {
            output: `/dev/sda1: UUID="4a9f-8b21-c3d4" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="12345678-01"`,
            code: 0
          };

        case 'vmstat':
          return {
            output: `procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----\n r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st\n 1  0      0 1280400 184200 1650000  0    0     2     5  120  240  1  1 98  0  0`,
            code: 0
          };

        case 'reboot':
        case 'shutdown':
          if (!this.fs.sudoMode) return { output: `${cmd}: deve ser superusuário (use sudo)`, code: 1, type: 'error' };
          return { output: `[Simulador] Comando '${cmd}' validado (reinicialização real desativada no navegador).`, code: 0 };

        case 'help':
          return this.cmdHelp(args);

        default: {
          if (cmd.includes('/')) {
            const node = this.fs.getNode(cmd);
            if (!node) {
              return { output: `bash: ${cmd}: Arquivo ou diretório não encontrado`, code: 127, type: 'error' };
            }
            if (node.type === 'directory') {
              return { output: `bash: ${cmd}: É um diretório`, code: 126, type: 'error' };
            }
            if (!this.fs.hasPermission(node, 'x')) {
              return { output: `bash: ${cmd}: Permissão negada`, code: 126, type: 'error' };
            }
            return this.runScriptContent(node.content || '', args, true);
          }
          return { output: `bash: ${cmd}: comando não encontrado`, code: 127, type: 'error' };
        }
      }
    } catch (err) {
      return { output: err.message, code: 1, type: 'error' };
    }
  }

  /**
   * Executa o conteúdo de um script shell (.sh ou .bashrc)
   */
  runScriptContent(content, scriptArgs = [], isolated = true) {
    const savedVars = isolated ? { ...this.shellVars } : null;
    const savedEnv = isolated ? { ...this.envVars } : null;
    const savedPath = isolated ? this.fs.currentPath : null;

    // Define $1, $2, $@, $#
    scriptArgs.forEach((arg, idx) => {
      this.shellVars[String(idx + 1)] = arg;
    });
    this.shellVars['#'] = String(scriptArgs.length);
    this.shellVars['@'] = scriptArgs.join(' ');

    const stripInlineComment = (line) => {
      let inQ = null;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '\\' && i + 1 < line.length && inQ !== "'") { i++; continue; }
        if (ch === '"' || ch === "'") { inQ = inQ === ch ? null : (inQ || ch); continue; }
        if (!inQ && ch === '#' && (i === 0 || /\s/.test(line[i - 1]))) {
          return line.slice(0, i).trimEnd();
        }
      }
      return line;
    };

    const cleanedScript = (content || '')
      .split('\n')
      .map(l => stripInlineComment(l))
      .filter(l => l.trim().length > 0)
      .join('\n');

    try {
      if (!cleanedScript.trim()) return { output: '', code: 0 };
      const res = this.executeLine(cleanedScript, true);
      return { output: res.output || '', code: res.code || 0 };
    } finally {
      if (isolated) {
        this.shellVars = savedVars;
        this.envVars = savedEnv;
        this.fs.currentPath = savedPath;
      }
    }
  }

  cmdBash(args) {
    if (args.length === 0) return { output: 'GNU bash, versão 5.2.15(1)-release (x86_64-pc-linux-gnu)', code: 0 };
    if (args[0] === '--version' || args[0] === '-v') {
      return { output: 'GNU bash, versão 5.2.15(1)-release (x86_64-pc-linux-gnu)', code: 0 };
    }
    if (args[0] === '-c') {
      const cmdStr = args.slice(1).join(' ');
      return this.executeLine(cmdStr, true);
    }
    const scriptFile = args[0];
    const content = this.fs.readFile(scriptFile);
    return this.runScriptContent(content, args.slice(1), true);
  }

  cmdSource(args) {
    if (args.length === 0) {
      return { output: 'bash: source: argumento de nome de arquivo necessário', code: 2, type: 'error' };
    }
    const content = this.fs.readFile(args[0]);
    return this.runScriptContent(content, args.slice(1), false);
  }

  cmdTest(cmd, args) {
    const tokens = [...args];
    if (cmd === '[' && tokens[tokens.length - 1] === ']') tokens.pop();
    if (cmd === '[[' && tokens[tokens.length - 1] === ']]') tokens.pop();
    if (tokens.length === 0) return { output: '', code: 1 };

    let negate = false;
    while (tokens[0] === '!') {
      negate = !negate;
      tokens.shift();
    }

    let result = false;
    if (tokens.length === 1) {
      result = tokens[0].length > 0;
    } else if (tokens.length === 2) {
      const [op, val] = tokens;
      const node = this.fs.getNode(val);
      const raw = this.fs.getRawNode(val);
      if (op === '-e' || op === '-a') result = !!node || !!raw;
      else if (op === '-f') result = !!node && node.type === 'file';
      else if (op === '-d') result = !!node && node.type === 'directory';
      else if (op === '-L' || op === '-h') result = !!raw && raw.type === 'symlink';
      else if (op === '-s') result = !!node && (node.size || 0) > 0;
      else if (op === '-r') result = !!node && this.fs.hasPermission(node, 'r');
      else if (op === '-w') result = !!node && this.fs.hasPermission(node, 'w');
      else if (op === '-x') result = !!node && this.fs.hasPermission(node, 'x');
      else if (op === '-z') result = val.length === 0;
      else if (op === '-n') result = val.length > 0;
    } else if (tokens.length >= 3) {
      const [left, op, right] = tokens;
      if (op === '=' || op === '==') result = left === right;
      else if (op === '!=') result = left !== right;
      else if (op === '-eq') result = Number(left) === Number(right);
      else if (op === '-ne') result = Number(left) !== Number(right);
      else if (op === '-gt') result = Number(left) > Number(right);
      else if (op === '-ge') result = Number(left) >= Number(right);
      else if (op === '-lt') result = Number(left) < Number(right);
      else if (op === '-le') result = Number(left) <= Number(right);
    }

    if (negate) result = !result;
    return { output: '', code: result ? 0 : 1 };
  }

  cmdExpr(args) {
    if (args.length === 0) return { output: 'expr: operando ausente', code: 2, type: 'error' };
    if (args[0] === 'length' && args[1] !== undefined) {
      return { output: String(args[1].length), code: 0 };
    }
    const exprStr = args.join(' ');
    const val = this.evalArithmetic(exprStr);
    return { output: val, code: val === '0' ? 1 : 0 };
  }

  cmdSeq(args) {
    let sep = '\n';
    const nums = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-s' && args[i + 1] !== undefined) {
        sep = args[++i];
      } else if (/^-?\d+(\.\d+)?$/.test(args[i])) {
        nums.push(parseFloat(args[i]));
      }
    }
    if (nums.length === 0) return { output: 'seq: operando ausente', code: 1, type: 'error' };
    let first = 1, step = 1, last = nums[0];
    if (nums.length === 2) {
      [first, last] = nums;
    } else if (nums.length >= 3) {
      [first, step, last] = nums;
    }
    if (step === 0 || Math.abs((last - first) / step) > 1000) {
      return { output: '', code: 1 };
    }
    const out = [];
    for (let n = first; step > 0 ? n <= last : n >= last; n += step) {
      out.push(String(n));
    }
    return { output: out.join(sep), code: 0 };
  }

  getManPagesRegistry() {
    if (typeof window !== 'undefined' && window.MAN_PAGES) return window.MAN_PAGES;
    if (typeof globalThis !== 'undefined' && globalThis.MAN_PAGES) return globalThis.MAN_PAGES;
    return {};
  }

  cmdHelp(args = []) {
    const getCatRangeLabel = (catId, fallback) => {
      const all = (typeof ALL_LESSONS !== 'undefined' && Array.isArray(ALL_LESSONS)) ? ALL_LESSONS : null;
      if (!all) return fallback;
      const indices = [];
      all.forEach((l, i) => { if (l.category === catId) indices.push(i + 1); });
      if (indices.length === 0) return fallback;
      return `Lições #${indices[0]} - #${indices[indices.length - 1]}`;
    };

    const categoriesData = [
      {
        num: 1,
        id: 'beginner',
        alias: ['iniciante', 'beginner', '1', 'basico'],
        icon: '🌱',
        name: 'Iniciante',
        lessons: getCatRangeLabel('beginner', 'Lições #1 - #18'),
        desc: 'Comandos fundamentais de navegação, inspeção básica e terminal',
        commandsSummary: 'pwd, ls, cd, clear, whoami, date, echo, cat, head, tail, wc, sort, uniq, grep, which, env, help',
        commands: [
          { cmd: 'pwd', desc: 'Exibir o diretório atual de trabalho' },
          { cmd: 'ls', desc: 'Listar arquivos e diretórios (-l detalhado, -a ocultos)' },
          { cmd: 'cd', desc: 'Navegar entre pastas (cd <dir>, cd .., cd ~, cd -)' },
          { cmd: 'clear', desc: 'Limpar a tela do terminal (atalho: Ctrl+L)' },
          { cmd: 'whoami', desc: 'Exibir o nome do usuário logado na sessão' },
          { cmd: 'date', desc: 'Mostrar data e hora atual do sistema' },
          { cmd: 'echo', desc: 'Imprimir texto ou valores de variáveis' },
          { cmd: 'cat', desc: 'Concatenar e exibir conteúdo de arquivos de texto' },
          { cmd: 'head', desc: 'Exibir as primeiras linhas de um arquivo (-n)' },
          { cmd: 'tail', desc: 'Exibir as últimas linhas de um arquivo (-n)' },
          { cmd: 'wc', desc: 'Contar linhas (-l), palavras (-w) ou caracteres (-c)' },
          { cmd: 'sort', desc: 'Ordenar linhas de texto em ordem alfabética ou numérica (-n)' },
          { cmd: 'uniq', desc: 'Filtrar linhas repetidas adjacentes (-c contagem)' },
          { cmd: 'grep', desc: 'Buscar padrões de texto ou regex em arquivos (-i, -v, -n)' },
          { cmd: 'which', desc: 'Localizar o caminho do executável de um comando' },
          { cmd: 'env', desc: 'Listar variáveis de ambiente exportadas' },
          { cmd: 'help', desc: 'Exibir o manual de ajuda dos comandos do curso' }
        ]
      },
      {
        num: 2,
        id: 'fundamentals',
        alias: ['fundamentos', 'fundamentals', '2'],
        icon: '📁',
        name: 'Fundamentos',
        lessons: getCatRangeLabel('fundamentals', 'Lições #19 - #59'),
        desc: 'Manipulação de arquivos, diretórios, permissões e busca',
        commandsSummary: 'mkdir, touch, cp, mv, rm, rmdir, diff, find, chmod, chown, sudo, less, more, nano, vi/vim, man, whatis, apropos, neofetch, hostnamectl, uname',
        commands: [
          { cmd: 'mkdir', desc: 'Criar diretórios (-p para múltiplos níveis / pais)' },
          { cmd: 'touch', desc: 'Criar arquivo vazio ou atualizar data de modificação' },
          { cmd: 'cp', desc: 'Copiar arquivos ou diretórios recursivamente (-r)' },
          { cmd: 'mv', desc: 'Mover ou renomear arquivos e pastas' },
          { cmd: 'rm', desc: 'Remover arquivos ou diretórios recursivamente (-r, -f)' },
          { cmd: 'rmdir', desc: 'Remover diretórios vazios' },
          { cmd: 'diff', desc: 'Comparar diferenças linha por linha entre dois arquivos' },
          { cmd: 'find', desc: 'Localizar arquivos por nome (-name) ou tipo (-type)' },
          { cmd: 'chmod', desc: 'Alterar permissões de acesso (ex: +x, 755, 644)' },
          { cmd: 'chown', desc: 'Alterar dono e grupo proprietário de arquivos (dono:grupo)' },
          { cmd: 'sudo', desc: 'Executar comandos com privilégios de superusuário' },
          { cmd: 'less', desc: 'Visualizar arquivos com paginação interativa (q para sair)' },
          { cmd: 'more', desc: 'Visualizador paginado básico de arquivos' },
          { cmd: 'nano', desc: 'Editor de texto interativo no terminal' },
          { cmd: 'vi / vim', desc: 'Editor visual de texto padrão dos ambientes Unix' },
          { cmd: 'man', desc: 'Exibir a página oficial do manual Unix de um comando' },
          { cmd: 'whatis', desc: 'Exibir descrição resumida de uma linha do comando' },
          { cmd: 'apropos', desc: 'Buscar comandos por palavras-chave na documentação' },
          { cmd: 'neofetch', desc: 'Exibir dados do sistema com arte ASCII do Linux' },
          { cmd: 'hostnamectl', desc: 'Consultar ou alterar nome da máquina e SO' },
          { cmd: 'uname', desc: 'Exibir informações do kernel Linux e arquitetura (-a, -r)' }
        ]
      },
      {
        num: 3,
        id: 'sysadmin',
        alias: ['sysadmin', 'admin', 'sistema', '3'],
        icon: '🛡️',
        name: 'Sysadmin',
        lessons: getCatRangeLabel('sysadmin', 'Lições #60 - #95'),
        desc: 'Administração de sistema, hardware, serviços, usuários e pacotes',
        commandsSummary: 'lscpu, lsblk, free, df, fdisk, blkid, systemctl, service, journalctl, apt, dpkg, useradd, usermod, passwd, groups, id, su, sudo -i, crontab, dmesg, vmstat, exit',
        commands: [
          { cmd: 'lscpu', desc: 'Exibir arquitetura, modelo, núcleos e detalhes da CPU' },
          { cmd: 'lsblk', desc: 'Listar dispositivos de bloco, discos de armazenamento e partições' },
          { cmd: 'free', desc: 'Exibir consumo de memória RAM e Swap (-h legível)' },
          { cmd: 'df', desc: 'Exibir espaço em disco utilizado e disponível (-h)' },
          { cmd: 'fdisk', desc: 'Inspecionar e manipular tabelas de partições de disco (-l)' },
          { cmd: 'blkid', desc: 'Identificar atributos e UUIDs de dispositivos de bloco' },
          { cmd: 'systemctl', desc: 'Controlar e inspecionar serviços systemd (status, restart, enable)' },
          { cmd: 'service', desc: 'Executar scripts de inicialização de serviços' },
          { cmd: 'journalctl', desc: 'Consultar logs e registros do sistema (-u <servico>, -n)' },
          { cmd: 'apt', desc: 'Gerenciador de pacotes Debian/Ubuntu (update, upgrade, install, remove, purge, autoremove)' },
          { cmd: 'dpkg', desc: 'Manipulador de pacotes de baixo nível .deb (-l)' },
          { cmd: 'useradd', desc: 'Criar uma nova conta de usuário no sistema (-m)' },
          { cmd: 'usermod', desc: 'Modificar conta de usuário (-aG para adicionar a grupo)' },
          { cmd: 'userdel', desc: 'Excluir conta de usuário do sistema' },
          { cmd: 'passwd', desc: 'Alterar a senha de acesso de usuários' },
          { cmd: 'groups', desc: 'Exibir os grupos aos quais um usuário pertence' },
          { cmd: 'id', desc: 'Exibir identificador UID, GID e grupos do usuário' },
          { cmd: 'su', desc: 'Trocar de identidade de usuário ou abrir shell de root' },
          { cmd: 'sudo -i', desc: 'Abrir sessão interativa completa como root (prompt #)' },
          { cmd: 'crontab', desc: 'Gerenciar agendamentos de tarefas automáticas no cron (-l)' },
          { cmd: 'dmesg', desc: 'Consultar mensagens do buffer do kernel e hardware' },
          { cmd: 'vmstat', desc: 'Relatar estatísticas de memória virtual, processos e CPU' },
          { cmd: 'exit', desc: 'Encerrar a sessão de usuário ou fechar o shell' }
        ]
      },
      {
        num: 4,
        id: 'advanced',
        alias: ['avancado', 'avançado', 'advanced', '4'],
        icon: '⚡',
        name: 'Avançado',
        lessons: getCatRangeLabel('advanced', 'Lições #96 - #121'),
        desc: 'Pipelines avançados, filtros de fluxo e gerenciamento de processos',
        commandsSummary: '| (pipe), tee, cut, tr, sed, awk, xargs, column, paste, tree, ps, top, htop, kill, pkill, du, jq',
        commands: [
          { cmd: '| (pipe)', desc: 'Canalizar a saída de um comando para a entrada do próximo' },
          { cmd: 'tee', desc: 'Bifurcar fluxo: salva em arquivo e exibe na tela simultaneamente' },
          { cmd: 'cut', desc: 'Recortar seções e colunas delimitadas de cada linha (-d, -f)' },
          { cmd: 'tr', desc: 'Traduzir, substituir ou deletar caracteres de um fluxo' },
          { cmd: 'sed', desc: 'Editor de fluxo para substituições com regex (s/antigo/novo/g)' },
          { cmd: 'awk', desc: 'Linguagem de processamento de texto e colunas (ex: \'{print $1}\')' },
          { cmd: 'xargs', desc: 'Construir e executar comandos a partir da entrada padrão' },
          { cmd: 'column', desc: 'Formatar dados em tabelas limpas e alinhadas (-t)' },
          { cmd: 'paste', desc: 'Combinar linhas correspondentes de múltiplos arquivos' },
          { cmd: 'tree', desc: 'Exibir hierarquia de diretórios em formato de árvore (-L)' },
          { cmd: 'ps', desc: 'Relatar snapshot dos processos em execução no sistema (aux)' },
          { cmd: 'top / htop', desc: 'Visualizar consumo de recursos e processos em tempo real' },
          { cmd: 'kill', desc: 'Enviar sinais para terminar processos por PID (-9)' },
          { cmd: 'pkill', desc: 'Finalizar processos pelo nome do programa executável' },
          { cmd: 'du', desc: 'Estimar espaço em disco utilizado por pastas e arquivos (-sh)' },
          { cmd: 'jq', desc: 'Filtrar, transformar e formatar dados JSON no terminal' }
        ]
      },
      {
        num: 5,
        id: 'lpic',
        alias: ['lpic', 'lpic-1', '5'],
        icon: '🐧',
        name: 'LPIC-1',
        lessons: getCatRangeLabel('lpic', 'Lições #122 - #149'),
        desc: 'Comandos da certificação LPIC-1 (arquivos, links, compactação e integridade)',
        commandsSummary: 'tar, gzip, gunzip, zcat, zip, unzip, ln, stat, file, nl, tac, rev, md5sum, sha256sum, cksum, base64',
        commands: [
          { cmd: 'tar', desc: 'Manipular arquivos compactados (-cvf criar, -xvf extrair, -tvf listar)' },
          { cmd: 'gzip / gunzip', desc: 'Comprimir e descompactar arquivos no formato .gz' },
          { cmd: 'zcat', desc: 'Exibir o conteúdo de arquivo .gz sem precisar descompactar' },
          { cmd: 'ln', desc: 'Criar links rígidos (hard links) ou simbólicos (-s)' },
          { cmd: 'stat', desc: 'Exibir metadados completos de arquivos, inodes e permissões' },
          { cmd: 'file', desc: 'Identificar o tipo real e arquitetura de um arquivo' },
          { cmd: 'nl', desc: 'Numerar linhas de arquivos de texto' },
          { cmd: 'tac', desc: 'Exibir arquivos de texto em ordem inversa de linhas' },
          { cmd: 'rev', desc: 'Inverter os caracteres de cada linha de texto' },
          { cmd: 'md5sum', desc: 'Calcular ou verificar hash criptográfico MD5' },
          { cmd: 'sha256sum', desc: 'Calcular ou verificar hash criptográfico SHA-256' },
          { cmd: 'cksum', desc: 'Calcular soma de verificação CRC e contagem de bytes' },
          { cmd: 'base64', desc: 'Codificar ou decodificar (-d) dados no formato Base64' }
        ]
      },
      {
        num: 6,
        id: 'git',
        alias: ['git', '6'],
        icon: '🔀',
        name: 'Git',
        lessons: getCatRangeLabel('git', 'Lições #150 - #165'),
        desc: 'Controle de versão distribuído de arquivos e projetos',
        commandsSummary: 'git (init, status, add, commit, log, diff, branch, checkout, merge, restore)',
        commands: [
          { cmd: 'git init', desc: 'Inicializar um novo repositório Git no diretório atual' },
          { cmd: 'git status', desc: 'Exibir o estado dos arquivos modificados, staged e untracked' },
          { cmd: 'git add', desc: 'Adicionar modificações à área de preparação (staging)' },
          { cmd: 'git commit', desc: 'Salvar alterações no histórico com mensagem (-m)' },
          { cmd: 'git log', desc: 'Visualizar o histórico cronológico de commits (--oneline)' },
          { cmd: 'git diff', desc: 'Comparar alterações no código (--staged para staged)' },
          { cmd: 'git branch', desc: 'Listar, criar ou remover (-d) branches' },
          { cmd: 'git checkout', desc: 'Alternar entre branches ou criar nova branch (-b)' },
          { cmd: 'git merge', desc: 'Mesclar alterações de outra branch na branch atual' },
          { cmd: 'git restore', desc: 'Desfazer alterações em arquivos (--staged para unstage)' },
          { cmd: 'git stash', desc: 'Guardar alterações temporárias fora do commit (pop, list)' }
        ]
      },
      {
        num: 7,
        id: 'docker',
        alias: ['docker', '7'],
        icon: '🐳',
        name: 'Docker',
        lessons: getCatRangeLabel('docker', 'Lições #166 - #180'),
        desc: 'Gerenciamento de containers e imagens de aplicações isoladas',
        commandsSummary: 'docker (pull, images, build, run, start, ps, logs, exec, inspect, stop, rm, rmi)',
        commands: [
          { cmd: 'docker pull', desc: 'Baixar uma imagem do registro Docker Hub' },
          { cmd: 'docker images', desc: 'Listar imagens baixadas e armazenadas localmente' },
          { cmd: 'docker build', desc: 'Construir uma imagem a partir de um Dockerfile (-t tag .)' },
          { cmd: 'docker run', desc: 'Criar e executar um container (-d background, -p porta, --name)' },
          { cmd: 'docker start', desc: 'Iniciar novamente um container parado' },
          { cmd: 'docker ps', desc: 'Listar containers em execução (ou todos com -a)' },
          { cmd: 'docker logs', desc: 'Consultar logs e saídas de um container' },
          { cmd: 'docker exec', desc: 'Executar um comando dentro de um container em execução' },
          { cmd: 'docker inspect', desc: 'Inspecionar metadados JSON de um container ou imagem' },
          { cmd: 'docker stop', desc: 'Interromper a execução de um container' },
          { cmd: 'docker rm', desc: 'Remover um container inativo do sistema (-f força)' },
          { cmd: 'docker rmi', desc: 'Remover uma imagem Docker do sistema' }
        ]
      },
      {
        num: 8,
        id: 'scripting',
        alias: ['scripts', 'scripting', 'script', '8'],
        icon: '📜',
        name: 'Scripts',
        lessons: getCatRangeLabel('scripting', 'Lições #181 - #203'),
        desc: 'Automação bash, variáveis, laços, condicionais e histórico',
        commandsSummary: 'bash, sh, source, alias, unalias, history, !!, pushd, popd, dirs, for...done, if...fi, test / [ ], $((calc)), $VAR, $(cmd), <<<',
        commands: [
          { cmd: 'bash / sh', desc: 'Executar scripts de comandos shell (ex: bash script.sh)' },
          { cmd: 'source / .', desc: 'Executar script no ambiente do shell atual' },
          { cmd: 'alias', desc: 'Criar atalho de comando personalizado (ex: alias c=clear)' },
          { cmd: 'unalias', desc: 'Remover um atalho de comando definido' },
          { cmd: 'history', desc: 'Exibir a lista numerada de comandos executados (-c)' },
          { cmd: '!! / !n', desc: 'Reexecutar o último comando (!!) ou comando #n (!n)' },
          { cmd: 'pushd / popd', desc: 'Navegar empilhando e restaurando diretórios' },
          { cmd: 'dirs', desc: 'Listar os diretórios atualmente na pilha' },
          { cmd: 'for ... done', desc: 'Laço de repetição (ex: for i in 1 2 3; do touch $i; done)' },
          { cmd: 'while / until', desc: 'Laços condicionais baseados em teste lógico' },
          { cmd: 'if ... fi', desc: 'Estrutura condicional (ex: if [ -f arq ]; then ...; fi)' },
          { cmd: 'test / [ ]', desc: 'Avaliar condições e verificar existência de arquivos (-f, -d)' },
          { cmd: '$(( calc ))', desc: 'Expansão de cálculo aritmético inteiro no shell' },
          { cmd: '$VAR', desc: 'Interpolação de variáveis de ambiente e shell ($?, $$, $USER)' },
          { cmd: '$(cmd)', desc: 'Substituição de comando para capturar stdout' },
          { cmd: '( ... )', desc: 'Executar comandos isolados dentro de um subshell' },
          { cmd: '<<<', desc: 'Here-string para injetar texto direto no stdin de um comando' }
        ]
      },
      {
        num: 9,
        id: 'networking',
        alias: ['redes', 'rede', 'networking', 'net', '9'],
        icon: '🌐',
        name: 'Redes',
        lessons: getCatRangeLabel('networking', 'Lições #204 - #229'),
        desc: 'Conectividade, diagnósticos, resolução DNS e firewall',
        commandsSummary: 'ip (addr/route), ifconfig, ping, curl, wget, dig, nslookup, host, traceroute, ss, netstat, nc, nmap, ufw',
        commands: [
          { cmd: 'ip addr / a', desc: 'Exibir interfaces de rede e endereços IP associados' },
          { cmd: 'ip route', desc: 'Exibir a tabela de roteamento de pacotes do kernel' },
          { cmd: 'ifconfig', desc: 'Utilitário tradicional de configuração de interfaces de rede' },
          { cmd: 'ping', desc: 'Testar conectividade ICMP com hosts na rede (-c <vezes>)' },
          { cmd: 'curl', desc: 'Transferir dados via HTTP/HTTPS/FTP (-I cabeçalhos, -O download)' },
          { cmd: 'wget', desc: 'Efetuar download de arquivos da web direto para o disco' },
          { cmd: 'dig', desc: 'Consultar servidores DNS detalhadamente (+short para IP)' },
          { cmd: 'nslookup', desc: 'Resolver nomes de domínio e hosts na rede' },
          { cmd: 'host', desc: 'Consultar apontamentos e registros DNS de um domínio' },
          { cmd: 'traceroute', desc: 'Rastrear a rota de pacotes e roteadores até o destino' },
          { cmd: 'ss', desc: 'Inspecionar sockets de rede e portas abertas (-tuln)' },
          { cmd: 'netstat', desc: 'Exibir conexões de rede e portas ativas (-tuln)' },
          { cmd: 'nc / netcat', desc: 'Conectar ou escanear portas TCP/UDP (-zv <host> <porta>)' },
          { cmd: 'nmap', desc: 'Escanear portas e serviços abertos em hosts da rede' },
          { cmd: 'ufw', desc: 'Gerenciar o firewall do sistema (status, enable, disable, allow, deny, delete)' }
        ]
      },
      {
        num: 10,
        id: 'database',
        alias: ['sql', 'database', 'banco', '10'],
        icon: '🗄️',
        name: 'SQL',
        lessons: getCatRangeLabel('database', 'Lições #230 - #246'),
        desc: 'Banco de dados relacional SQLite e consultas estruturadas',
        commandsSummary: 'sqlite3 <banco.db> "QUERY", .tables, .schema, CREATE, INSERT, SELECT, WHERE, LIKE, AVG, JOIN, UPDATE, DELETE',
        commands: [
          { cmd: 'sqlite3 <db>', desc: 'Acessar o banco de dados ou rodar queries direto no terminal' },
          { cmd: '.tables', desc: 'Metacomando para listar tabelas do banco de dados' },
          { cmd: '.schema <tab>', desc: 'Exibir o comando DDL de criação e estrutura da tabela' },
          { cmd: 'CREATE TABLE', desc: 'Criar nova tabela no banco de dados' },
          { cmd: 'INSERT INTO', desc: 'Inserir novos registros em uma tabela' },
          { cmd: 'SELECT ... FROM', desc: 'Consultar colunas e registros de tabelas' },
          { cmd: 'WHERE', desc: 'Filtrar registros (=, !=, >=, IS NULL, LIKE, BETWEEN)' },
          { cmd: 'ORDER BY', desc: 'Ordenar resultados por colunas (ASC, DESC)' },
          { cmd: 'LIMIT', desc: 'Limitar o número máximo de linhas retornadas' },
          { cmd: 'COUNT / AVG / GROUP', desc: 'Totalizar, calcular médias e agrupar resultados' },
          { cmd: 'JOIN / LEFT JOIN', desc: 'Combinar registros de múltiplas tabelas relacionais' },
          { cmd: 'UPDATE / DELETE', desc: 'Atualizar ou excluir registros com WHERE' }
        ]
      },
      {
        num: 11,
        id: 'automation-bash',
        alias: ['autobash', 'automation', 'automacao', 'automation-bash', '11'],
        icon: '🤖',
        name: 'Auto Bash',
        lessons: getCatRangeLabel('automation-bash', 'Lições #257 - #270'),
        desc: 'Automação prática local: robôs Bash, triagem de Downloads, rsync incremental, watchdogs e cron',
        commandsSummary: 'chmod +x, for/if, mv, find -delete, rsync -av/-n, df, systemctl, crontab -e, logger',
        commands: [
          { cmd: '#!/bin/bash', desc: 'Criar scripts executáveis autônomos e com log (>> ... 2>&1)' },
          { cmd: 'for + [ -f ]', desc: 'Organizar diretórios como downloads/ automaticamente por extensão' },
          { cmd: 'rsync -av / -n', desc: 'Sincronização incremental local e simulação segura (--dry-run)' },
          { cmd: 'df + if -gt', desc: 'Monitorar uso de disco e acionar alertas/autocorreção' },
          { cmd: 'crontab -e', desc: 'Agendar scripts de automação em horários recorrentes' }
        ]
      },
      {
        num: 12,
        id: 'ansible',
        alias: ['ansible', 'iac', 'playbook', '12'],
        icon: '⚙️',
        name: 'Ansible',
        lessons: getCatRangeLabel('ansible', 'Lições #271 - #284'),
        desc: 'Automação declarativa multi-servidor via SSH: inventários, módulos ad-hoc e Playbooks YAML idempotentes',
        commandsSummary: 'ssh-keygen, inventory.ini, ansible -m ping/shell/setup/copy/apt/service -b, ansible-playbook --check --diff',
        commands: [
          { cmd: 'ssh-keygen', desc: 'Gerar chave SSH para comunicação sem senha com a frota' },
          { cmd: 'inventory.ini', desc: 'Agrupar servidores gerenciados ([webservers], [databases])' },
          { cmd: 'ansible -m ...', desc: 'Executar módulos ad-hoc (ping, shell, setup, copy, apt, service)' },
          { cmd: 'ansible-playbook', desc: 'Aplicar Playbooks YAML com idempotência, vars, loop, when e handlers' }
        ]
      },
      {
        num: 13,
        id: 'incidents',
        alias: ['incidentes', 'incidents', 'boss', 'troubleshooting', '13'],
        icon: '🚨',
        name: 'Incidentes',
        lessons: getCatRangeLabel('incidents', 'Lições #285 - #290'),
        desc: 'Missões práticas de investigação e resolução de incidentes combinando múltiplos comandos',
        commandsSummary: 'grep, awk, systemctl, ss, git restore, docker stop/rm/rmi, sqlite3, gzip, sha256sum, chmod',
        commands: [
          { cmd: 'logs + ss', desc: 'Investigar falhas em /var/log/nginx/* e portas ativas' },
          { cmd: 'systemctl', desc: 'Diagnosticar e recuperar serviços fora do ar' },
          { cmd: 'git restore', desc: 'Prevenir vazamento de segredos antes do commit' },
          { cmd: 'docker rm/rmi', desc: 'Resolver conflitos entre contêineres e imagens' },
          { cmd: 'sqlite3 + gzip', desc: 'Pipeline completo de extração, compactação e hash' },
          { cmd: 'chmod + ./', desc: 'Corrigir permissão de execução de scripts em produção' }
        ]
      }
    ];

    if (args.length > 0) {
      const target = args[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const foundCat = categoriesData.find(c => c.alias.includes(target) || c.id === target || c.name.toLowerCase() === target);
      if (foundCat) {
        const lines = [
          `${foundCat.icon} Categoria ${foundCat.num}: ${foundCat.name} (${foundCat.lessons})`,
          `Finalidade: ${foundCat.desc}`,
          '----------------------------------------------------------------------'
        ];
        foundCat.commands.forEach(item => {
          const pad = item.cmd.padEnd(16, ' ');
          lines.push(`${pad} ${item.desc}`);
        });
        lines.push('----------------------------------------------------------------------');
        lines.push(`💡 Digite 'help <comando>' ou 'man <comando>' para manual completo (ex: help ${foundCat.commands[0].cmd.split(' ')[0]}).`);
        return { output: lines.join('\n'), code: 0 };
      }
      return this.cmdMan([args[0]]);
    }

    // help geral sem argumentos: exibição organizada exatamente pelas 10 categorias das questões
    const header = [
      '🐧 Penguin Gym Linux - Manual de Comandos Organizados por Categoria:',
      '======================================================================'
    ];
    categoriesData.forEach(cat => {
      const title = `${cat.icon} ${cat.num}. ${cat.name}:`.padEnd(19, ' ');
      header.push(`${title} ${cat.commandsSummary}`);
    });
    header.push('======================================================================');
    header.push('💡 Dicas de Navegação e Ajuda:');
    header.push('   help <comando>    -> Exibe a documentação completa do comando (ex: help lscpu)');
    header.push('   help <categoria>  -> Exibe comandos detalhados da categoria (ex: help sysadmin)');
    header.push('   man <comando>     -> Abre a página oficial do manual Unix (ex: man lscpu)');
    header.push('   Atalhos: Tab (autocomplete), Ctrl+C (cancelar), Ctrl+L (limpar), Ctrl+R (busca)');

    return { output: header.join('\n'), code: 0 };
  }

  cmdMan(args) {
    if (args.includes('-k')) {
      return this.cmdApropos(args.filter(a => a !== '-k'));
    }
    if (args.includes('-f')) {
      return this.cmdWhatis(args.filter(a => a !== '-f'));
    }
    const clean = args.filter(a => !a.startsWith('-') && !/^\d+$/.test(a));
    if (clean.length === 0) {
      return { output: 'Qual página de manual você deseja?\nPor exemplo, tente "man man" ou "man ls".', code: 1, type: 'error' };
    }
    const topic = clean[0].toLowerCase();
    const fmtFn =
      (typeof window !== 'undefined' && window.formatManPage) ||
      (typeof globalThis !== 'undefined' && globalThis.formatManPage);
    if (fmtFn) {
      const pageText = fmtFn(topic);
      if (pageText) return { output: pageText, code: 0 };
    }
    const registry = this.getManPagesRegistry();
    if (registry[topic]) {
      const p = registry[topic];
      return {
        output: `${topic.toUpperCase()}(${p.section || 1})\n\nNOME\n  ${topic} - ${p.short}\n\nSINOPSE\n  ${p.synopsis}\n\nDESCRIÇÃO\n  ${p.description}`,
        code: 0
      };
    }
    return {
      output: `Nenhuma entrada de manual para ${topic}\n(Use "help" para ver todos os comandos disponíveis no sistema)`,
      code: 16,
      type: 'error'
    };
  }

  cmdWhatis(args) {
    const clean = args.filter(a => !a.startsWith('-'));
    if (clean.length === 0) {
      return { output: 'whatis o quê?', code: 1, type: 'error' };
    }
    const registry = this.getManPagesRegistry();
    const out = [];
    let code = 0;
    for (const name of clean) {
      const key = name.toLowerCase();
      if (registry[key]) {
        out.push(`${key} (${registry[key].section || '1'})             - ${registry[key].short}`);
      } else {
        out.push(`${name}: nada apropriado.`);
        code = 1;
      }
    }
    return { output: out.join('\n'), code, type: code !== 0 ? 'error' : 'text' };
  }

  cmdApropos(args) {
    const clean = args.filter(a => !a.startsWith('-'));
    if (clean.length === 0) {
      return { output: 'apropos o quê?', code: 1, type: 'error' };
    }
    const query = clean.join(' ').toLowerCase();
    const registry = this.getManPagesRegistry();
    const matches = [];
    for (const [key, page] of Object.entries(registry)) {
      const hay = `${key} ${page.short} ${page.description}`.toLowerCase();
      if (hay.includes(query)) {
        matches.push(`${key} (${page.section || '1'})             - ${page.short}`);
      }
    }
    if (matches.length === 0) {
      return { output: `${query}: nada apropriado.`, code: 1, type: 'error' };
    }
    return { output: matches.sort().join('\n'), code: 0 };
  }

  cmdLs(args) {
    let showAll = false;
    let showAlmostAll = false;
    let longFormat = false;
    let humanReadable = false;
    let recursive = false;
    let sortByTime = false;
    let sortBySize = false;
    let reverseSort = false;
    let dirAsEntry = false;
    let showInode = false;
    let classify = false;
    const paths = [];

    for (const a of args) {
      if (a === '--all') showAll = true;
      else if (a === '--almost-all') showAlmostAll = true;
      else if (a === '--long') longFormat = true;
      else if (a === '--human-readable') humanReadable = true;
      else if (a === '--recursive') recursive = true;
      else if (a === '--reverse') reverseSort = true;
      else if (a === '--directory') dirAsEntry = true;
      else if (a === '--inode') showInode = true;
      else if (a === '--classify') classify = true;
      else if (a.startsWith('--color')) continue;
      else if (a.startsWith('-')) {
        if (a.includes('a')) showAll = true;
        if (a.includes('A')) showAlmostAll = true;
        if (a.includes('l')) longFormat = true;
        if (a.includes('h')) humanReadable = true;
        if (a.includes('R')) recursive = true;
        if (a.includes('t')) sortByTime = true;
        if (a.includes('S')) sortBySize = true;
        if (a.includes('r')) reverseSort = true;
        if (a.includes('d')) dirAsEntry = true;
        if (a.includes('i')) showInode = true;
        if (a.includes('F')) classify = true;
      } else {
        paths.push(a);
      }
    }

    const formatSize = (rawSize) => {
      const s = rawSize !== undefined ? rawSize : 4096;
      if (!humanReadable) return String(s);
      if (s >= 1048576) return (s / 1048576).toFixed(1) + 'M';
      if (s >= 1024) return (s / 1024).toFixed(1) + 'K';
      return s + 'B';
    };

    const getSuffix = (node) => {
      if (!classify || !node) return '';
      if (node.type === 'directory') return '/';
      if (node.type === 'symlink') return '@';
      if (node.permissions && node.permissions.includes('x')) return '*';
      return '';
    };

    const formatLongEntry = (name, child) => {
      const typeChar = child.type === 'directory' ? 'd' : (child.type === 'symlink' ? 'l' : '-');
      const perm = typeChar + (child.permissions || 'rw-r--r--');
      const size = formatSize(child.size);
      const inodePrefix = showInode ? `${String(child.inode || 1000).padStart(6)} ` : '';
      const suffix = child.type === 'symlink' ? ` -> ${child.rawTarget || child.target}` : getSuffix(child);
      return `${inodePrefix}${perm} ${child.links || 1} ${child.owner || 'user'} ${child.group || 'user'} ${String(size).padStart(6)} Jan 15 10:30 ${name}${suffix}`;
    };

    const formatShortEntry = (name, child) => {
      const inodePrefix = showInode ? `${child.inode || 1000} ` : '';
      return `${inodePrefix}${name}${getSuffix(child)}`;
    };

    const targets = paths.length > 0 ? paths : [this.fs.currentPath];
    const fileOutputs = [];
    const dirSections = [];
    const errors = [];

    const renderDirectory = (targetPath, forceHeader = false) => {
      const node = this.fs.getNode(targetPath);
      if (!node) return;
      if (!this.fs.hasPermission(node, 'r')) {
        errors.push(`ls: não foi possível abrir diretório '${targetPath}': Permissão negada`);
        return;
      }

      const names = Object.keys(node.children || {});
      let filtered = names;
      if (showAll) {
        filtered = ['.', '..', ...names];
      } else if (showAlmostAll) {
        filtered = [...names];
      } else {
        filtered = names.filter(n => !n.startsWith('.'));
      }

      const getEntryObj = (name) => {
        if (name === '.' || name === '..') {
          return {
            name,
            inode: node.inode || 1001,
            permissions: 'rwxr-xr-x',
            owner: node.owner || 'user',
            group: node.group || 'user',
            size: 4096,
            mtime: node.mtime || 0,
            type: 'directory',
            links: node.links || 2
          };
        }
        return node.children[name];
      };

      filtered.sort((a, b) => {
        const ca = getEntryObj(a);
        const cb = getEntryObj(b);
        let cmp = 0;
        if (sortByTime) {
          cmp = (cb.mtime || 0) - (ca.mtime || 0);
        } else if (sortBySize) {
          cmp = (cb.size || 0) - (ca.size || 0);
        } else {
          cmp = a.localeCompare(b);
        }
        return reverseSort ? -cmp : cmp;
      });

      const lines = filtered.map(name => {
        const child = getEntryObj(name);
        return longFormat ? formatLongEntry(name, child) : formatShortEntry(name, child);
      });

      const dirContent = lines.join('\n');
      if (targets.length > 1 || recursive || forceHeader) {
        const disp = paths.length === 0 && targetPath === this.fs.currentPath ? '.' : targetPath;
        dirSections.push(`${disp}:\n${dirContent}`);
      } else {
        dirSections.push(dirContent);
      }

      if (recursive) {
        for (const name of filtered) {
          if (name === '.' || name === '..') continue;
          const child = node.children[name];
          if (child && child.type === 'directory') {
            const subPath =
              paths.length === 0 && targetPath === this.fs.currentPath
                ? `./${name}`
                : `${targetPath.replace(/\/$/, '')}/${name}`;
            renderDirectory(subPath, true);
          }
        }
      }
    };

    for (const targetPath of targets) {
      const rawTarget = this.fs.getRawNode(targetPath);
      const node = this.fs.getNode(targetPath);
      if (!node && !rawTarget) {
        errors.push(`ls: não foi possível acessar '${targetPath}': Arquivo ou diretório não encontrado`);
        continue;
      }

      if (rawTarget && rawTarget.type === 'symlink' && longFormat) {
        fileOutputs.push(formatLongEntry(rawTarget.name, rawTarget));
        continue;
      }

      if (node.type === 'file' || dirAsEntry) {
        const displayName = paths.length > 0 ? targetPath : this.fs.getFileName(targetPath) || '.';
        if (!longFormat) {
          fileOutputs.push(formatShortEntry(displayName, node));
        } else {
          fileOutputs.push(formatLongEntry(displayName, node));
        }
        continue;
      }

      renderDirectory(targetPath, false);
    }

    const combined = [];
    if (fileOutputs.length > 0) combined.push(fileOutputs.join('\n'));
    if (dirSections.length > 0) combined.push(dirSections.join('\n\n'));
    const stdoutOut = combined.join('\n\n');

    if (errors.length > 0) {
      const stderrOut = errors.join('\n');
      return {
        output: stdoutOut,
        stderr: stderrOut,
        code: 2,
        type: 'error'
      };
    }

    return { output: stdoutOut, code: 0 };
  }

  cmdTree(args) {
    let showAll = false;
    let dirsOnly = false;
    let fullPath = false;
    let maxDepth = Infinity;
    let targetPath = '.';

    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-a') showAll = true;
      else if (a === '-d') dirsOnly = true;
      else if (a === '-f') fullPath = true;
      else if (a === '-L' && args[i + 1]) maxDepth = parseInt(args[++i], 10) || 1;
      else if (a.startsWith('-L') && a.length > 2) maxDepth = parseInt(a.slice(2), 10) || 1;
      else if (!a.startsWith('-')) targetPath = a;
    }

    const startNode = this.fs.getNode(targetPath);
    if (!startNode) {
      return { output: `${targetPath} [erro ao abrir diretório]`, code: 1, type: 'error' };
    }
    if (startNode.type !== 'directory') {
      return { output: `${targetPath}\n\n0 directories, 1 file`, code: 0 };
    }

    const lines = [targetPath];
    let dirCount = 0;
    let fileCount = 0;

    const walk = (node, prefix, relPath, depth) => {
      if (depth > maxDepth) return;
      if (!this.fs.hasPermission(node, 'r')) return;

      let entries = Object.keys(node.children || {}).sort();
      if (!showAll) entries = entries.filter(n => !n.startsWith('.'));
      if (dirsOnly) entries = entries.filter(n => node.children[n].type === 'directory');

      entries.forEach((name, idx) => {
        const isLast = idx === entries.length - 1;
        const child = node.children[name];
        const connector = isLast ? '└── ' : '├── ';
        const childPath = relPath === '.' ? `./${name}` : `${relPath.replace(/\/$/, '')}/${name}`;
        const label = fullPath ? childPath : name;
        const suffix = child.type === 'symlink' ? ` -> ${child.rawTarget || child.target}` : '';
        lines.push(`${prefix}${connector}${label}${suffix}`);

        if (child.type === 'directory') {
          dirCount++;
          const nextPrefix = prefix + (isLast ? '    ' : '│   ');
          walk(child, nextPrefix, childPath, depth + 1);
        } else {
          fileCount++;
        }
      });
    };

    walk(startNode, '', targetPath, 1);
    const summary = dirsOnly
      ? `\n${dirCount} ${dirCount === 1 ? 'directory' : 'directories'}`
      : `\n${dirCount} ${dirCount === 1 ? 'directory' : 'directories'}, ${fileCount} ${fileCount === 1 ? 'file' : 'files'}`;
    lines.push(summary);
    return { output: lines.join('\n'), code: 0 };
  }

  cmdStat(args) {
    const targets = args.filter(a => !a.startsWith('-'));
    if (targets.length === 0) throw new Error('stat: operando ausente');
    const outputs = [];

    for (const t of targets) {
      const raw = this.fs.getRawNode(t);
      const node = raw && raw.type === 'symlink' ? raw : this.fs.getNode(t);
      if (!node) {
        throw new Error(`stat: não foi possível obter estado de '${t}': Arquivo ou diretório não encontrado`);
      }
      const typeLabel =
        node.type === 'directory'
          ? 'diretório'
          : node.type === 'symlink'
          ? 'link simbólico'
          : (node.size || 0) === 0
          ? 'arquivo comum vazio'
          : 'arquivo comum';
      const typeChar = node.type === 'directory' ? 'd' : node.type === 'symlink' ? 'l' : '-';
      const permStr = typeChar + (node.permissions || 'rw-r--r--');
      const octal = this.fs.permissionsToOctal(node.permissions);
      const uid = node.owner === 'root' ? '0' : '1000';
      const gid = node.group === 'root' ? '0' : '1000';
      const blocks = Math.ceil((node.size || 0) / 512) * 8;
      const fileTitle = node.type === 'symlink' ? `${t} -> ${node.rawTarget || node.target}` : t;
      const isoDate = new Date(node.mtime || Date.now()).toISOString().replace('T', ' ').slice(0, 19) + '.000000000 +0000';

      outputs.push(
        `  Arquivo: ${fileTitle}\n` +
          `  Tamanho: ${node.size || 0}\t\tBlocos: ${blocks}\tBloco de E/S: 4096   ${typeLabel}\n` +
          `Dispositivo: 801h/2049d\tInode: ${node.inode || 1001}\tLinks: ${node.links || 1}\n` +
          `Acesso: (${octal}/${permStr})  Uid: ( ${uid.padStart(4)}/${(node.owner || 'user').padStart(8)})   Gid: ( ${gid.padStart(4)}/${(node.group || 'user').padStart(8)})\n` +
          `Acesso: ${isoDate}\n` +
          `Modif.: ${isoDate}\n` +
          `Alter.: ${isoDate}`
      );
    }

    return { output: outputs.join('\n'), code: 0 };
  }

  cmdFile(args) {
    const targets = args.filter(a => !a.startsWith('-'));
    if (targets.length === 0) throw new Error('file: operando de arquivo ausente');
    const lines = [];

    for (const t of targets) {
      const raw = this.fs.getRawNode(t);
      if (raw && raw.type === 'symlink') {
        lines.push(`${t}: symbolic link to ${raw.rawTarget || raw.target}`);
        continue;
      }
      const node = this.fs.getNode(t);
      if (!node) {
        lines.push(`${t}: cannot open \`${t}' (No such file or directory)`);
        continue;
      }
      if (node.type === 'directory') {
        lines.push(`${t}: directory`);
      } else if (node.isDeviceNull) {
        lines.push(`${t}: character special (1/3)`);
      } else if (t.endsWith('.db') || (node.content && node.content.startsWith('SQLite format 3'))) {
        lines.push(`${t}: SQLite 3.x database`);
      } else if (t.endsWith('.tar') || (node.content && node.content.startsWith('TAR_ARCHIVE'))) {
        lines.push(`${t}: POSIX tar archive (GNU)`);
      } else if (t.endsWith('.gz') || (node.content && node.content.startsWith('GZIPPED_'))) {
        lines.push(`${t}: gzip compressed data, from Unix`);
      } else if (t.endsWith('.zip') || node.zipEntries) {
        lines.push(`${t}: Zip archive data, at least v2.0 to extract`);
      } else if (node.content && node.content.startsWith('ELF 64-bit')) {
        lines.push(`${t}: ${node.content}`);
      } else if (node.content && node.content.startsWith('#!/bin/bash')) {
        lines.push(`${t}: Bourne-Again shell script, ASCII text executable`);
      } else if (!node.content || node.content.length === 0) {
        lines.push(`${t}: empty`);
      } else {
        lines.push(`${t}: UTF-8 Unicode text`);
      }
    }

    return { output: lines.join('\n'), code: 0 };
  }

  cmdMkdir(args) {
    let recursive = false;
    let modeSpec = null;
    const dirs = [];
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-p' || a === '--parents') recursive = true;
      else if ((a === '-m' || a === '--mode') && args[i + 1]) modeSpec = args[++i];
      else if (a.startsWith('-m') && a.length > 2) modeSpec = a.slice(2);
      else if (a.startsWith('-') && a.includes('p')) recursive = true;
      else if (!a.startsWith('-')) dirs.push(a);
    }
    if (dirs.length === 0) throw new Error('mkdir: operando ausente');
    const initialPerm = modeSpec ? this.fs.computePermissions('rwxr-xr-x', modeSpec) : 'rwxr-xr-x';
    for (const d of dirs) {
      this.fs.createDirectory(d, recursive, initialPerm);
    }
    return { output: '', code: 0 };
  }

  cmdTouch(args) {
    const files = args.filter(a => !a.startsWith('-'));
    if (files.length === 0) throw new Error('touch: operando de arquivo ausente');
    for (const f of files) {
      this.fs.createFile(f, '');
    }
    return { output: '', code: 0 };
  }

  cmdCat(args, stdin) {
    let showNumbers = false;
    const files = [];
    for (const a of args) {
      if (a === '-n' || a === '--number' || (a.startsWith('-') && a.includes('n'))) showNumbers = true;
      else if (!a.startsWith('-')) files.push(a);
    }

    let text = '';
    if (files.length === 0) {
      text = (stdin || '').replace(/\n$/, '');
    } else {
      text = files.map(f => this.fs.readFile(f).replace(/\n$/, '')).join('\n');
    }

    if (showNumbers) {
      const lines = text.split('\n');
      text = lines.map((l, i) => `     ${i + 1}  ${l}`).join('\n');
    }

    return { output: text, code: 0 };
  }

  cmdEcho(args) {
    let noNewline = false;
    let interpretEscapes = false;
    let startIdx = 0;
    while (startIdx < args.length && /^-[neE]+$/.test(args[startIdx])) {
      if (args[startIdx].includes('n')) noNewline = true;
      if (args[startIdx].includes('e')) interpretEscapes = true;
      if (args[startIdx].includes('E')) interpretEscapes = false;
      startIdx++;
    }
    let out = args.slice(startIdx).join(' ');
    if (interpretEscapes) {
      out = out.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r');
    }
    return { output: out, code: 0, trailingNewline: !noNewline };
  }

  cmdPrintf(args) {
    if (args.length === 0) return { output: '', code: 0, trailingNewline: false };
    const fmt = args[0];
    const vals = args.slice(1);
    let valIdx = 0;
    let formatted = '';
    let consumed = false;
    do {
      consumed = false;
      formatted += fmt.replace(/\\([ntr\\])|%([sSdDf%])/g, (m, esc, spec) => {
        if (esc) {
          if (esc === 'n') return '\n';
          if (esc === 't') return '\t';
          if (esc === 'r') return '\r';
          if (esc === '\\') return '\\';
          return m;
        }
        if (spec === '%') return '%';
        consumed = true;
        const v = valIdx < vals.length ? vals[valIdx++] : '';
        if (spec === 'd' || spec === 'D') return String(parseInt(v, 10) || 0);
        if (spec === 'f' || spec === 'F') return String(parseFloat(v) || 0);
        return String(v);
      });
    } while (consumed && valIdx < vals.length);
    const endsWithNl = formatted.endsWith('\n');
    if (endsWithNl) formatted = formatted.slice(0, -1);
    return { output: formatted, code: 0, trailingNewline: endsWithNl };
  }

  cmdCp(args) {
    let verbose = false;
    const paths = [];
    for (const a of args) {
      if (a === '--verbose' || (a.startsWith('-') && a.includes('v'))) verbose = true;
      else if (!a.startsWith('-')) paths.push(a);
    }
    if (paths.length < 2) throw new Error('cp: operando de arquivo de destino ausente');
    const sources = paths.slice(0, -1);
    const dest = paths[paths.length - 1];
    const verboseLines = [];
    for (const src of sources) {
      this.fs.copyFile(src, dest);
      if (verbose) verboseLines.push(`'${src}' -> '${dest}'`);
    }
    return { output: verboseLines.join('\n'), code: 0 };
  }

  cmdMv(args) {
    const paths = args.filter(a => !a.startsWith('-'));
    if (paths.length < 2) throw new Error('mv: operando de arquivo de destino ausente');
    const sources = paths.slice(0, -1);
    const dest = paths[paths.length - 1];
    for (const src of sources) {
      this.fs.moveFile(src, dest);
    }
    return { output: '', code: 0 };
  }

  cmdRm(args) {
    let recursive = false;
    let force = false;
    const paths = [];
    for (const a of args) {
      if (a === '--recursive') recursive = true;
      else if (a === '--force') force = true;
      else if (a.startsWith('-') && a.length > 1) {
        if (a.includes('r') || a.includes('R')) recursive = true;
        if (a.includes('f')) force = true;
      } else if (!a.startsWith('-')) {
        paths.push(a);
      }
    }
    if (paths.length === 0) {
      if (force) return { output: '', code: 0 };
      throw new Error('rm: operando ausente');
    }
    for (const p of paths) {
      if (recursive) this.fs.removeRecursive(p, force);
      else this.fs.removeFile(p, force);
    }
    return { output: '', code: 0 };
  }

  cmdRmdir(args) {
    const parents = args.some(a => a === '-p' || a === '--parents');
    const paths = args.filter(a => !a.startsWith('-'));
    if (paths.length === 0) throw new Error('rmdir: operando ausente');
    for (const p of paths) {
      this.fs.removeFile(p);
      if (parents) {
        let curr = this.fs.getParentPath(p);
        while (curr && curr !== '/' && curr !== this.fs.currentPath) {
          const node = this.fs.getNode(curr);
          if (node && node.type === 'directory' && Object.keys(node.children || {}).length === 0) {
            this.fs.removeFile(curr);
            curr = this.fs.getParentPath(curr);
          } else {
            break;
          }
        }
      }
    }
    return { output: '', code: 0 };
  }

  cmdGrep(args, stdin) {
    let ignoreCase = false;
    let recursive = false;
    let showLineNum = false;
    let invertMatch = false;
    let countOnly = false;
    let extendedRegex = false;
    let filesWithMatches = false;
    let forceWithFilename = false;
    let suppressFilename = false;
    let wordMatch = false;
    let quiet = false;
    let pattern = null;
    const files = [];

    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '--ignore-case') ignoreCase = true;
      else if (a === '--recursive') recursive = true;
      else if (a === '--count') countOnly = true;
      else if (a === '--extended-regexp') extendedRegex = true;
      else if (a === '--files-with-matches') filesWithMatches = true;
      else if (a === '--with-filename') forceWithFilename = true;
      else if (a === '--no-filename') suppressFilename = true;
      else if (a === '--word-regexp') wordMatch = true;
      else if (a === '--quiet' || a === '--silent') quiet = true;
      else if (a === '-e' && args[i + 1] !== undefined) pattern = args[++i];
      else if (a.startsWith('-') && a.length > 1) {
        if (a.includes('i')) ignoreCase = true;
        if (a.includes('r') || a.includes('R')) recursive = true;
        if (a.includes('n')) showLineNum = true;
        if (a.includes('v')) invertMatch = true;
        if (a.includes('c')) countOnly = true;
        if (a.includes('E')) extendedRegex = true;
        if (a.includes('l')) filesWithMatches = true;
        if (a.includes('H')) forceWithFilename = true;
        if (a.includes('h')) suppressFilename = true;
        if (a.includes('w')) wordMatch = true;
        if (a.includes('q')) quiet = true;
      } else if (pattern === null) {
        pattern = a;
      } else {
        files.push(a);
      }
    }

    if (pattern === null) throw new Error('grep: padrão de busca ausente');
    let regexSource = extendedRegex ? pattern : pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (wordMatch) regexSource = `\\b(?:${regexSource})\\b`;
    const reg = new RegExp(regexSource, ignoreCase ? 'i' : '');

    const matchedLines = [];
    const matchedFileNames = [];
    const perFileCounts = [];

    const checkContent = (content, prefix = '', targetLabel = '') => {
      const lines = (content || '').split('\n');
      let fileMatches = 0;
      lines.forEach((line, idx) => {
        if (!line && idx === lines.length - 1) return;
        const isMatch = reg.test(line);
        if (invertMatch ? !isMatch : isMatch) {
          fileMatches++;
          let out = line;
          if (showLineNum) out = `${idx + 1}:${out}`;
          if (prefix) out = `${prefix}:${out}`;
          matchedLines.push(out);
        }
      });
      if (fileMatches > 0 && targetLabel && !matchedFileNames.includes(targetLabel)) {
        matchedFileNames.push(targetLabel);
      }
      if (targetLabel) perFileCounts.push(`${prefix ? prefix + ':' : ''}${fileMatches}`);
    };

    const searchTarget = (targetPath, showPrefix) => {
      const node = this.fs.getNode(targetPath);
      if (!node) throw new Error(`grep: ${targetPath}: Arquivo ou diretório não encontrado`);
      if (node.type === 'file') {
        checkContent(node.content, showPrefix ? targetPath : '', targetPath);
      } else if (node.type === 'directory') {
        if (!recursive) throw new Error(`grep: ${targetPath}: É um diretório (use -r)`);
        for (const [k, child] of Object.entries(node.children || {})) {
          const subPath = targetPath === '.' ? k : `${targetPath.replace(/\/$/, '')}/${k}`;
          if (child.type === 'file') {
            checkContent(child.content, suppressFilename ? '' : subPath, subPath);
          } else if (child.type === 'directory') {
            searchTarget(subPath, true);
          }
        }
      }
    };

    if (files.length === 0) {
      if (recursive) {
        searchTarget('.', !suppressFilename);
      } else {
        checkContent(stdin, '', '');
      }
    } else {
      const showPrefix = !suppressFilename && (forceWithFilename || files.length > 1 || recursive);
      for (const f of files) {
        searchTarget(f, showPrefix);
      }
    }

    const foundAny = matchedLines.length > 0;
    if (quiet) return { output: '', code: foundAny ? 0 : 1 };
    if (filesWithMatches) {
      return { output: matchedFileNames.join('\n'), code: foundAny ? 0 : 1 };
    }
    if (countOnly) {
      if (perFileCounts.length > 1 || (perFileCounts.length === 1 && forceWithFilename)) {
        return { output: perFileCounts.join('\n'), code: foundAny ? 0 : 1 };
      }
      return { output: String(matchedLines.length), code: foundAny ? 0 : 1 };
    }
    return { output: matchedLines.join('\n'), code: foundAny ? 0 : 1 };
  }

  cmdFind(args) {
    let startPath = '.';
    let namePattern = null;
    let inamePattern = null;
    let typeFilter = null;
    let emptyOnly = false;
    let maxDepth = Infinity;
    let minDepth = 0;
    let userFilter = null;
    let permFilter = null;
    let deleteFound = false;
    let execTokens = null;

    let i = 0;
    if (args.length > 0 && !args[0].startsWith('-')) {
      startPath = args[0];
      i = 1;
    }

    for (; i < args.length; i++) {
      if (args[i] === '-name' && args[i + 1]) {
        namePattern = args[++i].replace(/^["']|["']$/g, '');
      } else if (args[i] === '-iname' && args[i + 1]) {
        inamePattern = args[++i].replace(/^["']|["']$/g, '');
      } else if (args[i] === '-type' && args[i + 1]) {
        typeFilter = args[++i];
      } else if (args[i] === '-empty') {
        emptyOnly = true;
      } else if (args[i] === '-maxdepth' && args[i + 1]) {
        maxDepth = parseInt(args[++i], 10);
      } else if (args[i] === '-mindepth' && args[i + 1]) {
        minDepth = parseInt(args[++i], 10);
      } else if (args[i] === '-user' && args[i + 1]) {
        userFilter = args[++i];
      } else if (args[i] === '-perm' && args[i + 1]) {
        permFilter = args[++i];
      } else if (args[i] === '-delete') {
        deleteFound = true;
      } else if (args[i] === '-exec') {
        execTokens = args.slice(i + 1);
        while (execTokens.length > 0 && [';', '\\;', '+'].includes(execTokens[execTokens.length - 1])) {
          execTokens.pop();
        }
        break;
      }
    }

    const results = [];
    const startNode = this.fs.getNode(startPath);
    if (!startNode) {
      throw new Error(`find: '${startPath}': Arquivo ou diretório não encontrado`);
    }

    const matchesWildcard = (name, pattern, ignoreCase = false) => {
      const regexStr =
        '^' +
        pattern
          .split('*')
          .map(s => s.split('?').map(p => p.replace(/[.+^${}()|[\]\\]/g, '\\$&')).join('.'))
          .join('.*') +
        '$';
      return new RegExp(regexStr, ignoreCase ? 'i' : '').test(name);
    };

    const traverse = (node, relPath, depth) => {
      if (!node || depth > maxDepth) return;
      let match = depth >= minDepth;
      const baseName = relPath === '.' ? '.' : this.fs.getFileName(relPath);

      if (namePattern && !matchesWildcard(baseName, namePattern, false)) match = false;
      if (inamePattern && !matchesWildcard(baseName, inamePattern, true)) match = false;
      if (typeFilter) {
        if (typeFilter === 'd' && node.type !== 'directory') match = false;
        if (typeFilter === 'f' && node.type !== 'file') match = false;
        if (typeFilter === 'l' && node.type !== 'symlink') match = false;
      }
      if (emptyOnly) {
        if (node.type === 'directory' && Object.keys(node.children || {}).length > 0) match = false;
        if (node.type === 'file' && (node.size || 0) > 0) match = false;
      }
      if (userFilter && node.owner !== userFilter) match = false;
      if (permFilter) {
        const oct = this.fs.permissionsToOctal(node.permissions).slice(1);
        if (oct !== permFilter && node.permissions !== permFilter) match = false;
      }

      if (match) results.push(relPath);

      if (node.type === 'directory' && this.fs.hasPermission(node, 'r')) {
        for (const [k, child] of Object.entries(node.children || {})) {
          if (k.startsWith('.') && namePattern && !namePattern.startsWith('.')) continue;
          const nextPath = relPath === '.' ? `./${k}` : `${relPath.replace(/\/$/, '')}/${k}`;
          traverse(child, nextPath, depth + 1);
        }
      }
    };

    traverse(startNode, startPath, 0);

    if (deleteFound) {
      for (const r of [...results].reverse()) {
        if (r === '.' || r === startPath) continue;
        try {
          this.fs.removeRecursive(r, true);
        } catch {}
      }
      return { output: '', code: 0 };
    }

    if (execTokens && execTokens.length > 0) {
      const outputs = [];
      for (const r of results) {
        const cmdTokens = execTokens.map(t => (t === '{}' ? r : t));
        const execRes = this.dispatchCommand(cmdTokens[0], cmdTokens.slice(1), '');
        if (execRes.output) outputs.push(execRes.output);
      }
      return { output: outputs.join('\n'), code: 0 };
    }

    return { output: results.join('\n'), code: 0 };
  }

  cmdHead(args, stdin) {
    let count = 10;
    const files = [];
    for (let i = 0; i < args.length; i++) {
      if ((args[i] === '-n' || args[i] === '--lines') && args[i + 1]) {
        count = parseInt(args[++i], 10);
      } else if (/^-\d+$/.test(args[i])) {
        count = parseInt(args[i].slice(1), 10);
      } else if (args[i].startsWith('-n') && args[i].length > 2) {
        count = parseInt(args[i].slice(2), 10);
      } else if (!args[i].startsWith('-')) {
        files.push(args[i]);
      }
    }
    if (files.length === 0) {
      const lines = (stdin || '').replace(/\n$/, '').split('\n').slice(0, count);
      return { output: lines.join('\n'), code: 0 };
    }
    if (files.length === 1) {
      const lines = this.fs.readFile(files[0]).replace(/\n$/, '').split('\n').slice(0, count);
      return { output: lines.join('\n'), code: 0 };
    }
    const sections = files.map(f => `==> ${f} <==\n` + this.fs.readFile(f).replace(/\n$/, '').split('\n').slice(0, count).join('\n'));
    return { output: sections.join('\n\n'), code: 0 };
  }

  cmdTail(args, stdin) {
    let count = 10;
    const files = [];
    for (let i = 0; i < args.length; i++) {
      if ((args[i] === '-n' || args[i] === '--lines') && args[i + 1]) {
        count = parseInt(args[++i], 10);
      } else if (/^-\d+$/.test(args[i])) {
        count = parseInt(args[i].slice(1), 10);
      } else if (args[i].startsWith('-n') && args[i].length > 2) {
        count = parseInt(args[i].slice(2), 10);
      } else if (!args[i].startsWith('-')) {
        files.push(args[i]);
      }
    }
    const tailText = (text) => {
      const lines = (text || '').replace(/\n$/, '').split('\n');
      return lines.slice(Math.max(0, lines.length - count)).join('\n');
    };
    if (files.length === 0) return { output: tailText(stdin), code: 0 };
    if (files.length === 1) return { output: tailText(this.fs.readFile(files[0])), code: 0 };
    return { output: files.map(f => `==> ${f} <==\n` + tailText(this.fs.readFile(f))).join('\n\n'), code: 0 };
  }

  cmdCut(args, stdin) {
    let delim = '\t';
    let field = 1;
    const files = [];
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-d' && args[i + 1] !== undefined) {
        delim = args[++i];
      } else if (a.startsWith('-d') && a.length > 2) {
        delim = a.slice(2);
      } else if (a === '-f' && args[i + 1] !== undefined) {
        field = parseInt(args[++i], 10);
      } else if (a.startsWith('-f') && a.length > 2) {
        field = parseInt(a.slice(2), 10);
      } else if (!a.startsWith('-')) {
        files.push(a);
      }
    }
    const content = files.length > 0 ? files.map(f => this.fs.readFile(f).replace(/\n$/, '')).join('\n') : (stdin || '').replace(/\n$/, '');
    const lines = content.split('\n').map(l => {
      const parts = l.split(delim);
      return parts[field - 1] !== undefined ? parts[field - 1] : l;
    });
    return { output: lines.join('\n'), code: 0 };
  }

  cmdTr(args, stdin) {
    let deleteMode = false;
    let squeezeMode = false;
    let complement = false;
    const nonOpts = [];
    for (const a of args) {
      if (a === '--delete') deleteMode = true;
      else if (a === '--squeeze-repeats') squeezeMode = true;
      else if (a === '--complement') complement = true;
      else if (a.startsWith('-') && a.length > 1) {
        for (const fl of a.slice(1)) {
          if (fl === 'd') deleteMode = true;
          else if (fl === 's') squeezeMode = true;
          else if (fl === 'c' || fl === 'C') complement = true;
        }
      } else {
        nonOpts.push(a);
      }
    }

    if ((!deleteMode && nonOpts.length > 2) || (deleteMode && !squeezeMode && nonOpts.length > 1) || nonOpts.length > 2) {
      const extra = nonOpts[deleteMode && !squeezeMode ? 1 : 2];
      return {
        output: `tr: operando extra '${extra}'\nNo Linux real, o tr lê apenas da entrada padrão (use '< ${extra}' ou 'cat ${extra} | tr ...').`,
        code: 1,
        type: 'error'
      };
    }

    const expandTrSet = (spec) => {
      if (!spec) return '';
      const classes = {
        '[:lower:]': 'abcdefghijklmnopqrstuvwxyz',
        '[:upper:]': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        '[:digit:]': '0123456789',
        '[:alpha:]': 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        '[:alnum:]': 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        '[:space:]': ' \t\n\r',
        '[:blank:]': ' \t'
      };
      let s = spec.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r').replace(/\\\\/g, '\\');
      for (const [k, v] of Object.entries(classes)) {
        if (s.includes(k)) s = s.split(k).join(v);
      }
      let expanded = '';
      for (let i = 0; i < s.length; i++) {
        if (i + 2 < s.length && s[i + 1] === '-' && s.charCodeAt(i) <= s.charCodeAt(i + 2)) {
          const start = s.charCodeAt(i);
          const end = s.charCodeAt(i + 2);
          for (let code = start; code <= end; code++) expanded += String.fromCharCode(code);
          i += 2;
        } else {
          expanded += s[i];
        }
      }
      return expanded;
    };

    const from = expandTrSet(nonOpts[0] || '');
    const to = expandTrSet(nonOpts[1] || '');
    const fromSet = new Set(from);
    const inFrom = (ch) => complement ? !fromSet.has(ch) : fromSet.has(ch);

    let text = stdin || '';

    if (deleteMode) {
      let out = '';
      for (const ch of text) {
        if (!inFrom(ch)) out += ch;
      }
      if (squeezeMode && to) {
        const sqSet = new Set(to);
        let sq = '';
        for (const ch of out) {
          if (sqSet.has(ch) && sq.endsWith(ch)) continue;
          sq += ch;
        }
        return { output: sq, code: 0 };
      }
      return { output: out, code: 0 };
    }

    if (from && to) {
      let out = '';
      for (const ch of text) {
        const idx = from.indexOf(ch);
        let mapped = idx !== -1 ? (to[Math.min(idx, to.length - 1)] || '') : ch;
        if (complement && !fromSet.has(ch)) mapped = to[to.length - 1] || ch;
        out += mapped;
      }
      if (squeezeMode) {
        const sqSet = new Set(to);
        let sq = '';
        for (const ch of out) {
          if (sqSet.has(ch) && sq.endsWith(ch)) continue;
          sq += ch;
        }
        return { output: sq, code: 0 };
      }
      return { output: out, code: 0 };
    }

    if (squeezeMode && from) {
      let sq = '';
      for (const ch of text) {
        if (inFrom(ch) && sq.endsWith(ch)) continue;
        sq += ch;
      }
      return { output: sq, code: 0 };
    }

    return { output: text, code: 0 };
  }

  cmdSort(args, stdin) {
    let numeric = false;
    let reverse = false;
    const files = [];
    for (const a of args) {
      if (a === '--numeric-sort' || (a.startsWith('-') && a.includes('n'))) numeric = true;
      if (a === '--reverse' || (a.startsWith('-') && a.includes('r'))) reverse = true;
      if (!a.startsWith('-')) files.push(a);
    }
    const content = files.length > 0 ? files.map(f => this.fs.readFile(f)).join('\n') : stdin;
    const lines = content.split('\n').filter(l => l.length > 0);
    lines.sort((a, b) => {
      if (numeric) {
        const numA = parseFloat(a.trim()) || 0;
        const numB = parseFloat(b.trim()) || 0;
        return reverse ? numB - numA : numA - numB;
      }
      return reverse ? b.localeCompare(a) : a.localeCompare(b);
    });
    return { output: lines.join('\n'), code: 0 };
  }

  cmdUniq(args, stdin) {
    let count = false;
    const files = [];
    for (const a of args) {
      if (a === '--count' || (a.startsWith('-') && a.includes('c'))) count = true;
      if (!a.startsWith('-')) files.push(a);
    }
    const content = files.length > 0 ? files.map(f => this.fs.readFile(f)).join('\n') : stdin;
    const lines = content.split('\n').filter(Boolean);
    const result = [];
    let prev = null;
    let currentCount = 0;

    for (const l of lines) {
      if (l === prev) {
        currentCount++;
      } else {
        if (prev !== null) {
          result.push(count ? `      ${currentCount} ${prev}` : prev);
        }
        prev = l;
        currentCount = 1;
      }
    }
    if (prev !== null) {
      result.push(count ? `      ${currentCount} ${prev}` : prev);
    }

    return { output: result.join('\n'), code: 0 };
  }

  cmdWc(args, stdin) {
    let lines = false;
    let words = false;
    let chars = false;
    const files = [];
    for (const a of args) {
      if (a === '--lines' || (a.startsWith('-') && a.includes('l'))) lines = true;
      if (a === '--words' || (a.startsWith('-') && a.includes('w'))) words = true;
      if (a === '--bytes' || a === '--chars' || (a.startsWith('-') && (a.includes('c') || a.includes('m')))) chars = true;
      if (!a.startsWith('-')) files.push(a);
    }

    const calcCounts = (content) => {
      const lineArr = content.split('\n');
      const lineCount = content.endsWith('\n') ? lineArr.length - 1 : lineArr.length;
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      const charCount = content.length;
      return { lineCount, wordCount, charCount };
    };

    const formatRow = (c, label) => {
      const suffix = label ? ' ' + label : '';
      if (lines && !words && !chars) return `${c.lineCount}${suffix}`;
      if (!lines && words && !chars) return `${c.wordCount}${suffix}`;
      if (!lines && !words && chars) return `${c.charCount}${suffix}`;
      return `  ${c.lineCount}  ${c.wordCount} ${c.charCount}${suffix}`;
    };

    if (files.length === 0) {
      return { output: formatRow(calcCounts(stdin || ''), ''), code: 0 };
    }

    const outRows = [];
    let totL = 0, totW = 0, totC = 0;
    for (const f of files) {
      const c = calcCounts(this.fs.readFile(f));
      totL += c.lineCount;
      totW += c.wordCount;
      totC += c.charCount;
      outRows.push(formatRow(c, f));
    }
    if (files.length > 1) {
      outRows.push(formatRow({ lineCount: totL, wordCount: totW, charCount: totC }, 'total'));
    }
    return { output: outRows.join('\n'), code: 0 };
  }

  cmdDiff(args) {
    const files = args.filter(a => !a.startsWith('-'));
    if (files.length < 2) throw new Error('diff: operando ausente após diff');
    const c1 = this.fs.readFile(files[0]);
    const c2 = this.fs.readFile(files[1]);
    if (c1 === c2) return { output: '', code: 0 };
    const l1 = c1.split('\n').map(l => `< ${l}`).join('\n');
    const l2 = c2.split('\n').map(l => `> ${l}`).join('\n');
    return {
      output: `1,${c1.split('\n').length}c1,${c2.split('\n').length}\n${l1}\n---\n${l2}`,
      code: 1
    };
  }

  cmdEnv(args = []) {
    const allEnv = {
      ...this.envVars,
      PWD: this.fs.currentPath,
      OLDPWD: this.fs.oldPath || this.fs.currentPath
    };
    if (args.length > 0 && !args[0].startsWith('-')) {
      const key = args[0];
      if (Object.prototype.hasOwnProperty.call(allEnv, key)) {
        return { output: String(allEnv[key]), code: 0 };
      }
      return { output: '', code: 1 };
    }
    const envLines = Object.entries(allEnv).map(([k, v]) => `${k}=${v}`);
    return { output: envLines.join('\n'), code: 0 };
  }

  cmdExport(args) {
    const clean = args.filter(a => a !== '-p');
    if (clean.length === 0) {
      const lines = Object.entries({
        ...this.envVars,
        PWD: this.fs.currentPath,
        OLDPWD: this.fs.oldPath || this.fs.currentPath
      })
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `declare -x ${k}="${v}"`);
      return { output: lines.join('\n'), code: 0 };
    }

    for (const arg of clean) {
      const eqIdx = arg.indexOf('=');
      if (eqIdx !== -1) {
        const name = arg.slice(0, eqIdx);
        const val = arg.slice(eqIdx + 1);
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
          return { output: `bash: export: '${arg}': não é um identificador válido`, code: 1, type: 'error' };
        }
        this.shellVars[name] = val;
        this.envVars[name] = val;
      } else {
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(arg)) {
          return { output: `bash: export: '${arg}': não é um identificador válido`, code: 1, type: 'error' };
        }
        const val = this.shellVars[arg] !== undefined ? this.shellVars[arg] : '';
        this.shellVars[arg] = val;
        this.envVars[arg] = val;
      }
    }
    return { output: '', code: 0 };
  }

  cmdUnset(args) {
    for (const name of args) {
      delete this.shellVars[name];
      delete this.envVars[name];
    }
    return { output: '', code: 0 };
  }

  cmdAlias(args) {
    const clean = args.filter(a => a !== '-p');
    if (clean.length === 0) {
      const lines = Object.entries(this.aliases)
        .filter(([k]) => Boolean(k && k.trim()))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `alias ${k}='${v}'`);
      return { output: lines.join('\n'), code: 0 };
    }

    const outLines = [];
    let code = 0;

    for (const arg of clean) {
      const eqIdx = arg.indexOf('=');
      if (eqIdx !== -1) {
        const name = arg.slice(0, eqIdx).trim();
        let val = arg.slice(eqIdx + 1);
        if (!name) {
          outLines.push(`bash: alias: \`${arg}': não encontrado`);
          code = 1;
          continue;
        }
        if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
          val = val.slice(1, -1);
        }
        this.aliases[name] = val;
      } else {
        if (Object.prototype.hasOwnProperty.call(this.aliases, arg)) {
          outLines.push(`alias ${arg}='${this.aliases[arg]}'`);
        } else {
          outLines.push(`bash: alias: ${arg}: não encontrado`);
          code = 1;
        }
      }
    }

    return { output: outLines.join('\n'), code, type: code !== 0 ? 'error' : 'text' };
  }

  cmdUnalias(args) {
    if (args.includes('-a')) {
      this.aliases = {};
      return { output: '', code: 0 };
    }
    const errs = [];
    for (const name of args) {
      if (Object.prototype.hasOwnProperty.call(this.aliases, name)) {
        delete this.aliases[name];
      } else {
        errs.push(`bash: unalias: ${name}: não encontrado`);
      }
    }
    if (errs.length > 0) {
      return { output: errs.join('\n'), code: 1, type: 'error' };
    }
    return { output: '', code: 0 };
  }

  cmdChmod(args) {
    let recursive = false;
    const nonOpts = [];
    for (const a of args) {
      if (a === '-R' || a === '--recursive') recursive = true;
      else if (a === '-v' || a === '--verbose' || a === '-f' || a === '--silent') continue;
      else nonOpts.push(a);
    }
    if (nonOpts.length < 2) throw new Error('chmod: operando ausente');
    const mode = nonOpts[0];
    const files = nonOpts.slice(1);

    const applyNode = (node) => {
      if (!node) return;
      node.permissions = this.fs.computePermissions(node.permissions, mode);
      node.ctime = Date.now();
      if (recursive && node.type === 'directory' && node.children) {
        for (const child of Object.values(node.children)) {
          applyNode(child);
        }
      }
    };

    for (const f of files) {
      const node = this.fs.getNode(f);
      if (!node) {
        throw new Error(`chmod: não foi possível acessar '${f}': Arquivo ou diretório não encontrado`);
      }
      applyNode(node);
    }
    return { output: '', code: 0 };
  }

  cmdUmask(args) {
    const clean = args.filter(a => a !== '-S');
    const symbolic = args.includes('-S');
    if (clean.length === 0) {
      const val = this.fs.umask || '0022';
      if (symbolic) {
        const mask = parseInt(val, 8) & 0o777;
        const perms = (~mask) & 0o777;
        const fmt = (bits) => `${bits & 4 ? 'r' : ''}${bits & 2 ? 'w' : ''}${bits & 1 ? 'x' : ''}`;
        return { output: `u=${fmt((perms >> 6) & 7)},g=${fmt((perms >> 3) & 7)},o=${fmt(perms & 7)}`, code: 0 };
      }
      return { output: val.padStart(4, '0'), code: 0 };
    }
    const raw = clean[0];
    if (!/^[0-7]{3,4}$/.test(raw)) {
      throw new Error(`umask: '${raw}': número octal inválido`);
    }
    this.fs.umask = raw.padStart(4, '0');
    return { output: '', code: 0 };
  }

  cmdChown(args) {
    let recursive = false;
    const nonOpts = [];
    for (const a of args) {
      if (a === '-R' || a === '--recursive') recursive = true;
      else if (!a.startsWith('-')) nonOpts.push(a);
    }
    if (nonOpts.length < 2) throw new Error('chown: operando ausente');
    if (!this.fs.sudoMode) {
      return { output: `chown: alterando proprietário de '${nonOpts[1]}': Operação não permitida (use sudo)`, code: 1, type: 'error' };
    }
    const spec = nonOpts[0];
    const [owner, group] = spec.split(':');
    const files = nonOpts.slice(1);

    const applyNode = (node) => {
      if (!node) return;
      if (owner) node.owner = owner;
      if (group) node.group = group;
      node.ctime = Date.now();
      if (recursive && node.type === 'directory' && node.children) {
        for (const child of Object.values(node.children)) {
          applyNode(child);
        }
      }
    };

    for (const f of files) {
      const node = this.fs.getNode(f);
      if (!node) {
        throw new Error(`chown: não foi possível acessar '${f}': Arquivo ou diretório não encontrado`);
      }
      applyNode(node);
    }
    return { output: '', code: 0 };
  }

  cmdPs(args) {
    const isAux = args.some(a => a === 'aux' || a === '-aux' || a === '-ef' || a === '-e' || a === '-A');
    if (isAux) {
      const header = 'USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND';
      const fullRows = [
        { pid: '1', row: 'root           1  0.0  0.2 169320 11200 ?        Ss   Jan03   0:04 /sbin/init' },
        { pid: '42', row: 'user          42  0.0  0.1  18400  5100 pts/0    Ss   07:31   0:00 /bin/bash' },
        { pid: '74', row: 'root          74  0.0  0.1   8536  2800 ?        Ss   Jan03   0:00 /usr/sbin/cron -f' },
        { pid: '88', row: 'root          88  0.0  0.2  15420  6400 ?        Ss   Jan03   0:01 sshd: /usr/sbin/sshd -D' },
        { pid: '123', row: 'root         123  0.3  0.2  45120  8200 ?        Ss   Jan03   0:08 nginx: master process /usr/sbin/nginx' },
        { pid: '124', row: 'www-data     124  0.0  0.1  45600  4800 ?        S    Jan03   0:01 nginx: worker process' },
        { pid: '210', row: 'root         210  0.1  0.8 920400 32100 ?        Ssl  Jan03   0:15 /usr/bin/dockerd -H fd://' },
        { pid: '456', row: 'user         456  0.0  0.1  10240  3100 pts/0    R+   10:45   0:00 ps ' + args.join(' ') }
      ].filter(item => {
        if (this.killedProcesses.has(item.pid)) return false;
        if (item.pid === '123' || item.pid === '124') return this.services.nginx.active;
        if (item.pid === '88') return this.services.ssh.active;
        if (item.pid === '210') return this.services.docker.active;
        if (item.pid === '74') return this.services.cron.active;
        return true;
      });
      return { output: [header, ...fullRows.map(r => r.row)].join('\n'), code: 0 };
    }

    const header = 'PID TTY          TIME CMD';
    const rows = [
      '  1 ?        00:00:01 systemd',
      ' 42 pts/0    00:00:00 bash',
      ' 123 ?        00:00:00 nginx: master process',
      ' 456 pts/0    00:00:00 ps'
    ].filter(r => {
      for (const k of this.killedProcesses) {
        if (r.trim().startsWith(k + ' ')) return false;
      }
      return true;
    });
    return { output: [header, ...rows].join('\n'), code: 0 };
  }

  cmdTop() {
    return {
      output: `top - 10:45:00 up 12 days,  3:14,  1 user,  load average: 0.08, 0.03, 0.01
Tarefas: 4 total, 1 em execução, 3 dormindo, 0 paradas, 0 zumbi
%Cpu(s):  1.2 us,  0.5 sy,  0.0 ni, 98.1 id,  0.1 wa,  0.0 hi,  0.1 si
MiB Mem :   3920.0 total,   1250.4 free,    850.2 used,   1819.4 buff/cache

  PID USUÁRIO  PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TEMPO+ COMANDO
  123 root     20   0   45120   8200   6100 S   0.3   0.2   0:00.08 nginx
   42 user     20   0   18400   5100   3200 S   0.0   0.1   0:00.12 bash`,
      code: 0
    };
  }

  cmdLn(args) {
    const isSymlink = args.includes('-s') || args.includes('--symbolic');
    const paths = args.filter(a => !a.startsWith('-'));
    if (paths.length < 2) throw new Error('ln: operando de arquivo ausente');
    if (isSymlink) {
      this.fs.createSymlink(paths[0], paths[1]);
    } else {
      this.fs.createHardlink(paths[0], paths[1]);
    }
    return { output: '', code: 0 };
  }

  cmdTar(args) {
    let isCreate = false;
    let isExtract = false;
    let isList = false;
    let isVerbose = false;
    let extractDir = null;
    let tarName = null;
    const cleanArgs = [];

    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if ((a === '-C' || a === '--directory') && args[i + 1]) {
        extractDir = args[++i];
      } else if (a === '-f' || a === '--file') {
        if (args[i + 1]) tarName = args[++i];
      } else if (a.startsWith('-f') && a.length > 2) {
        tarName = a.slice(2);
      } else if (a.startsWith('-') || (i === 0 && /^[cxtvzfjp]+$/.test(a))) {
        if (a.includes('c')) isCreate = true;
        if (a.includes('x')) isExtract = true;
        if (a.includes('t')) isList = true;
        if (a.includes('v')) isVerbose = true;
        if (a.includes('f') && args[i + 1] && !args[i + 1].startsWith('-')) {
          tarName = args[++i];
        }
      } else {
        cleanArgs.push(a);
      }
    }

    if (!tarName) tarName = cleanArgs.shift();
    if (!tarName) throw new Error('tar: você deve especificar uma das opções -Acdtrux');

    if (isCreate) {
      const targets = cleanArgs;
      if (targets.length === 0) {
        throw new Error('tar: recusando-se covardemente a criar um arquivo-tar vazio');
      }
      const entries = [];
      const filesData = [];

      const collectEntries = (relPath) => {
        const node = this.fs.getNode(relPath);
        if (!node) return;
        if (node.type === 'directory') {
          const dirEntry = relPath.endsWith('/') ? relPath : `${relPath}/`;
          entries.push(dirEntry);
          filesData.push({ path: dirEntry, type: 'directory', permissions: node.permissions });
          for (const k of Object.keys(node.children || {})) {
            collectEntries(`${relPath.replace(/\/$/, '')}/${k}`);
          }
        } else if (node.type === 'file') {
          entries.push(relPath);
          filesData.push({
            path: relPath,
            type: 'file',
            content: node.content || '',
            permissions: node.permissions || 'rw-r--r--'
          });
        }
      };

      for (const t of targets) {
        if (!this.fs.getNode(t)) {
          throw new Error(`tar: ${t}: Não foi possível stat: Arquivo ou diretório não encontrado`);
        }
        collectEntries(t);
      }

      this.fs.writeFile(tarName, `TAR_ARCHIVE_OF_${targets.join('_')}`);
      const tarNode = this.fs.getNode(tarName);
      if (tarNode) {
        tarNode.tarEntries = entries;
        tarNode.tarFilesData = filesData;
        tarNode.tarSource = targets[0];
      }
      return { output: isVerbose ? entries.join('\n') : '', code: 0 };
    }

    if (isList) {
      const tarNode = this.fs.getNode(tarName);
      if (!tarNode) {
        throw new Error(`tar: ${tarName}: Não foi possível open: Arquivo ou diretório não encontrado`);
      }
      const entries = tarNode.tarEntries || ['documents/', 'documents/readme.txt', 'documents/notes.txt'];
      return { output: entries.join('\n'), code: 0 };
    }

    if (isExtract) {
      const tarNode = this.fs.getNode(tarName);
      if (!tarNode) {
        throw new Error(`tar: ${tarName}: Não foi possível open: Arquivo ou diretório não encontrado`);
      }
      const filesData = tarNode.tarFilesData || tarNode.filesData;
      const entries = tarNode.tarEntries || ['projects/', 'projects/test.sh'];
      const baseDest = extractDir ? this.fs.resolvePath(extractDir) : this.fs.currentPath;
      if (extractDir && !this.fs.getNode(baseDest)) {
        throw new Error(`tar: ${extractDir}: Não foi possível chdir: Arquivo ou diretório não encontrado`);
      }

      if (filesData) {
        for (const item of filesData) {
          const destPath = `${baseDest === '/' ? '' : baseDest}/${item.path.replace(/^\.?\//, '')}`;
          if (item.type === 'directory') {
            try { this.fs.createDirectory(destPath.replace(/\/$/, ''), true, item.permissions); } catch {}
          } else {
            const parentDir = this.fs.getParentPath(destPath);
            try { this.fs.createDirectory(parentDir, true); } catch {}
            this.fs.writeFile(destPath, item.content || '');
            const created = this.fs.getNode(destPath);
            if (created && item.permissions) created.permissions = item.permissions;
          }
        }
      } else {
        for (const entry of entries) {
          const destPath = `${baseDest === '/' ? '' : baseDest}/${entry.replace(/^\.?\//, '')}`;
          if (entry.endsWith('/')) {
            try { this.fs.createDirectory(destPath.replace(/\/$/, ''), true); } catch {}
          } else if (!this.fs.getNode(destPath)) {
            const parentDir = this.fs.getParentPath(destPath);
            try { this.fs.createDirectory(parentDir, true); } catch {}
            this.fs.writeFile(destPath, '#!/bin/bash\necho "Hello, Linux!"\n');
          }
        }
      }
      return { output: isVerbose ? entries.join('\n') : '', code: 0 };
    }

    return { output: 'Uso do tar: tar [opções] [arquivo...]', code: 0 };
  }

  cmdGzip(args) {
    const isDecompress = args.includes('-d') || args.includes('--decompress');
    if (isDecompress) return this.cmdGunzip(args);

    const keep = args.includes('-k') || args.includes('--keep');
    const toStdout = args.includes('-c') || args.includes('--stdout');
    const file = args.find(a => !a.startsWith('-'));
    if (!file) throw new Error('gzip: arquivo ausente');
    const content = this.fs.readFile(file);
    if (toStdout) {
      return { output: `GZIPPED_${content}`, code: 0 };
    }
    const gzPath = `${file}.gz`;
    this.fs.writeFile(gzPath, `GZIPPED_${content}`);
    const gzNode = this.fs.getNode(gzPath);
    if (gzNode) gzNode.originalContent = content;
    if (!keep) {
      this.fs.removeFile(file);
    }
    return { output: '', code: 0 };
  }

  cmdGunzip(args) {
    const keep = args.includes('-k') || args.includes('--keep');
    const file = args.find(a => !a.startsWith('-'));
    if (!file) throw new Error('gunzip: arquivo ausente');
    const gzPath = file.endsWith('.gz') ? file : `${file}.gz`;
    const gzNode = this.fs.getNode(gzPath);
    const target = gzPath.replace(/\.gz$/, '');
    const original = (gzNode && gzNode.originalContent) || 'Notas de estudo:\n- Comando ls para exibir a lista de arquivos\n- Comando cd para navegar entre diretórios';
    this.fs.writeFile(target, original);
    if (gzNode && !keep) {
      try { this.fs.removeFile(gzPath); } catch {}
    }
    return { output: '', code: 0 };
  }

  cmdZcat(args) {
    const file = args.find(a => !a.startsWith('-'));
    if (!file) throw new Error('zcat: arquivo ausente');
    const gzPath = file.endsWith('.gz') ? file : `${file}.gz`;
    const gzNode = this.fs.getNode(gzPath);
    if (!gzNode) throw new Error(`zcat: ${gzPath}: Arquivo ou diretório não encontrado`);
    const original = gzNode.originalContent || (gzNode.content || '').replace(/^GZIPPED_/, '');
    return { output: original, code: 0 };
  }

  cmdZip(args) {
    const clean = args.filter(a => !a.startsWith('-'));
    if (clean.length < 2) throw new Error('zip: informe o arquivo .zip e os caminhos a compactar');
    const zipName = clean[0].endsWith('.zip') ? clean[0] : `${clean[0]}.zip`;
    const targets = clean.slice(1);
    const entries = [];
    const filesData = [];

    const collect = (relPath) => {
      const node = this.fs.getNode(relPath);
      if (!node) return;
      if (node.type === 'directory') {
        const d = relPath.endsWith('/') ? relPath : `${relPath}/`;
        entries.push(`  adding: ${d} (stored 0%)`);
        filesData.push({ path: d, type: 'directory' });
        for (const k of Object.keys(node.children || {})) {
          collect(`${relPath.replace(/\/$/, '')}/${k}`);
        }
      } else if (node.type === 'file') {
        entries.push(`  adding: ${relPath} (deflated 42%)`);
        filesData.push({ path: relPath, type: 'file', content: node.content || '' });
      }
    };

    for (const t of targets) collect(t);
    this.fs.writeFile(zipName, `ZIP_ARCHIVE_${targets.join('_')}`);
    const zipNode = this.fs.getNode(zipName);
    if (zipNode) zipNode.zipEntries = filesData;
    return { output: entries.join('\n'), code: 0 };
  }

  cmdUnzip(args) {
    const listOnly = args.includes('-l');
    let destDir = this.fs.currentPath;
    const clean = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-d' && args[i + 1]) destDir = this.fs.resolvePath(args[++i]);
      else if (!args[i].startsWith('-')) clean.push(args[i]);
    }
    const zipName = clean[0];
    if (!zipName) throw new Error('unzip: informe o arquivo .zip');
    const zipNode = this.fs.getNode(zipName);
    if (!zipNode) throw new Error(`unzip: não foi possível encontrar ${zipName}`);
    const filesData = zipNode.zipEntries || [];

    if (listOnly) {
      const rows = filesData.map(f => `     ${(f.content || '').length}  2026-01-15 10:30   ${f.path}`);
      return { output: [`Archive:  ${zipName}`, '  Length      Date    Time    Name', '---------  ---------- -----   ----', ...rows].join('\n'), code: 0 };
    }

    const out = [`Archive:  ${zipName}`];
    for (const item of filesData) {
      const target = `${destDir === '/' ? '' : destDir}/${item.path.replace(/^\.?\//, '')}`;
      if (item.type === 'directory') {
        try { this.fs.createDirectory(target.replace(/\/$/, ''), true); } catch {}
        out.push(`   creating: ${item.path}`);
      } else {
        const parent = this.fs.getParentPath(target);
        try { this.fs.createDirectory(parent, true); } catch {}
        this.fs.writeFile(target, item.content || '');
        out.push(`  inflating: ${item.path}`);
      }
    }
    return { output: out.join('\n'), code: 0 };
  }

  cmdDf(args) {
    const showType = args.some(a => a === '-T' || (a.startsWith('-') && a.includes('T')));
    const showInodes = args.some(a => a === '-i' || (a.startsWith('-') && a.includes('i')));
    if (showInodes) {
      return {
        output: `Sist. Arq.      Inodes IUsados  ILivres IUso% Montado em
/dev/sda1      3276800  142510  3134290    5% /
tmpfs           512000      18   511982    1% /tmp
udev            512000     380   511620    1% /dev`,
        code: 0
      };
    }
    if (showType) {
      return {
        output: `Sist. Arq.     Tipo     Tam. Usado Disp. Uso% Montado em
/dev/sda1      ext4      50G   12G   38G  24% /
tmpfs          tmpfs    2.0G  4.0K  2.0G   1% /tmp
udev           devtmpfs 2.0G     0  2.0G   0% /dev`,
        code: 0
      };
    }
    return {
      output: `Sist. Arq.      Tam. Usado Disp. Uso% Montado em
/dev/sda1        50G   12G   38G  24% /
tmpfs           2.0G  4.0K  2.0G   1% /tmp
udev            2.0G     0  2.0G   0% /dev`,
      code: 0
    };
  }

  cmdDu(args) {
    const h = args.some(a => a === '--human-readable' || (a.startsWith('-') && a.includes('h')));
    const summaryOnly = args.some(a => a === '--summarize' || (a.startsWith('-') && a.includes('s')));
    const targets = args.filter(a => !a.startsWith('-'));

    const formatKB = (kb) => (h ? `${kb}.0K` : String(kb));

    if (targets.length === 0 && !summaryOnly) {
      return {
        output: `${h ? '4.0K' : '4'}\t./projects
${h ? '8.0K' : '8'}\t./documents
${h ? '4.0K' : '4'}\t./downloads
${h ? '24K' : '24'}\t.`,
        code: 0
      };
    }

    const list = targets.length > 0 ? targets : ['.'];
    const lines = [];
    for (const t of list) {
      const node = this.fs.getNode(t);
      if (!node) throw new Error(`du: não foi possível acessar '${t}': Arquivo ou diretório não encontrado`);
      const bytes = this.fs.calculateDiskUsage(node);
      const kb = Math.max(4, Math.ceil(bytes / 1024));
      lines.push(`${formatKB(kb)}\t${t}`);
    }
    return { output: lines.join('\n'), code: 0 };
  }

  cmdSed(args, stdin) {
    let inPlace = false;
    let quiet = false;
    const scripts = [];
    const files = [];

    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-i' || a.startsWith('-i')) inPlace = true;
      else if (a === '-n' || a === '--quiet' || a === '--silent') quiet = true;
      else if (a === '-e' && args[i + 1]) scripts.push(args[++i]);
      else if (!a.startsWith('-')) {
        if (scripts.length === 0) scripts.push(a);
        else files.push(a);
      }
    }

    if (scripts.length === 0) throw new Error('sed: script ausente');
    const expr = scripts[0];

    const processText = (text) => {
      const rawLines = (text || '').replace(/\n$/, '').split('\n');
      const outLines = [];

      // s/pattern/replacement/flags
      if (expr.startsWith('s') && expr.length > 3) {
        const delim = expr[1];
        const parts = [];
        let curr = '';
        for (let i = 2; i < expr.length; i++) {
          if (expr[i] === '\\' && i + 1 < expr.length) {
            if (expr[i + 1] === delim) {
              curr += delim;
              i++;
            } else {
              curr += expr[i] + expr[i + 1];
              i++;
            }
          } else if (expr[i] === delim) {
            parts.push(curr);
            curr = '';
          } else {
            curr += expr[i];
          }
        }
        parts.push(curr);
        const pattern = parts[0] || '';
        const replacement = (parts[1] || '').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        const flagsStr = parts[2] || '';
        let regFlags = '';
        if (flagsStr.includes('g')) regFlags += 'g';
        if (flagsStr.includes('i')) regFlags += 'i';
        const regex = new RegExp(pattern, regFlags);
        const printMatchedOnly = quiet && flagsStr.includes('p');

        for (const line of rawLines) {
          if (regex.test(line)) {
            const replaced = line.replace(regex, replacement);
            outLines.push(replaced);
          } else if (!printMatchedOnly && !quiet) {
            outLines.push(line);
          }
        }
        return outLines.join('\n');
      }

      // /pattern/d ou /pattern/p
      const slashMatch = expr.match(/^\/(.+)\/([dp])$/);
      if (slashMatch) {
        const reg = new RegExp(slashMatch[1]);
        const action = slashMatch[2];
        for (const line of rawLines) {
          const matched = reg.test(line);
          if (action === 'd') {
            if (!matched && !quiet) outLines.push(line);
          } else if (action === 'p') {
            if (!quiet) outLines.push(line);
            if (matched) outLines.push(line);
          }
        }
        return outLines.join('\n');
      }

      // Range numérico: 1d, 2,4d, 1,5p, 3p
      const rangeMatch = expr.match(/^(\d+)(?:,(\d+|\$))?([dp])$/);
      if (rangeMatch) {
        const startLine = parseInt(rangeMatch[1], 10);
        const endLine = rangeMatch[2] === '$' ? rawLines.length : (rangeMatch[2] ? parseInt(rangeMatch[2], 10) : startLine);
        const action = rangeMatch[3];
        rawLines.forEach((line, idx) => {
          const lineNum = idx + 1;
          const inRange = lineNum >= startLine && lineNum <= endLine;
          if (action === 'd') {
            if (!inRange && !quiet) outLines.push(line);
          } else if (action === 'p') {
            if (!quiet) outLines.push(line);
            if (inRange) outLines.push(line);
          }
        });
        return outLines.join('\n');
      }

      return text;
    };

    if (files.length === 0) {
      return { output: processText(stdin), code: 0 };
    }

    if (inPlace) {
      for (const f of files) {
        const content = this.fs.readFile(f);
        const updated = processText(content);
        this.fs.writeFile(f, updated + (updated.endsWith('\n') ? '' : '\n'));
      }
      return { output: '', code: 0 };
    }

    const combined = files.map(f => processText(this.fs.readFile(f))).join('\n');
    return { output: combined, code: 0 };
  }

  cmdAwk(args, stdin) {
    let fieldSep = null;
    let program = null;
    const files = [];

    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-F' && args[i + 1] !== undefined) {
        fieldSep = args[++i];
      } else if (a.startsWith('-F') && a.length > 2) {
        fieldSep = a.slice(2);
      } else if (!a.startsWith('-') && program === null) {
        program = a;
      } else if (!a.startsWith('-')) {
        files.push(a);
      }
    }

    if (program === null) throw new Error('awk: programa ausente');
    const content = files.length > 0 ? files.map(f => this.fs.readFile(f)).join('\n') : stdin;
    const lines = (content || '').replace(/\n$/, '').split('\n').filter(l => l.length > 0 || files.length === 0);

    // Extrai filtro opcional (/regex/ ou condição de campo $N op VAL) com ou sem { ... }
    let filterRegex = null;
    let fieldCond = null;
    let body = program.trim();
    const buildFieldCond = (colSpec, op, rawValRaw) => {
      const isNr = colSpec === 'NR';
      const colIdx = isNr ? 0 : parseInt(colSpec.slice(1), 10);
      const rawVal = rawValRaw.trim().replace(/^['"]|['"]$/g, '');
      return (fields, line, nr) => {
        const left = isNr ? String(nr) : (colIdx === 0 ? line : (fields[colIdx - 1] !== undefined ? fields[colIdx - 1] : ''));
        const numL = Number(left);
        const numR = Number(rawVal);
        const bothNum = !Number.isNaN(numL) && !Number.isNaN(numR) && left !== '' && rawVal !== '';
        if (op === '==') return bothNum ? numL === numR : left === rawVal;
        if (op === '!=') return bothNum ? numL !== numR : left !== rawVal;
        if (op === '>') return bothNum ? numL > numR : left > rawVal;
        if (op === '<') return bothNum ? numL < numR : left < rawVal;
        if (op === '>=') return bothNum ? numL >= numR : left >= rawVal;
        if (op === '<=') return bothNum ? numL <= numR : left <= rawVal;
        return false;
      };
    };

    const filterMatch = body.match(/^\/(.+?)\/\s*\{(.*)\}$/s);
    const condMatch = body.match(/^(\$\d+|NR)\s*(==|!=|>=|<=|>|<)\s*([^{}]+?)\s*\{(.*)\}$/s);
    const filterOnlyMatch = body.match(/^\/(.+?)\/$/s);
    const condOnlyMatch = body.match(/^(\$\d+|NR)\s*(==|!=|>=|<=|>|<)\s*([^{}]+?)$/s);

    if (filterMatch) {
      filterRegex = new RegExp(filterMatch[1]);
      body = filterMatch[2].trim();
    } else if (condMatch) {
      fieldCond = buildFieldCond(condMatch[1], condMatch[2], condMatch[3]);
      body = condMatch[4].trim();
    } else if (filterOnlyMatch) {
      filterRegex = new RegExp(filterOnlyMatch[1]);
      body = 'print $0';
    } else if (condOnlyMatch) {
      fieldCond = buildFieldCond(condOnlyMatch[1], condOnlyMatch[2], condOnlyMatch[3]);
      body = 'print $0';
    } else if (body.startsWith('{') && body.endsWith('}')) {
      body = body.slice(1, -1).trim();
    }

    const outLines = [];
    lines.forEach((line, idx) => {
      if (filterRegex && !filterRegex.test(line)) return;
      const fields = fieldSep ? line.split(fieldSep) : line.trim().split(/\s+/);
      const nr = idx + 1;
      if (fieldCond && !fieldCond(fields, line, nr)) return;
      const nf = fields.length;

      if (!body || body === 'print' || body === 'print $0') {
        outLines.push(line);
        return;
      }

      if (body.startsWith('print ')) {
        const exprPart = body.slice(6).trim();
        // Divide argumentos do print por vírgula fora de aspas
        const parts = [];
        let curr = '';
        let inQ = null;
        for (let i = 0; i < exprPart.length; i++) {
          const ch = exprPart[i];
          if (ch === '"' || ch === "'") {
            inQ = inQ === ch ? null : (inQ || ch);
            curr += ch;
          } else if (ch === ',' && !inQ) {
            parts.push(curr.trim());
            curr = '';
          } else {
            curr += ch;
          }
        }
        if (curr.trim()) parts.push(curr.trim());

        const evalToken = (tok) => {
          if ((tok.startsWith('"') && tok.endsWith('"')) || (tok.startsWith("'") && tok.endsWith("'"))) {
            const inner = tok.slice(1, -1);
            return tok.startsWith('"') ? inner.replace(/\\t/g, '\t').replace(/\\n/g, '\n') : inner;
          }
          if (tok === 'NR') return String(nr);
          if (tok === 'NF') return String(nf);
          if (tok === '$0') return line;
          if (tok === '$NF') return fields[nf - 1] !== undefined ? fields[nf - 1] : '';
          const m = tok.match(/^\$(\d+)$/);
          if (m) {
            const col = parseInt(m[1], 10);
            return col === 0 ? line : (fields[col - 1] !== undefined ? fields[col - 1] : '');
          }
          return tok.replace(/\$(\d+)/g, (_, d) => {
            const col = parseInt(d, 10);
            return col === 0 ? line : (fields[col - 1] !== undefined ? fields[col - 1] : '');
          });
        };

        const evalPart = (part) => {
          const subToks = [];
          let c = '';
          let q = null;
          for (let i = 0; i < part.length; i++) {
            const ch = part[i];
            if (ch === '"' || ch === "'") {
              q = q === ch ? null : (q || ch);
              c += ch;
            } else if (/\s/.test(ch) && !q) {
              if (c) { subToks.push(c); c = ''; }
            } else {
              c += ch;
            }
          }
          if (c) subToks.push(c);
          return subToks.length > 1 ? subToks.map(evalToken).join('') : evalToken(part);
        };

        outLines.push(parts.map(evalPart).join(' '));
      }
    });

    return { output: outLines.join('\n'), code: 0 };
  }

  cmdXargs(args, stdin) {
    let replaceStr = null;
    let maxArgs = null;
    const cmdTokens = [];

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-I' && args[i + 1]) {
        replaceStr = args[++i];
      } else if (args[i] === '-n' && args[i + 1]) {
        maxArgs = parseInt(args[++i], 10);
      } else {
        cmdTokens.push(...args.slice(i));
        break;
      }
    }

    const baseCmd = cmdTokens.length > 0 ? cmdTokens : ['echo'];
    const items = (stdin || '').trim().split(/\s+/).filter(Boolean);
    if (items.length === 0) return { output: '', code: 0 };

    if (replaceStr) {
      const outs = [];
      for (const item of items) {
        const expanded = baseCmd.map(t => t.split(replaceStr).join(item));
        const res = this.dispatchCommand(expanded[0], expanded.slice(1), '');
        if (res.output) outs.push(res.output);
      }
      return { output: outs.join('\n'), code: 0 };
    }

    if (maxArgs && maxArgs > 0) {
      const outs = [];
      for (let i = 0; i < items.length; i += maxArgs) {
        const chunk = items.slice(i, i + maxArgs);
        const res = this.dispatchCommand(baseCmd[0], [...baseCmd.slice(1), ...chunk], '');
        if (res.output) outs.push(res.output);
      }
      return { output: outs.join('\n'), code: 0 };
    }

    return this.dispatchCommand(baseCmd[0], [...baseCmd.slice(1), ...items], '');
  }

  cmdTee(args, stdin) {
    const append = args.some(a => a === '-a' || a === '--append');
    const files = args.filter(a => !a.startsWith('-'));
    const content = stdin + (stdin && !stdin.endsWith('\n') ? '\n' : '');
    for (const f of files) {
      this.fs.writeFile(f, content, append);
    }
    return { output: stdin, code: 0 };
  }

  cmdTac(args, stdin) {
    const files = args.filter(a => !a.startsWith('-'));
    const text = files.length > 0 ? files.map(f => this.fs.readFile(f)).join('\n') : stdin;
    const lines = (text || '').replace(/\n$/, '').split('\n').reverse();
    return { output: lines.join('\n'), code: 0 };
  }

  cmdRev(args, stdin) {
    const files = args.filter(a => !a.startsWith('-'));
    const text = files.length > 0 ? files.map(f => this.fs.readFile(f)).join('\n') : stdin;
    const lines = (text || '').replace(/\n$/, '').split('\n').map(l => l.split('').reverse().join(''));
    return { output: lines.join('\n'), code: 0 };
  }

  cmdNl(args, stdin) {
    const files = args.filter(a => !a.startsWith('-'));
    const text = files.length > 0 ? files.map(f => this.fs.readFile(f)).join('\n') : stdin;
    const lines = (text || '').replace(/\n$/, '').split('\n');
    let count = 1;
    const out = lines.map(l => (l.trim() ? `     ${count++}\t${l}` : `       \t${l}`));
    return { output: out.join('\n'), code: 0 };
  }

  cmdPaste(args, stdin) {
    let delim = '\t';
    const files = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-d' && args[i + 1]) delim = args[++i];
      else if (args[i].startsWith('-d') && args[i].length > 2) delim = args[i].slice(2);
      else if (!args[i].startsWith('-')) files.push(args[i]);
    }
    if (files.length === 0) return { output: stdin, code: 0 };
    const cols = files.map(f => this.fs.readFile(f).replace(/\n$/, '').split('\n'));
    const maxLen = Math.max(...cols.map(c => c.length));
    const rows = [];
    for (let r = 0; r < maxLen; r++) {
      rows.push(cols.map(c => c[r] || '').join(delim));
    }
    return { output: rows.join('\n'), code: 0 };
  }

  cmdColumn(args, stdin) {
    const files = args.filter(a => !a.startsWith('-'));
    const text = files.length > 0 ? files.map(f => this.fs.readFile(f)).join('\n') : stdin;
    const lines = (text || '').replace(/\n$/, '').split('\n').filter(Boolean);
    const grid = lines.map(l => l.trim().split(/\s+/));
    const colWidths = [];
    for (const row of grid) {
      row.forEach((cell, idx) => {
        colWidths[idx] = Math.max(colWidths[idx] || 0, cell.length);
      });
    }
    const formatted = grid.map(row => row.map((cell, idx) => cell.padEnd(colWidths[idx] + 2)).join('').trimEnd());
    return { output: formatted.join('\n'), code: 0 };
  }

  cmdChecksum(cmd, args, stdin) {
    const files = args.filter(a => !a.startsWith('-'));
    const hashStr = (str, len) => {
      let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
      for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      const hex = (Math.abs(h1).toString(16) + Math.abs(h2).toString(16)).repeat(8);
      return hex.slice(0, len);
    };
    const hexLen = cmd === 'sha256sum' ? 64 : 32;
    if (files.length === 0) {
      return { output: `${hashStr(stdin || '', hexLen)}  -`, code: 0 };
    }
    const out = files.map(f => `${hashStr(this.fs.readFile(f), hexLen)}  ${f}`);
    return { output: out.join('\n'), code: 0 };
  }

  cmdBase64(args, stdin) {
    const decode = args.some(a => a === '-d' || a === '--decode');
    const files = args.filter(a => !a.startsWith('-'));
    const text = files.length > 0 ? this.fs.readFile(files[0]) : stdin;
    if (decode) {
      try {
        const decoded = typeof Buffer !== 'undefined'
          ? Buffer.from(text.trim(), 'base64').toString('utf8')
          : decodeURIComponent(escape(atob(text.trim())));
        return { output: decoded, code: 0 };
      } catch {
        return { output: 'base64: entrada inválida', code: 1, type: 'error' };
      }
    }
    const encoded = typeof Buffer !== 'undefined'
      ? Buffer.from(text || '', 'utf8').toString('base64')
      : btoa(unescape(encodeURIComponent(text || '')));
    return { output: encoded, code: 0 };
  }

  cmdId(args) {
    const targetUser = args.find(a => !a.startsWith('-')) || (this.fs.sudoMode ? 'root' : 'user');
    const isRoot = targetUser === 'root';
    if (args.includes('-u')) {
      return { output: args.includes('-n') ? (isRoot ? 'root' : 'user') : (isRoot ? '0' : '1000'), code: 0 };
    }
    if (args.includes('-g')) {
      return { output: args.includes('-n') ? (isRoot ? 'root' : 'user') : (isRoot ? '0' : '1000'), code: 0 };
    }
    if (args.includes('-G')) {
      return { output: args.includes('-n') ? (isRoot ? 'root' : 'user sudo docker') : (isRoot ? '0' : '1000 27 999'), code: 0 };
    }
    if (isRoot) {
      return { output: 'uid=0(root) gid=0(root) grupos=0(root)', code: 0 };
    }
    const passwd = this.fs.readFile('/etc/passwd');
    const customMatch = passwd.split('\n').find(l => l.startsWith(`${targetUser}:`));
    if (customMatch && targetUser !== 'user' && targetUser !== 'penguin') {
      const parts = customMatch.split(':');
      const uid = parts[2] || '1001';
      const gid = parts[3] || '1001';
      return { output: `uid=${uid}(${targetUser}) gid=${gid}(${targetUser}) grupos=${gid}(${targetUser})`, code: 0 };
    }
    return { output: 'uid=1000(user) gid=1000(user) grupos=1000(user),27(sudo),999(docker)', code: 0 };
  }

  cmdGroups(args) {
    const target = args.find(a => !a.startsWith('-')) || (this.fs.sudoMode ? 'root' : 'user');
    const passwdContent = this.fs.readFile('/etc/passwd');
    const userLine = passwdContent.split('\n').find(l => l.startsWith(`${target}:`));
    if (!userLine && target !== 'user' && target !== 'penguin' && target !== 'root') {
      return { output: `groups: '${target}': usuário inexistente`, code: 1, type: 'error' };
    }
    const groupLines = this.fs.readFile('/etc/group').split('\n').filter(Boolean);
    const primaryGid = userLine ? userLine.split(':')[3] : null;
    const foundGroups = [];
    for (const line of groupLines) {
      const [gName, , gid, membersStr] = line.split(':');
      const members = (membersStr || '').split(',').filter(Boolean);
      if (gName === target || (primaryGid && gid === primaryGid) || members.includes(target)) {
        if (!foundGroups.includes(gName)) foundGroups.push(gName);
      }
    }
    if (foundGroups.length === 0) foundGroups.push(target);
    return { output: args.length > 0 ? `${target} : ${foundGroups.join(' ')}` : foundGroups.join(' '), code: 0 };
  }

  cmdUseradd(args) {
    if (!this.fs.sudoMode) {
      return { output: 'useradd: Permissão negada.\nuseradd: não foi possível travar /etc/passwd; tente novamente com sudo.', code: 1, type: 'error' };
    }
    let createHome = false;
    let shell = '/bin/bash';
    let homeDir = null;
    let uidOpt = null;
    let groupsSpec = null;
    let username = null;
    const skipValueFlags = new Set(['-b', '--base-dir', '-c', '--comment', '-e', '--expiredate', '-f', '--inactive', '-g', '--gid', '-k', '--skel', '-K', '--key', '-p', '--password', '-R', '--root', '-P', '--prefix']);
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-m' || a === '--create-home') createHome = true;
      else if ((a === '-s' || a === '--shell') && args[i + 1]) shell = args[++i];
      else if ((a === '-d' || a === '--home-dir') && args[i + 1]) homeDir = args[++i];
      else if ((a === '-u' || a === '--uid') && args[i + 1]) uidOpt = parseInt(args[++i], 10);
      else if ((a === '-G' || a === '--groups') && args[i + 1]) groupsSpec = args[++i];
      else if (skipValueFlags.has(a) && args[i + 1] !== undefined) i++;
      else if (!a.startsWith('-')) username = a;
    }
    if (!username) {
      return { output: 'Uso: useradd [opções] LOGIN', code: 2, type: 'error' };
    }
    const passwdContent = this.fs.readFile('/etc/passwd');
    if (passwdContent.split('\n').some(l => l.startsWith(`${username}:`))) {
      return { output: `useradd: usuário '${username}' já existe`, code: 9, type: 'error' };
    }
    const uid = Number.isFinite(uidOpt) ? uidOpt : (1001 + passwdContent.split('\n').filter(Boolean).length);
    const targetHome = homeDir || `/home/${username}`;
    this.fs.writeFile('/etc/passwd', passwdContent.trimEnd() + `\n${username}:x:${uid}:${uid}::${targetHome}:${shell}\n`);
    const groupContent = this.fs.readFile('/etc/group');
    if (!groupContent.split('\n').some(l => l.startsWith(`${username}:`))) {
      this.fs.writeFile('/etc/group', groupContent.trimEnd() + `\n${username}:x:${uid}:\n`);
    }
    if (groupsSpec) {
      const targetGroups = groupsSpec.split(',').map(g => g.trim()).filter(Boolean);
      const updated = this.fs.readFile('/etc/group').split('\n').filter(Boolean).map(line => {
        const parts = line.split(':');
        if (targetGroups.includes(parts[0])) {
          const members = (parts[3] || '').split(',').filter(Boolean);
          if (!members.includes(username)) members.push(username);
          parts[3] = members.join(',');
          return parts.join(':');
        }
        return line;
      });
      this.fs.writeFile('/etc/group', updated.join('\n') + '\n');
    }
    if (createHome) {
      try {
        this.fs.createDirectory(targetHome, true, 'rwxr-xr-x', username);
        const homeNode = this.fs.getNode(targetHome);
        if (homeNode) {
          homeNode.owner = username;
          homeNode.group = username;
        }
      } catch {}
    }
    return { output: '', code: 0 };
  }

  cmdGroupadd(args) {
    if (!this.fs.sudoMode) {
      return { output: 'groupadd: Permissão negada.\ngroupadd: não foi possível travar /etc/group; tente novamente com sudo.', code: 1, type: 'error' };
    }
    let gidOpt = null;
    let groupName = null;
    const skipValueFlags = new Set(['-K', '--key', '-p', '--password', '-R', '--root', '-P', '--prefix']);
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if ((a === '-g' || a === '--gid') && args[i + 1]) gidOpt = parseInt(args[++i], 10);
      else if (skipValueFlags.has(a) && args[i + 1] !== undefined) i++;
      else if (!a.startsWith('-')) groupName = a;
    }
    if (!groupName) {
      return { output: 'Uso: groupadd [opções] GRUPO', code: 2, type: 'error' };
    }
    const groupContent = this.fs.readFile('/etc/group');
    if (groupContent.split('\n').some(l => l.startsWith(`${groupName}:`))) {
      return { output: `groupadd: grupo '${groupName}' já existe`, code: 9, type: 'error' };
    }
    const gid = Number.isFinite(gidOpt) ? gidOpt : (1050 + groupContent.split('\n').filter(Boolean).length);
    this.fs.writeFile('/etc/group', groupContent.trimEnd() + `\n${groupName}:x:${gid}:\n`);
    return { output: '', code: 0 };
  }

  cmdUsermod(args) {
    if (!this.fs.sudoMode) {
      return { output: 'usermod: Permissão negada.\nusermod: não foi possível travar /etc/group; tente novamente com sudo.', code: 1, type: 'error' };
    }
    let append = false;
    let groupsSpec = null;
    let username = null;
    const skipValueFlags = new Set(['-c', '--comment', '-d', '--home', '-e', '--expiredate', '-f', '--inactive', '-g', '--gid', '-l', '--login', '-p', '--password', '-R', '--root', '-s', '--shell', '-u', '--uid']);
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-a') append = true;
      else if (a === '-aG' && args[i + 1]) { append = true; groupsSpec = args[++i]; }
      else if ((a === '-G' || a === '--groups') && args[i + 1]) { groupsSpec = args[++i]; }
      else if (skipValueFlags.has(a) && args[i + 1] !== undefined) i++;
      else if (!a.startsWith('-')) { username = a; }
    }
    if (!username) {
      return { output: 'Uso: usermod [opções] LOGIN', code: 2, type: 'error' };
    }
    const passwdContent = this.fs.readFile('/etc/passwd');
    if (!passwdContent.split('\n').some(l => l.startsWith(`${username}:`))) {
      return { output: `usermod: usuário '${username}' não existe`, code: 6, type: 'error' };
    }
    if (groupsSpec) {
      const targetGroups = groupsSpec.split(',').map(g => g.trim()).filter(Boolean);
      const groupLines = this.fs.readFile('/etc/group').split('\n').filter(Boolean);
      for (const tg of targetGroups) {
        if (!groupLines.some(l => l.startsWith(`${tg}:`))) {
          return { output: `usermod: grupo '${tg}' não existe`, code: 6, type: 'error' };
        }
      }
      const updated = groupLines.map(line => {
        const parts = line.split(':');
        const gName = parts[0];
        const members = (parts[3] || '').split(',').filter(Boolean);
        if (targetGroups.includes(gName)) {
          if (!members.includes(username)) members.push(username);
        } else if (!append) {
          const idx = members.indexOf(username);
          if (idx !== -1) members.splice(idx, 1);
        }
        parts[3] = members.join(',');
        return parts.join(':');
      });
      this.fs.writeFile('/etc/group', updated.join('\n') + '\n');
    }
    return { output: '', code: 0 };
  }

  cmdPasswd(args) {
    let targetUser = null;
    const skipValueFlags = new Set(['-n', '--mindays', '-x', '--maxdays', '-w', '--warndays', '-i', '--inactive', '-R', '--root']);
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (skipValueFlags.has(a) && args[i + 1] !== undefined) i++;
      else if (!a.startsWith('-')) { targetUser = a; break; }
    }
    targetUser = targetUser || (this.fs.sudoMode ? 'root' : 'user');
    const passwdContent = this.fs.readFile('/etc/passwd');
    if (!passwdContent.split('\n').some(l => l.startsWith(`${targetUser}:`))) {
      return { output: `passwd: usuário '${targetUser}' não existe`, code: 1, type: 'error' };
    }
    if (targetUser !== 'user' && !this.fs.sudoMode) {
      return { output: `passwd: você não pode ver ou alterar a informação de senha para ${targetUser}`, code: 1, type: 'error' };
    }
    return { output: `passwd: todas as fichas de autenticação foram atualizadas com sucesso para ${targetUser}.`, code: 0 };
  }

  cmdUserdel(args) {
    if (!this.fs.sudoMode) {
      return { output: 'userdel: Permissão negada.\nuserdel: não foi possível travar /etc/passwd; tente novamente com sudo.', code: 1, type: 'error' };
    }
    let removeHome = false;
    let username = null;
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-r' || a === '--remove') removeHome = true;
      else if ((a === '-R' || a === '--root' || a === '-P' || a === '--prefix') && args[i + 1]) i++;
      else if (!a.startsWith('-')) username = a;
    }
    if (!username) {
      return { output: 'Uso: userdel [opções] LOGIN', code: 2, type: 'error' };
    }
    const passwdLines = this.fs.readFile('/etc/passwd').split('\n');
    const filtered = passwdLines.filter(l => !l.startsWith(`${username}:`));
    if (filtered.length === passwdLines.length) {
      return { output: `userdel: usuário '${username}' não existe`, code: 6, type: 'error' };
    }
    this.fs.writeFile('/etc/passwd', filtered.join('\n'));
    if (removeHome) {
      try { this.fs.removeRecursive(`/home/${username}`, true); } catch {}
    }
    return { output: '', code: 0 };
  }

  cmdPgrep(args) {
    const listName = args.includes('-l');
    const pattern = args.find(a => !a.startsWith('-'));
    if (!pattern) return { output: 'pgrep: nenhum critério de correspondência especificado', code: 2, type: 'error' };
    const bgProcs = this.backgroundJobs.map(j => ({ pid: j.pid, name: j.cmd }));
    const procs = [
      { pid: '1', name: 'systemd' },
      { pid: '42', name: 'bash' },
      { pid: '74', name: 'cron', active: this.services.cron.active },
      { pid: '88', name: 'sshd', active: this.services.ssh.active },
      { pid: '123', name: 'nginx', active: this.services.nginx.active },
      { pid: '210', name: 'dockerd', active: this.services.docker.active },
      ...bgProcs
    ].filter(p => (p.active === undefined || p.active) && !this.killedProcesses.has(p.pid) && p.name.includes(pattern));

    if (procs.length === 0) return { output: '', code: 1 };
    return {
      output: procs.map(p => (listName ? `${p.pid} ${p.name}` : p.pid)).join('\n'),
      code: 0
    };
  }

  cmdPkill(args) {
    const pattern = args.find(a => !a.startsWith('-'));
    if (!pattern) return { output: 'pkill: nenhum critério especificado', code: 2, type: 'error' };
    if (pattern.includes('nginx')) {
      this.killedProcesses.add('123');
      this.killedProcesses.add('124');
    } else if (pattern.includes('ssh')) {
      this.killedProcesses.add('88');
    } else if (pattern.includes('cron')) {
      this.killedProcesses.add('74');
    }
    this.backgroundJobs = this.backgroundJobs.filter(j => {
      if (j.cmd.includes(pattern)) {
        this.killedProcesses.add(j.pid);
        return false;
      }
      return true;
    });
    return { output: '', code: 0 };
  }

  cmdFree(args) {
    const h = args.some(a => a === '-h' || a === '--human');
    if (h) {
      return {
        output: `               total        usada        livre    compart.  buff/cache  disponível
Mem.:          3,8Gi       850Mi       1,2Gi        18Mi       1,8Gi       2,7Gi
Swap:          2,0Gi          0B       2,0Gi`,
        code: 0
      };
    }
    return {
      output: `               total        used        free      shared  buff/cache   available
Mem:         4014080      870400     1280000       18432     1863680     2845120
Swap:        2097152           0     2097152`,
      code: 0
    };
  }

  cmdLscpu() {
    return {
      output: `Arquitetura:                x86_64
  Modo(s) operacional CPU:  32-bit, 64-bit
  Tamanhos de endereço:     48 bits physical, 48 bits virtual
  Ordem dos bytes:          Little Endian
CPU(s):                     4
  Lista de CPU(s) on-line:  0-3
ID de fornecedor:           GenuineIntel
  Nome do modelo:           Intel(R) Xeon(R) CPU @ 2.20GHz
  CPU MHz:                  2200.000
  Cache L1d:                128 KiB (4 instances)
  Cache L2:                 1 MiB (4 instances)
  Cache L3:                 55 MiB (1 instance)`,
      code: 0
    };
  }

  cmdLsblk() {
    return {
      output: `NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
sda      8:0    0   52G  0 disk 
├─sda1   8:1    0   50G  0 part /
└─sda2   8:2    0    2G  0 part [SWAP]`,
      code: 0
    };
  }

  cmdSystemctl(args) {
    const clean = args.filter(a => !a.startsWith('-'));
    const action = clean[0] || 'list-units';
    const targetName = (clean[1] || '').replace(/\.service$/, '');
    const serviceKey = targetName === 'sshd' ? 'ssh' : targetName;

    if (action === 'list-units') {
      const lines = [
        '  UNIT               LOAD   ACTIVE   SUB     DESCRIPTION',
        ...Object.entries(this.services).map(([name, s]) => {
          const act = s.active ? 'active  ' : 'inactive';
          const sub = s.active ? 'running' : 'dead   ';
          return `  ${(name + '.service').padEnd(18)} loaded ${act} ${sub} ${s.desc}`;
        })
      ];
      return { output: lines.join('\n'), code: 0 };
    }

    if (!targetName) {
      return { output: `systemctl: nome da unidade necessário para ${action}`, code: 1, type: 'error' };
    }

    const svc = this.services[serviceKey];
    if (!svc) {
      return { output: `Unit ${targetName}.service could not be found.`, code: 4, type: 'error' };
    }

    if (action === 'is-active') {
      return { output: svc.active ? 'active' : 'inactive', code: svc.active ? 0 : 3 };
    }
    if (action === 'is-enabled') {
      return { output: svc.enabled ? 'enabled' : 'disabled', code: svc.enabled ? 0 : 1 };
    }
    if (action === 'status') {
      const dot = svc.active ? '●' : '○';
      const stateStr = svc.active ? 'active (running)' : 'inactive (dead)';
      const enStr = svc.enabled ? 'enabled' : 'disabled';
      return {
        output: `${dot} ${targetName}.service - ${svc.desc}
     Loaded: loaded (/lib/systemd/system/${targetName}.service; ${enStr}; preset: enabled)
     Active: ${stateStr} since Thu 2026-01-15 07:31:02 UTC; 3h 14min ago
   Main PID: ${svc.active ? svc.pid : 0} (${targetName})
      Tasks: ${svc.active ? 2 : 0} (limit: 4658)
     Memory: ${svc.active ? '8.2M' : '0B'}
        CPU: 120ms
     CGroup: /system.slice/${targetName}.service

Jan 15 07:31:01 penguin-gym systemd[1]: Starting ${targetName}.service - ${svc.desc}...
Jan 15 07:31:02 penguin-gym systemd[1]: Started ${targetName}.service - ${svc.desc}.`,
        code: svc.active ? 0 : 3
      };
    }

    if (['start', 'stop', 'restart', 'reload', 'enable', 'disable'].includes(action)) {
      if (!this.fs.sudoMode) {
        return {
          output: `Failed to ${action} ${targetName}.service: Access denied\nSee system logs and 'systemctl status ${targetName}.service' for details.`,
          code: 1,
          type: 'error'
        };
      }
      if (action === 'start' || action === 'restart' || action === 'reload') {
        svc.active = true;
        if (serviceKey === 'nginx') {
          this.killedProcesses.delete('123');
          this.killedProcesses.delete('124');
        } else if (serviceKey === 'ssh') {
          this.killedProcesses.delete('88');
        } else if (serviceKey === 'cron') {
          this.killedProcesses.delete('74');
        } else if (serviceKey === 'docker') {
          this.killedProcesses.delete('210');
        } else if (serviceKey === 'postgresql') {
          this.killedProcesses.delete('280');
        }
      } else if (action === 'stop') {
        svc.active = false;
      } else if (action === 'enable') {
        svc.enabled = true;
        return { output: `Created symlink /etc/systemd/system/multi-user.target.wants/${targetName}.service → /lib/systemd/system/${targetName}.service.`, code: 0 };
      } else if (action === 'disable') {
        svc.enabled = false;
        return { output: `Removed "/etc/systemd/system/multi-user.target.wants/${targetName}.service".`, code: 0 };
      }
      return { output: '', code: 0 };
    }

    return { output: `systemctl: operação desconhecida '${action}'`, code: 1, type: 'error' };
  }

  cmdService(args) {
    if (args.length < 2) {
      return { output: 'Uso: service < opcoes > | --status-all | [ nome_do_servico [ comando | --full-restart ] ]', code: 1, type: 'error' };
    }
    const [svc, action] = args;
    return this.cmdSystemctl([action, svc]);
  }

  cmdJournalctl(args) {
    let unit = null;
    let linesCount = 10;
    let reverse = false;
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-u' && args[i + 1]) unit = args[++i].replace(/\.service$/, '');
      else if (a.startsWith('-u=') || a.startsWith('--unit=')) unit = a.split('=')[1].replace(/\.service$/, '');
      else if (a.startsWith('-u') && a.length > 2) unit = a.slice(2).replace(/\.service$/, '');
      else if (a === '-n' && args[i + 1]) linesCount = Math.max(1, parseInt(args[++i], 10) || 10);
      else if (/^-n\d+$/.test(a)) linesCount = Math.max(1, parseInt(a.slice(2), 10) || 10);
      else if (a.startsWith('--lines=')) linesCount = Math.max(1, parseInt(a.split('=')[1], 10) || 10);
      else if (a === '-r' || a === '--reverse') reverse = true;
    }
    const allLogs = [
      'Jan 15 07:31:00 penguin-gym kernel: Linux version 6.1.0-21-amd64 (debian-kernel@lists.debian.org)',
      'Jan 15 07:31:01 penguin-gym systemd[1]: Started cron.service - Regular background program processing daemon.',
      'Jan 15 07:31:01 penguin-gym sshd[88]: Server listening on 0.0.0.0 port 22.',
      'Jan 15 07:31:02 penguin-gym systemd[1]: Starting nginx.service - A high performance web server...',
      'Jan 15 07:31:02 penguin-gym systemd[1]: Started nginx.service - A high performance web server.',
      'Jan 15 07:31:04 penguin-gym dockerd[210]: API listen on /run/docker.sock',
      'Jan 15 08:12:44 penguin-gym sshd[310]: Accepted publickey for user from 192.168.1.10 port 51422 ssh2',
      'Jan 15 09:30:00 penguin-gym sudo[412]:     user : TTY=pts/0 ; PWD=/home/user ; USER=root ; COMMAND=/usr/bin/apt update'
    ];
    const filtered = unit ? allLogs.filter(l => l.toLowerCase().includes(unit.toLowerCase())) : allLogs;
    const sliced = filtered.slice(-linesCount);
    if (reverse) sliced.reverse();
    return { output: sliced.join('\n'), code: 0 };
  }

  cmdCrontab(args, stdin = '') {
    if (args.includes('-l')) {
      if (!this.userCrontab) return { output: 'no crontab for user', code: 1, type: 'error' };
      return { output: this.userCrontab.trim(), code: 0 };
    }
    if (args.includes('-r')) {
      this.userCrontab = '';
      return { output: '', code: 0 };
    }
    if (args.includes('-e')) {
      this.fs.writeFile('/tmp/.crontab.user', this.userCrontab || '# m h  dom mon dow   command\n');
      return {
        output: '',
        code: 0,
        action: 'nano',
        crontabMode: true,
        filePath: '/tmp/.crontab.user'
      };
    }
    if (args.includes('-')) {
      this.userCrontab = stdin || '';
      return { output: '', code: 0 };
    }
    const fileArg = args.find(a => !a.startsWith('-'));
    if (fileArg) {
      this.userCrontab = this.fs.readFile(fileArg);
      return { output: '', code: 0 };
    }
    return { output: 'crontab: uso: crontab [-u user] arquivo | crontab [-u user] [ -e | -l | -r ]', code: 1, type: 'error' };
  }

  cmdApt(args) {
    const clean = args.filter(a => !a.startsWith('-'));
    const sub = clean[0];
    if (!sub) {
      return {
        output: `apt 2.6.1 (amd64)\nUso: apt [opções] comando\n\nComandos mais usados:\n  list - lista pacotes com base nos nomes\n  search - busca nas descrições dos pacotes\n  show - mostra detalhes do pacote\n  install - instala pacotes\n  remove - remove pacotes\n  purge - remove pacotes e arquivos de configuração\n  autoremove - remove automaticamente pacotes órfãos não utilizados\n  update - atualiza lista de pacotes disponíveis\n  upgrade - atualiza o sistema instalando/atualizando pacotes`,
        code: 0
      };
    }

    const catalog = {
      htop: { ver: '3.2.2-2', desc: 'interactive processes viewer' },
      neofetch: { ver: '7.1.0-4', desc: 'Shows Linux System Information with Distribution Logo' },
      cowsay: { ver: '3.03+dfsg2-8', desc: 'configurable talking cow' },
      vim: { ver: '2:9.0.1378-2', desc: 'Vi IMproved - enhanced vi editor' },
      jq: { ver: '1.6-2.1', desc: 'lightweight and flexible command-line JSON processor' },
      nmap: { ver: '7.93+dfsg1-1', desc: 'The Network Mapper' },
      tree: { ver: '2.1.0-1', desc: 'displays an indented directory tree, in color' },
      curl: { ver: '7.88.1-10+deb12u5', desc: 'command line tool for transferring data with URL syntax' },
      wget: { ver: '1.21.3-1+b2', desc: 'retrieves files from the web' },
      git: { ver: '1:2.39.2-1.1', desc: 'fast, scalable, distributed revision control system' },
      nginx: { ver: '1.22.1-9', desc: 'small, powerful, scalable web/proxy server' },
      sqlite3: { ver: '3.40.1-2', desc: 'Command line interface for SQLite 3' }
    };

    if (sub === 'search') {
      const term = (clean[1] || '').toLowerCase();
      const lines = ['Ordenando... Pronto', 'Busca em Texto Completo... Pronto'];
      for (const [pkg, info] of Object.entries(catalog)) {
        if (!term || pkg.includes(term) || info.desc.toLowerCase().includes(term)) {
          const inst = this.installedPackages.has(pkg) ? ' [instalado]' : '';
          lines.push(`${pkg}/stable ${info.ver} amd64${inst}\n  ${info.desc}`);
        }
      }
      return { output: lines.join('\n'), code: 0 };
    }

    if (sub === 'show') {
      const pkg = clean[1];
      if (!pkg) return { output: 'E: Nenhum pacote encontrado', code: 100, type: 'error' };
      const info = catalog[pkg] || { ver: '1.0.0-1', desc: `Pacote utilitário GNU/Linux (${pkg})` };
      return {
        output: `Package: ${pkg}
Version: ${info.ver}
Priority: optional
Section: utils
Maintainer: Debian Developers <debian-devel@lists.debian.org>
Installed-Size: 512 kB
APT-Manual-Installed: yes
APT-Sources: http://deb.debian.org/debian bookworm/main amd64 Packages
Description: ${info.desc}`,
        code: 0
      };
    }

    if (sub === 'list') {
      const lines = ['Listando... Pronto'];
      for (const pkg of Array.from(this.installedPackages).sort()) {
        const ver = (catalog[pkg] && catalog[pkg].ver) || '1.0-deb12u1';
        lines.push(`${pkg}/stable,now ${ver} amd64 [instalado]`);
      }
      return { output: lines.join('\n'), code: 0 };
    }

    if (['update', 'upgrade', 'install', 'remove', 'purge', 'autoremove'].includes(sub)) {
      if (!this.fs.sudoMode) {
        return {
          output: `E: Não foi possível abrir arquivo de trava /var/lib/dpkg/lock-frontend - open (13: Permissão negada)\nE: Unable to acquire the dpkg frontend lock (/var/lib/dpkg/lock-frontend), are you root?`,
          code: 100,
          type: 'error'
        };
      }
      if (sub === 'update') {
        return {
          output: `Hit:1 http://deb.debian.org/debian bookworm InRelease
Hit:2 http://security.debian.org/debian-security bookworm-security InRelease
Hit:3 http://deb.debian.org/debian bookworm-updates InRelease
Lendo listas de pacotes... Pronto
Construindo árvore de dependências... Pronto
Lendo informação de estado... Pronto
Todos os pacotes estão atualizados.`,
          code: 0
        };
      }
      if (sub === 'upgrade') {
        return {
          output: `Lendo listas de pacotes... Pronto
Construindo árvore de dependências... Pronto
Calculando atualização... Pronto
0 pacotes atualizados, 0 pacotes novos instalados, 0 a serem removidos e 0 não atualizados.`,
          code: 0
        };
      }
      if (sub === 'install') {
        const pkgs = clean.slice(1);
        if (pkgs.length === 0) return { output: 'E: Você deve especificar pelo menos um pacote para instalar', code: 100, type: 'error' };
        const out = [
          'Lendo listas de pacotes... Pronto',
          'Construindo árvore de dependências... Pronto',
          'Lendo informação de estado... Pronto'
        ];
        for (const p of pkgs) {
          this.installedPackages.add(p);
          try {
            this.fs.createFile(`/usr/bin/${p}`, `#!/bin/sh\n# Binário do pacote ${p}\n`, 'root', 'rwxr-xr-x');
          } catch {}
          out.push(`Selecionando pacote ${p} previamente não selecionado.`);
          out.push(`Desempacotando ${p} (1.0-deb12) ...`);
          out.push(`Configurando ${p} (1.0-deb12) ...`);
        }
        out.push('Processando gatilhos para man-db (2.11.2-2) ...');
        return { output: out.join('\n'), code: 0 };
      }
      if (sub === 'remove' || sub === 'purge') {
        const pkgs = clean.slice(1);
        if (pkgs.length === 0) return { output: 'E: Você deve especificar pelo menos um pacote para remover', code: 100, type: 'error' };
        const out = ['Lendo listas de pacotes... Pronto', 'Construindo árvore de dependências... Pronto'];
        for (const p of pkgs) {
          if (!this.installedPackages.has(p)) {
            out.push(`O pacote '${p}' não está instalado e por isso não será removido`);
            continue;
          }
          this.installedPackages.delete(p);
          try {
            if (this.fs.getNode(`/usr/bin/${p}`)) this.fs.removeFile(`/usr/bin/${p}`, true);
          } catch {}
          out.push(`Removendo ${p} ...`);
          if (sub === 'purge') {
            out.push(`Expurgando arquivos de configuração de ${p} ...`);
          }
        }
        return { output: out.join('\n'), code: 0 };
      }
      if (sub === 'autoremove') {
        return {
          output: `Lendo listas de pacotes... Pronto
Construindo árvore de dependências... Pronto
Lendo informação de estado... Pronto
0 pacotes atualizados, 0 novos instalados, 0 a serem removidos e 0 não atualizados.`,
          code: 0
        };
      }
    }

    return { output: `E: Operação inválida ${sub}`, code: 100, type: 'error' };
  }

  cmdDpkg(args) {
    if (args.includes('-l') || args.includes('--list') || args.length === 0) {
      const filters = args.filter(a => !a.startsWith('-'));
      const header = `Desired=Unknown/Install/Remove/Purge/Hold
| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend
|/ Err?=(none)/Reinst-required (Status,Err: uppercase=bad)
||/ Nome                Versão              Arquitetura  Descrição
+++-===================-===================-============-=============================================`;
      const pkgs = Array.from(this.installedPackages).sort().filter(pkg => {
        if (filters.length === 0) return true;
        return filters.some(f => {
          const clean = f.replace(/\*/g, '');
          return f.includes('*') ? pkg.includes(clean) : (pkg === f || pkg.includes(f));
        });
      });
      if (pkgs.length === 0 && filters.length > 0) {
        return { output: `dpkg-query: nenhum pacote encontrado combinando com ${filters[0]}`, code: 1, type: 'error' };
      }
      const rows = pkgs.map(pkg => {
        return `ii  ${pkg.padEnd(19)} 1.0-deb12u1         amd64        Utilitário do sistema GNU/Linux (${pkg})`;
      });
      return { output: [header, ...rows].join('\n'), code: 0 };
    }
    return { output: 'dpkg: use "dpkg -l" para listar pacotes instalados', code: 0 };
  }

  cmdIp(args) {
    const brief = args.includes('-br') || args.includes('-brief');
    const clean = args.filter(a => !a.startsWith('-'));
    const sub = clean[0] || 'addr';

    if (sub.startsWith('r')) {
      return {
        output: `default via 192.168.1.1 dev eth0 proto dhcp metric 100 
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100 metric 100`,
        code: 0
      };
    }

    if (brief) {
      return {
        output: `lo               UNKNOWN        127.0.0.1/8 ::1/128 
eth0             UP             192.168.1.100/24 fe80::215:5dff:fe01:100/64 
docker0          DOWN           172.17.0.1/16`,
        code: 0
      };
    }

    return {
      output: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 00:15:5d:01:01:00 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic eth0
       valid_lft 86312sec preferred_lft 86312sec
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default 
    link/ether 02:42:ac:11:00:01 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever`,
      code: 0
    };
  }

  cmdIfconfig() {
    return {
      output: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255
        ether 00:15:5d:01:01:00  txqueuelen 1000  (Ethernet)
        RX packets 14250  bytes 18421000 (17.5 MiB)
        TX packets 8410  bytes 1240500 (1.1 MiB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Loopback Local)`,
      code: 0
    };
  }

  cmdPing(args) {
    let count = 4;
    let host = null;
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-c' && args[i + 1]) count = Math.min(10, Math.max(1, parseInt(args[++i], 10) || 4));
      else if (/^-c\d+$/.test(a)) count = Math.min(10, Math.max(1, parseInt(a.slice(2), 10) || 4));
      else if ((a === '-W' || a === '-w' || a === '-i' || a === '-s' || a === '-I') && args[i + 1]) i++;
      else if (!a.startsWith('-')) host = a;
    }
    if (!host) return { output: 'ping: erro de uso: Endereço de destino obrigatório', code: 1, type: 'error' };
    const ip = host === 'localhost' ? '127.0.0.1' : (/^\d+\.\d+\.\d+\.\d+$/.test(host) ? host : '93.184.216.34');
    const lines = [`PING ${host} (${ip}) 56(84) bytes de dados.`];
    for (let seq = 1; seq <= count; seq++) {
      lines.push(`64 bytes de ${ip}: icmp_seq=${seq} ttl=56 tempo=${(11.2 + seq * 0.3).toFixed(1)} ms`);
    }
    lines.push(`--- ${host} estatísticas de ping ---`);
    lines.push(`${count} pacotes transmitidos, ${count} recebidos, 0% de perda de pacotes, tempo ${count * 1001}ms`);
    lines.push(`rtt min/avg/max/mdev = 11.5/11.9/12.4/0.3 ms`);
    return { output: lines.join('\n'), code: 0 };
  }

  cmdTraceroute(args) {
    const host = args.find(a => !a.startsWith('-'));
    if (!host) return { output: 'Especifique o argumento "host" na linha de comando.', code: 1, type: 'error' };
    return {
      output: `traceroute to ${host} (93.184.216.34), 30 hops max, 60 byte packets
 1  _gateway (192.168.1.1)  1.124 ms  1.080 ms  1.045 ms
 2  10.24.0.1 (10.24.0.1)  8.412 ms  8.390 ms  8.510 ms
 3  core-router.isp.net (200.160.2.1)  14.210 ms  14.180 ms  14.320 ms
 4  ${host} (93.184.216.34)  18.540 ms  18.490 ms  18.610 ms`,
      code: 0
    };
  }

  cmdCurl(args) {
    let headOnly = false;
    let outFile = null;
    let url = null;
    let method = 'GET';
    let bodyData = null;
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '--head') headOnly = true;
      else if (a === '-o' || a === '--output') { if (args[i + 1]) outFile = args[++i]; }
      else if (a.startsWith('-o') && a.length > 2) outFile = a.slice(2);
      else if (a === '--remote-name') outFile = '__AUTO__';
      else if (a === '-X' || a === '--request') { if (args[i + 1]) method = args[++i].toUpperCase(); }
      else if (a.startsWith('-X') && a.length > 2) method = a.slice(2).toUpperCase();
      else if (a === '-d' || a === '--data' || a === '--data-raw') {
        if (args[i + 1] !== undefined) {
          bodyData = args[++i];
          if (method === 'GET') method = 'POST';
        }
      } else if (a.startsWith('-d') && a.length > 2) {
        bodyData = a.slice(2);
        if (method === 'GET') method = 'POST';
      } else if ((a === '-H' || a === '--header') && args[i + 1] !== undefined) {
        i++;
      } else if (a.startsWith('-') && !a.startsWith('--')) {
        if (a.includes('I')) headOnly = true;
        if (a.includes('O')) outFile = '__AUTO__';
      } else if (!a.startsWith('-')) {
        url = a;
      }
    }
    if (!url) return { output: 'curl: tente \'curl --help\' ou \'curl --manual\' para mais informações', code: 2, type: 'error' };

    const urlMatch = url.match(/^(?:https?:\/\/)?([^/:]+)(?::(\d+))?/i);
    const host = urlMatch ? urlMatch[1].toLowerCase() : '';
    const port = (urlMatch && urlMatch[2]) ? urlMatch[2] : (url.startsWith('https://') ? '443' : '80');
    if ((host === 'localhost' || host === '127.0.0.1') && port === '80') {
      if (!this.services.nginx.active || this.killedProcesses.has('123')) {
        return {
          output: `curl: (7) Failed to connect to ${host} port 80 after 0 ms: Couldn't connect to server`,
          code: 7,
          type: 'error'
        };
      }
      if (this.ufwState.enabled) {
        const denied = this.ufwState.rules.some(r => /^(80(\/tcp)?|http)\s+DENY/i.test(r.trim()));
        const allowed = this.ufwState.rules.some(r => /^(80(\/tcp)?|http)\s+ALLOW/i.test(r.trim()));
        if (denied || !allowed) {
          return {
            output: `curl: (7) Failed to connect to ${host} port 80 after 0 ms: Connection timed out`,
            code: 7,
            type: 'error'
          };
        }
      }
    }

    const headers = `HTTP/1.1 ${method === 'POST' ? '201 Created' : '200 OK'}
Server: nginx/1.22.1
Date: Thu, 15 Jan 2026 10:45:00 GMT
Content-Type: ${url.includes('api') || url.endsWith('.json') || method === 'POST' ? 'application/json' : 'text/html; charset=UTF-8'}
Connection: keep-alive`;

    if (headOnly) {
      return { output: headers, code: 0 };
    }

    if (method === 'POST') {
      let parsedPayload = bodyData || '{}';
      try {
        parsedPayload = JSON.parse(bodyData || '{}');
      } catch {}
      return {
        output: JSON.stringify({ status: 'created', method: 'POST', url, received: parsedPayload }, null, 2),
        code: 0
      };
    }

    let body = `<!DOCTYPE html>
<html>
<head><title>Welcome to Penguin Gym Linux!</title></head>
<body>
  <h1>Success! The nginx web server is working!</h1>
  <p>URL requisitada: ${url}</p>
</body>
</html>`;

    if (url.includes('api') || url.endsWith('.json')) {
      body = `{\n  "status": "ok",\n  "service": "penguin-gym-api",\n  "version": "2.0.0",\n  "url": "${url}"\n}`;
    }

    if (outFile) {
      const finalFile = outFile === '__AUTO__' ? (url.split('/').pop() || 'index.html') : outFile;
      this.fs.writeFile(finalFile, body + '\n');
      return { output: '', code: 0 };
    }

    return { output: body, code: 0 };
  }

  cmdWget(args) {
    let outFile = null;
    let quiet = false;
    let url = null;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-O' && args[i + 1]) outFile = args[++i];
      else if (args[i] === '-q' || args[i] === '--quiet') quiet = true;
      else if (!args[i].startsWith('-')) url = args[i];
    }
    if (!url) return { output: 'wget: URL ausente\nUso: wget [OPÇÃO]... [URL]...', code: 1, type: 'error' };
    const filename = outFile || url.split('/').filter(Boolean).pop() || 'index.html';
    const content = `Conteúdo baixado de ${url}\nData: 2026-01-15 10:45:00\n`;
    this.fs.writeFile(filename, content);
    if (quiet) return { output: '', code: 0 };
    return {
      output: `--2026-01-15 10:45:00--  ${url}
Resolvendo ${url.replace(/^https?:\/\//, '').split('/')[0]}... 93.184.216.34
Conectando-se a 93.184.216.34:443... conectado.
A requisição HTTP foi enviada, aguardando resposta... 200 OK
Tamanho: ${content.length} [text/plain]
Salvando em: '${filename}'

${filename}                  100%[=====================================>]      ${content.length}  --.-KB/s    em 0s

2026-01-15 10:45:00 (12,4 MB/s) - '${filename}' salvo [${content.length}/${content.length}]`,
      code: 0
    };
  }

  cmdSshKeygen(args) {
    let keyType = 'ed25519';
    let outFile = null;
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-t' && args[i + 1]) keyType = args[++i].toLowerCase();
      else if (a === '-f' && args[i + 1]) outFile = args[++i];
    }
    const home = this.envVars.HOME || '/home/user';
    const sshDir = `${home}/.ssh`;
    try { this.fs.createDirectory(sshDir, true, 'rwx------', this.envVars.USER || 'user'); } catch {}
    const privPath = outFile || `${sshDir}/id_${keyType}`;
    const pubPath = `${privPath}.pub`;

    this.fs.writeFile(privPath, `-----BEGIN OPENSSH PRIVATE KEY-----\nPENGUIN_GYM_VIRTUAL_${keyType.toUpperCase()}_PRIVATE_KEY\n-----END OPENSSH PRIVATE KEY-----\n`);
    const privNode = this.fs.getNode(privPath);
    if (privNode) privNode.permissions = 'rw-------';

    this.fs.writeFile(pubPath, `ssh-${keyType} AAAAC3NzaC1lZDI1NTE5AAAAIPenguinGymVirtualKey123456 user@penguin-gym\n`);
    const pubNode = this.fs.getNode(pubPath);
    if (pubNode) pubNode.permissions = 'rw-r--r--';

    return {
      output: `Generating public/private ${keyType} key pair.
Your identification has been saved in ${privPath}
Your public key has been saved in ${pubPath}
The key fingerprint is:
SHA256:pEngu1nGymL1nuxAut0m4t10nVirtu4lK3y user@penguin-gym`,
      code: 0
    };
  }

  cmdRsync(args) {
    let verbose = false;
    let dryRun = false;
    let deleteExtra = false;
    const excludes = [];
    const paths = [];

    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '--dry-run') dryRun = true;
      else if (a === '--delete') deleteExtra = true;
      else if (a === '--verbose') verbose = true;
      else if (a === '--exclude' && args[i + 1]) excludes.push(args[++i].replace(/^['"]|['"]$/g, ''));
      else if (a.startsWith('--exclude=')) excludes.push(a.slice(10).replace(/^['"]|['"]$/g, ''));
      else if (a.startsWith('-') && !a.startsWith('--')) {
        if (a.includes('v')) verbose = true;
        if (a.includes('n')) dryRun = true;
      } else {
        paths.push(a);
      }
    }

    if (paths.length < 2) {
      return { output: 'rsync: argumentos de origem e destino necessários', code: 1, type: 'error' };
    }

    const src = paths[0];
    const dest = paths[paths.length - 1];

    // Remoto simulado via SSH
    if (src.includes(':') || dest.includes(':')) {
      return {
        output: `${dryRun ? '(DRY RUN) ' : ''}${src}                                  100% 1024     1.2MB/s   00:00`,
        code: 0
      };
    }

    const srcNode = this.fs.getNode(src);
    if (!srcNode) {
      return {
        output: `rsync: [sender] link_stat "${this.fs.resolvePath(src)}" failed: No such file or directory (2)`,
        code: 23,
        type: 'error'
      };
    }

    const matchesExclude = (name) => {
      return excludes.some(pat => {
        const reg = new RegExp('^' + pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
        return reg.test(name);
      });
    };

    const actions = [];
    let bytesSent = 0;
    let totalSize = 0;

    if (srcNode.type === 'file') {
      const destNode = this.fs.getNode(dest);
      const targetPath = (destNode && destNode.type === 'directory')
        ? `${dest.replace(/\/+$/, '')}/${this.fs.getFileName(src)}`
        : dest;
      const existing = this.fs.getNode(targetPath);
      const content = srcNode.content || '';
      totalSize += content.length;
      if (!existing || existing.content !== content) {
        bytesSent += content.length;
        actions.push(this.fs.getFileName(src));
        if (!dryRun) {
          const parent = this.fs.getParentPath(targetPath);
          try { this.fs.createDirectory(parent, true); } catch {}
          this.fs.writeFile(targetPath, content);
        }
      }
    } else if (srcNode.type === 'directory') {
      const destBase = src.endsWith('/')
        ? dest.replace(/\/+$/, '')
        : `${dest.replace(/\/+$/, '')}/${this.fs.getFileName(src)}`;

      if (!dryRun) {
        try { this.fs.createDirectory(destBase, true); } catch {}
      }

      const expectedRelPaths = new Set();

      const syncDir = (node, targetDir, relPrefix) => {
        for (const [name, child] of Object.entries(node.children || {})) {
          if (matchesExclude(name)) continue;
          const rel = relPrefix ? `${relPrefix}/${name}` : name;
          const destItem = `${targetDir}/${name}`;
          if (child.type === 'directory') {
            expectedRelPaths.add(rel);
            if (!this.fs.getNode(destItem)) actions.push(`${rel}/`);
            if (!dryRun) {
              try { this.fs.createDirectory(destItem, true); } catch {}
            }
            syncDir(child, destItem, rel);
          } else if (child.type === 'file') {
            expectedRelPaths.add(rel);
            const content = child.content || '';
            totalSize += content.length;
            const curDest = this.fs.getNode(destItem);
            if (!curDest || curDest.content !== content) {
              bytesSent += content.length;
              actions.push(rel);
              if (!dryRun) {
                this.fs.writeFile(destItem, content);
                const created = this.fs.getNode(destItem);
                if (created && child.permissions) created.permissions = child.permissions;
              }
            }
          }
        }
      };

      syncDir(srcNode, destBase, '');

      if (deleteExtra) {
        const destBaseNode = this.fs.getNode(destBase);
        const pruneExtra = (node, targetDir, relPrefix) => {
          if (!node || node.type !== 'directory') return;
          for (const [name, child] of Object.entries({ ...(node.children || {}) })) {
            const rel = relPrefix ? `${relPrefix}/${name}` : name;
            const destItem = `${targetDir}/${name}`;
            if (!expectedRelPaths.has(rel)) {
              actions.push(`deleting ${rel}`);
              if (!dryRun) {
                try { this.fs.removeRecursive(destItem, true); } catch {}
              }
            } else if (child.type === 'directory') {
              pruneExtra(child, destItem, rel);
            }
          }
        };
        if (destBaseNode) pruneExtra(destBaseNode, destBase, '');
      }
    }

    const lines = [`sending incremental file list${dryRun ? ' (DRY RUN)' : ''}`];
    if (verbose || dryRun) {
      for (const act of actions) lines.push(act);
    }
    lines.push(`\nsent ${bytesSent + 48} bytes  received 16 bytes  ${bytesSent + 64}.00 bytes/sec`);
    lines.push(`total size is ${totalSize}  speedup is 1.00${dryRun ? ' (DRY RUN)' : ''}`);
    return { output: lines.join('\n'), code: 0 };
  }

  cmdNetstat(cmd, args) {
    const sshUp = this.services.ssh.active && !this.killedProcesses.has('88');
    const nginxUp = this.services.nginx.active && !this.killedProcesses.has('123');
    const pgUp = this.services.postgresql.active && !this.killedProcesses.has('280');

    if (cmd === 'ss') {
      const rows = ['Netid  State   Recv-Q  Send-Q   Local Address:Port    Peer Address:Port  Process'];
      if (sshUp) rows.push('tcp    LISTEN  0       128            0.0.0.0:22           0.0.0.0:*      users:(("sshd",pid=88,fd=3))');
      if (nginxUp) rows.push('tcp    LISTEN  0       511            0.0.0.0:80           0.0.0.0:*      users:(("nginx",pid=123,fd=6))');
      if (pgUp) rows.push('tcp    LISTEN  0       4096         127.0.0.1:5432         0.0.0.0:*      users:(("postgres",pid=280,fd=5))');
      return { output: rows.join('\n'), code: 0 };
    }
    const rows = [
      'Conexões Internet Ativas (somente servidores)',
      'Proto Recv-Q Send-Q Endereço Local          Endereço Remoto         Estado      PID/Program name'
    ];
    if (sshUp) rows.push('tcp        0      0 0.0.0.0:22              0.0.0.0:*               OUÇA        88/sshd: /usr/sbin');
    if (nginxUp) rows.push('tcp        0      0 0.0.0.0:80              0.0.0.0:*               OUÇA        123/nginx: master');
    if (pgUp) rows.push('tcp        0      0 127.0.0.1:5432          0.0.0.0:*               OUÇA        280/postgres');
    return { output: rows.join('\n'), code: 0 };
  }

  cmdDig(args) {
    const short = args.includes('+short');
    const domain = args.find(a => !a.startsWith('-') && !a.startsWith('+')) || 'penguin-gym.com';
    if (short) return { output: '93.184.216.34', code: 0 };
    return {
      output: `; <<>> DiG 9.18.24-1-Debian <<>> ${domain}
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 48210
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; QUESTION SECTION:
;${domain}.			IN	A

;; ANSWER SECTION:
${domain}.		300	IN	A	93.184.216.34

;; Query time: 12 msec
;; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)
;; WHEN: Thu Jan 15 10:45:00 UTC 2026
;; MSG SIZE  rcvd: 59`,
      code: 0
    };
  }

  cmdNslookup(args) {
    const domain = args.find(a => !a.startsWith('-')) || 'penguin-gym.com';
    return {
      output: `Server:		8.8.8.8
Address:	8.8.8.8#53

Non-authoritative answer:
Name:	${domain}
Address: 93.184.216.34`,
      code: 0
    };
  }

  cmdNc(args) {
    const clean = [];
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if ((a === '-w' || a === '-p' || a === '-s') && args[i + 1]) i++;
      else if (!a.startsWith('-')) clean.push(a);
    }
    const host = clean[0] || 'localhost';
    const port = clean[1] || '80';
    const lowerHost = host.toLowerCase();
    if (lowerHost === 'localhost' || lowerHost === '127.0.0.1') {
      const portMap = {
        '22': this.services.ssh.active && !this.killedProcesses.has('88'),
        '80': this.services.nginx.active && !this.killedProcesses.has('123'),
        '5432': this.services.postgresql.active && !this.killedProcesses.has('280')
      };
      if (!portMap[String(port)]) {
        return {
          output: `nc: connect to ${host} (127.0.0.1) port ${port} (tcp) failed: Connection refused`,
          code: 1,
          type: 'error'
        };
      }
    }
    return {
      output: `Connection to ${host} (127.0.0.1) ${port} port [tcp/*] succeeded!`,
      code: 0
    };
  }

  cmdUfw(args) {
    if (!this.fs.sudoMode) {
      return { output: 'ERROR: You need to be root to run this script', code: 1, type: 'error' };
    }
    const sub = args[0] || 'status';
    if (sub === 'enable') {
      this.ufwState.enabled = true;
      return { output: 'Firewall is active and enabled on system startup', code: 0 };
    }
    if (sub === 'disable') {
      this.ufwState.enabled = false;
      return { output: 'Firewall stopped and disabled on system startup', code: 0 };
    }
    if (sub === 'reset') {
      this.ufwState.enabled = false;
      this.ufwState.rules = [];
      return { output: 'Resetting all rules to installed defaults. Proceed with operation (y|n)? y', code: 0 };
    }
    if ((sub === 'allow' || sub === 'deny') && args[1]) {
      const actionLabel = sub === 'allow' ? 'ALLOW IN' : 'DENY IN ';
      this.ufwState.rules.push(`${args[1].padEnd(26)} ${actionLabel}    Anywhere`);
      return { output: 'Rule added\nRule added (v6)', code: 0 };
    }
    if (sub === 'delete' && args[1]) {
      if (/^\d+$/.test(args[1])) {
        const idx = parseInt(args[1], 10) - 1;
        if (idx >= 0 && idx < this.ufwState.rules.length) {
          this.ufwState.rules.splice(idx, 1);
          return { output: 'Rule deleted', code: 0 };
        }
        return { output: `ERROR: Invalid rule number '${args[1]}'`, code: 1, type: 'error' };
      }
      const targetPort = args[2] || args[1];
      const before = this.ufwState.rules.length;
      this.ufwState.rules = this.ufwState.rules.filter(r => !r.trim().startsWith(targetPort));
      if (this.ufwState.rules.length < before) {
        return { output: 'Rule deleted\nRule deleted (v6)', code: 0 };
      }
      return { output: `Could not delete non-existent rule`, code: 1, type: 'error' };
    }
    if (!this.ufwState.enabled) {
      return { output: 'Status: inactive', code: 0 };
    }
    if (args[1] === 'numbered') {
      const numbered = this.ufwState.rules.map((r, i) => `[ ${i + 1}] ${r}`).join('\n');
      return { output: `Status: active\n\n     To                         Action      From\n     --                         ------      ----\n${numbered}`, code: 0 };
    }
    return {
      output: `Status: active\n\nTo                         Action      From\n--                         ------      ----\n${this.ufwState.rules.join('\n')}`,
      code: 0
    };
  }

  cmdNeofetch() {
    return {
      output: `\x1b[1;36m       _,met$$$$$gg.          \x1b[1;32muser\x1b[0m@\x1b[1;32m${this.envVars.HOSTNAME || 'penguin-gym'}\x1b[0m
\x1b[1;36m    ,g$$$$$$$$$$$$$$$P.       \x1b[0m----------------
\x1b[1;36m  ,g$$P"     """Y$$.".        \x1b[1;33mOS\x1b[0m: Debian GNU/Linux 12 (bookworm) x86_64
\x1b[1;36m ,$$P'              \`$$$.     \x1b[1;33mHost\x1b[0m: Penguin Gym Virtual Machine
\x1b[1;36m',$$P       ,ggs.     \`$$b:   \x1b[1;33mKernel\x1b[0m: 6.1.0-21-amd64
\x1b[1;36m\`d$$'     ,$P"'   .    $$$    \x1b[1;33mUptime\x1b[0m: 12 days, 3 hours, 14 mins
\x1b[1;36m $$P      d$'     ,    $$P    \x1b[1;33mPackages\x1b[0m: ${this.installedPackages.size} (dpkg)
\x1b[1;36m $$:      $$.   -    ,d$$'    \x1b[1;33mShell\x1b[0m: bash 5.2.15
\x1b[1;36m $$;      Y$b._   _,d$P'      \x1b[1;33mTerminal\x1b[0m: xterm-256color
\x1b[1;36m Y$$.    \`.\`"Y$$$$P"'         \x1b[1;33mCPU\x1b[0m: Intel Xeon (4) @ 2.200GHz
\x1b[1;36m \`$$b      "-.__              \x1b[1;33mMemory\x1b[0m: 850MiB / 3920MiB`,
      code: 0
    };
  }

  cmdCowsay(args, stdin) {
    const msg = (args.length > 0 ? args.join(' ') : (stdin || 'Moo! Penguin Gym Linux!')).trim();
    const border = '_'.repeat(msg.length + 2);
    const bottom = '-'.repeat(msg.length + 2);
    return {
      output: ` ${border}
< ${msg} >
 ${bottom}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`,
      code: 0
    };
  }

  cmdJq(args, stdin) {
    const clean = args.filter(a => !a.startsWith('-'));
    let filter = clean[0] || '.';
    let file = clean[1];
    if (!file && clean.length === 1 && !filter.startsWith('.') && this.fs.getNode(filter)) {
      file = filter;
      filter = '.';
    }
    const raw = file ? this.fs.readFile(file) : stdin;
    try {
      const parsed = JSON.parse(raw);
      if (filter === '.' || !filter.startsWith('.')) {
        return { output: JSON.stringify(parsed, null, 2), code: 0 };
      }
      const keys = filter.slice(1).split('.').filter(Boolean);
      let val = parsed;
      for (const k of keys) {
        val = (val !== null && val !== undefined) ? val[k] : undefined;
      }
      if (val === undefined) val = null;
      return { output: typeof val === 'object' && val !== null ? JSON.stringify(val, null, 2) : String(val), code: 0 };
    } catch {
      return { output: 'jq: parse error: Invalid JSON literal', code: 4, type: 'error' };
    }
  }
}

if (typeof window !== 'undefined') {
  window.CommandEngine = CommandEngine;
}
