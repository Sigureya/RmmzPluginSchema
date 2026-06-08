const R = "target", U = "plugindesc", V = "author", X = "help", Y = "url", Z = "kind", tt = "type", at = "param", st = "desc", rt = "text", et = "parent", nt = "default", it = "on", ct = "off", mt = "max", ut = "min", ot = "decimals", pt = "dir", lt = "option", dt = "value", ft = "arg", yt = "base", gt = "orderAfter", ht = "orderBefore", bt = "struct", kt = (t) => {
  const a = JSON.parse(t);
  return Array.isArray(a) ? a.map(f) : x(a) ? O(a) : a;
}, St = (t) => O(t), O = (t) => Object.fromEntries(Object.keys(t).map((a) => [a, f(t[a])])), x = (t) => typeof t == "object" && t !== null && !Array.isArray(t), f = (t) => {
  if (typeof t != "string") return t;
  try {
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.map(f) : x(a) ? Object.fromEntries(Object.keys(a).map((s) => [s, f(a[s])])) : a;
  } catch {
    return t;
  }
}, Ot = (t) => w(t), xt = (t) => JSON.stringify(w(t)), d = (t) => typeof t == "object" && t !== null && !Array.isArray(t), w = (t) => Array.isArray(t) ? E(t) : d(t) ? y(t) : {}, y = (t) => d(t) ? Object.fromEntries(Object.entries(t).map(([a, s]) => {
  if (Array.isArray(s)) {
    const r = s.map((e) => d(e) ? JSON.stringify(y(e)) : String(e));
    return [a, JSON.stringify(r)];
  }
  return d(s) ? [a, JSON.stringify(y(s))] : [a, String(s)];
})) : {}, E = (t) => t.map((a) => typeof a == "object" && a !== null ? JSON.stringify(y(a)) : String(a)), g = (t) => t.kind.endsWith("[]"), J = (t) => g(t.attr), wt = (t, a) => !!g(t) && t.kind === `${a}[]`, A = (t) => t.kind !== "struct" && !g(t), h = (t) => t.kind === "struct", l = (t) => h(t.attr) || j(t.attr), At = (t) => h(t.attr), jt = (t) => A(t.attr), j = (t) => t.kind === "struct[]", M = (t) => t.attr.kind === "struct[]", Nt = (t) => {
  var a;
  return ((a = p[t.kind]) == null ? void 0 : a.hasText) === !0;
}, S = (t) => {
  var a;
  return ((a = p[t.attr.kind]) == null ? void 0 : a.hasText) === !0;
}, vt = (t) => p[t.kind].type === "string", _ = (t) => A(t) && K(t), K = (t) => p[t.kind].type === "number", Tt = (t) => g(t) ? $(t) : _(t), $ = (t) => p[t.kind.replace("[]", "")].type === "number", Et = (t) => {
  var a;
  return ((a = p[t.attr.kind]) == null ? void 0 : a.type) === "number";
}, Jt = (t) => p[t.kind.replace("[]", "")].type === "string", Mt = (t) => t.attr.kind === "variable" || t.attr.kind === "variable[]", _t = (t) => t.attr.kind === "file" || t.attr.kind === "file[]", o = {
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
}, B = (t, a) => {
  const s = function(r) {
    return Object.fromEntries(r.map((e) => [e.struct, e.params.filter(l)]));
  }(t);
  return function(r, e, i) {
    return r.reduce((n) => {
      if (!n.changed) return n;
      const c = r.filter((k) => !n.names.has(k) && e[k].some((T) => n.names.has(T.attr.struct)));
      return c.length === 0 ? { names: n.names, changed: !1 } : { names: /* @__PURE__ */ new Set([...n.names, ...c]), changed: !0 };
    }, {
      names: i,
      changed: !0
    }).names;
  }(Object.keys(s), s, new Set(a));
};
function W(t) {
  return b(t, (a) => !0, (a) => !0);
}
const Kt = (t) => b(t, (a) => a.attr.kind === "file", (a) => a.attr.kind === "file[]"), $t = (t) => b(t, (a) => S(a), (a) => S(a)), b = (t, a, s) => {
  const r = [], e = [], i = [], n = [];
  return t.forEach((c) => {
    if (h(c.attr)) r.push({ name: c.name, attr: c.attr });
    else if (M(c)) e.push(c);
    else if (J(c)) {
      if (s(c)) return void n.push(c);
    } else a(c) && i.push(c);
  }), {
    structs: r,
    structArrays: e,
    scalars: i,
    scalarArrays: n
  };
};
function N(t) {
  const a = t.map((s) => [s.name, s.attr]);
  return Object.fromEntries(a);
}
function Bt(t) {
  const a = t.map((s) => [s.name, s.attr]);
  return Object.fromEntries(a);
}
const Wt = (t) => Object.entries(t).map(([a, s]) => ({ name: a, attr: s })), qt = (t) => ({ struct: t.struct, params: N(t.params) }), zt = (t) => ({ ...q(t), command: t.command, args: N(t.args) }), q = (t) => ({
  ...t.text ? { text: t.text } : {},
  ...t.desc ? { desc: t.desc } : {}
}), v = (t, a, s) => {
  const r = a.get(t);
  return r ? r.filter((e) => ((i, n) => !(!h(i) && !j(i) || !i.struct || n.has(i.struct)))(e, s)).flatMap((e) => {
    const i = e.struct;
    return s.add(i), [i, ...v(i, a, s)];
  }) : [];
}, z = (t, a) => v(t, a, /* @__PURE__ */ new Set()), Ct = (t) => new Map(t.map((a) => [a.struct, W(a.params)])), C = (t) => new Map(t.map((a) => [a.struct, a.params.map((s) => s.attr)])), Dt = (t, a) => {
  const s = new Set(a), r = new Set(a.map((n) => `${n}[]`)), e = t.filter((n) => D(n, s, r)), i = C(e);
  return {
    targetArrayKinds: r,
    targetKinds: s,
    matchedStructs: new Set(e.map((n) => n.struct)),
    nestedStructs: new Set(t.flatMap((n) => z(n.struct, i)))
  };
}, D = (t, a, s) => t.params.some((r) => a.has(r.attr.kind) || s.has(r.attr.kind)), Ft = (t) => F(t, (a) => a.kind === "string" || a.kind === "string[]" || a.kind === "combo" || a.kind === "any");
function F(t, a) {
  const s = (e, i) => a(e, i), r = H(t.structs, s);
  return {
    params: t.params.filter((e) => l(e) ? r.structName.has(e.attr.struct) : s(e.attr, e.name)),
    structs: r.structs,
    commands: G(r.structName, t.commands, s)
  };
}
const G = (t, a, s) => a.map((r) => ({
  command: r.command,
  ...r.desc ? { desc: r.desc } : {},
  ...r.text ? { text: r.text } : {},
  args: r.args.filter((e) => l(e) ? t.has(e.attr.struct) : s(e.attr, e.name))
})).filter((r) => r.args.length > 0);
function H(t, a) {
  return I(t, (s) => a(s.attr, s.name));
}
const I = (t, a) => {
  const s = L(t, a), r = P(t, s), e = B(t, r), i = Q(t, s, e);
  return { structName: new Set(i.map((n) => n.struct)), structs: i };
}, L = (t, a) => new Set(t.flatMap((s) => s.params.filter((r) => a(r) && !l(r)))), P = (t, a) => new Set(t.filter((s) => s.params.some((r) => !l(r) && a.has(r))).map((s) => s.struct)), Q = (t, a, s) => t.map((r) => ({
  struct: r.struct,
  params: r.params.filter((e) => l(e) ? s.has(e.attr.struct) : a.has(e))
})).filter((r) => r.params.length > 0);
export {
  rt as $,
  Jt as A,
  vt as B,
  M as C,
  j as D,
  At as E,
  h as F,
  Mt as G,
  Nt as H,
  kt as I,
  xt as J,
  Ot as K,
  z as L,
  Wt as M,
  Bt as N,
  N as O,
  tt as P,
  lt as Q,
  dt as R,
  R as S,
  gt as T,
  ht as U,
  yt as V,
  Y as W,
  U as X,
  V as Y,
  X as Z,
  at as _,
  W as a,
  ft as a0,
  pt as a1,
  ot as a2,
  mt as a3,
  ut as a4,
  ct as a5,
  it as a6,
  nt as a7,
  et as a8,
  bt as a9,
  Z as aa,
  st as ab,
  $t as b,
  Kt as c,
  B as d,
  Dt as e,
  zt as f,
  qt as g,
  Ct as h,
  C as i,
  F as j,
  Ft as k,
  H as l,
  Tt as m,
  jt as n,
  l as o,
  St as p,
  S as q,
  J as r,
  g as s,
  wt as t,
  _t as u,
  $ as v,
  Et as w,
  _ as x,
  K as y,
  A as z
};
