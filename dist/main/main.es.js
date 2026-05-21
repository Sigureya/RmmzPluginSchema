import { AUTHOR_RMMZ as C, SRC_COLOR as F, domainNames as V, isValidNumber as b } from "../libs/libs.es.js";
import { compilePluginAsArraySchema as o } from "../rmmz/rmmz.es.js";
import { collectDependentStructNames as R, convertPluginsJSToJSON as O, filterPluginParamByText as v, filterPluginSchemaByFileParam as J, filterPluginSchemaByNumberParam as T, filterPluginSchemaByParam as D, filterPluginSchemaByVariableParam as j, isErrorStructParam as w, isRmmzDataKind as M, lookupKind as L, omitPluginParam as k, parsePlugin as _, parsePluginByLocale as G, parsePluginParamRecord as I, parsePluginParamRecord2 as K, pluginSourceToArraySchema as z, pluginSourceToJSON as H, rebuildCommands as U, stringifyDeepJSON as q, stringifyDeepRecord as W, structDependencies as Z, validatePluginJS as Q } from "../rmmz/rmmz.es.js";
import { jsonPathFromPluginSchema as c } from "../features/features.es.js";
import { compileCommandExtractorsFromPlugins as Y, compilePluginCommandExtractor as $, compilePluginCommandPairs as aa, compilePluginParamExtractor as ra, convertPlugin as ea, createPluginCommandExtractor as ta, createPluginValueExtractor as sa, createPluginValuesPath as ia, createPrimiteveParamPath as na, createStructParamPath as la, extractAllPluginValues as ua, extractCommandArgsByKey as ma, extractPluginCommandArgs as oa, extractPluginParam as ca, extractPluginParamFromRecord as Pa, generatePluginAnnotation as ga, generatePluginAnnotationLines as da, generatePluginAnnotationText as pa, getPathFromStructArraySchema as Sa, getPathFromStructParam as ya, getPathFromStructSchema as Aa, isCommandArgValue as ha, ispluginParamValue as fa, makeScalarArrayPath as xa, makeScalarValuesPath as Ea, mergeCommandMap as Na } from "../features/features.es.js";
import { c as Fa, a as Va, b as ba, d as Ba, e as Ra, f as Oa, g as va, h as Ja, i as Ta, j as Da, k as ja, l as wa, m as Ma, n as La, o as ka, p as _a, q as Ga, r as Ia, s as Ka, t as za, u as Ha, v as Ua, w as qa, x as Wa, y as Za, z as Qa, A as Xa, B as Ya, C as $a, D as ar, E as rr, F as er, G as tr } from "../shared/structMap.es.js";
const P = async (r, a, e) => {
  try {
    const i = await a();
    return g(i, r, e);
  } catch {
    return { message: r.readErrorPluginsJS, plugins: [], invalidPlugins: 0, complete: !1 };
  }
}, g = (r, a, e) => {
  try {
    return e(r, a);
  } catch {
    return { message: a.readErrorPluginsJS, plugins: [], invalidPlugins: 0, complete: !1 };
  }
}, d = (r, a, e, i) => r.plugins.map((s) => p(s, a, e, i)), p = async (r, a, e, i) => {
  try {
    const s = await e(r.name);
    return { record: r, plugin: S(s, i), error: "" };
  } catch {
    return { record: r, plugin: null, error: a.readErrorPluginBody };
  }
}, S = (r, a) => {
  try {
    return a(r);
  } catch {
    return null;
  }
}, f = {
  readErrorPluginsJS: "Failed to read plugins.js",
  readErrorPluginBody: "Failed to read plugin file",
  parseError: "Failed to parse plugin",
  notArray: "Plugin format is invalid: not an array",
  partialSuccess: "Some plugins failed to read or parse",
  success: "All plugins read and parsed successfully"
}, x = async (r, a, e) => {
  const i = await P(r, () => a.readPluginInfos(), (t, n) => a.parsePluginList(t, n)), s = d(i, r, (t) => a.readPluginBody(t), (t) => a.parsePluginBody(t));
  return await y(s, a, e);
}, y = async (r, a, e) => (await Promise.all(r.map(async (s) => ((t, n, l) => {
  if (t.plugin === null) return null;
  const u = o(t.plugin, l);
  return c({ pluginName: t.record.name, schema: u }, t.record, (m) => n.jsonPath(m));
})(await s, a, e)))).filter((s) => s !== null);
export {
  C as AUTHOR_RMMZ,
  f as READ_PLUGIN_MESSAGES,
  F as SRC_COLOR,
  Fa as classifyFileParams,
  Va as classifyPluginParams,
  ba as classifyTextParams,
  R as collectDependentStructNames,
  Y as compileCommandExtractorsFromPlugins,
  o as compilePluginAsArraySchema,
  $ as compilePluginCommandExtractor,
  aa as compilePluginCommandPairs,
  ra as compilePluginParamExtractor,
  ea as convertPlugin,
  Ba as convertPluginCommandSchema,
  O as convertPluginsJSToJSON,
  Ra as convertStructSchema,
  Oa as createClassifiedStructMap,
  ta as createPluginCommandExtractor,
  sa as createPluginValueExtractor,
  ia as createPluginValuesPath,
  na as createPrimiteveParamPath,
  va as createStructMap,
  la as createStructParamPath,
  V as domainNames,
  ua as extractAllPluginValues,
  ma as extractCommandArgsByKey,
  oa as extractPluginCommandArgs,
  ca as extractPluginParam,
  Pa as extractPluginParamFromRecord,
  v as filterPluginParamByText,
  J as filterPluginSchemaByFileParam,
  T as filterPluginSchemaByNumberParam,
  D as filterPluginSchemaByParam,
  j as filterPluginSchemaByVariableParam,
  ga as generatePluginAnnotation,
  da as generatePluginAnnotationLines,
  pa as generatePluginAnnotationText,
  Sa as getPathFromStructArraySchema,
  ya as getPathFromStructParam,
  Aa as getPathFromStructSchema,
  Ja as hasNumberValueParam,
  Ta as hasScalarAttr,
  Da as hasStructAttr,
  ja as hasTextAttr,
  wa as isArrayAttr,
  Ma as isArrayParam,
  La as isArrayParamEx,
  ha as isCommandArgValue,
  w as isErrorStructParam,
  ka as isFileAttr,
  _a as isNumberArrayParam,
  Ga as isNumberAttr,
  Ia as isNumberValueParam,
  Ka as isNumberValueParamEx,
  M as isRmmzDataKind,
  za as isScalarParam,
  Ha as isStringArrayParam,
  Ua as isStringValueParam,
  qa as isStructArrayAttr,
  Wa as isStructArrayParam,
  Za as isStructAttr,
  Qa as isStructParam,
  b as isValidNumber,
  Xa as isVariableAttr,
  fa as ispluginParamValue,
  c as jsonPathFromPluginSchema,
  L as lookupKind,
  xa as makeScalarArrayPath,
  Ea as makeScalarValuesPath,
  Na as mergeCommandMap,
  k as omitPluginParam,
  Ya as paramHasText,
  $a as parseDeepJSON,
  ar as parseDeepRecord,
  _ as parsePlugin,
  G as parsePluginByLocale,
  I as parsePluginParamRecord,
  K as parsePluginParamRecord2,
  z as pluginSourceToArraySchema,
  H as pluginSourceToJSON,
  d as readAllPluginBodies,
  P as readPluginInfosSafe,
  x as readPluginsWithSchema,
  U as rebuildCommands,
  q as stringifyDeepJSON,
  W as stringifyDeepRecord,
  Z as structDependencies,
  rr as toArrayPluginParam,
  er as toObjectPluginParams,
  tr as toObjectPluginParamsOld,
  Q as validatePluginJS
};
