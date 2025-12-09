import type {
  ClassifiedPluginParams,
  ClassifiedPluginParamsEx2,
  PluginParamEx,
  PluginScalarParam,
  StructArrayRefParam,
  StructRefParam,
  NumberArrayUnion,
  StringArrayUnion,
  ClassifiedPluginParamsEx7,
} from "@RmmzPluginSchema/rmmz/plugin";
import { toObjectPluginParams } from "@RmmzPluginSchema/rmmz/plugin";
import { makeScalarArrayPath, makeScalarValuesPath } from "./scalarValue";
import type { ErrorCodes, StructPathError } from "./types";
import type { StructPropertiesPath, TemplateGE7 } from "./types/template";

const ERROR_CODE = {
  undefinedStruct: "undefined_struct",
  cyclicStruct: "cyclic_struct",
} as const satisfies ErrorCodes;

interface Frame {
  schemaName: string;
  basePath: string;
  ancestry: string[];
}

interface State3<
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
> {
  frames: Frame[];
  items: StructPropertiesPath<S, NA | SA>[];
  errs: StructPathError[];
}

function createNode<
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
>(
  structSchema: ClassifiedPluginParamsEx2<S, NA | SA>,
  {
    path,
    structName,
  }: {
    path: string;
    structName: string;
  }
): StructPropertiesPath<S, NA | SA> {
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

const createChildFrames = (
  lastFrame: Frame,
  structSchema: ClassifiedPluginParams
): Frame[] => {
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
};

const stepState = <
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
>(
  state: State3<S, NA, SA>,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx7<S, NA, SA>>,
  errors: ErrorCodes
): State3<S, NA, SA> => {
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

    const current: StructPropertiesPath<S, NA | SA> = createNode<S, NA, SA>(
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
};

function collectFromSchema<
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
>(
  schemaName: string,
  basePath: string,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx7<S, NA, SA>>,
  errors: ErrorCodes
): TemplateGE7<S, NA, SA> {
  type StateType = State3<S, NA, SA>;
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
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
>(
  params: PluginParamEx<StructRefParam>,
  parent: string,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx7<S, NA, SA>>,
  errors: ErrorCodes = ERROR_CODE
): TemplateGE7<S, NA, SA> => {
  // 各パラメータから構造体名を取得し、collectFromSchemaで集約
  return collectFromSchema(
    params.attr.struct,
    `${parent}.${params.name}`,
    structMap,
    errors
  );
};

export const getPathFromStructArraySchema = <
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
>(
  param: PluginParamEx<StructArrayRefParam>,
  parent: string,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx7<S, NA, SA>>,
  errors: ErrorCodes = ERROR_CODE
): TemplateGE7<S, NA, SA> => {
  return collectFromSchema(
    param.attr.struct,
    `${parent}.${param.name}[*]`,
    structMap,
    errors
  );
};

export const getPathFromStructSchema = <
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
>(
  structName: string,
  parent: string,
  structMap: ReadonlyMap<string, ClassifiedPluginParamsEx7<S, NA, SA>>,
  errors: ErrorCodes = ERROR_CODE
): TemplateGE7<S, NA, SA> => {
  return collectFromSchema(structName, parent, structMap, errors);
};
