import { d as b, p as v, s as j, k as E, C as M, A as T, h as y, G as F } from "../shared/parseDeepJSON.es.js";
const k = (a, r) => {
  if (a.length !== 0)
    return `${r}[${a.map((t) => `"${t.name}"`).join(",")}]`;
}, J = (a, r) => a.map((t) => ({ path: `${r}.${t.name}[*]`, param: t })), d = { undefinedStruct: "undefined_struct", cyclicStruct: "cyclic_struct" };
function V(a, r, t) {
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
        scalarArrays: J(u.scalarArrays, i),
        scalarsPath: u.scalars.length > 0 ? k(u.scalars, i) : void 0
      };
    }(m, { path: e.basePath, structName: e.schemaName });
    return s.push(...o), { frames: s, items: [...a.items, c], errs: a.errs };
  }
  return s.push(...o), { frames: s, items: a.items, errs: a.errs };
}
function P(a, r, t, e) {
  const s = {
    items: [],
    errs: [],
    frames: [{ schemaName: a, basePath: r, ancestry: [] }]
  }, m = Math.max(1, 3 * t.size + 5), o = Array.from({ length: m }).reduce((c) => c.frames.length === 0 ? c : V(c, t, e), s);
  return { items: o.items, errors: o.errs };
}
const w = (a, r, t, e = d) => P(a.attr.struct, `${r}.${a.name}`, t, e), _ = (a, r, t, e = d) => P(a.attr.struct, `${r}.${a.name}[*]`, t, e), Y = (a, r, t, e = d) => P(a, r, t, e), N = (a, r, t, e) => v(t) ? S(a, t, e) : j(t) ? G(a, t, e) : E(t) ? z(a, r, t) : B(a, r, t), z = (a, r, t) => ({
  rootCategory: a,
  rootName: r,
  scalars: { name: "", objectSchema: {}, scalarsPath: void 0, scalarArrays: [{ path: `$.${t.name}[*]`, param: t }] },
  structs: { items: [], errors: [] },
  structArrays: {
    items: [],
    errors: []
  }
}), B = (a, r, t) => ({ rootCategory: a, rootName: r, scalars: { name: t.attr.kind, objectSchema: { [t.name]: t.attr }, scalarsPath: `$.${t.name}`, scalarArrays: [] }, structArrays: {
  items: [],
  errors: []
}, structs: { items: [], errors: [] } }), Z = (a, r, t) => S(a, r, t), S = (a, r, t) => ({
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structArrays: { items: [], errors: [] },
  structs: w(r, "$", t)
}), G = (a, r, t) => ({ structArrays: _(r, "$", t), rootName: r.name, rootCategory: a, scalars: void 0, structs: { items: [], errors: [] } }), K = (a, r, t, e) => r.filter((s) => typeof s == "number").map((s) => ({
  rootName: a.rootName,
  rootType: a.rootCategory,
  value: s,
  structName: t,
  param: e
})), R = (a, r, t, e) => r.filter((s) => typeof s == "string").map((s) => ({
  rootName: a.rootName,
  rootType: a.rootCategory,
  value: s,
  structName: t,
  param: e
})), q = (a, r, t, e, s) => {
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
}, f = (a, r) => r.map((t) => D(a, t)).flat(3), D = (a, r) => [r.top ? h(r, a, r.top, "") : [], r.structs.map((t) => h(r, a, t)), r.structArrays.map((t) => h(r, a, t))], h = (a, r, t, e = t.bundleName) => {
  const s = t.scalar ? ((o, c, u, i, l) => i.pathSegments(u).map(({ value: n, segments: p }) => q(o, c, n, p, l)).filter((n) => n !== null))(a, e, r, t.scalar.jsonPathJS, t.scalar.record) : [], m = t.arrays.map((o) => ((c, u, i, l) => {
    const n = l.jsonPathJS.find(i);
    if (!Array.isArray(n)) return [];
    const p = l.schema.attr;
    return M(p) ? R(c, n, u, l.schema) : T(p) ? K(c, n, u, l.schema) : [];
  })(a, e, r, o));
  return [s, m].flat(2);
}, A = (a, r) => {
  const t = a.scalars ? g(a.scalars, r) : void 0, e = a.structs.items.map((m) => g(m, r)), s = a.structArrays.items.map((m) => g(m, r));
  return {
    rootCategory: a.rootCategory,
    rootName: a.rootName,
    top: t,
    structs: e,
    structArrays: s
  };
}, g = (a, r) => a.scalarsPath ? { bundleName: a.name, arrays: $(a.scalarArrays, a.name, r), scalar: H(a.scalarsPath, a.objectSchema, r) } : {
  bundleName: a.name,
  arrays: $(a.scalarArrays, a.name, r)
}, $ = (a, r, t) => a.map((e) => ({ jsonPathJS: t(e.path), schema: e.param, parentType: r })), H = (a, r, t) => ({
  jsonPathJS: t(a),
  record: r
}), x = (a, r, t, e) => ({ pluginName: a, commandName: r.command, desc: r.desc ?? "", text: r.text ?? "", extractors: I(r, t, e) }), I = (a, r, t) => a.args.map((e) => {
  const s = N("args", a.command, e, r);
  return A(s, t);
}), L = (a, r) => ({ pluginName: r.pluginName, commandName: r.commandName, args: f(a, r.extractors) }), aa = (a, r, t) => {
  const e = t.get(r);
  if (e) return L(a, e);
}, ra = (a, r) => new Map(a.flatMap((t) => O(t, r))), O = (a, r) => {
  const t = y(a.schema.structs);
  return a.schema.commands.map((e) => [`${a.pluginName}:${e.command}`, x(a.pluginName, e, t, r)]);
}, ta = (a) => a.rootType === "args", ea = (a) => a.rootType === "param", Q = (a, r) => {
  const t = F(a.parameters);
  return { pluginName: a.name, params: f(t, r) };
}, sa = (a, r) => ({
  pluginName: r.pluginName,
  params: f(a, r.extractors)
}), ma = (a, r, t) => ({ pluginName: a.pluginName, extractors: a.schema.params.map((e) => {
  const s = N("param", "plugin", e, r);
  return A(s, t);
}) }), ca = (a, r) => {
  const t = y(a.schema.structs);
  return C(a.pluginName, a.schema.commands, t, r);
}, U = (a, r, t) => {
  const e = y(r.structs);
  return { pluginName: a, params: W(r, e, t), commands: C(a, r.commands, e, t) };
}, W = (a, r, t) => a.params.map((e) => {
  const s = N("param", e.name, e, r);
  return A(s, t);
}), C = (a, r, t, e) => r.map((s) => [`${a}:${s.command}`, x(a, s, t, e)]), na = (a) => {
  const r = a.flatMap((t) => t.extractorEntries);
  return new Map(r);
}, oa = (a, r, t) => {
  const e = U(a.pluginName, a.schema, t), { params: s } = Q(r, e.params);
  return {
    record: r,
    schema: a,
    extractorEntries: e.commands,
    params: s
  };
};
export {
  ra as compileCommandExtractorsFromPlugins,
  x as compilePluginCommandExtractor,
  O as compilePluginCommandPairs,
  ma as compilePluginParamExtractor,
  oa as convertPlugin,
  ca as createPluginCommandExtractor,
  U as createPluginValueExtractor,
  N as createPluginValuesPath,
  B as createPrimiteveParamPath,
  Z as createStructParamPath,
  aa as extractCommandArgsByKey,
  L as extractPluginCommandArgs,
  sa as extractPluginParam,
  Q as extractPluginParamFromRecord,
  _ as getPathFromStructArraySchema,
  w as getPathFromStructParam,
  Y as getPathFromStructSchema,
  ta as isCommandArgValue,
  ea as ispluginParamValue,
  J as makeScalarArrayPath,
  k as makeScalarValuesPath,
  na as mergeCommandMap
};
