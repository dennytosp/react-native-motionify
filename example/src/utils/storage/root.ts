import AsyncStorage from '@react-native-async-storage/async-storage';

const getDataAsync = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      return value;
    }

    return undefined;
  } catch (e) {
    return undefined;
  }
};

const setDataAsync = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
};

const removeDataAsync = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
};

const removeAllKeyAsync = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (e) {
    return false;
  }
};

export {
  /* Get */
  getDataAsync,

  /* Remove */
  removeAllKeyAsync,
  removeDataAsync,

  /* Set */
  setDataAsync,
};
