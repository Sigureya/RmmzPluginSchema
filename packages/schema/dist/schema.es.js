const l = {
  type: "string",
  default: ""
}, O = {
  type: "multiline_string",
  default: ""
}, m = {
  type: "number",
  default: 0
}, I = {
  type: "actor",
  default: 0
}, _ = {
  type: "switch",
  default: 0
}, y = {
  type: "armor",
  default: 0
}, S = {
  type: "skill",
  default: 0
}, E = {
  type: "item",
  default: 0
}, M = {
  type: "weapon",
  default: 0
}, v = {
  type: "troop",
  default: 0
}, g = {
  type: "class",
  default: 0
}, x = {
  type: "state",
  default: 0
}, R = {
  type: "common_event",
  default: 0
}, p = {
  type: "combo",
  default: "",
  options: []
}, w = {
  type: "select",
  default: 0,
  options: []
}, L = {
  string: l,
  combo: p,
  multiline_string: O
}, b = (t) => N(
  t,
  (e, n) => u(e) ? n + 1 : n,
  0
), C = (t) => N(
  t,
  (e, n) => (u(e) && !n.has(e.struct) && n.add(e.struct), n),
  /* @__PURE__ */ new Set()
), N = (t, e, n) => {
  const r = e(t, n, 0);
  return a(t, e, r);
}, u = (t) => t.type === "struct" || t.type === "struct[]", a = (t, e, n, r = 0) => {
  if (r > 32)
    throw new Error("Max depth exceeded");
  if (!u(t))
    return n;
  let s = n;
  for (const T in t.struct.params) {
    const c = t.struct.params[T], i = e(c, s, r);
    s = a(c, e, i, r + 1);
  }
  return s;
}, $ = (t) => {
  const e = f(t);
  return typeof e == "string" ? e : JSON.stringify(e, null, 0);
}, f = (t) => t.default === void 0 ? A(t) : t.default, A = (t, e = 0) => {
  if (e > 32)
    throw new Error("Max depth exceeded");
  return t.type === "struct" ? Object.entries(t.struct.params).reduce((n, r) => (n[r[0]] = A(r[1], e + 1), n), {}) : t.default;
}, d = (t, e) => t[e] === void 0 ? void 0 : `@${e} ${t[e]}`, o = (t, e) => e.map((n) => d(t, n)).filter((n) => n !== void 0), h = (t) => `@type ${t.type}`, B = (t) => o(t, ["text", "desc", "parent"]), D = (t) => o(t, ["min", "max", "digit"]), G = (t) => o(t, ["on", "off"]), H = (t) => t.options.flatMap(
  (e) => [`@option ${e.option}`, `@value ${e.value}`]
), U = (t) => t.options.map((e) => `@option ${e}`), k = (t) => o(t, ["dir"]);
export {
  I as ANNOTATION_ACTOR,
  y as ANNOTATION_ARMOR,
  g as ANNOTATION_CLASS,
  p as ANNOTATION_COMBO,
  R as ANNOTATION_COMMON_EVENT,
  E as ANNOTATION_ITEM,
  O as ANNOTATION_MULTILINE_STRING,
  m as ANNOTATION_NUMBER,
  w as ANNOTATION_SELECT_NUMBER,
  S as ANNOTATION_SKILL,
  x as ANNOTATION_STATE,
  l as ANNOTATION_STRING,
  _ as ANNOTATION_SWITCH,
  L as ANNOTATION_TABLE_STRING,
  v as ANNOTATION_TROOP,
  M as ANNOTATION_WEAPON,
  B as baseAnnotion,
  G as booleanArgAnnotations,
  U as comboAnnotations,
  k as fileAnnotations,
  C as flatStructs,
  o as makeAnnotion,
  f as makeDefault,
  $ as makeDefaultValue,
  b as maxDepth,
  D as numberArgAnnotations,
  H as selectAnnotations,
  N as traverseStruct,
  h as typeAnnotation
};
//# sourceMappingURL=schema.es.js.map
