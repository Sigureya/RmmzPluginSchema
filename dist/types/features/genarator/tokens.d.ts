import { PluginStructAnnotation } from './types/schema';
import { PluginAnnotationTokens, PluginBodyBlockToken, StructTokenBlock } from './types/tokens';
export declare const generateStructTokenBlock: (struct: PluginStructAnnotation) => StructTokenBlock;
export declare const generatePluginBodyTokenBlock: (tokens: PluginAnnotationTokens) => PluginBodyBlockToken;
