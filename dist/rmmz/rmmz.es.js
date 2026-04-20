import { j as D, A as H, k as Q, q as X, o as G, z as tt, x as et, R as F, S as at, T as S, U as rt, V as nt, W as E, X as x, O as st, P as ct, Q as ot, Y as mt, Z as it, _ as ut, $ as lt, a0 as pt, a1 as dt, a2 as ft, a3 as gt, C as yt } from "../shared/constants.es.js";
import { c as he, a as Oe, b as Ae, d as Se, e as ve, f as xe, g as Ne, h as Ce, i as ke, l as je, m as we, n as Te, p as Be, r as Ee, s as Je, t as _e, u as De, v as Fe, w as Ve, y as Ie, B as Le, D as Re, E as $e, F as ze, G as Me } from "../shared/constants.es.js";
const Pt = (t, e) => {
  const a = function(r) {
    return Object.fromEntries(r.map((n) => [n.struct, n.params.filter(D)]));
  }(t);
  return function(r, n, s) {
    return r.reduce((o) => {
      if (!o.changed) return o;
      const u = r.filter((d) => !o.names.has(d) && n[d].some((m) => o.names.has(m.attr.struct)));
      return u.length === 0 ? { names: o.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...o.names, ...u]), changed: !0 };
    }, {
      names: s,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, re = (t) => A(t, Q), ne = (t) => A(t, X), se = (t) => A(t, H), ce = (t) => A(t, G), A = (t, e) => {
  const a = t.structs.filter((s) => s.params.some((o) => e(o))), r = new Set(a.map((s) => s.struct)), n = Pt(t.structs, r);
  return {
    structs: bt(t.structs, n, e),
    commands: ht(t.commands, n, e),
    params: k(t.params, n, e)
  };
}, k = (t, e, a) => t.filter((r) => D(r) ? e.has(r.attr.struct) : a(r)), bt = (t, e, a) => t.map((r) => ({
  struct: r.struct,
  params: k(r.params, e, a)
})).filter((r) => r.params.length > 0), ht = (t, e, a) => t.map((r) => ({
  ...r.desc ? { desc: r.desc } : {},
  ...r.text ? { text: r.text } : {},
  command: r.command,
  args: k(r.args, e, a)
})).filter((r) => r.args.length > 0), Ot = {
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
}, At = ["data", "system", "system"], St = (t) => {
  const e = Ot[t];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: t } : { author: "rmmz", module: At[e], kind: [t, "variable", "switch"][e] };
}, oe = (t) => {
  const e = St(t.kind);
  return e.author === t.author && e.module === t.module && e.kind === t.kind;
}, me = (t) => (t.attr.kind === "struct" || t.attr.kind === "struct[]") && !!Array.isArray(t.errors) && t.errors.length > 0, V = (t, e, a) => {
  const r = e.get(t);
  return r ? r.filter((n) => ((s, o) => !(!tt(s) && !et(s) || !s.struct || o.has(s.struct)))(n, a)).flatMap((n) => {
    const s = n.struct;
    return a.add(s), [s, ...V(s, e, a)];
  }) : [];
}, ie = (t, e) => V(t, e, /* @__PURE__ */ new Set()), ue = (t) => I(t), le = (t) => JSON.stringify(I(t)), g = (t) => typeof t == "object" && t !== null && !Array.isArray(t), I = (t) => Array.isArray(t) ? vt(t) : g(t) ? b(t) : {}, b = (t) => g(t) ? Object.fromEntries(Object.entries(t).map(([e, a]) => {
  if (Array.isArray(a)) {
    const r = a.map((n) => g(n) ? JSON.stringify(b(n)) : String(n));
    return [e, JSON.stringify(r)];
  }
  return g(a) ? [e, JSON.stringify(b(a))] : [e, String(a)];
})) : {}, vt = (t) => t.map((e) => typeof e == "object" && e !== null ? JSON.stringify(b(e)) : String(e)), L = (t) => !Array.isArray(t) && typeof t == "object" && t !== null && !!(xt(t) && Nt(t) && Ct(t) && "parameters" in t) && kt(t), xt = (t) => "name" in t && typeof t.name == "string", Nt = (t) => "status" in t && typeof t.status == "boolean", Ct = (t) => "description" in t && typeof t.description == "string", kt = (t) => typeof t.parameters == "object" && t.parameters !== null && Object.values(t.parameters).every((e) => typeof e == "string"), jt = /\s*\/\//, wt = /\s*[var|let|const]\s+[^\s]+\s*=/, Tt = /^\s{0,3}[\[|\]\;]/, R = (t) => t.split(`
`).filter((e) => !((a) => jt.test(a) || Tt.test(a) || wt.test(a))(e)), pe = (t) => {
  const e = `[${R(t).join("")}]`, a = JSON.parse(e);
  if (!Array.isArray(a)) throw new Error("Parsed value is not an array");
  if (a.every(L)) return a;
  throw new Error("Parsed value is not PluginParamsObject array");
}, de = (t, e) => {
  const a = `[${R(t).join("")}]`;
  try {
    const r = JSON.parse(a);
    if (!Array.isArray(r)) return {
      complete: !1,
      plugins: [],
      message: e.notArray,
      invalidPlugins: 0
    };
    const n = r.filter(L), s = r.length - n.length;
    return { complete: s === 0, plugins: n, invalidPlugins: s, message: s <= 0 ? e.success : e.partialSuccess };
  } catch (r) {
    return { complete: !1, plugins: [], invalidPlugins: 0, message: e.parseError, error: r };
  }
}, fe = (t, e) => {
  const a = Et(e);
  return t.map((r) => ({
    description: r.description,
    name: r.name,
    status: r.status,
    parameters: Bt(r, a)
  }));
}, Bt = (t, e) => {
  const a = e.get(t.name);
  if (!a) return t.parameters;
  const r = Object.entries(t.parameters).filter(([n]) => !a.has(n));
  return Object.fromEntries(r);
}, Et = (t) => new Map(t.map((e) => [e.pluginName, new Set(e.params)])), $ = (t, e) => {
  const a = Object.entries(e).filter(([r]) => r in t).map(([r, n]) => [r, n(t[r])]);
  return Object.fromEntries(a);
}, f = (t, e, a, r) => ({ default: e, ...$(a, r), kind: t }), h = (t, e, a) => ({ default: [], ...$(e, a), kind: t }), Jt = (t, e) => {
  const a = t.map((r) => r.locale === "" ? r.struct : r.locale === e ? `${r.struct}!` : "");
  return new Set(a);
}, z = "BODY", M = "STRUCT", y = "NONE", _t = (t, e) => {
  const a = e.trim(), r = a.match(/^\/\*~struct~([A-Za-z0-9_]*)(?::([A-Za-z0-9_-]+))?/);
  return r ? Dt(t, r) : /^\/\*:/.test(a) ? Vt(t, a) : a === "*/" ? t.lines.length > 0 ? j(t) : t : {
    ...t,
    lines: t.lines.concat([a])
  };
}, Dt = (t, e) => {
  const a = t.lines.length > 0 ? j(t) : t, r = e[1] || void 0;
  return { ...a, structName: r, blockType: r ? M : "INVALID", locale: e[2] ?? "", lines: [] };
}, Ft = (t) => {
  if (t) {
    const e = t.match(/^\/\*:(\w+)/);
    if (e) return e[1];
  }
  return "";
}, Vt = (t, e) => ({ ...t.lines.length > 0 ? j(t) : t, locale: Ft(e), blockType: z, lines: [] }), j = (t) => {
  if (t.blockType === z) {
    const e = {
      locale: t.locale,
      lines: [...t.lines]
    };
    return { ...t, bodies: t.bodies.concat([e]), lines: [], blockType: y, locale: "" };
  }
  return t.structName && t.blockType === M ? { ...t, structs: t.structs.concat([{
    struct: t.structName,
    locale: t.locale,
    lines: [...t.lines]
  }]), blockType: y, structName: void 0, locale: "", lines: [] } : { ...t, blockType: y, structName: void 0, locale: "", lines: [] };
}, It = (t) => t.currentOption ? { items: t.items.concat({ option: t.currentOption, value: t.currentOption }) } : t, N = (t) => ({ ...typeof t.desc == "string" ? { desc: t.desc } : {}, ...typeof t.text == "string" ? {
  text: t.text
} : {} }), P = (t) => {
  const e = Lt(t), a = $t(e);
  return Rt(a);
}, Lt = (t) => {
  if (t.currentParam && t.currentOption) {
    const e = t.currentParam.attr.kind;
    if (e === "select" || e === "combo") return {
      ...t,
      currentParam: { ...t.currentParam, options: It(t.currentOption).items }
    };
  }
  return t;
}, Rt = (t) => t.currentParam ? {
  ...t,
  params: [...t.params, t.currentParam],
  currentCommand: null,
  currentOption: null,
  currentParam: null,
  currentContext: null
} : t, $t = (t) => {
  if (!t.currentCommand) return t;
  const e = t.currentParam ? [...t.currentCommand.args, t.currentParam] : t.currentCommand.args, a = {
    ...N(t.currentCommand),
    command: t.currentCommand.command,
    args: e
  };
  return {
    ...t,
    commands: [...t.commands, a],
    currentCommand: null,
    currentParam: null,
    currentContext: null,
    currentOption: null
  };
}, Z = (t, e = "") => {
  const a = ((o) => {
    const u = o.split(`
`), d = { structs: [], bodies: [], structName: void 0, locale: "", lines: [], blockType: y }, m = u.reduce((Y, q) => _t(Y, q), d);
    return {
      structs: m.structs,
      bodies: m.bodies
    };
  })(t), r = ((o, u) => {
    const d = Jt(o, u);
    return o.filter((m) => m.locale === "" && d.has(m.struct) ? !d.has(`${m.struct}!`) : m.locale === u && d.has(`${m.struct}!`));
  })(a.structs, e).map((o) => zt(o)), n = ((o, u) => o.reduce((d, m) => m.locale === u || m.locale === "" && d === void 0 ? m : d, void 0))(a.bodies, e);
  if (!n) return {
    locale: e,
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    dependencies: { base: [], orderBefore: [], orderAfter: [] },
    structs: r
  };
  const s = W(n);
  return {
    locale: n.locale,
    params: s.params,
    commands: s.commands,
    meta: s.meta,
    helpLines: s.helpLines,
    structs: r,
    dependencies: s.dependencies
  };
}, zt = (t) => {
  const e = W(t);
  return { name: t.struct, params: e.params };
}, W = (t) => {
  const e = t.lines.reduce((a, r) => Zt(a, r), Mt());
  return P(e);
}, Mt = () => ({ helpLines: [], params: [], commands: [], currentParam: null, currentCommand: null, currentContext: null, currentOption: null, dependencies: {
  base: [],
  orderBefore: [],
  orderAfter: []
}, meta: {} }), Zt = (t, e, a = Wt) => {
  const r = e.trimEnd().replace(/^[\*\s]*/, "");
  if (!r.startsWith("@")) return t.currentContext === F ? { ...t, helpLines: t.helpLines.concat(r) } : t;
  const n = r.match(/^@(\S+)\s*(.*)$/);
  if (!n) return t;
  const [, s, o] = n, u = a[s];
  return u ? u(t, o.trim()) : t;
}, i = (t, e, a) => t.currentParam && !(e in t.currentParam.attr) ? { ...t, currentParam: {
  ...t.currentParam,
  attr: { ...t.currentParam.attr, [e]: a }
} } : t, v = (t, e, a) => ({ ...t, meta: { [e]: a, ...t.meta } }), Wt = {
  param: (t, e) => {
    const a = P(t);
    return a.params.some((r) => r.name === e) ? a : {
      ...a,
      currentContext: rt,
      currentParam: { name: e, attr: {} }
    };
  },
  text: (t, e) => t.currentParam ? i(t, S, e) : t.currentCommand && !(S in t.currentCommand) ? { ...t, currentCommand: {
    ...N(t.currentCommand),
    command: t.currentCommand.command,
    args: t.currentCommand.args,
    [S]: e
  } } : t,
  desc: (t, e) => t.currentParam ? i(t, nt, e) : t.currentCommand ? { ...t, currentCommand: { ...t.currentCommand, desc: e } } : t,
  command: (t, e) => {
    const a = P(t);
    return a.commands.some((r) => r.command === e) ? a : { ...a, currentCommand: { command: e, args: [] }, currentParam: null };
  },
  arg: (t, e) => {
    if (!t.currentCommand) return t;
    if (!t.currentParam) return { ...t, currentParam: { name: e, attr: {} } };
    const a = { ...N(t.currentCommand), command: t.currentCommand.command, args: t.currentCommand.args.concat(t.currentParam) };
    return { ...t, commands: t.commands, currentCommand: a, currentContext: at, currentParam: { name: e, attr: {} } };
  },
  help: (t) => ({ ...P(t), currentContext: F }),
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
  parent: (t, e) => i(t, gt, e),
  default: (t, e) => i(t, ft, e),
  on: (t, e) => i(t, dt, e),
  off: (t, e) => i(t, pt, e),
  min: (t, e) => i(t, lt, e),
  max: (t, e) => i(t, ut, e),
  decimals: (t, e) => i(t, it, e),
  dir: (t, e) => i(t, mt, e),
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
  author: (t, e) => v(t, ot, e),
  plugindesc: (t, e) => v(t, ct, e),
  url: (t, e) => v(t, st, e)
}, Kt = { notNumber: "isNaN", notInteger: "notInteger" }, K = (t, e, a = Kt) => {
  if (x in t.attr) {
    const r = Yt[t.attr.kind];
    if (r) return r(t, e, a);
  }
  return { name: t.name, attr: f("any", "", t.attr, O) };
}, c = (t) => t, U = (t) => t.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), O = {
  default: c,
  text: c,
  desc: c,
  parent: c
}, Ut = (t) => ({ option: t.option, value: t.value }), J = (t, e) => ({ name: t.name, attr: f(e, "", t.attr, O) }), _ = (t, e, a) => {
  const { value: r, errors: n } = e.parseStringArray(t.attr.default || "[]", t), s = {
    default: () => r,
    text: c,
    desc: c,
    parent: c
  };
  return { name: t.name, attr: h(a, t.attr, s), ...C(n) };
}, l = (t, e) => {
  const a = { default: (r) => U(r), text: c, desc: c, parent: c };
  return {
    name: t.name,
    attr: h(e, t.attr, a)
  };
}, p = (t, e) => {
  const a = { default: (r) => parseInt(r, 10), text: c, desc: c, parent: c };
  return { name: t.name, attr: f(e, 0, t.attr, a) };
}, C = (t) => t.length > 0 ? { errors: t } : {}, Yt = {
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
    return { name: t.name, attr: { dir: "", ...h("file[]", t.attr, r) } };
  },
  combo: (t) => {
    var a;
    const e = ((a = t.options) == null ? void 0 : a.map((r) => r.option)) ?? [];
    return { name: t.name, attr: { ...f("combo", "", t.attr, O), options: e } };
  },
  select: (t) => {
    const e = t.options ? t.options.map(Ut) : [];
    return {
      name: t.name,
      attr: { ...f("select", "", t.attr, O), options: e }
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
      default: (a) => U(a),
      text: c,
      desc: c,
      decimals: (a) => parseInt(a, 10),
      min: (a) => parseFloat(a),
      max: (a) => parseFloat(a),
      parent: c
    };
    return { name: t.name, attr: h("number[]", t.attr, e) };
  },
  string: (t) => J(t, "string"),
  "string[]": (t, e) => _(t, e, "string[]"),
  multiline_string: (t) => J(t, "multiline_string"),
  "multiline_string[]": (t, e) => _(t, e, "multiline_string[]")
}, w = () => ({ parseStringArray: (t) => ({
  value: qt(t),
  errors: []
}), parseObjectArray: () => ({ value: [], errors: [] }), parseObject: (t) => ({ value: yt(t), errors: [] }) }), qt = (t) => {
  try {
    const e = JSON.parse(t);
    if (Array.isArray(e) && e.every((a) => typeof a == "string")) return e;
  } catch {
  }
  return [];
}, Ht = (t) => {
  const e = w();
  return {
    target: "MZ",
    meta: t.meta,
    commands: Qt(t.commands, e),
    params: T(t.params, e),
    structs: Xt(t.structs, e)
  };
}, T = (t, e) => Object.fromEntries(t.map((a) => {
  const r = K(a, e);
  return [a.name, r.attr];
})), Qt = (t, e) => Object.fromEntries(t.map((a) => [a.command, {
  desc: a.desc,
  text: a.text,
  args: T(a.args, e)
}])), Xt = (t, e) => Object.fromEntries(t.map((a) => [a.name, { params: T(a.params, e) }])), Gt = (t, e = w()) => ({
  params: B(t.params, e),
  commands: te(t.commands, e),
  structs: ee(t.structs, e)
}), B = (t, e) => t.map((a) => K(a, e)), te = (t, e) => t.map((a) => ({ command: a.command, desc: a.desc, text: a.text, args: B(a.args, e) })), ee = (t, e) => t.map((a) => ({
  struct: a.name,
  params: B(a.params, e)
})), ge = (t) => ((e) => Ht(Z(e, "")))(t), ye = (t, e = w()) => {
  const a = Z(t.source, t.locale);
  return {
    locale: t.locale,
    meta: a.meta,
    pluginName: t.pluginName,
    target: "MZ",
    dependencies: a.dependencies,
    schema: Gt(a, e)
  };
};
export {
  he as classifyFileParams,
  Oe as classifyPluginParams,
  Ae as classifyTextParams,
  Pt as collectDependentStructNames,
  Se as convertPluginCommandSchema,
  R as convertPluginsJSToJSON,
  ve as convertStructSchema,
  xe as createClassifiedStructMap,
  Ne as createStructMap,
  re as filterPluginParamByText,
  ce as filterPluginSchemaByFileParam,
  ne as filterPluginSchemaByNumberParam,
  A as filterPluginSchemaByParam,
  se as filterPluginSchemaByVariableParam,
  Ce as hasNumberValueParam,
  ke as hasScalarAttr,
  D as hasStructAttr,
  Q as hasTextAttr,
  je as isArrayAttr,
  we as isArrayParam,
  Te as isArrayParamEx,
  me as isErrorStructParam,
  G as isFileAttr,
  Be as isNumberArrayParam,
  X as isNumberAttr,
  Ee as isNumberValueParam,
  Je as isNumberValueParamEx,
  oe as isRmmzDataKind,
  _e as isScalarParam,
  De as isStringArrayParam,
  Fe as isStringValueParam,
  Ve as isStructArrayAttr,
  et as isStructArrayParam,
  Ie as isStructAttr,
  tt as isStructParam,
  H as isVariableAttr,
  St as lookupKind,
  fe as omitPluginParam,
  Le as paramHasText,
  yt as parseDeepJSON,
  Re as parseDeepRecord,
  pe as parsePluginParamRecord,
  de as parsePluginParamRecord2,
  ye as pluginSourceToArraySchema,
  ge as pluginSourceToJSON,
  ht as rebuildCommands,
  le as stringifyDeepJSON,
  ue as stringifyDeepRecord,
  ie as structDependencies,
  $e as toArrayPluginParam,
  ze as toObjectPluginParams,
  Me as toObjectPluginParamsOld,
  L as validatePluginJS
};
