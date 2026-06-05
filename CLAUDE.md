# MathGenius — Project Context for Claude Code

## Project overview

MathGenius is a web app for Swiss students preparing for the Zurich Gymnasium entrance exam
(Zentrale Aufnahmeprüfung, ZAP). Two tracks: **Langgymnasium** (grade 6) and
**Kurzgymnasium** (grades 8–9). The exam is 90 minutes, math counts for 50% of the grade.

Live reference site the owner wants to match/beat: https://edufox.online

---

## Architecture decisions (agreed, do not change without asking)

- **Vanilla JS SPA** — no framework. Keep it that way. No React, no Vue.
- **No Redis, no SSR** for exercise content. Exercises are static JSON files loaded via `fetch()`.
- **localStorage** for progress and study plan (already implemented in `dist/client/app.js`).
- **Backend** (`dist/server.js`) supports MongoDB, PostgreSQL, and in-memory store — used only
  for auth, not for exercise content.
- **Deployment**: Render.com via `render.yaml`.
- **Two languages**: German (`de`) and English (`en`). All user-facing strings go through the
  `translations` object in `dist/client/app.js`.

---

## Exercise content architecture

Exercises live in `content/exercises/<topic>.json`. Each file is an array of exercise objects.

### Exercise object schema

```json
{
  "id": "terme-001",
  "year": 2025,
  "source": "ZAP2",
  "difficulty": 1,
  "type": "numeric",
  "question_de": "Berechne den Wert des Terms für x = −3 und y = 5.",
  "question_en": "Calculate the value of the term for x = −3 and y = 5.",
  "formula": "4x² − 2y",
  "sub_de": "Setze x = −3 und y = 5 ein.",
  "sub_en": "Substitute x = −3 and y = 5.",
  "answer": 26,
  "unit": "",
  "tolerance": 0.001,
  "hint_de": "Berechne zuerst x²: (−3)² = 9. Dann: 4·9 − 2·5",
  "hint_en": "First calculate x²: (−3)² = 9. Then: 4·9 − 2·5",
  "steps_de": ["(−3)² = 9", "4 · 9 = 36", "2 · 5 = 10", "36 − 10 = 26"],
  "steps_en": ["(−3)² = 9", "4 · 9 = 36", "2 · 5 = 10", "36 − 10 = 26"]
}
```

### Exercise types

| type | answer field | how checked |
|------|-------------|-------------|
| `numeric` | number | `Math.abs(userInput - answer) <= tolerance` |
| `multiple` | string (correct choice) | strict equality |
| `self-check` | string (shown after attempt) | user self-rates |

`self-check` is used for open-ended tasks like "Stelle eine Gleichung auf" — the app shows the
correct answer after the user clicks "Antwort zeigen", then asks "War das richtig?" (Ja/Nein).

### difficulty levels
- `1` = Einfach (straightforward calculation)
- `2` = Mittel (multi-step, some insight needed)
- `3` = Schwer (complex, exam-level challenge)

---

## Topic files to create (priority order)

Each file should have **10 exercises**, ordered difficulty 1→1→2→2→2→2→3→3→3→3.
Use real ZAP tasks from 2022–2025 as the basis, then add similar generated exercises.

| File | Topic (DE) | Topic (EN) | Status |
|------|-----------|-----------|--------|
| `content/exercises/terme.json` | Terme vereinfachen | Simplify expressions | TODO |
| `content/exercises/gleichungen.json` | Gleichungen lösen | Solve equations | TODO |
| `content/exercises/textaufgaben.json` | Textaufgaben | Word problems | TODO |
| `content/exercises/brueche.json` | Brüche & Terme | Fractions & terms | TODO |
| `content/exercises/geometrie.json` | Geometrie (Fläche, Volumen) | Geometry | TODO |
| `content/exercises/prozent.json` | Prozentrechnung | Percentages | TODO |
| `content/exercises/wahrscheinlichkeit.json` | Wahrscheinlichkeit | Probability | TODO |
| `content/exercises/koordinaten.json` | Koordinaten & Spiegelung | Coordinates | TODO |

---

## Real ZAP tasks already extracted (use as seeds)

### From ZAP2 2025
- `terme-001`: Berechne 4x² − 2y für x=−3, y=5 → **26**
- `terme-002`: ggT(72, 180) → **36**
- `terme-003`: 2.45 l in m³ → **0.00245**
- `gleichungen-001`: 2−(52x−27) = 15−5(8x+2) → solve for x
- `prozent-001`: Fahrzeit 16→11 min, Ersparnis in % → **31.25%**
- `wahrsch-001`: Streichhölzer aus 2 Händen (1k+4l | 2k+5l), P(1 kurz + 1 lang)

### From ZAP2 2024
- `terme-004`: kgV(42, 45) → **630** (multiple choice)
- `gleichungen-002`: 5x−2(x+3) = 8x+(2−x) → solve for x
- `prozent-002`: Karotten-Anteil am nicht verkauften Gemüse
- `wahrsch-002`: Kugeln aus 2 Töpfen (2r+3b | 1r+1b+2g), P(verschiedenfarbig)

### From ZAP Langgymnasium 2022
- `textaufgaben-001`: Brezel-Aufgabe (3/5 mit Butter, 3/7 gegessen, 12 übrig) → **35**
- `textaufgaben-002`: Daria rennt zurück — Durchschnittsgeschwindigkeit
- `terme-005`: Berechne (12.32·56)−100.8+(19·4.2)+(56·7.68) clever

---

## UI component: ExerciseWidget

Already prototyped (in this chat session, not yet in codebase). Key behaviour:

```
ExerciseWidget({
  exercises: Exercise[],   // loaded from JSON
  onComplete: (results) => void
})
```

Renders:
1. Progress bar + "X / N" counter
2. Exercise card with: meta badges (year, difficulty), question, formula box, input area
3. Feedback panel (correct/wrong + Lösungsweg steps) — shown after answer
4. Hinweis button (toggles hint, shown before answering)
5. Navigation dots + prev/next buttons
6. Summary screen at the end (score + stars)

Input area variants:
- `numeric`: `<input type="text" inputmode="decimal">` + optional unit label
- `multiple`: 2×2 grid of choice buttons
- `self-check`: "Antwort zeigen" button → reveals answer → "War das richtig?" Ja/Nein

---

## Naming conventions

- JS files: `camelCase`
- JSON keys: `snake_case`
- CSS classes: `kebab-case`
- IDs in HTML: `kebab-case`
- Exercise IDs: `<topic>-<NNN>` e.g. `terme-001`

---

## What NOT to do

- Do not add React, Vue, or any JS framework
- Do not add Redis or any caching layer for exercise content
- Do not add server-side rendering for exercises
- Do not change the existing auth flow in `dist/security/auth.js`
- Do not add new npm dependencies without checking if vanilla JS covers the need
- Do not hardcode exercise content in JS files — always use JSON in `content/exercises/`

---

## Immediate next tasks (in order)

1. Create `content/exercises/terme.json` with 10 exercises
2. Create `content/exercises/gleichungen.json` with 10 exercises
3. Build `dist/client/exercise-widget.js` — the ExerciseWidget component
4. Wire ExerciseWidget into the existing `lang-topic` view in `dist/client/app.js`
5. Load the correct JSON based on which topic the user opened

---

## Key files

| File | Purpose |
|------|---------|
| `dist/client/app.js` | Main SPA logic, routing, translations, state |
| `dist/client/lang-gymi-topic-page.js` | Lang-Gymi topic page component |
| `dist/client/simplify-terms-canvas.js` | Canvas exercise (terms) — already started |
| `dist/content/seed-content.js` | Seed data for topics/tracks/mock exams |
| `dist/store/store.js` | Storage abstraction (mongo/postgres/memory) |
| `render.yaml` | Render.com deployment config |
| `styles.css` | Global styles (CSS variables defined here) |
| `index.html` | SPA shell, all views pre-rendered, JS swaps `.active` class |
