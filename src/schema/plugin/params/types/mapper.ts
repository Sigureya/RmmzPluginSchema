import type {
  AnnotationBase,
  BooleanArg,
  NumberArg,
  StringArg,
  ToArrayAnnotation,
} from "./primitive";

type Dispatch<T, Param extends AnnotationBase> = (
  param: Param | ToArrayAnnotation<Param>
) => T;

export interface AnnotationMapper<T> {
  number: Dispatch<T, NumberArg>;
  boolean: Dispatch<T, BooleanArg>;
  string: Dispatch<T, StringArg>;
}
