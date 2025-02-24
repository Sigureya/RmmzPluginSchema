import { AnnotationBase } from './annotationBase';
export interface BooleanArg extends AnnotationBase {
    default: boolean;
    type: "boolean";
    on?: string;
    off?: string;
}
