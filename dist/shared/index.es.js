import { F as G, z as U, x as V, l as W, v as X, q as Y, f as P, p as Z, K as k, H as w, I as tt, J as at, L as rt, M as et, N as st, O as nt, P as ot, Q as mt } from "./structMap.es.js";
const ct = (t, a) => {
  if (t.length !== 0)
    return `${a}[${t.map((r) => `"${r.name}"`).join(",")}]`;
}, ut = (t, a) => t.map((r) => ({ path: `${a}["${r.name}"][*]`, param: r })), E = {
  undefinedStruct: "undefined_struct",
  cyclicStruct: "cyclic_struct"
};
function dt(t, a, r) {
  if (t.frames.length === 0) return t;
  const e = t.frames[t.frames.length - 1], s = t.frames.slice(0, -1);
  if (e.ancestry.includes(e.schemaName)) return { frames: s, items: t.items, errs: [...t.errs, { code: r.cyclicStruct, path: e.basePath }] };
  const n = a.get(e.schemaName);
  if (!n) return {
    frames: s,
    items: t.items,
    errs: [...t.errs, { code: r.undefinedStruct, path: e.basePath }]
  };
  const m = function(c, d) {
    const u = c.ancestry.concat(c.schemaName), p = c.basePath;
    return [...d.structs.map((l) => ({
      schemaName: l.attr.struct,
      basePath: `${p}["${l.name}"]`,
      ancestry: u
    })), ...d.structArrays.map((l) => ({ schemaName: l.attr.struct, basePath: `${p}["${l.name}"][*]`, ancestry: u }))].reverse();
  }(e, n);
  if (n.scalars.length > 0 || n.scalarArrays.length > 0) {
    const c = function(d, { path: u, structName: p }) {
      return {
        category: "struct",
        objectSchema: G(d.scalars),
        name: p,
        scalarArrays: ut(d.scalarArrays, u),
        scalarsPath: d.scalars.length > 0 ? ct(d.scalars, u) : void 0
      };
    }(n, { path: e.basePath, structName: e.schemaName });
    return s.push(...m), {
      frames: s,
      items: [...t.items, c],
      errs: t.errs
    };
  }
  return s.push(...m), { frames: s, items: t.items, errs: t.errs };
}
function T(t, a, r, e) {
  const s = { items: [], errs: [], frames: [{
    schemaName: t,
    basePath: a,
    ancestry: []
  }] }, n = Math.max(1, 3 * r.size + 5), m = Array.from({ length: n }).reduce((c) => c.frames.length === 0 ? c : dt(c, r, e), s);
  return { items: m.items, errors: m.errs };
}
const lt = (t, a, r, e = E) => T(t.attr.struct, `${a}["${t.name}"]`, r, e), pt = (t, a, r, e = E) => T(t.attr.struct, `${a}["${t.name}"][*]`, r, e), ra = (t, a, r, e = E) => T(t, a, r, e), v = (t, a, r, e) => U(r) ? B(t, r, e) : V(r) ? ht(t, r, e) : W(r) ? it(t, a, r) : ft(t, a, r), it = (t, a, r) => ({
  rootCategory: t,
  rootName: a,
  scalars: { name: "", objectSchema: {}, scalarsPath: void 0, scalarArrays: [{ path: `$["${r.name}"][*]`, param: r }] },
  structs: { items: [], errors: [] },
  structArrays: {
    items: [],
    errors: []
  }
}), ft = (t, a, r) => ({ rootCategory: t, rootName: a, scalars: { name: r.attr.kind, objectSchema: { [r.name]: r.attr }, scalarsPath: `$["${r.name}"]`, scalarArrays: [] }, structArrays: {
  items: [],
  errors: []
}, structs: { items: [], errors: [] } }), ea = (t, a, r) => B(t, a, r), B = (t, a, r) => ({
  rootName: a.name,
  rootCategory: t,
  scalars: void 0,
  structArrays: { items: [], errors: [] },
  structs: lt(a, "$", r)
}), ht = (t, a, r) => ({
  structArrays: pt(a, "$", r),
  rootName: a.name,
  rootCategory: t,
  scalars: void 0,
  structs: { items: [], errors: [] }
}), gt = (t, a, r, e) => a.filter((s) => typeof s == "number").map((s) => ({
  rootName: t.rootName,
  rootType: t.rootCategory,
  value: s,
  structName: r,
  param: e
})), yt = (t, a, r, e) => a.filter((s) => typeof s == "string").map((s) => ({ rootName: t.rootName, rootType: t.rootCategory, value: s, structName: r, param: e })), Nt = (t, a, r, e, s) => {
  if (typeof r == "object" || r === null) return null;
  const n = e[e.length - 1];
  if (typeof n == "number") return null;
  const m = s[n];
  return m ? {
    rootName: t.rootName,
    rootType: t.rootCategory,
    structName: a,
    value: r,
    param: { name: n, attr: m }
  } : null;
}, I = (t, a) => a.map((r) => bt(t, r)).flat(3), bt = (t, a) => [a.top ? M(a, t, a.top, "") : [], a.structs.map((r) => M(a, t, r)), a.structArrays.map((r) => M(a, t, r))], M = (t, a, r, e = r.bundleName) => {
  const s = r.scalar ? ((m, c, d, u, p) => u.pathSegments(d).map(({ value: l, segments: i }) => Nt(m, c, l, i, p)).filter((l) => l !== null))(t, e, a, r.scalar.jsonPathJS, r.scalar.record) : [], n = r.arrays.map((m) => ((c, d, u, p) => {
    const l = p.jsonPathJS.find(u);
    if (!Array.isArray(l)) return [];
    const i = p.schema.attr;
    return X(i) ? yt(c, l, d, p.schema) : Y(i) ? gt(c, l, d, p.schema) : [];
  })(t, e, a, m));
  return [s, n].flat(2);
}, x = (t, a) => {
  const r = vt(t, { createReader: (e) => a(e), errorAtPath() {
  } });
  if (r.errors.length > 0) throw r.errors[0].error;
  return r.extractor;
}, vt = (t, a) => {
  const r = [], e = t.scalars ? C(t.scalars, "scalar", a, r) : void 0, s = t.structs.items.map((m) => C(m, "struct", a, r)), n = t.structArrays.items.map((m) => C(m, "structArray", a, r));
  return { extractor: {
    rootCategory: t.rootCategory,
    rootName: t.rootName,
    top: e,
    structs: s,
    structArrays: n
  }, errors: r };
}, C = (t, a, r, e) => {
  const s = xt(t.scalarArrays, t.name, a, r, e);
  return t.scalarsPath ? {
    bundleName: t.name,
    arrays: s,
    scalar: At(t.scalarsPath, t.objectSchema, a, r, e)
  } : { bundleName: t.name, arrays: s };
}, xt = (t, a, r, e, s) => t.flatMap((n) => {
  try {
    return [{
      jsonPathJS: e.createReader(n.path),
      schema: n.param,
      parentType: a
    }];
  } catch (m) {
    return s.push({ path: n.path, valType: r, error: m, handledInfo: e.errorAtPath(n.path, r, m) }), [];
  }
}), At = (t, a, r, e, s) => {
  try {
    return {
      jsonPathJS: e.createReader(t),
      record: a
    };
  } catch (n) {
    return void s.push({ path: t, valType: r, error: n, handledInfo: e.errorAtPath(t, r, n) });
  }
}, _ = (t, a, r, e) => ({
  pluginName: t,
  commandName: a.command,
  desc: a.desc ?? "",
  text: a.text ?? "",
  extractors: $t(a, r, e)
}), $t = (t, a, r) => t.args.map((e) => {
  const s = v("args", t.command, e, a);
  return x(s, r);
}), z = (t, a) => ({
  pluginName: a.pluginName,
  commandName: a.commandName,
  args: I(t, a.extractors)
}), sa = (t, a, r) => {
  const e = r.get(a);
  if (e) return z(t, e);
}, na = (t, a) => new Map(t.flatMap((r) => Pt(r, a))), Pt = (t, a) => {
  const r = P(t.schema.structs);
  return t.schema.commands.map((e) => [`${t.pluginName}:${e.command}`, _(t.pluginName, e, r, a)]);
}, oa = (t) => t.rootType === "args", ma = (t) => t.rootType === "param", ca = (t, a, r, e) => {
  const s = {
    pluginName: t.name,
    record: t
  };
  try {
    const n = r(t.parameters);
    return { pluginName: s.pluginName, params: I(n, a), errorKind: "", errorInfo: null };
  } catch (n) {
    return {
      pluginName: s.pluginName,
      errorKind: "parseError",
      errorInfo: e.pluginParamsParseError(s, n),
      params: []
    };
  }
}, ua = (t, a, r) => ({ pluginName: t.pluginName, extractors: t.schema.params.map((e) => {
  const s = v("param", "plugin", e, a);
  return x(s, r);
}) }), da = (t, a) => {
  const r = t.flatMap((e) => St(e, a));
  return new Map(r);
}, St = (t, a) => {
  const r = P(t.schema.structs);
  return D(t.pluginName, t.schema.commands, r, a);
}, la = (t, a, r) => {
  const e = P(a.structs);
  return { pluginName: t, params: kt(a, e, r), commands: D(t, a.commands, e, r) };
}, kt = (t, a, r) => t.params.map((e) => {
  const s = v("param", e.name, e, a);
  return x(s, r);
}), D = (t, a, r, e) => a.map((s) => [K(t, s.command), _(t, s, r, e)]), K = (t, a) => `${t}:${a}`, Mt = (t, a, r, e = Z) => {
  const s = {
    command: t,
    pluginName: t.parameters[0],
    commandName: t.parameters[1]
  }, n = K(t.parameters[0], t.parameters[1]), m = a.get(n);
  if (!m) return j(t, r.commandNotFoundError(s));
  try {
    const c = e(t.parameters[3]);
    return Ct(c, m, s, r);
  } catch (c) {
    return j(t, r.commandParseError(s, c));
  }
}, Ct = (t, a, r, e) => {
  try {
    return z(t, a);
  } catch (s) {
    return j(r.command, e.commandArgsError(r, s));
  }
}, j = (t, a) => ({
  pluginName: t.parameters[0],
  commandName: t.parameters[1],
  args: [],
  error: a
}), pa = (t) => {
  const a = t.flatMap((r) => r.extractorEntries);
  return new Map(a);
}, ia = (t, a, r) => Mt(t, a, r), fa = (t, a, r, e, s) => {
  const n = P(a.structs);
  return { pluginName: t, commands: jt(t, a.commands, n, r, s), params: Et(t, a.params, n, r, e) };
}, jt = (t, a, r, e, s) => a.reduce((n, m) => {
  const c = ((d, u, p, l, i) => {
    const y = [], h = u.args.flatMap((N) => {
      const f = v("args", u.command, N, p);
      y.push(...((g, S, b, F, H) => {
        const L = { pluginName: g, commandName: S, argName: b };
        return F.map((Q) => H.commandStructPathError(L, Q));
      })(d, u.command, N.name, [...f.structs.errors, ...f.structArrays.errors], i));
      try {
        return [x(f, l)];
      } catch (g) {
        return y.push(i.commandCompileJSONPathSchemaError({
          pluginName: d,
          commandName: u.command,
          argName: N.name
        }, g)), [];
      }
    });
    return { extractor: { pluginName: d, commandName: u.command, desc: u.desc ?? "", text: u.text ?? "", extractors: h }, errors: y };
  })(t, m, r, e, s);
  return {
    extractors: [...n.extractors, c.extractor],
    errors: [...n.errors, ...c.errors]
  };
}, { extractors: [], errors: [] }), Et = (t, a, r, e, s) => a.reduce((n, m) => {
  const c = ((d, u, p, l, i) => {
    const y = {
      pluginName: d,
      paramName: u.name
    }, h = v("param", "plugin", u, p), N = ((f, g, S) => g.map((b) => ({
      code: "paramStructPathError",
      source: "createPath",
      pluginName: f.pluginName,
      paramName: f.paramName,
      message: `Path error at "${b.path}": ${b.code}`,
      info: S.paramStructPathError(f, b)
    })))(y, [...h.structs.errors, ...h.structArrays.errors], i);
    try {
      return { extractor: x(h, l), errors: N };
    } catch (f) {
      const g = i.paramCompileJSONPathSchemaError(y, f);
      return { extractor: { rootCategory: h.rootCategory, rootName: h.rootName, top: void 0, structs: [], structArrays: [] }, errors: [...N, g] };
    }
  })(t, m, r, e, s);
  return { extractors: [...n.extractors, c.extractor], errors: [...n.errors, ...c.errors] };
}, { extractors: [], errors: [] }), o = (t, a) => `@${t} ${a}`, A = (t, a) => {
  const r = t[a];
  return r === void 0 ? void 0 : o(a, String(r));
}, O = (t, a, r) => {
  const e = o(a, t.name), s = Tt(t.attr), n = Jt(t.attr, r);
  return n ? {
    name: e,
    base: s,
    default: n.default,
    attr: n.attr.filter((m) => m !== void 0)
  } : { name: e, base: s, default: void 0, attr: [] };
}, Tt = (t) => {
  return {
    kind: (a = t, a.kind === "struct" ? o(k, `struct<${a.struct}>`) : a.kind === "struct[]" ? o(k, `struct<${a.struct}>[]`) : o(k, a.kind)),
    desc: t.desc ? o("desc", t.desc) : void 0,
    text: t.text ? o("text", t.text) : void 0,
    parent: t.parent ? o("parent", t.parent) : void 0
  };
  var a;
}, Jt = (t, a) => t.kind === "number" ? _t(t) : t.kind === "number[]" ? zt(t, a) : t.kind === "file[]" ? Rt(t, a) : t.kind === "struct[]" ? Lt(t, a) : t.kind === "string[]" || t.kind === "multiline_string[]" ? Dt(t, a) : t.kind === "select" ? qt(t) : t.kind === "combo" ? Ft(t) : t.kind === "file" ? Ot(t) : t.kind === "struct" ? Ht(t, a) : t.kind === "boolean" ? wt(t) : t.kind === "string" || t.kind === "any" || t.kind === "multiline_string" ? Kt(t) : typeof t.default == "number" ? Bt(t) : It(t, a), R = (t) => t === void 0 ? void 0 : o("default", t.toString()), wt = (t) => ({
  attr: $.boolean.map((a) => A(t, a)),
  default: o("default", t.default ? "true" : "false")
}), Bt = (t) => ({ attr: [], default: R(t.default) }), It = (t, a) => {
  const r = a.numberArray(t.default);
  return {
    attr: [],
    default: o("default", r)
  };
}, _t = (t) => ({ attr: $.number.map((a) => A(t, a)), default: R(t.default) }), zt = (t, a) => {
  const r = a.numberArray(t.default);
  return {
    attr: $.number.map((e) => A(t, e)),
    default: o("default", r)
  };
}, Dt = (t, a) => {
  const r = a.stringArray(t.default);
  return { attr: [], default: o("default", r) };
}, Kt = (t) => ({
  attr: [],
  default: o("default", t.default)
}), Ot = (t) => ({ attr: $.file.map((a) => A(t, a)), default: o("default", t.default) }), Rt = (t, a) => {
  const r = a.stringArray(t.default);
  return {
    attr: $.file.map((e) => A(t, e)),
    default: o("default", r)
  };
}, qt = (t) => {
  return { attr: (a = t, a.options.flatMap((r) => [o(w, r.option), o(tt, r.value)])), default: o("default", t.default) };
  var a;
}, Ft = (t) => {
  return { attr: (a = t, a.options.map((r) => o(w, r))), default: o("default", t.default) };
  var a;
}, Ht = (t, a) => {
  if (!t.default) return { attr: [], default: void 0 };
  const r = a.struct(t.default);
  return { attr: [], default: o("default", r) };
}, Lt = (t, a) => {
  if (!t.default) return { attr: [], default: o("default", "[]") };
  const r = a.structArray(t.default);
  return {
    attr: [],
    default: o("default", r)
  };
}, $ = { number: ["min", "max", "decimals"], file: ["dir"], boolean: ["on", "off"] }, Qt = (t, a, r) => ({
  params: q(a.params, r),
  structs: a.structs.map((e) => Gt(e, t, r)),
  commands: a.commands.map((e) => Ut(e, r))
}), q = (t, a) => t.map((r) => O(r, "param", a)), Gt = (t, a, r) => ({ locale: a, struct: t.struct, params: q(t.params, r) }), Ut = (t, a) => ({
  desc: t.desc ? o("desc", t.desc) : void 0,
  text: t.text ? o("text", t.text) : void 0,
  command: o("command", t.command),
  args: t.args.map((r) => O(r, "arg", a))
}), Vt = (t) => {
  const a = t.params.flatMap(J).filter((r) => r !== void 0);
  return [`/*~struct~${t.struct}:${t.locale ?? ""}`, ...a, "*/"];
}, Wt = (t) => {
  const a = [t.target, t.meta.author, t.meta.pluginDesc, t.meta.url, "", ...t.dependencies.base, ...t.dependencies.orderBefore, ...t.dependencies.orderAfter, (r = t.dependencies, r.base.length > 0 || r.orderBefore.length > 0 || r.orderAfter.length > 0 ? "" : void 0), ...t.schema.commands.flatMap(Xt), ...t.schema.params.flatMap(J)].filter((e) => e !== void 0);
  var r;
  return [`/*:${t.locale ?? ""}`, ...a, "*/"];
}, Xt = (t) => [t.command, t.text, t.desc, ...t.args.flatMap(J)], J = (t) => [t.name, t.base.kind, t.base.desc, t.base.text, t.base.parent, ...t.attr, t.default, ""], ha = (t) => [...t.body, ...t.structs.flatMap((a) => a)].join(`
`), ga = (t, a) => {
  const r = Yt(t, a);
  return { body: Wt(r), structs: r.schema.structs.map(Vt) };
}, Yt = (t, a) => {
  const r = t.locale ?? "";
  return {
    locale: r,
    schema: Qt(r, t.schema, a),
    target: o(at, t.target),
    meta: ta(t.meta),
    dependencies: Zt(t.dependencies)
  };
}, Zt = (t) => ({ base: t.base.map((a) => o(st, a)), orderBefore: t.orderBefore.map((a) => o(et, a)), orderAfter: t.orderAfter.map((a) => o(rt, a)) }), ta = (t) => {
  const a = t.author, r = t.plugindesc, e = t.url;
  return { author: a ? o(mt, a) : void 0, pluginDesc: r ? o(ot, r) : void 0, url: e ? o(nt, e) : void 0 };
};
export {
  ma as A,
  ut as B,
  ct as C,
  pa as D,
  K as E,
  Mt as a,
  fa as b,
  jt as c,
  Et as d,
  ca as e,
  na as f,
  _ as g,
  Pt as h,
  ua as i,
  St as j,
  da as k,
  la as l,
  v as m,
  ft as n,
  ea as o,
  I as p,
  ia as q,
  sa as r,
  z as s,
  Yt as t,
  ga as u,
  ha as v,
  pt as w,
  lt as x,
  ra as y,
  oa as z
};
