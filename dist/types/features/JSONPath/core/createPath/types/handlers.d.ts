import { StructPathError } from './errorTypes';
export interface CommandBuildContext {
    pluginName: string;
    commandName: string;
    argName: string;
}
export interface CommandBuildErrorHandlers<E> {
    commandStructPathError(context: CommandBuildContext, error: StructPathError): E;
    commandCompileJSONPathSchemaError(context: CommandBuildContext, error: unknown): E;
}
export interface ParamBuildErrorHandlers<E> {
    paramStructPathError(context: ParamBuildContext, error: StructPathError): E;
    paramCompileJSONPathSchemaError(context: ParamBuildContext, error: unknown): E;
}
export interface ParamBuildContext {
    pluginName: string;
    paramName: string;
}
