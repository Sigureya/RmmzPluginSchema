import type { StructPathResult, StructPropertysPath } from "./pathSchema";

export interface CommandPath {
  scalars: StructPropertysPath;
  structs: StructPathResult;
  structArrays: StructPathResult;
}
