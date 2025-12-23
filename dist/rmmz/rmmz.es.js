import { o as D, v as $, B as Z, D as Y, E as H, n as q, r as Q, F as E, G as X } from "../shared/parseDeepJSON.es.js";
import { a as Ce, c as Te, b as xe, g as De, f as je, h as Re, i as ke, z as we, q as Be, k as Ge, j as Je, l as Ve, A as Ue, x as ze, y as Ke, m as We, C as $e, w as Ze, s as Ye, p as He, u as qe, e as Qe, d as Xe, t as ra } from "../shared/parseDeepJSON.es.js";
const rr = (r, e) => {
  const a = function(t) {
    return Object.fromEntries(t.map((n) => [n.struct, n.params.filter(D)]));
  }(r);
  return function(t, n, c) {
    return t.reduce((o) => {
      if (!o.changed) return o;
      const u = t.filter((p) => !o.names.has(p) && n[p].some((m) => o.names.has(m.attr.struct)));
      return u.length === 0 ? { names: o.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...o.names, ...u]), changed: !0 };
    }, {
      names: c,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, kr = (r) => P(r, $), wr = (r) => P(r, Z), Br = (r) => P(r, Y), Gr = (r) => P(r, H), P = (r, e) => {
  const a = r.structs.filter((c) => c.params.some((o) => e(o))), t = new Set(a.map((c) => c.struct)), n = rr(r.structs, t);
  return {
    structs: er(r.structs, n, e),
    commands: ar(r.commands, n, e),
    params: N(r.params, n, e)
  };
}, N = (r, e, a) => r.filter((t) => D(t) ? e.has(t.attr.struct) : a(t)), er = (r, e, a) => r.map((t) => ({
  struct: t.struct,
  params: N(t.params, e, a)
})).filter((t) => t.params.length > 0), ar = (r, e, a) => r.map((t) => ({
  ...t.desc ? { desc: t.desc } : {},
  ...t.text ? { text: t.text } : {},
  command: t.command,
  args: N(t.args, e, a)
})).filter((t) => t.args.length > 0), tr = { variable: 1, switch: 2, actor: 0, item: 0, weapon: 0, armor: 0, skill: 0, class: 0, state: 0, troop: 0, enemy: 0, common_event: 0 }, sr = ["data", "system", "system"], nr = (r) => {
  const e = tr[r];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: r } : { author: "rmmz", module: sr[e], kind: [r, "variable", "switch"][e] };
}, Jr = (r) => {
  const e = nr(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, j = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((n) => ((c, o) => !(!q(c) && !Q(c) || !c.struct || o.has(c.struct)))(n, a)).flatMap((n) => {
    const c = n.struct;
    return a.add(c), [c, ...j(c, e, a)];
  }) : [];
}, Vr = (r, e) => j(r, e, /* @__PURE__ */ new Set()), Ur = (r) => R(r), zr = (r) => JSON.stringify(R(r)), A = (r) => typeof r == "object" && r !== null && !Array.isArray(r), R = (r) => Array.isArray(r) ? cr(r) : A(r) ? g(r) : {}, g = (r) => A(r) ? Object.fromEntries(Object.entries(r).map(([e, a]) => {
  if (Array.isArray(a)) {
    const t = a.map((n) => A(n) ? JSON.stringify(g(n)) : String(n));
    return [e, JSON.stringify(t)];
  }
  return A(a) ? [e, JSON.stringify(g(a))] : [e, String(a)];
})) : {}, cr = (r) => r.map((e) => typeof e == "object" && e !== null ? JSON.stringify(g(e)) : String(e)), k = (r, e) => Object.entries(e).reduce((a, [t, n]) => {
  if (t in r) {
    const c = r[t];
    if (typeof c == "string") return { ...a, [t]: n(c) };
  }
  return a;
}, {}), f = (r, e, a, t) => ({ default: e, ...k(a, t), kind: r }), y = (r, e, a) => ({ default: [], ...k(e, a), kind: r }), or = (r, e) => {
  const a = r.map((t) => t.locale === void 0 ? t.struct : t.locale === e ? `${t.struct}!` : "");
  return new Set(a);
}, w = "BODY", B = "STRUCT", S = "NONE", mr = (r, e) => {
  const a = e.trim(), t = a.match(/^\/\*~struct~([A-Za-z0-9_]*)(?::([A-Za-z0-9_-]+))?/);
  return t ? ir(r, t) : /^\/\*:/.test(a) ? lr(r, a) : a === "*/" ? r.lines.length > 0 ? v(r) : r : {
    ...r,
    lines: r.lines.concat([a])
  };
}, ir = (r, e) => {
  const a = r.lines.length > 0 ? v(r) : r, t = e[1] || void 0;
  return { ...a, structName: t, blockType: t ? B : "INVALID", locale: e[2], lines: [] };
}, ur = (r) => {
  if (r) {
    const e = r.match(/^\/\*:(\w+)/);
    if (e) return e[1];
  }
}, lr = (r, e) => ({ ...r.lines.length > 0 ? v(r) : r, locale: ur(e), blockType: w, lines: [] }), v = (r) => {
  if (r.blockType === w) {
    const e = r.locale ? {
      locale: r.locale,
      lines: [...r.lines]
    } : { lines: [...r.lines] };
    return { ...r, bodies: r.bodies.concat([e]), lines: [], blockType: S, locale: void 0 };
  }
  return r.structName && r.blockType === B ? {
    ...r,
    structs: r.structs.concat([{ struct: r.structName, locale: r.locale, lines: [...r.lines] }]),
    blockType: S,
    structName: void 0,
    locale: void 0,
    lines: []
  } : {
    ...r,
    blockType: S,
    structName: void 0,
    locale: void 0,
    lines: []
  };
}, dr = (r) => r.currentOption ? { items: r.items.concat({ option: r.currentOption, value: r.currentOption }) } : r, G = "help", I = "kind", _ = "text", C = "struct", J = (r) => {
  if (I in r.attr) {
    const e = pr[r.attr.kind];
    if (e) return e(r);
  }
  return f("any", "", r.attr, b);
}, s = (r) => r, V = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), b = {
  default: s,
  text: s,
  desc: s,
  parent: s
}, T = (r) => f("string", "", r.attr, b), x = (r) => {
  const e = { default: (a) => E(a), text: s, desc: s, parent: s };
  return y("string[]", r.attr, e);
}, l = (r, e) => {
  const a = {
    default: V,
    text: s,
    desc: s,
    parent: s
  };
  return y(e, r.attr, a);
}, d = (r, e) => {
  const a = { default: (t) => parseInt(t, 10), text: s, desc: s, parent: s };
  return f(e, 0, r.attr, a);
}, pr = {
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
    return f("number", 0, e.attr, a);
  })(r),
  "number[]": (r) => {
    const e = { default: V, text: s, desc: s, decimals: (a) => parseInt(a, 10), min: (a) => parseFloat(a), max: (a) => parseFloat(a), parent: s };
    return y("number[]", r.attr, e);
  },
  string: T,
  "string[]": x,
  multiline_string: T,
  "multiline_string[]": x,
  combo: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => t.option)) ?? [];
    return { ...f("combo", "", r.attr, b), options: e };
  },
  select: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => ({ option: t.option, value: t.value }))) ?? [];
    return { ...f("select", "", r.attr, b), options: e };
  },
  actor: (r) => d(r, "actor"),
  "actor[]": (r) => l(r, "actor[]"),
  class: (r) => d(r, "class"),
  "class[]": (r) => l(r, "class[]"),
  skill: (r) => d(r, "skill"),
  "skill[]": (r) => l(r, "skill[]"),
  item: (r) => d(r, "item"),
  "item[]": (r) => l(r, "item[]"),
  weapon: (r) => d(r, "weapon"),
  "weapon[]": (r) => l(r, "weapon[]"),
  armor: (r) => d(r, "armor"),
  "armor[]": (r) => l(r, "armor[]"),
  state: (r) => d(r, "state"),
  "state[]": (r) => l(r, "state[]"),
  enemy: (r) => d(r, "enemy"),
  "enemy[]": (r) => l(r, "enemy[]"),
  common_event: (r) => d(r, "common_event"),
  "common_event[]": (r) => l(r, "common_event[]"),
  switch: (r) => d(r, "switch"),
  "switch[]": (r) => l(r, "switch[]"),
  variable: (r) => d(r, "variable"),
  "variable[]": (r) => l(r, "variable[]"),
  troop: (r) => d(r, "troop"),
  "troop[]": (r) => l(r, "troop[]"),
  boolean: (r) => {
    const e = {
      default: (a) => a === "true",
      text: s,
      desc: s,
      on: s,
      off: s,
      parent: s
    };
    return f("boolean", !0, r.attr, e);
  },
  file: (r) => {
    const e = { default: s, text: s, desc: s, parent: s, dir: s };
    return { dir: "", ...f("file", "", r.attr, e) };
  },
  "file[]": (r) => {
    const e = { default: (a) => E(a), text: s, desc: s, parent: s, dir: s };
    return { dir: "", ...y("file[]", r.attr, e) };
  },
  struct: (r) => {
    const e = ((t) => {
      if (!t.attr.default) return {};
      const n = E(t.attr.default);
      return Array.isArray(n) ? {} : typeof n == "object" && n !== null ? n : {};
    })(r), a = { text: s, desc: s, parent: s };
    return { struct: r.attr.struct || "", ...f("struct", e, r.attr, a) };
  },
  "struct[]": (r) => {
    const e = ((t) => {
      if (!t.attr.default) return [];
      const n = E(t.attr.default);
      return Array.isArray(n) && n.every((c) => typeof c == "object" && c !== null) ? n : [];
    })(r), a = { text: s, desc: s, parent: s };
    return { struct: r.attr.struct || "", ...f("struct[]", e, r.attr, a), default: e };
  }
}, fr = (r) => !Array.isArray(r) && typeof r == "object" && r !== null && !!(Er(r) && Ar(r) && Sr(r) && "parameters" in r) && Or(r), Er = (r) => "name" in r && typeof r.name == "string", Ar = (r) => "status" in r && typeof r.status == "boolean", Sr = (r) => "description" in r && typeof r.description == "string", Or = (r) => typeof r.parameters == "object" && r.parameters !== null && Object.values(r.parameters).every((e) => typeof e == "string"), gr = /\s*\/\//, yr = /\s*[var|let|const]\s+[^\s]+\s*=/, br = /^\s{0,3}[\[|\]\;]/, Pr = (r) => r.split(`
`).filter((e) => !((a) => gr.test(a) || br.test(a) || yr.test(a))(e)), _r = (r) => {
  const e = `[${Pr(r).join("")}]`, a = JSON.parse(e);
  if (!Array.isArray(a)) throw new Error("Parsed value is not an array");
  if (a.every(fr)) return a;
  throw new Error("Parsed value is not PluginParamsObject array");
}, L = (r) => ({ ...typeof r.desc == "string" ? { desc: r.desc } : {}, ...typeof r.text == "string" ? { text: r.text } : {} }), O = (r) => {
  const e = hr(r), a = Lr(e);
  return Ir(a);
}, hr = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: {
      ...r.currentParam,
      options: dr(r.currentOption).items
    } };
  }
  return r;
}, Ir = (r) => r.currentParam ? { ...r, params: [...r.params, r.currentParam], currentParam: null, currentContext: null } : r, Lr = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = {
    ...L(r.currentCommand),
    command: r.currentCommand.command,
    args: e
  };
  return { ...r, commands: [...r.commands, a], currentCommand: null, currentParam: null, currentContext: null, currentOption: null };
}, U = (r, e = "en") => {
  const a = ((o) => {
    const u = o.split(`
`), p = {
      structs: [],
      bodies: [],
      structName: void 0,
      locale: void 0,
      lines: [],
      blockType: S
    }, m = u.reduce((K, W) => mr(K, W), p);
    return { structs: m.structs, bodies: m.bodies };
  })(r), t = ((o, u) => {
    const p = or(o, u);
    return o.filter((m) => m.locale === void 0 && p.has(m.struct) ? !p.has(`${m.struct}!`) : m.locale === u && p.has(`${m.struct}!`));
  })(a.structs, e).map((o) => Nr(o)), n = ((o, u) => o.reduce((p, m) => m.locale === u || m.locale === void 0 && p === void 0 ? m : p, void 0))(a.bodies, e);
  if (!n) return {
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    structs: t
  };
  const c = z(n);
  return { params: c.params, commands: c.commands, meta: c.meta, helpLines: c.helpLines, structs: t, dependencies: c.dependencies };
}, Nr = (r) => {
  const e = z(r);
  return { name: r.struct, params: e.params };
}, z = (r) => {
  const e = r.lines.reduce((a, t) => Fr(a, t), vr());
  return O(e);
}, vr = () => ({
  helpLines: [],
  params: [],
  commands: [],
  currentParam: null,
  currentCommand: null,
  currentContext: null,
  currentOption: null,
  dependencies: { base: [], orderBefore: [], orderAfter: [] },
  meta: {}
}), Fr = (r, e, a = Mr) => {
  const t = e.trimEnd().replace(/^[\*\s]*/, "");
  if (!t.startsWith("@")) return r.currentContext === G ? { ...r, helpLines: r.helpLines.concat(t) } : r;
  const n = t.match(/^@(\S+)\s*(.*)$/);
  if (!n) return r;
  const [, c, o] = n, u = a[c];
  return u ? u(r, o.trim()) : r;
}, i = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: { ...r.currentParam, attr: { ...r.currentParam.attr, [e]: a } } } : r, h = (r, e, a) => ({
  ...r,
  meta: { [e]: a, ...r.meta }
}), Mr = {
  param: (r, e) => {
    const a = O(r);
    return a.params.some((t) => t.name === e) ? a : { ...a, currentContext: "param", currentParam: { name: e, attr: {} } };
  },
  text: (r, e) => r.currentParam ? i(r, _, e) : r.currentCommand && !(_ in r.currentCommand) ? { ...r, currentCommand: {
    ...L(r.currentCommand),
    command: r.currentCommand.command,
    args: r.currentCommand.args,
    [_]: e
  } } : r,
  desc: (r, e) => r.currentParam ? i(r, "desc", e) : r.currentCommand ? { ...r, currentCommand: { ...r.currentCommand, desc: e } } : r,
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
  help: (r) => ({ ...O(r), currentContext: G }),
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
      const a = e.slice(7, -1), t = i(r, C, a);
      return i(t, I, C);
    }
    return r.currentParam ? i(r, I, e) : r;
  },
  parent: (r, e) => i(r, "parent", e),
  default: (r, e) => i(r, "default", e),
  on: (r, e) => i(r, "on", e),
  off: (r, e) => i(r, "off", e),
  min: (r, e) => i(r, "min", e),
  max: (r, e) => i(r, "max", e),
  decimals: (r, e) => i(r, "decimals", e),
  dir: (r, e) => i(r, "dir", e),
  base: (r, e) => {
    return { ...r, dependencies: (a = r.dependencies, t = e, {
      orderAfter: a.orderAfter,
      orderBefore: a.orderBefore,
      base: a.base.concat(t)
    }) };
    var a, t;
  },
  orderAfter: (r, e) => {
    return { ...r, dependencies: (a = r.dependencies, t = e, {
      base: a.base,
      orderBefore: a.orderBefore,
      orderAfter: a.orderAfter.concat(t)
    }) };
    var a, t;
  },
  orderBefore: (r, e) => {
    return { ...r, dependencies: (a = r.dependencies, t = e, {
      base: a.base,
      orderAfter: a.orderAfter,
      orderBefore: a.orderBefore.concat(t)
    }) };
    var a, t;
  },
  author: (r, e) => h(r, "author", e),
  plugindesc: (r, e) => h(r, "plugindesc", e),
  url: (r, e) => h(r, "url", e)
}, Cr = (r) => ({
  target: "MZ",
  meta: r.meta,
  commands: Tr(r.commands),
  params: F(r.params),
  structs: xr(r.structs)
}), F = (r) => Object.fromEntries(r.map((e) => [e.name, J(e)])), Tr = (r) => Object.fromEntries(r.map((e) => [e.command, {
  desc: e.desc,
  text: e.text,
  args: F(e.args)
}])), xr = (r) => Object.fromEntries(r.map((e) => [e.name, { params: F(e.params) }])), M = (r) => r.map((e) => ({ name: e.name, attr: J(e) })), Dr = (r) => r.map((e) => ({
  command: e.command,
  desc: e.desc,
  text: e.text,
  args: M(e.args)
})), jr = (r) => r.map((e) => ({ struct: e.name, params: M(e.params) })), Kr = (r) => ((e) => Cr(U(e)))(r), Wr = (r) => {
  const e = U(r.source, r.locale);
  return { meta: e.meta, pluginName: r.pluginName, target: "MZ", schema: (a = e, { commands: Dr(a.commands), params: M(a.params), structs: jr(a.structs) }) };
  var a;
}, $r = (r) => _r(r).map((e) => ({
  description: e.description,
  name: e.name,
  status: e.status,
  parameters: X(e.parameters)
})), Zr = "bgm", Yr = "se", Hr = "me", qr = "bgs", Qr = "battlebacks1", Xr = "battlebacks2", re = "characters", ee = "enemies", ae = "faces", te = "parallaxes", se = "pictures", ne = "sv_actors", ce = "sv_enemies", oe = "system", me = "tilesets", ie = "titles1", ue = "titles2", le = "System.json", de = "Actors.json", pe = "Classes.json", fe = "Skills.json", Ee = "Items.json", Ae = "Weapons.json", Se = "Armors.json", Oe = "Enemies.json", ge = "Troops.json", ye = "States.json", be = "Animations.json", Pe = "Tilesets.json", _e = "CommonEvents.json", he = "MapInfos.json", Ie = "data", Le = "img", Ne = "audio", ve = "js";
export {
  de as FILENAME_ACTORS,
  be as FILENAME_ANIMATIONS,
  Se as FILENAME_ARMORS,
  pe as FILENAME_CLASSES,
  _e as FILENAME_COMMON_EVENTS,
  Oe as FILENAME_ENEMIES,
  Ee as FILENAME_ITEMS,
  he as FILENAME_MAP_INFOS,
  fe as FILENAME_SKILLS,
  ye as FILENAME_STATES,
  le as FILENAME_SYSTEM,
  Pe as FILENAME_TILESET,
  ge as FILENAME_TROOPS,
  Ae as FILENAME_WEAPONS,
  Ne as FOLDER_AUDIO,
  Zr as FOLDER_AUDIO_BGM,
  qr as FOLDER_AUDIO_BGS,
  Hr as FOLDER_AUDIO_ME,
  Yr as FOLDER_AUDIO_SE,
  Ie as FOLDER_DATA,
  Le as FOLDER_IMG,
  Qr as FOLDER_IMG_BATTLEBACK1,
  Xr as FOLDER_IMG_BATTLEBACK2,
  re as FOLDER_IMG_CHACTERS,
  ee as FOLDER_IMG_ENEMIES,
  ae as FOLDER_IMG_FACES,
  te as FOLDER_IMG_PARALLACES,
  se as FOLDER_IMG_PICTURES,
  ne as FOLDER_IMG_SV_ACTORS,
  ce as FOLDER_IMG_SV_ENEMIES,
  oe as FOLDER_IMG_SYSTEM,
  me as FOLDER_IMG_TILESETS,
  ie as FOLDER_IMG_TITLES1,
  ue as FOLDER_IMG_TITLES2,
  ve as FOLDER_JS,
  Ce as classifyFileParams,
  Te as classifyPluginParams,
  xe as classifyTextParams,
  rr as collectDependentStructNames,
  J as compileAttributes,
  De as convertPluginCommandSchema,
  Pr as convertPluginsJSToJSON,
  je as convertStructSchema,
  Re as createClassifiedStructMap,
  ke as createStructMap,
  kr as filterPluginParamByText,
  Gr as filterPluginSchemaByFileParam,
  wr as filterPluginSchemaByNumberParam,
  P as filterPluginSchemaByParam,
  Br as filterPluginSchemaByVariableParam,
  we as hasNumberValueParam,
  Be as hasScalarAttr,
  D as hasStructAttr,
  $ as hasTextAttr,
  Ge as isArrayAttr,
  Je as isArrayParam,
  Ve as isArrayParamEx,
  H as isFileAttr,
  Ue as isNumberArrayParam,
  Z as isNumberAttr,
  ze as isNumberValueParam,
  Ke as isNumberValueParamEx,
  Jr as isRmmzDataKind,
  We as isScalarParam,
  $e as isStringArrayParam,
  Ze as isStringValueParam,
  Ye as isStructArrayAttr,
  Q as isStructArrayParam,
  He as isStructAttr,
  q as isStructParam,
  Y as isVariableAttr,
  nr as lookupKind,
  qe as paramHasText,
  E as parseDeepJSON,
  X as parseDeepRecord,
  $r as parsePluginParamObject,
  _r as parsePluginParamRecord,
  Wr as pluginSourceToArraySchema,
  Kr as pluginSourceToJSON,
  ar as rebuildCommands,
  zr as stringifyDeepJSON,
  Ur as stringifyDeepRecord,
  Vr as structDependencies,
  Qe as toArrayPluginParam,
  Xe as toObjectPluginParams,
  ra as toObjectPluginParamsOld,
  fr as validatePluginJS
};
