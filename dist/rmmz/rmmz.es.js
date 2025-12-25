import { o as j, v as W, B as Z, D as Y, E as H, n as q, r as Q, F as E, G as X } from "../shared/parseDeepJSON.es.js";
import { a as je, c as De, b as Re, g as ke, f as we, h as Be, i as Ge, z as Je, q as Ve, k as Ue, j as ze, l as $e, A as Ke, x as We, y as Ze, m as Ye, C as He, w as qe, s as Qe, p as Xe, u as ra, e as ea, d as aa, t as ta } from "../shared/parseDeepJSON.es.js";
const rr = (r, e) => {
  const a = function(t) {
    return Object.fromEntries(t.map((s) => [s.struct, s.params.filter(j)]));
  }(r);
  return function(t, s, c) {
    return t.reduce((o) => {
      if (!o.changed) return o;
      const u = t.filter((p) => !o.names.has(p) && s[p].some((m) => o.names.has(m.attr.struct)));
      return u.length === 0 ? { names: o.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...o.names, ...u]), changed: !0 };
    }, {
      names: c,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, Br = (r) => P(r, W), Gr = (r) => P(r, Z), Jr = (r) => P(r, Y), Vr = (r) => P(r, H), P = (r, e) => {
  const a = r.structs.filter((c) => c.params.some((o) => e(o))), t = new Set(a.map((c) => c.struct)), s = rr(r.structs, t);
  return {
    structs: er(r.structs, s, e),
    commands: ar(r.commands, s, e),
    params: L(r.params, s, e)
  };
}, L = (r, e, a) => r.filter((t) => j(t) ? e.has(t.attr.struct) : a(t)), er = (r, e, a) => r.map((t) => ({
  struct: t.struct,
  params: L(t.params, e, a)
})).filter((t) => t.params.length > 0), ar = (r, e, a) => r.map((t) => ({
  ...t.desc ? { desc: t.desc } : {},
  ...t.text ? { text: t.text } : {},
  command: t.command,
  args: L(t.args, e, a)
})).filter((t) => t.args.length > 0), tr = { variable: 1, switch: 2, actor: 0, item: 0, weapon: 0, armor: 0, skill: 0, class: 0, state: 0, troop: 0, enemy: 0, common_event: 0 }, sr = ["data", "system", "system"], nr = (r) => {
  const e = tr[r];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: r } : { author: "rmmz", module: sr[e], kind: [r, "variable", "switch"][e] };
}, Ur = (r) => {
  const e = nr(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, D = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((s) => ((c, o) => !(!q(c) && !Q(c) || !c.struct || o.has(c.struct)))(s, a)).flatMap((s) => {
    const c = s.struct;
    return a.add(c), [c, ...D(c, e, a)];
  }) : [];
}, zr = (r, e) => D(r, e, /* @__PURE__ */ new Set()), $r = (r) => R(r), Kr = (r) => JSON.stringify(R(r)), A = (r) => typeof r == "object" && r !== null && !Array.isArray(r), R = (r) => Array.isArray(r) ? cr(r) : A(r) ? g(r) : {}, g = (r) => A(r) ? Object.fromEntries(Object.entries(r).map(([e, a]) => {
  if (Array.isArray(a)) {
    const t = a.map((s) => A(s) ? JSON.stringify(g(s)) : String(s));
    return [e, JSON.stringify(t)];
  }
  return A(a) ? [e, JSON.stringify(g(a))] : [e, String(a)];
})) : {}, cr = (r) => r.map((e) => typeof e == "object" && e !== null ? JSON.stringify(g(e)) : String(e)), k = (r, e) => Object.entries(e).reduce((a, [t, s]) => {
  if (t in r) {
    const c = r[t];
    if (typeof c == "string") return { ...a, [t]: s(c) };
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
}, dr = (r) => r.currentOption ? { items: r.items.concat({ option: r.currentOption, value: r.currentOption }) } : r, G = "help", N = "kind", _ = "text", C = "struct", J = (r) => {
  if (N in r.attr) {
    const e = pr[r.attr.kind];
    if (e) return e(r);
  }
  return f("any", "", r.attr, b);
}, n = (r) => r, V = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), b = {
  default: n,
  text: n,
  desc: n,
  parent: n
}, T = (r) => f("string", "", r.attr, b), x = (r) => {
  const e = { default: (a) => E(a), text: n, desc: n, parent: n };
  return y("string[]", r.attr, e);
}, l = (r, e) => {
  const a = {
    default: V,
    text: n,
    desc: n,
    parent: n
  };
  return y(e, r.attr, a);
}, d = (r, e) => {
  const a = { default: (t) => parseInt(t, 10), text: n, desc: n, parent: n };
  return f(e, 0, r.attr, a);
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
    return f("number", 0, e.attr, a);
  })(r),
  "number[]": (r) => {
    const e = { default: V, text: n, desc: n, decimals: (a) => parseInt(a, 10), min: (a) => parseFloat(a), max: (a) => parseFloat(a), parent: n };
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
      text: n,
      desc: n,
      on: n,
      off: n,
      parent: n
    };
    return f("boolean", !0, r.attr, e);
  },
  file: (r) => {
    const e = { default: n, text: n, desc: n, parent: n, dir: n };
    return { dir: "", ...f("file", "", r.attr, e) };
  },
  "file[]": (r) => {
    const e = { default: (a) => E(a), text: n, desc: n, parent: n, dir: n };
    return { dir: "", ...y("file[]", r.attr, e) };
  },
  struct: (r) => {
    const e = ((t) => {
      if (!t.attr.default) return {};
      const s = E(t.attr.default);
      return Array.isArray(s) ? {} : typeof s == "object" && s !== null ? s : {};
    })(r), a = { text: n, desc: n, parent: n };
    return { struct: r.attr.struct || "", ...f("struct", e, r.attr, a) };
  },
  "struct[]": (r) => {
    const e = ((t) => {
      if (!t.attr.default) return [];
      const s = E(t.attr.default);
      return Array.isArray(s) && s.every((c) => typeof c == "object" && c !== null) ? s : [];
    })(r), a = { text: n, desc: n, parent: n };
    return { struct: r.attr.struct || "", ...f("struct[]", e, r.attr, a), default: e };
  }
}, fr = (r) => !Array.isArray(r) && typeof r == "object" && r !== null && !!(Er(r) && Ar(r) && Sr(r) && "parameters" in r) && Or(r), Er = (r) => "name" in r && typeof r.name == "string", Ar = (r) => "status" in r && typeof r.status == "boolean", Sr = (r) => "description" in r && typeof r.description == "string", Or = (r) => typeof r.parameters == "object" && r.parameters !== null && Object.values(r.parameters).every((e) => typeof e == "string"), gr = /\s*\/\//, yr = /\s*[var|let|const]\s+[^\s]+\s*=/, br = /^\s{0,3}[\[|\]\;]/, Pr = (r) => r.split(`
`).filter((e) => !((a) => gr.test(a) || br.test(a) || yr.test(a))(e)), _r = (r) => {
  const e = `[${Pr(r).join("")}]`, a = JSON.parse(e);
  if (!Array.isArray(a)) throw new Error("Parsed value is not an array");
  if (a.every(fr)) return a;
  throw new Error("Parsed value is not PluginParamsObject array");
}, Wr = (r, e) => {
  const a = Nr(e);
  return r.map((t) => ({
    description: t.description,
    name: t.name,
    status: t.status,
    parameters: hr(t, a)
  }));
}, hr = (r, e) => {
  const a = e.get(r.name);
  if (!a) return r.parameters;
  const t = Object.entries(r.parameters).filter(([s]) => !a.has(s));
  return Object.fromEntries(t);
}, Nr = (r) => new Map(r.map((e) => [e.pluginName, new Set(e.params)])), I = (r) => ({ ...typeof r.desc == "string" ? { desc: r.desc } : {}, ...typeof r.text == "string" ? { text: r.text } : {} }), O = (r) => {
  const e = Ir(r), a = vr(e);
  return Lr(a);
}, Ir = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: {
      ...r.currentParam,
      options: dr(r.currentOption).items
    } };
  }
  return r;
}, Lr = (r) => r.currentParam ? { ...r, params: [...r.params, r.currentParam], currentParam: null, currentContext: null } : r, vr = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = {
    ...I(r.currentCommand),
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
    }, m = u.reduce(($, K) => mr($, K), p);
    return { structs: m.structs, bodies: m.bodies };
  })(r), t = ((o, u) => {
    const p = or(o, u);
    return o.filter((m) => m.locale === void 0 && p.has(m.struct) ? !p.has(`${m.struct}!`) : m.locale === u && p.has(`${m.struct}!`));
  })(a.structs, e).map((o) => Mr(o)), s = ((o, u) => o.reduce((p, m) => m.locale === u || m.locale === void 0 && p === void 0 ? m : p, void 0))(a.bodies, e);
  if (!s) return {
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    structs: t
  };
  const c = z(s);
  return { params: c.params, commands: c.commands, meta: c.meta, helpLines: c.helpLines, structs: t, dependencies: c.dependencies };
}, Mr = (r) => {
  const e = z(r);
  return { name: r.struct, params: e.params };
}, z = (r) => {
  const e = r.lines.reduce((a, t) => Cr(a, t), Fr());
  return O(e);
}, Fr = () => ({
  helpLines: [],
  params: [],
  commands: [],
  currentParam: null,
  currentCommand: null,
  currentContext: null,
  currentOption: null,
  dependencies: { base: [], orderBefore: [], orderAfter: [] },
  meta: {}
}), Cr = (r, e, a = Tr) => {
  const t = e.trimEnd().replace(/^[\*\s]*/, "");
  if (!t.startsWith("@")) return r.currentContext === G ? { ...r, helpLines: r.helpLines.concat(t) } : r;
  const s = t.match(/^@(\S+)\s*(.*)$/);
  if (!s) return r;
  const [, c, o] = s, u = a[c];
  return u ? u(r, o.trim()) : r;
}, i = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: { ...r.currentParam, attr: { ...r.currentParam.attr, [e]: a } } } : r, h = (r, e, a) => ({
  ...r,
  meta: { [e]: a, ...r.meta }
}), Tr = {
  param: (r, e) => {
    const a = O(r);
    return a.params.some((t) => t.name === e) ? a : { ...a, currentContext: "param", currentParam: { name: e, attr: {} } };
  },
  text: (r, e) => r.currentParam ? i(r, _, e) : r.currentCommand && !(_ in r.currentCommand) ? { ...r, currentCommand: {
    ...I(r.currentCommand),
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
    const a = { ...I(r.currentCommand), command: r.currentCommand.command, args: r.currentCommand.args.concat(r.currentParam) };
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
      const a = e.slice(7, -1), t = i(r, C, a);
      return i(t, N, C);
    }
    return r.currentParam ? i(r, N, e) : r;
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
}, xr = (r) => ({
  target: "MZ",
  meta: r.meta,
  commands: jr(r.commands),
  params: M(r.params),
  structs: Dr(r.structs)
}), M = (r) => Object.fromEntries(r.map((e) => [e.name, J(e)])), jr = (r) => Object.fromEntries(r.map((e) => [e.command, {
  desc: e.desc,
  text: e.text,
  args: M(e.args)
}])), Dr = (r) => Object.fromEntries(r.map((e) => [e.name, { params: M(e.params) }])), F = (r) => r.map((e) => ({ name: e.name, attr: J(e) })), Rr = (r) => r.map((e) => ({
  command: e.command,
  desc: e.desc,
  text: e.text,
  args: F(e.args)
})), kr = (r) => r.map((e) => ({ struct: e.name, params: F(e.params) })), Zr = (r) => ((e) => xr(U(e)))(r), Yr = (r) => {
  const e = U(r.source, r.locale);
  return { meta: e.meta, pluginName: r.pluginName, target: "MZ", schema: (a = e, { commands: Rr(a.commands), params: F(a.params), structs: kr(a.structs) }) };
  var a;
}, Hr = (r) => _r(r).map((e) => ({
  description: e.description,
  name: e.name,
  status: e.status,
  parameters: X(e.parameters)
})), qr = "bgm", Qr = "se", Xr = "me", re = "bgs", ee = "battlebacks1", ae = "battlebacks2", te = "characters", se = "enemies", ne = "faces", ce = "parallaxes", oe = "pictures", me = "sv_actors", ie = "sv_enemies", ue = "system", le = "tilesets", de = "titles1", pe = "titles2", fe = "System.json", Ee = "Actors.json", Ae = "Classes.json", Se = "Skills.json", Oe = "Items.json", ge = "Weapons.json", ye = "Armors.json", be = "Enemies.json", Pe = "Troops.json", _e = "States.json", he = "Animations.json", Ne = "Tilesets.json", Ie = "CommonEvents.json", Le = "MapInfos.json", ve = "data", Me = "img", Fe = "audio", Ce = "js";
export {
  Ee as FILENAME_ACTORS,
  he as FILENAME_ANIMATIONS,
  ye as FILENAME_ARMORS,
  Ae as FILENAME_CLASSES,
  Ie as FILENAME_COMMON_EVENTS,
  be as FILENAME_ENEMIES,
  Oe as FILENAME_ITEMS,
  Le as FILENAME_MAP_INFOS,
  Se as FILENAME_SKILLS,
  _e as FILENAME_STATES,
  fe as FILENAME_SYSTEM,
  Ne as FILENAME_TILESET,
  Pe as FILENAME_TROOPS,
  ge as FILENAME_WEAPONS,
  Fe as FOLDER_AUDIO,
  qr as FOLDER_AUDIO_BGM,
  re as FOLDER_AUDIO_BGS,
  Xr as FOLDER_AUDIO_ME,
  Qr as FOLDER_AUDIO_SE,
  ve as FOLDER_DATA,
  Me as FOLDER_IMG,
  ee as FOLDER_IMG_BATTLEBACK1,
  ae as FOLDER_IMG_BATTLEBACK2,
  te as FOLDER_IMG_CHACTERS,
  se as FOLDER_IMG_ENEMIES,
  ne as FOLDER_IMG_FACES,
  ce as FOLDER_IMG_PARALLACES,
  oe as FOLDER_IMG_PICTURES,
  me as FOLDER_IMG_SV_ACTORS,
  ie as FOLDER_IMG_SV_ENEMIES,
  ue as FOLDER_IMG_SYSTEM,
  le as FOLDER_IMG_TILESETS,
  de as FOLDER_IMG_TITLES1,
  pe as FOLDER_IMG_TITLES2,
  Ce as FOLDER_JS,
  je as classifyFileParams,
  De as classifyPluginParams,
  Re as classifyTextParams,
  rr as collectDependentStructNames,
  J as compileAttributes,
  ke as convertPluginCommandSchema,
  Pr as convertPluginsJSToJSON,
  we as convertStructSchema,
  Be as createClassifiedStructMap,
  Ge as createStructMap,
  Br as filterPluginParamByText,
  Vr as filterPluginSchemaByFileParam,
  Gr as filterPluginSchemaByNumberParam,
  P as filterPluginSchemaByParam,
  Jr as filterPluginSchemaByVariableParam,
  Je as hasNumberValueParam,
  Ve as hasScalarAttr,
  j as hasStructAttr,
  W as hasTextAttr,
  Ue as isArrayAttr,
  ze as isArrayParam,
  $e as isArrayParamEx,
  H as isFileAttr,
  Ke as isNumberArrayParam,
  Z as isNumberAttr,
  We as isNumberValueParam,
  Ze as isNumberValueParamEx,
  Ur as isRmmzDataKind,
  Ye as isScalarParam,
  He as isStringArrayParam,
  qe as isStringValueParam,
  Qe as isStructArrayAttr,
  Q as isStructArrayParam,
  Xe as isStructAttr,
  q as isStructParam,
  Y as isVariableAttr,
  nr as lookupKind,
  Wr as omitPluginParam,
  ra as paramHasText,
  E as parseDeepJSON,
  X as parseDeepRecord,
  Hr as parsePluginParamObject,
  _r as parsePluginParamRecord,
  Yr as pluginSourceToArraySchema,
  Zr as pluginSourceToJSON,
  ar as rebuildCommands,
  Kr as stringifyDeepJSON,
  $r as stringifyDeepRecord,
  zr as structDependencies,
  ea as toArrayPluginParam,
  aa as toObjectPluginParams,
  ta as toObjectPluginParamsOld,
  fr as validatePluginJS
};
