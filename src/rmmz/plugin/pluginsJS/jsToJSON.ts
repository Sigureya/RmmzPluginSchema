import type { PluginParamsRecord } from "./types";
import type {
  MessageOfparsePluginParamRecord,
  ResultOfparsePluginParamRecord,
} from "./types/result2";
import { validatePluginJS } from "./validate";

const commentRegex = /\s*\/\//;
const varLineRegex = /\s*[var|let|const]\s+[^\s]+\s*=/;
const braketRegex = /^\s{0,3}[\[|\]\;]/;

const isIgnoredLine = (line: string): boolean => {
  return (
    commentRegex.test(line) || braketRegex.test(line) || varLineRegex.test(line)
  );
};

export const convertPluginsJSToJSON = (src: string): string[] => {
  return src.split("\n").filter((line) => !isIgnoredLine(line));
};

export const parsePluginParamRecord = (
  src: string,
  msg: MessageOfparsePluginParamRecord,
): ResultOfparsePluginParamRecord => {
  const lines: string[] = convertPluginsJSToJSON(src);
  const jsonText = `[${lines.join("")}]`;
  try {
    const array = JSON.parse(jsonText);
    if (!Array.isArray(array)) {
      return {
        complete: false,
        plugins: [],
        message: msg.notArray,
        invalidPlugins: 0,
      };
    }
    const validPlugins: PluginParamsRecord[] = array.filter(validatePluginJS);
    const numInvalid = array.length - validPlugins.length;
    return {
      complete: numInvalid === 0,
      plugins: validPlugins,
      invalidPlugins: numInvalid,
      message: numInvalid <= 0 ? msg.success : msg.partialSuccess,
    };
  } catch (e) {
    return {
      complete: false,
      plugins: [],
      invalidPlugins: 0,
      message: msg.parseError,
      error: e,
    };
  }
};
