"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { validateEmail, validatePassword } from "@/lib/i18n/validation";
import s from "./page.module.css";

type Mode = "login" | "register";

function getAppUrl(): string {
  const browserOrigin = window.location.origin;
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!configuredAppUrl) {
    return browserOrigin;
  }

  try {
    const configuredUrl = new URL(configuredAppUrl);
    const browserUrl = new URL(browserOrigin);
    const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
    const configuredIsLocal = localHosts.has(configuredUrl.hostname);
    const browserIsLocal = localHosts.has(browserUrl.hostname);

    if (configuredIsLocal && !browserIsLocal) {
      return browserOrigin;
    }

    return configuredUrl.origin;
  } catch {
    return browserOrigin;
  }
}

function getSafeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

function getLoginRedirectUrl(email: string, nextPath: string): string {
  const params = new URLSearchParams({
    existing: "1",
    email,
    next: nextPath,
  });

  return `/login?${params.toString()}`;
}

function getConfirmRedirectUrl(appUrl: string, nextPath: string): string {
  const url = new URL("/auth/confirm", appUrl);
  url.searchParams.set("next", nextPath);
  return url.toString();
}

function isEmailNotConfirmedError(error: {
  code?: string;
  message?: string;
}): boolean {
  return (
    error.code === "email_not_confirmed" ||
    error.message?.toLowerCase().includes("email not confirmed") === true
  );
}

function isEmailRateLimitError(error: {
  code?: string;
  message?: string;
}): boolean {
  return (
    error.code === "over_email_send_rate_limit" ||
    error.message?.toLowerCase().includes("email rate limit") === true ||
    error.message?.toLowerCase().includes("rate limit") === true
  );
}

function isExistingUserError(error: {
  code?: string;
  message?: string;
}): boolean {
  const message = error.message?.toLowerCase() ?? "";

  return (
    error.code === "user_already_exists" ||
    message.includes("already registered") ||
    message.includes("already exists") ||
    message.includes("user already")
  );
}

function getAuthFailureMessage(
  mode: Mode,
  error?: { code?: string; message?: string },
): string {
  if (error && isEmailNotConfirmedError(error)) {
    return "Your email address is not confirmed yet. Please check your inbox and confirm your MathGenius account before logging in.";
  }

  if (error && isEmailRateLimitError(error)) {
    return "Too many confirmation emails were requested. Please wait a while before trying again.";
  }

  if (error && isExistingUserError(error)) {
    return "An account with this email already exists. Please log in instead.";
  }

  return mode === "login"
    ? "Login failed. Please check your email and password and try again."
    : "Create account failed. Please check your details and try again.";
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get("next"));

  const [mode, setMode] = useState<Mode>("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [gradeBand, setGradeBand] = useState("5-6");
  const [message, setMessage] = useState<string | null>(null);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const title = useMemo(
    () =>
      mode === "login"
        ? "Log in to MathGenius"
        : "Create your MathGenius account",
    [mode],
  );

  useEffect(() => {
    const existingEmail = searchParams.get("email");

    if (existingEmail) {
      setEmail(existingEmail);
    }

    if (searchParams.get("existing") === "1") {
      setMode("login");
      setMessage(
        "An account with this email already exists. Please log in instead.",
      );
      setShowResendConfirmation(false);
    }

    if (searchParams.get("confirm") === "failed") {
      setMode("login");
      setMessage(
        "Email confirmation could not be completed. Please request a new confirmation email or log in if your account is already confirmed.",
      );
      setShowResendConfirmation(true);
    }
  }, [searchParams]);

  function resetStatus() {
    setMessage(null);
    setShowResendConfirmation(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetStatus();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setMessage(emailError ?? passwordError);
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const appUrl = getAppUrl();

      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: getConfirmRedirectUrl(appUrl, nextPath),
            data: {
              display_name:
                displayName.trim() || email.split("@")[0] || "Learner",
              grade_band: gradeBand,
            },
          },
        });

        if (error) {
          const authError = error as { code?: string; message?: string };

          if (isExistingUserError(authError)) {
            router.replace(getLoginRedirectUrl(email, nextPath));
            return;
          }

          throw error;
        }

        if (data.user?.identities?.length === 0) {
          router.replace(getLoginRedirectUrl(email, nextPath));
          return;
        }

        setMessage(
          "Account created. Please check your email and confirm your MathGenius account before logging in.",
        );
        setShowResendConfirmation(true);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const authError = error as { code?: string; message?: string };

        if (isEmailNotConfirmedError(authError)) {
          setShowResendConfirmation(true);
        }

        throw error;
      }

      router.push(nextPath);
      router.refresh();
    } catch (error) {
      const authError = error as { code?: string; message?: string };
      setMessage(getAuthFailureMessage(mode, authError));
    } finally {
      setLoading(false);
    }
  }

  async function resendConfirmationEmail() {
    const emailError = validateEmail(email);

    if (emailError) {
      setMessage(emailError);
      return;
    }

    setResending(true);
    setMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const appUrl = getAppUrl();

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: getConfirmRedirectUrl(appUrl, nextPath),
        },
      });

      if (error) {
        throw error;
      }

      setMessage("Confirmation email sent. Please check your inbox.");
      setShowResendConfirmation(false);
    } catch (error) {
      const authError = error as { code?: string; message?: string };

      if (isEmailRateLimitError(authError)) {
        setMessage(
          "Too many confirmation emails were requested. Please wait a while before trying again.",
        );
        return;
      }

      setMessage(
        "Confirmation email could not be sent. Please try again later.",
      );
    } finally {
      setResending(false);
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
            resetStatus();
          }}
        >
          Log in
        </button>

        <button
          type="button"
          className={mode === "register" ? s.activeTab : s.tab}
          onClick={() => {
            setMode("register");
            resetStatus();
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

        {showResendConfirmation && (
          <button
            className="btn-secondary"
            type="button"
            onClick={resendConfirmationEmail}
            disabled={resending}
          >
            {resending ? "Sending…" : "Resend confirmation email"}
          </button>
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
