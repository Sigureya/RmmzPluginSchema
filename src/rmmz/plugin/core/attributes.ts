import { compileStructArrayValue, compileStructValue } from "./attributeStruct";
import type { DeepJSONParserHandlers } from "./deepJSONHandler";
import type { MappingTable } from "./mapping/mapping";
import {
  compileScalarAttributes,
  compileArrayAttributes,
} from "./mapping/mapping";
import type {
  StringParam,
  ComboParam,
  SelectParam,
  BooleanParam,
  NumberParam,
  NumberArrayParam,
  StringArrayParam,
  FileParam,
  FileArrayParam,
  GenericIdParam,
  DataKind_RpgUnion,
  DataKind_SystemUnion,
  PrimitiveParam,
  PluginParam,
  PluginParamEx,
} from "./params";
import type { PluginParamTokens, OptionItem } from "./parse";
import { KEYWORD_KIND } from "./parse";

type MappingTableEx<T> = MappingTable<Omit<T, "kind">>;

export type ParamSoruceRecord<T> = Partial<Record<keyof T, string>>;

export const compilePluginParam = (
  tokens: PluginParamTokens,
  handlers: DeepJSONParserHandlers
): PluginParam => {
  if (KEYWORD_KIND in tokens.attr) {
    const func = TABLE[tokens.attr.kind as keyof typeof TABLE];
    if (func) {
      return func(tokens, handlers);
    }
  }

  return {
    name: tokens.name,
    attr: compileScalarAttributes("any", "", tokens.attr, STRING),
  };
};

/**
 * @deprecated Use `compilePluginParam` instead.
 */
export const compileAttributes = (
  tokens: PluginParamTokens,
  handlers: DeepJSONParserHandlers
): PrimitiveParam => {
  const { attr } = compilePluginParam(tokens, handlers);
  return attr;
};

const attrString = (value: string): string => value;
const numberArray = (value: string): number[] => {
  const numbers = value
    .replace("[", "")
    .replace("]", "")
    .split(",")
    .map((v) => parseFloat(v.replaceAll(`"`, "").trim()));
  return numbers.filter((n) => !isNaN(n));
};

const STRING = {
  default: attrString,
  text: attrString,
  desc: attrString,
  parent: attrString,
} as const satisfies MappingTableEx<StringParam>;

const compileComboParam = (
  tokens: PluginParamTokens
): PluginParamEx<ComboParam> => {
  const option: string[] = tokens.options?.map((o) => o.option) ?? [];
  const STRING = {
    default: attrString,
    text: attrString,
    desc: attrString,
    parent: attrString,
  } as const satisfies MappingTableEx<StringParam>;
  return {
    name: tokens.name,
    attr: {
      ...compileScalarAttributes("combo", "", tokens.attr, STRING),
      options: option,
    },
  };
};

const compileSelectParam = (
  tokens: PluginParamTokens
): PluginParamEx<SelectParam> => {
  const options: OptionItem[] =
    tokens.options?.map(
      (o): OptionItem => ({
        option: o.option,
        value: o.value,
      })
    ) ?? [];
  const STRING = {
    default: attrString,
    text: attrString,
    desc: attrString,
    parent: attrString,
  } as const satisfies MappingTableEx<StringParam>;
  return {
    name: tokens.name,
    attr: {
      ...compileScalarAttributes("select", "", tokens.attr, STRING),
      options,
    },
  };
};

const compileBooleanParam = (
  tokens: PluginParamTokens
): PluginParamEx<BooleanParam> => {
  const BOOLEAN = {
    default: (value: string) => value === "true",
    text: attrString,
    desc: attrString,
    on: attrString,
    off: attrString,
    parent: attrString,
  } as const satisfies MappingTableEx<BooleanParam>;
  return {
    name: tokens.name,
    attr: compileScalarAttributes("boolean", true, tokens.attr, BOOLEAN),
  };
};

const compileNumberParam = (
  tokens: PluginParamTokens
): PluginParamEx<NumberParam> => {
  const NUMBER = {
    default: (value: string) => parseFloat(value),
    text: attrString,
    desc: attrString,
    decimals: (value: string) => parseInt(value, 10),
    min: (value: string) => parseFloat(value),
    max: (value: string) => parseFloat(value),
    parent: attrString,
  } as const satisfies MappingTableEx<NumberParam>;
  return {
    name: tokens.name,
    attr: compileScalarAttributes("number", 0, tokens.attr, NUMBER),
  };
};

const compileNumberArrayParam = (
  tokens: PluginParamTokens
): PluginParamEx<NumberArrayParam> => {
  const NUMBER_ARRAY = {
    default: (value: string) => numberArray(value),
    text: attrString,
    desc: attrString,
    decimals: (value: string) => parseInt(value, 10),
    min: (value: string) => parseFloat(value),
    max: (value: string) => parseFloat(value),
    parent: attrString,
  } as const satisfies MappingTableEx<NumberArrayParam>;
  return {
    name: tokens.name,
    attr: compileArrayAttributes("number[]", tokens.attr, NUMBER_ARRAY),
  };
};

const compileStringParam = (
  tokens: PluginParamTokens
): PluginParamEx<StringParam> => {
  const STRING = {
    default: attrString,
    text: attrString,
    desc: attrString,
    parent: attrString,
  } as const satisfies MappingTableEx<StringParam>;
  return {
    name: tokens.name,
    attr: compileScalarAttributes("string", "", tokens.attr, STRING),
  };
};

const compileStringArrayParam = (
  tokens: PluginParamTokens,
  parsers: DeepJSONParserHandlers
): PluginParamEx<StringArrayParam> => {
  const STRING_ARRAY = {
    default: (value: string) => parsers.parseStringArray(value).value,
    text: attrString,
    desc: attrString,
    parent: attrString,
  } as const satisfies MappingTableEx<StringArrayParam>;
  return {
    name: tokens.name,
    attr: compileArrayAttributes("string[]", tokens.attr, STRING_ARRAY),
  };
};

const compileFileParam = (
  tokens: PluginParamTokens
): PluginParamEx<FileParam> => {
  const FILE = {
    default: attrString,
    text: attrString,
    desc: attrString,
    parent: attrString,
    dir: attrString,
  } as const satisfies MappingTableEx<FileParam>;
  return {
    name: tokens.name,
    attr: {
      dir: "",
      ...compileScalarAttributes("file", "", tokens.attr, FILE),
    },
  };
};

const compileFileArrayParam = (
  tokens: PluginParamTokens,
  parsers: DeepJSONParserHandlers
): PluginParamEx<FileArrayParam> => {
  const FILE_ARRAY = {
    default: (value: string) => parsers.parseStringArray(value).value,
    text: attrString,
    desc: attrString,
    parent: attrString,
    dir: attrString,
  } as const satisfies MappingTableEx<FileArrayParam>;
  return {
    name: tokens.name,
    attr: {
      dir: "",
      ...compileArrayAttributes("file[]", tokens.attr, FILE_ARRAY),
    },
  };
};

const compileDataIdArray = <
  Kind extends DataKind_RpgUnion | DataKind_SystemUnion
>(
  tokens: PluginParamTokens,
  kind: `${Kind}[]`
) => {
  const DATA_ID_ARRAY = {
    default: (value: string) => numberArray(value),
    text: attrString,
    desc: attrString,
    parent: attrString,
  } as const;
  return {
    name: tokens.name,
    attr: compileArrayAttributes(kind, tokens.attr, DATA_ID_ARRAY),
  };
};

const compileDataId = <Kind extends DataKind_RpgUnion | DataKind_SystemUnion>(
  tokens: PluginParamTokens,
  kind: Kind
) => {
  const DATA_ID = {
    default: (value: string) => parseInt(value, 10),
    text: attrString,
    desc: attrString,
    parent: attrString,
  } as const satisfies MappingTableEx<GenericIdParam>;
  return {
    name: tokens.name,
    attr: compileScalarAttributes(kind, 0, tokens.attr, DATA_ID),
  };
};

const TABLE = {
  actor: (token) => compileDataId(token, "actor"),
  "actor[]": (token) => compileDataIdArray(token, "actor[]"),
  class: (token) => compileDataId(token, "class"),
  "class[]": (token) => compileDataIdArray(token, "class[]"),
  skill: (token) => compileDataId(token, "skill"),
  "skill[]": (token) => compileDataIdArray(token, "skill[]"),
  item: (token) => compileDataId(token, "item"),
  "item[]": (token) => compileDataIdArray(token, "item[]"),
  weapon: (token) => compileDataId(token, "weapon"),
  "weapon[]": (token) => compileDataIdArray(token, "weapon[]"),
  armor: (token) => compileDataId(token, "armor"),
  "armor[]": (token) => compileDataIdArray(token, "armor[]"),
  state: (token) => compileDataId(token, "state"),
  "state[]": (token) => compileDataIdArray(token, "state[]"),
  enemy: (token) => compileDataId(token, "enemy"),
  "enemy[]": (token) => compileDataIdArray(token, "enemy[]"),
  common_event: (token) => compileDataId(token, "common_event"),
  "common_event[]": (token) => compileDataIdArray(token, "common_event[]"),
  switch: (token) => compileDataId(token, "switch"),
  "switch[]": (token) => compileDataIdArray(token, "switch[]"),
  variable: (token) => compileDataId(token, "variable"),
  "variable[]": (token) => compileDataIdArray(token, "variable[]"),
  troop: (token) => compileDataId(token, "troop"),
  "troop[]": (token) => compileDataIdArray(token, "troop[]"),
  file: compileFileParam,
  "file[]": compileFileArrayParam,

  combo: compileComboParam,
  select: compileSelectParam,
  struct: compileStructValue,
  "struct[]": compileStructArrayValue,

  boolean: compileBooleanParam,
  number: compileNumberParam,
  "number[]": compileNumberArrayParam,
  string: compileStringParam,
  "string[]": compileStringArrayParam,
  "multiline_string[]": compileStringArrayParam,
  multiline_string: compileStringParam,
} as const satisfies {
  [K in PrimitiveParam["kind"]]?: (
    tokens: PluginParamTokens,
    perser: DeepJSONParserHandlers
  ) => PluginParam;
};
