import type { JSONValue } from "@RmmzPluginSchema/libs/JSONValue";
import { JSONPathJS } from "jsonpath-js";
import { collectScalaResults } from "./value/paramStructRead";
import type { CommandPath } from "./value/types/commandTypes";
import type { StructPropertysPath } from "./value/types/pathSchemaTypes";
import type { ScalaPathResult } from "./value/types/result";

export interface PPEX {
  schema: StructPropertysPath;
  jsonPathJS: JSONPathJS;
}

export const ppp = (
  data: JSONValue,
  ppxx: ReadonlyArray<PPEX>
): ScalaPathResult[] => {
  return ppxx.flatMap((ppx) => sss(data, ppx));
};

const sss = (value: JSONValue, ppaa: PPEX): ScalaPathResult[] => {
  const segments = ppaa.jsonPathJS.pathSegments(value);
  return collectScalaResults(segments, ppaa.schema, ppaa.schema.structName);
};

export const mmm = (
  commands: ReadonlyArray<CommandPath>
): Map<string, PPEX[]> => {
  return new Map(
    commands.map((command): [string, PPEX[]] => [
      command.scalars.structName,
      buildCommandPathSchema(command),
    ])
  );
};

export const buildCommandPathSchema = (command: CommandPath): PPEX[] => {
  return [
    ...buildJSONPathJS(command.scalars),
    ...command.structs.items.flatMap(buildJSONPathJS),
    ...command.structArrays.items.flatMap(buildJSONPathJS),
  ];
};

const buildJSONPathJS = (structPath: StructPropertysPath): PPEX[] => {
  return structPath.scalaArrays.map(
    (scalaArray): PPEX => ({
      jsonPathJS: new JSONPathJS(scalaArray.path),
      schema: structPath,
    })
  );
};
