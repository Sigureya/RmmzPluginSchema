import { d, p as N, s as A, k as S, C as b, A as $, h as v } from "../shared/structMap.es.js";
const j = (a, t) => {
  if (a.length !== 0)
    return `${t}[${a.map((r) => `"${r.name}"`).join(",")}]`;
}, C = (a, t) => a.map((r) => ({ path: `${t}.${r.name}[*]`, param: r })), h = { undefinedStruct: "undefined_struct", cyclicStruct: "cyclic_struct" };
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
      return { category: "struct", objectSchema: d(n.scalars), name: l, scalarArrays: C(n.scalarArrays, u), scalarsPath: n.scalars.length > 0 ? j(n.scalars, u) : void 0 };
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
const J = (a, t, r, e = h) => {
  const m = a.map((s) => g(s.attr.struct, `${t}.${s.name}`, r, e));
  return { items: m.flatMap((s) => s.items), errors: m.flatMap((s) => s.errors) };
}, M = (a, t, r, e = h) => {
  const m = a.map((s) => g(s.attr.struct, `${t}.${s.name}[*]`, r, e));
  return { items: m.flatMap((s) => s.items), errors: m.flatMap((s) => s.errors) };
}, Z = (a, t, r, e = h) => g(a, t, r, e), w = (a, t, r, e) => N(r) ? P(a, r, e) : A(r) ? k(a, r, e) : S(r) ? O(a, t, r) : T(a, t, r), O = (a, t, r) => ({ rootCategory: a, rootName: t, scalars: {
  category: a,
  name: "array",
  objectSchema: {},
  scalarsPath: void 0,
  scalarArrays: [{ path: `$.${r.name}[*]`, param: r }]
}, structs: { items: [], errors: [] }, structArrays: { items: [], errors: [] } }), T = (a, t, r) => ({
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
}), aa = (a, t, r) => P(a, t, r), P = (a, t, r) => ({ rootName: t.name, rootCategory: a, scalars: void 0, structArrays: { items: [], errors: [] }, structs: J([t], "$", r) }), k = (a, t, r) => ({
  structArrays: M([t], "$", r),
  rootName: t.name,
  rootCategory: a,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), E = (a, t) => t.map((r) => F(a, r)).flat(3), F = (a, t) => [t.top ? p(t, a, t.top) : [], t.structs.map((r) => p(t, a, r)), t.structArrays.map((r) => p(t, a, r))], p = (a, t, r) => {
  const e = r.bundleName;
  return [r.scalar ? V(a, e, t, r.scalar.jsonPathJS, r.scalar.record) : [], r.arrays.map((m) => _(a, e, t, m))].flat(2);
}, V = (a, t, r, e, m) => e.pathSegments(r).reduce((s, { value: c, segments: o }) => {
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
}, []), _ = (a, t, r, e) => {
  const m = e.jsonPathJS.find(r);
  if (!Array.isArray(m)) return [];
  const s = e.schema.attr;
  return b(s) ? m.filter((c) => typeof c == "string").map((c) => ({ value: c, category: "struct", rootType: a.rootCategory, roootName: a.rootName, name: t, param: e.schema })) : $(s) ? m.filter((c) => typeof c == "number").map((c) => ({ roootName: a.rootName, rootType: a.rootCategory, value: c, category: "struct", name: t, param: e.schema })) : [];
}, y = (a, t) => a.scalarsPath ? { bundleName: a.name, arrays: f(a.scalarArrays, a.name, t), scalar: z(a.scalarsPath, a.objectSchema, t) } : {
  bundleName: a.name,
  arrays: f(a.scalarArrays, a.name, t)
}, f = (a, t, r) => a.map((e) => ({ jsonPathJS: r(e.path), schema: e.param, parentType: t })), z = (a, t, r) => ({ jsonPathJS: r(a), record: t }), B = (a, t, r, e) => ({
  pluginName: a,
  commandName: t.command,
  desc: t.desc ?? "",
  text: t.text ?? "",
  extractors: K(t, r, e)
}), K = (a, t, r) => a.args.map((e) => ((m, s) => {
  const c = m.scalars ? y(m.scalars, s) : void 0, o = m.structs.items.map((u) => y(u, s)), n = m.structArrays.items.map((u) => y(u, s));
  return {
    rootCategory: m.rootCategory,
    rootName: m.rootName,
    top: c,
    structs: o,
    structArrays: n
  };
})(w("args", a.command, e, t), r)), q = (a, t) => ({ pluginName: t.pluginName, commandName: t.commandName, values: E(a, t.extractors) }), ta = (a, t, r) => {
  const e = r.get(t);
  if (e) return q(a, e);
}, ra = (a, t) => new Map(a.flatMap((r) => D(r, t))), D = (a, t) => {
  const r = v(a.schema.structs);
  return a.schema.commands.map((e) => [`${a.pluginName}:${e.command}`, B(a.pluginName, e, r, t)]);
}, G = (a) => !Array.isArray(a) && typeof a == "object" && a !== null && !!(H(a) && I(a) && L(a) && "parameters" in a) && Q(a), H = (a) => "name" in a && typeof a.name == "string", I = (a) => "status" in a && typeof a.status == "boolean", L = (a) => "description" in a && typeof a.description == "string", Q = (a) => typeof a.parameters == "object" && a.parameters !== null && Object.values(a.parameters).every((t) => typeof t == "string"), R = /\s*\/\//, U = /\s*[var|let|const]\s+\$plugins\s*=\s*/, W = /^\s*[\[\]]/, X = (a) => a.split(`
`).filter((t) => !((r) => R.test(r) || U.test(r) || W.test(r))(t)), ea = (a) => {
  const t = `[${X(a).join("")}]`, r = JSON.parse(t);
  if (!Array.isArray(r)) throw new Error("Parsed value is not an array");
  if (r.every(G)) return r;
  throw new Error("Parsed value is not PluginParamsObject array");
};
export {
  ra as compileCommandExtractorsFromPlugins,
  B as compilePluginCommandExtractor,
  X as convertPluginsJSToJSON,
  aa as createPluginValuesPathPP,
  w as createPluginValuesPathPP2,
  T as createPrimiteveParamPath,
  ta as extractCommandArgsByKey,
  q as extractPluginCommandArgs,
  M as getPathFromStructArraySchema,
  J as getPathFromStructParam,
  Z as getPathFromStructSchema,
  C as makeScalarArrayPath,
  j as makeScalarValuesPath,
  ea as parsePluginParamObject,
  G as validatePluginJS
};
