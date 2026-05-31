export interface ReplaceHandler {
  findNewText: (path: string, oldValue: string) => string | undefined;
  tansaStop(path: string): boolean;
}
