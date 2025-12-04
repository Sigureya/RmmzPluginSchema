import { o as R, v as Y, B as H, D as $, E as q, n as Q, r as X, F as A, G as rr } from "../shared/parseDeepJSON.es.js";
import { a as Fe, c as Ce, b as Me, g as ve, f as Te, h as xe, i as je, z as De, q as Re, k as ke, j as Be, l as we, A as Ge, x as Je, y as Ve, m as Ue, C as ze, w as Ke, s as We, p as Ze, u as Ye, e as He, d as $e, t as qe } from "../shared/parseDeepJSON.es.js";
const er = (r, e) => {
  const a = function(t) {
    return Object.fromEntries(t.map((s) => [s.struct, s.params.filter(R)]));
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
}, Dr = (r) => _(r, Y), Rr = (r) => _(r, H), kr = (r) => _(r, $), Br = (r) => _(r, q), _ = (r, e) => {
  const a = r.structs.filter((c) => c.params.some((o) => e(o))), t = new Set(a.map((c) => c.struct)), s = er(r.structs, t);
  return {
    structs: ar(r.structs, s, e),
    commands: tr(r.commands, s, e),
    params: F(r.params, s, e)
  };
}, F = (r, e, a) => r.filter((t) => R(t) ? e.has(t.attr.struct) : a(t)), ar = (r, e, a) => r.map((t) => ({
  struct: t.struct,
  params: F(t.params, e, a)
})).filter((t) => t.params.length > 0), tr = (r, e, a) => r.map((t) => ({
  ...t.desc ? { desc: t.desc } : {},
  ...t.text ? { text: t.text } : {},
  command: t.command,
  args: F(t.args, e, a)
})).filter((t) => t.args.length > 0), sr = { variable: 1, switch: 2, actor: 0, item: 0, weapon: 0, armor: 0, skill: 0, class: 0, state: 0, troop: 0, enemy: 0, common_event: 0 }, nr = ["data", "system", "system"], cr = (r) => {
  const e = sr[r];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: r } : { author: "rmmz", module: nr[e], kind: [r, "variable", "switch"][e] };
}, wr = (r) => {
  const e = cr(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, k = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((s) => ((c, o) => !(!Q(c) && !X(c) || !c.struct || o.has(c.struct)))(s, a)).flatMap((s) => {
    const c = s.struct;
    return a.add(c), [c, ...k(c, e, a)];
  }) : [];
}, Gr = (r, e) => k(r, e, /* @__PURE__ */ new Set()), Jr = (r) => JSON.stringify(or(r)), S = (r) => typeof r == "object" && r !== null && !Array.isArray(r), or = (r) => Array.isArray(r) ? mr(r) : S(r) ? y(r) : {}, y = (r) => S(r) ? Object.fromEntries(Object.entries(r).map(([e, a]) => {
  if (Array.isArray(a)) {
    const t = a.map((s) => S(s) ? JSON.stringify(y(s)) : String(s));
    return [e, JSON.stringify(t)];
  }
  return S(a) ? [e, JSON.stringify(y(a))] : [e, String(a)];
})) : {}, mr = (r) => r.map((e) => typeof e == "object" && e !== null ? JSON.stringify(y(e)) : String(e)), B = (r, e) => Object.entries(e).reduce((a, [t, s]) => {
  if (t in r) {
    const c = r[t];
    if (typeof c == "string") return { ...a, [t]: s(c) };
  }
  return a;
}, {}), d = (r, e, a, t) => ({ default: e, ...B(a, t), kind: r }), b = (r, e, a) => ({
  default: [],
  ...B(e, a),
  kind: r
}), w = "BODY", G = "STRUCT", O = "NONE", ir = (r, e) => {
  const a = r.lines.length > 0 ? C(r) : r, t = e[1] || void 0;
  return { ...a, structName: t, blockType: t ? G : "INVALID", locale: e[2], lines: [] };
}, ur = (r) => ({
  ...r.lines.length > 0 ? C(r) : r,
  blockType: w,
  structName: void 0,
  locale: void 0,
  lines: []
}), C = (r) => r.blockType === w ? {
  ...r,
  bodies: r.bodies.concat([{ lines: [...r.lines] }]),
  lines: [],
  blockType: O
} : r.structName && r.blockType === G ? {
  ...r,
  structs: r.structs.concat([{ struct: r.structName, locale: r.locale, lines: [...r.lines] }]),
  blockType: O,
  structName: void 0,
  locale: void 0,
  lines: []
} : { ...r, blockType: O, structName: void 0, lines: [] }, lr = (r) => r.currentOption ? {
  items: r.items.concat({ option: r.currentOption, value: r.currentOption })
} : r, J = "help", I = "kind", h = "text", x = "struct", V = (r) => {
  if (I in r.attr) {
    const e = dr[r.attr.kind];
    if (e) return e(r);
  }
  return d("any", "", r.attr, P);
}, n = (r) => r, U = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), P = {
  default: n,
  text: n,
  desc: n,
  parent: n
}, j = (r) => d("string", "", r.attr, P), D = (r) => {
  const e = { default: (a) => A(a), text: n, desc: n, parent: n };
  return b("string[]", r.attr, e);
}, i = (r, e) => {
  const a = {
    default: U,
    text: n,
    desc: n,
    parent: n
  };
  return b(e, r.attr, a);
}, u = (r, e) => {
  const a = { default: (t) => parseInt(t, 10), text: n, desc: n, parent: n };
  return d(e, 0, r.attr, a);
}, dr = {
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
    const e = { default: U, text: n, desc: n, decimals: (a) => parseInt(a, 10), min: (a) => parseFloat(a), max: (a) => parseFloat(a), parent: n };
    return b("number[]", r.attr, e);
  },
  string: j,
  "string[]": D,
  multiline_string: j,
  "multiline_string[]": D,
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
    const e = { default: (a) => A(a), text: n, desc: n, parent: n, dir: n };
    return { dir: "", ...b("file[]", r.attr, e) };
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
}, pr = (r) => !Array.isArray(r) && typeof r == "object" && r !== null && !!(fr(r) && Er(r) && Ar(r) && "parameters" in r) && Sr(r), fr = (r) => "name" in r && typeof r.name == "string", Er = (r) => "status" in r && typeof r.status == "boolean", Ar = (r) => "description" in r && typeof r.description == "string", Sr = (r) => typeof r.parameters == "object" && r.parameters !== null && Object.values(r.parameters).every((e) => typeof e == "string"), Or = /\s*\/\//, gr = /\s*[var|let|const]\s+[^\s]+\s*=/, yr = /^\s{0,3}[\[|\]\;]/, br = (r) => r.split(`
`).filter((e) => !((a) => Or.test(a) || yr.test(a) || gr.test(a))(e)), Pr = (r) => {
  const e = `[${br(r).join("")}]`, a = JSON.parse(e);
  if (!Array.isArray(a)) throw new Error("Parsed value is not an array");
  if (a.every(pr)) return a;
  throw new Error("Parsed value is not PluginParamsObject array");
}, L = (r) => ({ ...typeof r.desc == "string" ? { desc: r.desc } : {}, ...typeof r.text == "string" ? { text: r.text } : {} }), g = (r) => {
  const e = _r(r), a = Nr(e);
  return hr(a);
}, _r = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: {
      ...r.currentParam,
      options: lr(r.currentOption).items
    } };
  }
  return r;
}, hr = (r) => r.currentParam ? { ...r, params: [...r.params, r.currentParam], currentParam: null, currentContext: null } : r, Nr = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = {
    ...L(r.currentCommand),
    command: r.currentCommand.command,
    args: e
  };
  return { ...r, commands: [...r.commands, a], currentCommand: null, currentParam: null, currentContext: null, currentOption: null };
}, z = (r) => {
  const e = ((c) => {
    const o = c.split(`
`), f = {
      structs: [],
      bodies: [],
      structName: void 0,
      locale: void 0,
      lines: [],
      blockType: O
    }, p = o.reduce((m, Z) => {
      const E = Z.trim(), T = E.match(/^\/\*~struct~([A-Za-z0-9_]+)(?::([A-Za-z0-9_-]+))?/);
      return T ? ir(m, T) : E === "/*:" ? ur(m) : E === "*/" ? m.lines.length > 0 ? C(m) : m : { ...m, lines: m.lines.concat([E]) };
    }, f);
    return { structs: p.structs, bodies: p.bodies };
  })(r), a = e.structs.map((c) => Ir(c)), t = Lr(e);
  if (!t) return { params: [], commands: [], meta: {}, helpLines: [], structs: a };
  const s = K(t, W);
  return {
    params: s.params,
    commands: s.commands,
    meta: s.meta,
    helpLines: s.helpLines,
    structs: a
  };
}, Ir = (r) => {
  const e = K(r, W);
  return { name: r.struct, params: e.params };
}, Lr = (r) => {
  if (r.bodies.length !== 0) return r.bodies[0];
}, K = (r, e) => {
  const a = r.lines.reduce((t, s) => {
    const c = s.trimEnd().replace(/^[\*\s]*/, "");
    if (!c.startsWith("@")) return t.currentContext === J ? { ...t, helpLines: t.helpLines.concat(c) } : t;
    const o = c.match(/^@(\S+)\s*(.*)$/);
    if (!o) return t;
    const [, f, p] = o, m = e[f];
    return m ? m(t, p.trim()) : t;
  }, Fr());
  return g(a);
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
}), l = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: { ...r.currentParam, attr: { ...r.currentParam.attr, [e]: a } } } : r, N = (r, e, a) => ({
  ...r,
  meta: { [e]: a, ...r.meta }
}), W = {
  param: (r, e) => {
    const a = g(r);
    return a.params.some((t) => t.name === e) ? a : { ...a, currentContext: "param", currentParam: { name: e, attr: {} } };
  },
  text: (r, e) => r.currentParam ? l(r, h, e) : r.currentCommand && !(h in r.currentCommand) ? { ...r, currentCommand: {
    ...L(r.currentCommand),
    command: r.currentCommand.command,
    args: r.currentCommand.args,
    [h]: e
  } } : r,
  desc: (r, e) => r.currentParam ? l(r, "desc", e) : r.currentCommand ? { ...r, currentCommand: { ...r.currentCommand, desc: e } } : r,
  command: (r, e) => {
    const a = g(r);
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
  help: (r) => ({ ...g(r), currentContext: J }),
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
      const a = e.slice(7, -1), t = l(r, x, a);
      return l(t, I, x);
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
  author: (r, e) => N(r, "author", e),
  plugindesc: (r, e) => N(r, "plugindesc", e),
  url: (r, e) => N(r, "url", e)
}, Cr = (r) => ({
  target: "MZ",
  meta: r.meta,
  commands: Mr(r.commands),
  params: M(r.params),
  structs: vr(r.structs)
}), M = (r) => Object.fromEntries(r.map((e) => [e.name, V(e)])), Mr = (r) => Object.fromEntries(r.map((e) => [e.command, {
  desc: e.desc,
  text: e.text,
  args: M(e.args)
}])), vr = (r) => Object.fromEntries(r.map((e) => [e.name, { params: M(e.params) }])), v = (r) => r.map((e) => ({ name: e.name, attr: V(e) })), Tr = (r) => r.map((e) => ({
  command: e.command,
  desc: e.desc,
  text: e.text,
  args: v(e.args)
})), xr = (r) => r.map((e) => ({ struct: e.name, params: v(e.params) })), Vr = (r) => ((e) => Cr(z(e)))(r), Ur = (r, e) => {
  const a = z(e);
  return {
    meta: a.meta,
    pluginName: r,
    target: "MZ",
    schema: (t = a, { commands: Tr(t.commands), params: v(t.params), structs: xr(t.structs) })
  };
  var t;
}, zr = (r) => Pr(r).map((e) => ({
  description: e.description,
  name: e.name,
  status: e.status,
  parameters: rr(e.parameters)
})), Kr = "bgm", Wr = "se", Zr = "me", Yr = "bgs", Hr = "battlebacks1", $r = "battlebacks2", qr = "characters", Qr = "enemies", Xr = "faces", re = "parallaxes", ee = "pictures", ae = "sv_actors", te = "sv_enemies", se = "system", ne = "tilesets", ce = "titles1", oe = "titles2", me = "System.json", ie = "Actors.json", ue = "Classes.json", le = "Skills.json", de = "Items.json", pe = "Weapons.json", fe = "Armors.json", Ee = "Enemies.json", Ae = "Troops.json", Se = "States.json", Oe = "Animations.json", ge = "Tilesets.json", ye = "CommonEvents.json", be = "MapInfos.json", Pe = "data", _e = "img", he = "audio", Ne = "js";
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
  Ne as FOLDER_JS,
  Fe as classifyFileParams,
  Ce as classifyPluginParams,
  Me as classifyTextParams,
  er as collectDependentStructNames,
  V as compileAttributes,
  ve as convertPluginCommandSchema,
  br as convertPluginsJSToJSON,
  Te as convertStructSchema,
  xe as createClassifiedStructMap,
  je as createStructMap,
  Dr as filterPluginParamByText,
  Br as filterPluginSchemaByFileParam,
  Rr as filterPluginSchemaByNumberParam,
  _ as filterPluginSchemaByParam,
  kr as filterPluginSchemaByVariableParam,
  De as hasNumberValueParam,
  Re as hasScalarAttr,
  R as hasStructAttr,
  Y as hasTextAttr,
  ke as isArrayAttr,
  Be as isArrayParam,
  we as isArrayParamEx,
  q as isFileAttr,
  Ge as isNumberArrayParam,
  H as isNumberAttr,
  Je as isNumberValueParam,
  Ve as isNumberValueParamEx,
  wr as isRmmzDataKind,
  Ue as isScalarParam,
  ze as isStringArrayParam,
  Ke as isStringValueParam,
  We as isStructArrayAttr,
  X as isStructArrayParam,
  Ze as isStructAttr,
  Q as isStructParam,
  $ as isVariableAttr,
  cr as lookupKind,
  Ye as paramHasText,
  A as parseDeepJSON,
  rr as parseDeepRecord,
  zr as parsePluginParamObject,
  Pr as parsePluginParamRecord,
  Ur as pluginSourceToArraySchema,
  Vr as pluginSourceToJSON,
  tr as rebuildCommands,
  Jr as stringifyDeepJSON,
  Gr as structDependencies,
  He as toArrayPluginParam,
  $e as toObjectPluginParams,
  qe as toObjectPluginParamsOld,
  pr as validatePluginJS
};
