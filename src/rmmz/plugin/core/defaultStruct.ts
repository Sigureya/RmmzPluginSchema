export const createDefaultStruct = (
  defaultValue: string | undefined,
  fn: (deepJSON: string) => unknown
): object => {
  if (!defaultValue) {
    return {};
  }
  const value = fn(defaultValue);
  if (Array.isArray(value)) {
    return {};
  }
  if (typeof value === "object" && value !== null) {
    return value;
  }
  return {};
};

export const createDefaultStructArray = (
  defaultValue: string | undefined,
  fn: (deepJSON: string) => unknown
): object[] => {
  if (!defaultValue) {
    return [];
  }
  const value = fn(defaultValue);
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === "object" && v !== null)) {
      return value;
    }
  }
  return [];
};
