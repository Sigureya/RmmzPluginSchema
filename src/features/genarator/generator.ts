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
import type { SchemaStringifyHandlers } from "./types/stringlfy";
import type { PluginAnnotationTokens } from "./types/tokens";
import type {
  Annotation_Meta,
  Annotation_PluginDependencies,
} from "./types/types";

export const generatePluginAnnotation = (
  schema: PluginSchema,
  handlers: SchemaStringifyHandlers
): PluginAnnotationTokens => {
  return {
    locale: schema.locale,
    schema: generatePluginSchemaAnnotation(schema.schema, handlers),
    target: createKeywordLine(KEYWORD_TARGET, schema.target),
    meta: genarateMetaAnnotations(schema.meta),
    //    pluginName: schema.pluginName,
    dependencies: genarateDependencyAnnotations(
      schema.dependencies ?? {
        base: [],
        orderBefore: [],
        orderAfter: [],
      }
    ),
  };
};

export const genarateDependencyAnnotations = (
  schema: PluginDependencies
): Annotation_PluginDependencies => {
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

export const genarateMetaAnnotations = (
  meta: PluginMetaKeywords
): Annotation_Meta => {
  const author = meta.author;
  const desc = meta.plugindesc;
  const url = meta.url;
  return {
    author: author ? createKeywordLine(KEYWORD_AUTHOR, author) : undefined,
    pluginDesc: desc ? createKeywordLine(KEYWORD_PLUGINDESC, desc) : undefined,
    url: url ? createKeywordLine(KEYWORD_URL, url) : undefined,
  };
};
