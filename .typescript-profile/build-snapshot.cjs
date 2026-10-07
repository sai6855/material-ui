// Generate a fresh declaration-only consumer snapshot without changing packages/build.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const useSc = process.argv.includes('sc');
const out = path.join(__dirname, useSc ? 'snapshot-sc' : 'snapshot');
const normalize = (file) => path.resolve(file).replaceAll('\\', '/').toLowerCase();
fs.mkdirSync(out, {recursive: true});
const scenarios = require('./scenarios.cjs');
const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile);
const options = ts.parseJsonConfigFileContent(config.config, ts.sys, root).options;
Object.assign(options, { skipLibCheck: true, noEmit: false, emitDeclarationOnly: true, declaration: true,
  noEmitOnError: false, composite: false, incremental: false, rootDir: root, outDir: out });
const consumer = path.join(__dirname, 'snapshot-input.tsx');
const host = ts.createCompilerHost(options);
const read = host.readFile.bind(host);
const exists = host.fileExists.bind(host);
host.readFile = (file) => normalize(file) === normalize(consumer)
  ? scenarios.dashboard + "\nimport {mergeSlotProps} from '@mui/material/utils';\nexport {mergeSlotProps};\n" : read(file);
host.fileExists = (file) => normalize(file) === normalize(consumer) || exists(file);
const program = ts.createProgram(useSc ? [consumer, path.join(root, 'packages/mui-styled-engine-sc/src/index.ts')] : [consumer], options, host);
const generated = [];
const emitted = program.emit(undefined, (file, text) => {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, text);
  generated.push(file);
});
for (const source of program.getSourceFiles()) {
  if (!normalize(source.fileName).includes('/node_modules/') && source.isDeclarationFile && normalize(source.fileName).startsWith(normalize(root))) {
    const destination = path.join(out, path.relative(root, source.fileName));
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    fs.writeFileSync(destination, source.text);
    generated.push(destination);
  }
}
const imports = new Map();
for (const source of program.getSourceFiles()) {
  if (source.fileName.includes('/node_modules/')) continue;
  for (const imported of ts.preProcessFile(source.text).importedFiles) {
    const name = imported.fileName;
    if (name.startsWith('.') || name.startsWith('@mui/')) continue;
    const resolved = ts.resolveModuleName(name, source.fileName, options, ts.sys).resolvedModule;
    if (resolved) imports.set(name, [resolved.resolvedFileName]);
  }
}
const paths = {...options.paths};
for (const [key, values] of Object.entries(paths)) paths[key] = values.map((value) => path.join(out, value).replaceAll('\\', '/'));
Object.assign(paths, Object.fromEntries(imports));
fs.writeFileSync(path.join(out, 'tsconfig.base.json'), JSON.stringify({compilerOptions: {
  target: 'es2022', lib: ['es2022', 'dom', 'dom.iterable'], module: 'preserve',
  moduleResolution: 'bundler', jsx: 'react-jsx', strict: true, noEmit: true, skipLibCheck: true,
  allowSyntheticDefaultImports: true, types: ['react', 'node'], paths,
}}, null, 2));
console.log(JSON.stringify({compiler: ts.version, generated: generated.length, emitSkipped: emitted.emitSkipped,
  declarationErrors: emitted.diagnostics.map((item) => ({code: item.code, file: item.file?.fileName,
    message: ts.flattenDiagnosticMessageText(item.messageText, '\n')}))}));
