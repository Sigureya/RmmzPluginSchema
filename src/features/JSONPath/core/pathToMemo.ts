import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type { ScalarParam } from "@RmmzPluginSchema/rmmz/plugin";
import type {
  ArrayParamPathPair,
  PluginValuesPath2,
  StructPropertysPath,
} from "./createPath/types";
import type {
  ExtractorBundle,
  PluginValuesPathMemo4,
  ArrayPathExtractor,
  ScalarValueExtractor,
} from "./extractor/types";

export const compileJSONPathSchema = (
  path: PluginValuesPath2,
  factoryFn: (path: string) => JSONPathReader
): ExtractorBundle => {
  const top = path.scalars
    ? compileStructExtractor(path.scalars, factoryFn)
    : undefined;
  const structs = path.structs.items.map(
    (p): PluginValuesPathMemo4 => compileStructExtractor(p, factoryFn)
  );
  const structArrays = path.structArrays.items.map(
    (p): PluginValuesPathMemo4 => compileStructExtractor(p, factoryFn)
  );
  return {
    rootCategory: path.rootCategory,
    rootName: path.rootName,
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
): ArrayPathExtractor[] => {
  return paths.map(
    (p): ArrayPathExtractor => ({
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
): ScalarValueExtractor => ({
  jsonPathJS: factoryFn(path),
  record: schema,
});
