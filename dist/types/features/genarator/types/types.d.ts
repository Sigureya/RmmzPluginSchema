import { KEYWORD_AUTHOR, KEYWORD_BASE, KEYWORD_ORDERAFTER, KEYWORD_ORDERBEFORE, KEYWORD_PLUGINDESC, KEYWORD_URL } from '../../../rmmz/plugin/core/parse';
import { KeyWord } from './keyword';
export interface PluginDependencyAnnotations {
    base: KeyWord<typeof KEYWORD_BASE>[];
    orderBefore: KeyWord<typeof KEYWORD_ORDERBEFORE>[];
    orderAfter: KeyWord<typeof KEYWORD_ORDERAFTER>[];
}
export type PluginMetaAnnotation = {
    pluginDesc?: KeyWord<typeof KEYWORD_PLUGINDESC> | undefined;
    url?: KeyWord<typeof KEYWORD_URL> | undefined;
    author?: KeyWord<typeof KEYWORD_AUTHOR> | undefined;
};
