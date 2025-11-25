import type { PluginParamsObject } from "./types";

export const validatePluginJS = (data: unknown): data is PluginParamsObject => {
  if (Array.isArray(data)) {
    return false;
  }
  if (typeof data !== "object" || data === null) {
    return false;
  }

  if (hasName(data) && hasStatus(data) && hasDescription(data)) {
    if ("parameters" in data) {
      return isValidParam(data);
    }
  }
  return false;
};

const hasName = (obj: object): obj is { name: string } => {
  return "name" in obj && typeof obj.name === "string";
};

const hasStatus = (obj: object): obj is { status: boolean } => {
  return "status" in obj && typeof obj.status === "boolean";
};

const hasDescription = (obj: object): obj is { description: string } => {
  return "description" in obj && typeof obj.description === "string";
};

const isValidParam = (params: {
  parameters: unknown;
}): params is { parameters: Record<string, string> } => {
  if (typeof params.parameters !== "object" || params.parameters === null) {
    return false;
  }
  return Object.values(params.parameters).every(
    (value) => typeof value === "string"
  );
};
