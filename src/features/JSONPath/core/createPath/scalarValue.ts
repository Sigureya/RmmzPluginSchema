import type {
  PluginParamEx,
  ScalarParam,
  ArrayParamTypes,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { ArrayParamPathPairEx } from "./types";

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

export const makeScalarArrayPath = <T extends PluginParamEx<ArrayParamTypes>>(
  scalaArrays: ReadonlyArray<T>,
  parent: string
): ArrayParamPathPairEx<T>[] => {
  return scalaArrays.map(
    (param): ArrayParamPathPairEx<T> => ({
      path: `${parent}.${param.name}[*]`,
      param: param,
    })
  );
};
