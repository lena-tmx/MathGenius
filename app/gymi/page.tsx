import Link from "next/link";
import { t } from "@/lib/i18n/translations";
import s from "./page.module.css";

export default function GymiPage() {
  return (
    <div>
      <div className="section-heading section-block">
        <span className="eyebrow">ZAP · Zürich</span>
        <h1>{t.gymi.title}</h1>
        <p>{t.gymi.subtitle}</p>
      </div>

      <div className={s.tracks}>
        <Link href="/kurz" className={s.track}>
          <div className={s.trackMark} style={{ background: "var(--primary)" }}>K</div>
          <h2 className={s.trackTitle}>{t.gymi.kurzTitle}</h2>
          <p className={s.trackDesc}>{t.gymi.kurzDesc}</p>
          <div className={s.pillRow}>
            {t.gymi.kurzPillars.map((p) => (
              <span key={p} className={s.pill}>{p}</span>
            ))}
          </div>
          <span className={s.open}>{t.gymi.open} →</span>
        </Link>

        <Link href="/lang" className={s.track}>
          <div className={s.trackMark} style={{ background: "var(--secondary)" }}>L</div>
          <h2 className={s.trackTitle}>{t.gymi.langTitle}</h2>
          <p className={s.trackDesc}>{t.gymi.langDesc}</p>
          <div className={s.pillRow}>
            {t.gymi.langPillars.map((p) => (
              <span key={p} className={s.pill} style={{ borderColor: "var(--secondary)", color: "var(--secondary)" }}>{p}</span>
            ))}
          </div>
          <span className={s.open} style={{ color: "var(--secondary)" }}>{t.gymi.open} →</span>
        </Link>
      </div>
    </div>
  );
}
