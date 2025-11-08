import type { StringParam } from "@RmmzPluginSchema/rmmz";
import type { JSONSchemaType } from "ajv";
import { withDefault, withTexts } from "./base/basicMetaField";
import type { JSONSchemaTypeWithRpgParam } from "./base/x-rpg-param";
import { xparamBaseData } from "./base/x-rpg-param";

export const compileStringField = (
  data: StringParam
): JSONSchemaType<string> => ({
  type: "string",
  ...withTexts(data),
  ...withDefault(data.default),
});

export const compileStringFieldWithXparam = (
  data: StringParam
): JSONSchemaTypeWithRpgParam<StringParam> => ({
  type: "string",
  ...withTexts(data),
  ...withDefault(data.default),
  ...xparamBaseData(data, {}),
});
