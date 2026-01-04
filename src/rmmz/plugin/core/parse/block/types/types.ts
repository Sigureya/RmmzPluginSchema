export interface Block {
  structs: PluginStructBlock[];
  bodies: PluginBodyBlock[];
}

export interface PluginStructBlock {
  locale?: string;
  struct: string;
  lines: string[];
}

export interface PluginBodyBlock {
  locale?: string;
  lines: string[];
}

export interface LocalizedBlock {
  body: PluginBodyBlock;
  structs: PluginStructBlock[];
}
