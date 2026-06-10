"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { validateEmail, validatePassword } from "@/lib/i18n/validation";
import s from "./page.module.css";

type Mode = "login" | "register";

function getAuthFailureMessage(mode: Mode): string {
  return mode === "login"
    ? "Login failed. Please check your email and password and try again."
    : "Create account failed. Please check your details and try again.";
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

  const title = useMemo(
    () =>
      mode === "login"
        ? "Log in to MathGenius"
        : "Create your MathGenius account",
    [mode],
  );

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
      const supabase = createSupabaseBrowserClient();

      if (mode === "register") {
        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${appUrl}/dashboard`,
            data: {
              display_name:
                displayName.trim() || email.split("@")[0] || "Learner",
              grade_band: gradeBand,
            },
          },
        });

        if (error) {
          throw error;
        }

        setMessage(
          "Account created. Please check your email to confirm your account before logging in.",
        );
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setMessage(getAuthFailureMessage(mode));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={s.card}>
      <div className={s.tabs} role="tablist" aria-label="Authentication mode">
        <button
          type="button"
          className={mode === "login" ? s.activeTab : s.tab}
          onClick={() => {
            setMode("login");
            setMessage(null);
          }}
        >
          Log in
        </button>
        <button
          type="button"
          className={mode === "register" ? s.activeTab : s.tab}
          onClick={() => {
            setMode("register");
            setMessage(null);
          }}
        >
          Create account
        </button>
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
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Learner name"
            />
          </label>
        )}

        <label className={s.field}>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
          />
        </label>

        <label className={s.field}>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
        </label>

        {mode === "register" && (
          <label className={s.field}>
            <span>Grade band</span>
            <select
              value={gradeBand}
              onChange={(event) => setGradeBand(event.target.value)}
            >
              <option value="4-5">4-5</option>
              <option value="5-6">5-6</option>
              <option value="7-8">7-8</option>
            </select>
          </label>
        )}

        {message && (
          <p className={s.message} role="alert">
            {message}
          </p>
        )}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading
            ? "Please wait…"
            : mode === "login"
              ? "Log in"
              : "Create account"}
        </button>
      </form>
    </section>
  );
}
