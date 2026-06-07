import Link from "next/link";
import { t } from "@/lib/i18n/translations";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <span className={s.copy}>{t.footer.copy}</span>
        <nav className={s.links} aria-label="Rechtliche Seiten">
          <Link href="/impressum" className={s.link}>{t.footer.impressum}</Link>
          <Link href="/agb" className={s.link}>{t.footer.agb}</Link>
          <Link href="/datenschutz" className={s.link}>{t.footer.datenschutz}</Link>
        </nav>
      </div>
    </footer>
  );
}
