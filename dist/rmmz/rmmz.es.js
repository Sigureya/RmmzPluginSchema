import { o as D, v as Z, B as Y, D as H, E as $, n as q, r as Q } from "../shared/structMap.es.js";
import { a as de, c as pe, b as fe, g as Ee, f as Ae, h as Oe, i as Se, z as be, q as _e, k as Pe, j as ge, l as he, A as Ie, x as Le, y as ye, m as Me, C as Ce, w as Fe, s as Ne, p as Te, u as xe, e as ve, d as De, t as Re } from "../shared/structMap.es.js";
const Pr = "bgm", gr = "se", hr = "me", Ir = "bgs", Lr = "battlebacks1", yr = "battlebacks2", Mr = "characters", Cr = "enemies", Fr = "faces", Nr = "parallaxes", Tr = "pictures", xr = "sv_actors", vr = "sv_enemies", Dr = "system", Rr = "tilesets", jr = "titles1", kr = "titles2", Br = "System.json", wr = "Actors.json", Gr = "Classes.json", Vr = "Skills.json", Ur = "Items.json", zr = "Weapons.json", Kr = "Armors.json", Wr = "Enemies.json", Jr = "Troops.json", Zr = "States.json", Yr = "Animations.json", Hr = "Tilesets.json", $r = "CommonEvents.json", qr = "MapInfos.json", Qr = "data", Xr = "img", re = "audio", ee = "js", X = (r, e) => {
  const a = function(t) {
    return Object.fromEntries(t.map((n) => [n.struct, n.params.filter(D)]));
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
}, P = (r, e) => {
  const a = r.structs.filter((c) => c.params.some((m) => e(m))), t = new Set(a.map((c) => c.struct)), n = X(r.structs, t);
  return { structs: rr(r.structs, n, e), commands: er(r.commands, n, e), params: y(r.params, n, e) };
}, y = (r, e, a) => r.filter((t) => D(t) ? e.has(t.attr.struct) : a(t)), rr = (r, e, a) => r.reduce((t, n) => {
  const c = y(n.params, e, a);
  return c.length === 0 || t.push({ struct: n.struct, params: c }), t;
}, []), er = (r, e, a) => r.reduce((t, n) => {
  const c = y(n.args, e, a);
  return c.length === 0 || t.push({
    ...n.desc ? { desc: n.desc } : {},
    ...n.text ? { text: n.text } : {},
    command: n.command,
    args: c
  }), t;
}, []), ae = (r) => P(r, Z), te = (r) => P(r, Y), ne = (r) => P(r, H), se = (r) => P(r, $), ar = {
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
  return e === void 0 ? {
    author: "rmmz",
    module: "unknown",
    kind: r
  } : { author: "rmmz", module: tr[e], kind: [r, "variable", "switch"][e] };
}, ce = (r) => {
  const e = nr(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, R = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((n) => ((c, m) => !(!q(c) && !Q(c) || !c.struct || m.has(c.struct)))(n, a)).flatMap((n) => {
    const c = n.struct;
    return a.add(c), [c, ...R(c, e, a)];
  }) : [];
}, me = (r, e) => R(r, e, /* @__PURE__ */ new Set()), j = (r, e) => Object.entries(e).reduce((a, [t, n]) => {
  if (t in r) {
    const c = r[t];
    if (typeof c == "string") return { ...a, [t]: n(c) };
  }
  return a;
}, {}), d = (r, e, a, t) => ({
  default: e,
  ...j(a, t),
  kind: r
}), S = (r, e, a) => ({ default: [], ...j(e, a), kind: r }), k = "BODY", B = "STRUCT", A = "NONE", sr = (r, e) => {
  const a = r.lines.length > 0 ? M(r) : r, t = e[1] || void 0;
  return {
    ...a,
    structName: t,
    blockType: t ? B : "INVALID",
    locale: e[2],
    lines: []
  };
}, cr = (r) => ({ ...r.lines.length > 0 ? M(r) : r, blockType: k, structName: void 0, locale: void 0, lines: [] }), M = (r) => r.blockType === k ? {
  ...r,
  bodies: r.bodies.concat([{ lines: [...r.lines] }]),
  lines: [],
  blockType: A
} : r.structName && r.blockType === B ? { ...r, structs: r.structs.concat([{
  struct: r.structName,
  locale: r.locale,
  lines: [...r.lines]
}]), blockType: A, structName: void 0, locale: void 0, lines: [] } : { ...r, blockType: A, structName: void 0, lines: [] }, mr = (r) => r.currentOption ? { items: r.items.concat({
  option: r.currentOption,
  value: r.currentOption
}) } : r, w = "help", I = "kind", g = "text", T = "struct", G = (r) => {
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
}, V = (r) => {
  if (I in r.attr) {
    const e = or[r.attr.kind];
    if (e) return e(r);
  }
  return d("any", "", r.attr, _);
}, s = (r) => r, U = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), _ = {
  default: s,
  text: s,
  desc: s,
  parent: s
}, x = (r) => d("string", "", r.attr, _), v = (r) => {
  const e = { default: (a) => G(a), text: s, desc: s, parent: s };
  return S("string[]", r.attr, e);
}, u = (r, e) => {
  const a = {
    default: U,
    text: s,
    desc: s,
    parent: s
  };
  return S(e, r.attr, a);
}, i = (r, e) => {
  const a = { default: (t) => parseInt(t, 10), text: s, desc: s, parent: s };
  return d(e, 0, r.attr, a);
}, or = {
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
    const e = { default: U, text: s, desc: s, decimals: (a) => parseInt(a, 10), min: (a) => parseFloat(a), max: (a) => parseFloat(a), parent: s };
    return S("number[]", r.attr, e);
  },
  string: x,
  "string[]": v,
  multiline_string: x,
  "multiline_string[]": v,
  combo: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => t.option)) ?? [];
    return { ...d("combo", "", r.attr, _), options: e };
  },
  select: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => ({ option: t.option, value: t.value }))) ?? [];
    return { ...d("select", "", r.attr, _), options: e };
  },
  actor: (r) => i(r, "actor"),
  "actor[]": (r) => u(r, "actor[]"),
  class: (r) => i(r, "class"),
  "class[]": (r) => u(r, "class[]"),
  skill: (r) => i(r, "skill"),
  "skill[]": (r) => u(r, "skill[]"),
  item: (r) => i(r, "item"),
  "item[]": (r) => u(r, "item[]"),
  weapon: (r) => i(r, "weapon"),
  "weapon[]": (r) => u(r, "weapon[]"),
  armor: (r) => i(r, "armor"),
  "armor[]": (r) => u(r, "armor[]"),
  state: (r) => i(r, "state"),
  "state[]": (r) => u(r, "state[]"),
  enemy: (r) => i(r, "enemy"),
  "enemy[]": (r) => u(r, "enemy[]"),
  common_event: (r) => i(r, "common_event"),
  "common_event[]": (r) => u(r, "common_event[]"),
  switch: (r) => i(r, "switch"),
  "switch[]": (r) => u(r, "switch[]"),
  variable: (r) => i(r, "variable"),
  "variable[]": (r) => u(r, "variable[]"),
  troop: (r) => i(r, "troop"),
  "troop[]": (r) => u(r, "troop[]"),
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
    const e = { default: (a) => G(a), text: s, desc: s, parent: s, dir: s };
    return { dir: "", ...S("file[]", r.attr, e) };
  }
}, L = (r) => ({
  ...typeof r.desc == "string" ? { desc: r.desc } : {},
  ...typeof r.text == "string" ? { text: r.text } : {}
}), O = (r) => {
  const e = ur(r), a = lr(e);
  return ir(a);
}, ur = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: { ...r.currentParam, options: mr(r.currentOption).items } };
  }
  return r;
}, ir = (r) => r.currentParam ? {
  ...r,
  params: [...r.params, r.currentParam],
  currentParam: null,
  currentContext: null
} : r, lr = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = { ...L(r.currentCommand), command: r.currentCommand.command, args: e };
  return {
    ...r,
    commands: [...r.commands, a],
    currentCommand: null,
    currentParam: null,
    currentContext: null,
    currentOption: null
  };
}, z = (r) => {
  const e = ((c) => {
    const m = c.split(`
`), f = {
      structs: [],
      bodies: [],
      structName: void 0,
      locale: void 0,
      lines: [],
      blockType: A
    }, p = m.reduce((o, J) => {
      const E = J.trim(), N = E.match(/^\/\*~struct~([A-Za-z0-9_]+)(?::([A-Za-z0-9_-]+))?/);
      return N ? sr(o, N) : E === "/*:" ? cr(o) : E === "*/" ? o.lines.length > 0 ? M(o) : o : { ...o, lines: o.lines.concat([E]) };
    }, f);
    return { structs: p.structs, bodies: p.bodies };
  })(r), a = e.structs.map((c) => dr(c)), t = pr(e);
  if (!t) return { params: [], commands: [], meta: {}, helpLines: [], structs: a };
  const n = K(t, W);
  return {
    params: n.params,
    commands: n.commands,
    meta: n.meta,
    helpLines: n.helpLines,
    structs: a
  };
}, dr = (r) => {
  const e = K(r, W);
  return { name: r.struct, params: e.params };
}, pr = (r) => {
  if (r.bodies.length !== 0) return r.bodies[0];
}, K = (r, e) => {
  const a = r.lines.reduce((t, n) => {
    const c = n.trimEnd().replace(/^[\*\s]*/, "");
    if (!c.startsWith("@")) return t.currentContext === w ? { ...t, helpLines: t.helpLines.concat(c) } : t;
    const m = c.match(/^@(\S+)\s*(.*)$/);
    if (!m) return t;
    const [, f, p] = m, o = e[f];
    return o ? o(t, p.trim()) : t;
  }, fr());
  return O(a);
}, fr = () => ({
  helpLines: [],
  params: [],
  commands: [],
  currentParam: null,
  currentCommand: null,
  currentContext: null,
  currentOption: null,
  dependencies: { base: [], orderBefore: [], orderAfter: [] },
  meta: {}
}), l = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: { ...r.currentParam, attr: { ...r.currentParam.attr, [e]: a } } } : r, h = (r, e, a) => ({
  ...r,
  meta: { [e]: a, ...r.meta }
}), W = {
  param: (r, e) => {
    const a = O(r);
    return a.params.some((t) => t.name === e) ? a : { ...a, currentContext: "param", currentParam: { name: e, attr: {} } };
  },
  text: (r, e) => r.currentParam ? l(r, g, e) : r.currentCommand && !(g in r.currentCommand) ? { ...r, currentCommand: {
    ...L(r.currentCommand),
    command: r.currentCommand.command,
    args: r.currentCommand.args,
    [g]: e
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
    const a = { ...L(r.currentCommand), command: r.currentCommand.command, args: r.currentCommand.args.concat(r.currentParam) };
    return {
      ...r,
      commands: r.commands,
      currentCommand: a,
      currentContext: "arg",
      currentParam: { name: e, attr: {} }
    };
  },
  help: (r) => ({ ...O(r), currentContext: w }),
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
      const a = e.slice(7, -1), t = l(r, T, a);
      return l(t, I, T);
    }
    return r.currentParam ? l(r, I, e) : r;
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
  author: (r, e) => h(r, "author", e),
  plugindesc: (r, e) => h(r, "plugindesc", e),
  url: (r, e) => h(r, "url", e)
}, Er = (r) => ({
  target: "MZ",
  meta: r.meta,
  commands: Ar(r.commands),
  params: C(r.params),
  structs: Or(r.structs)
}), C = (r) => Object.fromEntries(r.map((e) => [e.name, V(e)])), Ar = (r) => Object.fromEntries(r.map((e) => [e.command, {
  desc: e.desc,
  text: e.text,
  args: C(e.args)
}])), Or = (r) => Object.fromEntries(r.map((e) => [e.name, { params: C(e.params) }])), F = (r) => r.map((e) => ({ name: e.name, attr: V(e) })), Sr = (r) => r.map((e) => ({
  command: e.command,
  desc: e.desc,
  text: e.text,
  args: F(e.args)
})), br = (r) => r.map((e) => ({ struct: e.name, params: F(e.params) })), oe = (r) => ((e) => Er(z(e)))(r), ue = (r, e) => {
  const a = z(e);
  return {
    meta: a.meta,
    pluginName: r,
    target: "MZ",
    schema: (t = a, { commands: Sr(t.commands), params: F(t.params), structs: br(t.structs) })
  };
  var t;
};
export {
  wr as FILENAME_ACTORS,
  Yr as FILENAME_ANIMATIONS,
  Kr as FILENAME_ARMORS,
  Gr as FILENAME_CLASSES,
  $r as FILENAME_COMMON_EVENTS,
  Wr as FILENAME_ENEMIES,
  Ur as FILENAME_ITEMS,
  qr as FILENAME_MAP_INFOS,
  Vr as FILENAME_SKILLS,
  Zr as FILENAME_STATES,
  Br as FILENAME_SYSTEM,
  Hr as FILENAME_TILESET,
  Jr as FILENAME_TROOPS,
  zr as FILENAME_WEAPONS,
  re as FOLDER_AUDIO,
  Pr as FOLDER_AUDIO_BGM,
  Ir as FOLDER_AUDIO_BGS,
  hr as FOLDER_AUDIO_ME,
  gr as FOLDER_AUDIO_SE,
  Qr as FOLDER_DATA,
  Xr as FOLDER_IMG,
  Lr as FOLDER_IMG_BATTLEBACK1,
  yr as FOLDER_IMG_BATTLEBACK2,
  Mr as FOLDER_IMG_CHACTERS,
  Cr as FOLDER_IMG_ENEMIES,
  Fr as FOLDER_IMG_FACES,
  Nr as FOLDER_IMG_PARALLACES,
  Tr as FOLDER_IMG_PICTURES,
  xr as FOLDER_IMG_SV_ACTORS,
  vr as FOLDER_IMG_SV_ENEMIES,
  Dr as FOLDER_IMG_SYSTEM,
  Rr as FOLDER_IMG_TILESETS,
  jr as FOLDER_IMG_TITLES1,
  kr as FOLDER_IMG_TITLES2,
  ee as FOLDER_JS,
  de as classifyFileParams,
  pe as classifyPluginParams,
  fe as classifyTextParams,
  X as collectDependentStructNames,
  V as compileAttributes,
  Ee as convertPluginCommandSchema,
  Ae as convertStructSchema,
  Oe as createClassifiedStructMap,
  Se as createStructMap,
  se as filterPluginSchemaByFileParam,
  te as filterPluginSchemaByNumberParam,
  P as filterPluginSchemaByParam,
  ae as filterPluginSchemaByStringParam,
  ne as filterPluginSchemaByVariableParam,
  be as hasNumberValueParam,
  _e as hasScalarAttr,
  D as hasStructAttr,
  Z as hasTextAttr,
  Pe as isArrayAttr,
  ge as isArrayParam,
  he as isArrayParamEx,
  $ as isFileAttr,
  Ie as isNumberArrayParam,
  Y as isNumberAttr,
  Le as isNumberValueParam,
  ye as isNumberValueParamEx,
  ce as isRmmzDataKind,
  Me as isScalarParam,
  Ce as isStringArrayParam,
  Fe as isStringValueParam,
  Ne as isStructArrayAttr,
  Q as isStructArrayParam,
  Te as isStructAttr,
  q as isStructParam,
  H as isVariableAttr,
  nr as lookupKind,
  xe as paramHasText,
  ue as pluginSourceToArraySchema,
  oe as pluginSourceToJSON,
  er as rebuildCommands,
  me as structDependencies,
  ve as toArrayPluginParam,
  De as toObjectPluginParams,
  Re as toObjectPluginParamsOld
};
