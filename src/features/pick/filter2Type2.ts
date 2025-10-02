import type {
  ArrayParam,
  PrimitiveParam,
  ScalaParam,
  StructArrayRefParam,
  StructRefParam,
} from "../../rmmz/plugin/schema/compile/kinds";
import type { PluginStructSchemaArray } from "../../rmmz/plugin/schema/compile/kinds/core/types";

export interface PluginParamGroups<T extends PrimitiveParam = PrimitiveParam> {
  single: NamedAttribute<ScalaParam>[];
  array: NamedAttribute<Extract<T, ArrayParam>>[];
  struct: NamedAttribute<StructRefParam>[];
  structArray: NamedAttribute<StructArrayRefParam>[];
}

export interface NamedAttribute<T> {
  name: string;
  attr: T;
}

export interface FilterdPlugin<T extends PrimitiveParam = PrimitiveParam> {
  params: PluginParamGroups<T>;
  structs: PluginStructSchemaArray[];
  commands: Cmd2[];
}

export interface Cmd2 {
  command: string;
  desc?: string;
  text?: string;
  args: PluginParamGroups;
}
