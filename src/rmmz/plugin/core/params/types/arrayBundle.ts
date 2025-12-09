import type {
  PluginCommandSchemaArray,
  PluginCommandSchemaArrayFiltered,
} from "./arrayCommands";
import type {
  PluginParam,
  PluginParamEx,
  StructPluginParam,
} from "./arrayParamItems";
import type {
  PluginStructSchemaArray,
  PluginStructSchemaArrayFiltered,
} from "./arrayStructs";
import type {
  NumberArrayUnion,
  PluginScalarParam,
  PrimitiveStringParam,
  StringArrayUnion,
} from "./paramUnion";
import type {
  RpgVariableParam,
  RpgVariableArrayParam,
  FileParam,
  FileArrayParam,
  StringArrayParam,
} from "./primitive";

export interface PluginSchemaArrayFiltered7Ex<
  S extends PluginScalarParam,
  NA extends NumberArrayUnion,
  SA extends StringArrayUnion
> {
  params: (PluginParamEx<S | NA | SA> | StructPluginParam)[];
  structs: PluginStructSchemaArrayFiltered<
    PluginParamEx<S | NA | SA> | StructPluginParam
  >[];
  commands: PluginCommandSchemaArrayFiltered<
    PluginParamEx<S | NA | SA> | StructPluginParam
  >[];
}

export interface PluginSchemaArrayFiltered7<T extends PluginParam> {
  commands: PluginCommandSchemaArrayFiltered<T | StructPluginParam>[];
  params: (T | StructPluginParam)[];
  structs: PluginStructSchemaArrayFiltered<T | StructPluginParam>[];
}

export type PluginSchemaArray = PluginSchemaArrayFiltered7Ex<
  PluginScalarParam,
  NumberArrayUnion,
  StringArrayUnion
>;

export interface PluginSchemaArrayFiltered<T extends PluginParam> {
  commands: PluginCommandSchemaArrayFiltered<T | StructPluginParam>[];
  params: (T | StructPluginParam)[];
  structs: PluginStructSchemaArrayFiltered<T | StructPluginParam>[];
}

export type PluginVariableSchema = PluginSchemaArrayFiltered<
  PluginParamEx<RpgVariableParam | RpgVariableArrayParam>
>;

export type PluginFileParamsSchema = PluginSchemaArrayFiltered<
  PluginParamEx<FileParam | FileArrayParam>
>;

export type PluginTextSchema = PluginSchemaArrayFiltered<
  PluginParamEx<PrimitiveStringParam | StringArrayParam>
>;
