import { PluginExtractionHandlers } from './types';
export interface Handler2<E> extends PluginExtractionHandlers<E> {
    isText: (text: string) => boolean;
}
