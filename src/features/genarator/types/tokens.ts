import type { KeyWord } from "./keyword";
import type { PluginSchemaAnnotation } from "./schema";
import type { Annotation_Meta, Annotation_PluginDependencies } from "./types";

export interface AnnotationTokens {
  schema: PluginSchemaAnnotation;
  meta: Annotation_Meta;
  target: KeyWord<"target">;
  dependencies: Annotation_PluginDependencies;
}
