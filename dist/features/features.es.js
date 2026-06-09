import { N as ta, F as ra, D as ea, r as sa, B as na, w as ma, h as $, p as R, P as k, Q as D, R as oa, S as ca, T as ua, U as la, V as ia, W as da, X as pa, Y as fa, j as ga, s as I } from "../shared/structMap.es.js";
const ha = (a, t) => {
  if (a.length !== 0)
    return `${t}[${a.map((r) => `"${r.name}"`).join(",")}]`;
}, ya = (a, t) => a.map((r) => ({ path: `${t}["${r.name}"][*]`, param: r })), V = {
  undefinedStruct: "undefined_struct",
  cyclicStruct: "cyclic_struct"
};
function Pa(a, t, r) {
  if (a.frames.length === 0) return a;
  const e = a.frames[a.frames.length - 1], s = a.frames.slice(0, -1);
  if (e.ancestry.includes(e.schemaName)) return { frames: s, items: a.items, errs: [...a.errs, { code: r.cyclicStruct, path: e.basePath }] };
  const n = t.get(e.schemaName);
  if (!n) return {
    frames: s,
    items: a.items,
    errs: [...a.errs, { code: r.undefinedStruct, path: e.basePath }]
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
        objectSchema: ta(u.scalars),
        name: d,
        scalarArrays: ya(u.scalarArrays, l),
        scalarsPath: u.scalars.length > 0 ? ha(u.scalars, l) : void 0
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
function F(a, t, r, e) {
  const s = { items: [], errs: [], frames: [{
    schemaName: a,
    basePath: t,
    ancestry: []
  }] }, n = Math.max(1, 3 * r.size + 5), m = Array.from({ length: n }).reduce((c) => c.frames.length === 0 ? c : Pa(c, r, e), s);
  return { items: m.items, errors: m.errs };
}
const Na = (a, t, r, e = V) => F(a.attr.struct, `${t}["${a.name}"]`, r, e), xa = (a, t, r, e = V) => F(a.attr.struct, `${t}["${a.name}"][*]`, r, e), it = (a, t, r, e = V) => F(a, t, r, e), x = (a, t, r, e) => ra(r) ? O(a, r, e) : ea(r) ? va(a, r, e) : sa(r) ? Aa(a, t, r) : ba(a, t, r), Aa = (a, t, r) => ({
  rootCategory: a,
  rootName: t,
  scalars: { name: "", objectSchema: {}, scalarsPath: void 0, scalarArrays: [{ path: `$["${r.name}"][*]`, param: r }] },
  structs: { items: [], errors: [] },
  structArrays: {
    items: [],
    errors: []
  }
}), ba = (a, t, r) => ({ rootCategory: a, rootName: t, scalars: { name: r.attr.kind, objectSchema: { [r.name]: r.attr }, scalarsPath: `$["${r.name}"]`, scalarArrays: [] }, structArrays: {
  items: [],
  errors: []
}, structs: { items: [], errors: [] } }), dt = (a, t, r) => O(a, t, r), O = (a, t, r) => ({
  rootName: t.name,
  rootCategory: a,
  scalars: void 0,
  structArrays: { items: [], errors: [] },
  structs: Na(t, "$", r)
}), va = (a, t, r) => ({
  structArrays: xa(t, "$", r),
  rootName: t.name,
  rootCategory: a,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), $a = (a, t, r, e) => t.filter((s) => typeof s == "number").map((s) => ({
  rootName: a.rootName,
  rootType: a.rootCategory,
  value: s,
  structName: r,
  param: e
})), Sa = (a, t, r, e) => t.filter((s) => typeof s == "string").map((s) => ({ rootName: a.rootName, rootType: a.rootCategory, value: s, structName: r, param: e })), ka = (a, t, r, e, s) => {
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
}, _ = (a, t) => t.map((r) => Ca(a, r)).flat(3), Ca = (a, t) => [t.top ? C(t, a, t.top, "") : [], t.structs.map((r) => C(t, a, r)), t.structArrays.map((r) => C(t, a, r))], C = (a, t, r, e = r.bundleName) => {
  const s = r.scalar ? ((m, c, u, l, d) => l.pathSegments(u).map(({ value: i, segments: p }) => ka(m, c, i, p, d)).filter((i) => i !== null))(a, e, t, r.scalar.jsonPathJS, r.scalar.record) : [], n = r.arrays.map((m) => ((c, u, l, d) => {
    const i = d.jsonPathJS.find(l);
    if (!Array.isArray(i)) return [];
    const p = d.schema.attr;
    return na(p) ? Sa(c, i, u, d.schema) : ma(p) ? $a(c, i, u, d.schema) : [];
  })(a, e, t, m));
  return [s, n].flat(2);
}, A = (a, t) => {
  const r = Ma(a, { createReader: (e) => t(e), errorAtPath() {
  } });
  if (r.errors.length > 0) throw r.errors[0].error;
  return r.extractor;
}, Ma = (a, t) => {
  const r = [], e = a.scalars ? M(a.scalars, "scalar", t, r) : void 0, s = a.structs.items.map((m) => M(m, "struct", t, r)), n = a.structArrays.items.map((m) => M(m, "structArray", t, r));
  return { extractor: {
    rootCategory: a.rootCategory,
    rootName: a.rootName,
    top: e,
    structs: s,
    structArrays: n
  }, errors: r };
}, M = (a, t, r, e) => {
  const s = Ea(a.scalarArrays, a.name, t, r, e);
  return a.scalarsPath ? {
    bundleName: a.name,
    arrays: s,
    scalar: ja(a.scalarsPath, a.objectSchema, t, r, e)
  } : { bundleName: a.name, arrays: s };
}, Ea = (a, t, r, e, s) => a.flatMap((n) => {
  try {
    return [{
      jsonPathJS: e.createReader(n.path),
      schema: n.param,
      parentType: t
    }];
  } catch (m) {
    return s.push({ path: n.path, valType: r, error: m, handledInfo: e.errorAtPath(n.path, r, m) }), [];
  }
}), ja = (a, t, r, e, s) => {
  try {
    return {
      jsonPathJS: e.createReader(a),
      record: t
    };
  } catch (n) {
    return void s.push({ path: a, valType: r, error: n, handledInfo: e.errorAtPath(a, r, n) });
  }
}, K = (a, t, r, e) => ({
  pluginName: a,
  commandName: t.command,
  desc: t.desc ?? "",
  text: t.text ?? "",
  extractors: Ta(t, r, e)
}), Ta = (a, t, r) => a.args.map((e) => {
  const s = x("args", a.command, e, t);
  return A(s, r);
}), W = (a, t) => ({
  pluginName: t.pluginName,
  commandName: t.commandName,
  args: _(a, t.extractors)
}), pt = (a, t, r) => {
  const e = r.get(t);
  if (e) return W(a, e);
}, ft = (a, t) => new Map(a.flatMap((r) => Va(r, t))), Va = (a, t) => {
  const r = $(a.schema.structs);
  return a.schema.commands.map((e) => [`${a.pluginName}:${e.command}`, K(a.pluginName, e, r, t)]);
}, gt = (a, t) => {
  const r = a.flatMap((e) => Fa(e, t));
  return new Map(r);
}, Fa = (a, t) => {
  const r = $(a.schema.structs);
  return z(a.pluginName, a.schema.commands, r, t);
}, ht = (a, t, r) => {
  const e = $(t.structs);
  return { pluginName: a, params: wa(t, e, r), commands: z(a, t.commands, e, r) };
}, wa = (a, t, r) => a.params.map((e) => {
  const s = x("param", e.name, e, t);
  return A(s, r);
}), z = (a, t, r, e) => t.map((s) => [L(a, s.command), K(a, s, r, e)]), L = (a, t) => `${a}:${t}`, yt = (a, t, r, e = R) => {
  const s = { command: a, pluginName: a.parameters[0], commandName: a.parameters[1] }, n = L(a.parameters[0], a.parameters[1]), m = t.get(n);
  if (!m) return E(a, r.commandNotFoundError(s));
  try {
    const c = e(a.parameters[3]);
    return Ba(c, m, s, r);
  } catch (c) {
    return E(a, r.commandParseError(s, c));
  }
}, Ba = (a, t, r, e) => {
  try {
    return W(a, t);
  } catch (s) {
    return E(r.command, e.commandArgsError(r, s));
  }
}, E = (a, t) => ({
  pluginName: a.parameters[0],
  commandName: a.parameters[1],
  args: [],
  error: t
}), Pt = (a) => a.rootType === "args", Nt = (a) => a.rootType === "param", xt = (a, t, r, e) => {
  const s = { pluginName: a.name, record: a };
  try {
    const n = r(a.parameters);
    return {
      pluginName: s.pluginName,
      params: _(n, t),
      errorKind: "",
      errorInfo: null
    };
  } catch (n) {
    return { pluginName: s.pluginName, errorKind: "parseError", errorInfo: e.pluginParamsParseError(s, n), params: [] };
  }
}, At = (a, t, r) => ({
  pluginName: a.pluginName,
  extractors: a.schema.params.map((e) => {
    const s = x("param", "plugin", e, t);
    return A(s, r);
  })
}), bt = (a) => {
  const t = a.flatMap((r) => r.extractorEntries);
  return new Map(t);
}, vt = (a, t, r, e, s) => {
  const n = $(t.structs);
  return { pluginName: a, commands: Ja(a, t.commands, n, r, s), params: Ra(a, t.params, n, r, e) };
}, Ja = (a, t, r, e, s) => t.reduce((n, m) => {
  const c = ((u, l, d, i, p) => {
    const y = [], g = l.args.flatMap((P) => {
      const f = x("args", l.command, P, d);
      y.push(...((h, S, N, G, H) => {
        const Z = { pluginName: h, commandName: S, argName: N };
        return G.map((aa) => H.commandStructPathError(Z, aa));
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
  })(a, m, r, e, s);
  return { extractors: [...n.extractors, c.extractor], errors: [...n.errors, ...c.errors] };
}, {
  extractors: [],
  errors: []
}), Ra = (a, t, r, e, s) => t.reduce((n, m) => {
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
  })(a, m, r, e, s);
  return {
    extractors: [...n.extractors, c.extractor],
    errors: [...n.errors, ...c.errors]
  };
}, { extractors: [], errors: [] }), o = (a, t) => `@${a} ${t}`, b = (a, t) => {
  const r = a[t];
  return r === void 0 ? void 0 : o(t, String(r));
}, Q = (a, t, r) => {
  const e = o(t, a.name), s = Da(a.attr), n = Ia(a.attr, r);
  return n ? { name: e, base: s, default: n.default, attr: n.attr.filter((m) => m !== void 0) } : { name: e, base: s, default: void 0, attr: [] };
}, Da = (a) => {
  return {
    kind: (t = a, t.kind === "struct" ? o(k, `struct<${t.struct}>`) : t.kind === "struct[]" ? o(k, `struct<${t.struct}>[]`) : o(k, t.kind)),
    desc: a.desc ? o("desc", a.desc) : void 0,
    text: a.text ? o("text", a.text) : void 0,
    parent: a.parent ? o("parent", a.parent) : void 0
  };
  var t;
}, Ia = (a, t) => a.kind === "number" ? Wa(a) : a.kind === "number[]" ? za(a, t) : a.kind === "file[]" ? Xa(a, t) : a.kind === "struct[]" ? Ha(a, t) : a.kind === "string[]" || a.kind === "multiline_string[]" ? La(a, t) : a.kind === "select" ? Ya(a) : a.kind === "combo" ? qa(a) : a.kind === "file" ? Ua(a) : a.kind === "struct" ? Ga(a, t) : a.kind === "boolean" ? Oa(a) : a.kind === "string" || a.kind === "any" || a.kind === "multiline_string" ? Qa(a) : typeof a.default == "number" ? _a(a) : Ka(a, t), U = (a) => a === void 0 ? void 0 : o("default", a.toString()), Oa = (a) => ({
  attr: v.boolean.map((t) => b(a, t)),
  default: o("default", a.default ? "true" : "false")
}), _a = (a) => ({ attr: [], default: U(a.default) }), Ka = (a, t) => {
  const r = t.numberArray(a.default);
  return {
    attr: [],
    default: o("default", r)
  };
}, Wa = (a) => ({ attr: v.number.map((t) => b(a, t)), default: U(a.default) }), za = (a, t) => {
  const r = t.numberArray(a.default);
  return {
    attr: v.number.map((e) => b(a, e)),
    default: o("default", r)
  };
}, La = (a, t) => {
  const r = t.stringArray(a.default);
  return { attr: [], default: o("default", r) };
}, Qa = (a) => ({
  attr: [],
  default: o("default", a.default)
}), Ua = (a) => ({ attr: v.file.map((t) => b(a, t)), default: o("default", a.default) }), Xa = (a, t) => {
  const r = t.stringArray(a.default);
  return {
    attr: v.file.map((e) => b(a, e)),
    default: o("default", r)
  };
}, Ya = (a) => {
  return { attr: (t = a, t.options.flatMap((r) => [o(D, r.option), o(oa, r.value)])), default: o("default", a.default) };
  var t;
}, qa = (a) => {
  return { attr: (t = a, t.options.map((r) => o(D, r))), default: o("default", a.default) };
  var t;
}, Ga = (a, t) => {
  if (!a.default) return { attr: [], default: void 0 };
  const r = t.struct(a.default);
  return { attr: [], default: o("default", r) };
}, Ha = (a, t) => {
  if (!a.default) return { attr: [], default: o("default", "[]") };
  const r = t.structArray(a.default);
  return {
    attr: [],
    default: o("default", r)
  };
}, v = { number: ["min", "max", "decimals"], file: ["dir"], boolean: ["on", "off"] }, Za = (a, t, r) => ({
  params: X(t.params, r),
  structs: t.structs.map((e) => at(e, a, r)),
  commands: t.commands.map((e) => tt(e, r))
}), X = (a, t) => a.map((r) => Q(r, "param", t)), at = (a, t, r) => ({ locale: t, struct: a.struct, params: X(a.params, r) }), tt = (a, t) => ({
  desc: a.desc ? o("desc", a.desc) : void 0,
  text: a.text ? o("text", a.text) : void 0,
  command: o("command", a.command),
  args: a.args.map((r) => Q(r, "arg", t))
}), rt = (a) => {
  const t = a.params.flatMap(w).filter((r) => r !== void 0);
  return [`/*~struct~${a.struct}:${a.locale ?? ""}`, ...t, "*/"];
}, et = (a) => {
  const t = [a.target, a.meta.author, a.meta.pluginDesc, a.meta.url, "", ...a.dependencies.base, ...a.dependencies.orderBefore, ...a.dependencies.orderAfter, (r = a.dependencies, r.base.length > 0 || r.orderBefore.length > 0 || r.orderAfter.length > 0 ? "" : void 0), ...a.schema.commands.flatMap(st), ...a.schema.params.flatMap(w)].filter((e) => e !== void 0);
  var r;
  return [`/*:${a.locale ?? ""}`, ...t, "*/"];
}, st = (a) => [a.command, a.text, a.desc, ...a.args.flatMap(w)], w = (a) => [a.name, a.base.kind, a.base.desc, a.base.text, a.base.parent, ...a.attr, a.default, ""], $t = (a) => [...a.body, ...a.structs.flatMap((t) => t)].join(`
`), St = (a, t) => {
  const r = nt(a, t);
  return { body: et(r), structs: r.schema.structs.map(rt) };
}, nt = (a, t) => {
  const r = a.locale ?? "";
  return {
    locale: r,
    schema: Za(r, a.schema, t),
    target: o(ca, a.target),
    meta: ot(a.meta),
    dependencies: mt(a.dependencies)
  };
}, mt = (a) => ({ base: a.base.map((t) => o(ia, t)), orderBefore: a.orderBefore.map((t) => o(la, t)), orderAfter: a.orderAfter.map((t) => o(ua, t)) }), ot = (a) => {
  const t = a.author, r = a.plugindesc, e = a.url;
  return { author: t ? o(fa, t) : void 0, pluginDesc: r ? o(pa, r) : void 0, url: e ? o(da, e) : void 0 };
}, kt = (a) => new Map(a.flatMap((t) => ct(t))), ct = (a) => a.commands.map((t) => [`${a.pluginName}:${t.commandName}`, { argsPath: t.argsPath }]), Ct = ({ schema: a, pluginName: t }, r) => {
  const e = ga(a, (s, n) => s.kind === "any" ? r(s, n) : s.kind === "string" || s.kind === "string[]");
  return ut(t, e);
}, ut = (a, t) => {
  const r = new Map(t.structs.map((e) => [e.struct, e]));
  return {
    pluginName: a,
    paramsPath: t.params.flatMap((e) => j(r, [e.name], e.attr, [])),
    commands: t.commands.map((e) => ({ commandName: e.command, argsPath: e.args.flatMap((s) => j(r, [s.name], s.attr, [])) }))
  };
}, j = (a, t, r, e) => r.kind === "struct" ? B(a, t, r.struct, e) : r.kind === "struct[]" ? B(a, [...t, "[]"], r.struct, e) : r.kind.endsWith("[]") ? [[...t, "[]"]] : [t], B = (a, t, r, e) => {
  if (e.includes(r)) return [t];
  const s = a.get(r);
  if (s === void 0) return [t];
  const n = [...e, r];
  return s.params.flatMap((m) => j(a, [...t, m.name], m.attr, n));
}, Mt = (a, t, r) => {
  const e = `${a.parameters[0]}:${a.parameters[1]}`, s = t.get(e);
  if (!s) return a;
  const n = R(a.parameters[3]), m = Y(n, s.argsPath, r);
  return {
    code: a.code,
    indent: a.indent,
    parameters: [a.parameters[0], a.parameters[1], a.parameters[2], I(m)]
  };
}, Et = (a, t, r) => {
  const e = Y(a.parameters, t.paramsPath, r);
  return {
    name: a.name,
    status: a.status,
    description: a.description,
    parameters: I(e)
  };
}, Y = (a, t, r) => t.reduce((e, s) => {
  const n = T(e, s, r);
  return q(n) ? n : e;
}, a), q = (a) => a !== null && typeof a == "object" && !Array.isArray(a), J = (a, t) => typeof a == "string" ? t(a) ?? a : a, T = (a, t, r) => {
  if (t.length === 0) return a;
  const [e, ...s] = t;
  if (e === "[]") {
    if (!Array.isArray(a)) return a;
    const c = a.map((u) => s.length === 0 ? J(u, r) : T(u, s, r));
    return c.every((u, l) => u === a[l]) ? a : c;
  }
  if (!q(a) || !(e in a)) return a;
  const n = a[e], m = s.length === 0 ? J(n, r) : T(n, s, r);
  return m === n ? a : Object.fromEntries(Object.entries(a).map(([c, u]) => [c, c === e ? m : u]));
};
export {
  Ja as buildCommandExtractors,
  Ra as buildParamExtractors,
  vt as buildPluginValueExtractor,
  ft as compileCommandExtractorsFromPlugins,
  K as compilePluginCommandExtractor,
  Va as compilePluginCommandPairs,
  At as compilePluginParamExtractor,
  Fa as createPluginCommandExtractor,
  gt as createPluginCommandExtractorMap,
  kt as createPluginCommandMap,
  ut as createPluginParamDictionary,
  ht as createPluginValueExtractor,
  x as createPluginValuesPath,
  ba as createPrimiteveParamPath,
  dt as createStructParamPath,
  Ct as createTextParamDictionary,
  _ as extractAllPluginValues,
  yt as extractArgsFromPluginCommand,
  pt as extractCommandArgsByKey,
  W as extractPluginCommandArgs,
  xt as extractPluginParamFromRecord,
  nt as generatePluginAnnotation,
  St as generatePluginAnnotationLines,
  $t as generatePluginAnnotationText,
  xa as getPathFromStructArraySchema,
  Na as getPathFromStructParam,
  it as getPathFromStructSchema,
  Pt as isCommandArgValue,
  Nt as ispluginParamValue,
  ya as makeScalarArrayPath,
  ha as makeScalarValuesPath,
  bt as mergeCommandMap,
  L as pluginComamndName,
  Et as replacePluginParams,
  Y as replacePluginValue,
  Mt as replaceRuntimePluginCommand
};
