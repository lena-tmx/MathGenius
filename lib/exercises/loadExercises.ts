import type { Exercise } from "@/types/exercises";
import terme from "@/content/exercises/terme.json";
import gleichungen from "@/content/exercises/gleichungen.json";
import prozent from "@/content/exercises/prozent.json";
import wahrscheinlichkeit from "@/content/exercises/wahrscheinlichkeit.json";

const EXERCISES_BY_FILE: Record<string, Exercise[]> = {
  "terme.json": terme as Exercise[],
  "gleichungen.json": gleichungen as Exercise[],
  "prozent.json": prozent as Exercise[],
  "wahrscheinlichkeit.json": wahrscheinlichkeit as Exercise[],
};

export function loadExercises(fileName: string): Exercise[] {
  const exercises = EXERCISES_BY_FILE[fileName];

  if (!exercises) {
    throw new Error(`Unknown exercise file: ${fileName}`);
  }

  return exercises;
}
