import { d as P, p as N, s as A, k as S, C as b, A as $, h as v } from "../shared/structMap.es.js";
const j = (a, t) => {
  if (a.length !== 0)
    return `${t}[${a.map((e) => `"${e.name}"`).join(",")}]`;
}, C = (a, t) => a.map((e) => ({ path: `${t}.${e.name}[*]`, param: e })), y = { undefinedStruct: "undefined_struct", cyclicStruct: "cyclic_struct" };
function x(a, t, e) {
  if (a.frames.length === 0) return a;
  const r = a.frames[a.frames.length - 1], m = a.frames.slice(0, -1);
  if (r.ancestry.includes(r.schemaName)) return { frames: m, items: a.items, errs: [...a.errs, {
    code: e.cyclicStruct,
    path: r.basePath
  }] };
  const s = t.get(r.schemaName);
  if (!s) return { frames: m, items: a.items, errs: [...a.errs, { code: e.undefinedStruct, path: r.basePath }] };
  const c = function(o, n) {
    const u = o.ancestry.concat(o.schemaName), l = o.basePath;
    return [...n.structs.map((i) => ({ schemaName: i.attr.struct, basePath: `${l}.${i.name}`, ancestry: u })), ...n.structArrays.map((i) => ({
      schemaName: i.attr.struct,
      basePath: `${l}.${i.name}[*]`,
      ancestry: u
    }))].reverse();
  }(r, s);
  if (s.scalars.length > 0 || s.scalarArrays.length > 0) {
    const o = function(n, { path: u, structName: l }) {
      return { category: "struct", objectSchema: P(n.scalars), name: l, scalarArrays: C(n.scalarArrays, u), scalarsPath: n.scalars.length > 0 ? j(n.scalars, u) : void 0 };
    }(s, {
      path: r.basePath,
      structName: r.schemaName
    });
    return m.push(...c), { frames: m, items: [...a.items, o], errs: a.errs };
  }
  return m.push(...c), { frames: m, items: a.items, errs: a.errs };
}
function g(a, t, e, r) {
  const m = {
    items: [],
    errs: [],
    frames: [{ schemaName: a, basePath: t, ancestry: [] }]
  }, s = Math.max(1, 3 * e.size + 5), c = Array.from({ length: s }).reduce((o) => o.frames.length === 0 ? o : x(o, e, r), m);
  return {
    items: c.items,
    errors: c.errs
  };
}
const J = (a, t, e, r = y) => {
  const m = a.map((s) => g(s.attr.struct, `${t}.${s.name}`, e, r));
  return { items: m.flatMap((s) => s.items), errors: m.flatMap((s) => s.errors) };
}, M = (a, t, e, r = y) => {
  const m = a.map((s) => g(s.attr.struct, `${t}.${s.name}[*]`, e, r));
  return { items: m.flatMap((s) => s.items), errors: m.flatMap((s) => s.errors) };
}, X = (a, t, e, r = y) => g(a, t, e, r), T = (a, t, e, r) => N(e) ? d(a, e, r) : A(e) ? O(a, e, r) : S(e) ? k(a, t, e) : F(a, t, e), k = (a, t, e) => ({ rootCategory: a, rootName: t, scalars: {
  category: a,
  name: "array",
  objectSchema: {},
  scalarsPath: void 0,
  scalarArrays: [{ path: `$.${e.name}[*]`, param: e }]
}, structs: { items: [], errors: [] }, structArrays: { items: [], errors: [] } }), F = (a, t, e) => ({
  rootCategory: a,
  rootName: t,
  scalars: {
    category: "primitive",
    name: e.attr.kind,
    objectSchema: { [e.name]: e.attr },
    scalarsPath: `$.${e.name}`,
    scalarArrays: []
  },
  structArrays: { items: [], errors: [] },
  structs: { items: [], errors: [] }
}), Y = (a, t, e) => d(a, t, e), d = (a, t, e) => ({ rootName: t.name, rootCategory: a, scalars: void 0, structArrays: { items: [], errors: [] }, structs: J([t], "$", e) }), O = (a, t, e) => ({
  structArrays: M([t], "$", e),
  rootName: t.name,
  rootCategory: a,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), E = (a, t) => t.map((e) => V(a, e)).flat(3), V = (a, t) => [t.top ? p(t, a, t.top) : [], t.structs.map((e) => p(t, a, e)), t.structArrays.map((e) => p(t, a, e))], p = (a, t, e) => {
  const r = e.bundleName;
  return [e.scalar ? _(a, r, t, e.scalar.jsonPathJS, e.scalar.record) : [], e.arrays.map((m) => w(a, r, t, m))].flat(2);
}, _ = (a, t, e, r, m) => r.pathSegments(e).reduce((s, { value: c, segments: o }) => {
  if (typeof c == "object") return s;
  const n = o[o.length - 1];
  if (typeof n == "number") return s;
  const u = m[n];
  return u && s.push({
    roootName: a.rootName,
    rootType: a.rootCategory,
    category: "struct",
    name: t,
    value: c,
    param: { name: n, attr: u }
  }), s;
}, []), w = (a, t, e, r) => {
  const m = r.jsonPathJS.find(e);
  if (!Array.isArray(m)) return [];
  const s = r.schema.attr;
  return b(s) ? m.filter((c) => typeof c == "string").map((c) => ({ value: c, category: "struct", rootType: a.rootCategory, roootName: a.rootName, name: t, param: r.schema })) : $(s) ? m.filter((c) => typeof c == "number").map((c) => ({ roootName: a.rootName, rootType: a.rootCategory, value: c, category: "struct", name: t, param: r.schema })) : [];
}, h = (a, t) => a.scalarsPath ? { bundleName: a.name, arrays: f(a.scalarArrays, a.name, t), scalar: z(a.scalarsPath, a.objectSchema, t) } : {
  bundleName: a.name,
  arrays: f(a.scalarArrays, a.name, t)
}, f = (a, t, e) => a.map((r) => ({ jsonPathJS: e(r.path), schema: r.param, parentType: t })), z = (a, t, e) => ({ jsonPathJS: e(a), record: t }), B = (a, t, e, r) => ({
  pluginName: a,
  commandName: t.command,
  desc: t.desc ?? "",
  text: t.text ?? "",
  extractors: W(t, e, r)
}), W = (a, t, e) => a.args.map((r) => ((m, s) => {
  const c = m.scalars ? h(m.scalars, s) : void 0, o = m.structs.items.map((u) => h(u, s)), n = m.structArrays.items.map((u) => h(u, s));
  return {
    rootCategory: m.rootCategory,
    rootName: m.rootName,
    top: c,
    structs: o,
    structArrays: n
  };
})(T("args", a.command, r, t), e)), q = (a, t) => ({ pluginName: t.pluginName, commandName: t.commandName, values: E(a, t.extractors) }), Z = (a, t, e) => {
  const r = e.get(t);
  if (r) return q(a, r);
}, aa = (a, t) => new Map(a.flatMap((e) => D(e, t))), D = (a, t) => {
  const e = v(a.schema.structs);
  return a.schema.commands.map((r) => [`${a.pluginName}:${r.command}`, B(a.pluginName, r, e, t)]);
}, G = /\s*\/\//, H = /\s*[var|let|const]\s+\$plugins\s*=\s*/, K = (a) => a.split(`
`).filter((t) => !((e) => G.test(e) || H.test(e))(t)).map((t) => t.endsWith("];") ? t.slice(0, -1) : t), ta = (a) => {
  const t = K(a).join(`
`);
  return JSON.parse(t);
}, ea = (a) => !Array.isArray(a) && typeof a == "object" && a !== null && !!(I(a) && L(a) && Q(a) && "parameters" in a) && R(a), I = (a) => "name" in a && typeof a.name == "string", L = (a) => "status" in a && typeof a.status == "boolean", Q = (a) => "description" in a && typeof a.description == "string", R = (a) => typeof a.parameters == "object" && a.parameters !== null && Object.values(a.parameters).every((t) => typeof t == "string");
export {
  aa as compileCommandExtractorsFromPlugins,
  B as compilePluginCommandExtractor,
  K as convertPluginsJSToJSON,
  Y as createPluginValuesPathPP,
  T as createPluginValuesPathPP2,
  F as createPrimiteveParamPath,
  Z as extractCommandArgsByKey,
  q as extractPluginCommandArgs,
  M as getPathFromStructArraySchema,
  J as getPathFromStructParam,
  X as getPathFromStructSchema,
  C as makeScalarArrayPath,
  j as makeScalarValuesPath,
  ta as parsePluginParamObject,
  ea as validatePluginJS
};
