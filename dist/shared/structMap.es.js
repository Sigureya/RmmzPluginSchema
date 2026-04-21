const _ = "target", J = "plugindesc", M = "author", N = "help", S = "url", B = "kind", W = "type", $ = "param", q = "desc", z = "text", C = "parent", D = "default", F = "on", G = "off", H = "max", I = "min", K = "decimals", L = "dir", P = "option", Q = "value", R = "arg", U = "base", V = "orderAfter", X = "orderBefore", Y = "struct", Z = (a) => {
  const t = JSON.parse(a);
  return Array.isArray(t) ? t.map(m) : typeof t == "object" && t !== null ? k(t) : t;
}, aa = (a) => k(a), k = (a) => Object.fromEntries(Object.entries(a).map(([t, s]) => [t, m(s)])), m = (a) => {
  if (typeof a != "string") return a;
  try {
    const t = JSON.parse(a);
    return Array.isArray(t) ? t.map(m) : typeof t == "object" && t !== null ? Object.fromEntries(Object.entries(t).map(([s, o]) => [s, m(o)])) : t;
  } catch {
    return a;
  }
}, p = (a) => a.kind.endsWith("[]"), x = (a) => p(a.attr), ta = (a, t) => !!p(a) && a.kind === `${t}[]`, h = (a) => a.kind !== "struct" && !p(a), u = (a) => a.kind === "struct", sa = (a) => u(a.attr) || j(a.attr), ea = (a) => u(a.attr), ra = (a) => h(a.attr), j = (a) => a.kind === "struct[]", O = (a) => a.attr.kind === "struct[]", na = (a) => {
  var t;
  return ((t = c[a.kind]) == null ? void 0 : t.hasText) === !0;
}, b = (a) => {
  var t;
  return ((t = c[a.attr.kind]) == null ? void 0 : t.hasText) === !0;
}, ia = (a) => c[a.kind].type === "string", v = (a) => h(a) && T(a), T = (a) => c[a.kind].type === "number", ca = (a) => p(a) ? A(a) : v(a), A = (a) => c[a.kind.replace("[]", "")].type === "number", oa = (a) => {
  var t;
  return ((t = c[a.attr.kind]) == null ? void 0 : t.type) === "number";
}, ma = (a) => c[a.kind.replace("[]", "")].type === "string", pa = (a) => a.attr.kind === "variable" || a.attr.kind === "variable[]", ua = (a) => a.attr.kind === "file" || a.attr.kind === "file[]", i = {
  type: "string",
  hasText: !0
}, r = { type: "number", hasText: !1 }, e = { type: "number", hasText: !1 }, c = {
  string: i,
  number: { type: "number", hasText: !1 },
  boolean: { type: "boolean" },
  armor: r,
  actor: r,
  class: r,
  enemy: r,
  skill: r,
  state: r,
  item: r,
  weapon: r,
  common_event: r,
  switch: r,
  variable: r,
  troop: r,
  multiline_string: i,
  file: { type: "string", hasText: !1 },
  "file[]": { type: "string", hasText: !1 },
  "multiline_string[]": i,
  "string[]": i,
  combo: i,
  select: i,
  any: i,
  struct: { type: "struct" },
  "actor[]": e,
  "enemy[]": e,
  "class[]": e,
  "skill[]": e,
  "state[]": e,
  "item[]": e,
  "weapon[]": e,
  "common_event[]": e,
  "troop[]": e,
  "armor[]": e,
  "switch[]": e,
  "variable[]": e,
  "number[]": e
};
function w(a) {
  return l(a, (t) => !0, (t) => !0);
}
const la = (a) => l(a, (t) => t.attr.kind === "file", (t) => t.attr.kind === "file[]"), da = (a) => l(a, (t) => b(t), (t) => b(t)), l = (a, t, s) => {
  const o = [], d = [], f = [], y = [];
  return a.forEach((n) => {
    if (u(n.attr)) o.push({ name: n.name, attr: n.attr });
    else if (O(n)) d.push(n);
    else if (x(n)) {
      if (s(n)) return void y.push(n);
    } else t(n) && f.push(n);
  }), {
    structs: o,
    structArrays: d,
    scalars: f,
    scalarArrays: y
  };
};
function g(a) {
  const t = a.map((s) => [s.name, s.attr]);
  return Object.fromEntries(t);
}
function fa(a) {
  const t = a.map((s) => [s.name, s.attr]);
  return Object.fromEntries(t);
}
const ya = (a) => Object.entries(a).map(([t, s]) => ({ name: t, attr: s })), ba = (a) => ({ struct: a.struct, params: g(a.params) }), ka = (a) => ({ ...E(a), command: a.command, args: g(a.args) }), E = (a) => ({
  ...a.text ? { text: a.text } : {},
  ...a.desc ? { desc: a.desc } : {}
}), ha = (a) => new Map(a.map((t) => [t.struct, w(t.params)])), ga = (a) => new Map(a.map((t) => [t.struct, t.params.map((s) => s.attr)]));
export {
  D as $,
  pa as A,
  na as B,
  Z as C,
  aa as D,
  ya as E,
  fa as F,
  g as G,
  P as H,
  Q as I,
  _ as J,
  W as K,
  V as L,
  X as M,
  U as N,
  S as O,
  J as P,
  M as Q,
  N as R,
  $ as S,
  z as T,
  R as U,
  L as V,
  K as W,
  H as X,
  I as Y,
  G as Z,
  F as _,
  w as a,
  C as a0,
  Y as a1,
  B as a2,
  q as a3,
  da as b,
  la as c,
  ka as d,
  ba as e,
  ha as f,
  ga as g,
  ca as h,
  ra as i,
  sa as j,
  b as k,
  x as l,
  p as m,
  ta as n,
  ua as o,
  A as p,
  oa as q,
  v as r,
  T as s,
  h as t,
  ma as u,
  ia as v,
  O as w,
  j as x,
  ea as y,
  u as z
};
