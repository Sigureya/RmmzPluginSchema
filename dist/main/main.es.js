import { AUTHOR_RMMZ as V, SRC_COLOR as B, domainNames as R, isValidNumber as O } from "../libs/libs.es.js";
import { parsePluginParamRecord2 as o, compilePluginAsArraySchema as c } from "../rmmz/rmmz.es.js";
import { collectDependentStructNames as J, convertPluginsJSToJSON as M, filterPluginParamByText as T, filterPluginSchemaByFileParam as D, filterPluginSchemaByNumberParam as w, filterPluginSchemaByParam as j, filterPluginSchemaByVariableParam as L, isErrorStructParam as _, isRmmzDataKind as k, lookupKind as K, omitPluginParam as G, parsePlugin as H, parsePluginByLocale as I, parsePluginParamRecord as z, pluginSourceToArraySchema as U, pluginSourceToJSON as q, rebuildCommands as W, stringifyDeepJSON as Z, stringifyDeepRecord as Q, structDependencies as X, validatePluginJS as Y } from "../rmmz/rmmz.es.js";
import { mergeCommandMap as P, jsonPathFromPluginSchema as g } from "../features/features.es.js";
import { compileCommandExtractorsFromPlugins as aa, compilePluginCommandExtractor as ra, compilePluginCommandPairs as ea, compilePluginParamExtractor as ta, convertPlugin as sa, createPluginCommandExtractor as ia, createPluginCommandExtractorMap as na, createPluginValueExtractor as la, createPluginValuesPath as ma, createPrimiteveParamPath as ua, createStructParamPath as oa, extractAllPluginValues as ca, extractArgsFromPluiginCommand as Pa, extractCommandArgsByKey as ga, extractPluginCommandArgs as da, extractPluginParam as pa, extractPluginParamFromRecord as Sa, generatePluginAnnotation as ya, generatePluginAnnotationLines as Aa, generatePluginAnnotationText as ha, getPathFromStructArraySchema as fa, getPathFromStructParam as xa, getPathFromStructSchema as Ca, isCommandArgValue as Ea, ispluginParamValue as Fa, makeScalarArrayPath as Na, makeScalarValuesPath as ba, pluginComamndName as Va } from "../features/features.es.js";
import { c as Ra, a as Oa, b as va, d as Ja, e as Ma, f as Ta, g as Da, h as wa, i as ja, j as La, k as _a, l as ka, m as Ka, n as Ga, o as Ha, p as Ia, q as za, r as Ua, s as qa, t as Wa, u as Za, v as Qa, w as Xa, x as Ya, y as $a, z as ar, A as rr, B as er, C as tr, D as sr, E as ir, F as nr, G as lr } from "../shared/structMap.es.js";
const d = async (r, a, e = o) => {
  try {
    const t = await a();
    return p(t, r, e);
  } catch {
    return { message: r.readErrorPluginsJS, plugins: [], invalidPlugins: 0, complete: !1 };
  }
}, p = (r, a, e) => {
  try {
    return e(r, a);
  } catch {
    return { message: a.readErrorPluginsJS, plugins: [], invalidPlugins: 0, complete: !1 };
  }
}, S = (r, a, e, t) => r.plugins.map((i) => y(i, a, e, t)), y = async (r, a, e, t) => {
  try {
    const i = await e(r.name);
    return { record: r, plugin: A(i, t), error: "" };
  } catch {
    return { record: r, plugin: null, error: a.readErrorPluginBody };
  }
}, A = (r, a) => {
  try {
    return a(r);
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
}, F = async (r, a, e) => {
  const t = await h(r, a, e);
  return P(t);
}, h = async (r, a, e) => {
  const t = await d(r, () => a.readPluginInfos(), (s, n) => a.parsePluginList(s, n)), i = S(t, r, (s) => a.readPluginBody(s), (s) => a.parsePluginBody(s));
  return await f(i, a, e);
}, f = async (r, a, e) => (await Promise.all(r.map(async (i) => ((s, n, l) => {
  if (s.plugin === null) return null;
  const m = c(s.plugin, l);
  return g({ pluginName: s.record.name, schema: m }, s.record, (u) => n.jsonPath(u));
})(await i, a, e)))).filter((i) => i !== null);
export {
  V as AUTHOR_RMMZ,
  E as READ_PLUGIN_MESSAGES,
  B as SRC_COLOR,
  F as buildCommandMapFromFiles,
  Ra as classifyFileParams,
  Oa as classifyPluginParams,
  va as classifyTextParams,
  J as collectDependentStructNames,
  aa as compileCommandExtractorsFromPlugins,
  c as compilePluginAsArraySchema,
  ra as compilePluginCommandExtractor,
  ea as compilePluginCommandPairs,
  ta as compilePluginParamExtractor,
  sa as convertPlugin,
  Ja as convertPluginCommandSchema,
  M as convertPluginsJSToJSON,
  Ma as convertStructSchema,
  Ta as createClassifiedStructMap,
  ia as createPluginCommandExtractor,
  na as createPluginCommandExtractorMap,
  la as createPluginValueExtractor,
  ma as createPluginValuesPath,
  ua as createPrimiteveParamPath,
  Da as createStructMap,
  oa as createStructParamPath,
  R as domainNames,
  ca as extractAllPluginValues,
  Pa as extractArgsFromPluiginCommand,
  ga as extractCommandArgsByKey,
  da as extractPluginCommandArgs,
  pa as extractPluginParam,
  Sa as extractPluginParamFromRecord,
  T as filterPluginParamByText,
  D as filterPluginSchemaByFileParam,
  w as filterPluginSchemaByNumberParam,
  j as filterPluginSchemaByParam,
  L as filterPluginSchemaByVariableParam,
  ya as generatePluginAnnotation,
  Aa as generatePluginAnnotationLines,
  ha as generatePluginAnnotationText,
  fa as getPathFromStructArraySchema,
  xa as getPathFromStructParam,
  Ca as getPathFromStructSchema,
  wa as hasNumberValueParam,
  ja as hasScalarAttr,
  La as hasStructAttr,
  _a as hasTextAttr,
  ka as isArrayAttr,
  Ka as isArrayParam,
  Ga as isArrayParamEx,
  Ea as isCommandArgValue,
  _ as isErrorStructParam,
  Ha as isFileAttr,
  Ia as isNumberArrayParam,
  za as isNumberAttr,
  Ua as isNumberValueParam,
  qa as isNumberValueParamEx,
  k as isRmmzDataKind,
  Wa as isScalarParam,
  Za as isStringArrayParam,
  Qa as isStringValueParam,
  Xa as isStructArrayAttr,
  Ya as isStructArrayParam,
  $a as isStructAttr,
  ar as isStructParam,
  O as isValidNumber,
  rr as isVariableAttr,
  Fa as ispluginParamValue,
  g as jsonPathFromPluginSchema,
  K as lookupKind,
  Na as makeScalarArrayPath,
  ba as makeScalarValuesPath,
  P as mergeCommandMap,
  G as omitPluginParam,
  er as paramHasText,
  tr as parseDeepJSON,
  sr as parseDeepRecord,
  H as parsePlugin,
  I as parsePluginByLocale,
  z as parsePluginParamRecord,
  o as parsePluginParamRecord2,
  Va as pluginComamndName,
  U as pluginSourceToArraySchema,
  q as pluginSourceToJSON,
  S as readAllPluginBodies,
  d as readPluginInfosSafe,
  h as readPluginsWithSchema,
  W as rebuildCommands,
  Z as stringifyDeepJSON,
  Q as stringifyDeepRecord,
  X as structDependencies,
  ir as toArrayPluginParam,
  nr as toObjectPluginParams,
  lr as toObjectPluginParamsOld,
  Y as validatePluginJS
};
