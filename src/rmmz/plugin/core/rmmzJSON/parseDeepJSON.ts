import type { JSONValue } from "@RmmzPluginSchema/libs/jsonPath";

export const parseDeepJSON = (json: string): JSONValue => {
  const parsed: JSONValue = JSON.parse(json);
  if (Array.isArray(parsed)) {
    return parsed.map(parseDeepValue);
  }
  if (typeof parsed === "object" && parsed !== null) {
    return parseUnknownRecord(parsed);
  }
  return parsed;
};

export const parseDeepRecord = (record: Record<string, string>): JSONValue => {
  return parseUnknownRecord(record);
};

const parseUnknownRecord = (record: Record<string, JSONValue>) => {
  return Object.fromEntries(
    Object.entries(record).map(([k, v]) => [k, parseDeepValue(v)])
  );
};

const parseDeepValue = (value: JSONValue): JSONValue => {
  if (typeof value !== "string") {
    return value;
  }
  try {
    const parsed = JSON.parse(value);
    // 配列の場合、各要素を再帰的にparseDeepValue
    if (Array.isArray(parsed)) {
      return parsed.map(parseDeepValue);
    }
    // オブジェクトの場合、各プロパティを再帰的にparseDeepValue
    if (typeof parsed === "object" && parsed !== null) {
      return Object.fromEntries(
        Object.entries(parsed).map(([k, v]) => [
          k,
          parseDeepValue(v as JSONValue),
        ])
      );
    }
    return parsed;
  } catch {
    // JSON.parseに失敗した場合はそのまま返す
    return value;
  }
};
