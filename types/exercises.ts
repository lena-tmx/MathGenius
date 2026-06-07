export type ExerciseType = "numeric" | "multiple" | "self-check";

export interface Exercise {
  id: string;
  year?: number;
  source?: string;
  difficulty: 1 | 2 | 3;
  type: ExerciseType;
  question_de: string;
  question_en: string;
  formula?: string;
  sub_de?: string;
  sub_en?: string;
  answer?: number | string;
  unit?: string;
  tolerance?: number;
  choices?: string[];
  hint_de?: string;
  hint_en?: string;
  steps_de?: string[];
  steps_en?: string[];
}

export interface TopicConfig {
  slug: string;
  track: "kurz" | "lang";
  title_de: string;
  title_en: string;
  desc_de: string;
  desc_en: string;
  file: string;
}

export const TOPIC_CONFIGS: TopicConfig[] = [
  {
    slug: "terme",
    track: "lang",
    title_de: "Terme — ZAP-Aufgaben",
    title_en: "Expressions — ZAP Tasks",
    desc_de: "ggT, kgV, Terme einsetzen und geschickt rechnen.",
    desc_en: "GCD, LCM, substitution and smart calculations.",
    file: "terme.json",
  },
  {
    slug: "gleichungen",
    track: "lang",
    title_de: "Gleichungen lösen",
    title_en: "Solve equations",
    desc_de: "Lineare Gleichungen mit Klammern, mehreren Schritten und Brüchen.",
    desc_en: "Linear equations with brackets, multiple steps, and fractions.",
    file: "gleichungen.json",
  },
  {
    slug: "prozent",
    track: "kurz",
    title_de: "Prozentrechnung",
    title_en: "Percentages",
    desc_de: "Prozentwert, Grundwert, Prozentsatz — echte ZAP-Aufgaben.",
    desc_en: "Percentage value, base, rate — real ZAP tasks.",
    file: "prozent.json",
  },
  {
    slug: "wahrscheinlichkeit",
    track: "kurz",
    title_de: "Wahrscheinlichkeit",
    title_en: "Probability",
    desc_de: "Laplace-Wahrscheinlichkeit, Kombinatorik und Baumdiagramme.",
    desc_en: "Laplace probability, combinatorics, and tree diagrams.",
    file: "wahrscheinlichkeit.json",
  },
];
