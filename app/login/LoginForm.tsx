"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/i18n/api-client";
import { storeAuthToken } from "@/lib/i18n/auth";
import { validateEmail, validatePassword } from "@/lib/i18n/validation";
import s from "./page.module.css";

type Mode = "login" | "register";

function setAuthCookie(token: string): void {
  const maxAgeSeconds = 60 * 60 * 12;
  document.cookie = `mathgenius.authToken=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const [mode, setMode] = useState<Mode>("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gradeBand, setGradeBand] = useState("5-6");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => mode === "login" ? "Log in to MathGenius" : "Create your MathGenius account", [mode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setMessage(emailError ?? passwordError);
      return;
    }

    setLoading(true);

    try {
      const response = mode === "login"
        ? await apiClient.login({ email, password })
        : await apiClient.register({ email, password, displayName, gradeBand });

      storeAuthToken(response.token);
      setAuthCookie(response.token);
      router.push(nextPath);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={s.card}>
      <div className={s.tabs} role="tablist" aria-label="Authentication mode">
        <button type="button" className={mode === "login" ? s.activeTab : s.tab} onClick={() => setMode("login")}>Log in</button>
        <button type="button" className={mode === "register" ? s.activeTab : s.tab} onClick={() => setMode("register")}>Create account</button>
      </div>

      <form className={s.form} onSubmit={handleSubmit} noValidate>
        <div>
          <span className="eyebrow">Account</span>
          <h1>{title}</h1>
          <p>Save your learning plan and progress across topics.</p>
        </div>

        {mode === "register" && (
          <label className={s.field}>
            <span>Name</span>
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Learner name" />
          </label>
        )}

        <label className={s.field}>
          <span>Email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" autoComplete="email" />
        </label>

        <label className={s.field}>
          <span>Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" autoComplete={mode === "login" ? "current-password" : "new-password"} />
        </label>

        {mode === "register" && (
          <label className={s.field}>
            <span>Grade band</span>
            <select value={gradeBand} onChange={(event) => setGradeBand(event.target.value)}>
              <option value="4-5">4-5</option>
              <option value="5-6">5-6</option>
              <option value="7-8">7-8</option>
            </select>
          </label>
        )}

        {message && <p className={s.message} role="alert">{message}</p>}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </section>
  );
}
