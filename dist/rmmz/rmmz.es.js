import { h as D, l as I, s as Y, v as Z, w as H, g as R, k as $, d as q, j as Q } from "../shared/convert.es.js";
import { b as Ee, c as Ae, q as Oe, i as Se, e as be, r as _e, n as Pe, o as he, f as ge, u as Ie, m as Le, p as ye, a as Fe, t as Me } from "../shared/convert.es.js";
const Pr = "bgm", hr = "se", gr = "me", Ir = "bgs", Lr = "battlebacks1", yr = "battlebacks2", Fr = "characters", Mr = "enemies", Cr = "faces", Nr = "parallaxes", Tr = "pictures", xr = "sv_actors", vr = "sv_enemies", kr = "system", Dr = "tilesets", Rr = "titles1", jr = "titles2", Br = "System.json", wr = "Actors.json", Gr = "Classes.json", Vr = "Skills.json", Ur = "Items.json", zr = "Weapons.json", Kr = "Armors.json", Wr = "Enemies.json", Jr = "Troops.json", Yr = "States.json", Zr = "Animations.json", Hr = "Tilesets.json", $r = "CommonEvents.json", qr = "MapInfos.json", Qr = "data", Xr = "img", re = "audio", ee = "js", X = (r, e) => {
  const a = function(t) {
    return Object.fromEntries(t.map((n) => [n.struct, n.params.filter(D)]));
  }(r);
  return function(t, n, s) {
    return t.reduce((o) => {
      if (!o.changed) return o;
      const m = t.filter((f) => !o.names.has(f) && n[f].some((u) => o.names.has(u.attr.struct)));
      return m.length === 0 ? { names: o.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...o.names, ...m]), changed: !0 };
    }, {
      names: s,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, P = (r, e) => {
  const a = r.structs.filter((s) => s.params.some((o) => e(o))), t = new Set(a.map((s) => s.struct)), n = X(r.structs, t);
  return { structs: rr(r.structs, n, e), commands: er(r.commands, n, e), params: F(r.params, n, e) };
}, F = (r, e, a) => r.filter((t) => D(t) ? e.has(t.attr.struct) : a(t)), rr = (r, e, a) => r.reduce((t, n) => {
  const s = F(n.params, e, a);
  return s.length === 0 || t.push({ struct: n.struct, params: s }), t;
}, []), er = (r, e, a) => r.reduce((t, n) => {
  const s = F(n.args, e, a);
  return s.length === 0 || t.push({
    ...n.desc ? { desc: n.desc } : {},
    ...n.text ? { text: n.text } : {},
    command: n.command,
    args: s
  }), t;
}, []), ae = (r) => P(r, I), te = (r) => P(r, Y), ne = (r) => P(r, Z), se = (r) => P(r, H), ce = (r) => M(r, (e) => !0, (e) => !0), oe = (r) => M(r, (e) => e.attr.kind === "file", (e) => e.attr.kind === "file[]"), me = (r) => M(r, (e) => I(e), (e) => I(e)), M = (r, e, a) => {
  const t = [], n = [], s = [], o = [];
  return r.forEach((m) => {
    if (R(m.attr)) t.push({ name: m.name, attr: m.attr });
    else if ($(m)) n.push(m);
    else if (q(m)) {
      if (a(m)) return void o.push(m);
    } else e(m) && s.push(m);
  }), { structs: t, structArrays: n, scalas: s, scalaArrays: o };
}, ar = {
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
}, tr = ["data", "system", "system"], nr = (r) => {
  const e = ar[r];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: r } : {
    author: "rmmz",
    module: tr[e],
    kind: [r, "variable", "switch"][e]
  };
}, ue = (r) => {
  const e = nr(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, j = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((n) => ((s, o) => !(!R(s) && !Q(s) || !s.struct || o.has(s.struct)))(n, a)).flatMap((n) => {
    const s = n.struct;
    return a.add(s), [s, ...j(s, e, a)];
  }) : [];
}, ie = (r, e) => j(r, e, /* @__PURE__ */ new Set()), B = (r, e) => Object.entries(e).reduce((a, [t, n]) => {
  if (t in r) {
    const s = r[t];
    if (typeof s == "string") return { ...a, [t]: n(s) };
  }
  return a;
}, {}), p = (r, e, a, t) => ({
  default: e,
  ...B(a, t),
  kind: r
}), S = (r, e, a) => ({ default: [], ...B(e, a), kind: r }), w = "BODY", G = "STRUCT", A = "NONE", sr = (r, e) => {
  const a = r.lines.length > 0 ? C(r) : r, t = e[1] || void 0;
  return {
    ...a,
    structName: t,
    blockType: t ? G : "INVALID",
    locale: e[2],
    lines: []
  };
}, cr = (r) => ({ ...r.lines.length > 0 ? C(r) : r, blockType: w, structName: void 0, locale: void 0, lines: [] }), C = (r) => r.blockType === w ? {
  ...r,
  bodies: r.bodies.concat([{ lines: [...r.lines] }]),
  lines: [],
  blockType: A
} : r.structName && r.blockType === G ? { ...r, structs: r.structs.concat([{
  struct: r.structName,
  locale: r.locale,
  lines: [...r.lines]
}]), blockType: A, structName: void 0, locale: void 0, lines: [] } : { ...r, blockType: A, structName: void 0, lines: [] }, or = (r) => r.currentOption ? { items: r.items.concat({
  option: r.currentOption,
  value: r.currentOption
}) } : r, V = "help", L = "kind", h = "text", x = "struct", U = (r) => {
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
}, mr = (r) => {
  if (L in r.attr) {
    const e = ur[r.attr.kind];
    if (e) return e(r);
  }
  return p("any", "", r.attr, _);
}, c = (r) => r, z = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), _ = {
  default: c,
  text: c,
  desc: c,
  parent: c
}, v = (r) => p("string", "", r.attr, _), k = (r) => {
  const e = { default: (a) => U(a), text: c, desc: c, parent: c };
  return S("string[]", r.attr, e);
}, i = (r, e) => {
  const a = {
    default: z,
    text: c,
    desc: c,
    parent: c
  };
  return S(e, r.attr, a);
}, l = (r, e) => {
  const a = { default: (t) => parseInt(t, 10), text: c, desc: c, parent: c };
  return p(e, 0, r.attr, a);
}, ur = {
  number: (r) => ((e) => {
    const a = {
      default: (t) => parseFloat(t),
      text: c,
      desc: c,
      decimals: (t) => parseInt(t, 10),
      min: (t) => parseFloat(t),
      max: (t) => parseFloat(t),
      parent: c
    };
    return p("number", 0, e.attr, a);
  })(r),
  "number[]": (r) => {
    const e = { default: z, text: c, desc: c, decimals: (a) => parseInt(a, 10), min: (a) => parseFloat(a), max: (a) => parseFloat(a), parent: c };
    return S("number[]", r.attr, e);
  },
  string: v,
  "string[]": k,
  multiline_string: v,
  "multiline_string[]": k,
  combo: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => t.option)) ?? [];
    return { ...p("combo", "", r.attr, _), options: e };
  },
  select: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => ({ option: t.option, value: t.value }))) ?? [];
    return { ...p("select", "", r.attr, _), options: e };
  },
  actor: (r) => l(r, "actor"),
  "actor[]": (r) => i(r, "actor[]"),
  class: (r) => l(r, "class"),
  "class[]": (r) => i(r, "class[]"),
  skill: (r) => l(r, "skill"),
  "skill[]": (r) => i(r, "skill[]"),
  item: (r) => l(r, "item"),
  "item[]": (r) => i(r, "item[]"),
  weapon: (r) => l(r, "weapon"),
  "weapon[]": (r) => i(r, "weapon[]"),
  armor: (r) => l(r, "armor"),
  "armor[]": (r) => i(r, "armor[]"),
  state: (r) => l(r, "state"),
  "state[]": (r) => i(r, "state[]"),
  enemy: (r) => l(r, "enemy"),
  "enemy[]": (r) => i(r, "enemy[]"),
  common_event: (r) => l(r, "common_event"),
  "common_event[]": (r) => i(r, "common_event[]"),
  switch: (r) => l(r, "switch"),
  "switch[]": (r) => i(r, "switch[]"),
  variable: (r) => l(r, "variable"),
  "variable[]": (r) => i(r, "variable[]"),
  troop: (r) => l(r, "troop"),
  "troop[]": (r) => i(r, "troop[]"),
  boolean: (r) => {
    const e = {
      default: (a) => a === "true",
      text: c,
      desc: c,
      on: c,
      off: c,
      parent: c
    };
    return p("boolean", !0, r.attr, e);
  },
  file: (r) => {
    const e = { default: c, text: c, desc: c, parent: c, dir: c };
    return { dir: "", ...p("file", "", r.attr, e) };
  },
  "file[]": (r) => {
    const e = { default: (a) => U(a), text: c, desc: c, parent: c, dir: c };
    return { dir: "", ...S("file[]", r.attr, e) };
  }
}, le = (r) => new Map(r.map((e) => [e.struct, e.params.map((a) => a.attr)])), y = (r) => ({
  ...typeof r.desc == "string" ? { desc: r.desc } : {},
  ...typeof r.text == "string" ? { text: r.text } : {}
}), O = (r) => {
  const e = ir(r), a = dr(e);
  return lr(a);
}, ir = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: { ...r.currentParam, options: or(r.currentOption).items } };
  }
  return r;
}, lr = (r) => r.currentParam ? {
  ...r,
  params: [...r.params, r.currentParam],
  currentParam: null,
  currentContext: null
} : r, dr = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = { ...y(r.currentCommand), command: r.currentCommand.command, args: e };
  return {
    ...r,
    commands: [...r.commands, a],
    currentCommand: null,
    currentParam: null,
    currentContext: null,
    currentOption: null
  };
}, pr = (r) => {
  const e = ((s) => {
    const o = s.split(`
`), m = {
      structs: [],
      bodies: [],
      structName: void 0,
      locale: void 0,
      lines: [],
      blockType: A
    }, f = o.reduce((u, J) => {
      const E = J.trim(), T = E.match(/^\/\*~struct~([A-Za-z0-9_]+)(?::([A-Za-z0-9_-]+))?/);
      return T ? sr(u, T) : E === "/*:" ? cr(u) : E === "*/" ? u.lines.length > 0 ? C(u) : u : { ...u, lines: u.lines.concat([E]) };
    }, m);
    return { structs: f.structs, bodies: f.bodies };
  })(r), a = e.structs.map((s) => fr(s)), t = Er(e);
  if (!t) return { params: [], commands: [], meta: {}, helpLines: [], structs: a };
  const n = K(t, W);
  return {
    params: n.params,
    commands: n.commands,
    meta: n.meta,
    helpLines: n.helpLines,
    structs: a
  };
}, fr = (r) => {
  const e = K(r, W);
  return { name: r.struct, params: e.params };
}, Er = (r) => {
  if (r.bodies.length !== 0) return r.bodies[0];
}, K = (r, e) => {
  const a = r.lines.reduce((t, n) => {
    const s = n.trimEnd().replace(/^[\*\s]*/, "");
    if (!s.startsWith("@")) return t.currentContext === V ? { ...t, helpLines: t.helpLines.concat(s) } : t;
    const o = s.match(/^@(\S+)\s*(.*)$/);
    if (!o) return t;
    const [, m, f] = o, u = e[m];
    return u ? u(t, f.trim()) : t;
  }, Ar());
  return O(a);
}, Ar = () => ({
  helpLines: [],
  params: [],
  commands: [],
  currentParam: null,
  currentCommand: null,
  currentContext: null,
  currentOption: null,
  dependencies: { base: [], orderBefore: [], orderAfter: [] },
  meta: {}
}), d = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: { ...r.currentParam, attr: { ...r.currentParam.attr, [e]: a } } } : r, g = (r, e, a) => ({
  ...r,
  meta: { [e]: a, ...r.meta }
}), W = {
  param: (r, e) => {
    const a = O(r);
    return a.params.some((t) => t.name === e) ? a : { ...a, currentContext: "param", currentParam: { name: e, attr: {} } };
  },
  text: (r, e) => r.currentParam ? d(r, h, e) : r.currentCommand && !(h in r.currentCommand) ? { ...r, currentCommand: {
    ...y(r.currentCommand),
    command: r.currentCommand.command,
    args: r.currentCommand.args,
    [h]: e
  } } : r,
  desc: (r, e) => r.currentParam ? d(r, "desc", e) : r.currentCommand ? { ...r, currentCommand: { ...r.currentCommand, desc: e } } : r,
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
    const a = { ...y(r.currentCommand), command: r.currentCommand.command, args: r.currentCommand.args.concat(r.currentParam) };
    return {
      ...r,
      commands: r.commands,
      currentCommand: a,
      currentContext: "arg",
      currentParam: { name: e, attr: {} }
    };
  },
  help: (r) => ({ ...O(r), currentContext: V }),
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
      const a = e.slice(7, -1), t = d(r, x, a);
      return d(t, L, x);
    }
    return r.currentParam ? d(r, L, e) : r;
  },
  default: (r, e) => d(r, "default", e),
  on: (r, e) => d(r, "on", e),
  off: (r, e) => d(r, "off", e),
  min: (r, e) => d(r, "min", e),
  max: (r, e) => d(r, "max", e),
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
  author: (r, e) => g(r, "author", e),
  plugindesc: (r, e) => g(r, "plugindesc", e),
  url: (r, e) => g(r, "url", e)
}, Or = (r) => ({
  target: "MZ",
  meta: r.meta,
  commands: Sr(r.commands),
  params: N(r.params),
  structs: br(r.structs)
}), N = (r) => Object.fromEntries(r.map((e) => [e.name, mr(e)])), Sr = (r) => Object.fromEntries(r.map((e) => [e.command, {
  desc: e.desc,
  text: e.text,
  args: N(e.args)
}])), br = (r) => Object.fromEntries(r.map((e) => [e.name, { params: N(e.params) }])), de = (r) => ((e) => Or(pr(e)))(r);
export {
  wr as FILENAME_ACTORS,
  Zr as FILENAME_ANIMATIONS,
  Kr as FILENAME_ARMORS,
  Gr as FILENAME_CLASSES,
  $r as FILENAME_COMMON_EVENTS,
  Wr as FILENAME_ENEMIES,
  Ur as FILENAME_ITEMS,
  qr as FILENAME_MAP_INFOS,
  Vr as FILENAME_SKILLS,
  Yr as FILENAME_STATES,
  Br as FILENAME_SYSTEM,
  Hr as FILENAME_TILESET,
  Jr as FILENAME_TROOPS,
  zr as FILENAME_WEAPONS,
  re as FOLDER_AUDIO,
  Pr as FOLDER_AUDIO_BGM,
  Ir as FOLDER_AUDIO_BGS,
  gr as FOLDER_AUDIO_ME,
  hr as FOLDER_AUDIO_SE,
  Qr as FOLDER_DATA,
  Xr as FOLDER_IMG,
  Lr as FOLDER_IMG_BATTLEBACK1,
  yr as FOLDER_IMG_BATTLEBACK2,
  Fr as FOLDER_IMG_CHACTERS,
  Mr as FOLDER_IMG_ENEMIES,
  Cr as FOLDER_IMG_FACES,
  Nr as FOLDER_IMG_PARALLACES,
  Tr as FOLDER_IMG_PICTURES,
  xr as FOLDER_IMG_SV_ACTORS,
  vr as FOLDER_IMG_SV_ENEMIES,
  kr as FOLDER_IMG_SYSTEM,
  Dr as FOLDER_IMG_TILESETS,
  Rr as FOLDER_IMG_TITLES1,
  jr as FOLDER_IMG_TITLES2,
  ee as FOLDER_JS,
  oe as classifyFileParams,
  ce as classifyPluginParams,
  me as classifyTextParams,
  X as collectDependentStructNames,
  mr as compileAttributes,
  Ee as convertPluginCommandSchema,
  Ae as convertStructSchema,
  le as createStructMap,
  se as filterPluginSchemaByFileParam,
  te as filterPluginSchemaByNumberParam,
  P as filterPluginSchemaByParam,
  ae as filterPluginSchemaByStringParam,
  ne as filterPluginSchemaByVariableParam,
  Oe as hasNumberValueParam,
  D as hasStructAttr,
  I as hasTextAttr,
  q as isArrayAttr,
  Se as isArrayParam,
  be as isArrayParamEx,
  H as isFileAttr,
  _e as isNumberArrayParam,
  Y as isNumberAttr,
  Pe as isNumberValueParam,
  he as isNumberValueParamEx,
  ue as isRmmzDataKind,
  ge as isScalarParam,
  Ie as isStringArrayParam,
  Le as isStringValueParam,
  $ as isStructArrayAttr,
  Q as isStructArrayParam,
  R as isStructParam,
  Z as isVariableAttr,
  nr as lookupKind,
  ye as paramHasText,
  de as pluginSourceToJSON,
  er as rebuildCommands,
  ie as structDependencies,
  Fe as toArrayPluginParam,
  Me as toObjectPluginParams
};
