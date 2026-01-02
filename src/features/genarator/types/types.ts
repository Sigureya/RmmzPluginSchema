import type {
  KEYWORD_AUTHOR,
  KEYWORD_BASE,
  KEYWORD_DESC,
  KEYWORD_ORDERAFTER,
  KEYWORD_ORDERBEFORE,
  KEYWORD_URL,
} from "@RmmzPluginSchema/rmmz/plugin/core/parse";
import type { KeyWord } from "./keyword";

export interface Annotation_PluginDependencies {
  base: KeyWord<typeof KEYWORD_BASE>[];
  orderBefore: KeyWord<typeof KEYWORD_ORDERBEFORE>[];
  orderAfter: KeyWord<typeof KEYWORD_ORDERAFTER>[];
}

export type Annotation_Meta =
  | KeyWord<typeof KEYWORD_AUTHOR>
  | KeyWord<typeof KEYWORD_DESC>
  | KeyWord<typeof KEYWORD_URL>;
