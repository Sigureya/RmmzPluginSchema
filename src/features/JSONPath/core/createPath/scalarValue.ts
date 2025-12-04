import type {
  PluginParamEx,
  PluginScalarParam,
  PluginArrayParamType,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { ArrayParamPathPairEx } from "./types";

export const makeScalarValuesPath = (
  scalas: ReadonlyArray<PluginParamEx<PluginScalarParam>>,
  parent: string
): string | undefined => {
  if (scalas.length === 0) {
    return undefined;
  }
  const itesm = scalas.map((param) => `"${param.name}"`).join(",");
  return `${parent}[${itesm}]`;
};

export const makeScalarArrayPath = <
  T extends PluginParamEx<PluginArrayParamType>
>(
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
