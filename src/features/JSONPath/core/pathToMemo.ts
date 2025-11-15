import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type { ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type {
  PathPair,
  PluginValuesPathNewVersion,
  StructPropertysPath,
} from "./createPath/types";
import type { ArrayPathMemo } from "./memo2/types";
import type {
  MemoBundle,
  PluginValuesPathMemo4,
  SSS,
} from "./memo2/types/memo3";

export const createMemoFromPath = (
  path: PluginValuesPathNewVersion,
  factoryFn: (path: string) => JSONPathReader
): MemoBundle => {
  const top = createMemoItem(path.scalars, factoryFn);
  const structs = path.structs.items.map(
    (p): PluginValuesPathMemo4 => createMemoItem(p, factoryFn)
  );
  const structArrays = path.structArrays.items.map(
    (p): PluginValuesPathMemo4 => createMemoItem(p, factoryFn)
  );
  return {
    name: path.name,
    top,
    structs,
    structArrays,
  };
};

const createMemoItem = (
  p: StructPropertysPath,
  factoryFn: (path: string) => JSONPathReader
): PluginValuesPathMemo4 => {
  if (p.scalars) {
    return {
      bundleName: p.name,
      arrays: createArrayParamsMemo(p.scalarArrays, p.name, factoryFn),
      scalar: createScalarValuesMemo(p.scalars, p.objectSchema, factoryFn),
    };
  }

  return {
    bundleName: p.name,
    arrays: createArrayParamsMemo(p.scalarArrays, p.name, factoryFn),
  };
};

const createArrayParamsMemo = (
  paths: ReadonlyArray<PathPair>,
  gn: string,
  factoryFn: (path: string) => JSONPathReader
): ArrayPathMemo[] => {
  return paths.map(
    (p): ArrayPathMemo => ({
      jsonPathJS: factoryFn(p.path),
      schema: p.param,
      parentType: gn,
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
