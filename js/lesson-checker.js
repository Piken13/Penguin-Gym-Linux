/**
 * Penguin Gym Linux - Lesson Answer Evaluator
 * Avalia todas as lições de acordo com o comando atual, histórico da sessão da lição,
 * saída gerada e estado atual do VirtualFS, Git, Docker, SQLite e CommandEngine.
 */

class LessonChecker {
  static check(lesson, cmdLine, output, fs, ctx) {
    if (!lesson || !cmdLine) return false;
    if (ctx && ctx.res && ctx.res.type === 'error' && lesson.id !== 'bash-history-exec' && lesson.id !== 'bash-or-fallback') return false;
    const raw = cmdLine.trim();
    const sessionHistory = (ctx && ctx.sessionHistory) ? ctx.sessionHistory : [raw];
    const allSessionText = sessionHistory.join(' ; ');

    // Pega o último comando individual (para quando há &&, || ou ;)
    const subCommands = raw.split(/&&|\|\||;/).map(s => s.trim()).filter(Boolean);
    const lastSub = subCommands[subCommands.length - 1] || raw;
    const tokens = lastSub.split(/\s+/);
    const cmd = tokens[0] || '';
    const args = tokens.slice(1);
    const id = lesson.id;

    // Se o usuário está consultando documentação (man, whatis, apropos, help),
    // isso só deve ser avaliado como conclusão se a lição for especificamente sobre essa ferramenta.
    const isDocLookup = cmd === 'man' || cmd === 'whatis' || cmd === 'apropos' || (cmd === 'help' && id !== 'basic-help');
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
        return cmd === 'pwd' && output.includes('/');

      case 'basic-ls':
        return cmd === 'ls' && !args.some(a => a.startsWith('-') && a.includes('a'));

      case 'basic-ls-all':
        return cmd === 'ls' && args.some(a => a === '--all' || (a.startsWith('-') && a.includes('a')));

      case 'basic-cd-home':
        return cmd === 'cd' && fs.currentPath === '/home/user';

      case 'basic-cd-parent':
        return (allSessionText.includes('cd') && allSessionText.includes('..') && fs.currentPath === '/home/user') ||
               (cmd === 'cd' && args[0] === '..');

      case 'basic-whoami':
        return cmd === 'whoami' && output.trim() === 'user';

      case 'basic-date':
        return cmd === 'date' && output.length > 5;

      case 'basic-echo':
        return cmd === 'echo' && output.includes('Hello Linux');

      case 'basic-clear':
        return cmd === 'clear';

      case 'basic-help':
        return cmd === 'help' && (output.includes('Comandos') || output.includes('Disponíveis'));

      case 'system-which':
        return cmd === 'which' && args[0] === 'ls' && output.includes('/ls');

      case 'system-which-grep':
        return cmd === 'which' && args[0] === 'grep' && output.includes('/grep');

      case 'advanced-ls-size-format':
        return cmd === 'ls' &&
               args.some(a => a === '--long' || (a.startsWith('-') && a.includes('l'))) &&
               args.some(a => a === '--human-readable' || (a.startsWith('-') && a.includes('h')));

      case 'text-head-basic':
        return cmd === 'head' && raw.includes('notes.txt') && output.length > 0;

      case 'text-tail-basic':
        return cmd === 'tail' && raw.includes('notes.txt') && output.length > 0;

      case 'text-wc-lines':
        return raw.includes('wc') && raw.includes('-l') && raw.includes('notes.txt') && output.length > 0;

      case 'text-sort-basic':
        return cmd === 'sort' && !args.includes('-r') && raw.includes('data.txt') && output.length > 0;

      case 'system-env-variables':
        return (cmd === 'env' || cmd === 'printenv') && output.includes('USER=');

      // ==========================================
      // 2. FUNDAMENTOS (41 lições)
      // ==========================================
      case 'file-mkdir': {
        const node = fs.getNode('/home/user/myproject') || fs.getNode(fs.resolvePath('myproject'));
        return !!node && node.type === 'directory';
      }

      case 'file-mkdir-p': {
        const node = fs.getNode('/home/user/projeto/src/utils') || fs.getNode(fs.resolvePath('projeto/src/utils'));
        return raw.includes('mkdir') && raw.includes('-p') && !!node && node.type === 'directory';
      }

      case 'file-touch': {
        const node = fs.getNode('/home/user/test.txt') || fs.getNode(fs.resolvePath('test.txt'));
        return !!node && node.type === 'file';
      }

      case 'file-cat':
        return cmd === 'cat' && (raw.includes('readme.txt') || output.includes('README'));

      case 'file-more':
        return cmd === 'more' && raw.includes('readme.txt') && output.length > 0;

      case 'file-less':
        return cmd === 'less' && raw.includes('notes.txt') && output.length > 0;

      case 'tool-nano-edit':
        return Boolean(
          ctx && ctx.res && ctx.res.action === 'nano_saved' &&
          ctx.res.filePath && ctx.res.filePath.includes('script.sh') &&
          fs.getNode('/home/user/script.sh') !== null
        );

      case 'tool-man-page':
        return cmd === 'man' && args.includes('grep') && output.includes('GREP(1)');

      case 'tool-whatis':
        return cmd === 'whatis' && args.includes('tar') && output.includes('tar (1)');

      case 'tool-apropos':
        return cmd === 'apropos' && output.includes('(');

      case 'tool-neofetch':
        return cmd === 'neofetch' && output.includes('Debian');

      case 'file-echo-write': {
        const helloFile = fs.getNode('/home/user/hello.txt') || fs.getNode(fs.resolvePath('hello.txt'));
        return !!helloFile && helloFile.content && helloFile.content.includes('Hello World');
      }

      case 'file-cp': {
        const backup = fs.getNode('/home/user/backup.txt') || fs.getNode(fs.resolvePath('backup.txt'));
        return !!backup && backup.type === 'file';
      }

      case 'file-cp-dir': {
        const backupDir = fs.getNode('/home/user/documents_backup');
        const backupFile = fs.getNode('/home/user/documents_backup/readme.txt');
        return raw.includes('cp') && (raw.includes('-r') || raw.includes('-R') || raw.includes('-a')) &&
               !!backupDir && backupDir.type === 'directory' && !!backupFile;
      }

      case 'file-mv':
        return fs.getNode('/home/user/downloads/test.sh') !== null && fs.getNode('/home/user/projects/test.sh') === null;

      case 'file-mv-rename':
        return cmd === 'mv' && fs.getNode('/home/user/renomeado.txt') !== null && fs.getNode('/home/user/test.txt') === null;

      case 'file-rm':
        return raw.includes('rm') && fs.getNode('/home/user/documents/notes.txt') === null;

      case 'file-rmdir':
        return (raw.includes('rmdir') || raw.includes('rm')) && fs.getNode('/home/user/downloads') === null;

      case 'file-rm-recursive':
        return cmd === 'rm' && (raw.includes('-r') || raw.includes('-R')) && fs.getNode('/home/user/pasta_antiga') === null;

      case 'file-grep':
        return raw.includes('grep') && raw.includes('Linux') && output.includes('Linux');

      case 'advanced-grep-invert':
        return cmd === 'grep' && args.some(a => a.startsWith('-') && a.includes('v')) &&
               raw.includes('dados.txt') && output.includes('servidor1') && !output.includes('inativo');

      case 'file-find':
        return cmd === 'find' && (raw.includes('txt') || output.includes('.txt'));

      case 'permission-ls-l':
        return cmd === 'ls' && args.some(a => a === '--long' || (a.startsWith('-') && a.includes('l')));

      case 'permission-chmod': {
        const node = fs.getNode('/home/user/test.txt') || fs.getNode(fs.resolvePath('test.txt'));
        return raw.includes('chmod') && (raw.includes('+x') || raw.includes('755') || raw.includes('777')) && (!!node && node.permissions.includes('x'));
      }

      case 'permission-chmod-octal': {
        const node = fs.getNode('/home/user/segredo.txt') || fs.getNode(fs.resolvePath('segredo.txt'));
        return cmd === 'chmod' && raw.includes('600') && !!node && node.permissions === 'rw-------';
      }

      case 'permission-chown': {
        const node = fs.getNode('/home/user/test.txt') || fs.getNode(fs.resolvePath('test.txt'));
        return (raw.includes('sudo') || fs.sudoMode) && raw.includes('chown') && raw.includes('admin') && (!!node && node.owner === 'admin');
      }

      case 'permission-sudo-basic':
        return cmd === 'sudo' && raw.includes('/root') && output.includes('root_secret.txt');

      case 'permission-sudo-mkdir': {
        const myfolder = fs.getNode('/opt/myfolder');
        return (cmd === 'sudo' || fs.sudoMode) &&
               raw.includes('mkdir') &&
               myfolder !== null &&
               myfolder.type === 'directory';
      }

      case 'advanced-grep-ignore-case':
        return raw.includes('grep') && args.some(a => a === '--ignore-case' || (a.startsWith('-') && a.includes('i'))) && raw.includes('readme.txt') && output.length > 0;

      case 'advanced-cat-line-numbers':
        return cmd === 'cat' && args.some(a => a === '--number' || (a.startsWith('-') && a.includes('n'))) && raw.includes('notes.txt') && output.length > 0;

      case 'advanced-cp-verbose':
        return cmd === 'cp' && args.some(a => a === '--verbose' || (a.startsWith('-') && a.includes('v'))) && fs.getNode('/home/user/backup.txt') !== null;

      case 'text-cut-fields':
        return raw.includes('cut') && raw.includes('-d') && raw.includes('-f') && raw.includes('notes.txt') && output.length > 0;

      case 'text-tr-transform':
        return raw.includes('tr') && (raw.includes('<') || raw.includes('|')) && output.includes('PENGUIN GYM LINUX');

      case 'text-head-lines':
        return cmd === 'head' && (raw.includes('-n') || args.some(a => /^-\d+$/.test(a))) && raw.includes('notes.txt') && output.length > 0;

      case 'text-tail-lines':
        return cmd === 'tail' && (raw.includes('-n') || args.some(a => /^-\d+$/.test(a))) && raw.includes('notes.txt') && output.length > 0;

      case 'text-sort-reverse':
        return cmd === 'sort' && args.some(a => a === '--reverse' || (a.startsWith('-') && a.includes('r'))) && raw.includes('data.txt') && output.length > 0;

      case 'text-sort-numeric':
        return cmd === 'sort' && args.some(a => a === '--numeric-sort' || (a.startsWith('-') && a.includes('n'))) && raw.includes('numeros.txt') && output.startsWith('2\n9\n25');

      case 'text-uniq-basic':
        return raw.includes('uniq') && raw.includes('data.txt') && output.length > 0;

      case 'text-uniq-count':
        return raw.includes('uniq') && args.some(a => a === '--count' || (a.startsWith('-') && a.includes('c'))) && raw.includes('data.txt') && output.length > 0;

      case 'text-sort-uniq-combo':
        return raw.includes('sort') && raw.includes('|') && raw.includes('uniq') && raw.includes('bagunca.txt') && output.includes('3 banana') && output.includes('2 apple');

      case 'file-diff-comparison':
        return cmd === 'diff' && raw.includes('readme.txt') && raw.includes('notes.txt') && output.length > 0;

      // ==========================================
      // 3. SYSADMIN & SERVIÇOS (36 lições)
      // ==========================================
      case 'sys-sudo-root-session':
        return (raw === 'sudo -i' || raw === 'sudo su' || raw === 'su -') && fs.sudoMode === true;

      case 'sys-session-exit':
        return (raw === 'exit' || raw === 'logout') && (output.includes('exit') || output.includes('logout'));

      case 'sys-systemctl-status':
        return raw.includes('systemctl') && raw.includes('status') && raw.includes('nginx') && output.includes('nginx.service');

      case 'sys-systemctl-is-active':
        return raw.includes('systemctl') && raw.includes('is-active') && raw.includes('nginx') && output.trim() === 'active';

      case 'sys-systemctl-restart':
        return raw.includes('systemctl') && raw.includes('restart') && raw.includes('nginx');

      case 'sys-systemctl-stop':
        return raw.includes('systemctl') && raw.includes('stop') && raw.includes('nginx') &&
               (commandEngine ? commandEngine.services.nginx.active === false : true);

      case 'sys-systemctl-start':
        return raw.includes('systemctl') && raw.includes('start') && raw.includes('postgresql') &&
               (commandEngine ? commandEngine.services.postgresql.active === true : true);

      case 'sys-systemctl-enable':
        return raw.includes('systemctl') && raw.includes('enable') && raw.includes('nginx') && output.includes('multi-user.target.wants');

      case 'sys-systemctl-disable':
        return raw.includes('systemctl') && raw.includes('disable') && raw.includes('nginx') &&
               (commandEngine ? commandEngine.services.nginx.enabled === false : output.includes('Removed'));

      case 'sys-journalctl-lines':
        return raw.includes('journalctl') && raw.includes('-n') && output.split('\n').filter(Boolean).length <= 5;

      case 'sys-journalctl-unit':
        return raw.includes('journalctl') && raw.includes('-u') && raw.includes('ssh') && output.includes('sshd');

      case 'sys-apt-update':
        return raw.includes('apt') && raw.includes('update') && output.includes('Lendo listas de pacotes');

      case 'sys-apt-upgrade':
        return raw.includes('apt') && raw.includes('upgrade') && output.includes('Calculando atualização');

      case 'sys-apt-search':
        return raw.includes('apt') && raw.includes('search') && raw.includes('htop') && output.includes('htop');

      case 'sys-apt-show':
        return raw.includes('apt') && raw.includes('show') && raw.includes('neofetch') && output.includes('Package: neofetch');

      case 'sys-apt-install':
        return raw.includes('apt') && raw.includes('install') && raw.includes('cowsay') && fs.getNode('/usr/bin/cowsay') !== null;

      case 'sys-apt-remove':
        return raw.includes('apt') && raw.includes('remove') && raw.includes('cowsay') &&
               (commandEngine ? !commandEngine.installedPackages.has('cowsay') : output.includes('Removendo cowsay'));

      case 'sys-apt-purge':
        return raw.includes('apt') && raw.includes('purge') && raw.includes('cowsay') &&
               output.includes('Expurgando') &&
               (commandEngine ? !commandEngine.installedPackages.has('cowsay') : true);

      case 'sys-apt-autoremove':
        return raw.includes('apt') && raw.includes('autoremove') && output.includes('Lendo listas de pacotes');

      case 'sys-dpkg-list':
        return raw.includes('dpkg') && (args.includes('-l') || raw.includes('-l')) && output.includes('ii  ');

      case 'sys-free-human':
        return cmd === 'free' && (args.includes('-h') || raw.includes('-h')) && output.includes('Mem.:');

      case 'sys-lscpu':
        return cmd === 'lscpu' && output.includes('x86_64');

      case 'sys-lsblk':
        return cmd === 'lsblk' && output.includes('sda');

      case 'sys-id-user':
        return cmd === 'id' && output.includes('uid=');

      case 'sys-useradd':
        return raw.includes('useradd') && raw.includes('devops') && (fs.getNode('/home/devops') !== null || fs.readFile('/etc/passwd').includes('devops'));

      case 'sys-groupadd':
        return raw.includes('groupadd') && raw.includes('deploy') && fs.readFile('/etc/group').includes('deploy:');

      case 'sys-usermod-group':
        return raw.includes('usermod') && raw.includes('deploy') && raw.includes('devops') &&
               fs.readFile('/etc/group').split('\n').some(l => l.startsWith('deploy:') && l.includes('devops'));

      case 'sys-groups-check':
        return cmd === 'groups' && raw.includes('devops') && output.includes('deploy');

      case 'sys-passwd-user':
        return raw.includes('passwd') && raw.includes('devops') && output.includes('atualizadas com sucesso');

      case 'sys-userdel':
        return raw.includes('userdel') && raw.includes('-r') && raw.includes('devops') &&
               !fs.readFile('/etc/passwd').split('\n').some(l => l.startsWith('devops:')) &&
               fs.getNode('/home/devops') === null;

      case 'sys-crontab-list':
        return raw.includes('crontab') && (args.includes('-l') || raw.includes('-l')) && output.includes('backup.sh');

      case 'sys-crontab-edit':
        return Boolean(ctx && ctx.res && ctx.res.action === 'nano_saved' && ctx.res.crontabMode === true);

      case 'sys-crontab-remove':
        return cmd === 'crontab' && args.includes('-r') && (commandEngine ? commandEngine.userCrontab === '' : true);

      case 'sys-dmesg':
        return cmd === 'dmesg' && output.includes('Linux version');

      case 'system-uname':
        return cmd === 'uname' && (args.includes('-a') || args.includes('--all')) && output.includes('Linux') && output.includes('x86_64');

      case 'system-uptime':
        return cmd === 'uptime' && output.includes('up');

      // ==========================================
      // 4. AVANÇADO (26 lições)
      // ==========================================
      case 'text-tree-view':
        return cmd === 'tree' && output.includes('directories');

      case 'process-ps':
        return cmd === 'ps' && output.includes('PID');

      case 'process-top':
        return cmd === 'top' && output.includes('PID');

      case 'process-df':
        return cmd === 'df' && output.includes('%');

      case 'process-du':
        return cmd === 'du' && output.length > 0;

      case 'process-du-summary':
        return cmd === 'du' && args.some(a => a.startsWith('-') && a.includes('s')) && args.some(a => a.startsWith('-') && a.includes('h')) && raw.includes('documents');

      case 'text-tee-pipe': {
        const relatorio = fs.getNode('/home/user/relatorio.txt') || fs.getNode(fs.resolvePath('relatorio.txt'));
        const hasPipeTee = raw.includes('|') && raw.includes('tee');
        return hasPipeTee &&
               raw.includes('ls') &&
               relatorio !== null &&
               relatorio.content &&
               relatorio.content.trim().length > 0 &&
               output.trim().length > 0;
      }

      case 'text-tree-depth':
        return cmd === 'tree' && (args.includes('-L') || raw.includes('-L')) && output.includes('directories');

      case 'text-column-format':
        return cmd === 'column' && output.includes('servidor1');

      case 'tool-jq-parse':
        return raw.includes('jq') && output.includes('"version": "2.0.0"');

      case 'text-jq-filter':
        return raw.includes('jq') && raw.includes('.version') && output.includes('2.0.0');

      case 'process-kill':
        return cmd === 'kill' && args.includes('123');

      case 'process-kill-sigkill':
        return cmd === 'kill' && (args.includes('-9') || args.includes('-KILL') || args.includes('-SIGKILL')) && args.includes('123');

      case 'process-pgrep':
        return cmd === 'pgrep' && raw.includes('nginx') && output.includes('123');

      case 'process-pkill':
        return cmd === 'pkill' && raw.includes('nginx') &&
               (commandEngine ? commandEngine.killedProcesses.has('123') : true);

      case 'process-jobs-bg':
        return cmd === 'jobs' && allSessionText.includes('sleep') && allSessionText.includes('&') && output.includes('sleep');

      case 'pipeline-ls-grep':
        return raw.includes('ls') && raw.includes('|') && raw.includes('grep') && output.includes('readme.txt');

      case 'redirect-output-basic': {
        const logNode = fs.getNode('/home/user/study_log.txt') || fs.getNode(fs.resolvePath('study_log.txt'));
        return raw.includes('>') && !raw.includes('>>') && !!logNode && logNode.content.includes('Linux Study Log');
      }

      case 'redirect-append-advanced': {
        const logNode = fs.getNode('/home/user/study_log.txt') || fs.getNode(fs.resolvePath('study_log.txt'));
        return raw.includes('>>') && !!logNode && logNode.content.includes('Linux Study Log') && logNode.content.split('\n').filter(Boolean).length >= 2;
      }

      case 'text-sed-replace':
        return cmd === 'sed' && raw.includes('Linux') && output.includes('GNU/Linux');

      case 'text-sed-inplace':
        return cmd === 'sed' && (args.includes('-i') || raw.includes('-i')) && fs.readFile('/home/user/config.txt').includes('versao=2');

      case 'text-sed-delete':
        return cmd === 'sed' && raw.includes('/inativo/d') && output.includes('servidor1') && !output.includes('inativo');

      case 'text-awk-columns':
        return cmd === 'awk' && raw.includes('$1') && raw.includes('$3') && output.includes('servidor1') && output.includes('ativo');

      case 'text-awk-delimiter':
        return cmd === 'awk' && (raw.includes('-F') || raw.includes('-F,')) && output.includes('aluno') && output.includes('admin');

      case 'text-awk-filter':
        return cmd === 'awk' && raw.includes('ativo') && output.includes('servidor1') && output.includes('servidor3') && !output.includes('servidor2');

      case 'text-xargs-basic':
        return raw.includes('xargs') && raw.includes('touch') && (fs.getNode('/home/user/arq1.txt') !== null && fs.getNode('/home/user/arq2.txt') !== null);

      // ==========================================
      // 5. LPIC-1 (28 lições)
      // ==========================================
      case 'lpic-tar-list':
        return raw.includes('tar') && (args.some(a => a.includes('t')) || raw.includes('tf') || raw.includes('-t')) && output.includes('documents');

      case 'lpic-gzip-compress': {
        const gzNode = fs.getNode('/home/user/documents/notes.txt.gz') || fs.getNode(fs.resolvePath('documents/notes.txt.gz')) || fs.getNode(fs.resolvePath('notes.txt.gz'));
        return cmd === 'gzip' && !args.includes('-d') && gzNode !== null;
      }

      case 'lpic-gunzip-decompress':
        return allSessionText.includes('gzip') &&
               (raw.includes('gunzip') || (raw.includes('gzip') && raw.includes('-d'))) &&
               fs.getNode('/home/user/documents/notes.txt') !== null &&
               fs.getNode('/home/user/documents/notes.txt.gz') === null;

      case 'text-file-type':
        return cmd === 'file' && raw.includes('readme.txt') && output.includes('text');

      case 'text-tac-reverse':
        return cmd === 'tac' && raw.includes('readme.txt') && output.length > 0;

      case 'text-rev-chars':
        return cmd === 'rev' && raw.includes('readme.txt') && output.length > 0;

      case 'text-nl-lines':
        return cmd === 'nl' && raw.includes('readme.txt') && output.includes('1\t');

      case 'text-base64-encode':
        return raw.includes('base64') && !raw.includes('-d') && (output.trim() === 'TGludXg=' || output.trim() === 'TGludXgK');

      case 'text-base64-decode':
        return raw.includes('base64') && (args.includes('-d') || raw.includes('-d')) && output.includes('Linux');

      case 'lpic-ln-symbolic': {
        const sym = fs.getRawNode('/home/user/readme-link');
        return cmd === 'ln' && args.some(a => a === '-s' || a === '--symbolic') &&
               !!sym && sym.type === 'symlink' && sym.target.includes('readme.txt');
      }

      case 'lpic-ln-hardlink': {
        const hard = fs.getNode('/home/user/notes-hard.txt');
        return cmd === 'ln' && !args.some(a => a === '-s' || a === '--symbolic') &&
               !!hard && !!hard.hardlinkOf && hard.links >= 2;
      }

      case 'lpic-readlink':
        return cmd === 'readlink' && raw.includes('readme-link') && output.includes('readme.txt');

      case 'lpic-tar-create': {
        const tarNode = fs.getNode('/home/user/docs.tar') || fs.getNode(fs.resolvePath('docs.tar'));
        return cmd === 'tar' && args.some(a => a.includes('c')) && tarNode !== null;
      }

      case 'lpic-tar-extract':
        return allSessionText.includes('tar') &&
               raw.includes('proj.tar') &&
               args.some(a => a.includes('x')) &&
               fs.getNode('/home/user/proj.tar') !== null &&
               fs.getNode('/home/user/projects/test.sh') !== null;

      case 'lpic-tar-gzip-create':
        return cmd === 'tar' && args.some(a => a.includes('c') && a.includes('z')) && fs.getNode('/home/user/docs.tar.gz') !== null;

      case 'lpic-tar-extract-dir':
        return cmd === 'tar' && args.some(a => a.includes('x')) && raw.includes('-C') &&
               fs.getNode('/home/user/downloads/documents/readme.txt') !== null;

      case 'lpic-zcat-log':
        return cmd === 'zcat' && raw.includes('access.log.1.gz') && output.includes('GET /');

      case 'lpic-zip-create':
        return cmd === 'zip' && fs.getNode('/home/user/proj.zip') !== null;

      case 'lpic-unzip-extract':
        return cmd === 'unzip' && raw.includes('-d') && fs.getNode('/home/user/downloads/projects/test.sh') !== null;

      case 'lpic-find-exec-cat':
        return raw.includes('find') && raw.includes('-exec') && raw.includes('cat') && output.length > 0;

      case 'lpic-grep-recursive':
        return raw.includes('grep') && args.some(a => a === '--recursive' || (a.startsWith('-') && (a.includes('r') || a.includes('R')))) && output.includes('Linux');

      case 'lpic-ls-long-detail':
        return cmd === 'ls' && args.some(a => a === '--long' || (a.startsWith('-') && a.includes('l')));

      case 'text-stat-info':
        return cmd === 'stat' && output.includes('Inode:') && output.includes('readme.txt');

      case 'text-sha256sum':
        return cmd === 'sha256sum' && raw.includes('readme.txt') && output.length >= 64;

      case 'lpic-md5sum':
        return cmd === 'md5sum' && raw.includes('readme.txt') && output.length >= 32;

      case 'lpic-find-exec-grep':
        return raw.includes('find') && raw.includes('-exec') && raw.includes('grep') && output.length > 0;

      case 'lpic-find-type-depth':
        return cmd === 'find' && raw.includes('-maxdepth') && raw.includes('-type') && raw.includes('f') && output.length > 0;

      case 'lpic-find-tar-combo':
        return raw.includes('tar') && raw.includes('proj-backup.tar') && fs.getNode('/home/user/proj-backup.tar') !== null;

      // ==========================================
      // 6. GIT (16 lições)
      // ==========================================
      case 'git-init':
        return cmd === 'git' && args[0] === 'init' && git.initialized === true;

      case 'git-status-untracked':
        return cmd === 'git' && args[0] === 'status' && output.includes('README.md');

      case 'git-add':
        return cmd === 'git' && args[0] === 'add' && (git.index.has('README.md') || git.index.size > 0);

      case 'git-commit':
        return cmd === 'git' && args[0] === 'commit' && git.commits.length >= 1;

      case 'git-log':
        return cmd === 'git' && args[0] === 'log' && output.includes('commit');

      case 'git-add-all':
        return cmd === 'git' && args[0] === 'add' && (args.includes('.') || args.includes('-A') || args.includes('--all')) &&
               git.index.has('index.html') && git.index.has('style.css');

      case 'git-commit-second':
        return git.commits.length >= 2;

      case 'git-branch-create':
        return cmd === 'git' && args[0] === 'branch' && git.branches.includes('feature');

      case 'git-branch-list':
        return cmd === 'git' && args[0] === 'branch' && args.length === 1 && output.includes('feature');

      case 'git-switch':
        return cmd === 'git' && (args[0] === 'switch' || args[0] === 'checkout') && git.currentBranch === 'feature';

      case 'git-diff-staged':
        return cmd === 'git' && args[0] === 'diff' && (args.includes('--staged') || args.includes('--cached')) && output.includes('diff --git');

      case 'git-restore-staged':
        return cmd === 'git' && (args[0] === 'restore' || args[0] === 'reset') && !git.index.has('.env') && git.index.has('index.html');

      case 'git-switch-create':
        return cmd === 'git' && ((args[0] === 'switch' && args.includes('-c')) || (args[0] === 'checkout' && args.includes('-b'))) && git.currentBranch === 'hotfix';

      case 'git-merge':
        return cmd === 'git' && args[0] === 'merge' && args.includes('feature') && git.commits.some(c => c.message.includes('Merge branch'));

      case 'git-branch-delete':
        return cmd === 'git' && args[0] === 'branch' && (args.includes('-d') || args.includes('-D')) && !git.branches.includes('feature');

      case 'git-stash':
        return allSessionText.includes('git stash') && cmd === 'git' && args[0] === 'stash' && (args[1] === 'pop' || args[1] === 'apply') && git.stashes.length === 0;

      // ==========================================
      // 7. DOCKER (15 lições)
      // ==========================================
      case 'docker-pull':
        return cmd === 'docker' && args[0] === 'pull' && docker.images.has('hello-world');

      case 'docker-images':
        return cmd === 'docker' && args[0] === 'images' && output.includes('hello-world');

      case 'docker-run-hello':
        return cmd === 'docker' && args[0] === 'run' && Array.from(docker.containers.values()).some(c => c.image === 'hello-world');

      case 'docker-ps-a':
        return cmd === 'docker' && args[0] === 'ps' && (args.includes('-a') || args.includes('--all'));

      case 'docker-run-detached':
        return cmd === 'docker' && args[0] === 'run' && Array.from(docker.containers.values()).some(c => c.status.startsWith('Up'));

      case 'docker-ps':
        return cmd === 'docker' && args[0] === 'ps' && !args.includes('-a') && !args.includes('--all');

      case 'docker-stop':
        return cmd === 'docker' && args[0] === 'stop' && Array.from(docker.containers.values()).some(c => c.status.includes('Exited'));

      case 'docker-start':
        return cmd === 'docker' && args[0] === 'start' && Array.from(docker.containers.values()).some(c => c.name === 'web' && c.status.startsWith('Up'));

      case 'docker-rm':
        return cmd === 'docker' && args[0] === 'rm' && !Array.from(docker.containers.values()).some(c => c.name === 'web');

      case 'docker-rmi':
        return cmd === 'docker' && args[0] === 'rmi' && !docker.images.has('hello-world');

      case 'docker-run-port':
        return cmd === 'docker' && args[0] === 'run' && Array.from(docker.containers.values()).some(c => c.ports && c.ports.includes('8080'));

      case 'docker-logs':
        return cmd === 'docker' && args[0] === 'logs' && raw.includes('web2') && output.includes('nginx');

      case 'docker-exec':
        return cmd === 'docker' && args[0] === 'exec' && raw.includes('web2') && raw.includes('uname') && output.includes('Linux');

      case 'docker-inspect':
        return cmd === 'docker' && args[0] === 'inspect' && raw.includes('web2') && output.includes('"Id"');

      case 'docker-build':
        return cmd === 'docker' && args[0] === 'build' && docker.images.has('penguin-api') && output.includes('Successfully tagged');

      // ==========================================
      // 8. SCRIPTING & SHELL POWER (23 lições)
      // ==========================================
      case 'bash-arithmetic':
        return raw.includes('$((') && output.trim() === '40';

      case 'bash-exit-code':
        return cmd === 'echo' && raw.includes('$?') && (output.trim() === '0' || output.trim() === '1');

      case 'bash-alias-create':
        return raw.includes('alias') && raw.includes('c=') && raw.includes('clear') &&
               (commandEngine ? commandEngine.aliases['c'] === 'clear' : true);

      case 'bash-alias-list':
        return cmd === 'alias' && args.length === 0 && output.includes('alias');

      case 'bash-alias-remove':
        return cmd === 'unalias' && args.includes('c') &&
               (commandEngine ? !Object.prototype.hasOwnProperty.call(commandEngine.aliases, 'c') : true);

      case 'bash-history-exec':
        return (raw === '!!' || raw.startsWith('!!') || allSessionText.includes('!!') || (ctx && ctx.res && (ctx.res.rawCommand === '!!' || ctx.res.wasHistoryExpansion))) && output.length > 0;

      case 'bash-history-list':
        return cmd === 'history' && !args.includes('-c');

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
        return raw.includes('<<<') && (
          output.toLowerCase().includes('penguin gym') ||
          raw.toLowerCase().includes('penguin gym')
        );

      case 'bash-subshell': {
        const hasParens = (raw.startsWith('(') && raw.endsWith(')')) ||
                          (raw.includes('(') && raw.includes(')'));
        const hasCdTmp = raw.includes('cd /tmp') || raw.includes('cd /tmp/') || (ctx && ctx.res && ctx.res.subshellInner && ctx.res.subshellInner.includes('cd'));
        const hasPwd = raw.includes('pwd') || (ctx && ctx.res && ctx.res.subshellInner && ctx.res.subshellInner.includes('pwd'));
        const isSubshell = hasParens || (ctx && ctx.res && ctx.res.wasSubshell);
        return Boolean(isSubshell && hasCdTmp && hasPwd && output.includes('/tmp'));
      }

      case 'bash-dir-stack':
        return raw.includes('pushd') && raw.includes('/etc') && fs.currentPath === '/etc';

      case 'bash-popd':
        return allSessionText.includes('pushd') && raw.includes('popd') && fs.currentPath === '/home/user';

      case 'bash-export-env':
        return cmd === 'export' && raw.includes('GYM_ENV=production') &&
               (commandEngine ? commandEngine.envVars.GYM_ENV === 'production' : true);

      case 'bash-source-bashrc':
        return (cmd === 'source' || cmd === '.') && raw.includes('.bashrc');

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
      // 9. REDES & CONECTIVIDADE (26 lições)
      // ==========================================
      case 'net-ip-addr':
        return cmd === 'ip' && (args[0] === 'addr' || args[0] === 'a' || args.includes('addr') || args.includes('a')) && output.includes('inet ');

      case 'net-ip-route':
        return cmd === 'ip' && (args[0] === 'route' || args[0] === 'r') && output.includes('default via');

      case 'net-ping':
        return cmd === 'ping' && args.includes('-c') && output.includes('estatísticas de ping');

      case 'net-traceroute':
        return cmd === 'traceroute' && raw.includes('penguin-gym.com') && output.includes('traceroute to');

      case 'net-curl-get':
        return cmd === 'curl' && (raw.includes('localhost') || raw.includes('127.0.0.1')) && !args.includes('-I') && !args.includes('--head') && output.includes('<!DOCTYPE html>');

      case 'net-curl-head':
        return cmd === 'curl' && (args.includes('-I') || args.includes('--head')) && output.includes('HTTP/1.1 200 OK');

      case 'net-curl-download': {
        const hasOut = fs.getNode('/home/user/saida.json') || fs.getNode(fs.resolvePath('saida.json')) ||
                       fs.getNode('/home/user/app.json') || fs.getNode(fs.resolvePath('app.json'));
        return cmd === 'curl' && (args.includes('-o') || args.includes('-O')) && hasOut !== null;
      }

      case 'net-curl-post':
        return cmd === 'curl' && raw.includes('-X') && raw.includes('POST') && raw.includes('-d') && output.includes('"status": "created"');

      case 'net-wget': {
        const dadosNode = fs.getNode('/home/user/dados.txt') || fs.getNode(fs.resolvePath('dados.txt'));
        return cmd === 'wget' && dadosNode !== null;
      }

      case 'net-dig':
        return cmd === 'dig' && raw.includes('penguin-gym.com') && !raw.includes('+short') && output.includes('ANSWER SECTION');

      case 'net-dig-short':
        return cmd === 'dig' && raw.includes('+short') && raw.includes('penguin-gym.com') && output.includes('93.184.216.34');

      case 'net-nslookup':
        return cmd === 'nslookup' && raw.includes('penguin-gym.com') && output.includes('Address: 93.184.216.34');

      case 'net-host':
        return cmd === 'host' && raw.includes('penguin-gym.com') && output.includes('mail is handled by');

      case 'net-ss-listen':
        return cmd === 'ss' && output.includes('LISTEN');

      case 'net-netstat':
        return cmd === 'netstat' && output.includes('OUÇA');

      case 'net-nc-port':
        return (cmd === 'nc' || cmd === 'netcat') && raw.includes('80') && output.includes('succeeded');

      case 'net-nmap-scan':
        return cmd === 'nmap' && raw.includes('localhost') && output.includes('80/tcp');

      case 'net-scp-copy':
        return cmd === 'scp' && raw.includes('readme.txt') && raw.includes('192.168.1.50') && output.includes('100%');

      case 'net-rsync-sync':
        return cmd === 'rsync' && raw.includes('projects') && raw.includes('192.168.1.50') && output.includes('100%');

      case 'net-etc-hosts':
        return (cmd === 'cat' || cmd === 'less' || cmd === 'head') && raw.includes('/etc/hosts') && output.includes('penguin-gym');

      case 'net-ufw-status':
        return raw.includes('ufw') && raw.includes('status') && output.includes('Status:');

      case 'net-ufw-enable':
        return raw.includes('ufw') && raw.includes('enable') && output.includes('active and enabled');

      case 'net-ufw-allow':
        return raw.includes('ufw') && raw.includes('allow') && raw.includes('80') && output.includes('Rule added');

      case 'net-ufw-deny':
        return raw.includes('ufw') && raw.includes('deny') && raw.includes('23') && output.includes('Rule added');

      case 'net-ufw-delete':
        return raw.includes('ufw') && raw.includes('delete') && raw.includes('80') && output.includes('Rule deleted');

      case 'net-ufw-disable':
        return raw.includes('ufw') && raw.includes('disable') && output.includes('disabled on system startup');

      // ==========================================
      // 10. DATABASE / SQL (17 lições)
      // ==========================================
      case 'db-tables':
        return raw.includes('sqlite3') && raw.includes('.tables') && output.includes('members');

      case 'db-schema':
        return raw.includes('sqlite3') && raw.includes('.schema') && output.includes('CREATE TABLE members');

      case 'db-count':
        return raw.includes('sqlite3') && /count\(\s*\*\s*\)/i.test(raw) && output.trim() === '12';

      case 'db-select-where':
        return raw.includes('sqlite3') && /where/i.test(raw) && /tokyo/i.test(raw) && output.includes('Pip');

      case 'db-order-limit':
        return raw.includes('sqlite3') && /order\s+by/i.test(raw) && /limit\s+3/i.test(raw) && output.includes('Nico|45');

      case 'db-group-count':
        return raw.includes('sqlite3') && /group\s+by/i.test(raw) && /count/i.test(raw) && output.includes('Tokyo|4');

      case 'db-pipe':
        return raw.includes('sqlite3') && raw.includes('|') && raw.includes('sort') && raw.includes('uniq') && output.includes('Tokyo');

      case 'db-null':
        return raw.includes('sqlite3') && /is\s+null/i.test(raw) && output.includes('Rio');

      case 'db-boundary':
        return raw.includes('sqlite3') && (/>=\s*20/.test(raw) || /20\s*<=/.test(raw)) && output.trim() === '10';

      case 'db-join':
        return raw.includes('sqlite3') && /join/i.test(raw) && /ended_at\s+is\s+null/i.test(raw) && output.includes('Momo|pro');

      case 'db-left-join':
        return raw.includes('sqlite3') && (/left\s+join/i.test(raw) || /not\s+in/i.test(raw) || /not\s+exists/i.test(raw)) && output.includes('Kai');

      case 'db-update-where':
        return raw.includes('sqlite3') && /update\s+members/i.test(raw) && /osaka/i.test(raw) &&
               sql.legacyMembers.find(m => m.id === 3)?.city === 'Osaka';

      case 'db-create-table':
        return raw.includes('sqlite3') && /create\s+table/i.test(raw) && !!sql.customTables && !!sql.customTables.workouts;

      case 'db-insert-into':
        return raw.includes('sqlite3') && /insert\s+into\s+members/i.test(raw) &&
               sql.members.some(m => m.name === 'Tux' && m.city === 'Tokyo');

      case 'db-delete-where':
        return raw.includes('sqlite3') && /delete\s+from\s+members/i.test(raw) &&
               !sql.legacyMembers.some(m => m.id === 11);

      case 'db-like-search':
        return raw.includes('sqlite3') && /like/i.test(raw) && output.includes('Pip') && !output.includes('Rio');

      case 'db-sum-avg':
        return raw.includes('sqlite3') && /avg\s*\(\s*monthly_fee\s*\)/i.test(raw) && output.includes('3333.33');

      // ==========================================
      // 11. INCIDENTES / BOSS CROSS-DOMAIN (5 lições)
      // ==========================================
      case 'inc-nginx-404':
        return allSessionText.includes('/var/log/nginx') && allSessionText.includes('404') &&
               (cmd === 'ss' || cmd === 'netstat') && (output.includes('LISTEN') || output.includes('OUÇA'));

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
               cmd === 'docker' && args[0] === 'rmi';

      case 'inc-backup-pipeline':
        return fs.getNode('/home/user/tokyo.csv') !== null &&
               fs.getNode('/home/user/tokyo.csv.gz') !== null &&
               cmd === 'sha256sum' && raw.includes('tokyo.csv.gz') && output.length >= 64;

      default:
        if (lesson.answer && raw === lesson.answer.trim()) return true;
        return false;
    }
  }
}

if (typeof window !== 'undefined') {
  window.LessonChecker = LessonChecker;
}
