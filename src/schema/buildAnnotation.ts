import type { StructAnnotation } from "./plugin";

export const buildAnnotation = <T extends object>(s: StructAnnotation<T>[]) => {
  return "";
  // const x = s.map((x) => x.structName).join("\n");
  // return `/*
  //   ${x}
  // */`;
};

export const correctErros = (s: StructAnnotation<object>[]) => {
  return [];
};
