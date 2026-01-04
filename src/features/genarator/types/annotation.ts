import type { PluginBodyBlockToken, StructTokenBlock } from "./tokens";

export interface PluginAnnotationLines {
  body: PluginBodyBlockToken;
  structs: StructTokenBlock[];
}
