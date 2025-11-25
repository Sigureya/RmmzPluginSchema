const commentRegex = /\s*\/\//;
const varLineRegex = /\s*[var|let|const]\s+\$plugins\s*=\s*/;

const braketRegex = /\s*[\[\]]\s*;?\s*/;

const isIgnoredLine = (line: string): boolean => {
  return (
    commentRegex.test(line) || varLineRegex.test(line) || braketRegex.test(line)
  );
};

export const convertPluginsJSToJSON = (src: string): string[] => {
  return src
    .split("\n")
    .filter((line) => !isIgnoredLine(line))
    .map((line) => line.replace(/,\s*$/, ""));
};
