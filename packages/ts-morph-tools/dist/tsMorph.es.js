import { SyntaxKind as i } from "ts-morph";
const a = (e) => {
  if (e.isKind(i.NumericLiteral) || e.isKind(i.StringLiteral) || e.isKind(i.TrueKeyword) || e.isKind(i.FalseKeyword))
    return e.getLiteralValue();
}, o = (e) => e.getProperties().reduce((t, r) => {
  if (!r.isKind(i.PropertyAssignment))
    return t;
  const n = r.getInitializer();
  if (n === void 0)
    return t;
  const u = a(n);
  if (u === void 0)
    return t;
  const l = r.getName();
  return t[l] = u, t;
}, {});
export {
  o as getLiteralObject,
  a as pirmitiveLiteral
};
//# sourceMappingURL=tsMorph.es.js.map
