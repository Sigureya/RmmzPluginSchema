import type {
  AnnotationBase,
  BooleanAnnotation,
  Primitive,
  Primitive_Numbers,
  Primitive_Strings,
} from "./schema";

const xxx2 = () => {};

const xxx = (annotation: AnnotationBase, key: keyof AnnotationBase) => {
  return `@${key} ${annotation[key]}` as const;
};

const annotationDefaultObject = <T extends object>(annotation: {
  default: T;
}) => {};

const makeDefaultPrimitive = (
  annotation: BooleanAnnotation | Primitive_Numbers | Primitive_Strings
) => {};
