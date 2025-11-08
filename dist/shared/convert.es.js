const m = (t) => t.kind.endsWith("[]"), y = (t) => m(t.attr), g = (t, e) => !!m(t) && t.kind === `${e}[]`, o = (t) => t.kind !== "struct" && !m(t), p = (t) => t.kind === "struct", h = (t) => p(t.attr) || d(t.attr), d = (t) => t.kind === "struct[]", x = (t) => t.attr.kind === "struct[]", T = (t) => {
  var e;
  return ((e = n[t.kind]) == null ? void 0 : e.hasText) === !0;
}, f = (t) => {
  var e;
  return ((e = n[t.attr.kind]) == null ? void 0 : e.hasText) === !0;
}, v = (t) => n[t.kind].type === "string", l = (t) => o(t) && u(t), u = (t) => n[t.kind].type === "number", w = (t) => m(t) ? k(t) : l(t), k = (t) => n[t.kind.replace("[]", "")].type === "number", _ = (t) => {
  var e;
  return ((e = n[t.attr.kind]) == null ? void 0 : e.type) === "number";
}, j = (t) => n[t.kind.replace("[]", "")].type === "string", O = (t) => t.attr.kind === "variable" || t.attr.kind === "variable[]", q = (t) => t.attr.kind === "file" || t.attr.kind === "file[]", r = {
  type: "string",
  hasText: !0
}, s = { type: "number", hasText: !1 }, a = { type: "number", hasText: !1 }, n = {
  string: r,
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
  multiline_string: r,
  file: { type: "string", hasText: !1 },
  "file[]": { type: "string", hasText: !1 },
  "multiline_string[]": r,
  "string[]": r,
  combo: r,
  select: r,
  any: r,
  struct: { type: "struct" },
  "actor[]": a,
  "enemy[]": a,
  "class[]": a,
  "skill[]": a,
  "state[]": a,
  "item[]": a,
  "weapon[]": a,
  "common_event[]": a,
  "troop[]": a,
  "armor[]": a,
  "switch[]": a,
  "variable[]": a,
  "number[]": a
};
function c(t) {
  const e = t.map((i) => [i.name, i.attr]);
  return Object.fromEntries(e);
}
const E = (t) => Object.entries(t).map(([e, i]) => ({ name: e, attr: i })), W = (t) => ({ struct: t.struct, params: c(t.params) }), $ = (t) => ({ ...b(t), command: t.command, args: c(t.args) }), b = (t) => ({ ...t.text ? {
  text: t.text
} : {}, ...t.desc ? { desc: t.desc } : {} });
export {
  E as a,
  $ as b,
  W as c,
  y as d,
  g as e,
  o as f,
  p as g,
  h,
  m as i,
  d as j,
  x as k,
  f as l,
  v as m,
  l as n,
  u as o,
  T as p,
  w as q,
  k as r,
  _ as s,
  c as t,
  j as u,
  O as v,
  q as w
};
