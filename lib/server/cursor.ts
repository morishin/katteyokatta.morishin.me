export const encodeCursor = (value: number | string, prefix?: string): string =>
  Buffer.from(`${`${prefix}:` ?? ""}${value}`.toString()).toString("base64");
export const decodeCursor = (value: string, prefix?: string): string =>
  Buffer.from(value, "base64")
    .toString()
    .replace(`${prefix ?? ""}:`, "");
