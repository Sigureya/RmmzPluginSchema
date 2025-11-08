import { SourceIdentifier } from '../../../../libs/namedItemSource';
import { SourceId_SystemSwitches, SourceId_SystemVariables } from '../../../../libs/sourceIdTypes';
import { SourceIdUnion_RpgData } from '../../../../libs/sourceIdTypesRpg';
import { DataKind_SystemUnion, DataKind_RpgUnion } from './types/rpgDataTypesNames';
export interface SourceId_RmmzUnknown extends SourceIdentifier {
    author: "rmmz";
    module: "unknown";
    kind: string;
}
export type SourceId_ValidRmmzData = SourceIdUnion_RpgData | SourceId_SystemSwitches | SourceId_SystemVariables;
export declare const lookupKind: <Source extends string = DataKind_RpgUnion | DataKind_SystemUnion>(kind: Source) => SourceId_ValidRmmzData | SourceId_RmmzUnknown;
export declare const isRmmzDataKind: (sourceId: SourceIdentifier) => sourceId is SourceId_ValidRmmzData;
