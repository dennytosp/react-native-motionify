import i18n, { LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";

import { LanguageType } from "@/types";
import { getLanguageAsync, setLanguageAsync } from "@/utils/storage";
import * as resources from "./resources";

const lng = "en";

const onDetectLanguage = async (
  callback: (lng: string | readonly string[] | undefined) => void | undefined
) => {
  try {
    const locales = RNLocalize.getLocales();
    const language = await getLanguageAsync();
    const currentAppLanguage = Object.values(LanguageType);

    if (language) {
      //if language was stored before, use this language in the app
      return callback(language);
    } else if (currentAppLanguage.includes(lng as LanguageType)) {
      //if language was not stored yet, use device's locale
      return callback(locales[0].languageCode);
    } else {
      return callback(LanguageType.en);
    }
  } catch (error) {
    console.log("Error reading language", error);
  }
};

const languageDetectorPlugin: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  init: () => {},
  // detect: async function (callback: (lang: string) => void) {
  detect: (
    callback: (lang: string | readonly string[] | undefined) => void
  ) => {
    onDetectLanguage(callback);
  },
  cacheUserLanguage: function (language: string) {
    setLanguageAsync(language);
  },
};

i18n
  .use(initReactI18next)
  .use(languageDetectorPlugin)
  .init({
    compatibilityJSON: "v4",
    resources: {
      ...Object.entries(resources).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: {
            translation: value,
          },
        }),
        {}
      ),
    },
    lng,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
