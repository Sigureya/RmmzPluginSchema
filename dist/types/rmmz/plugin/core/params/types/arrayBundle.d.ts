import { PluginCommandSchemaArray, PluginCommandSchemaArrayFiltered } from './arrayCommands';
import { PluginParam, PluginParamEx, StructPluginParam } from './arrayParamItems';
import { PluginStructSchemaArray, PluginStructSchemaArrayFiltered } from './arrayStructs';
import { PrimitiveStringParam } from './paramUnion';
import { RpgVariableParam, RpgVariableArrayParam, FileParam, FileArrayParam, StringArrayParam } from './primitive';
export interface PluginSchemaArray {
    commands: PluginCommandSchemaArray[];
    params: PluginParam[];
    structs: PluginStructSchemaArray[];
}
export interface PluginSchemaArrayFiltered<T extends PluginParam> extends PluginSchemaArray {
    commands: PluginCommandSchemaArrayFiltered<T | StructPluginParam>[];
    params: (T | StructPluginParam)[];
    structs: PluginStructSchemaArrayFiltered<T | StructPluginParam>[];
}
export type PluginVariableSchema = PluginSchemaArrayFiltered<PluginParamEx<RpgVariableParam | RpgVariableArrayParam>>;
export type PluginFileParamsSchema = PluginSchemaArrayFiltered<PluginParamEx<FileParam | FileArrayParam>>;
export type PluginTextSchema = PluginSchemaArrayFiltered<PluginParamEx<PrimitiveStringParam | StringArrayParam>>;
