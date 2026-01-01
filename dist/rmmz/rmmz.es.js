import { o as R, v as Z, B as H, D as Y, E as q, n as Q, r as X, F as rr, G as er } from "../shared/parseDeepJSON.es.js";
import { a as Be, c as Ge, b as Je, g as Ve, f as Ue, h as ze, i as We, z as $e, q as Ke, k as Ze, j as He, l as Ye, A as qe, x as Qe, y as Xe, m as ra, C as ea, w as aa, s as ta, p as sa, u as na, e as ca, d as ma, t as oa } from "../shared/parseDeepJSON.es.js";
const ar = (r, e) => {
  const a = function(t) {
    return Object.fromEntries(t.map((n) => [n.struct, n.params.filter(R)]));
  }(r);
  return function(t, n, c) {
    return t.reduce((m) => {
      if (!m.changed) return m;
      const u = t.filter((d) => !m.names.has(d) && n[d].some((o) => m.names.has(o.attr.struct)));
      return u.length === 0 ? { names: m.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...m.names, ...u]), changed: !0 };
    }, {
      names: c,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, Ur = (r) => y(r, Z), zr = (r) => y(r, H), Wr = (r) => y(r, Y), $r = (r) => y(r, q), y = (r, e) => {
  const a = r.structs.filter((c) => c.params.some((m) => e(m))), t = new Set(a.map((c) => c.struct)), n = ar(r.structs, t);
  return {
    structs: tr(r.structs, n, e),
    commands: sr(r.commands, n, e),
    params: N(r.params, n, e)
  };
}, N = (r, e, a) => r.filter((t) => R(t) ? e.has(t.attr.struct) : a(t)), tr = (r, e, a) => r.map((t) => ({
  struct: t.struct,
  params: N(t.params, e, a)
})).filter((t) => t.params.length > 0), sr = (r, e, a) => r.map((t) => ({
  ...t.desc ? { desc: t.desc } : {},
  ...t.text ? { text: t.text } : {},
  command: t.command,
  args: N(t.args, e, a)
})).filter((t) => t.args.length > 0), nr = { variable: 1, switch: 2, actor: 0, item: 0, weapon: 0, armor: 0, skill: 0, class: 0, state: 0, troop: 0, enemy: 0, common_event: 0 }, cr = ["data", "system", "system"], mr = (r) => {
  const e = nr[r];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: r } : { author: "rmmz", module: cr[e], kind: [r, "variable", "switch"][e] };
}, Kr = (r) => {
  const e = mr(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, k = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((n) => ((c, m) => !(!Q(c) && !X(c) || !c.struct || m.has(c.struct)))(n, a)).flatMap((n) => {
    const c = n.struct;
    return a.add(c), [c, ...k(c, e, a)];
  }) : [];
}, Zr = (r, e) => k(r, e, /* @__PURE__ */ new Set()), Hr = (r) => w(r), Yr = (r) => JSON.stringify(w(r)), E = (r) => typeof r == "object" && r !== null && !Array.isArray(r), w = (r) => Array.isArray(r) ? or(r) : E(r) ? g(r) : {}, g = (r) => E(r) ? Object.fromEntries(Object.entries(r).map(([e, a]) => {
  if (Array.isArray(a)) {
    const t = a.map((n) => E(n) ? JSON.stringify(g(n)) : String(n));
    return [e, JSON.stringify(t)];
  }
  return E(a) ? [e, JSON.stringify(g(a))] : [e, String(a)];
})) : {}, or = (r) => r.map((e) => typeof e == "object" && e !== null ? JSON.stringify(g(e)) : String(e)), B = (r, e) => {
  const a = Object.entries(e).filter(([t]) => t in r).map(([t, n]) => [t, n(r[t])]);
  return Object.fromEntries(a);
}, f = (r, e, a, t) => ({ default: e, ...B(a, t), kind: r }), S = (r, e, a) => ({ default: [], ...B(e, a), kind: r }), ir = (r, e) => {
  const a = r.map((t) => t.locale === void 0 ? t.struct : t.locale === e ? `${t.struct}!` : "");
  return new Set(a);
}, G = "BODY", J = "STRUCT", A = "NONE", ur = (r, e) => {
  const a = e.trim(), t = a.match(/^\/\*~struct~([A-Za-z0-9_]*)(?::([A-Za-z0-9_-]+))?/);
  return t ? lr(r, t) : /^\/\*:/.test(a) ? dr(r, a) : a === "*/" ? r.lines.length > 0 ? I(r) : r : {
    ...r,
    lines: r.lines.concat([a])
  };
}, lr = (r, e) => {
  const a = r.lines.length > 0 ? I(r) : r, t = e[1] || void 0;
  return { ...a, structName: t, blockType: t ? J : "INVALID", locale: e[2], lines: [] };
}, pr = (r) => {
  if (r) {
    const e = r.match(/^\/\*:(\w+)/);
    if (e) return e[1];
  }
}, dr = (r, e) => ({ ...r.lines.length > 0 ? I(r) : r, locale: pr(e), blockType: G, lines: [] }), I = (r) => {
  if (r.blockType === G) {
    const e = r.locale ? {
      locale: r.locale,
      lines: [...r.lines]
    } : { lines: [...r.lines] };
    return { ...r, bodies: r.bodies.concat([e]), lines: [], blockType: A, locale: void 0 };
  }
  return r.structName && r.blockType === J ? {
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
}, fr = (r) => r.currentOption ? { items: r.items.concat({ option: r.currentOption, value: r.currentOption }) } : r, V = "help", h = "kind", P = "text", T = "struct", L = (r, e) => {
  if (h in r.attr) {
    const a = Er[r.attr.kind];
    if (a) return a(r, e);
  }
  return { name: r.name, attr: f("any", "", r.attr, b) };
}, qr = (r, e) => {
  const { attr: a } = L(r, e);
  return a;
}, s = (r) => r, U = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), b = {
  default: s,
  text: s,
  desc: s,
  parent: s
}, x = (r, e) => ({ name: r.name, attr: f(e, "", r.attr, b) }), j = (r, e, a) => {
  const t = { default: (n) => e.parseStringArray(n).value, text: s, desc: s, parent: s };
  return { name: r.name, attr: S(a, r.attr, t) };
}, l = (r, e) => {
  const a = { default: (t) => U(t), text: s, desc: s, parent: s };
  return { name: r.name, attr: S(e, r.attr, a) };
}, p = (r, e) => {
  const a = { default: (t) => parseInt(t, 10), text: s, desc: s, parent: s };
  return { name: r.name, attr: f(e, 0, r.attr, a) };
}, D = (r) => r.length > 0 ? { errors: r } : {}, Er = {
  actor: (r) => p(r, "actor"),
  "actor[]": (r) => l(r, "actor[]"),
  class: (r) => p(r, "class"),
  "class[]": (r) => l(r, "class[]"),
  skill: (r) => p(r, "skill"),
  "skill[]": (r) => l(r, "skill[]"),
  item: (r) => p(r, "item"),
  "item[]": (r) => l(r, "item[]"),
  weapon: (r) => p(r, "weapon"),
  "weapon[]": (r) => l(r, "weapon[]"),
  armor: (r) => p(r, "armor"),
  "armor[]": (r) => l(r, "armor[]"),
  state: (r) => p(r, "state"),
  "state[]": (r) => l(r, "state[]"),
  enemy: (r) => p(r, "enemy"),
  "enemy[]": (r) => l(r, "enemy[]"),
  common_event: (r) => p(r, "common_event"),
  "common_event[]": (r) => l(r, "common_event[]"),
  switch: (r) => p(r, "switch"),
  "switch[]": (r) => l(r, "switch[]"),
  variable: (r) => p(r, "variable"),
  "variable[]": (r) => l(r, "variable[]"),
  troop: (r) => p(r, "troop"),
  "troop[]": (r) => l(r, "troop[]"),
  file: (r) => {
    const e = { default: s, text: s, desc: s, parent: s, dir: s };
    return { name: r.name, attr: { dir: "", ...f("file", "", r.attr, e) } };
  },
  "file[]": (r, e) => {
    const a = { default: (t) => e.parseStringArray(t).value, text: s, desc: s, parent: s, dir: s };
    return {
      name: r.name,
      attr: { dir: "", ...S("file[]", r.attr, a) }
    };
  },
  combo: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => t.option)) ?? [];
    return { name: r.name, attr: { ...f("combo", "", r.attr, b), options: e } };
  },
  select: (r) => {
    var a;
    const e = ((a = r.options) == null ? void 0 : a.map((t) => ({ option: t.option, value: t.value }))) ?? [];
    return { name: r.name, attr: { ...f("select", "", r.attr, b), options: e } };
  },
  struct: (r, e) => {
    const { errors: a, value: t } = e.parseObject(r.attr.default || "{}"), n = { text: s, desc: s, parent: s }, c = a.length === 0 ? t : {};
    return { name: r.name, attr: {
      struct: r.attr.struct || "",
      ...f("struct", c, r.attr, n),
      ...D(a)
    } };
  },
  "struct[]": (r, e) => {
    const { errors: a, value: t } = e.parseObjectArray(r.attr.default || "[]"), n = { text: s, desc: s, parent: s }, c = a.length === 0 ? t : [];
    return {
      name: r.name,
      attr: { struct: r.attr.struct || "", ...f("struct[]", c, r.attr, n), ...D(a) }
    };
  },
  boolean: (r) => {
    const e = { default: (a) => a === "true", text: s, desc: s, on: s, off: s, parent: s };
    return {
      name: r.name,
      attr: f("boolean", !0, r.attr, e)
    };
  },
  number: (r) => {
    const e = {
      default: (a) => parseFloat(a),
      text: s,
      desc: s,
      decimals: (a) => parseInt(a, 10),
      min: (a) => parseFloat(a),
      max: (a) => parseFloat(a),
      parent: s
    };
    return { name: r.name, attr: f("number", 0, r.attr, e) };
  },
  "number[]": (r) => {
    const e = {
      default: (a) => U(a),
      text: s,
      desc: s,
      decimals: (a) => parseInt(a, 10),
      min: (a) => parseFloat(a),
      max: (a) => parseFloat(a),
      parent: s
    };
    return { name: r.name, attr: S("number[]", r.attr, e) };
  },
  string: (r) => x(r, "string"),
  "string[]": (r, e) => j(r, e, "string[]"),
  multiline_string: (r) => x(r, "multiline_string"),
  "multiline_string[]": (r, e) => j(r, e, "multiline_string[]")
}, Ar = (r) => !Array.isArray(r) && typeof r == "object" && r !== null && !!(Or(r) && gr(r) && Sr(r) && "parameters" in r) && br(r), Or = (r) => "name" in r && typeof r.name == "string", gr = (r) => "status" in r && typeof r.status == "boolean", Sr = (r) => "description" in r && typeof r.description == "string", br = (r) => typeof r.parameters == "object" && r.parameters !== null && Object.values(r.parameters).every((e) => typeof e == "string"), yr = /\s*\/\//, Pr = /\s*[var|let|const]\s+[^\s]+\s*=/, _r = /^\s{0,3}[\[|\]\;]/, hr = (r) => r.split(`
`).filter((e) => !((a) => yr.test(a) || _r.test(a) || Pr.test(a))(e)), vr = (r) => {
  const e = `[${hr(r).join("")}]`, a = JSON.parse(e);
  if (!Array.isArray(a)) throw new Error("Parsed value is not an array");
  if (a.every(Ar)) return a;
  throw new Error("Parsed value is not PluginParamsObject array");
}, Qr = (r, e) => {
  const a = Ir(e);
  return r.map((t) => ({
    description: t.description,
    name: t.name,
    status: t.status,
    parameters: Nr(t, a)
  }));
}, Nr = (r, e) => {
  const a = e.get(r.name);
  if (!a) return r.parameters;
  const t = Object.entries(r.parameters).filter(([n]) => !a.has(n));
  return Object.fromEntries(t);
}, Ir = (r) => new Map(r.map((e) => [e.pluginName, new Set(e.params)])), M = () => ({ parseStringArray: (r) => ({ value: Lr(r), errors: [] }), parseObjectArray: () => ({ value: [], errors: [] }), parseObject: (r) => ({
  value: rr(r),
  errors: []
}) }), Lr = (r) => {
  try {
    const e = JSON.parse(r);
    if (Array.isArray(e) && e.every((a) => typeof a == "string")) return e;
  } catch {
  }
  return [];
}, v = (r) => ({ ...typeof r.desc == "string" ? {
  desc: r.desc
} : {}, ...typeof r.text == "string" ? { text: r.text } : {} }), O = (r) => {
  const e = Mr(r), a = Fr(e);
  return Cr(a);
}, Mr = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: { ...r.currentParam, options: fr(r.currentOption).items } };
  }
  return r;
}, Cr = (r) => r.currentParam ? {
  ...r,
  params: [...r.params, r.currentParam],
  currentCommand: null,
  currentOption: null,
  currentParam: null,
  currentContext: null
} : r, Fr = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = { ...v(r.currentCommand), command: r.currentCommand.command, args: e };
  return {
    ...r,
    commands: [...r.commands, a],
    currentCommand: null,
    currentParam: null,
    currentContext: null,
    currentOption: null
  };
}, z = (r, e = "en") => {
  const a = ((m) => {
    const u = m.split(`
`), d = {
      structs: [],
      bodies: [],
      structName: void 0,
      locale: void 0,
      lines: [],
      blockType: A
    }, o = u.reduce(($, K) => ur($, K), d);
    return { structs: o.structs, bodies: o.bodies };
  })(r), t = ((m, u) => {
    const d = ir(m, u);
    return m.filter((o) => o.locale === void 0 && d.has(o.struct) ? !d.has(`${o.struct}!`) : o.locale === u && d.has(`${o.struct}!`));
  })(a.structs, e).map((m) => Tr(m)), n = ((m, u) => m.reduce((d, o) => o.locale === u || o.locale === void 0 && d === void 0 ? o : d, void 0))(a.bodies, e);
  if (!n) return {
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    structs: t
  };
  const c = W(n);
  return { params: c.params, commands: c.commands, meta: c.meta, helpLines: c.helpLines, structs: t, dependencies: c.dependencies };
}, Tr = (r) => {
  const e = W(r);
  return { name: r.struct, params: e.params };
}, W = (r) => {
  const e = r.lines.reduce((a, t) => jr(a, t), xr());
  return O(e);
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
  if (!t.startsWith("@")) return r.currentContext === V ? { ...r, helpLines: r.helpLines.concat(t) } : r;
  const n = t.match(/^@(\S+)\s*(.*)$/);
  if (!n) return r;
  const [, c, m] = n, u = a[c];
  return u ? u(r, m.trim()) : r;
}, i = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: { ...r.currentParam, attr: { ...r.currentParam.attr, [e]: a } } } : r, _ = (r, e, a) => ({
  ...r,
  meta: { [e]: a, ...r.meta }
}), Dr = {
  param: (r, e) => {
    const a = O(r);
    return a.params.some((t) => t.name === e) ? a : { ...a, currentContext: "param", currentParam: { name: e, attr: {} } };
  },
  text: (r, e) => r.currentParam ? i(r, P, e) : r.currentCommand && !(P in r.currentCommand) ? { ...r, currentCommand: {
    ...v(r.currentCommand),
    command: r.currentCommand.command,
    args: r.currentCommand.args,
    [P]: e
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
    const a = { ...v(r.currentCommand), command: r.currentCommand.command, args: r.currentCommand.args.concat(r.currentParam) };
    return {
      ...r,
      commands: r.commands,
      currentCommand: a,
      currentContext: "arg",
      currentParam: { name: e, attr: {} }
    };
  },
  help: (r) => ({ ...O(r), currentContext: V }),
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
      const a = e.slice(7, -1), t = i(r, T, a);
      return i(t, h, T);
    }
    return r.currentParam ? i(r, h, e) : r;
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
  author: (r, e) => _(r, "author", e),
  plugindesc: (r, e) => _(r, "plugindesc", e),
  url: (r, e) => _(r, "url", e)
}, Rr = (r) => {
  const e = M();
  return {
    target: "MZ",
    meta: r.meta,
    commands: kr(r.commands, e),
    params: C(r.params, e),
    structs: wr(r.structs, e)
  };
}, C = (r, e) => Object.fromEntries(r.map((a) => {
  const t = L(a, e);
  return [a.name, t.attr];
})), kr = (r, e) => Object.fromEntries(r.map((a) => [a.command, { desc: a.desc, text: a.text, args: C(a.args, e) }])), wr = (r, e) => Object.fromEntries(r.map((a) => [a.name, {
  params: C(a.params, e)
}])), Br = (r, e = M()) => ({ params: F(r.params, e), commands: Gr(r.commands, e), structs: Jr(r.structs, e) }), F = (r, e) => r.map((a) => L(a, e)), Gr = (r, e) => r.map((a) => ({
  command: a.command,
  desc: a.desc,
  text: a.text,
  args: F(a.args, e)
})), Jr = (r, e) => r.map((a) => ({ struct: a.name, params: F(a.params, e) })), Xr = (r) => ((e) => Rr(z(e)))(r), re = (r, e = M()) => {
  const a = z(r.source, r.locale);
  return {
    meta: a.meta,
    pluginName: r.pluginName,
    target: "MZ",
    schema: Br(a, e)
  };
}, ee = (r) => vr(r).map((e) => ({
  description: e.description,
  name: e.name,
  status: e.status,
  parameters: er(e.parameters)
})), ae = "bgm", te = "se", se = "me", ne = "bgs", ce = "battlebacks1", me = "battlebacks2", oe = "characters", ie = "enemies", ue = "faces", le = "parallaxes", pe = "pictures", de = "sv_actors", fe = "sv_enemies", Ee = "system", Ae = "tilesets", Oe = "titles1", ge = "titles2", Se = "System.json", be = "Actors.json", ye = "Classes.json", Pe = "Skills.json", _e = "Items.json", he = "Weapons.json", ve = "Armors.json", Ne = "Enemies.json", Ie = "Troops.json", Le = "States.json", Me = "Animations.json", Ce = "Tilesets.json", Fe = "CommonEvents.json", Te = "MapInfos.json", xe = "data", je = "img", De = "audio", Re = "js";
export {
  be as FILENAME_ACTORS,
  Me as FILENAME_ANIMATIONS,
  ve as FILENAME_ARMORS,
  ye as FILENAME_CLASSES,
  Fe as FILENAME_COMMON_EVENTS,
  Ne as FILENAME_ENEMIES,
  _e as FILENAME_ITEMS,
  Te as FILENAME_MAP_INFOS,
  Pe as FILENAME_SKILLS,
  Le as FILENAME_STATES,
  Se as FILENAME_SYSTEM,
  Ce as FILENAME_TILESET,
  Ie as FILENAME_TROOPS,
  he as FILENAME_WEAPONS,
  De as FOLDER_AUDIO,
  ae as FOLDER_AUDIO_BGM,
  ne as FOLDER_AUDIO_BGS,
  se as FOLDER_AUDIO_ME,
  te as FOLDER_AUDIO_SE,
  xe as FOLDER_DATA,
  je as FOLDER_IMG,
  ce as FOLDER_IMG_BATTLEBACK1,
  me as FOLDER_IMG_BATTLEBACK2,
  oe as FOLDER_IMG_CHACTERS,
  ie as FOLDER_IMG_ENEMIES,
  ue as FOLDER_IMG_FACES,
  le as FOLDER_IMG_PARALLACES,
  pe as FOLDER_IMG_PICTURES,
  de as FOLDER_IMG_SV_ACTORS,
  fe as FOLDER_IMG_SV_ENEMIES,
  Ee as FOLDER_IMG_SYSTEM,
  Ae as FOLDER_IMG_TILESETS,
  Oe as FOLDER_IMG_TITLES1,
  ge as FOLDER_IMG_TITLES2,
  Re as FOLDER_JS,
  Be as classifyFileParams,
  Ge as classifyPluginParams,
  Je as classifyTextParams,
  ar as collectDependentStructNames,
  qr as compileAttributes,
  Ve as convertPluginCommandSchema,
  hr as convertPluginsJSToJSON,
  Ue as convertStructSchema,
  ze as createClassifiedStructMap,
  We as createStructMap,
  Ur as filterPluginParamByText,
  $r as filterPluginSchemaByFileParam,
  zr as filterPluginSchemaByNumberParam,
  y as filterPluginSchemaByParam,
  Wr as filterPluginSchemaByVariableParam,
  $e as hasNumberValueParam,
  Ke as hasScalarAttr,
  R as hasStructAttr,
  Z as hasTextAttr,
  Ze as isArrayAttr,
  He as isArrayParam,
  Ye as isArrayParamEx,
  q as isFileAttr,
  qe as isNumberArrayParam,
  H as isNumberAttr,
  Qe as isNumberValueParam,
  Xe as isNumberValueParamEx,
  Kr as isRmmzDataKind,
  ra as isScalarParam,
  ea as isStringArrayParam,
  aa as isStringValueParam,
  ta as isStructArrayAttr,
  X as isStructArrayParam,
  sa as isStructAttr,
  Q as isStructParam,
  Y as isVariableAttr,
  mr as lookupKind,
  Qr as omitPluginParam,
  na as paramHasText,
  rr as parseDeepJSON,
  er as parseDeepRecord,
  ee as parsePluginParamObject,
  vr as parsePluginParamRecord,
  re as pluginSourceToArraySchema,
  Xr as pluginSourceToJSON,
  sr as rebuildCommands,
  Yr as stringifyDeepJSON,
  Hr as stringifyDeepRecord,
  Zr as structDependencies,
  ca as toArrayPluginParam,
  ma as toObjectPluginParams,
  oa as toObjectPluginParamsOld,
  Ar as validatePluginJS
};
