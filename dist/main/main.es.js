import { JSONPathJS as p } from "jsonpath-js";
import { buildPluginValueExtractor as g, extractPluginParamFromRecord as d, extractArgsFromPluginCommand as P } from "../features/features.es.js";
import { buildCommandExtractors as G, buildParamExtractors as U, compileCommandExtractorsFromPlugins as W, compilePluginCommandExtractor as z, compilePluginCommandPairs as Z, compilePluginParamExtractor as q, createPluginCommandExtractor as Q, createPluginCommandExtractorMap as X, createPluginParamDictionary as Y, createPluginValueExtractor as aa, createPluginValuesPath as ra, createPrimiteveParamPath as ea, createStructParamPath as sa, createTextParamDictionary as ma, extractAllPluginValues as ta, extractCommandArgsByKey as na, extractPluginCommandArgs as ia, generatePluginAnnotation as oa, generatePluginAnnotationLines as la, generatePluginAnnotationText as ca, getPathFromStructArraySchema as ua, getPathFromStructParam as pa, getPathFromStructSchema as ga, isCommandArgValue as da, ispluginParamValue as Pa, makeScalarArrayPath as Sa, makeScalarValuesPath as Na, mergeCommandMap as ha, pluginComamndName as ya, replacePluginValue as Ea, replaceRuntimePluginCommand as xa } from "../features/features.es.js";
import { parsePluginParamRecord2 as o, createDeepJSONParserHandlers as S, parsePluginByLocale as N, compilePluginAsArraySchema as h } from "../rmmz/rmmz.es.js";
import { convertPluginsJSToJSON as Aa, filterPluginParamByText as Ca, filterPluginSchemaByFileParam as Ba, filterPluginSchemaByNumberParam as Fa, filterPluginSchemaByParam as ba, filterPluginSchemaByVariableParam as Ja, isErrorStructParam as Oa, isRmmzDataKind as Ra, lookupKind as Va, omitPluginParam as Da, parsePlugin as $a, pluginSourceToArraySchema as va, pluginSourceToJSON as Ma, rebuildCommands as Ta, validatePluginJS as _a } from "../rmmz/rmmz.es.js";
import { p as l } from "../shared/structMap.es.js";
import { c as ja, a as wa, b as Ha, d as Ka, e as Ia, f as ka, g as Ga, h as Ua, i as Wa, j as za, k as Za, l as qa, m as Qa, n as Xa, o as Ya, q as ar, r as rr, s as er, t as sr, u as mr, v as tr, w as nr, x as ir, y as or, z as lr, A as cr, B as ur, C as pr, D as gr, E as dr, F as Pr, G as Sr, H as Nr, I as hr, J as yr, K as Er, L as xr, M as fr, N as Ar, O as Cr } from "../shared/structMap.es.js";
import { AUTHOR_RMMZ as Fr, SRC_COLOR as br, domainNames as Jr, isValidNumber as Or } from "../libs/libs.es.js";
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
  Fr as AUTHOR_RMMZ,
  y as READ_PLUGIN_MESSAGES,
  br as SRC_COLOR,
  G as buildCommandExtractors,
  U as buildParamExtractors,
  g as buildPluginValueExtractor,
  ja as classifyFileParams,
  wa as classifyPluginParams,
  Ha as classifyTextParams,
  Ka as collectDependentStructNames,
  Ia as collectStructsByKinds,
  W as compileCommandExtractorsFromPlugins,
  h as compilePluginAsArraySchema,
  z as compilePluginCommandExtractor,
  Z as compilePluginCommandPairs,
  q as compilePluginParamExtractor,
  ka as convertPluginCommandSchema,
  Aa as convertPluginsJSToJSON,
  Ga as convertStructSchema,
  Ua as createClassifiedStructMap,
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
  Wa as createStructMap,
  sa as createStructParamPath,
  ma as createTextParamDictionary,
  Jr as domainNames,
  ta as extractAllPluginValues,
  P as extractArgsFromPluginCommand,
  na as extractCommandArgsByKey,
  ia as extractPluginCommandArgs,
  w as extractPluginCommandWithExtractor,
  d as extractPluginParamFromRecord,
  Ca as filterPluginParamByText,
  Ba as filterPluginSchemaByFileParam,
  za as filterPluginSchemaByFn,
  Fa as filterPluginSchemaByNumberParam,
  ba as filterPluginSchemaByParam,
  Ja as filterPluginSchemaByVariableParam,
  Za as filterPluginSchemaStringParams,
  qa as filterStructParamsByFn,
  oa as generatePluginAnnotation,
  la as generatePluginAnnotationLines,
  ca as generatePluginAnnotationText,
  ua as getPathFromStructArraySchema,
  pa as getPathFromStructParam,
  ga as getPathFromStructSchema,
  Qa as hasNumberValueParam,
  Xa as hasScalarAttr,
  Ya as hasStructAttr,
  ar as hasTextAttr,
  rr as isArrayAttr,
  er as isArrayParam,
  sr as isArrayParamEx,
  da as isCommandArgValue,
  Oa as isErrorStructParam,
  mr as isFileAttr,
  tr as isNumberArrayParam,
  nr as isNumberAttr,
  ir as isNumberValueParam,
  or as isNumberValueParamEx,
  Ra as isRmmzDataKind,
  lr as isScalarParam,
  cr as isStringArrayParam,
  ur as isStringValueParam,
  pr as isStructArrayAttr,
  gr as isStructArrayParam,
  dr as isStructAttr,
  Pr as isStructParam,
  Or as isValidNumber,
  Sr as isVariableAttr,
  Pa as ispluginParamValue,
  Va as lookupKind,
  Sa as makeScalarArrayPath,
  Na as makeScalarValuesPath,
  ha as mergeCommandMap,
  Da as omitPluginParam,
  Nr as paramHasText,
  hr as parseDeepJSON,
  l as parseDeepRecord,
  $a as parsePlugin,
  N as parsePluginByLocale,
  o as parsePluginParamRecord2,
  ya as pluginComamndName,
  va as pluginSourceToArraySchema,
  Ma as pluginSourceToJSON,
  f as readAllPluginBodies,
  E as readPluginInfosSafe,
  Ta as rebuildCommands,
  Ea as replacePluginValue,
  xa as replaceRuntimePluginCommand,
  L as runPluginExtractionPipeline,
  yr as stringifyDeepJSON,
  Er as stringifyDeepRecord,
  xr as structDependencies,
  fr as toArrayPluginParam,
  Ar as toObjectPluginParams,
  Cr as toObjectPluginParamsOld,
  _a as validatePluginJS
};
