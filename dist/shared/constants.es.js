const p = (a) => a.kind.endsWith("[]"), x = (a) => p(a.attr), _ = (a, t) => !!p(a) && a.kind === `${t}[]`, k = (a) => a.kind !== "struct" && !p(a), u = (a) => a.kind === "struct", J = (a) => u(a.attr) || j(a.attr), M = (a) => u(a.attr), N = (a) => k(a.attr), j = (a) => a.kind === "struct[]", O = (a) => a.attr.kind === "struct[]", S = (a) => {
  var t;
  return ((t = c[a.kind]) == null ? void 0 : t.hasText) === !0;
}, b = (a) => {
  var t;
  return ((t = c[a.attr.kind]) == null ? void 0 : t.hasText) === !0;
}, B = (a) => c[a.kind].type === "string", v = (a) => k(a) && T(a), T = (a) => c[a.kind].type === "number", W = (a) => p(a) ? A(a) : v(a), A = (a) => c[a.kind.replace("[]", "")].type === "number", $ = (a) => {
  var t;
  return ((t = c[a.attr.kind]) == null ? void 0 : t.type) === "number";
}, q = (a) => c[a.kind.replace("[]", "")].type === "string", z = (a) => a.attr.kind === "variable" || a.attr.kind === "variable[]", C = (a) => a.attr.kind === "file" || a.attr.kind === "file[]", i = {
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
const D = (a) => l(a, (t) => t.attr.kind === "file", (t) => t.attr.kind === "file[]"), F = (a) => l(a, (t) => b(t), (t) => b(t)), l = (a, t, s) => {
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
function h(a) {
  const t = a.map((s) => [s.name, s.attr]);
  return Object.fromEntries(t);
}
function G(a) {
  const t = a.map((s) => [s.name, s.attr]);
  return Object.fromEntries(t);
}
const H = (a) => Object.entries(a).map(([t, s]) => ({ name: t, attr: s })), I = (a) => ({ struct: a.struct, params: h(a.params) }), K = (a) => ({ ...E(a), command: a.command, args: h(a.args) }), E = (a) => ({ ...a.text ? {
  text: a.text
} : {}, ...a.desc ? { desc: a.desc } : {} }), L = (a) => new Map(a.map((t) => [t.struct, w(t.params)])), P = (a) => new Map(a.map((t) => [t.struct, t.params.map((s) => s.attr)])), Q = (a) => {
  const t = JSON.parse(a);
  return Array.isArray(t) ? t.map(m) : typeof t == "object" && t !== null ? g(t) : t;
}, R = (a) => g(a), g = (a) => Object.fromEntries(Object.entries(a).map(([t, s]) => [t, m(s)])), m = (a) => {
  if (typeof a != "string") return a;
  try {
    const t = JSON.parse(a);
    return Array.isArray(t) ? t.map(m) : typeof t == "object" && t !== null ? Object.fromEntries(Object.entries(t).map(([s, o]) => [s, m(o)])) : t;
  } catch {
    return a;
  }
}, U = "target", V = "plugindesc", X = "author", Y = "help", Z = "url", aa = "kind", ta = "type", sa = "param", ea = "desc", ra = "text", na = "parent", ia = "default", ca = "on", oa = "off", ma = "max", pa = "min", ua = "decimals", la = "dir", da = "option", fa = "value", ya = "arg", ba = "base", ka = "orderAfter", ha = "orderBefore", ga = "struct";
export {
  pa as $,
  A,
  $ as B,
  q as C,
  z as D,
  C as E,
  Q as F,
  R as G,
  da as H,
  fa as I,
  U as J,
  ta as K,
  ka as L,
  ha as M,
  ba as N,
  Z as O,
  V as P,
  X as Q,
  aa as R,
  Y as S,
  ga as T,
  ya as U,
  ea as V,
  ra as W,
  sa as X,
  la as Y,
  ua as Z,
  ma as _,
  D as a,
  oa as a0,
  ca as a1,
  ia as a2,
  na as a3,
  F as b,
  w as c,
  G as d,
  H as e,
  I as f,
  K as g,
  L as h,
  P as i,
  p as j,
  x as k,
  _ as l,
  k as m,
  u as n,
  J as o,
  M as p,
  N as q,
  j as r,
  O as s,
  h as t,
  S as u,
  b as v,
  B as w,
  v as x,
  T as y,
  W as z
};
