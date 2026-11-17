# 🐧 Penguin Gym Linux - Terminal Interativo & Ambiente Gráfico

Simulador interativo de terminal Linux, Git, Docker, Redes, Automação e SQLite totalmente em português (**pt-BR**), com **284 exercícios práticos** distribuídos em **13 trilhas** e painel gráfico sincronizado em tempo real.

---

## 🚀 Como Executar

O projeto é 100% web estático (HTML5, CSS3 e JavaScript puro), sem dependências ou etapa de compilação.

### Opção 1: Servidor HTTP local (Python)
Na pasta raiz do projeto:
```bash
python3 -m http.server 3000
```
Acesse no navegador: `http://localhost:3000`

### Opção 2: Abertura Direta
Abra o arquivo [index.html](index.html) diretamente no navegador (ou utilize [Iniciar_Penguin_Gym.bat](Iniciar_Penguin_Gym.bat) no Windows).

---

## 📚 Trilhas e Exercícios (284 Lições)

1. **🌱 Iniciante (18 lições):** navegação (`pwd`, `ls`, `cd`), inspeção básica (`head`, `tail`, `wc`, `sort`), `whoami`, `which`, `env`.
2. **📁 Fundamentos (41 lições):** manipulação de arquivos/diretórios (`mkdir -p`, `cp -r`, `mv`, `rm -r`, `rmdir`), permissões (`chmod` simbólico e octal, `sudo chown`, `sudo`), filtros (`grep -i/-v`, `cut`, `tr`, `sort -n`, `sort | uniq -c`), `nano` (com gravação real), `man`, `whatis`, `apropos`.
3. **🛡️ Sysadmin (36 lições):** ciclo completo de pacotes (`apt update/upgrade/search/show/install/remove/purge/autoremove`, `dpkg -l`), serviços (`systemctl status/is-active/start/stop/restart/enable/disable`, `journalctl`), usuários e grupos (`useradd -m`, `groupadd`, `usermod -aG`, `groups`, `passwd`, `userdel -r`), `crontab -l/-e/-r`, `free`, `lscpu`, `lsblk`, `uname -a`, `uptime`, `dmesg`.
4. **⚡ Avançado (26 lições):** processos (`ps aux`, `top`, `kill`, `kill -9`, `pgrep`, `pkill`, `sleep &`, `jobs`), disco (`df -h`, `du -sh`), pipelines (`tee`, `sed` substituição/in-place/deleção, `awk` colunas/delimitador/filtro condicional, `xargs`, `jq`).
5. **🐧 LPIC-1 (28 lições):** `tar` (`-cf`, `-tf`, `-xf`, `-czf`, `-xzf -C`), `gzip`/`gunzip`/`zcat`, `zip`/`unzip`, links simbólicos e hardlinks (`ln -s`, `ln`, `readlink`), `umask`, `find` (`-name`, `-maxdepth`, `-type`, `-exec`), `stat`, `file`, `sha256sum`, `md5sum`, `base64`.
6. **🔀 Git (17 lições):** `init`, `status`, `add`, `commit`, `log`, `diff --staged`, `restore --staged`, `.gitignore`, `branch` (`-d`), `switch` (`-c`), `merge`, `stash`.
7. **🐳 Docker (15 lições):** `pull`, `images`, `build`, `run` (`-d`, `-p`, `--name`), `start`, `ps` (`-a`), `logs`, `exec`, `inspect`, `stop`, `rm`, `rmi`.
8. **📜 Scripts (23 lições):** aritmética `$((...))`, `$?`, `alias`/`unalias`, `history`/`!!`, redirecionamentos (`2>`, `&>`, `2>/dev/null`), here-string `<<<`, subshell `(...)`, pilha `pushd`/`popd`, `export`, `source ~/.bashrc`, `./script.sh`, argumentos `$1`, `$(cmd)`, `||`, `for`, `if`.
9. **🌐 Redes (27 lições):** `ip addr`, `ip route`, `ping`, `traceroute`, `curl` (`-I`, `-o`, `-X POST`, `curl | jq`), `wget`, `dig`, `nslookup`, `host`, `ss`, `netstat`, `nc`, `nmap`, `scp`, `rsync`, `/etc/hosts`, `ufw` (`status`, `enable`, `disable`, `allow`, `deny`, `delete`).
10. **🗄️ SQL (19 lições):** `.tables`, `.schema`, `CREATE TABLE`, `INSERT INTO`, `SELECT`/`WHERE`/`BETWEEN`/`ORDER BY`/`LIMIT`/`GROUP BY`/`HAVING`/`IS NULL`/`LIKE`/`AVG`, `JOIN`, `LEFT JOIN`, `UPDATE`, `DELETE`, integração SQL + shell pipe.
11. **🤖 Auto Bash (14 lições):** robôs Bash executáveis com shebang, datas dinâmicas `$(date +%Y-%m-%d)`, logs `>> ... 2>&1`, triagem automática de `downloads/` com globbing/laço `for` e `[ -f ]`, faxina com `find -delete`, espelhamento local real e dry-run com `rsync -av`/`-n`, sentinela de disco `df`/`awk`, watchdog `systemctl` e agendamento `crontab`.
12. **⚙️ Ansible (14 lições):** chaves `ssh-keygen`, inventário INI (`[webservers]`, `[databases]`), comandos ad-hoc (`-m ping`, `shell`, `setup`, `copy`, `apt`, `service`, `--become`), Playbooks YAML (`ansible-playbook`), verificação prática de idempotência (`changed=0`), `--check --diff`, `vars`, `lineinfile`, `notify`/`handlers`, `loop` e `when`.
13. **🚨 Incidentes (6 missões cross-domain):** investigação de erro 404 no Nginx (`access.log` + `ss`), recuperação do PostgreSQL parado, prevenção de vazamento de `.env` no Git, resolução de conflito de imagem/contêiner no Docker, pipeline completo de backup (`sqlite3 -csv` + `gzip -k` + `sha256sum`) e correção de permissão `+x` em script de deploy.
