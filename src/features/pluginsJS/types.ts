export interface PluginParamsObject {
  name: string;
  status: boolean;
  description: string;
  parameters: Record<string, string>;
}
