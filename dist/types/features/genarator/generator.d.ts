import { PluginSchema } from '../../rmmz/plugin';
import { SchemaStringifyHandlers, PluginAnnotationLines, PluginAnnotationTokens } from './types';
export declare const createDeepStringifyHandlers: () => SchemaStringifyHandlers;
export declare const generatePluginAnnotationText: (plugin: PluginSchema, handlers?: SchemaStringifyHandlers) => string;
export declare const generatePluginAnnotationLines: (plugin: PluginSchema, handlers?: SchemaStringifyHandlers) => PluginAnnotationLines;
export declare const generatePluginAnnotationTokens: (plugin: PluginSchema, handlers?: SchemaStringifyHandlers) => PluginAnnotationTokens;
