export interface PluginParamsObject {
    name: string;
    status: boolean;
    parameters: Record<string, unknown>;
    description: string;
}
