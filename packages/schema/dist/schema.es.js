const m = {
  type: "string",
  default: ""
}, I = {
  type: "multiline_string",
  default: ""
}, S = {
  type: "number",
  default: 0
}, w = {
  type: "actor",
  default: 0
}, M = {
  type: "switch",
  default: 0
}, h = {
  type: "armor",
  default: 0
}, R = {
  type: "skill",
  default: 0
}, x = {
  type: "item",
  default: 0
}, $ = {
  type: "weapon",
  default: 0
}, g = {
  type: "troop",
  default: 0
}, C = {
  type: "class",
  default: 0
}, D = {
  type: "state",
  default: 0
}, b = {
  type: "common_event",
  default: 0
}, _ = {
  type: "combo",
  default: "",
  options: []
}, L = {
  type: "select",
  default: 0,
  options: []
}, P = {
  string: m,
  combo: _,
  multiline_string: I
}, a = (t) => t.type === "struct" ? f(t) : t.type === "struct[]", f = (t) => {
  const e = t.struct;
  return e === void 0 ? !1 : e.params !== void 0;
}, U = (t) => t.default !== void 0, B = (t) => {
  const e = t.struct;
  return e === void 0 ? !1 : e.structName !== void 0;
}, H = (t) => A(
  t,
  (e, r, s) => Math.max(s, r),
  0
), G = (t) => A(
  t,
  (e, r) => (a(e) && r.add(e.struct), r),
  /* @__PURE__ */ new Set()
), A = (t, e, r) => {
  const s = e(t, r, 0);
  return d(t, e, s);
}, d = (t, e, r, s = 0) => {
  if (s > 32)
    throw new Error("Max depth exceeded");
  const u = e(t, r, s);
  return a(t) ? Object.entries(
    t.struct.params
  ).reduce((n, [, i]) => d(i, e, n, s + 1), u) : u;
}, o = {}, T = (t, e) => {
  const r = t[e];
  return r === void 0 ? void 0 : `@${e} ${r}`;
}, p = (t, e) => e.map((r) => T(t, r)).filter((r) => r !== void 0), l = (t, e) => {
  const r = e[t];
  return r === void 0 ? t : r;
}, V = (t, e = o) => [
  c(t, "on", e),
  c(t, "off", e)
].filter((r) => r !== void 0), c = (t, e, r = o) => {
  const s = t[e];
  return s ? `@${e} ${l(s, r)}` : void 0;
}, k = (t) => `@type ${t.type}`, W = (t, e = o) => [
  c(t, "text", e),
  c(t, "desc", e),
  T(t, "parent")
].filter((r) => r !== void 0), Y = (t) => p(t, ["min", "max", "digit"]), j = (t, e = o) => t.options.flatMap(
  (r) => [
    `@option ${l(r.option, e)}`,
    `@value ${r.value}`
  ]
), J = (t) => t.options.map((e) => `@option ${e}`), K = (t) => p(t, ["dir"]), X = (t, e = o) => {
  switch (t.type) {
    case "file":
      return t.default;
    case "struct":
      return N(v(t));
    case "string[]":
      return N(t.default.map((r) => l(r, e)));
  }
  return typeof t.default == "string" ? y(t, e) : N(t.default);
}, N = (t) => JSON.stringify(t, null, 0), y = (t, e) => t.type === "select" ? t.default : l(t.default, e), v = (t) => t.default !== void 0 ? t.default : O(t, () => {
}), O = (t, e, r = 0) => {
  if (t.default !== void 0)
    return t.default;
  if (r > E)
    throw new Error("Max depth exceeded");
  if (!f(t))
    throw new Error("struct is invalid");
  return Object.entries(
    t.struct.params
  ).reduce((s, [u, n]) => {
    const i = n.type === "struct" ? O(n, e, r + 1) : n.default;
    return s[u] = i, s;
  }, {});
}, E = 32, q = (t, e) => {
  throw new Error(`${e}: ${t.type}`, { cause: t });
}, z = (t) => "", F = (t) => [];
export {
  w as ANNOTATION_ACTOR,
  h as ANNOTATION_ARMOR,
  C as ANNOTATION_CLASS,
  _ as ANNOTATION_COMBO,
  b as ANNOTATION_COMMON_EVENT,
  x as ANNOTATION_ITEM,
  I as ANNOTATION_MULTILINE_STRING,
  S as ANNOTATION_NUMBER,
  L as ANNOTATION_SELECT_NUMBER,
  R as ANNOTATION_SKILL,
  D as ANNOTATION_STATE,
  m as ANNOTATION_STRING,
  M as ANNOTATION_SWITCH,
  P as ANNOTATION_TABLE_STRING,
  g as ANNOTATION_TROOP,
  $ as ANNOTATION_WEAPON,
  W as baseAnnotions,
  V as booleanAnnotations,
  z as buildAnnotation,
  p as collectAnnotations,
  J as comboAnnotations,
  F as correctErros,
  K as fileAnnotations,
  G as flatStructs,
  c as formatTextAnnotation,
  a as hasStruct,
  U as hasStructDefault,
  B as hasStructName,
  f as hasStructParams,
  l as lookupDictionary,
  v as makeDefaultStruct,
  X as makeDefaultValue,
  H as maxDepth,
  Y as numberAnnotations,
  j as selectAnnotations,
  q as thorwAnnotationError,
  A as traverseStruct,
  k as typeAnnotation
};
//# sourceMappingURL=schema.es.js.map
