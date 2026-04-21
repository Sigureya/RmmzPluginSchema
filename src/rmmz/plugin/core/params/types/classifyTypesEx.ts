import type { ClassifiedPluginParamsTyped } from "./classifyTypes";
import type { PrimitiveStringParam } from "./paramUnion";
import type { FileParam, FileArrayParam, StringArrayParam } from "./primitive";

export type ClassifiedPluginFileParams = ClassifiedPluginParamsTyped<
  FileParam,
  FileArrayParam
>;

export type ClassifiedTextParams = ClassifiedPluginParamsTyped<
  PrimitiveStringParam,
  StringArrayParam
>;
