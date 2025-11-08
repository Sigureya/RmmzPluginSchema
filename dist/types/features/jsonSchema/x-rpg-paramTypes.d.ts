import { SourceIdentifier } from '../../libs/namedItemSource';
import { NumberParam } from '../../rmmz/plugin';
import { X_ParamData, X_RmmzParam } from './scala/base/x-rpg-param';
export type X_ParamDataId = X_RmmzParam<SourceIdentifier, "dataId">;
export type X_ParamNumber = X_ParamData<Omit<NumberParam, "min" | "max">>;
