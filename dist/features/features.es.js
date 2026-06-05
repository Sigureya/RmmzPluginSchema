import { K as X, D as Y, B as Z, q as aa, z as ra, u as ta, h as $, p as ea, M as k, N as D, O as sa, P as na, Q as oa, R as ma, S as ca, T as ua, U as la, V as ia, j as da } from "../shared/structMap.es.js";
const pa = (a, r) => {
  if (a.length !== 0)
    return `${r}[${a.map((t) => `"${t.name}"`).join(",")}]`;
}, fa = (a, r) => a.map((t) => ({ path: `${r}["${t.name}"][*]`, param: t })), V = {
  undefinedStruct: "undefined_struct",
  cyclicStruct: "cyclic_struct"
};
function ga(a, r, t) {
  if (a.frames.length === 0) return a;
  const e = a.frames[a.frames.length - 1], s = a.frames.slice(0, -1);
  if (e.ancestry.includes(e.schemaName)) return { frames: s, items: a.items, errs: [...a.errs, { code: t.cyclicStruct, path: e.basePath }] };
  const n = r.get(e.schemaName);
  if (!n) return {
    frames: s,
    items: a.items,
    errs: [...a.errs, { code: t.undefinedStruct, path: e.basePath }]
  };
  const o = function(c, u) {
    const l = c.ancestry.concat(c.schemaName), d = c.basePath;
    return [...u.structs.map((i) => ({
      schemaName: i.attr.struct,
      basePath: `${d}["${i.name}"]`,
      ancestry: l
    })), ...u.structArrays.map((i) => ({ schemaName: i.attr.struct, basePath: `${d}["${i.name}"][*]`, ancestry: l }))].reverse();
  }(e, n);
  if (n.scalars.length > 0 || n.scalarArrays.length > 0) {
    const c = function(u, { path: l, structName: d }) {
      return {
        category: "struct",
        objectSchema: X(u.scalars),
        name: d,
        scalarArrays: fa(u.scalarArrays, l),
        scalarsPath: u.scalars.length > 0 ? pa(u.scalars, l) : void 0
      };
    }(n, { path: e.basePath, structName: e.schemaName });
    return s.push(...o), {
      frames: s,
      items: [...a.items, c],
      errs: a.errs
    };
  }
  return s.push(...o), { frames: s, items: a.items, errs: a.errs };
}
function F(a, r, t, e) {
  const s = { items: [], errs: [], frames: [{
    schemaName: a,
    basePath: r,
    ancestry: []
  }] }, n = Math.max(1, 3 * t.size + 5), o = Array.from({ length: n }).reduce((c) => c.frames.length === 0 ? c : ga(c, t, e), s);
  return { items: o.items, errors: o.errs };
}
const ha = (a, r, t, e = V) => F(a.attr.struct, `${r}["${a.name}"]`, t, e), ya = (a, r, t, e = V) => F(a.attr.struct, `${r}["${a.name}"][*]`, t, e), mr = (a, r, t, e = V) => F(a, r, t, e), x = (a, r, t, e) => Y(t) ? O(a, t, e) : Z(t) ? xa(a, t, e) : aa(t) ? Na(a, r, t) : Pa(a, r, t), Na = (a, r, t) => ({
  rootCategory: a,
  rootName: r,
  scalars: { name: "", objectSchema: {}, scalarsPath: void 0, scalarArrays: [{ path: `$["${t.name}"][*]`, param: t }] },
  structs: { items: [], errors: [] },
  structArrays: {
    items: [],
    errors: []
  }
}), Pa = (a, r, t) => ({ rootCategory: a, rootName: r, scalars: { name: t.attr.kind, objectSchema: { [t.name]: t.attr }, scalarsPath: `$["${t.name}"]`, scalarArrays: [] }, structArrays: {
  items: [],
  errors: []
}, structs: { items: [], errors: [] } }), cr = (a, r, t) => O(a, r, t), O = (a, r, t) => ({
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structArrays: { items: [], errors: [] },
  structs: ha(r, "$", t)
}), xa = (a, r, t) => ({
  structArrays: ya(r, "$", t),
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), Aa = (a, r, t, e) => r.filter((s) => typeof s == "number").map((s) => ({
  rootName: a.rootName,
  rootType: a.rootCategory,
  value: s,
  structName: t,
  param: e
})), ba = (a, r, t, e) => r.filter((s) => typeof s == "string").map((s) => ({ rootName: a.rootName, rootType: a.rootCategory, value: s, structName: t, param: e })), va = (a, r, t, e, s) => {
  if (typeof t == "object" || t === null) return null;
  const n = e[e.length - 1];
  if (typeof n == "number") return null;
  const o = s[n];
  return o ? {
    rootName: a.rootName,
    rootType: a.rootCategory,
    structName: r,
    value: t,
    param: { name: n, attr: o }
  } : null;
}, R = (a, r) => r.map((t) => $a(a, t)).flat(3), $a = (a, r) => [r.top ? C(r, a, r.top, "") : [], r.structs.map((t) => C(r, a, t)), r.structArrays.map((t) => C(r, a, t))], C = (a, r, t, e = t.bundleName) => {
  const s = t.scalar ? ((o, c, u, l, d) => l.pathSegments(u).map(({ value: i, segments: p }) => va(o, c, i, p, d)).filter((i) => i !== null))(a, e, r, t.scalar.jsonPathJS, t.scalar.record) : [], n = t.arrays.map((o) => ((c, u, l, d) => {
    const i = d.jsonPathJS.find(l);
    if (!Array.isArray(i)) return [];
    const p = d.schema.attr;
    return ra(p) ? ba(c, i, u, d.schema) : ta(p) ? Aa(c, i, u, d.schema) : [];
  })(a, e, r, o));
  return [s, n].flat(2);
}, A = (a, r) => {
  const t = Sa(a, { createReader: (e) => r(e), errorAtPath() {
  } });
  if (t.errors.length > 0) throw t.errors[0].error;
  return t.extractor;
}, Sa = (a, r) => {
  const t = [], e = a.scalars ? M(a.scalars, "scalar", r, t) : void 0, s = a.structs.items.map((o) => M(o, "struct", r, t)), n = a.structArrays.items.map((o) => M(o, "structArray", r, t));
  return { extractor: {
    rootCategory: a.rootCategory,
    rootName: a.rootName,
    top: e,
    structs: s,
    structArrays: n
  }, errors: t };
}, M = (a, r, t, e) => {
  const s = ka(a.scalarArrays, a.name, r, t, e);
  return a.scalarsPath ? {
    bundleName: a.name,
    arrays: s,
    scalar: Ca(a.scalarsPath, a.objectSchema, r, t, e)
  } : { bundleName: a.name, arrays: s };
}, ka = (a, r, t, e, s) => a.flatMap((n) => {
  try {
    return [{
      jsonPathJS: e.createReader(n.path),
      schema: n.param,
      parentType: r
    }];
  } catch (o) {
    return s.push({ path: n.path, valType: t, error: o, handledInfo: e.errorAtPath(n.path, t, o) }), [];
  }
}), Ca = (a, r, t, e, s) => {
  try {
    return {
      jsonPathJS: e.createReader(a),
      record: r
    };
  } catch (n) {
    return void s.push({ path: a, valType: t, error: n, handledInfo: e.errorAtPath(a, t, n) });
  }
}, I = (a, r, t, e) => ({
  pluginName: a,
  commandName: r.command,
  desc: r.desc ?? "",
  text: r.text ?? "",
  extractors: Ma(r, t, e)
}), Ma = (a, r, t) => a.args.map((e) => {
  const s = x("args", a.command, e, r);
  return A(s, t);
}), K = (a, r) => ({
  pluginName: r.pluginName,
  commandName: r.commandName,
  args: R(a, r.extractors)
}), ur = (a, r, t) => {
  const e = t.get(r);
  if (e) return K(a, e);
}, lr = (a, r) => new Map(a.flatMap((t) => Ea(t, r))), Ea = (a, r) => {
  const t = $(a.schema.structs);
  return a.schema.commands.map((e) => [`${a.pluginName}:${e.command}`, I(a.pluginName, e, t, r)]);
}, ir = (a, r) => {
  const t = a.flatMap((e) => ja(e, r));
  return new Map(t);
}, ja = (a, r) => {
  const t = $(a.schema.structs);
  return _(a.pluginName, a.schema.commands, t, r);
}, dr = (a, r, t) => {
  const e = $(r.structs);
  return { pluginName: a, params: Ta(r, e, t), commands: _(a, r.commands, e, t) };
}, Ta = (a, r, t) => a.params.map((e) => {
  const s = x("param", e.name, e, r);
  return A(s, t);
}), _ = (a, r, t, e) => r.map((s) => [z(a, s.command), I(a, s, t, e)]), z = (a, r) => `${a}:${r}`, pr = (a, r, t, e = ea) => {
  const s = { command: a, pluginName: a.parameters[0], commandName: a.parameters[1] }, n = z(a.parameters[0], a.parameters[1]), o = r.get(n);
  if (!o) return E(a, t.commandNotFoundError(s));
  try {
    const c = e(a.parameters[3]);
    return Va(c, o, s, t);
  } catch (c) {
    return E(a, t.commandParseError(s, c));
  }
}, Va = (a, r, t, e) => {
  try {
    return K(a, r);
  } catch (s) {
    return E(t.command, e.commandArgsError(t, s));
  }
}, E = (a, r) => ({
  pluginName: a.parameters[0],
  commandName: a.parameters[1],
  args: [],
  error: r
}), fr = (a) => a.rootType === "args", gr = (a) => a.rootType === "param", hr = (a, r, t, e) => {
  const s = { pluginName: a.name, record: a };
  try {
    const n = t(a.parameters);
    return {
      pluginName: s.pluginName,
      params: R(n, r),
      errorKind: "",
      errorInfo: null
    };
  } catch (n) {
    return { pluginName: s.pluginName, errorKind: "parseError", errorInfo: e.pluginParamsParseError(s, n), params: [] };
  }
}, yr = (a, r, t) => ({
  pluginName: a.pluginName,
  extractors: a.schema.params.map((e) => {
    const s = x("param", "plugin", e, r);
    return A(s, t);
  })
}), Nr = (a) => {
  const r = a.flatMap((t) => t.extractorEntries);
  return new Map(r);
}, Pr = (a, r, t, e, s) => {
  const n = $(r.structs);
  return { pluginName: a, commands: Fa(a, r.commands, n, t, s), params: Ba(a, r.params, n, t, e) };
}, Fa = (a, r, t, e, s) => r.reduce((n, o) => {
  const c = ((u, l, d, i, p) => {
    const y = [], g = l.args.flatMap((N) => {
      const f = x("args", l.command, N, d);
      y.push(...((h, S, P, U, W) => {
        const G = { pluginName: h, commandName: S, argName: P };
        return U.map((H) => W.commandStructPathError(G, H));
      })(u, l.command, N.name, [...f.structs.errors, ...f.structArrays.errors], p));
      try {
        return [A(f, i)];
      } catch (h) {
        return y.push(p.commandCompileJSONPathSchemaError({ pluginName: u, commandName: l.command, argName: N.name }, h)), [];
      }
    });
    return { extractor: {
      pluginName: u,
      commandName: l.command,
      desc: l.desc ?? "",
      text: l.text ?? "",
      extractors: g
    }, errors: y };
  })(a, o, t, e, s);
  return { extractors: [...n.extractors, c.extractor], errors: [...n.errors, ...c.errors] };
}, {
  extractors: [],
  errors: []
}), Ba = (a, r, t, e, s) => r.reduce((n, o) => {
  const c = ((u, l, d, i, p) => {
    const y = { pluginName: u, paramName: l.name }, g = x("param", "plugin", l, d), N = ((f, h, S) => h.map((P) => ({
      code: "paramStructPathError",
      source: "createPath",
      pluginName: f.pluginName,
      paramName: f.paramName,
      message: `Path error at "${P.path}": ${P.code}`,
      info: S.paramStructPathError(f, P)
    })))(y, [...g.structs.errors, ...g.structArrays.errors], p);
    try {
      return { extractor: A(g, i), errors: N };
    } catch (f) {
      const h = p.paramCompileJSONPathSchemaError(y, f);
      return { extractor: {
        rootCategory: g.rootCategory,
        rootName: g.rootName,
        top: void 0,
        structs: [],
        structArrays: []
      }, errors: [...N, h] };
    }
  })(a, o, t, e, s);
  return {
    extractors: [...n.extractors, c.extractor],
    errors: [...n.errors, ...c.errors]
  };
}, { extractors: [], errors: [] }), m = (a, r) => `@${a} ${r}`, b = (a, r) => {
  const t = a[r];
  return t === void 0 ? void 0 : m(r, String(t));
}, q = (a, r, t) => {
  const e = m(r, a.name), s = Ja(a.attr), n = wa(a.attr, t);
  return n ? { name: e, base: s, default: n.default, attr: n.attr.filter((o) => o !== void 0) } : { name: e, base: s, default: void 0, attr: [] };
}, Ja = (a) => {
  return {
    kind: (r = a, r.kind === "struct" ? m(k, `struct<${r.struct}>`) : r.kind === "struct[]" ? m(k, `struct<${r.struct}>[]`) : m(k, r.kind)),
    desc: a.desc ? m("desc", a.desc) : void 0,
    text: a.text ? m("text", a.text) : void 0,
    parent: a.parent ? m("parent", a.parent) : void 0
  };
  var r;
}, wa = (a, r) => a.kind === "number" ? Ia(a) : a.kind === "number[]" ? Ka(a, r) : a.kind === "file[]" ? La(a, r) : a.kind === "struct[]" ? Ga(a, r) : a.kind === "string[]" || a.kind === "multiline_string[]" ? _a(a, r) : a.kind === "select" ? Qa(a) : a.kind === "combo" ? Ua(a) : a.kind === "file" ? qa(a) : a.kind === "struct" ? Wa(a, r) : a.kind === "boolean" ? Da(a) : a.kind === "string" || a.kind === "any" || a.kind === "multiline_string" ? za(a) : typeof a.default == "number" ? Oa(a) : Ra(a, r), L = (a) => a === void 0 ? void 0 : m("default", a.toString()), Da = (a) => ({
  attr: v.boolean.map((r) => b(a, r)),
  default: m("default", a.default ? "true" : "false")
}), Oa = (a) => ({ attr: [], default: L(a.default) }), Ra = (a, r) => {
  const t = r.numberArray(a.default);
  return {
    attr: [],
    default: m("default", t)
  };
}, Ia = (a) => ({ attr: v.number.map((r) => b(a, r)), default: L(a.default) }), Ka = (a, r) => {
  const t = r.numberArray(a.default);
  return {
    attr: v.number.map((e) => b(a, e)),
    default: m("default", t)
  };
}, _a = (a, r) => {
  const t = r.stringArray(a.default);
  return { attr: [], default: m("default", t) };
}, za = (a) => ({
  attr: [],
  default: m("default", a.default)
}), qa = (a) => ({ attr: v.file.map((r) => b(a, r)), default: m("default", a.default) }), La = (a, r) => {
  const t = r.stringArray(a.default);
  return {
    attr: v.file.map((e) => b(a, e)),
    default: m("default", t)
  };
}, Qa = (a) => {
  return { attr: (r = a, r.options.flatMap((t) => [m(D, t.option), m(sa, t.value)])), default: m("default", a.default) };
  var r;
}, Ua = (a) => {
  return { attr: (r = a, r.options.map((t) => m(D, t))), default: m("default", a.default) };
  var r;
}, Wa = (a, r) => {
  if (!a.default) return { attr: [], default: void 0 };
  const t = r.struct(a.default);
  return { attr: [], default: m("default", t) };
}, Ga = (a, r) => {
  if (!a.default) return { attr: [], default: m("default", "[]") };
  const t = r.structArray(a.default);
  return {
    attr: [],
    default: m("default", t)
  };
}, v = { number: ["min", "max", "decimals"], file: ["dir"], boolean: ["on", "off"] }, Ha = (a, r, t) => ({
  params: Q(r.params, t),
  structs: r.structs.map((e) => Xa(e, a, t)),
  commands: r.commands.map((e) => Ya(e, t))
}), Q = (a, r) => a.map((t) => q(t, "param", r)), Xa = (a, r, t) => ({ locale: r, struct: a.struct, params: Q(a.params, t) }), Ya = (a, r) => ({
  desc: a.desc ? m("desc", a.desc) : void 0,
  text: a.text ? m("text", a.text) : void 0,
  command: m("command", a.command),
  args: a.args.map((t) => q(t, "arg", r))
}), Za = (a) => {
  const r = a.params.flatMap(B).filter((t) => t !== void 0);
  return [`/*~struct~${a.struct}:${a.locale ?? ""}`, ...r, "*/"];
}, ar = (a) => {
  const r = [a.target, a.meta.author, a.meta.pluginDesc, a.meta.url, "", ...a.dependencies.base, ...a.dependencies.orderBefore, ...a.dependencies.orderAfter, (t = a.dependencies, t.base.length > 0 || t.orderBefore.length > 0 || t.orderAfter.length > 0 ? "" : void 0), ...a.schema.commands.flatMap(rr), ...a.schema.params.flatMap(B)].filter((e) => e !== void 0);
  var t;
  return [`/*:${a.locale ?? ""}`, ...r, "*/"];
}, rr = (a) => [a.command, a.text, a.desc, ...a.args.flatMap(B)], B = (a) => [a.name, a.base.kind, a.base.desc, a.base.text, a.base.parent, ...a.attr, a.default, ""], xr = (a) => [...a.body, ...a.structs.flatMap((r) => r)].join(`
`), Ar = (a, r) => {
  const t = tr(a, r);
  return { body: ar(t), structs: t.schema.structs.map(Za) };
}, tr = (a, r) => {
  const t = a.locale ?? "";
  return {
    locale: t,
    schema: Ha(t, a.schema, r),
    target: m(na, a.target),
    meta: sr(a.meta),
    dependencies: er(a.dependencies)
  };
}, er = (a) => ({ base: a.base.map((r) => m(ca, r)), orderBefore: a.orderBefore.map((r) => m(ma, r)), orderAfter: a.orderAfter.map((r) => m(oa, r)) }), sr = (a) => {
  const r = a.author, t = a.plugindesc, e = a.url;
  return { author: r ? m(ia, r) : void 0, pluginDesc: t ? m(la, t) : void 0, url: e ? m(ua, e) : void 0 };
}, br = ({ schema: a, pluginName: r }, t) => {
  const e = da(a, (s, n) => s.kind === "any" ? t(s, n) : s.kind === "string" || s.kind === "string[]");
  return nr(r, e);
}, nr = (a, r) => {
  const t = new Map(r.structs.map((e) => [e.struct, e]));
  return {
    pluginName: a,
    paramsPath: r.params.flatMap((e) => j(t, [e.name], e.attr, [])),
    commands: r.commands.map((e) => ({ commandName: e.command, argsPath: e.args.flatMap((s) => j(t, [s.name], s.attr, [])) }))
  };
}, j = (a, r, t, e) => t.kind === "struct" ? J(a, r, t.struct, e) : t.kind === "struct[]" ? J(a, [...r, "[]"], t.struct, e) : t.kind.endsWith("[]") ? [[...r, "[]"]] : [r], J = (a, r, t, e) => {
  if (e.includes(t)) return [r];
  const s = a.get(t);
  if (s === void 0) return [r];
  const n = [...e, t];
  return s.params.flatMap((o) => j(a, [...r, o.name], o.attr, n));
}, vr = (a, r, t) => r.reduce((e, s) => {
  const n = T(e, s, t);
  return n === null || typeof n != "object" || Array.isArray(n) ? e : n;
}, a), w = (a, r) => typeof a == "string" ? r(a) ?? a : a, T = (a, r, t) => {
  if (r.length === 0) return a;
  const [e, ...s] = r;
  if (e === "[]") {
    if (!Array.isArray(a)) return a;
    const c = a.map((u) => s.length === 0 ? w(u, t) : T(u, s, t));
    return c.every((u, l) => u === a[l]) ? a : c;
  }
  if (a === null || typeof a != "object" || Array.isArray(a) || !(e in a)) return a;
  const n = a[e], o = s.length === 0 ? w(n, t) : T(n, s, t);
  return o === n ? a : Object.fromEntries(Object.entries(a).map(([c, u]) => [c, c === e ? o : u]));
};
export {
  Fa as buildCommandExtractors,
  Ba as buildParamExtractors,
  Pr as buildPluginValueExtractor,
  lr as compileCommandExtractorsFromPlugins,
  I as compilePluginCommandExtractor,
  Ea as compilePluginCommandPairs,
  yr as compilePluginParamExtractor,
  nr as createDictionary,
  ja as createPluginCommandExtractor,
  ir as createPluginCommandExtractorMap,
  dr as createPluginValueExtractor,
  x as createPluginValuesPath,
  Pa as createPrimiteveParamPath,
  cr as createStructParamPath,
  br as createTextParamDictionary,
  R as extractAllPluginValues,
  pr as extractArgsFromPluginCommand,
  ur as extractCommandArgsByKey,
  K as extractPluginCommandArgs,
  hr as extractPluginParamFromRecord,
  tr as generatePluginAnnotation,
  Ar as generatePluginAnnotationLines,
  xr as generatePluginAnnotationText,
  ya as getPathFromStructArraySchema,
  ha as getPathFromStructParam,
  mr as getPathFromStructSchema,
  fr as isCommandArgValue,
  gr as ispluginParamValue,
  fa as makeScalarArrayPath,
  pa as makeScalarValuesPath,
  Nr as mergeCommandMap,
  z as pluginComamndName,
  vr as replacePluginValue
};
