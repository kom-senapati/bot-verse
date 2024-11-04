import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en, enMetadata } from "./locales/en";
import { es } from "./locales/es";
import { hi } from "./locales/hi";
import { ja } from "./locales/ja";
import { fr } from "./locales/fr";
const resources = {
  en,
  es,
  hi,
  ja,
  fr,
};

i18n.use(initReactI18next).init({
  resources,
  lng: enMetadata.code,
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: enMetadata.code,

  debug: false,
});

export { i18n };
