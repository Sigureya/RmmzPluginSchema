import type {
  StructAnnotation_Union,
  StructAnnotation_WithName,
  StructAnnotation_WithParams,
  StructAnnotation_WithDefault,
} from "./types";

export const hasStructParams = <T extends object>(
  annotation: StructAnnotation_Union<T>
): annotation is StructAnnotation_WithParams<T> => {
  const st = annotation.struct;
  if (st === undefined) {
    return false;
  }
  return st.params !== undefined;
};

export const hasStructDefault = <T extends object>(
  annotation: StructAnnotation_Union<T>
): annotation is StructAnnotation_WithDefault<T> => {
  return annotation.default !== undefined;
};

export const hasStructName = <T extends object>(
  annotation: StructAnnotation_Union<T>
): annotation is StructAnnotation_WithName<T> => {
  const st = annotation.struct;
  if (st === undefined) {
    return false;
  }
  return st.structName !== undefined;
};
