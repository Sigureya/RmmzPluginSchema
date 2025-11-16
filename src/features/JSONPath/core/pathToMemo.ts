import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type { ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type {
  ArrayParamPathPair,
  PluginValuesPath2,
  StructPropertysPath,
} from "./createPath/types";
import type { ArrayPathMemo } from "./memo2/types";
import type {
  MemoBundle,
  PluginValuesPathMemo4,
  SSS,
} from "./memo2/types/memo3";

export const compileJSONPathSchema = (
  path: PluginValuesPath2,
  factoryFn: (path: string) => JSONPathReader
): MemoBundle => {
  const top = compileStructExtractor(path.scalars, factoryFn);
  const structs = path.structs.items.map(
    (p): PluginValuesPathMemo4 => compileStructExtractor(p, factoryFn)
  );
  const structArrays = path.structArrays.items.map(
    (p): PluginValuesPathMemo4 => compileStructExtractor(p, factoryFn)
  );
  return {
    name: path.name,
    top,
    structs,
    structArrays,
  };
};

const compileStructExtractor = (
  p: StructPropertysPath,
  factoryFn: (path: string) => JSONPathReader
): PluginValuesPathMemo4 => {
  if (p.scalarsPath) {
    return {
      bundleName: p.name,
      arrays: compileArrayPathExtractor(p.scalarArrays, p.name, factoryFn),
      scalar: compileScalarValueExtractor(
        p.scalarsPath,
        p.objectSchema,
        factoryFn
      ),
    };
  }

  return {
    bundleName: p.name,
    arrays: compileArrayPathExtractor(p.scalarArrays, p.name, factoryFn),
  };
};

const compileArrayPathExtractor = (
  paths: ReadonlyArray<ArrayParamPathPair>,
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

const compileScalarValueExtractor = (
  path: string,
  schema: Record<string, ScalarParam>,
  factoryFn: (path: string) => JSONPathReader
): SSS => ({
  jsonPathJS: factoryFn(path),
  record: schema,
});
