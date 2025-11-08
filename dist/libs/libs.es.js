const e = "rmmz", s = "colors", i = (a) => Object.entries(a).map(([, m]) => m.title), o = (a) => typeof a == "number" && !Number.isNaN(a), t = (a = {}) => ({
  name: a.name ?? "",
  volume: a.volume ?? 100,
  pitch: a.pitch ?? 100,
  pan: a.pan ?? 0
});
export {
  e as AUTHOR_RMMZ,
  s as SRC_COLOR,
  i as domainNames,
  o as isValidNumber,
  t as makeAudioFileParams
};
