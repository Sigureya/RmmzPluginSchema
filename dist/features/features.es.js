import { N as ta, F as ea, D as sa, r as na, B as ma, w as oa, h as b, p as F, P as S, Q as O, R as ca, K as C, S as ua, T as la, U as ia, V as da, W as pa, X as ga, Y as fa, j as ha, s as I } from "../shared/structMap.es.js";
const ya = (a, r) => {
  if (a.length !== 0)
    return `${r}[${a.map((t) => `"${t.name}"`).join(",")}]`;
}, Na = (a, r) => a.map((t) => ({ path: `${r}["${t.name}"][*]`, param: t })), V = {
  undefinedStruct: "undefined_struct",
  cyclicStruct: "cyclic_struct"
};
function Pa(a, r, t) {
  if (a.frames.length === 0) return a;
  const e = a.frames[a.frames.length - 1], s = a.frames.slice(0, -1);
  if (e.ancestry.includes(e.schemaName)) return { frames: s, items: a.items, errs: [...a.errs, { code: t.cyclicStruct, path: e.basePath }] };
  const n = r.get(e.schemaName);
  if (!n) return {
    frames: s,
    items: a.items,
    errs: [...a.errs, { code: t.undefinedStruct, path: e.basePath }]
  };
  const m = function(o, u) {
    const l = o.ancestry.concat(o.schemaName), d = o.basePath;
    return [...u.structs.map((i) => ({
      schemaName: i.attr.struct,
      basePath: `${d}["${i.name}"]`,
      ancestry: l
    })), ...u.structArrays.map((i) => ({ schemaName: i.attr.struct, basePath: `${d}["${i.name}"][*]`, ancestry: l }))].reverse();
  }(e, n);
  if (n.scalars.length > 0 || n.scalarArrays.length > 0) {
    const o = function(u, { path: l, structName: d }) {
      return {
        category: "struct",
        objectSchema: ta(u.scalars),
        name: d,
        scalarArrays: Na(u.scalarArrays, l),
        scalarsPath: u.scalars.length > 0 ? ya(u.scalars, l) : void 0
      };
    }(n, { path: e.basePath, structName: e.schemaName });
    return s.push(...m), {
      frames: s,
      items: [...a.items, o],
      errs: a.errs
    };
  }
  return s.push(...m), { frames: s, items: a.items, errs: a.errs };
}
function w(a, r, t, e) {
  const s = { items: [], errs: [], frames: [{
    schemaName: a,
    basePath: r,
    ancestry: []
  }] }, n = Math.max(1, 3 * t.size + 5), m = Array.from({ length: n }).reduce((o) => o.frames.length === 0 ? o : Pa(o, t, e), s);
  return { items: m.items, errors: m.errs };
}
const xa = (a, r, t, e = V) => w(a.attr.struct, `${r}["${a.name}"]`, t, e), Aa = (a, r, t, e = V) => w(a.attr.struct, `${r}["${a.name}"][*]`, t, e), ir = (a, r, t, e = V) => w(a, r, t, e), h = (a, r, t, e) => ea(t) ? K(a, t, e) : sa(t) ? $a(a, t, e) : na(t) ? ba(a, r, t) : va(a, r, t), ba = (a, r, t) => ({
  rootCategory: a,
  rootName: r,
  scalars: { name: "", objectSchema: {}, scalarsPath: void 0, scalarArrays: [{ path: `$["${t.name}"][*]`, param: t }] },
  structs: { items: [], errors: [] },
  structArrays: {
    items: [],
    errors: []
  }
}), va = (a, r, t) => ({ rootCategory: a, rootName: r, scalars: { name: t.attr.kind, objectSchema: { [t.name]: t.attr }, scalarsPath: `$["${t.name}"]`, scalarArrays: [] }, structArrays: {
  items: [],
  errors: []
}, structs: { items: [], errors: [] } }), dr = (a, r, t) => K(a, r, t), K = (a, r, t) => ({
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structArrays: { items: [], errors: [] },
  structs: xa(r, "$", t)
}), $a = (a, r, t) => ({
  structArrays: Aa(r, "$", t),
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), Sa = (a, r, t, e) => r.filter((s) => typeof s == "number").map((s) => ({
  rootName: a.rootName,
  rootType: a.rootCategory,
  value: s,
  structName: t,
  param: e
})), Ca = (a, r, t, e) => r.filter((s) => typeof s == "string").map((s) => ({ rootName: a.rootName, rootType: a.rootCategory, value: s, structName: t, param: e })), ka = (a, r, t, e, s) => {
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
}, _ = (a, r) => r.map((t) => Ma(a, t)).flat(3), Ma = (a, r) => [r.top ? k(r, a, r.top, "") : [], r.structs.map((t) => k(r, a, t)), r.structArrays.map((t) => k(r, a, t))], k = (a, r, t, e = t.bundleName) => {
  const s = t.scalar ? ((m, o, u, l, d) => l.pathSegments(u).map(({ value: i, segments: p }) => ka(m, o, i, p, d)).filter((i) => i !== null))(a, e, r, t.scalar.jsonPathJS, t.scalar.record) : [], n = t.arrays.map((m) => ((o, u, l, d) => {
    const i = d.jsonPathJS.find(l);
    if (!Array.isArray(i)) return [];
    const p = d.schema.attr;
    return ma(p) ? Ca(o, i, u, d.schema) : oa(p) ? Sa(o, i, u, d.schema) : [];
  })(a, e, r, m));
  return [s, n].flat(2);
}, y = (a, r) => {
  const t = Ea(a, { createReader: (e) => r(e), errorAtPath() {
  } });
  if (t.errors.length > 0) throw t.errors[0].error;
  return t.extractor;
}, Ea = (a, r) => {
  const t = [], e = a.scalars ? M(a.scalars, "scalar", r, t) : void 0, s = a.structs.items.map((m) => M(m, "struct", r, t)), n = a.structArrays.items.map((m) => M(m, "structArray", r, t));
  return { extractor: {
    rootCategory: a.rootCategory,
    rootName: a.rootName,
    top: e,
    structs: s,
    structArrays: n
  }, errors: t };
}, M = (a, r, t, e) => {
  const s = ja(a.scalarArrays, a.name, r, t, e);
  return a.scalarsPath ? {
    bundleName: a.name,
    arrays: s,
    scalar: Ta(a.scalarsPath, a.objectSchema, r, t, e)
  } : { bundleName: a.name, arrays: s };
}, ja = (a, r, t, e, s) => a.flatMap((n) => {
  try {
    return [{
      jsonPathJS: e.createReader(n.path),
      schema: n.param,
      parentType: r
    }];
  } catch (m) {
    return s.push({ path: n.path, valType: t, error: m, handledInfo: e.errorAtPath(n.path, t, m) }), [];
  }
}), Ta = (a, r, t, e, s) => {
  try {
    return {
      jsonPathJS: e.createReader(a),
      record: r
    };
  } catch (n) {
    return void s.push({ path: a, valType: t, error: n, handledInfo: e.errorAtPath(a, t, n) });
  }
}, W = (a, r, t, e) => ({
  pluginName: a,
  commandName: r.command,
  desc: r.desc ?? "",
  text: r.text ?? "",
  extractors: Fa(r, t, e)
}), Fa = (a, r, t) => a.args.map((e) => {
  const s = h("args", a.command, e, r);
  return y(s, t);
}), z = (a, r) => ({
  pluginName: r.pluginName,
  commandName: r.commandName,
  args: _(a, r.extractors)
}), pr = (a, r, t) => {
  const e = t.get(r);
  if (e) return z(a, e);
}, gr = (a, r) => new Map(a.flatMap((t) => Va(t, r))), Va = (a, r) => {
  const t = b(a.schema.structs);
  return a.schema.commands.map((e) => [`${a.pluginName}:${e.command}`, W(a.pluginName, e, t, r)]);
}, fr = (a, r) => {
  const t = a.flatMap((e) => wa(e, r));
  return new Map(t);
}, wa = (a, r) => {
  const t = b(a.schema.structs);
  return H(a.pluginName, a.schema.commands, t, r);
}, hr = (a, r, t) => {
  const e = b(r.structs);
  return { pluginName: a, params: Ja(r, e, t), commands: H(a, r.commands, e, t) };
}, Ja = (a, r, t) => a.params.map((e) => {
  const s = h("param", e.name, e, r);
  return y(s, t);
}), H = (a, r, t, e) => r.map((s) => [L(a, s.command), W(a, s, t, e)]), L = (a, r) => `${a}:${r}`, Ba = (a, r, t, e = F) => {
  const s = { command: a, pluginName: a.parameters[0], commandName: a.parameters[1] }, n = L(a.parameters[0], a.parameters[1]), m = r.get(n);
  if (!m) return E(a, t.commandNotFoundError(s));
  try {
    const o = e(a.parameters[3]);
    return Da(o, m, s, t);
  } catch (o) {
    return E(a, t.commandParseError(s, o));
  }
}, Da = (a, r, t, e) => {
  try {
    return z(a, r);
  } catch (s) {
    return E(t.command, e.commandArgsError(t, s));
  }
}, E = (a, r) => ({ pluginName: a.parameters[0], commandName: a.parameters[1], args: [], error: r }), yr = (a) => {
  const r = a.plugins.flatMap((t) => t.commandExtractors.map((e) => [`${e.pluginName}:${e.commandName}`, e]));
  return new Map(r);
}, Nr = (a, r, t, e = F) => {
  const s = Ba(a, r, t, e);
  return {
    pluginName: s.pluginName,
    commandName: s.commandName,
    args: s.args,
    error: s.error
  };
}, Ra = (a, r, t, e, s) => {
  const n = [], m = r.args.flatMap((o) => {
    const u = h("args", r.command, o, t);
    n.push(...((l, d, i, p, x) => {
      const g = { pluginName: l, commandName: d, argName: i };
      return p.map((A) => x.commandStructPathError(g, A));
    })(a, r.command, o.name, [...u.structs.errors, ...u.structArrays.errors], s));
    try {
      return [y(u, e)];
    } catch (l) {
      return n.push(s.commandCompileJSONPathSchemaError({
        pluginName: a,
        commandName: r.command,
        argName: o.name
      }, l)), [];
    }
  });
  return { extractor: { pluginName: a, commandName: r.command, desc: r.desc ?? "", text: r.text ?? "", extractors: m }, errors: n };
}, Pr = (a) => a.rootType === "args", xr = (a) => a.rootType === "param", Ar = (a, r, t, e) => {
  const s = { pluginName: a.name, record: a };
  try {
    const n = t(a.parameters);
    return {
      pluginName: s.pluginName,
      params: _(n, r),
      errorKind: "",
      errorInfo: null
    };
  } catch (n) {
    return { pluginName: s.pluginName, errorKind: "parseError", errorInfo: e.pluginParamsParseError(s, n), params: [] };
  }
}, br = (a, r, t) => ({
  pluginName: a.pluginName,
  extractors: a.schema.params.map((e) => {
    const s = h("param", "plugin", e, r);
    return y(s, t);
  })
}), vr = (a) => {
  const r = a.flatMap((t) => t.extractorEntries);
  return new Map(r);
}, $r = (a, r, t, e, s) => {
  const n = b(r.structs);
  return { pluginName: a, commands: Oa(a, r.commands, n, t, s), params: Ia(a, r.params, n, t, e) };
}, Oa = (a, r, t, e, s) => r.reduce((n, m) => {
  const o = Ra(a, m, t, e, s);
  return { extractors: [...n.extractors, o.extractor], errors: [...n.errors, ...o.errors] };
}, { extractors: [], errors: [] }), Ia = (a, r, t, e, s) => r.reduce((n, m) => {
  const o = ((u, l, d, i, p) => {
    const x = {
      pluginName: u,
      paramName: l.name
    }, g = h("param", "plugin", l, d), A = ((f, v, ra) => v.map(($) => ({
      code: "paramStructPathError",
      source: "createPath",
      pluginName: f.pluginName,
      paramName: f.paramName,
      message: `Path error at "${$.path}": ${$.code}`,
      info: ra.paramStructPathError(f, $)
    })))(x, [...g.structs.errors, ...g.structArrays.errors], p);
    try {
      return { extractor: y(g, i), errors: A };
    } catch (f) {
      const v = p.paramCompileJSONPathSchemaError(x, f);
      return { extractor: { rootCategory: g.rootCategory, rootName: g.rootName, top: void 0, structs: [], structArrays: [] }, errors: [...A, v] };
    }
  })(a, m, t, e, s);
  return { extractors: [...n.extractors, o.extractor], errors: [...n.errors, ...o.errors] };
}, { extractors: [], errors: [] }), c = (a, r) => `@${a} ${r}`, N = (a, r) => {
  const t = a[r];
  return t === void 0 ? void 0 : c(r, String(t));
}, Q = (a, r, t) => {
  const e = c(r, a.name), s = Ka(a.attr), n = _a(a.attr, t);
  return n ? {
    name: e,
    base: s,
    default: n.default,
    attr: n.attr.filter((m) => m !== void 0)
  } : { name: e, base: s, default: void 0, attr: [] };
}, Ka = (a) => {
  return {
    kind: (r = a, r.kind === "struct" ? c(S, `struct<${r.struct}>`) : r.kind === "struct[]" ? c(S, `struct<${r.struct}>[]`) : c(S, r.kind)),
    desc: a.desc ? c("desc", a.desc) : void 0,
    text: a.text ? c("text", a.text) : void 0,
    parent: a.parent ? c("parent", a.parent) : void 0
  };
  var r;
}, _a = (a, r) => a.kind === "number" ? La(a) : a.kind === "number[]" ? Qa(a, r) : a.kind === "file[]" ? qa(a, r) : a.kind === "struct[]" ? rr(a, r) : a.kind === "string[]" || a.kind === "multiline_string[]" ? Ua(a, r) : a.kind === "select" ? Ga(a) : a.kind === "combo" ? Za(a) : a.kind === "file" ? Ya(a) : a.kind === "struct" ? ar(a, r) : a.kind === "boolean" ? Wa(a) : a.kind === "string" || a.kind === "any" || a.kind === "multiline_string" ? Xa(a) : typeof a.default == "number" ? za(a) : Ha(a, r), U = (a) => a === void 0 ? void 0 : c("default", a.toString()), Wa = (a) => ({
  attr: P.boolean.map((r) => N(a, r)),
  default: c("default", a.default ? "true" : "false")
}), za = (a) => ({ attr: [], default: U(a.default) }), Ha = (a, r) => {
  const t = r.numberArray(a.default);
  return {
    attr: [],
    default: c("default", t)
  };
}, La = (a) => ({ attr: P.number.map((r) => N(a, r)), default: U(a.default) }), Qa = (a, r) => {
  const t = r.numberArray(a.default);
  return {
    attr: P.number.map((e) => N(a, e)),
    default: c("default", t)
  };
}, Ua = (a, r) => {
  const t = r.stringArray(a.default);
  return { attr: [], default: c("default", t) };
}, Xa = (a) => ({
  attr: [],
  default: c("default", a.default)
}), Ya = (a) => ({ attr: P.file.map((r) => N(a, r)), default: c("default", a.default) }), qa = (a, r) => {
  const t = r.stringArray(a.default);
  return {
    attr: P.file.map((e) => N(a, e)),
    default: c("default", t)
  };
}, Ga = (a) => {
  return { attr: (r = a, r.options.flatMap((t) => [c(O, t.option), c(ca, t.value)])), default: c("default", a.default) };
  var r;
}, Za = (a) => {
  return { attr: (r = a, r.options.map((t) => c(O, t))), default: c("default", a.default) };
  var r;
}, ar = (a, r) => {
  if (!a.default) return { attr: [], default: void 0 };
  const t = r.struct(a.default);
  return { attr: [], default: c("default", t) };
}, rr = (a, r) => {
  if (!a.default) return { attr: [], default: c("default", "[]") };
  const t = r.structArray(a.default);
  return {
    attr: [],
    default: c("default", t)
  };
}, P = { number: ["min", "max", "decimals"], file: ["dir"], boolean: ["on", "off"] }, tr = (a, r, t) => ({
  params: X(r.params, t),
  structs: r.structs.map((e) => er(e, a, t)),
  commands: r.commands.map((e) => sr(e, t))
}), X = (a, r) => a.map((t) => Q(t, "param", r)), er = (a, r, t) => ({ locale: r, struct: a.struct, params: X(a.params, t) }), sr = (a, r) => ({
  desc: a.desc ? c("desc", a.desc) : void 0,
  text: a.text ? c("text", a.text) : void 0,
  command: c("command", a.command),
  args: a.args.map((t) => Q(t, "arg", r))
}), Y = (a) => {
  const r = a.params.flatMap(J).filter((t) => t !== void 0);
  return [`/*~struct~${a.struct}:${a.locale ?? ""}`, ...r, "*/"];
}, q = (a) => {
  const r = [a.target, a.meta.author, a.meta.pluginDesc, a.meta.url, "", ...a.dependencies.base, ...a.dependencies.orderBefore, ...a.dependencies.orderAfter, (t = a.dependencies, t.base.length > 0 || t.orderBefore.length > 0 || t.orderAfter.length > 0 ? "" : void 0), ...a.schema.commands.flatMap(nr), ...a.schema.params.flatMap(J)].filter((e) => e !== void 0);
  var t;
  return [`/*:${a.locale ?? ""}`, ...r, "*/"];
}, nr = (a) => [a.command, a.text, a.desc, ...a.args.flatMap(J)], J = (a) => [a.name, a.base.kind, a.base.desc, a.base.text, a.base.parent, ...a.attr, a.default, ""], B = () => ({
  structArray: (a) => C(a),
  struct: (a) => C(a),
  numberArray: (a) => C(a),
  stringArray: (a) => JSON.stringify(a)
}), Sr = (a, r = B()) => {
  const t = G(a, r);
  return [...q(t), ...t.schema.structs.map(Y).flat()].join(`
`);
}, Cr = (a, r = B()) => {
  const t = G(a, r);
  return { body: q(t), structs: t.schema.structs.map(Y) };
}, G = (a, r = B()) => {
  const t = a.locale ?? "";
  return {
    locale: t,
    schema: tr(t, a.schema, r),
    target: c(ua, a.target),
    meta: or(a.meta),
    dependencies: mr(a.dependencies)
  };
}, mr = (a) => ({
  base: a.base.map((r) => c(da, r)),
  orderBefore: a.orderBefore.map((r) => c(ia, r)),
  orderAfter: a.orderAfter.map((r) => c(la, r))
}), or = (a) => {
  const r = a.author, t = a.plugindesc, e = a.url;
  return { author: r ? c(fa, r) : void 0, pluginDesc: t ? c(ga, t) : void 0, url: e ? c(pa, e) : void 0 };
}, kr = (a) => new Map(a.flatMap((r) => cr(r))), cr = (a) => a.commands.map((r) => [`${a.pluginName}:${r.commandName}`, { argsPath: r.argsPath }]), Mr = ({ schema: a, pluginName: r }, t) => {
  const e = ha(a, (s, n) => s.kind === "any" ? t(s, n) : s.kind === "string" || s.kind === "string[]");
  return ur(r, e);
}, ur = (a, r) => {
  const t = new Map(r.structs.map((e) => [e.struct, e]));
  return {
    pluginName: a,
    paramsPath: r.params.flatMap((e) => j(t, [e.name], e.attr, [])),
    commands: r.commands.map((e) => ({ commandName: e.command, argsPath: e.args.flatMap((s) => j(t, [s.name], s.attr, [])) }))
  };
}, j = (a, r, t, e) => t.kind === "struct" ? D(a, r, t.struct, e) : t.kind === "struct[]" ? D(a, [...r, "[]"], t.struct, e) : t.kind.endsWith("[]") ? [[...r, "[]"]] : [r], D = (a, r, t, e) => {
  if (e.includes(t)) return [r];
  const s = a.get(t);
  if (s === void 0) return [r];
  const n = [...e, t];
  return s.params.flatMap((m) => j(a, [...r, m.name], m.attr, n));
}, Er = (a, r, t) => {
  const e = `${a.parameters[0]}:${a.parameters[1]}`, s = r.get(e);
  if (!s) return a;
  const n = F(a.parameters[3]), m = Z(n, s.argsPath, t);
  return {
    code: a.code,
    indent: a.indent,
    parameters: [a.parameters[0], a.parameters[1], a.parameters[2], I(m)]
  };
}, jr = (a, r, t) => {
  const e = Z(a.parameters, r.paramsPath, t);
  return {
    name: a.name,
    status: a.status,
    description: a.description,
    parameters: I(e)
  };
}, Z = (a, r, t) => r.reduce((e, s) => {
  const n = T(e, s, t);
  return aa(n) ? n : e;
}, a), aa = (a) => a !== null && typeof a == "object" && !Array.isArray(a), R = (a, r) => typeof a == "string" ? r(a) ?? a : a, T = (a, r, t) => {
  if (r.length === 0) return a;
  const [e, ...s] = r;
  if (e === "[]") {
    if (!Array.isArray(a)) return a;
    const o = a.map((u) => s.length === 0 ? R(u, t) : T(u, s, t));
    return o.every((u, l) => u === a[l]) ? a : o;
  }
  if (!aa(a) || !(e in a)) return a;
  const n = a[e], m = s.length === 0 ? R(n, t) : T(n, s, t);
  return m === n ? a : Object.fromEntries(Object.entries(a).map(([o, u]) => [o, o === e ? m : u]));
};
export {
  Oa as buildCommandExtractors,
  Ia as buildParamExtractors,
  $r as buildPluginValueExtractor,
  Ra as buildSingleCommand,
  gr as compileCommandExtractorsFromPlugins,
  W as compilePluginCommandExtractor,
  Va as compilePluginCommandPairs,
  br as compilePluginParamExtractor,
  yr as createCommandExtractorMapFromPipeline,
  B as createDeepStringifyHandlers,
  wa as createPluginCommandExtractor,
  fr as createPluginCommandExtractorMap,
  kr as createPluginCommandMap,
  ur as createPluginParamDictionary,
  hr as createPluginValueExtractor,
  h as createPluginValuesPath,
  va as createPrimiteveParamPath,
  dr as createStructParamPath,
  Mr as createTextParamDictionary,
  _ as extractAllPluginValues,
  Ba as extractArgsFromPluginCommand,
  pr as extractCommandArgsByKey,
  z as extractPluginCommandArgs,
  Nr as extractPluginCommandWithExtractor,
  Ar as extractPluginParamFromRecord,
  Cr as generatePluginAnnotationLines,
  Sr as generatePluginAnnotationText,
  G as generatePluginAnnotationTokens,
  Aa as getPathFromStructArraySchema,
  xa as getPathFromStructParam,
  ir as getPathFromStructSchema,
  Pr as isCommandArgValue,
  xr as ispluginParamValue,
  Na as makeScalarArrayPath,
  ya as makeScalarValuesPath,
  vr as mergeCommandMap,
  L as pluginComamndName,
  jr as replacePluginParams,
  Z as replacePluginValue,
  Er as replaceRuntimePluginCommand
};
