import type { AnnotationBase } from "./schema";

const xxx2 = () => {};

const xxx = (annotation: AnnotationBase, key: keyof AnnotationBase) => {
  return `@${key} ${annotation[key]}` as const;
};
