"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { Exercise } from "@/types/exercises";
import { t } from "@/lib/i18n/translations";
import s from "./ExerciseWidget.module.css";

interface Props {
  exercises: Exercise[];
  backHref: string;
}

type Phase = "question" | "checked";

function isCorrectNumeric(exercise: Exercise, raw: string): boolean {
  const val = parseFloat(raw.replace(",", "."));
  if (isNaN(val)) return false;
  const answer = Number(exercise.answer);
  const tolerance = exercise.tolerance ?? 0;
  return Math.abs(val - answer) <= tolerance;
}

export default function ExerciseWidget({ exercises, backHref }: Props) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [hintOpen, setHintOpen] = useState(false);
  const [stepsOpen, setStepsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [selfRevealed, setSelfRevealed] = useState(false);
  const [selfCheckText, setSelfCheckText] = useState("");
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const ex = exercises[idx];
  const question = ex.question_de;
  const sub = ex.sub_de;
  const hint = ex.hint_de;
  const steps = ex.steps_de;

  const resetState = useCallback(() => {
    setPhase("question");
    setHintOpen(false);
    setStepsOpen(false);
    setInputVal("");
    setSelectedChoice(null);
    setSelfRevealed(false);
    setSelfCheckText("");
  }, []);

  const advance = useCallback(
    (correct: boolean) => {
      const next = [...results, correct];
      if (idx + 1 < exercises.length) {
        setResults(next);
        setIdx(idx + 1);
        resetState();
      } else {
        setResults(next);
        setDone(true);
      }
    },
    [idx, exercises.length, results, resetState],
  );

  const handleCheck = useCallback(() => {
    if (phase === "checked") return;
    setPhase("checked");
  }, [phase]);

  const handleSelfReveal = useCallback(
    (correct: boolean) => {
      setSelfRevealed(true);
      advance(correct);
    },
    [advance],
  );

  const handleNext = useCallback(() => {
    if (ex.type === "numeric") {
      advance(isCorrectNumeric(ex, inputVal));
    } else if (ex.type === "multiple") {
      const correct = ex.choices
        ? selectedChoice === ex.choices.indexOf(String(ex.answer))
        : false;
      advance(correct);
    }
  }, [ex, inputVal, selectedChoice, advance]);

  if (done) {
    const score = results.filter(Boolean).length;
    const total = exercises.length;
    const pct = score / total;
    const starMsg = pct >= 0.9 ? t.exercise.stars3 : pct >= 0.6 ? t.exercise.stars2 : t.exercise.stars1;
    const stars = pct >= 0.9 ? "★★★" : pct >= 0.6 ? "★★☆" : "★☆☆";

    return (
      <div className={s.result}>
        <div className={s.stars}>{stars}</div>
        <h2 className={s.resultTitle}>{t.exercise.resultTitle}</h2>
        <p className={s.resultMsg}>{starMsg}</p>
        <p className={s.resultScore}>{score} / {total}</p>
        <div className={s.resultActions}>
          <button
            className="btn-primary"
            onClick={() => { setIdx(0); setResults([]); setDone(false); resetState(); }}
          >
            {t.exercise.tryAgain}
          </button>
          <Link href={backHref} className="btn-secondary">{t.exercise.backToTopics}</Link>
        </div>
      </div>
    );
  }

  const feedbackCorrect =
    phase === "checked" &&
    (ex.type === "numeric"
      ? isCorrectNumeric(ex, inputVal)
      : ex.type === "multiple"
        ? selectedChoice !== null && ex.choices?.[selectedChoice] === String(ex.answer)
        : false);

  return (
    <div className={s.wrap}>
      <div className={s.progress}>
        <div className={s.progressBar}>
          <div
            className={s.progressFill}
            style={{ width: `${(idx / exercises.length) * 100}%` }}
          />
        </div>
        <span className={s.progressLabel}>{idx + 1} / {exercises.length}</span>
      </div>

      <div className={s.card}>
        <div className={s.meta}>
          <div className={s.difficulty}>
            {[1, 2, 3].map((d) => (
              <span key={d} className={`${s.dot} ${d <= ex.difficulty ? s.active : ""}`} />
            ))}
          </div>
          <span className={s.badge}>{ex.type}</span>
        </div>

        <p className={s.question}>{question}</p>
        {ex.formula && <div className={s.formula}>{ex.formula}</div>}
        {sub && <p className={s.subtext}>{sub}</p>}

        {ex.type === "numeric" && (
          <div className={s.numericRow}>
            <input
              className={`${s.input} ${phase === "checked" ? (feedbackCorrect ? s.correct : s.wrong) : ""}`}
              type="text"
              inputMode="decimal"
              placeholder={t.exercise.placeholder}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={phase === "checked"}
              onKeyDown={(e) => e.key === "Enter" && phase === "question" && handleCheck()}
            />
            {ex.unit && <span>{ex.unit}</span>}
          </div>
        )}

        {ex.type === "multiple" && ex.choices && (
          <div className={s.choices}>
            {ex.choices.map((c, i) => {
              let cls = s.choice;
              if (phase === "checked") {
                if (c === String(ex.answer)) cls += ` ${s.correct}`;
                else if (i === selectedChoice) cls += ` ${s.wrong}`;
              } else if (i === selectedChoice) {
                cls += ` ${s.selected}`;
              }
              return (
                <button
                  key={i}
                  className={cls}
                  disabled={phase === "checked"}
                  onClick={() => setSelectedChoice(i)}
                >
                  {c}
                </button>
              );
            })}
          </div>
        )}

        {ex.type === "self-check" && !selfRevealed && (
          <div className={s.selfWriteArea}>
            <textarea
              className={s.selfTextarea}
              placeholder={t.exercise.selfCheckPlaceholder}
              value={selfCheckText}
              onChange={(e) => setSelfCheckText(e.target.value)}
              rows={4}
            />
            <div className={s.selfRow}>
              <button
                className="btn-primary"
                onClick={() => setSelfRevealed(true)}
                disabled={!selfCheckText.trim()}
              >
                {t.exercise.steps}
              </button>
              <Link href={backHref} className="btn-ghost">{t.exercise.back}</Link>
            </div>
          </div>
        )}

        {ex.type === "self-check" && selfRevealed && (
          <div className={s.selfCompare}>
            <div className={s.selfBlock}>
              <span className={s.selfLabel}>{t.exercise.selfCheckYourAnswer}</span>
              <div className={s.selfAttempt}>{selfCheckText}</div>
            </div>
            <div className={s.selfBlock}>
              <span className={s.selfLabel}>{t.exercise.selfCheckModelAnswer}</span>
              <div className={s.selfModel}>{String(ex.answer ?? "")}</div>
            </div>
            {steps && steps.length > 0 && (
              <div className={s.steps}>
                {steps.map((step, i) => (
                  <div key={i} className={s.step}>{step}</div>
                ))}
              </div>
            )}
            <div className={s.selfRow}>
              <button className="btn-primary" onClick={() => handleSelfReveal(true)}>
                {t.exercise.reveal}
              </button>
              <button className="btn-secondary" onClick={() => handleSelfReveal(false)}>
                {t.exercise.notYet}
              </button>
            </div>
          </div>
        )}

        {hint && !selfRevealed && (
          <>
            <button
              className="btn-ghost"
              onClick={() => setHintOpen((v) => !v)}
              style={{ alignSelf: "flex-start", padding: "4px 0" }}
            >
              {hintOpen ? t.exercise.hideHint : t.exercise.hint}
            </button>
            {hintOpen && <div className={s.hint}>{hint}</div>}
          </>
        )}

        {steps && steps.length > 0 && ex.type !== "self-check" && (
          <>
            <button
              className="btn-ghost"
              onClick={() => setStepsOpen((v) => !v)}
              style={{ alignSelf: "flex-start", padding: "4px 0" }}
            >
              {stepsOpen ? t.exercise.hideHint : t.exercise.steps}
            </button>
            {stepsOpen && (
              <div className={s.steps}>
                {steps.map((step, i) => (
                  <div key={i} className={s.step}>{step}</div>
                ))}
              </div>
            )}
          </>
        )}

        {phase === "checked" && ex.type !== "self-check" && (
          <div className={`${s.feedback} ${feedbackCorrect ? s.ok : s.err}`}>
            {feedbackCorrect ? "✓ Richtig!" : `✗ Falsch — Antwort: ${ex.answer}${ex.unit ? ` ${ex.unit}` : ""}`}
          </div>
        )}

        {ex.type !== "self-check" && (
          <div className={s.actions}>
            {phase === "question" ? (
              <button
                className="btn-primary"
                onClick={handleCheck}
                disabled={ex.type === "numeric" ? !inputVal.trim() : selectedChoice === null}
              >
                {t.exercise.check}
              </button>
            ) : (
              <button className="btn-primary" onClick={handleNext}>
                {idx + 1 < exercises.length ? t.exercise.next : t.exercise.resultTitle}
              </button>
            )}
            <Link href={backHref} className="btn-ghost">{t.exercise.back}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
