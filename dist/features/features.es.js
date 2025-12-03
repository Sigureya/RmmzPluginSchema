import { d as b, p as C, s as v, k as x, C as j, A as k, h as P } from "../shared/structMap.es.js";
const F = (a, t) => {
  if (a.length !== 0)
    return `${t}[${a.map((r) => `"${r.name}"`).join(",")}]`;
}, J = (a, t) => a.map((r) => ({ path: `${t}.${r.name}[*]`, param: r })), g = { undefinedStruct: "undefined_struct", cyclicStruct: "cyclic_struct" };
function T(a, t, r) {
  if (a.frames.length === 0) return a;
  const e = a.frames[a.frames.length - 1], s = a.frames.slice(0, -1);
  if (e.ancestry.includes(e.schemaName)) return { frames: s, items: a.items, errs: [...a.errs, {
    code: r.cyclicStruct,
    path: e.basePath
  }] };
  const m = t.get(e.schemaName);
  if (!m) return { frames: s, items: a.items, errs: [...a.errs, { code: r.undefinedStruct, path: e.basePath }] };
  const n = function(c, u) {
    const i = c.ancestry.concat(c.schemaName), l = c.basePath;
    return [...u.structs.map((o) => ({ schemaName: o.attr.struct, basePath: `${l}.${o.name}`, ancestry: i })), ...u.structArrays.map((o) => ({
      schemaName: o.attr.struct,
      basePath: `${l}.${o.name}[*]`,
      ancestry: i
    }))].reverse();
  }(e, m);
  if (m.scalars.length > 0 || m.scalarArrays.length > 0) {
    const c = function(u, { path: i, structName: l }) {
      return { category: "struct", objectSchema: b(u.scalars), name: l, scalarArrays: J(u.scalarArrays, i), scalarsPath: u.scalars.length > 0 ? F(u.scalars, i) : void 0 };
    }(m, {
      path: e.basePath,
      structName: e.schemaName
    });
    return s.push(...n), { frames: s, items: [...a.items, c], errs: a.errs };
  }
  return s.push(...n), { frames: s, items: a.items, errs: a.errs };
}
function d(a, t, r, e) {
  const s = {
    items: [],
    errs: [],
    frames: [{ schemaName: a, basePath: t, ancestry: [] }]
  }, m = Math.max(1, 3 * r.size + 5), n = Array.from({ length: m }).reduce((c) => c.frames.length === 0 ? c : T(c, r, e), s);
  return {
    items: n.items,
    errors: n.errs
  };
}
const E = (a, t, r, e = g) => d(a.attr.struct, `${t}.${a.name}`, r, e), M = (a, t, r, e = g) => d(a.attr.struct, `${t}.${a.name}[*]`, r, e), U = (a, t, r, e = g) => d(a, t, r, e), N = (a, t, r, e) => C(r) ? A(a, r, e) : v(r) ? w(a, r, e) : x(r) ? V(a, t, r) : _(a, t, r), V = (a, t, r) => ({
  rootCategory: a,
  rootName: t,
  scalars: { category: a, name: "array", objectSchema: {}, scalarsPath: void 0, scalarArrays: [{ path: `$.${r.name}[*]`, param: r }] },
  structs: { items: [], errors: [] },
  structArrays: { items: [], errors: [] }
}), _ = (a, t, r) => ({ rootCategory: a, rootName: t, scalars: {
  category: "primitive",
  name: r.attr.kind,
  objectSchema: { [r.name]: r.attr },
  scalarsPath: `$.${r.name}`,
  scalarArrays: []
}, structArrays: { items: [], errors: [] }, structs: { items: [], errors: [] } }), W = (a, t, r) => A(a, t, r), A = (a, t, r) => ({ rootName: t.name, rootCategory: a, scalars: void 0, structArrays: {
  items: [],
  errors: []
}, structs: E(t, "$", r) }), w = (a, t, r) => ({
  structArrays: M(t, "$", r),
  rootName: t.name,
  rootCategory: a,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), z = (a, t, r, e) => t.filter((s) => typeof s == "number").map((s) => ({
  roootName: a.rootName,
  rootType: a.rootCategory,
  value: s,
  category: "struct",
  name: r,
  param: e
})), B = (a, t, r, e) => t.filter((s) => typeof s == "string").map((s) => ({ roootName: a.rootName, rootType: a.rootCategory, value: s, category: "struct", name: r, param: e })), q = (a, t, r, e, s) => {
  if (typeof r == "object" || r === null) return null;
  const m = e[e.length - 1];
  if (typeof m == "number") return null;
  const n = s[m];
  return n ? {
    roootName: a.rootName,
    rootType: a.rootCategory,
    category: "struct",
    name: t,
    value: r,
    param: { name: m, attr: n }
  } : null;
}, D = (a, t) => t.map((r) => K(a, r)).flat(3), K = (a, t) => [t.top ? p(t, a, t.top) : [], t.structs.map((r) => p(t, a, r)), t.structArrays.map((r) => p(t, a, r))], p = (a, t, r) => {
  const e = r.bundleName, s = r.scalar ? ((n, c, u, i, l) => i.pathSegments(u).map(({ value: o, segments: h }) => q(n, c, o, h, l)).filter((o) => o !== null))(a, e, t, r.scalar.jsonPathJS, r.scalar.record) : [], m = r.arrays.map((n) => ((c, u, i, l) => {
    const o = l.jsonPathJS.find(i);
    if (!Array.isArray(o)) return [];
    const h = l.schema.attr;
    return j(h) ? B(c, o, u, l.schema) : k(h) ? z(c, o, u, l.schema) : [];
  })(a, e, t, n));
  return [s, m].flat(2);
}, $ = (a, t) => {
  const r = a.scalars ? y(a.scalars, t) : void 0, e = a.structs.items.map((m) => y(m, t)), s = a.structArrays.items.map((m) => y(m, t));
  return {
    rootCategory: a.rootCategory,
    rootName: a.rootName,
    top: r,
    structs: e,
    structArrays: s
  };
}, y = (a, t) => a.scalarsPath ? { bundleName: a.name, arrays: f(a.scalarArrays, a.name, t), scalar: G(a.scalarsPath, a.objectSchema, t) } : {
  bundleName: a.name,
  arrays: f(a.scalarArrays, a.name, t)
}, f = (a, t, r) => a.map((e) => ({ jsonPathJS: r(e.path), schema: e.param, parentType: t })), G = (a, t, r) => ({
  jsonPathJS: r(a),
  record: t
}), S = (a, t, r, e) => ({ pluginName: a, commandName: t.command, desc: t.desc ?? "", text: t.text ?? "", extractors: H(t, r, e) }), H = (a, t, r) => a.args.map((e) => {
  const s = N("args", a.command, e, t);
  return $(s, r);
}), I = (a, t) => ({ pluginName: t.pluginName, commandName: t.commandName, args: D(a, t.extractors) }), X = (a, t, r) => {
  const e = r.get(t);
  if (e) return I(a, e);
}, Y = (a, t) => new Map(a.flatMap((r) => L(r, t))), L = (a, t) => {
  const r = P(a.schema.structs);
  return a.schema.commands.map((e) => [`${a.pluginName}:${e.command}`, S(a.pluginName, e, r, t)]);
}, Z = (a, t, r) => {
  const e = P(t.structs);
  return { params: O(t, e, r), commands: Q(a, t.commands, e, r) };
}, O = (a, t, r) => a.params.map((e) => {
  const s = N("param", e.name, e, t);
  return $(s, r);
}), Q = (a, t, r, e) => t.map((s) => [`${a}:${s.command}`, S(a, s, r, e)]);
export {
  Y as compileCommandExtractorsFromPlugins,
  S as compilePluginCommandExtractor,
  L as compilePluginCommandPairs,
  Z as createPluginValueExtractor,
  N as createPluginValuesPath,
  _ as createPrimiteveParamPath,
  W as createStructParamPath,
  X as extractCommandArgsByKey,
  I as extractPluginCommandArgs,
  M as getPathFromStructArraySchema,
  E as getPathFromStructParam,
  U as getPathFromStructSchema,
  J as makeScalarArrayPath,
  F as makeScalarValuesPath
};
