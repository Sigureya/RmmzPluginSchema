import type {
  PluginScalarParam,
  NumberArrayParam,
  StringArrayParam,
  NumberArrayUnion,
  StringArrayUnion,
} from "@RmmzPluginSchema/rmmz/plugin";
import type {
  CommandExtractorEntry,
  PluginValuesExtractorBundle7,
} from "./extractor/types";

export interface PluginExtractorBundle<
  S extends PluginScalarParam = PluginScalarParam,
  NA extends NumberArrayUnion = NumberArrayUnion,
  SA extends StringArrayUnion = StringArrayUnion
> {
  pluginName: string;
  params: PluginValuesExtractorBundle7<S, NA, SA>[];
  commands: CommandExtractorEntry[];
}
