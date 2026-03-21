import { ParseState } from './types';
export interface DescAndText {
    desc?: string;
    text?: string;
}
export declare const withTexts: (command: DescAndText) => DescAndText;
export declare const flashCurrentItem: (state: ParseState) => ParseState;
