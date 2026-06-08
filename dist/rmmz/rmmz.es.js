import { Z as E, _ as W, $ as v, a0 as z, a1 as Z, a2 as G, a3 as K, a4 as H, a5 as Y, a6 as q, a7 as U, a8 as X, a9 as g, aa as P, ab as Q, W as rr, X as er, Y as ar, I as tr, d as nr, G as sr, o as cr, q as mr, w as or, u as ir } from "../shared/structMap.es.js";
import { c as le, a as de, b as pe, e as fe, f as ge, g as Pe, h as ye, i as be, j as he, k as Se, l as Ae, m as ve, n as Oe, r as xe, s as Ne, t as Ce, v as ke, x as Be, y as je, z as we, A as Te, B as _e, C as De, D as Ee, E as Fe, F as Je, H as Le, p as $e, J as Ie, K as Re, L as Ve, M as Me, N as We, O as ze } from "../shared/structMap.es.js";
const F = (r, e) => {
  const a = Object.entries(e).filter(([t]) => t in r).map(([t, c]) => [t, c(r[t])]);
  return Object.fromEntries(a);
}, l = (r, e, a, t) => ({
  default: e,
  ...F(a, t),
  kind: r
}), h = (r, e, a) => ({ default: [], ...F(e, a), kind: r }), ur = (r, e) => {
  const a = r.map((t) => t.locale === "" ? t.struct : t.locale === e ? `${t.struct}!` : "");
  return new Set(a);
}, J = "BODY", L = "STRUCT", y = "NONE", $ = (r) => {
  const e = r.split(`
`), a = { structs: [], bodies: [], structName: void 0, locale: "", lines: [], blockType: y }, t = e.reduce((c, s) => lr(c, s), a);
  return {
    structs: t.structs,
    bodies: t.bodies
  };
}, lr = (r, e) => {
  const a = e.trim(), t = a.match(/^\/\*~struct~([A-Za-z0-9_]*)(?::([A-Za-z0-9_-]+))?/);
  return t ? dr(r, t) : /^\/\*:/.test(a) ? fr(r, a) : a === "*/" ? r.lines.length > 0 ? C(r) : r : { ...r, lines: r.lines.concat([a]) };
}, dr = (r, e) => {
  const a = r.lines.length > 0 ? C(r) : r, t = e[1] || void 0;
  return {
    ...a,
    structName: t,
    blockType: t ? L : "INVALID",
    locale: e[2] ?? "",
    lines: []
  };
}, pr = (r) => {
  if (r) {
    const e = r.match(/^\/\*:(\w+)/);
    if (e) return e[1];
  }
  return "";
}, fr = (r, e) => ({
  ...r.lines.length > 0 ? C(r) : r,
  locale: pr(e),
  blockType: J,
  lines: []
}), C = (r) => {
  if (r.blockType === J) {
    const e = { locale: r.locale, lines: [...r.lines] };
    return {
      ...r,
      bodies: r.bodies.concat([e]),
      lines: [],
      blockType: y,
      locale: ""
    };
  }
  return r.structName && r.blockType === L ? {
    ...r,
    structs: r.structs.concat([{ struct: r.structName, locale: r.locale, lines: [...r.lines] }]),
    blockType: y,
    structName: void 0,
    locale: "",
    lines: []
  } : { ...r, blockType: y, structName: void 0, locale: "", lines: [] };
}, gr = (r) => r.currentOption ? { items: r.items.concat({
  option: r.currentOption,
  value: r.currentOption
}) } : r, x = (r) => ({ ...typeof r.desc == "string" ? { desc: r.desc } : {}, ...typeof r.text == "string" ? { text: r.text } : {} }), b = (r) => {
  const e = Pr(r), a = br(e);
  return yr(a);
}, Pr = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: { ...r.currentParam, options: gr(r.currentOption).items } };
  }
  return r;
}, yr = (r) => r.currentParam ? { ...r, params: [...r.params, r.currentParam], currentCommand: null, currentOption: null, currentParam: null, currentContext: null } : r, br = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = {
    ...x(r.currentCommand),
    command: r.currentCommand.command,
    args: e
  };
  return { ...r, commands: [...r.commands, a], currentCommand: null, currentParam: null, currentContext: null, currentOption: null };
}, Ur = (r) => {
  const e = $(r);
  return e.bodies.map((a) => ((t, c) => {
    const s = k(t);
    return {
      locale: t.locale,
      commands: s.commands,
      params: s.params,
      helpLines: s.helpLines,
      meta: s.meta,
      dependencies: s.dependencies,
      structs: c.filter((o) => o.locale === t.locale).map((o) => R(o))
    };
  })(a, e.structs));
}, I = (r, e = "") => {
  const a = $(r), t = ((o, p) => {
    const f = ur(o, p);
    return o.filter((d) => d.locale === "" && f.has(d.struct) ? !f.has(`${d.struct}!`) : d.locale === p && f.has(`${d.struct}!`));
  })(a.structs, e).map((o) => R(o)), c = ((o, p) => o.reduce((f, d) => d.locale === p || d.locale === "" && f === void 0 ? d : f, void 0))(a.bodies, e);
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
}, R = (r) => {
  const e = k(r);
  return { name: r.struct, params: e.params };
}, k = (r) => {
  const e = r.lines.reduce((a, t) => Sr(a, t), hr());
  return b(e);
}, hr = () => ({ helpLines: [], params: [], commands: [], currentParam: null, currentCommand: null, currentContext: null, currentOption: null, dependencies: {
  base: [],
  orderBefore: [],
  orderAfter: []
}, meta: {} }), Sr = (r, e, a = Ar) => {
  const t = e.trimEnd().replace(/^[\*\s]*/, "");
  if (!t.startsWith("@")) return r.currentContext === E ? { ...r, helpLines: r.helpLines.concat(t) } : r;
  const c = t.match(/^@(\S+)\s*(.*)$/);
  if (!c) return r;
  const [, s, o] = c, p = a[s];
  return p ? p(r, o.trim()) : r;
}, m = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: {
  ...r.currentParam,
  attr: { ...r.currentParam.attr, [e]: a }
} } : r, O = (r, e, a) => ({ ...r, meta: { [e]: a, ...r.meta } }), Ar = {
  param: (r, e) => {
    const a = b(r);
    return a.params.some((t) => t.name === e) ? a : {
      ...a,
      currentContext: W,
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
    const a = b(r);
    return a.commands.some((t) => t.command === e) ? a : { ...a, currentCommand: { command: e, args: [] }, currentParam: null };
  },
  arg: (r, e) => {
    if (!r.currentCommand) return r;
    if (!r.currentParam) return { ...r, currentParam: { name: e, attr: {} } };
    const a = { ...x(r.currentCommand), command: r.currentCommand.command, args: r.currentCommand.args.concat(r.currentParam) };
    return { ...r, commands: r.commands, currentCommand: a, currentContext: z, currentParam: { name: e, attr: {} } };
  },
  help: (r) => ({ ...b(r), currentContext: E }),
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
  on: (r, e) => m(r, q, e),
  off: (r, e) => m(r, Y, e),
  min: (r, e) => m(r, H, e),
  max: (r, e) => m(r, K, e),
  decimals: (r, e) => m(r, G, e),
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
}, vr = { notNumber: "isNaN", notInteger: "notInteger" }, V = (r, e, a = vr) => {
  if (P in r.attr) {
    const t = xr[r.attr.kind];
    if (t) return t(r, e, a);
  }
  return {
    name: r.name,
    attr: l("any", "", r.attr, S)
  };
}, n = (r) => r, M = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), S = {
  default: n,
  text: n,
  desc: n,
  parent: n
}, Or = (r) => ({ option: r.option, value: r.value }), _ = (r, e) => ({ name: r.name, attr: l(e, "", r.attr, S) }), D = (r, e, a) => {
  const { value: t, errors: c } = e.parseStringArray(r.attr.default || "[]", r), s = { default: () => t, text: n, desc: n, parent: n };
  return { name: r.name, attr: h(a, r.attr, s), ...N(c) };
}, i = (r, e) => {
  const a = { default: (t) => M(t), text: n, desc: n, parent: n };
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
    return { name: r.name, attr: { ...l("combo", "", r.attr, S), options: e } };
  },
  select: (r) => {
    const e = r.options ? r.options.map(Or) : [];
    return { name: r.name, attr: { ...l("select", "", r.attr, S), options: e } };
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
    const e = { default: (a) => M(a), text: n, desc: n, decimals: (a) => parseInt(a, 10), min: (a) => parseFloat(a), max: (a) => parseFloat(a), parent: n };
    return { name: r.name, attr: h("number[]", r.attr, e) };
  },
  string: (r) => _(r, "string"),
  "string[]": (r, e) => D(r, e, "string[]"),
  multiline_string: (r) => _(r, "multiline_string"),
  "multiline_string[]": (r, e) => D(r, e, "multiline_string[]")
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
}), j = (r, e) => r.map((a) => V(a, e)), kr = (r, e) => r.map((a) => ({
  command: a.command,
  desc: a.desc,
  text: a.text,
  args: j(a.args, e)
})), Br = (r, e) => r.map((a) => ({ struct: a.name, params: j(a.params, e) })), Xr = (r) => A(r, mr), Qr = (r) => A(r, or), re = (r) => A(r, sr), ee = (r) => A(r, ir), A = (r, e) => {
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
}, _r = ["data", "system", "system"], Dr = (r) => {
  const e = Tr[r];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: r } : { author: "rmmz", module: _r[e], kind: [r, "variable", "switch"][e] };
}, ae = (r) => {
  const e = Dr(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, te = (r) => (r.attr.kind === "struct" || r.attr.kind === "struct[]") && !!Array.isArray(r.errors) && r.errors.length > 0, Er = (r) => !Array.isArray(r) && typeof r == "object" && r !== null && !!(Fr(r) && Jr(r) && Lr(r) && "parameters" in r) && $r(r), Fr = (r) => "name" in r && typeof r.name == "string", Jr = (r) => "status" in r && typeof r.status == "boolean", Lr = (r) => "description" in r && typeof r.description == "string", $r = (r) => typeof r.parameters == "object" && r.parameters !== null && Object.values(r.parameters).every((e) => typeof e == "string"), Ir = ["// Generated by RPG Maker.", "// Do not edit this file directly.", "var $plugins ="].join(`
`), Rr = /\s*\/\//, Vr = /\s*[var|let|const]\s+[^\s]+\s*=/, Mr = /^\s{0,3}[\[|\]\;]/, Wr = (r) => r.split(`
`).filter((e) => !((a) => Rr.test(a) || Mr.test(a) || Vr.test(a))(e)), ne = (r, e) => zr(r, e), zr = (r, e) => {
  const a = `[${Wr(r).join("")}]`;
  try {
    const t = JSON.parse(a);
    if (!Array.isArray(t)) return { complete: !1, plugins: [], message: e.notArray, invalidPlugins: 0 };
    const c = t.filter(Er), s = t.length - c.length;
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
}, se = (r) => {
  const e = JSON.stringify(r, null, 2);
  return `${Ir}
${e}
;`;
}, ce = (r, e) => {
  const a = Gr(e);
  return r.map((t) => ({
    description: t.description,
    name: t.name,
    status: t.status,
    parameters: Zr(t, a)
  }));
}, Zr = (r, e) => {
  const a = e.get(r.name);
  if (!a) return r.parameters;
  const t = Object.entries(r.parameters).filter(([c]) => !a.has(c));
  return Object.fromEntries(t);
}, Gr = (r) => new Map(r.map((e) => [e.pluginName, new Set(e.params)])), Kr = (r) => {
  const e = B();
  return { target: "MZ", meta: r.meta, commands: Hr(r.commands, e), params: T(r.params, e), structs: Yr(r.structs, e) };
}, T = (r, e) => Object.fromEntries(r.map((a) => {
  const t = V(a, e);
  return [a.name, t.attr];
})), Hr = (r, e) => Object.fromEntries(r.map((a) => [a.command, { desc: a.desc, text: a.text, args: T(a.args, e) }])), Yr = (r, e) => Object.fromEntries(r.map((a) => [a.name, {
  params: T(a.params, e)
}])), me = (r) => ((e) => Kr(I(e, "")))(r), oe = (r, e = B()) => {
  const a = I(r.source, r.locale);
  return {
    locale: r.locale,
    meta: a.meta,
    pluginName: r.pluginName,
    target: "MZ",
    dependencies: a.dependencies,
    schema: Cr(a, e)
  };
};
export {
  le as classifyFileParams,
  de as classifyPluginParams,
  pe as classifyTextParams,
  nr as collectDependentStructNames,
  fe as collectStructsByKinds,
  Cr as compilePluginAsArraySchema,
  ge as convertPluginCommandSchema,
  Wr as convertPluginsJSToJSON,
  Pe as convertStructSchema,
  ye as createClassifiedStructMap,
  B as createDeepJSONParserHandlers,
  be as createStructMap,
  Xr as filterPluginParamByText,
  ee as filterPluginSchemaByFileParam,
  he as filterPluginSchemaByFn,
  Qr as filterPluginSchemaByNumberParam,
  A as filterPluginSchemaByParam,
  re as filterPluginSchemaByVariableParam,
  Se as filterPluginSchemaStringParams,
  Ae as filterStructParamsByFn,
  ve as hasNumberValueParam,
  Oe as hasScalarAttr,
  cr as hasStructAttr,
  mr as hasTextAttr,
  xe as isArrayAttr,
  Ne as isArrayParam,
  Ce as isArrayParamEx,
  te as isErrorStructParam,
  ir as isFileAttr,
  ke as isNumberArrayParam,
  or as isNumberAttr,
  Be as isNumberValueParam,
  je as isNumberValueParamEx,
  ae as isRmmzDataKind,
  we as isScalarParam,
  Te as isStringArrayParam,
  _e as isStringValueParam,
  De as isStructArrayAttr,
  Ee as isStructArrayParam,
  Fe as isStructAttr,
  Je as isStructParam,
  sr as isVariableAttr,
  Dr as lookupKind,
  ce as omitPluginParam,
  Le as paramHasText,
  tr as parseDeepJSON,
  $e as parseDeepRecord,
  Ur as parsePlugin,
  I as parsePluginByLocale,
  zr as parsePluginParamRecord,
  ne as parsePluginParamRecord2,
  oe as pluginSourceToArraySchema,
  me as pluginSourceToJSON,
  wr as rebuildCommands,
  Ie as stringifyDeepJSON,
  Re as stringifyDeepRecord,
  se as stringifyPluginsJS,
  Ve as structDependencies,
  Me as toArrayPluginParam,
  We as toObjectPluginParams,
  ze as toObjectPluginParamsOld,
  Er as validatePluginJS
};
