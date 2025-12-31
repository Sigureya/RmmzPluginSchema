export type MappingTable<T> = {
  [K in Extract<keyof T, string>]: (value: string) => T[K];
};

type TableConcept = {
  [key: string]: (tokens: string) => unknown;
};

export const applyMappingTable = <T extends TableConcept>(
  tokens: Record<string, string>,
  fnTable: T
): {
  [K in keyof T]?: ReturnType<T[K]>;
} => {
  const entries = Object.entries(fnTable)
    .filter(([key]) => key in tokens)
    .map(([key, fn]): [string, unknown] => {
      const value: string = tokens[key];
      return [key, fn(value)];
    });

  return Object.fromEntries(entries) as {
    [K in keyof T]?: ReturnType<T[K]>;
  };
};

export const compileScalarAttributes = <Kind extends string, T>(
  kind: Kind,
  defaultValue: T,
  tokens: Record<string, string>,
  fnTable: TableConcept
): {
  kind: Kind;
  default: T;
} & {
  [K in keyof TableConcept]?: ReturnType<TableConcept[K]>;
} => {
  return {
    default: defaultValue,
    ...applyMappingTable(tokens, fnTable),
    kind,
  };
};

export const compileArrayAttributes = <
  T extends TableConcept & { default: (s: string) => unknown[] },
  Kind extends string
>(
  kind: Kind,
  tokens: Record<string, string>,
  fnTable: T
): {
  kind: Kind;
  default: ReturnType<T["default"]>;
} & {
  [K in keyof T]?: ReturnType<T[K]>;
} => {
  return {
    default: [],
    ...applyMappingTable(tokens, fnTable),
    kind,
  };
};
