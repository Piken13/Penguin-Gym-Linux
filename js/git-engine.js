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
    this.repoRoot = null;
    this.currentBranch = 'main';
    this.branches = ['main'];
    this.index = new Set(); // staged files
    this.trackedFiles = new Set(); // committed files
    this.committedContents = new Map();
    this.stagedContents = new Map();
    this.commits = [];
    this.stashes = [];
  }

  getRepoRoot() {
    if (!this.initialized) return null;
    return this.repoRoot || '/home/user';
  }

  isInsideRepo() {
    const root = this.getRepoRoot();
    if (!root) return false;
    return this.fs.currentPath === root || this.fs.currentPath.startsWith(root + '/');
  }

  getIgnoredPatterns() {
    const root = this.getRepoRoot();
    if (!root) return [];
    const node = this.fs.getNode(`${root}/.gitignore`);
    if (!node || node.type !== 'file' || !node.content) return [];
    return node.content
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#'));
  }

  isIgnored(name) {
    if (name === '.git') return true;
    const patterns = this.getIgnoredPatterns();
    for (const pat of patterns) {
      const cleanPat = pat.replace(/\/$/, '');
      if (cleanPat === name) return true;
      if (pat.includes('*') || pat.includes('?')) {
        const reg = new RegExp('^' + cleanPat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
        if (reg.test(name)) return true;
      }
    }
    return false;
  }

  getRepoFiles() {
    const root = this.getRepoRoot();
    const rootNode = this.fs.getNode(root);
    if (!rootNode || rootNode.type !== 'directory') return [];
    return Object.keys(rootNode.children || {}).filter(f => f !== '.git');
  }

  readRepoFileContent(name) {
    const root = this.getRepoRoot();
    const node = this.fs.getNode(`${root}/${name}`);
    if (!node) return null;
    if (node.type === 'directory') return '[dir]';
    return node.content || '';
  }

  execute(args) {
    if (!args || args.length === 0) {
      return {
        output: 'Uso: git <subcomando> [opções]\nSubcomandos comuns: init, status, add, commit, branch, switch, checkout, diff, restore, reset, merge, stash, log',
        type: 'error',
        code: 1
      };
    }

    const sub = args[0];
    const rest = args.slice(1);

    if (sub === 'init') {
      this.initialized = true;
      this.repoRoot = this.fs.currentPath;
      try {
        this.fs.createDirectory('.git', true, 'rwxr-xr-x', 'user');
      } catch {}
      return { output: 'Repositório Git vazio inicializado em ' + this.fs.currentPath + '/.git/', code: 0 };
    }

    if (!this.isInsideRepo()) {
      return { output: 'fatal: não é um repositório git (ou qualquer um dos diretórios pais): .git', type: 'error', code: 128 };
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
          staged.forEach(f => {
            const label = this.trackedFiles.has(f) ? 'modificado:     ' : 'novo arquivo:   ';
            lines.push(`\t\x1b[32m${label}${f}\x1b[0m`);
          });
        }

        const modified = [];
        for (const f of this.trackedFiles) {
          if (this.index.has(f)) continue;
          if (this.committedContents.has(f)) {
            const cur = this.readRepoFileContent(f);
            if (cur !== null && cur !== this.committedContents.get(f)) {
              modified.push(f);
            }
          }
        }
        if (modified.length > 0) {
          lines.push('\nMudanças não preparadas para commit:');
          lines.push('  (use "git add <arquivo>..." para atualizar o que será submetido)');
          lines.push('  (use "git restore <arquivo>..." para descartar mudanças no diretório de trabalho)');
          modified.forEach(f => lines.push(`\t\x1b[31mmodificado:     ${f}\x1b[0m`));
        }

        try {
          const files = this.getRepoFiles();
          const untracked = files.filter(f =>
            f !== '.git' &&
            !this.isIgnored(f) &&
            !this.index.has(f) &&
            !this.trackedFiles.has(f)
          );
          if (untracked.length > 0) {
            lines.push('\nArquivos não rastreados:');
            lines.push('  (use "git add <arquivo>..." para incluir no que será submetido)');
            untracked.forEach(f => lines.push(`\t\x1b[31m${f}\x1b[0m`));
          }
        } catch {}

        if (staged.length === 0 && modified.length === 0 && lines.length <= 2) {
          lines.push('Nada a submeter, árvore de trabalho limpa');
        }

        return { output: lines.join('\n'), code: 0 };
      }

      case 'add': {
        if (rest.length === 0) {
          return { output: 'Nada especificado, nada adicionado.', type: 'error', code: 1 };
        }
        for (const item of rest) {
          if (item === '.' || item === '-A' || item === '--all') {
            const files = this.getRepoFiles();
            files.forEach(f => {
              if (this.isIgnored(f)) return;
              const cur = this.readRepoFileContent(f);
              const isUntracked = !this.trackedFiles.has(f);
              const isModified = this.trackedFiles.has(f) && this.committedContents.has(f) && cur !== this.committedContents.get(f);
              if (isUntracked || isModified) {
                this.index.add(f);
                if (cur !== null) this.stagedContents.set(f, cur);
              }
            });
          } else {
            const cleanItem = item.replace(/^\.\//, '');
            const content = this.readRepoFileContent(cleanItem);
            if (content === null && !this.trackedFiles.has(cleanItem)) {
              return { output: `fatal: pathspec '${item}' não corresponde a nenhum arquivo`, type: 'error', code: 128 };
            }
            this.index.add(cleanItem);
            if (content !== null) this.stagedContents.set(cleanItem, content);
          }
        }
        return { output: '', code: 0 };
      }

      case 'commit': {
        let msg = '';
        const mIdx = rest.indexOf('-m');
        if (mIdx !== -1 && rest[mIdx + 1]) {
          msg = rest.slice(mIdx + 1).join(' ').replace(/^["']|["']$/g, '');
        } else {
          const attached = rest.find(r => r.startsWith('-m') && r.length > 2);
          if (attached) msg = attached.slice(2).replace(/^["']|["']$/g, '');
        }
        if (!msg) msg = 'Commit sem mensagem';
        if (this.index.size === 0) {
          return { output: 'Nada a submeter (use "git add" para preparar os arquivos)', type: 'error', code: 1 };
        }
        const hash = Math.random().toString(16).substring(2, 9);
        const committedFiles = Array.from(this.index);
        committedFiles.forEach(f => {
          this.trackedFiles.add(f);
          const content = this.stagedContents.has(f) ? this.stagedContents.get(f) : this.readRepoFileContent(f);
          if (content !== null) this.committedContents.set(f, content);
        });
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
        this.stagedContents.clear();
        return { output: `[${this.currentBranch} ${hash}] ${msg}\n ${count} arquivo(s) alterado(s)`, code: 0 };
      }

      case 'log': {
        if (this.commits.length === 0) {
          return { output: 'fatal: sua ramificação atual não possui nenhum commit ainda', type: 'error', code: 128 };
        }
        if (rest.includes('--oneline')) {
          const out = this.commits.map(c => `\x1b[33m${c.hash}\x1b[0m (${c.branch}) ${c.message}`).join('\n');
          return { output: out, code: 0 };
        }
        const out = this.commits.map(c => `\x1b[33mcommit ${c.hash}7c819a\x1b[0m (HEAD -> ${c.branch})
Autor: Aluno Penguin <aluno@penguin-gym.org>
Data:   ${c.date}

    ${c.message}`).join('\n\n');
        return { output: out, code: 0 };
      }

      case 'branch': {
        const isDelete = rest.includes('-d') || rest.includes('-D');
        if (isDelete) {
          const target = rest.find(r => r !== '-d' && r !== '-D');
          if (!target) return { output: 'fatal: nome da ramificação necessário', type: 'error', code: 128 };
          if (!this.branches.includes(target)) {
            return { output: `error: ramificação '${target}' não encontrada.`, type: 'error', code: 1 };
          }
          if (target === this.currentBranch) {
            return { output: `error: Não é possível excluir a ramificação '${target}' em que você está atualmente.`, type: 'error', code: 1 };
          }
          this.branches = this.branches.filter(b => b !== target);
          return { output: `Excluída a ramificação ${target} (era a1b2c3d).`, code: 0 };
        }
        const nonFlags = rest.filter(r => !r.startsWith('-'));
        if (nonFlags.length === 0) {
          const isVerbose = rest.includes('-v') || rest.includes('-vv');
          const list = this.branches.map(b => {
            const prefix = b === this.currentBranch ? `* \x1b[32m${b}\x1b[0m` : `  ${b}`;
            return isVerbose ? `${prefix} a1b2c3d ${this.commits[0]?.message || 'initial'}` : prefix;
          });
          return { output: list.join('\n'), code: 0 };
        }
        const newBranch = nonFlags[0];
        if (!this.branches.includes(newBranch)) {
          this.branches.push(newBranch);
        }
        return { output: '', code: 0 };
      }

      case 'merge': {
        const sourceBranch = rest.find(r => !r.startsWith('-'));
        if (!sourceBranch) {
          return { output: 'fatal: informe a ramificação a ser mesclada (ex: git merge feature)', type: 'error', code: 128 };
        }
        if (!this.branches.includes(sourceBranch)) {
          return { output: `merge: ${sourceBranch} - algo que não podemos mesclar`, type: 'error', code: 1 };
        }
        if (sourceBranch === this.currentBranch) {
          return { output: 'Já está atualizado.', code: 0 };
        }
        const hash = Math.random().toString(16).substring(2, 9);
        this.commits.unshift({
          hash,
          message: `Merge branch '${sourceBranch}' into ${this.currentBranch}`,
          branch: this.currentBranch,
          files: [],
          date: new Date().toISOString().slice(0, 19).replace('T', ' ')
        });
        return { output: `Atualizando a1b2c3d..${hash}\nFast-forward\n Mesclagem da ramificação '${sourceBranch}' concluída em '${this.currentBranch}'.`, code: 0 };
      }

      case 'stash': {
        const subCmd = rest[0] || 'push';
        if (subCmd === 'list') {
          if (this.stashes.length === 0) return { output: '', code: 0 };
          return {
            output: this.stashes.map((s, idx) => `stash@{${idx}}: WIP on ${s.branch}: ${s.label}`).join('\n'),
            code: 0
          };
        }
        if (subCmd === 'pop' || subCmd === 'apply') {
          if (this.stashes.length === 0) {
            return { output: 'No stash entries found.', type: 'error', code: 1 };
          }
          const entry = subCmd === 'pop' ? this.stashes.shift() : this.stashes[0];
          entry.files.forEach(f => this.index.add(f));
          return {
            output: `Na ramificação ${this.currentBranch}\nAlterações restauradas do stash (${entry.files.join(', ') || 'trabalho local'}).${subCmd === 'pop' ? `\nDescartado stash@{0}` : ''}`,
            code: 0
          };
        }
        if (subCmd === 'drop' || subCmd === 'clear') {
          this.stashes = subCmd === 'clear' ? [] : this.stashes.slice(1);
          return { output: 'Stash descartado.', code: 0 };
        }
        const filesToSave = this.index.size > 0 ? Array.from(this.index) : [];
        if (filesToSave.length === 0) {
          return { output: 'Não há alterações locais para salvar', code: 0 };
        }
        this.stashes.unshift({
          branch: this.currentBranch,
          files: filesToSave,
          label: `alterações temporárias (${filesToSave.join(', ')})`
        });
        this.index.clear();
        return { output: `Diretório de trabalho e estado do índice salvos em WIP on ${this.currentBranch}`, code: 0 };
      }

      case 'diff': {
        const isStaged = rest.includes('--staged') || rest.includes('--cached');
        if (isStaged) {
          const targetFiles = Array.from(this.index);
          if (targetFiles.length === 0) return { output: '', code: 0 };
          const diffs = targetFiles.map(f => {
            const oldText = this.committedContents.get(f) || '';
            const newText = this.stagedContents.get(f) || this.readRepoFileContent(f) || '';
            if (oldText && oldText !== newText) {
              return `diff --git a/${f} b/${f}\nindex a1b2c3d..e4f5g6h 100644\n--- a/${f}\n+++ b/${f}\n@@ -1 +1 @@\n\x1b[31m-${oldText.trimEnd()}\x1b[0m\n\x1b[32m+${newText.trimEnd()}\x1b[0m`;
            }
            return `diff --git a/${f} b/${f}\nindex a1b2c3d..e4f5g6h 100644\n--- a/${f}\n+++ b/${f}\n@@ -1,3 +1,4 @@\n\x1b[31m-/* Versao antiga de ${f} */\x1b[0m\n\x1b[32m+/* Versao modificada de ${f} */\x1b[0m`;
          });
          return { output: diffs.join('\n\n'), code: 0 };
        }

        const modified = [];
        for (const f of this.trackedFiles) {
          if (this.committedContents.has(f)) {
            const cur = this.readRepoFileContent(f);
            if (cur !== null && cur !== this.committedContents.get(f)) {
              modified.push({ f, oldText: this.committedContents.get(f), newText: cur });
            }
          }
        }
        if (modified.length === 0) return { output: '', code: 0 };
        const diffs = modified.map(({ f, oldText, newText }) =>
          `diff --git a/${f} b/${f}\n--- a/${f}\n+++ b/${f}\n@@ -1 +1 @@\n\x1b[31m-${oldText.trimEnd()}\x1b[0m\n\x1b[32m+${newText.trimEnd()}\x1b[0m`
        );
        return { output: diffs.join('\n\n'), code: 0 };
      }

      case 'restore': {
        if (rest.includes('--staged')) {
          const files = rest.filter(r => r !== '--staged' && r !== '--');
          if (files.length === 0 || files.includes('.')) {
            this.index.clear();
            this.stagedContents.clear();
          } else {
            files.forEach(f => {
              this.index.delete(f);
              this.stagedContents.delete(f);
            });
          }
          return { output: '', code: 0 };
        }
        const files = rest.filter(r => r !== '--');
        const root = this.getRepoRoot();
        for (const f of files) {
          if (this.committedContents.has(f)) {
            this.fs.writeFile(`${root}/${f}`, this.committedContents.get(f));
          }
        }
        return { output: '', code: 0 };
      }

      case 'reset': {
        const clean = rest.filter(r => r !== '--');
        if (clean.length === 0 || clean[0] === 'HEAD') {
          const files = clean[0] === 'HEAD' ? clean.slice(1) : [];
          if (files.length === 0) {
            this.index.clear();
            this.stagedContents.clear();
          } else {
            files.forEach(f => {
              this.index.delete(f);
              this.stagedContents.delete(f);
            });
          }
          return { output: 'Mudanças desmarcadas da área de stage', code: 0 };
        }
        let unmarkCount = 0;
        for (const f of clean) {
          if (this.index.has(f)) {
            this.index.delete(f);
            this.stagedContents.delete(f);
            unmarkCount++;
          }
        }
        return { output: unmarkCount > 0 ? 'Mudanças desmarcadas da área de stage' : '', code: 0 };
      }

      case 'checkout':
      case 'switch': {
        const isCreate = rest.includes('-b') || rest.includes('-c');
        const branchName = rest.find(r => !r.startsWith('-'));
        if (!branchName) {
          return { output: 'Nome da ramificação ausente', type: 'error', code: 128 };
        }
        if (isCreate) {
          if (!this.branches.includes(branchName)) this.branches.push(branchName);
          this.currentBranch = branchName;
          return { output: `Mudou para uma nova ramificação '${branchName}'`, code: 0 };
        }
        if (!this.branches.includes(branchName)) {
          return { output: `fatal: referência inválida: '${branchName}'`, type: 'error', code: 128 };
        }
        this.currentBranch = branchName;
        return { output: `Mudou para a ramificação '${branchName}'`, code: 0 };
      }

      default:
        return { output: `git: '${sub}' não é um comando git. Veja 'git --help'.`, type: 'error', code: 1 };
    }
  }
}

if (typeof window !== 'undefined') {
  window.GitEngine = GitEngine;
}
