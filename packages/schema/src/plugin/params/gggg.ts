import type { AnnotationTypes } from "./types";
import type { GGG, XX } from "./types/primitive/textXXX";

const xxx: GGG<Required<AnnotationTypes>>[] = [
  "default",
  "type",
  "desc",
  "text",
  "parent",
];
type KeyOfANT = keyof (AnnotationTypes extends any ? AnnotationTypes : never);
