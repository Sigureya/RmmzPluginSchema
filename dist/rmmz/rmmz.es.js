import { o as R, v as H, B as q, D as Q, E as X, n as tt, r as et } from "../shared/structMap.es.js";
import { a as Ce, c as Fe, b as ve, g as Te, f as xe, h as je, i as De, z as Re, q as ke, k as Be, j as we, l as Ge, A as Je, x as Ve, y as Ue, m as ze, C as Ke, w as We, s as Ze, p as Ye, u as $e, e as He, d as qe, t as Qe } from "../shared/structMap.es.js";
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
}, []), Rt = (t) => _(t, H), kt = (t) => _(t, q), Bt = (t) => _(t, Q), wt = (t) => _(t, X), nt = {
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
}, Gt = (t) => {
  const e = ot(t.kind);
  return e.author === t.author && e.module === t.module && e.kind === t.kind;
}, k = (t, e, a) => {
  const r = e.get(t);
  return r ? r.filter((s) => ((c, o) => !(!tt(c) && !et(c) || !c.struct || o.has(c.struct)))(s, a)).flatMap((s) => {
    const c = s.struct;
    return a.add(c), [c, ...k(c, e, a)];
  }) : [];
}, Jt = (t, e) => k(t, e, /* @__PURE__ */ new Set()), B = (t) => {
  const e = JSON.parse(t);
  return Array.isArray(e) ? e.map(b) : typeof e == "object" && e !== null ? w(e) : e;
}, mt = (t) => w(t), w = (t) => Object.fromEntries(Object.entries(t).map(([e, a]) => [e, b(a)])), b = (t) => {
  if (typeof t != "string") return t;
  try {
    const e = JSON.parse(t);
    return Array.isArray(e) ? e.map(b) : typeof e == "object" && e !== null ? Object.fromEntries(Object.entries(e).map(([a, r]) => [a, b(r)])) : e;
  } catch {
    return t;
  }
}, Vt = (t) => JSON.stringify(it(t)), A = (t) => typeof t == "object" && t !== null && !Array.isArray(t), it = (t) => Array.isArray(t) ? ut(t) : A(t) ? g(t) : {}, g = (t) => A(t) ? Object.fromEntries(Object.entries(t).map(([e, a]) => {
  if (Array.isArray(a)) {
    const r = a.map((s) => A(s) ? JSON.stringify(g(s)) : String(s));
    return [e, JSON.stringify(r)];
  }
  return A(a) ? [e, JSON.stringify(g(a))] : [e, String(a)];
})) : {}, ut = (t) => t.map((e) => typeof e == "object" && e !== null ? JSON.stringify(g(e)) : String(e)), G = (t, e) => Object.entries(e).reduce((a, [r, s]) => {
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
}, Et = (t) => !Array.isArray(t) && typeof t == "object" && t !== null && !!(At(t) && Ot(t) && St(t) && "parameters" in t) && bt(t), At = (t) => "name" in t && typeof t.name == "string", Ot = (t) => "status" in t && typeof t.status == "boolean", St = (t) => "description" in t && typeof t.description == "string", bt = (t) => typeof t.parameters == "object" && t.parameters !== null && Object.values(t.parameters).every((e) => typeof e == "string"), gt = /\s*\/\//, yt = /\s*[var|let|const]\s+\$plugins\s*=\s*/, Pt = /^\s*[\[\]]/, _t = (t) => t.split(`
`).filter((e) => !((a) => gt.test(a) || yt.test(a) || Pt.test(a))(e)), L = (t) => ({
  ...typeof t.desc == "string" ? { desc: t.desc } : {},
  ...typeof t.text == "string" ? { text: t.text } : {}
}), S = (t) => {
  const e = ht(t), a = It(e);
  return Nt(a);
}, ht = (t) => {
  if (t.currentParam && t.currentOption) {
    const e = t.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...t, currentParam: { ...t.currentParam, options: dt(t.currentOption).items } };
  }
  return t;
}, Nt = (t) => t.currentParam ? {
  ...t,
  params: [...t.params, t.currentParam],
  currentParam: null,
  currentContext: null
} : t, It = (t) => {
  if (!t.currentCommand) return t;
  const e = t.currentParam ? [...t.currentCommand.args, t.currentParam] : t.currentCommand.args, a = { ...L(t.currentCommand), command: t.currentCommand.command, args: e };
  return {
    ...t,
    commands: [...t.commands, a],
    currentCommand: null,
    currentParam: null,
    currentContext: null,
    currentOption: null
  };
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
  })(t), a = e.structs.map((c) => Lt(c)), r = Mt(e);
  if (!r) return { params: [], commands: [], meta: {}, helpLines: [], structs: a };
  const s = Z(r, Y);
  return {
    params: s.params,
    commands: s.commands,
    meta: s.meta,
    helpLines: s.helpLines,
    structs: a
  };
}, Lt = (t) => {
  const e = Z(t, Y);
  return { name: t.struct, params: e.params };
}, Mt = (t) => {
  if (t.bodies.length !== 0) return t.bodies[0];
}, Z = (t, e) => {
  const a = t.lines.reduce((r, s) => {
    const c = s.trimEnd().replace(/^[\*\s]*/, "");
    if (!c.startsWith("@")) return r.currentContext === U ? { ...r, helpLines: r.helpLines.concat(c) } : r;
    const o = c.match(/^@(\S+)\s*(.*)$/);
    if (!o) return r;
    const [, f, d] = o, m = e[f];
    return m ? m(r, d.trim()) : r;
  }, Ct());
  return S(a);
}, Ct = () => ({
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
}, Ft = (t) => ({
  target: "MZ",
  meta: t.meta,
  commands: vt(t.commands),
  params: F(t.params),
  structs: Tt(t.structs)
}), F = (t) => Object.fromEntries(t.map((e) => [e.name, z(e)])), vt = (t) => Object.fromEntries(t.map((e) => [e.command, {
  desc: e.desc,
  text: e.text,
  args: F(e.args)
}])), Tt = (t) => Object.fromEntries(t.map((e) => [e.name, { params: F(e.params) }])), v = (t) => t.map((e) => ({ name: e.name, attr: z(e) })), xt = (t) => t.map((e) => ({
  command: e.command,
  desc: e.desc,
  text: e.text,
  args: v(e.args)
})), jt = (t) => t.map((e) => ({ struct: e.name, params: v(e.params) })), Ut = (t) => ((e) => Ft(W(e)))(t), zt = (t, e) => {
  const a = W(e);
  return {
    meta: a.meta,
    pluginName: t,
    target: "MZ",
    schema: (r = a, { commands: xt(r.commands), params: v(r.params), structs: jt(r.structs) })
  };
  var r;
}, Kt = (t) => ((e) => {
  const a = `[${_t(e).join("")}]`, r = JSON.parse(a);
  if (!Array.isArray(r)) throw new Error("Parsed value is not an array");
  if (r.every(Et)) return r;
  throw new Error("Parsed value is not PluginParamsObject array");
})(t).map((e) => ({
  description: e.description,
  name: e.name,
  status: e.status,
  parameters: mt(e.parameters)
})), Wt = "bgm", Zt = "se", Yt = "me", $t = "bgs", Ht = "battlebacks1", qt = "battlebacks2", Qt = "characters", Xt = "enemies", te = "faces", ee = "parallaxes", ae = "pictures", re = "sv_actors", se = "sv_enemies", ne = "system", ce = "tilesets", oe = "titles1", me = "titles2", ie = "System.json", ue = "Actors.json", le = "Classes.json", pe = "Skills.json", de = "Items.json", fe = "Weapons.json", Ee = "Armors.json", Ae = "Enemies.json", Oe = "Troops.json", Se = "States.json", be = "Animations.json", ge = "Tilesets.json", ye = "CommonEvents.json", Pe = "MapInfos.json", _e = "data", he = "img", Ne = "audio", Ie = "js";
export {
  ue as FILENAME_ACTORS,
  be as FILENAME_ANIMATIONS,
  Ee as FILENAME_ARMORS,
  le as FILENAME_CLASSES,
  ye as FILENAME_COMMON_EVENTS,
  Ae as FILENAME_ENEMIES,
  de as FILENAME_ITEMS,
  Pe as FILENAME_MAP_INFOS,
  pe as FILENAME_SKILLS,
  Se as FILENAME_STATES,
  ie as FILENAME_SYSTEM,
  ge as FILENAME_TILESET,
  Oe as FILENAME_TROOPS,
  fe as FILENAME_WEAPONS,
  Ne as FOLDER_AUDIO,
  Wt as FOLDER_AUDIO_BGM,
  $t as FOLDER_AUDIO_BGS,
  Yt as FOLDER_AUDIO_ME,
  Zt as FOLDER_AUDIO_SE,
  _e as FOLDER_DATA,
  he as FOLDER_IMG,
  Ht as FOLDER_IMG_BATTLEBACK1,
  qt as FOLDER_IMG_BATTLEBACK2,
  Qt as FOLDER_IMG_CHACTERS,
  Xt as FOLDER_IMG_ENEMIES,
  te as FOLDER_IMG_FACES,
  ee as FOLDER_IMG_PARALLACES,
  ae as FOLDER_IMG_PICTURES,
  re as FOLDER_IMG_SV_ACTORS,
  se as FOLDER_IMG_SV_ENEMIES,
  ne as FOLDER_IMG_SYSTEM,
  ce as FOLDER_IMG_TILESETS,
  oe as FOLDER_IMG_TITLES1,
  me as FOLDER_IMG_TITLES2,
  Ie as FOLDER_JS,
  Ce as classifyFileParams,
  Fe as classifyPluginParams,
  ve as classifyTextParams,
  at as collectDependentStructNames,
  z as compileAttributes,
  Te as convertPluginCommandSchema,
  _t as convertPluginsJSToJSON,
  xe as convertStructSchema,
  je as createClassifiedStructMap,
  De as createStructMap,
  wt as filterPluginSchemaByFileParam,
  kt as filterPluginSchemaByNumberParam,
  _ as filterPluginSchemaByParam,
  Rt as filterPluginSchemaByStringParam,
  Bt as filterPluginSchemaByVariableParam,
  Re as hasNumberValueParam,
  ke as hasScalarAttr,
  R as hasStructAttr,
  H as hasTextAttr,
  Be as isArrayAttr,
  we as isArrayParam,
  Ge as isArrayParamEx,
  X as isFileAttr,
  Je as isNumberArrayParam,
  q as isNumberAttr,
  Ve as isNumberValueParam,
  Ue as isNumberValueParamEx,
  Gt as isRmmzDataKind,
  ze as isScalarParam,
  Ke as isStringArrayParam,
  We as isStringValueParam,
  Ze as isStructArrayAttr,
  et as isStructArrayParam,
  Ye as isStructAttr,
  tt as isStructParam,
  Q as isVariableAttr,
  ot as lookupKind,
  $e as paramHasText,
  B as parseDeepJSON,
  mt as parseDeepRecord,
  Kt as parsePluginParamObject,
  zt as pluginSourceToArraySchema,
  Ut as pluginSourceToJSON,
  st as rebuildCommands,
  Vt as stringifyDeepJSON,
  Jt as structDependencies,
  He as toArrayPluginParam,
  qe as toObjectPluginParams,
  Qe as toObjectPluginParamsOld,
  Et as validatePluginJS
};
