import { useContext } from "react";
import { LanguageContext } from "../providers/LanguageProvider";
import en from "../i18n/en.json";
import hi from "../i18n/hi.json";
import te from "../i18n/te.json";

const dictionaries = { en, hi, te };

export function useTranslation() {
  const { language, setLanguage } = useContext(LanguageContext);

  const t = (key) => {
    return dictionaries[language]?.[key] || dictionaries.en?.[key] || key;
  };

  return { t, language, setLanguage };
}

// Keep backward compatible named export
export function translate(language, key) {
  return dictionaries[language]?.[key] || dictionaries.en?.[key] || key;
}