import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type { ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import type {
  PathPair,
  PluginValuesPath2,
  StructPropertysPath,
} from "./createPath/types";
import type { ArrayPathMemo } from "./memo2/types";
import type {
  MemoBundle,
  PluginValuesPathMemo4,
  SSS,
} from "./memo2/types/memo3";

const newJSONPath = (path: string): JSONPathReader => {
  return new JSONPathJS(path);
};

export const createMemoFromPath = (
  path: PluginValuesPath2,
  factoryFn: (path: string) => JSONPathReader = newJSONPath
): MemoBundle => {
  const top = mm(path.scalars, factoryFn);
  const structs = path.structs.items.map(
    (p): PluginValuesPathMemo4 => mm(p, factoryFn)
  );
  const structArrays = path.structArrays.items.map(
    (p): PluginValuesPathMemo4 => mm(p, factoryFn)
  );

  return {
    name: path.scalars.name,
    top,
    structs,
    structArrays,
  };
};

const mm = (
  p: StructPropertysPath,
  factoryFn: (path: string) => JSONPathReader
): PluginValuesPathMemo4 => {
  if (p.scalars) {
    return {
      arrays: xxArrayParams(p.scalarArrays, factoryFn),
      scalar: createScalarValuesMemo(p.scalars, p.objectSchema, factoryFn),
    };
  }

  return {
    arrays: xxArrayParams(p.scalarArrays, factoryFn),
  };
};

const xxArrayParams = (
  paths: ReadonlyArray<PathPair>,
  factoryFn: (path: string) => JSONPathReader
): ArrayPathMemo[] => {
  return paths.map(
    (p): ArrayPathMemo => ({
      jsonPathJS: factoryFn(p.path),
      schema: p.param,
    })
  );
};

const createScalarValuesMemo = (
  path: string,
  schema: Record<string, ScalarParam>,
  factoryFn: (path: string) => JSONPathReader
): SSS => ({
  jsonPathJS: factoryFn(path),
  record: schema,
});
