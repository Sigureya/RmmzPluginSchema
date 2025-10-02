import type { X_Param } from "@RpgTypes/features/jsonSchema/scala/base/x-rpg-param";
import { xparamBaseData } from "@RpgTypes/features/jsonSchema/scala/base/x-rpg-param";
import type {
  RpgDataIdParam,
  SystemDataIdParam,
} from "@RpgTypes/rmmz/plugin/schema/compile";
import { lookupKind } from "@RpgTypes/rmmz/plugin/schema/compile/kinds/core/rpgData/lookup";
import type { JSONSchemaType } from "ajv";
import { withDefault, withTexts } from "./base/basicMetaField";

export const makeRpgIdField = (data: RpgDataIdParam | SystemDataIdParam) =>
  ({
    type: "integer",
    ...withDefault(data.default),
    ...withTexts(data),
  } satisfies JSONSchemaType<number>);

export const makeRpgIdFieldWithXParam = (
  data: RpgDataIdParam | SystemDataIdParam
) => {
  return {
    type: "integer",
    ...withDefault(data.default),
    ...withTexts(data),
    ...(xparamBaseData(data, lookupKind(data.kind)) satisfies X_Param),
  } satisfies JSONSchemaType<number>;
};
