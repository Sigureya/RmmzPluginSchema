import type {
  PluginParamEx,
  ScalarParam,
  ArrayParamTypes,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { ArrayParamPathPair } from "./types";

export const makeScalarValuesPath = (
  scalas: ReadonlyArray<PluginParamEx<ScalarParam>>,
  parent: string
): string | undefined => {
  if (scalas.length === 0) {
    return undefined;
  }
  const itesm = scalas.map((param) => `"${param.name}"`).join(",");
  return `${parent}[${itesm}]`;
};

export const makeScalarArrayPath = (
  scalaArrays: ReadonlyArray<PluginParamEx<ArrayParamTypes>>,
  parent: string
): ArrayParamPathPair[] => {
  return scalaArrays.map(
    (param): ArrayParamPathPair => ({
      path: `${parent}.${param.name}[*]`,
      param: param,
    })
  );
};
