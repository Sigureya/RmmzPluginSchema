import { o as R, v as H, B as q, D as Q, E as X, n as tt, r as et } from "../shared/structMap.es.js";
import { a as Fe, c as ve, b as Te, g as xe, f as je, h as De, i as Re, z as ke, q as Be, k as we, j as Ge, l as Je, A as Ve, x as Ue, y as ze, m as Ke, C as We, w as Ze, s as Ye, p as $e, u as He, e as qe, d as Qe, t as Xe } from "../shared/structMap.es.js";
const at = (t, e) => {
  const a = function(r) {
    return Object.fromEntries(r.map((s) => [s.struct, s.params.filter(R)]));
  }(t);
  return function(r, s, c) {
    return r.reduce((o) => {
      if (!o.changed) return o;
      const f = r.filter((d) => !o.names.has(d) && s[d].some((m) => o.names.has(m.attr.struct)));
      return f.length === 0 ? { names: o.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...o.names, ...f]), changed: !0 };
    }, {
      names: c,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, _ = (t, e) => {
  const a = t.structs.filter((c) => c.params.some((o) => e(o))), r = new Set(a.map((c) => c.struct)), s = at(t.structs, r);
  return {
    structs: rt(t.structs, s, e),
    commands: st(t.commands, s, e),
    params: M(t.params, s, e)
  };
}, M = (t, e, a) => t.filter((r) => R(r) ? e.has(r.attr.struct) : a(r)), rt = (t, e, a) => t.reduce((r, s) => {
  const c = M(s.params, e, a);
  return c.length === 0 || r.push({ struct: s.struct, params: c }), r;
}, []), st = (t, e, a) => t.reduce((r, s) => {
  const c = M(s.args, e, a);
  return c.length === 0 || r.push({ ...s.desc ? {
    desc: s.desc
  } : {}, ...s.text ? { text: s.text } : {}, command: s.command, args: c }), r;
}, []), kt = (t) => _(t, H), Bt = (t) => _(t, q), wt = (t) => _(t, Q), Gt = (t) => _(t, X), nt = {
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
}, ct = ["data", "system", "system"], ot = (t) => {
  const e = nt[t];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: t } : {
    author: "rmmz",
    module: ct[e],
    kind: [t, "variable", "switch"][e]
  };
}, Jt = (t) => {
  const e = ot(t.kind);
  return e.author === t.author && e.module === t.module && e.kind === t.kind;
}, k = (t, e, a) => {
  const r = e.get(t);
  return r ? r.filter((s) => ((c, o) => !(!tt(c) && !et(c) || !c.struct || o.has(c.struct)))(s, a)).flatMap((s) => {
    const c = s.struct;
    return a.add(c), [c, ...k(c, e, a)];
  }) : [];
}, Vt = (t, e) => k(t, e, /* @__PURE__ */ new Set()), B = (t) => {
  const e = JSON.parse(t);
  return Array.isArray(e) ? e.map(g) : typeof e == "object" && e !== null ? w(e) : e;
}, mt = (t) => w(t), w = (t) => Object.fromEntries(Object.entries(t).map(([e, a]) => [e, g(a)])), g = (t) => {
  if (typeof t != "string") return t;
  try {
    const e = JSON.parse(t);
    return Array.isArray(e) ? e.map(g) : typeof e == "object" && e !== null ? Object.fromEntries(Object.entries(e).map(([a, r]) => [a, g(r)])) : e;
  } catch {
    return t;
  }
}, Ut = (t) => JSON.stringify(it(t)), A = (t) => typeof t == "object" && t !== null && !Array.isArray(t), it = (t) => Array.isArray(t) ? ut(t) : A(t) ? b(t) : {}, b = (t) => A(t) ? Object.fromEntries(Object.entries(t).map(([e, a]) => {
  if (Array.isArray(a)) {
    const r = a.map((s) => A(s) ? JSON.stringify(b(s)) : String(s));
    return [e, JSON.stringify(r)];
  }
  return A(a) ? [e, JSON.stringify(b(a))] : [e, String(a)];
})) : {}, ut = (t) => t.map((e) => typeof e == "object" && e !== null ? JSON.stringify(b(e)) : String(e)), G = (t, e) => Object.entries(e).reduce((a, [r, s]) => {
  if (r in t) {
    const c = t[r];
    if (typeof c == "string") return { ...a, [r]: s(c) };
  }
  return a;
}, {}), p = (t, e, a, r) => ({ default: e, ...G(a, r), kind: t }), y = (t, e, a) => ({
  default: [],
  ...G(e, a),
  kind: t
}), J = "BODY", V = "STRUCT", O = "NONE", lt = (t, e) => {
  const a = t.lines.length > 0 ? C(t) : t, r = e[1] || void 0;
  return { ...a, structName: r, blockType: r ? V : "INVALID", locale: e[2], lines: [] };
}, pt = (t) => ({
  ...t.lines.length > 0 ? C(t) : t,
  blockType: J,
  structName: void 0,
  locale: void 0,
  lines: []
}), C = (t) => t.blockType === J ? {
  ...t,
  bodies: t.bodies.concat([{ lines: [...t.lines] }]),
  lines: [],
  blockType: O
} : t.structName && t.blockType === V ? {
  ...t,
  structs: t.structs.concat([{ struct: t.structName, locale: t.locale, lines: [...t.lines] }]),
  blockType: O,
  structName: void 0,
  locale: void 0,
  lines: []
} : { ...t, blockType: O, structName: void 0, lines: [] }, dt = (t) => t.currentOption ? {
  items: t.items.concat({ option: t.currentOption, value: t.currentOption })
} : t, U = "help", I = "kind", h = "text", x = "struct", z = (t) => {
  if (I in t.attr) {
    const e = ft[t.attr.kind];
    if (e) return e(t);
  }
  return p("any", "", t.attr, P);
}, n = (t) => t, K = (t) => t.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), P = {
  default: n,
  text: n,
  desc: n,
  parent: n
}, j = (t) => p("string", "", t.attr, P), D = (t) => {
  const e = { default: (a) => B(a), text: n, desc: n, parent: n };
  return y("string[]", t.attr, e);
}, i = (t, e) => {
  const a = {
    default: K,
    text: n,
    desc: n,
    parent: n
  };
  return y(e, t.attr, a);
}, u = (t, e) => {
  const a = { default: (r) => parseInt(r, 10), text: n, desc: n, parent: n };
  return p(e, 0, t.attr, a);
}, ft = {
  number: (t) => ((e) => {
    const a = {
      default: (r) => parseFloat(r),
      text: n,
      desc: n,
      decimals: (r) => parseInt(r, 10),
      min: (r) => parseFloat(r),
      max: (r) => parseFloat(r),
      parent: n
    };
    return p("number", 0, e.attr, a);
  })(t),
  "number[]": (t) => {
    const e = { default: K, text: n, desc: n, decimals: (a) => parseInt(a, 10), min: (a) => parseFloat(a), max: (a) => parseFloat(a), parent: n };
    return y("number[]", t.attr, e);
  },
  string: j,
  "string[]": D,
  multiline_string: j,
  "multiline_string[]": D,
  combo: (t) => {
    var a;
    const e = ((a = t.options) == null ? void 0 : a.map((r) => r.option)) ?? [];
    return { ...p("combo", "", t.attr, P), options: e };
  },
  select: (t) => {
    var a;
    const e = ((a = t.options) == null ? void 0 : a.map((r) => ({ option: r.option, value: r.value }))) ?? [];
    return { ...p("select", "", t.attr, P), options: e };
  },
  actor: (t) => u(t, "actor"),
  "actor[]": (t) => i(t, "actor[]"),
  class: (t) => u(t, "class"),
  "class[]": (t) => i(t, "class[]"),
  skill: (t) => u(t, "skill"),
  "skill[]": (t) => i(t, "skill[]"),
  item: (t) => u(t, "item"),
  "item[]": (t) => i(t, "item[]"),
  weapon: (t) => u(t, "weapon"),
  "weapon[]": (t) => i(t, "weapon[]"),
  armor: (t) => u(t, "armor"),
  "armor[]": (t) => i(t, "armor[]"),
  state: (t) => u(t, "state"),
  "state[]": (t) => i(t, "state[]"),
  enemy: (t) => u(t, "enemy"),
  "enemy[]": (t) => i(t, "enemy[]"),
  common_event: (t) => u(t, "common_event"),
  "common_event[]": (t) => i(t, "common_event[]"),
  switch: (t) => u(t, "switch"),
  "switch[]": (t) => i(t, "switch[]"),
  variable: (t) => u(t, "variable"),
  "variable[]": (t) => i(t, "variable[]"),
  troop: (t) => u(t, "troop"),
  "troop[]": (t) => i(t, "troop[]"),
  boolean: (t) => {
    const e = {
      default: (a) => a === "true",
      text: n,
      desc: n,
      on: n,
      off: n,
      parent: n
    };
    return p("boolean", !0, t.attr, e);
  },
  file: (t) => {
    const e = { default: n, text: n, desc: n, parent: n, dir: n };
    return { dir: "", ...p("file", "", t.attr, e) };
  },
  "file[]": (t) => {
    const e = { default: (a) => B(a), text: n, desc: n, parent: n, dir: n };
    return { dir: "", ...y("file[]", t.attr, e) };
  }
}, Et = (t) => !Array.isArray(t) && typeof t == "object" && t !== null && !!(At(t) && Ot(t) && St(t) && "parameters" in t) && gt(t), At = (t) => "name" in t && typeof t.name == "string", Ot = (t) => "status" in t && typeof t.status == "boolean", St = (t) => "description" in t && typeof t.description == "string", gt = (t) => typeof t.parameters == "object" && t.parameters !== null && Object.values(t.parameters).every((e) => typeof e == "string"), bt = /\s*\/\//, yt = /\s*[var|let|const]\s+\$plugins\s*=\s*/, Pt = /^\s*[\[\]]/, _t = (t) => t.split(`
`).filter((e) => !((a) => bt.test(a) || yt.test(a) || Pt.test(a))(e)), ht = (t) => {
  const e = `[${_t(t).join("")}]`, a = JSON.parse(e);
  if (!Array.isArray(a)) throw new Error("Parsed value is not an array");
  if (a.every(Et)) return a;
  throw new Error("Parsed value is not PluginParamsObject array");
}, L = (t) => ({ ...typeof t.desc == "string" ? { desc: t.desc } : {}, ...typeof t.text == "string" ? { text: t.text } : {} }), S = (t) => {
  const e = Nt(t), a = Lt(e);
  return It(a);
}, Nt = (t) => {
  if (t.currentParam && t.currentOption) {
    const e = t.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...t, currentParam: {
      ...t.currentParam,
      options: dt(t.currentOption).items
    } };
  }
  return t;
}, It = (t) => t.currentParam ? { ...t, params: [...t.params, t.currentParam], currentParam: null, currentContext: null } : t, Lt = (t) => {
  if (!t.currentCommand) return t;
  const e = t.currentParam ? [...t.currentCommand.args, t.currentParam] : t.currentCommand.args, a = {
    ...L(t.currentCommand),
    command: t.currentCommand.command,
    args: e
  };
  return { ...t, commands: [...t.commands, a], currentCommand: null, currentParam: null, currentContext: null, currentOption: null };
}, W = (t) => {
  const e = ((c) => {
    const o = c.split(`
`), f = {
      structs: [],
      bodies: [],
      structName: void 0,
      locale: void 0,
      lines: [],
      blockType: O
    }, d = o.reduce((m, $) => {
      const E = $.trim(), T = E.match(/^\/\*~struct~([A-Za-z0-9_]+)(?::([A-Za-z0-9_-]+))?/);
      return T ? lt(m, T) : E === "/*:" ? pt(m) : E === "*/" ? m.lines.length > 0 ? C(m) : m : { ...m, lines: m.lines.concat([E]) };
    }, f);
    return { structs: d.structs, bodies: d.bodies };
  })(t), a = e.structs.map((c) => Mt(c)), r = Ct(e);
  if (!r) return { params: [], commands: [], meta: {}, helpLines: [], structs: a };
  const s = Z(r, Y);
  return {
    params: s.params,
    commands: s.commands,
    meta: s.meta,
    helpLines: s.helpLines,
    structs: a
  };
}, Mt = (t) => {
  const e = Z(t, Y);
  return { name: t.struct, params: e.params };
}, Ct = (t) => {
  if (t.bodies.length !== 0) return t.bodies[0];
}, Z = (t, e) => {
  const a = t.lines.reduce((r, s) => {
    const c = s.trimEnd().replace(/^[\*\s]*/, "");
    if (!c.startsWith("@")) return r.currentContext === U ? { ...r, helpLines: r.helpLines.concat(c) } : r;
    const o = c.match(/^@(\S+)\s*(.*)$/);
    if (!o) return r;
    const [, f, d] = o, m = e[f];
    return m ? m(r, d.trim()) : r;
  }, Ft());
  return S(a);
}, Ft = () => ({
  helpLines: [],
  params: [],
  commands: [],
  currentParam: null,
  currentCommand: null,
  currentContext: null,
  currentOption: null,
  dependencies: { base: [], orderBefore: [], orderAfter: [] },
  meta: {}
}), l = (t, e, a) => t.currentParam && !(e in t.currentParam.attr) ? { ...t, currentParam: { ...t.currentParam, attr: { ...t.currentParam.attr, [e]: a } } } : t, N = (t, e, a) => ({
  ...t,
  meta: { [e]: a, ...t.meta }
}), Y = {
  param: (t, e) => {
    const a = S(t);
    return a.params.some((r) => r.name === e) ? a : { ...a, currentContext: "param", currentParam: { name: e, attr: {} } };
  },
  text: (t, e) => t.currentParam ? l(t, h, e) : t.currentCommand && !(h in t.currentCommand) ? { ...t, currentCommand: {
    ...L(t.currentCommand),
    command: t.currentCommand.command,
    args: t.currentCommand.args,
    [h]: e
  } } : t,
  desc: (t, e) => t.currentParam ? l(t, "desc", e) : t.currentCommand ? { ...t, currentCommand: { ...t.currentCommand, desc: e } } : t,
  command: (t, e) => {
    const a = S(t);
    return a.commands.some((r) => r.command === e) ? a : { ...a, currentCommand: { command: e, args: [] }, currentParam: null };
  },
  arg: (t, e) => {
    if (!t.currentCommand) return t;
    if (!t.currentParam) return {
      ...t,
      currentParam: { name: e, attr: {} }
    };
    const a = { ...L(t.currentCommand), command: t.currentCommand.command, args: t.currentCommand.args.concat(t.currentParam) };
    return {
      ...t,
      commands: t.commands,
      currentCommand: a,
      currentContext: "arg",
      currentParam: { name: e, attr: {} }
    };
  },
  help: (t) => ({ ...S(t), currentContext: U }),
  option: (t, e) => {
    if (!t.currentParam) return t;
    const a = ((r, s) => r.currentOption ? { items: r.items.concat({ option: r.currentOption, value: r.currentOption }), currentOption: s } : { items: r.items, currentOption: s })(t.currentOption ?? {
      items: []
    }, e);
    return { ...t, currentOption: a };
  },
  value: (t, e) => {
    if (!t.currentOption) return t;
    const a = ((r, s) => r.currentOption ? { items: r.items.concat({ option: r.currentOption, value: s }) } : {
      items: r.items
    })(t.currentOption, e);
    return { ...t, currentOption: a };
  },
  type: (t, e) => {
    if (((a) => a.endsWith(">") && a.startsWith("struct<"))(e)) {
      const a = e.slice(7, -1), r = l(t, x, a);
      return l(r, I, x);
    }
    return t.currentParam ? l(t, I, e) : t;
  },
  default: (t, e) => l(t, "default", e),
  on: (t, e) => l(t, "on", e),
  off: (t, e) => l(t, "off", e),
  min: (t, e) => l(t, "min", e),
  max: (t, e) => l(t, "max", e),
  base: (t, e) => {
    return { ...t, dependencies: (a = t.dependencies, r = e, { orderAfter: a.orderAfter, orderBefore: a.orderBefore, base: a.base.concat(r) }) };
    var a, r;
  },
  orderAfter: (t, e) => {
    return { ...t, dependencies: (a = t.dependencies, r = e, { base: a.base, orderBefore: a.orderBefore, orderAfter: a.orderAfter.concat(r) }) };
    var a, r;
  },
  orderBefore: (t, e) => {
    return {
      ...t,
      dependencies: (a = t.dependencies, r = e, { base: a.base, orderAfter: a.orderAfter, orderBefore: a.orderBefore.concat(r) })
    };
    var a, r;
  },
  author: (t, e) => N(t, "author", e),
  plugindesc: (t, e) => N(t, "plugindesc", e),
  url: (t, e) => N(t, "url", e)
}, vt = (t) => ({
  target: "MZ",
  meta: t.meta,
  commands: Tt(t.commands),
  params: F(t.params),
  structs: xt(t.structs)
}), F = (t) => Object.fromEntries(t.map((e) => [e.name, z(e)])), Tt = (t) => Object.fromEntries(t.map((e) => [e.command, {
  desc: e.desc,
  text: e.text,
  args: F(e.args)
}])), xt = (t) => Object.fromEntries(t.map((e) => [e.name, { params: F(e.params) }])), v = (t) => t.map((e) => ({ name: e.name, attr: z(e) })), jt = (t) => t.map((e) => ({
  command: e.command,
  desc: e.desc,
  text: e.text,
  args: v(e.args)
})), Dt = (t) => t.map((e) => ({ struct: e.name, params: v(e.params) })), zt = (t) => ((e) => vt(W(e)))(t), Kt = (t, e) => {
  const a = W(e);
  return {
    meta: a.meta,
    pluginName: t,
    target: "MZ",
    schema: (r = a, { commands: jt(r.commands), params: v(r.params), structs: Dt(r.structs) })
  };
  var r;
}, Wt = (t) => ht(t).map((e) => ({
  description: e.description,
  name: e.name,
  status: e.status,
  parameters: mt(e.parameters)
})), Zt = "bgm", Yt = "se", $t = "me", Ht = "bgs", qt = "battlebacks1", Qt = "battlebacks2", Xt = "characters", te = "enemies", ee = "faces", ae = "parallaxes", re = "pictures", se = "sv_actors", ne = "sv_enemies", ce = "system", oe = "tilesets", me = "titles1", ie = "titles2", ue = "System.json", le = "Actors.json", pe = "Classes.json", de = "Skills.json", fe = "Items.json", Ee = "Weapons.json", Ae = "Armors.json", Oe = "Enemies.json", Se = "Troops.json", ge = "States.json", be = "Animations.json", ye = "Tilesets.json", Pe = "CommonEvents.json", _e = "MapInfos.json", he = "data", Ne = "img", Ie = "audio", Le = "js";
export {
  le as FILENAME_ACTORS,
  be as FILENAME_ANIMATIONS,
  Ae as FILENAME_ARMORS,
  pe as FILENAME_CLASSES,
  Pe as FILENAME_COMMON_EVENTS,
  Oe as FILENAME_ENEMIES,
  fe as FILENAME_ITEMS,
  _e as FILENAME_MAP_INFOS,
  de as FILENAME_SKILLS,
  ge as FILENAME_STATES,
  ue as FILENAME_SYSTEM,
  ye as FILENAME_TILESET,
  Se as FILENAME_TROOPS,
  Ee as FILENAME_WEAPONS,
  Ie as FOLDER_AUDIO,
  Zt as FOLDER_AUDIO_BGM,
  Ht as FOLDER_AUDIO_BGS,
  $t as FOLDER_AUDIO_ME,
  Yt as FOLDER_AUDIO_SE,
  he as FOLDER_DATA,
  Ne as FOLDER_IMG,
  qt as FOLDER_IMG_BATTLEBACK1,
  Qt as FOLDER_IMG_BATTLEBACK2,
  Xt as FOLDER_IMG_CHACTERS,
  te as FOLDER_IMG_ENEMIES,
  ee as FOLDER_IMG_FACES,
  ae as FOLDER_IMG_PARALLACES,
  re as FOLDER_IMG_PICTURES,
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
  at as collectDependentStructNames,
  z as compileAttributes,
  xe as convertPluginCommandSchema,
  _t as convertPluginsJSToJSON,
  je as convertStructSchema,
  De as createClassifiedStructMap,
  Re as createStructMap,
  Gt as filterPluginSchemaByFileParam,
  Bt as filterPluginSchemaByNumberParam,
  _ as filterPluginSchemaByParam,
  kt as filterPluginSchemaByStringParam,
  wt as filterPluginSchemaByVariableParam,
  ke as hasNumberValueParam,
  Be as hasScalarAttr,
  R as hasStructAttr,
  H as hasTextAttr,
  we as isArrayAttr,
  Ge as isArrayParam,
  Je as isArrayParamEx,
  X as isFileAttr,
  Ve as isNumberArrayParam,
  q as isNumberAttr,
  Ue as isNumberValueParam,
  ze as isNumberValueParamEx,
  Jt as isRmmzDataKind,
  Ke as isScalarParam,
  We as isStringArrayParam,
  Ze as isStringValueParam,
  Ye as isStructArrayAttr,
  et as isStructArrayParam,
  $e as isStructAttr,
  tt as isStructParam,
  Q as isVariableAttr,
  ot as lookupKind,
  He as paramHasText,
  B as parseDeepJSON,
  mt as parseDeepRecord,
  Wt as parsePluginParamObject,
  ht as parsePluginParamRecord,
  Kt as pluginSourceToArraySchema,
  zt as pluginSourceToJSON,
  st as rebuildCommands,
  Ut as stringifyDeepJSON,
  Vt as structDependencies,
  qe as toArrayPluginParam,
  Qe as toObjectPluginParams,
  Xe as toObjectPluginParamsOld,
  Et as validatePluginJS
};
