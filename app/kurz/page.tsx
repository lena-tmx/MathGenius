import Link from "next/link";
import { t } from "@/lib/i18n/translations";
import { TOPIC_CONFIGS } from "@/types/exercises";
import s from "./page.module.css";

const KURZ_TOPICS = TOPIC_CONFIGS.filter((topic) => topic.track === "kurz");

export default function KurzPage() {
  return (
    <div>
      <div className="section-heading section-block">
        <span className="eyebrow">Kurzgymnasium</span>
        <h1>{t.gymi.kurzTitle}</h1>
        <p>{t.track.topicsSubtitle}</p>
      </div>

      <div className={s.grid}>
        {KURZ_TOPICS.map((topic) => (
          <Link key={topic.slug} href={`/kurz/${topic.slug}`} className={s.card}>
            <h3 className={s.cardTitle}>{topic.title_de}</h3>
            <p className={s.cardDesc}>{topic.desc_de}</p>
            <span className={s.start}>{t.track.startTopic} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
