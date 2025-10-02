import type {
  X_RmmzParam,
  X_ParamData,
} from "@RpgTypes/features/jsonSchema/base/x-rpg-param";
import type { SourceIdentifier } from "@RpgTypes/libs";
import type { NumberParam } from "@RpgTypes/rmmz/plugin/schema/compile";

export type X_ParamDataId = X_RmmzParam<SourceIdentifier, "dataId">;
export type X_ParamNumber = X_ParamData<Omit<NumberParam, "min" | "max">>;
