import type {
  PluginSchemaArray,
  ClassifiedTextParams,
} from "@RmmzPluginSchema/rmmz/plugin";
import {
  filterPluginSchemaByStringParam,
  classifyTextParams,
} from "@RmmzPluginSchema/rmmz/plugin";
import { getPathFromStructSchema } from "./core/paramStruct";
import type { StructPathResult } from "./core/value/types/pathSchemaTypes";

const p = (plugin: PluginSchemaArray) => {
  const textSchema = filterPluginSchemaByStringParam(plugin);
  const structs = textSchema.structs.map(
    (s): [string, ClassifiedTextParams] => [
      s.struct,
      classifyTextParams(s.params),
    ]
  );

  const commands = textSchema.commands.map(
    (command) =>
      [command.command, { c: classifyTextParams(command.args) }] as const
  );

  const map = new Map<string, ClassifiedTextParams>(structs);
  const vvvv: StructPathResult[] = textSchema.structs.map((struct) =>
    getPathFromStructSchema(struct.struct, "$", map)
  );
  return "";
};
