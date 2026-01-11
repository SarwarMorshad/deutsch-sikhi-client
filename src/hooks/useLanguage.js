import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import { changeLanguage } from "../i18n";

/**
 * Custom hook to sync language with user preference
 * - Syncs i18n language with dbUser.preferences.language
 * - Provides helper functions for language operations
 */
const useLanguage = () => {
  const { i18n } = useTranslation();
  const { dbUser } = useContext(AuthContext);

  // Sync language when dbUser changes
  useEffect(() => {
    const userLang = dbUser?.preferences?.language;
    if (userLang && ["en", "bn"].includes(userLang)) {
      if (i18n.language !== userLang) {
        changeLanguage(userLang);
      }
    }
  }, [dbUser?.preferences?.language, i18n]);

  // Get current language
  const currentLanguage = i18n.language || "en";

  // Check if current language is Bengali
  const isBengali = currentLanguage === "bn";

  // Get localized content from object with en/bn keys
  const getLocalizedContent = (content, fallback = "") => {
    if (!content) return fallback;
    if (typeof content === "string") return content;
    return isBengali ? content.bn || content.en || fallback : content.en || fallback;
  };

  return {
    currentLanguage,
    isBengali,
    isEnglish: currentLanguage === "en",
    changeLanguage,
    getLocalizedContent,
  };
};

export default useLanguage;
