import { ComboParam, SelectParam } from '../../rmmz/plugin';
import { KEYWORD_OPTION, KEYWORD_VALUE } from '../../rmmz/plugin/core/parse';
import { KeyWord } from './types';
export declare const generateSelectOptions: (select: SelectParam) => (KeyWord<typeof KEYWORD_OPTION> | KeyWord<typeof KEYWORD_VALUE>)[];
export declare const generateComboOptions: (combo: ComboParam) => KeyWord<typeof KEYWORD_OPTION>[];
