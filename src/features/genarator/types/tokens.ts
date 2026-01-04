import type { KeyWord } from "./keyword";
import type { PluginSchemaAnnotation } from "./schema";
import type { Annotation_Meta, Annotation_PluginDependencies } from "./types";

export interface AnnotationTokens {
  locale?: string | undefined;
  schema: PluginSchemaAnnotation;
  meta: Annotation_Meta;
  target: KeyWord<"target">;
  dependencies: Annotation_PluginDependencies;
}

export type StructTokenBlock = [
  head: `/*~struct~${string}:${string}`,
  ...("" | KeyWord<string>)[],
  tail: "*/"
];

export type PluginBodyBlockToken = [
  head: `/*:${string}`,
  ...string[],
  tail: `*/`
];
