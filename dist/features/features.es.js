import { d as b, p as C, s as v, k as j, C as E, A as M, h as $, G as T } from "../shared/parseDeepJSON.es.js";
const F = (a, r) => {
  if (a.length !== 0)
    return `${r}[${a.map((t) => `"${t.name}"`).join(",")}]`;
}, k = (a, r) => a.map((t) => ({ path: `${r}.${t.name}[*]`, param: t })), y = { undefinedStruct: "undefined_struct", cyclicStruct: "cyclic_struct" };
function J(a, r, t) {
  if (a.frames.length === 0) return a;
  const e = a.frames[a.frames.length - 1], s = a.frames.slice(0, -1);
  if (e.ancestry.includes(e.schemaName)) return {
    frames: s,
    items: a.items,
    errs: [...a.errs, { code: t.cyclicStruct, path: e.basePath }]
  };
  const m = r.get(e.schemaName);
  if (!m) return { frames: s, items: a.items, errs: [...a.errs, { code: t.undefinedStruct, path: e.basePath }] };
  const o = function(c, u) {
    const i = c.ancestry.concat(c.schemaName), l = c.basePath;
    return [...u.structs.map((n) => ({
      schemaName: n.attr.struct,
      basePath: `${l}.${n.name}`,
      ancestry: i
    })), ...u.structArrays.map((n) => ({ schemaName: n.attr.struct, basePath: `${l}.${n.name}[*]`, ancestry: i }))].reverse();
  }(e, m);
  if (m.scalars.length > 0 || m.scalarArrays.length > 0) {
    const c = function(u, { path: i, structName: l }) {
      return {
        category: "struct",
        objectSchema: b(u.scalars),
        name: l,
        scalarArrays: k(u.scalarArrays, i),
        scalarsPath: u.scalars.length > 0 ? F(u.scalars, i) : void 0
      };
    }(m, { path: e.basePath, structName: e.schemaName });
    return s.push(...o), { frames: s, items: [...a.items, c], errs: a.errs };
  }
  return s.push(...o), { frames: s, items: a.items, errs: a.errs };
}
function d(a, r, t, e) {
  const s = {
    items: [],
    errs: [],
    frames: [{ schemaName: a, basePath: r, ancestry: [] }]
  }, m = Math.max(1, 3 * t.size + 5), o = Array.from({ length: m }).reduce((c) => c.frames.length === 0 ? c : J(c, t, e), s);
  return { items: o.items, errors: o.errs };
}
const V = (a, r, t, e = y) => d(a.attr.struct, `${r}.${a.name}`, t, e), w = (a, r, t, e = y) => d(a.attr.struct, `${r}.${a.name}[*]`, t, e), Y = (a, r, t, e = y) => d(a, r, t, e), P = (a, r, t, e) => C(t) ? S(a, t, e) : v(t) ? B(a, t, e) : j(t) ? _(a, r, t) : z(a, r, t), _ = (a, r, t) => ({
  rootCategory: a,
  rootName: r,
  scalars: { name: "", objectSchema: {}, scalarsPath: void 0, scalarArrays: [{ path: `$.${t.name}[*]`, param: t }] },
  structs: { items: [], errors: [] },
  structArrays: {
    items: [],
    errors: []
  }
}), z = (a, r, t) => ({ rootCategory: a, rootName: r, scalars: { name: t.attr.kind, objectSchema: { [t.name]: t.attr }, scalarsPath: `$.${t.name}`, scalarArrays: [] }, structArrays: {
  items: [],
  errors: []
}, structs: { items: [], errors: [] } }), Z = (a, r, t) => S(a, r, t), S = (a, r, t) => ({
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structArrays: { items: [], errors: [] },
  structs: V(r, "$", t)
}), B = (a, r, t) => ({ structArrays: w(r, "$", t), rootName: r.name, rootCategory: a, scalars: void 0, structs: { items: [], errors: [] } }), G = (a, r, t, e) => r.filter((s) => typeof s == "number").map((s) => ({
  rootName: a.rootName,
  rootType: a.rootCategory,
  value: s,
  structName: t,
  param: e
})), K = (a, r, t, e) => r.filter((s) => typeof s == "string").map((s) => ({
  rootName: a.rootName,
  rootType: a.rootCategory,
  value: s,
  structName: t,
  param: e
})), R = (a, r, t, e, s) => {
  if (typeof t == "object" || t === null) return null;
  const m = e[e.length - 1];
  if (typeof m == "number") return null;
  const o = s[m];
  return o ? {
    rootName: a.rootName,
    rootType: a.rootCategory,
    structName: r,
    value: t,
    param: { name: m, attr: o }
  } : null;
}, N = (a, r) => r.map((t) => q(a, t)).flat(3), q = (a, r) => [r.top ? h(r, a, r.top, "") : [], r.structs.map((t) => h(r, a, t)), r.structArrays.map((t) => h(r, a, t))], h = (a, r, t, e = t.bundleName) => {
  const s = t.scalar ? ((o, c, u, i, l) => i.pathSegments(u).map(({ value: n, segments: p }) => R(o, c, n, p, l)).filter((n) => n !== null))(a, e, r, t.scalar.jsonPathJS, t.scalar.record) : [], m = t.arrays.map((o) => ((c, u, i, l) => {
    const n = l.jsonPathJS.find(i);
    if (!Array.isArray(n)) return [];
    const p = l.schema.attr;
    return E(p) ? K(c, n, u, l.schema) : M(p) ? G(c, n, u, l.schema) : [];
  })(a, e, r, o));
  return [s, m].flat(2);
}, f = (a, r) => {
  const t = a.scalars ? g(a.scalars, r) : void 0, e = a.structs.items.map((m) => g(m, r)), s = a.structArrays.items.map((m) => g(m, r));
  return {
    rootCategory: a.rootCategory,
    rootName: a.rootName,
    top: t,
    structs: e,
    structArrays: s
  };
}, g = (a, r) => a.scalarsPath ? { bundleName: a.name, arrays: A(a.scalarArrays, a.name, r), scalar: D(a.scalarsPath, a.objectSchema, r) } : {
  bundleName: a.name,
  arrays: A(a.scalarArrays, a.name, r)
}, A = (a, r, t) => a.map((e) => ({ jsonPathJS: t(e.path), schema: e.param, parentType: r })), D = (a, r, t) => ({
  jsonPathJS: t(a),
  record: r
}), x = (a, r, t, e) => ({ pluginName: a, commandName: r.command, desc: r.desc ?? "", text: r.text ?? "", extractors: H(r, t, e) }), H = (a, r, t) => a.args.map((e) => {
  const s = P("args", a.command, e, r);
  return f(s, t);
}), I = (a, r) => ({ pluginName: r.pluginName, commandName: r.commandName, args: N(a, r.extractors) }), aa = (a, r, t) => {
  const e = t.get(r);
  if (e) return I(a, e);
}, ra = (a, r) => new Map(a.flatMap((t) => L(t, r))), L = (a, r) => {
  const t = $(a.schema.structs);
  return a.schema.commands.map((e) => [`${a.pluginName}:${e.command}`, x(a.pluginName, e, t, r)]);
}, ta = (a) => a.rootType === "args", ea = (a) => a.rootType === "param", O = (a, r) => {
  const t = T(a.parameters);
  return { pluginName: a.name, params: N(t, r) };
}, sa = (a, r) => ({
  pluginName: r.pluginName,
  params: N(a, r.extractors)
}), ma = (a, r, t) => ({ pluginName: a.pluginName, extractors: a.schema.params.map((e) => {
  const s = P("param", "plugin", e, r);
  return f(s, t);
}) }), Q = (a, r, t) => {
  const e = $(r.structs);
  return { pluginName: a, params: U(r, e, t), commands: W(a, r.commands, e, t) };
}, U = (a, r, t) => a.params.map((e) => {
  const s = P("param", e.name, e, r);
  return f(s, t);
}), W = (a, r, t, e) => r.map((s) => [`${a}:${s.command}`, x(a, s, t, e)]), ca = (a) => {
  const r = a.flatMap((t) => t.extractorEntries);
  return new Map(r);
}, na = (a, r, t) => {
  const e = Q(a.pluginName, a.schema, t), { params: s } = O(r, e.params);
  return { record: r, schema: a, extractorEntries: e.commands, params: s };
};
export {
  ra as compileCommandExtractorsFromPlugins,
  x as compilePluginCommandExtractor,
  L as compilePluginCommandPairs,
  ma as compilePluginParamExtractor,
  na as convertPlugin,
  Q as createPluginValueExtractor,
  P as createPluginValuesPath,
  z as createPrimiteveParamPath,
  Z as createStructParamPath,
  aa as extractCommandArgsByKey,
  I as extractPluginCommandArgs,
  sa as extractPluginParam,
  O as extractPluginParamFromRecord,
  w as getPathFromStructArraySchema,
  V as getPathFromStructParam,
  Y as getPathFromStructSchema,
  ta as isCommandArgValue,
  ea as ispluginParamValue,
  k as makeScalarArrayPath,
  F as makeScalarValuesPath,
  ca as mergeCommandMap
};
