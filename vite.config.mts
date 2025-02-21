import { defineConfig, Plugin } from "vite";
import path from "path";

export default defineConfig({
  plugins: [
    {
      name: "",
      load: (id) => {
        if (/\.test\.ts/.test(id)) {
          return "";
        }
        return null;
      },
    },
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "RmmzSchema", // グローバル変数名
      fileName: (format) => `RmmzSchema.${format}.js`, // 出力ファイル名
    },

    rollupOptions: {
      // 外部モジュール指定 (バンドルしない)
      external: ["react", "react-dom"], // 必要に応じて追加
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
