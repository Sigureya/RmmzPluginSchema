import { d as F, p as V, s as _, k as w, C as D, A as K, h as N, G as L, K as h, H as C, I as z, J as G, L as H, M as I, N as O, O as Q, P as R, Q as q } from "../shared/constants.es.js";
const U = (r, t) => {
  if (r.length !== 0)
    return `${t}[${r.map((a) => `"${a.name}"`).join(",")}]`;
}, W = (r, t) => r.map((a) => ({ path: `${t}["${a.name}"][*]`, param: a })), b = {
  undefinedStruct: "undefined_struct",
  cyclicStruct: "cyclic_struct"
};
function X(r, t, a) {
  if (r.frames.length === 0) return r;
  const e = r.frames[r.frames.length - 1], s = r.frames.slice(0, -1);
  if (e.ancestry.includes(e.schemaName)) return { frames: s, items: r.items, errs: [...r.errs, { code: a.cyclicStruct, path: e.basePath }] };
  const m = t.get(e.schemaName);
  if (!m) return {
    frames: s,
    items: r.items,
    errs: [...r.errs, { code: a.undefinedStruct, path: e.basePath }]
  };
  const c = function(o, l) {
    const i = o.ancestry.concat(o.schemaName), d = o.basePath;
    return [...l.structs.map((u) => ({
      schemaName: u.attr.struct,
      basePath: `${d}["${u.name}"]`,
      ancestry: i
    })), ...l.structArrays.map((u) => ({ schemaName: u.attr.struct, basePath: `${d}["${u.name}"][*]`, ancestry: i }))].reverse();
  }(e, m);
  if (m.scalars.length > 0 || m.scalarArrays.length > 0) {
    const o = function(l, { path: i, structName: d }) {
      return {
        category: "struct",
        objectSchema: F(l.scalars),
        name: d,
        scalarArrays: W(l.scalarArrays, i),
        scalarsPath: l.scalars.length > 0 ? U(l.scalars, i) : void 0
      };
    }(m, { path: e.basePath, structName: e.schemaName });
    return s.push(...c), {
      frames: s,
      items: [...r.items, o],
      errs: r.errs
    };
  }
  return s.push(...c), { frames: s, items: r.items, errs: r.errs };
}
function v(r, t, a, e) {
  const s = { items: [], errs: [], frames: [{
    schemaName: r,
    basePath: t,
    ancestry: []
  }] }, m = Math.max(1, 3 * a.size + 5), c = Array.from({ length: m }).reduce((o) => o.frames.length === 0 ? o : X(o, a, e), s);
  return { items: c.items, errors: c.errs };
}
const Y = (r, t, a, e = b) => v(r.attr.struct, `${t}["${r.name}"]`, a, e), Z = (r, t, a, e = b) => v(r.attr.struct, `${t}["${r.name}"][*]`, a, e), Kr = (r, t, a, e = b) => v(r, t, a, e), A = (r, t, a, e) => V(a) ? M(r, a, e) : _(a) ? ar(r, a, e) : w(a) ? rr(r, t, a) : tr(r, t, a), rr = (r, t, a) => ({
  rootCategory: r,
  rootName: t,
  scalars: { name: "", objectSchema: {}, scalarsPath: void 0, scalarArrays: [{ path: `$["${a.name}"][*]`, param: a }] },
  structs: { items: [], errors: [] },
  structArrays: {
    items: [],
    errors: []
  }
}), tr = (r, t, a) => ({ rootCategory: r, rootName: t, scalars: { name: a.attr.kind, objectSchema: { [a.name]: a.attr }, scalarsPath: `$["${a.name}"]`, scalarArrays: [] }, structArrays: {
  items: [],
  errors: []
}, structs: { items: [], errors: [] } }), Lr = (r, t, a) => M(r, t, a), M = (r, t, a) => ({
  rootName: t.name,
  rootCategory: r,
  scalars: void 0,
  structArrays: { items: [], errors: [] },
  structs: Y(t, "$", a)
}), ar = (r, t, a) => ({
  structArrays: Z(t, "$", a),
  rootName: t.name,
  rootCategory: r,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), er = (r, t, a, e) => t.filter((s) => typeof s == "number").map((s) => ({
  rootName: r.rootName,
  rootType: r.rootCategory,
  value: s,
  structName: a,
  param: e
})), sr = (r, t, a, e) => t.filter((s) => typeof s == "string").map((s) => ({ rootName: r.rootName, rootType: r.rootCategory, value: s, structName: a, param: e })), nr = (r, t, a, e, s) => {
  if (typeof a == "object" || a === null) return null;
  const m = e[e.length - 1];
  if (typeof m == "number") return null;
  const c = s[m];
  return c ? {
    rootName: r.rootName,
    rootType: r.rootCategory,
    structName: t,
    value: a,
    param: { name: m, attr: c }
  } : null;
}, x = (r, t) => t.map((a) => mr(r, a)).flat(3), mr = (r, t) => [t.top ? y(t, r, t.top, "") : [], t.structs.map((a) => y(t, r, a)), t.structArrays.map((a) => y(t, r, a))], y = (r, t, a, e = a.bundleName) => {
  const s = a.scalar ? ((c, o, l, i, d) => i.pathSegments(l).map(({ value: u, segments: g }) => nr(c, o, u, g, d)).filter((u) => u !== null))(r, e, t, a.scalar.jsonPathJS, a.scalar.record) : [], m = a.arrays.map((c) => ((o, l, i, d) => {
    const u = d.jsonPathJS.find(i);
    if (!Array.isArray(u)) return [];
    const g = d.schema.attr;
    return D(g) ? sr(o, u, l, d.schema) : K(g) ? er(o, u, l, d.schema) : [];
  })(r, e, t, c));
  return [s, m].flat(2);
}, $ = (r, t) => {
  const a = r.scalars ? P(r.scalars, t) : void 0, e = r.structs.items.map((m) => P(m, t)), s = r.structArrays.items.map((m) => P(m, t));
  return {
    rootCategory: r.rootCategory,
    rootName: r.rootName,
    top: a,
    structs: e,
    structArrays: s
  };
}, P = (r, t) => r.scalarsPath ? { bundleName: r.name, arrays: S(r.scalarArrays, r.name, t), scalar: cr(r.scalarsPath, r.objectSchema, t) } : {
  bundleName: r.name,
  arrays: S(r.scalarArrays, r.name, t)
}, S = (r, t, a) => r.map((e) => ({ jsonPathJS: a(e.path), schema: e.param, parentType: t })), cr = (r, t, a) => ({
  jsonPathJS: a(r),
  record: t
}), j = (r, t, a, e) => ({ pluginName: r, commandName: t.command, desc: t.desc ?? "", text: t.text ?? "", extractors: or(t, a, e) }), or = (r, t, a) => r.args.map((e) => {
  const s = A("args", r.command, e, t);
  return $(s, a);
}), ur = (r, t) => ({ pluginName: t.pluginName, commandName: t.commandName, args: x(r, t.extractors) }), zr = (r, t, a) => {
  const e = a.get(t);
  if (e) return ur(r, e);
}, Gr = (r, t) => new Map(r.flatMap((a) => lr(a, t))), lr = (r, t) => {
  const a = N(r.schema.structs);
  return r.schema.commands.map((e) => [`${r.pluginName}:${e.command}`, j(r.pluginName, e, a, t)]);
}, Hr = (r) => r.rootType === "args", Ir = (r) => r.rootType === "param", dr = (r, t) => {
  const a = L(r.parameters);
  return { pluginName: r.name, params: x(a, t) };
}, Or = (r, t) => ({
  pluginName: t.pluginName,
  params: x(r, t.extractors)
}), Qr = (r, t, a) => ({ pluginName: r.pluginName, extractors: r.schema.params.map((e) => {
  const s = A("param", "plugin", e, t);
  return $(s, a);
}) }), Rr = (r, t) => {
  const a = N(r.schema.structs);
  return E(r.pluginName, r.schema.commands, a, t);
}, ir = (r, t, a) => {
  const e = N(t.structs);
  return { pluginName: r, params: pr(t, e, a), commands: E(r, t.commands, e, a) };
}, pr = (r, t, a) => r.params.map((e) => {
  const s = A("param", e.name, e, t);
  return $(s, a);
}), E = (r, t, a, e) => t.map((s) => [`${r}:${s.command}`, j(r, s, a, e)]), qr = (r) => {
  const t = r.flatMap((a) => a.extractorEntries);
  return new Map(t);
}, Ur = (r, t, a) => {
  const e = ir(r.pluginName, r.schema, a), { params: s } = dr(t, e.params);
  return {
    record: t,
    schema: r,
    extractorEntries: e.commands,
    params: s
  };
}, n = (r, t) => `@${r} ${t}`, p = (r, t) => {
  const a = r[t];
  return a === void 0 ? void 0 : n(t, String(a));
}, T = (r, t, a) => {
  const e = n(t, r.name), s = fr(r.attr), m = gr(r.attr, a);
  return m ? { name: e, base: s, default: m.default, attr: m.attr.filter((c) => c !== void 0) } : { name: e, base: s, default: void 0, attr: [] };
}, fr = (r) => {
  return {
    kind: (t = r, t.kind === "struct" ? n(h, `struct<${t.struct}>`) : t.kind === "struct[]" ? n(h, `struct<${t.struct}>[]`) : n(h, t.kind)),
    desc: r.desc ? n("desc", r.desc) : void 0,
    text: r.text ? n("text", r.text) : void 0,
    parent: r.parent ? n("parent", r.parent) : void 0
  };
  var t;
}, gr = (r, t) => r.kind === "number" ? Nr(r) : r.kind === "number[]" ? br(r, t) : r.kind === "file[]" ? $r(r, t) : r.kind === "struct[]" ? Mr(r, t) : r.kind === "string[]" || r.kind === "multiline_string[]" ? vr(r, t) : r.kind === "select" ? kr(r) : r.kind === "combo" ? Sr(r) : r.kind === "file" ? xr(r) : r.kind === "struct" ? Cr(r, t) : r.kind === "boolean" ? hr(r) : r.kind === "string" || r.kind === "any" || r.kind === "multiline_string" ? Ar(r) : typeof r.default == "number" ? yr(r) : Pr(r, t), B = (r) => r === void 0 ? void 0 : n("default", r.toString()), hr = (r) => ({
  attr: f.boolean.map((t) => p(r, t)),
  default: n("default", r.default ? "true" : "false")
}), yr = (r) => ({ attr: [], default: B(r.default) }), Pr = (r, t) => {
  const a = t.numberArray(r.default);
  return {
    attr: [],
    default: n("default", a)
  };
}, Nr = (r) => ({ attr: f.number.map((t) => p(r, t)), default: B(r.default) }), br = (r, t) => {
  const a = t.numberArray(r.default);
  return {
    attr: f.number.map((e) => p(r, e)),
    default: n("default", a)
  };
}, vr = (r, t) => {
  const a = t.stringArray(r.default);
  return { attr: [], default: n("default", a) };
}, Ar = (r) => ({
  attr: [],
  default: n("default", r.default)
}), xr = (r) => ({ attr: f.file.map((t) => p(r, t)), default: n("default", r.default) }), $r = (r, t) => {
  const a = t.stringArray(r.default);
  return {
    attr: f.file.map((e) => p(r, e)),
    default: n("default", a)
  };
}, kr = (r) => {
  return { attr: (t = r, t.options.flatMap((a) => [n(C, a.option), n(z, a.value)])), default: n("default", r.default) };
  var t;
}, Sr = (r) => {
  return { attr: (t = r, t.options.map((a) => n(C, a))), default: n("default", r.default) };
  var t;
}, Cr = (r, t) => {
  if (!r.default) return { attr: [], default: void 0 };
  const a = t.struct(r.default);
  return { attr: [], default: n("default", a) };
}, Mr = (r, t) => {
  if (!r.default) return { attr: [], default: n("default", "[]") };
  const a = t.structArray(r.default);
  return {
    attr: [],
    default: n("default", a)
  };
}, f = { number: ["min", "max", "decimals"], file: ["dir"], boolean: ["on", "off"] }, jr = (r, t) => ({
  params: J(r.params, t),
  structs: r.structs.map((a) => Er(a, t)),
  commands: r.commands.map((a) => Tr(a, t))
}), J = (r, t) => r.map((a) => T(a, "param", t)), Er = (r, t) => ({ struct: r.struct, params: J(r.params, t) }), Tr = (r, t) => ({
  desc: r.desc ? n("desc", r.desc) : void 0,
  text: r.text ? n("text", r.text) : void 0,
  command: n("command", r.command),
  args: r.args.map((a) => T(a, "arg", t))
}), Br = (r) => {
  const t = r.params.flatMap(k).filter((a) => a !== void 0);
  return [`/*~struct~${r.struct}:${r.locale ?? ""}`, ...t, "*/"];
}, Jr = (r) => {
  const t = [r.target, r.meta.author, r.meta.pluginDesc, r.meta.url, "", ...r.dependencies.base, ...r.dependencies.orderBefore, ...r.dependencies.orderAfter, (a = r.dependencies, a.base.length > 0 || a.orderBefore.length > 0 || a.orderAfter.length > 0 ? "" : void 0), ...r.schema.commands.flatMap(Fr), ...r.schema.params.flatMap(k)].filter((e) => e !== void 0);
  var a;
  return [`/*:${r.locale ?? ""}`, ...t, "*/"];
}, Fr = (r) => [r.command, r.text, r.desc, ...r.args.flatMap(k)], k = (r) => [r.name, r.base.kind, r.base.desc, r.base.text, r.base.parent, ...r.attr, r.default, ""], Wr = (r, t) => {
  const a = Vr(r, t);
  return {
    body: Jr(a),
    structs: a.schema.structs.map(Br)
  };
}, Vr = (r, t) => ({ locale: r.locale, schema: jr(r.schema, t), target: n(G, r.target), meta: wr(r.meta), dependencies: _r(r.dependencies) }), _r = (r) => ({
  base: r.base.map((t) => n(O, t)),
  orderBefore: r.orderBefore.map((t) => n(I, t)),
  orderAfter: r.orderAfter.map((t) => n(H, t))
}), wr = (r) => {
  const t = r.author, a = r.plugindesc, e = r.url;
  return {
    author: t ? n(q, t) : void 0,
    pluginDesc: a ? n(R, a) : void 0,
    url: e ? n(Q, e) : void 0
  };
};
export {
  Gr as compileCommandExtractorsFromPlugins,
  j as compilePluginCommandExtractor,
  lr as compilePluginCommandPairs,
  Qr as compilePluginParamExtractor,
  Ur as convertPlugin,
  Rr as createPluginCommandExtractor,
  ir as createPluginValueExtractor,
  A as createPluginValuesPath,
  tr as createPrimiteveParamPath,
  Lr as createStructParamPath,
  zr as extractCommandArgsByKey,
  ur as extractPluginCommandArgs,
  Or as extractPluginParam,
  dr as extractPluginParamFromRecord,
  Vr as generatePluginAnnotation,
  Wr as generatePluginAnnotationLines,
  Z as getPathFromStructArraySchema,
  Y as getPathFromStructParam,
  Kr as getPathFromStructSchema,
  Hr as isCommandArgValue,
  Ir as ispluginParamValue,
  W as makeScalarArrayPath,
  U as makeScalarValuesPath,
  qr as mergeCommandMap
};
