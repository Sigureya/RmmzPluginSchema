import { o as R, v as Z, B as Y, D as H, E as Q, n as X, r as q, R as h, F as rr, S as k, T, U as er, V as ar, W as P, X as tr, O as sr, P as nr, Q as cr, Y as or, Z as mr, _ as ir, $ as ur, a0 as lr, a1 as pr, a2 as dr, a3 as fr, G as Er } from "../shared/constants.es.js";
import { a as qe, c as ra, b as ea, g as aa, f as ta, h as sa, i as na, z as ca, q as oa, k as ma, j as ia, l as ua, A as la, x as pa, y as da, m as fa, C as Ea, w as Aa, s as Oa, p as Sa, u as ga, e as ba, d as ya, t as Pa } from "../shared/constants.es.js";
const Ar = (r, e) => {
  const a = function(t) {
    return Object.fromEntries(t.map((n) => [n.struct, n.params.filter(R)]));
  }(r);
  return function(t, n, c) {
    return t.reduce((o) => {
      if (!o.changed) return o;
      const u = t.filter((d) => !o.names.has(d) && n[d].some((m) => o.names.has(m.attr.struct)));
      return u.length === 0 ? { names: o.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...o.names, ...u]), changed: !0 };
    }, {
      names: c,
      changed: !0
    }).names;
  }(Object.keys(a), a, new Set(e));
}, te = (r) => y(r, Z), se = (r) => y(r, Y), ne = (r) => y(r, H), ce = (r) => y(r, Q), y = (r, e) => {
  const a = r.structs.filter((c) => c.params.some((o) => e(o))), t = new Set(a.map((c) => c.struct)), n = Ar(r.structs, t);
  return {
    structs: Or(r.structs, n, e),
    commands: Sr(r.commands, n, e),
    params: N(r.params, n, e)
  };
}, N = (r, e, a) => r.filter((t) => R(t) ? e.has(t.attr.struct) : a(t)), Or = (r, e, a) => r.map((t) => ({
  struct: t.struct,
  params: N(t.params, e, a)
})).filter((t) => t.params.length > 0), Sr = (r, e, a) => r.map((t) => ({
  ...t.desc ? { desc: t.desc } : {},
  ...t.text ? { text: t.text } : {},
  command: t.command,
  args: N(t.args, e, a)
})).filter((t) => t.args.length > 0), gr = {
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
}, br = ["data", "system", "system"], yr = (r) => {
  const e = gr[r];
  return e === void 0 ? { author: "rmmz", module: "unknown", kind: r } : { author: "rmmz", module: br[e], kind: [r, "variable", "switch"][e] };
}, oe = (r) => {
  const e = yr(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, w = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((n) => ((c, o) => !(!X(c) && !q(c) || !c.struct || o.has(c.struct)))(n, a)).flatMap((n) => {
    const c = n.struct;
    return a.add(c), [c, ...w(c, e, a)];
  }) : [];
}, me = (r, e) => w(r, e, /* @__PURE__ */ new Set()), ie = (r) => B(r), ue = (r) => JSON.stringify(B(r)), E = (r) => typeof r == "object" && r !== null && !Array.isArray(r), B = (r) => Array.isArray(r) ? Pr(r) : E(r) ? S(r) : {}, S = (r) => E(r) ? Object.fromEntries(Object.entries(r).map(([e, a]) => {
  if (Array.isArray(a)) {
    const t = a.map((n) => E(n) ? JSON.stringify(S(n)) : String(n));
    return [e, JSON.stringify(t)];
  }
  return E(a) ? [e, JSON.stringify(S(a))] : [e, String(a)];
})) : {}, Pr = (r) => r.map((e) => typeof e == "object" && e !== null ? JSON.stringify(S(e)) : String(e)), G = (r, e) => {
  const a = Object.entries(e).filter(([t]) => t in r).map(([t, n]) => [t, n(r[t])]);
  return Object.fromEntries(a);
}, f = (r, e, a, t) => ({ default: e, ...G(a, t), kind: r }), g = (r, e, a) => ({ default: [], ...G(e, a), kind: r }), _r = (r, e) => {
  const a = r.map((t) => t.locale === void 0 ? t.struct : t.locale === e ? `${t.struct}!` : "");
  return new Set(a);
}, J = "BODY", V = "STRUCT", A = "NONE", hr = (r, e) => {
  const a = e.trim(), t = a.match(/^\/\*~struct~([A-Za-z0-9_]*)(?::([A-Za-z0-9_-]+))?/);
  return t ? vr(r, t) : /^\/\*:/.test(a) ? Ir(r, a) : a === "*/" ? r.lines.length > 0 ? I(r) : r : {
    ...r,
    lines: r.lines.concat([a])
  };
}, vr = (r, e) => {
  const a = r.lines.length > 0 ? I(r) : r, t = e[1] || void 0;
  return { ...a, structName: t, blockType: t ? V : "INVALID", locale: e[2], lines: [] };
}, Nr = (r) => {
  if (r) {
    const e = r.match(/^\/\*:(\w+)/);
    if (e) return e[1];
  }
}, Ir = (r, e) => ({ ...r.lines.length > 0 ? I(r) : r, locale: Nr(e), blockType: J, lines: [] }), I = (r) => {
  if (r.blockType === J) {
    const e = r.locale ? {
      locale: r.locale,
      lines: [...r.lines]
    } : { lines: [...r.lines] };
    return { ...r, bodies: r.bodies.concat([e]), lines: [], blockType: A, locale: void 0 };
  }
  return r.structName && r.blockType === V ? {
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
}, Lr = (r) => r.currentOption ? { items: r.items.concat({ option: r.currentOption, value: r.currentOption }) } : r, L = (r, e) => {
  if (h in r.attr) {
    const a = Mr[r.attr.kind];
    if (a) return a(r, e);
  }
  return { name: r.name, attr: f("any", "", r.attr, b) };
}, le = (r, e) => {
  const { attr: a } = L(r, e);
  return a;
}, s = (r) => r, U = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), b = {
  default: s,
  text: s,
  desc: s,
  parent: s
}, x = (r, e) => ({ name: r.name, attr: f(e, "", r.attr, b) }), j = (r, e, a) => {
  const t = { default: (n) => e.parseStringArray(n).value, text: s, desc: s, parent: s };
  return { name: r.name, attr: g(a, r.attr, t) };
}, l = (r, e) => {
  const a = { default: (t) => U(t), text: s, desc: s, parent: s };
  return { name: r.name, attr: g(e, r.attr, a) };
}, p = (r, e) => {
  const a = { default: (t) => parseInt(t, 10), text: s, desc: s, parent: s };
  return { name: r.name, attr: f(e, 0, r.attr, a) };
}, D = (r) => r.length > 0 ? { errors: r } : {}, Mr = {
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
      attr: { dir: "", ...g("file[]", r.attr, a) }
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
    return { name: r.name, attr: g("number[]", r.attr, e) };
  },
  string: (r) => x(r, "string"),
  "string[]": (r, e) => j(r, e, "string[]"),
  multiline_string: (r) => x(r, "multiline_string"),
  "multiline_string[]": (r, e) => j(r, e, "multiline_string[]")
}, Cr = (r) => !Array.isArray(r) && typeof r == "object" && r !== null && !!(Fr(r) && Tr(r) && xr(r) && "parameters" in r) && jr(r), Fr = (r) => "name" in r && typeof r.name == "string", Tr = (r) => "status" in r && typeof r.status == "boolean", xr = (r) => "description" in r && typeof r.description == "string", jr = (r) => typeof r.parameters == "object" && r.parameters !== null && Object.values(r.parameters).every((e) => typeof e == "string"), Dr = /\s*\/\//, Rr = /\s*[var|let|const]\s+[^\s]+\s*=/, kr = /^\s{0,3}[\[|\]\;]/, wr = (r) => r.split(`
`).filter((e) => !((a) => Dr.test(a) || kr.test(a) || Rr.test(a))(e)), Br = (r) => {
  const e = `[${wr(r).join("")}]`, a = JSON.parse(e);
  if (!Array.isArray(a)) throw new Error("Parsed value is not an array");
  if (a.every(Cr)) return a;
  throw new Error("Parsed value is not PluginParamsObject array");
}, pe = (r, e) => {
  const a = Jr(e);
  return r.map((t) => ({
    description: t.description,
    name: t.name,
    status: t.status,
    parameters: Gr(t, a)
  }));
}, Gr = (r, e) => {
  const a = e.get(r.name);
  if (!a) return r.parameters;
  const t = Object.entries(r.parameters).filter(([n]) => !a.has(n));
  return Object.fromEntries(t);
}, Jr = (r) => new Map(r.map((e) => [e.pluginName, new Set(e.params)])), M = () => ({ parseStringArray: (r) => ({ value: Vr(r), errors: [] }), parseObjectArray: () => ({ value: [], errors: [] }), parseObject: (r) => ({
  value: rr(r),
  errors: []
}) }), Vr = (r) => {
  try {
    const e = JSON.parse(r);
    if (Array.isArray(e) && e.every((a) => typeof a == "string")) return e;
  } catch {
  }
  return [];
}, v = (r) => ({ ...typeof r.desc == "string" ? {
  desc: r.desc
} : {}, ...typeof r.text == "string" ? { text: r.text } : {} }), O = (r) => {
  const e = Ur(r), a = $r(e);
  return Wr(a);
}, Ur = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: { ...r.currentParam, options: Lr(r.currentOption).items } };
  }
  return r;
}, Wr = (r) => r.currentParam ? {
  ...r,
  params: [...r.params, r.currentParam],
  currentCommand: null,
  currentOption: null,
  currentParam: null,
  currentContext: null
} : r, $r = (r) => {
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
}, W = (r, e = "en") => {
  const a = ((o) => {
    const u = o.split(`
`), d = {
      structs: [],
      bodies: [],
      structName: void 0,
      locale: void 0,
      lines: [],
      blockType: A
    }, m = u.reduce((z, K) => hr(z, K), d);
    return { structs: m.structs, bodies: m.bodies };
  })(r), t = ((o, u) => {
    const d = _r(o, u);
    return o.filter((m) => m.locale === void 0 && d.has(m.struct) ? !d.has(`${m.struct}!`) : m.locale === u && d.has(`${m.struct}!`));
  })(a.structs, e).map((o) => zr(o)), n = ((o, u) => o.reduce((d, m) => m.locale === u || m.locale === void 0 && d === void 0 ? m : d, void 0))(a.bodies, e);
  if (!n) return {
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    dependencies: { base: [], orderBefore: [], orderAfter: [] },
    structs: t
  };
  const c = $(n);
  return {
    params: c.params,
    commands: c.commands,
    meta: c.meta,
    helpLines: c.helpLines,
    structs: t,
    dependencies: c.dependencies
  };
}, zr = (r) => {
  const e = $(r);
  return { name: r.struct, params: e.params };
}, $ = (r) => {
  const e = r.lines.reduce((a, t) => Zr(a, t), Kr());
  return O(e);
}, Kr = () => ({
  helpLines: [],
  params: [],
  commands: [],
  currentParam: null,
  currentCommand: null,
  currentContext: null,
  currentOption: null,
  dependencies: { base: [], orderBefore: [], orderAfter: [] },
  meta: {}
}), Zr = (r, e, a = Yr) => {
  const t = e.trimEnd().replace(/^[\*\s]*/, "");
  if (!t.startsWith("@")) return r.currentContext === k ? { ...r, helpLines: r.helpLines.concat(t) } : r;
  const n = t.match(/^@(\S+)\s*(.*)$/);
  if (!n) return r;
  const [, c, o] = n, u = a[c];
  return u ? u(r, o.trim()) : r;
}, i = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: { ...r.currentParam, attr: {
  ...r.currentParam.attr,
  [e]: a
} } } : r, _ = (r, e, a) => ({ ...r, meta: { [e]: a, ...r.meta } }), Yr = {
  param: (r, e) => {
    const a = O(r);
    return a.params.some((t) => t.name === e) ? a : {
      ...a,
      currentContext: tr,
      currentParam: { name: e, attr: {} }
    };
  },
  text: (r, e) => r.currentParam ? i(r, P, e) : r.currentCommand && !(P in r.currentCommand) ? { ...r, currentCommand: {
    ...v(r.currentCommand),
    command: r.currentCommand.command,
    args: r.currentCommand.args,
    [P]: e
  } } : r,
  desc: (r, e) => r.currentParam ? i(r, ar, e) : r.currentCommand ? { ...r, currentCommand: { ...r.currentCommand, desc: e } } : r,
  command: (r, e) => {
    const a = O(r);
    return a.commands.some((t) => t.command === e) ? a : { ...a, currentCommand: { command: e, args: [] }, currentParam: null };
  },
  arg: (r, e) => {
    if (!r.currentCommand) return r;
    if (!r.currentParam) return { ...r, currentParam: { name: e, attr: {} } };
    const a = { ...v(r.currentCommand), command: r.currentCommand.command, args: r.currentCommand.args.concat(r.currentParam) };
    return { ...r, commands: r.commands, currentCommand: a, currentContext: er, currentParam: { name: e, attr: {} } };
  },
  help: (r) => ({ ...O(r), currentContext: k }),
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
  parent: (r, e) => i(r, fr, e),
  default: (r, e) => i(r, dr, e),
  on: (r, e) => i(r, pr, e),
  off: (r, e) => i(r, lr, e),
  min: (r, e) => i(r, ur, e),
  max: (r, e) => i(r, ir, e),
  decimals: (r, e) => i(r, mr, e),
  dir: (r, e) => i(r, or, e),
  base: (r, e) => {
    return { ...r, dependencies: (a = r.dependencies, t = e, {
      orderAfter: a.orderAfter,
      orderBefore: a.orderBefore,
      base: a.base.concat(t)
    }) };
    var a, t;
  },
  orderAfter: (r, e) => {
    return { ...r, dependencies: (a = r.dependencies, t = e, { base: a.base, orderBefore: a.orderBefore, orderAfter: a.orderAfter.concat(t) }) };
    var a, t;
  },
  orderBefore: (r, e) => {
    return { ...r, dependencies: (a = r.dependencies, t = e, { base: a.base, orderAfter: a.orderAfter, orderBefore: a.orderBefore.concat(t) }) };
    var a, t;
  },
  author: (r, e) => _(r, cr, e),
  plugindesc: (r, e) => _(r, nr, e),
  url: (r, e) => _(r, sr, e)
}, Hr = (r) => {
  const e = M();
  return {
    target: "MZ",
    meta: r.meta,
    commands: Qr(r.commands, e),
    params: C(r.params, e),
    structs: Xr(r.structs, e)
  };
}, C = (r, e) => Object.fromEntries(r.map((a) => {
  const t = L(a, e);
  return [a.name, t.attr];
})), Qr = (r, e) => Object.fromEntries(r.map((a) => [a.command, {
  desc: a.desc,
  text: a.text,
  args: C(a.args, e)
}])), Xr = (r, e) => Object.fromEntries(r.map((a) => [a.name, { params: C(a.params, e) }])), qr = (r, e = M()) => ({
  params: F(r.params, e),
  commands: re(r.commands, e),
  structs: ee(r.structs, e)
}), F = (r, e) => r.map((a) => L(a, e)), re = (r, e) => r.map((a) => ({ command: a.command, desc: a.desc, text: a.text, args: F(a.args, e) })), ee = (r, e) => r.map((a) => ({
  struct: a.name,
  params: F(a.params, e)
})), de = (r) => ((e) => Hr(W(e)))(r), fe = (r, e = M()) => {
  const a = W(r.source, r.locale);
  return {
    locale: r.locale,
    meta: a.meta,
    pluginName: r.pluginName,
    target: "MZ",
    dependencies: a.dependencies,
    schema: qr(a, e)
  };
}, Ee = (r) => Br(r).map((e) => ({
  description: e.description,
  name: e.name,
  status: e.status,
  parameters: Er(e.parameters)
})), Ae = "bgm", Oe = "se", Se = "me", ge = "bgs", be = "battlebacks1", ye = "battlebacks2", Pe = "characters", _e = "enemies", he = "faces", ve = "parallaxes", Ne = "pictures", Ie = "sv_actors", Le = "sv_enemies", Me = "system", Ce = "tilesets", Fe = "titles1", Te = "titles2", xe = "System.json", je = "Actors.json", De = "Classes.json", Re = "Skills.json", ke = "Items.json", we = "Weapons.json", Be = "Armors.json", Ge = "Enemies.json", Je = "Troops.json", Ve = "States.json", Ue = "Animations.json", We = "Tilesets.json", $e = "CommonEvents.json", ze = "MapInfos.json", Ke = "data", Ze = "img", Ye = "audio", He = "js";
export {
  je as FILENAME_ACTORS,
  Ue as FILENAME_ANIMATIONS,
  Be as FILENAME_ARMORS,
  De as FILENAME_CLASSES,
  $e as FILENAME_COMMON_EVENTS,
  Ge as FILENAME_ENEMIES,
  ke as FILENAME_ITEMS,
  ze as FILENAME_MAP_INFOS,
  Re as FILENAME_SKILLS,
  Ve as FILENAME_STATES,
  xe as FILENAME_SYSTEM,
  We as FILENAME_TILESET,
  Je as FILENAME_TROOPS,
  we as FILENAME_WEAPONS,
  Ye as FOLDER_AUDIO,
  Ae as FOLDER_AUDIO_BGM,
  ge as FOLDER_AUDIO_BGS,
  Se as FOLDER_AUDIO_ME,
  Oe as FOLDER_AUDIO_SE,
  Ke as FOLDER_DATA,
  Ze as FOLDER_IMG,
  be as FOLDER_IMG_BATTLEBACK1,
  ye as FOLDER_IMG_BATTLEBACK2,
  Pe as FOLDER_IMG_CHACTERS,
  _e as FOLDER_IMG_ENEMIES,
  he as FOLDER_IMG_FACES,
  ve as FOLDER_IMG_PARALLACES,
  Ne as FOLDER_IMG_PICTURES,
  Ie as FOLDER_IMG_SV_ACTORS,
  Le as FOLDER_IMG_SV_ENEMIES,
  Me as FOLDER_IMG_SYSTEM,
  Ce as FOLDER_IMG_TILESETS,
  Fe as FOLDER_IMG_TITLES1,
  Te as FOLDER_IMG_TITLES2,
  He as FOLDER_JS,
  qe as classifyFileParams,
  ra as classifyPluginParams,
  ea as classifyTextParams,
  Ar as collectDependentStructNames,
  le as compileAttributes,
  aa as convertPluginCommandSchema,
  wr as convertPluginsJSToJSON,
  ta as convertStructSchema,
  sa as createClassifiedStructMap,
  na as createStructMap,
  te as filterPluginParamByText,
  ce as filterPluginSchemaByFileParam,
  se as filterPluginSchemaByNumberParam,
  y as filterPluginSchemaByParam,
  ne as filterPluginSchemaByVariableParam,
  ca as hasNumberValueParam,
  oa as hasScalarAttr,
  R as hasStructAttr,
  Z as hasTextAttr,
  ma as isArrayAttr,
  ia as isArrayParam,
  ua as isArrayParamEx,
  Q as isFileAttr,
  la as isNumberArrayParam,
  Y as isNumberAttr,
  pa as isNumberValueParam,
  da as isNumberValueParamEx,
  oe as isRmmzDataKind,
  fa as isScalarParam,
  Ea as isStringArrayParam,
  Aa as isStringValueParam,
  Oa as isStructArrayAttr,
  q as isStructArrayParam,
  Sa as isStructAttr,
  X as isStructParam,
  H as isVariableAttr,
  yr as lookupKind,
  pe as omitPluginParam,
  ga as paramHasText,
  rr as parseDeepJSON,
  Er as parseDeepRecord,
  Ee as parsePluginParamObject,
  Br as parsePluginParamRecord,
  fe as pluginSourceToArraySchema,
  de as pluginSourceToJSON,
  Sr as rebuildCommands,
  ue as stringifyDeepJSON,
  ie as stringifyDeepRecord,
  me as structDependencies,
  ba as toArrayPluginParam,
  ya as toObjectPluginParams,
  Pa as toObjectPluginParamsOld,
  Cr as validatePluginJS
};
