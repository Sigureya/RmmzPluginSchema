import { R as J, S as q, T as x, U as Q, V as X, W as G, X as H, Y as K, Z as ee, _ as re, $ as ae, a0 as te, a1 as E, a2 as P, a3 as ne, O as se, P as ce, Q as oe, D as me, j as F, B as ue, k as ie, r as le, o as de, A as pe, y as fe } from "./structMap.es.js";
const $ = (e, r) => {
  const a = Object.entries(r).filter(([t]) => t in e).map(([t, n]) => [t, n(e[t])]);
  return Object.fromEntries(a);
}, p = (e, r, a, t) => ({
  default: r,
  ...$(a, t),
  kind: e
}), h = (e, r, a) => ({ default: [], ...$(r, a), kind: e }), ge = (e, r) => {
  const a = e.map((t) => t.locale === "" ? t.struct : t.locale === r ? `${t.struct}!` : "");
  return new Set(a);
}, Z = "BODY", z = "STRUCT", g = "NONE", M = (e) => {
  const r = e.split(`
`), a = { structs: [], bodies: [], structName: void 0, locale: "", lines: [], blockType: g }, t = r.reduce((n, s) => be(n, s), a);
  return {
    structs: t.structs,
    bodies: t.bodies
  };
}, be = (e, r) => {
  const a = r.trim(), t = a.match(/^\/\*~struct~([A-Za-z0-9_]*)(?::([A-Za-z0-9_-]+))?/);
  return t ? ye(e, t) : /^\/\*:/.test(a) ? Oe(e, a) : a === "*/" ? e.lines.length > 0 ? j(e) : e : { ...e, lines: e.lines.concat([a]) };
}, ye = (e, r) => {
  const a = e.lines.length > 0 ? j(e) : e, t = r[1] || void 0;
  return {
    ...a,
    structName: t,
    blockType: t ? z : "INVALID",
    locale: r[2] ?? "",
    lines: []
  };
}, he = (e) => {
  if (e) {
    const r = e.match(/^\/\*:(\w+)/);
    if (r) return r[1];
  }
  return "";
}, Oe = (e, r) => ({
  ...e.lines.length > 0 ? j(e) : e,
  locale: he(r),
  blockType: Z,
  lines: []
}), j = (e) => {
  if (e.blockType === Z) {
    const r = { locale: e.locale, lines: [...e.lines] };
    return { ...e, bodies: e.bodies.concat([r]), lines: [], blockType: g, locale: "" };
  }
  return e.structName && e.blockType === z ? { ...e, structs: e.structs.concat([{ struct: e.structName, locale: e.locale, lines: [...e.lines] }]), blockType: g, structName: void 0, locale: "", lines: [] } : {
    ...e,
    blockType: g,
    structName: void 0,
    locale: "",
    lines: []
  };
}, ve = (e) => e.currentOption ? { items: e.items.concat({ option: e.currentOption, value: e.currentOption }) } : e, k = (e) => ({
  ...typeof e.desc == "string" ? { desc: e.desc } : {},
  ...typeof e.text == "string" ? { text: e.text } : {}
}), b = (e) => {
  const r = Ae(e), a = Ce(r);
  return xe(a);
}, Ae = (e) => {
  if (e.currentParam && e.currentOption) {
    const r = e.currentParam.attr.kind;
    if (r === "select" || r === "combo") return { ...e, currentParam: { ...e.currentParam, options: ve(e.currentOption).items } };
  }
  return e;
}, xe = (e) => e.currentParam ? {
  ...e,
  params: [...e.params, e.currentParam],
  currentCommand: null,
  currentOption: null,
  currentParam: null,
  currentContext: null
} : e, Ce = (e) => {
  if (!e.currentCommand) return e;
  const r = e.currentParam ? [...e.currentCommand.args, e.currentParam] : e.currentCommand.args, a = { ...k(e.currentCommand), command: e.currentCommand.command, args: r };
  return {
    ...e,
    commands: [...e.commands, a],
    currentCommand: null,
    currentParam: null,
    currentContext: null,
    currentOption: null
  };
}, ar = (e) => {
  const r = M(e);
  return r.bodies.map((a) => ((t, n) => {
    const s = S(t);
    return {
      locale: t.locale,
      commands: s.commands,
      params: s.params,
      helpLines: s.helpLines,
      meta: s.meta,
      dependencies: s.dependencies,
      structs: n.filter((o) => o.locale === t.locale).map((o) => D(o))
    };
  })(a, r.structs));
}, W = (e, r = "") => {
  const a = M(e), t = ((o, d) => {
    const f = ge(o, d);
    return o.filter((l) => l.locale === "" && f.has(l.struct) ? !f.has(`${l.struct}!`) : l.locale === d && f.has(`${l.struct}!`));
  })(a.structs, r).map((o) => D(o)), n = ((o, d) => o.reduce((f, l) => l.locale === d || l.locale === "" && f === void 0 ? l : f, void 0))(a.bodies, r);
  if (!n) return {
    locale: r,
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    dependencies: { base: [], orderBefore: [], orderAfter: [] },
    structs: t
  };
  const s = S(n);
  return {
    locale: n.locale,
    params: s.params,
    commands: s.commands,
    meta: s.meta,
    helpLines: s.helpLines,
    structs: t,
    dependencies: s.dependencies
  };
}, D = (e) => {
  const r = S(e);
  return { name: e.struct, params: r.params };
}, S = (e) => {
  const r = e.lines.reduce((a, t) => ke(a, t), Pe());
  return b(r);
}, Pe = () => ({ helpLines: [], params: [], commands: [], currentParam: null, currentCommand: null, currentContext: null, currentOption: null, dependencies: {
  base: [],
  orderBefore: [],
  orderAfter: []
}, meta: {} }), ke = (e, r, a = Ne) => {
  const t = r.trimEnd().replace(/^[\*\s]*/, "");
  if (!t.startsWith("@")) return e.currentContext === J ? { ...e, helpLines: e.helpLines.concat(t) } : e;
  const n = t.match(/^@(\S+)\s*(.*)$/);
  if (!n) return e;
  const [, s, o] = n, d = a[s];
  return d ? d(e, o.trim()) : e;
}, m = (e, r, a) => e.currentParam && !(r in e.currentParam.attr) ? { ...e, currentParam: {
  ...e.currentParam,
  attr: { ...e.currentParam.attr, [r]: a }
} } : e, C = (e, r, a) => ({ ...e, meta: { [r]: a, ...e.meta } }), Ne = {
  param: (e, r) => {
    const a = b(e);
    return a.params.some((t) => t.name === r) ? a : {
      ...a,
      currentContext: q,
      currentParam: { name: r, attr: {} }
    };
  },
  text: (e, r) => e.currentParam ? m(e, x, r) : e.currentCommand && !(x in e.currentCommand) ? { ...e, currentCommand: {
    ...k(e.currentCommand),
    command: e.currentCommand.command,
    args: e.currentCommand.args,
    [x]: r
  } } : e,
  desc: (e, r) => e.currentParam ? m(e, ne, r) : e.currentCommand ? { ...e, currentCommand: { ...e.currentCommand, desc: r } } : e,
  command: (e, r) => {
    const a = b(e);
    return a.commands.some((t) => t.command === r) ? a : { ...a, currentCommand: { command: r, args: [] }, currentParam: null };
  },
  arg: (e, r) => {
    if (!e.currentCommand) return e;
    if (!e.currentParam) return { ...e, currentParam: { name: r, attr: {} } };
    const a = { ...k(e.currentCommand), command: e.currentCommand.command, args: e.currentCommand.args.concat(e.currentParam) };
    return { ...e, commands: e.commands, currentCommand: a, currentContext: Q, currentParam: { name: r, attr: {} } };
  },
  help: (e) => ({ ...b(e), currentContext: J }),
  option: (e, r) => {
    if (!e.currentParam) return e;
    const a = ((t, n) => t.currentOption ? { items: t.items.concat({ option: t.currentOption, value: t.currentOption }), currentOption: n } : { items: t.items, currentOption: n })(e.currentOption ?? {
      items: []
    }, r);
    return { ...e, currentOption: a };
  },
  value: (e, r) => {
    if (!e.currentOption) return e;
    const a = ((t, n) => t.currentOption ? { items: t.items.concat({ option: t.currentOption, value: n }) } : {
      items: t.items
    })(e.currentOption, r);
    return { ...e, currentOption: a };
  },
  type: (e, r) => {
    if (((a) => a.endsWith(">") && a.startsWith("struct<"))(r)) {
      const a = r.slice(7, -1), t = m(e, E, a);
      return m(t, P, E);
    }
    return e.currentParam ? m(e, P, r) : e;
  },
  parent: (e, r) => m(e, te, r),
  default: (e, r) => m(e, ae, r),
  on: (e, r) => m(e, re, r),
  off: (e, r) => m(e, ee, r),
  min: (e, r) => m(e, K, r),
  max: (e, r) => m(e, H, r),
  decimals: (e, r) => m(e, G, r),
  dir: (e, r) => m(e, X, r),
  base: (e, r) => {
    return { ...e, dependencies: (a = e.dependencies, t = r, { orderAfter: a.orderAfter, orderBefore: a.orderBefore, base: a.base.concat(t) }) };
    var a, t;
  },
  orderAfter: (e, r) => {
    return { ...e, dependencies: (a = e.dependencies, t = r, { base: a.base, orderBefore: a.orderBefore, orderAfter: a.orderAfter.concat(t) }) };
    var a, t;
  },
  orderBefore: (e, r) => {
    return { ...e, dependencies: (a = e.dependencies, t = r, { base: a.base, orderAfter: a.orderAfter, orderBefore: a.orderBefore.concat(t) }) };
    var a, t;
  },
  author: (e, r) => C(e, oe, r),
  plugindesc: (e, r) => C(e, ce, r),
  url: (e, r) => C(e, se, r)
}, je = { notNumber: "isNaN", notInteger: "notInteger" }, R = (e, r, a = je) => {
  if (P in e.attr) {
    const t = we[e.attr.kind];
    if (t) return t(e, r, a);
  }
  return {
    name: e.name,
    attr: p("any", "", e.attr, O)
  };
}, c = (e) => e, U = (e) => e.replace("[", "").replace("]", "").split(",").map((r) => parseFloat(r.replaceAll('"', "").trim())).filter((r) => !isNaN(r)), O = {
  default: c,
  text: c,
  desc: c,
  parent: c
}, Se = (e) => ({ option: e.option, value: e.value }), L = (e, r) => ({ name: e.name, attr: p(r, "", e.attr, O) }), I = (e, r, a) => {
  const { value: t, errors: n } = r.parseStringArray(e.attr.default || "[]", e), s = { default: () => t, text: c, desc: c, parent: c };
  return { name: e.name, attr: h(a, e.attr, s), ...N(n) };
}, u = (e, r) => {
  const a = {
    default: (t) => U(t),
    text: c,
    desc: c,
    parent: c
  };
  return { name: e.name, attr: h(r, e.attr, a) };
}, i = (e, r) => {
  const a = { default: (t) => parseInt(t, 10), text: c, desc: c, parent: c };
  return {
    name: e.name,
    attr: p(r, 0, e.attr, a)
  };
}, N = (e) => e.length > 0 ? { errors: e } : {}, we = {
  actor: (e) => i(e, "actor"),
  "actor[]": (e) => u(e, "actor[]"),
  class: (e) => i(e, "class"),
  "class[]": (e) => u(e, "class[]"),
  skill: (e) => i(e, "skill"),
  "skill[]": (e) => u(e, "skill[]"),
  item: (e) => i(e, "item"),
  "item[]": (e) => u(e, "item[]"),
  weapon: (e) => i(e, "weapon"),
  "weapon[]": (e) => u(e, "weapon[]"),
  armor: (e) => i(e, "armor"),
  "armor[]": (e) => u(e, "armor[]"),
  state: (e) => i(e, "state"),
  "state[]": (e) => u(e, "state[]"),
  enemy: (e) => i(e, "enemy"),
  "enemy[]": (e) => u(e, "enemy[]"),
  common_event: (e) => i(e, "common_event"),
  "common_event[]": (e) => u(e, "common_event[]"),
  switch: (e) => i(e, "switch"),
  "switch[]": (e) => u(e, "switch[]"),
  variable: (e) => i(e, "variable"),
  "variable[]": (e) => u(e, "variable[]"),
  troop: (e) => i(e, "troop"),
  "troop[]": (e) => u(e, "troop[]"),
  file: (e) => {
    const r = { default: c, text: c, desc: c, parent: c, dir: c };
    return { name: e.name, attr: { dir: "", ...p("file", "", e.attr, r) } };
  },
  "file[]": (e, r) => {
    const { value: a } = r.parseStringArray(e.attr.default || "[]", e), t = { default: () => a, text: c, desc: c, parent: c, dir: c };
    return { name: e.name, attr: {
      dir: "",
      ...h("file[]", e.attr, t)
    } };
  },
  combo: (e) => {
    var a;
    const r = ((a = e.options) == null ? void 0 : a.map((t) => t.option)) ?? [];
    return { name: e.name, attr: { ...p("combo", "", e.attr, O), options: r } };
  },
  select: (e) => {
    const r = e.options ? e.options.map(Se) : [];
    return { name: e.name, attr: { ...p("select", "", e.attr, O), options: r } };
  },
  struct: (e, r) => {
    const { errors: a, value: t } = r.parseObject(e.attr.default || "{}", e), n = { text: c, desc: c, parent: c }, s = a.length === 0 ? t : {};
    return { name: e.name, attr: {
      struct: e.attr.struct || "",
      ...p("struct", s, e.attr, n),
      ...N(a)
    } };
  },
  "struct[]": (e, r) => {
    const { errors: a, value: t } = r.parseObjectArray(e.attr.default || "[]", e), n = { text: c, desc: c, parent: c }, s = a.length === 0 ? t : [];
    return { name: e.name, attr: { struct: e.attr.struct || "", ...p("struct[]", s, e.attr, n), ...N(a) } };
  },
  boolean: (e) => {
    const r = { default: (a) => a === "true", text: c, desc: c, on: c, off: c, parent: c };
    return { name: e.name, attr: p("boolean", !0, e.attr, r) };
  },
  number: (e, r, a) => {
    const t = {
      default: (s) => parseFloat(s),
      text: c,
      desc: c,
      decimals: (s) => parseInt(s, 10),
      min: (s) => parseFloat(s),
      max: (s) => parseFloat(s),
      parent: c
    }, n = p("number", 0, e.attr, t);
    return isNaN(n.default) ? { name: e.name, attr: n, errors: [{
      source: e.attr.default || "",
      message: a.notNumber,
      code: "notNumber",
      attr: "default"
    }] } : { name: e.name, attr: n };
  },
  "number[]": (e) => {
    const r = { default: (a) => U(a), text: c, desc: c, decimals: (a) => parseInt(a, 10), min: (a) => parseFloat(a), max: (a) => parseFloat(a), parent: c };
    return { name: e.name, attr: h("number[]", e.attr, r) };
  },
  string: (e) => L(e, "string"),
  "string[]": (e, r) => I(e, r, "string[]"),
  multiline_string: (e) => L(e, "multiline_string"),
  "multiline_string[]": (e, r) => I(e, r, "multiline_string[]")
}, tr = (e) => V(e), nr = (e) => JSON.stringify(V(e)), y = (e) => typeof e == "object" && e !== null && !Array.isArray(e), V = (e) => Array.isArray(e) ? _e(e) : y(e) ? v(e) : {}, v = (e) => y(e) ? Object.fromEntries(Object.entries(e).map(([r, a]) => {
  if (Array.isArray(a)) {
    const t = a.map((n) => y(n) ? JSON.stringify(v(n)) : String(n));
    return [r, JSON.stringify(t)];
  }
  return y(a) ? [r, JSON.stringify(v(a))] : [r, String(a)];
})) : {}, _e = (e) => e.map((r) => typeof r == "object" && r !== null ? JSON.stringify(v(r)) : String(r)), w = () => ({ parseStringArray: (e) => ({ value: Be(e), errors: [] }), parseObjectArray: () => ({
  value: [],
  errors: []
}), parseObject: (e) => ({ value: me(e), errors: [] }) }), Be = (e) => {
  try {
    const r = JSON.parse(e);
    if (Array.isArray(r) && r.every((a) => typeof a == "string")) return r;
  } catch {
  }
  return [];
}, Te = (e, r = w()) => ({ params: _(e.params, r), commands: Ee(e.commands, r), structs: Le(e.structs, r) }), _ = (e, r) => e.map((a) => R(a, r)), Ee = (e, r) => e.map((a) => ({
  command: a.command,
  desc: a.desc,
  text: a.text,
  args: _(a.args, r)
})), Le = (e, r) => e.map((a) => ({ struct: a.name, params: _(a.params, r) })), Ie = (e, r) => {
  const a = function(t) {
    return Object.fromEntries(t.map((n) => [n.struct, n.params.filter(F)]));
  }(e);
  return function(t, n, s) {
    return t.reduce((o) => {
      if (!o.changed) return o;
      const d = t.filter((f) => !o.names.has(f) && n[f].some((l) => o.names.has(l.attr.struct)));
      return d.length === 0 ? { names: o.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...o.names, ...d]), changed: !0 };
    }, {
      names: s,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(r));
}, sr = (e) => A(e, ie), cr = (e) => A(e, le), or = (e) => A(e, ue), mr = (e) => A(e, de), A = (e, r) => {
  const a = e.structs.filter((s) => s.params.some((o) => r(o))), t = new Set(a.map((s) => s.struct)), n = Ie(e.structs, t);
  return {
    structs: Je(e.structs, n, r),
    commands: Fe(e.commands, n, r),
    params: B(e.params, n, r)
  };
}, B = (e, r, a) => e.filter((t) => F(t) ? r.has(t.attr.struct) : a(t)), Je = (e, r, a) => e.map((t) => ({
  struct: t.struct,
  params: B(t.params, r, a)
})).filter((t) => t.params.length > 0), Fe = (e, r, a) => e.map((t) => ({
  ...t.desc ? { desc: t.desc } : {},
  ...t.text ? { text: t.text } : {},
  command: t.command,
  args: B(t.args, r, a)
})).filter((t) => t.args.length > 0), $e = {
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
}, Ze = ["data", "system", "system"], ze = (e) => {
  const r = $e[e];
  return r === void 0 ? { author: "rmmz", module: "unknown", kind: e } : { author: "rmmz", module: Ze[r], kind: [e, "variable", "switch"][r] };
}, ur = (e) => {
  const r = ze(e.kind);
  return r.author === e.author && r.module === e.module && r.kind === e.kind;
}, ir = (e) => (e.attr.kind === "struct" || e.attr.kind === "struct[]") && !!Array.isArray(e.errors) && e.errors.length > 0, Y = (e, r, a) => {
  const t = r.get(e);
  return t ? t.filter((n) => ((s, o) => !(!pe(s) && !fe(s) || !s.struct || o.has(s.struct)))(n, a)).flatMap((n) => {
    const s = n.struct;
    return a.add(s), [s, ...Y(s, r, a)];
  }) : [];
}, lr = (e, r) => Y(e, r, /* @__PURE__ */ new Set()), Me = (e) => !Array.isArray(e) && typeof e == "object" && e !== null && !!(We(e) && De(e) && Re(e) && "parameters" in e) && Ue(e), We = (e) => "name" in e && typeof e.name == "string", De = (e) => "status" in e && typeof e.status == "boolean", Re = (e) => "description" in e && typeof e.description == "string", Ue = (e) => typeof e.parameters == "object" && e.parameters !== null && Object.values(e.parameters).every((r) => typeof r == "string"), Ve = /\s*\/\//, Ye = /\s*[var|let|const]\s+[^\s]+\s*=/, qe = /^\s{0,3}[\[|\]\;]/, Qe = (e) => e.split(`
`).filter((r) => !((a) => Ve.test(a) || qe.test(a) || Ye.test(a))(r)), dr = (e, r) => {
  const a = `[${Qe(e).join("")}]`;
  try {
    const t = JSON.parse(a);
    if (!Array.isArray(t)) return { complete: !1, plugins: [], message: r.notArray, invalidPlugins: 0 };
    const n = t.filter(Me), s = t.length - n.length;
    return { complete: s === 0, plugins: n, invalidPlugins: s, message: s <= 0 ? r.success : r.partialSuccess };
  } catch (t) {
    return {
      complete: !1,
      plugins: [],
      invalidPlugins: 0,
      message: r.parseError,
      error: t
    };
  }
}, pr = (e, r) => {
  const a = Ge(r);
  return e.map((t) => ({ description: t.description, name: t.name, status: t.status, parameters: Xe(t, a) }));
}, Xe = (e, r) => {
  const a = r.get(e.name);
  if (!a) return e.parameters;
  const t = Object.entries(e.parameters).filter(([n]) => !a.has(n));
  return Object.fromEntries(t);
}, Ge = (e) => new Map(e.map((r) => [r.pluginName, new Set(r.params)])), He = (e) => {
  const r = w();
  return {
    target: "MZ",
    meta: e.meta,
    commands: Ke(e.commands, r),
    params: T(e.params, r),
    structs: er(e.structs, r)
  };
}, T = (e, r) => Object.fromEntries(e.map((a) => {
  const t = R(a, r);
  return [a.name, t.attr];
})), Ke = (e, r) => Object.fromEntries(e.map((a) => [a.command, {
  desc: a.desc,
  text: a.text,
  args: T(a.args, r)
}])), er = (e, r) => Object.fromEntries(e.map((a) => [a.name, { params: T(a.params, r) }])), fr = (e) => ((r) => He(W(r, "")))(e), gr = (e, r = w()) => {
  const a = W(e.source, e.locale);
  return { locale: e.locale, meta: a.meta, pluginName: e.pluginName, target: "MZ", dependencies: a.dependencies, schema: Te(a, r) };
};
export {
  W as a,
  Te as b,
  w as c,
  Ie as d,
  Qe as e,
  sr as f,
  mr as g,
  cr as h,
  A as i,
  or as j,
  ir as k,
  ur as l,
  ze as m,
  ar as n,
  pr as o,
  dr as p,
  gr as q,
  fr as r,
  Fe as s,
  nr as t,
  tr as u,
  lr as v,
  Me as w
};
