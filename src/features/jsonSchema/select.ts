import type { SelectParam } from "@RpgTypes/rmmz/plugin/schema/compile";
import type { JSONSchemaType } from "ajv";
import { withDefault, withTexts } from "./scala/base/basicMetaField";
import type { JSONSchemaTypeWithRpgParam } from "./scala/base/x-rpg-param";
import { xparamBaseData } from "./scala/base/x-rpg-param";

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
