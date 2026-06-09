import { replacePluginValue as l, createPluginParamDictionary as p, createPluginCommandMap as g, buildPluginValueExtractor as P, extractPluginParamFromRecord as d } from "../features/features.es.js";
import { buildCommandExtractors as Z, buildParamExtractors as q, compileCommandExtractorsFromPlugins as Q, compilePluginCommandExtractor as X, compilePluginCommandPairs as Y, compilePluginParamExtractor as aa, createPluginCommandExtractor as ra, createPluginCommandExtractorMap as ea, createPluginValueExtractor as sa, createPluginValuesPath as ma, createPrimiteveParamPath as ta, createStructParamPath as na, createTextParamDictionary as ia, extractAllPluginValues as la, extractArgsFromPluginCommand as oa, extractCommandArgsByKey as ua, extractPluginCommandArgs as ca, generatePluginAnnotation as pa, generatePluginAnnotationLines as ga, generatePluginAnnotationText as Pa, getPathFromStructArraySchema as da, getPathFromStructParam as Sa, getPathFromStructSchema as ha, isCommandArgValue as Na, ispluginParamValue as ya, makeScalarArrayPath as fa, makeScalarValuesPath as Aa, mergeCommandMap as Ea, pluginComamndName as xa, replacePluginParams as Ca, replaceRuntimePluginCommand as Ba } from "../features/features.es.js";
import { s as S, p as h } from "../shared/structMap.es.js";
import { c as Fa, a as Ja, b as Da, d as Oa, e as Ra, f as Va, g as Ma, h as va, i as $a, j as Ta, k as _a, l as La, m as ja, n as wa, o as Ha, q as Ka, r as Ia, t as ka, u as Ga, v as Ua, w as za, x as Wa, y as Za, z as qa, A as Qa, B as Xa, C as Ya, D as ar, E as rr, F as er, G as sr, H as mr, I as tr, J as nr, K as ir, L as lr, M as or, N as ur, O as cr } from "../shared/structMap.es.js";
import { JSONPathJS as N } from "jsonpath-js";
import { parsePluginParamRecord as o, createDeepJSONParserHandlers as y, parsePluginByLocale as f, compilePluginAsArraySchema as A } from "../rmmz/rmmz.es.js";
import { convertPluginsJSToJSON as gr, filterPluginParamByText as Pr, filterPluginSchemaByFileParam as dr, filterPluginSchemaByNumberParam as Sr, filterPluginSchemaByParam as hr, filterPluginSchemaByVariableParam as Nr, isErrorStructParam as yr, isRmmzDataKind as fr, lookupKind as Ar, omitPluginParam as Er, parsePlugin as xr, parsePluginParamRecord2 as Cr, pluginSourceToArraySchema as Br, pluginSourceToJSON as br, rebuildCommands as Fr, stringifyPluginsJS as Jr, validatePluginJS as Dr } from "../rmmz/rmmz.es.js";
import { AUTHOR_RMMZ as Rr, SRC_COLOR as Vr, domainNames as Mr, isValidNumber as vr } from "../libs/libs.es.js";
const E = {
  readErrorPluginsJS: "Failed to read plugins.js",
  readErrorPluginBody: "Failed to read plugin file",
  parseError: "Failed to parse plugin",
  notArray: "Plugin format is invalid: not an array",
  partialSuccess: "Some plugins failed to read or parse",
  success: "All plugins read and parsed successfully"
}, x = async (a, r, e = o) => {
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
  const m = e.messages ?? E, s = await x(m, () => a.readPluginList(), (u, c) => r.parser.parsePluginList(u, c)), t = await Promise.all(V(s, m, a, r)), n = R(s, t);
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
  const m = A(a.plugin, r.deepJSON), s = P(e, m, r.jsonPath, r.paramBuild, r.commandBuild), t = d(a.record, s.params.extractors, r.parser.parseDeepRecord, r.paramRead);
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
  Rr as AUTHOR_RMMZ,
  E as READ_PLUGIN_MESSAGES,
  Vr as SRC_COLOR,
  Z as buildCommandExtractors,
  q as buildParamExtractors,
  P as buildPluginValueExtractor,
  H as buildRuntimeData,
  Fa as classifyFileParams,
  Ja as classifyPluginParams,
  Da as classifyTextParams,
  Oa as collectDependentStructNames,
  Ra as collectStructsByKinds,
  Q as compileCommandExtractorsFromPlugins,
  A as compilePluginAsArraySchema,
  X as compilePluginCommandExtractor,
  Y as compilePluginCommandPairs,
  aa as compilePluginParamExtractor,
  Va as convertPluginCommandSchema,
  gr as convertPluginsJSToJSON,
  Ma as convertStructSchema,
  va as createClassifiedStructMap,
  y as createDeepJSONParserHandlers,
  I as createDefaultPluginExtractionHandlers,
  w as createManifestData,
  ra as createPluginCommandExtractor,
  ea as createPluginCommandExtractorMap,
  g as createPluginCommandMap,
  K as createPluginCommandMapFromManifestData,
  p as createPluginParamDictionary,
  G as createPluginParamsFromPipeline,
  U as createPluginParamsWithErrorsFromPipeline,
  sa as createPluginValueExtractor,
  ma as createPluginValuesPath,
  ta as createPrimiteveParamPath,
  $a as createStructMap,
  na as createStructParamPath,
  ia as createTextParamDictionary,
  Mr as domainNames,
  la as extractAllPluginValues,
  oa as extractArgsFromPluginCommand,
  ua as extractCommandArgsByKey,
  ca as extractPluginCommandArgs,
  d as extractPluginParamFromRecord,
  Pr as filterPluginParamByText,
  dr as filterPluginSchemaByFileParam,
  Ta as filterPluginSchemaByFn,
  Sr as filterPluginSchemaByNumberParam,
  hr as filterPluginSchemaByParam,
  Nr as filterPluginSchemaByVariableParam,
  _a as filterPluginSchemaStringParams,
  La as filterStructParamsByFn,
  pa as generatePluginAnnotation,
  ga as generatePluginAnnotationLines,
  Pa as generatePluginAnnotationText,
  da as getPathFromStructArraySchema,
  Sa as getPathFromStructParam,
  ha as getPathFromStructSchema,
  ja as hasNumberValueParam,
  wa as hasScalarAttr,
  Ha as hasStructAttr,
  Ka as hasTextAttr,
  Ia as isArrayAttr,
  ka as isArrayParam,
  Ga as isArrayParamEx,
  Na as isCommandArgValue,
  yr as isErrorStructParam,
  Ua as isFileAttr,
  za as isNumberArrayParam,
  Wa as isNumberAttr,
  Za as isNumberValueParam,
  qa as isNumberValueParamEx,
  fr as isRmmzDataKind,
  Qa as isScalarParam,
  Xa as isStringArrayParam,
  Ya as isStringValueParam,
  ar as isStructArrayAttr,
  rr as isStructArrayParam,
  er as isStructAttr,
  sr as isStructParam,
  vr as isValidNumber,
  mr as isVariableAttr,
  ya as ispluginParamValue,
  Ar as lookupKind,
  fa as makeScalarArrayPath,
  Aa as makeScalarValuesPath,
  Ea as mergeCommandMap,
  Er as omitPluginParam,
  tr as paramHasText,
  nr as parseDeepJSON,
  h as parseDeepRecord,
  xr as parsePlugin,
  f as parsePluginByLocale,
  o as parsePluginParamRecord,
  Cr as parsePluginParamRecord2,
  xa as pluginComamndName,
  Br as pluginSourceToArraySchema,
  br as pluginSourceToJSON,
  B as readAllPluginBodies,
  x as readPluginInfosSafe,
  Fr as rebuildCommands,
  Ca as replacePluginParams,
  l as replacePluginValue,
  Ba as replaceRuntimePluginCommand,
  k as runPluginExtractionPipeline,
  ir as stringifyDeepJSON,
  S as stringifyDeepRecord,
  Jr as stringifyPluginsJS,
  lr as structDependencies,
  or as toArrayPluginParam,
  ur as toObjectPluginParams,
  cr as toObjectPluginParamsOld,
  Dr as validatePluginJS
};
