/**
 * Penguin Gym Linux - Virtual FileSystem (FHS Debian/Ubuntu Standard)
 * Implementação completa de sistema de arquivos Unix/Linux em memória,
 * com hierarquia FHS (/bin, /sbin, /usr, /etc, /var, /proc, /dev, /root, /tmp),
 * metadados de inodes, permissões reais (octal/simbólico), pilha de diretórios (pushd/popd)
 * e persistência inteligente entre lições.
 */

class VirtualFS {
  constructor() {
    this.currentPath = '/home/user';
    this.oldPath = '/home/user';
    this.dirStack = [];
    this.sudoMode = false;
    this.nextInode = 1001;
    this.root = null;
    this.reset();
  }

  /**
   * Cria um nó de arquivo com metadados completos de inode e timestamps
   */
  makeFile(name, content = '', owner = 'user', group = null, permissions = 'rw-r--r--', extra = {}) {
    const now = Date.now();
    return {
      name,
      type: 'file',
      inode: this.nextInode++,
      owner,
      group: group || owner,
      permissions,
      links: 1,
      size: content.length,
      content,
      atime: now,
      mtime: now,
      ctime: now,
      ...extra
    };
  }

  /**
   * Cria um nó de diretório com metadados completos de inode e timestamps
   */
  makeDir(name, children = {}, owner = 'root', group = null, permissions = 'rwxr-xr-x') {
    const now = Date.now();
    const subDirCount = Object.values(children).filter(c => c && c.type === 'directory').length;
    return {
      name,
      type: 'directory',
      inode: this.nextInode++,
      owner,
      group: group || owner,
      permissions,
      links: 2 + subDirCount,
      size: 4096,
      atime: now,
      mtime: now,
      ctime: now,
      children
    };
  }

  /**
   * Textos padrão dos arquivos base do sistema FHS e das lições
   */
  getBaselineContents() {
    return {
      readme: `Este é um arquivo README de exemplo.
É para praticar comandos Linux.
🐧 Penguin Gym Linux

Guia rápido de navegação e texto no terminal:
01. pwd   - Mostra o diretório atual de trabalho
02. ls    - Lista arquivos e subdiretórios (use -la para detalhes)
03. cd    - Alterna entre pastas do sistema FHS
04. cat   - Imprime conteúdo completo na saída padrão
05. more  - Pagina arquivos longos tela a tela
06. less  - Visualizador interativo com busca (/termo) e navegação
07. head  - Mostra as primeiras linhas (padrão: 10 linhas)
08. tail  - Mostra as últimas linhas ou acompanha logs (-f)
09. grep  - Filtra linhas que combinam com padrões de texto
10. find  - Localiza arquivos por nome, tipo ou permissão
11. cp    - Copia arquivos e diretórios (-r)
12. mv    - Move ou renomeia arquivos, pastas e links simbólicos
13. rm    - Remove arquivos e diretórios (-r)
14. chmod - Ajusta permissões de leitura, escrita e execução
15. chown - Altera proprietário e grupo de arquivos
16. ln    - Cria links simbólicos (-s) ou hardlinks
17. tar   - Empacota e extrai arquivos (.tar e .tar.gz)
18. gzip  - Comprime e descomprime arquivos individuais
19. stat  - Exibe metadados completos de inode e timestamps
20. wc    - Conta linhas (-l), palavras (-w) e bytes (-c)
21. sort  - Ordena linhas alfabética ou numericamente (-n)
22. uniq  - Remove duplicatas adjacentes ou conta ocorrências (-c)
23. cut   - Extrai colunas delimitadas (-d e -f)
24. tr    - Substitui ou transforma caracteres via stdin
25. Dica: combine comandos com pipes (|) e redirecionamento (>).`,
      notes: `Notas de estudo:
- Comando ls para exibir a lista de arquivos
- Comando cd para navegar entre diretórios
- Linux é incrível
- Atalho pwd mostra o caminho absoluto do diretório atual
- Use cat -n para visualizar linhas numeradas
- O comando less permite navegar com Espaço, b e /busca
- O comando more exibe conteúdo avançando tela a tela
- head -n 5 exibe apenas as 5 primeiras linhas do texto
- tail -n 5 exibe apenas as 5 últimas linhas do texto
- wc -l conta quantas linhas existem no arquivo
- grep -i faz busca sem diferenciar maiúsculas de minúsculas
- cut -d " " -f 1 recorta o primeiro campo separado por espaço
- sort -r ordena o conteúdo em ordem alfabética reversa
- uniq -c contabiliza ocorrências seguidas após ordenação
- Redirecionar com > sobrescreve; com >> acrescenta ao final
- Redirecionar stderr usa 2> ou 2>&1 para unir com stdout
- Permissões rwx definem leitura, escrita e execução (u/g/o)
- umask 0027 restringe permissões padrão de novos arquivos
- sudo executa comandos administrativos com privilégio root
- systemctl gerencia daemons como nginx e postgresql
- journalctl consulta os registros estruturados do systemd
- ss -tuln lista portas TCP e UDP em escuta no servidor
- curl testa endpoints HTTP e baixa respostas da API
- git status e git diff --staged revisam mudanças antes do commit
- docker ps e docker logs inspecionam contêineres ativos
- sqlite3 consulta tabelas relacionais diretamente no terminal
- ansible-playbook automatiza múltiplas máquinas via YAML
- Sempre leia mensagens de erro com atenção antes de agir
- Fim das notas de revisão do Penguin Gym Linux.`,
      data: `banana
banana
apple
cherry
cherry`,
      bashrc: `# ~/.bashrc: executado pelo bash(1) para shells interativos
export PS1="\\u@\\h:\\w\\$ "
alias ll="ls -la"
alias la="ls -A"
alias l="ls -CF"`,
      testSh: `#!/bin/bash
echo "Hello, Linux!"`,
      membersCsv: `id,name,email,city,age
1,Pip,pip@example.com,Tokyo,24
2,Momo,momo@example.com,Tokyo,20
3,Kai,kai@example.com,Tokyo,31
4,Luna,luna@example.com,Tokyo,19
5,Nico,nico@example.com,Osaka,45
6,Rio,,Osaka,27
7,Sora,sora@example.com,Osaka,20
8,Tama,tama@example.com,Lisboa,38
9,Ana,ana@example.com,Lisboa,22
10,Ken,,Porto,33
11,Yuki,yuki@example.com,Austin,18
12,Leo,leo@example.com,Sapporo,29`,
      passwd: `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
sshd:x:106:65534::/run/sshd:/usr/sbin/nologin
user:x:1000:1000:Penguin Gym User:/home/user:/bin/bash`,
      group: `root:x:0:
daemon:x:1:
adm:x:4:user
sudo:x:27:user
www-data:x:33:
docker:x:999:user
user:x:1000:`,
      shadow: `root:$6$rounds=656000$penguinSalt$9f8e7d6c5b4a3210:19738:0:99999:7:::
user:$6$rounds=656000$gymSalt$1a2b3c4d5e6f7890:19738:0:99999:7:::`,
      hosts: `127.0.0.1\tlocalhost
127.0.1.1\tpenguin-gym.localdomain\tpenguin-gym
::1\t\tlocalhost ip6-localhost ip6-loopback`,
      hostname: `penguin-gym`,
      osRelease: `PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"
NAME="Debian GNU/Linux"
VERSION_ID="12"
VERSION="12 (bookworm)"
VERSION_CODENAME=bookworm
ID=debian
HOME_URL="https://www.debian.org/"`,
      fstab: `# /etc/fstab: static file system information.
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
/dev/sda1       /               ext4    errors=remount-ro 0       1
tmpfs           /tmp            tmpfs   defaults,nosuid   0       0`,
      resolvConf: `# Generated by NetworkManager
nameserver 8.8.8.8
nameserver 1.1.1.1
search penguin-gym.local`,
      sudoers: `Defaults\tenv_reset
Defaults\tmail_badpass
root\tALL=(ALL:ALL) ALL
%sudo\tALL=(ALL:ALL) NOPASSWD: ALL`,
      crontab: `# /etc/crontab: system-wide crontab
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# m h dom mon dow user\tcommand
17 * * * *\troot\tcd / && run-parts --report /etc/cron.hourly
25 6 * * *\troot\ttest -x /usr/sbin/anacron || run-parts --report /etc/cron.daily`,
      sysLog: `2026-01-01 00:00:00 System started
2026-01-01 00:00:01 All services running
2026-01-01 12:00:00 Periodic check OK`,
      authLog: `Jan 15 10:00:01 penguin-gym sshd[1024]: Accepted publickey for user from 192.168.1.10 port 54322 ssh2
Jan 15 10:05:12 penguin-gym sudo:     user : TTY=pts/0 ; PWD=/home/user ; USER=root ; COMMAND=/usr/bin/apt update
Jan 15 10:15:00 penguin-gym CRON[1120]: pam_unix(cron:session): session opened for user root(uid=0)`,
      nginxAccessLog: `127.0.0.1 - - [15/Jan/2026:10:12:01 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.88.1"
192.168.1.25 - - [15/Jan/2026:10:14:33 +0000] "GET /api/status HTTP/1.1" 200 45 "-" "Mozilla/5.0"
192.168.1.25 - - [15/Jan/2026:10:15:10 +0000] "GET /admin HTTP/1.1" 404 153 "-" "Mozilla/5.0"`,
      nginxErrorLog: `2026/01/15 10:15:10 [error] 123#123: *3 open() "/var/www/html/admin" failed (2: No such file or directory)`,
      cpuinfo: `processor\t: 0
vendor_id\t: GenuineIntel
cpu family\t: 6
model\t\t: 158
model name\t: Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz
cpu MHz\t\t: 2592.000
cache size\t: 12288 KB
cpu cores\t: 4`,
      meminfo: `MemTotal:        4014080 kB
MemFree:         1280400 kB
MemAvailable:    2890120 kB
Buffers:          184320 kB
Cached:          1678560 kB
SwapTotal:       2097152 kB
SwapFree:        2097152 kB`,
      procVersion: `Linux version 6.1.0-21-amd64 (debian-kernel@lists.debian.org) (gcc-12 (Debian 12.2.0-14) 12.2.0, GNU ld (GNU Binutils for Debian) 2.40) #1 SMP PREEMPT_DYNAMIC Debian 6.1.90-1`,
      procUptime: `1048440.25 4120310.80`
    };
  }

  reset() {
    this.currentPath = '/home/user';
    this.oldPath = '/home/user';
    this.dirStack = [];
    this.sudoMode = false;
    this.umask = '0022';
    this.nextInode = 1001;

    const c = this.getBaselineContents();

    // Cria binários executáveis padrão em /bin e /usr/bin
    const binNames = [
      // 1. Iniciante
      'pwd', 'ls', 'cd', 'clear', 'whoami', 'date', 'echo', 'cat', 'head', 'tail', 'wc', 'sort', 'uniq', 'grep', 'which', 'env', 'printenv', 'help',
      // 2. Fundamentos
      'mkdir', 'touch', 'cp', 'mv', 'rm', 'rmdir', 'diff', 'find', 'chmod', 'chown', 'sudo', 'su', 'less', 'more', 'nano', 'vi', 'vim', 'man', 'whatis', 'apropos', 'neofetch', 'hostname', 'hostnamectl', 'uname', 'uptime',
      // 3. Sysadmin
      'lscpu', 'lsblk', 'free', 'df', 'fdisk', 'blkid', 'systemctl', 'service', 'journalctl', 'apt', 'apt-get', 'dpkg', 'useradd', 'usermod', 'userdel', 'groupadd', 'passwd', 'groups', 'id', 'crontab', 'dmesg', 'vmstat', 'last', 'w', 'who', 'exit',
      // 4. Avançado
      'tee', 'cut', 'tr', 'sed', 'awk', 'xargs', 'column', 'paste', 'tree', 'ps', 'top', 'htop', 'kill', 'pkill', 'killall', 'pgrep', 'du', 'jq',
      // 5. LPIC-1
      'tar', 'gzip', 'gunzip', 'zcat', 'zip', 'unzip', 'ln', 'stat', 'file', 'nl', 'tac', 'rev', 'md5sum', 'sha256sum', 'cksum', 'base64',
      // 6. Git
      'git',
      // 7. Docker
      'docker',
      // 8. Scripts
      'bash', 'sh', 'source', 'alias', 'unalias', 'history', 'pushd', 'popd', 'dirs', 'seq', 'bc', 'expr', 'test', 'type', 'sleep', 'cowsay',
      // 9. Redes
      'ip', 'ifconfig', 'route', 'ping', 'curl', 'wget', 'dig', 'nslookup', 'host', 'traceroute', 'tracepath', 'ss', 'netstat', 'nc', 'netcat', 'nmap', 'telnet', 'ufw', 'iptables', 'nftables',
      // 10. SQL
      'sqlite3',
      // Utilitários de sistema e ambiente
      'realpath', 'readlink', 'basename', 'dirname', 'reset-fs', 'clean-env'
    ];
    this.systemBinNames = binNames;
    const binChildren = {};
    const usrBinChildren = {};
    for (const b of binNames) {
      binChildren[b] = this.makeFile(b, `ELF 64-bit LSB pie executable (${b})`, 'root', 'root', 'rwxr-xr-x', { size: 48120 });
      usrBinChildren[b] = this.makeFile(b, `ELF 64-bit LSB pie executable (${b})`, 'root', 'root', 'rwxr-xr-x', { size: 48120 });
    }

    const sbinNames = [
      'ifconfig', 'ip', 'route', 'iptables', 'nftables', 'ufw',
      'systemctl', 'service', 'journalctl',
      'apt', 'apt-get', 'dpkg',
      'useradd', 'usermod', 'userdel', 'groupadd', 'passwd', 'su', 'sudo',
      'crontab', 'fdisk', 'blkid', 'mount', 'umount', 'reboot', 'shutdown',
      'dmesg', 'vmstat', 'lscpu', 'lsblk', 'free'
    ];
    const sbinChildren = {};
    for (const sb of sbinNames) {
      sbinChildren[sb] = this.makeFile(sb, `ELF 64-bit LSB system binary (${sb})`, 'root', 'root', 'rwxr-xr-x', { size: 65536 });
    }

    this.root = this.makeDir('/', {
      bin: this.makeDir('bin', binChildren, 'root', 'root', 'rwxr-xr-x'),
      sbin: this.makeDir('sbin', sbinChildren, 'root', 'root', 'rwxr-xr-x'),
      usr: this.makeDir('usr', {
        bin: this.makeDir('bin', usrBinChildren, 'root', 'root', 'rwxr-xr-x'),
        sbin: this.makeDir('sbin', { ...sbinChildren }, 'root', 'root', 'rwxr-xr-x'),
        local: this.makeDir('local', {
          bin: this.makeDir('bin', {}, 'root', 'root', 'rwxr-xr-x'),
          etc: this.makeDir('etc', {}, 'root', 'root', 'rwxr-xr-x')
        }, 'root', 'root', 'rwxr-xr-x'),
        share: this.makeDir('share', {
          doc: this.makeDir('doc', {}, 'root', 'root', 'rwxr-xr-x'),
          man: this.makeDir('man', {}, 'root', 'root', 'rwxr-xr-x')
        }, 'root', 'root', 'rwxr-xr-x')
      }, 'root', 'root', 'rwxr-xr-x'),
      home: this.makeDir('home', {
        user: this.makeDir('user', {
          documents: this.makeDir('documents', {
            'readme.txt': this.makeFile('readme.txt', c.readme, 'user', 'user', 'rw-r--r--'),
            'notes.txt': this.makeFile('notes.txt', c.notes, 'user', 'user', 'rw-r--r--'),
            'data.txt': this.makeFile('data.txt', c.data, 'user', 'user', 'rw-r--r--')
          }, 'user', 'user', 'rwxr-xr-x'),
          projects: this.makeDir('projects', {
            'test.sh': this.makeFile('test.sh', c.testSh, 'user', 'user', 'rwxr-xr-x')
          }, 'user', 'user', 'rwxr-xr-x'),
          downloads: this.makeDir('downloads', {}, 'user', 'user', 'rwxr-xr-x'),
          '.bashrc': this.makeFile('.bashrc', c.bashrc, 'user', 'user', 'rw-r--r--'),
          'members.csv': this.makeFile('members.csv', c.membersCsv, 'user', 'user', 'rw-r--r--'),
          'gym.db': this.makeFile('gym.db', 'SQLite format 3 (gym.db)', 'user', 'user', 'rw-r--r--', { size: 8192 }),
          'gym_legacy.db': this.makeFile('gym_legacy.db', 'SQLite format 3 (gym_legacy.db)', 'user', 'user', 'rw-r--r--', { size: 12288 })
        }, 'user', 'user', 'rwxr-xr-x')
      }, 'root', 'root', 'rwxr-xr-x'),
      root: this.makeDir('root', {
        '.bashrc': this.makeFile('.bashrc', '# Root bashrc\nalias ll="ls -la"\n', 'root', 'root', 'rw-r--r--'),
        'root_secret.txt': this.makeFile('root_secret.txt', 'Acesso exclusivo do superusuário (root).\n', 'root', 'root', 'rw-------')
      }, 'root', 'root', 'rwx------'),
      etc: this.makeDir('etc', {
        passwd: this.makeFile('passwd', c.passwd, 'root', 'root', 'rw-r--r--'),
        group: this.makeFile('group', c.group, 'root', 'root', 'rw-r--r--'),
        shadow: this.makeFile('shadow', c.shadow, 'root', 'root', 'rw-------'),
        hosts: this.makeFile('hosts', c.hosts, 'root', 'root', 'rw-r--r--'),
        hostname: this.makeFile('hostname', c.hostname + '\n', 'root', 'root', 'rw-r--r--'),
        'os-release': this.makeFile('os-release', c.osRelease + '\n', 'root', 'root', 'rw-r--r--'),
        fstab: this.makeFile('fstab', c.fstab + '\n', 'root', 'root', 'rw-r--r--'),
        'resolv.conf': this.makeFile('resolv.conf', c.resolvConf + '\n', 'root', 'root', 'rw-r--r--'),
        sudoers: this.makeFile('sudoers', c.sudoers + '\n', 'root', 'root', 'r--r-----'),
        crontab: this.makeFile('crontab', c.crontab + '\n', 'root', 'root', 'rw-r--r--')
      }, 'root', 'root', 'rwxr-xr-x'),
      var: this.makeDir('var', {
        log: this.makeDir('log', {
          'system.log': this.makeFile('system.log', c.sysLog, 'root', 'root', 'rw-r--r--'),
          syslog: this.makeFile('syslog', c.sysLog, 'root', 'adm', 'rw-r-----'),
          'auth.log': this.makeFile('auth.log', c.authLog, 'root', 'adm', 'rw-r-----'),
          nginx: this.makeDir('nginx', {
            'access.log': this.makeFile('access.log', c.nginxAccessLog, 'www-data', 'adm', 'rw-r--r--'),
            'error.log': this.makeFile('error.log', c.nginxErrorLog, 'www-data', 'adm', 'rw-r--r--')
          }, 'root', 'adm', 'rwxr-xr-x')
        }, 'root', 'root', 'rwxr-xr-x'),
        www: this.makeDir('www', {
          html: this.makeDir('html', {
            'index.html': this.makeFile('index.html', '<!DOCTYPE html><html><body><h1>Welcome to nginx on Penguin Gym!</h1></body></html>\n', 'www-data', 'www-data', 'rw-r--r--')
          }, 'www-data', 'www-data', 'rwxr-xr-x')
        }, 'root', 'root', 'rwxr-xr-x')
      }, 'root', 'root', 'rwxr-xr-x'),
      proc: this.makeDir('proc', {
        cpuinfo: this.makeFile('cpuinfo', c.cpuinfo + '\n', 'root', 'root', 'r--r--r--'),
        meminfo: this.makeFile('meminfo', c.meminfo + '\n', 'root', 'root', 'r--r--r--'),
        version: this.makeFile('version', c.procVersion + '\n', 'root', 'root', 'r--r--r--'),
        uptime: this.makeFile('uptime', c.procUptime + '\n', 'root', 'root', 'r--r--r--'),
        mounts: this.makeFile('mounts', '/dev/sda1 / ext4 rw,relatime 0 0\ntmpfs /tmp tmpfs rw,nosuid,nodev 0 0\nproc /proc proc rw,nosuid,nodev,noexec 0 0\n', 'root', 'root', 'r--r--r--')
      }, 'root', 'root', 'r-xr-xr-x'),
      dev: this.makeDir('dev', {
        null: this.makeFile('null', '', 'root', 'root', 'rw-rw-rw-', { isDeviceNull: true, size: 0 }),
        zero: this.makeFile('zero', '\0\0\0\0', 'root', 'root', 'rw-rw-rw-', { size: 0 }),
        random: this.makeFile('random', 'r4nd0m_s33d', 'root', 'root', 'rw-rw-rw-', { size: 0 }),
        urandom: this.makeFile('urandom', 'ur4nd0m_s33d', 'root', 'root', 'rw-rw-rw-', { size: 0 }),
        sda1: this.makeFile('sda1', '', 'root', 'disk', 'rw-rw----', { size: 0 }),
        pts: this.makeDir('pts', {
          '0': this.makeFile('0', '', 'user', 'tty', 'rw--w----', { size: 0 })
        }, 'root', 'root', 'rwxr-xr-x')
      }, 'root', 'root', 'rwxr-xr-x'),
      tmp: this.makeDir('tmp', {}, 'root', 'root', 'rwxrwxrwx'),
      opt: this.makeDir('opt', {}, 'root', 'root', 'rwxr-xr-x'),
      srv: this.makeDir('srv', {}, 'root', 'root', 'rwxr-xr-x'),
      mnt: this.makeDir('mnt', {}, 'root', 'root', 'rwxr-xr-x')
    }, 'root', 'root', 'rwxr-xr-x');
  }

  /**
   * Verifica se o usuário atual ('user' ou 'root' quando sudoMode=true) tem permissão 'r', 'w' ou 'x' no nó
   */
  hasPermission(node, permChar) {
    if (!node) return true;
    if (this.sudoMode) return true;
    if (node.isDeviceNull) return true;

    const perms = node.permissions || (node.type === 'directory' ? 'rwxr-xr-x' : 'rw-r--r--');
    let slice = perms.slice(6, 9); // others
    if (node.owner === 'user' || node.owner === 'penguin') {
      slice = perms.slice(0, 3);
    } else if (node.group === 'user' || node.group === 'adm' || node.group === 'sudo' || node.group === 'docker') {
      slice = perms.slice(3, 6);
    }

    if (permChar === 'r') return slice[0] === 'r';
    if (permChar === 'w') return slice[1] === 'w';
    if (permChar === 'x') return slice[2] === 'x' || slice[2] === 't' || slice[2] === 's';
    return true;
  }

  /**
   * Restaura arquivos base essenciais sem destruir arquivos personalizados criados pelo usuário
   */
  ensureBaselineFiles() {
    if (!this.root) {
      this.reset();
      return;
    }
    const prevSudo = this.sudoMode;
    this.sudoMode = true;
    try {
      const c = this.getBaselineContents();
      for (const dirPath of ['/home/user', '/home/user/documents', '/home/user/projects', '/home/user/downloads']) {
        let dirNode = this.getNode(dirPath);
        if (!dirNode) {
          this.createDirectory(dirPath, true, 'rwxr-xr-x', 'user');
          dirNode = this.getNode(dirPath);
        } else if (dirNode.owner === 'root') {
          dirNode.owner = 'user';
          dirNode.group = 'user';
        }
      }

      const ensureFile = (p, content, perms = 'rw-r--r--', extra = {}) => {
        const existing = this.getNode(p);
        if (!existing) {
          this.createFile(p, content, 'user', perms);
          const n = this.getNode(p);
          if (n) Object.assign(n, extra);
        }
      };

      ensureFile('/home/user/documents/readme.txt', c.readme);
      ensureFile('/home/user/documents/notes.txt', c.notes);
      ensureFile('/home/user/documents/data.txt', c.data);
      ensureFile('/home/user/projects/test.sh', c.testSh, 'rwxr-xr-x');
      ensureFile('/home/user/.bashrc', c.bashrc);
      ensureFile('/home/user/members.csv', c.membersCsv);
      ensureFile('/home/user/gym.db', 'SQLite format 3 (gym.db)', 'rw-r--r--', { size: 8192 });
      ensureFile('/home/user/gym_legacy.db', 'SQLite format 3 (gym_legacy.db)', 'rw-r--r--', { size: 12288 });

      // Garante que todos os binários essenciais do sistema existam em /bin e /usr/bin
      const binDir = this.getNode('/bin');
      const usrBinDir = this.getNode('/usr/bin');
      if (this.systemBinNames) {
        if (binDir && binDir.children) {
          for (const b of this.systemBinNames) {
            if (!binDir.children[b]) {
              binDir.children[b] = this.makeFile(b, `ELF 64-bit LSB pie executable (${b})`, 'root', 'root', 'rwxr-xr-x', { size: 48120 });
            }
          }
        }
        if (usrBinDir && usrBinDir.children) {
          for (const b of this.systemBinNames) {
            if (!usrBinDir.children[b]) {
              usrBinDir.children[b] = this.makeFile(b, `ELF 64-bit LSB pie executable (${b})`, 'root', 'root', 'rwxr-xr-x', { size: 48120 });
            }
          }
        }
      }
    } finally {
      this.sudoMode = prevSudo;
    }
  }

  /**
   * Configura o ambiente e arquivos iniciais específicos para a lição selecionada
   * preservando arquivos extras criados pelo aluno quando não conflitam com a missão.
   */
  setupForLesson(lessonId, git, docker, sql, forceReset = false, ansible = null) {
    if (forceReset || !this.root) {
      this.reset();
    } else {
      this.currentPath = '/home/user';
      this.oldPath = '/home/user';
      this.ensureBaselineFiles();
    }

    if (git) git.reset();
    if (docker) docker.reset();
    if (sql) sql.reset();
    if (ansible) ansible.reset();

    if (!lessonId) return;

    const prevSudo = this.sudoMode;
    this.sudoMode = true;
    try {
      // Se a missão é mover test.sh para downloads, garante que downloads/test.sh não esteja sobrando de antes
      if (lessonId === 'file-mv') {
        const dlTest = this.getNode('/home/user/downloads/test.sh');
        if (dlTest) this.removeFile('/home/user/downloads/test.sh');
      }

      // Garante replay limpo para lições que criam pastas/arquivos com nomes fixos (mesmo com Auto-limpar desligado)
      if (lessonId === 'file-mkdir') {
        if (this.getRawNode('/home/user/myproject')) {
          try { this.removeRecursive('/home/user/myproject', true); } catch {}
        }
      }
      if (lessonId === 'permission-sudo-mkdir') {
        if (this.getRawNode('/opt/myfolder')) {
          try { this.removeRecursive('/opt/myfolder', true); } catch {}
        }
      }

      // Se a missão é remover o diretório vazio downloads (rmdir downloads), garante que downloads exista e esteja vazio
      if (lessonId === 'file-rmdir') {
        const dl = this.getNode('/home/user/downloads');
        if (dl && dl.type === 'directory') {
          dl.children = {};
        }
      }

      // Se a missão é descompactar notes.txt.gz (após comprimir notes.txt), garante estado inicial limpo
      if (lessonId === 'lpic-gunzip-decompress') {
        try { this.removeFile('/home/user/documents/notes.txt.gz', true); } catch {}
      }

      // Permissões: garante que test.txt / segredo.txt existam no diretório atual com permissão inicial
      if (lessonId === 'permission-chmod' || lessonId === 'permission-chown') {
        this.writeFile('/home/user/test.txt', 'Test file\n');
        const node = this.getNode('/home/user/test.txt');
        if (node) {
          node.permissions = 'rw-r--r--';
          node.owner = 'user';
        }
      }
      if (lessonId === 'permission-chmod-octal') {
        this.writeFile('/home/user/segredo.txt', 'CHAVE_SECRETA_GYM=penguin-2026\n');
        const node = this.getNode('/home/user/segredo.txt');
        if (node) {
          node.permissions = 'rw-r--r--';
          node.owner = 'user';
        }
      }

      // Fundamentos novos: rm -r, mv renomear, cp -r, sort | uniq, sort -n
      if (lessonId === 'file-rm-recursive') {
        this.createDirectory('/home/user/pasta_antiga', true);
        this.writeFile('/home/user/pasta_antiga/velho.txt', 'arquivo antigo\n');
      }
      if (lessonId === 'file-mv-rename') {
        this.writeFile('/home/user/test.txt', 'Arquivo para renomear\n');
        try { this.removeFile('/home/user/renomeado.txt', true); } catch {}
      }
      if (lessonId === 'file-cp-dir') {
        try { this.removeRecursive('/home/user/documents_backup', true); } catch {}
      }
      if (lessonId === 'text-sort-uniq-combo') {
        this.writeFile('/home/user/bagunca.txt', 'banana\napple\nbanana\ncherry\napple\nbanana\n');
      }
      if (lessonId === 'text-sort-numeric') {
        this.writeFile('/home/user/numeros.txt', '100\n2\n25\n9\n40\n');
      }
      if (lessonId === 'advanced-grep-invert') {
        this.writeFile('/home/user/dados.txt', 'servidor1 192.168.1.10 ativo\nservidor2 192.168.1.20 inativo\nservidor3 192.168.1.30 ativo\n');
      }

      // Pipeline ls | grep .txt
      if (lessonId === 'pipeline-ls-grep') {
        this.writeFile('/home/user/script.sh', '#!/bin/bash\necho "Hello"\n');
        this.writeFile('/home/user/config.conf', 'config=value\n');
        this.writeFile('/home/user/documents/config.conf', 'config=value\n');
        this.writeFile('/home/user/documents/image.jpg', 'binary image data');
      }

      // Redirect append
      if (lessonId === 'redirect-append-advanced') {
        this.writeFile('/home/user/study_log.txt', 'Linux Study Log\n');
      }

      // LPIC tar/gzip/zip/zcat/readlink setups
      if (lessonId === 'lpic-tar-list') {
        this.createFile('/home/user/docs.tar', 'TAR_ARCHIVE_OF_documents');
        const node = this.getNode('/home/user/docs.tar');
        if (node) node.tarEntries = ['documents/', 'documents/readme.txt', 'documents/notes.txt'];

        this.createFile('/home/user/archive.tar.gz', 'TAR_GZ_ARCHIVE_OF_documents');
        const gzNode = this.getNode('/home/user/archive.tar.gz');
        if (gzNode) gzNode.tarEntries = ['documents/', 'documents/readme.txt', 'documents/notes.txt'];
      }
      if (lessonId === 'lpic-tar-extract') {
        try { this.removeFile('/home/user/proj.tar', true); } catch {}
        try { this.removeRecursive('/home/user/downloads/extracted', true); } catch {}
      }
      if (lessonId === 'lpic-tar-extract-dir') {
        this.createFile('/home/user/archive.tar.gz', 'TAR_GZ_ARCHIVE_OF_documents');
        const gzNode = this.getNode('/home/user/archive.tar.gz');
        if (gzNode) {
          gzNode.tarEntries = ['documents/', 'documents/readme.txt', 'documents/notes.txt'];
          gzNode.tarFilesData = [
            { path: 'documents/', type: 'directory', permissions: 'rwxr-xr-x' },
            { path: 'documents/readme.txt', type: 'file', content: this.getBaselineContents().readme, permissions: 'rw-r--r--' },
            { path: 'documents/notes.txt', type: 'file', content: this.getBaselineContents().notes, permissions: 'rw-r--r--' }
          ];
        }
      }
      if (lessonId === 'lpic-zcat-log') {
        const c = this.getBaselineContents();
        this.writeFile('/var/log/nginx/access.log.1.gz', `GZIPPED_${c.nginxAccessLog}`);
        const gzLog = this.getNode('/var/log/nginx/access.log.1.gz');
        if (gzLog) gzLog.originalContent = c.nginxAccessLog;
      }
      if (lessonId === 'lpic-zip-create') {
        try { this.removeFile('/home/user/proj.zip', true); } catch {}
      }
      if (lessonId === 'lpic-unzip-extract') {
        this.createFile('/home/user/proj.zip', 'ZIP_ARCHIVE_OF_projects');
        const zipNode = this.getNode('/home/user/proj.zip');
        if (zipNode) {
          zipNode.zipEntries = [
            { path: 'projects/', type: 'directory' },
            { path: 'projects/test.sh', type: 'file', content: this.getBaselineContents().testSh }
          ];
        }
      }
      if (lessonId === 'lpic-ln-symbolic') {
        if (this.getRawNode('/home/user/readme-link')) {
          try { this.removeFile('/home/user/readme-link', true); } catch {}
        }
      }
      if (lessonId === 'lpic-ln-hardlink') {
        if (this.getRawNode('/home/user/notes-hard.txt')) {
          try { this.removeFile('/home/user/notes-hard.txt', true); } catch {}
        }
      }
      if (lessonId === 'lpic-readlink') {
        this.createSymlink('documents/readme.txt', '/home/user/readme-link');
      }

      // Lições de Git
      if (lessonId.startsWith('git-') && git) {
        const readmeMd = '# My Project\n\nRepositório para praticar Git.\n';
        const indexHtml = '<h1>My Project</h1>\n';
        const styleCss = 'body { margin: 0; }\n';
        this.writeFile('/home/user/README.md', readmeMd);
        this.writeFile('/home/user/index.html', indexHtml);
        this.writeFile('/home/user/style.css', styleCss);
        if (lessonId !== 'git-gitignore') {
          try { this.removeFile('/home/user/.gitignore', true); } catch {}
        }

        if (lessonId !== 'git-init') {
          git.initialized = true;
          try { this.createDirectory('/home/user/.git', true); } catch {}
        }
        if (lessonId === 'git-commit' || lessonId === 'git-diff-staged') {
          git.index.add('README.md');
        }
        if (['git-log', 'git-add-all', 'git-commit-second', 'git-branch-create', 'git-branch-list', 'git-switch', 'git-diff-staged', 'git-restore-staged', 'git-switch-create', 'git-merge', 'git-branch-delete', 'git-stash', 'git-gitignore'].includes(lessonId)) {
          git.commits = [{
            hash: 'a1b2c3d',
            message: 'first commit',
            branch: 'main',
            files: ['README.md'],
            date: '2026-01-15 10:00:00'
          }];
          git.trackedFiles.add('README.md');
        }
        if (lessonId === 'git-gitignore') {
          this.writeFile('/home/user/.env', 'API_SECRET=penguin123\n');
          this.writeFile('/home/user/app.js', 'console.log("Penguin Gym");\n');
          try { this.removeFile('/home/user/.gitignore', true); } catch {}
        }
        if (['git-branch-list', 'git-switch', 'git-merge', 'git-branch-delete'].includes(lessonId)) {
          git.branches = ['main', 'feature'];
        }
        if (lessonId === 'git-restore-staged') {
          this.writeFile('/home/user/.env', 'API_SECRET=penguin123\n');
          git.index.add('index.html');
          git.index.add('.env');
        }
        if (lessonId === 'git-stash') {
          git.index.add('index.html');
        }
      }

      // Lições de Docker
      if (lessonId.startsWith('docker-') && docker) {
        if (lessonId === 'docker-pull') {
          docker.images = new Set();
          docker.containers.clear();
        } else if (['docker-images', 'docker-run-hello', 'docker-run-detached', 'docker-rmi'].includes(lessonId)) {
          docker.images = new Set(['hello-world']);
          docker.containers.clear();
        } else if (lessonId === 'docker-ps-a') {
          docker.images = new Set(['hello-world']);
          docker.containers.clear();
          docker.containers.set('c1a2b3d4e5f6', {
            id: 'c1a2b3d4e5f6',
            name: 'nostalgic_hello',
            image: 'hello-world',
            status: 'Exited (0) 2 minutes ago',
            ports: '',
            created: '2 minutes ago'
          });
        } else if (['docker-ps', 'docker-stop'].includes(lessonId)) {
          docker.images = new Set(['hello-world', 'nginx']);
          docker.containers.clear();
          docker.containers.set('f6e5d4c3b2a1', {
            id: 'f6e5d4c3b2a1',
            name: 'web',
            image: 'nginx',
            status: 'Up 2 minutes',
            ports: '80/tcp',
            created: '2 minutes ago'
          });
        } else if (['docker-rm', 'docker-start'].includes(lessonId)) {
          docker.images = new Set(['hello-world', 'nginx']);
          docker.containers.clear();
          docker.containers.set('f6e5d4c3b2a1', {
            id: 'f6e5d4c3b2a1',
            name: 'web',
            image: 'nginx',
            status: 'Exited (0) 1 minute ago',
            ports: '',
            created: '3 minutes ago'
          });
        } else if (lessonId === 'docker-run-port') {
          docker.images = new Set(['nginx']);
          docker.containers.clear();
        } else if (['docker-logs', 'docker-exec', 'docker-inspect'].includes(lessonId)) {
          docker.images = new Set(['nginx']);
          docker.containers.clear();
          docker.containers.set('a9b8c7d6e5f4', {
            id: 'a9b8c7d6e5f4',
            name: 'web2',
            image: 'nginx',
            status: 'Up 3 minutes',
            ports: '0.0.0.0:8080->80/tcp',
            created: '3 minutes ago'
          });
        } else if (lessonId === 'docker-build') {
          docker.images = new Set(['hello-world']);
          docker.containers.clear();
          this.writeFile('/home/user/Dockerfile', 'FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nCMD ["node", "server.js"]\n');
        }
      }

      // Lições de Redes & Conectividade
      if (lessonId.startsWith('net-')) {
        if (lessonId === 'net-curl-download') {
          try { this.removeFile('/home/user/app.json', true); } catch {}
          try { this.removeFile('/home/user/saida.json', true); } catch {}
        }
        if (lessonId === 'net-wget') {
          const dados = this.getNode('/home/user/dados.txt');
          if (dados) this.removeFile('/home/user/dados.txt');
        }
      }

      // Lições de Sysadmin & Serviços
      if (lessonId.startsWith('sys-')) {
        if (lessonId === 'sys-useradd') {
          try { this.removeRecursive('/home/devops', true); } catch {}
          const passwd = this.readFile('/etc/passwd');
          this.writeFile('/etc/passwd', passwd.split('\n').filter(l => !l.startsWith('devops:')).join('\n'));
        }
        if (['sys-groupadd', 'sys-usermod-group', 'sys-groups-check', 'sys-passwd-user', 'sys-userdel'].includes(lessonId)) {
          const passwd = this.readFile('/etc/passwd');
          const group = this.readFile('/etc/group');
          if (lessonId !== 'sys-groupadd' && !group.split('\n').some(l => l.startsWith('deploy:'))) {
            this.writeFile('/etc/group', group.trimEnd() + '\ndeploy:x:1050:\n');
          } else if (lessonId === 'sys-groupadd') {
            this.writeFile('/etc/group', group.split('\n').filter(l => !l.startsWith('deploy:')).join('\n'));
          }
          if (!passwd.split('\n').some(l => l.startsWith('devops:'))) {
            this.writeFile('/etc/passwd', passwd.trimEnd() + '\ndevops:x:1001:1001::/home/devops:/bin/bash\n');
            this.createDirectory('/home/devops', true, 'rwxr-xr-x', 'devops');
          }
          if (lessonId === 'sys-groups-check') {
            const curGroup = this.readFile('/etc/group');
            if (!curGroup.includes('deploy:x:1050:devops')) {
              this.writeFile('/etc/group', curGroup.split('\n').map(l => l.startsWith('deploy:') ? 'deploy:x:1050:devops' : l).join('\n'));
            }
          }
        }
      }

      // Lições de Scripting & Shell Power
      if (lessonId.startsWith('bash-')) {
        if (lessonId === 'bash-redirect-stderr') {
          try { this.removeFile('/home/user/erro.log', true); } catch {}
          try { this.removeFile('/home/user/erros.txt', true); } catch {}
        }
        if (lessonId === 'bash-redirect-all') {
          try { this.removeFile('/home/user/tudo.log', true); } catch {}
          this.writeFile('/tmp/teste.txt', 'Arquivo temporário válido\n');
        }
        if (lessonId === 'bash-loop-for') {
          ['log_1.txt', 'log_2.txt', 'log_3.txt', 'Log_1.txt', 'Log_2.txt', 'Log_3.txt'].forEach(f => {
            try { this.removeFile('/home/user/' + f, true); } catch {}
          });
        }
        if (lessonId === 'bash-run-script') {
          this.writeFile('/home/user/script.sh', '#!/bin/bash\necho "Script executado com sucesso!"\n');
          const scr = this.getNode('/home/user/script.sh');
          if (scr) scr.permissions = 'rwxr-xr-x';
        }
        if (lessonId === 'bash-exec-chmod') {
          this.writeFile('/home/user/script.sh', '#!/bin/bash\necho "Executado diretamente!"\n');
          const scr = this.getNode('/home/user/script.sh');
          if (scr) scr.permissions = 'rw-r--r--';
        }
        if (lessonId === 'bash-script-args') {
          this.writeFile('/home/user/saudacao.sh', '#!/bin/bash\necho "Ola, $1!"\n');
          const scr = this.getNode('/home/user/saudacao.sh');
          if (scr) scr.permissions = 'rwxr-xr-x';
        }
      }

      // Lições de Processamento Avançado de Texto & Ferramentas
      if (lessonId.startsWith('text-') || lessonId.startsWith('tool-') || lessonId.startsWith('process-')) {
        if (lessonId === 'text-sed-inplace') {
          this.writeFile('/home/user/config.txt', 'versao=1\nporta=8080\n');
        }
        if (lessonId === 'text-awk-columns' || lessonId === 'text-column-format' || lessonId === 'text-awk-filter' || lessonId === 'text-sed-delete') {
          this.writeFile('/home/user/dados.txt', 'servidor1 192.168.1.10 ativo\nservidor2 192.168.1.20 inativo\nservidor3 192.168.1.30 ativo\n');
        }
        if (lessonId === 'text-awk-delimiter') {
          this.writeFile('/home/user/usuarios.csv', 'aluno,1001,estudante\nadmin,1000,administrador\nsuporte,1002,analista\n');
        }
        if (lessonId === 'text-xargs-basic') {
          this.writeFile('/home/user/lista.txt', 'arq1.txt arq2.txt arq3.txt\n');
        }
        if (lessonId === 'text-tee-pipe') {
          try { this.removeFile('/home/user/relatorio.txt', true); } catch {}
        }
        if (lessonId === 'tool-jq-parse' || lessonId === 'text-jq-filter') {
          this.writeFile('/home/user/config.json', '{"app":"penguin-gym","version":"2.0.0","active":true,"features":["bash","docker","git"]}\n');
        }
      }

      // Lições de Incidentes (Boss Cross-Domain)
      if (lessonId.startsWith('inc-')) {
        if (lessonId === 'inc-git-secret-leak' && git) {
          git.initialized = true;
          try { this.createDirectory('/home/user/.git', true); } catch {}
          this.writeFile('/home/user/.env', 'DB_PASS=super_secreta_999\n');
          this.writeFile('/home/user/app.js', 'console.log("Penguin Gym API");\n');
          git.index.add('.env');
          git.index.add('app.js');
        }
        if (lessonId === 'inc-docker-conflict' && docker) {
          docker.images = new Set(['nginx']);
          docker.containers.clear();
          docker.containers.set('d0c4e1234567', {
            id: 'd0c4e1234567',
            name: 'travado',
            image: 'nginx',
            status: 'Up 10 minutes',
            ports: '0.0.0.0:8080->80/tcp',
            created: '10 minutes ago'
          });
        }
        if (lessonId === 'inc-backup-pipeline') {
          try { this.removeFile('/home/user/tokyo.csv', true); } catch {}
          try { this.removeFile('/home/user/tokyo.csv.gz', true); } catch {}
        }
        if (lessonId === 'inc-script-perm-fix') {
          this.writeFile('/home/user/deploy.sh', '#!/bin/bash\necho "Deploy OK: release 2.4 enviada!"\n');
          const dNode = this.getNode('/home/user/deploy.sh');
          if (dNode) {
            dNode.permissions = 'rw-r--r--';
            dNode.owner = 'user';
            dNode.group = 'user';
          }
        }
      }

      // Lições de Automação Bash
      if (lessonId.startsWith('auto-bash-')) {
        if (lessonId === 'auto-bash-hello') {
          try { this.removeFile('/home/user/organiza.sh', true); } catch {}
        }
        if (lessonId === 'auto-bash-vars-date') {
          try { this.removeRecursive('/home/user/logs', true); } catch {}
        }
        if (lessonId === 'auto-bash-logging') {
          try { this.removeFile('/home/user/automacao.log', true); } catch {}
          this.writeFile('/home/user/rotina.sh', '#!/bin/bash\necho "Executando tarefa automatica"\nls /root\n');
          const rNode = this.getNode('/home/user/rotina.sh');
          if (rNode) { rNode.permissions = 'rwxr-xr-x'; rNode.owner = 'user'; }
        }
        if (lessonId === 'auto-bash-prep-dirs') {
          try { this.removeRecursive('/home/user/downloads/imagens', true); } catch {}
          try { this.removeRecursive('/home/user/downloads/documentos', true); } catch {}
          try { this.removeRecursive('/home/user/downloads/arquivos', true); } catch {}
          this.createDirectory('/home/user/downloads', true, 'rwxr-xr-x', 'user');
        }
        if (lessonId === 'auto-bash-glob-move') {
          this.createDirectory('/home/user/downloads/imagens', true, 'rwxr-xr-x', 'user');
          this.createDirectory('/home/user/downloads/documentos', true, 'rwxr-xr-x', 'user');
          this.createDirectory('/home/user/downloads/arquivos', true, 'rwxr-xr-x', 'user');
          this.writeFile('/home/user/downloads/fatura.pdf', 'PDF fatura');
          this.writeFile('/home/user/downloads/contrato.pdf', 'PDF contrato');
          this.writeFile('/home/user/downloads/foto1.jpg', 'JPG foto');
          this.writeFile('/home/user/downloads/logo.png', 'PNG logo');
          this.writeFile('/home/user/downloads/backup.zip', 'ZIP arquivo');
        }
        if (lessonId === 'auto-bash-organizer-script') {
          try { this.removeFile('/home/user/organizar_downloads.sh', true); } catch {}
          try { this.removeRecursive('/home/user/downloads', true); } catch {}
          this.createDirectory('/home/user/downloads/imagens', true, 'rwxr-xr-x', 'user');
          this.createDirectory('/home/user/downloads/documentos', true, 'rwxr-xr-x', 'user');
          this.createDirectory('/home/user/downloads/arquivos', true, 'rwxr-xr-x', 'user');
          this.writeFile('/home/user/downloads/manual.pdf', 'PDF manual');
          this.writeFile('/home/user/downloads/guia.pdf', 'PDF guia');
          this.writeFile('/home/user/downloads/banner.png', 'PNG banner');
          this.writeFile('/home/user/downloads/temp.tmp', 'TMP');
        }
        if (lessonId === 'auto-bash-cleanup-tmp') {
          this.createDirectory('/home/user/downloads', true, 'rwxr-xr-x', 'user');
          this.writeFile('/home/user/downloads/cache1.tmp', 'tmp1');
          this.writeFile('/home/user/downloads/cache2.tmp', 'tmp2');
          this.writeFile('/home/user/downloads/importante.txt', 'manter este arquivo\n');
        }
        if (lessonId === 'auto-bash-rsync-local') {
          try { this.removeRecursive('/home/user/backups', true); } catch {}
        }
        if (lessonId === 'auto-bash-rsync-dryrun') {
          try { this.removeRecursive('/home/user/backups', true); } catch {}
          this.createDirectory('/home/user/backups/documents', true, 'rwxr-xr-x', 'user');
          this.writeFile('/home/user/backups/documents/readme.txt', this.getBaselineContents().readme);
          this.writeFile('/home/user/backups/documents/obsoleto.txt', 'arquivo antigo que so existe no backup\n');
        }
        if (lessonId === 'auto-bash-backup-tar-verify') {
          try { this.removeRecursive('/home/user/backups', true); } catch {}
          this.createDirectory('/home/user/backups', true, 'rwxr-xr-x', 'user');
          try { this.removeFile('/home/user/backup.sh', true); } catch {}
        }
        if (lessonId === 'auto-bash-disk-alert') {
          try { this.removeFile('/home/user/checa_disco.sh', true); } catch {}
        }
        if (lessonId === 'auto-bash-service-watchdog') {
          try { this.removeFile('/home/user/watchdog.sh', true); } catch {}
        }
        if (lessonId === 'auto-bash-cron-schedule') {
          this.writeFile('/home/user/organizar_downloads.sh', '#!/bin/bash\necho "Organizacao concluida"\n');
          const oNode = this.getNode('/home/user/organizar_downloads.sh');
          if (oNode) { oNode.permissions = 'rwxr-xr-x'; oNode.owner = 'user'; }
        }
        if (lessonId === 'auto-bash-boss-pipeline') {
          try { this.removeFile('/home/user/rotina_noturna.sh', true); } catch {}
          try { this.removeFile('/home/user/rotina.log', true); } catch {}
          try { this.removeRecursive('/home/user/backups', true); } catch {}
          try { this.removeRecursive('/home/user/downloads', true); } catch {}
          this.createDirectory('/home/user/downloads/documentos', true, 'rwxr-xr-x', 'user');
          this.createDirectory('/home/user/downloads/imagens', true, 'rwxr-xr-x', 'user');
          this.writeFile('/home/user/downloads/nota.pdf', 'PDF nota');
          this.writeFile('/home/user/downloads/rascunho.tmp', 'TMP rascunho');
        }
      }

      // Lições de Ansible
      if (lessonId.startsWith('ansible-')) {
        const defaultInv = '[webservers]\nweb1 ansible_host=10.0.1.11\nweb2 ansible_host=10.0.1.12\n\n[databases]\ndb1 ansible_host=10.0.1.21\n';
        if (lessonId === 'ansible-ssh-prep') {
          try { this.removeRecursive('/home/user/.ssh', true); } catch {}
        } else {
          this.createDirectory('/home/user/.ssh', true, 'rwx------', 'user');
          this.writeFile('/home/user/.ssh/id_ed25519', '-----BEGIN OPENSSH PRIVATE KEY-----\nVIRTUAL_KEY\n-----END OPENSSH PRIVATE KEY-----\n');
          this.writeFile('/home/user/.ssh/id_ed25519.pub', 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPenguinGymVirtualKey123456 user@penguin-gym\n');
        }

        if (lessonId === 'ansible-inventory-ini') {
          try { this.removeFile('/home/user/inventory.ini', true); } catch {}
        } else if (lessonId !== 'ansible-ssh-prep') {
          this.writeFile('/home/user/inventory.ini', defaultInv);
        }

        if (lessonId === 'ansible-adhoc-copy' || lessonId === 'ansible-boss-deploy') {
          this.writeFile('/home/user/index.html', '<h1>Penguin Gym Cloud Ready!</h1>\n');
        }
        if (lessonId === 'ansible-first-playbook') {
          try { this.removeFile('/home/user/webserver.yml', true); } catch {}
        }
        if (lessonId === 'ansible-idempotency-check') {
          this.writeFile('/home/user/webserver.yml',
            '- name: Configurar Webservers\n  hosts: webservers\n  become: yes\n  tasks:\n    - name: Instalar nginx\n      apt: name=nginx state=present\n    - name: Iniciar nginx\n      service: name=nginx state=started enabled=yes\n'
          );
          if (ansible) {
            ['web1', 'web2'].forEach(h => {
              ansible.nodes[h].packages.add('nginx');
              ansible.nodes[h].services.nginx = { active: true, enabled: true };
            });
          }
        }
        if (lessonId === 'ansible-check-diff') {
          this.writeFile('/home/user/index.html', '<h1>Deploy v2.0 - Penguin Gym</h1>\n');
          this.writeFile('/home/user/deploy.yml',
            '- name: Deploy pagina web\n  hosts: webservers\n  become: yes\n  tasks:\n    - name: Publicar index.html\n      copy: src=index.html dest=/var/www/html/index.html mode=0644\n'
          );
        }
        if (lessonId === 'ansible-vars-lineinfile') {
          this.writeFile('/home/user/vars_app.yml',
            '- name: Configurar ambiente da aplicacao\n  hosts: all\n  become: yes\n  vars:\n    app_env: production\n  tasks:\n    - name: Definir ENV no app.conf\n      lineinfile: path=/etc/app.conf line="ENV={{ app_env }}" state=present\n'
          );
        }
        if (lessonId === 'ansible-handlers-notify') {
          this.writeFile('/home/user/nginx.conf', 'worker_processes 4;\nevents { worker_connections 1024; }\n');
          this.writeFile('/home/user/nginx_config.yml',
            '- name: Atualizar config do Nginx com Handler\n  hosts: webservers\n  become: yes\n  tasks:\n    - name: Garantir nginx instalado\n      apt: name=nginx state=present\n    - name: Copiar nginx.conf\n      copy: src=nginx.conf dest=/etc/nginx/nginx.conf mode=0644\n      notify: Restart nginx\n  handlers:\n    - name: Restart nginx\n      service: name=nginx state=restarted\n'
          );
          if (ansible) {
            ['web1', 'web2'].forEach(h => ansible.nodes[h].packages.add('nginx'));
          }
        }
        if (lessonId === 'ansible-loop-when') {
          this.writeFile('/home/user/loop_when.yml',
            '- name: Pacotes base e firewall condicional\n  hosts: all\n  become: yes\n  tasks:\n    - name: Instalar utilitarios\n      apt: name={{ item }} state=present\n      loop:\n        - curl\n        - htop\n        - jq\n    - name: Liberar HTTP somente nos webservers\n      ufw: rule=allow port=80\n      when: inventory_hostname in groups[\'webservers\']\n'
          );
        }
        if (lessonId === 'ansible-boss-deploy') {
          this.writeFile('/home/user/nginx.conf', 'worker_processes 4;\nevents { worker_connections 2048; }\n');
          this.writeFile('/home/user/infra.yml',
            '- name: Provisionamento completo da frota\n  hosts: all\n  become: yes\n  tasks:\n    - name: Criar usuario deploy\n      user: name=deploy state=present\n    - name: Instalar curl nos servidores\n      apt: name=curl state=present\n\n- name: Configurar camada web\n  hosts: webservers\n  become: yes\n  tasks:\n    - name: Instalar nginx\n      apt: name=nginx state=present\n    - name: Publicar nginx.conf\n      copy: src=nginx.conf dest=/etc/nginx/nginx.conf mode=0644\n      notify: Restart nginx\n    - name: Publicar index.html\n      copy: src=index.html dest=/var/www/html/index.html mode=0644\n    - name: Liberar porta 80\n      ufw: rule=allow port=80\n  handlers:\n    - name: Restart nginx\n      service: name=nginx state=started enabled=yes\n'
          );
        }
      }
    } finally {
      this.sudoMode = prevSudo;
    }
    if (['permission-sudo-basic', 'bash-redirect-stderr', 'bash-redirect-all', 'bash-redirect-devnull', 'auto-bash-logging'].includes(lessonId)) {
      this.sudoMode = false;
    }
  }

  expandTilde(path) {
    const defaultHome = this.sudoMode ? '/root' : '/home/user';
    if (path === '~') return defaultHome;
    if (path === '~user' || path === '~penguin') return '/home/user';
    if (path === '~root') return '/root';
    if (path.startsWith('~/')) return defaultHome + path.slice(1);
    return path;
  }

  normalizePath(path) {
    if (!path) return this.currentPath;
    let p = this.expandTilde(path);
    if (!p.startsWith('/')) {
      p = (this.currentPath === '/' ? '' : this.currentPath) + '/' + p;
    }
    const segments = p.split('/').filter(Boolean);
    const resolved = [];
    for (const seg of segments) {
      if (seg === '.') continue;
      if (seg === '..') {
        if (resolved.length > 0) resolved.pop();
      } else {
        resolved.push(seg);
      }
    }
    return '/' + resolved.join('/');
  }

  resolvePath(path) {
    return this.normalizePath(path);
  }

  resolveRelativeFrom(baseDir, path) {
    if (!path) return baseDir || '/';
    const expanded = this.expandTilde(path);
    if (expanded.startsWith('/')) return this.normalizePath(expanded);
    const prefix = !baseDir || baseDir === '/' ? '' : baseDir;
    return this.normalizePath(`${prefix}/${expanded}`);
  }

  /**
   * Resolve todos os symlinks na árvore até o caminho canônico real (para realpath / readlink -f)
   */
  resolveCanonicalPath(path) {
    const norm = this.normalizePath(path);
    if (norm === '/') return '/';
    const parts = norm.split('/').filter(Boolean);
    let curr = this.root;
    let builtPath = '';
    let depth = 0;

    for (const part of parts) {
      if (!curr || curr.type !== 'directory' || !curr.children) {
        return builtPath + '/' + part;
      }
      let next = curr.children[part];
      if (!next) {
        return builtPath + '/' + part;
      }
      let linkParent = builtPath || '/';
      builtPath += '/' + part;
      while (next && next.type === 'symlink' && depth < 12) {
        depth++;
        const resolved = this.resolveRelativeFrom(linkParent, next.rawTarget || next.target);
        builtPath = resolved;
        linkParent = this.getParentPath(resolved);
        next = this.getRawNode(resolved);
      }
      curr = next;
    }
    return builtPath || '/';
  }

  getNode(path) {
    const norm = this.normalizePath(path);
    if (norm === '/') return this.root;
    const parts = norm.split('/').filter(Boolean);
    let curr = this.root;
    let currPath = '';
    let depth = 0;
    for (const part of parts) {
      if (!curr || curr.type !== 'directory' || !curr.children) return null;
      const parentPath = currPath || '/';
      curr = curr.children[part];
      if (!curr) return null;
      currPath = (parentPath === '/' ? '' : parentPath) + '/' + part;
      let linkParent = parentPath;
      while (curr && curr.type === 'symlink' && depth < 10) {
        depth++;
        const resolved = this.resolveRelativeFrom(linkParent, curr.rawTarget || curr.target);
        currPath = resolved;
        linkParent = this.getParentPath(resolved);
        curr = this.getRawNode(resolved);
      }
    }
    return curr;
  }

  getRawNode(path) {
    const norm = this.normalizePath(path);
    if (norm === '/') return this.root;
    const parts = norm.split('/').filter(Boolean);
    let curr = this.root;
    for (const part of parts) {
      if (!curr || curr.type !== 'directory' || !curr.children) return null;
      curr = curr.children[part];
      if (!curr) return null;
    }
    return curr;
  }

  getParentPath(path) {
    const norm = this.normalizePath(path);
    if (norm === '/') return '/';
    const lastSlash = norm.lastIndexOf('/');
    return lastSlash === 0 ? '/' : norm.slice(0, lastSlash);
  }

  getFileName(path) {
    const norm = this.normalizePath(path);
    if (norm === '/') return '';
    const parts = norm.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  }

  getParentDirectory(path) {
    const parentPath = this.getParentPath(path);
    return this.getNode(parentPath);
  }

  changeDirectory(path) {
    if (path === '-') {
      if (!this.oldPath) {
        throw new Error('bash: cd: OLDPWD não definido');
      }
      const prev = this.currentPath;
      this.currentPath = this.oldPath;
      this.oldPath = prev;
      return this.currentPath;
    }
    if (!path || path === '~') {
      this.oldPath = this.currentPath;
      this.currentPath = this.sudoMode ? '/root' : '/home/user';
      return this.currentPath;
    }
    const target = this.resolvePath(path);
    const node = this.getNode(target);
    if (!node) {
      throw new Error(`cd: ${path}: Arquivo ou diretório não encontrado`);
    }
    if (node.type !== 'directory') {
      throw new Error(`cd: ${path}: Não é um diretório`);
    }
    if (!this.hasPermission(node, 'x')) {
      throw new Error(`bash: cd: ${path}: Permissão negada`);
    }
    this.oldPath = this.currentPath;
    this.currentPath = target;
    return this.currentPath;
  }

  pushd(path) {
    const old = this.currentPath;
    if (!path) {
      if (this.dirStack.length === 0) {
        throw new Error('bash: pushd: nenhum outro diretório');
      }
      const top = this.dirStack.pop();
      this.changeDirectory(top);
      this.dirStack.push(old);
    } else {
      this.changeDirectory(path);
      this.dirStack.push(old);
    }
    return this.getDirsOutput();
  }

  popd() {
    if (this.dirStack.length === 0) {
      throw new Error('bash: popd: pilha de diretórios vazia');
    }
    const target = this.dirStack.pop();
    this.changeDirectory(target);
    return this.getDirsOutput();
  }

  getDirsOutput(verbose = false) {
    const formatHome = (p) => (p === '/home/user' ? '~' : p.startsWith('/home/user/') ? '~' + p.slice('/home/user'.length) : p);
    const all = [this.currentPath, ...[...this.dirStack].reverse()].map(formatHome);
    if (verbose) {
      return all.map((p, i) => ` ${i}  ${p}`).join('\n');
    }
    return all.join(' ');
  }

  listFiles(path = null) {
    const target = path ? this.resolvePath(path) : this.currentPath;
    const node = this.getNode(target);
    if (!node) {
      throw new Error(`ls: não foi possível acessar '${path}': Arquivo ou diretório não encontrado`);
    }
    if (!this.hasPermission(node, 'r')) {
      throw new Error(`ls: não foi possível abrir diretório '${path || target}': Permissão negada`);
    }
    if (node.type === 'file') {
      return [this.getFileName(target)];
    }
    return Object.keys(node.children || {});
  }

  applyUmask(isDir = false) {
    const mask = parseInt(this.umask || '0022', 8) & 0o777;
    const base = isDir ? 0o777 : 0o666;
    const val = base & (~mask);
    const triad = (n) => (n & 4 ? 'r' : '-') + (n & 2 ? 'w' : '-') + (n & 1 ? 'x' : '-');
    return triad((val >> 6) & 7) + triad((val >> 3) & 7) + triad(val & 7);
  }

  createFile(path, content = '', owner = null, permissions = null) {
    const target = this.resolvePath(path);
    const existing = this.getNode(target);
    if (existing && existing.isDeviceNull) {
      existing.mtime = Date.now();
      return target;
    }
    const parent = this.getParentDirectory(target);
    const name = this.getFileName(target);
    if (!parent || parent.type !== 'directory') {
      throw new Error(`touch: não foi possível criar '${path}': Diretório pai não existe`);
    }
    if (!this.hasPermission(parent, 'w')) {
      throw new Error(`${path}: Permissão negada`);
    }
    if (parent.children[name]) {
      const now = Date.now();
      parent.children[name].mtime = now;
      parent.children[name].atime = now;
      return target;
    }
    const isHomeUser = target.startsWith('/home/user/') || target === '/home/user';
    const effectiveOwner = owner || (isHomeUser ? 'user' : (this.sudoMode ? 'root' : 'user'));
    const effectivePerms = permissions || this.applyUmask(false);
    parent.children[name] = this.makeFile(name, content, effectiveOwner, effectiveOwner, effectivePerms);
    return target;
  }

  createDirectory(path, recursive = false, mode = null, owner = null) {
    const target = this.resolvePath(path);
    if (recursive) {
      const parts = target.split('/').filter(Boolean);
      let currPath = '';
      for (const part of parts) {
        currPath += '/' + part;
        const node = this.getNode(currPath);
        if (!node) {
          this.createDirectory(currPath, false, mode, owner);
        } else if (node.type !== 'directory') {
          throw new Error(`mkdir: '${currPath}' já existe e não é um diretório`);
        }
      }
      return target;
    }

    const parent = this.getParentDirectory(target);
    const name = this.getFileName(target);
    if (!parent || parent.type !== 'directory') {
      throw new Error(`mkdir: não foi possível criar o diretório '${path}': Arquivo ou diretório pai não encontrado`);
    }
    if (!this.hasPermission(parent, 'w')) {
      throw new Error(`mkdir: não foi possível criar o diretório '${path}': Permissão negada`);
    }
    if (parent.children[name]) {
      throw new Error(`mkdir: não foi possível criar o diretório '${path}': Arquivo ou diretório já existe`);
    }
    const isHomeUser = target.startsWith('/home/user/') || target === '/home/user';
    const effectiveOwner = owner || (isHomeUser ? 'user' : (this.sudoMode ? 'root' : 'user'));
    const effectiveMode = mode || this.applyUmask(true);
    parent.children[name] = this.makeDir(name, {}, effectiveOwner, effectiveOwner, effectiveMode);
    parent.links = (parent.links || 2) + 1;
    parent.mtime = Date.now();
    return target;
  }

  removeFile(path, force = false) {
    const target = this.resolvePath(path);
    const parent = this.getParentDirectory(target);
    const name = this.getFileName(target);
    if (!parent || !parent.children || !parent.children[name]) {
      if (force) return true;
      throw new Error(`rm: não foi possível remover '${path}': Arquivo ou diretório não encontrado`);
    }
    if (!this.hasPermission(parent, 'w')) {
      throw new Error(`rm: não foi possível remover '${path}': Permissão negada`);
    }
    const node = parent.children[name];
    if (node.type === 'directory' && Object.keys(node.children || {}).length > 0) {
      throw new Error(`rm: não foi possível remover '${path}': É um diretório não vazio (use -r)`);
    }
    if (node.type === 'directory' && parent.links > 2) {
      parent.links--;
    }
    const removedInode = node.inode;
    delete parent.children[name];
    if (node.type === 'file' && removedInode) {
      this.syncInodeNodes(removedInode, (n) => {
        if (n.links > 1) n.links--;
      });
    }
    parent.mtime = Date.now();
    return true;
  }

  /**
   * Percorre a árvore e aplica uma função a todos os nós que compartilham o mesmo inode (hardlinks)
   */
  syncInodeNodes(inode, fn) {
    if (!inode || !this.root) return;
    const walk = (dir) => {
      if (!dir || !dir.children) return;
      for (const child of Object.values(dir.children)) {
        if (child.inode === inode) fn(child);
        if (child.type === 'directory') walk(child);
      }
    };
    walk(this.root);
  }

  removeRecursive(path, force = false) {
    const target = this.resolvePath(path);
    if (target === '/' || target === '/home/user') {
      throw new Error(`rm: operação recusada: remover '${path}' é protegido`);
    }
    const parent = this.getParentDirectory(target);
    const name = this.getFileName(target);
    if (!parent || !parent.children || !parent.children[name]) {
      if (force) return true;
      throw new Error(`rm: não foi possível remover '${path}': Arquivo ou diretório não encontrado`);
    }
    if (!this.hasPermission(parent, 'w')) {
      throw new Error(`rm: não foi possível remover '${path}': Permissão negada`);
    }
    const targetNode = parent.children[name];
    const collectInodes = (n, acc) => {
      if (!n) return;
      if (n.type === 'file' && n.inode && n.links > 1) acc.push(n.inode);
      if (n.type === 'directory' && n.children) {
        for (const child of Object.values(n.children)) collectInodes(child, acc);
      }
    };
    const affectedInodes = [];
    collectInodes(targetNode, affectedInodes);

    if (targetNode.type === 'directory' && parent.links > 2) {
      parent.links--;
    }
    delete parent.children[name];
    for (const inode of affectedInodes) {
      this.syncInodeNodes(inode, (n) => {
        if (n.links > 1) n.links--;
      });
    }
    parent.mtime = Date.now();
    return true;
  }

  readFile(path) {
    const target = this.resolvePath(path);
    const node = this.getNode(target);
    if (!node) {
      throw new Error(`${path}: Arquivo ou diretório não encontrado`);
    }
    if (node.type === 'directory') {
      throw new Error(`${path}: É um diretório`);
    }
    if (!this.hasPermission(node, 'r')) {
      throw new Error(`${path}: Permissão negada`);
    }
    node.atime = Date.now();
    if (node.isDeviceNull) return '';
    return node.content || '';
  }

  writeFile(path, content, append = false) {
    const target = this.resolvePath(path);
    const node = this.getNode(target);
    if (!node) {
      return this.createFile(path, content);
    }
    if (node.type === 'directory') {
      throw new Error(`${path}: É um diretório`);
    }
    if (!this.hasPermission(node, 'w')) {
      throw new Error(`${path}: Permissão negada`);
    }
    if (node.isDeviceNull) {
      node.mtime = Date.now();
      return target;
    }
    const now = Date.now();
    if (append) {
      node.content = (node.content || '') + content;
    } else {
      node.content = content;
    }
    node.size = node.content.length;
    node.mtime = now;
    if (node.links > 1 && node.inode) {
      this.syncInodeNodes(node.inode, (linked) => {
        linked.content = node.content;
        linked.size = node.size;
        linked.mtime = now;
      });
    }
    return target;
  }

  copyFile(srcPath, destPath) {
    const src = this.resolvePath(srcPath);
    const srcNode = this.getNode(src);
    if (!srcNode) {
      throw new Error(`cp: não foi possível obter estado de '${srcPath}': Arquivo ou diretório não encontrado`);
    }
    if (!this.hasPermission(srcNode, 'r')) {
      throw new Error(`cp: não foi possível abrir '${srcPath}' para leitura: Permissão negada`);
    }
    let dest = this.resolvePath(destPath);
    const destNode = this.getNode(dest);
    if (destNode && destNode.type === 'directory') {
      dest = (dest === '/' ? '' : dest) + '/' + this.getFileName(src);
    }

    if (src === dest) {
      throw new Error(`cp: '${srcPath}' e '${destPath}' são o mesmo arquivo`);
    }
    if (srcNode.type === 'directory' && dest.startsWith(src + '/')) {
      throw new Error(`cp: não é possível copiar um diretório, '${srcPath}', para dentro de si mesmo, '${dest}'`);
    }

    if (srcNode.type === 'file') {
      this.writeFile(dest, srcNode.content || '');
      const copied = this.getNode(dest);
      if (copied) {
        copied.permissions = srcNode.permissions || 'rw-r--r--';
      }
    } else if (srcNode.type === 'directory') {
      this.createDirectory(dest, true, srcNode.permissions || 'rwxr-xr-x');
      for (const k of Object.keys(srcNode.children || {})) {
        this.copyFile(src + '/' + k, dest + '/' + k);
      }
    }
    return dest;
  }

  moveFile(srcPath, destPath) {
    const src = this.resolvePath(srcPath);
    if (src === '/' || src === '/home/user') {
      throw new Error(`mv: operação recusada ao mover '${srcPath}'`);
    }
    const srcParentPath = this.getParentPath(src);
    const srcParent = this.getNode(srcParentPath);
    const srcName = this.getFileName(src);
    const srcRaw = srcParent && srcParent.children ? srcParent.children[srcName] : null;
    if (!srcRaw) {
      throw new Error(`mv: não foi possível obter estado de '${srcPath}': Arquivo ou diretório não encontrado`);
    }
    if (!this.hasPermission(srcParent, 'w')) {
      throw new Error(`mv: não foi possível mover '${srcPath}': Permissão negada`);
    }

    let dest = this.resolvePath(destPath);
    const destTarget = this.getNode(dest);
    if (destTarget && destTarget.type === 'directory') {
      dest = (dest === '/' ? '' : dest) + '/' + srcName;
    }
    if (src === dest) {
      throw new Error(`mv: '${srcPath}' e '${destPath}' são o mesmo arquivo`);
    }
    if (srcRaw.type === 'directory' && dest.startsWith(src + '/')) {
      throw new Error(`mv: não é possível mover '${srcPath}' para um subdiretório de si mesmo, '${dest}'`);
    }

    const destParentPath = this.getParentPath(dest);
    const destParent = this.getNode(destParentPath);
    const destName = this.getFileName(dest);
    if (!destParent || destParent.type !== 'directory') {
      throw new Error(`mv: não foi possível mover '${srcPath}' para '${destPath}': Arquivo ou diretório não encontrado`);
    }
    if (!this.hasPermission(destParent, 'w')) {
      throw new Error(`mv: não foi possível mover '${srcPath}' para '${destPath}': Permissão negada`);
    }

    const existingDest = destParent.children ? destParent.children[destName] : null;
    if (existingDest) {
      if (existingDest.type === 'directory') {
        if (srcRaw.type !== 'directory') {
          throw new Error(`mv: não é possível sobrescrever o diretório '${dest}' com um não-diretório`);
        }
        if (Object.keys(existingDest.children || {}).length > 0) {
          throw new Error(`mv: não foi possível mover '${srcPath}' para '${dest}': Diretório não vazio`);
        }
        if (destParent.links > 2) destParent.links--;
      } else if (existingDest.type === 'file' && existingDest.inode && existingDest.inode !== srcRaw.inode) {
        this.syncInodeNodes(existingDest.inode, (n) => {
          if (n.links > 1) n.links--;
        });
      }
    }

    const now = Date.now();
    delete srcParent.children[srcName];
    if (srcRaw.type === 'directory') {
      if (srcParent.links > 2) srcParent.links--;
      destParent.links = (destParent.links || 2) + 1;
    }
    srcRaw.name = destName;
    srcRaw.ctime = now;
    if (srcRaw.type === 'symlink' && srcRaw.rawTarget) {
      srcRaw.target = this.resolveRelativeFrom(destParentPath, srcRaw.rawTarget);
    }
    if (!destParent.children) destParent.children = {};
    destParent.children[destName] = srcRaw;
    srcParent.mtime = now;
    destParent.mtime = now;
    return dest;
  }

  createSymlink(target, linkPath) {
    const link = this.resolvePath(linkPath);
    const parentPath = this.getParentPath(link);
    const parent = this.getNode(parentPath);
    const name = this.getFileName(link);
    if (!parent || parent.type !== 'directory') throw new Error(`ln: destino inválido '${linkPath}'`);
    if (!this.hasPermission(parent, 'w')) {
      throw new Error(`ln: não foi possível criar link simbólico '${linkPath}': Permissão negada`);
    }
    const now = Date.now();
    parent.children[name] = {
      name,
      type: 'symlink',
      inode: this.nextInode++,
      rawTarget: target,
      target: this.resolveRelativeFrom(parentPath, target),
      owner: this.sudoMode ? 'root' : 'user',
      group: this.sudoMode ? 'root' : 'user',
      permissions: 'rwxrwxrwx',
      links: 1,
      size: target.length,
      atime: now,
      mtime: now,
      ctime: now
    };
    return link;
  }

  createHardlink(target, linkPath) {
    const src = this.resolvePath(target);
    const srcNode = this.getNode(src);
    if (!srcNode || srcNode.type !== 'file') {
      throw new Error(`ln: não foi possível criar link físico '${linkPath}': Arquivo de origem inválido`);
    }
    const link = this.resolvePath(linkPath);
    const parent = this.getParentDirectory(link);
    const name = this.getFileName(link);
    if (!parent) throw new Error(`ln: destino inválido '${linkPath}'`);
    if (!this.hasPermission(parent, 'w')) {
      throw new Error(`ln: não foi possível criar link físico '${linkPath}': Permissão negada`);
    }
    srcNode.links = (srcNode.links || 1) + 1;
    parent.children[name] = {
      ...srcNode,
      name,
      hardlinkOf: src,
      links: srcNode.links
    };
    this.syncInodeNodes(srcNode.inode, (linked) => {
      linked.links = srcNode.links;
    });
    return link;
  }

  /**
   * Converte string de permissão ('rwxr-xr-x') em número octal ('0755')
   */
  permissionsToOctal(permStr) {
    const p = (permStr || 'rw-r--r--').padEnd(9, '-');
    const calcTriad = (triad) => {
      let val = 0;
      if (triad[0] === 'r') val += 4;
      if (triad[1] === 'w') val += 2;
      if (triad[2] === 'x' || triad[2] === 's' || triad[2] === 't') val += 1;
      return val;
    };
    return `0${calcTriad(p.slice(0, 3))}${calcTriad(p.slice(3, 6))}${calcTriad(p.slice(6, 9))}`;
  }

  /**
   * Calcula nova string de permissão de 9 caracteres ('rwxr-xr-x') a partir de modo octal ou simbólico
   */
  computePermissions(currentPerm, modeSpec) {
    let chars = (currentPerm || 'rw-r--r--').padEnd(9, '-').split('');

    // Modo Octal (ex: 755, 644, 0777, 600, 400, 000)
    if (/^[0-7]{3,4}$/.test(modeSpec)) {
      const octal = modeSpec.length === 4 ? modeSpec.slice(1) : modeSpec;
      const toTriad = (digit) => {
        const n = parseInt(digit, 10);
        return [n & 4 ? 'r' : '-', n & 2 ? 'w' : '-', n & 1 ? 'x' : '-'];
      };
      return [...toTriad(octal[0]), ...toTriad(octal[1]), ...toTriad(octal[2])].join('');
    }

    // Modo Simbólico (ex: +x, u+x, g-w, o=r, a+rx, u=rwx,go=rx)
    const clauses = modeSpec.split(',');
    for (const clause of clauses) {
      const m = clause.match(/^([ugoa]*)([+-=])([rwxXst]*)$/);
      if (!m) continue;
      const who = m[1] || 'a';
      const op = m[2];
      const perms = m[3];

      const targets = [];
      if (who.includes('u') || who.includes('a')) targets.push(0);
      if (who.includes('g') || who.includes('a')) targets.push(3);
      if (who.includes('o') || who.includes('a')) targets.push(6);

      for (const offset of targets) {
        if (op === '=') {
          chars[offset] = '-';
          chars[offset + 1] = '-';
          chars[offset + 2] = '-';
        }
        const addOrSet = op === '+' || op === '=';
        if (perms.includes('r')) chars[offset] = addOrSet ? 'r' : '-';
        if (perms.includes('w')) chars[offset + 1] = addOrSet ? 'w' : '-';
        if (perms.includes('x') || perms.includes('X')) chars[offset + 2] = addOrSet ? 'x' : '-';
      }
    }

    return chars.join('');
  }

  /**
   * Calcula tamanho total recursivo de um nó em bytes (para du)
   */
  calculateDiskUsage(node) {
    if (!node) return 0;
    if (node.type !== 'directory') {
      return Math.max(4096, node.size || 0);
    }
    let total = 4096;
    for (const child of Object.values(node.children || {})) {
      total += this.calculateDiskUsage(child);
    }
    return total;
  }

  getCompletions(partial) {
    if (!partial) partial = '';
    let dirPath = this.currentPath;
    let prefix = partial;

    if (partial.includes('/')) {
      const lastSlash = partial.lastIndexOf('/');
      const dirPart = partial.slice(0, lastSlash);
      prefix = partial.slice(lastSlash + 1);
      dirPath = this.resolvePath(dirPart || '/');
    }

    const dirNode = this.getNode(dirPath);
    if (!dirNode || dirNode.type !== 'directory') return [];

    const candidates = [];
    for (const name of Object.keys(dirNode.children || {})) {
      if (name.startsWith(prefix)) {
        const item = dirNode.children[name];
        candidates.push(item.type === 'directory' ? name + '/' : name);
      }
    }
    return candidates.sort();
  }

  /**
   * Converte um segmento de glob (*, ?, [...]) em RegExp
   */
  globSegmentToRegex(segment) {
    let regStr = '^';
    for (let i = 0; i < segment.length; i++) {
      const ch = segment[i];
      if (ch === '*') {
        regStr += '.*';
      } else if (ch === '?') {
        regStr += '.';
      } else if (ch === '[' && segment.indexOf(']', i + 1) !== -1) {
        const closeIdx = segment.indexOf(']', i + 1);
        regStr += segment.slice(i, closeIdx + 1);
        i = closeIdx;
      } else {
        regStr += ch.replace(/[.+^${}()|[\]\\]/g, '\\$&');
      }
    }
    regStr += '$';
    return new RegExp(regStr);
  }

  /**
   * Expande padrões curinga (globs) como *.txt, documents/*.txt, /etc/p*, doc?/notes.*
   */
  expandGlob(pattern) {
    if (!pattern) return [];
    let workingPattern = this.expandTilde(pattern);
    const isAbsolute = workingPattern.startsWith('/');
    const hasTrailingSlash = workingPattern.length > 1 && workingPattern.endsWith('/');

    const rawSegments = workingPattern.split('/').filter(Boolean);
    if (rawSegments.length === 0) return isAbsolute ? ['/'] : [];

    const results = [];

    const walk = (currAbsDir, currDisplayPrefix, segIndex) => {
      if (segIndex >= rawSegments.length) {
        let out = currDisplayPrefix || (isAbsolute ? '/' : '.');
        if (hasTrailingSlash && !out.endsWith('/')) out += '/';
        results.push(out);
        return;
      }

      const seg = rawSegments[segIndex];
      const isLast = segIndex === rawSegments.length - 1;
      const dirNode = this.getNode(currAbsDir);
      if (!dirNode || dirNode.type !== 'directory') return;

      if (seg === '.' || seg === '..') {
        const nextAbs = this.normalizePath(currAbsDir + '/' + seg);
        const nextDisp = currDisplayPrefix ? `${currDisplayPrefix}/${seg}` : (isAbsolute ? `/${seg}` : seg);
        walk(nextAbs, nextDisp, segIndex + 1);
        return;
      }

      const hasWildcard = /[*?\[]/.test(seg);
      if (!hasWildcard) {
        const child = dirNode.children && dirNode.children[seg];
        if (!child) return;
        if ((!isLast || hasTrailingSlash) && child.type !== 'directory' && child.type !== 'symlink') return;
        const nextAbs = (currAbsDir === '/' ? '' : currAbsDir) + '/' + seg;
        const nextDisp = currDisplayPrefix ? `${currDisplayPrefix}/${seg}` : (isAbsolute ? `/${seg}` : seg);
        walk(nextAbs, nextDisp, segIndex + 1);
        return;
      }

      const regex = this.globSegmentToRegex(seg);
      const matchDotFiles = seg.startsWith('.');
      const childNames = Object.keys(dirNode.children || {}).sort();

      for (const name of childNames) {
        if (name.startsWith('.') && !matchDotFiles) continue;
        if (regex.test(name)) {
          const child = dirNode.children[name];
          if ((!isLast || hasTrailingSlash) && child.type !== 'directory' && child.type !== 'symlink') continue;
          const nextAbs = (currAbsDir === '/' ? '' : currAbsDir) + '/' + name;
          const nextDisp = currDisplayPrefix ? `${currDisplayPrefix}/${name}` : (isAbsolute ? `/${name}` : name);
          walk(nextAbs, nextDisp, segIndex + 1);
        }
      }
    };

    const startAbs = isAbsolute ? '/' : this.currentPath;
    walk(startAbs, '', 0);
    return results.sort();
  }
}

if (typeof window !== 'undefined') {
  window.VirtualFS = VirtualFS;
}
