"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const o=require("@rmmz-annotation/schema"),e=t=>({name:"rmmz-annotation",enforce:"pre",apply:"build",buildStart(){const n=o.correctErros(t);n.length>0&&this.error(n.join(`
`))},config:(n,r)=>{if(r.command==="build")return{build:{rollupOptions:{output:{banner:o.buildAnnotation(t)}}}}}});exports.rmmzAnnotation=e;
//# sourceMappingURL=vitePlugins.cjs.js.map
