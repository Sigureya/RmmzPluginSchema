export interface SchemaStringifyHandlers {
    structArray: (value: object[]) => string;
    struct: (value: object) => string;
    numberArray: (value: number[]) => string;
    stringArray: (value: string[]) => string;
}
