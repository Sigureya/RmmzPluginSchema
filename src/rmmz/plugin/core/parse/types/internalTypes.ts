import type { KeywordEnum } from "./keyword";
import type { PluginDependencies } from "./pluginDependencies";
import type { PluginMeta } from "./pluginMeta";
import type { OptionItem } from "./selectOption";
import type { PluginParamTokens, PluginCommandTokens } from "./token";

export interface OptionsState {
  items: OptionItem[];
  currentOption?: string;
}

export interface ParseState {
  meta: Partial<PluginMeta>;
  helpLines: string[];
  params: PluginParamTokens[];
  commands: PluginCommandTokens[];
  currentParam: PluginParamTokens | null;
  currentCommand: PluginCommandTokens | null;
  currentContext: KeywordEnum | null;
  currentOption: OptionsState | null;
  dependencies: PluginDependencies;
}
