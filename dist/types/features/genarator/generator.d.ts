import { PluginSchema } from '../../rmmz/plugin';
import { SchemaStringifyHandlers, PluginAnnotationLines, PluginAnnotationTokens } from './types';
export declare const generatePluginAnnotationLines: (plugin: PluginSchema, handlers: SchemaStringifyHandlers) => PluginAnnotationLines;
export declare const generatePluginAnnotation: (plugin: PluginSchema, handlers: SchemaStringifyHandlers) => PluginAnnotationTokens;
