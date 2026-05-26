import { F as _, y as D, w as K, l as z, u as H, p as I, f as N, D as C, K as h, H as M, I as L, J as O, L as Q, M as R, N as q, O as G, P as U, Q as W } from "../shared/structMap.es.js";
const X = (a, r) => {
  if (a.length !== 0)
    return `${r}[${a.map((e) => `"${e.name}"`).join(",")}]`;
}, Y = (a, r) => a.map((e) => ({ path: `${r}["${e.name}"][*]`, param: e })), b = {
  undefinedStruct: "undefined_struct",
  cyclicStruct: "cyclic_struct"
};
function Z(a, r, e) {
  if (a.frames.length === 0) return a;
  const t = a.frames[a.frames.length - 1], s = a.frames.slice(0, -1);
  if (t.ancestry.includes(t.schemaName)) return { frames: s, items: a.items, errs: [...a.errs, { code: e.cyclicStruct, path: t.basePath }] };
  const m = r.get(t.schemaName);
  if (!m) return {
    frames: s,
    items: a.items,
    errs: [...a.errs, { code: e.undefinedStruct, path: t.basePath }]
  };
  const c = function(o, l) {
    const d = o.ancestry.concat(o.schemaName), i = o.basePath;
    return [...l.structs.map((u) => ({
      schemaName: u.attr.struct,
      basePath: `${i}["${u.name}"]`,
      ancestry: d
    })), ...l.structArrays.map((u) => ({ schemaName: u.attr.struct, basePath: `${i}["${u.name}"][*]`, ancestry: d }))].reverse();
  }(t, m);
  if (m.scalars.length > 0 || m.scalarArrays.length > 0) {
    const o = function(l, { path: d, structName: i }) {
      return {
        category: "struct",
        objectSchema: _(l.scalars),
        name: i,
        scalarArrays: Y(l.scalarArrays, d),
        scalarsPath: l.scalars.length > 0 ? X(l.scalars, d) : void 0
      };
    }(m, { path: t.basePath, structName: t.schemaName });
    return s.push(...c), {
      frames: s,
      items: [...a.items, o],
      errs: a.errs
    };
  }
  return s.push(...c), { frames: s, items: a.items, errs: a.errs };
}
function A(a, r, e, t) {
  const s = { items: [], errs: [], frames: [{
    schemaName: a,
    basePath: r,
    ancestry: []
  }] }, m = Math.max(1, 3 * e.size + 5), c = Array.from({ length: m }).reduce((o) => o.frames.length === 0 ? o : Z(o, e, t), s);
  return { items: c.items, errors: c.errs };
}
const aa = (a, r, e, t = b) => A(a.attr.struct, `${r}["${a.name}"]`, e, t), ra = (a, r, e, t = b) => A(a.attr.struct, `${r}["${a.name}"][*]`, e, t), Ia = (a, r, e, t = b) => A(a, r, e, t), v = (a, r, e, t) => D(e) ? j(a, e, t) : K(e) ? sa(a, e, t) : z(e) ? ea(a, r, e) : ta(a, r, e), ea = (a, r, e) => ({
  rootCategory: a,
  rootName: r,
  scalars: { name: "", objectSchema: {}, scalarsPath: void 0, scalarArrays: [{ path: `$["${e.name}"][*]`, param: e }] },
  structs: { items: [], errors: [] },
  structArrays: {
    items: [],
    errors: []
  }
}), ta = (a, r, e) => ({ rootCategory: a, rootName: r, scalars: { name: e.attr.kind, objectSchema: { [e.name]: e.attr }, scalarsPath: `$["${e.name}"]`, scalarArrays: [] }, structArrays: {
  items: [],
  errors: []
}, structs: { items: [], errors: [] } }), La = (a, r, e) => j(a, r, e), j = (a, r, e) => ({
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structArrays: { items: [], errors: [] },
  structs: aa(r, "$", e)
}), sa = (a, r, e) => ({
  structArrays: ra(r, "$", e),
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), na = (a, r, e, t) => r.filter((s) => typeof s == "number").map((s) => ({
  rootName: a.rootName,
  rootType: a.rootCategory,
  value: s,
  structName: e,
  param: t
})), ma = (a, r, e, t) => r.filter((s) => typeof s == "string").map((s) => ({ rootName: a.rootName, rootType: a.rootCategory, value: s, structName: e, param: t })), ca = (a, r, e, t, s) => {
  if (typeof e == "object" || e === null) return null;
  const m = t[t.length - 1];
  if (typeof m == "number") return null;
  const c = s[m];
  return c ? {
    rootName: a.rootName,
    rootType: a.rootCategory,
    structName: r,
    value: e,
    param: { name: m, attr: c }
  } : null;
}, x = (a, r) => r.map((e) => oa(a, e)).flat(3), oa = (a, r) => [r.top ? y(r, a, r.top, "") : [], r.structs.map((e) => y(r, a, e)), r.structArrays.map((e) => y(r, a, e))], y = (a, r, e, t = e.bundleName) => {
  const s = e.scalar ? ((c, o, l, d, i) => d.pathSegments(l).map(({ value: u, segments: g }) => ca(c, o, u, g, i)).filter((u) => u !== null))(a, t, r, e.scalar.jsonPathJS, e.scalar.record) : [], m = e.arrays.map((c) => ((o, l, d, i) => {
    const u = i.jsonPathJS.find(d);
    if (!Array.isArray(u)) return [];
    const g = i.schema.attr;
    return H(g) ? ma(o, u, l, i.schema) : I(g) ? na(o, u, l, i.schema) : [];
  })(a, t, r, c));
  return [s, m].flat(2);
}, $ = (a, r) => {
  const e = a.scalars ? P(a.scalars, r) : void 0, t = a.structs.items.map((m) => P(m, r)), s = a.structArrays.items.map((m) => P(m, r));
  return {
    rootCategory: a.rootCategory,
    rootName: a.rootName,
    top: e,
    structs: t,
    structArrays: s
  };
}, P = (a, r) => a.scalarsPath ? { bundleName: a.name, arrays: k(a.scalarArrays, a.name, r), scalar: ua(a.scalarsPath, a.objectSchema, r) } : {
  bundleName: a.name,
  arrays: k(a.scalarArrays, a.name, r)
}, k = (a, r, e) => a.map((t) => ({ jsonPathJS: e(t.path), schema: t.param, parentType: r })), ua = (a, r, e) => ({
  jsonPathJS: e(a),
  record: r
}), E = (a, r, e, t) => ({ pluginName: a, commandName: r.command, desc: r.desc ?? "", text: r.text ?? "", extractors: la(r, e, t) }), la = (a, r, e) => a.args.map((t) => {
  const s = v("args", a.command, t, r);
  return $(s, e);
}), F = (a, r) => ({ pluginName: r.pluginName, commandName: r.commandName, args: x(a, r.extractors) }), Oa = (a, r, e) => {
  const t = e.get(r);
  if (t) return F(a, t);
}, Qa = (a, r) => new Map(a.flatMap((e) => ia(e, r))), ia = (a, r) => {
  const e = N(a.schema.structs);
  return a.schema.commands.map((t) => [`${a.pluginName}:${t.command}`, E(a.pluginName, t, e, r)]);
}, Ra = (a) => a.rootType === "args", qa = (a) => a.rootType === "param", da = (a, r) => {
  const e = C(a.parameters);
  return { pluginName: a.name, params: x(e, r) };
}, Ga = (a, r) => ({
  pluginName: r.pluginName,
  params: x(a, r.extractors)
}), Ua = (a, r, e) => ({ pluginName: a.pluginName, extractors: a.schema.params.map((t) => {
  const s = v("param", "plugin", t, r);
  return $(s, e);
}) }), Wa = (a, r) => {
  const e = pa(a, r);
  return new Map(e);
}, pa = (a, r) => {
  const e = N(a.schema.structs);
  return T(a.pluginName, a.schema.commands, e, r);
}, fa = (a, r, e) => {
  const t = N(r.structs);
  return {
    pluginName: a,
    params: ga(r, t, e),
    commands: T(a, r.commands, t, e)
  };
}, ga = (a, r, e) => a.params.map((t) => {
  const s = v("param", t.name, t, r);
  return $(s, e);
}), T = (a, r, e, t) => r.map((s) => [B(a, s.command), E(a, s, e, t)]), B = (a, r) => `${a}:${r}`, Xa = (a, r) => {
  const e = B(a.parameters[0], a.parameters[1]), t = r.get(e);
  if (!t) return;
  const s = C(a.parameters[3]);
  return F(s, t);
}, Ya = (a) => {
  const r = a.flatMap((e) => e.extractorEntries);
  return new Map(r);
}, ha = (a, r, e) => {
  const t = fa(a.pluginName, a.schema, e), { params: s } = da(r, t.params);
  return { record: r, schema: a, extractorEntries: t.commands, params: s };
}, Za = ha, n = (a, r) => `@${a} ${r}`, p = (a, r) => {
  const e = a[r];
  return e === void 0 ? void 0 : n(r, String(e));
}, J = (a, r, e) => {
  const t = n(r, a.name), s = ya(a.attr), m = Pa(a.attr, e);
  return m ? {
    name: t,
    base: s,
    default: m.default,
    attr: m.attr.filter((c) => c !== void 0)
  } : { name: t, base: s, default: void 0, attr: [] };
}, ya = (a) => {
  return {
    kind: (r = a, r.kind === "struct" ? n(h, `struct<${r.struct}>`) : r.kind === "struct[]" ? n(h, `struct<${r.struct}>[]`) : n(h, r.kind)),
    desc: a.desc ? n("desc", a.desc) : void 0,
    text: a.text ? n("text", a.text) : void 0,
    parent: a.parent ? n("parent", a.parent) : void 0
  };
  var r;
}, Pa = (a, r) => a.kind === "number" ? va(a) : a.kind === "number[]" ? xa(a, r) : a.kind === "file[]" ? Ca(a, r) : a.kind === "struct[]" ? Fa(a, r) : a.kind === "string[]" || a.kind === "multiline_string[]" ? $a(a, r) : a.kind === "select" ? Ma(a) : a.kind === "combo" ? ja(a) : a.kind === "file" ? ka(a) : a.kind === "struct" ? Ea(a, r) : a.kind === "boolean" ? Na(a) : a.kind === "string" || a.kind === "any" || a.kind === "multiline_string" ? Sa(a) : typeof a.default == "number" ? ba(a) : Aa(a, r), V = (a) => a === void 0 ? void 0 : n("default", a.toString()), Na = (a) => ({
  attr: f.boolean.map((r) => p(a, r)),
  default: n("default", a.default ? "true" : "false")
}), ba = (a) => ({ attr: [], default: V(a.default) }), Aa = (a, r) => {
  const e = r.numberArray(a.default);
  return {
    attr: [],
    default: n("default", e)
  };
}, va = (a) => ({ attr: f.number.map((r) => p(a, r)), default: V(a.default) }), xa = (a, r) => {
  const e = r.numberArray(a.default);
  return {
    attr: f.number.map((t) => p(a, t)),
    default: n("default", e)
  };
}, $a = (a, r) => {
  const e = r.stringArray(a.default);
  return { attr: [], default: n("default", e) };
}, Sa = (a) => ({
  attr: [],
  default: n("default", a.default)
}), ka = (a) => ({ attr: f.file.map((r) => p(a, r)), default: n("default", a.default) }), Ca = (a, r) => {
  const e = r.stringArray(a.default);
  return {
    attr: f.file.map((t) => p(a, t)),
    default: n("default", e)
  };
}, Ma = (a) => {
  return { attr: (r = a, r.options.flatMap((e) => [n(M, e.option), n(L, e.value)])), default: n("default", a.default) };
  var r;
}, ja = (a) => {
  return { attr: (r = a, r.options.map((e) => n(M, e))), default: n("default", a.default) };
  var r;
}, Ea = (a, r) => {
  if (!a.default) return { attr: [], default: void 0 };
  const e = r.struct(a.default);
  return { attr: [], default: n("default", e) };
}, Fa = (a, r) => {
  if (!a.default) return { attr: [], default: n("default", "[]") };
  const e = r.structArray(a.default);
  return {
    attr: [],
    default: n("default", e)
  };
}, f = { number: ["min", "max", "decimals"], file: ["dir"], boolean: ["on", "off"] }, Ta = (a, r, e) => ({
  params: w(r.params, e),
  structs: r.structs.map((t) => Ba(t, a, e)),
  commands: r.commands.map((t) => Ja(t, e))
}), w = (a, r) => a.map((e) => J(e, "param", r)), Ba = (a, r, e) => ({ locale: r, struct: a.struct, params: w(a.params, e) }), Ja = (a, r) => ({
  desc: a.desc ? n("desc", a.desc) : void 0,
  text: a.text ? n("text", a.text) : void 0,
  command: n("command", a.command),
  args: a.args.map((e) => J(e, "arg", r))
}), Va = (a) => {
  const r = a.params.flatMap(S).filter((e) => e !== void 0);
  return [`/*~struct~${a.struct}:${a.locale ?? ""}`, ...r, "*/"];
}, wa = (a) => {
  const r = [a.target, a.meta.author, a.meta.pluginDesc, a.meta.url, "", ...a.dependencies.base, ...a.dependencies.orderBefore, ...a.dependencies.orderAfter, (e = a.dependencies, e.base.length > 0 || e.orderBefore.length > 0 || e.orderAfter.length > 0 ? "" : void 0), ...a.schema.commands.flatMap(_a), ...a.schema.params.flatMap(S)].filter((t) => t !== void 0);
  var e;
  return [`/*:${a.locale ?? ""}`, ...r, "*/"];
}, _a = (a) => [a.command, a.text, a.desc, ...a.args.flatMap(S)], S = (a) => [a.name, a.base.kind, a.base.desc, a.base.text, a.base.parent, ...a.attr, a.default, ""], ar = (a) => [...a.body, ...a.structs.flatMap((r) => r)].join(`
`), rr = (a, r) => {
  const e = Da(a, r);
  return { body: wa(e), structs: e.schema.structs.map(Va) };
}, Da = (a, r) => {
  const e = a.locale ?? "";
  return {
    locale: e,
    schema: Ta(e, a.schema, r),
    target: n(O, a.target),
    meta: za(a.meta),
    dependencies: Ka(a.dependencies)
  };
}, Ka = (a) => ({ base: a.base.map((r) => n(q, r)), orderBefore: a.orderBefore.map((r) => n(R, r)), orderAfter: a.orderAfter.map((r) => n(Q, r)) }), za = (a) => {
  const r = a.author, e = a.plugindesc, t = a.url;
  return { author: r ? n(W, r) : void 0, pluginDesc: e ? n(U, e) : void 0, url: t ? n(G, t) : void 0 };
};
export {
  Qa as compileCommandExtractorsFromPlugins,
  E as compilePluginCommandExtractor,
  ia as compilePluginCommandPairs,
  Ua as compilePluginParamExtractor,
  Za as convertPlugin,
  pa as createPluginCommandExtractor,
  Wa as createPluginCommandExtractorMap,
  fa as createPluginValueExtractor,
  v as createPluginValuesPath,
  ta as createPrimiteveParamPath,
  La as createStructParamPath,
  x as extractAllPluginValues,
  Xa as extractArgsFromPluiginCommand,
  Oa as extractCommandArgsByKey,
  F as extractPluginCommandArgs,
  Ga as extractPluginParam,
  da as extractPluginParamFromRecord,
  Da as generatePluginAnnotation,
  rr as generatePluginAnnotationLines,
  ar as generatePluginAnnotationText,
  ra as getPathFromStructArraySchema,
  aa as getPathFromStructParam,
  Ia as getPathFromStructSchema,
  Ra as isCommandArgValue,
  qa as ispluginParamValue,
  ha as jsonPathFromPluginSchema,
  Y as makeScalarArrayPath,
  X as makeScalarValuesPath,
  Ya as mergeCommandMap,
  B as pluginComamndName
};
