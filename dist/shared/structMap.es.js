const G = "target", H = "plugindesc", I = "author", L = "help", P = "url", Q = "kind", R = "type", U = "param", V = "desc", X = "text", Y = "parent", Z = "default", tt = "on", at = "off", st = "max", et = "min", rt = "decimals", nt = "dir", ct = "option", mt = "value", it = "arg", ut = "base", ot = "orderAfter", pt = "orderBefore", lt = "struct", dt = (t) => {
  const a = JSON.parse(t);
  return Array.isArray(a) ? a.map(d) : typeof a == "object" && a !== null ? k(a) : a;
}, ft = (t) => k(t), k = (t) => Object.fromEntries(Object.entries(t).map(([a, s]) => [a, d(s)])), d = (t) => {
  if (typeof t != "string") return t;
  try {
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.map(d) : typeof a == "object" && a !== null ? Object.fromEntries(Object.entries(a).map(([s, e]) => [s, d(e)])) : a;
  } catch {
    return t;
  }
}, f = (t) => t.kind.endsWith("[]"), v = (t) => f(t.attr), ht = (t, a) => !!f(t) && t.kind === `${a}[]`, x = (t) => t.kind !== "struct" && !f(t), h = (t) => t.kind === "struct", l = (t) => h(t.attr) || w(t.attr), yt = (t) => h(t.attr), gt = (t) => x(t.attr), w = (t) => t.kind === "struct[]", A = (t) => t.attr.kind === "struct[]", bt = (t) => {
  var a;
  return ((a = p[t.kind]) == null ? void 0 : a.hasText) === !0;
}, b = (t) => {
  var a;
  return ((a = p[t.attr.kind]) == null ? void 0 : a.hasText) === !0;
}, kt = (t) => p[t.kind].type === "string", T = (t) => x(t) && E(t), E = (t) => p[t.kind].type === "number", xt = (t) => f(t) ? M(t) : T(t), M = (t) => p[t.kind.replace("[]", "")].type === "number", wt = (t) => {
  var a;
  return ((a = p[t.attr.kind]) == null ? void 0 : a.type) === "number";
}, St = (t) => p[t.kind.replace("[]", "")].type === "string", jt = (t) => t.attr.kind === "variable" || t.attr.kind === "variable[]", Ot = (t) => t.attr.kind === "file" || t.attr.kind === "file[]", o = {
  type: "string",
  hasText: !0
}, u = { type: "number", hasText: !1 }, i = { type: "number", hasText: !1 }, p = {
  string: o,
  number: { type: "number", hasText: !1 },
  boolean: { type: "boolean" },
  armor: u,
  actor: u,
  class: u,
  enemy: u,
  skill: u,
  state: u,
  item: u,
  weapon: u,
  common_event: u,
  switch: u,
  variable: u,
  troop: u,
  multiline_string: o,
  file: { type: "string", hasText: !1 },
  "file[]": { type: "string", hasText: !1 },
  "multiline_string[]": o,
  "string[]": o,
  combo: o,
  select: o,
  any: o,
  struct: { type: "struct" },
  "actor[]": i,
  "enemy[]": i,
  "class[]": i,
  "skill[]": i,
  "state[]": i,
  "item[]": i,
  "weapon[]": i,
  "common_event[]": i,
  "troop[]": i,
  "armor[]": i,
  "switch[]": i,
  "variable[]": i,
  "number[]": i
}, N = (t, a) => {
  const s = function(e) {
    return Object.fromEntries(e.map((r) => [r.struct, r.params.filter(l)]));
  }(t);
  return function(e, r, c) {
    return e.reduce((n) => {
      if (!n.changed) return n;
      const m = e.filter((g) => !n.names.has(g) && r[g].some((O) => n.names.has(O.attr.struct)));
      return m.length === 0 ? { names: n.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...n.names, ...m]), changed: !0 };
    }, {
      names: c,
      changed: !0
    }).names;
  }(Object.keys(s), s, new Set(a));
};
function _(t) {
  return y(t, (a) => !0, (a) => !0);
}
const vt = (t) => y(t, (a) => a.attr.kind === "file", (a) => a.attr.kind === "file[]"), At = (t) => y(t, (a) => b(a), (a) => b(a)), y = (t, a, s) => {
  const e = [], r = [], c = [], n = [];
  return t.forEach((m) => {
    if (h(m.attr)) e.push({ name: m.name, attr: m.attr });
    else if (A(m)) r.push(m);
    else if (v(m)) {
      if (s(m)) return void n.push(m);
    } else a(m) && c.push(m);
  }), {
    structs: e,
    structArrays: r,
    scalars: c,
    scalarArrays: n
  };
};
function S(t) {
  const a = t.map((s) => [s.name, s.attr]);
  return Object.fromEntries(a);
}
function Tt(t) {
  const a = t.map((s) => [s.name, s.attr]);
  return Object.fromEntries(a);
}
const Et = (t) => Object.entries(t).map(([a, s]) => ({ name: a, attr: s })), Mt = (t) => ({ struct: t.struct, params: S(t.params) }), Nt = (t) => ({ ...J(t), command: t.command, args: S(t.args) }), J = (t) => ({
  ...t.text ? { text: t.text } : {},
  ...t.desc ? { desc: t.desc } : {}
}), j = (t, a, s) => {
  const e = a.get(t);
  return e ? e.filter((r) => ((c, n) => !(!h(c) && !w(c) || !c.struct || n.has(c.struct)))(r, s)).flatMap((r) => {
    const c = r.struct;
    return s.add(c), [c, ...j(c, a, s)];
  }) : [];
}, K = (t, a) => j(t, a, /* @__PURE__ */ new Set()), _t = (t) => new Map(t.map((a) => [a.struct, _(a.params)])), $ = (t) => new Map(t.map((a) => [a.struct, a.params.map((s) => s.attr)])), Jt = (t, a) => {
  const s = new Set(a), e = new Set(a.map((n) => `${n}[]`)), r = t.filter((n) => B(n, s, e)), c = $(r);
  return {
    targetArrayKinds: e,
    targetKinds: s,
    matchedStructs: new Set(r.map((n) => n.struct)),
    nestedStructs: new Set(t.flatMap((n) => K(n.struct, c)))
  };
}, B = (t, a, s) => t.params.some((e) => a.has(e.attr.kind) || s.has(e.attr.kind)), Kt = (t, a) => {
  const s = q(t.structs, a);
  return {
    params: t.params.filter((e) => l(e) ? s.structName.has(e.attr.struct) : a(e.attr, e.name)),
    structs: s.structs,
    commands: W(s.structName, t.commands, a)
  };
}, W = (t, a, s) => a.map((e) => ({
  command: e.command,
  ...e.desc ? { desc: e.desc } : {},
  ...e.text ? { text: e.text } : {},
  args: e.args.filter((r) => l(r) ? t.has(r.attr.struct) : s(r.attr, r.name))
})).filter((e) => e.args.length > 0);
function q(t, a) {
  return z(t, (s) => a(s.attr, s.name));
}
const z = (t, a) => {
  const s = C(t, a), e = D(t, s), r = N(t, e), c = F(t, s, r);
  return { structName: new Set(c.map((n) => n.struct)), structs: c };
}, C = (t, a) => new Set(t.flatMap((s) => s.params.filter((e) => a(e) && !l(e)))), D = (t, a) => new Set(t.filter((s) => s.params.some((e) => a.has(e))).map((s) => s.struct)), F = (t, a, s) => t.map((e) => ({
  struct: e.struct,
  params: e.params.filter((r) => l(r) ? s.has(r.attr.struct) : a.has(r))
})).filter((e) => e.params.length > 0);
export {
  rt as $,
  kt as A,
  A as B,
  w as C,
  yt as D,
  h as E,
  jt as F,
  bt as G,
  dt as H,
  K as I,
  Et as J,
  Tt as K,
  S as L,
  R as M,
  ct as N,
  mt as O,
  G as P,
  ot as Q,
  pt as R,
  ut as S,
  P as T,
  H as U,
  I as V,
  L as W,
  U as X,
  X as Y,
  it as Z,
  nt as _,
  _ as a,
  st as a0,
  et as a1,
  at as a2,
  tt as a3,
  Z as a4,
  Y as a5,
  lt as a6,
  Q as a7,
  V as a8,
  At as b,
  vt as c,
  N as d,
  Jt as e,
  Nt as f,
  Mt as g,
  _t as h,
  $ as i,
  Kt as j,
  q as k,
  xt as l,
  gt as m,
  l as n,
  b as o,
  ft as p,
  v as q,
  f as r,
  ht as s,
  Ot as t,
  M as u,
  wt as v,
  T as w,
  E as x,
  x as y,
  St as z
};
