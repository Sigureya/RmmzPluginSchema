import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginArrayParamType,
  PluginParamEx,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  ArrayParamPathPairEx,
  PluginValuesPathSchema,
} from "./createPath/types";
import type { StructPropertiesPath } from "./createPath/types/template";
import type {
  PluginValuesExtractorBundle,
  PluginValuesPathMemo,
  PluginArrayPathExtractor,
  PluginScalarValueExtractor,
} from "./extractor/types";

export const compileJSONPathSchema = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  path: PluginValuesPathSchema<S, A>,
  factoryFn: (path: string) => JSONPathReader
): PluginValuesExtractorBundle<S, A> => {
  const top = path.scalars
    ? compileStructExtractor(path.scalars, factoryFn)
    : undefined;
  const structs = path.structs.items.map(
    (p): PluginValuesPathMemo<S, A> => compileStructExtractor(p, factoryFn)
  );
  const structArrays = path.structArrays.items.map(
    (p): PluginValuesPathMemo<S, A> => compileStructExtractor(p, factoryFn)
  );
  return {
    rootCategory: path.rootCategory,
    rootName: path.rootName,
    top,
    structs,
    structArrays,
  };
};

const compileStructExtractor = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType
>(
  p: StructPropertiesPath<S, A>,
  factoryFn: (path: string) => JSONPathReader
): PluginValuesPathMemo<S, A> => {
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

const compileArrayPathExtractor = <A extends PluginArrayParamType>(
  paths: ReadonlyArray<ArrayParamPathPairEx<PluginParamEx<A>>>,
  gn: string,
  factoryFn: (path: string) => JSONPathReader
): PluginArrayPathExtractor<A>[] => {
  return paths.map(
    (p): PluginArrayPathExtractor<A> => ({
      jsonPathJS: factoryFn(p.path),
      schema: p.param,
      parentType: gn,
    })
  );
};

const compileScalarValueExtractor = <S extends PluginScalarParam>(
  path: string,
  schema: Record<string, S>,
  factoryFn: (path: string) => JSONPathReader
): PluginScalarValueExtractor<S> => ({
  jsonPathJS: factoryFn(path),
  record: schema,
});
