import { StructParam } from '../../rmmz/plugin';
import { StructCompileLog } from './compileLog';
import { CompileContext } from './meta/compileOption';
import { AnyParamSchema } from './scala/base/anyParamSchema';
export declare const compileStructDetail: <T>(path: string, title: string, props: Record<string, StructParam>, ctx: CompileContext) => {
    schema: {
        type: "object";
        title: string;
        properties: Record<string, AnyParamSchema>;
        required: string[];
        additionalProperties: false;
    };
    logs: StructCompileLog<StructParam>[];
};
