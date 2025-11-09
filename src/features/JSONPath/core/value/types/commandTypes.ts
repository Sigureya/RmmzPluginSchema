import type { StructPathResult, StructPropertysPath } from "./pathSchemaTypes";

export interface CommandPath {
  scalars: StructPropertysPath;
  structs: StructPathResult;
  structArrays: StructPathResult;
}
