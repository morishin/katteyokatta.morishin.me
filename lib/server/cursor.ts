export const encodeCursor = (value: number | string): string =>
  Buffer.from(value.toString()).toString("base64");
export const decodeCursor = (value: string): string =>
  Buffer.from(value, "base64").toString();
