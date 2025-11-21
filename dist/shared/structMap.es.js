const m = (t) => t.kind.endsWith("[]"), f = (t) => m(t.attr), _ = (t, a) => !!m(t) && t.kind === `${a}[]`, y = (t) => t.kind !== "struct" && !m(t), p = (t) => t.kind === "struct", A = (t) => p(t.attr) || x(t.attr), O = (t) => p(t.attr), M = (t) => y(t.attr), x = (t) => t.kind === "struct[]", g = (t) => t.attr.kind === "struct[]", q = (t) => {
  var a;
  return ((a = c[t.kind]) == null ? void 0 : a.hasText) === !0;
}, b = (t) => {
  var a;
  return ((a = c[t.attr.kind]) == null ? void 0 : a.hasText) === !0;
}, z = (t) => c[t.kind].type === "string", v = (t) => y(t) && T(t), T = (t) => c[t.kind].type === "number", B = (t) => m(t) ? w(t) : v(t), w = (t) => c[t.kind.replace("[]", "")].type === "number", C = (t) => {
  var a;
  return ((a = c[t.attr.kind]) == null ? void 0 : a.type) === "number";
}, D = (t) => c[t.kind.replace("[]", "")].type === "string", W = (t) => t.attr.kind === "variable" || t.attr.kind === "variable[]", $ = (t) => t.attr.kind === "file" || t.attr.kind === "file[]", i = {
  type: "string",
  hasText: !0
}, e = { type: "number", hasText: !1 }, s = { type: "number", hasText: !1 }, c = {
  string: i,
  number: { type: "number", hasText: !1 },
  boolean: { type: "boolean" },
  armor: e,
  actor: e,
  class: e,
  enemy: e,
  skill: e,
  state: e,
  item: e,
  weapon: e,
  common_event: e,
  switch: e,
  variable: e,
  troop: e,
  multiline_string: i,
  file: { type: "string", hasText: !1 },
  "file[]": { type: "string", hasText: !1 },
  "multiline_string[]": i,
  "string[]": i,
  combo: i,
  select: i,
  any: i,
  struct: { type: "struct" },
  "actor[]": s,
  "enemy[]": s,
  "class[]": s,
  "skill[]": s,
  "state[]": s,
  "item[]": s,
  "weapon[]": s,
  "common_event[]": s,
  "troop[]": s,
  "armor[]": s,
  "switch[]": s,
  "variable[]": s,
  "number[]": s
}, j = (t) => o(t, (a) => !0, (a) => !0), F = (t) => o(t, (a) => a.attr.kind === "file", (a) => a.attr.kind === "file[]"), G = (t) => o(t, (a) => b(a), (a) => b(a)), o = (t, a, r) => {
  const u = [], l = [], d = [], k = [];
  return t.forEach((n) => {
    if (p(n.attr)) u.push({ name: n.name, attr: n.attr });
    else if (g(n)) l.push(n);
    else if (f(n)) {
      if (r(n)) return void k.push(n);
    } else a(n) && d.push(n);
  }), {
    structs: u,
    structArrays: l,
    scalars: d,
    scalarArrays: k
  };
};
function h(t) {
  const a = t.map((r) => [r.name, r.attr]);
  return Object.fromEntries(a);
}
function H(t) {
  const a = t.map((r) => [r.name, r.attr]);
  return Object.fromEntries(a);
}
const I = (t) => Object.entries(t).map(([a, r]) => ({ name: a, attr: r })), J = (t) => ({ struct: t.struct, params: h(t.params) }), K = (t) => ({
  ...E(t),
  command: t.command,
  args: h(t.args)
}), E = (t) => ({
  ...t.text ? { text: t.text } : {},
  ...t.desc ? { desc: t.desc } : {}
}), L = (t) => new Map(t.map((a) => [a.struct, j(a.params)])), N = (t) => new Map(t.map((a) => [a.struct, a.params.map((r) => r.attr)]));
export {
  w as A,
  C as B,
  D as C,
  W as D,
  $ as E,
  F as a,
  G as b,
  j as c,
  H as d,
  I as e,
  J as f,
  K as g,
  L as h,
  N as i,
  m as j,
  f as k,
  _ as l,
  y as m,
  p as n,
  A as o,
  O as p,
  M as q,
  x as r,
  g as s,
  h as t,
  q as u,
  b as v,
  z as w,
  v as x,
  T as y,
  B as z
};
