import type { SourceIdentifier } from "@RmmzPluginSchema/libs";
import type { NumberParam } from "@RmmzPluginSchema/rmmz";
import type { X_ParamData, X_RmmzParam } from "./scala/base/x-rpg-param";

export type X_ParamDataId = X_RmmzParam<SourceIdentifier, "dataId">;
export type X_ParamNumber = X_ParamData<Omit<NumberParam, "min" | "max">>;
