import { o as R, v as H, B as $, D as q, E as Q, n as X, r as rr, F as A, G as er } from "../shared/parseDeepJSON.es.js";
import { a as Ce, c as Me, b as ve, g as Te, f as xe, h as De, i as je, z as Re, q as ke, k as Be, j as we, l as Ge, A as Je, x as Ve, y as Ue, m as ze, C as Ke, w as We, s as Ze, p as Ye, u as He, e as $e, d as qe, t as Qe } from "../shared/parseDeepJSON.es.js";
const ar = (r, e) => {
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
}, jr = (r) => _(r, H), Rr = (r) => _(r, $), kr = (r) => _(r, q), Br = (r) => _(r, Q), _ = (r, e) => {
  const a = r.structs.filter((c) => c.params.some((o) => e(o))), t = new Set(a.map((c) => c.struct)), s = ar(r.structs, t);
  return {
    structs: tr(r.structs, s, e),
    commands: sr(r.commands, s, e),
    params: F(r.params, s, e)
  };
}, F = (r, e, a) => r.filter((t) => R(t) ? e.has(t.attr.struct) : a(t)), tr = (r, e, a) => r.map((t) => ({
  struct: t.struct,
  params: F(t.params, e, a)
})).filter((t) => t.params.length > 0), sr = (r, e, a) => r.map((t) => ({
  ...t.desc ? { desc: t.desc } : {},
  ...t.text ? { text: t.text } : {},
  command: t.command,
  args: F(t.args, e, a)
})).filter((t) => t.args.length > 0), nr = { variable: 1, switch: 2, actor: 0, item: 0, weapon: 0, armor: 0, skill: 0, class: 0, state: 0, troop: 0, enemy: 0, common_event: 0 }, cr = ["data", "system", "system"], or = (r) => {
  const e = nr[r];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: r } : { author: "rmmz", module: cr[e], kind: [r, "variable", "switch"][e] };
}, wr = (r) => {
  const e = or(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, k = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((s) => ((c, o) => !(!X(c) && !rr(c) || !c.struct || o.has(c.struct)))(s, a)).flatMap((s) => {
    const c = s.struct;
    return a.add(c), [c, ...k(c, e, a)];
  }) : [];
}, Gr = (r, e) => k(r, e, /* @__PURE__ */ new Set()), Jr = (r) => B(r), Vr = (r) => JSON.stringify(B(r)), S = (r) => typeof r == "object" && r !== null && !Array.isArray(r), B = (r) => Array.isArray(r) ? mr(r) : S(r) ? y(r) : {}, y = (r) => S(r) ? Object.fromEntries(Object.entries(r).map(([e, a]) => {
  if (Array.isArray(a)) {
    const t = a.map((s) => S(s) ? JSON.stringify(y(s)) : String(s));
    return [e, JSON.stringify(t)];
  }
  return S(a) ? [e, JSON.stringify(y(a))] : [e, String(a)];
})) : {}, mr = (r) => r.map((e) => typeof e == "object" && e !== null ? JSON.stringify(y(e)) : String(e)), w = (r, e) => Object.entries(e).reduce((a, [t, s]) => {
  if (t in r) {
    const c = r[t];
    if (typeof c == "string") return { ...a, [t]: s(c) };
  }
  return a;
}, {}), d = (r, e, a, t) => ({ default: e, ...w(a, t), kind: r }), b = (r, e, a) => ({
  default: [],
  ...w(e, a),
  kind: r
}), G = "BODY", J = "STRUCT", O = "NONE", ir = (r, e) => {
  const a = r.lines.length > 0 ? C(r) : r, t = e[1] || void 0;
  return { ...a, structName: t, blockType: t ? J : "INVALID", locale: e[2], lines: [] };
}, ur = (r) => ({
  ...r.lines.length > 0 ? C(r) : r,
  blockType: G,
  structName: void 0,
  locale: void 0,
  lines: []
}), C = (r) => r.blockType === G ? {
  ...r,
  bodies: r.bodies.concat([{ lines: [...r.lines] }]),
  lines: [],
  blockType: O
} : r.structName && r.blockType === J ? {
  ...r,
  structs: r.structs.concat([{ struct: r.structName, locale: r.locale, lines: [...r.lines] }]),
  blockType: O,
  structName: void 0,
  locale: void 0,
  lines: []
} : { ...r, blockType: O, structName: void 0, lines: [] }, lr = (r) => r.currentOption ? {
  items: r.items.concat({ option: r.currentOption, value: r.currentOption })
} : r, V = "help", N = "kind", h = "text", x = "struct", U = (r) => {
  if (N in r.attr) {
    const e = dr[r.attr.kind];
    if (e) return e(r);
  }
  return d("any", "", r.attr, P);
}, n = (r) => r, z = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), P = {
  default: n,
  text: n,
  desc: n,
  parent: n
}, D = (r) => d("string", "", r.attr, P), j = (r) => {
  const e = { default: (a) => A(a), text: n, desc: n, parent: n };
  return b("string[]", r.attr, e);
}, i = (r, e) => {
  const a = {
    default: z,
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
    const e = { default: z, text: n, desc: n, decimals: (a) => parseInt(a, 10), min: (a) => parseFloat(a), max: (a) => parseFloat(a), parent: n };
    return b("number[]", r.attr, e);
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
  const e = _r(r), a = Ir(e);
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
}, hr = (r) => r.currentParam ? { ...r, params: [...r.params, r.currentParam], currentParam: null, currentContext: null } : r, Ir = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = {
    ...L(r.currentCommand),
    command: r.currentCommand.command,
    args: e
  };
  return { ...r, commands: [...r.commands, a], currentCommand: null, currentParam: null, currentContext: null, currentOption: null };
}, K = (r) => {
  const e = ((c) => {
    const o = c.split(`
`), f = {
      structs: [],
      bodies: [],
      structName: void 0,
      locale: void 0,
      lines: [],
      blockType: O
    }, p = o.reduce((m, Y) => {
      const E = Y.trim(), T = E.match(/^\/\*~struct~([A-Za-z0-9_]+)(?::([A-Za-z0-9_-]+))?/);
      return T ? ir(m, T) : E === "/*:" ? ur(m) : E === "*/" ? m.lines.length > 0 ? C(m) : m : { ...m, lines: m.lines.concat([E]) };
    }, f);
    return { structs: p.structs, bodies: p.bodies };
  })(r), a = e.structs.map((c) => Nr(c)), t = Lr(e);
  if (!t) return { params: [], commands: [], meta: {}, helpLines: [], structs: a };
  const s = W(t, Z);
  return {
    params: s.params,
    commands: s.commands,
    meta: s.meta,
    helpLines: s.helpLines,
    structs: a
  };
}, Nr = (r) => {
  const e = W(r, Z);
  return { name: r.struct, params: e.params };
}, Lr = (r) => {
  if (r.bodies.length !== 0) return r.bodies[0];
}, W = (r, e) => {
  const a = r.lines.reduce((t, s) => {
    const c = s.trimEnd().replace(/^[\*\s]*/, "");
    if (!c.startsWith("@")) return t.currentContext === V ? { ...t, helpLines: t.helpLines.concat(c) } : t;
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
}), l = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: { ...r.currentParam, attr: { ...r.currentParam.attr, [e]: a } } } : r, I = (r, e, a) => ({
  ...r,
  meta: { [e]: a, ...r.meta }
}), Z = {
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
  help: (r) => ({ ...g(r), currentContext: V }),
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
      return l(t, N, x);
    }
    return r.currentParam ? l(r, N, e) : r;
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
}, Cr = (r) => ({
  target: "MZ",
  meta: r.meta,
  commands: Mr(r.commands),
  params: M(r.params),
  structs: vr(r.structs)
}), M = (r) => Object.fromEntries(r.map((e) => [e.name, U(e)])), Mr = (r) => Object.fromEntries(r.map((e) => [e.command, {
  desc: e.desc,
  text: e.text,
  args: M(e.args)
}])), vr = (r) => Object.fromEntries(r.map((e) => [e.name, { params: M(e.params) }])), v = (r) => r.map((e) => ({ name: e.name, attr: U(e) })), Tr = (r) => r.map((e) => ({
  command: e.command,
  desc: e.desc,
  text: e.text,
  args: v(e.args)
})), xr = (r) => r.map((e) => ({ struct: e.name, params: v(e.params) })), Ur = (r) => ((e) => Cr(K(e)))(r), zr = (r, e) => {
  const a = K(e);
  return {
    meta: a.meta,
    pluginName: r,
    target: "MZ",
    schema: (t = a, { commands: Tr(t.commands), params: v(t.params), structs: xr(t.structs) })
  };
  var t;
}, Kr = (r) => Pr(r).map((e) => ({
  description: e.description,
  name: e.name,
  status: e.status,
  parameters: er(e.parameters)
})), Wr = "bgm", Zr = "se", Yr = "me", Hr = "bgs", $r = "battlebacks1", qr = "battlebacks2", Qr = "characters", Xr = "enemies", re = "faces", ee = "parallaxes", ae = "pictures", te = "sv_actors", se = "sv_enemies", ne = "system", ce = "tilesets", oe = "titles1", me = "titles2", ie = "System.json", ue = "Actors.json", le = "Classes.json", de = "Skills.json", pe = "Items.json", fe = "Weapons.json", Ee = "Armors.json", Ae = "Enemies.json", Se = "Troops.json", Oe = "States.json", ge = "Animations.json", ye = "Tilesets.json", be = "CommonEvents.json", Pe = "MapInfos.json", _e = "data", he = "img", Ie = "audio", Ne = "js";
export {
  ue as FILENAME_ACTORS,
  ge as FILENAME_ANIMATIONS,
  Ee as FILENAME_ARMORS,
  le as FILENAME_CLASSES,
  be as FILENAME_COMMON_EVENTS,
  Ae as FILENAME_ENEMIES,
  pe as FILENAME_ITEMS,
  Pe as FILENAME_MAP_INFOS,
  de as FILENAME_SKILLS,
  Oe as FILENAME_STATES,
  ie as FILENAME_SYSTEM,
  ye as FILENAME_TILESET,
  Se as FILENAME_TROOPS,
  fe as FILENAME_WEAPONS,
  Ie as FOLDER_AUDIO,
  Wr as FOLDER_AUDIO_BGM,
  Hr as FOLDER_AUDIO_BGS,
  Yr as FOLDER_AUDIO_ME,
  Zr as FOLDER_AUDIO_SE,
  _e as FOLDER_DATA,
  he as FOLDER_IMG,
  $r as FOLDER_IMG_BATTLEBACK1,
  qr as FOLDER_IMG_BATTLEBACK2,
  Qr as FOLDER_IMG_CHACTERS,
  Xr as FOLDER_IMG_ENEMIES,
  re as FOLDER_IMG_FACES,
  ee as FOLDER_IMG_PARALLACES,
  ae as FOLDER_IMG_PICTURES,
  te as FOLDER_IMG_SV_ACTORS,
  se as FOLDER_IMG_SV_ENEMIES,
  ne as FOLDER_IMG_SYSTEM,
  ce as FOLDER_IMG_TILESETS,
  oe as FOLDER_IMG_TITLES1,
  me as FOLDER_IMG_TITLES2,
  Ne as FOLDER_JS,
  Ce as classifyFileParams,
  Me as classifyPluginParams,
  ve as classifyTextParams,
  ar as collectDependentStructNames,
  U as compileAttributes,
  Te as convertPluginCommandSchema,
  br as convertPluginsJSToJSON,
  xe as convertStructSchema,
  De as createClassifiedStructMap,
  je as createStructMap,
  jr as filterPluginParamByText,
  Br as filterPluginSchemaByFileParam,
  Rr as filterPluginSchemaByNumberParam,
  _ as filterPluginSchemaByParam,
  kr as filterPluginSchemaByVariableParam,
  Re as hasNumberValueParam,
  ke as hasScalarAttr,
  R as hasStructAttr,
  H as hasTextAttr,
  Be as isArrayAttr,
  we as isArrayParam,
  Ge as isArrayParamEx,
  Q as isFileAttr,
  Je as isNumberArrayParam,
  $ as isNumberAttr,
  Ve as isNumberValueParam,
  Ue as isNumberValueParamEx,
  wr as isRmmzDataKind,
  ze as isScalarParam,
  Ke as isStringArrayParam,
  We as isStringValueParam,
  Ze as isStructArrayAttr,
  rr as isStructArrayParam,
  Ye as isStructAttr,
  X as isStructParam,
  q as isVariableAttr,
  or as lookupKind,
  He as paramHasText,
  A as parseDeepJSON,
  er as parseDeepRecord,
  Kr as parsePluginParamObject,
  Pr as parsePluginParamRecord,
  zr as pluginSourceToArraySchema,
  Ur as pluginSourceToJSON,
  sr as rebuildCommands,
  Vr as stringifyDeepJSON,
  Jr as stringifyDeepRecord,
  Gr as structDependencies,
  $e as toArrayPluginParam,
  qe as toObjectPluginParams,
  Qe as toObjectPluginParamsOld,
  pr as validatePluginJS
};
