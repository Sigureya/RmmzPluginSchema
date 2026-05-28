import { JSONPathJS as p } from "jsonpath-js";
import { buildPluginValueExtractor as g, extractPluginParamFromRecord as d, extractArgsFromPluginCommand as P } from "../features/features.es.js";
import { buildCommandExtractors as G, buildParamExtractors as U, compileCommandExtractorsFromPlugins as W, compilePluginCommandExtractor as q, compilePluginCommandPairs as z, compilePluginParamExtractor as Z, createPluginCommandExtractor as Q, createPluginCommandExtractorMap as X, createPluginValueExtractor as Y, createPluginValuesPath as aa, createPrimiteveParamPath as ra, createStructParamPath as ea, extractAllPluginValues as sa, extractCommandArgsByKey as ma, extractPluginCommandArgs as ta, generatePluginAnnotation as na, generatePluginAnnotationLines as ia, generatePluginAnnotationText as oa, getPathFromStructArraySchema as la, getPathFromStructParam as ua, getPathFromStructSchema as ca, isCommandArgValue as pa, ispluginParamValue as ga, makeScalarArrayPath as da, makeScalarValuesPath as Pa, mergeCommandMap as Na, pluginComamndName as Sa } from "../features/features.es.js";
import { p as o, c as N, a as S, b as h } from "../shared/index.es.js";
import { d as ya, e as Ea, f as xa, g as fa, h as Aa, i as Ca, j as ba, k as Fa, l as Ba, m as Ja, o as Oa, n as Ra, q as Va, r as $a, s as va, t as Da, u as Ma, v as _a, w as Ta } from "../shared/index.es.js";
import { p as l } from "../shared/structMap.es.js";
import { c as wa, a as La, b as ka, d as Ia, e as Ka, f as Ha, g as Ga, h as Ua, i as Wa, j as qa, k as za, l as Za, m as Qa, n as Xa, o as Ya, q as ar, r as rr, s as er, t as sr, u as mr, v as tr, w as nr, x as ir, y as or, z as lr, A as ur, B as cr, C as pr, D as gr, E as dr, F as Pr, G as Nr } from "../shared/structMap.es.js";
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
}, b = {
  commandNotFoundError: (a) => ({
    message: `undefined command: ${a.pluginName}:${a.commandName}`,
    source: "commandNotFoundError"
  }),
  commandParseError: (a, r) => ({ message: `parse failed: ${a.pluginName}:${a.commandName}: ${String(r)}`, source: "commandParseError" }),
  commandArgsError: (a, r) => ({ message: `extract args failed: ${a.pluginName}:${a.commandName}: ${String(r)}`, source: "commandArgsError" })
}, F = { commandStructPathError: (a, r) => ({
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
}) }, B = {
  paramStructPathError: (a, r) => ({ code: r.code, source: "createPath", pluginName: a.pluginName, paramName: a.paramName, path: r.path, message: `${r.code}: ${r.path}` }),
  paramCompileJSONPathSchemaError: (a, r) => ({ code: "compile_jsonpath_schema_error", source: "compileJSONPathSchema", pluginName: a.pluginName, paramName: a.paramName, message: String(r) })
}, T = (a) => ({
  parser: { parsePluginList: (r, e) => o(r, e), parsePluginBody: (r) => S(r), parseDeepRecord: (r) => l(r) },
  jsonPath: (r) => new p(r),
  deepJSON: N(),
  paramBuild: B,
  commandBuild: F,
  paramRead: a,
  commandExtract: b
}), j = async (a, r, e = {}) => {
  const m = e.messages ?? y, s = await E(m, () => a.readPluginList(), (u, c) => r.parser.parsePluginList(u, c)), t = await Promise.all(O(s, m, a, r)), n = J(s, t);
  return { status: $(t, n), plugins: t, allErrors: n };
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
    errors: a.error ? [{ phase: "parsePluginBody", pluginName: e, message: "plugin body parse failed" }] : []
  };
  const m = h(a.plugin, r.deepJSON), s = g(e, m, r.jsonPath, r.paramBuild, r.commandBuild), t = d(a.record, s.params.extractors, r.parser.parseDeepRecord, r.paramRead);
  return {
    pluginName: e,
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
}, $ = (a, r) => r.length === 0 ? "success" : a.some((e) => e.errors.length === 0) ? "partial" : "failure", w = (a) => {
  const r = a.plugins.flatMap((e) => e.commandExtractors.map((m) => [`${m.pluginName}:${m.commandName}`, m]));
  return new Map(r);
}, L = (a, r, e, m = l) => {
  const s = P(a, r, e, m);
  return {
    pluginName: s.pluginName,
    commandName: s.commandName,
    args: s.args,
    error: s.error
  };
}, k = (a) => a.plugins.map((r) => ({ pluginName: r.pluginName, params: r.params })), I = (a) => a.plugins.map((r) => ({
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
  wa as classifyFileParams,
  La as classifyPluginParams,
  ka as classifyTextParams,
  ya as collectDependentStructNames,
  W as compileCommandExtractorsFromPlugins,
  h as compilePluginAsArraySchema,
  q as compilePluginCommandExtractor,
  z as compilePluginCommandPairs,
  Z as compilePluginParamExtractor,
  Ia as convertPluginCommandSchema,
  Ea as convertPluginsJSToJSON,
  Ka as convertStructSchema,
  Ha as createClassifiedStructMap,
  w as createCommandExtractorMapFromPipeline,
  T as createDefaultPluginExtractionHandlers,
  Q as createPluginCommandExtractor,
  X as createPluginCommandExtractorMap,
  k as createPluginParamsFromPipeline,
  I as createPluginParamsWithErrorsFromPipeline,
  Y as createPluginValueExtractor,
  aa as createPluginValuesPath,
  ra as createPrimiteveParamPath,
  Ga as createStructMap,
  ea as createStructParamPath,
  Er as domainNames,
  sa as extractAllPluginValues,
  P as extractArgsFromPluginCommand,
  ma as extractCommandArgsByKey,
  ta as extractPluginCommandArgs,
  L as extractPluginCommandWithExtractor,
  d as extractPluginParamFromRecord,
  xa as filterPluginParamByText,
  fa as filterPluginSchemaByFileParam,
  Aa as filterPluginSchemaByNumberParam,
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
  qa as hasStructAttr,
  za as hasTextAttr,
  Za as isArrayAttr,
  Qa as isArrayParam,
  Xa as isArrayParamEx,
  pa as isCommandArgValue,
  Fa as isErrorStructParam,
  Ya as isFileAttr,
  ar as isNumberArrayParam,
  rr as isNumberAttr,
  er as isNumberValueParam,
  sr as isNumberValueParamEx,
  Ba as isRmmzDataKind,
  mr as isScalarParam,
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
  f as readAllPluginBodies,
  E as readPluginInfosSafe,
  va as rebuildCommands,
  j as runPluginExtractionPipeline,
  Da as stringifyDeepJSON,
  Ma as stringifyDeepRecord,
  _a as structDependencies,
  dr as toArrayPluginParam,
  Pr as toObjectPluginParams,
  Nr as toObjectPluginParamsOld,
  Ta as validatePluginJS
};
