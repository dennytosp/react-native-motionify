import { get as customGet, truncate } from "lodash";

const get = (
  val: object,
  path: string[] = [],
  defaultValue: any = undefined
) => {
  const result = customGet(val, path, defaultValue);
  if (typeof result === "object" && !result) {
    return defaultValue;
  }

  return result;
};

const debounce = (calLback: (...args: any) => void, delay: number) => {
  let timeout: number | NodeJS.Timeout = 0;

  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      calLback(...args);
    }, delay);
  };
};

const mockArray = () => {
  let randomArray = [];
  for (let i = 0; i < 25; i++) {
    randomArray.push(Math.floor(Math.random() * 101));
  }

  return randomArray;
};

const truncateText = (text: string, maxWords?: number, separator?: string) => {
  const truncatedText = truncate(text, {
    length: maxWords || 100,
    separator: separator || "...",
  });
  return truncatedText;
};

const convertToUnsignedString = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const filterUniqueArray = (arr: any[], key: string) => {
  const uniqueCategory = arr.filter((item, index, self) => {
    const findIndexObject = self.findIndex((obj) => obj[key] === item[key]);
    return findIndexObject === index;
  });

  return uniqueCategory;
};

export {
  convertToUnsignedString,
  debounce,
  filterUniqueArray,
  get,
  mockArray,
  truncateText,
};
