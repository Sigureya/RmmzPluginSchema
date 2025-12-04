import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ArrayParamTypes,
  PluginParamEx,
  ScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  ArrayParamPathPairEx,
  PluginValuesPathEx,
} from "./createPath/types";
import type { StructPropertysPathEx3 } from "./createPath/types/template";
import type {
  ExtractorBundle,
  PluginValuesPathMemo4,
  ArrayPathExtractor,
  ScalarValueExtractor,
} from "./extractor/types";

export const compileJSONPathSchema = <
  S extends ScalarParam,
  A extends ArrayParamTypes
>(
  path: PluginValuesPathEx<S, A>,
  factoryFn: (path: string) => JSONPathReader
): ExtractorBundle<S, A> => {
  const top = path.scalars
    ? compileStructExtractor(path.scalars, factoryFn)
    : undefined;
  const structs = path.structs.items.map(
    (p): PluginValuesPathMemo4<S, A> =>
      compileStructExtractor<S, A>(p, factoryFn)
  );
  const structArrays = path.structArrays.items.map(
    (p): PluginValuesPathMemo4<S, A> => compileStructExtractor(p, factoryFn)
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
  S extends ScalarParam,
  A extends ArrayParamTypes
>(
  p: StructPropertysPathEx3<S, A>,
  factoryFn: (path: string) => JSONPathReader
): PluginValuesPathMemo4<S, A> => {
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

const compileArrayPathExtractor = <A extends ArrayParamTypes>(
  paths: ReadonlyArray<ArrayParamPathPairEx<PluginParamEx<A>>>,
  gn: string,
  factoryFn: (path: string) => JSONPathReader
): ArrayPathExtractor<A>[] => {
  return paths.map(
    (p): ArrayPathExtractor<A> => ({
      jsonPathJS: factoryFn(p.path),
      schema: p.param,
      parentType: gn,
    })
  );
};

const compileScalarValueExtractor = <S extends ScalarParam>(
  path: string,
  schema: Record<string, S>,
  factoryFn: (path: string) => JSONPathReader
): ScalarValueExtractor<S> => ({
  jsonPathJS: factoryFn(path),
  record: schema,
});
