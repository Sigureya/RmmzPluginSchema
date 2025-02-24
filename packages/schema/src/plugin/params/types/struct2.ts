import type { AnnotationBase, BooleanArg, NumberArg } from "./primitive";
import type { AnnotationTypes } from "./struct";

// type Keys = Exclude<keyof BooleanArg, "parent" | "type">;

// テキストが入るアノテーション
// AnnotationBase:"desc" |"text"
// booleanArg:"on" | "off"
// select : option.text

// comboとかは別途対応。難しすぎる
const LIST = ["on", "off", "desc", "text"] as const;

type KeyIndex<T extends AnnotationBase, Index extends string> = Record<
  Extract<keyof T, (typeof LIST)[number]>,
  Index
>;

const fn = (ant: AnnotationTypes) => {
  //   return LIST.map<string | undefined>((k) => {
  //     return ant[k as keyof AnnotationBase];
  //   });
};
