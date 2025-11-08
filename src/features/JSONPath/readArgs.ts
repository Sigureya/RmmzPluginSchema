import type { JSONValue } from "@RmmzPluginSchema/libs/JSONValue";
import type { PluginParam, PrimitiveParam } from "@RpgTypes/rmmz/plugin";
import type { JSONPathJS } from "jsonpath-js";

type Person = {
  name: string;
  age: number;
};

interface CommandObject {
  pluginName: string;
  commandName: string;
  args: Record<string, JSONValue>;
}

interface SchemaX {
  commands: Map<string, CCVV>;
}

interface ResultX {
  value: number | string | boolean;
  param: PluginParam;
}

interface CCVV {
  fn: (cmd: CommandObject) => ResultX[];
  args: PPSS[];
}

interface PPSS {
  path: JSONPathJS;
  schema: PrimitiveParam;
}
// メモ
// structの情報はコンパイルした状態でCCVVに持たせる

const readArgs = (data: CommandObject, schema: SchemaX) => {
  const cmd = schema.commands.get(data.commandName);
  if (!cmd) {
    return null;
  }
};

const rrr = (data: CommandObject, ppss: PPSS) => {
  const result: ResultX[] = [];
  const r2 = ppss.path.pathSegments(data.args);
  if (!Array.isArray(r2)) {
    return [];
  }
  //  r2[0];

  return [];
};
