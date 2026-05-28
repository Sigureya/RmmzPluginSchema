import { describe, expect, test } from "vitest";
import {
  createPluginParamsFromPipeline,
  createPluginParamsWithErrorsFromPipeline,
} from "./pluginParam";
import type { PluginExtractionResult } from "./types";

const createPipelineResult = (): PluginExtractionResult<string> => {
  return {
    status: "partial",
    allErrors: [
      {
        phase: "parseParam",
        pluginName: "PluginB",
        message: "plugin parameter parse failed",
        errorInfo: "parse-error",
      },
    ],
    plugins: [
      {
        pluginName: "PluginA",
        record: {
          name: "PluginA",
          status: true,
          description: "plugin a",
          parameters: {
            textParam: "hello",
          },
        },
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
        commandExtractors: [],
        errors: [],
      },
      {
        pluginName: "PluginB",
        record: {
          name: "PluginB",
          status: true,
          description: "plugin b",
          parameters: {
            broken: "{",
          },
        },
        params: [],
        commandExtractors: [],
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
