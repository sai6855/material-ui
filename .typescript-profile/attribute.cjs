// Count actual instantiations in an in-memory compiler copy. No installed files are changed.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const engine = require.resolve('@typescript/old', {paths: [path.dirname(require.resolve('typescript'))]});
const source = fs.readFileSync(engine, 'utf8');
const needle = '    instantiationCount++;';
if (source.split(needle).length !== 2) throw new Error('Compiler instrumentation location changed');
const counts = new Map();
globalThis.__muiTypeInstantiation = (type) => {
  let row = counts.get(type.id);
  if (!row) counts.set(type.id, row = {type, count: 0});
  row.count += 1;
};
const instrumented = new Module(engine, module);
instrumented.filename = engine;
instrumented.paths = Module._nodeModulePaths(path.dirname(engine));
require.cache[engine] = instrumented;
instrumented._compile(source.replace(needle, needle + '\n    globalThis.__muiTypeInstantiation(type);'), engine);
require('./profile.cjs');
const summaries = new Map();
for (const {type, count} of counts.values()) {
  const symbol = type.aliasSymbol || type.symbol;
  const declaration = symbol?.declarations?.[0];
  let owner = declaration;
  while (owner && !owner.name) owner = owner.parent;
  const file = declaration?.getSourceFile()?.fileName;
  let container = declaration?.parent;
  while (container && !container.name) container = container.parent;
  const context = container?.name?.getText();
  const name = (context ? context + '/' : '') + (symbol?.name || owner?.name?.getText() || `flags:${type.flags}`);
  const key = `${file || 'intrinsic'} / ${name}`;
  let summary = summaries.get(key);
  if (!summary) summaries.set(key, summary = {name, file, count: 0, distinctTypes: 0});
  summary.count += count;
  summary.distinctTypes += 1;
}
const output = {scenario: process.argv[2], experiment: process.argv[3],
  attributedInstantiations: [...counts.values()].reduce((sum, row) => sum + row.count, 0),
  types: [...summaries.values()].sort((a, b) => b.count - a.count).slice(0, 35)};
fs.appendFileSync(path.join(__dirname, 'attribution.jsonl'), JSON.stringify(output) + '\n');
console.log(JSON.stringify(output, null, 2));
