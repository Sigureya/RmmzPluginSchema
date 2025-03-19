import {
  isArrayAnnotation,
  isTextAnnotation,
  isTextArrayAnnotation,
} from "./annotationTraits";
import { EMPTY_DICTINARY } from "./constants";
import { lookupDictionary } from "./makeAnnotation";
import type {
  AnnotationArrayTypes,
  AnnotationPrimitiveTypes,
  AnnotationSigleTypes,
  Dictionary,
} from "./types";

// 基本的な型のアノテーションを取得する関数群
const stringifySingleAnnotation = (
  ant: AnnotationSigleTypes,
  dic: Dictionary = EMPTY_DICTINARY
): string => {
  return isTextAnnotation(ant)
    ? lookupDictionary(ant.default, dic)
    : ant.default.toString();
};

const stringifyArrayAnnotation = (
  ant: AnnotationArrayTypes,
  dic: Dictionary = EMPTY_DICTINARY
): string => {
  const list: string[] = isTextArrayAnnotation(ant)
    ? ant.default.map<string>((s: string) => lookupDictionary(s, dic))
    : ant.default.map((s: number | string) => s.toString());
  return JSON.stringify(list, null, 0);
};

export const stringifyPrimitiveAnnotation = (
  ant: AnnotationPrimitiveTypes,
  dic: Dictionary = EMPTY_DICTINARY
): string => {
  return isArrayAnnotation(ant)
    ? stringifyArrayAnnotation(ant, dic)
    : stringifySingleAnnotation(ant, dic);
};
