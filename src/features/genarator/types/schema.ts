import type { KeywordEnum } from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import type { KeyWord } from "./keyword";

export interface PluginSchemaAnnotation {
  params: PluginParamAnnotation[];
  structs: PluginStructAnnotation[];
  commands: PluginCommandAnnotation[];
}

export interface PluginParamAnnotation<T extends "param" | "arg" = "param"> {
  name: KeyWord<T>;
  attr: KeyWord<KeywordEnum>[];
}

export interface PluginCommandAnnotation {
  command: KeyWord<"command">;
  args: PluginParamAnnotation<"arg">[];
}

export interface PluginStructAnnotation {
  struct: KeyWord<"struct">;
  params: PluginParamAnnotation[];
}
