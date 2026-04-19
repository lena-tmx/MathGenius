import { formatMathText } from "./math-text.js";

const WIDGET_UI = {
    de: {
        back: "Zurück",
        task: "Aufgabe",
        of: "von",
        progress: "Fortschritt",
        correctCount: "richtig",
        difficulty: { 1: "Einfach", 2: "Mittel", 3: "Schwer" },
        expression: "Term",
        yourAnswer: "Deine Antwort",
        showHint: "Hinweis zeigen",
        hideHint: "Hinweis ausblenden",
        checkAnswer: "Antwort prüfen",
        showAnswer: "Antwort zeigen",
        selfCheckPrompt: "War das richtig?",
        yes: "Ja",
        no: "Nein",
        correctTitle: "Richtig!",
        correctText: "Gut gemacht.",
        incorrectTitle: "Noch nicht ganz.",
        incorrectText: "So geht es Schritt für Schritt:",
        solution: "Lösungsweg",
        nextTask: "Nächste Aufgabe",
        showResults: "Auswertung zeigen",
        previous: "Zurück",
        next: "Weiter",
        navigation: "Navigation",
        overview: "Aufgaben",
        summaryTitle: "Geschafft!",
        summarySubtitle: "Du hast alle Aufgaben bearbeitet.",
        tryAgain: "Nochmals versuchen",
        source: "Quelle"
    },
    en: {
        back: "Back",
        task: "Task",
        of: "of",
        progress: "Progress",
        correctCount: "correct",
        difficulty: { 1: "Easy", 2: "Medium", 3: "Hard" },
        expression: "Expression",
        yourAnswer: "Your answer",
        showHint: "Show hint",
        hideHint: "Hide hint",
        checkAnswer: "Check answer",
        showAnswer: "Show answer",
        selfCheckPrompt: "Was that correct?",
        yes: "Yes",
        no: "No",
        correctTitle: "Correct!",
        correctText: "Well done.",
        incorrectTitle: "Not quite right.",
        incorrectText: "Here is the step-by-step solution:",
        solution: "Solution",
        nextTask: "Next task",
        showResults: "Show results",
        previous: "Previous",
        next: "Next",
        navigation: "Navigation",
        overview: "Tasks",
        summaryTitle: "Done!",
        summarySubtitle: "You completed all tasks.",
        tryAgain: "Try again",
        source: "Source"
    }
};

export class ExerciseWidget {
    root;
    exercises = [];
    language = "de";
    onComplete = () => {};
    onBack = null;

    currentIndex = 0;
    status = "idle";
    numericInput = "";
    selectedChoice = null;
    hintVisible = false;
    results = [];
    done = false;

    constructor(root, { exercises = [], language = "de", onComplete = () => {}, onBack = null } = {}) {
        this.root = root;
        this.exercises = exercises;
        this.language = language;
        this.onComplete = onComplete;
        this.onBack = onBack;
    }

    show(language) {
        this.root.hidden = false;
        this.language = language;
        this.render();
    }

    hide() {
        this.root.hidden = true;
    }

    setExercises(exercises) {
        this.exercises = exercises;
        this.reset();
    }

    reset() {
        this.currentIndex = 0;
        this.status = "idle";
        this.numericInput = "";
        this.selectedChoice = null;
        this.hintVisible = false;
        this.results = [];
        this.done = false;
        this.render();
    }

    get exercise() {
        return this.exercises[this.currentIndex];
    }

    submitNumeric() {
        const ex = this.exercise;
        if (!ex || this.status !== "idle") return;
        const raw = this.numericInput.trim().replace(",", ".");
        const value = parseFloat(raw);
        if (isNaN(value)) return;
        const correct = Math.abs(value - Number(ex.answer)) <= (ex.tolerance ?? 0.001);
        this.recordResult(correct);
    }

    submitChoice(choice) {
        const ex = this.exercise;
        if (!ex || this.status !== "idle") return;
        this.selectedChoice = choice;
        this.recordResult(String(choice) === String(ex.answer));
    }

    revealAnswer() {
        if (this.status !== "idle") return;
        this.status = "revealed";
        this.render();
    }

    rateSelfCheck(correct) {
        if (this.status !== "revealed") return;
        this.recordResult(correct);
    }

    recordResult(correct) {
        const ex = this.exercise;
        const existing = this.results[this.currentIndex];
        if (!existing) {
            this.results[this.currentIndex] = { id: ex.id, correct };
        }
        this.status = "answered";
        this.render();
    }

    advance() {
        if (this.currentIndex < this.exercises.length - 1) {
            this.navigate(this.currentIndex + 1);
        } else {
            this.done = true;
            this.onComplete(this.results.filter(Boolean));
            this.render();
        }
    }

    navigate(index) {
        if (index < 0 || index >= this.exercises.length) return;
        this.currentIndex = index;
        this.hintVisible = false;
        this.numericInput = "";
        this.selectedChoice = null;
        this.status = this.results[index] ? "answered" : "idle";
        this.render();
    }

    toggleHint() {
        this.hintVisible = !this.hintVisible;
        this.render();
    }

    render() {
        this.root.innerHTML = this.done ? this.renderSummary() : this.renderExercise();
        this.bindEvents();
    }

    renderProgress() {
        const t = WIDGET_UI[this.language];
        const n = this.exercises.length;
        const done = this.results.filter(Boolean).length;
        const pct = n > 0 ? Math.round((done / n) * 100) : 0;
        return `
      <div class="canvas-progress">
        <div class="canvas-progress-meta">
          <span>${t.progress}</span>
          <span>${done} / ${n}</span>
        </div>
        <div class="canvas-progress-bar"><span style="width:${pct}%"></span></div>
      </div>`;
    }

    renderInputArea(ex, t, answered) {
        const lang = this.language;

        if (ex.type === "numeric") {
            const unit = ex.unit ? `<span class="ew-unit">${escapeHtml(ex.unit)}</span>` : "";
            return `
          <div class="canvas-block">
            <label class="canvas-label" for="ew-numeric-input">${t.yourAnswer}</label>
            <div class="ew-input-row">
              <input id="ew-numeric-input" class="canvas-input" type="text" inputmode="decimal"
                value="${escapeHtml(this.numericInput)}" ${answered ? "disabled" : ""} />
              ${unit}
            </div>
          </div>
          ${!answered ? `
            <div class="canvas-actions">
              <button class="primary-button" id="ew-check-btn" type="button">${t.checkAnswer}</button>
              <button class="secondary-button" id="ew-hint-btn" type="button">
                ${this.hintVisible ? t.hideHint : t.showHint}
              </button>
            </div>` : ""}`;
        }

        if (ex.type === "multiple") {
            const choices = ex.choices ?? [];
            return `
          <div class="ew-choices">
            ${choices.map((choice) => {
                let cls = "ew-choice-btn";
                if (answered) {
                    if (String(choice) === String(ex.answer)) cls += " ew-choice-correct";
                    else if (choice === this.selectedChoice) cls += " ew-choice-wrong";
                }
                return `<button class="${cls}" type="button" data-choice="${escapeHtml(String(choice))}"
                  ${answered ? "disabled" : ""}>${escapeHtml(String(choice))}</button>`;
            }).join("")}
          </div>
          ${!answered ? `
            <div class="canvas-actions" style="margin-top:12px">
              <button class="secondary-button" id="ew-hint-btn" type="button">
                ${this.hintVisible ? t.hideHint : t.showHint}
              </button>
            </div>` : ""}`;
        }

        if (ex.type === "self-check") {
            if (this.status === "idle") {
                return `
            <div class="canvas-actions">
              <button class="primary-button" id="ew-reveal-btn" type="button">${t.showAnswer}</button>
              <button class="secondary-button" id="ew-hint-btn" type="button">
                ${this.hintVisible ? t.hideHint : t.showHint}
              </button>
            </div>`;
            }
            if (this.status === "revealed") {
                const answer = ex[`answer_${lang}`] ?? String(ex.answer);
                return `
            <div class="canvas-expression" style="margin-top:14px">
              <p class="canvas-label">${t.solution}</p>
              <div style="font-size:1.05rem;font-weight:600">${escapeHtml(formatMathText(answer))}</div>
            </div>
            <div class="canvas-actions" style="flex-wrap:wrap;gap:12px;align-items:center">
              <span style="font-weight:700;color:var(--text)">${t.selfCheckPrompt}</span>
              <button class="primary-button" id="ew-self-yes" type="button">${t.yes}</button>
              <button class="secondary-button" id="ew-self-no" type="button">${t.no}</button>
            </div>`;
            }
            return "";
        }

        return "";
    }

    renderHintPanel(ex) {
        if (!this.hintVisible) return "";
        const key = `hint_${this.language}`;
        const hint = ex[key] ?? "";
        if (!hint) return "";
        return `
      <div class="canvas-panel accent" style="margin-top:12px">
        <p>${escapeHtml(formatMathText(hint))}</p>
      </div>`;
    }

    renderFeedback(ex, t) {
        if (this.status !== "answered") return "";
        const result = this.results[this.currentIndex];
        if (!result) return "";
        const stepsKey = `steps_${this.language}`;
        const steps = ex[stepsKey] ?? [];
        const stepsHtml = steps.length > 0
            ? `<section class="canvas-panel" style="margin-top:10px">
          <h5 style="margin:0 0 8px;font-size:0.9rem">${t.solution}</h5>
          <ol>${steps.map((s) => `<li>${escapeHtml(formatMathText(s))}</li>`).join("")}</ol>
        </section>` : "";

        if (result.correct) {
            return `
        <div class="canvas-feedback success">
          <h4>${t.correctTitle}</h4>
          <p>${t.correctText}</p>
        </div>
        ${stepsHtml}`;
        }
        return `
      <div class="canvas-feedback warning">
        <h4>${t.incorrectTitle}</h4>
        <p>${t.incorrectText}</p>
        ${stepsHtml}
      </div>`;
    }

    renderNavDots() {
        return `
      <div class="ew-nav-dots">
        ${this.exercises.map((_, i) => {
            const result = this.results[i];
            let cls = "ew-dot";
            if (i === this.currentIndex) cls += " ew-dot-current";
            else if (result?.correct) cls += " ew-dot-correct";
            else if (result && !result.correct) cls += " ew-dot-wrong";
            return `<button class="${cls}" type="button" data-ew-dot="${i}">${i + 1}</button>`;
        }).join("")}
      </div>`;
    }

    renderExercise() {
        const ex = this.exercise;
        if (!ex) return "";
        const t = WIDGET_UI[this.language];
        const lang = this.language;
        const question = ex[`question_${lang}`] ?? "";
        const sub = ex[`sub_${lang}`] ?? "";
        const diffLabel = t.difficulty[ex.difficulty] ?? "";
        const answered = this.status !== "idle";
        const isLast = this.currentIndex === this.exercises.length - 1;
        const canGoBack = this.currentIndex > 0;
        const canGoForward = this.currentIndex < this.exercises.length - 1 && Boolean(this.results[this.currentIndex]);

        return `
      <div class="canvas-shell">
        <header class="canvas-header">
          <div>
            ${this.onBack ? `<button class="secondary-button" id="ew-back-btn" type="button" style="margin-bottom:10px">${t.back}</button>` : ""}
            <span class="canvas-badge">${t.task} ${this.currentIndex + 1} ${t.of} ${this.exercises.length}</span>
            ${ex.source ? `<span class="canvas-badge" style="margin-left:8px;background:#f0fbf7;color:var(--secondary-dark)">${escapeHtml(ex.source)}</span>` : ""}
          </div>
          ${this.renderProgress()}
        </header>

        <div class="canvas-grid">
          <section class="canvas-main">
            <div class="canvas-task-head">
              <div>
                <h4>${escapeHtml(question)}</h4>
                ${sub ? `<p style="margin-top:6px;color:var(--text-soft)">${escapeHtml(sub)}</p>` : ""}
              </div>
              <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0">
                <span class="canvas-level">${diffLabel}</span>
                ${ex.year ? `<span class="canvas-pill">${ex.year}</span>` : ""}
              </div>
            </div>

            ${ex.formula ? `
              <div class="canvas-expression">
                <p class="canvas-label">${t.expression}</p>
                <div>${escapeHtml(formatMathText(ex.formula))}</div>
              </div>` : ""}

            ${this.renderInputArea(ex, t, answered)}
            ${this.renderHintPanel(ex)}
            ${this.renderFeedback(ex, t)}

            ${answered ? `
              <div class="canvas-actions" style="margin-top:18px">
                <button class="primary-button" id="ew-advance-btn" type="button">
                  ${isLast ? t.showResults : t.nextTask}
                </button>
              </div>` : ""}
          </section>

          <aside class="canvas-sidebar">
            <section class="canvas-side-card">
              <h4 style="margin-bottom:14px">${t.overview}</h4>
              ${this.renderNavDots()}
              <div class="canvas-nav-buttons" style="margin-top:16px">
                <button class="secondary-button" id="ew-prev-btn" type="button"
                  ${!canGoBack ? "disabled" : ""}>${t.previous}</button>
                <button class="secondary-button" id="ew-fwd-btn" type="button"
                  ${!canGoForward ? "disabled" : ""}>${t.next}</button>
              </div>
            </section>
          </aside>
        </div>
      </div>`;
    }

    renderSummary() {
        const t = WIDGET_UI[this.language];
        const lang = this.language;
        const total = this.exercises.length;
        const correctCount = this.results.filter((r) => r?.correct).length;
        const pct = total > 0 ? correctCount / total : 0;
        const stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1;
        const starsHtml = "★".repeat(stars) + "☆".repeat(3 - stars);

        return `
      <div class="canvas-shell">
        <div style="text-align:center;padding:28px 0 20px">
          <div style="font-size:2.6rem;letter-spacing:6px;margin-bottom:10px;color:var(--primary)">${starsHtml}</div>
          <h3>${t.summaryTitle}</h3>
          <p>${t.summarySubtitle}</p>
          <p style="margin-top:12px;font-size:1.25rem;font-weight:700;color:var(--primary-dark)">
            ${correctCount} / ${total} ${t.correctCount}
          </p>
        </div>

        <div class="canvas-overview" style="max-width:520px;margin:0 auto 28px">
          ${this.exercises.map((ex, i) => {
            const result = this.results[i];
            const q = ex[`question_${lang}`] ?? ex.id;
            const icon = result?.correct ? "✓" : "✗";
            const color = result?.correct ? "#17624e" : "var(--danger)";
            return `
              <div class="canvas-overview-item" style="cursor:default">
                <div>
                  <strong>${i + 1}. ${escapeHtml(q)}</strong>
                </div>
                <span style="color:${color};font-weight:700;font-size:1.15rem;flex-shrink:0">${icon}</span>
              </div>`;
        }).join("")}
        </div>

        <div style="text-align:center;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="primary-button" id="ew-restart-btn" type="button">${t.tryAgain}</button>
          ${this.onBack ? `<button class="secondary-button" id="ew-back-btn" type="button">${t.back}</button>` : ""}
        </div>
      </div>`;
    }

    bindEvents() {
        const root = this.root;

        const numericInput = root.querySelector("#ew-numeric-input");
        if (numericInput instanceof HTMLInputElement) {
            numericInput.addEventListener("input", (e) => {
                if (e.target instanceof HTMLInputElement) this.numericInput = e.target.value;
            });
            numericInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") this.submitNumeric();
            });
            numericInput.focus();
        }

        root.querySelector("#ew-check-btn")?.addEventListener("click", () => this.submitNumeric());
        root.querySelector("#ew-hint-btn")?.addEventListener("click", () => this.toggleHint());
        root.querySelector("#ew-reveal-btn")?.addEventListener("click", () => this.revealAnswer());
        root.querySelector("#ew-self-yes")?.addEventListener("click", () => this.rateSelfCheck(true));
        root.querySelector("#ew-self-no")?.addEventListener("click", () => this.rateSelfCheck(false));
        root.querySelector("#ew-advance-btn")?.addEventListener("click", () => this.advance());
        root.querySelector("#ew-restart-btn")?.addEventListener("click", () => this.reset());
        root.querySelector("#ew-back-btn")?.addEventListener("click", () => { if (this.onBack) this.onBack(); });

        root.querySelectorAll("[data-choice]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const choice = btn.dataset.choice;
                if (choice !== undefined) this.submitChoice(choice);
            });
        });

        root.querySelector("#ew-prev-btn")?.addEventListener("click", () => this.navigate(this.currentIndex - 1));
        root.querySelector("#ew-fwd-btn")?.addEventListener("click", () => this.navigate(this.currentIndex + 1));

        root.querySelectorAll("[data-ew-dot]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const i = Number(btn.dataset.ewDot);
                if (Number.isFinite(i)) this.navigate(i);
            });
        });
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
