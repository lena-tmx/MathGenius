import Link from "next/link";
import { t } from "@/lib/i18n/translations";
import s from "./page.module.css";

export default function ImpressumPage() {
  return (
    <div className={s.wrap}>
      <Link href="/" className={s.back}>{t.legal.back}</Link>
      <h1 className={s.title}>Impressum</h1>
      <div className={s.block}>
        <h2 className={s.blockTitle}>Angaben gemäss Art. 3 UWG</h2>
        <p>MathGenius</p>
        <p>Zürich, Schweiz</p>
        <p>E-Mail: kontakt@mathgenius.ch</p>
      </div>
      <div className={s.block}>
        <h2 className={s.blockTitle}>Haftungsausschluss</h2>
        <p>
          Die Inhalte dieser Website wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit,
          Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
        </p>
      </div>
      <div className={s.block}>
        <h2 className={s.blockTitle}>Urheberrecht</h2>
        <p>
          Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem
          schweizerischen Urheberrecht. Die Vervielfältigung, Bearbeitung und Verbreitung bedürfen der
          schriftlichen Zustimmung des Autors.
        </p>
      </div>
    </div>
  );
}
