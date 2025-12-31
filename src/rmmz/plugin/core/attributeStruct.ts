import type { DeepJSONParserHandlers } from "./deepJSONHandler";
import { compileScalarAttributes } from "./mapping/mapping";
import type {
  PluginParamEx,
  StructArrayRefParam,
  StructRefParam,
} from "./params";
import type { ParamError } from "./params/types/error";
import type { PluginParamTokens } from "./parse";

const normarizeErros = (list: ParamError[]) => {
  return list.length > 0 ? { errors: list } : {};
};

const attrString = (value: string): string => value;

export const compileStructValue = (
  tokens: PluginParamTokens,
  handlers: DeepJSONParserHandlers
): PluginParamEx<StructRefParam> => {
  const { errors, value } = handlers.parseObject(tokens.attr.default || "{}");
  const STRUCT_REF = {
    text: attrString,
    desc: attrString,
    parent: attrString,
  } as const;
  const defaultValue = errors.length === 0 ? value : {};
  return {
    name: tokens.name,
    attr: {
      struct: tokens.attr.struct || "",
      ...compileScalarAttributes(
        "struct",
        defaultValue,
        tokens.attr,
        STRUCT_REF
      ),
      ...normarizeErros(errors),
    },
  };
};

export const compileStructArrayValue = (
  tokens: PluginParamTokens,
  handlers: DeepJSONParserHandlers
): PluginParamEx<StructArrayRefParam> => {
  const { errors, value } = handlers.parseObjectArray(
    tokens.attr.default || "[]"
  );
  const STRUCT_ARRAY = {
    text: attrString,
    desc: attrString,
    parent: attrString,
  } as const;
  const defaultValue: object[] = errors.length === 0 ? value : [];
  return {
    name: tokens.name,
    attr: {
      struct: tokens.attr.struct || "",
      ...compileScalarAttributes(
        "struct[]",
        defaultValue,
        tokens.attr,
        STRUCT_ARRAY
      ),
      default: defaultValue,
      ...normarizeErros(errors),
    },
  };
};
