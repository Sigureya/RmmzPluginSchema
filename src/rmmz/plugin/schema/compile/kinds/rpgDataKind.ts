import type { JSONSchemaType } from "ajv";
import type { X_Param } from "../../../../../features/jsonSchema/base/x-rpg-param";
import { xparamBaseData } from "../../../../../features/jsonSchema/base/x-rpg-param";
import { withTexts } from "./core/paramBase/basicMetaField";
import type { RpgDataIdParam, SystemDataIdParam } from "./core/primitiveParams";
import { lookupKind } from "./core/rpgData/lookup";
import { withDefault } from "./utils";

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
