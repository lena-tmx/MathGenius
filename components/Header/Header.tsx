import Link from "next/link";
import { t } from "@/lib/i18n/translations";
import s from "./Header.module.css";

export default function Header() {
  return (
    <header className={s.header}>
      <div className={s.inner}>
        <Link href="/" className={s.brand}>
          <span className={s.brandMark} aria-hidden="true">
            <svg viewBox="0 0 64 64">
              <rect x="6" y="6" width="52" height="52" rx="16" />
              <path d="M20 22h10" />
              <path d="M25 17v10" />
              <path d="M36 20l8 8" />
              <path d="M44 20l-8 8" />
              <path d="M18 42h12" />
              <path d="M18 47h12" />
              <path d="M38 38h8" />
            </svg>
          </span>
          <span className={s.brandName}>MathGenius</span>
        </Link>

        <nav className={s.nav} aria-label="Hauptnavigation">
          <Link href="/gymi" className={s.navLink}>{t.nav.exams}</Link>
          <Link href="/kurz" className={s.navLink}>{t.nav.kurz}</Link>
          <Link href="/lang" className={s.navLink}>{t.nav.lang}</Link>
        </nav>

        <div className={s.controls}>
          <Link href="/login" className={s.loginBtn}>{t.nav.login}</Link>
        </div>
      </div>
    </header>
  );
}
