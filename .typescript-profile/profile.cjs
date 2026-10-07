/* Local research tool. Library substitutions exist only in the compiler host. */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const normalize = (name) => path.resolve(name).replaceAll('\\', '/').toLowerCase();
const fixtureName = path.join(__dirname, 'consumer.tsx');
const scenarios = require('./scenarios.cjs');
const experiments = require('./experiments.cjs');
const [scenarioName = 'dashboard', experimentName = 'baseline', repetitionsArg = '1'] = process.argv.slice(2);
const repetitions = Number(repetitionsArg);
const scenarioNames = scenarioName === 'all' ? Object.keys(scenarios) : scenarioName.split(',');
const experimentNames = experimentName.split(',');
const configPath = process.env.MUI_PROFILE_SNAPSHOT
  ? path.join(__dirname, process.env.MUI_PROFILE_SNAPSHOT === 'sc' ? 'snapshot-sc' : 'snapshot', 'tsconfig.base.json') : path.join(root, 'tsconfig.json');
const config = ts.readConfigFile(configPath, ts.sys.readFile);
const options = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configPath)).options;
Object.assign(options, { skipLibCheck: true, incremental: false, types: ['react', 'node'] });
if (process.env.MUI_PROFILE_SNAPSHOT === 'sc') options.paths['@mui/styled-engine'] = [
  path.join(__dirname, 'snapshot-sc/packages/mui-styled-engine-sc/src/index.d.ts').replaceAll('\\', '/')
];
if (process.env.MUI_PROFILE_VALIDATE) options.skipLibCheck = false;

const readCache = new Map();
for (const currentScenario of scenarioNames) for (const currentExperiment of experimentNames)
for (let repeat = 0; repeat < repetitions; repeat += 1) {
  const scenario = scenarios[currentScenario];
  const experiment = experiments[currentExperiment];
  if (!scenario) throw new Error(`Unknown scenario: ${currentScenario}`);
  if (!experiment) throw new Error(`Unknown experiment: ${currentExperiment}`);
  console.error(`Checking ${currentScenario} / ${currentExperiment} / ${repeat + 1}`);
  if (process.env.MUI_PROFILE_TRACE) {
    ts.startTracing('project', path.join(__dirname, 'traces', `${currentScenario}-${currentExperiment}`));
  }
  if (global.gc) global.gc();
  ts.performance.enable();
  const started = performance.now();
  const host = ts.createCompilerHost(options);
  const originalRead = host.readFile.bind(host);
  const originalExists = host.fileExists.bind(host);
  const changedFiles = new Set();
  host.fileExists = (name) => normalize(name) === normalize(fixtureName) || originalExists(name);
  host.readFile = (name) => {
    if (normalize(name) === normalize(fixtureName)) return scenario;
    const key = normalize(name);
    if (!readCache.has(key)) readCache.set(key, originalRead(name));
    let text = readCache.get(key);
    if (text === undefined) return text;
    let relative = path.relative(root, name).replaceAll('\\', '/');
    if (/^\.typescript-profile\/snapshot(?:-sc)?\//.test(relative)) {
      relative = relative.replace(/^\.typescript-profile\/snapshot(?:-sc)?\//, '');
      if (relative.endsWith('.d.ts') && !ts.sys.fileExists(path.join(root, relative))) {
        for (const extension of ['.ts', '.tsx']) {
          const candidate = relative.replace(/\.d\.ts$/, extension);
          if (ts.sys.fileExists(path.join(root, candidate))) { relative = candidate; break; }
        }
      }
    }
    const replacement = experiment(relative, text);
    if (replacement !== text) changedFiles.add(relative);
    return replacement;
  };
  const program = ts.createProgram([fixtureName], options, host);
  const loadMs = performance.now() - started;
  const fixture = program.getSourceFile(fixtureName);
  const checkStart = performance.now();
  const diagnostics = [
    ...program.getOptionsDiagnostics(),
    ...program.getSyntacticDiagnostics(fixture),
    ...program.getSemanticDiagnostics(fixture),
  ];
  if (process.env.MUI_PROFILE_VALIDATE) {
    const validatedFiles = new Set(changedFiles);
    if (process.env.MUI_PROFILE_SNAPSHOT === 'sc') validatedFiles.add('packages/mui-styled-engine-sc/src/index.ts');
    for (const name of validatedFiles) {
      let fileName = path.join(root, name);
      if (process.env.MUI_PROFILE_SNAPSHOT) {
        const declarationName = name.endsWith('.d.ts') ? name : name.replace(/\.(ts|tsx)$/, '.d.ts');
        fileName = path.join(__dirname, process.env.MUI_PROFILE_SNAPSHOT === 'sc' ? 'snapshot-sc' : 'snapshot', declarationName);
      }
      const changed = program.getSourceFile(fileName);
      if (changed) diagnostics.push(...program.getSemanticDiagnostics(changed));
    }
  }
  const checkMs = performance.now() - checkStart;
  if (process.env.MUI_PROFILE_CALLS) {
    const checker = program.getTypeChecker();
    const visit = node => {
      if (ts.isCallExpression(node) && ['current', 'original'].includes(node.expression.getText(fixture)) &&
          node.arguments[0]?.getText(fixture) === 'WithAttrs') {
        const signature = checker.getResolvedSignature(node);
        console.log(JSON.stringify({call: node.getText(fixture),
          selected: signature?.declaration?.getText().slice(0, 600),
          result: checker.typeToString(checker.getReturnTypeOfSignature(signature), node, ts.TypeFormatFlags.NoTruncation)}));
      }
      ts.forEachChild(node, visit);
    };
    visit(fixture);
  }
  const exportedTypes = {};
  if (process.env.MUI_PROFILE_TYPES) {
    const checker = program.getTypeChecker();
    for (const statement of fixture.statements) {
      if (ts.isTypeAliasDeclaration(statement) && statement.name.text.startsWith('Case')) {
        exportedTypes[statement.name.text] = checker.typeToString(checker.getTypeFromTypeNode(statement.type));
      }
    }
  }
  const result = {
    compiler: ts.version,
    surface: process.env.MUI_PROFILE_SNAPSHOT ? 'fresh-declarations' : 'source-aliases',
    scenario: currentScenario,
    experiment: currentExperiment,
    repeat,
    files: program.getSourceFiles().length,
    instantiations: program.getInstantiationCount(),
    types: program.getTypeCount(),
    checkMs: Math.round(checkMs),
    loadMs: Math.round(loadMs),
    heapMB: Math.round(process.memoryUsage().heapUsed / 1048576),
    errors: diagnostics.map((diagnostic) => ({
      code: diagnostic.code,
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
      file: diagnostic.file && path.relative(root, diagnostic.file.fileName),
      line: diagnostic.file && diagnostic.start !== undefined
        ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1 : undefined,
    })),
    changedFiles: [...changedFiles],
    ...(process.env.MUI_PROFILE_TYPES ? {exportedTypes} : {}),
  };
  console.log(JSON.stringify(result));
  fs.appendFileSync(path.join(__dirname, 'results.jsonl'), `${JSON.stringify(result)}\n`);
  if (process.env.MUI_PROFILE_TRACE) ts.tracing.stopTracing();
  ts.performance.disable();
}
