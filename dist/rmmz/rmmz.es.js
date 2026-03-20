import { j as D, A as Y, k as q, q as H, o as Q, z as X, x as G, R as x, C as rr, S as F, T as er, U as A, V as ar, W as tr, X as B, O as nr, P as sr, Q as cr, Y as mr, Z as or, _ as ir, $ as ur, a0 as lr, a1 as pr, a2 as dr, a3 as fr } from "../shared/constants.es.js";
import { c as ge, a as ye, b as be, d as Pe, e as he, f as Oe, g as ve, h as Ae, i as Se, l as xe, m as Ce, n as Ne, p as ke, r as je, s as we, t as Te, u as Be, v as Je, w as Ee, y as _e, B as De, D as Fe, E as Ve, F as Le, G as ze } from "../shared/constants.es.js";
const gr = (r, e) => {
  const a = function(t) {
    return Object.fromEntries(t.map((n) => [n.struct, n.params.filter(D)]));
  }(r);
  return function(t, n, c) {
    return t.reduce((m) => {
      if (!m.changed) return m;
      const u = t.filter((d) => !m.names.has(d) && n[d].some((o) => m.names.has(o.attr.struct)));
      return u.length === 0 ? { names: m.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...m.names, ...u]), changed: !0 };
    }, {
      names: c,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, ee = (r) => v(r, q), ae = (r) => v(r, H), te = (r) => v(r, Y), ne = (r) => v(r, Q), v = (r, e) => {
  const a = r.structs.filter((c) => c.params.some((m) => e(m))), t = new Set(a.map((c) => c.struct)), n = gr(r.structs, t);
  return {
    structs: yr(r.structs, n, e),
    commands: br(r.commands, n, e),
    params: N(r.params, n, e)
  };
}, N = (r, e, a) => r.filter((t) => D(t) ? e.has(t.attr.struct) : a(t)), yr = (r, e, a) => r.map((t) => ({
  struct: t.struct,
  params: N(t.params, e, a)
})).filter((t) => t.params.length > 0), br = (r, e, a) => r.map((t) => ({
  ...t.desc ? { desc: t.desc } : {},
  ...t.text ? { text: t.text } : {},
  command: t.command,
  args: N(t.args, e, a)
})).filter((t) => t.args.length > 0), Pr = {
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
}, hr = ["data", "system", "system"], Or = (r) => {
  const e = Pr[r];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: r } : { author: "rmmz", module: hr[e], kind: [r, "variable", "switch"][e] };
}, se = (r) => {
  const e = Or(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, V = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((n) => ((c, m) => !(!X(c) && !G(c) || !c.struct || m.has(c.struct)))(n, a)).flatMap((n) => {
    const c = n.struct;
    return a.add(c), [c, ...V(c, e, a)];
  }) : [];
}, ce = (r, e) => V(r, e, /* @__PURE__ */ new Set()), me = (r) => L(r), oe = (r) => JSON.stringify(L(r)), g = (r) => typeof r == "object" && r !== null && !Array.isArray(r), L = (r) => Array.isArray(r) ? vr(r) : g(r) ? P(r) : {}, P = (r) => g(r) ? Object.fromEntries(Object.entries(r).map(([e, a]) => {
  if (Array.isArray(a)) {
    const t = a.map((n) => g(n) ? JSON.stringify(P(n)) : String(n));
    return [e, JSON.stringify(t)];
  }
  return g(a) ? [e, JSON.stringify(P(a))] : [e, String(a)];
})) : {}, vr = (r) => r.map((e) => typeof e == "object" && e !== null ? JSON.stringify(P(e)) : String(e)), Ar = (r) => !Array.isArray(r) && typeof r == "object" && r !== null && !!(Sr(r) && xr(r) && Cr(r) && "parameters" in r) && Nr(r), Sr = (r) => "name" in r && typeof r.name == "string", xr = (r) => "status" in r && typeof r.status == "boolean", Cr = (r) => "description" in r && typeof r.description == "string", Nr = (r) => typeof r.parameters == "object" && r.parameters !== null && Object.values(r.parameters).every((e) => typeof e == "string"), kr = /\s*\/\//, jr = /\s*[var|let|const]\s+[^\s]+\s*=/, wr = /^\s{0,3}[\[|\]\;]/, Tr = (r) => r.split(`
`).filter((e) => !((a) => kr.test(a) || wr.test(a) || jr.test(a))(e)), ie = (r, e) => {
  const a = `[${Tr(r).join("")}]`;
  try {
    const t = JSON.parse(a);
    if (!Array.isArray(t)) return { complete: !1, plugins: [], message: e.notArray, invalidPlugins: 0 };
    const n = t.filter(Ar), c = t.length - n.length;
    return { complete: c === 0, plugins: n, invalidPlugins: c, message: c <= 0 ? e.success : e.partialSuccess };
  } catch (t) {
    return {
      complete: !1,
      plugins: [],
      invalidPlugins: 0,
      message: e.parseError,
      error: t
    };
  }
}, ue = (r, e) => {
  const a = Jr(e);
  return r.map((t) => ({ description: t.description, name: t.name, status: t.status, parameters: Br(t, a) }));
}, Br = (r, e) => {
  const a = e.get(r.name);
  if (!a) return r.parameters;
  const t = Object.entries(r.parameters).filter(([n]) => !a.has(n));
  return Object.fromEntries(t);
}, Jr = (r) => new Map(r.map((e) => [e.pluginName, new Set(e.params)])), z = (r, e) => {
  const a = Object.entries(e).filter(([t]) => t in r).map(([t, n]) => [t, n(r[t])]);
  return Object.fromEntries(a);
}, f = (r, e, a, t) => ({ default: e, ...z(a, t), kind: r }), h = (r, e, a) => ({ default: [], ...z(e, a), kind: r }), Er = (r, e) => {
  const a = r.map((t) => t.locale === void 0 ? t.struct : t.locale === e ? `${t.struct}!` : "");
  return new Set(a);
}, M = "BODY", R = "STRUCT", y = "NONE", _r = (r, e) => {
  const a = e.trim(), t = a.match(/^\/\*~struct~([A-Za-z0-9_]*)(?::([A-Za-z0-9_-]+))?/);
  return t ? Dr(r, t) : /^\/\*:/.test(a) ? Vr(r, a) : a === "*/" ? r.lines.length > 0 ? k(r) : r : {
    ...r,
    lines: r.lines.concat([a])
  };
}, Dr = (r, e) => {
  const a = r.lines.length > 0 ? k(r) : r, t = e[1] || void 0;
  return { ...a, structName: t, blockType: t ? R : "INVALID", locale: e[2], lines: [] };
}, Fr = (r) => {
  if (r) {
    const e = r.match(/^\/\*:(\w+)/);
    if (e) return e[1];
  }
}, Vr = (r, e) => ({ ...r.lines.length > 0 ? k(r) : r, locale: Fr(e), blockType: M, lines: [] }), k = (r) => {
  if (r.blockType === M) {
    const e = r.locale ? {
      locale: r.locale,
      lines: [...r.lines]
    } : { lines: [...r.lines] };
    return { ...r, bodies: r.bodies.concat([e]), lines: [], blockType: y, locale: void 0 };
  }
  return r.structName && r.blockType === R ? {
    ...r,
    structs: r.structs.concat([{ struct: r.structName, locale: r.locale, lines: [...r.lines] }]),
    blockType: y,
    structName: void 0,
    locale: void 0,
    lines: []
  } : {
    ...r,
    blockType: y,
    structName: void 0,
    locale: void 0,
    lines: []
  };
}, Lr = (r) => r.currentOption ? { items: r.items.concat({ option: r.currentOption, value: r.currentOption }) } : r, $ = (r, e) => {
  if (x in r.attr) {
    const a = zr[r.attr.kind];
    if (a) return a(r, e);
  }
  return { name: r.name, attr: f("any", "", r.attr, O) };
}, s = (r) => r, I = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), O = {
  default: s,
  text: s,
  desc: s,
  parent: s
}, J = (r, e) => ({ name: r.name, attr: f(e, "", r.attr, O) }), E = (r, e, a) => {
  const t = { default: (n) => e.parseStringArray(n).value, text: s, desc: s, parent: s };
  return { name: r.name, attr: h(a, r.attr, t) };
}, l = (r, e) => {
  const a = { default: (t) => I(t), text: s, desc: s, parent: s };
  return { name: r.name, attr: h(e, r.attr, a) };
}, p = (r, e) => {
  const a = { default: (t) => parseInt(t, 10), text: s, desc: s, parent: s };
  return { name: r.name, attr: f(e, 0, r.attr, a) };
}, _ = (r) => r.length > 0 ? { errors: r } : {}, zr = {
  actor: (r) => p(r, "actor"),
  "actor[]": (r) => l(r, "actor[]"),
  class: (r) => p(r, "class"),
  "class[]": (r) => l(r, "class[]"),
  skill: (r) => p(r, "skill"),
  "skill[]": (r) => l(r, "skill[]"),
  item: (r) => p(r, "item"),
  "item[]": (r) => l(r, "item[]"),
  weapon: (r) => p(r, "weapon"),
  "weapon[]": (r) => l(r, "weapon[]"),
  armor: (r) => p(r, "armor"),
  "armor[]": (r) => l(r, "armor[]"),
  state: (r) => p(r, "state"),
  "state[]": (r) => l(r, "state[]"),
  enemy: (r) => p(r, "enemy"),
  "enemy[]": (r) => l(r, "enemy[]"),
  common_event: (r) => p(r, "common_event"),
  "common_event[]": (r) => l(r, "common_event[]"),
  switch: (r) => p(r, "switch"),
  "switch[]": (r) => l(r, "switch[]"),
  variable: (r) => p(r, "variable"),
  "variable[]": (r) => l(r, "variable[]"),
  troop: (r) => p(r, "troop"),
  "troop[]": (r) => l(r, "troop[]"),
  file: (r) => {
    const e = { default: s, text: s, desc: s, parent: s, dir: s };
    return { name: r.name, attr: { dir: "", ...f("file", "", r.attr, e) } };
  },
  "file[]": (r, e) => {
    const a = { default: (t) => e.parseStringArray(t).value, text: s, desc: s, parent: s, dir: s };
    return {
      name: r.name,
      attr: { dir: "", ...h("file[]", r.attr, a) }
    };
  },
  combo: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => t.option)) ?? [];
    return { name: r.name, attr: { ...f("combo", "", r.attr, O), options: e } };
  },
  select: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => ({ option: t.option, value: t.value }))) ?? [];
    return { name: r.name, attr: { ...f("select", "", r.attr, O), options: e } };
  },
  struct: (r, e) => {
    const { errors: a, value: t } = e.parseObject(r.attr.default || "{}"), n = { text: s, desc: s, parent: s }, c = a.length === 0 ? t : {};
    return { name: r.name, attr: {
      struct: r.attr.struct || "",
      ...f("struct", c, r.attr, n),
      ..._(a)
    } };
  },
  "struct[]": (r, e) => {
    const { errors: a, value: t } = e.parseObjectArray(r.attr.default || "[]"), n = { text: s, desc: s, parent: s }, c = a.length === 0 ? t : [];
    return {
      name: r.name,
      attr: { struct: r.attr.struct || "", ...f("struct[]", c, r.attr, n), ..._(a) }
    };
  },
  boolean: (r) => {
    const e = { default: (a) => a === "true", text: s, desc: s, on: s, off: s, parent: s };
    return {
      name: r.name,
      attr: f("boolean", !0, r.attr, e)
    };
  },
  number: (r) => {
    const e = {
      default: (a) => parseFloat(a),
      text: s,
      desc: s,
      decimals: (a) => parseInt(a, 10),
      min: (a) => parseFloat(a),
      max: (a) => parseFloat(a),
      parent: s
    };
    return { name: r.name, attr: f("number", 0, r.attr, e) };
  },
  "number[]": (r) => {
    const e = {
      default: (a) => I(a),
      text: s,
      desc: s,
      decimals: (a) => parseInt(a, 10),
      min: (a) => parseFloat(a),
      max: (a) => parseFloat(a),
      parent: s
    };
    return { name: r.name, attr: h("number[]", r.attr, e) };
  },
  string: (r) => J(r, "string"),
  "string[]": (r, e) => E(r, e, "string[]"),
  multiline_string: (r) => J(r, "multiline_string"),
  "multiline_string[]": (r, e) => E(r, e, "multiline_string[]")
}, j = () => ({
  parseStringArray: (r) => ({ value: Mr(r), errors: [] }),
  parseObjectArray: () => ({ value: [], errors: [] }),
  parseObject: (r) => ({ value: rr(r), errors: [] })
}), Mr = (r) => {
  try {
    const e = JSON.parse(r);
    if (Array.isArray(e) && e.every((a) => typeof a == "string")) return e;
  } catch {
  }
  return [];
}, C = (r) => ({
  ...typeof r.desc == "string" ? { desc: r.desc } : {},
  ...typeof r.text == "string" ? { text: r.text } : {}
}), b = (r) => {
  const e = Rr(r), a = Ir(e);
  return $r(a);
}, Rr = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: {
      ...r.currentParam,
      options: Lr(r.currentOption).items
    } };
  }
  return r;
}, $r = (r) => r.currentParam ? {
  ...r,
  params: [...r.params, r.currentParam],
  currentCommand: null,
  currentOption: null,
  currentParam: null,
  currentContext: null
} : r, Ir = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = {
    ...C(r.currentCommand),
    command: r.currentCommand.command,
    args: e
  };
  return {
    ...r,
    commands: [...r.commands, a],
    currentCommand: null,
    currentParam: null,
    currentContext: null,
    currentOption: null
  };
}, W = (r, e = "en") => {
  const a = ((m) => {
    const u = m.split(`
`), d = { structs: [], bodies: [], structName: void 0, locale: void 0, lines: [], blockType: y }, o = u.reduce((K, U) => _r(K, U), d);
    return {
      structs: o.structs,
      bodies: o.bodies
    };
  })(r), t = ((m, u) => {
    const d = Er(m, u);
    return m.filter((o) => o.locale === void 0 && d.has(o.struct) ? !d.has(`${o.struct}!`) : o.locale === u && d.has(`${o.struct}!`));
  })(a.structs, e).map((m) => Wr(m)), n = ((m, u) => m.reduce((d, o) => o.locale === u || o.locale === void 0 && d === void 0 ? o : d, void 0))(a.bodies, e);
  if (!n) return {
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    dependencies: { base: [], orderBefore: [], orderAfter: [] },
    structs: t
  };
  const c = Z(n);
  return {
    params: c.params,
    commands: c.commands,
    meta: c.meta,
    helpLines: c.helpLines,
    structs: t,
    dependencies: c.dependencies
  };
}, Wr = (r) => {
  const e = Z(r);
  return { name: r.struct, params: e.params };
}, Z = (r) => {
  const e = r.lines.reduce((a, t) => Kr(a, t), Zr());
  return b(e);
}, Zr = () => ({
  helpLines: [],
  params: [],
  commands: [],
  currentParam: null,
  currentCommand: null,
  currentContext: null,
  currentOption: null,
  dependencies: { base: [], orderBefore: [], orderAfter: [] },
  meta: {}
}), Kr = (r, e, a = Ur) => {
  const t = e.trimEnd().replace(/^[\*\s]*/, "");
  if (!t.startsWith("@")) return r.currentContext === F ? { ...r, helpLines: r.helpLines.concat(t) } : r;
  const n = t.match(/^@(\S+)\s*(.*)$/);
  if (!n) return r;
  const [, c, m] = n, u = a[c];
  return u ? u(r, m.trim()) : r;
}, i = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: { ...r.currentParam, attr: {
  ...r.currentParam.attr,
  [e]: a
} } } : r, S = (r, e, a) => ({ ...r, meta: { [e]: a, ...r.meta } }), Ur = {
  param: (r, e) => {
    const a = b(r);
    return a.params.some((t) => t.name === e) ? a : {
      ...a,
      currentContext: ar,
      currentParam: { name: e, attr: {} }
    };
  },
  text: (r, e) => r.currentParam ? i(r, A, e) : r.currentCommand && !(A in r.currentCommand) ? { ...r, currentCommand: {
    ...C(r.currentCommand),
    command: r.currentCommand.command,
    args: r.currentCommand.args,
    [A]: e
  } } : r,
  desc: (r, e) => r.currentParam ? i(r, tr, e) : r.currentCommand ? { ...r, currentCommand: { ...r.currentCommand, desc: e } } : r,
  command: (r, e) => {
    const a = b(r);
    return a.commands.some((t) => t.command === e) ? a : { ...a, currentCommand: { command: e, args: [] }, currentParam: null };
  },
  arg: (r, e) => {
    if (!r.currentCommand) return r;
    if (!r.currentParam) return { ...r, currentParam: { name: e, attr: {} } };
    const a = { ...C(r.currentCommand), command: r.currentCommand.command, args: r.currentCommand.args.concat(r.currentParam) };
    return { ...r, commands: r.commands, currentCommand: a, currentContext: er, currentParam: { name: e, attr: {} } };
  },
  help: (r) => ({ ...b(r), currentContext: F }),
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
    if (((a) => a.endsWith(">") && a.startsWith("struct<"))(e)) {
      const a = e.slice(7, -1), t = i(r, B, a);
      return i(t, x, B);
    }
    return r.currentParam ? i(r, x, e) : r;
  },
  parent: (r, e) => i(r, fr, e),
  default: (r, e) => i(r, dr, e),
  on: (r, e) => i(r, pr, e),
  off: (r, e) => i(r, lr, e),
  min: (r, e) => i(r, ur, e),
  max: (r, e) => i(r, ir, e),
  decimals: (r, e) => i(r, or, e),
  dir: (r, e) => i(r, mr, e),
  base: (r, e) => {
    return { ...r, dependencies: (a = r.dependencies, t = e, {
      orderAfter: a.orderAfter,
      orderBefore: a.orderBefore,
      base: a.base.concat(t)
    }) };
    var a, t;
  },
  orderAfter: (r, e) => {
    return { ...r, dependencies: (a = r.dependencies, t = e, { base: a.base, orderBefore: a.orderBefore, orderAfter: a.orderAfter.concat(t) }) };
    var a, t;
  },
  orderBefore: (r, e) => {
    return { ...r, dependencies: (a = r.dependencies, t = e, { base: a.base, orderAfter: a.orderAfter, orderBefore: a.orderBefore.concat(t) }) };
    var a, t;
  },
  author: (r, e) => S(r, cr, e),
  plugindesc: (r, e) => S(r, sr, e),
  url: (r, e) => S(r, nr, e)
}, Yr = (r) => {
  const e = j();
  return {
    target: "MZ",
    meta: r.meta,
    commands: qr(r.commands, e),
    params: w(r.params, e),
    structs: Hr(r.structs, e)
  };
}, w = (r, e) => Object.fromEntries(r.map((a) => {
  const t = $(a, e);
  return [a.name, t.attr];
})), qr = (r, e) => Object.fromEntries(r.map((a) => [a.command, {
  desc: a.desc,
  text: a.text,
  args: w(a.args, e)
}])), Hr = (r, e) => Object.fromEntries(r.map((a) => [a.name, { params: w(a.params, e) }])), Qr = (r, e = j()) => ({
  params: T(r.params, e),
  commands: Xr(r.commands, e),
  structs: Gr(r.structs, e)
}), T = (r, e) => r.map((a) => $(a, e)), Xr = (r, e) => r.map((a) => ({ command: a.command, desc: a.desc, text: a.text, args: T(a.args, e) })), Gr = (r, e) => r.map((a) => ({
  struct: a.name,
  params: T(a.params, e)
})), le = (r) => ((e) => Yr(W(e)))(r), pe = (r, e = j()) => {
  const a = W(r.source, r.locale);
  return {
    locale: r.locale,
    meta: a.meta,
    pluginName: r.pluginName,
    target: "MZ",
    dependencies: a.dependencies,
    schema: Qr(a, e)
  };
};
export {
  ge as classifyFileParams,
  ye as classifyPluginParams,
  be as classifyTextParams,
  gr as collectDependentStructNames,
  Pe as convertPluginCommandSchema,
  Tr as convertPluginsJSToJSON,
  he as convertStructSchema,
  Oe as createClassifiedStructMap,
  ve as createStructMap,
  ee as filterPluginParamByText,
  ne as filterPluginSchemaByFileParam,
  ae as filterPluginSchemaByNumberParam,
  v as filterPluginSchemaByParam,
  te as filterPluginSchemaByVariableParam,
  Ae as hasNumberValueParam,
  Se as hasScalarAttr,
  D as hasStructAttr,
  q as hasTextAttr,
  xe as isArrayAttr,
  Ce as isArrayParam,
  Ne as isArrayParamEx,
  Q as isFileAttr,
  ke as isNumberArrayParam,
  H as isNumberAttr,
  je as isNumberValueParam,
  we as isNumberValueParamEx,
  se as isRmmzDataKind,
  Te as isScalarParam,
  Be as isStringArrayParam,
  Je as isStringValueParam,
  Ee as isStructArrayAttr,
  G as isStructArrayParam,
  _e as isStructAttr,
  X as isStructParam,
  Y as isVariableAttr,
  Or as lookupKind,
  ue as omitPluginParam,
  De as paramHasText,
  rr as parseDeepJSON,
  Fe as parseDeepRecord,
  ie as parsePluginParamRecord,
  pe as pluginSourceToArraySchema,
  le as pluginSourceToJSON,
  br as rebuildCommands,
  oe as stringifyDeepJSON,
  me as stringifyDeepRecord,
  ce as structDependencies,
  Ve as toArrayPluginParam,
  Le as toObjectPluginParams,
  ze as toObjectPluginParamsOld,
  Ar as validatePluginJS
};
