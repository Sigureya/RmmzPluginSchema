import { AnnotationBase, BooleanArg, ComboAnnotation, DataIndexArg, FilePathAnnotation, MultilineString, NumberArg, NumberSelect, StringArg, StringSelect, ToArrayAnnotation } from './primitive';
import { StructComplete } from './struct2';
type Dispatch<T, Param extends AnnotationBase> = (param: Omit<Param | ToArrayAnnotation<Param>, "default">) => T;
export interface AnnotationMapper<T> {
    number: Dispatch<T, NumberArg>;
    boolean: (bool: BooleanArg) => T;
    string: Dispatch<T, StringArg | MultilineString>;
    dataIndex: Dispatch<T, DataIndexArg<string>>;
    struct: (struct: StructComplete) => T;
    select: Dispatch<T, NumberSelect | StringSelect>;
    file: Dispatch<T, FilePathAnnotation>;
    combo: Dispatch<T, ComboAnnotation>;
}
export {};
