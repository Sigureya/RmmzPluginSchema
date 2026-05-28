import { describe, expect, test } from "vitest";
import {
  createPluginParamsFromPipeline,
  createPluginParamsWithErrorsFromPipeline,
} from "./pluginParam";
import type { PluginParamSourceWithErrors } from "./types";

const createPipelineResult = (): PluginParamSourceWithErrors<string> => {
  return {
    plugins: [
      {
        pluginName: "PluginA",
        params: [
          {
            rootType: "param",
            rootName: "plugin",
            structName: "",
            param: {
              name: "textParam",
              attr: {
                kind: "string",
                default: "",
              },
            },
            value: "hello",
          },
        ],
        errors: [],
      },
      {
        pluginName: "PluginB",
        params: [],
        errors: [
          {
            phase: "parseParam",
            pluginName: "PluginB",
            message: "plugin parameter parse failed",
            errorInfo: "parse-error",
          },
        ],
      },
    ],
  };
};

describe("pluginParam", () => {
  test("createPluginParamsFromPipeline", () => {
    const result = createPluginParamsFromPipeline(createPipelineResult());

    expect(result).toEqual([
      {
        pluginName: "PluginA",
        params: [
          {
            rootType: "param",
            rootName: "plugin",
            structName: "",
            param: {
              name: "textParam",
              attr: {
                kind: "string",
                default: "",
              },
            },
            value: "hello",
          },
        ],
      },
      {
        pluginName: "PluginB",
        params: [],
      },
    ]);
  });

  test("createPluginParamsWithErrorsFromPipeline", () => {
    const result = createPluginParamsWithErrorsFromPipeline(
      createPipelineResult(),
    );

    expect(result).toEqual([
      {
        pluginName: "PluginA",
        params: [
          {
            rootType: "param",
            rootName: "plugin",
            structName: "",
            param: {
              name: "textParam",
              attr: {
                kind: "string",
                default: "",
              },
            },
            value: "hello",
          },
        ],
        errors: [],
      },
      {
        pluginName: "PluginB",
        params: [],
        errors: [
          {
            phase: "parseParam",
            pluginName: "PluginB",
            message: "plugin parameter parse failed",
            errorInfo: "parse-error",
          },
        ],
      },
    ]);
  });
});
