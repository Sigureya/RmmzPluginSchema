import { o as R, v as H, B as $, D as q, E as Q, n as X, r as rr } from "../shared/structMap.es.js";
import { a as Oe, c as Se, b as be, g as ge, f as _e, h as Pe, i as ye, z as he, q as Ie, k as Le, j as Ne, l as Me, A as Ce, x as Fe, y as Te, m as xe, C as ve, w as De, s as je, p as Re, u as ke, e as Be, d as we, t as Ge } from "../shared/structMap.es.js";
const Ir = "bgm", Lr = "se", Nr = "me", Mr = "bgs", Cr = "battlebacks1", Fr = "battlebacks2", Tr = "characters", xr = "enemies", vr = "faces", Dr = "parallaxes", jr = "pictures", Rr = "sv_actors", kr = "sv_enemies", Br = "system", wr = "tilesets", Gr = "titles1", Jr = "titles2", Vr = "System.json", Ur = "Actors.json", zr = "Classes.json", Kr = "Skills.json", Wr = "Items.json", Zr = "Weapons.json", Yr = "Armors.json", Hr = "Enemies.json", $r = "Troops.json", qr = "States.json", Qr = "Animations.json", Xr = "Tilesets.json", re = "CommonEvents.json", ee = "MapInfos.json", ae = "data", te = "img", ne = "audio", se = "js", er = (r, e) => {
  const a = function(t) {
    return Object.fromEntries(t.map((n) => [n.struct, n.params.filter(R)]));
  }(r);
  return function(t, n, c) {
    return t.reduce((m) => {
      if (!m.changed) return m;
      const f = t.filter((p) => !m.names.has(p) && n[p].some((o) => m.names.has(o.attr.struct)));
      return f.length === 0 ? { names: m.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...m.names, ...f]), changed: !0 };
    }, {
      names: c,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, y = (r, e) => {
  const a = r.structs.filter((c) => c.params.some((m) => e(m))), t = new Set(a.map((c) => c.struct)), n = er(r.structs, t);
  return { structs: ar(r.structs, n, e), commands: tr(r.commands, n, e), params: M(r.params, n, e) };
}, M = (r, e, a) => r.filter((t) => R(t) ? e.has(t.attr.struct) : a(t)), ar = (r, e, a) => r.reduce((t, n) => {
  const c = M(n.params, e, a);
  return c.length === 0 || t.push({ struct: n.struct, params: c }), t;
}, []), tr = (r, e, a) => r.reduce((t, n) => {
  const c = M(n.args, e, a);
  return c.length === 0 || t.push({
    ...n.desc ? { desc: n.desc } : {},
    ...n.text ? { text: n.text } : {},
    command: n.command,
    args: c
  }), t;
}, []), ce = (r) => y(r, H), me = (r) => y(r, $), oe = (r) => y(r, q), ie = (r) => y(r, Q), nr = {
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
}, sr = ["data", "system", "system"], cr = (r) => {
  const e = nr[r];
  return e === void 0 ? {
    author: "rmmz",
    module: "unknown",
    kind: r
  } : { author: "rmmz", module: sr[e], kind: [r, "variable", "switch"][e] };
}, ue = (r) => {
  const e = cr(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, k = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((n) => ((c, m) => !(!X(c) && !rr(c) || !c.struct || m.has(c.struct)))(n, a)).flatMap((n) => {
    const c = n.struct;
    return a.add(c), [c, ...k(c, e, a)];
  }) : [];
}, le = (r, e) => k(r, e, /* @__PURE__ */ new Set()), B = (r) => {
  const e = JSON.parse(r);
  return Array.isArray(e) ? e.map(b) : typeof e == "object" && e !== null ? Object.fromEntries(Object.entries(e).map(([a, t]) => [a, b(t)])) : e;
}, b = (r) => {
  if (typeof r != "string") return r;
  try {
    const e = JSON.parse(r);
    return Array.isArray(e) ? e.map(b) : typeof e == "object" && e !== null ? Object.fromEntries(Object.entries(e).map(([a, t]) => [a, b(t)])) : e;
  } catch {
    return r;
  }
}, de = (r) => JSON.stringify(mr(r)), A = (r) => typeof r == "object" && r !== null && !Array.isArray(r), mr = (r) => Array.isArray(r) ? or(r) : A(r) ? g(r) : {}, g = (r) => A(r) ? Object.fromEntries(Object.entries(r).map(([e, a]) => {
  if (Array.isArray(a)) {
    const t = a.map((n) => A(n) ? JSON.stringify(g(n)) : String(n));
    return [e, JSON.stringify(t)];
  }
  return A(a) ? [e, JSON.stringify(g(a))] : [e, String(a)];
})) : {}, or = (r) => r.map((e) => typeof e == "object" && e !== null ? JSON.stringify(g(e)) : String(e)), w = (r, e) => Object.entries(e).reduce((a, [t, n]) => {
  if (t in r) {
    const c = r[t];
    if (typeof c == "string") return { ...a, [t]: n(c) };
  }
  return a;
}, {}), d = (r, e, a, t) => ({ default: e, ...w(a, t), kind: r }), _ = (r, e, a) => ({
  default: [],
  ...w(e, a),
  kind: r
}), G = "BODY", J = "STRUCT", O = "NONE", ir = (r, e) => {
  const a = r.lines.length > 0 ? C(r) : r, t = e[1] || void 0;
  return { ...a, structName: t, blockType: t ? J : "INVALID", locale: e[2], lines: [] };
}, ur = (r) => ({
  ...r.lines.length > 0 ? C(r) : r,
  blockType: G,
  structName: void 0,
  locale: void 0,
  lines: []
}), C = (r) => r.blockType === G ? {
  ...r,
  bodies: r.bodies.concat([{ lines: [...r.lines] }]),
  lines: [],
  blockType: O
} : r.structName && r.blockType === J ? {
  ...r,
  structs: r.structs.concat([{ struct: r.structName, locale: r.locale, lines: [...r.lines] }]),
  blockType: O,
  structName: void 0,
  locale: void 0,
  lines: []
} : { ...r, blockType: O, structName: void 0, lines: [] }, lr = (r) => r.currentOption ? {
  items: r.items.concat({ option: r.currentOption, value: r.currentOption })
} : r, V = "help", L = "kind", h = "text", v = "struct", U = (r) => {
  if (L in r.attr) {
    const e = dr[r.attr.kind];
    if (e) return e(r);
  }
  return d("any", "", r.attr, P);
}, s = (r) => r, z = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), P = {
  default: s,
  text: s,
  desc: s,
  parent: s
}, D = (r) => d("string", "", r.attr, P), j = (r) => {
  const e = { default: (a) => B(a), text: s, desc: s, parent: s };
  return _("string[]", r.attr, e);
}, i = (r, e) => {
  const a = {
    default: z,
    text: s,
    desc: s,
    parent: s
  };
  return _(e, r.attr, a);
}, u = (r, e) => {
  const a = { default: (t) => parseInt(t, 10), text: s, desc: s, parent: s };
  return d(e, 0, r.attr, a);
}, dr = {
  number: (r) => ((e) => {
    const a = {
      default: (t) => parseFloat(t),
      text: s,
      desc: s,
      decimals: (t) => parseInt(t, 10),
      min: (t) => parseFloat(t),
      max: (t) => parseFloat(t),
      parent: s
    };
    return d("number", 0, e.attr, a);
  })(r),
  "number[]": (r) => {
    const e = { default: z, text: s, desc: s, decimals: (a) => parseInt(a, 10), min: (a) => parseFloat(a), max: (a) => parseFloat(a), parent: s };
    return _("number[]", r.attr, e);
  },
  string: D,
  "string[]": j,
  multiline_string: D,
  "multiline_string[]": j,
  combo: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => t.option)) ?? [];
    return { ...d("combo", "", r.attr, P), options: e };
  },
  select: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => ({ option: t.option, value: t.value }))) ?? [];
    return { ...d("select", "", r.attr, P), options: e };
  },
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
  boolean: (r) => {
    const e = {
      default: (a) => a === "true",
      text: s,
      desc: s,
      on: s,
      off: s,
      parent: s
    };
    return d("boolean", !0, r.attr, e);
  },
  file: (r) => {
    const e = { default: s, text: s, desc: s, parent: s, dir: s };
    return { dir: "", ...d("file", "", r.attr, e) };
  },
  "file[]": (r) => {
    const e = { default: (a) => B(a), text: s, desc: s, parent: s, dir: s };
    return { dir: "", ..._("file[]", r.attr, e) };
  }
}, N = (r) => ({
  ...typeof r.desc == "string" ? { desc: r.desc } : {},
  ...typeof r.text == "string" ? { text: r.text } : {}
}), S = (r) => {
  const e = pr(r), a = Er(e);
  return fr(a);
}, pr = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: { ...r.currentParam, options: lr(r.currentOption).items } };
  }
  return r;
}, fr = (r) => r.currentParam ? {
  ...r,
  params: [...r.params, r.currentParam],
  currentParam: null,
  currentContext: null
} : r, Er = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = { ...N(r.currentCommand), command: r.currentCommand.command, args: e };
  return {
    ...r,
    commands: [...r.commands, a],
    currentCommand: null,
    currentParam: null,
    currentContext: null,
    currentOption: null
  };
}, K = (r) => {
  const e = ((c) => {
    const m = c.split(`
`), f = {
      structs: [],
      bodies: [],
      structName: void 0,
      locale: void 0,
      lines: [],
      blockType: O
    }, p = m.reduce((o, Y) => {
      const E = Y.trim(), x = E.match(/^\/\*~struct~([A-Za-z0-9_]+)(?::([A-Za-z0-9_-]+))?/);
      return x ? ir(o, x) : E === "/*:" ? ur(o) : E === "*/" ? o.lines.length > 0 ? C(o) : o : { ...o, lines: o.lines.concat([E]) };
    }, f);
    return { structs: p.structs, bodies: p.bodies };
  })(r), a = e.structs.map((c) => Ar(c)), t = Or(e);
  if (!t) return { params: [], commands: [], meta: {}, helpLines: [], structs: a };
  const n = W(t, Z);
  return {
    params: n.params,
    commands: n.commands,
    meta: n.meta,
    helpLines: n.helpLines,
    structs: a
  };
}, Ar = (r) => {
  const e = W(r, Z);
  return { name: r.struct, params: e.params };
}, Or = (r) => {
  if (r.bodies.length !== 0) return r.bodies[0];
}, W = (r, e) => {
  const a = r.lines.reduce((t, n) => {
    const c = n.trimEnd().replace(/^[\*\s]*/, "");
    if (!c.startsWith("@")) return t.currentContext === V ? { ...t, helpLines: t.helpLines.concat(c) } : t;
    const m = c.match(/^@(\S+)\s*(.*)$/);
    if (!m) return t;
    const [, f, p] = m, o = e[f];
    return o ? o(t, p.trim()) : t;
  }, Sr());
  return S(a);
}, Sr = () => ({
  helpLines: [],
  params: [],
  commands: [],
  currentParam: null,
  currentCommand: null,
  currentContext: null,
  currentOption: null,
  dependencies: { base: [], orderBefore: [], orderAfter: [] },
  meta: {}
}), l = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: { ...r.currentParam, attr: { ...r.currentParam.attr, [e]: a } } } : r, I = (r, e, a) => ({
  ...r,
  meta: { [e]: a, ...r.meta }
}), Z = {
  param: (r, e) => {
    const a = S(r);
    return a.params.some((t) => t.name === e) ? a : { ...a, currentContext: "param", currentParam: { name: e, attr: {} } };
  },
  text: (r, e) => r.currentParam ? l(r, h, e) : r.currentCommand && !(h in r.currentCommand) ? { ...r, currentCommand: {
    ...N(r.currentCommand),
    command: r.currentCommand.command,
    args: r.currentCommand.args,
    [h]: e
  } } : r,
  desc: (r, e) => r.currentParam ? l(r, "desc", e) : r.currentCommand ? { ...r, currentCommand: { ...r.currentCommand, desc: e } } : r,
  command: (r, e) => {
    const a = S(r);
    return a.commands.some((t) => t.command === e) ? a : { ...a, currentCommand: { command: e, args: [] }, currentParam: null };
  },
  arg: (r, e) => {
    if (!r.currentCommand) return r;
    if (!r.currentParam) return {
      ...r,
      currentParam: { name: e, attr: {} }
    };
    const a = { ...N(r.currentCommand), command: r.currentCommand.command, args: r.currentCommand.args.concat(r.currentParam) };
    return {
      ...r,
      commands: r.commands,
      currentCommand: a,
      currentContext: "arg",
      currentParam: { name: e, attr: {} }
    };
  },
  help: (r) => ({ ...S(r), currentContext: V }),
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
      const a = e.slice(7, -1), t = l(r, v, a);
      return l(t, L, v);
    }
    return r.currentParam ? l(r, L, e) : r;
  },
  default: (r, e) => l(r, "default", e),
  on: (r, e) => l(r, "on", e),
  off: (r, e) => l(r, "off", e),
  min: (r, e) => l(r, "min", e),
  max: (r, e) => l(r, "max", e),
  base: (r, e) => {
    return { ...r, dependencies: (a = r.dependencies, t = e, { orderAfter: a.orderAfter, orderBefore: a.orderBefore, base: a.base.concat(t) }) };
    var a, t;
  },
  orderAfter: (r, e) => {
    return { ...r, dependencies: (a = r.dependencies, t = e, { base: a.base, orderBefore: a.orderBefore, orderAfter: a.orderAfter.concat(t) }) };
    var a, t;
  },
  orderBefore: (r, e) => {
    return {
      ...r,
      dependencies: (a = r.dependencies, t = e, { base: a.base, orderAfter: a.orderAfter, orderBefore: a.orderBefore.concat(t) })
    };
    var a, t;
  },
  author: (r, e) => I(r, "author", e),
  plugindesc: (r, e) => I(r, "plugindesc", e),
  url: (r, e) => I(r, "url", e)
}, br = (r) => ({
  target: "MZ",
  meta: r.meta,
  commands: gr(r.commands),
  params: F(r.params),
  structs: _r(r.structs)
}), F = (r) => Object.fromEntries(r.map((e) => [e.name, U(e)])), gr = (r) => Object.fromEntries(r.map((e) => [e.command, {
  desc: e.desc,
  text: e.text,
  args: F(e.args)
}])), _r = (r) => Object.fromEntries(r.map((e) => [e.name, { params: F(e.params) }])), T = (r) => r.map((e) => ({ name: e.name, attr: U(e) })), Pr = (r) => r.map((e) => ({
  command: e.command,
  desc: e.desc,
  text: e.text,
  args: T(e.args)
})), yr = (r) => r.map((e) => ({ struct: e.name, params: T(e.params) })), pe = (r) => ((e) => br(K(e)))(r), fe = (r, e) => {
  const a = K(e);
  return {
    meta: a.meta,
    pluginName: r,
    target: "MZ",
    schema: (t = a, { commands: Pr(t.commands), params: T(t.params), structs: yr(t.structs) })
  };
  var t;
};
export {
  Ur as FILENAME_ACTORS,
  Qr as FILENAME_ANIMATIONS,
  Yr as FILENAME_ARMORS,
  zr as FILENAME_CLASSES,
  re as FILENAME_COMMON_EVENTS,
  Hr as FILENAME_ENEMIES,
  Wr as FILENAME_ITEMS,
  ee as FILENAME_MAP_INFOS,
  Kr as FILENAME_SKILLS,
  qr as FILENAME_STATES,
  Vr as FILENAME_SYSTEM,
  Xr as FILENAME_TILESET,
  $r as FILENAME_TROOPS,
  Zr as FILENAME_WEAPONS,
  ne as FOLDER_AUDIO,
  Ir as FOLDER_AUDIO_BGM,
  Mr as FOLDER_AUDIO_BGS,
  Nr as FOLDER_AUDIO_ME,
  Lr as FOLDER_AUDIO_SE,
  ae as FOLDER_DATA,
  te as FOLDER_IMG,
  Cr as FOLDER_IMG_BATTLEBACK1,
  Fr as FOLDER_IMG_BATTLEBACK2,
  Tr as FOLDER_IMG_CHACTERS,
  xr as FOLDER_IMG_ENEMIES,
  vr as FOLDER_IMG_FACES,
  Dr as FOLDER_IMG_PARALLACES,
  jr as FOLDER_IMG_PICTURES,
  Rr as FOLDER_IMG_SV_ACTORS,
  kr as FOLDER_IMG_SV_ENEMIES,
  Br as FOLDER_IMG_SYSTEM,
  wr as FOLDER_IMG_TILESETS,
  Gr as FOLDER_IMG_TITLES1,
  Jr as FOLDER_IMG_TITLES2,
  se as FOLDER_JS,
  Oe as classifyFileParams,
  Se as classifyPluginParams,
  be as classifyTextParams,
  er as collectDependentStructNames,
  U as compileAttributes,
  ge as convertPluginCommandSchema,
  _e as convertStructSchema,
  Pe as createClassifiedStructMap,
  ye as createStructMap,
  ie as filterPluginSchemaByFileParam,
  me as filterPluginSchemaByNumberParam,
  y as filterPluginSchemaByParam,
  ce as filterPluginSchemaByStringParam,
  oe as filterPluginSchemaByVariableParam,
  he as hasNumberValueParam,
  Ie as hasScalarAttr,
  R as hasStructAttr,
  H as hasTextAttr,
  Le as isArrayAttr,
  Ne as isArrayParam,
  Me as isArrayParamEx,
  Q as isFileAttr,
  Ce as isNumberArrayParam,
  $ as isNumberAttr,
  Fe as isNumberValueParam,
  Te as isNumberValueParamEx,
  ue as isRmmzDataKind,
  xe as isScalarParam,
  ve as isStringArrayParam,
  De as isStringValueParam,
  je as isStructArrayAttr,
  rr as isStructArrayParam,
  Re as isStructAttr,
  X as isStructParam,
  q as isVariableAttr,
  cr as lookupKind,
  ke as paramHasText,
  B as parseDeepJSON,
  fe as pluginSourceToArraySchema,
  pe as pluginSourceToJSON,
  tr as rebuildCommands,
  de as stringifyDeepJSON,
  le as structDependencies,
  Be as toArrayPluginParam,
  we as toObjectPluginParams,
  Ge as toObjectPluginParamsOld
};
