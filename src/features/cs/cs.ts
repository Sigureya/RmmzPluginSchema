import type {
  NumberParam,
  PrimitiveParam,
} from "@RmmzPluginSchema/rmmz/plugin";

export interface OtherLanguageTypes {
  genInteger(name: string, param: NumberParam): string;
  genFloat(name: string, param: PrimitiveParam): string;
  genString(name: string, param: PrimitiveParam): string;
  genBoolean: string;
  array: string;
  object: string;
}

export const genInteger = (name: string, param: NumberParam) => {
  return `public int ${name} = ${param.default};`;
};

const xxx = (
  name: string,
  param: PrimitiveParam,
  types: OtherLanguageTypes,
) => {
  if (param.kind === "number") {
    if (param.decimals === 0) {
      return types.genInteger(name, param);
    }
    return types.genFloat(name, param);
  }
  if (param.kind === "number[]") {
    if (param.decimals === 0) {
      return `${types.genInteger}${types.array}`;
    }
  }
};
