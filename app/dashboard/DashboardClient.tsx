"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { TOPIC_CONFIGS } from "@/types/exercises";
import s from "./page.module.css";

type LoadState = "loading" | "ready" | "signed-out" | "error";
type TopicProgressStatus = "started" | "practicing" | "completed";

interface UserTopicProgress {
  id: string;
  user_id: string;
  topic_slug: string;
  status: TopicProgressStatus;
  completed_count: number;
  total_count: number;
  score: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
}

export default function DashboardClient() {
  const [state, setState] = useState<LoadState>("loading");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserTopicProgress[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function loadDashboard() {
      setState("loading");
      setMessage(null);

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setState("signed-out");
        return;
      }

      const displayName =
        typeof userData.user.user_metadata?.display_name === "string"
          ? userData.user.user_metadata.display_name
          : (userData.user.email ?? "Learner");

      setUser({
        id: userData.user.id,
        email: userData.user.email ?? "",
        displayName,
      });

      const { data, error } = await supabase
        .from("user_topic_progress")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("updated_at", { ascending: false });

      if (error) {
        setMessage("Could not load your progress. Please try again.");
        setState("error");
        return;
      }

      setProgress((data ?? []) as UserTopicProgress[]);
      setState("ready");
    }

    loadDashboard();
  }, []);

  const completedSlugs = useMemo(
    () =>
      new Set(
        progress
          .filter((entry) => entry.status === "completed")
          .map((entry) => entry.topic_slug),
      ),
    [progress],
  );

  const practicingSlugs = useMemo(
    () =>
      new Set(
        progress
          .filter(
            (entry) =>
              entry.status === "practicing" || entry.status === "started",
          )
          .map((entry) => entry.topic_slug),
      ),
    [progress],
  );

  const completionRate =
    TOPIC_CONFIGS.length === 0
      ? 0
      : Math.round((completedSlugs.size / TOPIC_CONFIGS.length) * 100);

  async function markCompleted(topicSlug: string) {
    if (!user) return;

    const supabase = createSupabaseBrowserClient();
    setMessage(null);

    const totalCount = 0;

    const { data, error } = await supabase
      .from("user_topic_progress")
      .upsert(
        {
          user_id: user.id,
          topic_slug: topicSlug,
          status: "completed",
          completed_count: totalCount,
          total_count: totalCount,
          score: 100,
          completed_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,topic_slug",
        },
      )
      .select()
      .single();

    if (error) {
      setMessage("Progress could not be saved. Please try again.");
      return;
    }

    const updatedEntry = data as UserTopicProgress;

    setProgress((current) => [
      updatedEntry,
      ...current.filter((item) => item.topic_slug !== topicSlug),
    ]);
  }

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
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
        <Link className="btn-primary" href="/login?next=/dashboard">
          Go to login
        </Link>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="section-heading section-block">
        <span className="eyebrow">Error</span>
        <h1>Could not load dashboard</h1>
        <p>{message ?? "Please try again."}</p>
        <Link className="btn-primary" href="/login?next=/dashboard">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className={s.wrap}>
      <section className={s.header}>
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Welcome, {user?.displayName ?? "Learner"}</h1>
          <p>Your progress is loaded from Supabase and saved per account.</p>
        </div>
        <button className="btn-secondary" type="button" onClick={handleLogout}>
          Log out
        </button>
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
          <span className={s.statValue}>{progress.length}</span>
          <span className={s.statLabel}>Saved topics</span>
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
                  <p>
                    {completed
                      ? "Completed"
                      : active
                        ? "In progress"
                        : "Not started"}
                  </p>
                </div>
                <div className={s.topicActions}>
                  <Link className="btn-secondary" href={href}>
                    Practice
                  </Link>
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => markCompleted(topic.slug)}
                    disabled={completed}
                  >
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
