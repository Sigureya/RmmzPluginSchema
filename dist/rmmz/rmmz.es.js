import { o as R, v as $, B as q, D as Q, E as X, n as rr, r as er } from "../shared/structMap.es.js";
import { a as be, c as ge, b as _e, g as Pe, f as ye, h as he, i as Ie, z as Le, q as Ne, k as Ce, j as Me, l as Fe, A as Te, x as xe, y as ve, m as De, C as je, w as Re, s as ke, p as Be, u as we, e as Ge, d as Je, t as Ve } from "../shared/structMap.es.js";
const ar = (r, e) => {
  const a = function(t) {
    return Object.fromEntries(t.map((s) => [s.struct, s.params.filter(R)]));
  }(r);
  return function(t, s, c) {
    return t.reduce((m) => {
      if (!m.changed) return m;
      const f = t.filter((p) => !m.names.has(p) && s[p].some((o) => m.names.has(o.attr.struct)));
      return f.length === 0 ? { names: m.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...m.names, ...f]), changed: !0 };
    }, {
      names: c,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, y = (r, e) => {
  const a = r.structs.filter((c) => c.params.some((m) => e(m))), t = new Set(a.map((c) => c.struct)), s = ar(r.structs, t);
  return {
    structs: tr(r.structs, s, e),
    commands: sr(r.commands, s, e),
    params: C(r.params, s, e)
  };
}, C = (r, e, a) => r.filter((t) => R(t) ? e.has(t.attr.struct) : a(t)), tr = (r, e, a) => r.reduce((t, s) => {
  const c = C(s.params, e, a);
  return c.length === 0 || t.push({ struct: s.struct, params: c }), t;
}, []), sr = (r, e, a) => r.reduce((t, s) => {
  const c = C(s.args, e, a);
  return c.length === 0 || t.push({ ...s.desc ? {
    desc: s.desc
  } : {}, ...s.text ? { text: s.text } : {}, command: s.command, args: c }), t;
}, []), Lr = (r) => y(r, $), Nr = (r) => y(r, q), Cr = (r) => y(r, Q), Mr = (r) => y(r, X), nr = {
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
}, cr = ["data", "system", "system"], mr = (r) => {
  const e = nr[r];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: r } : {
    author: "rmmz",
    module: cr[e],
    kind: [r, "variable", "switch"][e]
  };
}, Fr = (r) => {
  const e = mr(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, k = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((s) => ((c, m) => !(!rr(c) && !er(c) || !c.struct || m.has(c.struct)))(s, a)).flatMap((s) => {
    const c = s.struct;
    return a.add(c), [c, ...k(c, e, a)];
  }) : [];
}, Tr = (r, e) => k(r, e, /* @__PURE__ */ new Set()), B = (r) => {
  const e = JSON.parse(r);
  return Array.isArray(e) ? e.map(b) : typeof e == "object" && e !== null ? w(e) : e;
}, xr = (r) => w(r), w = (r) => Object.fromEntries(Object.entries(r).map(([e, a]) => [e, b(a)])), b = (r) => {
  if (typeof r != "string") return r;
  try {
    const e = JSON.parse(r);
    return Array.isArray(e) ? e.map(b) : typeof e == "object" && e !== null ? Object.fromEntries(Object.entries(e).map(([a, t]) => [a, b(t)])) : e;
  } catch {
    return r;
  }
}, vr = (r) => JSON.stringify(or(r)), A = (r) => typeof r == "object" && r !== null && !Array.isArray(r), or = (r) => Array.isArray(r) ? ir(r) : A(r) ? g(r) : {}, g = (r) => A(r) ? Object.fromEntries(Object.entries(r).map(([e, a]) => {
  if (Array.isArray(a)) {
    const t = a.map((s) => A(s) ? JSON.stringify(g(s)) : String(s));
    return [e, JSON.stringify(t)];
  }
  return A(a) ? [e, JSON.stringify(g(a))] : [e, String(a)];
})) : {}, ir = (r) => r.map((e) => typeof e == "object" && e !== null ? JSON.stringify(g(e)) : String(e)), G = (r, e) => Object.entries(e).reduce((a, [t, s]) => {
  if (t in r) {
    const c = r[t];
    if (typeof c == "string") return { ...a, [t]: s(c) };
  }
  return a;
}, {}), d = (r, e, a, t) => ({ default: e, ...G(a, t), kind: r }), _ = (r, e, a) => ({
  default: [],
  ...G(e, a),
  kind: r
}), J = "BODY", V = "STRUCT", S = "NONE", ur = (r, e) => {
  const a = r.lines.length > 0 ? M(r) : r, t = e[1] || void 0;
  return { ...a, structName: t, blockType: t ? V : "INVALID", locale: e[2], lines: [] };
}, lr = (r) => ({
  ...r.lines.length > 0 ? M(r) : r,
  blockType: J,
  structName: void 0,
  locale: void 0,
  lines: []
}), M = (r) => r.blockType === J ? {
  ...r,
  bodies: r.bodies.concat([{ lines: [...r.lines] }]),
  lines: [],
  blockType: S
} : r.structName && r.blockType === V ? {
  ...r,
  structs: r.structs.concat([{ struct: r.structName, locale: r.locale, lines: [...r.lines] }]),
  blockType: S,
  structName: void 0,
  locale: void 0,
  lines: []
} : { ...r, blockType: S, structName: void 0, lines: [] }, dr = (r) => r.currentOption ? {
  items: r.items.concat({ option: r.currentOption, value: r.currentOption })
} : r, U = "help", L = "kind", h = "text", v = "struct", z = (r) => {
  if (L in r.attr) {
    const e = pr[r.attr.kind];
    if (e) return e(r);
  }
  return d("any", "", r.attr, P);
}, n = (r) => r, K = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), P = {
  default: n,
  text: n,
  desc: n,
  parent: n
}, D = (r) => d("string", "", r.attr, P), j = (r) => {
  const e = { default: (a) => B(a), text: n, desc: n, parent: n };
  return _("string[]", r.attr, e);
}, i = (r, e) => {
  const a = {
    default: K,
    text: n,
    desc: n,
    parent: n
  };
  return _(e, r.attr, a);
}, u = (r, e) => {
  const a = { default: (t) => parseInt(t, 10), text: n, desc: n, parent: n };
  return d(e, 0, r.attr, a);
}, pr = {
  number: (r) => ((e) => {
    const a = {
      default: (t) => parseFloat(t),
      text: n,
      desc: n,
      decimals: (t) => parseInt(t, 10),
      min: (t) => parseFloat(t),
      max: (t) => parseFloat(t),
      parent: n
    };
    return d("number", 0, e.attr, a);
  })(r),
  "number[]": (r) => {
    const e = { default: K, text: n, desc: n, decimals: (a) => parseInt(a, 10), min: (a) => parseFloat(a), max: (a) => parseFloat(a), parent: n };
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
      text: n,
      desc: n,
      on: n,
      off: n,
      parent: n
    };
    return d("boolean", !0, r.attr, e);
  },
  file: (r) => {
    const e = { default: n, text: n, desc: n, parent: n, dir: n };
    return { dir: "", ...d("file", "", r.attr, e) };
  },
  "file[]": (r) => {
    const e = { default: (a) => B(a), text: n, desc: n, parent: n, dir: n };
    return { dir: "", ..._("file[]", r.attr, e) };
  }
}, N = (r) => ({
  ...typeof r.desc == "string" ? { desc: r.desc } : {},
  ...typeof r.text == "string" ? { text: r.text } : {}
}), O = (r) => {
  const e = fr(r), a = Ar(e);
  return Er(a);
}, fr = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: { ...r.currentParam, options: dr(r.currentOption).items } };
  }
  return r;
}, Er = (r) => r.currentParam ? {
  ...r,
  params: [...r.params, r.currentParam],
  currentParam: null,
  currentContext: null
} : r, Ar = (r) => {
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
}, W = (r) => {
  const e = ((c) => {
    const m = c.split(`
`), f = {
      structs: [],
      bodies: [],
      structName: void 0,
      locale: void 0,
      lines: [],
      blockType: S
    }, p = m.reduce((o, H) => {
      const E = H.trim(), x = E.match(/^\/\*~struct~([A-Za-z0-9_]+)(?::([A-Za-z0-9_-]+))?/);
      return x ? ur(o, x) : E === "/*:" ? lr(o) : E === "*/" ? o.lines.length > 0 ? M(o) : o : { ...o, lines: o.lines.concat([E]) };
    }, f);
    return { structs: p.structs, bodies: p.bodies };
  })(r), a = e.structs.map((c) => Sr(c)), t = Or(e);
  if (!t) return { params: [], commands: [], meta: {}, helpLines: [], structs: a };
  const s = Z(t, Y);
  return {
    params: s.params,
    commands: s.commands,
    meta: s.meta,
    helpLines: s.helpLines,
    structs: a
  };
}, Sr = (r) => {
  const e = Z(r, Y);
  return { name: r.struct, params: e.params };
}, Or = (r) => {
  if (r.bodies.length !== 0) return r.bodies[0];
}, Z = (r, e) => {
  const a = r.lines.reduce((t, s) => {
    const c = s.trimEnd().replace(/^[\*\s]*/, "");
    if (!c.startsWith("@")) return t.currentContext === U ? { ...t, helpLines: t.helpLines.concat(c) } : t;
    const m = c.match(/^@(\S+)\s*(.*)$/);
    if (!m) return t;
    const [, f, p] = m, o = e[f];
    return o ? o(t, p.trim()) : t;
  }, br());
  return O(a);
}, br = () => ({
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
}), Y = {
  param: (r, e) => {
    const a = O(r);
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
    const a = O(r);
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
  help: (r) => ({ ...O(r), currentContext: U }),
  option: (r, e) => {
    if (!r.currentParam) return r;
    const a = ((t, s) => t.currentOption ? { items: t.items.concat({ option: t.currentOption, value: t.currentOption }), currentOption: s } : { items: t.items, currentOption: s })(r.currentOption ?? {
      items: []
    }, e);
    return { ...r, currentOption: a };
  },
  value: (r, e) => {
    if (!r.currentOption) return r;
    const a = ((t, s) => t.currentOption ? { items: t.items.concat({ option: t.currentOption, value: s }) } : {
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
}, gr = (r) => ({
  target: "MZ",
  meta: r.meta,
  commands: _r(r.commands),
  params: F(r.params),
  structs: Pr(r.structs)
}), F = (r) => Object.fromEntries(r.map((e) => [e.name, z(e)])), _r = (r) => Object.fromEntries(r.map((e) => [e.command, {
  desc: e.desc,
  text: e.text,
  args: F(e.args)
}])), Pr = (r) => Object.fromEntries(r.map((e) => [e.name, { params: F(e.params) }])), T = (r) => r.map((e) => ({ name: e.name, attr: z(e) })), yr = (r) => r.map((e) => ({
  command: e.command,
  desc: e.desc,
  text: e.text,
  args: T(e.args)
})), hr = (r) => r.map((e) => ({ struct: e.name, params: T(e.params) })), Dr = (r) => ((e) => gr(W(e)))(r), jr = (r, e) => {
  const a = W(e);
  return {
    meta: a.meta,
    pluginName: r,
    target: "MZ",
    schema: (t = a, { commands: yr(t.commands), params: T(t.params), structs: hr(t.structs) })
  };
  var t;
}, Rr = "bgm", kr = "se", Br = "me", wr = "bgs", Gr = "battlebacks1", Jr = "battlebacks2", Vr = "characters", Ur = "enemies", zr = "faces", Kr = "parallaxes", Wr = "pictures", Zr = "sv_actors", Yr = "sv_enemies", Hr = "system", $r = "tilesets", qr = "titles1", Qr = "titles2", Xr = "System.json", re = "Actors.json", ee = "Classes.json", ae = "Skills.json", te = "Items.json", se = "Weapons.json", ne = "Armors.json", ce = "Enemies.json", me = "Troops.json", oe = "States.json", ie = "Animations.json", ue = "Tilesets.json", le = "CommonEvents.json", de = "MapInfos.json", pe = "data", fe = "img", Ee = "audio", Ae = "js";
export {
  re as FILENAME_ACTORS,
  ie as FILENAME_ANIMATIONS,
  ne as FILENAME_ARMORS,
  ee as FILENAME_CLASSES,
  le as FILENAME_COMMON_EVENTS,
  ce as FILENAME_ENEMIES,
  te as FILENAME_ITEMS,
  de as FILENAME_MAP_INFOS,
  ae as FILENAME_SKILLS,
  oe as FILENAME_STATES,
  Xr as FILENAME_SYSTEM,
  ue as FILENAME_TILESET,
  me as FILENAME_TROOPS,
  se as FILENAME_WEAPONS,
  Ee as FOLDER_AUDIO,
  Rr as FOLDER_AUDIO_BGM,
  wr as FOLDER_AUDIO_BGS,
  Br as FOLDER_AUDIO_ME,
  kr as FOLDER_AUDIO_SE,
  pe as FOLDER_DATA,
  fe as FOLDER_IMG,
  Gr as FOLDER_IMG_BATTLEBACK1,
  Jr as FOLDER_IMG_BATTLEBACK2,
  Vr as FOLDER_IMG_CHACTERS,
  Ur as FOLDER_IMG_ENEMIES,
  zr as FOLDER_IMG_FACES,
  Kr as FOLDER_IMG_PARALLACES,
  Wr as FOLDER_IMG_PICTURES,
  Zr as FOLDER_IMG_SV_ACTORS,
  Yr as FOLDER_IMG_SV_ENEMIES,
  Hr as FOLDER_IMG_SYSTEM,
  $r as FOLDER_IMG_TILESETS,
  qr as FOLDER_IMG_TITLES1,
  Qr as FOLDER_IMG_TITLES2,
  Ae as FOLDER_JS,
  be as classifyFileParams,
  ge as classifyPluginParams,
  _e as classifyTextParams,
  ar as collectDependentStructNames,
  z as compileAttributes,
  Pe as convertPluginCommandSchema,
  ye as convertStructSchema,
  he as createClassifiedStructMap,
  Ie as createStructMap,
  Mr as filterPluginSchemaByFileParam,
  Nr as filterPluginSchemaByNumberParam,
  y as filterPluginSchemaByParam,
  Lr as filterPluginSchemaByStringParam,
  Cr as filterPluginSchemaByVariableParam,
  Le as hasNumberValueParam,
  Ne as hasScalarAttr,
  R as hasStructAttr,
  $ as hasTextAttr,
  Ce as isArrayAttr,
  Me as isArrayParam,
  Fe as isArrayParamEx,
  X as isFileAttr,
  Te as isNumberArrayParam,
  q as isNumberAttr,
  xe as isNumberValueParam,
  ve as isNumberValueParamEx,
  Fr as isRmmzDataKind,
  De as isScalarParam,
  je as isStringArrayParam,
  Re as isStringValueParam,
  ke as isStructArrayAttr,
  er as isStructArrayParam,
  Be as isStructAttr,
  rr as isStructParam,
  Q as isVariableAttr,
  mr as lookupKind,
  we as paramHasText,
  B as parseDeepJSON,
  xr as parseDeepRecord,
  jr as pluginSourceToArraySchema,
  Dr as pluginSourceToJSON,
  sr as rebuildCommands,
  vr as stringifyDeepJSON,
  Tr as structDependencies,
  Ge as toArrayPluginParam,
  Je as toObjectPluginParams,
  Ve as toObjectPluginParamsOld
};
