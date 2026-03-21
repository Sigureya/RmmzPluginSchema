import type {
  PrimitiveParam,
  StructArrayRefParam,
  StructRefParam,
} from "./types";

export const isErrorStructParam = (
  param: PrimitiveParam,
): param is StructRefParam | StructArrayRefParam => {
  if (param.kind === "struct" || param.kind === "struct[]") {
    return Array.isArray(param.errors) ? param.errors.length > 0 : false;
  }
  return false;
};
