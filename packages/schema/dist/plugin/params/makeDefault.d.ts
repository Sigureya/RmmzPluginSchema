import type * as Types from "./types/";
export declare const makeDefaultValue: <T extends Types.AnnotationTypes>(
  ant: T
) => string;
export declare const makeDefault: <T extends Types.AnnotationTypes>(
  ant: T
) => NonNullable<T["default"]>;
