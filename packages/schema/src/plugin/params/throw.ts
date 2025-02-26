import type { AnnotationBase } from "./types";

export const thorwAnnotationError = (ant: AnnotationBase, message: string) => {
  throw new Error(`${message}: ${ant.type}`, { cause: ant });
};
