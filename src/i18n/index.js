import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import bn from "./locales/bn.json";

// Get initial language from localStorage or default to 'en'
const getInitialLanguage = () => {
  try {
    const stored = localStorage.getItem("deutschshikhi-language");
    if (stored && ["en", "bn"].includes(stored)) {
      return stored;
    }
  } catch (e) {
    console.error("Error reading language from localStorage:", e);
  }
  return "en";
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    bn: { translation: bn },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false,
  },
});

// Function to change language and persist
export const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
  try {
    localStorage.setItem("deutschshikhi-language", lang);
  } catch (e) {
    console.error("Error saving language to localStorage:", e);
  }
};

export default i18n;
