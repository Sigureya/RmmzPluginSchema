import type { PluginSchema } from "@RmmzPluginSchema/rmmz/plugin";
import type { PluginDependencies } from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import {
  KEYWORD_BASE,
  KEYWORD_ORDERAFTER,
  KEYWORD_ORDERBEFORE,
  KEYWORD_TARGET,
} from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import type { KeyWord } from "./types/keyword";
import type { Annotation_PluginDependencies } from "./types/types";

const ganeratePluginAnnotation = (schema: PluginSchema) => {
  return {
    target: createKeywordLine(KEYWORD_TARGET, schema.target),
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

const createKeywordLine = <K extends string>(
  keyword: K,
  value: string
): KeyWord<K> => {
  return `@${keyword} ${value}`;
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
