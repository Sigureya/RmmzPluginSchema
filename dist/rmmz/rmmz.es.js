import { j as D, A as H, k as Q, q as X, o as G, z as tt, x as et, R as x, C as at, S as F, T as rt, U as A, V as nt, W as st, X as E, O as ct, P as ot, Q as mt, Y as it, Z as ut, _ as lt, $ as dt, a0 as pt, a1 as ft, a2 as gt, a3 as yt } from "../shared/constants.es.js";
import { c as be, a as he, b as ve, d as Oe, e as Ae, f as Se, g as xe, h as Ce, i as Ne, l as ke, m as je, n as we, p as Te, r as Be, s as Ee, t as Je, u as _e, v as De, w as Fe, y as Ve, B as Le, D as Re, E as $e, F as ze, G as Me } from "../shared/constants.es.js";
const Pt = (t, e) => {
  const a = function(r) {
    return Object.fromEntries(r.map((n) => [n.struct, n.params.filter(D)]));
  }(t);
  return function(r, n, c) {
    return r.reduce((o) => {
      if (!o.changed) return o;
      const u = r.filter((p) => !o.names.has(p) && n[p].some((m) => o.names.has(m.attr.struct)));
      return u.length === 0 ? { names: o.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...o.names, ...u]), changed: !0 };
    }, {
      names: c,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, ae = (t) => O(t, Q), re = (t) => O(t, X), ne = (t) => O(t, H), se = (t) => O(t, G), O = (t, e) => {
  const a = t.structs.filter((c) => c.params.some((o) => e(o))), r = new Set(a.map((c) => c.struct)), n = Pt(t.structs, r);
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
})).filter((r) => r.args.length > 0), vt = {
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
}, Ot = ["data", "system", "system"], At = (t) => {
  const e = vt[t];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: t } : { author: "rmmz", module: Ot[e], kind: [t, "variable", "switch"][e] };
}, ce = (t) => {
  const e = At(t.kind);
  return e.author === t.author && e.module === t.module && e.kind === t.kind;
}, oe = (t) => (t.kind === "struct" || t.kind === "struct[]") && !!Array.isArray(t.errors) && t.errors.length > 0, V = (t, e, a) => {
  const r = e.get(t);
  return r ? r.filter((n) => ((c, o) => !(!tt(c) && !et(c) || !c.struct || o.has(c.struct)))(n, a)).flatMap((n) => {
    const c = n.struct;
    return a.add(c), [c, ...V(c, e, a)];
  }) : [];
}, me = (t, e) => V(t, e, /* @__PURE__ */ new Set()), ie = (t) => L(t), ue = (t) => JSON.stringify(L(t)), g = (t) => typeof t == "object" && t !== null && !Array.isArray(t), L = (t) => Array.isArray(t) ? St(t) : g(t) ? b(t) : {}, b = (t) => g(t) ? Object.fromEntries(Object.entries(t).map(([e, a]) => {
  if (Array.isArray(a)) {
    const r = a.map((n) => g(n) ? JSON.stringify(b(n)) : String(n));
    return [e, JSON.stringify(r)];
  }
  return g(a) ? [e, JSON.stringify(b(a))] : [e, String(a)];
})) : {}, St = (t) => t.map((e) => typeof e == "object" && e !== null ? JSON.stringify(b(e)) : String(e)), R = (t) => !Array.isArray(t) && typeof t == "object" && t !== null && !!(xt(t) && Ct(t) && Nt(t) && "parameters" in t) && kt(t), xt = (t) => "name" in t && typeof t.name == "string", Ct = (t) => "status" in t && typeof t.status == "boolean", Nt = (t) => "description" in t && typeof t.description == "string", kt = (t) => typeof t.parameters == "object" && t.parameters !== null && Object.values(t.parameters).every((e) => typeof e == "string"), jt = /\s*\/\//, wt = /\s*[var|let|const]\s+[^\s]+\s*=/, Tt = /^\s{0,3}[\[|\]\;]/, $ = (t) => t.split(`
`).filter((e) => !((a) => jt.test(a) || Tt.test(a) || wt.test(a))(e)), le = (t) => {
  const e = `[${$(t).join("")}]`, a = JSON.parse(e);
  if (!Array.isArray(a)) throw new Error("Parsed value is not an array");
  if (a.every(R)) return a;
  throw new Error("Parsed value is not PluginParamsObject array");
}, de = (t, e) => {
  const a = `[${$(t).join("")}]`;
  try {
    const r = JSON.parse(a);
    if (!Array.isArray(r)) return {
      complete: !1,
      plugins: [],
      message: e.notArray,
      invalidPlugins: 0
    };
    const n = r.filter(R), c = r.length - n.length;
    return { complete: c === 0, plugins: n, invalidPlugins: c, message: c <= 0 ? e.success : e.partialSuccess };
  } catch (r) {
    return { complete: !1, plugins: [], invalidPlugins: 0, message: e.parseError, error: r };
  }
}, pe = (t, e) => {
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
}, Et = (t) => new Map(t.map((e) => [e.pluginName, new Set(e.params)])), z = (t, e) => {
  const a = Object.entries(e).filter(([r]) => r in t).map(([r, n]) => [r, n(t[r])]);
  return Object.fromEntries(a);
}, f = (t, e, a, r) => ({ default: e, ...z(a, r), kind: t }), h = (t, e, a) => ({ default: [], ...z(e, a), kind: t }), Jt = (t, e) => {
  const a = t.map((r) => r.locale === void 0 ? r.struct : r.locale === e ? `${r.struct}!` : "");
  return new Set(a);
}, M = "BODY", I = "STRUCT", y = "NONE", _t = (t, e) => {
  const a = e.trim(), r = a.match(/^\/\*~struct~([A-Za-z0-9_]*)(?::([A-Za-z0-9_-]+))?/);
  return r ? Dt(t, r) : /^\/\*:/.test(a) ? Vt(t, a) : a === "*/" ? t.lines.length > 0 ? j(t) : t : {
    ...t,
    lines: t.lines.concat([a])
  };
}, Dt = (t, e) => {
  const a = t.lines.length > 0 ? j(t) : t, r = e[1] || void 0;
  return { ...a, structName: r, blockType: r ? I : "INVALID", locale: e[2], lines: [] };
}, Ft = (t) => {
  if (t) {
    const e = t.match(/^\/\*:(\w+)/);
    if (e) return e[1];
  }
}, Vt = (t, e) => ({ ...t.lines.length > 0 ? j(t) : t, locale: Ft(e), blockType: M, lines: [] }), j = (t) => {
  if (t.blockType === M) {
    const e = t.locale ? {
      locale: t.locale,
      lines: [...t.lines]
    } : { lines: [...t.lines] };
    return { ...t, bodies: t.bodies.concat([e]), lines: [], blockType: y, locale: void 0 };
  }
  return t.structName && t.blockType === I ? {
    ...t,
    structs: t.structs.concat([{ struct: t.structName, locale: t.locale, lines: [...t.lines] }]),
    blockType: y,
    structName: void 0,
    locale: void 0,
    lines: []
  } : {
    ...t,
    blockType: y,
    structName: void 0,
    locale: void 0,
    lines: []
  };
}, Lt = (t) => t.currentOption ? { items: t.items.concat({ option: t.currentOption, value: t.currentOption }) } : t, W = (t, e) => {
  if (x in t.attr) {
    const a = $t[t.attr.kind];
    if (a) return a(t, e);
  }
  return { name: t.name, attr: f("any", "", t.attr, v) };
}, s = (t) => t, Z = (t) => t.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), v = {
  default: s,
  text: s,
  desc: s,
  parent: s
}, Rt = (t) => ({ option: t.option, value: t.value }), J = (t, e) => ({ name: t.name, attr: f(e, "", t.attr, v) }), _ = (t, e, a) => {
  const { value: r, errors: n } = e.parseStringArray(t.attr.default || "[]", t), c = {
    default: () => r,
    text: s,
    desc: s,
    parent: s
  };
  return { name: t.name, attr: h(a, t.attr, c), ...C(n) };
}, l = (t, e) => {
  const a = { default: (r) => Z(r), text: s, desc: s, parent: s };
  return {
    name: t.name,
    attr: h(e, t.attr, a)
  };
}, d = (t, e) => {
  const a = { default: (r) => parseInt(r, 10), text: s, desc: s, parent: s };
  return { name: t.name, attr: f(e, 0, t.attr, a) };
}, C = (t) => t.length > 0 ? { errors: t } : {}, $t = {
  actor: (t) => d(t, "actor"),
  "actor[]": (t) => l(t, "actor[]"),
  class: (t) => d(t, "class"),
  "class[]": (t) => l(t, "class[]"),
  skill: (t) => d(t, "skill"),
  "skill[]": (t) => l(t, "skill[]"),
  item: (t) => d(t, "item"),
  "item[]": (t) => l(t, "item[]"),
  weapon: (t) => d(t, "weapon"),
  "weapon[]": (t) => l(t, "weapon[]"),
  armor: (t) => d(t, "armor"),
  "armor[]": (t) => l(t, "armor[]"),
  state: (t) => d(t, "state"),
  "state[]": (t) => l(t, "state[]"),
  enemy: (t) => d(t, "enemy"),
  "enemy[]": (t) => l(t, "enemy[]"),
  common_event: (t) => d(t, "common_event"),
  "common_event[]": (t) => l(t, "common_event[]"),
  switch: (t) => d(t, "switch"),
  "switch[]": (t) => l(t, "switch[]"),
  variable: (t) => d(t, "variable"),
  "variable[]": (t) => l(t, "variable[]"),
  troop: (t) => d(t, "troop"),
  "troop[]": (t) => l(t, "troop[]"),
  file: (t) => {
    const e = { default: s, text: s, desc: s, parent: s, dir: s };
    return { name: t.name, attr: { dir: "", ...f("file", "", t.attr, e) } };
  },
  "file[]": (t, e) => {
    const { value: a } = e.parseStringArray(t.attr.default || "[]", t), r = { default: () => a, text: s, desc: s, parent: s, dir: s };
    return { name: t.name, attr: { dir: "", ...h("file[]", t.attr, r) } };
  },
  combo: (t) => {
    var a;
    const e = ((a = t.options) == null ? void 0 : a.map((r) => r.option)) ?? [];
    return { name: t.name, attr: { ...f("combo", "", t.attr, v), options: e } };
  },
  select: (t) => {
    const e = t.options ? t.options.map(Rt) : [];
    return {
      name: t.name,
      attr: { ...f("select", "", t.attr, v), options: e }
    };
  },
  struct: (t, e) => {
    const { errors: a, value: r } = e.parseObject(t.attr.default || "{}", t), n = { text: s, desc: s, parent: s }, c = a.length === 0 ? r : {};
    return { name: t.name, attr: { struct: t.attr.struct || "", ...f("struct", c, t.attr, n), ...C(a) } };
  },
  "struct[]": (t, e) => {
    const { errors: a, value: r } = e.parseObjectArray(t.attr.default || "[]", t), n = {
      text: s,
      desc: s,
      parent: s
    }, c = a.length === 0 ? r : [];
    return { name: t.name, attr: { struct: t.attr.struct || "", ...f("struct[]", c, t.attr, n), ...C(a) } };
  },
  boolean: (t) => {
    const e = {
      default: (a) => a === "true",
      text: s,
      desc: s,
      on: s,
      off: s,
      parent: s
    };
    return { name: t.name, attr: f("boolean", !0, t.attr, e) };
  },
  number: (t) => {
    const e = {
      default: (a) => parseFloat(a),
      text: s,
      desc: s,
      decimals: (a) => parseInt(a, 10),
      min: (a) => parseFloat(a),
      max: (a) => parseFloat(a),
      parent: s
    };
    return { name: t.name, attr: f("number", 0, t.attr, e) };
  },
  "number[]": (t) => {
    const e = {
      default: (a) => Z(a),
      text: s,
      desc: s,
      decimals: (a) => parseInt(a, 10),
      min: (a) => parseFloat(a),
      max: (a) => parseFloat(a),
      parent: s
    };
    return { name: t.name, attr: h("number[]", t.attr, e) };
  },
  string: (t) => J(t, "string"),
  "string[]": (t, e) => _(t, e, "string[]"),
  multiline_string: (t) => J(t, "multiline_string"),
  "multiline_string[]": (t, e) => _(t, e, "multiline_string[]")
}, w = () => ({ parseStringArray: (t) => ({
  value: zt(t),
  errors: []
}), parseObjectArray: () => ({ value: [], errors: [] }), parseObject: (t) => ({ value: at(t), errors: [] }) }), zt = (t) => {
  try {
    const e = JSON.parse(t);
    if (Array.isArray(e) && e.every((a) => typeof a == "string")) return e;
  } catch {
  }
  return [];
}, N = (t) => ({
  ...typeof t.desc == "string" ? { desc: t.desc } : {},
  ...typeof t.text == "string" ? { text: t.text } : {}
}), P = (t) => {
  const e = Mt(t), a = Wt(e);
  return It(a);
}, Mt = (t) => {
  if (t.currentParam && t.currentOption) {
    const e = t.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...t, currentParam: {
      ...t.currentParam,
      options: Lt(t.currentOption).items
    } };
  }
  return t;
}, It = (t) => t.currentParam ? {
  ...t,
  params: [...t.params, t.currentParam],
  currentCommand: null,
  currentOption: null,
  currentParam: null,
  currentContext: null
} : t, Wt = (t) => {
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
}, K = (t, e = "en") => {
  const a = ((o) => {
    const u = o.split(`
`), p = { structs: [], bodies: [], structName: void 0, locale: void 0, lines: [], blockType: y }, m = u.reduce((Y, q) => _t(Y, q), p);
    return {
      structs: m.structs,
      bodies: m.bodies
    };
  })(t), r = ((o, u) => {
    const p = Jt(o, u);
    return o.filter((m) => m.locale === void 0 && p.has(m.struct) ? !p.has(`${m.struct}!`) : m.locale === u && p.has(`${m.struct}!`));
  })(a.structs, e).map((o) => Zt(o)), n = ((o, u) => o.reduce((p, m) => m.locale === u || m.locale === void 0 && p === void 0 ? m : p, void 0))(a.bodies, e);
  if (!n) return {
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    dependencies: { base: [], orderBefore: [], orderAfter: [] },
    structs: r
  };
  const c = U(n);
  return {
    params: c.params,
    commands: c.commands,
    meta: c.meta,
    helpLines: c.helpLines,
    structs: r,
    dependencies: c.dependencies
  };
}, Zt = (t) => {
  const e = U(t);
  return { name: t.struct, params: e.params };
}, U = (t) => {
  const e = t.lines.reduce((a, r) => Ut(a, r), Kt());
  return P(e);
}, Kt = () => ({
  helpLines: [],
  params: [],
  commands: [],
  currentParam: null,
  currentCommand: null,
  currentContext: null,
  currentOption: null,
  dependencies: { base: [], orderBefore: [], orderAfter: [] },
  meta: {}
}), Ut = (t, e, a = Yt) => {
  const r = e.trimEnd().replace(/^[\*\s]*/, "");
  if (!r.startsWith("@")) return t.currentContext === F ? { ...t, helpLines: t.helpLines.concat(r) } : t;
  const n = r.match(/^@(\S+)\s*(.*)$/);
  if (!n) return t;
  const [, c, o] = n, u = a[c];
  return u ? u(t, o.trim()) : t;
}, i = (t, e, a) => t.currentParam && !(e in t.currentParam.attr) ? { ...t, currentParam: { ...t.currentParam, attr: {
  ...t.currentParam.attr,
  [e]: a
} } } : t, S = (t, e, a) => ({ ...t, meta: { [e]: a, ...t.meta } }), Yt = {
  param: (t, e) => {
    const a = P(t);
    return a.params.some((r) => r.name === e) ? a : {
      ...a,
      currentContext: nt,
      currentParam: { name: e, attr: {} }
    };
  },
  text: (t, e) => t.currentParam ? i(t, A, e) : t.currentCommand && !(A in t.currentCommand) ? { ...t, currentCommand: {
    ...N(t.currentCommand),
    command: t.currentCommand.command,
    args: t.currentCommand.args,
    [A]: e
  } } : t,
  desc: (t, e) => t.currentParam ? i(t, st, e) : t.currentCommand ? { ...t, currentCommand: { ...t.currentCommand, desc: e } } : t,
  command: (t, e) => {
    const a = P(t);
    return a.commands.some((r) => r.command === e) ? a : { ...a, currentCommand: { command: e, args: [] }, currentParam: null };
  },
  arg: (t, e) => {
    if (!t.currentCommand) return t;
    if (!t.currentParam) return { ...t, currentParam: { name: e, attr: {} } };
    const a = { ...N(t.currentCommand), command: t.currentCommand.command, args: t.currentCommand.args.concat(t.currentParam) };
    return { ...t, commands: t.commands, currentCommand: a, currentContext: rt, currentParam: { name: e, attr: {} } };
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
  parent: (t, e) => i(t, yt, e),
  default: (t, e) => i(t, gt, e),
  on: (t, e) => i(t, ft, e),
  off: (t, e) => i(t, pt, e),
  min: (t, e) => i(t, dt, e),
  max: (t, e) => i(t, lt, e),
  decimals: (t, e) => i(t, ut, e),
  dir: (t, e) => i(t, it, e),
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
  author: (t, e) => S(t, mt, e),
  plugindesc: (t, e) => S(t, ot, e),
  url: (t, e) => S(t, ct, e)
}, qt = (t) => {
  const e = w();
  return {
    target: "MZ",
    meta: t.meta,
    commands: Ht(t.commands, e),
    params: T(t.params, e),
    structs: Qt(t.structs, e)
  };
}, T = (t, e) => Object.fromEntries(t.map((a) => {
  const r = W(a, e);
  return [a.name, r.attr];
})), Ht = (t, e) => Object.fromEntries(t.map((a) => [a.command, {
  desc: a.desc,
  text: a.text,
  args: T(a.args, e)
}])), Qt = (t, e) => Object.fromEntries(t.map((a) => [a.name, { params: T(a.params, e) }])), Xt = (t, e = w()) => ({
  params: B(t.params, e),
  commands: Gt(t.commands, e),
  structs: te(t.structs, e)
}), B = (t, e) => t.map((a) => W(a, e)), Gt = (t, e) => t.map((a) => ({ command: a.command, desc: a.desc, text: a.text, args: B(a.args, e) })), te = (t, e) => t.map((a) => ({
  struct: a.name,
  params: B(a.params, e)
})), fe = (t) => ((e) => qt(K(e)))(t), ge = (t, e = w()) => {
  const a = K(t.source, t.locale);
  return {
    locale: t.locale,
    meta: a.meta,
    pluginName: t.pluginName,
    target: "MZ",
    dependencies: a.dependencies,
    schema: Xt(a, e)
  };
};
export {
  be as classifyFileParams,
  he as classifyPluginParams,
  ve as classifyTextParams,
  Pt as collectDependentStructNames,
  Oe as convertPluginCommandSchema,
  $ as convertPluginsJSToJSON,
  Ae as convertStructSchema,
  Se as createClassifiedStructMap,
  xe as createStructMap,
  ae as filterPluginParamByText,
  se as filterPluginSchemaByFileParam,
  re as filterPluginSchemaByNumberParam,
  O as filterPluginSchemaByParam,
  ne as filterPluginSchemaByVariableParam,
  Ce as hasNumberValueParam,
  Ne as hasScalarAttr,
  D as hasStructAttr,
  Q as hasTextAttr,
  ke as isArrayAttr,
  je as isArrayParam,
  we as isArrayParamEx,
  oe as isErrorStructParam,
  G as isFileAttr,
  Te as isNumberArrayParam,
  X as isNumberAttr,
  Be as isNumberValueParam,
  Ee as isNumberValueParamEx,
  ce as isRmmzDataKind,
  Je as isScalarParam,
  _e as isStringArrayParam,
  De as isStringValueParam,
  Fe as isStructArrayAttr,
  et as isStructArrayParam,
  Ve as isStructAttr,
  tt as isStructParam,
  H as isVariableAttr,
  At as lookupKind,
  pe as omitPluginParam,
  Le as paramHasText,
  at as parseDeepJSON,
  Re as parseDeepRecord,
  le as parsePluginParamRecord,
  de as parsePluginParamRecord2,
  ge as pluginSourceToArraySchema,
  fe as pluginSourceToJSON,
  ht as rebuildCommands,
  ue as stringifyDeepJSON,
  ie as stringifyDeepRecord,
  me as structDependencies,
  $e as toArrayPluginParam,
  ze as toObjectPluginParams,
  Me as toObjectPluginParamsOld,
  R as validatePluginJS
};
