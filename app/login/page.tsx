import { Suspense } from "react";
import LoginForm from "./LoginForm";
import s from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={s.wrap}>
      <Suspense fallback={<div className={s.card}>Loading login form…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
