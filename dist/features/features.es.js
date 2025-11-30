import { d as S, p as b, s as C, k as v, C as x, A as j, h as d } from "../shared/structMap.es.js";
const M = (a, r) => {
  if (a.length !== 0)
    return `${r}[${a.map((t) => `"${t.name}"`).join(",")}]`;
}, k = (a, r) => a.map((t) => ({ path: `${r}.${t.name}[*]`, param: t })), y = { undefinedStruct: "undefined_struct", cyclicStruct: "cyclic_struct" };
function J(a, r, t) {
  if (a.frames.length === 0) return a;
  const e = a.frames[a.frames.length - 1], m = a.frames.slice(0, -1);
  if (e.ancestry.includes(e.schemaName)) return { frames: m, items: a.items, errs: [...a.errs, {
    code: t.cyclicStruct,
    path: e.basePath
  }] };
  const s = r.get(e.schemaName);
  if (!s) return { frames: m, items: a.items, errs: [...a.errs, { code: t.undefinedStruct, path: e.basePath }] };
  const c = function(o, n) {
    const u = o.ancestry.concat(o.schemaName), l = o.basePath;
    return [...n.structs.map((i) => ({ schemaName: i.attr.struct, basePath: `${l}.${i.name}`, ancestry: u })), ...n.structArrays.map((i) => ({
      schemaName: i.attr.struct,
      basePath: `${l}.${i.name}[*]`,
      ancestry: u
    }))].reverse();
  }(e, s);
  if (s.scalars.length > 0 || s.scalarArrays.length > 0) {
    const o = function(n, { path: u, structName: l }) {
      return { category: "struct", objectSchema: S(n.scalars), name: l, scalarArrays: k(n.scalarArrays, u), scalarsPath: n.scalars.length > 0 ? M(n.scalars, u) : void 0 };
    }(s, {
      path: e.basePath,
      structName: e.schemaName
    });
    return m.push(...c), { frames: m, items: [...a.items, o], errs: a.errs };
  }
  return m.push(...c), { frames: m, items: a.items, errs: a.errs };
}
function g(a, r, t, e) {
  const m = {
    items: [],
    errs: [],
    frames: [{ schemaName: a, basePath: r, ancestry: [] }]
  }, s = Math.max(1, 3 * t.size + 5), c = Array.from({ length: s }).reduce((o) => o.frames.length === 0 ? o : J(o, t, e), m);
  return {
    items: c.items,
    errors: c.errs
  };
}
const T = (a, r, t, e = y) => {
  const m = a.map((s) => g(s.attr.struct, `${r}.${s.name}`, t, e));
  return { items: m.flatMap((s) => s.items), errors: m.flatMap((s) => s.errors) };
}, E = (a, r, t, e = y) => {
  const m = a.map((s) => g(s.attr.struct, `${r}.${s.name}[*]`, t, e));
  return { items: m.flatMap((s) => s.items), errors: m.flatMap((s) => s.errors) };
}, Q = (a, r, t, e = y) => g(a, r, t, e), P = (a, r, t, e) => b(t) ? N(a, t, e) : C(t) ? _(a, t, e) : v(t) ? F(a, r, t) : V(a, r, t), F = (a, r, t) => ({ rootCategory: a, rootName: r, scalars: {
  category: a,
  name: "array",
  objectSchema: {},
  scalarsPath: void 0,
  scalarArrays: [{ path: `$.${t.name}[*]`, param: t }]
}, structs: { items: [], errors: [] }, structArrays: { items: [], errors: [] } }), V = (a, r, t) => ({
  rootCategory: a,
  rootName: r,
  scalars: {
    category: "primitive",
    name: t.attr.kind,
    objectSchema: { [t.name]: t.attr },
    scalarsPath: `$.${t.name}`,
    scalarArrays: []
  },
  structArrays: { items: [], errors: [] },
  structs: { items: [], errors: [] }
}), R = (a, r, t) => N(a, r, t), N = (a, r, t) => ({ rootName: r.name, rootCategory: a, scalars: void 0, structArrays: { items: [], errors: [] }, structs: T([r], "$", t) }), _ = (a, r, t) => ({
  structArrays: E([r], "$", t),
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), w = (a, r) => r.map((t) => z(a, t)).flat(3), z = (a, r) => [r.top ? p(r, a, r.top) : [], r.structs.map((t) => p(r, a, t)), r.structArrays.map((t) => p(r, a, t))], p = (a, r, t) => {
  const e = t.bundleName;
  return [t.scalar ? B(a, e, r, t.scalar.jsonPathJS, t.scalar.record) : [], t.arrays.map((m) => q(a, e, r, m))].flat(2);
}, B = (a, r, t, e, m) => e.pathSegments(t).reduce((s, { value: c, segments: o }) => {
  if (typeof c == "object") return s;
  const n = o[o.length - 1];
  if (typeof n == "number") return s;
  const u = m[n];
  return u && s.push({
    roootName: a.rootName,
    rootType: a.rootCategory,
    category: "struct",
    name: r,
    value: c,
    param: { name: n, attr: u }
  }), s;
}, []), q = (a, r, t, e) => {
  const m = e.jsonPathJS.find(t);
  if (!Array.isArray(m)) return [];
  const s = e.schema.attr;
  return x(s) ? m.filter((c) => typeof c == "string").map((c) => ({ value: c, category: "struct", rootType: a.rootCategory, roootName: a.rootName, name: r, param: e.schema })) : j(s) ? m.filter((c) => typeof c == "number").map((c) => ({ roootName: a.rootName, rootType: a.rootCategory, value: c, category: "struct", name: r, param: e.schema })) : [];
}, A = (a, r) => {
  const t = a.scalars ? h(a.scalars, r) : void 0, e = a.structs.items.map((s) => h(s, r)), m = a.structArrays.items.map((s) => h(s, r));
  return {
    rootCategory: a.rootCategory,
    rootName: a.rootName,
    top: t,
    structs: e,
    structArrays: m
  };
}, h = (a, r) => a.scalarsPath ? { bundleName: a.name, arrays: f(a.scalarArrays, a.name, r), scalar: D(a.scalarsPath, a.objectSchema, r) } : {
  bundleName: a.name,
  arrays: f(a.scalarArrays, a.name, r)
}, f = (a, r, t) => a.map((e) => ({ jsonPathJS: t(e.path), schema: e.param, parentType: r })), D = (a, r, t) => ({ jsonPathJS: t(a), record: r }), $ = (a, r, t, e) => ({
  pluginName: a,
  commandName: r.command,
  desc: r.desc ?? "",
  text: r.text ?? "",
  extractors: K(r, t, e)
}), K = (a, r, t) => a.args.map((e) => {
  const m = P("args", a.command, e, r);
  return A(m, t);
}), G = (a, r) => ({
  pluginName: r.pluginName,
  commandName: r.commandName,
  args: w(a, r.extractors)
}), U = (a, r, t) => {
  const e = t.get(r);
  if (e) return G(a, e);
}, W = (a, r) => new Map(a.flatMap((t) => H(t, r))), H = (a, r) => {
  const t = d(a.schema.structs);
  return a.schema.commands.map((e) => [`${a.pluginName}:${e.command}`, $(a.pluginName, e, t, r)]);
}, X = (a, r, t) => {
  const e = d(r.structs);
  return {
    params: I(r, e, t),
    commands: L(a, r.commands, e, t)
  };
}, I = (a, r, t) => a.params.map((e) => {
  const m = P("param", e.name, e, r);
  return A(m, t);
}), L = (a, r, t, e) => r.map((m) => [`${a}:${m.command}`, $(a, m, t, e)]);
export {
  W as compileCommandExtractorsFromPlugins,
  $ as compilePluginCommandExtractor,
  H as compilePluginCommandPairs,
  X as createPluginValueExtractor,
  P as createPluginValuesPath,
  V as createPrimiteveParamPath,
  R as createStructParamPath,
  U as extractCommandArgsByKey,
  G as extractPluginCommandArgs,
  E as getPathFromStructArraySchema,
  T as getPathFromStructParam,
  Q as getPathFromStructSchema,
  k as makeScalarArrayPath,
  M as makeScalarValuesPath
};
