import Link from "next/link";
import { TOPIC_CONFIGS } from "@/types/exercises";
import s from "./page.module.css";

const SESSION_MINUTES = 45;

export default function MockSessionPage() {
  const tasks = TOPIC_CONFIGS.map((topic, index) => ({
    id: `${topic.track}-${topic.slug}`,
    title: topic.title_de,
    track: topic.track,
    order: index + 1,
  }));

  return (
    <div className={s.wrap}>
      <section className="section-heading section-block">
        <span className="eyebrow">Mock exam session</span>
        <h1>Timed ZAP practice session</h1>
        <p>
          This page prepares the session model for a real timer, answer saving, and score calculation. The current version is intentionally static and safe for PR2.
        </p>
      </section>

      <section className={s.sessionPanel}>
        <div className={s.timerCard}>
          <span className={s.timerValue}>{SESSION_MINUTES}:00</span>
          <span className={s.timerLabel}>planned duration</span>
          <p>Next step: convert this to a client timer with pause, resume, auto-save, and submit states.</p>
        </div>

        <div className={s.taskList}>
          {tasks.map((task) => (
            <Link key={task.id} href={`/${task.track}/${task.id.replace(`${task.track}-`, "")}`} className={s.taskRow}>
              <span>Task {task.order}</span>
              <strong>{task.title}</strong>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
