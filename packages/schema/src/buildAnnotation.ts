import type { Struct } from "./plugin";

export const buildAnnotation = <T extends object>(s: Struct<T>[]) => {
  return "";
  // const x = s.map((x) => x.structName).join("\n");
  // return `/*
  //   ${x}
  // */`;
};

export const correctErros = (s: Struct<object>[]) => {
  return [];
};
