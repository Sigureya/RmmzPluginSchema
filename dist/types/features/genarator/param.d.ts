import { PluginParam } from '../../rmmz/plugin';
import { PluginParamAnnotation } from './types/schema';
import { SchemaStringifyHandlers } from './types/stringlfy';
export declare const generatePluginParamAnnotation: <T extends "param" | "arg">(param: PluginParam, keyword: T, handlers: SchemaStringifyHandlers) => PluginParamAnnotation<T>;
