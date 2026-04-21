import { ClassifiedPluginParamsTyped } from './classifyTypes';
import { PrimitiveStringParam } from './paramUnion';
import { FileParam, FileArrayParam, StringArrayParam } from './primitive';
export type ClassifiedPluginFileParams = ClassifiedPluginParamsTyped<FileParam, FileArrayParam>;
export type ClassifiedTextParams = ClassifiedPluginParamsTyped<PrimitiveStringParam, StringArrayParam>;
