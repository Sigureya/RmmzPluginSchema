import { replacePluginValue as l, createPluginParamDictionary as p, createPluginCommandMap as g, buildPluginValueExtractor as P, extractPluginParamFromRecord as d } from "../features/features.es.js";
import { buildCommandExtractors as Z, buildParamExtractors as q, buildSingleCommand as Q, compileCommandExtractorsFromPlugins as X, compilePluginCommandExtractor as Y, compilePluginCommandPairs as aa, compilePluginParamExtractor as ra, createCommandExtractorMapFromPipeline as ea, createPluginCommandExtractor as sa, createPluginCommandExtractorMap as ma, createPluginValueExtractor as ta, createPluginValuesPath as na, createPrimiteveParamPath as ia, createStructParamPath as la, createTextParamDictionary as oa, extractAllPluginValues as ca, extractArgsFromPluginCommand as ua, extractCommandArgsByKey as pa, extractPluginCommandArgs as ga, extractPluginCommandWithExtractor as Pa, generatePluginAnnotation as da, generatePluginAnnotationLines as Sa, generatePluginAnnotationText as ha, getPathFromStructArraySchema as Na, getPathFromStructParam as ya, getPathFromStructSchema as fa, isCommandArgValue as Ea, ispluginParamValue as xa, makeScalarArrayPath as Aa, makeScalarValuesPath as Ca, mergeCommandMap as Ba, pluginComamndName as ba, replacePluginParams as Fa, replaceRuntimePluginCommand as Ja } from "../features/features.es.js";
import { s as S, p as h } from "../shared/structMap.es.js";
import { c as Oa, a as Ra, b as Va, d as Ma, e as va, f as $a, g as Ta, h as _a, i as La, j as ja, k as wa, l as Ha, m as Ka, n as Ia, o as ka, q as Ga, r as Ua, t as Wa, u as za, v as Za, w as qa, x as Qa, y as Xa, z as Ya, A as ar, B as rr, C as er, D as sr, E as mr, F as tr, G as nr, H as ir, I as lr, J as or, K as cr, L as ur, M as pr, N as gr, O as Pr } from "../shared/structMap.es.js";
import { JSONPathJS as N } from "jsonpath-js";
import { parsePluginParamRecord as o, createDeepJSONParserHandlers as y, parsePluginByLocale as f, compilePluginAsArraySchema as E } from "../rmmz/rmmz.es.js";
import { convertPluginsJSToJSON as Sr, filterPluginParamByText as hr, filterPluginSchemaByFileParam as Nr, filterPluginSchemaByNumberParam as yr, filterPluginSchemaByParam as fr, filterPluginSchemaByVariableParam as Er, isErrorStructParam as xr, isRmmzDataKind as Ar, lookupKind as Cr, omitPluginParam as Br, parsePlugin as br, parsePluginParamRecord2 as Fr, pluginSourceToArraySchema as Jr, pluginSourceToJSON as Dr, rebuildCommands as Or, stringifyPluginsJS as Rr, validatePluginJS as Vr } from "../rmmz/rmmz.es.js";
import { AUTHOR_RMMZ as vr, SRC_COLOR as $r, domainNames as Tr, isValidNumber as _r } from "../libs/libs.es.js";
const x = {
  readErrorPluginsJS: "Failed to read plugins.js",
  readErrorPluginBody: "Failed to read plugin file",
  parseError: "Failed to parse plugin",
  notArray: "Plugin format is invalid: not an array",
  partialSuccess: "Some plugins failed to read or parse",
  success: "All plugins read and parsed successfully"
}, A = async (a, r, e = o) => {
  try {
    const m = await r();
    return C(m, a, e);
  } catch {
    return {
      message: a.readErrorPluginsJS,
      plugins: [],
      invalidPlugins: 0,
      complete: !1
    };
  }
}, C = (a, r, e) => {
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
}, B = (a, r, e, m) => a.plugins.map((s) => b(s, r, e, m)), b = async (a, r, e, m) => {
  try {
    const s = await e(a.name);
    return { record: a, plugin: F(s, m), error: "" };
  } catch {
    return {
      record: a,
      plugin: null,
      error: r.readErrorPluginBody
    };
  }
}, F = (a, r) => {
  try {
    return r(a);
  } catch {
    return null;
  }
}, w = (a, r, e) => {
  const m = p(a.name, r), s = l(a.parameters, m.paramsPath, e);
  return {
    pluginName: a.name,
    desc: a.description,
    commands: m.commands,
    paramsPath: m.paramsPath,
    params: s
  };
}, H = (a, r) => {
  const e = l(a.params, a.paramsPath, r);
  return {
    description: a.desc,
    name: a.pluginName,
    parameters: S(e),
    status: !0
  };
}, K = (a) => g(a), J = { commandNotFoundError: (a) => ({
  message: `undefined command: ${a.pluginName}:${a.commandName}`,
  source: "commandNotFoundError"
}), commandParseError: (a, r) => ({ message: `parse failed: ${a.pluginName}:${a.commandName}: ${String(r)}`, source: "commandParseError" }), commandArgsError: (a, r) => ({
  message: `extract args failed: ${a.pluginName}:${a.commandName}: ${String(r)}`,
  source: "commandArgsError"
}) }, D = { commandStructPathError: (a, r) => ({
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
}) }, O = {
  paramStructPathError: (a, r) => ({ code: r.code, source: "createPath", pluginName: a.pluginName, paramName: a.paramName, path: r.path, message: `${r.code}: ${r.path}` }),
  paramCompileJSONPathSchemaError: (a, r) => ({ code: "compile_jsonpath_schema_error", source: "compileJSONPathSchema", pluginName: a.pluginName, paramName: a.paramName, message: String(r) })
}, I = (a) => ({
  parser: { parsePluginList: (r, e) => o(r, e), parsePluginBody: (r) => f(r), parseDeepRecord: (r) => h(r) },
  jsonPath: (r) => new N(r),
  deepJSON: y(),
  paramBuild: O,
  commandBuild: D,
  paramRead: a,
  commandExtract: J
}), k = async (a, r, e = {}) => {
  const m = e.messages ?? x, s = await A(m, () => a.readPluginList(), (c, u) => r.parser.parsePluginList(c, u)), t = await Promise.all(V(s, m, a, r)), n = R(s, t);
  return {
    status: $(t, n),
    plugins: t,
    allErrors: n
  };
}, R = (a, r) => !a.complete || a.invalidPlugins > 0 ? [{ phase: "readPluginList", pluginName: "", message: a.message, detail: {
  invalidPlugins: a.invalidPlugins,
  complete: a.complete
} }, ...i(r)] : i(r), i = (a) => a.flatMap((r) => r.errors.map((e) => ({
  ...e,
  pluginName: r.pluginName
}))), V = (a, r, e, m) => B(a, r, (s) => e.readPluginBody(s), (s) => m.parser.parsePluginBody(s)).map(async (s) => M(await s, m)), M = (a, r) => {
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
  const m = E(a.plugin, r.deepJSON), s = P(e, m, r.jsonPath, r.paramBuild, r.commandBuild), t = d(a.record, s.params.extractors, r.parser.parseDeepRecord, r.paramRead);
  return {
    pluginName: e,
    schema: m,
    record: a.record,
    params: t.params,
    commandExtractors: s.commands.extractors,
    errors: v(e, s, t)
  };
}, v = (a, r, e) => {
  const m = [];
  return m.push(...r.params.errors.map((s) => ({
    phase: "buildParam",
    pluginName: a,
    message: s.message,
    detail: s
  }))), m.push(...r.commands.errors.map((s) => ({ phase: "buildCommand", pluginName: a, message: s.message, detail: s }))), e.errorKind === "parseError" && m.push({ phase: "parseParam", pluginName: a, message: "plugin parameter parse failed", errorInfo: e.errorInfo || void 0 }), m;
}, $ = (a, r) => r.length === 0 ? "success" : a.some((e) => e.errors.length === 0) ? "partial" : "failure", G = (a) => a.plugins.map((r) => ({
  pluginName: r.pluginName,
  params: r.params
})), U = (a) => a.plugins.map((r) => ({ pluginName: r.pluginName, params: r.params, errors: r.errors }));
export {
  vr as AUTHOR_RMMZ,
  x as READ_PLUGIN_MESSAGES,
  $r as SRC_COLOR,
  Z as buildCommandExtractors,
  q as buildParamExtractors,
  P as buildPluginValueExtractor,
  H as buildRuntimeData,
  Q as buildSingleCommand,
  Oa as classifyFileParams,
  Ra as classifyPluginParams,
  Va as classifyTextParams,
  Ma as collectDependentStructNames,
  va as collectStructsByKinds,
  X as compileCommandExtractorsFromPlugins,
  E as compilePluginAsArraySchema,
  Y as compilePluginCommandExtractor,
  aa as compilePluginCommandPairs,
  ra as compilePluginParamExtractor,
  $a as convertPluginCommandSchema,
  Sr as convertPluginsJSToJSON,
  Ta as convertStructSchema,
  _a as createClassifiedStructMap,
  ea as createCommandExtractorMapFromPipeline,
  y as createDeepJSONParserHandlers,
  I as createDefaultPluginExtractionHandlers,
  w as createManifestData,
  sa as createPluginCommandExtractor,
  ma as createPluginCommandExtractorMap,
  g as createPluginCommandMap,
  K as createPluginCommandMapFromManifestData,
  p as createPluginParamDictionary,
  G as createPluginParamsFromPipeline,
  U as createPluginParamsWithErrorsFromPipeline,
  ta as createPluginValueExtractor,
  na as createPluginValuesPath,
  ia as createPrimiteveParamPath,
  La as createStructMap,
  la as createStructParamPath,
  oa as createTextParamDictionary,
  Tr as domainNames,
  ca as extractAllPluginValues,
  ua as extractArgsFromPluginCommand,
  pa as extractCommandArgsByKey,
  ga as extractPluginCommandArgs,
  Pa as extractPluginCommandWithExtractor,
  d as extractPluginParamFromRecord,
  hr as filterPluginParamByText,
  Nr as filterPluginSchemaByFileParam,
  ja as filterPluginSchemaByFn,
  yr as filterPluginSchemaByNumberParam,
  fr as filterPluginSchemaByParam,
  Er as filterPluginSchemaByVariableParam,
  wa as filterPluginSchemaStringParams,
  Ha as filterStructParamsByFn,
  da as generatePluginAnnotation,
  Sa as generatePluginAnnotationLines,
  ha as generatePluginAnnotationText,
  Na as getPathFromStructArraySchema,
  ya as getPathFromStructParam,
  fa as getPathFromStructSchema,
  Ka as hasNumberValueParam,
  Ia as hasScalarAttr,
  ka as hasStructAttr,
  Ga as hasTextAttr,
  Ua as isArrayAttr,
  Wa as isArrayParam,
  za as isArrayParamEx,
  Ea as isCommandArgValue,
  xr as isErrorStructParam,
  Za as isFileAttr,
  qa as isNumberArrayParam,
  Qa as isNumberAttr,
  Xa as isNumberValueParam,
  Ya as isNumberValueParamEx,
  Ar as isRmmzDataKind,
  ar as isScalarParam,
  rr as isStringArrayParam,
  er as isStringValueParam,
  sr as isStructArrayAttr,
  mr as isStructArrayParam,
  tr as isStructAttr,
  nr as isStructParam,
  _r as isValidNumber,
  ir as isVariableAttr,
  xa as ispluginParamValue,
  Cr as lookupKind,
  Aa as makeScalarArrayPath,
  Ca as makeScalarValuesPath,
  Ba as mergeCommandMap,
  Br as omitPluginParam,
  lr as paramHasText,
  or as parseDeepJSON,
  h as parseDeepRecord,
  br as parsePlugin,
  f as parsePluginByLocale,
  o as parsePluginParamRecord,
  Fr as parsePluginParamRecord2,
  ba as pluginComamndName,
  Jr as pluginSourceToArraySchema,
  Dr as pluginSourceToJSON,
  B as readAllPluginBodies,
  A as readPluginInfosSafe,
  Or as rebuildCommands,
  Fa as replacePluginParams,
  l as replacePluginValue,
  Ja as replaceRuntimePluginCommand,
  k as runPluginExtractionPipeline,
  cr as stringifyDeepJSON,
  S as stringifyDeepRecord,
  Rr as stringifyPluginsJS,
  ur as structDependencies,
  pr as toArrayPluginParam,
  gr as toObjectPluginParams,
  Pr as toObjectPluginParamsOld,
  Vr as validatePluginJS
};
