import { makeDefaultValueJSONLike } from "./makeDefault";
import {
  baseAnnotions,
  booleanAnnotations,
  comboAnnotations,
  fileAnnotations,
  numberAnnotations,
  selectAnnotations,
  typeAnnotation,
} from "./makeAnnotation";
import type {
  AnnotationPrimitiveTypes,
  Dictionary,
  ParamTexts,
  StructAnnotationBase_Completed,
} from "./types";
import { mapping } from "./mapping";
import { EMPTY_DICTINARY } from "./constants/";

export const uniqueAnnotations = (
  ant: AnnotationPrimitiveTypes | StructAnnotationBase_Completed,
  dic: Dictionary = EMPTY_DICTINARY
) => {
  return mapping<`@${string} ${string}`[]>(ant, {
    boolean: (b) => booleanAnnotations(b, dic),
    number: (num) => numberAnnotations(num),
    file: (f) => fileAnnotations(f),
    string: () => [],
    struct: () => [],
    select: (s) => selectAnnotations(s, dic),
    combo: (c) => comboAnnotations(c),
    dataIndex: () => [],
  });
};

export const makeParam = (
  name: string,
  ant: AnnotationPrimitiveTypes | StructAnnotationBase_Completed,
  mode: "@param" | "@arg" = "@param",
  dic: Dictionary = EMPTY_DICTINARY
): ParamTexts => {
  return {
    other: uniqueAnnotations(ant, dic),
    default: `@default ${makeDefaultValueJSONLike(ant)}`,
    name: `${mode} ${name}`,
    type: typeAnnotation(ant),
    base: baseAnnotions(ant, dic),
  };
};

export const joinAnntations = (paramTexts: ParamTexts): string[] => {
  return [
    "",
    paramTexts.name,
    paramTexts.type,
    paramTexts.default,
    ...paramTexts.base,
    ...paramTexts.other,
  ];
};
