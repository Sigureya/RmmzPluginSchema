import { F as Q, z as G, x as U, l as W, v as X, q as Y, f as $, p as Z, K as C, H as J, I as aa, J as ra, L as ta, M as ea, N as sa, O as na, P as oa, Q as ma } from "../shared/structMap.es.js";
const ca = (a, r) => {
  if (a.length !== 0)
    return `${r}[${a.map((t) => `"${t.name}"`).join(",")}]`;
}, ua = (a, r) => a.map((t) => ({ path: `${r}["${t.name}"][*]`, param: t })), j = {
  undefinedStruct: "undefined_struct",
  cyclicStruct: "cyclic_struct"
};
function la(a, r, t) {
  if (a.frames.length === 0) return a;
  const e = a.frames[a.frames.length - 1], s = a.frames.slice(0, -1);
  if (e.ancestry.includes(e.schemaName)) return { frames: s, items: a.items, errs: [...a.errs, { code: t.cyclicStruct, path: e.basePath }] };
  const n = r.get(e.schemaName);
  if (!n) return {
    frames: s,
    items: a.items,
    errs: [...a.errs, { code: t.undefinedStruct, path: e.basePath }]
  };
  const m = function(c, l) {
    const u = c.ancestry.concat(c.schemaName), i = c.basePath;
    return [...l.structs.map((d) => ({
      schemaName: d.attr.struct,
      basePath: `${i}["${d.name}"]`,
      ancestry: u
    })), ...l.structArrays.map((d) => ({ schemaName: d.attr.struct, basePath: `${i}["${d.name}"][*]`, ancestry: u }))].reverse();
  }(e, n);
  if (n.scalars.length > 0 || n.scalarArrays.length > 0) {
    const c = function(l, { path: u, structName: i }) {
      return {
        category: "struct",
        objectSchema: Q(l.scalars),
        name: i,
        scalarArrays: ua(l.scalarArrays, u),
        scalarsPath: l.scalars.length > 0 ? ca(l.scalars, u) : void 0
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
function T(a, r, t, e) {
  const s = { items: [], errs: [], frames: [{
    schemaName: a,
    basePath: r,
    ancestry: []
  }] }, n = Math.max(1, 3 * t.size + 5), m = Array.from({ length: n }).reduce((c) => c.frames.length === 0 ? c : la(c, t, e), s);
  return { items: m.items, errors: m.errs };
}
const da = (a, r, t, e = j) => T(a.attr.struct, `${r}["${a.name}"]`, t, e), ia = (a, r, t, e = j) => T(a.attr.struct, `${r}["${a.name}"][*]`, t, e), rr = (a, r, t, e = j) => T(a, r, t, e), x = (a, r, t, e) => G(t) ? V(a, t, e) : U(t) ? ga(a, t, e) : W(t) ? pa(a, r, t) : fa(a, r, t), pa = (a, r, t) => ({
  rootCategory: a,
  rootName: r,
  scalars: { name: "", objectSchema: {}, scalarsPath: void 0, scalarArrays: [{ path: `$["${t.name}"][*]`, param: t }] },
  structs: { items: [], errors: [] },
  structArrays: {
    items: [],
    errors: []
  }
}), fa = (a, r, t) => ({ rootCategory: a, rootName: r, scalars: { name: t.attr.kind, objectSchema: { [t.name]: t.attr }, scalarsPath: `$["${t.name}"]`, scalarArrays: [] }, structArrays: {
  items: [],
  errors: []
}, structs: { items: [], errors: [] } }), tr = (a, r, t) => V(a, r, t), V = (a, r, t) => ({
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structArrays: { items: [], errors: [] },
  structs: da(r, "$", t)
}), ga = (a, r, t) => ({
  structArrays: ia(r, "$", t),
  rootName: r.name,
  rootCategory: a,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), ha = (a, r, t, e) => r.filter((s) => typeof s == "number").map((s) => ({
  rootName: a.rootName,
  rootType: a.rootCategory,
  value: s,
  structName: t,
  param: e
})), ya = (a, r, t, e) => r.filter((s) => typeof s == "string").map((s) => ({ rootName: a.rootName, rootType: a.rootCategory, value: s, structName: t, param: e })), Na = (a, r, t, e, s) => {
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
}, B = (a, r) => r.map((t) => Pa(a, t)).flat(3), Pa = (a, r) => [r.top ? k(r, a, r.top, "") : [], r.structs.map((t) => k(r, a, t)), r.structArrays.map((t) => k(r, a, t))], k = (a, r, t, e = t.bundleName) => {
  const s = t.scalar ? ((m, c, l, u, i) => u.pathSegments(l).map(({ value: d, segments: p }) => Na(m, c, d, p, i)).filter((d) => d !== null))(a, e, r, t.scalar.jsonPathJS, t.scalar.record) : [], n = t.arrays.map((m) => ((c, l, u, i) => {
    const d = i.jsonPathJS.find(u);
    if (!Array.isArray(d)) return [];
    const p = i.schema.attr;
    return X(p) ? ya(c, d, l, i.schema) : Y(p) ? ha(c, d, l, i.schema) : [];
  })(a, e, r, m));
  return [s, n].flat(2);
}, b = (a, r) => {
  const t = xa(a, { createReader: (e) => r(e), errorAtPath() {
  } });
  if (t.errors.length > 0) throw t.errors[0].error;
  return t.extractor;
}, xa = (a, r) => {
  const t = [], e = a.scalars ? E(a.scalars, "scalar", r, t) : void 0, s = a.structs.items.map((m) => E(m, "struct", r, t)), n = a.structArrays.items.map((m) => E(m, "structArray", r, t));
  return { extractor: {
    rootCategory: a.rootCategory,
    rootName: a.rootName,
    top: e,
    structs: s,
    structArrays: n
  }, errors: t };
}, E = (a, r, t, e) => {
  const s = ba(a.scalarArrays, a.name, r, t, e);
  return a.scalarsPath ? {
    bundleName: a.name,
    arrays: s,
    scalar: Aa(a.scalarsPath, a.objectSchema, r, t, e)
  } : { bundleName: a.name, arrays: s };
}, ba = (a, r, t, e, s) => a.flatMap((n) => {
  try {
    return [{
      jsonPathJS: e.createReader(n.path),
      schema: n.param,
      parentType: r
    }];
  } catch (m) {
    return s.push({ path: n.path, valType: t, error: m, handledInfo: e.errorAtPath(n.path, t, m) }), [];
  }
}), Aa = (a, r, t, e, s) => {
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
  extractors: va(r, t, e)
}), va = (a, r, t) => a.args.map((e) => {
  const s = x("args", a.command, e, r);
  return b(s, t);
}), w = (a, r) => ({
  pluginName: r.pluginName,
  commandName: r.commandName,
  args: B(a, r.extractors)
}), er = (a, r, t) => {
  const e = t.get(r);
  if (e) return w(a, e);
}, sr = (a, r) => new Map(a.flatMap((t) => $a(t, r))), $a = (a, r) => {
  const t = $(a.schema.structs);
  return a.schema.commands.map((e) => [`${a.pluginName}:${e.command}`, I(a.pluginName, e, t, r)]);
}, nr = (a, r) => {
  const t = a.flatMap((e) => Sa(e, r));
  return new Map(t);
}, Sa = (a, r) => {
  const t = $(a.schema.structs);
  return K(a.pluginName, a.schema.commands, t, r);
}, or = (a, r, t) => {
  const e = $(r.structs);
  return { pluginName: a, params: Ca(r, e, t), commands: K(a, r.commands, e, t) };
}, Ca = (a, r, t) => a.params.map((e) => {
  const s = x("param", e.name, e, r);
  return b(s, t);
}), K = (a, r, t, e) => r.map((s) => [R(a, s.command), I(a, s, t, e)]), R = (a, r) => `${a}:${r}`, mr = (a, r, t, e = Z) => {
  const s = {
    command: a,
    pluginName: a.parameters[0],
    commandName: a.parameters[1]
  }, n = R(a.parameters[0], a.parameters[1]), m = r.get(n);
  if (!m) return M(a, t.commandNotFoundError(s));
  try {
    const c = e(a.parameters[3]);
    return ka(c, m, s, t);
  } catch (c) {
    return M(a, t.commandParseError(s, c));
  }
}, ka = (a, r, t, e) => {
  try {
    return w(a, r);
  } catch (s) {
    return M(t.command, e.commandArgsError(t, s));
  }
}, M = (a, r) => ({
  pluginName: a.parameters[0],
  commandName: a.parameters[1],
  args: [],
  error: r
}), cr = (a) => a.rootType === "args", ur = (a) => a.rootType === "param", lr = (a, r, t, e) => {
  const s = { pluginName: a.name, record: a };
  try {
    const n = t(a.parameters);
    return {
      pluginName: s.pluginName,
      params: B(n, r),
      errorKind: "",
      errorInfo: null
    };
  } catch (n) {
    return { pluginName: s.pluginName, errorKind: "parseError", errorInfo: e.pluginParamsParseError(s, n), params: [] };
  }
}, dr = (a, r, t) => ({
  pluginName: a.pluginName,
  extractors: a.schema.params.map((e) => {
    const s = x("param", "plugin", e, r);
    return b(s, t);
  })
}), ir = (a) => {
  const r = a.flatMap((t) => t.extractorEntries);
  return new Map(r);
}, pr = (a, r, t, e, s) => {
  const n = $(r.structs);
  return { pluginName: a, commands: Ea(a, r.commands, n, t, s), params: Ma(a, r.params, n, t, e) };
}, Ea = (a, r, t, e, s) => r.reduce((n, m) => {
  const c = ((l, u, i, d, p) => {
    const y = [], g = u.args.flatMap((N) => {
      const f = x("args", u.command, N, i);
      y.push(...((h, S, P, D, q) => {
        const H = { pluginName: h, commandName: S, argName: P };
        return D.map((L) => q.commandStructPathError(H, L));
      })(l, u.command, N.name, [...f.structs.errors, ...f.structArrays.errors], p));
      try {
        return [b(f, d)];
      } catch (h) {
        return y.push(p.commandCompileJSONPathSchemaError({ pluginName: l, commandName: u.command, argName: N.name }, h)), [];
      }
    });
    return { extractor: {
      pluginName: l,
      commandName: u.command,
      desc: u.desc ?? "",
      text: u.text ?? "",
      extractors: g
    }, errors: y };
  })(a, m, t, e, s);
  return { extractors: [...n.extractors, c.extractor], errors: [...n.errors, ...c.errors] };
}, {
  extractors: [],
  errors: []
}), Ma = (a, r, t, e, s) => r.reduce((n, m) => {
  const c = ((l, u, i, d, p) => {
    const y = { pluginName: l, paramName: u.name }, g = x("param", "plugin", u, i), N = ((f, h, S) => h.map((P) => ({
      code: "paramStructPathError",
      source: "createPath",
      pluginName: f.pluginName,
      paramName: f.paramName,
      message: `Path error at "${P.path}": ${P.code}`,
      info: S.paramStructPathError(f, P)
    })))(y, [...g.structs.errors, ...g.structArrays.errors], p);
    try {
      return { extractor: b(g, d), errors: N };
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
}, { extractors: [], errors: [] }), o = (a, r) => `@${a} ${r}`, A = (a, r) => {
  const t = a[r];
  return t === void 0 ? void 0 : o(r, String(t));
}, _ = (a, r, t) => {
  const e = o(r, a.name), s = ja(a.attr), n = Ta(a.attr, t);
  return n ? { name: e, base: s, default: n.default, attr: n.attr.filter((m) => m !== void 0) } : { name: e, base: s, default: void 0, attr: [] };
}, ja = (a) => {
  return {
    kind: (r = a, r.kind === "struct" ? o(C, `struct<${r.struct}>`) : r.kind === "struct[]" ? o(C, `struct<${r.struct}>[]`) : o(C, r.kind)),
    desc: a.desc ? o("desc", a.desc) : void 0,
    text: a.text ? o("text", a.text) : void 0,
    parent: a.parent ? o("parent", a.parent) : void 0
  };
  var r;
}, Ta = (a, r) => a.kind === "number" ? Ba(a) : a.kind === "number[]" ? Ia(a, r) : a.kind === "file[]" ? _a(a, r) : a.kind === "struct[]" ? qa(a, r) : a.kind === "string[]" || a.kind === "multiline_string[]" ? wa(a, r) : a.kind === "select" ? Oa(a) : a.kind === "combo" ? za(a) : a.kind === "file" ? Ra(a) : a.kind === "struct" ? Da(a, r) : a.kind === "boolean" ? Fa(a) : a.kind === "string" || a.kind === "any" || a.kind === "multiline_string" ? Ka(a) : typeof a.default == "number" ? Ja(a) : Va(a, r), O = (a) => a === void 0 ? void 0 : o("default", a.toString()), Fa = (a) => ({
  attr: v.boolean.map((r) => A(a, r)),
  default: o("default", a.default ? "true" : "false")
}), Ja = (a) => ({ attr: [], default: O(a.default) }), Va = (a, r) => {
  const t = r.numberArray(a.default);
  return {
    attr: [],
    default: o("default", t)
  };
}, Ba = (a) => ({ attr: v.number.map((r) => A(a, r)), default: O(a.default) }), Ia = (a, r) => {
  const t = r.numberArray(a.default);
  return {
    attr: v.number.map((e) => A(a, e)),
    default: o("default", t)
  };
}, wa = (a, r) => {
  const t = r.stringArray(a.default);
  return { attr: [], default: o("default", t) };
}, Ka = (a) => ({
  attr: [],
  default: o("default", a.default)
}), Ra = (a) => ({ attr: v.file.map((r) => A(a, r)), default: o("default", a.default) }), _a = (a, r) => {
  const t = r.stringArray(a.default);
  return {
    attr: v.file.map((e) => A(a, e)),
    default: o("default", t)
  };
}, Oa = (a) => {
  return { attr: (r = a, r.options.flatMap((t) => [o(J, t.option), o(aa, t.value)])), default: o("default", a.default) };
  var r;
}, za = (a) => {
  return { attr: (r = a, r.options.map((t) => o(J, t))), default: o("default", a.default) };
  var r;
}, Da = (a, r) => {
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
}, v = { number: ["min", "max", "decimals"], file: ["dir"], boolean: ["on", "off"] }, Ha = (a, r, t) => ({
  params: z(r.params, t),
  structs: r.structs.map((e) => La(e, a, t)),
  commands: r.commands.map((e) => Qa(e, t))
}), z = (a, r) => a.map((t) => _(t, "param", r)), La = (a, r, t) => ({ locale: r, struct: a.struct, params: z(a.params, t) }), Qa = (a, r) => ({
  desc: a.desc ? o("desc", a.desc) : void 0,
  text: a.text ? o("text", a.text) : void 0,
  command: o("command", a.command),
  args: a.args.map((t) => _(t, "arg", r))
}), Ga = (a) => {
  const r = a.params.flatMap(F).filter((t) => t !== void 0);
  return [`/*~struct~${a.struct}:${a.locale ?? ""}`, ...r, "*/"];
}, Ua = (a) => {
  const r = [a.target, a.meta.author, a.meta.pluginDesc, a.meta.url, "", ...a.dependencies.base, ...a.dependencies.orderBefore, ...a.dependencies.orderAfter, (t = a.dependencies, t.base.length > 0 || t.orderBefore.length > 0 || t.orderAfter.length > 0 ? "" : void 0), ...a.schema.commands.flatMap(Wa), ...a.schema.params.flatMap(F)].filter((e) => e !== void 0);
  var t;
  return [`/*:${a.locale ?? ""}`, ...r, "*/"];
}, Wa = (a) => [a.command, a.text, a.desc, ...a.args.flatMap(F)], F = (a) => [a.name, a.base.kind, a.base.desc, a.base.text, a.base.parent, ...a.attr, a.default, ""], fr = (a) => [...a.body, ...a.structs.flatMap((r) => r)].join(`
`), gr = (a, r) => {
  const t = Xa(a, r);
  return { body: Ua(t), structs: t.schema.structs.map(Ga) };
}, Xa = (a, r) => {
  const t = a.locale ?? "";
  return {
    locale: t,
    schema: Ha(t, a.schema, r),
    target: o(ra, a.target),
    meta: Za(a.meta),
    dependencies: Ya(a.dependencies)
  };
}, Ya = (a) => ({ base: a.base.map((r) => o(sa, r)), orderBefore: a.orderBefore.map((r) => o(ea, r)), orderAfter: a.orderAfter.map((r) => o(ta, r)) }), Za = (a) => {
  const r = a.author, t = a.plugindesc, e = a.url;
  return { author: r ? o(ma, r) : void 0, pluginDesc: t ? o(oa, t) : void 0, url: e ? o(na, e) : void 0 };
};
export {
  Ea as buildCommandExtractors,
  Ma as buildParamExtractors,
  pr as buildPluginValueExtractor,
  sr as compileCommandExtractorsFromPlugins,
  I as compilePluginCommandExtractor,
  $a as compilePluginCommandPairs,
  dr as compilePluginParamExtractor,
  Sa as createPluginCommandExtractor,
  nr as createPluginCommandExtractorMap,
  or as createPluginValueExtractor,
  x as createPluginValuesPath,
  fa as createPrimiteveParamPath,
  tr as createStructParamPath,
  B as extractAllPluginValues,
  mr as extractArgsFromPluginCommand,
  er as extractCommandArgsByKey,
  w as extractPluginCommandArgs,
  lr as extractPluginParamFromRecord,
  Xa as generatePluginAnnotation,
  gr as generatePluginAnnotationLines,
  fr as generatePluginAnnotationText,
  ia as getPathFromStructArraySchema,
  da as getPathFromStructParam,
  rr as getPathFromStructSchema,
  cr as isCommandArgValue,
  ur as ispluginParamValue,
  ua as makeScalarArrayPath,
  ca as makeScalarValuesPath,
  ir as mergeCommandMap,
  R as pluginComamndName
};
