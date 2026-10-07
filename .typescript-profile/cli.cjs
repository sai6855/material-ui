// Generate isolated fixtures from the compiler-emitted snapshot, then run real tsc diagnostics.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const scenarios = require('./scenarios.cjs');
const experiments = require('./experiments.cjs');
const root = path.resolve(__dirname, '..');
const [scenario = 'dashboard', experiment = 'baseline', compiler = '7', repeats = '1'] = process.argv.slice(2);
const snapshot = path.join(__dirname, scenario.startsWith('sc-') ? 'snapshot-sc' : 'snapshot');
const config = JSON.parse(fs.readFileSync(path.join(snapshot, 'tsconfig.base.json'), 'utf8'));
if (!scenarios[scenario] || !experiments[experiment]) throw new Error('Unknown case');
const destination = path.join(__dirname, 'cli-cases', `${scenario}-${experiment}`);
const changes = [];
function copyTree(source, target) {
  fs.mkdirSync(target, {recursive: true});
  for (const entry of fs.readdirSync(source, {withFileTypes: true})) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) { copyTree(from, to); continue; }
    if (!entry.name.endsWith('.d.ts')) continue;
    let originalName = path.relative(snapshot, from).replaceAll('\\', '/');
    if (!fs.existsSync(path.join(root, originalName))) {
      for (const suffix of ['.ts', '.tsx']) {
        const candidate = originalName.replace(/\.d\.ts$/, suffix);
        if (fs.existsSync(path.join(root, candidate))) { originalName = candidate; break; }
      }
    }
    const originalText = fs.readFileSync(from, 'utf8');
    const text = experiments[experiment](originalName, originalText);
    if (text !== originalText) changes.push(originalName);
    fs.writeFileSync(to, text);
  }
}
copyTree(path.join(snapshot, 'packages'), path.join(destination, 'packages'));
if (experiment !== 'baseline' && changes.length === 0) throw new Error('Experiment did not change any snapshot declarations');
const localConfig = structuredClone(config);
for (const [key, values] of Object.entries(localConfig.compilerOptions.paths)) {
  localConfig.compilerOptions.paths[key] = values.map((value) => value.replace(snapshot.replaceAll('\\', '/'), destination.replaceAll('\\', '/')));
}
localConfig.files = ['./consumer.tsx'];
if (scenario.startsWith('sc-')) {
  localConfig.compilerOptions.paths['@mui/styled-engine'] = [path.join(destination,
    'packages/mui-styled-engine-sc/src/index.d.ts').replaceAll('\\', '/')];
}
if (scenarios[scenario].includes("from 'react-router'")) {
  localConfig.compilerOptions.paths['react-router'] = [path.join(root,
    'packages/mui-material/node_modules/react-router/dist/production/index.d.ts').replaceAll('\\', '/')];
}
fs.writeFileSync(path.join(destination, 'consumer.tsx'), scenarios[scenario]);
fs.writeFileSync(path.join(destination, 'tsconfig.json'), JSON.stringify(localConfig, null, 2));
const binary = compiler === '7' ? path.join(root, 'node_modules/@typescript/native/bin/tsc')
  : path.join(path.dirname(require.resolve('typescript')), '../bin/tsc6');
for (let repeat = 0; repeat < Number(repeats); repeat += 1) {
  console.error(`CLI TS${compiler}: ${scenario} / ${experiment} / ${repeat + 1}`);
  const started = performance.now();
  const result = cp.spawnSync(process.execPath, [binary, '-p', path.join(destination, 'tsconfig.json'), '--extendedDiagnostics'],
    {cwd: root, encoding: 'utf8', windowsHide: true, maxBuffer: 8 * 1024 * 1024});
  const output = result.stdout + result.stderr;
  const record = {scenario, experiment, compiler, repeat, changes,
    runLabel: process.env.MUI_PROFILE_RUN_LABEL || 'exploratory',
    wallMs: Math.round(performance.now() - started), status: result.status, output};
  fs.appendFileSync(path.join(__dirname, 'cli-results.jsonl'), JSON.stringify(record) + '\n');
  if (process.env.MUI_PROFILE_COMPACT && result.status === 0) {
    console.log(JSON.stringify({scenario, experiment, compiler, repeat, status: result.status,
      instantiations: Number(output.match(/Instantiations:\s*(\d+)/)?.[1]),
      checkSeconds: Number(output.match(/Check time:\s*([\d.]+)s/)?.[1]),
      wallMs: record.wallMs,
    }));
  } else console.log(JSON.stringify(record));
  if (result.status !== 0) process.exitCode = result.status || 1;
}
