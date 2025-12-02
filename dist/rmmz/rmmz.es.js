import { o as k, v as $, B as q, D as Q, E as X, n as rr, r as er } from "../shared/structMap.es.js";
import { a as Fe, c as ve, b as Te, g as xe, f as je, h as De, i as Re, z as ke, q as Be, k as we, j as Ge, l as Je, A as Ve, x as Ue, y as ze, m as Ke, C as We, w as Ze, s as Ye, p as He, u as $e, e as qe, d as Qe, t as Xe } from "../shared/structMap.es.js";
const ar = (r, e) => {
  const a = function(t) {
    return Object.fromEntries(t.map((s) => [s.struct, s.params.filter(k)]));
  }(r);
  return function(t, s, c) {
    return t.reduce((o) => {
      if (!o.changed) return o;
      const f = t.filter((p) => !o.names.has(p) && s[p].some((m) => o.names.has(m.attr.struct)));
      return f.length === 0 ? { names: o.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...o.names, ...f]), changed: !0 };
    }, {
      names: c,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, h = (r, e) => {
  const a = r.structs.filter((c) => c.params.some((o) => e(o))), t = new Set(a.map((c) => c.struct)), s = ar(r.structs, t);
  return {
    structs: tr(r.structs, s, e),
    commands: sr(r.commands, s, e),
    params: C(r.params, s, e)
  };
}, C = (r, e, a) => r.filter((t) => k(t) ? e.has(t.attr.struct) : a(t)), tr = (r, e, a) => r.reduce((t, s) => {
  const c = C(s.params, e, a);
  return c.length === 0 || t.push({ struct: s.struct, params: c }), t;
}, []), sr = (r, e, a) => r.reduce((t, s) => {
  const c = C(s.args, e, a);
  return c.length === 0 || t.push({ ...s.desc ? {
    desc: s.desc
  } : {}, ...s.text ? { text: s.text } : {}, command: s.command, args: c }), t;
}, []), kr = (r) => h(r, $), Br = (r) => h(r, q), wr = (r) => h(r, Q), Gr = (r) => h(r, X), nr = {
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
}, cr = ["data", "system", "system"], or = (r) => {
  const e = nr[r];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: r } : {
    author: "rmmz",
    module: cr[e],
    kind: [r, "variable", "switch"][e]
  };
}, Jr = (r) => {
  const e = or(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, B = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((s) => ((c, o) => !(!rr(c) && !er(c) || !c.struct || o.has(c.struct)))(s, a)).flatMap((s) => {
    const c = s.struct;
    return a.add(c), [c, ...B(c, e, a)];
  }) : [];
}, Vr = (r, e) => B(r, e, /* @__PURE__ */ new Set()), A = (r) => {
  const e = JSON.parse(r);
  return Array.isArray(e) ? e.map(b) : typeof e == "object" && e !== null ? w(e) : e;
}, mr = (r) => w(r), w = (r) => Object.fromEntries(Object.entries(r).map(([e, a]) => [e, b(a)])), b = (r) => {
  if (typeof r != "string") return r;
  try {
    const e = JSON.parse(r);
    return Array.isArray(e) ? e.map(b) : typeof e == "object" && e !== null ? Object.fromEntries(Object.entries(e).map(([a, t]) => [a, b(t)])) : e;
  } catch {
    return r;
  }
}, Ur = (r) => JSON.stringify(ir(r)), O = (r) => typeof r == "object" && r !== null && !Array.isArray(r), ir = (r) => Array.isArray(r) ? ur(r) : O(r) ? g(r) : {}, g = (r) => O(r) ? Object.fromEntries(Object.entries(r).map(([e, a]) => {
  if (Array.isArray(a)) {
    const t = a.map((s) => O(s) ? JSON.stringify(g(s)) : String(s));
    return [e, JSON.stringify(t)];
  }
  return O(a) ? [e, JSON.stringify(g(a))] : [e, String(a)];
})) : {}, ur = (r) => r.map((e) => typeof e == "object" && e !== null ? JSON.stringify(g(e)) : String(e)), G = (r, e) => Object.entries(e).reduce((a, [t, s]) => {
  if (t in r) {
    const c = r[t];
    if (typeof c == "string") return { ...a, [t]: s(c) };
  }
  return a;
}, {}), d = (r, e, a, t) => ({ default: e, ...G(a, t), kind: r }), P = (r, e, a) => ({
  default: [],
  ...G(e, a),
  kind: r
}), J = "BODY", V = "STRUCT", S = "NONE", lr = (r, e) => {
  const a = r.lines.length > 0 ? F(r) : r, t = e[1] || void 0;
  return { ...a, structName: t, blockType: t ? V : "INVALID", locale: e[2], lines: [] };
}, dr = (r) => ({
  ...r.lines.length > 0 ? F(r) : r,
  blockType: J,
  structName: void 0,
  locale: void 0,
  lines: []
}), F = (r) => r.blockType === J ? {
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
} : { ...r, blockType: S, structName: void 0, lines: [] }, pr = (r) => r.currentOption ? {
  items: r.items.concat({ option: r.currentOption, value: r.currentOption })
} : r, U = "help", L = "kind", N = "text", j = "struct", z = (r) => {
  if (L in r.attr) {
    const e = fr[r.attr.kind];
    if (e) return e(r);
  }
  return d("any", "", r.attr, _);
}, n = (r) => r, K = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), _ = {
  default: n,
  text: n,
  desc: n,
  parent: n
}, D = (r) => d("string", "", r.attr, _), R = (r) => {
  const e = { default: (a) => A(a), text: n, desc: n, parent: n };
  return P("string[]", r.attr, e);
}, i = (r, e) => {
  const a = {
    default: K,
    text: n,
    desc: n,
    parent: n
  };
  return P(e, r.attr, a);
}, u = (r, e) => {
  const a = { default: (t) => parseInt(t, 10), text: n, desc: n, parent: n };
  return d(e, 0, r.attr, a);
}, fr = {
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
    return P("number[]", r.attr, e);
  },
  string: D,
  "string[]": R,
  multiline_string: D,
  "multiline_string[]": R,
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
    const e = { default: (a) => A(a), text: n, desc: n, parent: n, dir: n };
    return { dir: "", ...P("file[]", r.attr, e) };
  },
  struct: (r) => {
    const e = ((t) => {
      if (!t.attr.default) return {};
      const s = A(t.attr.default);
      return Array.isArray(s) ? {} : typeof s == "object" && s !== null ? s : {};
    })(r), a = { text: n, desc: n, parent: n };
    return { struct: r.attr.struct || "", ...d("struct", e, r.attr, a) };
  },
  "struct[]": (r) => {
    const e = ((t) => {
      if (!t.attr.default) return [];
      const s = A(t.attr.default);
      return Array.isArray(s) && s.every((c) => typeof c == "object" && c !== null) ? s : [];
    })(r), a = { text: n, desc: n, parent: n };
    return { struct: r.attr.struct || "", ...d("struct[]", e, r.attr, a), default: e };
  }
}, Er = (r) => !Array.isArray(r) && typeof r == "object" && r !== null && !!(Ar(r) && Or(r) && Sr(r) && "parameters" in r) && yr(r), Ar = (r) => "name" in r && typeof r.name == "string", Or = (r) => "status" in r && typeof r.status == "boolean", Sr = (r) => "description" in r && typeof r.description == "string", yr = (r) => typeof r.parameters == "object" && r.parameters !== null && Object.values(r.parameters).every((e) => typeof e == "string"), br = /\s*\/\//, gr = /\s*[var|let|const]\s+[^\s]+\s*=/, Pr = /^\s{0,3}[\[|\]\;]/, _r = (r) => r.split(`
`).filter((e) => !((a) => br.test(a) || Pr.test(a) || gr.test(a))(e)), hr = (r) => {
  const e = `[${_r(r).join("")}]`, a = JSON.parse(e);
  if (!Array.isArray(a)) throw new Error("Parsed value is not an array");
  if (a.every(Er)) return a;
  throw new Error("Parsed value is not PluginParamsObject array");
}, M = (r) => ({ ...typeof r.desc == "string" ? { desc: r.desc } : {}, ...typeof r.text == "string" ? { text: r.text } : {} }), y = (r) => {
  const e = Nr(r), a = Lr(e);
  return Ir(a);
}, Nr = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: {
      ...r.currentParam,
      options: pr(r.currentOption).items
    } };
  }
  return r;
}, Ir = (r) => r.currentParam ? { ...r, params: [...r.params, r.currentParam], currentParam: null, currentContext: null } : r, Lr = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = {
    ...M(r.currentCommand),
    command: r.currentCommand.command,
    args: e
  };
  return { ...r, commands: [...r.commands, a], currentCommand: null, currentParam: null, currentContext: null, currentOption: null };
}, W = (r) => {
  const e = ((c) => {
    const o = c.split(`
`), f = {
      structs: [],
      bodies: [],
      structName: void 0,
      locale: void 0,
      lines: [],
      blockType: S
    }, p = o.reduce((m, H) => {
      const E = H.trim(), x = E.match(/^\/\*~struct~([A-Za-z0-9_]+)(?::([A-Za-z0-9_-]+))?/);
      return x ? lr(m, x) : E === "/*:" ? dr(m) : E === "*/" ? m.lines.length > 0 ? F(m) : m : { ...m, lines: m.lines.concat([E]) };
    }, f);
    return { structs: p.structs, bodies: p.bodies };
  })(r), a = e.structs.map((c) => Mr(c)), t = Cr(e);
  if (!t) return { params: [], commands: [], meta: {}, helpLines: [], structs: a };
  const s = Z(t, Y);
  return {
    params: s.params,
    commands: s.commands,
    meta: s.meta,
    helpLines: s.helpLines,
    structs: a
  };
}, Mr = (r) => {
  const e = Z(r, Y);
  return { name: r.struct, params: e.params };
}, Cr = (r) => {
  if (r.bodies.length !== 0) return r.bodies[0];
}, Z = (r, e) => {
  const a = r.lines.reduce((t, s) => {
    const c = s.trimEnd().replace(/^[\*\s]*/, "");
    if (!c.startsWith("@")) return t.currentContext === U ? { ...t, helpLines: t.helpLines.concat(c) } : t;
    const o = c.match(/^@(\S+)\s*(.*)$/);
    if (!o) return t;
    const [, f, p] = o, m = e[f];
    return m ? m(t, p.trim()) : t;
  }, Fr());
  return y(a);
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
}), l = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: { ...r.currentParam, attr: { ...r.currentParam.attr, [e]: a } } } : r, I = (r, e, a) => ({
  ...r,
  meta: { [e]: a, ...r.meta }
}), Y = {
  param: (r, e) => {
    const a = y(r);
    return a.params.some((t) => t.name === e) ? a : { ...a, currentContext: "param", currentParam: { name: e, attr: {} } };
  },
  text: (r, e) => r.currentParam ? l(r, N, e) : r.currentCommand && !(N in r.currentCommand) ? { ...r, currentCommand: {
    ...M(r.currentCommand),
    command: r.currentCommand.command,
    args: r.currentCommand.args,
    [N]: e
  } } : r,
  desc: (r, e) => r.currentParam ? l(r, "desc", e) : r.currentCommand ? { ...r, currentCommand: { ...r.currentCommand, desc: e } } : r,
  command: (r, e) => {
    const a = y(r);
    return a.commands.some((t) => t.command === e) ? a : { ...a, currentCommand: { command: e, args: [] }, currentParam: null };
  },
  arg: (r, e) => {
    if (!r.currentCommand) return r;
    if (!r.currentParam) return {
      ...r,
      currentParam: { name: e, attr: {} }
    };
    const a = { ...M(r.currentCommand), command: r.currentCommand.command, args: r.currentCommand.args.concat(r.currentParam) };
    return {
      ...r,
      commands: r.commands,
      currentCommand: a,
      currentContext: "arg",
      currentParam: { name: e, attr: {} }
    };
  },
  help: (r) => ({ ...y(r), currentContext: U }),
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
      const a = e.slice(7, -1), t = l(r, j, a);
      return l(t, L, j);
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
}, vr = (r) => ({
  target: "MZ",
  meta: r.meta,
  commands: Tr(r.commands),
  params: v(r.params),
  structs: xr(r.structs)
}), v = (r) => Object.fromEntries(r.map((e) => [e.name, z(e)])), Tr = (r) => Object.fromEntries(r.map((e) => [e.command, {
  desc: e.desc,
  text: e.text,
  args: v(e.args)
}])), xr = (r) => Object.fromEntries(r.map((e) => [e.name, { params: v(e.params) }])), T = (r) => r.map((e) => ({ name: e.name, attr: z(e) })), jr = (r) => r.map((e) => ({
  command: e.command,
  desc: e.desc,
  text: e.text,
  args: T(e.args)
})), Dr = (r) => r.map((e) => ({ struct: e.name, params: T(e.params) })), zr = (r) => ((e) => vr(W(e)))(r), Kr = (r, e) => {
  const a = W(e);
  return {
    meta: a.meta,
    pluginName: r,
    target: "MZ",
    schema: (t = a, { commands: jr(t.commands), params: T(t.params), structs: Dr(t.structs) })
  };
  var t;
}, Wr = (r) => hr(r).map((e) => ({
  description: e.description,
  name: e.name,
  status: e.status,
  parameters: mr(e.parameters)
})), Zr = "bgm", Yr = "se", Hr = "me", $r = "bgs", qr = "battlebacks1", Qr = "battlebacks2", Xr = "characters", re = "enemies", ee = "faces", ae = "parallaxes", te = "pictures", se = "sv_actors", ne = "sv_enemies", ce = "system", oe = "tilesets", me = "titles1", ie = "titles2", ue = "System.json", le = "Actors.json", de = "Classes.json", pe = "Skills.json", fe = "Items.json", Ee = "Weapons.json", Ae = "Armors.json", Oe = "Enemies.json", Se = "Troops.json", ye = "States.json", be = "Animations.json", ge = "Tilesets.json", Pe = "CommonEvents.json", _e = "MapInfos.json", he = "data", Ne = "img", Ie = "audio", Le = "js";
export {
  le as FILENAME_ACTORS,
  be as FILENAME_ANIMATIONS,
  Ae as FILENAME_ARMORS,
  de as FILENAME_CLASSES,
  Pe as FILENAME_COMMON_EVENTS,
  Oe as FILENAME_ENEMIES,
  fe as FILENAME_ITEMS,
  _e as FILENAME_MAP_INFOS,
  pe as FILENAME_SKILLS,
  ye as FILENAME_STATES,
  ue as FILENAME_SYSTEM,
  ge as FILENAME_TILESET,
  Se as FILENAME_TROOPS,
  Ee as FILENAME_WEAPONS,
  Ie as FOLDER_AUDIO,
  Zr as FOLDER_AUDIO_BGM,
  $r as FOLDER_AUDIO_BGS,
  Hr as FOLDER_AUDIO_ME,
  Yr as FOLDER_AUDIO_SE,
  he as FOLDER_DATA,
  Ne as FOLDER_IMG,
  qr as FOLDER_IMG_BATTLEBACK1,
  Qr as FOLDER_IMG_BATTLEBACK2,
  Xr as FOLDER_IMG_CHACTERS,
  re as FOLDER_IMG_ENEMIES,
  ee as FOLDER_IMG_FACES,
  ae as FOLDER_IMG_PARALLACES,
  te as FOLDER_IMG_PICTURES,
  se as FOLDER_IMG_SV_ACTORS,
  ne as FOLDER_IMG_SV_ENEMIES,
  ce as FOLDER_IMG_SYSTEM,
  oe as FOLDER_IMG_TILESETS,
  me as FOLDER_IMG_TITLES1,
  ie as FOLDER_IMG_TITLES2,
  Le as FOLDER_JS,
  Fe as classifyFileParams,
  ve as classifyPluginParams,
  Te as classifyTextParams,
  ar as collectDependentStructNames,
  z as compileAttributes,
  xe as convertPluginCommandSchema,
  _r as convertPluginsJSToJSON,
  je as convertStructSchema,
  De as createClassifiedStructMap,
  Re as createStructMap,
  Gr as filterPluginSchemaByFileParam,
  Br as filterPluginSchemaByNumberParam,
  h as filterPluginSchemaByParam,
  kr as filterPluginSchemaByStringParam,
  wr as filterPluginSchemaByVariableParam,
  ke as hasNumberValueParam,
  Be as hasScalarAttr,
  k as hasStructAttr,
  $ as hasTextAttr,
  we as isArrayAttr,
  Ge as isArrayParam,
  Je as isArrayParamEx,
  X as isFileAttr,
  Ve as isNumberArrayParam,
  q as isNumberAttr,
  Ue as isNumberValueParam,
  ze as isNumberValueParamEx,
  Jr as isRmmzDataKind,
  Ke as isScalarParam,
  We as isStringArrayParam,
  Ze as isStringValueParam,
  Ye as isStructArrayAttr,
  er as isStructArrayParam,
  He as isStructAttr,
  rr as isStructParam,
  Q as isVariableAttr,
  or as lookupKind,
  $e as paramHasText,
  A as parseDeepJSON,
  mr as parseDeepRecord,
  Wr as parsePluginParamObject,
  hr as parsePluginParamRecord,
  Kr as pluginSourceToArraySchema,
  zr as pluginSourceToJSON,
  sr as rebuildCommands,
  Ur as stringifyDeepJSON,
  Vr as structDependencies,
  qe as toArrayPluginParam,
  Qe as toObjectPluginParams,
  Xe as toObjectPluginParamsOld,
  Er as validatePluginJS
};
