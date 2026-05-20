import type { PluginSchema } from "./pluginJSON2type";

export interface FlatCommand {
  plugin: string;
  comand: string;
  name: string;
  text: string;
  kind: string;
  desc: string;
}

export interface FlatSchema {
  params: FlatCommand[];
  commands: FlatCommand[];
}

export const flatSchema = (schema: PluginSchema): FlatSchema => {
  return {
    params: schema.schema.params.map((param): FlatCommand => {
      return {
        plugin: schema.pluginName,
        name: param.name,
        text: param.attr.text || "",
        kind: param.attr.kind,
        desc: param.attr.desc || "",
        comand: "",
      };
    }),
    commands: schema.schema.commands.flatMap((command) => {
      return command.args.map((arg): FlatCommand => {
        return {
          plugin: schema.pluginName,
          comand: command.command,
          name: arg.name,
          text: arg.attr.text || "",
          desc: arg.attr.desc || "",
          kind: arg.attr.kind,
        };
      });
    }),
  };
};
