import type {
  ArrayParamTypes,
  ClassifiedPluginParams,
  ClassifiedPluginParamsEx2,
  PluginParamEx,
  ScalarParam,
  ScalaStruct,
  StructArrayRefParam,
  StructRefParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { toObjectPluginParams } from "@RmmzPluginSchema/rmmz/plugin";
import { makeScalarArrayPath, makeScalarValuesPath } from "./scalarValue";
import type { ErrorCodes, StructPathError } from "./types";
import type { StructPropertysPathEx3, TemplateGE } from "./types/template";

const ERROR_CODE = {
  undefinedStruct: "undefined_struct",
  cyclicStruct: "cyclic_struct",
} as const satisfies ErrorCodes;

interface ClassifiedPluginParamsEx3<
  S extends PluginParamEx<ScalarParam>,
  A extends PluginParamEx<ArrayParamTypes>
> extends ScalaStruct {
  structs: PluginParamEx<StructRefParam>[];
  structArrays: PluginParamEx<StructArrayRefParam>[];
  scalars: S[];
  scalarArrays: A[];
}

interface Frame {
  schemaName: string;
  basePath: string;
  ancestry: string[];
}

interface State2<Scalar extends ScalarParam, Array extends ArrayParamTypes> {
  frames: Frame[];
  items: StructPropertysPathEx3<Scalar, Array>[];
  errs: StructPathError[];
}

function createNode<S extends ScalarParam, A extends ArrayParamTypes>(
  structSchema: ClassifiedPluginParamsEx2<S, A>,
  {
    path,
    structName,
  }: {
    path: string;
    structName: string;
  }
): StructPropertysPathEx3<S, A> {
  return {
    category: "struct",
    objectSchema: toObjectPluginParams(structSchema.scalars),
    name: structName,
    scalarArrays: makeScalarArrayPath(structSchema.scalarArrays, path),
    scalarsPath:
      structSchema.scalars.length > 0
        ? makeScalarValuesPath(structSchema.scalars, path)
        : undefined,
  };
}

function createChildFrames(
  lastFrame: Frame,
  structSchema: ClassifiedPluginParams
): Frame[] {
  const childAncestry: string[] = lastFrame.ancestry.concat(
    lastFrame.schemaName
  );
  const path: string = lastFrame.basePath;
  // // 子フレームを作成（希望する処理順: structFrames -> structArrayFrames）
  const structFrames: Frame[] = structSchema.structs.map(
    (s): Frame => ({
      schemaName: s.attr.struct,
      basePath: `${path}.${s.name}`,
      ancestry: childAncestry,
    })
  );
  const structArrayFrames: Frame[] = structSchema.structArrays.map(
    (sa): Frame => ({
      schemaName: sa.attr.struct,
      basePath: `${path}.${sa.name}[*]`,
      ancestry: childAncestry,
    })
  );
  // childrenDesired: structs の順で先に処理し、その後 structArrays を処理したい

  return [...structFrames, ...structArrayFrames].reverse(); // LIFO スタックなので、desired の逆順で push
}

function stepState<Scalar extends ScalarParam, Array extends ArrayParamTypes>(
  state: State2<Scalar, Array>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<Scalar, Array>>,
  errors: ErrorCodes
): State2<Scalar, Array> {
  if (state.frames.length === 0) {
    return state;
  }

  const frame = state.frames[state.frames.length - 1];
  const newFrames: Frame[] = state.frames.slice(0, -1);

  // 循環チェック（ancestry に同じ schemaName が含まれていれば循環）
  if (frame.ancestry.includes(frame.schemaName)) {
    return {
      frames: newFrames,
      items: state.items,
      errs: [
        ...state.errs,
        {
          code: errors.cyclicStruct,
          path: frame.basePath,
        },
      ],
    };
  }

  const structSchema = structMap.get(frame.schemaName);
  if (!structSchema) {
    return {
      frames: newFrames,
      items: state.items,
      errs: [
        ...state.errs,
        {
          code: errors.undefinedStruct,
          path: frame.basePath,
        },
      ],
    };
  }

  const childrenDesired: Frame[] = createChildFrames(frame, structSchema);
  if (structSchema.scalars.length > 0 || structSchema.scalarArrays.length > 0) {
    // 現在ノードを追加（pre-order）

    const current: StructPropertysPathEx3<Scalar, Array> = createNode(
      structSchema,
      {
        path: frame.basePath,
        structName: frame.schemaName,
      }
    );
    newFrames.push(...childrenDesired);
    return {
      frames: newFrames,
      items: [...state.items, current],
      errs: state.errs,
    };
  }
  newFrames.push(...childrenDesired);
  return {
    frames: newFrames,
    items: state.items,
    errs: state.errs,
  };
}

function collectFromSchema<S extends ScalarParam, A extends ArrayParamTypes>(
  schemaName: string,
  basePath: string,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>,
  errors: ErrorCodes
): TemplateGE<S, A> {
  type StateType = State2<S, A>;
  const state: StateType = {
    items: [],
    errs: [],
    frames: [
      {
        schemaName,
        basePath,
        ancestry: [],
      },
    ],
  };

  // 上限反復回数 — safe upper bound
  const maxPass: number = Math.max(1, structMap.size * 3 + 5);

  // reduce を使って stepState を繰り返す（for/while を使わない）
  const finalState = Array.from({ length: maxPass }).reduce<StateType>(
    (s) => (s.frames.length === 0 ? s : stepState(s, structMap, errors)),
    state
  );

  return { items: finalState.items, errors: finalState.errs };
}

export const getPathFromStructParam = <
  S extends PluginParamEx<ScalarParam>,
  A extends PluginParamEx<ArrayParamTypes>
>(
  params: PluginParamEx<StructRefParam>,
  parent: string,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx3<S, A>>,
  errors: ErrorCodes = ERROR_CODE
): TemplateGE<S["attr"], A["attr"]> => {
  // 各パラメータから構造体名を取得し、collectFromSchemaで集約
  return collectFromSchema(
    params.attr.struct,
    `${parent}.${params.name}`,
    structMap,
    errors
  );
};

export const getPathFromStructArraySchema = <
  S extends ScalarParam,
  A extends ArrayParamTypes
>(
  param: PluginParamEx<StructArrayRefParam>,
  parent: string,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx2<S, A>>,
  errors: ErrorCodes = ERROR_CODE
): TemplateGE<S, A> => {
  return collectFromSchema<S, A>(
    param.attr.struct,
    `${parent}.${param.name}[*]`,
    structMap,
    errors
  );
};

export const getPathFromStructSchema = <
  S extends PluginParamEx<ScalarParam>,
  A extends PluginParamEx<ArrayParamTypes>
>(
  structName: string,
  parent: string,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx3<S, A>>,
  errors: ErrorCodes = ERROR_CODE
): TemplateGE<S["attr"], A["attr"]> => {
  return collectFromSchema(structName, parent, structMap, errors);
};
