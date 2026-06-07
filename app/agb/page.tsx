import Link from "next/link";
import { t } from "@/lib/i18n/translations";
import s from "./page.module.css";

export default function AgbPage() {
  return (
    <div className={s.wrap}>
      <Link href="/" className={s.back}>{t.legal.back}</Link>
      <h1 className={s.title}>Allgemeine Geschäftsbedingungen (AGB)</h1>
      <div className={s.block}>
        <h2 className={s.blockTitle}>1. Geltungsbereich</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Plattform MathGenius.
          Mit der Nutzung der Website erklären Sie sich mit diesen Bedingungen einverstanden.
        </p>
      </div>
      <div className={s.block}>
        <h2 className={s.blockTitle}>2. Leistungsangebot</h2>
        <p>
          MathGenius bietet eine Lernplattform zur Vorbereitung auf die Zürcher
          Gymnasialaufnahmeprüfung. Das Angebot wird ohne Gewähr bereitgestellt und kann jederzeit
          angepasst werden.
        </p>
      </div>
      <div className={s.block}>
        <h2 className={s.blockTitle}>3. Nutzungsbedingungen</h2>
        <p>
          Die Plattform darf ausschliesslich zu Lernzwecken genutzt werden. Eine kommerzielle
          Nutzung oder Weitergabe der Inhalte ist ohne ausdrückliche Genehmigung nicht gestattet.
        </p>
      </div>
      <div className={s.block}>
        <h2 className={s.blockTitle}>4. Änderungen</h2>
        <p>
          Wir behalten uns vor, diese AGB jederzeit zu ändern. Die aktuelle Version ist stets auf
          dieser Seite abrufbar.
        </p>
      </div>
    </div>
  );
}
