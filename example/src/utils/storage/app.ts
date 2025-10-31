import { getDataAsync, setDataAsync } from '.';
import { AsyncKey } from './type';

const getLanguageAsync = async () => {
  let language = 'en';

  const languageStorage = await getDataAsync(AsyncKey.LANGUAGE);
  if (languageStorage) {
    language = JSON.parse(languageStorage);
  }

  return language;
};

const setLanguageAsync = async (value: string) => {
  return await setDataAsync(AsyncKey.LANGUAGE, JSON.stringify(value));
};

export {
  /* Get */
  getLanguageAsync,

  /* Set */
  setLanguageAsync,
};
