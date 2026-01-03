import type {
  AnyStringParam,
  BooleanParam,
  ComboParam,
  FileArrayParam,
  FileParam,
  NumberArrayParam,
  NumberParam,
  ParamBase,
  PluginParam,
  PrimitiveParam,
  RpgDataIdArrayParam,
  RpgDataIdParam,
  SelectParam,
  StringArrayParam,
  StringParam,
  StructArrayRefParam,
  StructRefParam,
  SystemDataIdArrayParam,
  SystemDataIdParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { KeywordEnum } from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import {
  createKeywordLine,
  createKeywordLineEx,
  createKindLine,
} from "./keywordLine";
import { generateComboOptions, generateSelectOptions } from "./options";
import type { KeyWord } from "./types/keyword";
import type {
  ParamBaseAnnotation,
  PluginParamAnnotation,
} from "./types/schema";
import type { StringifyXX } from "./types/stringlfy";

export const genaratePluginParam = <T extends "param" | "arg">(
  param: PluginParam,
  keyword: T,
  handlers: StringifyXX
): PluginParamAnnotation<T> => {
  const name = createKeywordLine(keyword, param.name);
  const base = generateBaseParams(param.attr);
  const attr = mapAttr(param.attr, handlers);
  return attr
    ? {
        name,
        base,
        default: attr.default,
        attr: attr.attr.filter((x) => x !== undefined),
      }
    : {
        name,
        base,
        default: undefined,
        attr: [],
      };
};

const generateBaseParams = (p: ParamBase): ParamBaseAnnotation => {
  return {
    kind: createKindLine(p),
    desc: p.desc ? createKeywordLine("desc", p.desc) : undefined,
    text: p.text ? createKeywordLine("text", p.text) : undefined,
    parent: p.parent ? createKeywordLine("parent", p.parent) : undefined,
  };
};

interface AttrResult {
  attr: (KeyWord<KeywordEnum> | undefined)[];
  default: KeyWord<"default"> | undefined;
}

const mapAttr = (
  parma: PrimitiveParam,
  handlers: StringifyXX
): AttrResult | undefined => {
  if (parma.kind === "number") {
    return numberAttr(parma);
  }
  if (parma.kind === "number[]") {
    return numberArrayAttr(parma, handlers);
  }
  if (parma.kind === "file[]") {
    return fileArrayAttr(parma, handlers);
  }
  if (parma.kind === "struct[]") {
    return structArrayAttr(parma, handlers);
  }
  if (parma.kind === "string[]") {
    return stringArrayAttr(parma, handlers);
  }
  if (parma.kind === "multiline_string[]") {
    return stringArrayAttr(parma, handlers);
  }
  if (parma.kind === "select") {
    return selectDefaultValue(parma);
  }
  if (parma.kind === "combo") {
    return comboAttr(parma);
  }

  if (parma.kind === "file") {
    return fileAttr(parma);
  }
  if (parma.kind === "struct") {
    return structAttr(parma, handlers);
  }

  if (parma.kind === "boolean") {
    return booleanAttr(parma);
  }
  if (parma.kind === "string") {
    return stringAttr(parma);
  }
  if (parma.kind === "any") {
    return stringAttr(parma);
  }
  if (parma.kind === "multiline_string") {
    return stringAttr(parma);
  }
  if (typeof parma.default === "number") {
    return dataIdAttr(parma);
  }

  return dataIdArrayAttr(
    parma as RpgDataIdArrayParam | SystemDataIdArrayParam,
    handlers
  );
};

const createDefaultLine = (
  value: boolean | number | undefined
): KeyWord<"default"> | undefined => {
  return value === undefined
    ? undefined
    : createKeywordLine("default", value.toString());
};

const booleanAttr = (param: BooleanParam): AttrResult => {
  return {
    attr: TABLE2.boolean.map((key) => createKeywordLineEx(param, key)),
    default: createKeywordLine("default", param.default ? "true" : "false"),
  };
};

const dataIdAttr = (param: RpgDataIdParam | SystemDataIdParam): AttrResult => {
  return {
    attr: [],
    default: createDefaultLine(param.default),
  };
};

const dataIdArrayAttr = (
  param: RpgDataIdArrayParam | SystemDataIdArrayParam,
  handlers: StringifyXX
): AttrResult => {
  const s: string = handlers.numberArray(param.default);
  return {
    attr: [],
    default: createKeywordLine("default", s),
  };
};

const numberAttr = (param: NumberParam): AttrResult => {
  return {
    attr: TABLE2.number.map((key) => createKeywordLineEx(param, key)),
    default: createDefaultLine(param.default),
  };
};

const numberArrayAttr = (
  param: NumberArrayParam,
  handlers: StringifyXX
): AttrResult => {
  const s: string = handlers.numberArray(param.default);
  return {
    attr: TABLE2.number.map((key) => createKeywordLineEx(param, key)),
    default: createKeywordLine("default", s),
  };
};

const stringArrayAttr = (
  param: StringArrayParam,
  handlers: StringifyXX
): AttrResult => {
  const s: string = handlers.stringArray(param.default);
  return {
    attr: [],
    default: createKeywordLine("default", s),
  };
};

const stringAttr = (param: StringParam | AnyStringParam): AttrResult => {
  return {
    attr: [],
    default: createKeywordLine("default", param.default),
  };
};

const fileAttr = (param: FileParam): AttrResult => {
  return {
    attr: TABLE2.file.map((key) => createKeywordLineEx(param, key)),
    default: createKeywordLine("default", param.default),
  };
};

const fileArrayAttr = (
  param: FileArrayParam,
  handlers: StringifyXX
): AttrResult => {
  const s: string = handlers.stringArray(param.default);
  return {
    attr: TABLE2.file.map((key) => createKeywordLineEx(param, key)),
    default: createKeywordLine("default", s),
  };
};

const selectDefaultValue = (param: SelectParam): AttrResult => {
  return {
    attr: generateSelectOptions(param),
    default: createKeywordLine("default", param.default),
  };
};

const comboAttr = (param: ComboParam): AttrResult => {
  return {
    attr: generateComboOptions(param),
    default: createKeywordLine("default", param.default),
  };
};

const structAttr = (
  param: StructRefParam,
  handlers: StringifyXX
): AttrResult => {
  if (!param.default) {
    return {
      attr: [createKeywordLineEx(param, "struct")],
      default: undefined,
    };
  }
  const s: string = handlers.struct(param.default);
  return {
    attr: [createKeywordLineEx(param, "struct")],
    default: createKeywordLine("default", s),
  };
};

const structArrayAttr = (
  param: StructArrayRefParam & { kind: "struct[]" },
  handlers: StringifyXX
): AttrResult => {
  if (!param.default) {
    return {
      attr: [createKeywordLineEx(param, "struct")],
      default: createKeywordLine("default", "[]"),
    };
  }

  const s: string = handlers.structArray(param.default);
  return {
    attr: [createKeywordLineEx(param, "struct")],
    default: createKeywordLine("default", s),
  };
};

type TableType = {
  [K in PrimitiveParam["kind"]]?: (keyof Extract<
    PrimitiveParam,
    { kind: K }
  >)[];
};

const TABLE2 = {
  number: ["min", "max", "decimals"],
  file: ["dir"],
  boolean: ["on", "off"],
  struct: ["struct"],
} as const satisfies TableType;
