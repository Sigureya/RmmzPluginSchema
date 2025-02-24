import { buildAnnotation as r, correctErros as i } from "@rmmz-annotation/schema";
const u = (o) => ({
  name: "rmmz-annotation",
  enforce: "pre",
  // Viteのプラグイン実行順を最初にする
  apply: "build",
  buildStart() {
    const n = i(o);
    n.length > 0 && this.error(n.join(`
`));
  },
  config: (n, t) => {
    if (t.command === "build")
      return {
        build: {
          rollupOptions: {
            output: {
              banner: r(o)
            }
          }
        }
      };
  }
});
export {
  u as rmmzAnnotation
};
//# sourceMappingURL=vitePlugins.es.js.map
