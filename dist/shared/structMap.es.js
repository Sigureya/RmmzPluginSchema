const R = "target", U = "plugindesc", V = "author", X = "help", Y = "url", Z = "kind", z = "type", tt = "param", at = "desc", rt = "text", st = "parent", et = "default", nt = "on", it = "off", ct = "max", mt = "min", ut = "decimals", ot = "dir", pt = "option", lt = "value", dt = "arg", ft = "base", yt = "orderAfter", gt = "orderBefore", ht = "struct", bt = (t) => {
  const a = JSON.parse(t);
  return Array.isArray(a) ? a.map(f) : typeof a == "object" && a !== null ? O(a) : a;
}, kt = (t) => O(t), O = (t) => Object.fromEntries(Object.entries(t).map(([a, r]) => [a, f(r)])), f = (t) => {
  if (typeof t != "string") return t;
  try {
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.map(f) : typeof a == "object" && a !== null ? Object.fromEntries(Object.entries(a).map(([r, s]) => [r, f(s)])) : a;
  } catch {
    return t;
  }
}, St = (t) => x(t), Ot = (t) => JSON.stringify(x(t)), d = (t) => typeof t == "object" && t !== null && !Array.isArray(t), x = (t) => Array.isArray(t) ? T(t) : d(t) ? y(t) : {}, y = (t) => d(t) ? Object.fromEntries(Object.entries(t).map(([a, r]) => {
  if (Array.isArray(r)) {
    const s = r.map((e) => d(e) ? JSON.stringify(y(e)) : String(e));
    return [a, JSON.stringify(s)];
  }
  return d(r) ? [a, JSON.stringify(y(r))] : [a, String(r)];
})) : {}, T = (t) => t.map((a) => typeof a == "object" && a !== null ? JSON.stringify(y(a)) : String(a)), g = (t) => t.kind.endsWith("[]"), E = (t) => g(t.attr), xt = (t, a) => !!g(t) && t.kind === `${a}[]`, w = (t) => t.kind !== "struct" && !g(t), h = (t) => t.kind === "struct", l = (t) => h(t.attr) || j(t.attr), wt = (t) => h(t.attr), jt = (t) => w(t.attr), j = (t) => t.kind === "struct[]", J = (t) => t.attr.kind === "struct[]", At = (t) => {
  var a;
  return ((a = p[t.kind]) == null ? void 0 : a.hasText) === !0;
}, S = (t) => {
  var a;
  return ((a = p[t.attr.kind]) == null ? void 0 : a.hasText) === !0;
}, Nt = (t) => p[t.kind].type === "string", M = (t) => w(t) && _(t), _ = (t) => p[t.kind].type === "number", vt = (t) => g(t) ? K(t) : M(t), K = (t) => p[t.kind.replace("[]", "")].type === "number", Tt = (t) => {
  var a;
  return ((a = p[t.attr.kind]) == null ? void 0 : a.type) === "number";
}, Et = (t) => p[t.kind.replace("[]", "")].type === "string", Jt = (t) => t.attr.kind === "variable" || t.attr.kind === "variable[]", Mt = (t) => t.attr.kind === "file" || t.attr.kind === "file[]", o = {
  type: "string",
  hasText: !0
}, u = { type: "number", hasText: !1 }, m = { type: "number", hasText: !1 }, p = {
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
  "file[]": {
    type: "string",
    hasText: !1
  },
  "multiline_string[]": o,
  "string[]": o,
  combo: o,
  select: o,
  any: o,
  struct: { type: "struct" },
  "actor[]": m,
  "enemy[]": m,
  "class[]": m,
  "skill[]": m,
  "state[]": m,
  "item[]": m,
  "weapon[]": m,
  "common_event[]": m,
  "troop[]": m,
  "armor[]": m,
  "switch[]": m,
  "variable[]": m,
  "number[]": m
}, $ = (t, a) => {
  const r = function(s) {
    return Object.fromEntries(s.map((e) => [e.struct, e.params.filter(l)]));
  }(t);
  return function(s, e, i) {
    return s.reduce((n) => {
      if (!n.changed) return n;
      const c = s.filter((k) => !n.names.has(k) && e[k].some((v) => n.names.has(v.attr.struct)));
      return c.length === 0 ? { names: n.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...n.names, ...c]), changed: !0 };
    }, {
      names: i,
      changed: !0
    }).names;
  }(Object.keys(r), r, new Set(a));
};
function B(t) {
  return b(t, (a) => !0, (a) => !0);
}
const _t = (t) => b(t, (a) => a.attr.kind === "file", (a) => a.attr.kind === "file[]"), Kt = (t) => b(t, (a) => S(a), (a) => S(a)), b = (t, a, r) => {
  const s = [], e = [], i = [], n = [];
  return t.forEach((c) => {
    if (h(c.attr)) s.push({ name: c.name, attr: c.attr });
    else if (J(c)) e.push(c);
    else if (E(c)) {
      if (r(c)) return void n.push(c);
    } else a(c) && i.push(c);
  }), {
    structs: s,
    structArrays: e,
    scalars: i,
    scalarArrays: n
  };
};
function A(t) {
  const a = t.map((r) => [r.name, r.attr]);
  return Object.fromEntries(a);
}
function $t(t) {
  const a = t.map((r) => [r.name, r.attr]);
  return Object.fromEntries(a);
}
const Bt = (t) => Object.entries(t).map(([a, r]) => ({ name: a, attr: r })), Wt = (t) => ({ struct: t.struct, params: A(t.params) }), qt = (t) => ({ ...W(t), command: t.command, args: A(t.args) }), W = (t) => ({
  ...t.text ? { text: t.text } : {},
  ...t.desc ? { desc: t.desc } : {}
}), N = (t, a, r) => {
  const s = a.get(t);
  return s ? s.filter((e) => ((i, n) => !(!h(i) && !j(i) || !i.struct || n.has(i.struct)))(e, r)).flatMap((e) => {
    const i = e.struct;
    return r.add(i), [i, ...N(i, a, r)];
  }) : [];
}, q = (t, a) => N(t, a, /* @__PURE__ */ new Set()), Ct = (t) => new Map(t.map((a) => [a.struct, B(a.params)])), C = (t) => new Map(t.map((a) => [a.struct, a.params.map((r) => r.attr)])), Dt = (t, a) => {
  const r = new Set(a), s = new Set(a.map((n) => `${n}[]`)), e = t.filter((n) => D(n, r, s)), i = C(e);
  return {
    targetArrayKinds: s,
    targetKinds: r,
    matchedStructs: new Set(e.map((n) => n.struct)),
    nestedStructs: new Set(t.flatMap((n) => q(n.struct, i)))
  };
}, D = (t, a, r) => t.params.some((s) => a.has(s.attr.kind) || r.has(s.attr.kind)), Ft = (t) => F(t, (a) => a.kind === "string" || a.kind === "string[]" || a.kind === "combo" || a.kind === "any");
function F(t, a) {
  const r = (e, i) => a(e, i), s = H(t.structs, r);
  return {
    params: t.params.filter((e) => l(e) ? s.structName.has(e.attr.struct) : r(e.attr, e.name)),
    structs: s.structs,
    commands: G(s.structName, t.commands, r)
  };
}
const G = (t, a, r) => a.map((s) => ({
  command: s.command,
  ...s.desc ? { desc: s.desc } : {},
  ...s.text ? { text: s.text } : {},
  args: s.args.filter((e) => l(e) ? t.has(e.attr.struct) : r(e.attr, e.name))
})).filter((s) => s.args.length > 0);
function H(t, a) {
  return I(t, (r) => a(r.attr, r.name));
}
const I = (t, a) => {
  const r = L(t, a), s = P(t, r), e = $(t, s), i = Q(t, r, e);
  return { structName: new Set(i.map((n) => n.struct)), structs: i };
}, L = (t, a) => new Set(t.flatMap((r) => r.params.filter((s) => a(s) && !l(s)))), P = (t, a) => new Set(t.filter((r) => r.params.some((s) => !l(s) && a.has(s))).map((r) => r.struct)), Q = (t, a, r) => t.map((s) => ({
  struct: s.struct,
  params: s.params.filter((e) => l(e) ? r.has(e.attr.struct) : a.has(e))
})).filter((s) => s.params.length > 0);
export {
  rt as $,
  Et as A,
  Nt as B,
  J as C,
  j as D,
  wt as E,
  h as F,
  Jt as G,
  At as H,
  bt as I,
  Ot as J,
  St as K,
  q as L,
  Bt as M,
  $t as N,
  A as O,
  z as P,
  pt as Q,
  lt as R,
  R as S,
  yt as T,
  gt as U,
  ft as V,
  Y as W,
  U as X,
  V as Y,
  X as Z,
  tt as _,
  B as a,
  dt as a0,
  ot as a1,
  ut as a2,
  ct as a3,
  mt as a4,
  it as a5,
  nt as a6,
  et as a7,
  st as a8,
  ht as a9,
  Z as aa,
  at as ab,
  Kt as b,
  _t as c,
  $ as d,
  Dt as e,
  qt as f,
  Wt as g,
  Ct as h,
  C as i,
  F as j,
  Ft as k,
  H as l,
  vt as m,
  jt as n,
  l as o,
  kt as p,
  S as q,
  E as r,
  g as s,
  xt as t,
  Mt as u,
  K as v,
  Tt as w,
  M as x,
  _ as y,
  w as z
};
