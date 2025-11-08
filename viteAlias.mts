import path from "path";
import { AliasOptions } from "vite";

export const alias: AliasOptions = {
  "@RpgTypes": path.resolve(__dirname, "src"),
  "@RmmzPluginSchema/rmmz": path.resolve(__dirname, "src/rmmz"),
  "@RmmzPluginSchema/libs": path.resolve(__dirname, "src/libs"),
  "@RmmzPluginSchema/rmmz/plugin": path.resolve(__dirname, "src/rmmz/plugin"),
};
