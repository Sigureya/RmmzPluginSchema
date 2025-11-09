import type {
  PluginParamEx,
  ScalarParam,
  ArrayParamTypes,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { ArrayPathPair } from "./types/query";

export const makeScalarParams = (
  scalas: ReadonlyArray<PluginParamEx<ScalarParam>>,
  parent: string
): string | undefined => {
  if (scalas.length === 0) {
    return undefined;
  }
  const itesm = scalas.map((param) => `"${param.name}"`).join(",");
  return `${parent}[${itesm}]`;
};

export const makeScalarArrayParams = (
  scalaArrays: ReadonlyArray<PluginParamEx<ArrayParamTypes>>,
  parent: string
): ArrayPathPair[] => {
  return scalaArrays.map(
    (param): ArrayPathPair => ({
      path: `${parent}.${param.name}[*]`,
      param: param,
    })
  );
};
