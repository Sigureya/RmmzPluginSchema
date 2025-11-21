export interface ErrorCodes {
    undefinedStruct: string;
    cyclicStruct: string;
}
export interface StructPathError {
    path: string;
    code: string;
}
