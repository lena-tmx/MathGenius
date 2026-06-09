import { notFound } from "next/navigation";
import { TOPIC_CONFIGS } from "@/types/exercises";
import ExerciseWidget from "@/components/ExerciseWidget/ExerciseWidget";
import { loadExercises } from "@/lib/exercises/loadExercises";

interface Props {
  params: Promise<{ topic: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return TOPIC_CONFIGS.filter((t) => t.track === "lang").map((t) => ({ topic: t.slug }));
}

export default async function LangTopicPage({ params }: Props) {
  const { topic } = await params;
  const config = TOPIC_CONFIGS.find((t) => t.slug === topic && t.track === "lang");
  if (!config) notFound();

  const exercises = loadExercises(config.file);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <ExerciseWidget exercises={exercises} backHref="/lang" />
    </div>
  );
}
