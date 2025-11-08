import type {
  RpgDataIdParam,
  SystemDataIdParam,
} from "@RmmzPluginSchema/rmmz/plugin";
import { lookupKind } from "@RmmzPluginSchema/rmmz/plugin";
import type { JSONSchemaType } from "ajv";
import { withDefault, withTexts } from "./base/basicMetaField";
import type { X_Param } from "./base/x-rpg-param";
import { xparamBaseData } from "./base/x-rpg-param";

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
