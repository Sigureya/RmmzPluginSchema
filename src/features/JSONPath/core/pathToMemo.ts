import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  PluginArrayParamType,
  PluginParamEx,
  PluginScalarParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  ArrayParamPathPair,
  PluginValuesPathSchema,
} from "./createPath/types";
import type { StructPathNode } from "./createPath/types/template";
import type {
  PluginValuesExtractorBundle,
  PluginValuesPathMemo,
  PluginArrayPathExtractor,
  PluginScalarValueExtractor,
} from "./extractor/types";

type Type = "struct" | "structArray" | "scalar";
interface StructPathErrorHandlers<T> {
  errorAtPath(path: string, valType: Type, error: unknown): T;
  createReader(path: string): JSONPathReader;
}

export interface CompileJSONPathErrorInfo<T> {
  path: string;
  valType: Type;
  error: unknown;
  handledInfo: T;
}

export interface CompileJSONPathResult<
  S extends PluginScalarParam,
  A extends PluginArrayParamType,
  T,
> {
  extractor: PluginValuesExtractorBundle<S, A>;
  errors: CompileJSONPathErrorInfo<T>[];
}

export const compileJSONPathSchema = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType,
>(
  path: PluginValuesPathSchema<S, A>,
  factoryFn: (path: string) => JSONPathReader,
): PluginValuesExtractorBundle<S, A> => {
  const result = compileJSONPathSchemaV2(path, {
    createReader(path) {
      return factoryFn(path);
    },
    errorAtPath() {
      return undefined;
    },
  });
  if (result.errors.length > 0) {
    throw result.errors[0].error;
  }
  return result.extractor;
};

const compileJSONPathSchemaV2 = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType,
  T,
>(
  path: PluginValuesPathSchema<S, A>,
  errorHandlers: StructPathErrorHandlers<T>,
): CompileJSONPathResult<S, A, T> => {
  const errors: CompileJSONPathErrorInfo<T>[] = [];
  const top = path.scalars
    ? compileStructExtractor(path.scalars, "scalar", errorHandlers, errors)
    : undefined;
  const structs = path.structs.items.map(
    (p): PluginValuesPathMemo<S, A> =>
      compileStructExtractor(p, "struct", errorHandlers, errors),
  );
  const structArrays = path.structArrays.items.map(
    (p): PluginValuesPathMemo<S, A> =>
      compileStructExtractor(p, "structArray", errorHandlers, errors),
  );
  return {
    extractor: {
      rootCategory: path.rootCategory,
      rootName: path.rootName,
      top,
      structs,
      structArrays,
    },
    errors,
  };
};

const compileStructExtractor = <
  S extends PluginScalarParam,
  A extends PluginArrayParamType,
  T,
>(
  p: StructPathNode<S, A>,
  nodeType: Type,
  errorHandlers: StructPathErrorHandlers<T>,
  errors: CompileJSONPathErrorInfo<T>[],
): PluginValuesPathMemo<S, A> => {
  const arrays = compileArrayPathExtractor(
    p.scalarArrays,
    p.name,
    nodeType,
    errorHandlers,
    errors,
  );

  if (p.scalarsPath) {
    return {
      bundleName: p.name,
      arrays,
      scalar: compileScalarValueExtractor(
        p.scalarsPath,
        p.objectSchema,
        nodeType,
        errorHandlers,
        errors,
      ),
    };
  }

  return {
    bundleName: p.name,
    arrays,
  };
};

const compileArrayPathExtractor = <A extends PluginArrayParamType, T>(
  paths: ReadonlyArray<ArrayParamPathPair<PluginParamEx<A>>>,
  gn: string,
  nodeType: Type,
  errorHandlers: StructPathErrorHandlers<T>,
  errors: CompileJSONPathErrorInfo<T>[],
): PluginArrayPathExtractor<A>[] => {
  return paths.flatMap((p): PluginArrayPathExtractor<A>[] => {
    try {
      return [
        {
          jsonPathJS: errorHandlers.createReader(p.path),
          schema: p.param,
          parentType: gn,
        },
      ];
    } catch (error) {
      errors.push({
        path: p.path,
        valType: nodeType,
        error,
        handledInfo: errorHandlers.errorAtPath(p.path, nodeType, error),
      });
      return [];
    }
  });
};

const compileScalarValueExtractor = <S extends PluginScalarParam, T>(
  path: string,
  schema: Record<string, S>,
  nodeType: Type,
  errorHandlers: StructPathErrorHandlers<T>,
  errors: CompileJSONPathErrorInfo<T>[],
): PluginScalarValueExtractor<S> | undefined => {
  try {
    return {
      jsonPathJS: errorHandlers.createReader(path),
      record: schema,
    };
  } catch (error) {
    errors.push({
      path,
      valType: nodeType,
      error,
      handledInfo: errorHandlers.errorAtPath(path, nodeType, error),
    });
    return undefined;
  }
};
