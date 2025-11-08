import { t as p, u as S, r as b } from "../shared/convert.es.js";
import { JSONPathJS as y } from "jsonpath-js";
const N = (a, n) => `${n}[${a.map((r) => `"${r.name}"`).join(",")}]`, d = {
  undefinedStruct: "undefined_struct",
  cyclicStruct: "cyclic_struct"
};
function P(a, n, r) {
  if (a.frames.length === 0) return a;
  const t = a.frames[a.frames.length - 1], s = a.frames.slice(0, -1);
  if (t.ancestry.includes(t.schemaName)) return { frames: s, items: a.items, errs: [...a.errs, { code: r.cyclicStruct, path: t.basePath }] };
  const e = n.get(t.schemaName);
  if (!e) return {
    frames: s,
    items: a.items,
    errs: [...a.errs, { code: r.undefinedStruct, path: t.basePath }]
  };
  const m = function(c, u) {
    const o = c.ancestry.concat(c.schemaName), l = c.basePath;
    return [...u.structs.map((i) => ({
      schemaName: i.attr.struct,
      basePath: `${l}.${i.name}`,
      ancestry: o
    })), ...u.structArrays.map((i) => ({ schemaName: i.attr.struct, basePath: `${l}.${i.name}[*]`, ancestry: o }))].reverse();
  }(t, e);
  if (e.scalas.length > 0 || e.scalaArrays.length > 0) {
    const c = function(u, { path: o, structName: l }) {
      return {
        arraySchema: p(u.scalaArrays),
        objectSchema: p(u.scalas),
        structName: l,
        scalaArrays: (i = u.scalaArrays, f = o, i.map((h) => ({ path: `${f}.${h.name}[*]`, param: h }))),
        scalas: u.scalas.length > 0 ? N(u.scalas, o) : void 0
      };
      var i, f;
    }(e, {
      path: t.basePath,
      structName: t.schemaName
    });
    return s.push(...m), { frames: s, items: [...a.items, c], errs: a.errs };
  }
  return s.push(...m), { frames: s, items: a.items, errs: a.errs };
}
function g(a, n, r, t) {
  const s = {
    items: [],
    errs: [],
    frames: [{ schemaName: a, basePath: n, ancestry: [] }]
  }, e = Math.max(1, 3 * r.size + 5), m = Array.from({ length: e }).reduce((c) => c.frames.length === 0 ? c : P(c, r, t), s);
  return {
    items: m.items,
    errors: m.errs
  };
}
const j = (a, n, r, t = d) => {
  const s = a.map((e) => g(e.attr.struct, `${n}.${e.name}`, r, t));
  return { items: s.flatMap((e) => e.items), errors: s.flatMap((e) => e.errors) };
}, x = (a, n, r, t = d) => g(a, n, r, t), F = (a, n) => {
  if (!n.scalas) return [];
  const r = new y(n.scalas).pathSegments(a);
  return $(r, n, n.structName);
}, $ = (a, n, r) => a.reduce((t, { segments: s, value: e }) => {
  if (typeof e == "object") return t;
  const m = s[s.length - 1];
  if (typeof m == "number") return t;
  const c = n.objectSchema[m];
  if (!c) return t;
  const u = { value: e, structName: r, param: { name: m, attr: c } };
  return [...t, u];
}, []), J = (a, n) => n.scalaArrays.map((r) => ((t, s) => {
  const e = new y(s.path).find(t);
  if (!Array.isArray(e)) return null;
  const m = s.param.attr;
  return S(m) ? {
    values: e.filter((c) => typeof c == "string"),
    valueKind: "string",
    param: { name: s.param.name, attr: m }
  } : b(m) ? { values: e.filter((c) => typeof c == "number"), valueKind: "number", param: {
    name: s.param.name,
    attr: m
  } } : null;
})(a, r)).filter((r) => r !== null);
export {
  J as extractArrayValuesFromJson,
  F as extractScalaValuesFromJson,
  j as getPathFromStructParam,
  x as getPathFromStructSchema
};
