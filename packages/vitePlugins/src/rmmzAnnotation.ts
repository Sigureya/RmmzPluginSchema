import type { Plugin, Rollup } from "vite";
import type { Struct } from "@rmmz-annotation/schema";
import { buildAnnotation, correctErros } from "@rmmz-annotation/schema";

const makeError = (): Rollup.RollupError => {
  return {
    message: "test",
    plugin: "test",
    loc: {
      file: "test",
      line: 1,
      column: 1,
    },
  };
};

export const rmmzAnnotation = (s: Struct<object>[]): Plugin => {
  return {
    name: "rmmz-annotation",
    enforce: "pre", // Viteのプラグイン実行順を最初にする
    apply: "build",
    buildStart() {
      const e = correctErros(s);
      if (e.length > 0) {
        this.error(e.join("\n"));
      }
    },
    config: (config, env) => {
      if (env.command === "build") {
        const ant: string = buildAnnotation(s);
        return {
          build: {
            rollupOptions: {
              output: {
                banner: ant,
              },
            },
          },
        };
      }
    },
  };
};
