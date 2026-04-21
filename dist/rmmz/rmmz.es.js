import { R as D, S as H, T as S, U as Q, V as X, W as E, X as x, O as G, P as tt, Q as et, Y as at, Z as rt, _ as nt, $ as st, a0 as ct, a1 as mt, a2 as ot, a3 as it, C as ut, j as F, A as lt, k as pt, q as dt, o as ft, z as gt, x as yt } from "../shared/structMap.es.js";
import { c as he, a as Ae, b as Oe, d as Se, e as ve, f as xe, g as Ne, h as Ce, i as ke, l as je, m as we, n as Te, p as Be, r as Ee, s as Je, t as _e, u as De, v as Fe, w as Ve, y as Ie, B as Le, D as Re, E as $e, F as ze, G as Me } from "../shared/structMap.es.js";
const V = (t, e) => {
  const a = Object.entries(e).filter(([r]) => r in t).map(([r, n]) => [r, n(t[r])]);
  return Object.fromEntries(a);
}, f = (t, e, a, r) => ({
  default: e,
  ...V(a, r),
  kind: t
}), b = (t, e, a) => ({ default: [], ...V(e, a), kind: t }), Pt = (t, e) => {
  const a = t.map((r) => r.locale === "" ? r.struct : r.locale === e ? `${r.struct}!` : "");
  return new Set(a);
}, I = "BODY", L = "STRUCT", g = "NONE", bt = (t, e) => {
  const a = e.trim(), r = a.match(/^\/\*~struct~([A-Za-z0-9_]*)(?::([A-Za-z0-9_-]+))?/);
  return r ? ht(t, r) : /^\/\*:/.test(a) ? Ot(t, a) : a === "*/" ? t.lines.length > 0 ? k(t) : t : { ...t, lines: t.lines.concat([a]) };
}, ht = (t, e) => {
  const a = t.lines.length > 0 ? k(t) : t, r = e[1] || void 0;
  return {
    ...a,
    structName: r,
    blockType: r ? L : "INVALID",
    locale: e[2] ?? "",
    lines: []
  };
}, At = (t) => {
  if (t) {
    const e = t.match(/^\/\*:(\w+)/);
    if (e) return e[1];
  }
  return "";
}, Ot = (t, e) => ({
  ...t.lines.length > 0 ? k(t) : t,
  locale: At(e),
  blockType: I,
  lines: []
}), k = (t) => {
  if (t.blockType === I) {
    const e = { locale: t.locale, lines: [...t.lines] };
    return {
      ...t,
      bodies: t.bodies.concat([e]),
      lines: [],
      blockType: g,
      locale: ""
    };
  }
  return t.structName && t.blockType === L ? {
    ...t,
    structs: t.structs.concat([{ struct: t.structName, locale: t.locale, lines: [...t.lines] }]),
    blockType: g,
    structName: void 0,
    locale: "",
    lines: []
  } : { ...t, blockType: g, structName: void 0, locale: "", lines: [] };
}, St = (t) => t.currentOption ? { items: t.items.concat({
  option: t.currentOption,
  value: t.currentOption
}) } : t, N = (t) => ({ ...typeof t.desc == "string" ? { desc: t.desc } : {}, ...typeof t.text == "string" ? { text: t.text } : {} }), y = (t) => {
  const e = vt(t), a = Nt(e);
  return xt(a);
}, vt = (t) => {
  if (t.currentParam && t.currentOption) {
    const e = t.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...t, currentParam: { ...t.currentParam, options: St(t.currentOption).items } };
  }
  return t;
}, xt = (t) => t.currentParam ? { ...t, params: [...t.params, t.currentParam], currentCommand: null, currentOption: null, currentParam: null, currentContext: null } : t, Nt = (t) => {
  if (!t.currentCommand) return t;
  const e = t.currentParam ? [...t.currentCommand.args, t.currentParam] : t.currentCommand.args, a = {
    ...N(t.currentCommand),
    command: t.currentCommand.command,
    args: e
  };
  return { ...t, commands: [...t.commands, a], currentCommand: null, currentParam: null, currentContext: null, currentOption: null };
}, R = (t, e = "") => {
  const a = ((m) => {
    const u = m.split(`
`), d = {
      structs: [],
      bodies: [],
      structName: void 0,
      locale: "",
      lines: [],
      blockType: g
    }, o = u.reduce((Y, q) => bt(Y, q), d);
    return { structs: o.structs, bodies: o.bodies };
  })(t), r = ((m, u) => {
    const d = Pt(m, u);
    return m.filter((o) => o.locale === "" && d.has(o.struct) ? !d.has(`${o.struct}!`) : o.locale === u && d.has(`${o.struct}!`));
  })(a.structs, e).map((m) => Ct(m)), n = ((m, u) => m.reduce((d, o) => o.locale === u || o.locale === "" && d === void 0 ? o : d, void 0))(a.bodies, e);
  if (!n) return {
    locale: e,
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    dependencies: { base: [], orderBefore: [], orderAfter: [] },
    structs: r
  };
  const s = $(n);
  return {
    locale: n.locale,
    params: s.params,
    commands: s.commands,
    meta: s.meta,
    helpLines: s.helpLines,
    structs: r,
    dependencies: s.dependencies
  };
}, Ct = (t) => {
  const e = $(t);
  return { name: t.struct, params: e.params };
}, $ = (t) => {
  const e = t.lines.reduce((a, r) => jt(a, r), kt());
  return y(e);
}, kt = () => ({ helpLines: [], params: [], commands: [], currentParam: null, currentCommand: null, currentContext: null, currentOption: null, dependencies: {
  base: [],
  orderBefore: [],
  orderAfter: []
}, meta: {} }), jt = (t, e, a = wt) => {
  const r = e.trimEnd().replace(/^[\*\s]*/, "");
  if (!r.startsWith("@")) return t.currentContext === D ? { ...t, helpLines: t.helpLines.concat(r) } : t;
  const n = r.match(/^@(\S+)\s*(.*)$/);
  if (!n) return t;
  const [, s, m] = n, u = a[s];
  return u ? u(t, m.trim()) : t;
}, i = (t, e, a) => t.currentParam && !(e in t.currentParam.attr) ? { ...t, currentParam: {
  ...t.currentParam,
  attr: { ...t.currentParam.attr, [e]: a }
} } : t, v = (t, e, a) => ({ ...t, meta: { [e]: a, ...t.meta } }), wt = {
  param: (t, e) => {
    const a = y(t);
    return a.params.some((r) => r.name === e) ? a : {
      ...a,
      currentContext: Q,
      currentParam: { name: e, attr: {} }
    };
  },
  text: (t, e) => t.currentParam ? i(t, S, e) : t.currentCommand && !(S in t.currentCommand) ? { ...t, currentCommand: {
    ...N(t.currentCommand),
    command: t.currentCommand.command,
    args: t.currentCommand.args,
    [S]: e
  } } : t,
  desc: (t, e) => t.currentParam ? i(t, X, e) : t.currentCommand ? { ...t, currentCommand: { ...t.currentCommand, desc: e } } : t,
  command: (t, e) => {
    const a = y(t);
    return a.commands.some((r) => r.command === e) ? a : { ...a, currentCommand: { command: e, args: [] }, currentParam: null };
  },
  arg: (t, e) => {
    if (!t.currentCommand) return t;
    if (!t.currentParam) return { ...t, currentParam: { name: e, attr: {} } };
    const a = { ...N(t.currentCommand), command: t.currentCommand.command, args: t.currentCommand.args.concat(t.currentParam) };
    return { ...t, commands: t.commands, currentCommand: a, currentContext: H, currentParam: { name: e, attr: {} } };
  },
  help: (t) => ({ ...y(t), currentContext: D }),
  option: (t, e) => {
    if (!t.currentParam) return t;
    const a = ((r, n) => r.currentOption ? { items: r.items.concat({ option: r.currentOption, value: r.currentOption }), currentOption: n } : { items: r.items, currentOption: n })(t.currentOption ?? {
      items: []
    }, e);
    return { ...t, currentOption: a };
  },
  value: (t, e) => {
    if (!t.currentOption) return t;
    const a = ((r, n) => r.currentOption ? { items: r.items.concat({ option: r.currentOption, value: n }) } : {
      items: r.items
    })(t.currentOption, e);
    return { ...t, currentOption: a };
  },
  type: (t, e) => {
    if (((a) => a.endsWith(">") && a.startsWith("struct<"))(e)) {
      const a = e.slice(7, -1), r = i(t, E, a);
      return i(r, x, E);
    }
    return t.currentParam ? i(t, x, e) : t;
  },
  parent: (t, e) => i(t, it, e),
  default: (t, e) => i(t, ot, e),
  on: (t, e) => i(t, mt, e),
  off: (t, e) => i(t, ct, e),
  min: (t, e) => i(t, st, e),
  max: (t, e) => i(t, nt, e),
  decimals: (t, e) => i(t, rt, e),
  dir: (t, e) => i(t, at, e),
  base: (t, e) => {
    return { ...t, dependencies: (a = t.dependencies, r = e, {
      orderAfter: a.orderAfter,
      orderBefore: a.orderBefore,
      base: a.base.concat(r)
    }) };
    var a, r;
  },
  orderAfter: (t, e) => {
    return { ...t, dependencies: (a = t.dependencies, r = e, { base: a.base, orderBefore: a.orderBefore, orderAfter: a.orderAfter.concat(r) }) };
    var a, r;
  },
  orderBefore: (t, e) => {
    return { ...t, dependencies: (a = t.dependencies, r = e, { base: a.base, orderAfter: a.orderAfter, orderBefore: a.orderBefore.concat(r) }) };
    var a, r;
  },
  author: (t, e) => v(t, et, e),
  plugindesc: (t, e) => v(t, tt, e),
  url: (t, e) => v(t, G, e)
}, Tt = { notNumber: "isNaN", notInteger: "notInteger" }, z = (t, e, a = Tt) => {
  if (x in t.attr) {
    const r = Et[t.attr.kind];
    if (r) return r(t, e, a);
  }
  return { name: t.name, attr: f("any", "", t.attr, h) };
}, c = (t) => t, M = (t) => t.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), h = {
  default: c,
  text: c,
  desc: c,
  parent: c
}, Bt = (t) => ({ option: t.option, value: t.value }), J = (t, e) => ({ name: t.name, attr: f(e, "", t.attr, h) }), _ = (t, e, a) => {
  const { value: r, errors: n } = e.parseStringArray(t.attr.default || "[]", t), s = {
    default: () => r,
    text: c,
    desc: c,
    parent: c
  };
  return { name: t.name, attr: b(a, t.attr, s), ...C(n) };
}, l = (t, e) => {
  const a = { default: (r) => M(r), text: c, desc: c, parent: c };
  return {
    name: t.name,
    attr: b(e, t.attr, a)
  };
}, p = (t, e) => {
  const a = { default: (r) => parseInt(r, 10), text: c, desc: c, parent: c };
  return { name: t.name, attr: f(e, 0, t.attr, a) };
}, C = (t) => t.length > 0 ? { errors: t } : {}, Et = {
  actor: (t) => p(t, "actor"),
  "actor[]": (t) => l(t, "actor[]"),
  class: (t) => p(t, "class"),
  "class[]": (t) => l(t, "class[]"),
  skill: (t) => p(t, "skill"),
  "skill[]": (t) => l(t, "skill[]"),
  item: (t) => p(t, "item"),
  "item[]": (t) => l(t, "item[]"),
  weapon: (t) => p(t, "weapon"),
  "weapon[]": (t) => l(t, "weapon[]"),
  armor: (t) => p(t, "armor"),
  "armor[]": (t) => l(t, "armor[]"),
  state: (t) => p(t, "state"),
  "state[]": (t) => l(t, "state[]"),
  enemy: (t) => p(t, "enemy"),
  "enemy[]": (t) => l(t, "enemy[]"),
  common_event: (t) => p(t, "common_event"),
  "common_event[]": (t) => l(t, "common_event[]"),
  switch: (t) => p(t, "switch"),
  "switch[]": (t) => l(t, "switch[]"),
  variable: (t) => p(t, "variable"),
  "variable[]": (t) => l(t, "variable[]"),
  troop: (t) => p(t, "troop"),
  "troop[]": (t) => l(t, "troop[]"),
  file: (t) => {
    const e = { default: c, text: c, desc: c, parent: c, dir: c };
    return { name: t.name, attr: { dir: "", ...f("file", "", t.attr, e) } };
  },
  "file[]": (t, e) => {
    const { value: a } = e.parseStringArray(t.attr.default || "[]", t), r = { default: () => a, text: c, desc: c, parent: c, dir: c };
    return { name: t.name, attr: { dir: "", ...b("file[]", t.attr, r) } };
  },
  combo: (t) => {
    var a;
    const e = ((a = t.options) == null ? void 0 : a.map((r) => r.option)) ?? [];
    return { name: t.name, attr: { ...f("combo", "", t.attr, h), options: e } };
  },
  select: (t) => {
    const e = t.options ? t.options.map(Bt) : [];
    return {
      name: t.name,
      attr: { ...f("select", "", t.attr, h), options: e }
    };
  },
  struct: (t, e) => {
    const { errors: a, value: r } = e.parseObject(t.attr.default || "{}", t), n = { text: c, desc: c, parent: c }, s = a.length === 0 ? r : {};
    return { name: t.name, attr: { struct: t.attr.struct || "", ...f("struct", s, t.attr, n), ...C(a) } };
  },
  "struct[]": (t, e) => {
    const { errors: a, value: r } = e.parseObjectArray(t.attr.default || "[]", t), n = {
      text: c,
      desc: c,
      parent: c
    }, s = a.length === 0 ? r : [];
    return { name: t.name, attr: { struct: t.attr.struct || "", ...f("struct[]", s, t.attr, n), ...C(a) } };
  },
  boolean: (t) => {
    const e = {
      default: (a) => a === "true",
      text: c,
      desc: c,
      on: c,
      off: c,
      parent: c
    };
    return { name: t.name, attr: f("boolean", !0, t.attr, e) };
  },
  number: (t, e, a) => {
    const r = {
      default: (s) => parseFloat(s),
      text: c,
      desc: c,
      decimals: (s) => parseInt(s, 10),
      min: (s) => parseFloat(s),
      max: (s) => parseFloat(s),
      parent: c
    }, n = f("number", 0, t.attr, r);
    return isNaN(n.default) ? { name: t.name, attr: n, errors: [{
      source: t.attr.default || "",
      message: a.notNumber,
      code: "notNumber",
      attr: "default"
    }] } : { name: t.name, attr: n };
  },
  "number[]": (t) => {
    const e = {
      default: (a) => M(a),
      text: c,
      desc: c,
      decimals: (a) => parseInt(a, 10),
      min: (a) => parseFloat(a),
      max: (a) => parseFloat(a),
      parent: c
    };
    return { name: t.name, attr: b("number[]", t.attr, e) };
  },
  string: (t) => J(t, "string"),
  "string[]": (t, e) => _(t, e, "string[]"),
  multiline_string: (t) => J(t, "multiline_string"),
  "multiline_string[]": (t, e) => _(t, e, "multiline_string[]")
}, re = (t) => Z(t), ne = (t) => JSON.stringify(Z(t)), P = (t) => typeof t == "object" && t !== null && !Array.isArray(t), Z = (t) => Array.isArray(t) ? Jt(t) : P(t) ? A(t) : {}, A = (t) => P(t) ? Object.fromEntries(Object.entries(t).map(([e, a]) => {
  if (Array.isArray(a)) {
    const r = a.map((n) => P(n) ? JSON.stringify(A(n)) : String(n));
    return [e, JSON.stringify(r)];
  }
  return P(a) ? [e, JSON.stringify(A(a))] : [e, String(a)];
})) : {}, Jt = (t) => t.map((e) => typeof e == "object" && e !== null ? JSON.stringify(A(e)) : String(e)), j = () => ({ parseStringArray: (t) => ({ value: _t(t), errors: [] }), parseObjectArray: () => ({
  value: [],
  errors: []
}), parseObject: (t) => ({ value: ut(t), errors: [] }) }), _t = (t) => {
  try {
    const e = JSON.parse(t);
    if (Array.isArray(e) && e.every((a) => typeof a == "string")) return e;
  } catch {
  }
  return [];
}, Dt = (t, e = j()) => ({ params: w(t.params, e), commands: Ft(t.commands, e), structs: Vt(t.structs, e) }), w = (t, e) => t.map((a) => z(a, e)), Ft = (t, e) => t.map((a) => ({
  command: a.command,
  desc: a.desc,
  text: a.text,
  args: w(a.args, e)
})), Vt = (t, e) => t.map((a) => ({ struct: a.name, params: w(a.params, e) })), It = (t, e) => {
  const a = function(r) {
    return Object.fromEntries(r.map((n) => [n.struct, n.params.filter(F)]));
  }(t);
  return function(r, n, s) {
    return r.reduce((m) => {
      if (!m.changed) return m;
      const u = r.filter((d) => !m.names.has(d) && n[d].some((o) => m.names.has(o.attr.struct)));
      return u.length === 0 ? { names: m.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...m.names, ...u]), changed: !0 };
    }, {
      names: s,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, se = (t) => O(t, pt), ce = (t) => O(t, dt), me = (t) => O(t, lt), oe = (t) => O(t, ft), O = (t, e) => {
  const a = t.structs.filter((s) => s.params.some((m) => e(m))), r = new Set(a.map((s) => s.struct)), n = It(t.structs, r);
  return {
    structs: Lt(t.structs, n, e),
    commands: Rt(t.commands, n, e),
    params: T(t.params, n, e)
  };
}, T = (t, e, a) => t.filter((r) => F(r) ? e.has(r.attr.struct) : a(r)), Lt = (t, e, a) => t.map((r) => ({
  struct: r.struct,
  params: T(r.params, e, a)
})).filter((r) => r.params.length > 0), Rt = (t, e, a) => t.map((r) => ({
  ...r.desc ? { desc: r.desc } : {},
  ...r.text ? { text: r.text } : {},
  command: r.command,
  args: T(r.args, e, a)
})).filter((r) => r.args.length > 0), $t = {
  variable: 1,
  switch: 2,
  actor: 0,
  item: 0,
  weapon: 0,
  armor: 0,
  skill: 0,
  class: 0,
  state: 0,
  troop: 0,
  enemy: 0,
  common_event: 0
}, zt = ["data", "system", "system"], Mt = (t) => {
  const e = $t[t];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: t } : { author: "rmmz", module: zt[e], kind: [t, "variable", "switch"][e] };
}, ie = (t) => {
  const e = Mt(t.kind);
  return e.author === t.author && e.module === t.module && e.kind === t.kind;
}, ue = (t) => (t.attr.kind === "struct" || t.attr.kind === "struct[]") && !!Array.isArray(t.errors) && t.errors.length > 0, W = (t, e, a) => {
  const r = e.get(t);
  return r ? r.filter((n) => ((s, m) => !(!gt(s) && !yt(s) || !s.struct || m.has(s.struct)))(n, a)).flatMap((n) => {
    const s = n.struct;
    return a.add(s), [s, ...W(s, e, a)];
  }) : [];
}, le = (t, e) => W(t, e, /* @__PURE__ */ new Set()), K = (t) => !Array.isArray(t) && typeof t == "object" && t !== null && !!(Zt(t) && Wt(t) && Kt(t) && "parameters" in t) && Ut(t), Zt = (t) => "name" in t && typeof t.name == "string", Wt = (t) => "status" in t && typeof t.status == "boolean", Kt = (t) => "description" in t && typeof t.description == "string", Ut = (t) => typeof t.parameters == "object" && t.parameters !== null && Object.values(t.parameters).every((e) => typeof e == "string"), Yt = /\s*\/\//, qt = /\s*[var|let|const]\s+[^\s]+\s*=/, Ht = /^\s{0,3}[\[|\]\;]/, U = (t) => t.split(`
`).filter((e) => !((a) => Yt.test(a) || Ht.test(a) || qt.test(a))(e)), pe = (t) => {
  const e = `[${U(t).join("")}]`, a = JSON.parse(e);
  if (!Array.isArray(a)) throw new Error("Parsed value is not an array");
  if (a.every(K)) return a;
  throw new Error("Parsed value is not PluginParamsObject array");
}, de = (t, e) => {
  const a = `[${U(t).join("")}]`;
  try {
    const r = JSON.parse(a);
    if (!Array.isArray(r)) return {
      complete: !1,
      plugins: [],
      message: e.notArray,
      invalidPlugins: 0
    };
    const n = r.filter(K), s = r.length - n.length;
    return { complete: s === 0, plugins: n, invalidPlugins: s, message: s <= 0 ? e.success : e.partialSuccess };
  } catch (r) {
    return { complete: !1, plugins: [], invalidPlugins: 0, message: e.parseError, error: r };
  }
}, fe = (t, e) => {
  const a = Xt(e);
  return t.map((r) => ({
    description: r.description,
    name: r.name,
    status: r.status,
    parameters: Qt(r, a)
  }));
}, Qt = (t, e) => {
  const a = e.get(t.name);
  if (!a) return t.parameters;
  const r = Object.entries(t.parameters).filter(([n]) => !a.has(n));
  return Object.fromEntries(r);
}, Xt = (t) => new Map(t.map((e) => [e.pluginName, new Set(e.params)])), Gt = (t) => {
  const e = j();
  return {
    target: "MZ",
    meta: t.meta,
    commands: te(t.commands, e),
    params: B(t.params, e),
    structs: ee(t.structs, e)
  };
}, B = (t, e) => Object.fromEntries(t.map((a) => {
  const r = z(a, e);
  return [a.name, r.attr];
})), te = (t, e) => Object.fromEntries(t.map((a) => [a.command, { desc: a.desc, text: a.text, args: B(a.args, e) }])), ee = (t, e) => Object.fromEntries(t.map((a) => [a.name, {
  params: B(a.params, e)
}])), ge = (t) => ((e) => Gt(R(e, "")))(t), ye = (t, e = j()) => {
  const a = R(t.source, t.locale);
  return {
    locale: t.locale,
    meta: a.meta,
    pluginName: t.pluginName,
    target: "MZ",
    dependencies: a.dependencies,
    schema: Dt(a, e)
  };
};
export {
  he as classifyFileParams,
  Ae as classifyPluginParams,
  Oe as classifyTextParams,
  It as collectDependentStructNames,
  Dt as compilePluginAsArraySchema,
  Se as convertPluginCommandSchema,
  U as convertPluginsJSToJSON,
  ve as convertStructSchema,
  xe as createClassifiedStructMap,
  Ne as createStructMap,
  se as filterPluginParamByText,
  oe as filterPluginSchemaByFileParam,
  ce as filterPluginSchemaByNumberParam,
  O as filterPluginSchemaByParam,
  me as filterPluginSchemaByVariableParam,
  Ce as hasNumberValueParam,
  ke as hasScalarAttr,
  F as hasStructAttr,
  pt as hasTextAttr,
  je as isArrayAttr,
  we as isArrayParam,
  Te as isArrayParamEx,
  ue as isErrorStructParam,
  ft as isFileAttr,
  Be as isNumberArrayParam,
  dt as isNumberAttr,
  Ee as isNumberValueParam,
  Je as isNumberValueParamEx,
  ie as isRmmzDataKind,
  _e as isScalarParam,
  De as isStringArrayParam,
  Fe as isStringValueParam,
  Ve as isStructArrayAttr,
  yt as isStructArrayParam,
  Ie as isStructAttr,
  gt as isStructParam,
  lt as isVariableAttr,
  Mt as lookupKind,
  fe as omitPluginParam,
  Le as paramHasText,
  ut as parseDeepJSON,
  Re as parseDeepRecord,
  pe as parsePluginParamRecord,
  de as parsePluginParamRecord2,
  ye as pluginSourceToArraySchema,
  ge as pluginSourceToJSON,
  Rt as rebuildCommands,
  ne as stringifyDeepJSON,
  re as stringifyDeepRecord,
  le as structDependencies,
  $e as toArrayPluginParam,
  ze as toObjectPluginParams,
  Me as toObjectPluginParamsOld,
  K as validatePluginJS
};
