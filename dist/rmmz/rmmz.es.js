import { o as j, v as Z, B as Y, D as H, E as q, n as Q, r as X, F as I, G as rr } from "../shared/parseDeepJSON.es.js";
import { a as we, c as Be, b as Ge, g as Je, f as Ve, h as Ue, i as ze, z as We, q as $e, k as Ke, j as Ze, l as Ye, A as He, x as qe, y as Qe, m as Xe, C as ra, w as ea, s as aa, p as ta, u as sa, e as na, d as ca, t as oa } from "../shared/parseDeepJSON.es.js";
const er = (r, e) => {
  const a = function(t) {
    return Object.fromEntries(t.map((n) => [n.struct, n.params.filter(j)]));
  }(r);
  return function(t, n, o) {
    return t.reduce((c) => {
      if (!c.changed) return c;
      const m = t.filter((p) => !c.names.has(p) && n[p].some((i) => c.names.has(i.attr.struct)));
      return m.length === 0 ? { names: c.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...c.names, ...m]), changed: !0 };
    }, {
      names: o,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, Ur = (r) => b(r, Z), zr = (r) => b(r, Y), Wr = (r) => b(r, H), $r = (r) => b(r, q), b = (r, e) => {
  const a = r.structs.filter((o) => o.params.some((c) => e(c))), t = new Set(a.map((o) => o.struct)), n = er(r.structs, t);
  return {
    structs: ar(r.structs, n, e),
    commands: tr(r.commands, n, e),
    params: L(r.params, n, e)
  };
}, L = (r, e, a) => r.filter((t) => j(t) ? e.has(t.attr.struct) : a(t)), ar = (r, e, a) => r.map((t) => ({
  struct: t.struct,
  params: L(t.params, e, a)
})).filter((t) => t.params.length > 0), tr = (r, e, a) => r.map((t) => ({
  ...t.desc ? { desc: t.desc } : {},
  ...t.text ? { text: t.text } : {},
  command: t.command,
  args: L(t.args, e, a)
})).filter((t) => t.args.length > 0), sr = { variable: 1, switch: 2, actor: 0, item: 0, weapon: 0, armor: 0, skill: 0, class: 0, state: 0, troop: 0, enemy: 0, common_event: 0 }, nr = ["data", "system", "system"], cr = (r) => {
  const e = sr[r];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: r } : { author: "rmmz", module: nr[e], kind: [r, "variable", "switch"][e] };
}, Kr = (r) => {
  const e = cr(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, D = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((n) => ((o, c) => !(!Q(o) && !X(o) || !o.struct || c.has(o.struct)))(n, a)).flatMap((n) => {
    const o = n.struct;
    return a.add(o), [o, ...D(o, e, a)];
  }) : [];
}, Zr = (r, e) => D(r, e, /* @__PURE__ */ new Set()), Yr = (r) => R(r), Hr = (r) => JSON.stringify(R(r)), E = (r) => typeof r == "object" && r !== null && !Array.isArray(r), R = (r) => Array.isArray(r) ? or(r) : E(r) ? O(r) : {}, O = (r) => E(r) ? Object.fromEntries(Object.entries(r).map(([e, a]) => {
  if (Array.isArray(a)) {
    const t = a.map((n) => E(n) ? JSON.stringify(O(n)) : String(n));
    return [e, JSON.stringify(t)];
  }
  return E(a) ? [e, JSON.stringify(O(a))] : [e, String(a)];
})) : {}, or = (r) => r.map((e) => typeof e == "object" && e !== null ? JSON.stringify(O(e)) : String(e)), k = (r, e) => Object.entries(e).reduce((a, [t, n]) => {
  if (t in r) {
    const o = r[t];
    if (typeof o == "string") return { ...a, [t]: n(o) };
  }
  return a;
}, {}), f = (r, e, a, t) => ({ default: e, ...k(a, t), kind: r }), g = (r, e, a) => ({ default: [], ...k(e, a), kind: r }), mr = (r, e) => {
  const a = r.map((t) => t.locale === void 0 ? t.struct : t.locale === e ? `${t.struct}!` : "");
  return new Set(a);
}, w = "BODY", B = "STRUCT", A = "NONE", ir = (r, e) => {
  const a = e.trim(), t = a.match(/^\/\*~struct~([A-Za-z0-9_]*)(?::([A-Za-z0-9_-]+))?/);
  return t ? ur(r, t) : /^\/\*:/.test(a) ? dr(r, a) : a === "*/" ? r.lines.length > 0 ? v(r) : r : {
    ...r,
    lines: r.lines.concat([a])
  };
}, ur = (r, e) => {
  const a = r.lines.length > 0 ? v(r) : r, t = e[1] || void 0;
  return { ...a, structName: t, blockType: t ? B : "INVALID", locale: e[2], lines: [] };
}, lr = (r) => {
  if (r) {
    const e = r.match(/^\/\*:(\w+)/);
    if (e) return e[1];
  }
}, dr = (r, e) => ({ ...r.lines.length > 0 ? v(r) : r, locale: lr(e), blockType: w, lines: [] }), v = (r) => {
  if (r.blockType === w) {
    const e = r.locale ? {
      locale: r.locale,
      lines: [...r.lines]
    } : { lines: [...r.lines] };
    return { ...r, bodies: r.bodies.concat([e]), lines: [], blockType: A, locale: void 0 };
  }
  return r.structName && r.blockType === B ? {
    ...r,
    structs: r.structs.concat([{ struct: r.structName, locale: r.locale, lines: [...r.lines] }]),
    blockType: A,
    structName: void 0,
    locale: void 0,
    lines: []
  } : {
    ...r,
    blockType: A,
    structName: void 0,
    locale: void 0,
    lines: []
  };
}, pr = (r) => r.currentOption ? { items: r.items.concat({ option: r.currentOption, value: r.currentOption }) } : r, G = "help", h = "kind", P = "text", C = "struct", J = (r, e = I) => {
  if (h in r.attr) {
    const a = Ar[r.attr.kind];
    if (a) return a(r);
    if (r.attr.kind === "struct") return fr(r, e);
    if (r.attr.kind === "struct[]") return Er(r, e);
  }
  return f("any", "", r.attr, y);
}, s = (r) => r, V = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), y = {
  default: s,
  text: s,
  desc: s,
  parent: s
}, T = (r) => f("string", "", r.attr, y), U = (r) => {
  try {
    const e = JSON.parse(r);
    if (Array.isArray(e) && e.every((a) => typeof a == "string")) return e;
  } catch {
  }
  return [];
}, x = (r) => {
  const e = {
    default: (a) => U(a),
    text: s,
    desc: s,
    parent: s
  };
  return g("string[]", r.attr, e);
}, l = (r, e) => {
  const a = { default: V, text: s, desc: s, parent: s };
  return g(e, r.attr, a);
}, d = (r, e) => {
  const a = {
    default: (t) => parseInt(t, 10),
    text: s,
    desc: s,
    parent: s
  };
  return f(e, 0, r.attr, a);
}, fr = (r, e) => {
  const a = ((n, o) => {
    if (!n) return {};
    const c = o(n);
    return Array.isArray(c) ? {} : typeof c == "object" && c !== null ? c : {};
  })(r.attr.default, e), t = { text: s, desc: s, parent: s };
  return { struct: r.attr.struct || "", ...f("struct", a, r.attr, t) };
}, Er = (r, e) => {
  const a = ((n, o) => {
    if (!n) return [];
    const c = o(n);
    return Array.isArray(c) && c.every((m) => typeof m == "object" && m !== null) ? c : [];
  })(r.attr.default, e), t = { text: s, desc: s, parent: s };
  return { struct: r.attr.struct || "", ...f("struct[]", a, r.attr, t), default: a };
}, Ar = {
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
    const e = {
      default: V,
      text: s,
      desc: s,
      decimals: (a) => parseInt(a, 10),
      min: (a) => parseFloat(a),
      max: (a) => parseFloat(a),
      parent: s
    };
    return g("number[]", r.attr, e);
  },
  string: T,
  "string[]": x,
  multiline_string: T,
  "multiline_string[]": x,
  combo: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => t.option)) ?? [];
    return { ...f("combo", "", r.attr, y), options: e };
  },
  select: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => ({ option: t.option, value: t.value }))) ?? [];
    return {
      ...f("select", "", r.attr, y),
      options: e
    };
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
    const e = { default: (a) => a === "true", text: s, desc: s, on: s, off: s, parent: s };
    return f("boolean", !0, r.attr, e);
  },
  file: (r) => {
    const e = { default: s, text: s, desc: s, parent: s, dir: s };
    return { dir: "", ...f("file", "", r.attr, e) };
  },
  "file[]": (r) => {
    const e = { default: (a) => U(a), text: s, desc: s, parent: s, dir: s };
    return {
      dir: "",
      ...g("file[]", r.attr, e)
    };
  }
}, Sr = (r) => !Array.isArray(r) && typeof r == "object" && r !== null && !!(Or(r) && gr(r) && yr(r) && "parameters" in r) && br(r), Or = (r) => "name" in r && typeof r.name == "string", gr = (r) => "status" in r && typeof r.status == "boolean", yr = (r) => "description" in r && typeof r.description == "string", br = (r) => typeof r.parameters == "object" && r.parameters !== null && Object.values(r.parameters).every((e) => typeof e == "string"), Pr = /\s*\/\//, _r = /\s*[var|let|const]\s+[^\s]+\s*=/, hr = /^\s{0,3}[\[|\]\;]/, Nr = (r) => r.split(`
`).filter((e) => !((a) => Pr.test(a) || hr.test(a) || _r.test(a))(e)), Ir = (r) => {
  const e = `[${Nr(r).join("")}]`, a = JSON.parse(e);
  if (!Array.isArray(a)) throw new Error("Parsed value is not an array");
  if (a.every(Sr)) return a;
  throw new Error("Parsed value is not PluginParamsObject array");
}, qr = (r, e) => {
  const a = vr(e);
  return r.map((t) => ({
    description: t.description,
    name: t.name,
    status: t.status,
    parameters: Lr(t, a)
  }));
}, Lr = (r, e) => {
  const a = e.get(r.name);
  if (!a) return r.parameters;
  const t = Object.entries(r.parameters).filter(([n]) => !a.has(n));
  return Object.fromEntries(t);
}, vr = (r) => new Map(r.map((e) => [e.pluginName, new Set(e.params)])), N = (r) => ({ ...typeof r.desc == "string" ? { desc: r.desc } : {}, ...typeof r.text == "string" ? { text: r.text } : {} }), S = (r) => {
  const e = Mr(r), a = Cr(e);
  return Fr(a);
}, Mr = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: {
      ...r.currentParam,
      options: pr(r.currentOption).items
    } };
  }
  return r;
}, Fr = (r) => r.currentParam ? { ...r, params: [...r.params, r.currentParam], currentParam: null, currentContext: null } : r, Cr = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = {
    ...N(r.currentCommand),
    command: r.currentCommand.command,
    args: e
  };
  return { ...r, commands: [...r.commands, a], currentCommand: null, currentParam: null, currentContext: null, currentOption: null };
}, z = (r, e = "en") => {
  const a = ((c) => {
    const m = c.split(`
`), p = {
      structs: [],
      bodies: [],
      structName: void 0,
      locale: void 0,
      lines: [],
      blockType: A
    }, i = m.reduce(($, K) => ir($, K), p);
    return { structs: i.structs, bodies: i.bodies };
  })(r), t = ((c, m) => {
    const p = mr(c, m);
    return c.filter((i) => i.locale === void 0 && p.has(i.struct) ? !p.has(`${i.struct}!`) : i.locale === m && p.has(`${i.struct}!`));
  })(a.structs, e).map((c) => Tr(c)), n = ((c, m) => c.reduce((p, i) => i.locale === m || i.locale === void 0 && p === void 0 ? i : p, void 0))(a.bodies, e);
  if (!n) return {
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    structs: t
  };
  const o = W(n);
  return { params: o.params, commands: o.commands, meta: o.meta, helpLines: o.helpLines, structs: t, dependencies: o.dependencies };
}, Tr = (r) => {
  const e = W(r);
  return { name: r.struct, params: e.params };
}, W = (r) => {
  const e = r.lines.reduce((a, t) => jr(a, t), xr());
  return S(e);
}, xr = () => ({
  helpLines: [],
  params: [],
  commands: [],
  currentParam: null,
  currentCommand: null,
  currentContext: null,
  currentOption: null,
  dependencies: { base: [], orderBefore: [], orderAfter: [] },
  meta: {}
}), jr = (r, e, a = Dr) => {
  const t = e.trimEnd().replace(/^[\*\s]*/, "");
  if (!t.startsWith("@")) return r.currentContext === G ? { ...r, helpLines: r.helpLines.concat(t) } : r;
  const n = t.match(/^@(\S+)\s*(.*)$/);
  if (!n) return r;
  const [, o, c] = n, m = a[o];
  return m ? m(r, c.trim()) : r;
}, u = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: { ...r.currentParam, attr: { ...r.currentParam.attr, [e]: a } } } : r, _ = (r, e, a) => ({
  ...r,
  meta: { [e]: a, ...r.meta }
}), Dr = {
  param: (r, e) => {
    const a = S(r);
    return a.params.some((t) => t.name === e) ? a : { ...a, currentContext: "param", currentParam: { name: e, attr: {} } };
  },
  text: (r, e) => r.currentParam ? u(r, P, e) : r.currentCommand && !(P in r.currentCommand) ? { ...r, currentCommand: {
    ...N(r.currentCommand),
    command: r.currentCommand.command,
    args: r.currentCommand.args,
    [P]: e
  } } : r,
  desc: (r, e) => r.currentParam ? u(r, "desc", e) : r.currentCommand ? { ...r, currentCommand: { ...r.currentCommand, desc: e } } : r,
  command: (r, e) => {
    const a = S(r);
    return a.commands.some((t) => t.command === e) ? a : { ...a, currentCommand: { command: e, args: [] }, currentParam: null };
  },
  arg: (r, e) => {
    if (!r.currentCommand) return r;
    if (!r.currentParam) return {
      ...r,
      currentParam: { name: e, attr: {} }
    };
    const a = { ...N(r.currentCommand), command: r.currentCommand.command, args: r.currentCommand.args.concat(r.currentParam) };
    return {
      ...r,
      commands: r.commands,
      currentCommand: a,
      currentContext: "arg",
      currentParam: { name: e, attr: {} }
    };
  },
  help: (r) => ({ ...S(r), currentContext: G }),
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
      const a = e.slice(7, -1), t = u(r, C, a);
      return u(t, h, C);
    }
    return r.currentParam ? u(r, h, e) : r;
  },
  parent: (r, e) => u(r, "parent", e),
  default: (r, e) => u(r, "default", e),
  on: (r, e) => u(r, "on", e),
  off: (r, e) => u(r, "off", e),
  min: (r, e) => u(r, "min", e),
  max: (r, e) => u(r, "max", e),
  decimals: (r, e) => u(r, "decimals", e),
  dir: (r, e) => u(r, "dir", e),
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
  author: (r, e) => _(r, "author", e),
  plugindesc: (r, e) => _(r, "plugindesc", e),
  url: (r, e) => _(r, "url", e)
}, Rr = (r) => ({
  target: "MZ",
  meta: r.meta,
  commands: kr(r.commands),
  params: M(r.params),
  structs: wr(r.structs)
}), M = (r) => Object.fromEntries(r.map((e) => [e.name, J(e)])), kr = (r) => Object.fromEntries(r.map((e) => [e.command, {
  desc: e.desc,
  text: e.text,
  args: M(e.args)
}])), wr = (r) => Object.fromEntries(r.map((e) => [e.name, { params: M(e.params) }])), Br = (r, e = (a) => I(a)) => ({
  params: F(r.params, (a) => e(a, "param")),
  commands: Gr(r.commands, (a) => e(a, "command")),
  structs: Jr(r.structs, (a) => e(a, "struct"))
}), F = (r, e) => r.map((a) => ({ name: a.name, attr: J(a, e) })), Gr = (r, e) => r.map((a) => ({
  command: a.command,
  desc: a.desc,
  text: a.text,
  args: F(a.args, e)
})), Jr = (r, e) => r.map((a) => ({ struct: a.name, params: F(a.params, e) })), Qr = (r) => ((e) => Rr(z(e)))(r), Xr = (r, e = (a) => I(a)) => {
  const a = z(r.source, r.locale);
  return { meta: a.meta, pluginName: r.pluginName, target: "MZ", schema: Br(a, e) };
}, re = (r) => Ir(r).map((e) => ({
  description: e.description,
  name: e.name,
  status: e.status,
  parameters: rr(e.parameters)
})), ee = "bgm", ae = "se", te = "me", se = "bgs", ne = "battlebacks1", ce = "battlebacks2", oe = "characters", me = "enemies", ie = "faces", ue = "parallaxes", le = "pictures", de = "sv_actors", pe = "sv_enemies", fe = "system", Ee = "tilesets", Ae = "titles1", Se = "titles2", Oe = "System.json", ge = "Actors.json", ye = "Classes.json", be = "Skills.json", Pe = "Items.json", _e = "Weapons.json", he = "Armors.json", Ne = "Enemies.json", Ie = "Troops.json", Le = "States.json", ve = "Animations.json", Me = "Tilesets.json", Fe = "CommonEvents.json", Ce = "MapInfos.json", Te = "data", xe = "img", je = "audio", De = "js";
export {
  ge as FILENAME_ACTORS,
  ve as FILENAME_ANIMATIONS,
  he as FILENAME_ARMORS,
  ye as FILENAME_CLASSES,
  Fe as FILENAME_COMMON_EVENTS,
  Ne as FILENAME_ENEMIES,
  Pe as FILENAME_ITEMS,
  Ce as FILENAME_MAP_INFOS,
  be as FILENAME_SKILLS,
  Le as FILENAME_STATES,
  Oe as FILENAME_SYSTEM,
  Me as FILENAME_TILESET,
  Ie as FILENAME_TROOPS,
  _e as FILENAME_WEAPONS,
  je as FOLDER_AUDIO,
  ee as FOLDER_AUDIO_BGM,
  se as FOLDER_AUDIO_BGS,
  te as FOLDER_AUDIO_ME,
  ae as FOLDER_AUDIO_SE,
  Te as FOLDER_DATA,
  xe as FOLDER_IMG,
  ne as FOLDER_IMG_BATTLEBACK1,
  ce as FOLDER_IMG_BATTLEBACK2,
  oe as FOLDER_IMG_CHACTERS,
  me as FOLDER_IMG_ENEMIES,
  ie as FOLDER_IMG_FACES,
  ue as FOLDER_IMG_PARALLACES,
  le as FOLDER_IMG_PICTURES,
  de as FOLDER_IMG_SV_ACTORS,
  pe as FOLDER_IMG_SV_ENEMIES,
  fe as FOLDER_IMG_SYSTEM,
  Ee as FOLDER_IMG_TILESETS,
  Ae as FOLDER_IMG_TITLES1,
  Se as FOLDER_IMG_TITLES2,
  De as FOLDER_JS,
  we as classifyFileParams,
  Be as classifyPluginParams,
  Ge as classifyTextParams,
  er as collectDependentStructNames,
  J as compileAttributes,
  Je as convertPluginCommandSchema,
  Nr as convertPluginsJSToJSON,
  Ve as convertStructSchema,
  Ue as createClassifiedStructMap,
  ze as createStructMap,
  Ur as filterPluginParamByText,
  $r as filterPluginSchemaByFileParam,
  zr as filterPluginSchemaByNumberParam,
  b as filterPluginSchemaByParam,
  Wr as filterPluginSchemaByVariableParam,
  We as hasNumberValueParam,
  $e as hasScalarAttr,
  j as hasStructAttr,
  Z as hasTextAttr,
  Ke as isArrayAttr,
  Ze as isArrayParam,
  Ye as isArrayParamEx,
  q as isFileAttr,
  He as isNumberArrayParam,
  Y as isNumberAttr,
  qe as isNumberValueParam,
  Qe as isNumberValueParamEx,
  Kr as isRmmzDataKind,
  Xe as isScalarParam,
  ra as isStringArrayParam,
  ea as isStringValueParam,
  aa as isStructArrayAttr,
  X as isStructArrayParam,
  ta as isStructAttr,
  Q as isStructParam,
  H as isVariableAttr,
  cr as lookupKind,
  qr as omitPluginParam,
  sa as paramHasText,
  I as parseDeepJSON,
  rr as parseDeepRecord,
  re as parsePluginParamObject,
  Ir as parsePluginParamRecord,
  Xr as pluginSourceToArraySchema,
  Qr as pluginSourceToJSON,
  tr as rebuildCommands,
  Hr as stringifyDeepJSON,
  Yr as stringifyDeepRecord,
  Zr as structDependencies,
  na as toArrayPluginParam,
  ca as toObjectPluginParams,
  oa as toObjectPluginParamsOld,
  Sr as validatePluginJS
};
