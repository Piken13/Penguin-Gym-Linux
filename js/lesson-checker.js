/**
 * Penguin Gym Linux - Lesson Answer Evaluator
 * Avalia todas as lições de acordo com o comando atual, histórico da sessão da lição,
 * saída gerada e estado atual do VirtualFS, Git, Docker, SQLite e CommandEngine.
 */

class LessonChecker {
  /**
   * Divide uma linha de comando por &&, ||, ; ou & (fim de job) ou | respeitando aspas e subshells ().
   */
  static splitTopLevel(str, mode = 'seq') {
    const parts = [];
    let curr = '';
    let inQuote = null;
    let parenDepth = 0;

    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch === '\\' && i + 1 < str.length && inQuote !== "'") {
        curr += ch + str[i + 1];
        i++;
        continue;
      }
      if (ch === "'" || ch === '"') {
        inQuote = inQuote === ch ? null : (inQuote || ch);
        curr += ch;
        continue;
      }
      if (inQuote) {
        curr += ch;
        continue;
      }
      if (ch === '(' && !(i > 0 && str[i - 1] === '$')) {
        parenDepth++;
        curr += ch;
        continue;
      }
      if (ch === ')' && parenDepth > 0) {
        parenDepth--;
        curr += ch;
        continue;
      }
      if (parenDepth === 0) {
        if (mode === 'seq') {
          if ((ch === '&' && str[i + 1] === '&') || (ch === '|' && str[i + 1] === '|')) {
            if (curr.trim()) parts.push(curr.trim());
            curr = '';
            i++;
            continue;
          }
          if (ch === ';') {
            if (curr.trim()) parts.push(curr.trim());
            curr = '';
            continue;
          }
          if (ch === '&' && str[i + 1] !== '>' && str[i - 1] !== '>' && str[i - 1] !== '<') {
            curr += '&';
            if (curr.trim()) parts.push(curr.trim());
            curr = '';
            continue;
          }
        } else if (mode === 'pipe') {
          if (ch === '|' && str[i + 1] !== '|' && str[i - 1] !== '>') {
            if (curr.trim()) parts.push(curr.trim());
            curr = '';
            continue;
          }
        }
      }
      curr += ch;
    }
    if (curr.trim()) parts.push(curr.trim());
    return parts;
  }

  /**
   * Tokeniza um subcomando simples respeitando aspas.
   */
  static tokenize(cmdStr) {
    const tokens = [];
    let curr = '';
    let inQuote = null;
    let hasTok = false;
    for (let i = 0; i < cmdStr.length; i++) {
      const ch = cmdStr[i];
      if (ch === '\\' && i + 1 < cmdStr.length && inQuote !== "'") {
        curr += cmdStr[++i];
        hasTok = true;
        continue;
      }
      if (ch === "'" || ch === '"') {
        inQuote = inQuote === ch ? null : (inQuote || ch);
        hasTok = true;
        continue;
      }
      if (/\s/.test(ch) && !inQuote) {
        if (hasTok) {
          tokens.push(curr);
          curr = '';
          hasTok = false;
        }
        continue;
      }
      curr += ch;
      hasTok = true;
    }
    if (hasTok) tokens.push(curr);
    return tokens;
  }

  /**
   * Extrai comando bruto e comando efetivo (removendo sudo e flags do sudo).
   */
  static parseCall(segmentStr) {
    const cleaned = segmentStr.replace(/&\s*$/, '').trim();
    const tokens = LessonChecker.tokenize(cleaned);
    const cmd = tokens[0] || '';
    const args = tokens.slice(1);

    let effIdx = 0;
    if (tokens[0] === 'sudo') {
      effIdx = 1;
      while (effIdx < tokens.length && tokens[effIdx].startsWith('-')) {
        if ((tokens[effIdx] === '-u' || tokens[effIdx] === '-g') && tokens[effIdx + 1]) {
          effIdx += 2;
        } else {
          effIdx += 1;
        }
      }
    }
    const effCmd = tokens[effIdx] || cmd;
    const effArgs = tokens.slice(effIdx + 1);
    return { raw: cleaned, cmd, args, effCmd, effArgs };
  }

  static hasShortFlag(args, ch, longOpt = null) {
    return args.some(a =>
      (longOpt && a === longOpt) ||
      (a.startsWith('-') && !a.startsWith('--') && a.includes(ch))
    );
  }

  static check(lesson, cmdLine, output, fs, ctx) {
    if (!lesson || !cmdLine) return false;
    if (ctx && ctx.res && ctx.res.type === 'error' && lesson.id !== 'bash-history-exec' && lesson.id !== 'bash-or-fallback') return false;
    const raw = cmdLine.trim();
    const sessionHistory = (ctx && ctx.sessionHistory) ? ctx.sessionHistory : [raw];
    const allSessionText = sessionHistory.join(' ; ');

    const subCommands = LessonChecker.splitTopLevel(raw, 'seq');
    const lastSub = subCommands[subCommands.length - 1] || raw;
    const lastPipes = LessonChecker.splitTopLevel(lastSub, 'pipe');
    const lastStage = lastPipes[lastPipes.length - 1] || lastSub;

    const parsed = LessonChecker.parseCall(lastStage);
    const { cmd, args, effCmd, effArgs } = parsed;
    const pipelineCalls = lastPipes.map(p => LessonChecker.parseCall(p));
    const allCalls = [];
    for (const sub of subCommands) {
      for (const p of LessonChecker.splitTopLevel(sub, 'pipe')) {
        allCalls.push(LessonChecker.parseCall(p));
      }
    }
    const hasCall = (calls, name) => calls.some(c => c.effCmd === name || c.cmd === name);
    const id = lesson.id;

    // Se o usuário está consultando documentação (man, whatis, apropos, help),
    // isso só deve ser avaliado como conclusão se a lição for especificamente sobre essa ferramenta.
    const isDocLookup = effCmd === 'man' || effCmd === 'whatis' || effCmd === 'apropos' || (effCmd === 'help' && id !== 'basic-help');
    const isDocLesson = id === 'tool-man-page' || id === 'tool-whatis' || id === 'tool-apropos' || id === 'basic-help';
    if (isDocLookup && !isDocLesson) {
      return false;
    }

    const { git, docker, sql, commandEngine } = ctx || {};

    switch (id) {
      // ==========================================
      // 1. INICIANTE (18 lições)
      // ==========================================
      case 'basic-pwd':
        return effCmd === 'pwd' && output.includes('/');

      case 'basic-ls':
        return effCmd === 'ls' &&
               !LessonChecker.hasShortFlag(effArgs, 'a', '--all') &&
               output.includes('documents') && output.includes('projects') &&
               effArgs.filter(a => !a.startsWith('-')).every(a => a === '.' || a === '~' || a === '/home/user');

      case 'basic-ls-all':
        return effCmd === 'ls' && LessonChecker.hasShortFlag(effArgs, 'a', '--all');

      case 'basic-cd-home':
        return effCmd === 'cd' && fs.currentPath === '/home/user';

      case 'basic-cd-parent':
        return effCmd === 'cd' && effArgs[0] === '..' && fs.currentPath === '/home/user' &&
               ((fs.oldPath && fs.oldPath.startsWith('/home/user/')) ||
                allSessionText.includes('cd documents') ||
                allSessionText.includes('cd projects'));

      case 'basic-whoami':
        return effCmd === 'whoami' && output.trim() === 'user';

      case 'basic-date':
        return effCmd === 'date' && output.length > 5;

      case 'basic-echo':
        return effCmd === 'echo' && output.trim() === 'Hello Linux';

      case 'basic-clear':
        return effCmd === 'clear';

      case 'basic-help':
        return effCmd === 'help' && (output.includes('Comandos') || output.includes('Disponíveis'));

      case 'system-which':
        return effCmd === 'which' && effArgs[0] === 'ls' && output.includes('/ls');

      case 'system-which-grep':
        return effCmd === 'which' && effArgs[0] === 'grep' && output.includes('/grep');

      case 'advanced-ls-size-format':
        return effCmd === 'ls' &&
               LessonChecker.hasShortFlag(effArgs, 'l', '--long') &&
               LessonChecker.hasShortFlag(effArgs, 'h', '--human-readable');

      case 'text-head-basic':
        return effCmd === 'head' && raw.includes('notes.txt') && output.length > 0;

      case 'text-tail-basic':
        return effCmd === 'tail' && raw.includes('notes.txt') && output.length > 0;

      case 'text-wc-lines':
        return hasCall(allCalls, 'wc') &&
               allCalls.some(c => c.effCmd === 'wc' && LessonChecker.hasShortFlag(c.effArgs, 'l', '--lines')) &&
               raw.includes('notes.txt') && output.length > 0;

      case 'text-sort-basic':
        return effCmd === 'sort' && !LessonChecker.hasShortFlag(effArgs, 'r', '--reverse') && raw.includes('data.txt') && output.length > 0;

      case 'system-env-variables':
        return ((effCmd === 'env' || effCmd === 'printenv') &&
                (output.includes('USER=') || (effArgs.length > 0 && output.trim().length > 0))) ||
               (effCmd === 'echo' && /\$(USER|PATH|HOME|SHELL)\b/.test(raw) && output.trim().length > 0);

      // ==========================================
      // 2. FUNDAMENTOS (41 lições)
      // ==========================================
      case 'file-mkdir': {
        const node = fs.getNode('/home/user/myproject') || fs.getNode(fs.resolvePath('myproject'));
        return hasCall(allCalls, 'mkdir') && !!node && node.type === 'directory';
      }

      case 'file-mkdir-p': {
        const node = fs.getNode('/home/user/projeto/src/utils') || fs.getNode(fs.resolvePath('projeto/src/utils'));
        return hasCall(allCalls, 'mkdir') &&
               allCalls.some(c => c.effCmd === 'mkdir' && (LessonChecker.hasShortFlag(c.effArgs, 'p', '--parents'))) &&
               !!node && node.type === 'directory';
      }

      case 'file-touch': {
        const node = fs.getNode('/home/user/test.txt') || fs.getNode(fs.resolvePath('test.txt'));
        return hasCall(allCalls, 'touch') && !!node && node.type === 'file';
      }

      case 'file-cat':
        return effCmd === 'cat' && (raw.includes('readme.txt') || output.includes('README'));

      case 'file-more':
        return effCmd === 'more' && raw.includes('readme.txt') && output.length > 0;

      case 'file-less':
        return effCmd === 'less' && raw.includes('notes.txt') && output.length > 0;

      case 'tool-nano-edit':
        return Boolean(
          ctx && ctx.res && ctx.res.action === 'nano_saved' &&
          ctx.res.filePath && ctx.res.filePath.includes('script.sh') &&
          fs.getNode('/home/user/script.sh') !== null &&
          fs.readFile('/home/user/script.sh').trim().length > 0
        );

      case 'tool-man-page':
        return effCmd === 'man' && effArgs.includes('grep') && output.includes('GREP(1)');

      case 'tool-whatis':
        return effCmd === 'whatis' && effArgs.includes('tar') && output.includes('tar (1)');

      case 'tool-apropos':
        return effCmd === 'apropos' && output.includes('(');

      case 'tool-neofetch':
        return effCmd === 'neofetch' && output.includes('Debian');

      case 'file-echo-write': {
        const helloFile = fs.getNode('/home/user/hello.txt') || fs.getNode(fs.resolvePath('hello.txt'));
        return !!helloFile && helloFile.content && helloFile.content.includes('Hello World');
      }

      case 'file-cp': {
        const backup = fs.getNode('/home/user/backup.txt') || fs.getNode(fs.resolvePath('backup.txt'));
        const orig = fs.getNode('/home/user/documents/readme.txt');
        return hasCall(allCalls, 'cp') && !!backup && backup.type === 'file' && (!orig || backup.content === orig.content);
      }

      case 'file-cp-dir': {
        const backupDir = fs.getNode('/home/user/documents_backup');
        const backupFile = fs.getNode('/home/user/documents_backup/readme.txt');
        return hasCall(allCalls, 'cp') &&
               allCalls.some(c => c.effCmd === 'cp' && (LessonChecker.hasShortFlag(c.effArgs, 'r', '--recursive') || LessonChecker.hasShortFlag(c.effArgs, 'R') || LessonChecker.hasShortFlag(c.effArgs, 'a'))) &&
               !!backupDir && backupDir.type === 'directory' && !!backupFile;
      }

      case 'file-mv':
        return hasCall(allCalls, 'mv') && fs.getNode('/home/user/downloads/test.sh') !== null && fs.getNode('/home/user/projects/test.sh') === null;

      case 'file-mv-rename':
        return effCmd === 'mv' && fs.getNode('/home/user/renomeado.txt') !== null && fs.getNode('/home/user/test.txt') === null;

      case 'file-rm':
        return hasCall(allCalls, 'rm') && fs.getNode('/home/user/documents/notes.txt') === null;

      case 'file-rmdir':
        return (hasCall(allCalls, 'rmdir') || hasCall(allCalls, 'rm')) && fs.getNode('/home/user/downloads') === null;

      case 'file-rm-recursive':
        return effCmd === 'rm' && (LessonChecker.hasShortFlag(effArgs, 'r', '--recursive') || LessonChecker.hasShortFlag(effArgs, 'R')) && fs.getNode('/home/user/pasta_antiga') === null;

      case 'file-grep':
        return hasCall(allCalls, 'grep') && raw.includes('Linux') && raw.includes('readme.txt') && output.includes('Linux');

      case 'advanced-grep-invert':
        return hasCall(allCalls, 'grep') &&
               allCalls.some(c => c.effCmd === 'grep' && LessonChecker.hasShortFlag(c.effArgs, 'v', '--invert-match')) &&
               raw.includes('dados.txt') && output.includes('servidor1') && !output.includes('inativo');

      case 'file-find':
        return effCmd === 'find' && (raw.includes('txt') || output.includes('.txt'));

      case 'permission-ls-l':
        return effCmd === 'ls' && LessonChecker.hasShortFlag(effArgs, 'l', '--long');

      case 'permission-chmod': {
        const node = fs.getNode('/home/user/test.txt') || fs.getNode(fs.resolvePath('test.txt'));
        return hasCall(allCalls, 'chmod') && !!node && node.permissions.includes('x');
      }

      case 'permission-chmod-octal': {
        const node = fs.getNode('/home/user/segredo.txt') || fs.getNode(fs.resolvePath('segredo.txt'));
        return effCmd === 'chmod' && /\b0?600\b/.test(raw) && !!node && node.permissions === 'rw-------';
      }

      case 'permission-chown': {
        const node = fs.getNode('/home/user/test.txt') || fs.getNode(fs.resolvePath('test.txt'));
        return (raw.includes('sudo') || fs.sudoMode) && hasCall(allCalls, 'chown') && raw.includes('admin') && (!!node && node.owner === 'admin');
      }

      case 'permission-sudo-basic':
        return cmd === 'sudo' && raw.includes('/root') && output.includes('root_secret.txt');

      case 'permission-sudo-mkdir': {
        const myfolder = fs.getNode('/opt/myfolder');
        return (cmd === 'sudo' || fs.sudoMode) &&
               hasCall(allCalls, 'mkdir') &&
               myfolder !== null &&
               myfolder.type === 'directory';
      }

      case 'advanced-grep-ignore-case':
        return hasCall(allCalls, 'grep') &&
               allCalls.some(c => c.effCmd === 'grep' && LessonChecker.hasShortFlag(c.effArgs, 'i', '--ignore-case')) &&
               raw.includes('readme.txt') && output.length > 0;

      case 'advanced-cat-line-numbers':
        return effCmd === 'cat' && LessonChecker.hasShortFlag(effArgs, 'n', '--number') && raw.includes('notes.txt') && output.length > 0;

      case 'advanced-cp-verbose':
        return effCmd === 'cp' && LessonChecker.hasShortFlag(effArgs, 'v', '--verbose') && fs.getNode('/home/user/backup.txt') !== null;

      case 'text-cut-fields':
        return hasCall(allCalls, 'cut') && raw.includes('-d') && raw.includes('-f') && raw.includes('notes.txt') && output.length > 0;

      case 'text-tr-transform':
        return hasCall(allCalls, 'tr') && (raw.includes('<') || raw.includes('|')) && output.includes('PENGUIN GYM LINUX');

      case 'text-head-lines':
        return effCmd === 'head' && (effArgs.includes('-n') || effArgs.some(a => /^-n?\d+$/.test(a))) && raw.includes('notes.txt') && output.length > 0;

      case 'text-tail-lines':
        return effCmd === 'tail' && (effArgs.includes('-n') || effArgs.some(a => /^-n?\d+$/.test(a))) && raw.includes('notes.txt') && output.length > 0;

      case 'text-sort-reverse':
        return effCmd === 'sort' && LessonChecker.hasShortFlag(effArgs, 'r', '--reverse') && raw.includes('data.txt') && output.length > 0;

      case 'text-sort-numeric':
        return effCmd === 'sort' && LessonChecker.hasShortFlag(effArgs, 'n', '--numeric-sort') && raw.includes('numeros.txt') && output.startsWith('2\n9\n25');

      case 'text-uniq-basic':
        return hasCall(allCalls, 'uniq') && raw.includes('data.txt') && output.length > 0;

      case 'text-uniq-count':
        return hasCall(allCalls, 'uniq') &&
               allCalls.some(c => c.effCmd === 'uniq' && LessonChecker.hasShortFlag(c.effArgs, 'c', '--count')) &&
               raw.includes('data.txt') && output.length > 0;

      case 'text-sort-uniq-combo':
        return hasCall(pipelineCalls, 'sort') && hasCall(pipelineCalls, 'uniq') && raw.includes('bagunca.txt') && output.includes('3 banana') && output.includes('2 apple');

      case 'file-diff-comparison':
        return effCmd === 'diff' && raw.includes('readme.txt') && raw.includes('notes.txt') && output.length > 0;

      // ==========================================
      // 3. SYSADMIN & SERVIÇOS (36 lições)
      // ==========================================
      case 'sys-sudo-root-session':
        return (raw === 'sudo -i' || raw === 'sudo su' || raw === 'su -') && fs.sudoMode === true;

      case 'sys-session-exit':
        return (effCmd === 'exit' || effCmd === 'logout') && (output.includes('exit') || output.includes('logout'));

      case 'sys-systemctl-status':
        return (effCmd === 'systemctl' || effCmd === 'service') && raw.includes('status') && raw.includes('nginx') && output.includes('nginx.service');

      case 'sys-systemctl-is-active':
        return effCmd === 'systemctl' && effArgs[0] === 'is-active' && (effArgs[1] || '').replace(/\.service$/, '') === 'nginx' && output.trim() === 'active';

      case 'sys-systemctl-restart':
        return (effCmd === 'systemctl' || effCmd === 'service') && raw.includes('restart') && raw.includes('nginx') &&
               (commandEngine ? commandEngine.services.nginx.active === true : true);

      case 'sys-systemctl-stop':
        return (effCmd === 'systemctl' || effCmd === 'service') && raw.includes('stop') && raw.includes('nginx') &&
               (commandEngine ? commandEngine.services.nginx.active === false : true);

      case 'sys-systemctl-start':
        return (effCmd === 'systemctl' || effCmd === 'service') && raw.includes('start') && raw.includes('postgresql') &&
               (commandEngine ? commandEngine.services.postgresql.active === true : true);

      case 'sys-systemctl-enable':
        return effCmd === 'systemctl' && effArgs[0] === 'enable' && (effArgs[1] || '').replace(/\.service$/, '') === 'nginx' &&
               (commandEngine ? commandEngine.services.nginx.enabled === true : output.includes('multi-user.target.wants'));

      case 'sys-systemctl-disable':
        return effCmd === 'systemctl' && effArgs[0] === 'disable' && (effArgs[1] || '').replace(/\.service$/, '') === 'nginx' &&
               (commandEngine ? commandEngine.services.nginx.enabled === false : output.includes('Removed'));

      case 'sys-journalctl-lines':
        return effCmd === 'journalctl' &&
               effArgs.some(a => a === '-n' || /^-n\d+$/.test(a) || a.startsWith('--lines=')) &&
               output.split('\n').filter(Boolean).length > 0 &&
               output.split('\n').filter(Boolean).length <= 5;

      case 'sys-journalctl-unit':
        return effCmd === 'journalctl' &&
               effArgs.some(a => a === '-u' || a.startsWith('-u=') || a.startsWith('--unit=') || (a.startsWith('-u') && a.length > 2)) &&
               raw.includes('ssh') && output.includes('sshd');

      case 'sys-apt-update':
        return (effCmd === 'apt' || effCmd === 'apt-get') && effArgs.includes('update') && output.includes('Lendo listas de pacotes');

      case 'sys-apt-upgrade':
        return (effCmd === 'apt' || effCmd === 'apt-get') && effArgs.includes('upgrade') && output.includes('Calculando atualização');

      case 'sys-apt-search':
        return effCmd === 'apt' && effArgs.includes('search') && effArgs.includes('htop') && output.includes('htop');

      case 'sys-apt-show':
        return effCmd === 'apt' && effArgs.includes('show') && effArgs.includes('neofetch') && output.includes('Package: neofetch');

      case 'sys-apt-install':
        return (effCmd === 'apt' || effCmd === 'apt-get') && effArgs.includes('install') && effArgs.includes('cowsay') && fs.getNode('/usr/bin/cowsay') !== null;

      case 'sys-apt-remove':
        return (effCmd === 'apt' || effCmd === 'apt-get') && effArgs.includes('remove') && effArgs.includes('cowsay') &&
               (commandEngine ? !commandEngine.installedPackages.has('cowsay') : output.includes('Removendo cowsay'));

      case 'sys-apt-purge':
        return (effCmd === 'apt' || effCmd === 'apt-get') && effArgs.includes('purge') && effArgs.includes('cowsay') &&
               output.includes('Expurgando') &&
               (commandEngine ? !commandEngine.installedPackages.has('cowsay') : true);

      case 'sys-apt-autoremove':
        return (effCmd === 'apt' || effCmd === 'apt-get') && effArgs.includes('autoremove') && output.includes('Lendo listas de pacotes');

      case 'sys-dpkg-list':
        return effCmd === 'dpkg' && (effArgs.includes('-l') || effArgs.includes('--list')) && output.includes('ii  ');

      case 'sys-free-human':
        return effCmd === 'free' && LessonChecker.hasShortFlag(effArgs, 'h', '--human') && output.includes('Mem.:');

      case 'sys-lscpu':
        return effCmd === 'lscpu' && output.includes('x86_64');

      case 'sys-lsblk':
        return effCmd === 'lsblk' && output.includes('sda');

      case 'sys-id-user':
        return effCmd === 'id' && output.includes('uid=');

      case 'sys-useradd':
        return effCmd === 'useradd' && effArgs.includes('devops') && (fs.getNode('/home/devops') !== null || fs.readFile('/etc/passwd').includes('devops:'));

      case 'sys-groupadd':
        return effCmd === 'groupadd' && effArgs.includes('deploy') && fs.readFile('/etc/group').includes('deploy:');

      case 'sys-usermod-group':
        return effCmd === 'usermod' && effArgs.includes('deploy') && effArgs.includes('devops') &&
               fs.readFile('/etc/group').split('\n').some(l => l.startsWith('deploy:') && l.includes('devops'));

      case 'sys-groups-check':
        return effCmd === 'groups' && effArgs.includes('devops') && output.includes('deploy');

      case 'sys-passwd-user':
        return effCmd === 'passwd' && effArgs.includes('devops') && output.includes('atualizadas com sucesso');

      case 'sys-userdel':
        return effCmd === 'userdel' && LessonChecker.hasShortFlag(effArgs, 'r', '--remove') && effArgs.includes('devops') &&
               !fs.readFile('/etc/passwd').split('\n').some(l => l.startsWith('devops:')) &&
               fs.getNode('/home/devops') === null;

      case 'sys-crontab-list':
        return effCmd === 'crontab' && effArgs.includes('-l') && output.includes('backup.sh');

      case 'sys-crontab-edit':
        return Boolean(
          ctx && ctx.res && ctx.res.action === 'nano_saved' && ctx.res.crontabMode === true &&
          (!commandEngine || (commandEngine.userCrontab.trim().length > 0 &&
            commandEngine.userCrontab !== '# m h  dom mon dow   command\n0 3 * * * /usr/local/bin/backup.sh\n'))
        );

      case 'sys-crontab-remove':
        return effCmd === 'crontab' && effArgs.includes('-r') && (commandEngine ? commandEngine.userCrontab === '' : true);

      case 'sys-dmesg':
        return effCmd === 'dmesg' && output.includes('Linux version');

      case 'system-uname':
        return effCmd === 'uname' && (effArgs.includes('-a') || effArgs.includes('--all')) && output.includes('Linux') && output.includes('x86_64');

      case 'system-uptime':
        return effCmd === 'uptime' && output.includes('up');

      // ==========================================
      // 4. AVANÇADO (26 lições)
      // ==========================================
      case 'text-tree-view':
        return effCmd === 'tree' && output.includes('directories');

      case 'process-ps':
        return effCmd === 'ps' && output.includes('PID');

      case 'process-top':
        return effCmd === 'top' && output.includes('PID');

      case 'process-df':
        return effCmd === 'df' && output.includes('%');

      case 'process-du':
        return effCmd === 'du' && output.length > 0;

      case 'process-du-summary':
        return effCmd === 'du' && LessonChecker.hasShortFlag(effArgs, 's') && LessonChecker.hasShortFlag(effArgs, 'h') && raw.includes('documents');

      case 'text-tee-pipe': {
        const relatorio = fs.getNode('/home/user/relatorio.txt') || fs.getNode(fs.resolvePath('relatorio.txt'));
        return hasCall(pipelineCalls, 'ls') &&
               hasCall(pipelineCalls, 'tee') &&
               relatorio !== null &&
               relatorio.content &&
               relatorio.content.trim().length > 0 &&
               output.trim() === relatorio.content.trim();
      }

      case 'text-tree-depth': {
        const idxL = effArgs.indexOf('-L');
        const hasL2 = (idxL !== -1 && effArgs[idxL + 1] === '2') || effArgs.includes('-L2');
        return effCmd === 'tree' && hasL2 && output.includes('directories');
      }

      case 'text-column-format':
        return effCmd === 'column' && output.includes('servidor1');

      case 'tool-jq-parse':
        return hasCall(allCalls, 'jq') && output.includes('"version": "2.0.0"');

      case 'text-jq-filter':
        return hasCall(allCalls, 'jq') && raw.includes('.version') && output.includes('2.0.0');

      case 'process-kill':
        return effCmd === 'kill' && effArgs.includes('123');

      case 'process-kill-sigkill':
        return effCmd === 'kill' &&
               (effArgs.includes('-9') || effArgs.includes('-KILL') || effArgs.includes('-SIGKILL') ||
                (effArgs.includes('-s') && /^(SIG)?KILL|9$/i.test(effArgs[effArgs.indexOf('-s') + 1] || ''))) &&
               effArgs.includes('123');

      case 'process-pgrep':
        return effCmd === 'pgrep' && raw.includes('nginx') && output.includes('123');

      case 'process-pkill':
        return effCmd === 'pkill' && raw.includes('nginx') &&
               (commandEngine ? commandEngine.killedProcesses.has('123') : true);

      case 'process-jobs-bg':
        return effCmd === 'jobs' && allSessionText.includes('sleep') && allSessionText.includes('&') && output.includes('sleep');

      case 'pipeline-ls-grep':
        return hasCall(pipelineCalls, 'ls') && hasCall(pipelineCalls, 'grep') && output.includes('readme.txt');

      case 'redirect-output-basic': {
        const logNode = fs.getNode('/home/user/study_log.txt') || fs.getNode(fs.resolvePath('study_log.txt'));
        return raw.includes('>') && !raw.includes('>>') && !!logNode && logNode.content.includes('Linux Study Log');
      }

      case 'redirect-append-advanced': {
        const logNode = fs.getNode('/home/user/study_log.txt') || fs.getNode(fs.resolvePath('study_log.txt'));
        return raw.includes('>>') && !!logNode && logNode.content.includes('Linux Study Log') &&
               logNode.content.split('\n').filter(Boolean).length >= 2 &&
               (hasCall(allCalls, 'date') || /\b202\d\b|UTC/.test(logNode.content));
      }

      case 'text-sed-replace':
        return effCmd === 'sed' && raw.includes('Linux') && output.includes('GNU/Linux');

      case 'text-sed-inplace':
        return effCmd === 'sed' && LessonChecker.hasShortFlag(effArgs, 'i') && fs.readFile('/home/user/config.txt').includes('versao=2');

      case 'text-sed-delete':
        return effCmd === 'sed' && raw.includes('/inativo/d') && output.includes('servidor1') && !output.includes('inativo');

      case 'text-awk-columns':
        return effCmd === 'awk' && raw.includes('$1') && raw.includes('$3') && output.includes('servidor1') && output.includes('ativo');

      case 'text-awk-delimiter':
        return effCmd === 'awk' && (raw.includes('-F') || raw.includes('-F,')) && output.includes('aluno') && output.includes('admin');

      case 'text-awk-filter':
        return effCmd === 'awk' && raw.includes('ativo') && output.includes('servidor1') && output.includes('servidor3') && !output.includes('servidor2');

      case 'text-xargs-basic':
        return hasCall(allCalls, 'xargs') && raw.includes('touch') && (fs.getNode('/home/user/arq1.txt') !== null && fs.getNode('/home/user/arq2.txt') !== null);

      // ==========================================
      // 5. LPIC-1 (28 lições)
      // ==========================================
      case 'lpic-tar-list':
        return effCmd === 'tar' && (effArgs.some(a => a.includes('t')) || raw.includes('-t')) && output.includes('documents');

      case 'lpic-gzip-compress': {
        const gzNode = fs.getNode('/home/user/documents/notes.txt.gz') || fs.getNode(fs.resolvePath('documents/notes.txt.gz')) || fs.getNode(fs.resolvePath('notes.txt.gz'));
        return effCmd === 'gzip' && !effArgs.includes('-d') && gzNode !== null;
      }

      case 'lpic-gunzip-decompress':
        return allSessionText.includes('gzip') &&
               (effCmd === 'gunzip' || (effCmd === 'gzip' && effArgs.includes('-d'))) &&
               fs.getNode('/home/user/documents/notes.txt') !== null &&
               fs.getNode('/home/user/documents/notes.txt.gz') === null;

      case 'text-file-type':
        return effCmd === 'file' && raw.includes('readme.txt') && output.includes('text');

      case 'text-tac-reverse':
        return effCmd === 'tac' && raw.includes('readme.txt') && output.length > 0;

      case 'text-rev-chars':
        return effCmd === 'rev' && raw.includes('readme.txt') && output.length > 0;

      case 'text-nl-lines':
        return effCmd === 'nl' && raw.includes('readme.txt') && output.includes('1\t');

      case 'text-base64-encode':
        return hasCall(allCalls, 'base64') && !effArgs.includes('-d') && (output.trim() === 'TGludXg=' || output.trim() === 'TGludXgK');

      case 'text-base64-decode':
        return hasCall(allCalls, 'base64') && effArgs.includes('-d') && output.includes('Linux');

      case 'lpic-ln-symbolic': {
        const sym = fs.getRawNode('/home/user/readme-link');
        return effCmd === 'ln' && effArgs.some(a => a === '-s' || a === '--symbolic') &&
               !!sym && sym.type === 'symlink' && sym.target.includes('readme.txt');
      }

      case 'lpic-ln-hardlink': {
        const hard = fs.getNode('/home/user/notes-hard.txt');
        return effCmd === 'ln' && !effArgs.some(a => a === '-s' || a === '--symbolic') &&
               !!hard && !!hard.hardlinkOf && hard.links >= 2;
      }

      case 'lpic-readlink':
        return effCmd === 'readlink' && raw.includes('readme-link') && output.includes('readme.txt');

      case 'lpic-tar-create': {
        const tarNode = fs.getNode('/home/user/docs.tar') || fs.getNode(fs.resolvePath('docs.tar'));
        return effCmd === 'tar' && effArgs.some(a => a.includes('c')) && tarNode !== null;
      }

      case 'lpic-tar-extract':
        return allSessionText.includes('tar') &&
               raw.includes('proj.tar') &&
               effArgs.some(a => a.includes('x')) &&
               fs.getNode('/home/user/proj.tar') !== null &&
               fs.getNode('/home/user/projects/test.sh') !== null;

      case 'lpic-tar-gzip-create':
        return effCmd === 'tar' && effArgs.some(a => a.includes('c')) && (effArgs.some(a => a.includes('z')) || raw.includes('-z')) && fs.getNode('/home/user/docs.tar.gz') !== null;

      case 'lpic-tar-extract-dir':
        return effCmd === 'tar' && effArgs.some(a => a.includes('x')) && (effArgs.includes('-C') || effArgs.includes('--directory')) &&
               fs.getNode('/home/user/downloads/documents/readme.txt') !== null;

      case 'lpic-zcat-log':
        return effCmd === 'zcat' && raw.includes('access.log.1.gz') && output.includes('GET /');

      case 'lpic-zip-create':
        return effCmd === 'zip' && fs.getNode('/home/user/proj.zip') !== null;

      case 'lpic-unzip-extract':
        return effCmd === 'unzip' && effArgs.includes('-d') && fs.getNode('/home/user/downloads/projects/test.sh') !== null;

      case 'lpic-find-exec-cat':
        return effCmd === 'find' && effArgs.includes('-exec') && effArgs.includes('cat') && output.length > 0;

      case 'lpic-grep-recursive':
        return hasCall(allCalls, 'grep') &&
               allCalls.some(c => c.effCmd === 'grep' && (LessonChecker.hasShortFlag(c.effArgs, 'r', '--recursive') || LessonChecker.hasShortFlag(c.effArgs, 'R'))) &&
               output.includes('Linux');

      case 'lpic-ls-long-detail':
        return effCmd === 'ls' && LessonChecker.hasShortFlag(effArgs, 'l', '--long');

      case 'lpic-umask':
        return effCmd === 'umask' && (commandEngine ? commandEngine.fs.umask === '0027' : true);

      case 'text-stat-info':
        return effCmd === 'stat' && output.includes('Inode:') && output.includes('readme.txt');

      case 'text-sha256sum':
        return effCmd === 'sha256sum' && raw.includes('readme.txt') && output.length >= 64;

      case 'lpic-md5sum':
        return effCmd === 'md5sum' && raw.includes('readme.txt') && output.length >= 32;

      case 'lpic-find-exec-grep':
        return effCmd === 'find' && effArgs.includes('-exec') && effArgs.includes('grep') && output.length > 0;

      case 'lpic-find-type-depth':
        return effCmd === 'find' && effArgs.includes('-maxdepth') && effArgs.includes('-type') && effArgs.includes('f') && output.length > 0;

      case 'lpic-find-tar-combo':
        return (hasCall(allCalls, 'find') || /\bfind\b/.test(allSessionText)) &&
               hasCall(allCalls, 'tar') &&
               raw.includes('proj-backup.tar') &&
               fs.getNode('/home/user/proj-backup.tar') !== null;

      // ==========================================
      // 6. GIT (16+ lições)
      // ==========================================
      case 'git-init':
        return effCmd === 'git' && effArgs[0] === 'init' && git.initialized === true;

      case 'git-status-untracked':
        return effCmd === 'git' && effArgs[0] === 'status' && output.includes('README.md');

      case 'git-add':
        return effCmd === 'git' && effArgs[0] === 'add' && (git.index.has('README.md') || git.index.size > 0);

      case 'git-commit':
        return effCmd === 'git' && effArgs[0] === 'commit' && git.commits.length >= 1;

      case 'git-log':
        return effCmd === 'git' && effArgs[0] === 'log' && output.includes('commit');

      case 'git-add-all':
        return effCmd === 'git' && effArgs[0] === 'add' && (effArgs.includes('.') || effArgs.includes('-A') || effArgs.includes('--all')) &&
               git.index.has('index.html') && git.index.has('style.css');

      case 'git-commit-second':
        return effCmd === 'git' && effArgs[0] === 'commit' && git.commits.length >= 2;

      case 'git-branch-create':
        return effCmd === 'git' && effArgs[0] === 'branch' && git.branches.includes('feature');

      case 'git-branch-list':
        return effCmd === 'git' && effArgs[0] === 'branch' && effArgs.slice(1).every(a => a.startsWith('-')) && output.includes('feature');

      case 'git-switch':
        return effCmd === 'git' && (effArgs[0] === 'switch' || effArgs[0] === 'checkout') && git.currentBranch === 'feature';

      case 'git-diff-staged':
        return effCmd === 'git' && effArgs[0] === 'diff' && (effArgs.includes('--staged') || effArgs.includes('--cached')) && output.includes('diff --git');

      case 'git-restore-staged':
        return effCmd === 'git' && (effArgs[0] === 'restore' || effArgs[0] === 'reset') && !git.index.has('.env') && git.index.has('index.html');

      case 'git-switch-create':
        return effCmd === 'git' && ((effArgs[0] === 'switch' && effArgs.includes('-c')) || (effArgs[0] === 'checkout' && effArgs.includes('-b'))) && git.currentBranch === 'hotfix';

      case 'git-merge':
        return effCmd === 'git' && effArgs[0] === 'merge' && effArgs.includes('feature') && git.commits.some(c => c.message.includes('Merge branch'));

      case 'git-branch-delete':
        return effCmd === 'git' && effArgs[0] === 'branch' && (effArgs.includes('-d') || effArgs.includes('-D')) && !git.branches.includes('feature');

      case 'git-stash':
        return allSessionText.includes('git stash') && effCmd === 'git' && effArgs[0] === 'stash' &&
               ((effArgs[1] === 'pop' && git.stashes.length === 0) || (effArgs[1] === 'apply' && git.index.has('index.html')));

      case 'git-gitignore': {
        const gi = fs.getNode('/home/user/.gitignore');
        return !!gi && (gi.content || '').includes('.env') &&
               effCmd === 'git' && effArgs[0] === 'status' && !output.includes('.env');
      }

      // ==========================================
      // 7. DOCKER (15 lições)
      // ==========================================
      case 'docker-pull':
        return effCmd === 'docker' && effArgs[0] === 'pull' && docker.images.has('hello-world');

      case 'docker-images':
        return effCmd === 'docker' && effArgs[0] === 'images' && output.includes('hello-world');

      case 'docker-run-hello':
        return effCmd === 'docker' && effArgs[0] === 'run' && Array.from(docker.containers.values()).some(c => c.image === 'hello-world');

      case 'docker-ps-a':
        return effCmd === 'docker' && effArgs[0] === 'ps' && (effArgs.includes('-a') || effArgs.includes('--all'));

      case 'docker-run-detached':
        return effCmd === 'docker' && effArgs[0] === 'run' && Array.from(docker.containers.values()).some(c => c.status.startsWith('Up'));

      case 'docker-ps':
        return effCmd === 'docker' && effArgs[0] === 'ps' && !effArgs.includes('-a') && !effArgs.includes('--all');

      case 'docker-stop':
        return effCmd === 'docker' && effArgs[0] === 'stop' && Array.from(docker.containers.values()).some(c => c.status.includes('Exited'));

      case 'docker-start':
        return effCmd === 'docker' && effArgs[0] === 'start' && Array.from(docker.containers.values()).some(c => c.name === 'web' && c.status.startsWith('Up'));

      case 'docker-rm':
        return effCmd === 'docker' && effArgs[0] === 'rm' && !Array.from(docker.containers.values()).some(c => c.name === 'web');

      case 'docker-rmi':
        return effCmd === 'docker' && effArgs[0] === 'rmi' && !docker.images.has('hello-world');

      case 'docker-run-port':
        return effCmd === 'docker' && effArgs[0] === 'run' && Array.from(docker.containers.values()).some(c => c.ports && c.ports.includes('8080'));

      case 'docker-logs':
        return effCmd === 'docker' && effArgs[0] === 'logs' && raw.includes('web2') && output.includes('nginx');

      case 'docker-exec':
        return effCmd === 'docker' && effArgs[0] === 'exec' && raw.includes('web2') && raw.includes('uname') && output.includes('Linux');

      case 'docker-inspect':
        return effCmd === 'docker' && effArgs[0] === 'inspect' && raw.includes('web2') && output.includes('"Id"');

      case 'docker-build':
        return effCmd === 'docker' && effArgs[0] === 'build' && docker.images.has('penguin-api') && output.includes('Successfully tagged');

      // ==========================================
      // 8. SCRIPTING & SHELL POWER (23+ lições)
      // ==========================================
      case 'bash-arithmetic':
        return (raw.includes('$((') || hasCall(allCalls, 'expr') || hasCall(allCalls, 'bc')) && output.trim() === '40';

      case 'bash-exit-code':
        return effCmd === 'echo' && raw.includes('$?') && /^\d+$/.test(output.trim());

      case 'bash-alias-create':
        return raw.includes('alias') && raw.includes('c=') && raw.includes('clear') &&
               (commandEngine ? commandEngine.aliases['c'] === 'clear' : true);

      case 'bash-alias-list':
        return effCmd === 'alias' && effArgs.length === 0 && output.includes('alias');

      case 'bash-alias-remove':
        return effCmd === 'unalias' && effArgs.includes('c') &&
               (commandEngine ? !Object.prototype.hasOwnProperty.call(commandEngine.aliases, 'c') : true);

      case 'bash-history-exec':
        return (raw === '!!' || raw.startsWith('!!') || allSessionText.includes('!!') || (ctx && ctx.res && (ctx.res.rawCommand === '!!' || ctx.res.wasHistoryExpansion))) && output.length > 0;

      case 'bash-history-list':
        return effCmd === 'history' && !effArgs.includes('-c');

      case 'bash-redirect-stderr': {
        const hasErrFile = fs.getNode('/home/user/erros.txt') !== null ||
                           fs.getNode(fs.resolvePath('erros.txt')) !== null ||
                           fs.getNode('/home/user/erro.log') !== null ||
                           fs.getNode(fs.resolvePath('erro.log')) !== null;
        return (raw.includes('2>') || allSessionText.includes('2>')) && hasErrFile;
      }

      case 'bash-redirect-all': {
        const tudo = fs.getNode('/home/user/tudo.log') || fs.getNode(fs.resolvePath('tudo.log'));
        return (raw.includes('&>') || raw.includes('2>&1')) && !!tudo &&
               tudo.content.includes('teste.txt') && tudo.content.includes('/root');
      }

      case 'bash-redirect-devnull':
        return raw.includes('2>') && raw.includes('/dev/null') && output.trim() === '';

      case 'bash-here-string':
        return effCmd === 'cat' && raw.includes('<<<') && output.toLowerCase().includes('penguin gym');

      case 'bash-subshell': {
        const hasParens = (raw.startsWith('(') && raw.endsWith(')')) ||
                          (raw.includes('(') && raw.includes(')'));
        const hasCdTmp = raw.includes('cd /tmp') || raw.includes('cd /tmp/') || (ctx && ctx.res && ctx.res.subshellInner && ctx.res.subshellInner.includes('cd'));
        const hasPwd = raw.includes('pwd') || (ctx && ctx.res && ctx.res.subshellInner && ctx.res.subshellInner.includes('pwd'));
        const isSubshell = hasParens || (ctx && ctx.res && ctx.res.wasSubshell);
        return Boolean(isSubshell && hasCdTmp && hasPwd && output.includes('/tmp'));
      }

      case 'bash-dir-stack':
        return effCmd === 'pushd' && raw.includes('/etc') && fs.currentPath === '/etc';

      case 'bash-popd':
        return allSessionText.includes('pushd') && effCmd === 'popd' && fs.currentPath === '/home/user';

      case 'bash-export-env':
        return (effCmd === 'export' || hasCall(allCalls, 'export')) && raw.includes('GYM_ENV') &&
               (commandEngine ? commandEngine.envVars.GYM_ENV === 'production' : true);

      case 'bash-source-bashrc':
        return (effCmd === 'source' || effCmd === '.') && raw.includes('.bashrc');

      case 'bash-run-script':
        return (raw.includes('bash') || raw.includes('./')) && raw.includes('script.sh') && output.length > 0;

      case 'bash-exec-chmod': {
        const scr = fs.getNode('/home/user/script.sh');
        return raw.includes('./script.sh') && !!scr && scr.permissions.includes('x') && output.includes('Executado diretamente');
      }

      case 'bash-script-args':
        return raw.includes('saudacao.sh') && raw.includes('Penguin') && output.includes('Ola, Penguin!');

      case 'bash-cmd-subst':
        return raw.includes('$(') && raw.includes('uname') && output.includes('Kernel: Linux');

      case 'bash-or-fallback':
        return raw.includes('||') && raw.includes('inexistente.txt') && output.includes('Arquivo ausente');

      case 'bash-loop-for': {
        const hasLog1 = fs.getNode('/home/user/log_1.txt') !== null || fs.getNode(fs.resolvePath('log_1.txt')) !== null;
        const hasLog3 = fs.getNode('/home/user/log_3.txt') !== null || fs.getNode(fs.resolvePath('log_3.txt')) !== null;
        return raw.includes('for') && raw.includes('do') && raw.includes('done') && hasLog1 && hasLog3;
      }

      case 'bash-test-condition':
        return raw.includes('if') && raw.includes('-f') && output.includes('Existe');

      // ==========================================
      // 9. REDES & CONECTIVIDADE (26+ lições)
      // ==========================================
      case 'net-ip-addr':
        return effCmd === 'ip' && effArgs.some(a => /^(a|addr|address)$/i.test(a)) && output.includes('inet ');

      case 'net-ip-route':
        return effCmd === 'ip' && effArgs.some(a => /^(r|route)$/i.test(a)) && output.includes('default via');

      case 'net-ping':
        return effCmd === 'ping' && effArgs.some(a => a === '-c' || /^-c\d+$/.test(a)) && output.includes('estatísticas de ping');

      case 'net-traceroute':
        return effCmd === 'traceroute' && raw.includes('penguin-gym.com') && output.includes('traceroute to');

      case 'net-curl-get':
        return effCmd === 'curl' && (raw.includes('localhost') || raw.includes('127.0.0.1')) &&
               !effArgs.some(a => a === '--head' || (a.startsWith('-') && !a.startsWith('--') && a.includes('I'))) &&
               output.includes('<!DOCTYPE html>');

      case 'net-curl-head':
        return effCmd === 'curl' && effArgs.some(a => a === '--head' || (a.startsWith('-') && !a.startsWith('--') && a.includes('I'))) && output.includes('HTTP/1.1 200 OK');

      case 'net-curl-download': {
        const hasOut = fs.getNode('/home/user/saida.json') || fs.getNode(fs.resolvePath('saida.json')) ||
                       fs.getNode('/home/user/app.json') || fs.getNode(fs.resolvePath('app.json'));
        return effCmd === 'curl' &&
               effArgs.some(a => a === '--output' || a === '--remote-name' || a.startsWith('-o') || (a.startsWith('-') && !a.startsWith('--') && a.includes('O'))) &&
               hasOut !== null;
      }

      case 'net-curl-post':
        return effCmd === 'curl' && (raw.includes('-d') || raw.includes('--data')) && output.includes('"status": "created"') && output.includes('Tux');

      case 'net-curl-jq':
        return hasCall(pipelineCalls, 'curl') && hasCall(pipelineCalls, 'jq') && output.includes('penguin-gym-api');

      case 'net-wget': {
        const dadosNode = fs.getNode('/home/user/dados.txt') || fs.getNode(fs.resolvePath('dados.txt'));
        return effCmd === 'wget' && dadosNode !== null;
      }

      case 'net-dig':
        return effCmd === 'dig' && raw.includes('penguin-gym.com') && !raw.includes('+short') && output.includes('ANSWER SECTION');

      case 'net-dig-short':
        return effCmd === 'dig' && raw.includes('+short') && raw.includes('penguin-gym.com') && output.includes('93.184.216.34');

      case 'net-nslookup':
        return effCmd === 'nslookup' && raw.includes('penguin-gym.com') && output.includes('Address: 93.184.216.34');

      case 'net-host':
        return effCmd === 'host' && raw.includes('penguin-gym.com') && output.includes('mail is handled by');

      case 'net-ss-listen':
        return effCmd === 'ss' && output.includes('LISTEN');

      case 'net-netstat':
        return effCmd === 'netstat' && output.includes('OUÇA');

      case 'net-nc-port':
        return (effCmd === 'nc' || effCmd === 'netcat') && raw.includes('80') && output.includes('succeeded');

      case 'net-nmap-scan':
        return effCmd === 'nmap' && raw.includes('localhost') && output.includes('80/tcp');

      case 'net-scp-copy':
        return effCmd === 'scp' && raw.includes('readme.txt') && raw.includes('192.168.1.50') && output.includes('100%');

      case 'net-rsync-sync':
        return effCmd === 'rsync' && raw.includes('projects') && raw.includes('192.168.1.50') && output.includes('100%');

      case 'net-etc-hosts':
        return (effCmd === 'cat' || effCmd === 'less' || effCmd === 'head') && raw.includes('/etc/hosts') && output.includes('penguin-gym');

      case 'net-ufw-status':
        return effCmd === 'ufw' && effArgs.includes('status') && output.includes('Status:');

      case 'net-ufw-enable':
        return effCmd === 'ufw' && effArgs.includes('enable') && output.includes('active and enabled');

      case 'net-ufw-allow':
        return effCmd === 'ufw' && effArgs.includes('allow') && (raw.includes('80') || /\bhttp\b/i.test(raw)) && output.includes('Rule added');

      case 'net-ufw-deny':
        return effCmd === 'ufw' && effArgs.includes('deny') && (raw.includes('23') || /\btelnet\b/i.test(raw)) && output.includes('Rule added');

      case 'net-ufw-delete':
        return effCmd === 'ufw' && effArgs.includes('delete') && output.includes('Rule deleted') &&
               (raw.includes('80') || /\bhttp\b/i.test(raw) || (commandEngine && !commandEngine.ufwState.rules.some(r => r.startsWith('80/'))));

      case 'net-ufw-disable':
        return effCmd === 'ufw' && effArgs.includes('disable') && output.includes('disabled on system startup');

      // ==========================================
      // 10. DATABASE / SQL (17+ lições)
      // ==========================================
      case 'db-tables':
        return hasCall(allCalls, 'sqlite3') && raw.includes('.tables') && output.includes('members');

      case 'db-schema':
        return hasCall(allCalls, 'sqlite3') && raw.includes('.schema') && output.includes('CREATE TABLE members');

      case 'db-count':
        return hasCall(allCalls, 'sqlite3') && /count\(\s*(\*|id|1)\s*\)/i.test(raw) && output.trim() === '12';

      case 'db-select-where':
        return hasCall(allCalls, 'sqlite3') && /where/i.test(raw) && /tokyo/i.test(raw) && output.includes('Pip');

      case 'db-order-limit':
        return hasCall(allCalls, 'sqlite3') && /order\s+by\s+age\s+desc/i.test(raw) && /limit\s+3/i.test(raw) &&
               output.includes('Nico|45') && output.includes('Tama|38') && output.includes('Ken|33');

      case 'db-group-count':
        return hasCall(allCalls, 'sqlite3') && /group\s+by/i.test(raw) && /count/i.test(raw) && output.includes('Tokyo|4');

      case 'db-having':
        return hasCall(allCalls, 'sqlite3') && /group\s+by/i.test(raw) && /having/i.test(raw) && output.includes('Tokyo|4') && !output.includes('Porto');

      case 'db-pipe':
        return hasCall(allCalls, 'sqlite3') && hasCall(pipelineCalls, 'sort') && hasCall(pipelineCalls, 'uniq') && output.includes('Tokyo');

      case 'db-null':
        return hasCall(allCalls, 'sqlite3') && /is\s+null/i.test(raw) && output.includes('Rio');

      case 'db-boundary':
        return hasCall(allCalls, 'sqlite3') && (/>=\s*20/.test(raw) || /20\s*<=/.test(raw)) && output.trim() === '10';

      case 'db-between':
        return hasCall(allCalls, 'sqlite3') && /between\s+20\s+and\s+30/i.test(raw) && output.includes('Pip') && !output.includes('Nico');

      case 'db-join':
        return hasCall(allCalls, 'sqlite3') && /join/i.test(raw) && /ended_at\s+is\s+null/i.test(raw) && output.includes('Momo|pro');

      case 'db-left-join':
        return hasCall(allCalls, 'sqlite3') && (/left\s+join/i.test(raw) || /not\s+in/i.test(raw) || /not\s+exists/i.test(raw)) && output.includes('Kai');

      case 'db-update-where':
        return hasCall(allCalls, 'sqlite3') && /update\s+members/i.test(raw) && /osaka/i.test(raw) &&
               sql.legacyMembers.find(m => m.id === 3)?.city === 'Osaka';

      case 'db-create-table':
        return hasCall(allCalls, 'sqlite3') && /create\s+table/i.test(raw) && !!sql.customTables && !!sql.customTables.workouts;

      case 'db-insert-into':
        return hasCall(allCalls, 'sqlite3') && /insert\s+into\s+members/i.test(raw) &&
               sql.members.some(m => m.name === 'Tux' && m.city === 'Tokyo');

      case 'db-delete-where':
        return hasCall(allCalls, 'sqlite3') && /delete\s+from\s+members/i.test(raw) &&
               !sql.legacyMembers.some(m => m.id === 10) && sql.legacyMembers.length === 8;

      case 'db-like-search':
        return hasCall(allCalls, 'sqlite3') && /like/i.test(raw) && output.includes('Pip') && !output.includes('Rio');

      case 'db-sum-avg':
        return hasCall(allCalls, 'sqlite3') && /avg\s*\(\s*monthly_fee\s*\)/i.test(raw) && output.includes('3333.33');

      // ==========================================
      // 11. INCIDENTES / BOSS CROSS-DOMAIN (5+ lições)
      // ==========================================
      case 'inc-nginx-404':
        return allSessionText.includes('/var/log/nginx') &&
               (effCmd === 'ss' || effCmd === 'netstat') &&
               (output.includes('LISTEN') || output.includes('OUÇA'));

      case 'inc-postgresql-down':
        return commandEngine
          ? (commandEngine.services.postgresql.active && commandEngine.services.postgresql.enabled)
          : (allSessionText.includes('start') && raw.includes('enable') && raw.includes('postgresql'));

      case 'inc-git-secret-leak':
        return !!git && !git.index.has('.env') &&
               git.commits.length >= 1 &&
               git.commits[0].files.includes('app.js') &&
               !git.commits[0].files.includes('.env') &&
               fs.getNode('/home/user/.env') !== null;

      case 'inc-docker-conflict':
        return !!docker &&
               !Array.from(docker.containers.values()).some(c => c.name === 'travado') &&
               !docker.images.has('nginx') &&
               effCmd === 'docker' && effArgs[0] === 'rmi';

      case 'inc-backup-pipeline':
        return fs.getNode('/home/user/tokyo.csv') !== null &&
               fs.getNode('/home/user/tokyo.csv.gz') !== null &&
               effCmd === 'sha256sum' && raw.includes('tokyo.csv.gz') && output.length >= 64;

      case 'inc-script-perm-fix': {
        const scr = fs.getNode('/home/user/deploy.sh');
        return !!scr && scr.permissions.includes('x') && raw.includes('./deploy.sh') && output.includes('Deploy OK');
      }

      default:
        if (lesson.answer && raw === lesson.answer.trim()) return true;
        return false;
    }
  }
}

if (typeof window !== 'undefined') {
  window.LessonChecker = LessonChecker;
}
