import type { PluginParamsRecord } from "./types";
import { validatePluginJS } from "./validate";

const commentRegex = /\s*\/\//;
const varLineRegex = /\s*[var|let|const]\s+\$plugins\s*=\s*/;
const braketRegex = /^\s*[\[\]]/;

const isIgnoredLine = (line: string): boolean => {
  return (
    commentRegex.test(line) || varLineRegex.test(line) || braketRegex.test(line)
  );
};

export const convertPluginsJSToJSON = (src: string): string[] => {
  return src.split("\n").filter((line) => !isIgnoredLine(line));
};

export const parsePluginParamRecord = (src: string): PluginParamsRecord[] => {
  const lines = convertPluginsJSToJSON(src);
  const jsonText = `[${lines.join("")}]`;
  const array = JSON.parse(jsonText);
  if (!Array.isArray(array)) {
    throw new Error("Parsed value is not an array");
  }
  if (array.every(validatePluginJS)) {
    return array;
  }
  throw new Error("Parsed value is not PluginParamsObject array");
};
