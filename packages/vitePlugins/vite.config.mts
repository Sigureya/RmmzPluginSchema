import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";
declare const __dirname: string;
export default defineConfig({
  build: {
    outDir: "./dist",
    lib: {
      entry: "src/index.ts",
      name: "vitePlugins",
      fileName: (format) => `vitePlugins.${format}.js`,
      formats: ["es", "cjs"],
    },
    sourcemap: true,
    rollupOptions: {
      external: ["vite", "@rmmz-annotation/schema"], // 依存関係を外部モジュールとして扱う
      output: {
        globals: {
          vite: "Vite",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@rmmz-annotation/schema": path.resolve(__dirname, "../schema/src"),
    },
  },
  plugins: [dts()],
});
