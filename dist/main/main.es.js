import { JSONPathJS as p } from "jsonpath-js";
import { buildPluginValueExtractor as g, extractPluginParamFromRecord as d, extractArgsFromPluginCommand as P } from "../features/features.es.js";
import { buildCommandExtractors as G, buildParamExtractors as U, compileCommandExtractorsFromPlugins as W, compilePluginCommandExtractor as z, compilePluginCommandPairs as Z, compilePluginParamExtractor as q, createPluginCommandExtractor as Q, createPluginCommandExtractorMap as X, createPluginValueExtractor as Y, createPluginValuesPath as aa, createPrimiteveParamPath as ra, createStructParamPath as ea, extractAllPluginValues as ma, extractCommandArgsByKey as sa, extractPluginCommandArgs as ta, generatePluginAnnotation as na, generatePluginAnnotationLines as ia, generatePluginAnnotationText as oa, getPathFromStructArraySchema as la, getPathFromStructParam as ua, getPathFromStructSchema as ca, isCommandArgValue as pa, ispluginParamValue as ga, makeScalarArrayPath as da, makeScalarValuesPath as Pa, mergeCommandMap as Na, pluginComamndName as Sa } from "../features/features.es.js";
import { parsePluginParamRecord2 as o, createDeepJSONParserHandlers as N, parsePluginByLocale as S, compilePluginAsArraySchema as h } from "../rmmz/rmmz.es.js";
import { collectDependentStructNames as ya, convertPluginsJSToJSON as Ea, filterPluginParamByText as xa, filterPluginSchemaByFileParam as Aa, filterPluginSchemaByNumberParam as fa, filterPluginSchemaByParam as Ca, filterPluginSchemaByVariableParam as ba, isErrorStructParam as Ba, isRmmzDataKind as Fa, lookupKind as Ja, omitPluginParam as Oa, parsePlugin as Ra, pluginSourceToArraySchema as Va, pluginSourceToJSON as $a, rebuildCommands as Da, stringifyDeepJSON as va, stringifyDeepRecord as Ma, structDependencies as _a, validatePluginJS as La } from "../rmmz/rmmz.es.js";
import { p as l } from "../shared/structMap.es.js";
import { c as ja, a as wa, b as Ha, d as Ia, e as Ka, f as ka, g as Ga, h as Ua, i as Wa, j as za, k as Za, l as qa, m as Qa, n as Xa, o as Ya, q as ar, r as rr, s as er, t as mr, u as sr, v as tr, w as nr, x as ir, y as or, z as lr, A as ur, B as cr, C as pr, D as gr, E as dr, F as Pr, G as Nr } from "../shared/structMap.es.js";
import { AUTHOR_RMMZ as hr, SRC_COLOR as yr, domainNames as Er, isValidNumber as xr } from "../libs/libs.es.js";
const y = {
  readErrorPluginsJS: "Failed to read plugins.js",
  readErrorPluginBody: "Failed to read plugin file",
  parseError: "Failed to parse plugin",
  notArray: "Plugin format is invalid: not an array",
  partialSuccess: "Some plugins failed to read or parse",
  success: "All plugins read and parsed successfully"
}, E = async (a, r, e = o) => {
  try {
    const s = await r();
    return x(s, a, e);
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
}, A = (a, r, e, s) => a.plugins.map((m) => f(m, r, e, s)), f = async (a, r, e, s) => {
  try {
    const m = await e(a.name);
    return { record: a, plugin: C(m, s), error: "" };
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
}, b = {
  commandNotFoundError: (a) => ({
    message: `undefined command: ${a.pluginName}:${a.commandName}`,
    source: "commandNotFoundError"
  }),
  commandParseError: (a, r) => ({ message: `parse failed: ${a.pluginName}:${a.commandName}: ${String(r)}`, source: "commandParseError" }),
  commandArgsError: (a, r) => ({ message: `extract args failed: ${a.pluginName}:${a.commandName}: ${String(r)}`, source: "commandArgsError" })
}, B = { commandStructPathError: (a, r) => ({
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
}) }, F = {
  paramStructPathError: (a, r) => ({ code: r.code, source: "createPath", pluginName: a.pluginName, paramName: a.paramName, path: r.path, message: `${r.code}: ${r.path}` }),
  paramCompileJSONPathSchemaError: (a, r) => ({ code: "compile_jsonpath_schema_error", source: "compileJSONPathSchema", pluginName: a.pluginName, paramName: a.paramName, message: String(r) })
}, L = (a) => ({
  parser: { parsePluginList: (r, e) => o(r, e), parsePluginBody: (r) => S(r), parseDeepRecord: (r) => l(r) },
  jsonPath: (r) => new p(r),
  deepJSON: N(),
  paramBuild: F,
  commandBuild: B,
  paramRead: a,
  commandExtract: b
}), T = async (a, r, e = {}) => {
  const s = e.messages ?? y, m = await E(s, () => a.readPluginList(), (u, c) => r.parser.parsePluginList(u, c)), t = await Promise.all(O(m, s, a, r)), n = J(m, t);
  return { status: $(t, n), plugins: t, allErrors: n };
}, J = (a, r) => !a.complete || a.invalidPlugins > 0 ? [{ phase: "readPluginList", pluginName: "", message: a.message, detail: {
  invalidPlugins: a.invalidPlugins,
  complete: a.complete
} }, ...i(r)] : i(r), i = (a) => a.flatMap((r) => r.errors.map((e) => ({
  ...e,
  pluginName: r.pluginName
}))), O = (a, r, e, s) => A(a, r, (m) => e.readPluginBody(m), (m) => s.parser.parsePluginBody(m)).map(async (m) => R(await m, s)), R = (a, r) => {
  const e = a.record.name;
  if (a.plugin === null) return {
    pluginName: a.record.name,
    record: a.record,
    params: [],
    commandExtractors: [],
    errors: a.error ? [{ phase: "parsePluginBody", pluginName: e, message: "plugin body parse failed" }] : []
  };
  const s = h(a.plugin, r.deepJSON), m = g(e, s, r.jsonPath, r.paramBuild, r.commandBuild), t = d(a.record, m.params.extractors, r.parser.parseDeepRecord, r.paramRead);
  return {
    pluginName: e,
    record: a.record,
    params: t.params,
    commandExtractors: m.commands.extractors,
    errors: V(e, m, t)
  };
}, V = (a, r, e) => {
  const s = [];
  return s.push(...r.params.errors.map((m) => ({
    phase: "buildParam",
    pluginName: a,
    message: m.message,
    detail: m
  }))), s.push(...r.commands.errors.map((m) => ({ phase: "buildCommand", pluginName: a, message: m.message, detail: m }))), e.errorKind === "parseError" && s.push({ phase: "parseParam", pluginName: a, message: "plugin parameter parse failed", errorInfo: e.errorInfo || void 0 }), s;
}, $ = (a, r) => r.length === 0 ? "success" : a.some((e) => e.errors.length === 0) ? "partial" : "failure", j = (a) => {
  const r = a.plugins.flatMap((e) => e.commandExtractors.map((s) => [`${s.pluginName}:${s.commandName}`, s]));
  return new Map(r);
}, w = (a, r, e, s = l) => {
  const m = P(a, r, e, s);
  return {
    pluginName: m.pluginName,
    commandName: m.commandName,
    args: m.args,
    error: m.error
  };
}, H = (a) => a.plugins.map((r) => ({ pluginName: r.pluginName, params: r.params })), I = (a) => a.plugins.map((r) => ({
  pluginName: r.pluginName,
  params: r.params,
  errors: r.errors
}));
export {
  hr as AUTHOR_RMMZ,
  y as READ_PLUGIN_MESSAGES,
  yr as SRC_COLOR,
  G as buildCommandExtractors,
  U as buildParamExtractors,
  g as buildPluginValueExtractor,
  ja as classifyFileParams,
  wa as classifyPluginParams,
  Ha as classifyTextParams,
  ya as collectDependentStructNames,
  W as compileCommandExtractorsFromPlugins,
  h as compilePluginAsArraySchema,
  z as compilePluginCommandExtractor,
  Z as compilePluginCommandPairs,
  q as compilePluginParamExtractor,
  Ia as convertPluginCommandSchema,
  Ea as convertPluginsJSToJSON,
  Ka as convertStructSchema,
  ka as createClassifiedStructMap,
  j as createCommandExtractorMapFromPipeline,
  N as createDeepJSONParserHandlers,
  L as createDefaultPluginExtractionHandlers,
  Q as createPluginCommandExtractor,
  X as createPluginCommandExtractorMap,
  H as createPluginParamsFromPipeline,
  I as createPluginParamsWithErrorsFromPipeline,
  Y as createPluginValueExtractor,
  aa as createPluginValuesPath,
  ra as createPrimiteveParamPath,
  Ga as createStructMap,
  ea as createStructParamPath,
  Er as domainNames,
  ma as extractAllPluginValues,
  P as extractArgsFromPluginCommand,
  sa as extractCommandArgsByKey,
  ta as extractPluginCommandArgs,
  w as extractPluginCommandWithExtractor,
  d as extractPluginParamFromRecord,
  xa as filterPluginParamByText,
  Aa as filterPluginSchemaByFileParam,
  fa as filterPluginSchemaByNumberParam,
  Ca as filterPluginSchemaByParam,
  ba as filterPluginSchemaByVariableParam,
  na as generatePluginAnnotation,
  ia as generatePluginAnnotationLines,
  oa as generatePluginAnnotationText,
  la as getPathFromStructArraySchema,
  ua as getPathFromStructParam,
  ca as getPathFromStructSchema,
  Ua as hasNumberValueParam,
  Wa as hasScalarAttr,
  za as hasStructAttr,
  Za as hasTextAttr,
  qa as isArrayAttr,
  Qa as isArrayParam,
  Xa as isArrayParamEx,
  pa as isCommandArgValue,
  Ba as isErrorStructParam,
  Ya as isFileAttr,
  ar as isNumberArrayParam,
  rr as isNumberAttr,
  er as isNumberValueParam,
  mr as isNumberValueParamEx,
  Fa as isRmmzDataKind,
  sr as isScalarParam,
  tr as isStringArrayParam,
  nr as isStringValueParam,
  ir as isStructArrayAttr,
  or as isStructArrayParam,
  lr as isStructAttr,
  ur as isStructParam,
  xr as isValidNumber,
  cr as isVariableAttr,
  ga as ispluginParamValue,
  Ja as lookupKind,
  da as makeScalarArrayPath,
  Pa as makeScalarValuesPath,
  Na as mergeCommandMap,
  Oa as omitPluginParam,
  pr as paramHasText,
  gr as parseDeepJSON,
  l as parseDeepRecord,
  Ra as parsePlugin,
  S as parsePluginByLocale,
  o as parsePluginParamRecord2,
  Sa as pluginComamndName,
  Va as pluginSourceToArraySchema,
  $a as pluginSourceToJSON,
  A as readAllPluginBodies,
  E as readPluginInfosSafe,
  Da as rebuildCommands,
  T as runPluginExtractionPipeline,
  va as stringifyDeepJSON,
  Ma as stringifyDeepRecord,
  _a as structDependencies,
  dr as toArrayPluginParam,
  Pr as toObjectPluginParams,
  Nr as toObjectPluginParamsOld,
  La as validatePluginJS
};
