import { W as D, X as H, Y as x, Z as K, _ as U, $ as Y, a0 as X, a1 as q, a2 as G, a3 as Q, a4 as tt, a5 as et, a6 as g, a7 as y, a8 as at, T as rt, U as nt, V as st, H as ct, d as mt, F as ot, n as it, o as ut, v as lt, t as pt } from "../shared/structMap.es.js";
import { c as fe, a as ge, b as ye, e as Pe, f as be, g as he, h as Ae, i as Se, j as Oe, k as ve, l as xe, m as Ne, q as Ce, r as ke, s as je, u as Be, w as Te, x as we, y as Je, z as Ee, A as Fe, B as _e, C as De, D as Le, E as Ve, G as Ie, p as $e, I as We, J as ze, K as Me, L as Re } from "../shared/structMap.es.js";
const L = (t, e) => {
  const a = Object.entries(e).filter(([r]) => r in t).map(([r, n]) => [r, n(t[r])]);
  return Object.fromEntries(a);
}, l = (t, e, a, r) => ({
  default: e,
  ...L(a, r),
  kind: t
}), A = (t, e, a) => ({ default: [], ...L(e, a), kind: t }), dt = (t, e) => {
  const a = t.map((r) => r.locale === "" ? r.struct : r.locale === e ? `${r.struct}!` : "");
  return new Set(a);
}, V = "BODY", I = "STRUCT", P = "NONE", $ = (t) => {
  const e = t.split(`
`), a = { structs: [], bodies: [], structName: void 0, locale: "", lines: [], blockType: P }, r = e.reduce((n, c) => ft(n, c), a);
  return {
    structs: r.structs,
    bodies: r.bodies
  };
}, ft = (t, e) => {
  const a = e.trim(), r = a.match(/^\/\*~struct~([A-Za-z0-9_]*)(?::([A-Za-z0-9_-]+))?/);
  return r ? gt(t, r) : /^\/\*:/.test(a) ? Pt(t, a) : a === "*/" ? t.lines.length > 0 ? j(t) : t : { ...t, lines: t.lines.concat([a]) };
}, gt = (t, e) => {
  const a = t.lines.length > 0 ? j(t) : t, r = e[1] || void 0;
  return {
    ...a,
    structName: r,
    blockType: r ? I : "INVALID",
    locale: e[2] ?? "",
    lines: []
  };
}, yt = (t) => {
  if (t) {
    const e = t.match(/^\/\*:(\w+)/);
    if (e) return e[1];
  }
  return "";
}, Pt = (t, e) => ({
  ...t.lines.length > 0 ? j(t) : t,
  locale: yt(e),
  blockType: V,
  lines: []
}), j = (t) => {
  if (t.blockType === V) {
    const e = { locale: t.locale, lines: [...t.lines] };
    return {
      ...t,
      bodies: t.bodies.concat([e]),
      lines: [],
      blockType: P,
      locale: ""
    };
  }
  return t.structName && t.blockType === I ? {
    ...t,
    structs: t.structs.concat([{ struct: t.structName, locale: t.locale, lines: [...t.lines] }]),
    blockType: P,
    structName: void 0,
    locale: "",
    lines: []
  } : { ...t, blockType: P, structName: void 0, locale: "", lines: [] };
}, bt = (t) => t.currentOption ? { items: t.items.concat({
  option: t.currentOption,
  value: t.currentOption
}) } : t, C = (t) => ({ ...typeof t.desc == "string" ? { desc: t.desc } : {}, ...typeof t.text == "string" ? { text: t.text } : {} }), b = (t) => {
  const e = ht(t), a = St(e);
  return At(a);
}, ht = (t) => {
  if (t.currentParam && t.currentOption) {
    const e = t.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...t, currentParam: { ...t.currentParam, options: bt(t.currentOption).items } };
  }
  return t;
}, At = (t) => t.currentParam ? { ...t, params: [...t.params, t.currentParam], currentCommand: null, currentOption: null, currentParam: null, currentContext: null } : t, St = (t) => {
  if (!t.currentCommand) return t;
  const e = t.currentParam ? [...t.currentCommand.args, t.currentParam] : t.currentCommand.args, a = {
    ...C(t.currentCommand),
    command: t.currentCommand.command,
    args: e
  };
  return { ...t, commands: [...t.commands, a], currentCommand: null, currentParam: null, currentContext: null, currentOption: null };
}, Qt = (t) => {
  const e = $(t);
  return e.bodies.map((a) => ((r, n) => {
    const c = B(r);
    return {
      locale: r.locale,
      commands: c.commands,
      params: c.params,
      helpLines: c.helpLines,
      meta: c.meta,
      dependencies: c.dependencies,
      structs: n.filter((o) => o.locale === r.locale).map((o) => z(o))
    };
  })(a, e.structs));
}, W = (t, e = "") => {
  const a = $(t), r = ((o, d) => {
    const f = dt(o, d);
    return o.filter((p) => p.locale === "" && f.has(p.struct) ? !f.has(`${p.struct}!`) : p.locale === d && f.has(`${p.struct}!`));
  })(a.structs, e).map((o) => z(o)), n = ((o, d) => o.reduce((f, p) => p.locale === d || p.locale === "" && f === void 0 ? p : f, void 0))(a.bodies, e);
  if (!n) return {
    locale: e,
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    dependencies: { base: [], orderBefore: [], orderAfter: [] },
    structs: r
  };
  const c = B(n);
  return {
    locale: n.locale,
    params: c.params,
    commands: c.commands,
    meta: c.meta,
    helpLines: c.helpLines,
    structs: r,
    dependencies: c.dependencies
  };
}, z = (t) => {
  const e = B(t);
  return { name: t.struct, params: e.params };
}, B = (t) => {
  const e = t.lines.reduce((a, r) => vt(a, r), Ot());
  return b(e);
}, Ot = () => ({ helpLines: [], params: [], commands: [], currentParam: null, currentCommand: null, currentContext: null, currentOption: null, dependencies: {
  base: [],
  orderBefore: [],
  orderAfter: []
}, meta: {} }), vt = (t, e, a = xt) => {
  const r = e.trimEnd().replace(/^[\*\s]*/, "");
  if (!r.startsWith("@")) return t.currentContext === D ? { ...t, helpLines: t.helpLines.concat(r) } : t;
  const n = r.match(/^@(\S+)\s*(.*)$/);
  if (!n) return t;
  const [, c, o] = n, d = a[c];
  return d ? d(t, o.trim()) : t;
}, m = (t, e, a) => t.currentParam && !(e in t.currentParam.attr) ? { ...t, currentParam: {
  ...t.currentParam,
  attr: { ...t.currentParam.attr, [e]: a }
} } : t, N = (t, e, a) => ({ ...t, meta: { [e]: a, ...t.meta } }), xt = {
  param: (t, e) => {
    const a = b(t);
    return a.params.some((r) => r.name === e) ? a : {
      ...a,
      currentContext: H,
      currentParam: { name: e, attr: {} }
    };
  },
  text: (t, e) => t.currentParam ? m(t, x, e) : t.currentCommand && !(x in t.currentCommand) ? { ...t, currentCommand: {
    ...C(t.currentCommand),
    command: t.currentCommand.command,
    args: t.currentCommand.args,
    [x]: e
  } } : t,
  desc: (t, e) => t.currentParam ? m(t, at, e) : t.currentCommand ? { ...t, currentCommand: { ...t.currentCommand, desc: e } } : t,
  command: (t, e) => {
    const a = b(t);
    return a.commands.some((r) => r.command === e) ? a : { ...a, currentCommand: { command: e, args: [] }, currentParam: null };
  },
  arg: (t, e) => {
    if (!t.currentCommand) return t;
    if (!t.currentParam) return { ...t, currentParam: { name: e, attr: {} } };
    const a = { ...C(t.currentCommand), command: t.currentCommand.command, args: t.currentCommand.args.concat(t.currentParam) };
    return { ...t, commands: t.commands, currentCommand: a, currentContext: K, currentParam: { name: e, attr: {} } };
  },
  help: (t) => ({ ...b(t), currentContext: D }),
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
    if (((a) => a.endsWith(">[]") && a.startsWith("struct<"))(e)) {
      const a = e.slice(7, -3), r = m(t, g, a);
      return m(r, y, `${g}[]`);
    }
    if (((a) => a.endsWith(">") && a.startsWith("struct<"))(e)) {
      const a = e.slice(7, -1), r = m(t, g, a);
      return m(r, y, g);
    }
    return t.currentParam ? m(t, y, e) : t;
  },
  parent: (t, e) => m(t, et, e),
  default: (t, e) => m(t, tt, e),
  on: (t, e) => m(t, Q, e),
  off: (t, e) => m(t, G, e),
  min: (t, e) => m(t, q, e),
  max: (t, e) => m(t, X, e),
  decimals: (t, e) => m(t, Y, e),
  dir: (t, e) => m(t, U, e),
  base: (t, e) => {
    return { ...t, dependencies: (a = t.dependencies, r = e, { orderAfter: a.orderAfter, orderBefore: a.orderBefore, base: a.base.concat(r) }) };
    var a, r;
  },
  orderAfter: (t, e) => {
    return {
      ...t,
      dependencies: (a = t.dependencies, r = e, { base: a.base, orderBefore: a.orderBefore, orderAfter: a.orderAfter.concat(r) })
    };
    var a, r;
  },
  orderBefore: (t, e) => {
    return {
      ...t,
      dependencies: (a = t.dependencies, r = e, { base: a.base, orderAfter: a.orderAfter, orderBefore: a.orderBefore.concat(r) })
    };
    var a, r;
  },
  author: (t, e) => N(t, st, e),
  plugindesc: (t, e) => N(t, nt, e),
  url: (t, e) => N(t, rt, e)
}, Nt = { notNumber: "isNaN", notInteger: "notInteger" }, M = (t, e, a = Nt) => {
  if (y in t.attr) {
    const r = kt[t.attr.kind];
    if (r) return r(t, e, a);
  }
  return {
    name: t.name,
    attr: l("any", "", t.attr, S)
  };
}, s = (t) => t, R = (t) => t.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), S = {
  default: s,
  text: s,
  desc: s,
  parent: s
}, Ct = (t) => ({ option: t.option, value: t.value }), F = (t, e) => ({ name: t.name, attr: l(e, "", t.attr, S) }), _ = (t, e, a) => {
  const { value: r, errors: n } = e.parseStringArray(t.attr.default || "[]", t), c = { default: () => r, text: s, desc: s, parent: s };
  return { name: t.name, attr: A(a, t.attr, c), ...k(n) };
}, i = (t, e) => {
  const a = { default: (r) => R(r), text: s, desc: s, parent: s };
  return { name: t.name, attr: A(e, t.attr, a) };
}, u = (t, e) => {
  const a = { default: (r) => parseInt(r, 10), text: s, desc: s, parent: s };
  return {
    name: t.name,
    attr: l(e, 0, t.attr, a)
  };
}, k = (t) => t.length > 0 ? { errors: t } : {}, kt = {
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
    const e = { default: s, text: s, desc: s, parent: s, dir: s };
    return { name: t.name, attr: { dir: "", ...l("file", "", t.attr, e) } };
  },
  "file[]": (t, e) => {
    const { value: a } = e.parseStringArray(t.attr.default || "[]", t), r = { default: () => a, text: s, desc: s, parent: s, dir: s };
    return { name: t.name, attr: {
      dir: "",
      ...A("file[]", t.attr, r)
    } };
  },
  combo: (t) => {
    var a;
    const e = ((a = t.options) == null ? void 0 : a.map((r) => r.option)) ?? [];
    return { name: t.name, attr: { ...l("combo", "", t.attr, S), options: e } };
  },
  select: (t) => {
    const e = t.options ? t.options.map(Ct) : [];
    return { name: t.name, attr: { ...l("select", "", t.attr, S), options: e } };
  },
  struct: (t, e) => {
    const { errors: a, value: r } = e.parseObject(t.attr.default || "{}", t), n = { text: s, desc: s, parent: s }, c = a.length === 0 ? r : {};
    return { name: t.name, attr: {
      struct: t.attr.struct || "",
      ...l("struct", c, t.attr, n),
      ...k(a)
    } };
  },
  "struct[]": (t, e) => {
    const { errors: a, value: r } = e.parseObjectArray(t.attr.default || "[]", t), n = { text: s, desc: s, parent: s }, c = a.length === 0 ? r : [];
    return { name: t.name, attr: { struct: t.attr.struct || "", ...l("struct[]", c, t.attr, n), ...k(a) } };
  },
  boolean: (t) => {
    const e = { default: (a) => a === "true", text: s, desc: s, on: s, off: s, parent: s };
    return { name: t.name, attr: l("boolean", !0, t.attr, e) };
  },
  number: (t, e, a) => {
    const r = {
      default: (c) => parseFloat(c),
      text: s,
      desc: s,
      decimals: (c) => parseInt(c, 10),
      min: (c) => parseFloat(c),
      max: (c) => parseFloat(c),
      parent: s
    }, n = l("number", 0, t.attr, r);
    return isNaN(n.default) ? { name: t.name, attr: n, errors: [{
      source: t.attr.default || "",
      message: a.notNumber,
      code: "notNumber",
      attr: "default"
    }] } : { name: t.name, attr: n };
  },
  "number[]": (t) => {
    const e = { default: (a) => R(a), text: s, desc: s, decimals: (a) => parseInt(a, 10), min: (a) => parseFloat(a), max: (a) => parseFloat(a), parent: s };
    return { name: t.name, attr: A("number[]", t.attr, e) };
  },
  string: (t) => F(t, "string"),
  "string[]": (t, e) => _(t, e, "string[]"),
  multiline_string: (t) => F(t, "multiline_string"),
  "multiline_string[]": (t, e) => _(t, e, "multiline_string[]")
}, te = (t) => Z(t), ee = (t) => JSON.stringify(Z(t)), h = (t) => typeof t == "object" && t !== null && !Array.isArray(t), Z = (t) => Array.isArray(t) ? jt(t) : h(t) ? O(t) : {}, O = (t) => h(t) ? Object.fromEntries(Object.entries(t).map(([e, a]) => {
  if (Array.isArray(a)) {
    const r = a.map((n) => h(n) ? JSON.stringify(O(n)) : String(n));
    return [e, JSON.stringify(r)];
  }
  return h(a) ? [e, JSON.stringify(O(a))] : [e, String(a)];
})) : {}, jt = (t) => t.map((e) => typeof e == "object" && e !== null ? JSON.stringify(O(e)) : String(e)), T = () => ({ parseStringArray: (t) => ({ value: Bt(t), errors: [] }), parseObjectArray: () => ({
  value: [],
  errors: []
}), parseObject: (t) => ({ value: ct(t), errors: [] }) }), Bt = (t) => {
  try {
    const e = JSON.parse(t);
    if (Array.isArray(e) && e.every((a) => typeof a == "string")) return e;
  } catch {
  }
  return [];
}, Tt = (t, e = T()) => ({ params: w(t.params, e), commands: wt(t.commands, e), structs: Jt(t.structs, e) }), w = (t, e) => t.map((a) => M(a, e)), wt = (t, e) => t.map((a) => ({
  command: a.command,
  desc: a.desc,
  text: a.text,
  args: w(a.args, e)
})), Jt = (t, e) => t.map((a) => ({ struct: a.name, params: w(a.params, e) })), ae = (t) => v(t, ut), re = (t) => v(t, lt), ne = (t) => v(t, ot), se = (t) => v(t, pt), v = (t, e) => {
  const a = t.structs.filter((c) => c.params.some((o) => e(o))), r = new Set(a.map((c) => c.struct)), n = mt(t.structs, r);
  return {
    structs: Et(t.structs, n, e),
    commands: Ft(t.commands, n, e),
    params: J(t.params, n, e)
  };
}, J = (t, e, a) => t.filter((r) => it(r) ? e.has(r.attr.struct) : a(r)), Et = (t, e, a) => t.map((r) => ({
  struct: r.struct,
  params: J(r.params, e, a)
})).filter((r) => r.params.length > 0), Ft = (t, e, a) => t.map((r) => ({
  ...r.desc ? { desc: r.desc } : {},
  ...r.text ? { text: r.text } : {},
  command: r.command,
  args: J(r.args, e, a)
})).filter((r) => r.args.length > 0), _t = {
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
}, Dt = ["data", "system", "system"], Lt = (t) => {
  const e = _t[t];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: t } : { author: "rmmz", module: Dt[e], kind: [t, "variable", "switch"][e] };
}, ce = (t) => {
  const e = Lt(t.kind);
  return e.author === t.author && e.module === t.module && e.kind === t.kind;
}, me = (t) => (t.attr.kind === "struct" || t.attr.kind === "struct[]") && !!Array.isArray(t.errors) && t.errors.length > 0, Vt = (t) => !Array.isArray(t) && typeof t == "object" && t !== null && !!(It(t) && $t(t) && Wt(t) && "parameters" in t) && zt(t), It = (t) => "name" in t && typeof t.name == "string", $t = (t) => "status" in t && typeof t.status == "boolean", Wt = (t) => "description" in t && typeof t.description == "string", zt = (t) => typeof t.parameters == "object" && t.parameters !== null && Object.values(t.parameters).every((e) => typeof e == "string"), Mt = /\s*\/\//, Rt = /\s*[var|let|const]\s+[^\s]+\s*=/, Zt = /^\s{0,3}[\[|\]\;]/, Ht = (t) => t.split(`
`).filter((e) => !((a) => Mt.test(a) || Zt.test(a) || Rt.test(a))(e)), oe = (t, e) => {
  const a = `[${Ht(t).join("")}]`;
  try {
    const r = JSON.parse(a);
    if (!Array.isArray(r)) return { complete: !1, plugins: [], message: e.notArray, invalidPlugins: 0 };
    const n = r.filter(Vt), c = r.length - n.length;
    return { complete: c === 0, plugins: n, invalidPlugins: c, message: c <= 0 ? e.success : e.partialSuccess };
  } catch (r) {
    return {
      complete: !1,
      plugins: [],
      invalidPlugins: 0,
      message: e.parseError,
      error: r
    };
  }
}, ie = (t, e) => {
  const a = Ut(e);
  return t.map((r) => ({ description: r.description, name: r.name, status: r.status, parameters: Kt(r, a) }));
}, Kt = (t, e) => {
  const a = e.get(t.name);
  if (!a) return t.parameters;
  const r = Object.entries(t.parameters).filter(([n]) => !a.has(n));
  return Object.fromEntries(r);
}, Ut = (t) => new Map(t.map((e) => [e.pluginName, new Set(e.params)])), Yt = (t) => {
  const e = T();
  return {
    target: "MZ",
    meta: t.meta,
    commands: Xt(t.commands, e),
    params: E(t.params, e),
    structs: qt(t.structs, e)
  };
}, E = (t, e) => Object.fromEntries(t.map((a) => {
  const r = M(a, e);
  return [a.name, r.attr];
})), Xt = (t, e) => Object.fromEntries(t.map((a) => [a.command, {
  desc: a.desc,
  text: a.text,
  args: E(a.args, e)
}])), qt = (t, e) => Object.fromEntries(t.map((a) => [a.name, { params: E(a.params, e) }])), ue = (t) => ((e) => Yt(W(e, "")))(t), le = (t, e = T()) => {
  const a = W(t.source, t.locale);
  return { locale: t.locale, meta: a.meta, pluginName: t.pluginName, target: "MZ", dependencies: a.dependencies, schema: Tt(a, e) };
};
export {
  fe as classifyFileParams,
  ge as classifyPluginParams,
  ye as classifyTextParams,
  mt as collectDependentStructNames,
  Pe as collectStructsByKinds,
  Tt as compilePluginAsArraySchema,
  be as convertPluginCommandSchema,
  Ht as convertPluginsJSToJSON,
  he as convertStructSchema,
  Ae as createClassifiedStructMap,
  T as createDeepJSONParserHandlers,
  Se as createStructMap,
  ae as filterPluginParamByText,
  se as filterPluginSchemaByFileParam,
  Oe as filterPluginSchemaByFn,
  re as filterPluginSchemaByNumberParam,
  v as filterPluginSchemaByParam,
  ne as filterPluginSchemaByVariableParam,
  ve as filterStructParamsByFn,
  xe as hasNumberValueParam,
  Ne as hasScalarAttr,
  it as hasStructAttr,
  ut as hasTextAttr,
  Ce as isArrayAttr,
  ke as isArrayParam,
  je as isArrayParamEx,
  me as isErrorStructParam,
  pt as isFileAttr,
  Be as isNumberArrayParam,
  lt as isNumberAttr,
  Te as isNumberValueParam,
  we as isNumberValueParamEx,
  ce as isRmmzDataKind,
  Je as isScalarParam,
  Ee as isStringArrayParam,
  Fe as isStringValueParam,
  _e as isStructArrayAttr,
  De as isStructArrayParam,
  Le as isStructAttr,
  Ve as isStructParam,
  ot as isVariableAttr,
  Lt as lookupKind,
  ie as omitPluginParam,
  Ie as paramHasText,
  ct as parseDeepJSON,
  $e as parseDeepRecord,
  Qt as parsePlugin,
  W as parsePluginByLocale,
  oe as parsePluginParamRecord2,
  le as pluginSourceToArraySchema,
  ue as pluginSourceToJSON,
  Ft as rebuildCommands,
  ee as stringifyDeepJSON,
  te as stringifyDeepRecord,
  We as structDependencies,
  ze as toArrayPluginParam,
  Me as toObjectPluginParams,
  Re as toObjectPluginParamsOld,
  Vt as validatePluginJS
};
