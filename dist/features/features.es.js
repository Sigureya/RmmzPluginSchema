import { N as H, E as Z, C as aa, r as ra, A as ta, v as ea, h as $, p as B, P as k, Q as D, R as sa, S as na, T as ma, U as oa, V as ca, W as ua, X as la, Y as ia, j as da, K as pa } from "../shared/structMap.es.js";
const fa = (a, r) => {
  if (a.length !== 0)
    return `${r}[${a.map((t) => `"${t.name}"`).join(",")}]`;
}, ga = (a, r) => a.map((t) => ({ path: `${r}["${t.name}"][*]`, param: t })), V = {
  undefinedStruct: "undefined_struct",
  cyclicStruct: "cyclic_struct"
};
function ha(a, r, t) {
  if (a.frames.length === 0) return a;
  const e = a.frames[a.frames.length - 1], s = a.frames.slice(0, -1);
  if (e.ancestry.includes(e.schemaName)) return { frames: s, items: a.items, errs: [...a.errs, { code: t.cyclicStruct, path: e.basePath }] };
  const n = r.get(e.schemaName);
  if (!n) return {
    frames: s,
    items: a.items,
    errs: [...a.errs, { code: t.undefinedStruct, path: e.basePath }]
  };
  const m = function(c, u) {
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
        objectSchema: H(u.scalars),
        name: d,
        scalarArrays: ga(u.scalarArrays, l),
        scalarsPath: u.scalars.length > 0 ? fa(u.scalars, l) : void 0
      };
    }(n, { path: e.basePath, structName: e.schemaName });
    return s.push(...m), {
      frames: s,
      items: [...a.items, c],
      errs: a.errs
    };
  }
  return s.push(...m), { frames: s, items: a.items, errs: a.errs };
}
function F(a, r, t, e) {
  const s = { items: [], errs: [], frames: [{
    schemaName: a,
    basePath: r,
    ancestry: []
  }] }, n = Math.max(1, 3 * t.size + 5), m = Array.from({ length: n }).reduce((c) => c.frames.length === 0 ? c : ha(c, t, e), s);
  return { items: m.items, errors: m.errs };
}
const ya = (a, r, t, e = V) => F(a.attr.struct, `${r}["${a.name}"]`, t, e), Na = (a, r, t, e = V) => F(a.attr.struct, `${r}["${a.name}"][*]`, t, e), ur = (a, r, t, e = V) => F(a, r, t, e), x = (a, r, t, e) => Z(t) ? I(a, t, e) : aa(t) ? Aa(a, t, e) : ra(t) ? Pa(a, r, t) : xa(a, r, t), Pa = (a, r, t) => ({
  rootCategory: a,
  rootName: r,
  scalars: { name: "", objectSchema: {}, scalarsPath: void 0, scalarArrays: [{ path: `$["${t.name}"][*]`, param: t }] },
  structs: { items: [], errors: [] },
  structArrays: {
    items: [],
    errors: []
  }
}), xa = (a, r, t) => ({ rootCategory: a, rootName: r, scalars: { name: t.attr.kind, objectSchema: { [t.name]: t.attr }, scalarsPath: `$["${t.name}"]`, scalarArrays: [] }, structArrays: {
  items: [],
  errors: []
}, structs: { items: [], errors: [] } }), lr = (a, r, t) => I(a, r, t), I = (a, r, t) => ({
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structArrays: { items: [], errors: [] },
  structs: ya(r, "$", t)
}), Aa = (a, r, t) => ({
  structArrays: Na(r, "$", t),
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), ba = (a, r, t, e) => r.filter((s) => typeof s == "number").map((s) => ({
  rootName: a.rootName,
  rootType: a.rootCategory,
  value: s,
  structName: t,
  param: e
})), va = (a, r, t, e) => r.filter((s) => typeof s == "string").map((s) => ({ rootName: a.rootName, rootType: a.rootCategory, value: s, structName: t, param: e })), $a = (a, r, t, e, s) => {
  if (typeof t == "object" || t === null) return null;
  const n = e[e.length - 1];
  if (typeof n == "number") return null;
  const m = s[n];
  return m ? {
    rootName: a.rootName,
    rootType: a.rootCategory,
    structName: r,
    value: t,
    param: { name: n, attr: m }
  } : null;
}, K = (a, r) => r.map((t) => Sa(a, t)).flat(3), Sa = (a, r) => [r.top ? C(r, a, r.top, "") : [], r.structs.map((t) => C(r, a, t)), r.structArrays.map((t) => C(r, a, t))], C = (a, r, t, e = t.bundleName) => {
  const s = t.scalar ? ((m, c, u, l, d) => l.pathSegments(u).map(({ value: i, segments: p }) => $a(m, c, i, p, d)).filter((i) => i !== null))(a, e, r, t.scalar.jsonPathJS, t.scalar.record) : [], n = t.arrays.map((m) => ((c, u, l, d) => {
    const i = d.jsonPathJS.find(l);
    if (!Array.isArray(i)) return [];
    const p = d.schema.attr;
    return ta(p) ? va(c, i, u, d.schema) : ea(p) ? ba(c, i, u, d.schema) : [];
  })(a, e, r, m));
  return [s, n].flat(2);
}, A = (a, r) => {
  const t = ka(a, { createReader: (e) => r(e), errorAtPath() {
  } });
  if (t.errors.length > 0) throw t.errors[0].error;
  return t.extractor;
}, ka = (a, r) => {
  const t = [], e = a.scalars ? E(a.scalars, "scalar", r, t) : void 0, s = a.structs.items.map((m) => E(m, "struct", r, t)), n = a.structArrays.items.map((m) => E(m, "structArray", r, t));
  return { extractor: {
    rootCategory: a.rootCategory,
    rootName: a.rootName,
    top: e,
    structs: s,
    structArrays: n
  }, errors: t };
}, E = (a, r, t, e) => {
  const s = Ca(a.scalarArrays, a.name, r, t, e);
  return a.scalarsPath ? {
    bundleName: a.name,
    arrays: s,
    scalar: Ea(a.scalarsPath, a.objectSchema, r, t, e)
  } : { bundleName: a.name, arrays: s };
}, Ca = (a, r, t, e, s) => a.flatMap((n) => {
  try {
    return [{
      jsonPathJS: e.createReader(n.path),
      schema: n.param,
      parentType: r
    }];
  } catch (m) {
    return s.push({ path: n.path, valType: t, error: m, handledInfo: e.errorAtPath(n.path, t, m) }), [];
  }
}), Ea = (a, r, t, e, s) => {
  try {
    return {
      jsonPathJS: e.createReader(a),
      record: r
    };
  } catch (n) {
    return void s.push({ path: a, valType: t, error: n, handledInfo: e.errorAtPath(a, t, n) });
  }
}, O = (a, r, t, e) => ({
  pluginName: a,
  commandName: r.command,
  desc: r.desc ?? "",
  text: r.text ?? "",
  extractors: Ma(r, t, e)
}), Ma = (a, r, t) => a.args.map((e) => {
  const s = x("args", a.command, e, r);
  return A(s, t);
}), _ = (a, r) => ({
  pluginName: r.pluginName,
  commandName: r.commandName,
  args: K(a, r.extractors)
}), ir = (a, r, t) => {
  const e = t.get(r);
  if (e) return _(a, e);
}, dr = (a, r) => new Map(a.flatMap((t) => ja(t, r))), ja = (a, r) => {
  const t = $(a.schema.structs);
  return a.schema.commands.map((e) => [`${a.pluginName}:${e.command}`, O(a.pluginName, e, t, r)]);
}, pr = (a, r) => {
  const t = a.flatMap((e) => Ta(e, r));
  return new Map(t);
}, Ta = (a, r) => {
  const t = $(a.schema.structs);
  return W(a.pluginName, a.schema.commands, t, r);
}, fr = (a, r, t) => {
  const e = $(r.structs);
  return { pluginName: a, params: Va(r, e, t), commands: W(a, r.commands, e, t) };
}, Va = (a, r, t) => a.params.map((e) => {
  const s = x("param", e.name, e, r);
  return A(s, t);
}), W = (a, r, t, e) => r.map((s) => [z(a, s.command), O(a, s, t, e)]), z = (a, r) => `${a}:${r}`, gr = (a, r, t, e = B) => {
  const s = { command: a, pluginName: a.parameters[0], commandName: a.parameters[1] }, n = z(a.parameters[0], a.parameters[1]), m = r.get(n);
  if (!m) return M(a, t.commandNotFoundError(s));
  try {
    const c = e(a.parameters[3]);
    return Fa(c, m, s, t);
  } catch (c) {
    return M(a, t.commandParseError(s, c));
  }
}, Fa = (a, r, t, e) => {
  try {
    return _(a, r);
  } catch (s) {
    return M(t.command, e.commandArgsError(t, s));
  }
}, M = (a, r) => ({
  pluginName: a.parameters[0],
  commandName: a.parameters[1],
  args: [],
  error: r
}), hr = (a) => a.rootType === "args", yr = (a) => a.rootType === "param", Nr = (a, r, t, e) => {
  const s = { pluginName: a.name, record: a };
  try {
    const n = t(a.parameters);
    return {
      pluginName: s.pluginName,
      params: K(n, r),
      errorKind: "",
      errorInfo: null
    };
  } catch (n) {
    return { pluginName: s.pluginName, errorKind: "parseError", errorInfo: e.pluginParamsParseError(s, n), params: [] };
  }
}, Pr = (a, r, t) => ({
  pluginName: a.pluginName,
  extractors: a.schema.params.map((e) => {
    const s = x("param", "plugin", e, r);
    return A(s, t);
  })
}), xr = (a) => {
  const r = a.flatMap((t) => t.extractorEntries);
  return new Map(r);
}, Ar = (a, r, t, e, s) => {
  const n = $(r.structs);
  return { pluginName: a, commands: Ja(a, r.commands, n, t, s), params: Ra(a, r.params, n, t, e) };
}, Ja = (a, r, t, e, s) => r.reduce((n, m) => {
  const c = ((u, l, d, i, p) => {
    const y = [], g = l.args.flatMap((N) => {
      const f = x("args", l.command, N, d);
      y.push(...((h, S, P, X, Y) => {
        const q = { pluginName: h, commandName: S, argName: P };
        return X.map((G) => Y.commandStructPathError(q, G));
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
  })(a, m, t, e, s);
  return { extractors: [...n.extractors, c.extractor], errors: [...n.errors, ...c.errors] };
}, {
  extractors: [],
  errors: []
}), Ra = (a, r, t, e, s) => r.reduce((n, m) => {
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
  })(a, m, t, e, s);
  return {
    extractors: [...n.extractors, c.extractor],
    errors: [...n.errors, ...c.errors]
  };
}, { extractors: [], errors: [] }), o = (a, r) => `@${a} ${r}`, b = (a, r) => {
  const t = a[r];
  return t === void 0 ? void 0 : o(r, String(t));
}, L = (a, r, t) => {
  const e = o(r, a.name), s = wa(a.attr), n = Ba(a.attr, t);
  return n ? { name: e, base: s, default: n.default, attr: n.attr.filter((m) => m !== void 0) } : { name: e, base: s, default: void 0, attr: [] };
}, wa = (a) => {
  return {
    kind: (r = a, r.kind === "struct" ? o(k, `struct<${r.struct}>`) : r.kind === "struct[]" ? o(k, `struct<${r.struct}>[]`) : o(k, r.kind)),
    desc: a.desc ? o("desc", a.desc) : void 0,
    text: a.text ? o("text", a.text) : void 0,
    parent: a.parent ? o("parent", a.parent) : void 0
  };
  var r;
}, Ba = (a, r) => a.kind === "number" ? Oa(a) : a.kind === "number[]" ? _a(a, r) : a.kind === "file[]" ? Qa(a, r) : a.kind === "struct[]" ? qa(a, r) : a.kind === "string[]" || a.kind === "multiline_string[]" ? Wa(a, r) : a.kind === "select" ? Ua(a) : a.kind === "combo" ? Xa(a) : a.kind === "file" ? La(a) : a.kind === "struct" ? Ya(a, r) : a.kind === "boolean" ? Da(a) : a.kind === "string" || a.kind === "any" || a.kind === "multiline_string" ? za(a) : typeof a.default == "number" ? Ia(a) : Ka(a, r), Q = (a) => a === void 0 ? void 0 : o("default", a.toString()), Da = (a) => ({
  attr: v.boolean.map((r) => b(a, r)),
  default: o("default", a.default ? "true" : "false")
}), Ia = (a) => ({ attr: [], default: Q(a.default) }), Ka = (a, r) => {
  const t = r.numberArray(a.default);
  return {
    attr: [],
    default: o("default", t)
  };
}, Oa = (a) => ({ attr: v.number.map((r) => b(a, r)), default: Q(a.default) }), _a = (a, r) => {
  const t = r.numberArray(a.default);
  return {
    attr: v.number.map((e) => b(a, e)),
    default: o("default", t)
  };
}, Wa = (a, r) => {
  const t = r.stringArray(a.default);
  return { attr: [], default: o("default", t) };
}, za = (a) => ({
  attr: [],
  default: o("default", a.default)
}), La = (a) => ({ attr: v.file.map((r) => b(a, r)), default: o("default", a.default) }), Qa = (a, r) => {
  const t = r.stringArray(a.default);
  return {
    attr: v.file.map((e) => b(a, e)),
    default: o("default", t)
  };
}, Ua = (a) => {
  return { attr: (r = a, r.options.flatMap((t) => [o(D, t.option), o(sa, t.value)])), default: o("default", a.default) };
  var r;
}, Xa = (a) => {
  return { attr: (r = a, r.options.map((t) => o(D, t))), default: o("default", a.default) };
  var r;
}, Ya = (a, r) => {
  if (!a.default) return { attr: [], default: void 0 };
  const t = r.struct(a.default);
  return { attr: [], default: o("default", t) };
}, qa = (a, r) => {
  if (!a.default) return { attr: [], default: o("default", "[]") };
  const t = r.structArray(a.default);
  return {
    attr: [],
    default: o("default", t)
  };
}, v = { number: ["min", "max", "decimals"], file: ["dir"], boolean: ["on", "off"] }, Ga = (a, r, t) => ({
  params: U(r.params, t),
  structs: r.structs.map((e) => Ha(e, a, t)),
  commands: r.commands.map((e) => Za(e, t))
}), U = (a, r) => a.map((t) => L(t, "param", r)), Ha = (a, r, t) => ({ locale: r, struct: a.struct, params: U(a.params, t) }), Za = (a, r) => ({
  desc: a.desc ? o("desc", a.desc) : void 0,
  text: a.text ? o("text", a.text) : void 0,
  command: o("command", a.command),
  args: a.args.map((t) => L(t, "arg", r))
}), ar = (a) => {
  const r = a.params.flatMap(J).filter((t) => t !== void 0);
  return [`/*~struct~${a.struct}:${a.locale ?? ""}`, ...r, "*/"];
}, rr = (a) => {
  const r = [a.target, a.meta.author, a.meta.pluginDesc, a.meta.url, "", ...a.dependencies.base, ...a.dependencies.orderBefore, ...a.dependencies.orderAfter, (t = a.dependencies, t.base.length > 0 || t.orderBefore.length > 0 || t.orderAfter.length > 0 ? "" : void 0), ...a.schema.commands.flatMap(tr), ...a.schema.params.flatMap(J)].filter((e) => e !== void 0);
  var t;
  return [`/*:${a.locale ?? ""}`, ...r, "*/"];
}, tr = (a) => [a.command, a.text, a.desc, ...a.args.flatMap(J)], J = (a) => [a.name, a.base.kind, a.base.desc, a.base.text, a.base.parent, ...a.attr, a.default, ""], br = (a) => [...a.body, ...a.structs.flatMap((r) => r)].join(`
`), vr = (a, r) => {
  const t = er(a, r);
  return { body: rr(t), structs: t.schema.structs.map(ar) };
}, er = (a, r) => {
  const t = a.locale ?? "";
  return {
    locale: t,
    schema: Ga(t, a.schema, r),
    target: o(na, a.target),
    meta: nr(a.meta),
    dependencies: sr(a.dependencies)
  };
}, sr = (a) => ({ base: a.base.map((r) => o(ca, r)), orderBefore: a.orderBefore.map((r) => o(oa, r)), orderAfter: a.orderAfter.map((r) => o(ma, r)) }), nr = (a) => {
  const r = a.author, t = a.plugindesc, e = a.url;
  return { author: r ? o(ia, r) : void 0, pluginDesc: t ? o(la, t) : void 0, url: e ? o(ua, e) : void 0 };
}, $r = ({ schema: a, pluginName: r }, t) => {
  const e = da(a, (s, n) => s.kind === "any" ? t(s, n) : s.kind === "string" || s.kind === "string[]");
  return mr(r, e);
}, mr = (a, r) => {
  const t = new Map(r.structs.map((e) => [e.struct, e]));
  return {
    pluginName: a,
    paramsPath: r.params.flatMap((e) => j(t, [e.name], e.attr, [])),
    commands: r.commands.map((e) => ({ commandName: e.command, argsPath: e.args.flatMap((s) => j(t, [s.name], s.attr, [])) }))
  };
}, j = (a, r, t, e) => t.kind === "struct" ? R(a, r, t.struct, e) : t.kind === "struct[]" ? R(a, [...r, "[]"], t.struct, e) : t.kind.endsWith("[]") ? [[...r, "[]"]] : [r], R = (a, r, t, e) => {
  if (e.includes(t)) return [r];
  const s = a.get(t);
  if (s === void 0) return [r];
  const n = [...e, t];
  return s.params.flatMap((m) => j(a, [...r, m.name], m.attr, n));
}, Sr = (a, r, t) => {
  const e = `${a.parameters[0]}:${a.parameters[1]}`, s = r.get(e);
  if (!s) return a;
  const n = B(a.parameters[3]), m = or(n, s.argsPath, t);
  return {
    code: a.code,
    indent: a.indent,
    parameters: [a.parameters[0], a.parameters[1], a.parameters[2], pa(m)]
  };
}, or = (a, r, t) => r.reduce((e, s) => {
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
  const n = a[e], m = s.length === 0 ? w(n, t) : T(n, s, t);
  return m === n ? a : Object.fromEntries(Object.entries(a).map(([c, u]) => [c, c === e ? m : u]));
};
export {
  Ja as buildCommandExtractors,
  Ra as buildParamExtractors,
  Ar as buildPluginValueExtractor,
  dr as compileCommandExtractorsFromPlugins,
  O as compilePluginCommandExtractor,
  ja as compilePluginCommandPairs,
  Pr as compilePluginParamExtractor,
  Ta as createPluginCommandExtractor,
  pr as createPluginCommandExtractorMap,
  mr as createPluginParamDictionary,
  fr as createPluginValueExtractor,
  x as createPluginValuesPath,
  xa as createPrimiteveParamPath,
  lr as createStructParamPath,
  $r as createTextParamDictionary,
  K as extractAllPluginValues,
  gr as extractArgsFromPluginCommand,
  ir as extractCommandArgsByKey,
  _ as extractPluginCommandArgs,
  Nr as extractPluginParamFromRecord,
  er as generatePluginAnnotation,
  vr as generatePluginAnnotationLines,
  br as generatePluginAnnotationText,
  Na as getPathFromStructArraySchema,
  ya as getPathFromStructParam,
  ur as getPathFromStructSchema,
  hr as isCommandArgValue,
  yr as ispluginParamValue,
  ga as makeScalarArrayPath,
  fa as makeScalarValuesPath,
  xr as mergeCommandMap,
  z as pluginComamndName,
  or as replacePluginValue,
  Sr as replaceRuntimePluginCommand
};
