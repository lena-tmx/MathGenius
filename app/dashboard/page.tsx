import Link from "next/link";
import { getCompletionSummary, getDemoProgress, getTopicHref, getUserRecommendations } from "@/lib/learning/progress";
import { TOPIC_CONFIGS } from "@/types/exercises";
import s from "./page.module.css";

export default function DashboardPage() {
  const progress = getDemoProgress();
  const summary = getCompletionSummary(progress);
  const recommendations = getUserRecommendations(progress);

  return (
    <div className={s.wrap}>
      <section className="section-heading section-block">
        <span className="eyebrow">Learner dashboard</span>
        <h1>Personal learning overview</h1>
        <p>
          This dashboard is prepared for authenticated learners. It currently uses demo progress snapshots and is ready to switch to backend-backed user progress.
        </p>
      </section>

      <section className={s.statsGrid} aria-label="Learning progress summary">
        <article className={s.statCard}>
          <span className={s.statValue}>{summary.completionRate}%</span>
          <span className={s.statLabel}>Completion</span>
        </article>
        <article className={s.statCard}>
          <span className={s.statValue}>{summary.completed}/{summary.total}</span>
          <span className={s.statLabel}>Topics completed</span>
        </article>
        <article className={s.statCard}>
          <span className={s.statValue}>{summary.averageScore ?? "—"}</span>
          <span className={s.statLabel}>Average score</span>
        </article>
      </section>

      <section className={s.grid}>
        <div className={s.panel}>
          <div className={s.panelHeader}>
            <span className="eyebrow">Recommendations</span>
            <h2>What to study next</h2>
          </div>
          <div className={s.list}>
            {recommendations.map((item) => (
              <Link key={item.slug} href={`/${item.track}/${item.slug}`} className={s.recommendation}>
                <span className={s.priority} data-priority={item.priority}>{item.priority}</span>
                <h3>{item.title}</h3>
                <p>{item.reason}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className={s.panel}>
          <div className={s.panelHeader}>
            <span className="eyebrow">Progress state</span>
            <h2>Backend-ready topic state</h2>
          </div>
          <div className={s.topicList}>
            {TOPIC_CONFIGS.map((topic) => {
              const topicProgress = progress.find((entry) => entry.slug === topic.slug);
              return (
                <Link key={topic.slug} href={getTopicHref(topic)} className={s.topicRow}>
                  <span>{topic.title_de}</span>
                  <strong>{topicProgress?.status ?? "not-started"}</strong>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
