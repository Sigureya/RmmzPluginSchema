export interface ErrorStruct {
  code: string;
  source: "createPath" | "compileJSONPathSchema";
  pluginName: string;
  commandName: string;
  argName: string;
  path?: string;
  message: string;
}
