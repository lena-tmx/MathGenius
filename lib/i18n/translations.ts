export type Language = "en" | "de";

export const translations = {
  en: {
    nav: {
      exams: "Exams",
      kurz: "Kurz Gymnasium",
      lang: "Lang Gymnasium",
      login: "Log in",
    },
    home: {
      title: "Prepare for the Zurich Gymnasium entrance exam",
      subtitle:
        "Practice the most common mathematics task types for the Zurich ZAP exam. Step-by-step explanations, hints, and real past tasks.",
      openKurz: "Open Kurzgymi",
      openLang: "Open Langgymi",
    },
    gymi: {
      title: "Choose your exam path",
      subtitle: "Select the track that matches your school level and goal.",
      kurzTitle: "Kurzgymnasium",
      kurzDesc:
        "For secondary-school learners aiming for later admission. Focus on algebra, word problems, and timed calculation.",
      kurzPillars: ["Algebra", "Word problems", "Exam strategy"],
      langTitle: "Langgymnasium",
      langDesc:
        "For primary-school learners preparing early. Focus on arithmetic foundations, geometry, and careful written solutions.",
      langPillars: ["Foundations", "Geometry", "Accuracy"],
      open: "Open track",
    },
    track: {
      topicsTitle: "Practice topics",
      topicsSubtitle: "Choose a topic and start with real ZAP-style exercises.",
      startTopic: "Start exercises",
      canvasTitle: "Simplify expressions",
      canvasDesc:
        "Brackets, products, fractions, and square roots — interactive input canvas.",
      openCanvas: "Open canvas",
    },
    exercise: {
      hint: "Show hint",
      hideHint: "Hide hint",
      steps: "Show solution",
      check: "Check answer",
      next: "Next",
      back: "← Back",
      reveal: "I've checked it",
      notYet: "Not yet",
      placeholder: "Your answer",
      resultTitle: "Exercise complete",
      stars3: "Excellent!",
      stars2: "Good job!",
      stars1: "Keep practising!",
      backToTopics: "← Back to topics",
      tryAgain: "Try again",
    },
    legal: {
      back: "← Back",
    },
    footer: {
      copy: "© 2026 MathGenius",
      impressum: "Impressum",
      agb: "AGB",
      datenschutz: "Datenschutz",
    },
  },
  de: {
    nav: {
      exams: "Prüfungen",
      kurz: "Kurz Gymnasium",
      lang: "Lang Gymnasium",
      login: "Anmelden",
    },
    home: {
      title: "Vorbereitung auf die Zürcher Gymnasialaufnahmeprüfung",
      subtitle:
        "Übe die häufigsten Mathematikaufgaben für die Zürcher ZAP. Schritt-für-Schritt-Erklärungen, Hinweise und echte Prüfungsaufgaben.",
      openKurz: "Kurzgymi öffnen",
      openLang: "Langgymi öffnen",
    },
    gymi: {
      title: "Wähle deinen Prüfungsweg",
      subtitle: "Wähle den Track, der zu deiner Schulstufe und deinem Ziel passt.",
      kurzTitle: "Kurzgymnasium",
      kurzDesc:
        "Für Lernende aus der Sekundarstufe mit Fokus auf Algebra, Tempo und mehrschrittige Sachaufgaben.",
      kurzPillars: ["Algebra", "Sachaufgaben", "Prüfungsstrategie"],
      langTitle: "Langgymnasium",
      langDesc:
        "Für die frühe Vorbereitung mit Fokus auf Zahlverständnis, Geometrie und ruhige, genaue Lösungen.",
      langPillars: ["Grundlagen", "Geometrie", "Genauigkeit"],
      open: "Track öffnen",
    },
    track: {
      topicsTitle: "Übungsthemen",
      topicsSubtitle: "Wähle ein Thema und starte mit echten ZAP-Aufgaben.",
      startTopic: "Aufgaben starten",
      canvasTitle: "Terme vereinfachen",
      canvasDesc:
        "Klammern, Produkte, Brüche und Wurzeln — interaktiver Canvas mit Eingabe.",
      openCanvas: "Canvas öffnen",
    },
    exercise: {
      hint: "Hinweis anzeigen",
      hideHint: "Hinweis ausblenden",
      steps: "Lösung zeigen",
      check: "Antwort prüfen",
      next: "Weiter",
      back: "← Zurück",
      reveal: "Habe es geprüft",
      notYet: "Noch nicht",
      placeholder: "Deine Antwort",
      resultTitle: "Aufgaben abgeschlossen",
      stars3: "Ausgezeichnet!",
      stars2: "Gut gemacht!",
      stars1: "Weiter üben!",
      backToTopics: "← Zurück zu den Themen",
      tryAgain: "Nochmal versuchen",
    },
    legal: {
      back: "← Zurück",
    },
    footer: {
      copy: "© 2026 MathGenius",
      impressum: "Impressum",
      agb: "AGB",
      datenschutz: "Datenschutz",
    },
  },
} as const;

export type Translations = (typeof translations)[Language];

export const t = translations.de;
