const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const snapshot = path.join(root, '.typescript-profile/snapshot');
const configPath = path.join(snapshot, 'tsconfig.base.json');
const config = ts.readConfigFile(configPath, ts.sys.readFile);
const options = ts.parseJsonConfigFileContent(config.config, ts.sys, snapshot).options;
const files = [];
function collect(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, {withFileTypes:true})) {
    const file = path.join(dir,e.name);
    if(e.isDirectory()) collect(file);
    else if(file.endsWith('.d.ts')) files.push(file);
  }
}
collect(path.join(snapshot,'packages/mui-material/src'));
collect(path.join(snapshot,'packages/mui-lab/src'));
const host = ts.createCompilerHost(options);
const read = host.readFile.bind(host);
host.readFile = file => {
  const relative = path.relative(snapshot, file);
  if (!relative.startsWith('..') && relative.endsWith('.d.ts')) {
    const current = path.join(root, relative);
    if (fs.existsSync(current)) return fs.readFileSync(current, 'utf8');
  }
  return read(file);
};
const program = ts.createProgram(files, options, host);
const targetFiles = new Set(files.map(file => path.resolve(file).replaceAll('\\', '/').toLowerCase()));
const checker = program.getTypeChecker();
function referencesTypeParameter(node) {
  let found = false;
  function visit(child) {
    if (ts.isIdentifier(child)) {
      const symbol = checker.getSymbolAtLocation(child);
      if (symbol?.declarations?.some(ts.isTypeParameterDeclaration)) found = true;
    }
    if (!found) ts.forEachChild(child, visit);
  }
  visit(node);
  return found;
}
let count = 0;
for (const source of program.getSourceFiles()) {
  if(!targetFiles.has(path.resolve(source.fileName).replaceAll('\\', '/').toLowerCase())) continue;
  function visit(node) {
    const helperName = ts.isTypeReferenceNode(node) ? node.typeName.getText(source)
      : ts.isExpressionWithTypeArguments(node) ? node.expression.getText(source) : undefined;
    if(['Omit','DistributiveOmit'].includes(helperName) && node.typeArguments?.length === 2
      && !referencesTypeParameter(node.typeArguments[0])) {
      count++;
      const sourceType=checker.getTypeFromTypeNode(node.typeArguments[0]);
      const keys=checker.getTypeFromTypeNode(node.typeArguments[1]);
      const members=keys.isUnion()?keys.types:[keys];
      const literals=members.filter(t=>t.flags & ts.TypeFlags.StringLiteral).map(t=>t.value);
      const missing=literals.filter(k=>!checker.getPropertyOfType(sourceType,k) && !checker.getIndexTypeOfType(sourceType, ts.IndexKind.String));
      if(missing.length && !(sourceType.flags & (ts.TypeFlags.Any|ts.TypeFlags.Unknown|ts.TypeFlags.TypeParameter))) console.log(JSON.stringify({file:path.relative(snapshot,source.fileName).replaceAll('\\','/'),line:source.getLineAndCharacterOfPosition(node.getStart(source)).line+1,expression:node.getText(source),missing,allMissing:missing.length===members.length}));
    }
    if(helperName === 'Partial' && node.typeArguments?.length === 1
      && !referencesTypeParameter(node.typeArguments[0])) {
      const sourceType = checker.getTypeFromTypeNode(node.typeArguments[0]);
      const parts = sourceType.isUnion() ? sourceType.types : [sourceType];
      if (!(sourceType.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.TypeParameter | ts.TypeFlags.IndexedAccess | ts.TypeFlags.Conditional))
        && parts.every(part => checker.getPropertiesOfType(part).length > 0
          && checker.getPropertiesOfType(part).every(property => property.flags & ts.SymbolFlags.Optional))) {
        console.log(JSON.stringify({file:path.relative(snapshot,source.fileName).replaceAll('\\','/'),line:source.getLineAndCharacterOfPosition(node.getStart(source)).line+1,expression:node.getText(source),allPropertiesOptional:true}));
      }
    }
    ts.forEachChild(node,visit);
  }
  visit(source);
}
console.error('Checked '+count+' Omit expressions, compiler '+ts.version);
