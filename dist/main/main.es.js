import { AUTHOR_RMMZ as V, SRC_COLOR as b, domainNames as B, isValidNumber as R } from "../libs/libs.es.js";
import { parsePluginParamRecord2 as o, parsePluginByLocale as c, compilePluginAsArraySchema as P } from "../rmmz/rmmz.es.js";
import { collectDependentStructNames as v, convertPluginsJSToJSON as J, filterPluginParamByText as T, filterPluginSchemaByFileParam as D, filterPluginSchemaByNumberParam as j, filterPluginSchemaByParam as w, filterPluginSchemaByVariableParam as M, isErrorStructParam as L, isRmmzDataKind as k, lookupKind as K, omitPluginParam as _, parsePlugin as G, parsePluginParamRecord as H, pluginSourceToArraySchema as I, pluginSourceToJSON as z, rebuildCommands as U, stringifyDeepJSON as q, stringifyDeepRecord as W, structDependencies as Z, validatePluginJS as Q } from "../rmmz/rmmz.es.js";
import { jsonPathFromPluginSchema as g } from "../features/features.es.js";
import { compileCommandExtractorsFromPlugins as Y, compilePluginCommandExtractor as $, compilePluginCommandPairs as aa, compilePluginParamExtractor as ra, convertPlugin as ea, createPluginCommandExtractor as ta, createPluginValueExtractor as sa, createPluginValuesPath as ia, createPrimiteveParamPath as na, createStructParamPath as la, extractAllPluginValues as ua, extractCommandArgsByKey as ma, extractPluginCommandArgs as oa, extractPluginParam as ca, extractPluginParamFromRecord as Pa, generatePluginAnnotation as ga, generatePluginAnnotationLines as da, generatePluginAnnotationText as pa, getPathFromStructArraySchema as Sa, getPathFromStructParam as ya, getPathFromStructSchema as Aa, isCommandArgValue as ha, ispluginParamValue as fa, makeScalarArrayPath as xa, makeScalarValuesPath as Ea, mergeCommandMap as Na } from "../features/features.es.js";
import { c as Fa, a as Va, b as ba, d as Ba, e as Ra, f as Oa, g as va, h as Ja, i as Ta, j as Da, k as ja, l as wa, m as Ma, n as La, o as ka, p as Ka, q as _a, r as Ga, s as Ha, t as Ia, u as za, v as Ua, w as qa, x as Wa, y as Za, z as Qa, A as Xa, B as Ya, C as $a, D as ar, E as rr, F as er, G as tr } from "../shared/structMap.es.js";
const d = async (a, r) => {
  try {
    const e = await r();
    return p(e, a);
  } catch {
    return { message: a.readErrorPluginsJS, plugins: [], invalidPlugins: 0, complete: !1 };
  }
}, p = (a, r) => {
  try {
    return o(a, r);
  } catch {
    return { message: r.readErrorPluginsJS, plugins: [], invalidPlugins: 0, complete: !1 };
  }
}, S = (a, r, e) => a.plugins.map((t) => y(t, r, e)), y = async (a, r, e) => {
  try {
    const t = await e(a.name);
    return {
      record: a,
      plugin: A(t),
      error: ""
    };
  } catch {
    return { record: a, plugin: null, error: r.readErrorPluginBody };
  }
}, A = (a) => {
  try {
    return c(a);
  } catch {
    return null;
  }
}, E = {
  readErrorPluginsJS: "Failed to read plugins.js",
  readErrorPluginBody: "Failed to read plugin file",
  parseError: "Failed to parse plugin",
  notArray: "Plugin format is invalid: not an array",
  partialSuccess: "Some plugins failed to read or parse",
  success: "All plugins read and parsed successfully"
}, N = async (a, r, e) => {
  const t = await d(a, r.readPluginInfos), s = S(t, a, r.readPluginBody);
  return await h(s, r, e);
}, h = async (a, r, e) => (await Promise.all(a.map(async (s) => ((i, n, l) => {
  if (i.plugin === null) return null;
  const u = P(i.plugin, l);
  return g({ pluginName: i.record.name, schema: u }, i.record, (m) => n.jsonPath(m));
})(await s, r, e)))).filter((s) => s !== null);
export {
  V as AUTHOR_RMMZ,
  E as READ_PLUGIN_MESSAGES,
  b as SRC_COLOR,
  Fa as classifyFileParams,
  Va as classifyPluginParams,
  ba as classifyTextParams,
  v as collectDependentStructNames,
  Y as compileCommandExtractorsFromPlugins,
  P as compilePluginAsArraySchema,
  $ as compilePluginCommandExtractor,
  aa as compilePluginCommandPairs,
  ra as compilePluginParamExtractor,
  ea as convertPlugin,
  Ba as convertPluginCommandSchema,
  J as convertPluginsJSToJSON,
  Ra as convertStructSchema,
  Oa as createClassifiedStructMap,
  ta as createPluginCommandExtractor,
  sa as createPluginValueExtractor,
  ia as createPluginValuesPath,
  na as createPrimiteveParamPath,
  va as createStructMap,
  la as createStructParamPath,
  B as domainNames,
  ua as extractAllPluginValues,
  ma as extractCommandArgsByKey,
  oa as extractPluginCommandArgs,
  ca as extractPluginParam,
  Pa as extractPluginParamFromRecord,
  T as filterPluginParamByText,
  D as filterPluginSchemaByFileParam,
  j as filterPluginSchemaByNumberParam,
  w as filterPluginSchemaByParam,
  M as filterPluginSchemaByVariableParam,
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
  L as isErrorStructParam,
  ka as isFileAttr,
  Ka as isNumberArrayParam,
  _a as isNumberAttr,
  Ga as isNumberValueParam,
  Ha as isNumberValueParamEx,
  k as isRmmzDataKind,
  Ia as isScalarParam,
  za as isStringArrayParam,
  Ua as isStringValueParam,
  qa as isStructArrayAttr,
  Wa as isStructArrayParam,
  Za as isStructAttr,
  Qa as isStructParam,
  R as isValidNumber,
  Xa as isVariableAttr,
  fa as ispluginParamValue,
  g as jsonPathFromPluginSchema,
  K as lookupKind,
  xa as makeScalarArrayPath,
  Ea as makeScalarValuesPath,
  Na as mergeCommandMap,
  _ as omitPluginParam,
  Ya as paramHasText,
  $a as parseDeepJSON,
  ar as parseDeepRecord,
  G as parsePlugin,
  c as parsePluginByLocale,
  H as parsePluginParamRecord,
  o as parsePluginParamRecord2,
  I as pluginSourceToArraySchema,
  z as pluginSourceToJSON,
  S as readAllPluginBodies,
  d as readPluginInfosSafe,
  N as readPluginsWithSchema,
  U as rebuildCommands,
  q as stringifyDeepJSON,
  W as stringifyDeepRecord,
  Z as structDependencies,
  rr as toArrayPluginParam,
  er as toObjectPluginParams,
  tr as toObjectPluginParamsOld,
  Q as validatePluginJS
};
