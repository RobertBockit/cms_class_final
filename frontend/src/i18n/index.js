import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import de from "./de.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            de: { translation: de },
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        debug: true,
    });

export default i18n;
