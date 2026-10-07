const fs = require('node:fs');
const path = require('node:path');
const records = fs.readFileSync(path.join(__dirname, 'cli-results.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
const groups = new Map();
for (const result of records) {
  if (process.argv[2] && result.runLabel !== process.argv[2]) continue;
  const key = `${result.compiler} ${result.scenario} ${result.experiment}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(result);
}
const median = (array) => {
  const sorted = array.toSorted((a, b) => a - b);
  return sorted.length % 2 ? sorted[Math.floor(sorted.length / 2)]
    : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
};
for (const [key, group] of groups) {
  const read = (pattern) => group.map((result) => Number(result.output.match(pattern)?.[1]));
  console.log(JSON.stringify({key, runs: group.length, failures: group.filter((result) => result.status !== 0).length,
    instantiations: [...new Set(read(/Instantiations:\s*(\d+)/))],
    checkMedian: median(read(/Check time:\s*([\d.]+)s/)),
    checkRange: [Math.min(...read(/Check time:\s*([\d.]+)s/)), Math.max(...read(/Check time:\s*([\d.]+)s/))],
    memoryMedianKB: median(read(/Memory used:\s*(\d+)K/)),
    wallMedianMs: median(group.map((result) => result.wallMs)),
  }));
}
