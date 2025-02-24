import type { Plugin } from "vite";
import type { Struct } from "@rmmz-annotation/schema";

export const rmmzAnnotation = (s: Struct<object>): Plugin => {
  return {
    name: "rmmz-annotation",
    enforce: "pre", // Viteのプラグイン実行順を最初にする
    apply: "build",
    config: (config, env) => {
      if (env.command === "build") {
        return {
          build: {
            rollupOptions: {
              output: {
                banner: "//仮置きの戻り値",
              },
            },
          },
        };
      }
    },
  };
};
