import { d as x, p as C, s as v, k as j, C as F, A as k, h as $, G as E } from "../shared/parseDeepJSON.es.js";
const J = (a, r) => {
  if (a.length !== 0)
    return `${r}[${a.map((t) => `"${t.name}"`).join(",")}]`;
}, T = (a, r) => a.map((t) => ({ path: `${r}.${t.name}[*]`, param: t })), y = { undefinedStruct: "undefined_struct", cyclicStruct: "cyclic_struct" };
function M(a, r, t) {
  if (a.frames.length === 0) return a;
  const e = a.frames[a.frames.length - 1], s = a.frames.slice(0, -1);
  if (e.ancestry.includes(e.schemaName)) return {
    frames: s,
    items: a.items,
    errs: [...a.errs, { code: t.cyclicStruct, path: e.basePath }]
  };
  const m = r.get(e.schemaName);
  if (!m) return { frames: s, items: a.items, errs: [...a.errs, { code: t.undefinedStruct, path: e.basePath }] };
  const n = function(c, u) {
    const i = c.ancestry.concat(c.schemaName), l = c.basePath;
    return [...u.structs.map((o) => ({
      schemaName: o.attr.struct,
      basePath: `${l}.${o.name}`,
      ancestry: i
    })), ...u.structArrays.map((o) => ({ schemaName: o.attr.struct, basePath: `${l}.${o.name}[*]`, ancestry: i }))].reverse();
  }(e, m);
  if (m.scalars.length > 0 || m.scalarArrays.length > 0) {
    const c = function(u, { path: i, structName: l }) {
      return {
        category: "struct",
        objectSchema: x(u.scalars),
        name: l,
        scalarArrays: T(u.scalarArrays, i),
        scalarsPath: u.scalars.length > 0 ? J(u.scalars, i) : void 0
      };
    }(m, { path: e.basePath, structName: e.schemaName });
    return s.push(...n), { frames: s, items: [...a.items, c], errs: a.errs };
  }
  return s.push(...n), { frames: s, items: a.items, errs: a.errs };
}
function d(a, r, t, e) {
  const s = {
    items: [],
    errs: [],
    frames: [{ schemaName: a, basePath: r, ancestry: [] }]
  }, m = Math.max(1, 3 * t.size + 5), n = Array.from({ length: m }).reduce((c) => c.frames.length === 0 ? c : M(c, t, e), s);
  return { items: n.items, errors: n.errs };
}
const V = (a, r, t, e = y) => d(a.attr.struct, `${r}.${a.name}`, t, e), _ = (a, r, t, e = y) => d(a.attr.struct, `${r}.${a.name}[*]`, t, e), W = (a, r, t, e = y) => d(a, r, t, e), P = (a, r, t, e) => C(t) ? S(a, t, e) : v(t) ? B(a, t, e) : j(t) ? w(a, r, t) : z(a, r, t), w = (a, r, t) => ({
  rootCategory: a,
  rootName: r,
  scalars: { category: a, name: "array", objectSchema: {}, scalarsPath: void 0, scalarArrays: [{ path: `$.${t.name}[*]`, param: t }] },
  structs: { items: [], errors: [] },
  structArrays: { items: [], errors: [] }
}), z = (a, r, t) => ({ rootCategory: a, rootName: r, scalars: {
  category: "primitive",
  name: t.attr.kind,
  objectSchema: { [t.name]: t.attr },
  scalarsPath: `$.${t.name}`,
  scalarArrays: []
}, structArrays: { items: [], errors: [] }, structs: { items: [], errors: [] } }), X = (a, r, t) => S(a, r, t), S = (a, r, t) => ({ rootName: r.name, rootCategory: a, scalars: void 0, structArrays: {
  items: [],
  errors: []
}, structs: V(r, "$", t) }), B = (a, r, t) => ({
  structArrays: _(r, "$", t),
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), G = (a, r, t, e) => r.filter((s) => typeof s == "number").map((s) => ({
  roootName: a.rootName,
  rootType: a.rootCategory,
  value: s,
  category: "struct",
  name: t,
  param: e
})), q = (a, r, t, e) => r.filter((s) => typeof s == "string").map((s) => ({ roootName: a.rootName, rootType: a.rootCategory, value: s, category: "struct", name: t, param: e })), D = (a, r, t, e, s) => {
  if (typeof t == "object" || t === null) return null;
  const m = e[e.length - 1];
  if (typeof m == "number") return null;
  const n = s[m];
  return n ? {
    roootName: a.rootName,
    rootType: a.rootCategory,
    category: "struct",
    name: r,
    value: t,
    param: { name: m, attr: n }
  } : null;
}, f = (a, r) => r.map((t) => H(a, t)).flat(3), H = (a, r) => [r.top ? h(r, a, r.top) : [], r.structs.map((t) => h(r, a, t)), r.structArrays.map((t) => h(r, a, t))], h = (a, r, t) => {
  const e = t.bundleName, s = t.scalar ? ((n, c, u, i, l) => i.pathSegments(u).map(({ value: o, segments: p }) => D(n, c, o, p, l)).filter((o) => o !== null))(a, e, r, t.scalar.jsonPathJS, t.scalar.record) : [], m = t.arrays.map((n) => ((c, u, i, l) => {
    const o = l.jsonPathJS.find(i);
    if (!Array.isArray(o)) return [];
    const p = l.schema.attr;
    return F(p) ? q(c, o, u, l.schema) : k(p) ? G(c, o, u, l.schema) : [];
  })(a, e, r, n));
  return [s, m].flat(2);
}, N = (a, r) => {
  const t = a.scalars ? g(a.scalars, r) : void 0, e = a.structs.items.map((m) => g(m, r)), s = a.structArrays.items.map((m) => g(m, r));
  return {
    rootCategory: a.rootCategory,
    rootName: a.rootName,
    top: t,
    structs: e,
    structArrays: s
  };
}, g = (a, r) => a.scalarsPath ? { bundleName: a.name, arrays: A(a.scalarArrays, a.name, r), scalar: I(a.scalarsPath, a.objectSchema, r) } : {
  bundleName: a.name,
  arrays: A(a.scalarArrays, a.name, r)
}, A = (a, r, t) => a.map((e) => ({ jsonPathJS: t(e.path), schema: e.param, parentType: r })), I = (a, r, t) => ({
  jsonPathJS: t(a),
  record: r
}), b = (a, r, t, e) => ({ pluginName: a, commandName: r.command, desc: r.desc ?? "", text: r.text ?? "", extractors: K(r, t, e) }), K = (a, r, t) => a.args.map((e) => {
  const s = P("args", a.command, e, r);
  return N(s, t);
}), O = (a, r) => ({ pluginName: r.pluginName, commandName: r.commandName, args: f(a, r.extractors) }), Y = (a, r, t) => {
  const e = t.get(r);
  if (e) return O(a, e);
}, Z = (a, r) => new Map(a.flatMap((t) => R(t, r))), R = (a, r) => {
  const t = $(a.schema.structs);
  return a.schema.commands.map((e) => [`${a.pluginName}:${e.command}`, b(a.pluginName, e, t, r)]);
}, aa = (a, r) => {
  const t = E(a.parameters);
  return { pluginName: a.name, params: f(t, r) };
}, ra = (a, r) => ({ pluginName: r.pluginName, params: f(a, r.extractors) }), ta = (a, r, t) => ({
  pluginName: a.pluginName,
  extractors: a.schema.params.map((e) => {
    const s = P("param", "plugin", e, r);
    return N(s, t);
  })
}), ea = (a, r, t) => {
  const e = $(r.structs);
  return {
    pluginName: a,
    params: L(r, e, t),
    commands: Q(a, r.commands, e, t)
  };
}, L = (a, r, t) => a.params.map((e) => {
  const s = P("param", e.name, e, r);
  return N(s, t);
}), Q = (a, r, t, e) => r.map((s) => [`${a}:${s.command}`, b(a, s, t, e)]);
export {
  Z as compileCommandExtractorsFromPlugins,
  b as compilePluginCommandExtractor,
  R as compilePluginCommandPairs,
  ta as compilePluginParamExtractor,
  ea as createPluginValueExtractor,
  P as createPluginValuesPath,
  z as createPrimiteveParamPath,
  X as createStructParamPath,
  Y as extractCommandArgsByKey,
  O as extractPluginCommandArgs,
  ra as extractPluginParam,
  aa as extractPluginParamFromRecord,
  _ as getPathFromStructArraySchema,
  V as getPathFromStructParam,
  W as getPathFromStructSchema,
  T as makeScalarArrayPath,
  J as makeScalarValuesPath
};
