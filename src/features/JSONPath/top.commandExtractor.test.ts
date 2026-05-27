import type { MockedObject } from "vitest";
import { describe, test, vi, expect } from "vitest";
import type { JSONPathReader } from "@RmmzPluginSchema/libs/jsonPath";
import type {
  ClassifiedPluginParams,
  NumberParam,
  PluginParamEx,
  PluginSchemaArray,
  StringParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { JSONPathJS } from "jsonpath-js";
import type {
  BuildErrorHandlers,
  CommandArgExtractors,
  CommandBuildResult,
  ErrorStruct,
  JSONPathErrorContext,
  ParamBuildResult,
  PluginErrorStruct,
} from "./core";
import type {
  ParamBuildContext,
  ParamBuildErrorHandlers,
} from "./core/paramBuild";
import { buildCommandExtractorsV2, buildParamExtractors } from "./top";
type JSONPathErrorHandles = BuildErrorHandlers<ErrorStruct>;
type ParamErrorHandles = ParamBuildErrorHandlers<PluginErrorStruct>;

const valueArg: PluginParamEx<NumberParam> = {
  name: "value",
  attr: {
    kind: "number",
    default: 0,
  },
};

const noteArg: PluginParamEx<StringParam> = {
  name: "note",
  attr: {
    kind: "string",
    default: "",
  },
};
const schema: PluginSchemaArray = {
  commands: [
    {
      command: "cmd",
      desc: "test desc",
      text: "mock text",
      args: [valueArg, noteArg],
    },
  ],
  params: [
    { attr: { default: "", kind: "string" }, name: "textParam" },
    { attr: { default: 0, kind: "number" }, name: "numParam" },
    { attr: { default: false, kind: "boolean" }, name: "boolParam" },
  ],
  structs: [
    {
      struct: "Person",
      params: [
        { attr: { default: "Alice", kind: "string" }, name: "name" },
        { attr: { default: 17, kind: "number" }, name: "age" },
      ],
    },
  ],
};

const cmdExtractor: CommandArgExtractors = {
  commandName: "cmd",
  desc: "test desc",
  pluginName: "MockPlugin",
  text: "mock text",
  extractors: [
    {
      rootCategory: "args",
      rootName: "cmd",
      structArrays: [],
      structs: [],
      top: {
        bundleName: "number",
        arrays: [],
        scalar: {
          jsonPathJS: new JSONPathJS(`$["value"]`),
          record: {
            value: valueArg.attr,
          },
        },
      },
    },
    {
      rootName: "cmd",
      rootCategory: "args",
      structArrays: [],
      structs: [],
      top: {
        arrays: [],
        bundleName: "string",
        scalar: {
          jsonPathJS: new JSONPathJS(`$["note"]`),
          record: {
            note: noteArg.attr,
          },
        },
      },
    },
  ],
};
const mockCompileJSONPathSchemaError: ErrorStruct = {
  argName: "",
  commandName: "",
  message: "compile error",
  pluginName: "",
  code: "compile_jsonpath_schema_error",
  source: "compileJSONPathSchema",
};

const mockStructPathError: ErrorStruct = {
  argName: "",
  commandName: "",
  message: "struct path error",
  pluginName: "",
  source: "createPath",
  code: "struct_path_error",
};

const createJSONPathErrorHandlers = (): MockedObject<JSONPathErrorHandles> => {
  return {
    compileJSONPathSchemaError: vi.fn<
      JSONPathErrorHandles["compileJSONPathSchemaError"]
    >(() => mockCompileJSONPathSchemaError),
    structPathError: vi.fn<JSONPathErrorHandles["structPathError"]>(
      () => mockStructPathError,
    ),
  };
};

const mockParamCompileJSONPathSchemaError: PluginErrorStruct = {
  paramName: "",
  message: "compile error",
  pluginName: "",
  code: "compile_jsonpath_schema_error",
  source: "compileJSONPathSchema",
};

const mockParamStructPathError: PluginErrorStruct = {
  paramName: "",
  message: "struct path error",
  pluginName: "",
  source: "createPath",
  code: "struct_path_error",
};

const createParamErrorHandlers = (): MockedObject<ParamErrorHandles> => {
  return {
    compileJSONPathSchemaError: vi.fn<
      ParamErrorHandles["compileJSONPathSchemaError"]
    >(() => mockParamCompileJSONPathSchemaError),
    structPathError: vi.fn<ParamErrorHandles["structPathError"]>(
      () => mockParamStructPathError,
    ),
  };
};

const createStructMap = (): ReadonlyMap<string, ClassifiedPluginParams> =>
  new Map<string, ClassifiedPluginParams>([
    [
      "Person",
      {
        structs: [],
        structArrays: [],
        scalarArrays: [],
        scalars: [
          { name: "name", attr: { kind: "string", default: "Alice" } },
          { name: "age", attr: { kind: "number", default: 17 } },
        ],
      },
    ],
  ]);

describe("buildCommandExtractorsV2", () => {
  test("normal", () => {
    const handlers = createJSONPathErrorHandlers();
    const jsonPathFactory = vi.fn(
      (path): JSONPathReader => new JSONPathJS(path),
    );
    const expected: CommandArgExtractors[] = [cmdExtractor];
    const result: CommandBuildResult<ErrorStruct> = buildCommandExtractorsV2(
      "MockPlugin",
      schema.commands,
      createStructMap(),
      jsonPathFactory,
      handlers,
    );
    expect(jsonPathFactory).toHaveBeenCalled();
    expect(jsonPathFactory).toHaveBeenCalledWith(`$["value"]`);
    expect(jsonPathFactory).toHaveBeenCalledWith(`$["note"]`);
    expect(handlers.structPathError).not.toHaveBeenCalled();
    expect(handlers.compileJSONPathSchemaError).not.toHaveBeenCalled();
    expect(result.errors).toEqual([]);
    expect(result.extractors).toEqual(expected);
  });

  test("Factory Error", () => {
    const structMap = createStructMap();
    const handlers = createJSONPathErrorHandlers();
    const error = new Error("jsonPathFactory error");
    const jsonPathFactory = vi.fn(() => {
      throw error;
    });

    const expectedErrors: ErrorStruct[] = [
      mockCompileJSONPathSchemaError,
      mockCompileJSONPathSchemaError,
    ];
    const result = buildCommandExtractorsV2(
      "MockPlugin",
      schema.commands,
      structMap,
      jsonPathFactory,
      handlers,
    );
    expect(jsonPathFactory).toHaveBeenCalled();
    expect(handlers.structPathError).not.toHaveBeenCalled();
    expect(handlers.compileJSONPathSchemaError).toHaveBeenCalled();
    expect(handlers.compileJSONPathSchemaError).toHaveBeenCalledWith<
      [JSONPathErrorContext, unknown]
    >(
      {
        argName: "value",
        commandName: "cmd",
        pluginName: "MockPlugin",
      },
      error,
    );
    expect(handlers.compileJSONPathSchemaError).toHaveBeenCalledWith<
      [JSONPathErrorContext, unknown]
    >(
      {
        argName: "note",
        commandName: "cmd",
        pluginName: "MockPlugin",
      },
      error,
    );
    expect(result.errors).toEqual(expectedErrors);
  });
});

describe("buildParamExtractors", () => {
  test("normal", () => {
    const handlers = createParamErrorHandlers();
    const jsonPathFactory = vi.fn(
      (path): JSONPathReader => new JSONPathJS(path),
    );

    const result: ParamBuildResult = buildParamExtractors(
      "MockPlugin",
      schema.params,
      createStructMap(),
      jsonPathFactory,
      handlers,
    );

    expect(jsonPathFactory).toHaveBeenCalledWith(`$["textParam"]`);
    expect(jsonPathFactory).toHaveBeenCalledWith(`$["numParam"]`);
    expect(jsonPathFactory).toHaveBeenCalledWith(`$["boolParam"]`);
    expect(handlers.structPathError).not.toHaveBeenCalled();
    expect(handlers.compileJSONPathSchemaError).not.toHaveBeenCalled();
    expect(result.errors).toEqual([]);
    expect(result.extractors).toHaveLength(3);
    expect(result.extractors.map((x) => x.rootName)).toEqual([
      "plugin",
      "plugin",
      "plugin",
    ]);
    expect(result.extractors.every((x) => x.rootCategory === "param")).toBe(
      true,
    );
  });

  test("Factory Error", () => {
    const handlers = createParamErrorHandlers();
    const error = new Error("jsonPathFactory error2");
    const jsonPathFactory = vi.fn((): JSONPathReader => {
      throw error;
    });

    const result: ParamBuildResult = buildParamExtractors(
      "MockPlugin",
      schema.params,
      createStructMap(),
      jsonPathFactory,
      handlers,
    );

    const errorContexts: ParamBuildContext[] = [
      {
        pluginName: "MockPlugin",
        paramName: "textParam",
      },
      {
        pluginName: "MockPlugin",
        paramName: "numParam",
      },
      {
        pluginName: "MockPlugin",
        paramName: "boolParam",
      },
    ];
    errorContexts.forEach((context) => {
      expect(
        handlers.compileJSONPathSchemaError,
        context.paramName,
      ).toHaveBeenCalledWith(context, error);
    });

    expect(handlers.structPathError).not.toHaveBeenCalled();
    expect(handlers.compileJSONPathSchemaError).toHaveBeenCalledTimes(
      schema.params.length,
    );
    expect(result.errors).toEqual([
      mockParamCompileJSONPathSchemaError,
      mockParamCompileJSONPathSchemaError,
      mockParamCompileJSONPathSchemaError,
    ]);
    expect(result.extractors).toHaveLength(3);
    expect(result.extractors.every((x) => x.top === undefined)).toBe(true);
  });
});
