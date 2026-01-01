import type {
  KEYWORD_BASE,
  KEYWORD_ORDERAFTER,
  KEYWORD_ORDERBEFORE,
} from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import type { KeyWord } from "./keyword";

export interface Annotation_PluginDependencies {
  base: KeyWord<typeof KEYWORD_BASE>[];
  orderBefore: KeyWord<typeof KEYWORD_ORDERBEFORE>[];
  orderAfter: KeyWord<typeof KEYWORD_ORDERAFTER>[];
}
