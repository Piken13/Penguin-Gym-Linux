/**
 * Penguin Gym Linux - Main Application Orchestrator & Graphical Inspector
 */

class App {
  constructor() {
    this.currentCategory = 'beginner';
    this.currentLesson = null;
    this.completedLessons = new Set();
    this.lessonSessionHistory = [];
    this.searchQuery = '';
    this.activeGuiTab = 'files';

    this.storageKey = 'penguinGym_completed';
    this.savedCategoryKey = 'penguinGym_currentCat';
    this.savedLessonKey = 'penguinGym_currentLesson';

    const storedAutoClean = typeof localStorage !== 'undefined' ? localStorage.getItem('penguinGym_autoClean') : null;
    this.autoCleanOnLessonChange = storedAutoClean !== null ? storedAutoClean === 'true' : true;

    this.fs = new VirtualFS();
    this.git = new GitEngine(this.fs);
    this.docker = new DockerEngine();
    this.sql = new SQLEngine();
    this.ansible = typeof AnsibleEngine !== 'undefined' ? new AnsibleEngine(this.fs) : null;
    this.commandEngine = new CommandEngine(this.fs, this.git, this.docker, this.sql, null, this.ansible);

    this.loadProgress();

    this.terminal = new TerminalUI(
      'terminal',
      'terminalOutput',
      'terminalInput',
      'terminalPrompt',
      this.fs,
      this.commandEngine,
      (cmd, output, fs, res) => this.onCommand(cmd, output, fs, res)
    );

    this.terminal.onNextRequested = () => {
      const bar = document.getElementById('completionBar');
      if (bar && !bar.classList.contains('d-none')) {
        this.advanceToNextLesson();
        return true;
      }
      return false;
    };

    if (typeof window !== 'undefined') {
      window.app = this;
    }

    this.initUI();
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) {
          this.completedLessons = new Set(arr);
        }
      }
      const savedCat = localStorage.getItem(this.savedCategoryKey);
      if (savedCat) this.currentCategory = savedCat;
    } catch (e) {
      console.warn('Erro ao carregar progresso:', e);
    }
  }

  saveProgress() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.completedLessons)));
      localStorage.setItem(this.savedCategoryKey, this.currentCategory);
      if (this.currentLesson) {
        localStorage.setItem(this.savedLessonKey, this.currentLesson.id);
      }
    } catch (e) {
      console.warn('Erro ao salvar progresso:', e);
    }
  }

  initUI() {
    this.renderCategoryPills();
    this.setupEventListeners();

    const brandTag = document.getElementById('brandLessonsCount');
    if (brandTag) {
      brandTag.textContent = `pt-BR • ${ALL_LESSONS.length} Lições`;
    }

    const savedLessonId = localStorage.getItem(this.savedLessonKey);
    let initialLesson = null;
    if (savedLessonId) {
      initialLesson = ALL_LESSONS.find(l => l.id === savedLessonId);
      if (initialLesson) {
        this.currentCategory = initialLesson.category;
      }
    }

    this.setActiveTab(this.currentCategory, false);

    if (initialLesson) {
      this.selectLesson(initialLesson);
    } else {
      this.selectFirstIncompleteLesson(this.currentCategory);
    }

    this.updateStats();
    this.updateGuiInspector();
  }

  renderCategoryPills() {
    const container = document.getElementById('categoryPills');
    if (!container) return;
    container.innerHTML = '';

    LESSON_CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `cat-pill-btn ${cat.id === this.currentCategory ? 'active' : ''}`;
      btn.dataset.category = cat.id;

      const nameWrap = document.createElement('span');
      nameWrap.className = 'cat-pill-name';

      const icon = document.createElement('span');
      icon.className = 'cat-pill-icon';
      icon.textContent = cat.icon;

      const label = document.createElement('span');
      label.className = 'cat-pill-label';
      label.textContent = cat.label;

      nameWrap.appendChild(icon);
      nameWrap.appendChild(label);

      const count = document.createElement('span');
      count.className = 'cat-pill-count';
      count.id = `tabProgress-${cat.id}`;

      btn.appendChild(nameWrap);
      btn.appendChild(count);

      btn.addEventListener('click', () => {
        const hadSearch = Boolean(this.searchQuery.trim());
        const sameCategory = cat.id === this.currentCategory;
        this.searchQuery = '';
        const searchInput = document.getElementById('lessonSearchInput');
        if (searchInput) searchInput.value = '';
        if (sameCategory && !hadSearch) {
          return;
        }
        this.setActiveTab(cat.id, !sameCategory);
      });

      container.appendChild(btn);
    });
  }

  setActiveTab(catId, autoSelect = true) {
    this.currentCategory = catId;
    document.querySelectorAll('.cat-pill-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.category === catId);
    });

    const catObj = LESSON_CATEGORIES.find(c => c.id === catId);
    const titleEl = document.getElementById('currentCategoryTitle');
    if (titleEl && catObj) {
      titleEl.textContent = `${catObj.icon} ${catObj.label}`;
    }

    this.renderLessonLists();
    if (autoSelect) {
      this.selectFirstIncompleteLesson(catId);
    }
    this.saveProgress();
  }

  renderLessonLists() {
    const container = document.getElementById('lessonListContainer');
    if (!container) return;
    container.innerHTML = '';

    let lessons = [];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      lessons = ALL_LESSONS.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q) ||
        (l.answer && l.answer.toLowerCase().includes(q))
      );
      const titleEl = document.getElementById('currentCategoryTitle');
      if (titleEl) titleEl.textContent = `🔍 Resultados da busca`;
      const countEl = document.getElementById('currentCategoryCount');
      if (countEl) countEl.textContent = `${lessons.length}`;
    } else {
      lessons = ALL_LESSONS.filter(l => l.category === this.currentCategory);
      const catObj = LESSON_CATEGORIES.find(c => c.id === this.currentCategory);
      const titleEl = document.getElementById('currentCategoryTitle');
      if (titleEl && catObj) titleEl.textContent = `${catObj.icon} ${catObj.label}`;
      const completedInCat = lessons.filter(l => this.completedLessons.has(l.id)).length;
      const countEl = document.getElementById('currentCategoryCount');
      if (countEl) countEl.textContent = `${completedInCat}/${lessons.length}`;
    }

    if (lessons.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'lesson-empty-state';
      empty.textContent = this.searchQuery.trim()
        ? `Nenhuma lição encontrada para "${this.searchQuery.trim()}".`
        : 'Nenhuma lição disponível nesta trilha.';
      container.appendChild(empty);
    }

    lessons.forEach(lesson => {
      const isCompleted = this.completedLessons.has(lesson.id);
      const isActive = this.currentLesson && this.currentLesson.id === lesson.id;

      const item = document.createElement('div');
      item.className = `lesson-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`;
      item.dataset.lessonId = lesson.id;
      item.tabIndex = 0;
      item.setAttribute('role', 'button');

      const left = document.createElement('div');
      left.className = 'lesson-left';

      const check = document.createElement('span');
      check.className = 'lesson-check';
      check.textContent = isCompleted ? '✓' : '○';

      const title = document.createElement('div');
      title.className = 'lesson-title';
      title.textContent = lesson.title;

      left.appendChild(check);
      left.appendChild(title);

      const diff = document.createElement('div');
      const diffClass = lesson.difficulty.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      diff.className = `lesson-difficulty diff-${diffClass}`;
      diff.textContent = lesson.difficulty;

      item.appendChild(left);
      item.appendChild(diff);

      const activate = () => {
        const sidebar = document.getElementById('appSidebar');
        if (sidebar && sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
          const toggle = document.getElementById('btnMobileSidebarToggle');
          const chev = document.getElementById('mobileSidebarChevron');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
          if (chev) chev.textContent = '▾';
        }
        if (this.currentLesson && this.currentLesson.id === lesson.id) {
          return;
        }
        if (lesson.category !== this.currentCategory) {
          this.currentCategory = lesson.category;
          document.querySelectorAll('.cat-pill-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.category === lesson.category);
          });
          if (!this.searchQuery.trim()) {
            this.renderLessonLists();
          }
        }
        this.selectLesson(lesson);
      };

      item.addEventListener('click', activate);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });

      container.appendChild(item);
    });

    this.updateStats();
  }

  prepareCommandEngineForLesson(lessonId) {
    if (!this.commandEngine || !lessonId) return;
    if (typeof this.commandEngine.prepareForLesson === 'function') {
      this.commandEngine.prepareForLesson(lessonId);
    }
  }

  selectLesson(lesson, { forceBanner = true } = {}) {
    const isSameLesson = this.currentLesson && this.currentLesson.id === lesson.id;
    this.currentLesson = lesson;
    this.lessonSessionHistory = [];
    this.hideCompletionBar();
    document.getElementById('guiFilePreview')?.classList.add('d-none');

    // Limpa overlays (nano/less), prompt sqlite>, Ctrl+R e restaura sessão de usuário padrão
    if (this.terminal && typeof this.terminal.resetInteractiveState === 'function') {
      this.terminal.resetInteractiveState(true);
    }

    // Prepara o sistema de arquivos e ferramentas (com limpeza automática se ativada)
    const forceReset = !!this.autoCleanOnLessonChange;
    if (forceReset && this.commandEngine) {
      this.commandEngine.resetEnvironment(false);
    }
    this.fs.setupForLesson(lesson.id, this.git, this.docker, this.sql, forceReset, this.ansible);
    this.prepareCommandEngineForLesson(lesson.id);

    this.terminal.updatePrompt();

    // Auto-select appropriate GUI Inspector tab
    if (lesson.category === 'git' || lesson.category === 'docker' || lesson.category === 'ansible' || lesson.id === 'inc-git-secret-leak' || lesson.id === 'inc-docker-conflict') {
      this.switchGuiTab('tools');
    } else if (lesson.category === 'database' || lesson.id === 'inc-backup-pipeline') {
      this.switchGuiTab('sql');
      const dbSelect = document.getElementById('guiDbSelect');
      if (dbSelect) {
        dbSelect.value = lesson.answer && lesson.answer.includes('legacy') ? 'legacy' : 'gym';
      }
    } else {
      this.switchGuiTab('files');
    }

    const globalIdx = ALL_LESSONS.findIndex(l => l.id === lesson.id);
    const numBadge = document.getElementById('lessonNumberBadge');
    if (numBadge) {
      numBadge.textContent = `Lição #${globalIdx + 1} de ${ALL_LESSONS.length}`;
    }

    const mobileSummary = document.getElementById('mobileSidebarSummary');
    if (mobileSummary) {
      const catObj = LESSON_CATEGORIES.find(c => c.id === lesson.category);
      mobileSummary.textContent = `📚 ${catObj ? catObj.label : 'Trilhas'} • #${globalIdx + 1} (${this.completedLessons.size}/${ALL_LESSONS.length})`;
    }

    const diffBadge = document.getElementById('challengeDifficultyBadge');
    if (diffBadge) {
      const diffClass = lesson.difficulty.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      diffBadge.className = `lesson-difficulty diff-${diffClass}`;
      diffBadge.textContent = lesson.difficulty;
    }

    const prevBtn = document.getElementById('btnPrevLesson');
    const nextBtn = document.getElementById('btnNextLesson');
    if (prevBtn) prevBtn.disabled = globalIdx <= 0;
    if (nextBtn) nextBtn.disabled = globalIdx >= ALL_LESSONS.length - 1;

    const titleEl = document.getElementById('challengeTitle');
    const descEl = document.getElementById('challengeDescription');
    const hintEl = document.getElementById('hintContent');
    const answerEl = document.getElementById('answerContent');
    const answerCode = document.getElementById('answerCodeText');

    if (titleEl) titleEl.textContent = lesson.title;
    if (descEl) descEl.innerHTML = this.formatInlineMarkdown(lesson.description);

    if (hintEl) {
      hintEl.innerHTML = '💡 <strong>Dica:</strong> ' + this.formatInlineMarkdown(lesson.hint);
      hintEl.classList.add('d-none');
    }

    if (answerCode) {
      answerCode.textContent = lesson.answer || '';
    }
    this.renderAnswerSteps(lesson);
    if (answerEl) {
      answerEl.classList.add('d-none');
    }

    const hintBtn = document.getElementById('hintButton');
    if (hintBtn) {
      hintBtn.innerHTML = '<span class="hint-icon">💡</span> <span class="hint-text">Mostrar Dica</span>';
    }
    const ansBtn = document.getElementById('answerButton');
    if (ansBtn) {
      ansBtn.innerHTML = '<span class="ans-icon">🔑</span> <span class="ans-text">Ver Solução</span>';
    }

    // Render Quick Command Chips
    this.renderQuickCommands(lesson);

    document.querySelectorAll('.lesson-item').forEach(el => {
      const isAct = el.dataset.lessonId === lesson.id;
      el.classList.toggle('active', isAct);
      if (isAct && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });

    if (forceBanner && !isSameLesson) {
      this.terminal.writeLine(`<div class="terminal-lesson-banner">
      <span class="banner-title">🎯 Lição #${globalIdx + 1}: ${this.escapeHtml(lesson.title)}</span><br>
      <span class="banner-desc">${this.formatInlineMarkdown(lesson.description)}</span>
    </div>`);
      this.terminal.scrollToBottom();
    }

    const input = document.getElementById('terminalInput');
    if (input) {
      const focusInput = () => input.focus();
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(focusInput);
      else setTimeout(focusInput, 0);
    }

    this.updateGuiInspector();
    this.saveProgress();
  }

  resetToInitialPoint(verbose = true) {
    if (this.terminal && typeof this.terminal.resetInteractiveState === 'function') {
      this.terminal.resetInteractiveState(true);
    }
    document.getElementById('guiFilePreview')?.classList.add('d-none');

    if (this.commandEngine) {
      this.commandEngine.resetEnvironment(false);
    }

    if (this.currentLesson) {
      this.fs.setupForLesson(this.currentLesson.id, this.git, this.docker, this.sql, true, this.ansible);
      this.lessonSessionHistory = [];
      this.prepareCommandEngineForLesson(this.currentLesson.id);
    } else {
      this.fs.reset();
      if (this.git) this.git.reset();
      if (this.docker) this.docker.reset();
      if (this.sql) this.sql.reset();
      if (this.ansible) this.ansible.reset();
    }

    this.terminal.updatePrompt();
    this.updateGuiInspector();

    if (verbose) {
      this.terminal.writeLine('<span class="ansi-yellow">🧹 <b>Ambiente restaurado para o ponto inicial!</b> Todos os arquivos acumulados foram limpos.</span>');
      this.terminal.scrollToBottom();
    }
  }

  renderQuickCommands(lesson) {
    const bar = document.getElementById('quickCmdBar');
    if (!bar) return;
    bar.innerHTML = '';
    if (!lesson || !Array.isArray(lesson.relatedCommands) || lesson.id === 'tool-man-page') return;

    const registry = (this.commandEngine && typeof this.commandEngine.getManPagesRegistry === 'function')
      ? this.commandEngine.getManPagesRegistry()
      : (typeof MAN_PAGES !== 'undefined' ? MAN_PAGES : {});
    const seen = new Set();

    for (const rawRel of lesson.relatedCommands) {
      const baseCmd = String(rawRel || '').trim().split(/\s+/)[0].replace(/[^a-zA-Z0-9._-]/g, '');
      if (!baseCmd || seen.has(baseCmd) || !registry[baseCmd]) continue;
      seen.add(baseCmd);

      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'quick-cmd-chip';
      chip.textContent = `📖 man ${baseCmd}`;
      chip.title = `Consultar manual de "${baseCmd}" sem alterar o desafio`;
      chip.addEventListener('click', () => {
        this.terminal.runCommandProgrammatically(`man ${baseCmd}`);
      });
      bar.appendChild(chip);
      if (seen.size >= 3) break;
    }
  }

  renderAnswerSteps(lesson) {
    const wrap = document.getElementById('answerStepsWrap');
    if (!wrap) return;
    wrap.innerHTML = '';
    const steps = lesson && Array.isArray(lesson.answerSteps) ? lesson.answerSteps : [];
    if (steps.length <= 1) {
      wrap.classList.add('d-none');
      return;
    }

    const header = document.createElement('div');
    header.className = 'answer-steps-title';
    header.textContent = '🧩 Passo a passo (execute um comando por vez no terminal):';
    wrap.appendChild(header);

    const list = document.createElement('div');
    list.className = 'answer-steps-list';

    steps.forEach((step, idx) => {
      const item = document.createElement('div');
      item.className = 'answer-step-item';

      const badge = document.createElement('span');
      badge.className = 'answer-step-num';
      badge.textContent = `Passo ${idx + 1}`;

      const code = document.createElement('code');
      code.className = 'answer-step-code';
      code.textContent = step;

      const actions = document.createElement('div');
      actions.className = 'answer-step-actions';

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'btn-mini';
      copyBtn.textContent = '📋';
      copyBtn.title = `Copiar passo ${idx + 1}`;
      copyBtn.addEventListener('click', () => {
        navigator.clipboard?.writeText(step);
        copyBtn.textContent = '✓';
        setTimeout(() => { copyBtn.textContent = '📋'; }, 1200);
      });

      const runBtn = document.createElement('button');
      runBtn.type = 'button';
      runBtn.className = 'btn-mini btn-mini-primary';
      runBtn.textContent = '▶';
      runBtn.title = `Executar passo ${idx + 1}`;
      runBtn.addEventListener('click', () => {
        this.terminal.runCommandProgrammatically(step);
      });

      actions.appendChild(copyBtn);
      actions.appendChild(runBtn);
      item.appendChild(badge);
      item.appendChild(code);
      item.appendChild(actions);
      list.appendChild(item);
    });

    wrap.appendChild(list);
    wrap.classList.remove('d-none');
  }

  selectFirstIncompleteLesson(catId) {
    const list = ALL_LESSONS.filter(l => l.category === catId);
    const incomplete = list.find(l => !this.completedLessons.has(l.id));
    if (incomplete) {
      this.selectLesson(incomplete);
    } else if (list.length > 0) {
      this.selectLesson(list[0]);
    }
  }

  onCommand(cmd, output, fs, res) {
    this.lessonSessionHistory.push(cmd);
    if (res && res.expandedCommand && res.expandedCommand !== cmd) {
      this.lessonSessionHistory.push(res.expandedCommand);
    }
    if (res && res.rawCommand && res.rawCommand !== cmd) {
      this.lessonSessionHistory.push(res.rawCommand);
    }
    this.updateGuiInspector();

    if (!this.currentLesson) return;

    // Se o comando gerou um erro de execução no terminal (ex: sintaxe incorreta, diretório já existe),
    // a lição não deve ser validada como concluída (exceto na lição de fallback ||)
    if (res && res.type === 'error' && this.currentLesson.id !== 'bash-or-fallback') {
      return;
    }

    const isCorrect = LessonChecker.check(
      this.currentLesson,
      cmd,
      output,
      fs,
      {
        git: this.git,
        docker: this.docker,
        sql: this.sql,
        ansible: this.ansible,
        commandEngine: this.commandEngine,
        sessionHistory: this.lessonSessionHistory,
        res: res
      }
    );

    if (isCorrect) {
      const wasAlready = this.completedLessons.has(this.currentLesson.id);
      this.completedLessons.add(this.currentLesson.id);
      this.saveProgress();
      this.renderLessonLists();
      this.showCompletionBar();

      if (!wasAlready) {
        this.checkMilestones();
      }
    }
  }

  showCompletionBar() {
    const bar = document.getElementById('completionBar');
    const msg = document.getElementById('completionBarMessage');
    const nextBtn = document.getElementById('completionBarNextBtn');

    const termArea = document.getElementById('terminalArea');
    if (termArea) {
      termArea.classList.add('success-pulse');
      setTimeout(() => termArea.classList.remove('success-pulse'), 1200);
    }

    if (!bar) return;
    bar.classList.remove('d-none');

    if (msg) {
      msg.innerHTML = `🎉 <strong>Excelente!</strong> Lição "${this.escapeHtml(this.currentLesson.title)}" concluída!`;
    }

    if (nextBtn) {
      nextBtn.innerHTML = 'Próxima Lição <span class="kbd-badge">n</span> ➔';
      nextBtn.title = 'Pressione \'n\' no teclado para avançar (estilo next do Linux)';
      nextBtn.onclick = () => this.advanceToNextLesson();
    }
    this.terminal.scrollToBottom();
  }

  hideCompletionBar() {
    const bar = document.getElementById('completionBar');
    if (bar) bar.classList.add('d-none');
  }

  advanceToNextLesson() {
    const all = ALL_LESSONS;
    const idx = all.findIndex(l => l.id === this.currentLesson?.id);
    if (idx !== -1 && idx + 1 < all.length) {
      const next = all[idx + 1];
      if (next.category !== this.currentCategory) {
        this.setActiveTab(next.category, false);
      }
      this.selectLesson(next);
    } else if (this.completedLessons.size >= ALL_LESSONS.length && ALL_LESSONS.length > 0) {
      this.showLevelupOverlay('Curso Completo!', `Incrível! Você concluiu todos os ${ALL_LESSONS.length} exercícios do Penguin Gym Linux! 🐧🏆`);
    } else {
      const nextPending = all.find(l => !this.completedLessons.has(l.id));
      if (nextPending) {
        if (nextPending.category !== this.currentCategory) {
          this.setActiveTab(nextPending.category, false);
        }
        this.selectLesson(nextPending);
      }
    }
  }

  navigateRelativeLesson(offset) {
    const all = ALL_LESSONS;
    const idx = all.findIndex(l => l.id === this.currentLesson?.id);
    const targetIdx = idx + offset;
    if (targetIdx >= 0 && targetIdx < all.length) {
      const target = all[targetIdx];
      if (target.category !== this.currentCategory) {
        this.setActiveTab(target.category, false);
      }
      this.selectLesson(target);
    }
  }

  /* =========================================================
     GRAPHICAL INSPECTOR (GUI FILE EXPLORER, GIT/DOCKER, SQL)
     ========================================================= */
  switchGuiTab(tabName) {
    this.activeGuiTab = tabName;
    document.querySelectorAll('.gui-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.guitab === tabName);
    });
    document.querySelectorAll('.gui-pane').forEach(p => {
      p.classList.toggle('active', p.id === `guiPane-${tabName}`);
    });
    this.updateGuiInspector();
  }

  updateGuiInspector() {
    this.renderGuiFiles();
    this.renderGuiTools();
    this.renderGuiSql();
  }

  renderGuiFiles() {
    const pathEl = document.getElementById('guiCurrentPath');
    const listEl = document.getElementById('guiFileList');
    if (pathEl) pathEl.textContent = this.fs.currentPath;
    if (!listEl) return;

    listEl.innerHTML = '';
    const currNode = this.fs.getNode(this.fs.currentPath);
    if (!currNode || currNode.type !== 'directory') return;

    const entries = Object.entries(currNode.children || {}).sort(([a, nodeA], [b, nodeB]) => {
      if (nodeA.type === 'directory' && nodeB.type !== 'directory') return -1;
      if (nodeA.type !== 'directory' && nodeB.type === 'directory') return 1;
      return a.localeCompare(b);
    });

    if (entries.length === 0) {
      listEl.innerHTML = '<div class="output-muted" style="padding:0.5rem;text-align:center;">Diretório vazio</div>';
      return;
    }

    entries.forEach(([name, node]) => {
      const row = document.createElement('div');
      row.className = 'gui-file-item';

      let icon = '📄';
      if (node.type === 'directory') icon = '📁';
      else if (node.type === 'symlink') icon = '🔗';
      else if (name.endsWith('.sh')) icon = '⚙️';
      else if (name.endsWith('.db') || name.endsWith('.csv')) icon = '🗄️';
      else if (name.endsWith('.tar') || name.endsWith('.gz')) icon = '📦';

      const main = document.createElement('div');
      main.className = 'gui-file-main';
      main.innerHTML = `<span class="gui-file-icon">${icon}</span><span class="gui-file-name">${this.escapeHtml(name)}</span>`;

      const meta = document.createElement('span');
      meta.className = 'gui-file-meta';
      const itemCount = Object.keys(node.children || {}).length;
      meta.textContent = node.type === 'directory'
        ? `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`
        : `${node.permissions || 'rw-r--r--'}`;

      row.appendChild(main);
      row.appendChild(meta);

      row.addEventListener('click', () => {
        const resolved = node.type === 'symlink' ? this.fs.getNode(node.target) : node;
        const safeName = name.includes(' ') ? `"${name}"` : name;
        if (resolved && resolved.type === 'directory') {
          this.terminal.runCommandProgrammatically(`cd ${safeName}`);
        } else {
          const previewBox = document.getElementById('guiFilePreview');
          const previewTitle = document.getElementById('guiPreviewTitle');
          const previewBody = document.getElementById('guiPreviewBody');
          if (previewBox && previewTitle && previewBody) {
            const targetNode = resolved || node;
            previewTitle.textContent = `${icon} ${name} (${targetNode.owner || 'user'})`;
            if (!this.fs.hasPermission(targetNode, 'r')) {
              previewBody.textContent = `🔒 Permissão negada (dono: ${targetNode.owner || 'root'}, modo: ${targetNode.permissions || '---------'}).\nDica: use "sudo cat ${safeName}" no terminal.`;
            } else {
              previewBody.textContent = targetNode.content || '(Arquivo vazio)';
            }
            previewBox.classList.remove('d-none');
          }
        }
      });

      listEl.appendChild(row);
    });
  }

  renderGuiTools() {
    const ansibleEl = document.getElementById('guiAnsibleState');
    if (ansibleEl && this.ansible) {
      const nodes = Object.values(this.ansible.nodes || {});
      const recap = this.ansible.lastRecap;
      ansibleEl.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:0.35rem;">
          ${nodes.map(n => {
            const nginxState = n.services && n.services.nginx
              ? (n.services.nginx.active ? '🟢 nginx on' : '⚪ nginx off')
              : (n.packages.has('postgresql') ? '🗄️ postgres' : '⚪ base');
            const pkgsCount = n.packages ? n.packages.size : 0;
            const ufwCount = n.ufwRules ? n.ufwRules.size : 0;
            return `
              <div class="gui-badge-row" style="background:var(--bg-elevated);padding:0.35rem 0.5rem;border-radius:4px;">
                <span>${n.reachable ? '🟢' : '🔴'} <strong>${this.escapeHtml(n.host)}</strong> (${this.escapeHtml(n.ip)})</span>
                <span class="output-muted" style="font-size:0.68rem;">${this.escapeHtml(nginxState)} • ${pkgsCount} pkgs${ufwCount > 0 ? ` • ufw:${ufwCount}` : ''}</span>
              </div>
            `;
          }).join('')}
          ${recap ? `
            <div class="gui-badge-row" style="margin-top:0.2rem;">
              <span>Último Recap (${this.escapeHtml(recap.playbook || 'run')}):</span>
              <span class="gui-pill">ok=${recap.totalOk} chg=${recap.totalChanged}${recap.checkMode ? ' (check)' : ''}</span>
            </div>
          ` : ''}
        </div>
      `;
    }

    const gitEl = document.getElementById('guiGitState');
    if (gitEl) {
      if (!this.git.initialized) {
        gitEl.innerHTML = `
          <div class="gui-badge-row">
            <span>Status:</span>
            <span class="output-muted">Não inicializado</span>
          </div>
          <button type="button" class="gui-action-chip" onclick="window.app.terminal.runCommandProgrammatically('git init')">▶ Executar git init</button>
        `;
      } else {
        const staged = Array.from(this.git.index);
        gitEl.innerHTML = `
          <div class="gui-badge-row">
            <span>Ramificação Atual:</span>
            <span class="gui-pill">🔀 ${this.escapeHtml(this.git.currentBranch)}</span>
          </div>
          <div class="gui-badge-row">
            <span>Ramificações:</span>
            <span>${this.git.branches.map(b => this.escapeHtml(b)).join(', ')}</span>
          </div>
          <div class="gui-badge-row">
            <span>Arquivos em Stage:</span>
            <span>${staged.length > 0 ? staged.map(f => this.escapeHtml(f)).join(', ') : 'Nenhum'}</span>
          </div>
          <div class="gui-badge-row">
            <span>Total de Commits:</span>
            <span class="gui-pill">${this.git.commits.length}</span>
          </div>
          <div class="gui-badge-row">
            <span>Stashes:</span>
            <span>${(this.git.stashes || []).length}</span>
          </div>
        `;
      }
    }

    const dockerEl = document.getElementById('guiDockerState');
    if (dockerEl) {
      const imgs = Array.from(this.docker.images);
      const containers = Array.from(this.docker.containers.values());
      dockerEl.innerHTML = `
        <div class="gui-badge-row">
          <span>Imagens (${imgs.length}):</span>
          <span>${imgs.length > 0 ? imgs.map(i => `<span class="gui-pill">${this.escapeHtml(i)}</span>`).join(' ') : 'Nenhuma'}</span>
        </div>
        <div style="margin-top:0.3rem;font-weight:600;color:var(--text-secondary);">Contêineres (${containers.length}):</div>
        ${containers.length === 0
          ? '<div class="output-muted">Nenhum contêiner criado</div>'
          : containers.map(c => `
            <div class="gui-badge-row" style="background:var(--bg-elevated);padding:0.35rem 0.5rem;border-radius:4px;">
              <span>${c.status.startsWith('Up') ? '🟢' : '⚪'} <strong>${this.escapeHtml(c.name)}</strong> (${this.escapeHtml(c.image)})</span>
              <span class="output-muted" style="font-size:0.68rem;">${this.escapeHtml(c.ports || c.status.split(' ')[0])}</span>
            </div>
          `).join('')}
      `;
    }
  }

  renderGuiSql() {
    const container = document.getElementById('guiSqlTables');
    const select = document.getElementById('guiDbSelect');
    if (!container) return;

    const isLegacy = select && select.value === 'legacy';
    const members = isLegacy ? this.sql.legacyMembers : this.sql.members;

    let html = `
      <div class="gui-table-wrap">
        <div class="gui-table-title">📋 Tabela: members (${members.length} registros)</div>
        <table class="gui-sql-table">
          <thead>
            <tr><th>id</th><th>name</th><th>city</th><th>age</th><th>email</th></tr>
          </thead>
          <tbody>
            ${members.map(m => `
              <tr>
                <td>${m.id}</td>
                <td><strong>${this.escapeHtml(m.name)}</strong></td>
                <td>${this.escapeHtml(m.city)}</td>
                <td>${m.age}</td>
                <td>${m.email ? this.escapeHtml(m.email) : '<span class="ansi-yellow">NULL</span>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    if (isLegacy) {
      html += `
        <div class="gui-table-wrap">
          <div class="gui-table-title">📋 Tabela: plans (${this.sql.plans.length} planos)</div>
          <table class="gui-sql-table">
            <thead>
              <tr><th>id</th><th>name</th><th>monthly_fee</th></tr>
            </thead>
            <tbody>
              ${this.sql.plans.map(p => `
                <tr><td>${p.id}</td><td>${this.escapeHtml(p.name)}</td><td>${p.monthly_fee}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="gui-table-wrap">
          <div class="gui-table-title">📋 Tabela: enrollments (${this.sql.legacyEnrollments.length} registros)</div>
          <table class="gui-sql-table">
            <thead>
              <tr><th>id</th><th>member_id</th><th>plan_id</th><th>started_at</th><th>ended_at</th></tr>
            </thead>
            <tbody>
              ${this.sql.legacyEnrollments.map(e => `
                <tr>
                  <td>${e.id}</td>
                  <td>${e.member_id}</td>
                  <td>${e.plan_id}</td>
                  <td>${e.started_at ? this.escapeHtml(e.started_at) : '-'}</td>
                  <td>${e.ended_at ? this.escapeHtml(e.ended_at) : '<span class="ansi-green">NULL (Ativo)</span>'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    const dbKey = isLegacy ? 'legacy' : 'gym';
    const customMap = (this.sql.customTablesByDb && this.sql.customTablesByDb[dbKey]) || this.sql.customTables || {};
    const customEntries = Object.entries(customMap);
    for (const [tName, tObj] of customEntries) {
      const cols = tObj.columns || [];
      const rows = tObj.rows || [];
      html += `
        <div class="gui-table-wrap">
          <div class="gui-table-title">📋 Tabela: ${this.escapeHtml(tName)} (${rows.length} registros)</div>
          <table class="gui-sql-table">
            <thead>
              <tr>${cols.map(c => `<th>${this.escapeHtml(c)}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rows.length === 0
                ? `<tr><td colspan="${Math.max(1, cols.length)}" class="output-muted">Sem registros</td></tr>`
                : rows.map(r => `<tr>${cols.map(c => `<td>${this.escapeHtml(String(r[c] ?? ''))}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  updateStats() {
    const total = ALL_LESSONS.length;
    const completed = this.completedLessons.size;
    const pct = Math.round((completed / total) * 100);

    const progressText = document.getElementById('progressText');
    if (progressText) {
      progressText.textContent = `${completed} de ${total} concluídos (${pct}%)`;
    }

    const overallFill = document.getElementById('overallProgressFill');
    if (overallFill) {
      overallFill.style.width = `${pct}%`;
    }

    const badge = document.getElementById('userLevelBadge');
    if (badge) {
      let levelTitle = '🌱 Iniciante';
      if (completed >= ALL_LESSONS.length && ALL_LESSONS.length > 0) levelTitle = '🐧 Mestre Supremo';
      else if (completed >= 180) levelTitle = '🔥 Veterano DevOps';
      else if (completed >= 120) levelTitle = '🏆 Especialista';
      else if (completed >= 70) levelTitle = '⚡ Avançado';
      else if (completed >= 30) levelTitle = '📁 Praticante';
      else if (completed >= 10) levelTitle = '📖 Aprendiz';
      badge.textContent = levelTitle;
    }

    LESSON_CATEGORIES.forEach(cat => {
      const catLessons = ALL_LESSONS.filter(l => l.category === cat.id);
      const catCompleted = catLessons.filter(l => this.completedLessons.has(l.id)).length;
      const progSpan = document.getElementById(`tabProgress-${cat.id}`);
      if (progSpan) {
        progSpan.textContent = `${catCompleted}/${catLessons.length}`;
      }
    });
  }

  checkMilestones() {
    const count = this.completedLessons.size;
    if (count === 10) {
      this.showLevelupOverlay('Nível 2 Desbloqueado: Aprendiz!', '10 exercícios concluídos! Seus comandos começam a fluir naturalmente.');
    } else if (count === 30) {
      this.showLevelupOverlay('Nível 3 Desbloqueado: Praticante!', '30 lições dominadas! Você já sabe navegar, manipular arquivos, redes e serviços com facilidade.');
    } else if (count === 70) {
      this.showLevelupOverlay('Nível 4 Desbloqueado: Avançado!', '70 lições dominadas! Processos, filtros, scripts e ferramentas modernas estão no seu cinto.');
    } else if (count === 120) {
      this.showLevelupOverlay('Nível 5 Desbloqueado: Especialista Linux!', '120 exercícios superados! Você atingiu proficiência de administrador de sistemas.');
    } else if (count === 180) {
      this.showLevelupOverlay('Nível 6 Desbloqueado: Veterano DevOps!', '180 missões vencidas! Git, Docker, Redes, SQL e Troubleshooting já fazem parte do seu arsenal.');
    } else if (count >= ALL_LESSONS.length && ALL_LESSONS.length > 0) {
      this.showLevelupOverlay('Campeão do Terminal: Mestre Supremo Linux!', `Parabéns! Todas as ${ALL_LESSONS.length} missões do Penguin Gym foram completadas com 100% de maestria! 🐧🏆`);
    }
  }

  showLevelupOverlay(title, msg) {
    const overlay = document.getElementById('levelupOverlay');
    const titleEl = document.getElementById('levelupTitle');
    const msgEl = document.getElementById('levelupMessage');
    if (overlay && titleEl && msgEl) {
      titleEl.textContent = title;
      msgEl.textContent = msg;
      overlay.classList.remove('d-none');
    }
  }

  hideLevelupOverlay() {
    const overlay = document.getElementById('levelupOverlay');
    if (overlay) overlay.classList.add('d-none');
  }

  setupEventListeners() {
    // Atalhos Globais de Teclado (Navegação rápida sem mouse)
    document.addEventListener('keydown', (e) => {
      // Ignora atalhos se editores estiverem abertos
      if (document.getElementById('nanoEditorOverlay') || document.getElementById('lessPagerOverlay')) return;
      const confirmModal = document.getElementById('confirmModal');
      if (confirmModal && !confirmModal.classList.contains('d-none')) {
        if (e.key === 'Escape') {
          e.preventDefault();
          confirmModal.classList.add('d-none');
        }
        return;
      }

      const activeEl = document.activeElement;
      const isOtherEditable = activeEl && activeEl.id !== 'terminalInput' && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.tagName === 'SELECT' ||
        activeEl.isContentEditable
      );

      // Modal de conquista (Level Up)
      const levelOverlay = document.getElementById('levelupOverlay');
      if (levelOverlay && !levelOverlay.classList.contains('d-none')) {
        if (e.key === 'Escape' || e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          this.hideLevelupOverlay();
        }
        return;
      }

      if (isOtherEditable) return;

      const completionBar = document.getElementById('completionBar');
      const isCompletionVisible = completionBar && !completionBar.classList.contains('d-none');
      const terminalInput = document.getElementById('terminalInput');
      const isInputEmpty = terminalInput ? terminalInput.value.trim() === '' : true;

      // 1. Tecla 'n' ou 'N' para avançar quando a lição está concluída (estilo 'next' dos utilitários Linux)
      if ((e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (isCompletionVisible && isInputEmpty) {
          e.preventDefault();
          e.stopPropagation();
          if (this.terminal && typeof this.terminal.suppressCharOnce === 'function') {
            this.terminal.suppressCharOnce('n');
          }
          if (terminalInput) {
            terminalInput.value = '';
            if (this.terminal && typeof this.terminal.resizeInput === 'function') {
              this.terminal.resizeInput();
            }
          }
          this.advanceToNextLesson();
          return;
        }
      }

      // 2. Atalhos com Alt em qualquer momento: Alt+N (próxima lição) e Alt+P (lição anterior)
      if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        this.advanceToNextLesson();
        return;
      }
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        this.navigateRelativeLesson(-1);
        return;
      }
    });

    // Mobile sidebar drawer toggle
    const mobileToggleBtn = document.getElementById('btnMobileSidebarToggle');
    const sidebarEl = document.getElementById('appSidebar');
    const mobileChevron = document.getElementById('mobileSidebarChevron');
    if (mobileToggleBtn && sidebarEl) {
      mobileToggleBtn.addEventListener('click', () => {
        const isOpen = sidebarEl.classList.toggle('mobile-open');
        mobileToggleBtn.setAttribute('aria-expanded', String(isOpen));
        if (mobileChevron) mobileChevron.textContent = isOpen ? '▴' : '▾';
      });
    }

    // Search input
    const searchInput = document.getElementById('lessonSearchInput');
    if (searchInput) {
      const handleSearch = (e) => {
        this.searchQuery = e.target.value;
        this.renderLessonLists();
      };
      searchInput.addEventListener('input', handleSearch);
      searchInput.addEventListener('search', handleSearch);
    }

    // Prev / Next lesson buttons
    const prevBtn = document.getElementById('btnPrevLesson');
    const nextBtn = document.getElementById('btnNextLesson');
    if (prevBtn) prevBtn.addEventListener('click', () => this.navigateRelativeLesson(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => this.navigateRelativeLesson(1));

    // Hint toggle
    const hintBtn = document.getElementById('hintButton');
    const hintContent = document.getElementById('hintContent');
    if (hintBtn && hintContent) {
      hintBtn.addEventListener('click', () => {
        const isHidden = hintContent.classList.contains('d-none');
        hintContent.classList.toggle('d-none', !isHidden);
        hintBtn.innerHTML = isHidden
          ? '<span class="hint-icon">💡</span> <span class="hint-text">Ocultar Dica</span>'
          : '<span class="hint-icon">💡</span> <span class="hint-text">Mostrar Dica</span>';
      });
    }

    // Answer toggle
    const answerBtn = document.getElementById('answerButton');
    const answerContent = document.getElementById('answerContent');
    if (answerBtn && answerContent) {
      answerBtn.addEventListener('click', () => {
        const isHidden = answerContent.classList.contains('d-none');
        answerContent.classList.toggle('d-none', !isHidden);
        answerBtn.innerHTML = isHidden
          ? '<span class="ans-icon">🔑</span> <span class="ans-text">Ocultar Solução</span>'
          : '<span class="ans-icon">🔑</span> <span class="ans-text">Ver Solução</span>';
      });
    }

    // Run Solution button (1-click execution!)
    const runSolBtn = document.getElementById('btnRunSolution');
    const insertAnsBtn = document.getElementById('btnInsertAnswer');
    const executeCurrentSolution = () => {
      if (!this.currentLesson || !this.currentLesson.answer) return;
      const steps = this.currentLesson.answerSteps && this.currentLesson.answerSteps.length > 0
        ? this.currentLesson.answerSteps
        : [this.currentLesson.answer];
      steps.forEach(step => {
        this.terminal.runCommandProgrammatically(step);
      });
      // Se o comando abriu o editor nano (ex: nano script.sh ou crontab -e), mostra o editor preenchido antes de gravar e fechar
      const nanoTextarea = document.getElementById('nanoTextarea');
      const nanoSaveBtn = document.getElementById('nanoSaveBtn');
      const nanoExitBtn = document.getElementById('nanoExitBtn');
      if (nanoTextarea && nanoSaveBtn) {
        if (this.currentLesson.id === 'sys-crontab-edit') {
          if (!nanoTextarea.value.includes('/bin/true')) {
            nanoTextarea.value = nanoTextarea.value.trimEnd() + '\n0 4 * * * /bin/true\n';
          }
        } else if (!nanoTextarea.value.trim()) {
          nanoTextarea.value = '#!/bin/bash\necho "ok"\n';
        }
        nanoTextarea.dispatchEvent(new Event('input'));
        setTimeout(() => {
          if (!nanoSaveBtn.isConnected) return;
          nanoSaveBtn.click();
          setTimeout(() => {
            if (nanoExitBtn && nanoExitBtn.isConnected) nanoExitBtn.click();
          }, 420);
        }, 420);
      }
    };
    if (runSolBtn) runSolBtn.addEventListener('click', executeCurrentSolution);
    if (insertAnsBtn) insertAnsBtn.addEventListener('click', executeCurrentSolution);

    // Copy Answer button
    const copyAnsBtn = document.getElementById('btnCopyAnswer');
    if (copyAnsBtn) {
      copyAnsBtn.addEventListener('click', () => {
        if (!this.currentLesson) return;
        navigator.clipboard?.writeText(this.currentLesson.answer);
        copyAnsBtn.textContent = '✓ Copiado!';
        setTimeout(() => { copyAnsBtn.textContent = '📋 Copiar'; }, 1500);
      });
    }

    // Toggle GUI Panel
    const toggleGuiBtn = document.getElementById('btnToggleGuiPanel');
    const guiInspector = document.getElementById('guiInspector');
    if (toggleGuiBtn && guiInspector) {
      toggleGuiBtn.addEventListener('click', () => {
        const isHidden = guiInspector.classList.toggle('d-none');
        toggleGuiBtn.classList.toggle('active-toggle', !isHidden);
      });
    }

    // GUI Tabs
    document.querySelectorAll('.gui-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchGuiTab(tab.dataset.guitab);
      });
    });

    // GUI File Explorer buttons
    const upBtn = document.getElementById('btnGuiUpDir');
    const homeBtn = document.getElementById('btnGuiHomeDir');
    const listBtn = document.getElementById('btnGuiListDir');
    const newFolderBtn = document.getElementById('btnGuiNewFolder');
    const newFileBtn = document.getElementById('btnGuiNewFile');
    const createPrompt = document.getElementById('guiCreatePrompt');
    const createInput = document.getElementById('guiCreateInput');
    const createConfirmBtn = document.getElementById('btnGuiCreateConfirm');
    const createCancelBtn = document.getElementById('btnGuiCreateCancel');
    const closePreviewBtn = document.getElementById('btnClosePreview');

    let pendingCreateKind = 'dir';
    const nextAvailableName = (base, ext = '') => {
      let candidate = `${base}${ext}`;
      let idx = 2;
      while (this.fs.getRawNode(candidate)) {
        candidate = `${base}_${idx}${ext}`;
        idx++;
      }
      return candidate;
    };
    const openCreatePrompt = (kind) => {
      pendingCreateKind = kind;
      if (!createPrompt || !createInput) {
        const cmd = kind === 'dir' ? `mkdir ${nextAvailableName('nova_pasta')}` : `touch ${nextAvailableName('arquivo', '.txt')}`;
        this.terminal.runCommandProgrammatically(cmd);
        return;
      }
      createPrompt.classList.remove('d-none');
      createInput.value = kind === 'dir' ? nextAvailableName('nova_pasta') : nextAvailableName('arquivo', '.txt');
      createInput.placeholder = kind === 'dir' ? 'Nome da pasta...' : 'Nome do arquivo...';
      createInput.focus();
      createInput.select();
    };
    const submitCreatePrompt = () => {
      if (!createInput || !createPrompt) return;
      const rawName = createInput.value.trim();
      createPrompt.classList.add('d-none');
      if (!rawName) return;
      const safeArg = /\s/.test(rawName) ? `"${rawName.replace(/"/g, '\\"')}"` : rawName;
      this.terminal.runCommandProgrammatically(pendingCreateKind === 'dir' ? `mkdir ${safeArg}` : `touch ${safeArg}`);
    };

    if (upBtn) upBtn.addEventListener('click', () => this.terminal.runCommandProgrammatically('cd ..'));
    if (homeBtn) homeBtn.addEventListener('click', () => this.terminal.runCommandProgrammatically('cd ~'));
    if (listBtn) listBtn.addEventListener('click', () => this.terminal.runCommandProgrammatically('ls -la'));
    if (newFolderBtn) newFolderBtn.addEventListener('click', () => openCreatePrompt('dir'));
    if (newFileBtn) newFileBtn.addEventListener('click', () => openCreatePrompt('file'));
    if (createConfirmBtn) createConfirmBtn.addEventListener('click', submitCreatePrompt);
    if (createCancelBtn && createPrompt) {
      createCancelBtn.addEventListener('click', () => createPrompt.classList.add('d-none'));
    }
    if (createInput && createPrompt) {
      createInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitCreatePrompt();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          createPrompt.classList.add('d-none');
        }
      });
    }
    if (closePreviewBtn) {
      closePreviewBtn.addEventListener('click', () => {
        document.getElementById('guiFilePreview')?.classList.add('d-none');
      });
    }

    // GUI SQL Selector
    const dbSelect = document.getElementById('guiDbSelect');
    if (dbSelect) {
      dbSelect.addEventListener('change', () => this.renderGuiSql());
    }

    const autoCleanChk = document.getElementById('chkAutoCleanLessons');
    if (autoCleanChk) {
      autoCleanChk.checked = this.autoCleanOnLessonChange;
      autoCleanChk.addEventListener('change', () => {
        this.autoCleanOnLessonChange = autoCleanChk.checked;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('penguinGym_autoClean', String(this.autoCleanOnLessonChange));
        }
      });
    }

    // Terminal Header buttons
    const helpBtn = document.getElementById('btnTerminalHelp');
    const clearBtn = document.getElementById('btnTerminalClear');
    const resetFsBtn = document.getElementById('btnResetFS');

    if (helpBtn) helpBtn.addEventListener('click', () => this.terminal.runCommandProgrammatically('help'));
    if (clearBtn) clearBtn.addEventListener('click', () => this.terminal.clear());
    if (resetFsBtn) {
      resetFsBtn.addEventListener('click', () => {
        this.resetToInitialPoint(true);
      });
    }

    // Reset Progress Modal
    const resetProgBtn = document.getElementById('btnResetProgress');
    const confirmModal = document.getElementById('confirmModal');
    const cancelReset = document.getElementById('cancelReset');
    const confirmReset = document.getElementById('confirmReset');

    if (resetProgBtn && confirmModal) {
      resetProgBtn.addEventListener('click', () => confirmModal.classList.remove('d-none'));
    }
    if (cancelReset && confirmModal) {
      cancelReset.addEventListener('click', () => confirmModal.classList.add('d-none'));
    }
    if (confirmReset && confirmModal) {
      confirmReset.addEventListener('click', () => {
        this.completedLessons.clear();
        localStorage.removeItem(this.storageKey);
        confirmModal.classList.add('d-none');
        this.terminal.clear();
        if (this.commandEngine) this.commandEngine.resetEnvironment(true);
        this.fs.reset();
        if (this.git) this.git.reset();
        if (this.docker) this.docker.reset();
        if (this.sql) this.sql.reset();
        if (this.ansible) this.ansible.reset();
        this.setActiveTab('beginner', true);
        this.updateStats();
        this.terminal.writeLine('<span class="ansi-green">✓ Progresso reiniciado com sucesso!</span>');
      });
    }

    const levelupBtn = document.getElementById('levelupContinueBtn');
    if (levelupBtn) {
      levelupBtn.addEventListener('click', () => this.hideLevelupOverlay());
    }
  }

  formatInlineMarkdown(str) {
    if (!str) return '';
    const codeSlots = [];
    const allocSlot = (html) => {
      const idx = codeSlots.length;
      codeSlots.push(html);
      return `\x00CODE_${idx}\x00`;
    };
    const escaped = this.escapeHtml(str);
    // Preserva blocos multi-linha ```...``` antes do inline `...`
    const withBlocks = escaped.replace(/```(?:[a-zA-Z0-9_-]+)?\n([\s\S]*?)```[ \t]*\n?/g, (_, block) => {
      const trimmed = block.replace(/\n+$/, '');
      return allocSlot(`<pre class="inline-code-block"><code>${trimmed}</code></pre>`);
    });
    const withPlaceholders = withBlocks.replace(/`([^`]+)`/g, (_, code) => {
      return allocSlot(`<code>${code}</code>`);
    });
    const formatted = withPlaceholders
      .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^\w*])\*([^\s*\n][^*\n]*?)\*(?=[^\w*]|$)/g, '$1<em>$2</em>')
      .replace(/\n/g, '<br>');
    return formatted.replace(/\x00CODE_(\d+)\x00/g, (_, idx) => codeSlots[Number(idx)] || '');
  }

  escapeHtml(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
