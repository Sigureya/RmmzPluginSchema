import type { PluginParamsRecord } from "./plugin";

export interface ResultOfparsePluginParamRecord {
  plugins: PluginParamsRecord[];
  message: string;
  invalidPlugins: number;
  complete: boolean;
  error?: unknown;
}

export interface MessageOfparsePluginParamRecord {
  parseError: string;
  notArray: string;
  partialSuccess: string;
  success: string;
}
