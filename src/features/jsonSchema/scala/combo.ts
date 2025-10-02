import type { JSONSchemaType } from "ajv";
import type { ComboParam } from "../../../rmmz/plugin/schema/compile/kinds/core/primitiveParams";
import { withDefault, withTexts } from "./base/basicMetaField";
import type { JSONSchemaTypeWithRpgParam } from "./base/x-rpg-param";
import { xparamBaseData } from "./base/x-rpg-param";

export const compileComboField = (
  data: ComboParam
): JSONSchemaType<string> => ({
  type: "string",
  ...withDefault(data.default),
  ...withTexts(data),
});

export const compileComboFieldWithXparam = (
  data: ComboParam
): JSONSchemaTypeWithRpgParam<ComboParam> => ({
  type: "string",
  ...withDefault(data.default),
  ...withTexts(data),
  ...xparamBaseData(data, {
    options: [...data.options],
  }),
});
