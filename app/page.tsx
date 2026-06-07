import Link from "next/link";
import { t } from "@/lib/i18n/translations";
import s from "./page.module.css";

export default function HomePage() {
  return (
    <div className={s.wrap}>
      <section className={s.hero}>
        <span className="eyebrow">ZAP · Zürich</span>
        <h1 className={s.heroTitle}>{t.home.title}</h1>
        <p className={s.heroSub}>{t.home.subtitle}</p>
        <div className={s.heroCta}>
          <Link href="/kurz" className="btn-primary">{t.home.openKurz}</Link>
          <Link href="/lang" className="btn-secondary">{t.home.openLang}</Link>
        </div>
      </section>

      <section className={s.cards}>
        <Link href="/kurz" className={s.card}>
          <div className={s.cardIcon} style={{ background: "var(--primary)" }}>
            <span>K</span>
          </div>
          <div className={s.cardBody}>
            <h2 className={s.cardTitle}>{t.gymi.kurzTitle}</h2>
            <p className={s.cardDesc}>{t.gymi.kurzDesc}</p>
            <div className={s.pills}>
              {t.gymi.kurzPillars.map((p) => (
                <span key={p} className={s.pill}>{p}</span>
              ))}
            </div>
            <span className={s.cardCta}>{t.gymi.open} →</span>
          </div>
        </Link>

        <Link href="/lang" className={s.card}>
          <div className={s.cardIcon} style={{ background: "var(--secondary)" }}>
            <span>L</span>
          </div>
          <div className={s.cardBody}>
            <h2 className={s.cardTitle}>{t.gymi.langTitle}</h2>
            <p className={s.cardDesc}>{t.gymi.langDesc}</p>
            <div className={s.pills}>
              {t.gymi.langPillars.map((p) => (
                <span key={p} className={s.pill} style={{ borderColor: "var(--secondary)", color: "var(--secondary)" }}>{p}</span>
              ))}
            </div>
            <span className={s.cardCta} style={{ color: "var(--secondary)" }}>{t.gymi.open} →</span>
          </div>
        </Link>
      </section>
    </div>
  );
}
