import type {
  BooleanParam,
  NumberParam,
  StringParam,
  StringArrayParam,
  ComboParam,
  SelectParam,
  FileParam,
  FileArrayParam,
  AnyStringParam,
  StructRefParam,
  StructArrayRefParam,
  RpgDataIdParam,
  RpgVariableParam,
  RpgSwitchArrayParam,
  RpgSwitchParam,
  RpgVariableArrayParam,
  NumberArrayParam,
  RpgDataIdArrayParam,
  SystemDataIdParam,
  SystemDataIdArrayParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { JSONSchemaType } from "ajv";

/**
 * PrimitiveParam 各型のスキーマ定義
 * discriminator パターンで kind フィールドで型を区別
 */

const booleanParamSchema = {
  type: "object" as const,
  properties: {
    kind: { const: "boolean", type: "string" },
    default: { type: "boolean" },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
    on: { type: "string", nullable: true },
    off: { type: "string", nullable: true },
  },
  required: ["kind", "default"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<BooleanParam>;

const numberParamSchema = {
  type: "object" as const,
  properties: {
    kind: { const: "number", type: "string" },
    default: { type: "number" },
    decimals: { type: "number", nullable: true },

    min: { type: "number", nullable: true },
    max: { type: "number", nullable: true },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
  },
  required: ["kind", "default"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<NumberParam>;

const numberArrayParamSchema = {
  type: "object" as const,
  properties: {
    kind: { const: "number[]", type: "string" },
    default: {
      type: "array",
      items: { type: "number" },
    },
    decimals: { type: "number", nullable: true },
    min: { type: "number", nullable: true },
    max: { type: "number", nullable: true },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
  },
  required: ["kind", "default"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<NumberArrayParam>;

const stringParamSchema = {
  type: "object" as const,
  properties: {
    kind: { enum: ["string", "multiline_string"] as const, type: "string" },
    default: { type: "string" },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
  },
  required: ["kind", "default"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<StringParam>;

const stringArrayParamSchema = {
  type: "object" as const,
  properties: {
    kind: { enum: ["string[]", "multiline_string[]"] as const, type: "string" },
    default: {
      type: "array" as const,
      items: { type: "string" },
    },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
  },
  required: ["kind", "default"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<StringArrayParam>;

const comboParamSchema = {
  type: "object" as const,
  properties: {
    kind: { const: "combo", type: "string" },
    default: { type: "string" },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
    options: {
      type: "array" as const,
      items: { type: "string" },
    },
  },
  required: ["kind", "default", "options"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<ComboParam>;

const selectParamSchema = {
  type: "object" as const,
  properties: {
    kind: { const: "select", type: "string" },
    default: { type: "string" },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
    options: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          value: { type: "string" },
          option: { type: "string" },
        },
        required: ["value", "option"],
        additionalProperties: false,
      },
    },
  },
  required: ["kind", "default", "options"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<SelectParam>;

const fileParamSchema = {
  type: "object" as const,
  properties: {
    kind: { const: "file", type: "string" },
    default: { type: "string" },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
    dir: { type: "string" },
  },
  required: ["kind", "default", "dir"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<FileParam>;

const fileArrayParamSchema = {
  type: "object" as const,
  properties: {
    kind: { const: "file[]", type: "string" },
    default: {
      type: "array" as const,
      items: { type: "string" },
    },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
    dir: { type: "string" },
  },
  required: ["kind", "default", "dir"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<FileArrayParam>;

const variableParamSchema = {
  type: "object" as const,
  properties: {
    kind: { const: "variable", type: "string" },
    default: { type: "number" },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
  },
  required: ["kind", "default"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<RpgVariableParam>;

const variableArrayParamSchema = {
  type: "object" as const,
  properties: {
    kind: { const: "variable[]", type: "string" },
    default: {
      type: "array" as const,
      items: { type: "number" },
    },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
  },
  required: ["kind", "default"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<RpgVariableArrayParam>;

const switchParamSchema = {
  type: "object" as const,
  properties: {
    kind: { const: "switch", type: "string" },
    default: { type: "number" },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
  },
  required: ["kind", "default"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<RpgSwitchParam>;

const switchArrayParamSchema = {
  type: "object" as const,
  properties: {
    kind: { const: "switch[]", type: "string" },
    default: {
      type: "array" as const,
      items: { type: "number" },
    },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
  },
  required: ["kind", "default"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<RpgSwitchArrayParam>;

const structRefParamSchema = {
  type: "object" as const,
  properties: {
    kind: { const: "struct", type: "string" },
    struct: { type: "string" },
    default: { type: "object" as const, nullable: true },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
  },
  required: ["kind", "struct"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<StructRefParam>;

const structArrayRefParamSchema = {
  type: "object" as const,
  properties: {
    kind: { const: "struct[]", type: "string" },
    struct: { type: "string" },
    default: {
      type: "array" as const,
      nullable: true,
      items: { type: "object" },
    },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
  },
  required: ["kind", "struct"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<StructArrayRefParam>;

const anyStringParamSchema = {
  type: "object" as const,
  properties: {
    kind: { const: "any", type: "string" },
    default: { type: "string" },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
  },
  required: ["kind", "default"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<AnyStringParam>;

// SystemDataId パラメータ（スキーマ名は動的）
const rpgDataIdParamSchema = {
  type: "object" as const,
  properties: {
    kind: {
      enum: [
        "actor",
        "armor",
        "class",
        "enemy",
        "item",
        "skill",
        "state",
        "troop",
        "weapon",
        "common_event",
      ] as const,
      type: "string",
    },
    default: { type: "number" },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
  },
  required: ["kind", "default"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<RpgDataIdParam>;

const rpgDataIdArrayParamSchema = {
  type: "object" as const,
  properties: {
    kind: {
      enum: [
        "actor[]",
        "armor[]",
        "class[]",
        "enemy[]",
        "item[]",
        "skill[]",
        "state[]",
        "troop[]",
        "weapon[]",
        "common_event[]",
      ] as const,
      type: "string",
    },
    default: {
      type: "array" as const,
      items: { type: "number" },
    },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
  },
  required: ["kind", "default"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<RpgDataIdArrayParam>;

const systemDataIdParamSchema = {
  type: "object" as const,
  properties: {
    kind: {
      enum: ["switch", "variable"] as const,
      type: "string",
    },
    default: { type: "number" },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
  },
  required: ["kind", "default"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<SystemDataIdParam>;

const systemDataIdArrayParamSchema = {
  type: "object" as const,
  properties: {
    kind: {
      enum: ["switch[]", "variable[]"] as const,
      type: "string",
    },
    default: {
      type: "array" as const,
      items: { type: "number" },
    },
    desc: { type: "string", nullable: true },
    text: { type: "string", nullable: true },
    parent: { type: "string", nullable: true },
  },
  required: ["kind", "default"],
  additionalProperties: false,
} as const satisfies JSONSchemaType<SystemDataIdArrayParam>;

/**
 * PrimitiveParam の anyOf スキーマ
 * discriminator パターンで kind フィールドで型を区別
 */
const primitiveParamSchema = {
  anyOf: [
    booleanParamSchema,
    numberParamSchema,
    numberArrayParamSchema,
    stringParamSchema,
    stringArrayParamSchema,
    comboParamSchema,
    selectParamSchema,
    fileParamSchema,
    fileArrayParamSchema,
    variableParamSchema,
    variableArrayParamSchema,
    switchParamSchema,
    switchArrayParamSchema,
    rpgDataIdParamSchema,
    structRefParamSchema,
    structArrayRefParamSchema,
    anyStringParamSchema,
    systemDataIdArrayParamSchema,
    systemDataIdParamSchema,
    rpgDataIdArrayParamSchema,
  ],
  discriminator: {
    propertyName: "kind",
  },
} as const;

export {
  primitiveParamSchema,
  booleanParamSchema,
  numberParamSchema,
  numberArrayParamSchema,
  stringParamSchema,
  stringArrayParamSchema,
  comboParamSchema,
  selectParamSchema,
  fileParamSchema,
  fileArrayParamSchema,
  variableParamSchema,
  variableArrayParamSchema,
  switchParamSchema,
  switchArrayParamSchema,
  rpgDataIdParamSchema,
  rpgDataIdArrayParamSchema,
  systemDataIdParamSchema,
  systemDataIdArrayParamSchema,
};
