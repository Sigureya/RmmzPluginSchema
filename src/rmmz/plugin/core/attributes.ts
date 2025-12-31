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

const compileComboParam3 = (
  tokens: PluginParamTokens
): PluginParamEx<ComboParam> => {
  const option: string[] = tokens.options?.map((o) => o.option) ?? [];
  const STRING3 = {
    default: attrString,
    text: attrString,
    desc: attrString,
    parent: attrString,
  } as const satisfies MappingTableEx<StringParam>;
  return {
    name: tokens.name,
    attr: {
      ...compileScalarAttributes("combo", "", tokens.attr, STRING3),
      options: option,
    },
  };
};

const compileSelectParam3 = (
  tokens: PluginParamTokens
): PluginParamEx<SelectParam> => {
  const options: OptionItem[] =
    tokens.options?.map(
      (o): OptionItem => ({
        option: o.option,
        value: o.value,
      })
    ) ?? [];
  const STRING3 = {
    default: attrString,
    text: attrString,
    desc: attrString,
    parent: attrString,
  } as const satisfies MappingTableEx<StringParam>;
  return {
    name: tokens.name,
    attr: {
      ...compileScalarAttributes("select", "", tokens.attr, STRING3),
      options,
    },
  };
};

const compileBooleanParam3 = (
  tokens: PluginParamTokens
): PluginParamEx<BooleanParam> => {
  const BOOLEAN3 = {
    default: (value: string) => value === "true",
    text: attrString,
    desc: attrString,
    on: attrString,
    off: attrString,
    parent: attrString,
  } as const satisfies MappingTableEx<BooleanParam>;
  return {
    name: tokens.name,
    attr: compileScalarAttributes("boolean", true, tokens.attr, BOOLEAN3),
  };
};

const compileNumberParam3 = (
  tokens: PluginParamTokens
): PluginParamEx<NumberParam> => {
  const NUMBER3 = {
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
    attr: compileScalarAttributes("number", 0, tokens.attr, NUMBER3),
  };
};

const compileNumberArrayParam3 = (
  tokens: PluginParamTokens
): PluginParamEx<NumberArrayParam> => {
  const NUMBER_ARRAY3 = {
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
    attr: compileArrayAttributes("number[]", tokens.attr, NUMBER_ARRAY3),
  };
};

const compileStringParam3 = (
  tokens: PluginParamTokens
): PluginParamEx<StringParam> => {
  const STRING3 = {
    default: attrString,
    text: attrString,
    desc: attrString,
    parent: attrString,
  } as const satisfies MappingTableEx<StringParam>;
  return {
    name: tokens.name,
    attr: compileScalarAttributes("string", "", tokens.attr, STRING3),
  };
};

const compileStringArrayParam3 = (
  tokens: PluginParamTokens,
  parsers: DeepJSONParserHandlers
): PluginParamEx<StringArrayParam> => {
  const STRING_ARRAY3 = {
    default: (value: string) => parsers.parseStringArray(value).value,
    text: attrString,
    desc: attrString,
    parent: attrString,
  } as const satisfies MappingTableEx<StringArrayParam>;
  return {
    name: tokens.name,
    attr: compileArrayAttributes("string[]", tokens.attr, STRING_ARRAY3),
  };
};

const compileFileParam3 = (
  tokens: PluginParamTokens
): PluginParamEx<FileParam> => {
  const FILE3 = {
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
      ...compileScalarAttributes("file", "", tokens.attr, FILE3),
    },
  };
};

const compileFileArrayParam3 = (
  tokens: PluginParamTokens,
  parsers: DeepJSONParserHandlers
): PluginParamEx<FileArrayParam> => {
  const FILE_ARRAY3 = {
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
      ...compileArrayAttributes("file[]", tokens.attr, FILE_ARRAY3),
    },
  };
};

const compileDataIdArray3 = <
  Kind extends DataKind_RpgUnion | DataKind_SystemUnion
>(
  tokens: PluginParamTokens,
  kind: `${Kind}[]`
) => {
  const DATA_ID_ARRAY3 = {
    default: (value: string) => numberArray(value),
    text: attrString,
    desc: attrString,
    parent: attrString,
  } as const;
  return {
    name: tokens.name,
    attr: compileArrayAttributes(kind, tokens.attr, DATA_ID_ARRAY3),
  };
};

const compileDataId3 = <Kind extends DataKind_RpgUnion | DataKind_SystemUnion>(
  tokens: PluginParamTokens,
  kind: Kind
) => {
  const DATA_ID3 = {
    default: (value: string) => parseInt(value, 10),
    text: attrString,
    desc: attrString,
    parent: attrString,
  } as const satisfies MappingTableEx<GenericIdParam>;
  return {
    name: tokens.name,
    attr: compileScalarAttributes(kind, 0, tokens.attr, DATA_ID3),
  };
};

const TABLE = {
  actor: (token) => compileDataId3(token, "actor"),
  "actor[]": (token) => compileDataIdArray3(token, "actor[]"),
  class: (token) => compileDataId3(token, "class"),
  "class[]": (token) => compileDataIdArray3(token, "class[]"),
  skill: (token) => compileDataId3(token, "skill"),
  "skill[]": (token) => compileDataIdArray3(token, "skill[]"),
  item: (token) => compileDataId3(token, "item"),
  "item[]": (token) => compileDataIdArray3(token, "item[]"),
  weapon: (token) => compileDataId3(token, "weapon"),
  "weapon[]": (token) => compileDataIdArray3(token, "weapon[]"),
  armor: (token) => compileDataId3(token, "armor"),
  "armor[]": (token) => compileDataIdArray3(token, "armor[]"),
  state: (token) => compileDataId3(token, "state"),
  "state[]": (token) => compileDataIdArray3(token, "state[]"),
  enemy: (token) => compileDataId3(token, "enemy"),
  "enemy[]": (token) => compileDataIdArray3(token, "enemy[]"),
  common_event: (token) => compileDataId3(token, "common_event"),
  "common_event[]": (token) => compileDataIdArray3(token, "common_event[]"),
  switch: (token) => compileDataId3(token, "switch"),
  "switch[]": (token) => compileDataIdArray3(token, "switch[]"),
  variable: (token) => compileDataId3(token, "variable"),
  "variable[]": (token) => compileDataIdArray3(token, "variable[]"),
  troop: (token) => compileDataId3(token, "troop"),
  "troop[]": (token) => compileDataIdArray3(token, "troop[]"),
  file: compileFileParam3,
  "file[]": compileFileArrayParam3,

  combo: compileComboParam3,
  select: compileSelectParam3,
  struct: compileStructValue,
  "struct[]": compileStructArrayValue,

  boolean: compileBooleanParam3,
  number: compileNumberParam3,
  "number[]": compileNumberArrayParam3,
  string: compileStringParam3,
  "string[]": compileStringArrayParam3,
  "multiline_string[]": compileStringArrayParam3,
  multiline_string: compileStringParam3,
} as const satisfies {
  [K in PrimitiveParam["kind"]]?: (
    tokens: PluginParamTokens,
    perser: DeepJSONParserHandlers
  ) => PluginParam;
};
