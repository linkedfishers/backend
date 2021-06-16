import mongoose from 'mongoose';

export const isEmptyObject = (obj: any): boolean => {
  return !Object.keys(obj).length;
};

export const isNullOrEmpty = (str: string): boolean => {
  return !str || str.trim().length == 0;
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

export const randomString = (len: number, charSet?: string): string => {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < len; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
};

export const parseJson = (jsonString: string): any => {
  try {
    return JSON.parse(jsonString);
  }
  catch (e) {
    return {};
  }
}