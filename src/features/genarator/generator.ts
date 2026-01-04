import type {
  PluginMetaKeywords,
  PluginSchema,
} from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginDependencies } from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import {
  KEYWORD_AUTHOR,
  KEYWORD_BASE,
  KEYWORD_ORDERAFTER,
  KEYWORD_ORDERBEFORE,
  KEYWORD_PLUGINDESC,
  KEYWORD_TARGET,
  KEYWORD_URL,
} from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import { createKeywordLine } from "./keywordLine";
import { generatePluginSchemaAnnotation } from "./schema";
import {
  generatePluginBodyTokenBlock,
  generateStructTokenBlock,
} from "./tokens";
import type {
  SchemaStringifyHandlers,
  PluginAnnotationLines,
  PluginAnnotationTokens,
  PluginDependencyAnnotations,
  PluginMetaAnnotation,
} from "./types";

export const generatePluginAnnotationLines = (
  plugin: PluginSchema,
  handlers: SchemaStringifyHandlers
): PluginAnnotationLines => {
  const tokens = generatePluginAnnotation(plugin, handlers);
  return {
    body: generatePluginBodyTokenBlock(tokens) satisfies string[],
    structs: tokens.schema.structs.map(generateStructTokenBlock),
  };
};

export const generatePluginAnnotation = (
  plugin: PluginSchema,
  handlers: SchemaStringifyHandlers
): PluginAnnotationTokens => {
  return {
    locale: plugin.locale,
    schema: generatePluginSchemaAnnotation(plugin.schema, handlers),
    target: createKeywordLine(KEYWORD_TARGET, plugin.target),
    meta: generateMetaAnnotations(plugin.meta),
    dependencies: generateDependencyAnnotations(plugin.dependencies),
  };
};

const generateDependencyAnnotations = (
  schema: PluginDependencies
): PluginDependencyAnnotations => {
  return {
    base: schema.base.map((dep: string) =>
      createKeywordLine(KEYWORD_BASE, dep)
    ),
    orderBefore: schema.orderBefore.map((dep: string) =>
      createKeywordLine(KEYWORD_ORDERBEFORE, dep)
    ),
    orderAfter: schema.orderAfter.map((dep: string) =>
      createKeywordLine(KEYWORD_ORDERAFTER, dep)
    ),
  };
};

const generateMetaAnnotations = (
  meta: PluginMetaKeywords
): PluginMetaAnnotation => {
  const author = meta.author;
  const desc = meta.plugindesc;
  const url = meta.url;
  return {
    author: author ? createKeywordLine(KEYWORD_AUTHOR, author) : undefined,
    pluginDesc: desc ? createKeywordLine(KEYWORD_PLUGINDESC, desc) : undefined,
    url: url ? createKeywordLine(KEYWORD_URL, url) : undefined,
  };
};
