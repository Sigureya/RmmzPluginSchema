import { R as D, S as H, T as S, U as Q, V as X, W as G, X as tt, Y as et, Z as at, _ as rt, $ as nt, a0 as st, a1 as J, a2 as x, a3 as ct, O as mt, P as ot, Q as it, C as ut, j as F, A as lt, k as pt, q as dt, o as ft, z as gt, x as yt } from "../shared/structMap.es.js";
import { c as he, a as Ae, b as Oe, d as Se, e as ve, f as xe, g as Ne, h as Ce, i as ke, l as je, m as we, n as Te, p as Be, r as Ee, s as Je, t as _e, u as Le, v as De, w as Fe, y as Ve, B as Ie, D as Re, E as $e, F as ze, G as Me } from "../shared/structMap.es.js";
const V = (t, e) => {
  const a = Object.entries(e).filter(([r]) => r in t).map(([r, n]) => [r, n(t[r])]);
  return Object.fromEntries(a);
}, d = (t, e, a, r) => ({
  default: e,
  ...V(a, r),
  kind: t
}), b = (t, e, a) => ({ default: [], ...V(e, a), kind: t }), Pt = (t, e) => {
  const a = t.map((r) => r.locale === "" ? r.struct : r.locale === e ? `${r.struct}!` : "");
  return new Set(a);
}, I = "BODY", R = "STRUCT", g = "NONE", $ = (t) => {
  const e = t.split(`
`), a = { structs: [], bodies: [], structName: void 0, locale: "", lines: [], blockType: g }, r = e.reduce((n, s) => bt(n, s), a);
  return {
    structs: r.structs,
    bodies: r.bodies
  };
}, bt = (t, e) => {
  const a = e.trim(), r = a.match(/^\/\*~struct~([A-Za-z0-9_]*)(?::([A-Za-z0-9_-]+))?/);
  return r ? ht(t, r) : /^\/\*:/.test(a) ? Ot(t, a) : a === "*/" ? t.lines.length > 0 ? k(t) : t : { ...t, lines: t.lines.concat([a]) };
}, ht = (t, e) => {
  const a = t.lines.length > 0 ? k(t) : t, r = e[1] || void 0;
  return {
    ...a,
    structName: r,
    blockType: r ? R : "INVALID",
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
  return t.structName && t.blockType === R ? {
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
}, ae = (t) => {
  const e = $(t);
  return e.bodies.map((a) => ((r, n) => {
    const s = j(r);
    return {
      locale: r.locale,
      commands: s.commands,
      params: s.params,
      helpLines: s.helpLines,
      meta: s.meta,
      dependencies: s.dependencies,
      structs: n.filter((m) => m.locale === r.locale).map((m) => M(m))
    };
  })(a, e.structs));
}, z = (t, e = "") => {
  const a = $(t), r = ((m, p) => {
    const f = Pt(m, p);
    return m.filter((l) => l.locale === "" && f.has(l.struct) ? !f.has(`${l.struct}!`) : l.locale === p && f.has(`${l.struct}!`));
  })(a.structs, e).map((m) => M(m)), n = ((m, p) => m.reduce((f, l) => l.locale === p || l.locale === "" && f === void 0 ? l : f, void 0))(a.bodies, e);
  if (!n) return {
    locale: e,
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    dependencies: { base: [], orderBefore: [], orderAfter: [] },
    structs: r
  };
  const s = j(n);
  return {
    locale: n.locale,
    params: s.params,
    commands: s.commands,
    meta: s.meta,
    helpLines: s.helpLines,
    structs: r,
    dependencies: s.dependencies
  };
}, M = (t) => {
  const e = j(t);
  return { name: t.struct, params: e.params };
}, j = (t) => {
  const e = t.lines.reduce((a, r) => kt(a, r), Ct());
  return y(e);
}, Ct = () => ({ helpLines: [], params: [], commands: [], currentParam: null, currentCommand: null, currentContext: null, currentOption: null, dependencies: {
  base: [],
  orderBefore: [],
  orderAfter: []
}, meta: {} }), kt = (t, e, a = jt) => {
  const r = e.trimEnd().replace(/^[\*\s]*/, "");
  if (!r.startsWith("@")) return t.currentContext === D ? { ...t, helpLines: t.helpLines.concat(r) } : t;
  const n = r.match(/^@(\S+)\s*(.*)$/);
  if (!n) return t;
  const [, s, m] = n, p = a[s];
  return p ? p(t, m.trim()) : t;
}, o = (t, e, a) => t.currentParam && !(e in t.currentParam.attr) ? { ...t, currentParam: {
  ...t.currentParam,
  attr: { ...t.currentParam.attr, [e]: a }
} } : t, v = (t, e, a) => ({ ...t, meta: { [e]: a, ...t.meta } }), jt = {
  param: (t, e) => {
    const a = y(t);
    return a.params.some((r) => r.name === e) ? a : {
      ...a,
      currentContext: H,
      currentParam: { name: e, attr: {} }
    };
  },
  text: (t, e) => t.currentParam ? o(t, S, e) : t.currentCommand && !(S in t.currentCommand) ? { ...t, currentCommand: {
    ...N(t.currentCommand),
    command: t.currentCommand.command,
    args: t.currentCommand.args,
    [S]: e
  } } : t,
  desc: (t, e) => t.currentParam ? o(t, ct, e) : t.currentCommand ? { ...t, currentCommand: { ...t.currentCommand, desc: e } } : t,
  command: (t, e) => {
    const a = y(t);
    return a.commands.some((r) => r.command === e) ? a : { ...a, currentCommand: { command: e, args: [] }, currentParam: null };
  },
  arg: (t, e) => {
    if (!t.currentCommand) return t;
    if (!t.currentParam) return { ...t, currentParam: { name: e, attr: {} } };
    const a = { ...N(t.currentCommand), command: t.currentCommand.command, args: t.currentCommand.args.concat(t.currentParam) };
    return { ...t, commands: t.commands, currentCommand: a, currentContext: Q, currentParam: { name: e, attr: {} } };
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
      const a = e.slice(7, -1), r = o(t, J, a);
      return o(r, x, J);
    }
    return t.currentParam ? o(t, x, e) : t;
  },
  parent: (t, e) => o(t, st, e),
  default: (t, e) => o(t, nt, e),
  on: (t, e) => o(t, rt, e),
  off: (t, e) => o(t, at, e),
  min: (t, e) => o(t, et, e),
  max: (t, e) => o(t, tt, e),
  decimals: (t, e) => o(t, G, e),
  dir: (t, e) => o(t, X, e),
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
  author: (t, e) => v(t, it, e),
  plugindesc: (t, e) => v(t, ot, e),
  url: (t, e) => v(t, mt, e)
}, wt = { notNumber: "isNaN", notInteger: "notInteger" }, Z = (t, e, a = wt) => {
  if (x in t.attr) {
    const r = Bt[t.attr.kind];
    if (r) return r(t, e, a);
  }
  return { name: t.name, attr: d("any", "", t.attr, h) };
}, c = (t) => t, W = (t) => t.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), h = {
  default: c,
  text: c,
  desc: c,
  parent: c
}, Tt = (t) => ({ option: t.option, value: t.value }), _ = (t, e) => ({ name: t.name, attr: d(e, "", t.attr, h) }), L = (t, e, a) => {
  const { value: r, errors: n } = e.parseStringArray(t.attr.default || "[]", t), s = {
    default: () => r,
    text: c,
    desc: c,
    parent: c
  };
  return { name: t.name, attr: b(a, t.attr, s), ...C(n) };
}, i = (t, e) => {
  const a = { default: (r) => W(r), text: c, desc: c, parent: c };
  return {
    name: t.name,
    attr: b(e, t.attr, a)
  };
}, u = (t, e) => {
  const a = { default: (r) => parseInt(r, 10), text: c, desc: c, parent: c };
  return { name: t.name, attr: d(e, 0, t.attr, a) };
}, C = (t) => t.length > 0 ? { errors: t } : {}, Bt = {
  actor: (t) => u(t, "actor"),
  "actor[]": (t) => i(t, "actor[]"),
  class: (t) => u(t, "class"),
  "class[]": (t) => i(t, "class[]"),
  skill: (t) => u(t, "skill"),
  "skill[]": (t) => i(t, "skill[]"),
  item: (t) => u(t, "item"),
  "item[]": (t) => i(t, "item[]"),
  weapon: (t) => u(t, "weapon"),
  "weapon[]": (t) => i(t, "weapon[]"),
  armor: (t) => u(t, "armor"),
  "armor[]": (t) => i(t, "armor[]"),
  state: (t) => u(t, "state"),
  "state[]": (t) => i(t, "state[]"),
  enemy: (t) => u(t, "enemy"),
  "enemy[]": (t) => i(t, "enemy[]"),
  common_event: (t) => u(t, "common_event"),
  "common_event[]": (t) => i(t, "common_event[]"),
  switch: (t) => u(t, "switch"),
  "switch[]": (t) => i(t, "switch[]"),
  variable: (t) => u(t, "variable"),
  "variable[]": (t) => i(t, "variable[]"),
  troop: (t) => u(t, "troop"),
  "troop[]": (t) => i(t, "troop[]"),
  file: (t) => {
    const e = { default: c, text: c, desc: c, parent: c, dir: c };
    return { name: t.name, attr: { dir: "", ...d("file", "", t.attr, e) } };
  },
  "file[]": (t, e) => {
    const { value: a } = e.parseStringArray(t.attr.default || "[]", t), r = { default: () => a, text: c, desc: c, parent: c, dir: c };
    return { name: t.name, attr: { dir: "", ...b("file[]", t.attr, r) } };
  },
  combo: (t) => {
    var a;
    const e = ((a = t.options) == null ? void 0 : a.map((r) => r.option)) ?? [];
    return { name: t.name, attr: { ...d("combo", "", t.attr, h), options: e } };
  },
  select: (t) => {
    const e = t.options ? t.options.map(Tt) : [];
    return {
      name: t.name,
      attr: { ...d("select", "", t.attr, h), options: e }
    };
  },
  struct: (t, e) => {
    const { errors: a, value: r } = e.parseObject(t.attr.default || "{}", t), n = { text: c, desc: c, parent: c }, s = a.length === 0 ? r : {};
    return { name: t.name, attr: { struct: t.attr.struct || "", ...d("struct", s, t.attr, n), ...C(a) } };
  },
  "struct[]": (t, e) => {
    const { errors: a, value: r } = e.parseObjectArray(t.attr.default || "[]", t), n = {
      text: c,
      desc: c,
      parent: c
    }, s = a.length === 0 ? r : [];
    return { name: t.name, attr: { struct: t.attr.struct || "", ...d("struct[]", s, t.attr, n), ...C(a) } };
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
    return { name: t.name, attr: d("boolean", !0, t.attr, e) };
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
    }, n = d("number", 0, t.attr, r);
    return isNaN(n.default) ? { name: t.name, attr: n, errors: [{
      source: t.attr.default || "",
      message: a.notNumber,
      code: "notNumber",
      attr: "default"
    }] } : { name: t.name, attr: n };
  },
  "number[]": (t) => {
    const e = {
      default: (a) => W(a),
      text: c,
      desc: c,
      decimals: (a) => parseInt(a, 10),
      min: (a) => parseFloat(a),
      max: (a) => parseFloat(a),
      parent: c
    };
    return { name: t.name, attr: b("number[]", t.attr, e) };
  },
  string: (t) => _(t, "string"),
  "string[]": (t, e) => L(t, e, "string[]"),
  multiline_string: (t) => _(t, "multiline_string"),
  "multiline_string[]": (t, e) => L(t, e, "multiline_string[]")
}, re = (t) => K(t), ne = (t) => JSON.stringify(K(t)), P = (t) => typeof t == "object" && t !== null && !Array.isArray(t), K = (t) => Array.isArray(t) ? Et(t) : P(t) ? A(t) : {}, A = (t) => P(t) ? Object.fromEntries(Object.entries(t).map(([e, a]) => {
  if (Array.isArray(a)) {
    const r = a.map((n) => P(n) ? JSON.stringify(A(n)) : String(n));
    return [e, JSON.stringify(r)];
  }
  return P(a) ? [e, JSON.stringify(A(a))] : [e, String(a)];
})) : {}, Et = (t) => t.map((e) => typeof e == "object" && e !== null ? JSON.stringify(A(e)) : String(e)), w = () => ({ parseStringArray: (t) => ({ value: Jt(t), errors: [] }), parseObjectArray: () => ({
  value: [],
  errors: []
}), parseObject: (t) => ({ value: ut(t), errors: [] }) }), Jt = (t) => {
  try {
    const e = JSON.parse(t);
    if (Array.isArray(e) && e.every((a) => typeof a == "string")) return e;
  } catch {
  }
  return [];
}, _t = (t, e = w()) => ({ params: T(t.params, e), commands: Lt(t.commands, e), structs: Dt(t.structs, e) }), T = (t, e) => t.map((a) => Z(a, e)), Lt = (t, e) => t.map((a) => ({
  command: a.command,
  desc: a.desc,
  text: a.text,
  args: T(a.args, e)
})), Dt = (t, e) => t.map((a) => ({ struct: a.name, params: T(a.params, e) })), Ft = (t, e) => {
  const a = function(r) {
    return Object.fromEntries(r.map((n) => [n.struct, n.params.filter(F)]));
  }(t);
  return function(r, n, s) {
    return r.reduce((m) => {
      if (!m.changed) return m;
      const p = r.filter((f) => !m.names.has(f) && n[f].some((l) => m.names.has(l.attr.struct)));
      return p.length === 0 ? { names: m.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...m.names, ...p]), changed: !0 };
    }, {
      names: s,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, se = (t) => O(t, pt), ce = (t) => O(t, dt), me = (t) => O(t, lt), oe = (t) => O(t, ft), O = (t, e) => {
  const a = t.structs.filter((s) => s.params.some((m) => e(m))), r = new Set(a.map((s) => s.struct)), n = Ft(t.structs, r);
  return {
    structs: Vt(t.structs, n, e),
    commands: It(t.commands, n, e),
    params: B(t.params, n, e)
  };
}, B = (t, e, a) => t.filter((r) => F(r) ? e.has(r.attr.struct) : a(r)), Vt = (t, e, a) => t.map((r) => ({
  struct: r.struct,
  params: B(r.params, e, a)
})).filter((r) => r.params.length > 0), It = (t, e, a) => t.map((r) => ({
  ...r.desc ? { desc: r.desc } : {},
  ...r.text ? { text: r.text } : {},
  command: r.command,
  args: B(r.args, e, a)
})).filter((r) => r.args.length > 0), Rt = {
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
}, $t = ["data", "system", "system"], zt = (t) => {
  const e = Rt[t];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: t } : { author: "rmmz", module: $t[e], kind: [t, "variable", "switch"][e] };
}, ie = (t) => {
  const e = zt(t.kind);
  return e.author === t.author && e.module === t.module && e.kind === t.kind;
}, ue = (t) => (t.attr.kind === "struct" || t.attr.kind === "struct[]") && !!Array.isArray(t.errors) && t.errors.length > 0, U = (t, e, a) => {
  const r = e.get(t);
  return r ? r.filter((n) => ((s, m) => !(!gt(s) && !yt(s) || !s.struct || m.has(s.struct)))(n, a)).flatMap((n) => {
    const s = n.struct;
    return a.add(s), [s, ...U(s, e, a)];
  }) : [];
}, le = (t, e) => U(t, e, /* @__PURE__ */ new Set()), Y = (t) => !Array.isArray(t) && typeof t == "object" && t !== null && !!(Mt(t) && Zt(t) && Wt(t) && "parameters" in t) && Kt(t), Mt = (t) => "name" in t && typeof t.name == "string", Zt = (t) => "status" in t && typeof t.status == "boolean", Wt = (t) => "description" in t && typeof t.description == "string", Kt = (t) => typeof t.parameters == "object" && t.parameters !== null && Object.values(t.parameters).every((e) => typeof e == "string"), Ut = /\s*\/\//, Yt = /\s*[var|let|const]\s+[^\s]+\s*=/, qt = /^\s{0,3}[\[|\]\;]/, q = (t) => t.split(`
`).filter((e) => !((a) => Ut.test(a) || qt.test(a) || Yt.test(a))(e)), pe = (t) => {
  const e = `[${q(t).join("")}]`, a = JSON.parse(e);
  if (!Array.isArray(a)) throw new Error("Parsed value is not an array");
  if (a.every(Y)) return a;
  throw new Error("Parsed value is not PluginParamsObject array");
}, de = (t, e) => {
  const a = `[${q(t).join("")}]`;
  try {
    const r = JSON.parse(a);
    if (!Array.isArray(r)) return {
      complete: !1,
      plugins: [],
      message: e.notArray,
      invalidPlugins: 0
    };
    const n = r.filter(Y), s = r.length - n.length;
    return { complete: s === 0, plugins: n, invalidPlugins: s, message: s <= 0 ? e.success : e.partialSuccess };
  } catch (r) {
    return { complete: !1, plugins: [], invalidPlugins: 0, message: e.parseError, error: r };
  }
}, fe = (t, e) => {
  const a = Qt(e);
  return t.map((r) => ({
    description: r.description,
    name: r.name,
    status: r.status,
    parameters: Ht(r, a)
  }));
}, Ht = (t, e) => {
  const a = e.get(t.name);
  if (!a) return t.parameters;
  const r = Object.entries(t.parameters).filter(([n]) => !a.has(n));
  return Object.fromEntries(r);
}, Qt = (t) => new Map(t.map((e) => [e.pluginName, new Set(e.params)])), Xt = (t) => {
  const e = w();
  return {
    target: "MZ",
    meta: t.meta,
    commands: Gt(t.commands, e),
    params: E(t.params, e),
    structs: te(t.structs, e)
  };
}, E = (t, e) => Object.fromEntries(t.map((a) => {
  const r = Z(a, e);
  return [a.name, r.attr];
})), Gt = (t, e) => Object.fromEntries(t.map((a) => [a.command, { desc: a.desc, text: a.text, args: E(a.args, e) }])), te = (t, e) => Object.fromEntries(t.map((a) => [a.name, {
  params: E(a.params, e)
}])), ge = (t) => ((e) => Xt(z(e, "")))(t), ye = (t, e = w()) => {
  const a = z(t.source, t.locale);
  return {
    locale: t.locale,
    meta: a.meta,
    pluginName: t.pluginName,
    target: "MZ",
    dependencies: a.dependencies,
    schema: _t(a, e)
  };
};
export {
  he as classifyFileParams,
  Ae as classifyPluginParams,
  Oe as classifyTextParams,
  Ft as collectDependentStructNames,
  _t as compilePluginAsArraySchema,
  Se as convertPluginCommandSchema,
  q as convertPluginsJSToJSON,
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
  Le as isStringArrayParam,
  De as isStringValueParam,
  Fe as isStructArrayAttr,
  yt as isStructArrayParam,
  Ve as isStructAttr,
  gt as isStructParam,
  lt as isVariableAttr,
  zt as lookupKind,
  fe as omitPluginParam,
  Ie as paramHasText,
  ut as parseDeepJSON,
  Re as parseDeepRecord,
  ae as parsePlugin,
  z as parsePluginByLocale,
  pe as parsePluginParamRecord,
  de as parsePluginParamRecord2,
  ye as pluginSourceToArraySchema,
  ge as pluginSourceToJSON,
  It as rebuildCommands,
  ne as stringifyDeepJSON,
  re as stringifyDeepRecord,
  le as structDependencies,
  $e as toArrayPluginParam,
  ze as toObjectPluginParams,
  Me as toObjectPluginParamsOld,
  Y as validatePluginJS
};
