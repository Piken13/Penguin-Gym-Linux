/**
 * Penguin Gym Linux - Virtual Git Simulator
 */

class GitEngine {
  constructor(fs) {
    this.fs = fs;
    this.reset();
  }

  reset() {
    this.initialized = false;
    this.currentBranch = 'main';
    this.branches = ['main'];
    this.index = new Set(); // staged files
    this.trackedFiles = new Set(); // committed files
    this.commits = [];
    this.stashes = [];
  }

  execute(args) {
    if (!args || args.length === 0) {
      return { output: 'Uso: git <subcomando> [opções]\nSubcomandos comuns: init, status, add, commit, branch, switch, checkout, diff, restore, merge, stash, log', type: 'error' };
    }

    const sub = args[0];
    const rest = args.slice(1);

    if (sub === 'init') {
      this.initialized = true;
      try {
        this.fs.createDirectory('.git', true);
      } catch {}
      return { output: 'Repositório Git vazio inicializado em ' + this.fs.currentPath + '/.git/' };
    }

    if (!this.initialized) {
      return { output: 'fatal: não é um repositório git (ou qualquer um dos diretórios pais): .git', type: 'error' };
    }

    switch (sub) {
      case 'status': {
        const lines = [`Na ramificação ${this.currentBranch}`];
        if (this.commits.length === 0) {
          lines.push('Nenhum commit ainda');
        }

        const staged = Array.from(this.index);
        if (staged.length > 0) {
          lines.push('\nMudanças para serem submetidas (commit):');
          lines.push('  (use "git restore --staged <arquivo>..." para desmarcar)');
          staged.forEach(f => lines.push(`\t\x1b[32mnovo arquivo:   ${f}\x1b[0m`));
        }

        try {
          const files = this.fs.listFiles();
          const untracked = files.filter(f => f !== '.git' && !f.startsWith('.') && !this.index.has(f) && !this.trackedFiles.has(f));
          if (untracked.length > 0) {
            lines.push('\nArquivos não rastreados:');
            lines.push('  (use "git add <arquivo>..." para incluir no que será submetido)');
            untracked.forEach(f => lines.push(`\t\x1b[31m${f}\x1b[0m`));
          }
        } catch {}

        if (staged.length === 0 && lines.length <= 2) {
          lines.push('Nada a submeter, árvore de trabalho limpa');
        }

        return { output: lines.join('\n') };
      }

      case 'add': {
        if (rest.length === 0) {
          return { output: 'Nada especificado, nada adicionado.', type: 'error' };
        }
        for (const item of rest) {
          if (item === '.' || item === '-A' || item === '--all') {
            const files = this.fs.listFiles();
            files.filter(f => f !== '.git' && !f.startsWith('.')).forEach(f => {
              if (!this.trackedFiles.has(f)) this.index.add(f);
            });
            // Ensure at least index has staged items if all files were already tracked
            if (this.index.size === 0) {
              this.index.add('index.html');
              this.index.add('style.css');
            }
          } else {
            this.index.add(item);
          }
        }
        return { output: '' };
      }

      case 'commit': {
        let msg = 'Commit sem mensagem';
        const mIdx = rest.indexOf('-m');
        if (mIdx !== -1 && rest[mIdx + 1]) {
          msg = rest.slice(mIdx + 1).join(' ').replace(/^["']|["']$/g, '');
        }
        if (this.index.size === 0) {
          return { output: 'Nada a submeter (use "git add" para preparar os arquivos)', type: 'error' };
        }
        const hash = Math.random().toString(16).substring(2, 9);
        const committedFiles = Array.from(this.index);
        committedFiles.forEach(f => this.trackedFiles.add(f));
        const commit = {
          hash,
          message: msg,
          branch: this.currentBranch,
          files: committedFiles,
          date: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
        this.commits.unshift(commit);
        const count = this.index.size;
        this.index.clear();
        return { output: `[${this.currentBranch} ${hash}] ${msg}\n ${count} arquivo(s) alterado(s)` };
      }

      case 'log': {
        if (this.commits.length === 0) {
          return { output: 'fatal: sua ramificação atual não possui nenhum commit ainda', type: 'error' };
        }
        if (rest.includes('--oneline')) {
          const out = this.commits.map(c => `\x1b[33m${c.hash}\x1b[0m (${c.branch}) ${c.message}`).join('\n');
          return { output: out };
        }
        const out = this.commits.map(c => `\x1b[33mcommit ${c.hash}7c819a\x1b[0m (HEAD -> ${c.branch})
Autor: Aluno Penguin <aluno@penguin-gym.org>
Data:   ${c.date}

    ${c.message}`).join('\n\n');
        return { output: out };
      }

      case 'branch': {
        const isDelete = rest.includes('-d') || rest.includes('-D');
        if (isDelete) {
          const target = rest.find(r => r !== '-d' && r !== '-D');
          if (!target) return { output: 'fatal: nome da ramificação necessário', type: 'error' };
          if (!this.branches.includes(target)) {
            return { output: `error: ramificação '${target}' não encontrada.`, type: 'error' };
          }
          if (target === this.currentBranch) {
            return { output: `error: Não é possível excluir a ramificação '${target}' em que você está atualmente.`, type: 'error' };
          }
          this.branches = this.branches.filter(b => b !== target);
          return { output: `Excluída a ramificação ${target} (era a1b2c3d).` };
        }
        if (rest.length === 0) {
          const list = this.branches.map(b => (b === this.currentBranch ? `* \x1b[32m${b}\x1b[0m` : `  ${b}`));
          return { output: list.join('\n') };
        }
        const newBranch = rest.find(r => !r.startsWith('-'));
        if (newBranch && !this.branches.includes(newBranch)) {
          this.branches.push(newBranch);
        }
        return { output: '' };
      }

      case 'merge': {
        const sourceBranch = rest.find(r => !r.startsWith('-'));
        if (!sourceBranch) {
          return { output: 'fatal: informe a ramificação a ser mesclada (ex: git merge feature)', type: 'error' };
        }
        if (!this.branches.includes(sourceBranch)) {
          return { output: `merge: ${sourceBranch} - algo que não podemos mesclar`, type: 'error' };
        }
        if (sourceBranch === this.currentBranch) {
          return { output: 'Já está atualizado.' };
        }
        const hash = Math.random().toString(16).substring(2, 9);
        this.commits.unshift({
          hash,
          message: `Merge branch '${sourceBranch}' into ${this.currentBranch}`,
          branch: this.currentBranch,
          files: [],
          date: new Date().toISOString().slice(0, 19).replace('T', ' ')
        });
        return { output: `Atualizando a1b2c3d..${hash}\nFast-forward\n Mesclagem da ramificação '${sourceBranch}' concluída em '${this.currentBranch}'.` };
      }

      case 'stash': {
        const subCmd = rest[0] || 'push';
        if (subCmd === 'list') {
          if (this.stashes.length === 0) return { output: '' };
          return {
            output: this.stashes.map((s, idx) => `stash@{${idx}}: WIP on ${s.branch}: ${s.label}`).join('\n')
          };
        }
        if (subCmd === 'pop' || subCmd === 'apply') {
          if (this.stashes.length === 0) {
            return { output: 'No stash entries found.', type: 'error' };
          }
          const entry = subCmd === 'pop' ? this.stashes.shift() : this.stashes[0];
          entry.files.forEach(f => this.index.add(f));
          return {
            output: `Na ramificação ${this.currentBranch}\nAlterações restauradas do stash (${entry.files.join(', ') || 'trabalho local'}).${subCmd === 'pop' ? `\nDescartado stash@{0}` : ''}`
          };
        }
        if (subCmd === 'drop' || subCmd === 'clear') {
          this.stashes = subCmd === 'clear' ? [] : this.stashes.slice(1);
          return { output: 'Stash descartado.' };
        }
        const filesToSave = this.index.size > 0 ? Array.from(this.index) : ['index.html'];
        this.stashes.unshift({
          branch: this.currentBranch,
          files: filesToSave,
          label: `alterações temporárias (${filesToSave.join(', ')})`
        });
        this.index.clear();
        return { output: `Diretório de trabalho e estado do índice salvos em WIP on ${this.currentBranch}` };
      }

      case 'diff': {
        const isStaged = rest.includes('--staged') || rest.includes('--cached');
        const targetFiles = isStaged ? Array.from(this.index) : (this.index.size > 0 ? Array.from(this.index) : ['index.html']);
        if (targetFiles.length === 0) return { output: '' };
        const diffs = targetFiles.map(f => {
          return `diff --git a/${f} b/${f}\nindex a1b2c3d..e4f5g6h 100644\n--- a/${f}\n+++ b/${f}\n@@ -1,3 +1,4 @@\n\x1b[31m-/* Versao antiga de ${f} */\x1b[0m\n\x1b[32m+/* Versao modificada de ${f} */\x1b[0m`;
        });
        return { output: diffs.join('\n\n') };
      }

      case 'restore': {
        if (rest.includes('--staged')) {
          const files = rest.filter(r => r !== '--staged');
          if (files.length === 0) this.index.clear();
          else files.forEach(f => this.index.delete(f));
          return { output: '' };
        }
        return { output: '' };
      }

      case 'reset': {
        if (rest[0] === 'HEAD' || rest.length === 0) {
          const files = rest.slice(1);
          if (files.length === 0) this.index.clear();
          else files.forEach(f => this.index.delete(f));
          return { output: 'Mudanças desmarcadas da área de stage' };
        }
        return { output: '' };
      }

      case 'checkout':
      case 'switch': {
        const isCreate = rest.includes('-b') || rest.includes('-c');
        const branchName = rest.find(r => !r.startsWith('-'));
        if (!branchName) {
          return { output: 'Nome da ramificação ausente', type: 'error' };
        }
        if (isCreate) {
          if (!this.branches.includes(branchName)) this.branches.push(branchName);
          this.currentBranch = branchName;
          return { output: `Mudou para uma nova ramificação '${branchName}'` };
        }
        if (!this.branches.includes(branchName)) {
          this.branches.push(branchName);
        }
        this.currentBranch = branchName;
        return { output: `Mudou para a ramificação '${branchName}'` };
      }

      default:
        return { output: `git: '${sub}' não é um comando git. Veja 'git --help'.`, type: 'error' };
    }
  }
}

if (typeof window !== 'undefined') {
  window.GitEngine = GitEngine;
}
