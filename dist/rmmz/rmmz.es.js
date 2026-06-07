import { Z as F, _ as M, $ as v, a0 as R, a1 as Z, a2 as K, a3 as H, a4 as Y, a5 as q, a6 as G, a7 as U, a8 as X, a9 as g, aa as P, ab as Q, W as rr, X as er, Y as ar, I as tr, d as nr, G as sr, o as cr, q as mr, w as or, u as ir } from "../shared/structMap.es.js";
import { c as oe, a as ie, b as ue, e as le, f as pe, g as de, h as fe, i as ge, j as Pe, k as be, l as ye, m as he, n as Ae, r as Se, s as ve, t as Oe, v as xe, x as Ne, y as Ce, z as ke, A as Be, B as je, C as we, D as Te, E as _e, F as Ee, H as Fe, p as De, J as Le, K as Je, L as Ie, M as Ve, N as $e, O as We } from "../shared/structMap.es.js";
const D = (r, e) => {
  const a = Object.entries(e).filter(([t]) => t in r).map(([t, c]) => [t, c(r[t])]);
  return Object.fromEntries(a);
}, l = (r, e, a, t) => ({
  default: e,
  ...D(a, t),
  kind: r
}), h = (r, e, a) => ({ default: [], ...D(e, a), kind: r }), ur = (r, e) => {
  const a = r.map((t) => t.locale === "" ? t.struct : t.locale === e ? `${t.struct}!` : "");
  return new Set(a);
}, L = "BODY", J = "STRUCT", b = "NONE", I = (r) => {
  const e = r.split(`
`), a = { structs: [], bodies: [], structName: void 0, locale: "", lines: [], blockType: b }, t = e.reduce((c, s) => lr(c, s), a);
  return {
    structs: t.structs,
    bodies: t.bodies
  };
}, lr = (r, e) => {
  const a = e.trim(), t = a.match(/^\/\*~struct~([A-Za-z0-9_]*)(?::([A-Za-z0-9_-]+))?/);
  return t ? pr(r, t) : /^\/\*:/.test(a) ? fr(r, a) : a === "*/" ? r.lines.length > 0 ? C(r) : r : { ...r, lines: r.lines.concat([a]) };
}, pr = (r, e) => {
  const a = r.lines.length > 0 ? C(r) : r, t = e[1] || void 0;
  return {
    ...a,
    structName: t,
    blockType: t ? J : "INVALID",
    locale: e[2] ?? "",
    lines: []
  };
}, dr = (r) => {
  if (r) {
    const e = r.match(/^\/\*:(\w+)/);
    if (e) return e[1];
  }
  return "";
}, fr = (r, e) => ({
  ...r.lines.length > 0 ? C(r) : r,
  locale: dr(e),
  blockType: L,
  lines: []
}), C = (r) => {
  if (r.blockType === L) {
    const e = { locale: r.locale, lines: [...r.lines] };
    return {
      ...r,
      bodies: r.bodies.concat([e]),
      lines: [],
      blockType: b,
      locale: ""
    };
  }
  return r.structName && r.blockType === J ? {
    ...r,
    structs: r.structs.concat([{ struct: r.structName, locale: r.locale, lines: [...r.lines] }]),
    blockType: b,
    structName: void 0,
    locale: "",
    lines: []
  } : { ...r, blockType: b, structName: void 0, locale: "", lines: [] };
}, gr = (r) => r.currentOption ? { items: r.items.concat({
  option: r.currentOption,
  value: r.currentOption
}) } : r, x = (r) => ({ ...typeof r.desc == "string" ? { desc: r.desc } : {}, ...typeof r.text == "string" ? { text: r.text } : {} }), y = (r) => {
  const e = Pr(r), a = yr(e);
  return br(a);
}, Pr = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: { ...r.currentParam, options: gr(r.currentOption).items } };
  }
  return r;
}, br = (r) => r.currentParam ? { ...r, params: [...r.params, r.currentParam], currentCommand: null, currentOption: null, currentParam: null, currentContext: null } : r, yr = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = {
    ...x(r.currentCommand),
    command: r.currentCommand.command,
    args: e
  };
  return { ...r, commands: [...r.commands, a], currentCommand: null, currentParam: null, currentContext: null, currentOption: null };
}, qr = (r) => {
  const e = I(r);
  return e.bodies.map((a) => ((t, c) => {
    const s = k(t);
    return {
      locale: t.locale,
      commands: s.commands,
      params: s.params,
      helpLines: s.helpLines,
      meta: s.meta,
      dependencies: s.dependencies,
      structs: c.filter((o) => o.locale === t.locale).map((o) => $(o))
    };
  })(a, e.structs));
}, V = (r, e = "") => {
  const a = I(r), t = ((o, d) => {
    const f = ur(o, d);
    return o.filter((p) => p.locale === "" && f.has(p.struct) ? !f.has(`${p.struct}!`) : p.locale === d && f.has(`${p.struct}!`));
  })(a.structs, e).map((o) => $(o)), c = ((o, d) => o.reduce((f, p) => p.locale === d || p.locale === "" && f === void 0 ? p : f, void 0))(a.bodies, e);
  if (!c) return {
    locale: e,
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    dependencies: { base: [], orderBefore: [], orderAfter: [] },
    structs: t
  };
  const s = k(c);
  return {
    locale: c.locale,
    params: s.params,
    commands: s.commands,
    meta: s.meta,
    helpLines: s.helpLines,
    structs: t,
    dependencies: s.dependencies
  };
}, $ = (r) => {
  const e = k(r);
  return { name: r.struct, params: e.params };
}, k = (r) => {
  const e = r.lines.reduce((a, t) => Ar(a, t), hr());
  return y(e);
}, hr = () => ({ helpLines: [], params: [], commands: [], currentParam: null, currentCommand: null, currentContext: null, currentOption: null, dependencies: {
  base: [],
  orderBefore: [],
  orderAfter: []
}, meta: {} }), Ar = (r, e, a = Sr) => {
  const t = e.trimEnd().replace(/^[\*\s]*/, "");
  if (!t.startsWith("@")) return r.currentContext === F ? { ...r, helpLines: r.helpLines.concat(t) } : r;
  const c = t.match(/^@(\S+)\s*(.*)$/);
  if (!c) return r;
  const [, s, o] = c, d = a[s];
  return d ? d(r, o.trim()) : r;
}, m = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: {
  ...r.currentParam,
  attr: { ...r.currentParam.attr, [e]: a }
} } : r, O = (r, e, a) => ({ ...r, meta: { [e]: a, ...r.meta } }), Sr = {
  param: (r, e) => {
    const a = y(r);
    return a.params.some((t) => t.name === e) ? a : {
      ...a,
      currentContext: M,
      currentParam: { name: e, attr: {} }
    };
  },
  text: (r, e) => r.currentParam ? m(r, v, e) : r.currentCommand && !(v in r.currentCommand) ? { ...r, currentCommand: {
    ...x(r.currentCommand),
    command: r.currentCommand.command,
    args: r.currentCommand.args,
    [v]: e
  } } : r,
  desc: (r, e) => r.currentParam ? m(r, Q, e) : r.currentCommand ? { ...r, currentCommand: { ...r.currentCommand, desc: e } } : r,
  command: (r, e) => {
    const a = y(r);
    return a.commands.some((t) => t.command === e) ? a : { ...a, currentCommand: { command: e, args: [] }, currentParam: null };
  },
  arg: (r, e) => {
    if (!r.currentCommand) return r;
    if (!r.currentParam) return { ...r, currentParam: { name: e, attr: {} } };
    const a = { ...x(r.currentCommand), command: r.currentCommand.command, args: r.currentCommand.args.concat(r.currentParam) };
    return { ...r, commands: r.commands, currentCommand: a, currentContext: R, currentParam: { name: e, attr: {} } };
  },
  help: (r) => ({ ...y(r), currentContext: F }),
  option: (r, e) => {
    if (!r.currentParam) return r;
    const a = ((t, c) => t.currentOption ? { items: t.items.concat({ option: t.currentOption, value: t.currentOption }), currentOption: c } : { items: t.items, currentOption: c })(r.currentOption ?? {
      items: []
    }, e);
    return { ...r, currentOption: a };
  },
  value: (r, e) => {
    if (!r.currentOption) return r;
    const a = ((t, c) => t.currentOption ? { items: t.items.concat({ option: t.currentOption, value: c }) } : {
      items: t.items
    })(r.currentOption, e);
    return { ...r, currentOption: a };
  },
  type: (r, e) => {
    if (((a) => a.endsWith(">[]") && a.startsWith("struct<"))(e)) {
      const a = e.slice(7, -3), t = m(r, g, a);
      return m(t, P, `${g}[]`);
    }
    if (((a) => a.endsWith(">") && a.startsWith("struct<"))(e)) {
      const a = e.slice(7, -1), t = m(r, g, a);
      return m(t, P, g);
    }
    return r.currentParam ? m(r, P, e) : r;
  },
  parent: (r, e) => m(r, X, e),
  default: (r, e) => m(r, U, e),
  on: (r, e) => m(r, G, e),
  off: (r, e) => m(r, q, e),
  min: (r, e) => m(r, Y, e),
  max: (r, e) => m(r, H, e),
  decimals: (r, e) => m(r, K, e),
  dir: (r, e) => m(r, Z, e),
  base: (r, e) => {
    return { ...r, dependencies: (a = r.dependencies, t = e, { orderAfter: a.orderAfter, orderBefore: a.orderBefore, base: a.base.concat(t) }) };
    var a, t;
  },
  orderAfter: (r, e) => {
    return {
      ...r,
      dependencies: (a = r.dependencies, t = e, { base: a.base, orderBefore: a.orderBefore, orderAfter: a.orderAfter.concat(t) })
    };
    var a, t;
  },
  orderBefore: (r, e) => {
    return {
      ...r,
      dependencies: (a = r.dependencies, t = e, { base: a.base, orderAfter: a.orderAfter, orderBefore: a.orderBefore.concat(t) })
    };
    var a, t;
  },
  author: (r, e) => O(r, ar, e),
  plugindesc: (r, e) => O(r, er, e),
  url: (r, e) => O(r, rr, e)
}, vr = { notNumber: "isNaN", notInteger: "notInteger" }, W = (r, e, a = vr) => {
  if (P in r.attr) {
    const t = xr[r.attr.kind];
    if (t) return t(r, e, a);
  }
  return {
    name: r.name,
    attr: l("any", "", r.attr, A)
  };
}, n = (r) => r, z = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), A = {
  default: n,
  text: n,
  desc: n,
  parent: n
}, Or = (r) => ({ option: r.option, value: r.value }), _ = (r, e) => ({ name: r.name, attr: l(e, "", r.attr, A) }), E = (r, e, a) => {
  const { value: t, errors: c } = e.parseStringArray(r.attr.default || "[]", r), s = { default: () => t, text: n, desc: n, parent: n };
  return { name: r.name, attr: h(a, r.attr, s), ...N(c) };
}, i = (r, e) => {
  const a = { default: (t) => z(t), text: n, desc: n, parent: n };
  return { name: r.name, attr: h(e, r.attr, a) };
}, u = (r, e) => {
  const a = { default: (t) => parseInt(t, 10), text: n, desc: n, parent: n };
  return {
    name: r.name,
    attr: l(e, 0, r.attr, a)
  };
}, N = (r) => r.length > 0 ? { errors: r } : {}, xr = {
  actor: (r) => u(r, "actor"),
  "actor[]": (r) => i(r, "actor[]"),
  class: (r) => u(r, "class"),
  "class[]": (r) => i(r, "class[]"),
  skill: (r) => u(r, "skill"),
  "skill[]": (r) => i(r, "skill[]"),
  item: (r) => u(r, "item"),
  "item[]": (r) => i(r, "item[]"),
  weapon: (r) => u(r, "weapon"),
  "weapon[]": (r) => i(r, "weapon[]"),
  armor: (r) => u(r, "armor"),
  "armor[]": (r) => i(r, "armor[]"),
  state: (r) => u(r, "state"),
  "state[]": (r) => i(r, "state[]"),
  enemy: (r) => u(r, "enemy"),
  "enemy[]": (r) => i(r, "enemy[]"),
  common_event: (r) => u(r, "common_event"),
  "common_event[]": (r) => i(r, "common_event[]"),
  switch: (r) => u(r, "switch"),
  "switch[]": (r) => i(r, "switch[]"),
  variable: (r) => u(r, "variable"),
  "variable[]": (r) => i(r, "variable[]"),
  troop: (r) => u(r, "troop"),
  "troop[]": (r) => i(r, "troop[]"),
  file: (r) => {
    const e = { default: n, text: n, desc: n, parent: n, dir: n };
    return { name: r.name, attr: { dir: "", ...l("file", "", r.attr, e) } };
  },
  "file[]": (r, e) => {
    const { value: a } = e.parseStringArray(r.attr.default || "[]", r), t = { default: () => a, text: n, desc: n, parent: n, dir: n };
    return { name: r.name, attr: {
      dir: "",
      ...h("file[]", r.attr, t)
    } };
  },
  combo: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => t.option)) ?? [];
    return { name: r.name, attr: { ...l("combo", "", r.attr, A), options: e } };
  },
  select: (r) => {
    const e = r.options ? r.options.map(Or) : [];
    return { name: r.name, attr: { ...l("select", "", r.attr, A), options: e } };
  },
  struct: (r, e) => {
    const { errors: a, value: t } = e.parseObject(r.attr.default || "{}", r), c = { text: n, desc: n, parent: n }, s = a.length === 0 ? t : {};
    return { name: r.name, attr: {
      struct: r.attr.struct || "",
      ...l("struct", s, r.attr, c),
      ...N(a)
    } };
  },
  "struct[]": (r, e) => {
    const { errors: a, value: t } = e.parseObjectArray(r.attr.default || "[]", r), c = { text: n, desc: n, parent: n }, s = a.length === 0 ? t : [];
    return { name: r.name, attr: { struct: r.attr.struct || "", ...l("struct[]", s, r.attr, c), ...N(a) } };
  },
  boolean: (r) => {
    const e = { default: (a) => a === "true", text: n, desc: n, on: n, off: n, parent: n };
    return { name: r.name, attr: l("boolean", !0, r.attr, e) };
  },
  number: (r, e, a) => {
    const t = {
      default: (s) => parseFloat(s),
      text: n,
      desc: n,
      decimals: (s) => parseInt(s, 10),
      min: (s) => parseFloat(s),
      max: (s) => parseFloat(s),
      parent: n
    }, c = l("number", 0, r.attr, t);
    return isNaN(c.default) ? { name: r.name, attr: c, errors: [{
      source: r.attr.default || "",
      message: a.notNumber,
      code: "notNumber",
      attr: "default"
    }] } : { name: r.name, attr: c };
  },
  "number[]": (r) => {
    const e = { default: (a) => z(a), text: n, desc: n, decimals: (a) => parseInt(a, 10), min: (a) => parseFloat(a), max: (a) => parseFloat(a), parent: n };
    return { name: r.name, attr: h("number[]", r.attr, e) };
  },
  string: (r) => _(r, "string"),
  "string[]": (r, e) => E(r, e, "string[]"),
  multiline_string: (r) => _(r, "multiline_string"),
  "multiline_string[]": (r, e) => E(r, e, "multiline_string[]")
}, B = () => ({ parseStringArray: (r) => ({ value: Nr(r), errors: [] }), parseObjectArray: () => ({ value: [], errors: [] }), parseObject: (r) => ({
  value: tr(r),
  errors: []
}) }), Nr = (r) => {
  try {
    const e = JSON.parse(r);
    if (Array.isArray(e) && e.every((a) => typeof a == "string")) return e;
  } catch {
  }
  return [];
}, Cr = (r, e = B()) => ({
  params: j(r.params, e),
  commands: kr(r.commands, e),
  structs: Br(r.structs, e)
}), j = (r, e) => r.map((a) => W(a, e)), kr = (r, e) => r.map((a) => ({
  command: a.command,
  desc: a.desc,
  text: a.text,
  args: j(a.args, e)
})), Br = (r, e) => r.map((a) => ({ struct: a.name, params: j(a.params, e) })), Gr = (r) => S(r, mr), Ur = (r) => S(r, or), Xr = (r) => S(r, sr), Qr = (r) => S(r, ir), S = (r, e) => {
  const a = r.structs.filter((s) => s.params.some((o) => e(o))), t = new Set(a.map((s) => s.struct)), c = nr(r.structs, t);
  return {
    structs: jr(r.structs, c, e),
    commands: wr(r.commands, c, e),
    params: w(r.params, c, e)
  };
}, w = (r, e, a) => r.filter((t) => cr(t) ? e.has(t.attr.struct) : a(t)), jr = (r, e, a) => r.map((t) => ({
  struct: t.struct,
  params: w(t.params, e, a)
})).filter((t) => t.params.length > 0), wr = (r, e, a) => r.map((t) => ({
  ...t.desc ? { desc: t.desc } : {},
  ...t.text ? { text: t.text } : {},
  command: t.command,
  args: w(t.args, e, a)
})).filter((t) => t.args.length > 0), Tr = {
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
}, _r = ["data", "system", "system"], Er = (r) => {
  const e = Tr[r];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: r } : { author: "rmmz", module: _r[e], kind: [r, "variable", "switch"][e] };
}, re = (r) => {
  const e = Er(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, ee = (r) => (r.attr.kind === "struct" || r.attr.kind === "struct[]") && !!Array.isArray(r.errors) && r.errors.length > 0, Fr = (r) => !Array.isArray(r) && typeof r == "object" && r !== null && !!(Dr(r) && Lr(r) && Jr(r) && "parameters" in r) && Ir(r), Dr = (r) => "name" in r && typeof r.name == "string", Lr = (r) => "status" in r && typeof r.status == "boolean", Jr = (r) => "description" in r && typeof r.description == "string", Ir = (r) => typeof r.parameters == "object" && r.parameters !== null && Object.values(r.parameters).every((e) => typeof e == "string"), Vr = /\s*\/\//, $r = /\s*[var|let|const]\s+[^\s]+\s*=/, Wr = /^\s{0,3}[\[|\]\;]/, zr = (r) => r.split(`
`).filter((e) => !((a) => Vr.test(a) || Wr.test(a) || $r.test(a))(e)), ae = (r, e) => {
  const a = `[${zr(r).join("")}]`;
  try {
    const t = JSON.parse(a);
    if (!Array.isArray(t)) return { complete: !1, plugins: [], message: e.notArray, invalidPlugins: 0 };
    const c = t.filter(Fr), s = t.length - c.length;
    return { complete: s === 0, plugins: c, invalidPlugins: s, message: s <= 0 ? e.success : e.partialSuccess };
  } catch (t) {
    return {
      complete: !1,
      plugins: [],
      invalidPlugins: 0,
      message: e.parseError,
      error: t
    };
  }
}, te = (r, e) => {
  const a = Rr(e);
  return r.map((t) => ({ description: t.description, name: t.name, status: t.status, parameters: Mr(t, a) }));
}, Mr = (r, e) => {
  const a = e.get(r.name);
  if (!a) return r.parameters;
  const t = Object.entries(r.parameters).filter(([c]) => !a.has(c));
  return Object.fromEntries(t);
}, Rr = (r) => new Map(r.map((e) => [e.pluginName, new Set(e.params)])), Zr = (r) => {
  const e = B();
  return {
    target: "MZ",
    meta: r.meta,
    commands: Kr(r.commands, e),
    params: T(r.params, e),
    structs: Hr(r.structs, e)
  };
}, T = (r, e) => Object.fromEntries(r.map((a) => {
  const t = W(a, e);
  return [a.name, t.attr];
})), Kr = (r, e) => Object.fromEntries(r.map((a) => [a.command, {
  desc: a.desc,
  text: a.text,
  args: T(a.args, e)
}])), Hr = (r, e) => Object.fromEntries(r.map((a) => [a.name, { params: T(a.params, e) }])), ne = (r) => ((e) => Zr(V(e, "")))(r), se = (r, e = B()) => {
  const a = V(r.source, r.locale);
  return { locale: r.locale, meta: a.meta, pluginName: r.pluginName, target: "MZ", dependencies: a.dependencies, schema: Cr(a, e) };
};
export {
  oe as classifyFileParams,
  ie as classifyPluginParams,
  ue as classifyTextParams,
  nr as collectDependentStructNames,
  le as collectStructsByKinds,
  Cr as compilePluginAsArraySchema,
  pe as convertPluginCommandSchema,
  zr as convertPluginsJSToJSON,
  de as convertStructSchema,
  fe as createClassifiedStructMap,
  B as createDeepJSONParserHandlers,
  ge as createStructMap,
  Gr as filterPluginParamByText,
  Qr as filterPluginSchemaByFileParam,
  Pe as filterPluginSchemaByFn,
  Ur as filterPluginSchemaByNumberParam,
  S as filterPluginSchemaByParam,
  Xr as filterPluginSchemaByVariableParam,
  be as filterPluginSchemaStringParams,
  ye as filterStructParamsByFn,
  he as hasNumberValueParam,
  Ae as hasScalarAttr,
  cr as hasStructAttr,
  mr as hasTextAttr,
  Se as isArrayAttr,
  ve as isArrayParam,
  Oe as isArrayParamEx,
  ee as isErrorStructParam,
  ir as isFileAttr,
  xe as isNumberArrayParam,
  or as isNumberAttr,
  Ne as isNumberValueParam,
  Ce as isNumberValueParamEx,
  re as isRmmzDataKind,
  ke as isScalarParam,
  Be as isStringArrayParam,
  je as isStringValueParam,
  we as isStructArrayAttr,
  Te as isStructArrayParam,
  _e as isStructAttr,
  Ee as isStructParam,
  sr as isVariableAttr,
  Er as lookupKind,
  te as omitPluginParam,
  Fe as paramHasText,
  tr as parseDeepJSON,
  De as parseDeepRecord,
  qr as parsePlugin,
  V as parsePluginByLocale,
  ae as parsePluginParamRecord2,
  se as pluginSourceToArraySchema,
  ne as pluginSourceToJSON,
  wr as rebuildCommands,
  Le as stringifyDeepJSON,
  Je as stringifyDeepRecord,
  Ie as structDependencies,
  Ve as toArrayPluginParam,
  $e as toObjectPluginParams,
  We as toObjectPluginParamsOld,
  Fr as validatePluginJS
};
