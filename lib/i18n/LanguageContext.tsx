"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { translations, type Language, type Translations } from "./translations";

interface LanguageContextValue {
  lang: Language;
  t: Translations;
  toggleLang: () => void;
  setLang: (l: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "de",
  t: translations.de,
  toggleLang: () => {},
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("de");

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("mg-language", l);
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "de" : "en");
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
