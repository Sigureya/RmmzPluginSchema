import type { PluginParamsRecord } from "./plugin";

export interface ResultOfparsePluginParamRecord {
  plugins: PluginParamsRecord[];
  message: string;
  error?: unknown;
}

export interface MessageOfparsePluginParamRecord {
  parseError: string;
  notArray: string;
  success: string;
}
