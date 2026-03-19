import { j as D, A as Y, k as q, q as H, o as Q, z as X, x as G, R as x, C as tt, S as F, T as et, U as S, V as at, W as rt, X as B, O as nt, P as st, Q as ct, Y as mt, Z as ot, _ as it, $ as ut, a0 as lt, a1 as dt, a2 as pt, a3 as ft, D as gt } from "../shared/constants.es.js";
import { c as be, a as Pe, b as he, d as Oe, e as ve, f as Se, g as Ae, h as xe, i as Ce, l as Ne, m as je, n as ke, p as we, r as Te, s as Be, t as Ee, u as Je, v as _e, w as De, y as Fe, B as Ve, E as Le, F as ze, G as Me } from "../shared/constants.es.js";
const yt = (t, e) => {
  const a = function(r) {
    return Object.fromEntries(r.map((s) => [s.struct, s.params.filter(D)]));
  }(t);
  return function(r, s, c) {
    return r.reduce((m) => {
      if (!m.changed) return m;
      const u = r.filter((p) => !m.names.has(p) && s[p].some((o) => m.names.has(o.attr.struct)));
      return u.length === 0 ? { names: m.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...m.names, ...u]), changed: !0 };
    }, {
      names: c,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, re = (t) => v(t, q), ne = (t) => v(t, H), se = (t) => v(t, Y), ce = (t) => v(t, Q), v = (t, e) => {
  const a = t.structs.filter((c) => c.params.some((m) => e(m))), r = new Set(a.map((c) => c.struct)), s = yt(t.structs, r);
  return {
    structs: bt(t.structs, s, e),
    commands: Pt(t.commands, s, e),
    params: N(t.params, s, e)
  };
}, N = (t, e, a) => t.filter((r) => D(r) ? e.has(r.attr.struct) : a(r)), bt = (t, e, a) => t.map((r) => ({
  struct: r.struct,
  params: N(r.params, e, a)
})).filter((r) => r.params.length > 0), Pt = (t, e, a) => t.map((r) => ({
  ...r.desc ? { desc: r.desc } : {},
  ...r.text ? { text: r.text } : {},
  command: r.command,
  args: N(r.args, e, a)
})).filter((r) => r.args.length > 0), ht = {
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
}, Ot = ["data", "system", "system"], vt = (t) => {
  const e = ht[t];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: t } : { author: "rmmz", module: Ot[e], kind: [t, "variable", "switch"][e] };
}, me = (t) => {
  const e = vt(t.kind);
  return e.author === t.author && e.module === t.module && e.kind === t.kind;
}, V = (t, e, a) => {
  const r = e.get(t);
  return r ? r.filter((s) => ((c, m) => !(!X(c) && !G(c) || !c.struct || m.has(c.struct)))(s, a)).flatMap((s) => {
    const c = s.struct;
    return a.add(c), [c, ...V(c, e, a)];
  }) : [];
}, oe = (t, e) => V(t, e, /* @__PURE__ */ new Set()), ie = (t) => L(t), ue = (t) => JSON.stringify(L(t)), g = (t) => typeof t == "object" && t !== null && !Array.isArray(t), L = (t) => Array.isArray(t) ? St(t) : g(t) ? P(t) : {}, P = (t) => g(t) ? Object.fromEntries(Object.entries(t).map(([e, a]) => {
  if (Array.isArray(a)) {
    const r = a.map((s) => g(s) ? JSON.stringify(P(s)) : String(s));
    return [e, JSON.stringify(r)];
  }
  return g(a) ? [e, JSON.stringify(P(a))] : [e, String(a)];
})) : {}, St = (t) => t.map((e) => typeof e == "object" && e !== null ? JSON.stringify(P(e)) : String(e)), At = (t) => !Array.isArray(t) && typeof t == "object" && t !== null && !!(xt(t) && Ct(t) && Nt(t) && "parameters" in t) && jt(t), xt = (t) => "name" in t && typeof t.name == "string", Ct = (t) => "status" in t && typeof t.status == "boolean", Nt = (t) => "description" in t && typeof t.description == "string", jt = (t) => typeof t.parameters == "object" && t.parameters !== null && Object.values(t.parameters).every((e) => typeof e == "string"), kt = /\s*\/\//, wt = /\s*[var|let|const]\s+[^\s]+\s*=/, Tt = /^\s{0,3}[\[|\]\;]/, Bt = (t) => t.split(`
`).filter((e) => !((a) => kt.test(a) || Tt.test(a) || wt.test(a))(e)), Et = (t) => {
  const e = `[${Bt(t).join("")}]`, a = JSON.parse(e);
  if (!Array.isArray(a)) throw new Error("Parsed value is not an array");
  if (a.every(At)) return a;
  throw new Error("Parsed value is not PluginParamsObject array");
}, le = (t, e) => {
  const a = _t(e);
  return t.map((r) => ({
    description: r.description,
    name: r.name,
    status: r.status,
    parameters: Jt(r, a)
  }));
}, Jt = (t, e) => {
  const a = e.get(t.name);
  if (!a) return t.parameters;
  const r = Object.entries(t.parameters).filter(([s]) => !a.has(s));
  return Object.fromEntries(r);
}, _t = (t) => new Map(t.map((e) => [e.pluginName, new Set(e.params)])), z = (t, e) => {
  const a = Object.entries(e).filter(([r]) => r in t).map(([r, s]) => [r, s(t[r])]);
  return Object.fromEntries(a);
}, f = (t, e, a, r) => ({ default: e, ...z(a, r), kind: t }), h = (t, e, a) => ({ default: [], ...z(e, a), kind: t }), Dt = (t, e) => {
  const a = t.map((r) => r.locale === void 0 ? r.struct : r.locale === e ? `${r.struct}!` : "");
  return new Set(a);
}, M = "BODY", R = "STRUCT", y = "NONE", Ft = (t, e) => {
  const a = e.trim(), r = a.match(/^\/\*~struct~([A-Za-z0-9_]*)(?::([A-Za-z0-9_-]+))?/);
  return r ? Vt(t, r) : /^\/\*:/.test(a) ? zt(t, a) : a === "*/" ? t.lines.length > 0 ? j(t) : t : {
    ...t,
    lines: t.lines.concat([a])
  };
}, Vt = (t, e) => {
  const a = t.lines.length > 0 ? j(t) : t, r = e[1] || void 0;
  return { ...a, structName: r, blockType: r ? R : "INVALID", locale: e[2], lines: [] };
}, Lt = (t) => {
  if (t) {
    const e = t.match(/^\/\*:(\w+)/);
    if (e) return e[1];
  }
}, zt = (t, e) => ({ ...t.lines.length > 0 ? j(t) : t, locale: Lt(e), blockType: M, lines: [] }), j = (t) => {
  if (t.blockType === M) {
    const e = t.locale ? {
      locale: t.locale,
      lines: [...t.lines]
    } : { lines: [...t.lines] };
    return { ...t, bodies: t.bodies.concat([e]), lines: [], blockType: y, locale: void 0 };
  }
  return t.structName && t.blockType === R ? {
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
}, Mt = (t) => t.currentOption ? { items: t.items.concat({ option: t.currentOption, value: t.currentOption }) } : t, $ = (t, e) => {
  if (x in t.attr) {
    const a = Rt[t.attr.kind];
    if (a) return a(t, e);
  }
  return { name: t.name, attr: f("any", "", t.attr, O) };
}, n = (t) => t, I = (t) => t.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), O = {
  default: n,
  text: n,
  desc: n,
  parent: n
}, E = (t, e) => ({ name: t.name, attr: f(e, "", t.attr, O) }), J = (t, e, a) => {
  const r = { default: (s) => e.parseStringArray(s).value, text: n, desc: n, parent: n };
  return { name: t.name, attr: h(a, t.attr, r) };
}, l = (t, e) => {
  const a = { default: (r) => I(r), text: n, desc: n, parent: n };
  return { name: t.name, attr: h(e, t.attr, a) };
}, d = (t, e) => {
  const a = { default: (r) => parseInt(r, 10), text: n, desc: n, parent: n };
  return { name: t.name, attr: f(e, 0, t.attr, a) };
}, _ = (t) => t.length > 0 ? { errors: t } : {}, Rt = {
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
    const e = { default: n, text: n, desc: n, parent: n, dir: n };
    return { name: t.name, attr: { dir: "", ...f("file", "", t.attr, e) } };
  },
  "file[]": (t, e) => {
    const a = { default: (r) => e.parseStringArray(r).value, text: n, desc: n, parent: n, dir: n };
    return {
      name: t.name,
      attr: { dir: "", ...h("file[]", t.attr, a) }
    };
  },
  combo: (t) => {
    var a;
    const e = ((a = t.options) == null ? void 0 : a.map((r) => r.option)) ?? [];
    return { name: t.name, attr: { ...f("combo", "", t.attr, O), options: e } };
  },
  select: (t) => {
    var a;
    const e = ((a = t.options) == null ? void 0 : a.map((r) => ({ option: r.option, value: r.value }))) ?? [];
    return { name: t.name, attr: { ...f("select", "", t.attr, O), options: e } };
  },
  struct: (t, e) => {
    const { errors: a, value: r } = e.parseObject(t.attr.default || "{}"), s = { text: n, desc: n, parent: n }, c = a.length === 0 ? r : {};
    return { name: t.name, attr: {
      struct: t.attr.struct || "",
      ...f("struct", c, t.attr, s),
      ..._(a)
    } };
  },
  "struct[]": (t, e) => {
    const { errors: a, value: r } = e.parseObjectArray(t.attr.default || "[]"), s = { text: n, desc: n, parent: n }, c = a.length === 0 ? r : [];
    return {
      name: t.name,
      attr: { struct: t.attr.struct || "", ...f("struct[]", c, t.attr, s), ..._(a) }
    };
  },
  boolean: (t) => {
    const e = { default: (a) => a === "true", text: n, desc: n, on: n, off: n, parent: n };
    return {
      name: t.name,
      attr: f("boolean", !0, t.attr, e)
    };
  },
  number: (t) => {
    const e = {
      default: (a) => parseFloat(a),
      text: n,
      desc: n,
      decimals: (a) => parseInt(a, 10),
      min: (a) => parseFloat(a),
      max: (a) => parseFloat(a),
      parent: n
    };
    return { name: t.name, attr: f("number", 0, t.attr, e) };
  },
  "number[]": (t) => {
    const e = {
      default: (a) => I(a),
      text: n,
      desc: n,
      decimals: (a) => parseInt(a, 10),
      min: (a) => parseFloat(a),
      max: (a) => parseFloat(a),
      parent: n
    };
    return { name: t.name, attr: h("number[]", t.attr, e) };
  },
  string: (t) => E(t, "string"),
  "string[]": (t, e) => J(t, e, "string[]"),
  multiline_string: (t) => E(t, "multiline_string"),
  "multiline_string[]": (t, e) => J(t, e, "multiline_string[]")
}, k = () => ({
  parseStringArray: (t) => ({ value: $t(t), errors: [] }),
  parseObjectArray: () => ({ value: [], errors: [] }),
  parseObject: (t) => ({ value: tt(t), errors: [] })
}), $t = (t) => {
  try {
    const e = JSON.parse(t);
    if (Array.isArray(e) && e.every((a) => typeof a == "string")) return e;
  } catch {
  }
  return [];
}, C = (t) => ({
  ...typeof t.desc == "string" ? { desc: t.desc } : {},
  ...typeof t.text == "string" ? { text: t.text } : {}
}), b = (t) => {
  const e = It(t), a = Zt(e);
  return Wt(a);
}, It = (t) => {
  if (t.currentParam && t.currentOption) {
    const e = t.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...t, currentParam: {
      ...t.currentParam,
      options: Mt(t.currentOption).items
    } };
  }
  return t;
}, Wt = (t) => t.currentParam ? {
  ...t,
  params: [...t.params, t.currentParam],
  currentCommand: null,
  currentOption: null,
  currentParam: null,
  currentContext: null
} : t, Zt = (t) => {
  if (!t.currentCommand) return t;
  const e = t.currentParam ? [...t.currentCommand.args, t.currentParam] : t.currentCommand.args, a = {
    ...C(t.currentCommand),
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
}, W = (t, e = "en") => {
  const a = ((m) => {
    const u = m.split(`
`), p = { structs: [], bodies: [], structName: void 0, locale: void 0, lines: [], blockType: y }, o = u.reduce((K, U) => Ft(K, U), p);
    return {
      structs: o.structs,
      bodies: o.bodies
    };
  })(t), r = ((m, u) => {
    const p = Dt(m, u);
    return m.filter((o) => o.locale === void 0 && p.has(o.struct) ? !p.has(`${o.struct}!`) : o.locale === u && p.has(`${o.struct}!`));
  })(a.structs, e).map((m) => Kt(m)), s = ((m, u) => m.reduce((p, o) => o.locale === u || o.locale === void 0 && p === void 0 ? o : p, void 0))(a.bodies, e);
  if (!s) return {
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    dependencies: { base: [], orderBefore: [], orderAfter: [] },
    structs: r
  };
  const c = Z(s);
  return {
    params: c.params,
    commands: c.commands,
    meta: c.meta,
    helpLines: c.helpLines,
    structs: r,
    dependencies: c.dependencies
  };
}, Kt = (t) => {
  const e = Z(t);
  return { name: t.struct, params: e.params };
}, Z = (t) => {
  const e = t.lines.reduce((a, r) => Yt(a, r), Ut());
  return b(e);
}, Ut = () => ({
  helpLines: [],
  params: [],
  commands: [],
  currentParam: null,
  currentCommand: null,
  currentContext: null,
  currentOption: null,
  dependencies: { base: [], orderBefore: [], orderAfter: [] },
  meta: {}
}), Yt = (t, e, a = qt) => {
  const r = e.trimEnd().replace(/^[\*\s]*/, "");
  if (!r.startsWith("@")) return t.currentContext === F ? { ...t, helpLines: t.helpLines.concat(r) } : t;
  const s = r.match(/^@(\S+)\s*(.*)$/);
  if (!s) return t;
  const [, c, m] = s, u = a[c];
  return u ? u(t, m.trim()) : t;
}, i = (t, e, a) => t.currentParam && !(e in t.currentParam.attr) ? { ...t, currentParam: { ...t.currentParam, attr: {
  ...t.currentParam.attr,
  [e]: a
} } } : t, A = (t, e, a) => ({ ...t, meta: { [e]: a, ...t.meta } }), qt = {
  param: (t, e) => {
    const a = b(t);
    return a.params.some((r) => r.name === e) ? a : {
      ...a,
      currentContext: at,
      currentParam: { name: e, attr: {} }
    };
  },
  text: (t, e) => t.currentParam ? i(t, S, e) : t.currentCommand && !(S in t.currentCommand) ? { ...t, currentCommand: {
    ...C(t.currentCommand),
    command: t.currentCommand.command,
    args: t.currentCommand.args,
    [S]: e
  } } : t,
  desc: (t, e) => t.currentParam ? i(t, rt, e) : t.currentCommand ? { ...t, currentCommand: { ...t.currentCommand, desc: e } } : t,
  command: (t, e) => {
    const a = b(t);
    return a.commands.some((r) => r.command === e) ? a : { ...a, currentCommand: { command: e, args: [] }, currentParam: null };
  },
  arg: (t, e) => {
    if (!t.currentCommand) return t;
    if (!t.currentParam) return { ...t, currentParam: { name: e, attr: {} } };
    const a = { ...C(t.currentCommand), command: t.currentCommand.command, args: t.currentCommand.args.concat(t.currentParam) };
    return { ...t, commands: t.commands, currentCommand: a, currentContext: et, currentParam: { name: e, attr: {} } };
  },
  help: (t) => ({ ...b(t), currentContext: F }),
  option: (t, e) => {
    if (!t.currentParam) return t;
    const a = ((r, s) => r.currentOption ? { items: r.items.concat({ option: r.currentOption, value: r.currentOption }), currentOption: s } : { items: r.items, currentOption: s })(t.currentOption ?? {
      items: []
    }, e);
    return { ...t, currentOption: a };
  },
  value: (t, e) => {
    if (!t.currentOption) return t;
    const a = ((r, s) => r.currentOption ? { items: r.items.concat({ option: r.currentOption, value: s }) } : {
      items: r.items
    })(t.currentOption, e);
    return { ...t, currentOption: a };
  },
  type: (t, e) => {
    if (((a) => a.endsWith(">") && a.startsWith("struct<"))(e)) {
      const a = e.slice(7, -1), r = i(t, B, a);
      return i(r, x, B);
    }
    return t.currentParam ? i(t, x, e) : t;
  },
  parent: (t, e) => i(t, ft, e),
  default: (t, e) => i(t, pt, e),
  on: (t, e) => i(t, dt, e),
  off: (t, e) => i(t, lt, e),
  min: (t, e) => i(t, ut, e),
  max: (t, e) => i(t, it, e),
  decimals: (t, e) => i(t, ot, e),
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
  author: (t, e) => A(t, ct, e),
  plugindesc: (t, e) => A(t, st, e),
  url: (t, e) => A(t, nt, e)
}, Ht = (t) => {
  const e = k();
  return {
    target: "MZ",
    meta: t.meta,
    commands: Qt(t.commands, e),
    params: w(t.params, e),
    structs: Xt(t.structs, e)
  };
}, w = (t, e) => Object.fromEntries(t.map((a) => {
  const r = $(a, e);
  return [a.name, r.attr];
})), Qt = (t, e) => Object.fromEntries(t.map((a) => [a.command, {
  desc: a.desc,
  text: a.text,
  args: w(a.args, e)
}])), Xt = (t, e) => Object.fromEntries(t.map((a) => [a.name, { params: w(a.params, e) }])), Gt = (t, e = k()) => ({
  params: T(t.params, e),
  commands: te(t.commands, e),
  structs: ee(t.structs, e)
}), T = (t, e) => t.map((a) => $(a, e)), te = (t, e) => t.map((a) => ({ command: a.command, desc: a.desc, text: a.text, args: T(a.args, e) })), ee = (t, e) => t.map((a) => ({
  struct: a.name,
  params: T(a.params, e)
})), de = (t) => ((e) => Ht(W(e)))(t), pe = (t, e = k()) => {
  const a = W(t.source, t.locale);
  return {
    locale: t.locale,
    meta: a.meta,
    pluginName: t.pluginName,
    target: "MZ",
    dependencies: a.dependencies,
    schema: Gt(a, e)
  };
}, fe = (t) => Et(t).map((e) => ({ description: e.description, name: e.name, status: e.status, parameters: gt(e.parameters) }));
export {
  be as classifyFileParams,
  Pe as classifyPluginParams,
  he as classifyTextParams,
  yt as collectDependentStructNames,
  Oe as convertPluginCommandSchema,
  Bt as convertPluginsJSToJSON,
  ve as convertStructSchema,
  Se as createClassifiedStructMap,
  Ae as createStructMap,
  re as filterPluginParamByText,
  ce as filterPluginSchemaByFileParam,
  ne as filterPluginSchemaByNumberParam,
  v as filterPluginSchemaByParam,
  se as filterPluginSchemaByVariableParam,
  xe as hasNumberValueParam,
  Ce as hasScalarAttr,
  D as hasStructAttr,
  q as hasTextAttr,
  Ne as isArrayAttr,
  je as isArrayParam,
  ke as isArrayParamEx,
  Q as isFileAttr,
  we as isNumberArrayParam,
  H as isNumberAttr,
  Te as isNumberValueParam,
  Be as isNumberValueParamEx,
  me as isRmmzDataKind,
  Ee as isScalarParam,
  Je as isStringArrayParam,
  _e as isStringValueParam,
  De as isStructArrayAttr,
  G as isStructArrayParam,
  Fe as isStructAttr,
  X as isStructParam,
  Y as isVariableAttr,
  vt as lookupKind,
  le as omitPluginParam,
  Ve as paramHasText,
  tt as parseDeepJSON,
  gt as parseDeepRecord,
  fe as parsePluginParamObject,
  Et as parsePluginParamRecord,
  pe as pluginSourceToArraySchema,
  de as pluginSourceToJSON,
  Pt as rebuildCommands,
  ue as stringifyDeepJSON,
  ie as stringifyDeepRecord,
  oe as structDependencies,
  Le as toArrayPluginParam,
  ze as toObjectPluginParams,
  Me as toObjectPluginParamsOld,
  At as validatePluginJS
};
