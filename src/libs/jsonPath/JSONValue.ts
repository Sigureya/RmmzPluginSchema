type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [key: string]: JSONValue };
type JsonArray = JSONValue[];
export type JSONValue = JsonPrimitive | JsonArray | JsonObject;
