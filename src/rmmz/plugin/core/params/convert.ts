import type {
  PluginCommandSchemaArrayFiltered,
  PluginCommandTypeEx,
  PluginParam,
  PluginParamEx,
  PluginStructSchemaArray,
  PluginStructType,
  PrimitiveParam,
  PluginScalarParam,
} from "./types";

export function toObjectPluginParamsOld(
  params: ReadonlyArray<PluginParam>,
): Record<string, PrimitiveParam> {
  const e = params.map((p): [string, PrimitiveParam] => [p.name, p.attr]);
  return Object.fromEntries(e);
}

export function toObjectPluginParams<S extends PluginScalarParam>(
  params: ReadonlyArray<PluginParamEx<S>>,
): Record<string, S> {
  const e = params.map((p): [string, S] => [p.name, p.attr]);
  return Object.fromEntries(e);
}

export const toArrayPluginParam = <
  P extends Partial<Record<string, PrimitiveParam>>,
>(
  params: P,
): PluginParamEx<
  P[Extract<keyof P, string>] & PrimitiveParam,
  Extract<keyof P, string>
>[] => {
  type Key = Extract<keyof P, string>;
  type Attr = P[Key] & PrimitiveParam;
  return Object.entries(params as Record<Key, Attr>).map(
    ([name, attr]): PluginParamEx<Attr, Key> => {
      return {
        name: name as Key,
        attr: attr,
      };
    },
  );
};

export const convertStructSchema = <T extends PluginStructSchemaArray>(
  schema: T,
): PluginStructType<object> => {
  return {
    struct: schema.struct,
    params: toObjectPluginParamsOld(schema.params),
  };
};

export const convertPluginCommandSchema = <T extends PluginParam>(
  command: PluginCommandSchemaArrayFiltered<T>,
): PluginCommandTypeEx<object> => {
  return {
    ...textAndDesc(command),
    command: command.command,
    args: toObjectPluginParamsOld(command.args),
  };
};

const textAndDesc = (
  command: PluginCommandSchemaArrayFiltered<PluginParam>,
): { text?: string; desc?: string } => {
  return {
    ...(command.text ? { text: command.text } : {}),
    ...(command.desc ? { desc: command.desc } : {}),
  };
};
