import { d as x, p as C, s as v, k as j, C as k, A as E, h as A } from "../shared/structMap.es.js";
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
      return { category: "struct", objectSchema: x(u.scalars), name: l, scalarArrays: J(u.scalarArrays, i), scalarsPath: u.scalars.length > 0 ? F(u.scalars, i) : void 0 };
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
const M = (a, t, r, e = g) => d(a.attr.struct, `${t}.${a.name}`, r, e), V = (a, t, r, e = g) => d(a.attr.struct, `${t}.${a.name}[*]`, r, e), U = (a, t, r, e = g) => d(a, t, r, e), f = (a, t, r, e) => C(r) ? $(a, r, e) : v(r) ? z(a, r, e) : j(r) ? _(a, t, r) : w(a, t, r), _ = (a, t, r) => ({
  rootCategory: a,
  rootName: t,
  scalars: { category: a, name: "array", objectSchema: {}, scalarsPath: void 0, scalarArrays: [{ path: `$.${r.name}[*]`, param: r }] },
  structs: { items: [], errors: [] },
  structArrays: { items: [], errors: [] }
}), w = (a, t, r) => ({ rootCategory: a, rootName: t, scalars: {
  category: "primitive",
  name: r.attr.kind,
  objectSchema: { [r.name]: r.attr },
  scalarsPath: `$.${r.name}`,
  scalarArrays: []
}, structArrays: { items: [], errors: [] }, structs: { items: [], errors: [] } }), W = (a, t, r) => $(a, t, r), $ = (a, t, r) => ({ rootName: t.name, rootCategory: a, scalars: void 0, structArrays: {
  items: [],
  errors: []
}, structs: M(t, "$", r) }), z = (a, t, r) => ({
  structArrays: V(t, "$", r),
  rootName: t.name,
  rootCategory: a,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), B = (a, t, r, e) => t.filter((s) => typeof s == "number").map((s) => ({
  roootName: a.rootName,
  rootType: a.rootCategory,
  value: s,
  category: "struct",
  name: r,
  param: e
})), q = (a, t, r, e) => t.filter((s) => typeof s == "string").map((s) => ({ roootName: a.rootName, rootType: a.rootCategory, value: s, category: "struct", name: r, param: e })), D = (a, t, r, e, s) => {
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
}, S = (a, t) => t.map((r) => G(a, r)).flat(3), G = (a, t) => [t.top ? h(t, a, t.top) : [], t.structs.map((r) => h(t, a, r)), t.structArrays.map((r) => h(t, a, r))], h = (a, t, r) => {
  const e = r.bundleName, s = r.scalar ? ((n, c, u, i, l) => i.pathSegments(u).map(({ value: o, segments: p }) => D(n, c, o, p, l)).filter((o) => o !== null))(a, e, t, r.scalar.jsonPathJS, r.scalar.record) : [], m = r.arrays.map((n) => ((c, u, i, l) => {
    const o = l.jsonPathJS.find(i);
    if (!Array.isArray(o)) return [];
    const p = l.schema.attr;
    return k(p) ? q(c, o, u, l.schema) : E(p) ? B(c, o, u, l.schema) : [];
  })(a, e, t, n));
  return [s, m].flat(2);
}, P = (a, t) => {
  const r = a.scalars ? y(a.scalars, t) : void 0, e = a.structs.items.map((m) => y(m, t)), s = a.structArrays.items.map((m) => y(m, t));
  return {
    rootCategory: a.rootCategory,
    rootName: a.rootName,
    top: r,
    structs: e,
    structArrays: s
  };
}, y = (a, t) => a.scalarsPath ? { bundleName: a.name, arrays: N(a.scalarArrays, a.name, t), scalar: H(a.scalarsPath, a.objectSchema, t) } : {
  bundleName: a.name,
  arrays: N(a.scalarArrays, a.name, t)
}, N = (a, t, r) => a.map((e) => ({ jsonPathJS: r(e.path), schema: e.param, parentType: t })), H = (a, t, r) => ({
  jsonPathJS: r(a),
  record: t
}), b = (a, t, r, e) => ({ pluginName: a, commandName: t.command, desc: t.desc ?? "", text: t.text ?? "", extractors: K(t, r, e) }), K = (a, t, r) => a.args.map((e) => {
  const s = f("args", a.command, e, t);
  return P(s, r);
}), I = (a, t) => ({ pluginName: t.pluginName, commandName: t.commandName, args: S(a, t.extractors) }), X = (a, t, r) => {
  const e = r.get(t);
  if (e) return I(a, e);
}, Y = (a, t) => new Map(a.flatMap((r) => L(r, t))), L = (a, t) => {
  const r = A(a.schema.structs);
  return a.schema.commands.map((e) => [`${a.pluginName}:${e.command}`, b(a.pluginName, e, r, t)]);
}, Z = (a, t) => ({ pluginName: t.pluginName, params: S(a, t.extractors) }), aa = (a, t, r) => ({ pluginName: a.pluginName, extractors: a.schema.params.map((e) => {
  const s = f("param", "plugin", e, t);
  return P(s, r);
}) }), ta = (a, t, r) => {
  const e = A(t.structs);
  return { params: O(t, e, r), commands: Q(a, t.commands, e, r) };
}, O = (a, t, r) => a.params.map((e) => {
  const s = f("param", e.name, e, t);
  return P(s, r);
}), Q = (a, t, r, e) => t.map((s) => [`${a}:${s.command}`, b(a, s, r, e)]);
export {
  Y as compileCommandExtractorsFromPlugins,
  b as compilePluginCommandExtractor,
  L as compilePluginCommandPairs,
  aa as compilePluginParamExtractor,
  ta as createPluginValueExtractor,
  f as createPluginValuesPath,
  w as createPrimiteveParamPath,
  W as createStructParamPath,
  X as extractCommandArgsByKey,
  I as extractPluginCommandArgs,
  Z as extractPluginParam,
  V as getPathFromStructArraySchema,
  M as getPathFromStructParam,
  U as getPathFromStructSchema,
  J as makeScalarArrayPath,
  F as makeScalarValuesPath
};
