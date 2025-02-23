import { makeDefaultValue } from "./makeDefault";
import {
  baseAnnotion,
  booleanArgAnnotations,
  comboAnnotations,
  fileAnnotations,
  numberArgAnnotations,
  selectAnnotations,
  typeAnnotation,
} from "./makeAnnotation";
import type { AnnotationTypes, ParamTexts } from "./types";
import { mapping } from "./mapping";

export const uniqueAnnotations = (
  ant: AnnotationTypes,
  dic: Record<string, string>
) => {
  return mapping<`@${string} ${string}`[]>(ant, {
    boolean: (b) => booleanArgAnnotations(b),
    number: (num) => numberArgAnnotations(num),
    file: (f) => fileAnnotations(f),
    string: () => [],
    struct: () => [],
    select: (s) => selectAnnotations(s),
    combo: (c) => comboAnnotations(c),
    dataIndex: () => [],
  });
};

export const makeParam = (
  name: string,
  ant: AnnotationTypes,
  mode: "@param" | "@arg" = "@param",
  dic: Record<string, string> = {}
): ParamTexts => {
  return {
    other: uniqueAnnotations(ant, dic),
    default: `@default ${makeDefaultValue(ant)}`,
    name: `${mode} ${name}`,
    type: typeAnnotation(ant),
    base: baseAnnotion(ant),
  };
};
