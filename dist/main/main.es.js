import { replacePluginValue as l, createPluginParamDictionary as p, createPluginCommandMap as g, buildPluginValueExtractor as P, extractPluginParamFromRecord as d } from "../features/features.es.js";
import { buildCommandExtractors as Z, buildParamExtractors as q, buildSingleCommand as Q, compileCommandExtractorsFromPlugins as X, compilePluginCommandExtractor as Y, compilePluginCommandPairs as aa, compilePluginParamExtractor as ra, createCommandExtractorMapFromPipeline as ea, createDeepStringifyHandlers as sa, createPluginCommandExtractor as ma, createPluginCommandExtractorMap as ta, createPluginValueExtractor as na, createPluginValuesPath as ia, createPrimiteveParamPath as la, createStructParamPath as oa, createTextParamDictionary as ca, extractAllPluginValues as ua, extractArgsFromPluginCommand as pa, extractCommandArgsByKey as ga, extractPluginCommandArgs as Pa, extractPluginCommandWithExtractor as da, generatePluginAnnotationLines as Sa, generatePluginAnnotationText as ha, generatePluginAnnotationTokens as Na, getPathFromStructArraySchema as ya, getPathFromStructParam as fa, getPathFromStructSchema as Ea, isCommandArgValue as xa, ispluginParamValue as Aa, makeScalarArrayPath as Ca, makeScalarValuesPath as Ba, mergeCommandMap as ba, pluginComamndName as Fa, replacePluginParams as Da, replaceRuntimePluginCommand as Ja } from "../features/features.es.js";
import { s as S, p as h } from "../shared/structMap.es.js";
import { c as Ra, a as Va, b as Ma, d as va, e as $a, f as Ta, g as _a, h as La, i as ja, j as wa, k as Ha, l as Ka, m as ka, n as Ia, o as Ga, q as Ua, r as Wa, t as za, u as Za, v as qa, w as Qa, x as Xa, y as Ya, z as ar, A as rr, B as er, C as sr, D as mr, E as tr, F as nr, G as ir, H as lr, I as or, J as cr, K as ur, L as pr, M as gr, N as Pr, O as dr } from "../shared/structMap.es.js";
import { JSONPathJS as N } from "jsonpath-js";
import { parsePluginParamRecord as o, createDeepJSONParserHandlers as y, parsePluginByLocale as f, compilePluginAsArraySchema as E } from "../rmmz/rmmz.es.js";
import { convertPluginsJSToJSON as hr, filterPluginParamByText as Nr, filterPluginSchemaByFileParam as yr, filterPluginSchemaByNumberParam as fr, filterPluginSchemaByParam as Er, filterPluginSchemaByVariableParam as xr, isErrorStructParam as Ar, isRmmzDataKind as Cr, lookupKind as Br, omitPluginParam as br, parsePlugin as Fr, parsePluginParamRecord2 as Dr, pluginSourceToArraySchema as Jr, pluginSourceToJSON as Or, rebuildCommands as Rr, stringifyPluginsJS as Vr, validatePluginJS as Mr } from "../rmmz/rmmz.es.js";
import { AUTHOR_RMMZ as $r, SRC_COLOR as Tr, domainNames as _r, isValidNumber as Lr } from "../libs/libs.es.js";
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
}, K = (a) => g(a), D = { commandNotFoundError: (a) => ({
  message: `undefined command: ${a.pluginName}:${a.commandName}`,
  source: "commandNotFoundError"
}), commandParseError: (a, r) => ({ message: `parse failed: ${a.pluginName}:${a.commandName}: ${String(r)}`, source: "commandParseError" }), commandArgsError: (a, r) => ({
  message: `extract args failed: ${a.pluginName}:${a.commandName}: ${String(r)}`,
  source: "commandArgsError"
}) }, J = { commandStructPathError: (a, r) => ({
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
}, k = (a) => ({
  parser: { parsePluginList: (r, e) => o(r, e), parsePluginBody: (r) => f(r), parseDeepRecord: (r) => h(r) },
  jsonPath: (r) => new N(r),
  deepJSON: y(),
  paramBuild: O,
  commandBuild: J,
  paramRead: a,
  commandExtract: D
}), I = async (a, r, e = {}) => {
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
  $r as AUTHOR_RMMZ,
  x as READ_PLUGIN_MESSAGES,
  Tr as SRC_COLOR,
  Z as buildCommandExtractors,
  q as buildParamExtractors,
  P as buildPluginValueExtractor,
  H as buildRuntimeData,
  Q as buildSingleCommand,
  Ra as classifyFileParams,
  Va as classifyPluginParams,
  Ma as classifyTextParams,
  va as collectDependentStructNames,
  $a as collectStructsByKinds,
  X as compileCommandExtractorsFromPlugins,
  E as compilePluginAsArraySchema,
  Y as compilePluginCommandExtractor,
  aa as compilePluginCommandPairs,
  ra as compilePluginParamExtractor,
  Ta as convertPluginCommandSchema,
  hr as convertPluginsJSToJSON,
  _a as convertStructSchema,
  La as createClassifiedStructMap,
  ea as createCommandExtractorMapFromPipeline,
  y as createDeepJSONParserHandlers,
  sa as createDeepStringifyHandlers,
  k as createDefaultPluginExtractionHandlers,
  w as createManifestData,
  ma as createPluginCommandExtractor,
  ta as createPluginCommandExtractorMap,
  g as createPluginCommandMap,
  K as createPluginCommandMapFromManifestData,
  p as createPluginParamDictionary,
  G as createPluginParamsFromPipeline,
  U as createPluginParamsWithErrorsFromPipeline,
  na as createPluginValueExtractor,
  ia as createPluginValuesPath,
  la as createPrimiteveParamPath,
  ja as createStructMap,
  oa as createStructParamPath,
  ca as createTextParamDictionary,
  _r as domainNames,
  ua as extractAllPluginValues,
  pa as extractArgsFromPluginCommand,
  ga as extractCommandArgsByKey,
  Pa as extractPluginCommandArgs,
  da as extractPluginCommandWithExtractor,
  d as extractPluginParamFromRecord,
  Nr as filterPluginParamByText,
  yr as filterPluginSchemaByFileParam,
  wa as filterPluginSchemaByFn,
  fr as filterPluginSchemaByNumberParam,
  Er as filterPluginSchemaByParam,
  xr as filterPluginSchemaByVariableParam,
  Ha as filterPluginSchemaStringParams,
  Ka as filterStructParamsByFn,
  Sa as generatePluginAnnotationLines,
  ha as generatePluginAnnotationText,
  Na as generatePluginAnnotationTokens,
  ya as getPathFromStructArraySchema,
  fa as getPathFromStructParam,
  Ea as getPathFromStructSchema,
  ka as hasNumberValueParam,
  Ia as hasScalarAttr,
  Ga as hasStructAttr,
  Ua as hasTextAttr,
  Wa as isArrayAttr,
  za as isArrayParam,
  Za as isArrayParamEx,
  xa as isCommandArgValue,
  Ar as isErrorStructParam,
  qa as isFileAttr,
  Qa as isNumberArrayParam,
  Xa as isNumberAttr,
  Ya as isNumberValueParam,
  ar as isNumberValueParamEx,
  Cr as isRmmzDataKind,
  rr as isScalarParam,
  er as isStringArrayParam,
  sr as isStringValueParam,
  mr as isStructArrayAttr,
  tr as isStructArrayParam,
  nr as isStructAttr,
  ir as isStructParam,
  Lr as isValidNumber,
  lr as isVariableAttr,
  Aa as ispluginParamValue,
  Br as lookupKind,
  Ca as makeScalarArrayPath,
  Ba as makeScalarValuesPath,
  ba as mergeCommandMap,
  br as omitPluginParam,
  or as paramHasText,
  cr as parseDeepJSON,
  h as parseDeepRecord,
  Fr as parsePlugin,
  f as parsePluginByLocale,
  o as parsePluginParamRecord,
  Dr as parsePluginParamRecord2,
  Fa as pluginComamndName,
  Jr as pluginSourceToArraySchema,
  Or as pluginSourceToJSON,
  B as readAllPluginBodies,
  A as readPluginInfosSafe,
  Rr as rebuildCommands,
  Da as replacePluginParams,
  l as replacePluginValue,
  Ja as replaceRuntimePluginCommand,
  I as runPluginExtractionPipeline,
  ur as stringifyDeepJSON,
  S as stringifyDeepRecord,
  Vr as stringifyPluginsJS,
  pr as structDependencies,
  gr as toArrayPluginParam,
  Pr as toObjectPluginParams,
  dr as toObjectPluginParamsOld,
  Mr as validatePluginJS
};
