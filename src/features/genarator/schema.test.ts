import type { MockedObject } from "vitest";
import { describe, expect, test, vi } from "vitest";
import type { PluginSchemaArray } from "@RmmzPluginSchema/rmmz/plugin";
import { generatePluginSchemaAnnotation } from "./schema";
import type { SchemaStringifyHandlers, PluginSchemaAnnotation } from "./types";

const createHandlers = (): MockedObject<SchemaStringifyHandlers> => ({
  numberArray: vi.fn(),
  structArray: vi.fn(),
  stringArray: vi.fn(),
  struct: vi.fn(),
});

describe("generatePluginSchemaAnnotation", () => {
  test("generates correct schema annotation for empty schema", () => {
    const schema: PluginSchemaArray = {
      params: [],
      structs: [],
      commands: [],
    };
    const expected: PluginSchemaAnnotation = {
      params: [],
      structs: [],
      commands: [],
    };
    const handlers = createHandlers();
    const annotation = generatePluginSchemaAnnotation(schema, handlers);
    expect(annotation).toEqual(expected);
    expect(handlers.numberArray).not.toHaveBeenCalled();
    expect(handlers.structArray).not.toHaveBeenCalled();
    expect(handlers.stringArray).not.toHaveBeenCalled();
    expect(handlers.struct).not.toHaveBeenCalled();
  });
  test("generates correct schema annotation for complex schema", () => {
    const schema: PluginSchemaArray = {
      structs: [
        {
          struct: "Person",
          params: [
            {
              name: "name",
              attr: {
                kind: "string",
                desc: "it's a name",
                text: "PersonName",
                default: "",
              },
            },
            {
              name: "age",
              attr: {
                kind: "number",
                min: 0,
                default: 0,
                desc: "aaa",
                text: "bbb",
              },
            },
          ],
        },
      ],
      commands: [
        {
          command: "TestCommand",
          desc: "This is a test command.",
          text: "Test Command Text",
          args: [
            {
              name: "arg1",
              attr: { kind: "boolean", default: true, desc: "An argument." },
            },
          ],
        },
      ],
      params: [
        {
          name: "param1",
          attr: {
            kind: "string",
            desc: "This is param1",
            default: "defaultValue",
          },
        },
      ],
    };
    const expected: PluginSchemaAnnotation = {
      commands: [
        {
          args: [
            {
              attr: [],
              base: {
                desc: "@desc An argument.",
                kind: "@type boolean",
                parent: undefined,
                text: undefined,
              },
              default: "@default true",
              name: "@arg arg1",
            },
          ],
          command: "@command TestCommand",
          desc: "@desc This is a test command.",
          text: "@text Test Command Text",
        },
      ],
      params: [
        {
          attr: [],
          base: {
            desc: "@desc This is param1",
            kind: "@type string",
            parent: undefined,
            text: undefined,
          },
          default: "@default defaultValue",
          name: "@param param1",
        },
      ],
      structs: [
        {
          params: [
            {
              attr: [],
              base: {
                desc: "@desc it's a name",
                kind: "@type string",
                parent: undefined,
                text: "@text PersonName",
              },
              default: "@default ",
              name: "@param name",
            },
            {
              attr: ["@min 0"],
              base: {
                desc: "@desc aaa",
                kind: "@type number",
                parent: undefined,
                text: "@text bbb",
              },
              default: "@default 0",
              name: "@param age",
            },
          ],
          struct: "Person",
        },
      ],
    };
    const handlers = createHandlers();
    const annotation = generatePluginSchemaAnnotation(schema, handlers);
    expect(annotation).toEqual(expected);
    expect(handlers.numberArray).not.toHaveBeenCalled();
    expect(handlers.structArray).not.toHaveBeenCalled();
    expect(handlers.stringArray).not.toHaveBeenCalled();
    expect(handlers.struct).not.toHaveBeenCalled();
  });
});
