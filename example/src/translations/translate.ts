import I18n from "./i18n";
import { I18nKeys } from "./type";

export const translate = (key: I18nKeys, option?: Record<string, unknown>) => {
  return key ? I18n.t(key, option).toString() : "";
};
