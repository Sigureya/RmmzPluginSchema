import type { AnnotationTypes } from "./types";
import type { AnnotationMapper } from "./types/mapper";

export const mapping = <T>(
  annotation: AnnotationTypes,
  mapper: AnnotationMapper<T>
) => {
  switch (annotation.type) {
    case "file":
    case "file[]":
      return mapper.file(annotation);
    case "number":
    case "number[]":
      return mapper.number(annotation);
    case "string":
    case "multiline_string":
    case "multiline_string[]":
    case "string[]":
      return mapper.string(annotation);
    case "boolean":
      return mapper.boolean(annotation);
    case "struct":
    case "struct[]":
      return mapper.struct(annotation);
    case "select":
    case "select[]":
      return mapper.select(annotation);
    case "combo":
      return mapper.combo(annotation);
    default:
      return mapper.dataIndex(annotation);
  }
};
