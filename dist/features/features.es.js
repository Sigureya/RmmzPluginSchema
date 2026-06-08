import { N as aa, E as ra, C as ta, r as ea, A as sa, v as na, h as $, p as B, P as k, Q as D, R as ma, S as oa, T as ca, U as ua, V as la, W as ia, X as da, Y as pa, j as fa, K as I } from "../shared/structMap.es.js";
const ga = (a, r) => {
  if (a.length !== 0)
    return `${r}[${a.map((t) => `"${t.name}"`).join(",")}]`;
}, ha = (a, r) => a.map((t) => ({ path: `${r}["${t.name}"][*]`, param: t })), V = {
  undefinedStruct: "undefined_struct",
  cyclicStruct: "cyclic_struct"
};
function ya(a, r, t) {
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
        objectSchema: aa(u.scalars),
        name: d,
        scalarArrays: ha(u.scalarArrays, l),
        scalarsPath: u.scalars.length > 0 ? ga(u.scalars, l) : void 0
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
  }] }, n = Math.max(1, 3 * t.size + 5), m = Array.from({ length: n }).reduce((c) => c.frames.length === 0 ? c : ya(c, t, e), s);
  return { items: m.items, errors: m.errs };
}
const Pa = (a, r, t, e = V) => F(a.attr.struct, `${r}["${a.name}"]`, t, e), Na = (a, r, t, e = V) => F(a.attr.struct, `${r}["${a.name}"][*]`, t, e), ur = (a, r, t, e = V) => F(a, r, t, e), x = (a, r, t, e) => ra(t) ? K(a, t, e) : ta(t) ? ba(a, t, e) : ea(t) ? xa(a, r, t) : Aa(a, r, t), xa = (a, r, t) => ({
  rootCategory: a,
  rootName: r,
  scalars: { name: "", objectSchema: {}, scalarsPath: void 0, scalarArrays: [{ path: `$["${t.name}"][*]`, param: t }] },
  structs: { items: [], errors: [] },
  structArrays: {
    items: [],
    errors: []
  }
}), Aa = (a, r, t) => ({ rootCategory: a, rootName: r, scalars: { name: t.attr.kind, objectSchema: { [t.name]: t.attr }, scalarsPath: `$["${t.name}"]`, scalarArrays: [] }, structArrays: {
  items: [],
  errors: []
}, structs: { items: [], errors: [] } }), lr = (a, r, t) => K(a, r, t), K = (a, r, t) => ({
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structArrays: { items: [], errors: [] },
  structs: Pa(r, "$", t)
}), ba = (a, r, t) => ({
  structArrays: Na(r, "$", t),
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), va = (a, r, t, e) => r.filter((s) => typeof s == "number").map((s) => ({
  rootName: a.rootName,
  rootType: a.rootCategory,
  value: s,
  structName: t,
  param: e
})), $a = (a, r, t, e) => r.filter((s) => typeof s == "string").map((s) => ({ rootName: a.rootName, rootType: a.rootCategory, value: s, structName: t, param: e })), Sa = (a, r, t, e, s) => {
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
}, O = (a, r) => r.map((t) => ka(a, t)).flat(3), ka = (a, r) => [r.top ? C(r, a, r.top, "") : [], r.structs.map((t) => C(r, a, t)), r.structArrays.map((t) => C(r, a, t))], C = (a, r, t, e = t.bundleName) => {
  const s = t.scalar ? ((m, c, u, l, d) => l.pathSegments(u).map(({ value: i, segments: p }) => Sa(m, c, i, p, d)).filter((i) => i !== null))(a, e, r, t.scalar.jsonPathJS, t.scalar.record) : [], n = t.arrays.map((m) => ((c, u, l, d) => {
    const i = d.jsonPathJS.find(l);
    if (!Array.isArray(i)) return [];
    const p = d.schema.attr;
    return sa(p) ? $a(c, i, u, d.schema) : na(p) ? va(c, i, u, d.schema) : [];
  })(a, e, r, m));
  return [s, n].flat(2);
}, A = (a, r) => {
  const t = Ca(a, { createReader: (e) => r(e), errorAtPath() {
  } });
  if (t.errors.length > 0) throw t.errors[0].error;
  return t.extractor;
}, Ca = (a, r) => {
  const t = [], e = a.scalars ? E(a.scalars, "scalar", r, t) : void 0, s = a.structs.items.map((m) => E(m, "struct", r, t)), n = a.structArrays.items.map((m) => E(m, "structArray", r, t));
  return { extractor: {
    rootCategory: a.rootCategory,
    rootName: a.rootName,
    top: e,
    structs: s,
    structArrays: n
  }, errors: t };
}, E = (a, r, t, e) => {
  const s = Ea(a.scalarArrays, a.name, r, t, e);
  return a.scalarsPath ? {
    bundleName: a.name,
    arrays: s,
    scalar: Ma(a.scalarsPath, a.objectSchema, r, t, e)
  } : { bundleName: a.name, arrays: s };
}, Ea = (a, r, t, e, s) => a.flatMap((n) => {
  try {
    return [{
      jsonPathJS: e.createReader(n.path),
      schema: n.param,
      parentType: r
    }];
  } catch (m) {
    return s.push({ path: n.path, valType: t, error: m, handledInfo: e.errorAtPath(n.path, t, m) }), [];
  }
}), Ma = (a, r, t, e, s) => {
  try {
    return {
      jsonPathJS: e.createReader(a),
      record: r
    };
  } catch (n) {
    return void s.push({ path: a, valType: t, error: n, handledInfo: e.errorAtPath(a, t, n) });
  }
}, _ = (a, r, t, e) => ({
  pluginName: a,
  commandName: r.command,
  desc: r.desc ?? "",
  text: r.text ?? "",
  extractors: ja(r, t, e)
}), ja = (a, r, t) => a.args.map((e) => {
  const s = x("args", a.command, e, r);
  return A(s, t);
}), W = (a, r) => ({
  pluginName: r.pluginName,
  commandName: r.commandName,
  args: O(a, r.extractors)
}), ir = (a, r, t) => {
  const e = t.get(r);
  if (e) return W(a, e);
}, dr = (a, r) => new Map(a.flatMap((t) => Ta(t, r))), Ta = (a, r) => {
  const t = $(a.schema.structs);
  return a.schema.commands.map((e) => [`${a.pluginName}:${e.command}`, _(a.pluginName, e, t, r)]);
}, pr = (a, r) => {
  const t = a.flatMap((e) => Va(e, r));
  return new Map(t);
}, Va = (a, r) => {
  const t = $(a.schema.structs);
  return z(a.pluginName, a.schema.commands, t, r);
}, fr = (a, r, t) => {
  const e = $(r.structs);
  return { pluginName: a, params: Fa(r, e, t), commands: z(a, r.commands, e, t) };
}, Fa = (a, r, t) => a.params.map((e) => {
  const s = x("param", e.name, e, r);
  return A(s, t);
}), z = (a, r, t, e) => r.map((s) => [L(a, s.command), _(a, s, t, e)]), L = (a, r) => `${a}:${r}`, gr = (a, r, t, e = B) => {
  const s = { command: a, pluginName: a.parameters[0], commandName: a.parameters[1] }, n = L(a.parameters[0], a.parameters[1]), m = r.get(n);
  if (!m) return M(a, t.commandNotFoundError(s));
  try {
    const c = e(a.parameters[3]);
    return Ja(c, m, s, t);
  } catch (c) {
    return M(a, t.commandParseError(s, c));
  }
}, Ja = (a, r, t, e) => {
  try {
    return W(a, r);
  } catch (s) {
    return M(t.command, e.commandArgsError(t, s));
  }
}, M = (a, r) => ({
  pluginName: a.parameters[0],
  commandName: a.parameters[1],
  args: [],
  error: r
}), hr = (a) => a.rootType === "args", yr = (a) => a.rootType === "param", Pr = (a, r, t, e) => {
  const s = { pluginName: a.name, record: a };
  try {
    const n = t(a.parameters);
    return {
      pluginName: s.pluginName,
      params: O(n, r),
      errorKind: "",
      errorInfo: null
    };
  } catch (n) {
    return { pluginName: s.pluginName, errorKind: "parseError", errorInfo: e.pluginParamsParseError(s, n), params: [] };
  }
}, Nr = (a, r, t) => ({
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
  return { pluginName: a, commands: Ra(a, r.commands, n, t, s), params: wa(a, r.params, n, t, e) };
}, Ra = (a, r, t, e, s) => r.reduce((n, m) => {
  const c = ((u, l, d, i, p) => {
    const y = [], g = l.args.flatMap((P) => {
      const f = x("args", l.command, P, d);
      y.push(...((h, S, N, q, G) => {
        const H = { pluginName: h, commandName: S, argName: N };
        return q.map((Z) => G.commandStructPathError(H, Z));
      })(u, l.command, P.name, [...f.structs.errors, ...f.structArrays.errors], p));
      try {
        return [A(f, i)];
      } catch (h) {
        return y.push(p.commandCompileJSONPathSchemaError({ pluginName: u, commandName: l.command, argName: P.name }, h)), [];
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
}), wa = (a, r, t, e, s) => r.reduce((n, m) => {
  const c = ((u, l, d, i, p) => {
    const y = { pluginName: u, paramName: l.name }, g = x("param", "plugin", l, d), P = ((f, h, S) => h.map((N) => ({
      code: "paramStructPathError",
      source: "createPath",
      pluginName: f.pluginName,
      paramName: f.paramName,
      message: `Path error at "${N.path}": ${N.code}`,
      info: S.paramStructPathError(f, N)
    })))(y, [...g.structs.errors, ...g.structArrays.errors], p);
    try {
      return { extractor: A(g, i), errors: P };
    } catch (f) {
      const h = p.paramCompileJSONPathSchemaError(y, f);
      return { extractor: {
        rootCategory: g.rootCategory,
        rootName: g.rootName,
        top: void 0,
        structs: [],
        structArrays: []
      }, errors: [...P, h] };
    }
  })(a, m, t, e, s);
  return {
    extractors: [...n.extractors, c.extractor],
    errors: [...n.errors, ...c.errors]
  };
}, { extractors: [], errors: [] }), o = (a, r) => `@${a} ${r}`, b = (a, r) => {
  const t = a[r];
  return t === void 0 ? void 0 : o(r, String(t));
}, Q = (a, r, t) => {
  const e = o(r, a.name), s = Ba(a.attr), n = Da(a.attr, t);
  return n ? { name: e, base: s, default: n.default, attr: n.attr.filter((m) => m !== void 0) } : { name: e, base: s, default: void 0, attr: [] };
}, Ba = (a) => {
  return {
    kind: (r = a, r.kind === "struct" ? o(k, `struct<${r.struct}>`) : r.kind === "struct[]" ? o(k, `struct<${r.struct}>[]`) : o(k, r.kind)),
    desc: a.desc ? o("desc", a.desc) : void 0,
    text: a.text ? o("text", a.text) : void 0,
    parent: a.parent ? o("parent", a.parent) : void 0
  };
  var r;
}, Da = (a, r) => a.kind === "number" ? _a(a) : a.kind === "number[]" ? Wa(a, r) : a.kind === "file[]" ? Ua(a, r) : a.kind === "struct[]" ? Ga(a, r) : a.kind === "string[]" || a.kind === "multiline_string[]" ? za(a, r) : a.kind === "select" ? Xa(a) : a.kind === "combo" ? Ya(a) : a.kind === "file" ? Qa(a) : a.kind === "struct" ? qa(a, r) : a.kind === "boolean" ? Ia(a) : a.kind === "string" || a.kind === "any" || a.kind === "multiline_string" ? La(a) : typeof a.default == "number" ? Ka(a) : Oa(a, r), U = (a) => a === void 0 ? void 0 : o("default", a.toString()), Ia = (a) => ({
  attr: v.boolean.map((r) => b(a, r)),
  default: o("default", a.default ? "true" : "false")
}), Ka = (a) => ({ attr: [], default: U(a.default) }), Oa = (a, r) => {
  const t = r.numberArray(a.default);
  return {
    attr: [],
    default: o("default", t)
  };
}, _a = (a) => ({ attr: v.number.map((r) => b(a, r)), default: U(a.default) }), Wa = (a, r) => {
  const t = r.numberArray(a.default);
  return {
    attr: v.number.map((e) => b(a, e)),
    default: o("default", t)
  };
}, za = (a, r) => {
  const t = r.stringArray(a.default);
  return { attr: [], default: o("default", t) };
}, La = (a) => ({
  attr: [],
  default: o("default", a.default)
}), Qa = (a) => ({ attr: v.file.map((r) => b(a, r)), default: o("default", a.default) }), Ua = (a, r) => {
  const t = r.stringArray(a.default);
  return {
    attr: v.file.map((e) => b(a, e)),
    default: o("default", t)
  };
}, Xa = (a) => {
  return { attr: (r = a, r.options.flatMap((t) => [o(D, t.option), o(ma, t.value)])), default: o("default", a.default) };
  var r;
}, Ya = (a) => {
  return { attr: (r = a, r.options.map((t) => o(D, t))), default: o("default", a.default) };
  var r;
}, qa = (a, r) => {
  if (!a.default) return { attr: [], default: void 0 };
  const t = r.struct(a.default);
  return { attr: [], default: o("default", t) };
}, Ga = (a, r) => {
  if (!a.default) return { attr: [], default: o("default", "[]") };
  const t = r.structArray(a.default);
  return {
    attr: [],
    default: o("default", t)
  };
}, v = { number: ["min", "max", "decimals"], file: ["dir"], boolean: ["on", "off"] }, Ha = (a, r, t) => ({
  params: X(r.params, t),
  structs: r.structs.map((e) => Za(e, a, t)),
  commands: r.commands.map((e) => ar(e, t))
}), X = (a, r) => a.map((t) => Q(t, "param", r)), Za = (a, r, t) => ({ locale: r, struct: a.struct, params: X(a.params, t) }), ar = (a, r) => ({
  desc: a.desc ? o("desc", a.desc) : void 0,
  text: a.text ? o("text", a.text) : void 0,
  command: o("command", a.command),
  args: a.args.map((t) => Q(t, "arg", r))
}), rr = (a) => {
  const r = a.params.flatMap(J).filter((t) => t !== void 0);
  return [`/*~struct~${a.struct}:${a.locale ?? ""}`, ...r, "*/"];
}, tr = (a) => {
  const r = [a.target, a.meta.author, a.meta.pluginDesc, a.meta.url, "", ...a.dependencies.base, ...a.dependencies.orderBefore, ...a.dependencies.orderAfter, (t = a.dependencies, t.base.length > 0 || t.orderBefore.length > 0 || t.orderAfter.length > 0 ? "" : void 0), ...a.schema.commands.flatMap(er), ...a.schema.params.flatMap(J)].filter((e) => e !== void 0);
  var t;
  return [`/*:${a.locale ?? ""}`, ...r, "*/"];
}, er = (a) => [a.command, a.text, a.desc, ...a.args.flatMap(J)], J = (a) => [a.name, a.base.kind, a.base.desc, a.base.text, a.base.parent, ...a.attr, a.default, ""], br = (a) => [...a.body, ...a.structs.flatMap((r) => r)].join(`
`), vr = (a, r) => {
  const t = sr(a, r);
  return { body: tr(t), structs: t.schema.structs.map(rr) };
}, sr = (a, r) => {
  const t = a.locale ?? "";
  return {
    locale: t,
    schema: Ha(t, a.schema, r),
    target: o(oa, a.target),
    meta: mr(a.meta),
    dependencies: nr(a.dependencies)
  };
}, nr = (a) => ({ base: a.base.map((r) => o(la, r)), orderBefore: a.orderBefore.map((r) => o(ua, r)), orderAfter: a.orderAfter.map((r) => o(ca, r)) }), mr = (a) => {
  const r = a.author, t = a.plugindesc, e = a.url;
  return { author: r ? o(pa, r) : void 0, pluginDesc: t ? o(da, t) : void 0, url: e ? o(ia, e) : void 0 };
}, $r = ({ schema: a, pluginName: r }, t) => {
  const e = fa(a, (s, n) => s.kind === "any" ? t(s, n) : s.kind === "string" || s.kind === "string[]");
  return or(r, e);
}, or = (a, r) => {
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
  const n = B(a.parameters[3]), m = Y(n, s.argsPath, t);
  return {
    code: a.code,
    indent: a.indent,
    parameters: [a.parameters[0], a.parameters[1], a.parameters[2], I(m)]
  };
}, kr = (a, r, t) => {
  const e = Y(a.parameters, r.paramsPath, t);
  return {
    name: a.name,
    status: a.status,
    description: a.description,
    parameters: I(e)
  };
}, Y = (a, r, t) => r.reduce((e, s) => {
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
  Ra as buildCommandExtractors,
  wa as buildParamExtractors,
  Ar as buildPluginValueExtractor,
  dr as compileCommandExtractorsFromPlugins,
  _ as compilePluginCommandExtractor,
  Ta as compilePluginCommandPairs,
  Nr as compilePluginParamExtractor,
  Va as createPluginCommandExtractor,
  pr as createPluginCommandExtractorMap,
  or as createPluginParamDictionary,
  fr as createPluginValueExtractor,
  x as createPluginValuesPath,
  Aa as createPrimiteveParamPath,
  lr as createStructParamPath,
  $r as createTextParamDictionary,
  O as extractAllPluginValues,
  gr as extractArgsFromPluginCommand,
  ir as extractCommandArgsByKey,
  W as extractPluginCommandArgs,
  Pr as extractPluginParamFromRecord,
  sr as generatePluginAnnotation,
  vr as generatePluginAnnotationLines,
  br as generatePluginAnnotationText,
  Na as getPathFromStructArraySchema,
  Pa as getPathFromStructParam,
  ur as getPathFromStructSchema,
  hr as isCommandArgValue,
  yr as ispluginParamValue,
  ha as makeScalarArrayPath,
  ga as makeScalarValuesPath,
  xr as mergeCommandMap,
  L as pluginComamndName,
  kr as replacePluginParams,
  Y as replacePluginValue,
  Sr as replaceRuntimePluginCommand
};
