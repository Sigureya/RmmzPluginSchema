import { AUTHOR_RMMZ as b, SRC_COLOR as V, domainNames as B, isValidNumber as R } from "../libs/libs.es.js";
import { mergeCommandMap as o, jsonPathFromPluginSchema as c } from "../features/features.es.js";
import { compileCommandExtractorsFromPlugins as v, compilePluginCommandExtractor as J, compilePluginCommandPairs as M, compilePluginParamExtractor as T, convertPlugin as D, createPluginCommandExtractor as w, createPluginCommandExtractorMap as j, createPluginValueExtractor as L, createPluginValuesPath as k, createPrimiteveParamPath as K, createStructParamPath as _, extractAllPluginValues as G, extractArgsFromPluiginCommand as H, extractCommandArgsByKey as I, extractPluginCommandArgs as z, extractPluginParam as U, extractPluginParamFromRecord as q, generatePluginAnnotation as W, generatePluginAnnotationLines as Z, generatePluginAnnotationText as Q, getPathFromStructArraySchema as X, getPathFromStructParam as Y, getPathFromStructSchema as $, isCommandArgValue as aa, ispluginParamValue as ra, makeScalarArrayPath as ea, makeScalarValuesPath as ta, pluginComamndName as sa } from "../features/features.es.js";
import { compilePluginAsArraySchema as P } from "../rmmz/rmmz.es.js";
import { collectDependentStructNames as na, convertPluginsJSToJSON as la, filterPluginParamByText as ma, filterPluginSchemaByFileParam as ua, filterPluginSchemaByNumberParam as oa, filterPluginSchemaByParam as ca, filterPluginSchemaByVariableParam as Pa, isErrorStructParam as ga, isRmmzDataKind as da, lookupKind as pa, omitPluginParam as Sa, parsePlugin as ya, parsePluginByLocale as Aa, parsePluginParamRecord as ha, parsePluginParamRecord2 as fa, pluginSourceToArraySchema as xa, pluginSourceToJSON as Ca, rebuildCommands as Ea, stringifyDeepJSON as Fa, stringifyDeepRecord as Na, structDependencies as ba, validatePluginJS as Va } from "../rmmz/rmmz.es.js";
import { c as Ra, a as Oa, b as va, d as Ja, e as Ma, f as Ta, g as Da, h as wa, i as ja, j as La, k as ka, l as Ka, m as _a, n as Ga, o as Ha, p as Ia, q as za, r as Ua, s as qa, t as Wa, u as Za, v as Qa, w as Xa, x as Ya, y as $a, z as ar, A as rr, B as er, C as tr, D as sr, E as ir, F as nr, G as lr } from "../shared/structMap.es.js";
const g = async (r, a, e) => {
  try {
    const t = await a();
    return d(t, r, e);
  } catch {
    return { message: r.readErrorPluginsJS, plugins: [], invalidPlugins: 0, complete: !1 };
  }
}, d = (r, a, e) => {
  try {
    return e(r, a);
  } catch {
    return { message: a.readErrorPluginsJS, plugins: [], invalidPlugins: 0, complete: !1 };
  }
}, p = (r, a, e, t) => r.plugins.map((i) => S(i, a, e, t)), S = async (r, a, e, t) => {
  try {
    const i = await e(r.name);
    return { record: r, plugin: y(i, t), error: "" };
  } catch {
    return { record: r, plugin: null, error: a.readErrorPluginBody };
  }
}, y = (r, a) => {
  try {
    return a(r);
  } catch {
    return null;
  }
}, C = {
  readErrorPluginsJS: "Failed to read plugins.js",
  readErrorPluginBody: "Failed to read plugin file",
  parseError: "Failed to parse plugin",
  notArray: "Plugin format is invalid: not an array",
  partialSuccess: "Some plugins failed to read or parse",
  success: "All plugins read and parsed successfully"
}, E = async (r, a, e) => {
  const t = await A(r, a, e);
  return o(t);
}, A = async (r, a, e) => {
  const t = await g(r, () => a.readPluginInfos(), (s, n) => a.parsePluginList(s, n)), i = p(t, r, (s) => a.readPluginBody(s), (s) => a.parsePluginBody(s));
  return await h(i, a, e);
}, h = async (r, a, e) => (await Promise.all(r.map(async (i) => ((s, n, l) => {
  if (s.plugin === null) return null;
  const m = P(s.plugin, l);
  return c({ pluginName: s.record.name, schema: m }, s.record, (u) => n.jsonPath(u));
})(await i, a, e)))).filter((i) => i !== null);
export {
  b as AUTHOR_RMMZ,
  C as READ_PLUGIN_MESSAGES,
  V as SRC_COLOR,
  E as buildCommandMapFromFiles,
  Ra as classifyFileParams,
  Oa as classifyPluginParams,
  va as classifyTextParams,
  na as collectDependentStructNames,
  v as compileCommandExtractorsFromPlugins,
  P as compilePluginAsArraySchema,
  J as compilePluginCommandExtractor,
  M as compilePluginCommandPairs,
  T as compilePluginParamExtractor,
  D as convertPlugin,
  Ja as convertPluginCommandSchema,
  la as convertPluginsJSToJSON,
  Ma as convertStructSchema,
  Ta as createClassifiedStructMap,
  w as createPluginCommandExtractor,
  j as createPluginCommandExtractorMap,
  L as createPluginValueExtractor,
  k as createPluginValuesPath,
  K as createPrimiteveParamPath,
  Da as createStructMap,
  _ as createStructParamPath,
  B as domainNames,
  G as extractAllPluginValues,
  H as extractArgsFromPluiginCommand,
  I as extractCommandArgsByKey,
  z as extractPluginCommandArgs,
  U as extractPluginParam,
  q as extractPluginParamFromRecord,
  ma as filterPluginParamByText,
  ua as filterPluginSchemaByFileParam,
  oa as filterPluginSchemaByNumberParam,
  ca as filterPluginSchemaByParam,
  Pa as filterPluginSchemaByVariableParam,
  W as generatePluginAnnotation,
  Z as generatePluginAnnotationLines,
  Q as generatePluginAnnotationText,
  X as getPathFromStructArraySchema,
  Y as getPathFromStructParam,
  $ as getPathFromStructSchema,
  wa as hasNumberValueParam,
  ja as hasScalarAttr,
  La as hasStructAttr,
  ka as hasTextAttr,
  Ka as isArrayAttr,
  _a as isArrayParam,
  Ga as isArrayParamEx,
  aa as isCommandArgValue,
  ga as isErrorStructParam,
  Ha as isFileAttr,
  Ia as isNumberArrayParam,
  za as isNumberAttr,
  Ua as isNumberValueParam,
  qa as isNumberValueParamEx,
  da as isRmmzDataKind,
  Wa as isScalarParam,
  Za as isStringArrayParam,
  Qa as isStringValueParam,
  Xa as isStructArrayAttr,
  Ya as isStructArrayParam,
  $a as isStructAttr,
  ar as isStructParam,
  R as isValidNumber,
  rr as isVariableAttr,
  ra as ispluginParamValue,
  c as jsonPathFromPluginSchema,
  pa as lookupKind,
  ea as makeScalarArrayPath,
  ta as makeScalarValuesPath,
  o as mergeCommandMap,
  Sa as omitPluginParam,
  er as paramHasText,
  tr as parseDeepJSON,
  sr as parseDeepRecord,
  ya as parsePlugin,
  Aa as parsePluginByLocale,
  ha as parsePluginParamRecord,
  fa as parsePluginParamRecord2,
  sa as pluginComamndName,
  xa as pluginSourceToArraySchema,
  Ca as pluginSourceToJSON,
  p as readAllPluginBodies,
  g as readPluginInfosSafe,
  A as readPluginsWithSchema,
  Ea as rebuildCommands,
  Fa as stringifyDeepJSON,
  Na as stringifyDeepRecord,
  ba as structDependencies,
  ir as toArrayPluginParam,
  nr as toObjectPluginParams,
  lr as toObjectPluginParamsOld,
  Va as validatePluginJS
};
