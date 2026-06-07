import Link from "next/link";
import { t } from "@/lib/i18n/translations";
import { TOPIC_CONFIGS } from "@/types/exercises";
import s from "./page.module.css";

const LANG_TOPICS = TOPIC_CONFIGS.filter((topic) => topic.track === "lang");

export default function LangPage() {
  return (
    <div>
      <div className="section-heading section-block">
        <span className="eyebrow">Langgymnasium</span>
        <h1>{t.gymi.langTitle}</h1>
        <p>{t.track.topicsSubtitle}</p>
      </div>

      <div className={s.grid}>
        {LANG_TOPICS.map((topic) => (
          <Link key={topic.slug} href={`/lang/${topic.slug}`} className={s.card}>
            <h3 className={s.cardTitle}>{topic.title_de}</h3>
            <p className={s.cardDesc}>{topic.desc_de}</p>
            <span className={s.start}>{t.track.startTopic} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
