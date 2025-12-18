import { o as D, v as Z, B as Y, D as H, E as $, n as q, r as Q, F as E, G as X } from "../shared/parseDeepJSON.es.js";
import { a as Fe, c as Ce, b as Me, g as ve, f as Te, h as xe, i as De, z as je, q as Re, k as ke, j as Be, l as we, A as Ge, x as Je, y as Ve, m as Ue, C as ze, w as Ke, s as We, p as Ze, u as Ye, e as He, d as $e, t as qe } from "../shared/parseDeepJSON.es.js";
const rr = (r, e) => {
  const a = function(t) {
    return Object.fromEntries(t.map((s) => [s.struct, s.params.filter(D)]));
  }(r);
  return function(t, s, c) {
    return t.reduce((o) => {
      if (!o.changed) return o;
      const p = t.filter((d) => !o.names.has(d) && s[d].some((f) => o.names.has(f.attr.struct)));
      return p.length === 0 ? { names: o.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...o.names, ...p]), changed: !0 };
    }, {
      names: c,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, Dr = (r) => P(r, Z), jr = (r) => P(r, Y), Rr = (r) => P(r, H), kr = (r) => P(r, $), P = (r, e) => {
  const a = r.structs.filter((c) => c.params.some((o) => e(o))), t = new Set(a.map((c) => c.struct)), s = rr(r.structs, t);
  return {
    structs: er(r.structs, s, e),
    commands: ar(r.commands, s, e),
    params: N(r.params, s, e)
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
}, Br = (r) => {
  const e = nr(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, j = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((s) => ((c, o) => !(!q(c) && !Q(c) || !c.struct || o.has(c.struct)))(s, a)).flatMap((s) => {
    const c = s.struct;
    return a.add(c), [c, ...j(c, e, a)];
  }) : [];
}, wr = (r, e) => j(r, e, /* @__PURE__ */ new Set()), Gr = (r) => R(r), Jr = (r) => JSON.stringify(R(r)), A = (r) => typeof r == "object" && r !== null && !Array.isArray(r), R = (r) => Array.isArray(r) ? cr(r) : A(r) ? g(r) : {}, g = (r) => A(r) ? Object.fromEntries(Object.entries(r).map(([e, a]) => {
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
}, {}), l = (r, e, a, t) => ({ default: e, ...k(a, t), kind: r }), y = (r, e, a) => ({
  default: [],
  ...k(e, a),
  kind: r
}), B = "BODY", w = "STRUCT", S = "NONE", or = (r, e) => {
  const a = e.trim(), t = a.match(/^\/\*~struct~([A-Za-z0-9_]+)(?::([A-Za-z0-9_-]+))?/);
  return t ? mr(r, t) : a === "/*:" ? ir(r) : a === "*/" ? r.lines.length > 0 ? F(r) : r : { ...r, lines: r.lines.concat([a]) };
}, mr = (r, e) => {
  const a = r.lines.length > 0 ? F(r) : r, t = e[1] || void 0;
  return {
    ...a,
    structName: t,
    blockType: t ? w : "INVALID",
    locale: e[2],
    lines: []
  };
}, ir = (r) => ({ ...r.lines.length > 0 ? F(r) : r, blockType: B, structName: void 0, locale: void 0, lines: [] }), F = (r) => r.blockType === B ? {
  ...r,
  bodies: r.bodies.concat([{ lines: [...r.lines] }]),
  lines: [],
  blockType: S
} : r.structName && r.blockType === w ? { ...r, structs: r.structs.concat([{
  struct: r.structName,
  locale: r.locale,
  lines: [...r.lines]
}]), blockType: S, structName: void 0, locale: void 0, lines: [] } : { ...r, blockType: S, structName: void 0, lines: [] }, ur = (r) => r.currentOption ? { items: r.items.concat({
  option: r.currentOption,
  value: r.currentOption
}) } : r, G = "help", I = "kind", _ = "text", v = "struct", J = (r) => {
  if (I in r.attr) {
    const e = lr[r.attr.kind];
    if (e) return e(r);
  }
  return l("any", "", r.attr, b);
}, n = (r) => r, V = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), b = {
  default: n,
  text: n,
  desc: n,
  parent: n
}, T = (r) => l("string", "", r.attr, b), x = (r) => {
  const e = { default: (a) => E(a), text: n, desc: n, parent: n };
  return y("string[]", r.attr, e);
}, m = (r, e) => {
  const a = {
    default: V,
    text: n,
    desc: n,
    parent: n
  };
  return y(e, r.attr, a);
}, i = (r, e) => {
  const a = { default: (t) => parseInt(t, 10), text: n, desc: n, parent: n };
  return l(e, 0, r.attr, a);
}, lr = {
  number: (r) => ((e) => {
    const a = { default: (t) => parseFloat(t), text: n, desc: n, decimals: (t) => parseInt(t, 10), min: (t) => parseFloat(t), max: (t) => parseFloat(t), parent: n };
    return l("number", 0, e.attr, a);
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
    return { ...l("combo", "", r.attr, b), options: e };
  },
  select: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => ({ option: t.option, value: t.value }))) ?? [];
    return { ...l("select", "", r.attr, b), options: e };
  },
  actor: (r) => i(r, "actor"),
  "actor[]": (r) => m(r, "actor[]"),
  class: (r) => i(r, "class"),
  "class[]": (r) => m(r, "class[]"),
  skill: (r) => i(r, "skill"),
  "skill[]": (r) => m(r, "skill[]"),
  item: (r) => i(r, "item"),
  "item[]": (r) => m(r, "item[]"),
  weapon: (r) => i(r, "weapon"),
  "weapon[]": (r) => m(r, "weapon[]"),
  armor: (r) => i(r, "armor"),
  "armor[]": (r) => m(r, "armor[]"),
  state: (r) => i(r, "state"),
  "state[]": (r) => m(r, "state[]"),
  enemy: (r) => i(r, "enemy"),
  "enemy[]": (r) => m(r, "enemy[]"),
  common_event: (r) => i(r, "common_event"),
  "common_event[]": (r) => m(r, "common_event[]"),
  switch: (r) => i(r, "switch"),
  "switch[]": (r) => m(r, "switch[]"),
  variable: (r) => i(r, "variable"),
  "variable[]": (r) => m(r, "variable[]"),
  troop: (r) => i(r, "troop"),
  "troop[]": (r) => m(r, "troop[]"),
  boolean: (r) => {
    const e = {
      default: (a) => a === "true",
      text: n,
      desc: n,
      on: n,
      off: n,
      parent: n
    };
    return l("boolean", !0, r.attr, e);
  },
  file: (r) => {
    const e = { default: n, text: n, desc: n, parent: n, dir: n };
    return { dir: "", ...l("file", "", r.attr, e) };
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
    return { struct: r.attr.struct || "", ...l("struct", e, r.attr, a) };
  },
  "struct[]": (r) => {
    const e = ((t) => {
      if (!t.attr.default) return [];
      const s = E(t.attr.default);
      return Array.isArray(s) && s.every((c) => typeof c == "object" && c !== null) ? s : [];
    })(r), a = { text: n, desc: n, parent: n };
    return { struct: r.attr.struct || "", ...l("struct[]", e, r.attr, a), default: e };
  }
}, dr = (r) => !Array.isArray(r) && typeof r == "object" && r !== null && !!(pr(r) && fr(r) && Er(r) && "parameters" in r) && Ar(r), pr = (r) => "name" in r && typeof r.name == "string", fr = (r) => "status" in r && typeof r.status == "boolean", Er = (r) => "description" in r && typeof r.description == "string", Ar = (r) => typeof r.parameters == "object" && r.parameters !== null && Object.values(r.parameters).every((e) => typeof e == "string"), Sr = /\s*\/\//, Or = /\s*[var|let|const]\s+[^\s]+\s*=/, gr = /^\s{0,3}[\[|\]\;]/, yr = (r) => r.split(`
`).filter((e) => !((a) => Sr.test(a) || gr.test(a) || Or.test(a))(e)), br = (r) => {
  const e = `[${yr(r).join("")}]`, a = JSON.parse(e);
  if (!Array.isArray(a)) throw new Error("Parsed value is not an array");
  if (a.every(dr)) return a;
  throw new Error("Parsed value is not PluginParamsObject array");
}, L = (r) => ({ ...typeof r.desc == "string" ? { desc: r.desc } : {}, ...typeof r.text == "string" ? { text: r.text } : {} }), O = (r) => {
  const e = Pr(r), a = hr(e);
  return _r(a);
}, Pr = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: {
      ...r.currentParam,
      options: ur(r.currentOption).items
    } };
  }
  return r;
}, _r = (r) => r.currentParam ? { ...r, params: [...r.params, r.currentParam], currentParam: null, currentContext: null } : r, hr = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = {
    ...L(r.currentCommand),
    command: r.currentCommand.command,
    args: e
  };
  return { ...r, commands: [...r.commands, a], currentCommand: null, currentParam: null, currentContext: null, currentOption: null };
}, U = (r) => {
  const e = ((c) => {
    const o = c.split(`
`), p = {
      structs: [],
      bodies: [],
      structName: void 0,
      locale: void 0,
      lines: [],
      blockType: S
    }, d = o.reduce((f, W) => or(f, W), p);
    return { structs: d.structs, bodies: d.bodies };
  })(r), a = e.structs.map((c) => Ir(c)), t = Lr(e);
  if (!t) return { params: [], commands: [], meta: {}, helpLines: [], structs: a };
  const s = z(t, K);
  return {
    params: s.params,
    commands: s.commands,
    meta: s.meta,
    helpLines: s.helpLines,
    structs: a
  };
}, Ir = (r) => {
  const e = z(r, K);
  return { name: r.struct, params: e.params };
}, Lr = (r) => {
  if (r.bodies.length !== 0) return r.bodies[0];
}, z = (r, e) => {
  const a = r.lines.reduce((t, s) => {
    const c = s.trimEnd().replace(/^[\*\s]*/, "");
    if (!c.startsWith("@")) return t.currentContext === G ? { ...t, helpLines: t.helpLines.concat(c) } : t;
    const o = c.match(/^@(\S+)\s*(.*)$/);
    if (!o) return t;
    const [, p, d] = o, f = e[p];
    return f ? f(t, d.trim()) : t;
  }, Nr());
  return O(a);
}, Nr = () => ({
  helpLines: [],
  params: [],
  commands: [],
  currentParam: null,
  currentCommand: null,
  currentContext: null,
  currentOption: null,
  dependencies: { base: [], orderBefore: [], orderAfter: [] },
  meta: {}
}), u = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: { ...r.currentParam, attr: { ...r.currentParam.attr, [e]: a } } } : r, h = (r, e, a) => ({
  ...r,
  meta: { [e]: a, ...r.meta }
}), K = {
  param: (r, e) => {
    const a = O(r);
    return a.params.some((t) => t.name === e) ? a : { ...a, currentContext: "param", currentParam: { name: e, attr: {} } };
  },
  text: (r, e) => r.currentParam ? u(r, _, e) : r.currentCommand && !(_ in r.currentCommand) ? { ...r, currentCommand: {
    ...L(r.currentCommand),
    command: r.currentCommand.command,
    args: r.currentCommand.args,
    [_]: e
  } } : r,
  desc: (r, e) => r.currentParam ? u(r, "desc", e) : r.currentCommand ? { ...r, currentCommand: { ...r.currentCommand, desc: e } } : r,
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
      const a = e.slice(7, -1), t = u(r, v, a);
      return u(t, I, v);
    }
    return r.currentParam ? u(r, I, e) : r;
  },
  default: (r, e) => u(r, "default", e),
  on: (r, e) => u(r, "on", e),
  off: (r, e) => u(r, "off", e),
  min: (r, e) => u(r, "min", e),
  max: (r, e) => u(r, "max", e),
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
}, Fr = (r) => ({
  target: "MZ",
  meta: r.meta,
  commands: Cr(r.commands),
  params: C(r.params),
  structs: Mr(r.structs)
}), C = (r) => Object.fromEntries(r.map((e) => [e.name, J(e)])), Cr = (r) => Object.fromEntries(r.map((e) => [e.command, {
  desc: e.desc,
  text: e.text,
  args: C(e.args)
}])), Mr = (r) => Object.fromEntries(r.map((e) => [e.name, { params: C(e.params) }])), M = (r) => r.map((e) => ({ name: e.name, attr: J(e) })), vr = (r) => r.map((e) => ({
  command: e.command,
  desc: e.desc,
  text: e.text,
  args: M(e.args)
})), Tr = (r) => r.map((e) => ({ struct: e.name, params: M(e.params) })), Vr = (r) => ((e) => Fr(U(e)))(r), Ur = (r, e) => {
  const a = U(e);
  return {
    meta: a.meta,
    pluginName: r,
    target: "MZ",
    schema: (t = a, { commands: vr(t.commands), params: M(t.params), structs: Tr(t.structs) })
  };
  var t;
}, zr = (r) => br(r).map((e) => ({
  description: e.description,
  name: e.name,
  status: e.status,
  parameters: X(e.parameters)
})), Kr = "bgm", Wr = "se", Zr = "me", Yr = "bgs", Hr = "battlebacks1", $r = "battlebacks2", qr = "characters", Qr = "enemies", Xr = "faces", re = "parallaxes", ee = "pictures", ae = "sv_actors", te = "sv_enemies", se = "system", ne = "tilesets", ce = "titles1", oe = "titles2", me = "System.json", ie = "Actors.json", ue = "Classes.json", le = "Skills.json", de = "Items.json", pe = "Weapons.json", fe = "Armors.json", Ee = "Enemies.json", Ae = "Troops.json", Se = "States.json", Oe = "Animations.json", ge = "Tilesets.json", ye = "CommonEvents.json", be = "MapInfos.json", Pe = "data", _e = "img", he = "audio", Ie = "js";
export {
  ie as FILENAME_ACTORS,
  Oe as FILENAME_ANIMATIONS,
  fe as FILENAME_ARMORS,
  ue as FILENAME_CLASSES,
  ye as FILENAME_COMMON_EVENTS,
  Ee as FILENAME_ENEMIES,
  de as FILENAME_ITEMS,
  be as FILENAME_MAP_INFOS,
  le as FILENAME_SKILLS,
  Se as FILENAME_STATES,
  me as FILENAME_SYSTEM,
  ge as FILENAME_TILESET,
  Ae as FILENAME_TROOPS,
  pe as FILENAME_WEAPONS,
  he as FOLDER_AUDIO,
  Kr as FOLDER_AUDIO_BGM,
  Yr as FOLDER_AUDIO_BGS,
  Zr as FOLDER_AUDIO_ME,
  Wr as FOLDER_AUDIO_SE,
  Pe as FOLDER_DATA,
  _e as FOLDER_IMG,
  Hr as FOLDER_IMG_BATTLEBACK1,
  $r as FOLDER_IMG_BATTLEBACK2,
  qr as FOLDER_IMG_CHACTERS,
  Qr as FOLDER_IMG_ENEMIES,
  Xr as FOLDER_IMG_FACES,
  re as FOLDER_IMG_PARALLACES,
  ee as FOLDER_IMG_PICTURES,
  ae as FOLDER_IMG_SV_ACTORS,
  te as FOLDER_IMG_SV_ENEMIES,
  se as FOLDER_IMG_SYSTEM,
  ne as FOLDER_IMG_TILESETS,
  ce as FOLDER_IMG_TITLES1,
  oe as FOLDER_IMG_TITLES2,
  Ie as FOLDER_JS,
  Fe as classifyFileParams,
  Ce as classifyPluginParams,
  Me as classifyTextParams,
  rr as collectDependentStructNames,
  J as compileAttributes,
  ve as convertPluginCommandSchema,
  yr as convertPluginsJSToJSON,
  Te as convertStructSchema,
  xe as createClassifiedStructMap,
  De as createStructMap,
  Dr as filterPluginParamByText,
  kr as filterPluginSchemaByFileParam,
  jr as filterPluginSchemaByNumberParam,
  P as filterPluginSchemaByParam,
  Rr as filterPluginSchemaByVariableParam,
  je as hasNumberValueParam,
  Re as hasScalarAttr,
  D as hasStructAttr,
  Z as hasTextAttr,
  ke as isArrayAttr,
  Be as isArrayParam,
  we as isArrayParamEx,
  $ as isFileAttr,
  Ge as isNumberArrayParam,
  Y as isNumberAttr,
  Je as isNumberValueParam,
  Ve as isNumberValueParamEx,
  Br as isRmmzDataKind,
  Ue as isScalarParam,
  ze as isStringArrayParam,
  Ke as isStringValueParam,
  We as isStructArrayAttr,
  Q as isStructArrayParam,
  Ze as isStructAttr,
  q as isStructParam,
  H as isVariableAttr,
  nr as lookupKind,
  Ye as paramHasText,
  E as parseDeepJSON,
  X as parseDeepRecord,
  zr as parsePluginParamObject,
  br as parsePluginParamRecord,
  Ur as pluginSourceToArraySchema,
  Vr as pluginSourceToJSON,
  ar as rebuildCommands,
  Jr as stringifyDeepJSON,
  Gr as stringifyDeepRecord,
  wr as structDependencies,
  He as toArrayPluginParam,
  $e as toObjectPluginParams,
  qe as toObjectPluginParamsOld,
  dr as validatePluginJS
};
