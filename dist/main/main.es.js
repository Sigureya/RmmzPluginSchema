import { JSONPathJS as p } from "jsonpath-js";
import { b as g, e as d, a as P } from "../shared/index.es.js";
import { c as q, d as z, f as G, g as U, h as W, i as Z, j as Q, k as X, l as Y, m as aa, n as ra, o as ea, p as sa, q as ma, r as ta, s as na, t as ia, u as oa, v as la, w as ua, x as ca, y as pa, z as ga, A as da, B as Pa, C as Na, D as Sa, E as ha } from "../shared/index.es.js";
import { p as o, c as N, a as S, b as h } from "../shared/index.es2.js";
import { d as Ea, e as fa, f as xa, g as Aa, h as Ca, i as ba, j as Ba, k as Fa, l as Ja, m as Oa, o as va, n as Ra, q as Va, r as $a, s as Da, t as Ma, u as _a, v as ja, w as wa } from "../shared/index.es2.js";
import { p as l } from "../shared/structMap.es.js";
import { c as La, a as ka, b as Ia, d as Ka, e as Ha, f as qa, g as za, h as Ga, i as Ua, j as Wa, k as Za, l as Qa, m as Xa, n as Ya, o as ar, q as rr, r as er, s as sr, t as mr, u as tr, v as nr, w as ir, x as or, y as lr, z as ur, A as cr, B as pr, C as gr, D as dr, E as Pr, F as Nr, G as Sr } from "../shared/structMap.es.js";
import { AUTHOR_RMMZ as yr, SRC_COLOR as Er, domainNames as fr, isValidNumber as xr } from "../libs/libs.es.js";
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
    return f(m, a, e);
  } catch {
    return {
      message: a.readErrorPluginsJS,
      plugins: [],
      invalidPlugins: 0,
      complete: !1
    };
  }
}, f = (a, r, e) => {
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
}, x = (a, r, e, m) => a.plugins.map((s) => A(s, r, e, m)), A = async (a, r, e, m) => {
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
}, j = (a) => ({
  parser: { parsePluginList: (r, e) => o(r, e), parsePluginBody: (r) => S(r), parseDeepRecord: (r) => l(r) },
  jsonPath: (r) => new p(r),
  deepJSON: N(),
  paramBuild: F,
  commandBuild: B,
  paramRead: a,
  commandExtract: b
}), w = async (a, r, e = {}) => {
  const m = e.messages ?? y, s = await E(m, () => a.readPluginList(), (u, c) => r.parser.parsePluginList(u, c)), t = await Promise.all(O(s, m, a, r)), n = J(s, t);
  return { status: V(t, n), plugins: t, allErrors: n };
}, J = (a, r) => !a.complete || a.invalidPlugins > 0 ? [{ phase: "readPluginList", pluginName: "", message: a.message, detail: {
  invalidPlugins: a.invalidPlugins,
  complete: a.complete
} }, ...i(r)] : i(r), i = (a) => a.flatMap((r) => r.errors.map((e) => ({
  ...e,
  pluginName: r.pluginName
}))), O = (a, r, e, m) => x(a, r, (s) => e.readPluginBody(s), (s) => m.parser.parsePluginBody(s)).map(async (s) => v(await s, m)), v = (a, r) => {
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
    errors: R(e, s, t)
  };
}, R = (a, r, e) => {
  const m = [];
  return m.push(...r.params.errors.map((s) => ({
    phase: "buildParam",
    pluginName: a,
    message: s.message,
    detail: s
  }))), m.push(...r.commands.errors.map((s) => ({ phase: "buildCommand", pluginName: a, message: s.message, detail: s }))), e.errorKind === "parseError" && m.push({ phase: "parseParam", pluginName: a, message: "plugin parameter parse failed", errorInfo: e.errorInfo || void 0 }), m;
}, V = (a, r) => r.length === 0 ? "success" : a.some((e) => e.errors.length === 0) ? "partial" : "failure", T = (a) => {
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
  yr as AUTHOR_RMMZ,
  y as READ_PLUGIN_MESSAGES,
  Er as SRC_COLOR,
  q as buildCommandExtractors,
  z as buildParamExtractors,
  g as buildPluginValueExtractor,
  La as classifyFileParams,
  ka as classifyPluginParams,
  Ia as classifyTextParams,
  Ea as collectDependentStructNames,
  G as compileCommandExtractorsFromPlugins,
  h as compilePluginAsArraySchema,
  U as compilePluginCommandExtractor,
  W as compilePluginCommandPairs,
  Z as compilePluginParamExtractor,
  Ka as convertPluginCommandSchema,
  fa as convertPluginsJSToJSON,
  Ha as convertStructSchema,
  qa as createClassifiedStructMap,
  T as createCommandExtractorMapFromPipeline,
  j as createDefaultPluginExtractionHandlers,
  Q as createPluginCommandExtractor,
  X as createPluginCommandExtractorMap,
  k as createPluginParamsFromPipeline,
  I as createPluginParamsWithErrorsFromPipeline,
  Y as createPluginValueExtractor,
  aa as createPluginValuesPath,
  ra as createPrimiteveParamPath,
  za as createStructMap,
  ea as createStructParamPath,
  fr as domainNames,
  sa as extractAllPluginValues,
  ma as extractArgsFromPluiginCommand,
  ta as extractCommandArgsByKey,
  na as extractPluginCommandArgs,
  L as extractPluginCommandWithExtractor,
  d as extractPluginParamFromRecord,
  xa as filterPluginParamByText,
  Aa as filterPluginSchemaByFileParam,
  Ca as filterPluginSchemaByNumberParam,
  ba as filterPluginSchemaByParam,
  Ba as filterPluginSchemaByVariableParam,
  ia as generatePluginAnnotation,
  oa as generatePluginAnnotationLines,
  la as generatePluginAnnotationText,
  ua as getPathFromStructArraySchema,
  ca as getPathFromStructParam,
  pa as getPathFromStructSchema,
  Ga as hasNumberValueParam,
  Ua as hasScalarAttr,
  Wa as hasStructAttr,
  Za as hasTextAttr,
  Qa as isArrayAttr,
  Xa as isArrayParam,
  Ya as isArrayParamEx,
  ga as isCommandArgValue,
  Fa as isErrorStructParam,
  ar as isFileAttr,
  rr as isNumberArrayParam,
  er as isNumberAttr,
  sr as isNumberValueParam,
  mr as isNumberValueParamEx,
  Ja as isRmmzDataKind,
  tr as isScalarParam,
  nr as isStringArrayParam,
  ir as isStringValueParam,
  or as isStructArrayAttr,
  lr as isStructArrayParam,
  ur as isStructAttr,
  cr as isStructParam,
  xr as isValidNumber,
  pr as isVariableAttr,
  da as ispluginParamValue,
  Oa as lookupKind,
  Pa as makeScalarArrayPath,
  Na as makeScalarValuesPath,
  Sa as mergeCommandMap,
  va as omitPluginParam,
  gr as paramHasText,
  dr as parseDeepJSON,
  l as parseDeepRecord,
  Ra as parsePlugin,
  S as parsePluginByLocale,
  o as parsePluginParamRecord2,
  ha as pluginComamndName,
  Va as pluginSourceToArraySchema,
  $a as pluginSourceToJSON,
  x as readAllPluginBodies,
  E as readPluginInfosSafe,
  Da as rebuildCommands,
  w as runPluginExtractionPipeline,
  Ma as stringifyDeepJSON,
  _a as stringifyDeepRecord,
  ja as structDependencies,
  Pr as toArrayPluginParam,
  Nr as toObjectPluginParams,
  Sr as toObjectPluginParamsOld,
  wa as validatePluginJS
};
