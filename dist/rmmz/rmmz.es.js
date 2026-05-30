import { R as L, S as U, T as x, U as Y, V as Q, W as X, X as q, Y as G, Z as rr, _ as er, $ as ar, a0 as tr, a1 as g, a2 as y, a3 as nr, O as sr, P as cr, Q as mr, D as or, j as F, B as ir, k as ur, r as lr, o as pr, A as dr, y as fr } from "../shared/structMap.es.js";
import { c as Pe, a as he, b as Ae, d as Oe, e as Se, f as ve, g as xe, h as Ne, i as Ce, l as ke, m as je, n as we, q as Te, s as Be, t as Je, u as Ee, v as _e, w as De, x as Le, z as Fe, C as Ve, p as Ie, E as $e, F as Me, G as Re } from "../shared/structMap.es.js";
const V = (r, e) => {
  const a = Object.entries(e).filter(([t]) => t in r).map(([t, n]) => [t, n(r[t])]);
  return Object.fromEntries(a);
}, d = (r, e, a, t) => ({
  default: e,
  ...V(a, t),
  kind: r
}), A = (r, e, a) => ({ default: [], ...V(e, a), kind: r }), gr = (r, e) => {
  const a = r.map((t) => t.locale === "" ? t.struct : t.locale === e ? `${t.struct}!` : "");
  return new Set(a);
}, I = "BODY", $ = "STRUCT", b = "NONE", M = (r) => {
  const e = r.split(`
`), a = { structs: [], bodies: [], structName: void 0, locale: "", lines: [], blockType: b }, t = e.reduce((n, s) => yr(n, s), a);
  return {
    structs: t.structs,
    bodies: t.bodies
  };
}, yr = (r, e) => {
  const a = e.trim(), t = a.match(/^\/\*~struct~([A-Za-z0-9_]*)(?::([A-Za-z0-9_-]+))?/);
  return t ? br(r, t) : /^\/\*:/.test(a) ? hr(r, a) : a === "*/" ? r.lines.length > 0 ? j(r) : r : { ...r, lines: r.lines.concat([a]) };
}, br = (r, e) => {
  const a = r.lines.length > 0 ? j(r) : r, t = e[1] || void 0;
  return {
    ...a,
    structName: t,
    blockType: t ? $ : "INVALID",
    locale: e[2] ?? "",
    lines: []
  };
}, Pr = (r) => {
  if (r) {
    const e = r.match(/^\/\*:(\w+)/);
    if (e) return e[1];
  }
  return "";
}, hr = (r, e) => ({
  ...r.lines.length > 0 ? j(r) : r,
  locale: Pr(e),
  blockType: I,
  lines: []
}), j = (r) => {
  if (r.blockType === I) {
    const e = { locale: r.locale, lines: [...r.lines] };
    return {
      ...r,
      bodies: r.bodies.concat([e]),
      lines: [],
      blockType: b,
      locale: ""
    };
  }
  return r.structName && r.blockType === $ ? {
    ...r,
    structs: r.structs.concat([{ struct: r.structName, locale: r.locale, lines: [...r.lines] }]),
    blockType: b,
    structName: void 0,
    locale: "",
    lines: []
  } : { ...r, blockType: b, structName: void 0, locale: "", lines: [] };
}, Ar = (r) => r.currentOption ? { items: r.items.concat({
  option: r.currentOption,
  value: r.currentOption
}) } : r, C = (r) => ({ ...typeof r.desc == "string" ? { desc: r.desc } : {}, ...typeof r.text == "string" ? { text: r.text } : {} }), P = (r) => {
  const e = Or(r), a = vr(e);
  return Sr(a);
}, Or = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: { ...r.currentParam, options: Ar(r.currentOption).items } };
  }
  return r;
}, Sr = (r) => r.currentParam ? { ...r, params: [...r.params, r.currentParam], currentCommand: null, currentOption: null, currentParam: null, currentContext: null } : r, vr = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = {
    ...C(r.currentCommand),
    command: r.currentCommand.command,
    args: e
  };
  return { ...r, commands: [...r.commands, a], currentCommand: null, currentParam: null, currentContext: null, currentOption: null };
}, ae = (r) => {
  const e = M(r);
  return e.bodies.map((a) => ((t, n) => {
    const s = w(t);
    return {
      locale: t.locale,
      commands: s.commands,
      params: s.params,
      helpLines: s.helpLines,
      meta: s.meta,
      dependencies: s.dependencies,
      structs: n.filter((m) => m.locale === t.locale).map((m) => W(m))
    };
  })(a, e.structs));
}, R = (r, e = "") => {
  const a = M(r), t = ((m, p) => {
    const f = gr(m, p);
    return m.filter((l) => l.locale === "" && f.has(l.struct) ? !f.has(`${l.struct}!`) : l.locale === p && f.has(`${l.struct}!`));
  })(a.structs, e).map((m) => W(m)), n = ((m, p) => m.reduce((f, l) => l.locale === p || l.locale === "" && f === void 0 ? l : f, void 0))(a.bodies, e);
  if (!n) return {
    locale: e,
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    dependencies: { base: [], orderBefore: [], orderAfter: [] },
    structs: t
  };
  const s = w(n);
  return {
    locale: n.locale,
    params: s.params,
    commands: s.commands,
    meta: s.meta,
    helpLines: s.helpLines,
    structs: t,
    dependencies: s.dependencies
  };
}, W = (r) => {
  const e = w(r);
  return { name: r.struct, params: e.params };
}, w = (r) => {
  const e = r.lines.reduce((a, t) => Nr(a, t), xr());
  return P(e);
}, xr = () => ({ helpLines: [], params: [], commands: [], currentParam: null, currentCommand: null, currentContext: null, currentOption: null, dependencies: {
  base: [],
  orderBefore: [],
  orderAfter: []
}, meta: {} }), Nr = (r, e, a = Cr) => {
  const t = e.trimEnd().replace(/^[\*\s]*/, "");
  if (!t.startsWith("@")) return r.currentContext === L ? { ...r, helpLines: r.helpLines.concat(t) } : r;
  const n = t.match(/^@(\S+)\s*(.*)$/);
  if (!n) return r;
  const [, s, m] = n, p = a[s];
  return p ? p(r, m.trim()) : r;
}, o = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: {
  ...r.currentParam,
  attr: { ...r.currentParam.attr, [e]: a }
} } : r, N = (r, e, a) => ({ ...r, meta: { [e]: a, ...r.meta } }), Cr = {
  param: (r, e) => {
    const a = P(r);
    return a.params.some((t) => t.name === e) ? a : {
      ...a,
      currentContext: U,
      currentParam: { name: e, attr: {} }
    };
  },
  text: (r, e) => r.currentParam ? o(r, x, e) : r.currentCommand && !(x in r.currentCommand) ? { ...r, currentCommand: {
    ...C(r.currentCommand),
    command: r.currentCommand.command,
    args: r.currentCommand.args,
    [x]: e
  } } : r,
  desc: (r, e) => r.currentParam ? o(r, nr, e) : r.currentCommand ? { ...r, currentCommand: { ...r.currentCommand, desc: e } } : r,
  command: (r, e) => {
    const a = P(r);
    return a.commands.some((t) => t.command === e) ? a : { ...a, currentCommand: { command: e, args: [] }, currentParam: null };
  },
  arg: (r, e) => {
    if (!r.currentCommand) return r;
    if (!r.currentParam) return { ...r, currentParam: { name: e, attr: {} } };
    const a = { ...C(r.currentCommand), command: r.currentCommand.command, args: r.currentCommand.args.concat(r.currentParam) };
    return { ...r, commands: r.commands, currentCommand: a, currentContext: Y, currentParam: { name: e, attr: {} } };
  },
  help: (r) => ({ ...P(r), currentContext: L }),
  option: (r, e) => {
    if (!r.currentParam) return r;
    const a = ((t, n) => t.currentOption ? { items: t.items.concat({ option: t.currentOption, value: t.currentOption }), currentOption: n } : { items: t.items, currentOption: n })(r.currentOption ?? {
      items: []
    }, e);
    return { ...r, currentOption: a };
  },
  value: (r, e) => {
    if (!r.currentOption) return r;
    const a = ((t, n) => t.currentOption ? { items: t.items.concat({ option: t.currentOption, value: n }) } : {
      items: t.items
    })(r.currentOption, e);
    return { ...r, currentOption: a };
  },
  type: (r, e) => {
    if (((a) => a.endsWith(">[]") && a.startsWith("struct<"))(e)) {
      const a = e.slice(7, -3), t = o(r, g, a);
      return o(t, y, `${g}[]`);
    }
    if (((a) => a.endsWith(">") && a.startsWith("struct<"))(e)) {
      const a = e.slice(7, -1), t = o(r, g, a);
      return o(t, y, g);
    }
    return r.currentParam ? o(r, y, e) : r;
  },
  parent: (r, e) => o(r, tr, e),
  default: (r, e) => o(r, ar, e),
  on: (r, e) => o(r, er, e),
  off: (r, e) => o(r, rr, e),
  min: (r, e) => o(r, G, e),
  max: (r, e) => o(r, q, e),
  decimals: (r, e) => o(r, X, e),
  dir: (r, e) => o(r, Q, e),
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
  author: (r, e) => N(r, mr, e),
  plugindesc: (r, e) => N(r, cr, e),
  url: (r, e) => N(r, sr, e)
}, kr = { notNumber: "isNaN", notInteger: "notInteger" }, z = (r, e, a = kr) => {
  if (y in r.attr) {
    const t = wr[r.attr.kind];
    if (t) return t(r, e, a);
  }
  return {
    name: r.name,
    attr: d("any", "", r.attr, O)
  };
}, c = (r) => r, Z = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), O = {
  default: c,
  text: c,
  desc: c,
  parent: c
}, jr = (r) => ({ option: r.option, value: r.value }), _ = (r, e) => ({ name: r.name, attr: d(e, "", r.attr, O) }), D = (r, e, a) => {
  const { value: t, errors: n } = e.parseStringArray(r.attr.default || "[]", r), s = { default: () => t, text: c, desc: c, parent: c };
  return { name: r.name, attr: A(a, r.attr, s), ...k(n) };
}, i = (r, e) => {
  const a = {
    default: (t) => Z(t),
    text: c,
    desc: c,
    parent: c
  };
  return { name: r.name, attr: A(e, r.attr, a) };
}, u = (r, e) => {
  const a = { default: (t) => parseInt(t, 10), text: c, desc: c, parent: c };
  return {
    name: r.name,
    attr: d(e, 0, r.attr, a)
  };
}, k = (r) => r.length > 0 ? { errors: r } : {}, wr = {
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
    const e = { default: c, text: c, desc: c, parent: c, dir: c };
    return { name: r.name, attr: { dir: "", ...d("file", "", r.attr, e) } };
  },
  "file[]": (r, e) => {
    const { value: a } = e.parseStringArray(r.attr.default || "[]", r), t = { default: () => a, text: c, desc: c, parent: c, dir: c };
    return { name: r.name, attr: {
      dir: "",
      ...A("file[]", r.attr, t)
    } };
  },
  combo: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => t.option)) ?? [];
    return { name: r.name, attr: { ...d("combo", "", r.attr, O), options: e } };
  },
  select: (r) => {
    const e = r.options ? r.options.map(jr) : [];
    return { name: r.name, attr: { ...d("select", "", r.attr, O), options: e } };
  },
  struct: (r, e) => {
    const { errors: a, value: t } = e.parseObject(r.attr.default || "{}", r), n = { text: c, desc: c, parent: c }, s = a.length === 0 ? t : {};
    return { name: r.name, attr: {
      struct: r.attr.struct || "",
      ...d("struct", s, r.attr, n),
      ...k(a)
    } };
  },
  "struct[]": (r, e) => {
    const { errors: a, value: t } = e.parseObjectArray(r.attr.default || "[]", r), n = { text: c, desc: c, parent: c }, s = a.length === 0 ? t : [];
    return { name: r.name, attr: { struct: r.attr.struct || "", ...d("struct[]", s, r.attr, n), ...k(a) } };
  },
  boolean: (r) => {
    const e = { default: (a) => a === "true", text: c, desc: c, on: c, off: c, parent: c };
    return { name: r.name, attr: d("boolean", !0, r.attr, e) };
  },
  number: (r, e, a) => {
    const t = {
      default: (s) => parseFloat(s),
      text: c,
      desc: c,
      decimals: (s) => parseInt(s, 10),
      min: (s) => parseFloat(s),
      max: (s) => parseFloat(s),
      parent: c
    }, n = d("number", 0, r.attr, t);
    return isNaN(n.default) ? { name: r.name, attr: n, errors: [{
      source: r.attr.default || "",
      message: a.notNumber,
      code: "notNumber",
      attr: "default"
    }] } : { name: r.name, attr: n };
  },
  "number[]": (r) => {
    const e = { default: (a) => Z(a), text: c, desc: c, decimals: (a) => parseInt(a, 10), min: (a) => parseFloat(a), max: (a) => parseFloat(a), parent: c };
    return { name: r.name, attr: A("number[]", r.attr, e) };
  },
  string: (r) => _(r, "string"),
  "string[]": (r, e) => D(r, e, "string[]"),
  multiline_string: (r) => _(r, "multiline_string"),
  "multiline_string[]": (r, e) => D(r, e, "multiline_string[]")
}, te = (r) => H(r), ne = (r) => JSON.stringify(H(r)), h = (r) => typeof r == "object" && r !== null && !Array.isArray(r), H = (r) => Array.isArray(r) ? Tr(r) : h(r) ? S(r) : {}, S = (r) => h(r) ? Object.fromEntries(Object.entries(r).map(([e, a]) => {
  if (Array.isArray(a)) {
    const t = a.map((n) => h(n) ? JSON.stringify(S(n)) : String(n));
    return [e, JSON.stringify(t)];
  }
  return h(a) ? [e, JSON.stringify(S(a))] : [e, String(a)];
})) : {}, Tr = (r) => r.map((e) => typeof e == "object" && e !== null ? JSON.stringify(S(e)) : String(e)), T = () => ({ parseStringArray: (r) => ({ value: Br(r), errors: [] }), parseObjectArray: () => ({
  value: [],
  errors: []
}), parseObject: (r) => ({ value: or(r), errors: [] }) }), Br = (r) => {
  try {
    const e = JSON.parse(r);
    if (Array.isArray(e) && e.every((a) => typeof a == "string")) return e;
  } catch {
  }
  return [];
}, Jr = (r, e = T()) => ({ params: B(r.params, e), commands: Er(r.commands, e), structs: _r(r.structs, e) }), B = (r, e) => r.map((a) => z(a, e)), Er = (r, e) => r.map((a) => ({
  command: a.command,
  desc: a.desc,
  text: a.text,
  args: B(a.args, e)
})), _r = (r, e) => r.map((a) => ({ struct: a.name, params: B(a.params, e) })), Dr = (r, e) => {
  const a = function(t) {
    return Object.fromEntries(t.map((n) => [n.struct, n.params.filter(F)]));
  }(r);
  return function(t, n, s) {
    return t.reduce((m) => {
      if (!m.changed) return m;
      const p = t.filter((f) => !m.names.has(f) && n[f].some((l) => m.names.has(l.attr.struct)));
      return p.length === 0 ? { names: m.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...m.names, ...p]), changed: !0 };
    }, {
      names: s,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, se = (r) => v(r, ur), ce = (r) => v(r, lr), me = (r) => v(r, ir), oe = (r) => v(r, pr), v = (r, e) => {
  const a = r.structs.filter((s) => s.params.some((m) => e(m))), t = new Set(a.map((s) => s.struct)), n = Dr(r.structs, t);
  return {
    structs: Lr(r.structs, n, e),
    commands: Fr(r.commands, n, e),
    params: J(r.params, n, e)
  };
}, J = (r, e, a) => r.filter((t) => F(t) ? e.has(t.attr.struct) : a(t)), Lr = (r, e, a) => r.map((t) => ({
  struct: t.struct,
  params: J(t.params, e, a)
})).filter((t) => t.params.length > 0), Fr = (r, e, a) => r.map((t) => ({
  ...t.desc ? { desc: t.desc } : {},
  ...t.text ? { text: t.text } : {},
  command: t.command,
  args: J(t.args, e, a)
})).filter((t) => t.args.length > 0), Vr = {
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
}, Ir = ["data", "system", "system"], $r = (r) => {
  const e = Vr[r];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: r } : { author: "rmmz", module: Ir[e], kind: [r, "variable", "switch"][e] };
}, ie = (r) => {
  const e = $r(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, ue = (r) => (r.attr.kind === "struct" || r.attr.kind === "struct[]") && !!Array.isArray(r.errors) && r.errors.length > 0, K = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((n) => ((s, m) => !(!dr(s) && !fr(s) || !s.struct || m.has(s.struct)))(n, a)).flatMap((n) => {
    const s = n.struct;
    return a.add(s), [s, ...K(s, e, a)];
  }) : [];
}, le = (r, e) => K(r, e, /* @__PURE__ */ new Set()), Mr = (r) => !Array.isArray(r) && typeof r == "object" && r !== null && !!(Rr(r) && Wr(r) && zr(r) && "parameters" in r) && Zr(r), Rr = (r) => "name" in r && typeof r.name == "string", Wr = (r) => "status" in r && typeof r.status == "boolean", zr = (r) => "description" in r && typeof r.description == "string", Zr = (r) => typeof r.parameters == "object" && r.parameters !== null && Object.values(r.parameters).every((e) => typeof e == "string"), Hr = /\s*\/\//, Kr = /\s*[var|let|const]\s+[^\s]+\s*=/, Ur = /^\s{0,3}[\[|\]\;]/, Yr = (r) => r.split(`
`).filter((e) => !((a) => Hr.test(a) || Ur.test(a) || Kr.test(a))(e)), pe = (r, e) => {
  const a = `[${Yr(r).join("")}]`;
  try {
    const t = JSON.parse(a);
    if (!Array.isArray(t)) return { complete: !1, plugins: [], message: e.notArray, invalidPlugins: 0 };
    const n = t.filter(Mr), s = t.length - n.length;
    return { complete: s === 0, plugins: n, invalidPlugins: s, message: s <= 0 ? e.success : e.partialSuccess };
  } catch (t) {
    return {
      complete: !1,
      plugins: [],
      invalidPlugins: 0,
      message: e.parseError,
      error: t
    };
  }
}, de = (r, e) => {
  const a = Xr(e);
  return r.map((t) => ({ description: t.description, name: t.name, status: t.status, parameters: Qr(t, a) }));
}, Qr = (r, e) => {
  const a = e.get(r.name);
  if (!a) return r.parameters;
  const t = Object.entries(r.parameters).filter(([n]) => !a.has(n));
  return Object.fromEntries(t);
}, Xr = (r) => new Map(r.map((e) => [e.pluginName, new Set(e.params)])), qr = (r) => {
  const e = T();
  return {
    target: "MZ",
    meta: r.meta,
    commands: Gr(r.commands, e),
    params: E(r.params, e),
    structs: re(r.structs, e)
  };
}, E = (r, e) => Object.fromEntries(r.map((a) => {
  const t = z(a, e);
  return [a.name, t.attr];
})), Gr = (r, e) => Object.fromEntries(r.map((a) => [a.command, {
  desc: a.desc,
  text: a.text,
  args: E(a.args, e)
}])), re = (r, e) => Object.fromEntries(r.map((a) => [a.name, { params: E(a.params, e) }])), fe = (r) => ((e) => qr(R(e, "")))(r), ge = (r, e = T()) => {
  const a = R(r.source, r.locale);
  return { locale: r.locale, meta: a.meta, pluginName: r.pluginName, target: "MZ", dependencies: a.dependencies, schema: Jr(a, e) };
};
export {
  Pe as classifyFileParams,
  he as classifyPluginParams,
  Ae as classifyTextParams,
  Dr as collectDependentStructNames,
  Jr as compilePluginAsArraySchema,
  Oe as convertPluginCommandSchema,
  Yr as convertPluginsJSToJSON,
  Se as convertStructSchema,
  ve as createClassifiedStructMap,
  T as createDeepJSONParserHandlers,
  xe as createStructMap,
  se as filterPluginParamByText,
  oe as filterPluginSchemaByFileParam,
  ce as filterPluginSchemaByNumberParam,
  v as filterPluginSchemaByParam,
  me as filterPluginSchemaByVariableParam,
  Ne as hasNumberValueParam,
  Ce as hasScalarAttr,
  F as hasStructAttr,
  ur as hasTextAttr,
  ke as isArrayAttr,
  je as isArrayParam,
  we as isArrayParamEx,
  ue as isErrorStructParam,
  pr as isFileAttr,
  Te as isNumberArrayParam,
  lr as isNumberAttr,
  Be as isNumberValueParam,
  Je as isNumberValueParamEx,
  ie as isRmmzDataKind,
  Ee as isScalarParam,
  _e as isStringArrayParam,
  De as isStringValueParam,
  Le as isStructArrayAttr,
  fr as isStructArrayParam,
  Fe as isStructAttr,
  dr as isStructParam,
  ir as isVariableAttr,
  $r as lookupKind,
  de as omitPluginParam,
  Ve as paramHasText,
  or as parseDeepJSON,
  Ie as parseDeepRecord,
  ae as parsePlugin,
  R as parsePluginByLocale,
  pe as parsePluginParamRecord2,
  ge as pluginSourceToArraySchema,
  fe as pluginSourceToJSON,
  Fr as rebuildCommands,
  ne as stringifyDeepJSON,
  te as stringifyDeepRecord,
  le as structDependencies,
  $e as toArrayPluginParam,
  Me as toObjectPluginParams,
  Re as toObjectPluginParamsOld,
  Mr as validatePluginJS
};
