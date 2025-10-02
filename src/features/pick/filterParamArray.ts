/* eslint-disable @functional/no-return-void */

import type { PluginParamGroups, NamedAttribute } from "./filter2Type2";
import type {
  PrimitiveParam,
  ArrayParam,
  StructRefParam,
  StructArrayRefParam,
  ScalaParam,
} from "../../rmmz/plugin/schema/compile/kinds";
import type { PluginParam } from "../../rmmz/plugin/schema/compile/kinds/core/types";
import { isArrayParam } from "../../rmmz/plugin/schema/compile/kinds/isArray";
import {
  isStructArrayParam,
  isStructParam,
} from "../../rmmz/plugin/schema/compile/kinds/isStruct";

export const filterParams = <
  Fn extends (param: ScalaParam, name: string) => boolean
>(
  params2: PluginParam<PrimitiveParam>[],
  set: Pick<ReadonlySet<string>, "has">,
  fn: Fn
): PluginParamGroups => {
  const single: NamedAttribute<ScalaParam>[] = [];
  const array: NamedAttribute<Extract<PrimitiveParam, ArrayParam>>[] = [];
  const struct: NamedAttribute<StructRefParam>[] = [];
  const structArray: NamedAttribute<StructArrayRefParam>[] = [];

  params2.forEach(({ attr, name }) => {
    if (isStructParam(attr)) {
      if (set.has(attr.struct)) {
        struct.push({
          attr: attr,
          name: name,
        });
      }
      return;
    }
    if (isStructArrayParam(attr)) {
      if (set.has(attr.struct)) {
        structArray.push({
          attr: attr,
          name: name,
        });
      }
      return;
    }
    if (isArrayParam(attr)) {
      array.push({
        name: name,
        attr: attr,
      });
      return;
    }
    if (fn(attr, name)) {
      single.push({
        name: name,
        attr: attr,
      });
    }
  });
  return {
    single: single,
    array: array,
    struct: struct,
    structArray: structArray,
  };
};
