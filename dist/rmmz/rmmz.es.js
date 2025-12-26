import { o as j, v as K, B as Z, D as Y, E as H, n as q, r as Q, F as b, G as X } from "../shared/parseDeepJSON.es.js";
import { a as ke, c as we, b as Be, g as Ge, f as Je, h as Ve, i as Ue, z as ze, q as We, k as $e, j as Ke, l as Ze, A as Ye, x as He, y as qe, m as Qe, C as Xe, w as ra, s as ea, p as aa, u as ta, e as sa, d as na, t as ca } from "../shared/parseDeepJSON.es.js";
const rr = (r, e) => {
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
}, Vr = (r) => P(r, K), Ur = (r) => P(r, Z), zr = (r) => P(r, Y), Wr = (r) => P(r, H), P = (r, e) => {
  const a = r.structs.filter((o) => o.params.some((c) => e(c))), t = new Set(a.map((o) => o.struct)), n = rr(r.structs, t);
  return {
    structs: er(r.structs, n, e),
    commands: ar(r.commands, n, e),
    params: L(r.params, n, e)
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
}, $r = (r) => {
  const e = nr(r.kind);
  return e.author === r.author && e.module === r.module && e.kind === r.kind;
}, D = (r, e, a) => {
  const t = e.get(r);
  return t ? t.filter((n) => ((o, c) => !(!q(o) && !Q(o) || !o.struct || c.has(o.struct)))(n, a)).flatMap((n) => {
    const o = n.struct;
    return a.add(o), [o, ...D(o, e, a)];
  }) : [];
}, Kr = (r, e) => D(r, e, /* @__PURE__ */ new Set()), Zr = (r) => R(r), Yr = (r) => JSON.stringify(R(r)), E = (r) => typeof r == "object" && r !== null && !Array.isArray(r), R = (r) => Array.isArray(r) ? cr(r) : E(r) ? O(r) : {}, O = (r) => E(r) ? Object.fromEntries(Object.entries(r).map(([e, a]) => {
  if (Array.isArray(a)) {
    const t = a.map((n) => E(n) ? JSON.stringify(O(n)) : String(n));
    return [e, JSON.stringify(t)];
  }
  return E(a) ? [e, JSON.stringify(O(a))] : [e, String(a)];
})) : {}, cr = (r) => r.map((e) => typeof e == "object" && e !== null ? JSON.stringify(O(e)) : String(e)), k = (r, e) => Object.entries(e).reduce((a, [t, n]) => {
  if (t in r) {
    const o = r[t];
    if (typeof o == "string") return { ...a, [t]: n(o) };
  }
  return a;
}, {}), f = (r, e, a, t) => ({ default: e, ...k(a, t), kind: r }), g = (r, e, a) => ({ default: [], ...k(e, a), kind: r }), or = (r, e) => {
  const a = r.map((t) => t.locale === void 0 ? t.struct : t.locale === e ? `${t.struct}!` : "");
  return new Set(a);
}, w = "BODY", B = "STRUCT", A = "NONE", mr = (r, e) => {
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
}, dr = (r) => r.currentOption ? { items: r.items.concat({ option: r.currentOption, value: r.currentOption }) } : r, G = "help", N = "kind", _ = "text", C = "struct", J = (r, e = b) => {
  if (N in r.attr) {
    const a = Er[r.attr.kind];
    if (a) return a(r);
    if (r.attr.kind === "struct") return pr(r, e);
    if (r.attr.kind === "struct[]") return fr(r, e);
  }
  return f("any", "", r.attr, y);
}, s = (r) => r, V = (r) => r.replace("[", "").replace("]", "").split(",").map((e) => parseFloat(e.replaceAll('"', "").trim())).filter((e) => !isNaN(e)), y = {
  default: s,
  text: s,
  desc: s,
  parent: s
}, T = (r) => f("string", "", r.attr, y), x = (r) => {
  const e = { default: (a) => b(a), text: s, desc: s, parent: s };
  return g("string[]", r.attr, e);
}, l = (r, e) => {
  const a = {
    default: V,
    text: s,
    desc: s,
    parent: s
  };
  return g(e, r.attr, a);
}, d = (r, e) => {
  const a = { default: (t) => parseInt(t, 10), text: s, desc: s, parent: s };
  return f(e, 0, r.attr, a);
}, pr = (r, e) => {
  const a = ((n, o) => {
    if (!n) return {};
    const c = o(n);
    return Array.isArray(c) ? {} : typeof c == "object" && c !== null ? c : {};
  })(r.attr.default, e), t = { text: s, desc: s, parent: s };
  return {
    struct: r.attr.struct || "",
    ...f("struct", a, r.attr, t)
  };
}, fr = (r, e) => {
  const a = ((n, o) => {
    if (!n) return [];
    const c = o(n);
    return Array.isArray(c) && c.every((m) => typeof m == "object" && m !== null) ? c : [];
  })(r.attr.default, e), t = { text: s, desc: s, parent: s };
  return { struct: r.attr.struct || "", ...f("struct[]", a, r.attr, t), default: a };
}, Er = {
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
    const e = ((a = r.options) == null ? void 0 : a.map((t) => ({
      option: t.option,
      value: t.value
    }))) ?? [];
    return { ...f("select", "", r.attr, y), options: e };
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
    const e = { default: (a) => b(a), text: s, desc: s, parent: s, dir: s };
    return {
      dir: "",
      ...g("file[]", r.attr, e)
    };
  }
}, Ar = (r) => !Array.isArray(r) && typeof r == "object" && r !== null && !!(Sr(r) && Or(r) && gr(r) && "parameters" in r) && yr(r), Sr = (r) => "name" in r && typeof r.name == "string", Or = (r) => "status" in r && typeof r.status == "boolean", gr = (r) => "description" in r && typeof r.description == "string", yr = (r) => typeof r.parameters == "object" && r.parameters !== null && Object.values(r.parameters).every((e) => typeof e == "string"), br = /\s*\/\//, Pr = /\s*[var|let|const]\s+[^\s]+\s*=/, _r = /^\s{0,3}[\[|\]\;]/, hr = (r) => r.split(`
`).filter((e) => !((a) => br.test(a) || _r.test(a) || Pr.test(a))(e)), Nr = (r) => {
  const e = `[${hr(r).join("")}]`, a = JSON.parse(e);
  if (!Array.isArray(a)) throw new Error("Parsed value is not an array");
  if (a.every(Ar)) return a;
  throw new Error("Parsed value is not PluginParamsObject array");
}, Hr = (r, e) => {
  const a = Lr(e);
  return r.map((t) => ({
    description: t.description,
    name: t.name,
    status: t.status,
    parameters: Ir(t, a)
  }));
}, Ir = (r, e) => {
  const a = e.get(r.name);
  if (!a) return r.parameters;
  const t = Object.entries(r.parameters).filter(([n]) => !a.has(n));
  return Object.fromEntries(t);
}, Lr = (r) => new Map(r.map((e) => [e.pluginName, new Set(e.params)])), I = (r) => ({ ...typeof r.desc == "string" ? { desc: r.desc } : {}, ...typeof r.text == "string" ? { text: r.text } : {} }), S = (r) => {
  const e = vr(r), a = Fr(e);
  return Mr(a);
}, vr = (r) => {
  if (r.currentParam && r.currentOption) {
    const e = r.currentParam.attr.kind;
    if (e === "select" || e === "combo") return { ...r, currentParam: {
      ...r.currentParam,
      options: dr(r.currentOption).items
    } };
  }
  return r;
}, Mr = (r) => r.currentParam ? { ...r, params: [...r.params, r.currentParam], currentParam: null, currentContext: null } : r, Fr = (r) => {
  if (!r.currentCommand) return r;
  const e = r.currentParam ? [...r.currentCommand.args, r.currentParam] : r.currentCommand.args, a = {
    ...I(r.currentCommand),
    command: r.currentCommand.command,
    args: e
  };
  return { ...r, commands: [...r.commands, a], currentCommand: null, currentParam: null, currentContext: null, currentOption: null };
}, U = (r, e = "en") => {
  const a = ((c) => {
    const m = c.split(`
`), p = {
      structs: [],
      bodies: [],
      structName: void 0,
      locale: void 0,
      lines: [],
      blockType: A
    }, i = m.reduce((W, $) => mr(W, $), p);
    return { structs: i.structs, bodies: i.bodies };
  })(r), t = ((c, m) => {
    const p = or(c, m);
    return c.filter((i) => i.locale === void 0 && p.has(i.struct) ? !p.has(`${i.struct}!`) : i.locale === m && p.has(`${i.struct}!`));
  })(a.structs, e).map((c) => Cr(c)), n = ((c, m) => c.reduce((p, i) => i.locale === m || i.locale === void 0 && p === void 0 ? i : p, void 0))(a.bodies, e);
  if (!n) return {
    params: [],
    commands: [],
    meta: {},
    helpLines: [],
    structs: t
  };
  const o = z(n);
  return { params: o.params, commands: o.commands, meta: o.meta, helpLines: o.helpLines, structs: t, dependencies: o.dependencies };
}, Cr = (r) => {
  const e = z(r);
  return { name: r.struct, params: e.params };
}, z = (r) => {
  const e = r.lines.reduce((a, t) => xr(a, t), Tr());
  return S(e);
}, Tr = () => ({
  helpLines: [],
  params: [],
  commands: [],
  currentParam: null,
  currentCommand: null,
  currentContext: null,
  currentOption: null,
  dependencies: { base: [], orderBefore: [], orderAfter: [] },
  meta: {}
}), xr = (r, e, a = jr) => {
  const t = e.trimEnd().replace(/^[\*\s]*/, "");
  if (!t.startsWith("@")) return r.currentContext === G ? { ...r, helpLines: r.helpLines.concat(t) } : r;
  const n = t.match(/^@(\S+)\s*(.*)$/);
  if (!n) return r;
  const [, o, c] = n, m = a[o];
  return m ? m(r, c.trim()) : r;
}, u = (r, e, a) => r.currentParam && !(e in r.currentParam.attr) ? { ...r, currentParam: { ...r.currentParam, attr: { ...r.currentParam.attr, [e]: a } } } : r, h = (r, e, a) => ({
  ...r,
  meta: { [e]: a, ...r.meta }
}), jr = {
  param: (r, e) => {
    const a = S(r);
    return a.params.some((t) => t.name === e) ? a : { ...a, currentContext: "param", currentParam: { name: e, attr: {} } };
  },
  text: (r, e) => r.currentParam ? u(r, _, e) : r.currentCommand && !(_ in r.currentCommand) ? { ...r, currentCommand: {
    ...I(r.currentCommand),
    command: r.currentCommand.command,
    args: r.currentCommand.args,
    [_]: e
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
    const a = { ...I(r.currentCommand), command: r.currentCommand.command, args: r.currentCommand.args.concat(r.currentParam) };
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
      return u(t, N, C);
    }
    return r.currentParam ? u(r, N, e) : r;
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
  author: (r, e) => h(r, "author", e),
  plugindesc: (r, e) => h(r, "plugindesc", e),
  url: (r, e) => h(r, "url", e)
}, Dr = (r) => ({
  target: "MZ",
  meta: r.meta,
  commands: Rr(r.commands),
  params: M(r.params),
  structs: kr(r.structs)
}), M = (r) => Object.fromEntries(r.map((e) => [e.name, J(e)])), Rr = (r) => Object.fromEntries(r.map((e) => [e.command, {
  desc: e.desc,
  text: e.text,
  args: M(e.args)
}])), kr = (r) => Object.fromEntries(r.map((e) => [e.name, { params: M(e.params) }])), wr = (r, e = (a) => b(a)) => ({
  params: F(r.params, (a) => e(a, "param")),
  commands: Br(r.commands, (a) => e(a, "command")),
  structs: Gr(r.structs, (a) => e(a, "struct"))
}), F = (r, e) => r.map((a) => ({ name: a.name, attr: J(a, e) })), Br = (r, e) => r.map((a) => ({
  command: a.command,
  desc: a.desc,
  text: a.text,
  args: F(a.args, e)
})), Gr = (r, e) => r.map((a) => ({ struct: a.name, params: F(a.params, e) })), qr = (r) => ((e) => Dr(U(e)))(r), Qr = (r) => {
  const e = U(r.source, r.locale);
  return {
    meta: e.meta,
    pluginName: r.pluginName,
    target: "MZ",
    schema: wr(e)
  };
}, Xr = (r) => Nr(r).map((e) => ({
  description: e.description,
  name: e.name,
  status: e.status,
  parameters: X(e.parameters)
})), re = "bgm", ee = "se", ae = "me", te = "bgs", se = "battlebacks1", ne = "battlebacks2", ce = "characters", oe = "enemies", me = "faces", ie = "parallaxes", ue = "pictures", le = "sv_actors", de = "sv_enemies", pe = "system", fe = "tilesets", Ee = "titles1", Ae = "titles2", Se = "System.json", Oe = "Actors.json", ge = "Classes.json", ye = "Skills.json", be = "Items.json", Pe = "Weapons.json", _e = "Armors.json", he = "Enemies.json", Ne = "Troops.json", Ie = "States.json", Le = "Animations.json", ve = "Tilesets.json", Me = "CommonEvents.json", Fe = "MapInfos.json", Ce = "data", Te = "img", xe = "audio", je = "js";
export {
  Oe as FILENAME_ACTORS,
  Le as FILENAME_ANIMATIONS,
  _e as FILENAME_ARMORS,
  ge as FILENAME_CLASSES,
  Me as FILENAME_COMMON_EVENTS,
  he as FILENAME_ENEMIES,
  be as FILENAME_ITEMS,
  Fe as FILENAME_MAP_INFOS,
  ye as FILENAME_SKILLS,
  Ie as FILENAME_STATES,
  Se as FILENAME_SYSTEM,
  ve as FILENAME_TILESET,
  Ne as FILENAME_TROOPS,
  Pe as FILENAME_WEAPONS,
  xe as FOLDER_AUDIO,
  re as FOLDER_AUDIO_BGM,
  te as FOLDER_AUDIO_BGS,
  ae as FOLDER_AUDIO_ME,
  ee as FOLDER_AUDIO_SE,
  Ce as FOLDER_DATA,
  Te as FOLDER_IMG,
  se as FOLDER_IMG_BATTLEBACK1,
  ne as FOLDER_IMG_BATTLEBACK2,
  ce as FOLDER_IMG_CHACTERS,
  oe as FOLDER_IMG_ENEMIES,
  me as FOLDER_IMG_FACES,
  ie as FOLDER_IMG_PARALLACES,
  ue as FOLDER_IMG_PICTURES,
  le as FOLDER_IMG_SV_ACTORS,
  de as FOLDER_IMG_SV_ENEMIES,
  pe as FOLDER_IMG_SYSTEM,
  fe as FOLDER_IMG_TILESETS,
  Ee as FOLDER_IMG_TITLES1,
  Ae as FOLDER_IMG_TITLES2,
  je as FOLDER_JS,
  ke as classifyFileParams,
  we as classifyPluginParams,
  Be as classifyTextParams,
  rr as collectDependentStructNames,
  J as compileAttributes,
  Ge as convertPluginCommandSchema,
  hr as convertPluginsJSToJSON,
  Je as convertStructSchema,
  Ve as createClassifiedStructMap,
  Ue as createStructMap,
  Vr as filterPluginParamByText,
  Wr as filterPluginSchemaByFileParam,
  Ur as filterPluginSchemaByNumberParam,
  P as filterPluginSchemaByParam,
  zr as filterPluginSchemaByVariableParam,
  ze as hasNumberValueParam,
  We as hasScalarAttr,
  j as hasStructAttr,
  K as hasTextAttr,
  $e as isArrayAttr,
  Ke as isArrayParam,
  Ze as isArrayParamEx,
  H as isFileAttr,
  Ye as isNumberArrayParam,
  Z as isNumberAttr,
  He as isNumberValueParam,
  qe as isNumberValueParamEx,
  $r as isRmmzDataKind,
  Qe as isScalarParam,
  Xe as isStringArrayParam,
  ra as isStringValueParam,
  ea as isStructArrayAttr,
  Q as isStructArrayParam,
  aa as isStructAttr,
  q as isStructParam,
  Y as isVariableAttr,
  nr as lookupKind,
  Hr as omitPluginParam,
  ta as paramHasText,
  b as parseDeepJSON,
  X as parseDeepRecord,
  Xr as parsePluginParamObject,
  Nr as parsePluginParamRecord,
  Qr as pluginSourceToArraySchema,
  qr as pluginSourceToJSON,
  ar as rebuildCommands,
  Yr as stringifyDeepJSON,
  Zr as stringifyDeepRecord,
  Kr as structDependencies,
  sa as toArrayPluginParam,
  na as toObjectPluginParams,
  ca as toObjectPluginParamsOld,
  Ar as validatePluginJS
};
