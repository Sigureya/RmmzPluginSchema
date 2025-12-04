const o = (t) => t.kind.endsWith("[]"), x = (t) => o(t.attr), _ = (t, a) => !!o(t) && t.kind === `${a}[]`, k = (t) => t.kind !== "struct" && !o(t), u = (t) => t.kind === "struct", J = (t) => u(t.attr) || j(t.attr), M = (t) => u(t.attr), N = (t) => k(t.attr), j = (t) => t.kind === "struct[]", O = (t) => t.attr.kind === "struct[]", S = (t) => {
  var a;
  return ((a = c[t.kind]) == null ? void 0 : a.hasText) === !0;
}, f = (t) => {
  var a;
  return ((a = c[t.attr.kind]) == null ? void 0 : a.hasText) === !0;
}, q = (t) => c[t.kind].type === "string", v = (t) => k(t) && T(t), T = (t) => c[t.kind].type === "number", z = (t) => o(t) ? w(t) : v(t), w = (t) => c[t.kind.replace("[]", "")].type === "number", B = (t) => {
  var a;
  return ((a = c[t.attr.kind]) == null ? void 0 : a.type) === "number";
}, C = (t) => c[t.kind.replace("[]", "")].type === "string", D = (t) => t.attr.kind === "variable" || t.attr.kind === "variable[]", F = (t) => t.attr.kind === "file" || t.attr.kind === "file[]", i = {
  type: "string",
  hasText: !0
}, s = { type: "number", hasText: !1 }, e = { type: "number", hasText: !1 }, c = {
  string: i,
  number: { type: "number", hasText: !1 },
  boolean: { type: "boolean" },
  armor: s,
  actor: s,
  class: s,
  enemy: s,
  skill: s,
  state: s,
  item: s,
  weapon: s,
  common_event: s,
  switch: s,
  variable: s,
  troop: s,
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
}, A = (t) => l(t, (a) => !0, (a) => !0), G = (t) => l(t, (a) => a.attr.kind === "file", (a) => a.attr.kind === "file[]"), W = (t) => l(t, (a) => f(a), (a) => f(a)), l = (t, a, r) => {
  const m = [], d = [], y = [], b = [];
  return t.forEach((n) => {
    if (u(n.attr)) m.push({ name: n.name, attr: n.attr });
    else if (O(n)) d.push(n);
    else if (x(n)) {
      if (r(n)) return void b.push(n);
    } else a(n) && y.push(n);
  }), {
    structs: m,
    structArrays: d,
    scalars: y,
    scalarArrays: b
  };
};
function h(t) {
  const a = t.map((r) => [r.name, r.attr]);
  return Object.fromEntries(a);
}
function $(t) {
  const a = t.map((r) => [r.name, r.attr]);
  return Object.fromEntries(a);
}
const H = (t) => Object.entries(t).map(([a, r]) => ({ name: a, attr: r })), I = (t) => ({ struct: t.struct, params: h(t.params) }), K = (t) => ({
  ...E(t),
  command: t.command,
  args: h(t.args)
}), E = (t) => ({
  ...t.text ? { text: t.text } : {},
  ...t.desc ? { desc: t.desc } : {}
}), L = (t) => new Map(t.map((a) => [a.struct, A(a.params)])), P = (t) => new Map(t.map((a) => [a.struct, a.params.map((r) => r.attr)])), Q = (t) => {
  const a = JSON.parse(t);
  return Array.isArray(a) ? a.map(p) : typeof a == "object" && a !== null ? g(a) : a;
}, R = (t) => g(t), g = (t) => Object.fromEntries(Object.entries(t).map(([a, r]) => [a, p(r)])), p = (t) => {
  if (typeof t != "string") return t;
  try {
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.map(p) : typeof a == "object" && a !== null ? Object.fromEntries(Object.entries(a).map(([r, m]) => [r, p(m)])) : a;
  } catch {
    return t;
  }
};
export {
  w as A,
  B,
  C,
  D,
  F as E,
  Q as F,
  R as G,
  G as a,
  W as b,
  A as c,
  $ as d,
  H as e,
  I as f,
  K as g,
  L as h,
  P as i,
  o as j,
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
  f as v,
  q as w,
  v as x,
  T as y,
  z
};
