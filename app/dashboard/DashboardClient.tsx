"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/i18n/api-client";
import { clearStoredAuthToken, getStoredAuthToken } from "@/lib/i18n/auth";
import { TOPIC_CONFIGS } from "@/types/exercises";
import type { ProgressResponse, StudyPlanResponse } from "@/types/api";
import s from "./page.module.css";

type LoadState = "loading" | "ready" | "signed-out" | "error";

function clearAuthCookie(): void {
  document.cookie = "mathgenius.authToken=; Path=/; Max-Age=0; SameSite=Lax";
}

export default function DashboardClient() {
  const [state, setState] = useState<LoadState>("loading");
  const [token, setToken] = useState<string | null>(null);
  const [accountName, setAccountName] = useState("Learner");
  const [progress, setProgress] = useState<ProgressResponse>([]);
  const [plan, setPlan] = useState<StudyPlanResponse | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = getStoredAuthToken();

    if (!storedToken) {
      setState("signed-out");
      return;
    }

    setToken(storedToken);

    Promise.all([
      apiClient.me(storedToken),
      apiClient.listProgress(storedToken),
      apiClient.getStudyPlan(storedToken).catch(() => null),
    ])
      .then(([me, progressResponse, planResponse]) => {
        setAccountName(me.account.display_name || me.account.email);
        setProgress(progressResponse);
        setPlan(planResponse);
        setState("ready");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Dashboard loading failed");
        setState("error");
      });
  }, []);

  const completedSlugs = useMemo(
    () => new Set(progress.filter((entry) => entry.status === "completed").map((entry) => entry.topic_slug)),
    [progress],
  );

  const practicingSlugs = useMemo(
    () => new Set(progress.filter((entry) => entry.status === "practicing" || entry.status === "started").map((entry) => entry.topic_slug)),
    [progress],
  );

  const completionRate = TOPIC_CONFIGS.length === 0 ? 0 : Math.round((completedSlugs.size / TOPIC_CONFIGS.length) * 100);

  async function markCompleted(topicSlug: string) {
    if (!token) return;

    setMessage(null);

    try {
      const entry = await apiClient.addProgress(token, {
        topicSlug,
        status: "completed",
        score: 100,
      });

      setProgress((current) => [
        ...current.filter((item) => item.topic_slug !== topicSlug),
        entry,
      ]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save progress");
    }
  }

  function handleLogout() {
    clearStoredAuthToken();
    clearAuthCookie();
    window.location.href = "/login";
  }

  if (state === "loading") {
    return (
      <div className="section-heading section-block">
        <span className="eyebrow">Loading</span>
        <h1>Loading your progress…</h1>
        <p>We are reading your saved learning state.</p>
      </div>
    );
  }

  if (state === "signed-out") {
    return (
      <div className="section-heading section-block">
        <span className="eyebrow">Account required</span>
        <h1>Please log in first</h1>
        <p>Your progress is saved only when you are signed in.</p>
        <Link className="btn-primary" href="/login?next=/dashboard">Go to login</Link>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="section-heading section-block">
        <span className="eyebrow">Error</span>
        <h1>Could not load dashboard</h1>
        <p>{message ?? "Please log in again."}</p>
        <Link className="btn-primary" href="/login?next=/dashboard">Go to login</Link>
      </div>
    );
  }

  return (
    <div className={s.wrap}>
      <section className={s.header}>
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Welcome, {accountName}</h1>
          <p>Your progress is loaded from the backend and saved per account.</p>
        </div>
        <button className="btn-secondary" type="button" onClick={handleLogout}>Log out</button>
      </section>

      <section className={s.statsGrid}>
        <article className={s.statCard}>
          <span className={s.statValue}>{completionRate}%</span>
          <span className={s.statLabel}>Completed</span>
        </article>
        <article className={s.statCard}>
          <span className={s.statValue}>{completedSlugs.size}</span>
          <span className={s.statLabel}>Finished topics</span>
        </article>
        <article className={s.statCard}>
          <span className={s.statValue}>{plan?.topic_slugs?.length ?? 0}</span>
          <span className={s.statLabel}>Planned topics</span>
        </article>
      </section>

      {message && <p className={s.message}>{message}</p>}

      <section className={s.panel}>
        <div className={s.panelHeader}>
          <span className="eyebrow">Saved progress</span>
          <h2>Topic state</h2>
        </div>
        <div className={s.topicList}>
          {TOPIC_CONFIGS.map((topic) => {
            const completed = completedSlugs.has(topic.slug);
            const active = practicingSlugs.has(topic.slug);
            const href = `/${topic.track}/${topic.slug}`;

            return (
              <article key={topic.slug} className={s.topicRow}>
                <div>
                  <h3>{topic.title_de}</h3>
                  <p>{completed ? "Completed" : active ? "In progress" : "Not started"}</p>
                </div>
                <div className={s.topicActions}>
                  <Link className="btn-secondary" href={href}>Practice</Link>
                  <button className="btn-primary" type="button" onClick={() => markCompleted(topic.slug)} disabled={completed}>
                    {completed ? "Saved" : "Mark done"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
