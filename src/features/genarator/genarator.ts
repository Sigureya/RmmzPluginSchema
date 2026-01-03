import type { PluginSchema } from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginDependencies } from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import {
  KEYWORD_AUTHOR,
  KEYWORD_BASE,
  KEYWORD_DESC,
  KEYWORD_ORDERAFTER,
  KEYWORD_ORDERBEFORE,
  KEYWORD_TARGET,
  KEYWORD_URL,
} from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import { createKeywordLine } from "./keywordLine";
import { generatePluginSchemaAnnotation } from "./schema";
import type { StringifyXX } from "./types/stringlfy";
import type {
  Annotation_Meta,
  Annotation_PluginDependencies,
} from "./types/types";

export const ganeratePluginAnnotation = (
  schema: PluginSchema,
  handlers: StringifyXX
) => {
  return {
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
  meta: Record<string, string>
): Annotation_Meta[] => {
  const author = meta[KEYWORD_AUTHOR];
  const desc = meta[KEYWORD_DESC];
  const url = meta[KEYWORD_URL];
  const a2 = author ? createKeywordLine(KEYWORD_AUTHOR, author) : undefined;
  const d2 = desc ? createKeywordLine(KEYWORD_DESC, desc) : undefined;
  const u2 = url ? createKeywordLine(KEYWORD_URL, url) : undefined;
  return [a2, d2, u2].filter((item) => !!item);
};
