import type { PluginBodyBlockToken } from "./tokens";

export interface PluginAnnotationLines {
  body: PluginBodyBlockToken;
  structs: string[];
}
