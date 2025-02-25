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
}, R = {
  type: "armor",
  default: 0
}, x = {
  type: "skill",
  default: 0
}, g = {
  type: "item",
  default: 0
}, $ = {
  type: "weapon",
  default: 0
}, h = {
  type: "troop",
  default: 0
}, C = {
  type: "class",
  default: 0
}, D = {
  type: "state",
  default: 0
}, L = {
  type: "common_event",
  default: 0
}, y = {
  type: "combo",
  default: "",
  options: []
}, b = {
  type: "select",
  default: 0,
  options: []
}, U = {
  string: m,
  combo: y,
  multiline_string: I
}, B = (t) => a(
  t,
  (e, r) => N(e) ? r + 1 : r,
  0
), H = (t) => a(
  t,
  (e, r) => (N(e) && !r.has(e.struct) && r.add(e.struct), r),
  /* @__PURE__ */ new Set()
), a = (t, e, r) => {
  const o = e(t, r, 0);
  return f(t, e, o);
}, N = (t) => t.type === "struct" || t.type === "struct[]", f = (t, e, r, o = 0) => {
  if (o > 32)
    throw new Error("Max depth exceeded");
  if (!N(t))
    return r;
  let s = r;
  for (const d in t.struct.params) {
    const l = t.struct.params[d], O = e(l, s, o);
    s = f(l, e, O, o + 1);
  }
  return s;
}, n = {}, p = (t, e) => {
  const r = t[e];
  return r === void 0 ? void 0 : `@${e} ${r}`;
}, A = (t, e) => e.map((r) => p(t, r)).filter((r) => r !== void 0), c = (t, e) => {
  const r = e[t];
  return r === void 0 ? t : r;
}, P = (t, e = n) => [
  u(t, "on", e),
  u(t, "off", e)
].filter((r) => r !== void 0), u = (t, e, r = n) => {
  const o = t[e];
  return o ? `@${e} ${c(o, r)}` : void 0;
}, k = (t) => `@type ${t.type}`, G = (t, e = n) => [
  u(t, "text", e),
  u(t, "desc", e),
  p(t, "parent")
].filter((r) => r !== void 0), V = (t) => A(t, ["min", "max", "digit"]), W = (t, e = n) => t.options.flatMap(
  (r) => [
    `@option ${c(r.option, e)}`,
    `@value ${r.value}`
  ]
), Y = (t) => t.options.map((e) => `@option ${e}`), J = (t) => A(t, ["dir"]), K = (t, e = n) => {
  switch (t.type) {
    case "file":
      return t.default;
    case "struct":
      return i(v(t));
    case "string[]":
      return i(t.default.map((r) => c(r, e)));
  }
  return typeof t.default == "string" ? _(t, e) : i(t.default);
}, i = (t) => JSON.stringify(t, null, 0), _ = (t, e) => t.type === "select" ? t.default : c(t.default, e), v = (t) => t.default === void 0 ? T(t, () => {
}) : t.default, T = (t, e, r = 0) => {
  if (r > E)
    throw new Error("Max depth exceeded");
  if (t.default !== void 0)
    return t.default;
  if (t.type !== "struct" || t.struct === void 0)
    throw new Error(`unknown type:${t.type}`, {
      cause: t
    });
  if (t.struct.structName !== void 0) {
    const o = e(t.struct.structName);
    if (o !== void 0)
      return o;
  }
  if (t.struct.params === void 0)
    throw new Error("struct is invalid");
  return Object.entries(t.struct.params).reduce((o, s) => (o[s[0]] = T(s[1], e, r + 1), o), {});
}, E = 32, X = (t) => "", j = (t) => [];
export {
  w as ANNOTATION_ACTOR,
  R as ANNOTATION_ARMOR,
  C as ANNOTATION_CLASS,
  y as ANNOTATION_COMBO,
  L as ANNOTATION_COMMON_EVENT,
  g as ANNOTATION_ITEM,
  I as ANNOTATION_MULTILINE_STRING,
  S as ANNOTATION_NUMBER,
  b as ANNOTATION_SELECT_NUMBER,
  x as ANNOTATION_SKILL,
  D as ANNOTATION_STATE,
  m as ANNOTATION_STRING,
  M as ANNOTATION_SWITCH,
  U as ANNOTATION_TABLE_STRING,
  h as ANNOTATION_TROOP,
  $ as ANNOTATION_WEAPON,
  G as baseAnnotions,
  P as booleanAnnotations,
  X as buildAnnotation,
  A as collectAnnotations,
  Y as comboAnnotations,
  j as correctErros,
  J as fileAnnotations,
  H as flatStructs,
  u as formatTextAnnotation,
  c as lookupDictionary,
  v as makeDefaultStruct,
  K as makeDefaultValue,
  B as maxDepth,
  V as numberAnnotations,
  W as selectAnnotations,
  a as traverseStruct,
  k as typeAnnotation
};
//# sourceMappingURL=schema.es.js.map
