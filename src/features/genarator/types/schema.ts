import type { KeywordEnum } from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import type { KeyWord } from "./keyword";

export interface PluginSchemaAnnotation {
  params: PluginParamAnnotation[];
  structs: PluginStructAnnotation[];
  commands: PluginCommandAnnotation[];
}

export interface PluginParamAnnotation<
  T extends "param" | "arg" = "param" | "arg"
> {
  name: KeyWord<T>;
  attr: KeyWord<KeywordEnum>[];
  base: ParamBaseAnnotation;
  default: KeyWord<"default"> | undefined;
}

export interface ParamBaseAnnotation {
  kind: KeyWord<"type">;
  desc: KeyWord<"desc"> | undefined;
  text: KeyWord<"text"> | undefined;
  parent: KeyWord<"parent"> | undefined;
}

export interface PluginCommandAnnotation {
  command: KeyWord<"command">;
  text?: KeyWord<"text"> | undefined;
  desc?: KeyWord<"desc"> | undefined;
  args: PluginParamAnnotation<"arg">[];
}

export interface PluginStructAnnotation {
  locale?: string;
  struct: string;
  params: PluginParamAnnotation[];
}
