import type { JSONValue } from "./JSONValue";

export interface JSONPathReader {
  find(json: JSONValue): JSONValue;
  pathSegments(json: JSONValue): PathSegmentResult[];
}

export interface PathSegmentResult {
  value: JSONValue;
  segments: (string | number)[];
}
