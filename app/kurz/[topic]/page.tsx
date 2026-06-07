import { notFound } from "next/navigation";
import { readFileSync } from "fs";
import { join } from "path";
import { TOPIC_CONFIGS, type Exercise } from "@/types/exercises";
import ExerciseWidget from "@/components/ExerciseWidget/ExerciseWidget";

interface Props {
  params: Promise<{ topic: string }>;
}

export function generateStaticParams() {
  return TOPIC_CONFIGS.filter((t) => t.track === "kurz").map((t) => ({ topic: t.slug }));
}

export default async function KurzTopicPage({ params }: Props) {
  const { topic } = await params;
  const config = TOPIC_CONFIGS.find((t) => t.slug === topic && t.track === "kurz");
  if (!config) notFound();

  const filePath = join(process.cwd(), "content", "exercises", config.file);
  const exercises: Exercise[] = JSON.parse(readFileSync(filePath, "utf-8"));

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <ExerciseWidget exercises={exercises} backHref="/kurz" />
    </div>
  );
}
