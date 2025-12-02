import type {
  PluginCommandSchemaArrayFiltered,
  PluginCommandTypeEx,
  PluginParam,
  PluginParamEx,
  PluginStructSchemaArray,
  PluginStructType,
  PrimitiveParam,
  ObjectParamsV5,
  ScalarParam,
} from "./types";

export function toObjectPluginParamsOld(
  params: ReadonlyArray<PluginParam>
): Record<string, PrimitiveParam> {
  const e = params.map((p): [string, PrimitiveParam] => [p.name, p.attr]);
  return Object.fromEntries(e);
}

export function toObjectPluginParams(
  params: ReadonlyArray<PluginParamEx<ScalarParam>>
): Record<string, ScalarParam> {
  const e = params.map((p): [string, ScalarParam] => [p.name, p.attr]);
  return Object.fromEntries(e);
}

export const toArrayPluginParam = <T extends PrimitiveParam, K extends string>(
  params: ObjectParamsV5<K & string, T>
): PluginParamEx<T, string & K>[] => {
  return Object.entries<T>(params as Record<string & K, T>).map(
    ([name, attr]): PluginParamEx<T, K & string> => {
      return {
        name: name as Extract<K, string>,
        attr: attr,
      };
    }
  );
};

export const convertStructSchema = <T extends PluginStructSchemaArray>(
  schema: T
): PluginStructType<object> => {
  return {
    struct: schema.struct,
    params: toObjectPluginParamsOld(schema.params),
  };
};

export const convertPluginCommandSchema = <T extends PluginParam>(
  command: PluginCommandSchemaArrayFiltered<T>
): PluginCommandTypeEx<object> => {
  return {
    ...textAndDesc(command),
    command: command.command,
    args: toObjectPluginParamsOld(command.args),
  };
};

const textAndDesc = (
  command: PluginCommandSchemaArrayFiltered<PluginParam>
): { text?: string; desc?: string } => {
  return {
    ...(command.text ? { text: command.text } : {}),
    ...(command.desc ? { desc: command.desc } : {}),
  };
};
