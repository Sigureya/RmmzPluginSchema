import type {
  DataKind_SystemUnion,
  DataKind_RpgUnion,
} from "./rpgDataTypesNames";
import type { SourceIdentifier } from "./sourceId";
import type {
  SystemKindText,
  SourceId_SystemSwitches,
  SourceId_SystemVariables,
  SourceIdUnion_RpgData,
} from "./types";

const DATA = 0 as const;
const SYSTEM_V = 1 as const;
const SYSTEM_S = 2 as const;

const KIND_TABLE = {
  variable: SYSTEM_V,
  switch: SYSTEM_S,
  actor: DATA,
  item: DATA,
  weapon: DATA,
  armor: DATA,
  skill: DATA,
  class: DATA,
  state: DATA,
  troop: DATA,
  enemy: DATA,
  common_event: DATA,
} as const satisfies Record<DataKind_RpgUnion | DataKind_SystemUnion, number>;

const MODULE_TABLE = ["data", "system", "system"] as const;

export interface SourceId_RmmzUnknown extends SourceIdentifier {
  author: "rmmz";
  module: "unknown";
  kind: string;
}

export type SourceId_ValidRmmzData =
  | SourceIdUnion_RpgData
  | SourceId_SystemSwitches
  | SourceId_SystemVariables;

const DEFAULT_KIND_PROXY: SystemKindText = {
  gameVariable: "variable",
  gameSwitch: "switch",
};

export const lookupKind = <
  Source extends string = DataKind_RpgUnion | DataKind_SystemUnion
>(
  kind: Source,
  x: SystemKindText = DEFAULT_KIND_PROXY
): SourceId_ValidRmmzData | SourceId_RmmzUnknown => {
  const index = KIND_TABLE[kind as DataKind_RpgUnion];
  if (index === undefined) {
    return {
      author: "rmmz",
      module: "unknown",
      kind: kind,
    };
  }
  const kindTable = [kind, x.gameVariable, x.gameSwitch] as const;
  return {
    author: "rmmz",
    module: MODULE_TABLE[index],
    kind: kindTable[index],
  } as
    | SourceIdUnion_RpgData
    | SourceId_SystemSwitches
    | SourceId_SystemVariables;
};

export const isRmmzDataKind = (
  sourceId: SourceIdentifier
): sourceId is SourceId_ValidRmmzData => {
  const lookuped = lookupKind(sourceId.kind);
  return (
    lookuped.author === sourceId.author &&
    lookuped.module === sourceId.module &&
    lookuped.kind === sourceId.kind
  );
};
