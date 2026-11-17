/**
 * Penguin Gym Linux - Terminal UI Controller
 */

class TerminalUI {
  constructor(containerId, outputId, inputId, promptId, fs, commandEngine, onCommandExecuted) {
    this.container = document.getElementById(containerId);
    this.outputElement = document.getElementById(outputId);
    this.inputElement = document.getElementById(inputId);
    this.promptElement = document.getElementById(promptId);
    this.windowTitleElement = document.getElementById('terminalWindowTitle');
    this.chipsContainer = document.getElementById('terminalCompletionChips');
    this.tabBtn = document.getElementById('terminalTabBtn');
    this.enterBtn = document.getElementById('terminalEnterBtn');

    this.fs = fs;
    this.commandEngine = commandEngine;
    this.onCommandExecuted = onCommandExecuted;

    this.history = [];
    this.historyIndex = -1;
    this.tabPressCount = 0;
    this.lastTabInput = '';
    this.interactiveMode = null;
    this.isReverseSearch = false;
    this.reverseSearchQuery = '';
    this.reverseSearchMatch = '';
    this.reverseSearchIndex = -1;
    this.preSearchInput = '';
    this.onNextRequested = null;

    this.init();
  }

  init() {
    this.updatePrompt();

    const termArea = document.getElementById('terminalArea');
    if (termArea) {
      termArea.addEventListener('click', (e) => {
        if (document.getElementById('nanoEditorOverlay')) {
          if (!e.target.closest('button')) {
            document.getElementById('nanoTextarea')?.focus();
          }
          return;
        }
        if (document.getElementById('lessPagerOverlay')) {
          if (!e.target.closest('button')) {
            document.getElementById('lessPagerOverlay')?.focus();
          }
          return;
        }
        if (e.target.closest('button')) return;
        if (this.inputElement) this.inputElement.focus();
      });
    }

    if (this.inputElement) {
      this.inputElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
      this.inputElement.addEventListener('input', () => this.updateCompletionChips());
    }

    if (this.tabBtn) {
      this.tabBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.triggerTabCompletion();
        if (this.inputElement) this.inputElement.focus();
      });
    }

    if (this.enterBtn) {
      this.enterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.submitCurrentInput();
        if (this.inputElement && !document.getElementById('nanoEditorOverlay') && !document.getElementById('lessPagerOverlay')) {
          this.inputElement.focus();
        }
      });
    }
  }

  submitCurrentInput() {
    if (!this.inputElement) return;
    const val = this.inputElement.value;
    this.inputElement.value = '';
    this.historyIndex = -1;
    this.executeCommand(val);
    this.hideChips();
  }

  runCommandProgrammatically(cmdLine) {
    if (this.inputElement) {
      this.inputElement.value = '';
    }
    this.historyIndex = -1;
    this.executeCommand(cmdLine);
    this.hideChips();
    if (this.inputElement && !document.getElementById('nanoEditorOverlay') && !document.getElementById('lessPagerOverlay')) {
      this.inputElement.focus();
    }
  }

  /**
   * Fecha overlays abertos (nano/less), sai de modos interativos (sqlite>/Ctrl+R)
   * e opcionalmente restaura a sessão de usuário padrão
   */
  resetInteractiveState(resetUserSession = false) {
    if (this._nanoKeyCleanup) {
      this._nanoKeyCleanup();
      this._nanoKeyCleanup = null;
    }
    if (typeof document !== 'undefined') {
      const nanoOverlay = document.getElementById('nanoEditorOverlay');
      if (nanoOverlay) nanoOverlay.remove();
      const lessOverlay = document.getElementById('lessPagerOverlay');
      if (lessOverlay) lessOverlay.remove();
    }
    this.interactiveMode = null;
    this.isReverseSearch = false;
    this.reverseSearchQuery = '';
    this.reverseSearchMatch = '';
    this.reverseSearchIndex = -1;
    if (resetUserSession && this.commandEngine && typeof this.commandEngine.resetSessionToDefaultUser === 'function') {
      this.commandEngine.resetSessionToDefaultUser();
    }
    this.hideChips();
    this.updatePrompt();
  }

  updatePrompt() {
    if (this.isReverseSearch) {
      if (this.promptElement) {
        this.promptElement.textContent = `(reverse-i-search)\`${this.reverseSearchQuery}': `;
      }
      return;
    }

    if (this.interactiveMode && this.interactiveMode.type === 'sqlite') {
      if (this.promptElement) {
        this.promptElement.textContent = 'sqlite> ';
      }
      if (this.windowTitleElement) {
        this.windowTitleElement.textContent = `sqlite3 (${this.interactiveMode.dbName})`;
      }
      return;
    }

    let promptStr = '';
    if (this.commandEngine && typeof this.commandEngine.formatPrompt === 'function') {
      promptStr = this.commandEngine.formatPrompt();
    } else {
      const path = this.fs.currentPath;
      let displayPath = path;
      if (path === '/home/user') {
        displayPath = '~';
      } else if (path.startsWith('/home/user/')) {
        displayPath = '~' + path.slice('/home/user'.length);
      }
      promptStr = `user@gym:${displayPath}$ `;
    }

    if (this.promptElement) {
      this.promptElement.textContent = promptStr;
    }
    if (this.windowTitleElement) {
      const u = (this.commandEngine && this.commandEngine.envVars && this.commandEngine.envVars.USER) || 'user';
      const h = (this.commandEngine && this.commandEngine.envVars && this.commandEngine.envVars.HOSTNAME) || 'gym';
      this.windowTitleElement.textContent = `${u}@${h}:${this.fs.currentPath}`;
    }
  }

  handleKeyDown(e) {
    // Tratamento exclusivo para o modo de busca reversa no histórico (Ctrl + R)
    if (this.isReverseSearch) {
      if (e.ctrlKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        // Cicla para o resultado anterior mais antigo
        const hist = this.history;
        const start = this.reverseSearchIndex > 0 ? this.reverseSearchIndex - 1 : hist.length - 1;
        let foundIdx = -1;
        for (let i = start; i >= 0; i--) {
          if (hist[i].includes(this.reverseSearchQuery)) {
            foundIdx = i;
            break;
          }
        }
        if (foundIdx !== -1) {
          this.reverseSearchIndex = foundIdx;
          this.reverseSearchMatch = hist[foundIdx];
          this.inputElement.value = this.reverseSearchMatch;
        }
        this.updatePrompt();
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        this.reverseSearchQuery = this.reverseSearchQuery.slice(0, -1);
        let found = '';
        let foundIdx = -1;
        if (this.reverseSearchQuery) {
          for (let i = this.history.length - 1; i >= 0; i--) {
            if (this.history[i].includes(this.reverseSearchQuery)) {
              found = this.history[i];
              foundIdx = i;
              break;
            }
          }
        }
        this.reverseSearchMatch = found;
        this.reverseSearchIndex = foundIdx;
        this.inputElement.value = found;
        this.updatePrompt();
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const toExec = this.reverseSearchMatch || this.reverseSearchQuery;
        this.isReverseSearch = false;
        this.updatePrompt();
        this.inputElement.value = '';
        this.executeCommand(toExec);
        return;
      }

      if (e.key === 'Escape' || (e.ctrlKey && (e.key.toLowerCase() === 'c' || e.key.toLowerCase() === 'g'))) {
        e.preventDefault();
        this.isReverseSearch = false;
        this.inputElement.value = this.preSearchInput;
        this.updatePrompt();
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Tab') {
        e.preventDefault();
        this.isReverseSearch = false;
        this.inputElement.value = this.reverseSearchMatch || this.preSearchInput;
        this.updatePrompt();
        return;
      }

      if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1) {
        e.preventDefault();
        this.reverseSearchQuery += e.key;
        let found = '';
        let foundIdx = -1;
        for (let i = this.history.length - 1; i >= 0; i--) {
          if (this.history[i].includes(this.reverseSearchQuery)) {
            found = this.history[i];
            foundIdx = i;
            break;
          }
        }
        this.reverseSearchMatch = found;
        this.reverseSearchIndex = foundIdx;
        this.inputElement.value = found;
        this.updatePrompt();
        return;
      }

      return;
    }

    if (e.key !== 'Tab') {
      this.tabPressCount = 0;
    }

    // Atalhos com Ctrl estilo GNU Readline / Bash
    if (e.ctrlKey && !e.altKey && !e.metaKey) {
      const key = e.key.toLowerCase();

      // Ctrl + R: Inicia busca reversa no histórico
      if (key === 'r') {
        e.preventDefault();
        this.isReverseSearch = true;
        this.reverseSearchQuery = '';
        this.preSearchInput = this.inputElement ? this.inputElement.value : '';
        this.reverseSearchMatch = '';
        this.reverseSearchIndex = -1;
        if (this.inputElement) this.inputElement.value = '';
        this.hideChips();
        this.updatePrompt();
        return;
      }

      // Ctrl + D: Sai do modo interativo sqlite> se a linha estiver vazia
      if (key === 'd') {
        const currentVal = this.inputElement ? this.inputElement.value : '';
        if (!currentVal && this.interactiveMode) {
          e.preventDefault();
          this.writeLine(`<span class="output-prompt">${this.escapeHtml(this.promptElement.textContent)}</span><span class="output-cmd">^D</span>`);
          this.interactiveMode = null;
          this.updatePrompt();
          this.scrollToBottom();
          return;
        }
      }

      // Ctrl + C: Cancela a linha atual imprimindo ^C e pulando para nova linha
      if (key === 'c') {
        const hasSelection =
          this.inputElement &&
          this.inputElement.selectionStart !== this.inputElement.selectionEnd;
        const windowSelection = window.getSelection && window.getSelection().toString();
        if (!hasSelection && !windowSelection) {
          e.preventDefault();
          const currentVal = this.inputElement ? this.inputElement.value : '';
          const promptText = this.promptElement ? this.promptElement.textContent : 'penguin@gym:~$ ';
          this.writeLine(
            `<span class="output-prompt">${this.escapeHtml(promptText)}</span><span class="output-cmd">${this.escapeHtml(currentVal)}^C</span>`
          );
          if (this.inputElement) this.inputElement.value = '';
          this.historyIndex = -1;
          this.tabPressCount = 0;
          this.hideChips();
          if (this.interactiveMode) {
            this.interactiveMode = null;
            this.updatePrompt();
          }
          if (this.commandEngine) this.commandEngine.lastExitCode = 130;
          this.scrollToBottom();
          return;
        }
      }

      // Ctrl + L: Limpa a tela mantendo o que está sendo digitado
      if (key === 'l') {
        e.preventDefault();
        this.clear();
        return;
      }

      // Ctrl + U: Apaga do cursor até o início da linha
      if (key === 'u') {
        e.preventDefault();
        if (this.inputElement) {
          const val = this.inputElement.value;
          const pos = this.inputElement.selectionStart ?? val.length;
          this.inputElement.value = pos > 0 ? val.slice(pos) : '';
          this.inputElement.setSelectionRange(0, 0);
          this.updateCompletionChips();
        }
        return;
      }

      // Ctrl + K: Apaga do cursor até o fim da linha
      if (key === 'k') {
        e.preventDefault();
        if (this.inputElement) {
          const val = this.inputElement.value;
          const pos = this.inputElement.selectionStart ?? val.length;
          this.inputElement.value = val.slice(0, pos);
          this.inputElement.setSelectionRange(pos, pos);
          this.updateCompletionChips();
        }
        return;
      }

      // Ctrl + W: Apaga a última palavra antes do cursor
      if (key === 'w') {
        e.preventDefault();
        if (this.inputElement) {
          const val = this.inputElement.value;
          const pos = this.inputElement.selectionStart ?? val.length;
          const before = val.slice(0, pos);
          const after = val.slice(pos);
          const trimmedBefore = before.replace(/\S+\s*$/, '');
          this.inputElement.value = trimmedBefore + after;
          const newPos = trimmedBefore.length;
          this.inputElement.setSelectionRange(newPos, newPos);
          this.updateCompletionChips();
        }
        return;
      }

      // Ctrl + A: Move o cursor para o início da linha
      if (key === 'a') {
        e.preventDefault();
        if (this.inputElement) {
          this.inputElement.setSelectionRange(0, 0);
        }
        return;
      }

      // Ctrl + E: Move o cursor para o fim da linha
      if (key === 'e') {
        e.preventDefault();
        if (this.inputElement) {
          const len = this.inputElement.value.length;
          this.inputElement.setSelectionRange(len, len);
        }
        return;
      }
    }

    // Atalho 'n' / 'N' com input vazio para avançar após conclusão da lição (estilo 'next' do Linux)
    if ((e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if (this.inputElement && this.inputElement.value === '' && typeof this.onNextRequested === 'function') {
        if (this.onNextRequested()) {
          e.preventDefault();
          return;
        }
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      this.submitCurrentInput();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.navigateHistory(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.navigateHistory(1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.triggerTabCompletion();
    } else if (e.key === 'Escape') {
      this.hideChips();
    }
  }

  navigateHistory(direction) {
    if (this.history.length === 0) return;
    if (direction === -1) {
      if (this.historyIndex === -1) {
        this.historyIndex = this.history.length - 1;
      } else if (this.historyIndex > 0) {
        this.historyIndex--;
      }
    } else {
      if (this.historyIndex !== -1) {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
        } else {
          this.historyIndex = -1;
          this.inputElement.value = '';
          return;
        }
      }
    }

    if (this.historyIndex >= 0 && this.historyIndex < this.history.length) {
      this.inputElement.value = this.history[this.historyIndex];
    }
  }

  executeCommand(cmdLine) {
    const trimmed = (cmdLine || '').trim();
    if (trimmed) {
      this.history.push(trimmed);
    }

    const promptText = this.promptElement ? this.promptElement.textContent : 'penguin@gym:~$ ';
    this.writeLine(`<span class="output-prompt">${this.escapeHtml(promptText)}</span><span class="output-cmd">${this.escapeHtml(cmdLine)}</span>`);

    if (!trimmed) {
      this.scrollToBottom();
      return;
    }

    // Modo interativo sqlite>
    if (this.interactiveMode && this.interactiveMode.type === 'sqlite') {
      const dbName = this.interactiveMode.dbName;
      if (['.exit', '.quit', 'exit', 'quit'].includes(trimmed.toLowerCase())) {
        this.interactiveMode = null;
        this.updatePrompt();
        this.scrollToBottom();
        return;
      }
      if (trimmed === '.help') {
        this.writeLine(
          this.escapeHtml(
            `.tables                Lista os nomes das tabelas\n.schema ?TABLE?        Mostra as instruções CREATE\n.exit                  Sai deste programa\n.quit                  Sai deste programa\nSELECT ...;            Executa consulta SQL nas tabelas`
          ),
          'output-text'
        );
        this.scrollToBottom();
        return;
      }

      const sqlRes = this.commandEngine.sql.execute([dbName, trimmed]);
      if (sqlRes.output) {
        this.writeLine(this.formatAnsi(sqlRes.output), sqlRes.type === 'error' ? 'output-error' : 'output-text');
      }
      this.scrollToBottom();
      if (this.onCommandExecuted) {
        this.onCommandExecuted(`sqlite3 ${dbName} "${trimmed}"`, sqlRes.output || '', this.fs, sqlRes);
      }
      return;
    }

    const res = this.commandEngine.executeLine(cmdLine);
    const effectiveCmd = cmdLine;

    if (res.historyCleared) {
      this.history = [];
      this.historyIndex = -1;
    }

    if (res.action === 'clear') {
      this.clear();
      this.updatePrompt();
      if (this.onCommandExecuted) {
        this.onCommandExecuted(cmdLine, res.output || '', this.fs, res);
      }
      return;
    }

    if (res.action === 'reset_env') {
      if (typeof window !== 'undefined' && window.app && typeof window.app.resetToInitialPoint === 'function') {
        window.app.resetToInitialPoint(true);
      } else {
        this.fs.reset();
        this.updatePrompt();
        this.writeLine('<span class="ansi-yellow">🧹 Ambiente restaurado para o ponto inicial!</span>');
      }
      if (this.onCommandExecuted) {
        this.onCommandExecuted(cmdLine, res.output || '', this.fs, res);
      }
      return;
    }

    if (res.action === 'sqlite_interactive') {
      if (res.output) {
        this.writeLine(this.formatAnsi(res.output), 'output-text');
      }
      this.interactiveMode = { type: 'sqlite', dbName: res.dbName || 'gym.db' };
      this.updatePrompt();
      this.scrollToBottom();
      if (this.onCommandExecuted) {
        this.onCommandExecuted(cmdLine, res.output || '', this.fs, res);
      }
      return;
    }

    if (res.action === 'nano') {
      this.openNanoEditor(res.filePath || 'untitled.txt', { crontabMode: !!res.crontabMode });
      if (this.onCommandExecuted) {
        this.onCommandExecuted(cmdLine, '', this.fs, res);
      }
      return;
    }

    if (res.action === 'less') {
      if (res.output) {
        this.writeLine(this.formatAnsi(res.output), 'output-text');
      }
      this.openLessPager(res.content || res.output || '', res.title || 'arquivo', res.pagerMode || 'less');
      this.scrollToBottom();
      if (this.onCommandExecuted) {
        this.onCommandExecuted(cmdLine, res.output || '', this.fs, res);
      }
      return;
    }

    if (res.output) {
      const formatted = this.formatAnsi(res.output);
      this.writeLine(formatted, res.type === 'error' ? 'output-error' : 'output-text');
    }

    this.updatePrompt();
    this.scrollToBottom();

    if (this.onCommandExecuted) {
      this.onCommandExecuted(cmdLine, res.output || '', this.fs, res);
    }
  }

  /**
   * Abre o editor interativo GNU nano sobre o terminal integrado ao VirtualFS
   */
  openNanoEditor(filePath, options = {}) {
    const { crontabMode = false } = options;
    const termArea = document.getElementById('terminalArea');
    if (!termArea) return;

    if (this._nanoKeyCleanup) {
      this._nanoKeyCleanup();
      this._nanoKeyCleanup = null;
    }

    const existing = document.getElementById('nanoEditorOverlay');
    if (existing) existing.remove();

    let initialContent = '';
    try {
      const node = this.fs.getNode(filePath);
      if (node && node.type === 'file') {
        initialContent = node.content || '';
      }
    } catch {}

    let lastSavedContent = initialContent;
    let confirmingExit = false;
    const lineCount = initialContent ? initialContent.split('\n').length : 0;

    const overlay = document.createElement('div');
    overlay.id = 'nanoEditorOverlay';
    overlay.className = 'nano-overlay';
    overlay.tabIndex = -1;
    overlay.innerHTML = `
      <div class="nano-header">
        <span>  GNU nano 7.2</span>
        <span class="nano-filename">Arquivo: ${this.escapeHtml(filePath)}</span>
        <span class="nano-modified" id="nanoModifiedIndicator"></span>
      </div>
      <textarea id="nanoTextarea" class="nano-textarea" spellcheck="false" placeholder="Digite o conteúdo do arquivo aqui..."></textarea>
      <div class="nano-status-bar" id="nanoStatusBar">
        <span id="nanoStatusMsg">[ Lidas ${lineCount} linhas ]</span>
      </div>
      <div class="nano-footer" id="nanoFooterNormal">
        <button type="button" class="nano-shortcut" id="nanoSaveBtn"><span class="nano-key">^O</span> Gravar</button>
        <button type="button" class="nano-shortcut" id="nanoExitBtn"><span class="nano-key">^X</span> Sair</button>
        <button type="button" class="nano-shortcut" id="nanoHelpBtn"><span class="nano-key">^G</span> Ajuda</button>
        <button type="button" class="nano-shortcut" id="nanoCutBtn"><span class="nano-key">^K</span> Recortar Linha</button>
      </div>
      <div class="nano-footer d-none" id="nanoFooterConfirm">
        <button type="button" class="nano-shortcut" id="nanoConfirmYesBtn"><span class="nano-key"> S </span> Sim</button>
        <button type="button" class="nano-shortcut" id="nanoConfirmNoBtn"><span class="nano-key"> N </span> Não</button>
        <button type="button" class="nano-shortcut" id="nanoConfirmCancelBtn"><span class="nano-key">^C</span> Cancelar</button>
        <span></span>
      </div>
    `;

    termArea.appendChild(overlay);

    const textarea = overlay.querySelector('#nanoTextarea');
    const statusBar = overlay.querySelector('#nanoStatusBar');
    const statusMsg = overlay.querySelector('#nanoStatusMsg');
    const modIndicator = overlay.querySelector('#nanoModifiedIndicator');
    const footerNormal = overlay.querySelector('#nanoFooterNormal');
    const footerConfirm = overlay.querySelector('#nanoFooterConfirm');
    const saveBtn = overlay.querySelector('#nanoSaveBtn');
    const exitBtn = overlay.querySelector('#nanoExitBtn');
    const helpBtn = overlay.querySelector('#nanoHelpBtn');
    const cutBtn = overlay.querySelector('#nanoCutBtn');
    const confirmYesBtn = overlay.querySelector('#nanoConfirmYesBtn');
    const confirmNoBtn = overlay.querySelector('#nanoConfirmNoBtn');
    const confirmCancelBtn = overlay.querySelector('#nanoConfirmCancelBtn');

    textarea.value = initialContent;

    const updateModified = () => {
      modIndicator.textContent = textarea.value !== lastSavedContent ? 'Modificado' : '';
    };

    const setConfirmPrompt = (active) => {
      confirmingExit = active;
      if (statusBar) statusBar.classList.toggle('nano-prompt', active);
      if (footerNormal) footerNormal.classList.toggle('d-none', active);
      if (footerConfirm) footerConfirm.classList.toggle('d-none', !active);
      if (active) {
        statusMsg.textContent = 'Salvar buffer modificado? (Resp. "Não" descartará as alterações)';
        overlay.focus();
      } else {
        textarea.focus();
      }
    };

    const saveFile = () => {
      try {
        this.fs.writeFile(filePath, textarea.value);
        lastSavedContent = textarea.value;
        if (crontabMode && this.commandEngine) {
          this.commandEngine.userCrontab = textarea.value;
        }
        const lines = textarea.value === '' ? 0 : textarea.value.split('\n').length;
        statusBar?.classList.remove('nano-prompt');
        statusMsg.textContent = crontabMode
          ? `[ Crontab instalado (${lines} linhas) ]`
          : `[ Gravadas ${lines} linhas em ${filePath} ]`;
        modIndicator.textContent = '';
        if (this.onCommandExecuted) {
          const cmdLabel = crontabMode ? 'crontab -e' : `nano ${filePath}`;
          this.onCommandExecuted(cmdLabel, '', this.fs, {
            action: 'nano_saved',
            filePath,
            crontabMode
          });
        }
        return true;
      } catch (err) {
        statusBar?.classList.remove('nano-prompt');
        statusMsg.textContent = `[ Erro ao gravar: ${err.message} ]`;
        return false;
      }
    };

    const closeNano = () => {
      if (this._nanoKeyCleanup) {
        this._nanoKeyCleanup();
        this._nanoKeyCleanup = null;
      }
      overlay.remove();
      if (this.inputElement) this.inputElement.focus();
    };

    const requestExit = () => {
      if (textarea.value !== lastSavedContent) {
        setConfirmPrompt(true);
      } else {
        closeNano();
      }
    };

    const cutLine = () => {
      const start = textarea.selectionStart ?? 0;
      const val = textarea.value;
      const lineStart = val.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = val.indexOf('\n', start);
      textarea.value = lineEnd === -1 ? val.slice(0, lineStart) : val.slice(0, lineStart) + val.slice(lineEnd + 1);
      if (typeof textarea.setSelectionRange === 'function') {
        textarea.setSelectionRange(lineStart, lineStart);
      }
      updateModified();
      statusBar?.classList.remove('nano-prompt');
      statusMsg.textContent = '[ Linha recortada ]';
    };

    const onNanoKeyDown = (e) => {
      if (!overlay.isConnected && !document.getElementById('nanoEditorOverlay')) {
        if (this._nanoKeyCleanup) {
          this._nanoKeyCleanup();
          this._nanoKeyCleanup = null;
        }
        return;
      }

      const key = (e.key || '').toLowerCase();
      const code = e.code || '';

      if (confirmingExit) {
        if (key === 's' || key === 'y' || e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          if (saveFile()) closeNano();
        } else if (key === 'n') {
          e.preventDefault();
          e.stopPropagation();
          closeNano();
        } else if ((e.ctrlKey && (key === 'c' || code === 'KeyC')) || e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          statusMsg.textContent = '[ Cancelado ]';
          setConfirmPrompt(false);
        } else {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }

      if (e.ctrlKey && !e.altKey && !e.metaKey) {
        const matchCtrl = (ch, ctrlChar, targetCode) =>
          key === ch || key === ctrlChar || (!/^[a-z]$/.test(key) && code === targetCode);

        if (matchCtrl('o', '\x0f', 'KeyO') || matchCtrl('s', '\x13', 'KeyS')) {
          e.preventDefault();
          e.stopPropagation();
          saveFile();
          textarea.focus();
          return;
        }
        if (matchCtrl('x', '\x18', 'KeyX')) {
          e.preventDefault();
          e.stopPropagation();
          requestExit();
          return;
        }
        if (matchCtrl('g', '\x07', 'KeyG')) {
          e.preventDefault();
          e.stopPropagation();
          statusBar?.classList.remove('nano-prompt');
          statusMsg.textContent = '[ Dica: Ctrl+O grava | Ctrl+X sai (pergunta se quiser salvar) | Ctrl+K recorta ]';
          textarea.focus();
          return;
        }
        if (matchCtrl('k', '\x0b', 'KeyK')) {
          e.preventDefault();
          e.stopPropagation();
          cutLine();
          textarea.focus();
          return;
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        requestExit();
      }
    };

    const keyTarget = (typeof window !== 'undefined' && typeof window.addEventListener === 'function') ? window : document;
    keyTarget.addEventListener('keydown', onNanoKeyDown, true);
    this._nanoKeyCleanup = () => {
      if (typeof keyTarget.removeEventListener === 'function') {
        keyTarget.removeEventListener('keydown', onNanoKeyDown, true);
      }
    };

    textarea.addEventListener('input', updateModified);

    saveBtn.addEventListener('click', () => {
      if (confirmingExit) setConfirmPrompt(false);
      saveFile();
      textarea.focus();
    });
    exitBtn.addEventListener('click', () => requestExit());
    helpBtn.addEventListener('click', () => {
      statusBar?.classList.remove('nano-prompt');
      statusMsg.textContent = '[ Dica: Ctrl+O grava | Ctrl+X sai (pergunta se quiser salvar) | Ctrl+K recorta ]';
      textarea.focus();
    });
    cutBtn.addEventListener('click', () => {
      if (confirmingExit) setConfirmPrompt(false);
      cutLine();
      textarea.focus();
    });
    confirmYesBtn.addEventListener('click', () => {
      if (saveFile()) closeNano();
    });
    confirmNoBtn.addEventListener('click', () => closeNano());
    confirmCancelBtn.addEventListener('click', () => {
      statusMsg.textContent = '[ Cancelado ]';
      setConfirmPrompt(false);
    });

    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => textarea.focus());
    }
    textarea.focus();
  }

  /**
   * Abre o paginador interativo GNU less sobre a janela do terminal
   */
  openLessPager(content, title = 'arquivo', pagerMode = 'less') {
    const termArea = document.getElementById('terminalArea');
    if (!termArea) return;

    const existing = document.getElementById('lessPagerOverlay');
    if (existing) existing.remove();

    const lines = (content || '').split('\n');
    let currentLine = 0;
    const linesPerPage = 20;
    let searchTerm = '';
    const isMore = pagerMode === 'more';

    const overlay = document.createElement('div');
    overlay.id = 'lessPagerOverlay';
    overlay.className = 'less-overlay';
    overlay.tabIndex = 0;
    overlay.innerHTML = `
      <div class="less-body" id="lessBody"></div>
      <div class="less-footer">
        <span class="less-status" id="lessStatus"></span>
        <div class="less-controls">
          <button type="button" class="less-btn" id="lessUpBtn">▲ Linha</button>
          <button type="button" class="less-btn" id="lessDownBtn">▼ Linha</button>
          <button type="button" class="less-btn" id="lessPgUpBtn">▲ Pág</button>
          <button type="button" class="less-btn" id="lessPgDnBtn">▼ Pág</button>
          <button type="button" class="less-btn less-btn-exit" id="lessExitBtn">Sair (q)</button>
        </div>
      </div>
    `;

    termArea.appendChild(overlay);

    const bodyEl = overlay.querySelector('#lessBody');
    const statusEl = overlay.querySelector('#lessStatus');
    const upBtn = overlay.querySelector('#lessUpBtn');
    const downBtn = overlay.querySelector('#lessDownBtn');
    const pgUpBtn = overlay.querySelector('#lessPgUpBtn');
    const pgDnBtn = overlay.querySelector('#lessPgDnBtn');
    const exitBtn = overlay.querySelector('#lessExitBtn');

    const render = () => {
      const visible = lines.slice(currentLine, currentLine + linesPerPage);
      bodyEl.innerHTML = visible.map(l => {
        const safe = this.escapeHtml(l);
        if (!searchTerm) return safe;
        const escTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return safe.replace(new RegExp(`(${escTerm})`, 'gi'), '<mark>$1</mark>');
      }).join('<br>') || '&nbsp;';
      const isEnd = currentLine + linesPerPage >= lines.length;
      if (isMore) {
        const pct = lines.length > 0 ? Math.min(100, Math.round(((currentLine + linesPerPage) / lines.length) * 100)) : 100;
        statusEl.textContent = isEnd
          ? `${title} --Fim-- (pressione q para sair)`
          : `--Mais--(${pct}%) [Espaço: próxima página | q: sair]`;
      } else {
        statusEl.textContent = isEnd
          ? `${title} (END - pressione q para sair | / para buscar)`
          : `${title} (linhas ${currentLine + 1}-${Math.min(lines.length, currentLine + linesPerPage)} de ${lines.length} - q sair, / buscar)`;
      }
    };

    const closePager = () => {
      overlay.remove();
      if (this.inputElement) this.inputElement.focus();
    };

    if (isMore) {
      upBtn.style.display = 'none';
      pgUpBtn.style.display = 'none';
    }

    overlay.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'q' || e.key === 'Escape' || (e.ctrlKey && k === 'c')) {
        e.preventDefault();
        closePager();
      } else if (!isMore && e.key === '/') {
        e.preventDefault();
        const term = typeof window !== 'undefined' && typeof window.prompt === 'function'
          ? window.prompt('Buscar no texto (less /):', searchTerm)
          : '';
        if (term !== null) {
          searchTerm = term.trim();
          if (searchTerm) {
            const matchIdx = lines.findIndex(l => l.toLowerCase().includes(searchTerm.toLowerCase()));
            if (matchIdx !== -1) currentLine = matchIdx;
          }
          render();
        }
      } else if (k === 'j' || e.key === 'ArrowDown' || (isMore && e.key === 'Enter')) {
        e.preventDefault();
        if (currentLine + 1 < lines.length) {
          currentLine++;
          render();
        }
      } else if (!isMore && (k === 'k' || e.key === 'ArrowUp')) {
        e.preventDefault();
        if (currentLine > 0) {
          currentLine--;
          render();
        }
      } else if (e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        currentLine = Math.min(Math.max(0, lines.length - linesPerPage), currentLine + linesPerPage);
        render();
      } else if (!isMore && (k === 'b' || e.key === 'PageUp')) {
        e.preventDefault();
        currentLine = Math.max(0, currentLine - linesPerPage);
        render();
      } else if (!isMore && k === 'g' && !e.shiftKey) {
        e.preventDefault();
        currentLine = 0;
        render();
      } else if (!isMore && k === 'g' && e.shiftKey) {
        e.preventDefault();
        currentLine = Math.max(0, lines.length - linesPerPage);
        render();
      }
    });

    upBtn.addEventListener('click', () => { if (currentLine > 0) { currentLine--; render(); overlay.focus(); } });
    downBtn.addEventListener('click', () => { if (currentLine + 1 < lines.length) { currentLine++; render(); overlay.focus(); } });
    pgUpBtn.addEventListener('click', () => { currentLine = Math.max(0, currentLine - linesPerPage); render(); overlay.focus(); });
    pgDnBtn.addEventListener('click', () => { currentLine = Math.min(Math.max(0, lines.length - linesPerPage), currentLine + linesPerPage); render(); overlay.focus(); });
    exitBtn.addEventListener('click', () => closePager());

    render();
    overlay.focus();
  }

  /**
   * Calcula o maior prefixo comum entre uma lista de strings
   */
  getLongestCommonPrefix(list) {
    if (!list || list.length === 0) return '';
    let prefix = list[0];
    for (let i = 1; i < list.length; i++) {
      while (!list[i].startsWith(prefix)) {
        prefix = prefix.slice(0, -1);
        if (!prefix) return '';
      }
    }
    return prefix;
  }

  triggerTabCompletion() {
    if (!this.inputElement) return;
    const val = this.inputElement.value;

    if (val === this.lastTabInput) {
      this.tabPressCount++;
    } else {
      this.tabPressCount = 1;
      this.lastTabInput = val;
    }

    // Identifica o segmento do comando ativo após o último ;, &&, || ou | fora de aspas
    let lastSepEnd = 0;
    let inQ = null;
    for (let i = 0; i < val.length; i++) {
      const ch = val[i];
      if (ch === "'" || ch === '"') {
        inQ = inQ === ch ? null : (inQ || ch);
      } else if (!inQ) {
        if ((ch === '&' && val[i + 1] === '&') || (ch === '|' && val[i + 1] === '|')) {
          lastSepEnd = i + 2;
          i++;
        } else if (ch === ';' || ch === '|') {
          lastSepEnd = i + 1;
        }
      }
    }

    const linePrefix = val.slice(0, lastSepEnd);
    const rawSeg = val.slice(lastSepEnd);
    const leadMatch = rawSeg.match(/^(\s*)/);
    const segPrefix = linePrefix + (leadMatch ? leadMatch[1] : '');
    const activeSeg = rawSeg.slice(leadMatch ? leadMatch[1].length : 0);

    const tokens = activeSeg.split(/\s+/);
    const lastToken = tokens[tokens.length - 1] || '';

    // 1. Autocompletar variáveis ($VAR)
    if (lastToken.startsWith('$') && !lastToken.startsWith('$(')) {
      const varPrefix = lastToken.slice(1);
      const varPool = Array.from(
        new Set([
          'USER', 'HOME', 'PWD', 'OLDPWD', 'SHELL', 'PATH', 'LANG', 'TERM', 'HOSTNAME',
          ...Object.keys((this.commandEngine && this.commandEngine.envVars) || {}),
          ...Object.keys((this.commandEngine && this.commandEngine.shellVars) || {})
        ])
      ).sort();
      const matches = varPool.filter(v => v.startsWith(varPrefix)).map(v => '$' + v);
      this.applyTabMatches(tokens, lastToken, '', matches, true, segPrefix);
      return;
    }

    // Desembrulha prefixo sudo para autocompletar comandos e subcomandos mesmo com sudo
    let effStart = 0;
    if (tokens.length > 1 && tokens[0] === 'sudo') {
      effStart = 1;
      while (effStart < tokens.length - 1 && tokens[effStart].startsWith('-')) {
        if ((tokens[effStart] === '-u' || tokens[effStart] === '-g') && effStart + 1 < tokens.length - 1) {
          effStart += 2;
        } else {
          effStart += 1;
        }
      }
    }
    const effTokens = tokens.slice(effStart);

    // 2. Autocompletar comandos / builtins / aliases no primeiro token efetivo
    if (effTokens.length <= 1 && !lastToken.includes('/')) {
      const baseCommands = [
        'pwd', 'ls', 'cd', 'mkdir', 'touch', 'cat', 'echo', 'printf', 'cp', 'mv', 'rm', 'rmdir',
        'grep', 'find', 'head', 'tail', 'cut', 'tr', 'sort', 'uniq', 'wc', 'chmod', 'umask',
        'chown', 'sudo', 'which', 'whoami', 'date', 'clear', 'help', 'ps', 'top', 'htop',
        'kill', 'pkill', 'killall', 'pgrep', 'jobs', 'df', 'du', 'free', 'lscpu', 'lsblk', 'dmesg',
        'git', 'docker', 'sqlite3', 'tar', 'gzip', 'gunzip', 'zcat', 'zip', 'unzip', 'ln',
        'diff', 'env', 'printenv', 'export', 'unset', 'alias', 'unalias', 'history', 'uname',
        'uptime', 'more', 'less', 'sed', 'awk', 'xargs', 'tee', 'tac', 'rev', 'nl', 'paste',
        'column', 'md5sum', 'sha256sum', 'base64', 'stat', 'file', 'tree', 'realpath',
        'readlink', 'basename', 'dirname', 'pushd', 'popd', 'dirs', 'man', 'whatis', 'apropos',
        'id', 'groups', 'who', 'w', 'last', 'hostname', 'hostnamectl', 'useradd', 'usermod',
        'userdel', 'groupadd', 'passwd', 'systemctl', 'service', 'journalctl', 'crontab', 'apt',
        'apt-get', 'dpkg', 'ip', 'ifconfig', 'ping', 'traceroute', 'curl', 'wget', 'ss',
        'netstat', 'dig', 'nslookup', 'host', 'nc', 'netcat', 'ufw', 'ssh', 'scp', 'rsync',
        'nano', 'vi', 'vim', 'neofetch', 'cowsay', 'jq', 'nmap', 'source', 'bash', 'sh', 'test',
        'expr', 'seq', 'true', 'false', 'nohup', 'command', 'builtin', 'reset-fs', 'clean-env',
        'exit', 'logout'
      ];
      const aliasNames = Object.keys((this.commandEngine && this.commandEngine.aliases) || {});
      const allCmds = Array.from(new Set([...baseCommands, ...aliasNames])).sort();
      const matches = allCmds.filter(c => c.startsWith(lastToken));
      this.applyTabMatches(tokens, lastToken, '', matches, true, segPrefix);
      return;
    }

    // 3. Autocompletar subcomandos e argumentos contextuais
    const firstCmd = effTokens[0];
    let contextPool = null;

    if (effTokens.length === 2) {
      if (firstCmd === 'git') {
        contextPool = ['status', 'add', 'commit', 'branch', 'switch', 'checkout', 'merge', 'stash', 'diff', 'restore', 'reset', 'log', 'init', '--help', '--version'];
      } else if (firstCmd === 'docker') {
        contextPool = ['ps', 'run', 'build', 'images', 'pull', 'start', 'stop', 'restart', 'rm', 'rmi', 'logs', 'exec', 'inspect', '--help', '--version'];
      } else if (firstCmd === 'systemctl') {
        contextPool = ['status', 'start', 'stop', 'restart', 'enable', 'disable', 'is-active', 'is-enabled', 'list-units', 'reload'];
      } else if (firstCmd === 'service') {
        contextPool = Object.keys((this.commandEngine && this.commandEngine.services) || {});
      } else if (firstCmd === 'apt' || firstCmd === 'apt-get') {
        contextPool = ['update', 'upgrade', 'install', 'remove', 'purge', 'search', 'show', 'list', 'autoremove'];
      } else if (firstCmd === 'kill' || firstCmd === 'pkill') {
        contextPool = ['nginx', 'sshd', 'cron', 'dockerd', 'bash', 'systemd', '1', '42', '74', '88', '123', '210'];
      } else if (firstCmd === 'man' || firstCmd === 'whatis' || firstCmd === 'help') {
        contextPool = Object.keys((this.commandEngine && this.commandEngine.getManPagesRegistry()) || {});
      }
    } else if (effTokens.length >= 3) {
      const sub = effTokens[1];
      if (firstCmd === 'git' && (sub === 'checkout' || sub === 'switch' || sub === 'branch' || sub === 'merge')) {
        contextPool = (this.commandEngine && this.commandEngine.git && this.commandEngine.git.branches) || ['main'];
      } else if (firstCmd === 'systemctl') {
        const sKeys = Object.keys((this.commandEngine && this.commandEngine.services) || {});
        contextPool = [...sKeys, ...sKeys.map(s => s + '.service')];
      } else if (firstCmd === 'service') {
        contextPool = ['status', 'start', 'stop', 'restart', 'reload'];
      } else if (firstCmd === 'docker' && (sub === 'start' || sub === 'stop' || sub === 'restart' || sub === 'rm' || sub === 'logs' || sub === 'exec' || sub === 'inspect')) {
        const containers = (this.commandEngine && this.commandEngine.docker && Array.from(this.commandEngine.docker.containers.values())) || [];
        contextPool = containers.map(c => c.name).concat(containers.map(c => c.id));
      } else if (firstCmd === 'docker' && (sub === 'run' || sub === 'rmi')) {
        const images = (this.commandEngine && this.commandEngine.docker && Array.from(this.commandEngine.docker.images)) || ['hello-world', 'nginx'];
        contextPool = images;
      } else if ((firstCmd === 'apt' || firstCmd === 'apt-get') && (sub === 'install' || sub === 'show' || sub === 'remove' || sub === 'purge')) {
        contextPool = ['htop', 'neofetch', 'cowsay', 'vim', 'jq', 'nmap', 'tree', 'curl', 'wget', 'git', 'nginx', 'sqlite3'];
      }
    }

    if (contextPool && contextPool.length > 0) {
      const matches = contextPool.filter(c => c.startsWith(lastToken));
      if (matches.length > 0) {
        this.applyTabMatches(tokens, lastToken, '', matches, true, segPrefix);
        return;
      }
    }

    // 4. Autocompletar caminhos de arquivos e diretórios
    const matches = this.fs.getCompletions(lastToken);
    const dirPrefix = lastToken.includes('/') ? lastToken.slice(0, lastToken.lastIndexOf('/') + 1) : '';
    const partialName = lastToken.includes('/') ? lastToken.slice(lastToken.lastIndexOf('/') + 1) : lastToken;
    this.applyTabMatches(tokens, partialName, dirPrefix, matches, false, segPrefix);
  }

  applyTabMatches(tokens, partialName, dirPrefix, matches, isCommandOrVar, segPrefix = '') {
    if (!matches || matches.length === 0) return;

    if (matches.length === 1) {
      const match = matches[0];
      const isDir = match.endsWith('/');
      tokens[tokens.length - 1] = dirPrefix + match;
      this.inputElement.value = segPrefix + tokens.join(' ') + (isDir ? '' : ' ');
      this.lastTabInput = this.inputElement.value;
      this.tabPressCount = 0;
      this.hideChips();
      return;
    }

    // Múltiplas opções: verifica se há um prefixo comum maior que o digitado
    const common = this.getLongestCommonPrefix(matches);
    if (common && common.length > partialName.length) {
      tokens[tokens.length - 1] = dirPrefix + common;
      this.inputElement.value = segPrefix + tokens.join(' ');
      this.lastTabInput = this.inputElement.value;
      this.tabPressCount = 1;
    } else if (this.tabPressCount >= 2) {
      // Segundo Tab consecutivo: lista opções no histórico do terminal como no Bash real
      const promptText = this.promptElement ? this.promptElement.textContent : 'penguin@gym:~$ ';
      this.writeLine(
        `<span class="output-prompt">${this.escapeHtml(promptText)}</span><span class="output-cmd">${this.escapeHtml(this.inputElement.value)}</span>`
      );
      this.writeLine(this.escapeHtml(matches.join('  ')), 'output-text');
      this.scrollToBottom();
    }

    this.showChips(matches, (choice) => {
      const isDir = choice.endsWith('/');
      tokens[tokens.length - 1] = dirPrefix + choice;
      this.inputElement.value = segPrefix + tokens.join(' ') + (isDir ? '' : ' ');
      this.lastTabInput = this.inputElement.value;
      this.tabPressCount = 0;
      this.inputElement.focus();
    });
  }

  updateCompletionChips() {
    const val = this.inputElement.value.trim();
    if (!val) {
      this.hideChips();
      return;
    }
    const tokens = val.split(/\s+/);
    const last = tokens[tokens.length - 1];
    if (tokens.length > 1 && last) {
      const matches = this.fs.getCompletions(last);
      if (matches.length > 0 && matches.length <= 6) {
        this.showChips(matches, (choice) => {
          const prefix = last.includes('/') ? last.slice(0, last.lastIndexOf('/') + 1) : '';
          tokens[tokens.length - 1] = prefix + choice;
          this.inputElement.value = tokens.join(' ');
          this.inputElement.focus();
        });
        return;
      }
    }
    this.hideChips();
  }

  showChips(items, onSelect) {
    if (!this.chipsContainer) return;
    this.chipsContainer.innerHTML = '';
    this.chipsContainer.hidden = false;

    items.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'completion-chip';
      btn.textContent = item;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        onSelect(item);
        this.hideChips();
      });
      this.chipsContainer.appendChild(btn);
    });
  }

  hideChips() {
    if (this.chipsContainer) {
      this.chipsContainer.innerHTML = '';
      this.chipsContainer.hidden = true;
    }
  }

  writeLine(htmlContent, className = '') {
    if (!this.outputElement) return;
    const div = document.createElement('div');
    if (className) div.className = className;
    div.innerHTML = htmlContent;
    this.outputElement.appendChild(div);
  }

  clear() {
    if (this.outputElement) {
      this.outputElement.innerHTML = '';
    }
  }

  scrollToBottom() {
    if (this.container) {
      this.container.scrollTop = this.container.scrollHeight;
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  formatAnsi(text) {
    if (!text) return '';

    const colorMap = {
      '30': 'ansi-black',
      '31': 'ansi-red',
      '32': 'ansi-green',
      '33': 'ansi-yellow',
      '34': 'ansi-blue',
      '35': 'ansi-magenta',
      '36': 'ansi-cyan',
      '37': 'ansi-white',
      '90': 'ansi-bright-black',
      '91': 'ansi-red',
      '92': 'ansi-green',
      '93': 'ansi-yellow',
      '94': 'ansi-blue',
      '95': 'ansi-magenta',
      '96': 'ansi-cyan',
      '97': 'ansi-white'
    };

    const regex = /\x1b\[([0-9;]*)m/g;
    let result = '';
    let lastIndex = 0;
    let currentColorClass = null;
    let isBold = false;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const chunk = text.slice(lastIndex, match.index);
      if (chunk) {
        const escaped = this.escapeHtml(chunk);
        if (currentColorClass) {
          result += `<span class="${currentColorClass}${isBold ? ' ansi-bold' : ''}">${escaped}</span>`;
        } else if (isBold) {
          result += `<span class="ansi-bold">${escaped}</span>`;
        } else {
          result += escaped;
        }
      }

      const codes = match[1] ? match[1].split(';') : ['0'];
      for (const code of codes) {
        if (code === '0' || code === '') {
          currentColorClass = null;
          isBold = false;
        } else if (code === '1') {
          isBold = true;
        } else if (colorMap[code]) {
          currentColorClass = colorMap[code];
        }
      }

      lastIndex = regex.lastIndex;
    }

    const remaining = text.slice(lastIndex);
    if (remaining) {
      const escaped = this.escapeHtml(remaining);
      if (currentColorClass) {
        result += `<span class="${currentColorClass}${isBold ? ' ansi-bold' : ''}">${escaped}</span>`;
      } else if (isBold) {
        result += `<span class="ansi-bold">${escaped}</span>`;
      } else {
        result += escaped;
      }
    }

    // Remove qualquer resíduo de códigos de controle e converte quebras de linha
    result = result.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
    result = result.replace(/\x1b/g, '');
    result = result.replace(/\n/g, '<br>');

    return result;
  }
}

if (typeof window !== 'undefined') {
  window.TerminalUI = TerminalUI;
}
