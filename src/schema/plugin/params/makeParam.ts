import { makeDefault, makeDefaultJSON } from "./makeDefault";
import { baseAnnotion, typeAnnotation } from "./makeAnnotation";
import type { AnnotationTypes } from "./types";

const xxx = (
  name: string,
  ant: AnnotationTypes,
  mode: "@param" | "@arg" = "@param"
) => {
  const xxx = `${mode} ${name}` as const;
  const type = typeAnnotation(ant);
  const default_ = makeDefaultJSON(ant);
  const base = baseAnnotion(ant);
};
