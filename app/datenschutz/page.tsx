import Link from "next/link";
import { t } from "@/lib/i18n/translations";
import s from "./page.module.css";

export default function DatenschutzPage() {
  return (
    <div className={s.wrap}>
      <Link href="/" className={s.back}>{t.legal.back}</Link>
      <h1 className={s.title}>Datenschutzerklärung</h1>
      <div className={s.block}>
        <h2 className={s.blockTitle}>1. Datenschutz auf einen Blick</h2>
        <p>
          Der Betreiber dieser Website nimmt den Schutz Ihrer persönlichen Daten sehr ernst.
          Wir behandeln Ihre Daten vertraulich und entsprechend der schweizerischen
          Datenschutzgesetzgebung (DSG).
        </p>
      </div>
      <div className={s.block}>
        <h2 className={s.blockTitle}>2. Erhebung von Daten</h2>
        <p>
          Beim Besuch dieser Website werden automatisch Informationen durch den Browser übermittelt
          (Server-Log-Dateien). Dazu gehören Browsertyp, Betriebssystem, Referrer-URL und
          IP-Adresse (anonymisiert).
        </p>
      </div>
      <div className={s.block}>
        <h2 className={s.blockTitle}>3. Cookies und lokale Speicherung</h2>
        <p>
          Die Website verwendet localStorage ausschliesslich für die Speicherung Ihrer
          Spracheinstellung. Es werden keine Tracking-Cookies oder Daten von Drittanbietern
          verwendet.
        </p>
      </div>
      <div className={s.block}>
        <h2 className={s.blockTitle}>4. Ihre Rechte</h2>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer gespeicherten Daten.
          Kontaktieren Sie uns unter kontakt@mathgenius.ch.
        </p>
      </div>
    </div>
  );
}
