import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  NumberArrayUnion,
  PluginArrayParamType,
  PluginParamEx,
  PluginScalarParam,
  StringArrayUnion,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  ArrayParamPathPair,
  PluginValuesPathSchema7,
} from "./createPath/types";
import type { StructPropertiesPath } from "./createPath/types/template";
import type {
  PluginValuesPathMemo,
  PluginArrayPathExtractor,
  PluginScalarValueExtractor,
  PluginValuesExtractorBundle7,
} from "./extractor/types";

export const compileJSONPathSchema = <
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
>(
  path: PluginValuesPathSchema7<S, NA, SA>,
  factoryFn: (path: string) => JSONPathReader
): PluginValuesExtractorBundle7<S, NA, SA> => {
  const top = path.scalars
    ? compileStructExtractor<S, NA, SA>(path.scalars, factoryFn)
    : undefined;
  const structs = path.structs.items.map(
    (p): PluginValuesPathMemo<S, NA, SA> =>
      compileStructExtractor<S, NA, SA>(p, factoryFn)
  );
  const structArrays = path.structArrays.items.map(
    (p): PluginValuesPathMemo<S, NA, SA> =>
      compileStructExtractor<S, NA, SA>(p, factoryFn)
  );
  return {
    rootCategory: path.rootCategory,
    rootName: path.rootName,
    top: top,
    structs,
    structArrays,
  };
};

const compileStructExtractor = <
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
>(
  p: StructPropertiesPath<S, NA | SA>,
  factoryFn: (path: string) => JSONPathReader
): PluginValuesPathMemo<S, NA, SA> => {
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
  paths: ReadonlyArray<ArrayParamPathPair<PluginParamEx<A>>>,
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
