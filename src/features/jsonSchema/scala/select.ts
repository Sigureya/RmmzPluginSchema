import type { SelectParam } from "@RmmzPluginSchema/rmmz";
import type { JSONSchemaType } from "ajv";
import { withDefault, withTexts } from "./base/basicMetaField";
import type { JSONSchemaTypeWithRpgParam } from "./base/x-rpg-param";
import { xparamBaseData } from "./base/x-rpg-param";

export const compileSelectField = (
  data: SelectParam
): JSONSchemaType<string> => ({
  type: "string",
  ...withDefault(data.default),
  ...withTexts(data),
  ...(data.options ? { enum: data.options.map((o): string => o.value) } : {}),
});

export const compileSelectFieldWithXparam = (
  data: SelectParam
): JSONSchemaTypeWithRpgParam<SelectParam> => ({
  type: "string",
  ...withDefault(data.default),
  ...withTexts(data),
  ...{ enum: data.options.map((o): string => o.value) },
  ...xparamBaseData(data, {
    options: data.options.map((o) => ({
      value: o.value,
      option: o.option,
    })),
  }),
});
