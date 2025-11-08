import type { FileParam } from "@RmmzPluginSchema/rmmz/plugin";
import type { JSONSchemaType } from "ajv";
import { withDefault, withTexts } from "./base/basicMetaField";
import type { JSONSchemaTypeWithRpgParam } from "./base/x-rpg-param";
import { xparamBaseData } from "./base/x-rpg-param";

export const compileFileField = (data: FileParam) =>
  ({
    type: "string",
    ...withDefault(data.default),
    ...withTexts(data),
  } satisfies JSONSchemaType<string>);

export const compileFileFieldWithXparam = (
  data: FileParam
): JSONSchemaTypeWithRpgParam<FileParam> => ({
  type: "string",
  ...withDefault(data.default),
  ...withTexts(data),
  ...xparamBaseData(data, {
    dir: data.dir,
  }),
});
