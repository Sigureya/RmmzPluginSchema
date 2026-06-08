import { JSONPathJS as p } from "jsonpath-js";
import { buildPluginValueExtractor as g, extractPluginParamFromRecord as d, extractArgsFromPluginCommand as P } from "../features/features.es.js";
import { buildCommandExtractors as G, buildParamExtractors as U, compileCommandExtractorsFromPlugins as W, compilePluginCommandExtractor as z, compilePluginCommandPairs as Z, compilePluginParamExtractor as q, createPluginCommandExtractor as Q, createPluginCommandExtractorMap as X, createPluginParamDictionary as Y, createPluginValueExtractor as aa, createPluginValuesPath as ra, createPrimiteveParamPath as ea, createStructParamPath as sa, createTextParamDictionary as ma, extractAllPluginValues as ta, extractCommandArgsByKey as na, extractPluginCommandArgs as ia, generatePluginAnnotation as oa, generatePluginAnnotationLines as la, generatePluginAnnotationText as ca, getPathFromStructArraySchema as ua, getPathFromStructParam as pa, getPathFromStructSchema as ga, isCommandArgValue as da, ispluginParamValue as Pa, makeScalarArrayPath as Sa, makeScalarValuesPath as Na, mergeCommandMap as ha, pluginComamndName as ya, replacePluginParams as Ea, replacePluginValue as xa, replaceRuntimePluginCommand as fa } from "../features/features.es.js";
import { parsePluginParamRecord2 as o, createDeepJSONParserHandlers as S, parsePluginByLocale as N, compilePluginAsArraySchema as h } from "../rmmz/rmmz.es.js";
import { convertPluginsJSToJSON as Ca, filterPluginParamByText as Ba, filterPluginSchemaByFileParam as Fa, filterPluginSchemaByNumberParam as ba, filterPluginSchemaByParam as Ja, filterPluginSchemaByVariableParam as Oa, isErrorStructParam as Ra, isRmmzDataKind as Va, lookupKind as Da, omitPluginParam as $a, parsePlugin as va, pluginSourceToArraySchema as Ma, pluginSourceToJSON as Ta, rebuildCommands as _a, validatePluginJS as La } from "../rmmz/rmmz.es.js";
import { p as l } from "../shared/structMap.es.js";
import { c as wa, a as Ha, b as Ka, d as Ia, e as ka, f as Ga, g as Ua, h as Wa, i as za, j as Za, k as qa, l as Qa, m as Xa, n as Ya, o as ar, q as rr, r as er, s as sr, t as mr, u as tr, v as nr, w as ir, x as or, y as lr, z as cr, A as ur, B as pr, C as gr, D as dr, E as Pr, F as Sr, G as Nr, H as hr, I as yr, J as Er, K as xr, L as fr, M as Ar, N as Cr, O as Br } from "../shared/structMap.es.js";
import { AUTHOR_RMMZ as br, SRC_COLOR as Jr, domainNames as Or, isValidNumber as Rr } from "../libs/libs.es.js";
const y = {
  readErrorPluginsJS: "Failed to read plugins.js",
  readErrorPluginBody: "Failed to read plugin file",
  parseError: "Failed to parse plugin",
  notArray: "Plugin format is invalid: not an array",
  partialSuccess: "Some plugins failed to read or parse",
  success: "All plugins read and parsed successfully"
}, E = async (a, r, e = o) => {
  try {
    const m = await r();
    return x(m, a, e);
  } catch {
    return {
      message: a.readErrorPluginsJS,
      plugins: [],
      invalidPlugins: 0,
      complete: !1
    };
  }
}, x = (a, r, e) => {
  try {
    return e(a, r);
  } catch {
    return {
      message: r.readErrorPluginsJS,
      plugins: [],
      invalidPlugins: 0,
      complete: !1
    };
  }
}, f = (a, r, e, m) => a.plugins.map((s) => A(s, r, e, m)), A = async (a, r, e, m) => {
  try {
    const s = await e(a.name);
    return { record: a, plugin: C(s, m), error: "" };
  } catch {
    return {
      record: a,
      plugin: null,
      error: r.readErrorPluginBody
    };
  }
}, C = (a, r) => {
  try {
    return r(a);
  } catch {
    return null;
  }
}, B = { commandNotFoundError: (a) => ({
  message: `undefined command: ${a.pluginName}:${a.commandName}`,
  source: "commandNotFoundError"
}), commandParseError: (a, r) => ({
  message: `parse failed: ${a.pluginName}:${a.commandName}: ${String(r)}`,
  source: "commandParseError"
}), commandArgsError: (a, r) => ({
  message: `extract args failed: ${a.pluginName}:${a.commandName}: ${String(r)}`,
  source: "commandArgsError"
}) }, F = { commandStructPathError: (a, r) => ({
  code: r.code,
  source: "createPath",
  pluginName: a.pluginName,
  commandName: a.commandName,
  argName: a.argName,
  path: r.path,
  message: `${r.code}: ${r.path}`
}), commandCompileJSONPathSchemaError: (a, r) => ({
  code: "compile_jsonpath_schema_error",
  source: "compileJSONPathSchema",
  pluginName: a.pluginName,
  commandName: a.commandName,
  argName: a.argName,
  message: String(r)
}) }, b = {
  paramStructPathError: (a, r) => ({ code: r.code, source: "createPath", pluginName: a.pluginName, paramName: a.paramName, path: r.path, message: `${r.code}: ${r.path}` }),
  paramCompileJSONPathSchemaError: (a, r) => ({ code: "compile_jsonpath_schema_error", source: "compileJSONPathSchema", pluginName: a.pluginName, paramName: a.paramName, message: String(r) })
}, _ = (a) => ({
  parser: { parsePluginList: (r, e) => o(r, e), parsePluginBody: (r) => N(r), parseDeepRecord: (r) => l(r) },
  jsonPath: (r) => new p(r),
  deepJSON: S(),
  paramBuild: b,
  commandBuild: F,
  paramRead: a,
  commandExtract: B
}), L = async (a, r, e = {}) => {
  const m = e.messages ?? y, s = await E(m, () => a.readPluginList(), (c, u) => r.parser.parsePluginList(c, u)), t = await Promise.all(O(s, m, a, r)), n = J(s, t);
  return {
    status: D(t, n),
    plugins: t,
    allErrors: n
  };
}, J = (a, r) => !a.complete || a.invalidPlugins > 0 ? [{ phase: "readPluginList", pluginName: "", message: a.message, detail: {
  invalidPlugins: a.invalidPlugins,
  complete: a.complete
} }, ...i(r)] : i(r), i = (a) => a.flatMap((r) => r.errors.map((e) => ({
  ...e,
  pluginName: r.pluginName
}))), O = (a, r, e, m) => f(a, r, (s) => e.readPluginBody(s), (s) => m.parser.parsePluginBody(s)).map(async (s) => R(await s, m)), R = (a, r) => {
  const e = a.record.name;
  if (a.plugin === null) return {
    pluginName: a.record.name,
    record: a.record,
    params: [],
    commandExtractors: [],
    schema: { structs: [], params: [], commands: [] },
    errors: a.error ? [{
      phase: "parsePluginBody",
      pluginName: e,
      message: "plugin body parse failed"
    }] : []
  };
  const m = h(a.plugin, r.deepJSON), s = g(e, m, r.jsonPath, r.paramBuild, r.commandBuild), t = d(a.record, s.params.extractors, r.parser.parseDeepRecord, r.paramRead);
  return {
    pluginName: e,
    schema: m,
    record: a.record,
    params: t.params,
    commandExtractors: s.commands.extractors,
    errors: V(e, s, t)
  };
}, V = (a, r, e) => {
  const m = [];
  return m.push(...r.params.errors.map((s) => ({
    phase: "buildParam",
    pluginName: a,
    message: s.message,
    detail: s
  }))), m.push(...r.commands.errors.map((s) => ({ phase: "buildCommand", pluginName: a, message: s.message, detail: s }))), e.errorKind === "parseError" && m.push({ phase: "parseParam", pluginName: a, message: "plugin parameter parse failed", errorInfo: e.errorInfo || void 0 }), m;
}, D = (a, r) => r.length === 0 ? "success" : a.some((e) => e.errors.length === 0) ? "partial" : "failure", j = (a) => {
  const r = a.plugins.flatMap((e) => e.commandExtractors.map((m) => [`${m.pluginName}:${m.commandName}`, m]));
  return new Map(r);
}, w = (a, r, e, m = l) => {
  const s = P(a, r, e, m);
  return {
    pluginName: s.pluginName,
    commandName: s.commandName,
    args: s.args,
    error: s.error
  };
}, H = (a) => a.plugins.map((r) => ({ pluginName: r.pluginName, params: r.params })), K = (a) => a.plugins.map((r) => ({
  pluginName: r.pluginName,
  params: r.params,
  errors: r.errors
}));
export {
  br as AUTHOR_RMMZ,
  y as READ_PLUGIN_MESSAGES,
  Jr as SRC_COLOR,
  G as buildCommandExtractors,
  U as buildParamExtractors,
  g as buildPluginValueExtractor,
  wa as classifyFileParams,
  Ha as classifyPluginParams,
  Ka as classifyTextParams,
  Ia as collectDependentStructNames,
  ka as collectStructsByKinds,
  W as compileCommandExtractorsFromPlugins,
  h as compilePluginAsArraySchema,
  z as compilePluginCommandExtractor,
  Z as compilePluginCommandPairs,
  q as compilePluginParamExtractor,
  Ga as convertPluginCommandSchema,
  Ca as convertPluginsJSToJSON,
  Ua as convertStructSchema,
  Wa as createClassifiedStructMap,
  j as createCommandExtractorMapFromPipeline,
  S as createDeepJSONParserHandlers,
  _ as createDefaultPluginExtractionHandlers,
  Q as createPluginCommandExtractor,
  X as createPluginCommandExtractorMap,
  Y as createPluginParamDictionary,
  H as createPluginParamsFromPipeline,
  K as createPluginParamsWithErrorsFromPipeline,
  aa as createPluginValueExtractor,
  ra as createPluginValuesPath,
  ea as createPrimiteveParamPath,
  za as createStructMap,
  sa as createStructParamPath,
  ma as createTextParamDictionary,
  Or as domainNames,
  ta as extractAllPluginValues,
  P as extractArgsFromPluginCommand,
  na as extractCommandArgsByKey,
  ia as extractPluginCommandArgs,
  w as extractPluginCommandWithExtractor,
  d as extractPluginParamFromRecord,
  Ba as filterPluginParamByText,
  Fa as filterPluginSchemaByFileParam,
  Za as filterPluginSchemaByFn,
  ba as filterPluginSchemaByNumberParam,
  Ja as filterPluginSchemaByParam,
  Oa as filterPluginSchemaByVariableParam,
  qa as filterPluginSchemaStringParams,
  Qa as filterStructParamsByFn,
  oa as generatePluginAnnotation,
  la as generatePluginAnnotationLines,
  ca as generatePluginAnnotationText,
  ua as getPathFromStructArraySchema,
  pa as getPathFromStructParam,
  ga as getPathFromStructSchema,
  Xa as hasNumberValueParam,
  Ya as hasScalarAttr,
  ar as hasStructAttr,
  rr as hasTextAttr,
  er as isArrayAttr,
  sr as isArrayParam,
  mr as isArrayParamEx,
  da as isCommandArgValue,
  Ra as isErrorStructParam,
  tr as isFileAttr,
  nr as isNumberArrayParam,
  ir as isNumberAttr,
  or as isNumberValueParam,
  lr as isNumberValueParamEx,
  Va as isRmmzDataKind,
  cr as isScalarParam,
  ur as isStringArrayParam,
  pr as isStringValueParam,
  gr as isStructArrayAttr,
  dr as isStructArrayParam,
  Pr as isStructAttr,
  Sr as isStructParam,
  Rr as isValidNumber,
  Nr as isVariableAttr,
  Pa as ispluginParamValue,
  Da as lookupKind,
  Sa as makeScalarArrayPath,
  Na as makeScalarValuesPath,
  ha as mergeCommandMap,
  $a as omitPluginParam,
  hr as paramHasText,
  yr as parseDeepJSON,
  l as parseDeepRecord,
  va as parsePlugin,
  N as parsePluginByLocale,
  o as parsePluginParamRecord2,
  ya as pluginComamndName,
  Ma as pluginSourceToArraySchema,
  Ta as pluginSourceToJSON,
  f as readAllPluginBodies,
  E as readPluginInfosSafe,
  _a as rebuildCommands,
  Ea as replacePluginParams,
  xa as replacePluginValue,
  fa as replaceRuntimePluginCommand,
  L as runPluginExtractionPipeline,
  Er as stringifyDeepJSON,
  xr as stringifyDeepRecord,
  fr as structDependencies,
  Ar as toArrayPluginParam,
  Cr as toObjectPluginParams,
  Br as toObjectPluginParamsOld,
  La as validatePluginJS
};
