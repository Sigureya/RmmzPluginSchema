import { N as G, F as H, D as Z, r as aa, B as ta, w as ra, h as A, p as T, P as S, Q as R, R as ea, S as sa, T as na, U as ma, V as oa, W as ca, X as ua, Y as la, j as ia, s as D } from "../shared/structMap.es.js";
const da = (a, t) => {
  if (a.length !== 0)
    return `${t}[${a.map((r) => `"${r.name}"`).join(",")}]`;
}, pa = (a, t) => a.map((r) => ({ path: `${t}["${r.name}"][*]`, param: r })), F = {
  undefinedStruct: "undefined_struct",
  cyclicStruct: "cyclic_struct"
};
function ga(a, t, r) {
  if (a.frames.length === 0) return a;
  const e = a.frames[a.frames.length - 1], s = a.frames.slice(0, -1);
  if (e.ancestry.includes(e.schemaName)) return { frames: s, items: a.items, errs: [...a.errs, { code: r.cyclicStruct, path: e.basePath }] };
  const n = t.get(e.schemaName);
  if (!n) return {
    frames: s,
    items: a.items,
    errs: [...a.errs, { code: r.undefinedStruct, path: e.basePath }]
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
        objectSchema: G(u.scalars),
        name: d,
        scalarArrays: pa(u.scalarArrays, l),
        scalarsPath: u.scalars.length > 0 ? da(u.scalars, l) : void 0
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
function V(a, t, r, e) {
  const s = { items: [], errs: [], frames: [{
    schemaName: a,
    basePath: t,
    ancestry: []
  }] }, n = Math.max(1, 3 * r.size + 5), m = Array.from({ length: n }).reduce((o) => o.frames.length === 0 ? o : ga(o, r, e), s);
  return { items: m.items, errors: m.errs };
}
const fa = (a, t, r, e = F) => V(a.attr.struct, `${t}["${a.name}"]`, r, e), ha = (a, t, r, e = F) => V(a.attr.struct, `${t}["${a.name}"][*]`, r, e), ut = (a, t, r, e = F) => V(a, t, r, e), h = (a, t, r, e) => H(r) ? I(a, r, e) : Z(r) ? Pa(a, r, e) : aa(r) ? ya(a, t, r) : Na(a, t, r), ya = (a, t, r) => ({
  rootCategory: a,
  rootName: t,
  scalars: { name: "", objectSchema: {}, scalarsPath: void 0, scalarArrays: [{ path: `$["${r.name}"][*]`, param: r }] },
  structs: { items: [], errors: [] },
  structArrays: {
    items: [],
    errors: []
  }
}), Na = (a, t, r) => ({ rootCategory: a, rootName: t, scalars: { name: r.attr.kind, objectSchema: { [r.name]: r.attr }, scalarsPath: `$["${r.name}"]`, scalarArrays: [] }, structArrays: {
  items: [],
  errors: []
}, structs: { items: [], errors: [] } }), lt = (a, t, r) => I(a, t, r), I = (a, t, r) => ({
  rootName: t.name,
  rootCategory: a,
  scalars: void 0,
  structArrays: { items: [], errors: [] },
  structs: fa(t, "$", r)
}), Pa = (a, t, r) => ({
  structArrays: ha(t, "$", r),
  rootName: t.name,
  rootCategory: a,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), xa = (a, t, r, e) => t.filter((s) => typeof s == "number").map((s) => ({
  rootName: a.rootName,
  rootType: a.rootCategory,
  value: s,
  structName: r,
  param: e
})), ba = (a, t, r, e) => t.filter((s) => typeof s == "string").map((s) => ({ rootName: a.rootName, rootType: a.rootCategory, value: s, structName: r, param: e })), Aa = (a, t, r, e, s) => {
  if (typeof r == "object" || r === null) return null;
  const n = e[e.length - 1];
  if (typeof n == "number") return null;
  const m = s[n];
  return m ? {
    rootName: a.rootName,
    rootType: a.rootCategory,
    structName: t,
    value: r,
    param: { name: n, attr: m }
  } : null;
}, O = (a, t) => t.map((r) => va(a, r)).flat(3), va = (a, t) => [t.top ? C(t, a, t.top, "") : [], t.structs.map((r) => C(t, a, r)), t.structArrays.map((r) => C(t, a, r))], C = (a, t, r, e = r.bundleName) => {
  const s = r.scalar ? ((m, o, u, l, d) => l.pathSegments(u).map(({ value: i, segments: p }) => Aa(m, o, i, p, d)).filter((i) => i !== null))(a, e, t, r.scalar.jsonPathJS, r.scalar.record) : [], n = r.arrays.map((m) => ((o, u, l, d) => {
    const i = d.jsonPathJS.find(l);
    if (!Array.isArray(i)) return [];
    const p = d.schema.attr;
    return ta(p) ? ba(o, i, u, d.schema) : ra(p) ? xa(o, i, u, d.schema) : [];
  })(a, e, t, m));
  return [s, n].flat(2);
}, y = (a, t) => {
  const r = $a(a, { createReader: (e) => t(e), errorAtPath() {
  } });
  if (r.errors.length > 0) throw r.errors[0].error;
  return r.extractor;
}, $a = (a, t) => {
  const r = [], e = a.scalars ? k(a.scalars, "scalar", t, r) : void 0, s = a.structs.items.map((m) => k(m, "struct", t, r)), n = a.structArrays.items.map((m) => k(m, "structArray", t, r));
  return { extractor: {
    rootCategory: a.rootCategory,
    rootName: a.rootName,
    top: e,
    structs: s,
    structArrays: n
  }, errors: r };
}, k = (a, t, r, e) => {
  const s = Sa(a.scalarArrays, a.name, t, r, e);
  return a.scalarsPath ? {
    bundleName: a.name,
    arrays: s,
    scalar: Ca(a.scalarsPath, a.objectSchema, t, r, e)
  } : { bundleName: a.name, arrays: s };
}, Sa = (a, t, r, e, s) => a.flatMap((n) => {
  try {
    return [{
      jsonPathJS: e.createReader(n.path),
      schema: n.param,
      parentType: t
    }];
  } catch (m) {
    return s.push({ path: n.path, valType: r, error: m, handledInfo: e.errorAtPath(n.path, r, m) }), [];
  }
}), Ca = (a, t, r, e, s) => {
  try {
    return {
      jsonPathJS: e.createReader(a),
      record: t
    };
  } catch (n) {
    return void s.push({ path: a, valType: r, error: n, handledInfo: e.errorAtPath(a, r, n) });
  }
}, _ = (a, t, r, e) => ({
  pluginName: a,
  commandName: t.command,
  desc: t.desc ?? "",
  text: t.text ?? "",
  extractors: ka(t, r, e)
}), ka = (a, t, r) => a.args.map((e) => {
  const s = h("args", a.command, e, t);
  return y(s, r);
}), K = (a, t) => ({
  pluginName: t.pluginName,
  commandName: t.commandName,
  args: O(a, t.extractors)
}), it = (a, t, r) => {
  const e = r.get(t);
  if (e) return K(a, e);
}, dt = (a, t) => new Map(a.flatMap((r) => Ma(r, t))), Ma = (a, t) => {
  const r = A(a.schema.structs);
  return a.schema.commands.map((e) => [`${a.pluginName}:${e.command}`, _(a.pluginName, e, r, t)]);
}, pt = (a, t) => {
  const r = a.flatMap((e) => Ea(e, t));
  return new Map(r);
}, Ea = (a, t) => {
  const r = A(a.schema.structs);
  return W(a.pluginName, a.schema.commands, r, t);
}, gt = (a, t, r) => {
  const e = A(t.structs);
  return { pluginName: a, params: ja(t, e, r), commands: W(a, t.commands, e, r) };
}, ja = (a, t, r) => a.params.map((e) => {
  const s = h("param", e.name, e, t);
  return y(s, r);
}), W = (a, t, r, e) => t.map((s) => [z(a, s.command), _(a, s, r, e)]), z = (a, t) => `${a}:${t}`, Ta = (a, t, r, e = T) => {
  const s = { command: a, pluginName: a.parameters[0], commandName: a.parameters[1] }, n = z(a.parameters[0], a.parameters[1]), m = t.get(n);
  if (!m) return M(a, r.commandNotFoundError(s));
  try {
    const o = e(a.parameters[3]);
    return Fa(o, m, s, r);
  } catch (o) {
    return M(a, r.commandParseError(s, o));
  }
}, Fa = (a, t, r, e) => {
  try {
    return K(a, t);
  } catch (s) {
    return M(r.command, e.commandArgsError(r, s));
  }
}, M = (a, t) => ({ pluginName: a.parameters[0], commandName: a.parameters[1], args: [], error: t }), ft = (a) => {
  const t = a.plugins.flatMap((r) => r.commandExtractors.map((e) => [`${e.pluginName}:${e.commandName}`, e]));
  return new Map(t);
}, ht = (a, t, r, e = T) => {
  const s = Ta(a, t, r, e);
  return {
    pluginName: s.pluginName,
    commandName: s.commandName,
    args: s.args,
    error: s.error
  };
}, Va = (a, t, r, e, s) => {
  const n = [], m = t.args.flatMap((o) => {
    const u = h("args", t.command, o, r);
    n.push(...((l, d, i, p, x) => {
      const g = { pluginName: l, commandName: d, argName: i };
      return p.map((b) => x.commandStructPathError(g, b));
    })(a, t.command, o.name, [...u.structs.errors, ...u.structArrays.errors], s));
    try {
      return [y(u, e)];
    } catch (l) {
      return n.push(s.commandCompileJSONPathSchemaError({
        pluginName: a,
        commandName: t.command,
        argName: o.name
      }, l)), [];
    }
  });
  return { extractor: { pluginName: a, commandName: t.command, desc: t.desc ?? "", text: t.text ?? "", extractors: m }, errors: n };
}, yt = (a) => a.rootType === "args", Nt = (a) => a.rootType === "param", Pt = (a, t, r, e) => {
  const s = { pluginName: a.name, record: a };
  try {
    const n = r(a.parameters);
    return {
      pluginName: s.pluginName,
      params: O(n, t),
      errorKind: "",
      errorInfo: null
    };
  } catch (n) {
    return { pluginName: s.pluginName, errorKind: "parseError", errorInfo: e.pluginParamsParseError(s, n), params: [] };
  }
}, xt = (a, t, r) => ({
  pluginName: a.pluginName,
  extractors: a.schema.params.map((e) => {
    const s = h("param", "plugin", e, t);
    return y(s, r);
  })
}), bt = (a) => {
  const t = a.flatMap((r) => r.extractorEntries);
  return new Map(t);
}, At = (a, t, r, e, s) => {
  const n = A(t.structs);
  return { pluginName: a, commands: wa(a, t.commands, n, r, s), params: Ba(a, t.params, n, r, e) };
}, wa = (a, t, r, e, s) => t.reduce((n, m) => {
  const o = Va(a, m, r, e, s);
  return { extractors: [...n.extractors, o.extractor], errors: [...n.errors, ...o.errors] };
}, { extractors: [], errors: [] }), Ba = (a, t, r, e, s) => t.reduce((n, m) => {
  const o = ((u, l, d, i, p) => {
    const x = {
      pluginName: u,
      paramName: l.name
    }, g = h("param", "plugin", l, d), b = ((f, v, q) => v.map(($) => ({
      code: "paramStructPathError",
      source: "createPath",
      pluginName: f.pluginName,
      paramName: f.paramName,
      message: `Path error at "${$.path}": ${$.code}`,
      info: q.paramStructPathError(f, $)
    })))(x, [...g.structs.errors, ...g.structArrays.errors], p);
    try {
      return { extractor: y(g, i), errors: b };
    } catch (f) {
      const v = p.paramCompileJSONPathSchemaError(x, f);
      return { extractor: { rootCategory: g.rootCategory, rootName: g.rootName, top: void 0, structs: [], structArrays: [] }, errors: [...b, v] };
    }
  })(a, m, r, e, s);
  return { extractors: [...n.extractors, o.extractor], errors: [...n.errors, ...o.errors] };
}, { extractors: [], errors: [] }), c = (a, t) => `@${a} ${t}`, N = (a, t) => {
  const r = a[t];
  return r === void 0 ? void 0 : c(t, String(r));
}, L = (a, t, r) => {
  const e = c(t, a.name), s = Ja(a.attr), n = Ra(a.attr, r);
  return n ? {
    name: e,
    base: s,
    default: n.default,
    attr: n.attr.filter((m) => m !== void 0)
  } : { name: e, base: s, default: void 0, attr: [] };
}, Ja = (a) => {
  return {
    kind: (t = a, t.kind === "struct" ? c(S, `struct<${t.struct}>`) : t.kind === "struct[]" ? c(S, `struct<${t.struct}>[]`) : c(S, t.kind)),
    desc: a.desc ? c("desc", a.desc) : void 0,
    text: a.text ? c("text", a.text) : void 0,
    parent: a.parent ? c("parent", a.parent) : void 0
  };
  var t;
}, Ra = (a, t) => a.kind === "number" ? _a(a) : a.kind === "number[]" ? Ka(a, t) : a.kind === "file[]" ? Qa(a, t) : a.kind === "struct[]" ? qa(a, t) : a.kind === "string[]" || a.kind === "multiline_string[]" ? Wa(a, t) : a.kind === "select" ? Ua(a) : a.kind === "combo" ? Xa(a) : a.kind === "file" ? La(a) : a.kind === "struct" ? Ya(a, t) : a.kind === "boolean" ? Da(a) : a.kind === "string" || a.kind === "any" || a.kind === "multiline_string" ? za(a) : typeof a.default == "number" ? Ia(a) : Oa(a, t), Q = (a) => a === void 0 ? void 0 : c("default", a.toString()), Da = (a) => ({
  attr: P.boolean.map((t) => N(a, t)),
  default: c("default", a.default ? "true" : "false")
}), Ia = (a) => ({ attr: [], default: Q(a.default) }), Oa = (a, t) => {
  const r = t.numberArray(a.default);
  return {
    attr: [],
    default: c("default", r)
  };
}, _a = (a) => ({ attr: P.number.map((t) => N(a, t)), default: Q(a.default) }), Ka = (a, t) => {
  const r = t.numberArray(a.default);
  return {
    attr: P.number.map((e) => N(a, e)),
    default: c("default", r)
  };
}, Wa = (a, t) => {
  const r = t.stringArray(a.default);
  return { attr: [], default: c("default", r) };
}, za = (a) => ({
  attr: [],
  default: c("default", a.default)
}), La = (a) => ({ attr: P.file.map((t) => N(a, t)), default: c("default", a.default) }), Qa = (a, t) => {
  const r = t.stringArray(a.default);
  return {
    attr: P.file.map((e) => N(a, e)),
    default: c("default", r)
  };
}, Ua = (a) => {
  return { attr: (t = a, t.options.flatMap((r) => [c(R, r.option), c(ea, r.value)])), default: c("default", a.default) };
  var t;
}, Xa = (a) => {
  return { attr: (t = a, t.options.map((r) => c(R, r))), default: c("default", a.default) };
  var t;
}, Ya = (a, t) => {
  if (!a.default) return { attr: [], default: void 0 };
  const r = t.struct(a.default);
  return { attr: [], default: c("default", r) };
}, qa = (a, t) => {
  if (!a.default) return { attr: [], default: c("default", "[]") };
  const r = t.structArray(a.default);
  return {
    attr: [],
    default: c("default", r)
  };
}, P = { number: ["min", "max", "decimals"], file: ["dir"], boolean: ["on", "off"] }, Ga = (a, t, r) => ({
  params: U(t.params, r),
  structs: t.structs.map((e) => Ha(e, a, r)),
  commands: t.commands.map((e) => Za(e, r))
}), U = (a, t) => a.map((r) => L(r, "param", t)), Ha = (a, t, r) => ({ locale: t, struct: a.struct, params: U(a.params, r) }), Za = (a, t) => ({
  desc: a.desc ? c("desc", a.desc) : void 0,
  text: a.text ? c("text", a.text) : void 0,
  command: c("command", a.command),
  args: a.args.map((r) => L(r, "arg", t))
}), at = (a) => {
  const t = a.params.flatMap(w).filter((r) => r !== void 0);
  return [`/*~struct~${a.struct}:${a.locale ?? ""}`, ...t, "*/"];
}, tt = (a) => {
  const t = [a.target, a.meta.author, a.meta.pluginDesc, a.meta.url, "", ...a.dependencies.base, ...a.dependencies.orderBefore, ...a.dependencies.orderAfter, (r = a.dependencies, r.base.length > 0 || r.orderBefore.length > 0 || r.orderAfter.length > 0 ? "" : void 0), ...a.schema.commands.flatMap(rt), ...a.schema.params.flatMap(w)].filter((e) => e !== void 0);
  var r;
  return [`/*:${a.locale ?? ""}`, ...t, "*/"];
}, rt = (a) => [a.command, a.text, a.desc, ...a.args.flatMap(w)], w = (a) => [a.name, a.base.kind, a.base.desc, a.base.text, a.base.parent, ...a.attr, a.default, ""], vt = (a) => [...a.body, ...a.structs.flatMap((t) => t)].join(`
`), $t = (a, t) => {
  const r = et(a, t);
  return { body: tt(r), structs: r.schema.structs.map(at) };
}, et = (a, t) => {
  const r = a.locale ?? "";
  return {
    locale: r,
    schema: Ga(r, a.schema, t),
    target: c(sa, a.target),
    meta: nt(a.meta),
    dependencies: st(a.dependencies)
  };
}, st = (a) => ({ base: a.base.map((t) => c(oa, t)), orderBefore: a.orderBefore.map((t) => c(ma, t)), orderAfter: a.orderAfter.map((t) => c(na, t)) }), nt = (a) => {
  const t = a.author, r = a.plugindesc, e = a.url;
  return { author: t ? c(la, t) : void 0, pluginDesc: r ? c(ua, r) : void 0, url: e ? c(ca, e) : void 0 };
}, St = (a) => new Map(a.flatMap((t) => mt(t))), mt = (a) => a.commands.map((t) => [`${a.pluginName}:${t.commandName}`, { argsPath: t.argsPath }]), Ct = ({ schema: a, pluginName: t }, r) => {
  const e = ia(a, (s, n) => s.kind === "any" ? r(s, n) : s.kind === "string" || s.kind === "string[]");
  return ot(t, e);
}, ot = (a, t) => {
  const r = new Map(t.structs.map((e) => [e.struct, e]));
  return {
    pluginName: a,
    paramsPath: t.params.flatMap((e) => E(r, [e.name], e.attr, [])),
    commands: t.commands.map((e) => ({ commandName: e.command, argsPath: e.args.flatMap((s) => E(r, [s.name], s.attr, [])) }))
  };
}, E = (a, t, r, e) => r.kind === "struct" ? B(a, t, r.struct, e) : r.kind === "struct[]" ? B(a, [...t, "[]"], r.struct, e) : r.kind.endsWith("[]") ? [[...t, "[]"]] : [t], B = (a, t, r, e) => {
  if (e.includes(r)) return [t];
  const s = a.get(r);
  if (s === void 0) return [t];
  const n = [...e, r];
  return s.params.flatMap((m) => E(a, [...t, m.name], m.attr, n));
}, kt = (a, t, r) => {
  const e = `${a.parameters[0]}:${a.parameters[1]}`, s = t.get(e);
  if (!s) return a;
  const n = T(a.parameters[3]), m = X(n, s.argsPath, r);
  return {
    code: a.code,
    indent: a.indent,
    parameters: [a.parameters[0], a.parameters[1], a.parameters[2], D(m)]
  };
}, Mt = (a, t, r) => {
  const e = X(a.parameters, t.paramsPath, r);
  return {
    name: a.name,
    status: a.status,
    description: a.description,
    parameters: D(e)
  };
}, X = (a, t, r) => t.reduce((e, s) => {
  const n = j(e, s, r);
  return Y(n) ? n : e;
}, a), Y = (a) => a !== null && typeof a == "object" && !Array.isArray(a), J = (a, t) => typeof a == "string" ? t(a) ?? a : a, j = (a, t, r) => {
  if (t.length === 0) return a;
  const [e, ...s] = t;
  if (e === "[]") {
    if (!Array.isArray(a)) return a;
    const o = a.map((u) => s.length === 0 ? J(u, r) : j(u, s, r));
    return o.every((u, l) => u === a[l]) ? a : o;
  }
  if (!Y(a) || !(e in a)) return a;
  const n = a[e], m = s.length === 0 ? J(n, r) : j(n, s, r);
  return m === n ? a : Object.fromEntries(Object.entries(a).map(([o, u]) => [o, o === e ? m : u]));
};
export {
  wa as buildCommandExtractors,
  Ba as buildParamExtractors,
  At as buildPluginValueExtractor,
  Va as buildSingleCommand,
  dt as compileCommandExtractorsFromPlugins,
  _ as compilePluginCommandExtractor,
  Ma as compilePluginCommandPairs,
  xt as compilePluginParamExtractor,
  ft as createCommandExtractorMapFromPipeline,
  Ea as createPluginCommandExtractor,
  pt as createPluginCommandExtractorMap,
  St as createPluginCommandMap,
  ot as createPluginParamDictionary,
  gt as createPluginValueExtractor,
  h as createPluginValuesPath,
  Na as createPrimiteveParamPath,
  lt as createStructParamPath,
  Ct as createTextParamDictionary,
  O as extractAllPluginValues,
  Ta as extractArgsFromPluginCommand,
  it as extractCommandArgsByKey,
  K as extractPluginCommandArgs,
  ht as extractPluginCommandWithExtractor,
  Pt as extractPluginParamFromRecord,
  et as generatePluginAnnotation,
  $t as generatePluginAnnotationLines,
  vt as generatePluginAnnotationText,
  ha as getPathFromStructArraySchema,
  fa as getPathFromStructParam,
  ut as getPathFromStructSchema,
  yt as isCommandArgValue,
  Nt as ispluginParamValue,
  pa as makeScalarArrayPath,
  da as makeScalarValuesPath,
  bt as mergeCommandMap,
  z as pluginComamndName,
  Mt as replacePluginParams,
  X as replacePluginValue,
  kt as replaceRuntimePluginCommand
};
