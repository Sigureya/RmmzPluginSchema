import { d as P, p as N, s as A, k as $, C as S, A as b, h as C } from "../shared/structMap.es.js";
const v = (a, t) => {
  if (a.length !== 0)
    return `${t}[${a.map((r) => `"${r.name}"`).join(",")}]`;
}, j = (a, t) => a.map((r) => ({ path: `${t}.${r.name}[*]`, param: r })), y = { undefinedStruct: "undefined_struct", cyclicStruct: "cyclic_struct" };
function x(a, t, r) {
  if (a.frames.length === 0) return a;
  const e = a.frames[a.frames.length - 1], m = a.frames.slice(0, -1);
  if (e.ancestry.includes(e.schemaName)) return { frames: m, items: a.items, errs: [...a.errs, {
    code: r.cyclicStruct,
    path: e.basePath
  }] };
  const s = t.get(e.schemaName);
  if (!s) return { frames: m, items: a.items, errs: [...a.errs, { code: r.undefinedStruct, path: e.basePath }] };
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
      return { category: "struct", objectSchema: P(n.scalars), name: l, scalarArrays: j(n.scalarArrays, u), scalarsPath: n.scalars.length > 0 ? v(n.scalars, u) : void 0 };
    }(s, {
      path: e.basePath,
      structName: e.schemaName
    });
    return m.push(...c), { frames: m, items: [...a.items, o], errs: a.errs };
  }
  return m.push(...c), { frames: m, items: a.items, errs: a.errs };
}
function g(a, t, r, e) {
  const m = {
    items: [],
    errs: [],
    frames: [{ schemaName: a, basePath: t, ancestry: [] }]
  }, s = Math.max(1, 3 * r.size + 5), c = Array.from({ length: s }).reduce((o) => o.frames.length === 0 ? o : x(o, r, e), m);
  return {
    items: c.items,
    errors: c.errs
  };
}
const M = (a, t, r, e = y) => {
  const m = a.map((s) => g(s.attr.struct, `${t}.${s.name}`, r, e));
  return { items: m.flatMap((s) => s.items), errors: m.flatMap((s) => s.errors) };
}, k = (a, t, r, e = y) => {
  const m = a.map((s) => g(s.attr.struct, `${t}.${s.name}[*]`, r, e));
  return { items: m.flatMap((s) => s.items), errors: m.flatMap((s) => s.errors) };
}, I = (a, t, r, e = y) => g(a, t, r, e), J = (a, t, r, e) => N(r) ? d(a, r, e) : A(r) ? V(a, r, e) : $(r) ? T(a, t, r) : F(a, t, r), T = (a, t, r) => ({ rootCategory: a, rootName: t, scalars: {
  category: a,
  name: "array",
  objectSchema: {},
  scalarsPath: void 0,
  scalarArrays: [{ path: `$.${r.name}[*]`, param: r }]
}, structs: { items: [], errors: [] }, structArrays: { items: [], errors: [] } }), F = (a, t, r) => ({
  rootCategory: a,
  rootName: t,
  scalars: {
    category: "primitive",
    name: r.attr.kind,
    objectSchema: { [r.name]: r.attr },
    scalarsPath: `$.${r.name}`,
    scalarArrays: []
  },
  structArrays: { items: [], errors: [] },
  structs: { items: [], errors: [] }
}), L = (a, t, r) => d(a, t, r), d = (a, t, r) => ({ rootName: t.name, rootCategory: a, scalars: void 0, structArrays: { items: [], errors: [] }, structs: M([t], "$", r) }), V = (a, t, r) => ({
  structArrays: k([t], "$", r),
  rootName: t.name,
  rootCategory: a,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), _ = (a, t) => t.map((r) => w(a, r)).flat(3), w = (a, t) => [t.top ? h(t, a, t.top) : [], t.structs.map((r) => h(t, a, r)), t.structArrays.map((r) => h(t, a, r))], h = (a, t, r) => {
  const e = r.bundleName;
  return [r.scalar ? z(a, e, t, r.scalar.jsonPathJS, r.scalar.record) : [], r.arrays.map((m) => E(a, e, t, m))].flat(2);
}, z = (a, t, r, e, m) => e.pathSegments(r).reduce((s, { value: c, segments: o }) => {
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
}, []), E = (a, t, r, e) => {
  const m = e.jsonPathJS.find(r);
  if (!Array.isArray(m)) return [];
  const s = e.schema.attr;
  return S(s) ? m.filter((c) => typeof c == "string").map((c) => ({ value: c, category: "struct", rootType: a.rootCategory, roootName: a.rootName, name: t, param: e.schema })) : b(s) ? m.filter((c) => typeof c == "number").map((c) => ({ roootName: a.rootName, rootType: a.rootCategory, value: c, category: "struct", name: t, param: e.schema })) : [];
}, p = (a, t) => a.scalarsPath ? { bundleName: a.name, arrays: f(a.scalarArrays, a.name, t), scalar: B(a.scalarsPath, a.objectSchema, t) } : {
  bundleName: a.name,
  arrays: f(a.scalarArrays, a.name, t)
}, f = (a, t, r) => a.map((e) => ({ jsonPathJS: r(e.path), schema: e.param, parentType: t })), B = (a, t, r) => ({ jsonPathJS: r(a), record: t }), K = (a, t, r, e) => ({
  pluginName: a,
  commandName: t.command,
  desc: t.desc ?? "",
  text: t.text ?? "",
  extractors: q(t, r, e)
}), q = (a, t, r) => a.args.map((e) => ((m, s) => {
  const c = m.scalars ? p(m.scalars, s) : void 0, o = m.structs.items.map((u) => p(u, s)), n = m.structArrays.items.map((u) => p(u, s));
  return {
    rootCategory: m.rootCategory,
    rootName: m.rootName,
    top: c,
    structs: o,
    structArrays: n
  };
})(J("args", a.command, e, t), r)), D = (a, t) => ({ pluginName: t.pluginName, commandName: t.commandName, values: _(a, t.extractors) }), O = (a, t, r) => {
  const e = r.get(t);
  if (e) return D(a, e);
}, Q = (a, t) => new Map(a.flatMap((r) => G(r, t))), G = (a, t) => {
  const r = C(a.schema.structs);
  return a.schema.commands.map((e) => [`${a.pluginName}:${e.command}`, K(a.pluginName, e, r, t)]);
};
export {
  Q as compileCommandExtractorsFromPlugins,
  K as compilePluginCommandExtractor,
  L as createPluginValuesPathPP,
  J as createPluginValuesPathPP2,
  F as eee,
  O as extractCommandArgsByKey,
  D as extractPluginCommandArgs,
  k as getPathFromStructArraySchema,
  M as getPathFromStructParam,
  I as getPathFromStructSchema,
  j as makeScalarArrayPath,
  v as makeScalarValuesPath
};
