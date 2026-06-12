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

export const SCHEMA_BOOLEAN_PARAM = {
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

export const SCHEMA_NUMBER_PARAM = {
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

export const SCHEMA_NUMBER_ARRAY_PARAM = {
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

export const SCHEMA_STRING_PARAM = {
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

export const SCHEMA_STRING_ARRAY_PARAM = {
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

export const SCHEMA_COMBO_PARAM = {
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

export const SCHEMA_SELECT_PARAM = {
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

export const SCHEMA_FILE_PARAM = {
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

export const SCHEMA_FILE_ARRAY_PARAM = {
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

export const SCHEMA_VARIABLE_PARAM = {
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

export const SCHEMA_VARIABLE_ARRAY_PARAM = {
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

export const SCHEMA_SWITCH_PARAM = {
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

export const SCHEMA_SWITCH_ARRAY_PARAM = {
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

export const SCHEMA_STRUCT_REF_PARAM = {
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

export const SCHEMA_STRUCT_ARRAY_REF_PARAM = {
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

export const SCHEMA_ANY_STRING_PARAM = {
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
export const SCHEMA_RPG_DATA_ID_PARAM = {
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

export const SCHEMA_RPG_DATA_ID_ARRAY_PARAM = {
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

export const SCHEMA_SYSTEM_DATA_ID_PARAM = {
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

export const SCHEMA_SYSTEM_DATA_ID_ARRAY_PARAM = {
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
export const SCHEMA_PRIMITIVE_PARAM = {
  anyOf: [
    SCHEMA_BOOLEAN_PARAM,
    SCHEMA_NUMBER_PARAM,
    SCHEMA_NUMBER_ARRAY_PARAM,
    SCHEMA_STRING_PARAM,
    SCHEMA_STRING_ARRAY_PARAM,
    SCHEMA_COMBO_PARAM,
    SCHEMA_SELECT_PARAM,
    SCHEMA_FILE_PARAM,
    SCHEMA_FILE_ARRAY_PARAM,
    SCHEMA_VARIABLE_PARAM,
    SCHEMA_VARIABLE_ARRAY_PARAM,
    SCHEMA_SWITCH_PARAM,
    SCHEMA_SWITCH_ARRAY_PARAM,
    SCHEMA_RPG_DATA_ID_PARAM,
    SCHEMA_STRUCT_REF_PARAM,
    SCHEMA_STRUCT_ARRAY_REF_PARAM,
    SCHEMA_ANY_STRING_PARAM,
    SCHEMA_SYSTEM_DATA_ID_ARRAY_PARAM,
    SCHEMA_SYSTEM_DATA_ID_PARAM,
    SCHEMA_RPG_DATA_ID_ARRAY_PARAM,
  ],
  discriminator: {
    propertyName: "kind",
  },
} as const;
