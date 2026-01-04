import type { KeyWord } from "./keyword";
import type { PluginSchemaAnnotation } from "./schema";
import type {
  PluginMetaAnnotation,
  PluginDependencyAnnotations,
} from "./types";

export interface PluginAnnotationTokens {
  locale?: string | undefined;
  schema: PluginSchemaAnnotation;
  meta: PluginMetaAnnotation;
  target: KeyWord<"target">;
  dependencies: PluginDependencyAnnotations;
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
