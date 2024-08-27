const AMAZON_URL_REGEX =
  /https?:\/\/(www\.)?amazon(\.co)?\.jp\/(.+\/)?((gp\/product\/)|(dp\/))(?<asin>[A-Z0-9]+).*/;

export const asinFromUrl = (url: string) =>
  url.match(AMAZON_URL_REGEX)?.groups?.asin ?? null;

export const isAmazonUrl = (url: string) => AMAZON_URL_REGEX.test(url);
