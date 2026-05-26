export interface ErrorStruct {
  code: string;
  source: "createPath" | "compileJSONPathSchema";
  pluginName: string;
  commandName: string;
  argName: string;
  path?: string;
  message: string;
}

export interface PluginErrorStruct {
  code: string;
  source: "createPath" | "compileJSONPathSchema";
  pluginName: string;
  paramName: string;
  path?: string;
  message: string;
}
