// Local diagnostic experiments only. Never writes into packages/.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const work = path.join(__dirname, 'all-slots-cases');
const snapshot = path.join(__dirname, 'snapshot');
const log = path.join(__dirname, 'all-slots-results.jsonl');
const utilsFile = 'packages/mui-material/src/utils/types.d.ts';
const wrappers = new Set(['SlotProps', 'SlotComponentProps', 'SlotComponentPropsWithSlotState']);
const targets = [
  'Accordion', 'AccordionSummary', 'Alert', 'Autocomplete', 'Avatar', 'Backdrop',
  'BottomNavigationAction', 'CardActionArea', 'Checkbox', 'Dialog', 'Drawer', 'ListItem',
  'Menu', 'MobileStepper', 'PaginationItem', 'Popover', 'Radio', 'Snackbar', 'SpeedDial',
  'SpeedDialAction', 'StepContent', 'StepLabel', 'Switch', 'TablePagination', 'TableSortLabel',
  'TextField', 'Tooltip', 'SwitchBase', 'SwipeableDrawer', 'CardHeader', 'ListItemText',
];
const componentFile = name => name === 'SwitchBase'
  ? 'packages/mui-material/src/internal/SwitchBase.d.ts'
  : `packages/mui-material/src/${name}/${name}.d.ts`;
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
const slash = name => name.replaceAll('\\', '/');
const helper = `
import type * as React from 'react';
type ProfileIntrinsicProps<P> = React.ComponentPropsWithRef<{
  [Tag in keyof React.JSX.IntrinsicElements]: P extends React.JSX.IntrinsicElements[Tag] ? Tag : never
}[keyof React.JSX.IntrinsicElements]>;
type ProfileReflectedProps<P> = React.ComponentPropsWithRef<React.ComponentType<P>> | ProfileIntrinsicProps<P>;
export type ProfileSlotComponentProps<P, Overrides, Owner> =
  | import('@mui/utils/types').WithDataAttributes<Partial<ProfileReflectedProps<P>> & Overrides>
  | ((ownerState: Owner) => import('@mui/utils/types').WithDataAttributes<Partial<ProfileReflectedProps<P>> & Overrides>);
export type ProfileSlotProps<P, Overrides, Owner> = ProfileSlotComponentProps<P, SlotCommonProps & Overrides, Owner>;
export type ProfileSlotComponentPropsWithSlotState<P, Overrides, Owner, State> =
  | import('@mui/utils/types').WithDataAttributes<Partial<ProfileReflectedProps<P>> & Overrides>
  | ((ownerState: Owner, slotState: State) => import('@mui/utils/types').WithDataAttributes<Partial<ProfileReflectedProps<P>> & Overrides>);
`;

function transform(file, text) {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const edits = [];
  const names = new Set();
  const matches = [];
  function visit(node) {
    if (ts.isTypeReferenceNode(node) && wrappers.has(node.typeName.getText(source))) {
      const first = node.typeArguments?.[0];
      if (first && ts.isTypeReferenceNode(first) && first.typeName.getText(source) === 'React.ElementType'
          && first.typeArguments?.length === 1) {
        const original = node.typeName.getText(source);
        const replacement = `Profile${original}`;
        edits.push({start: node.typeName.getStart(source), end: node.typeName.end, text: replacement});
        edits.push({start: first.getStart(source), end: first.end, text: first.typeArguments[0].getText(source)});
        names.add(replacement);
        let parent = node.parent;
        while (parent && !ts.isPropertySignature(parent)) parent = parent.parent;
        matches.push({slot: parent?.name?.getText(source), wrapper: original,
          props: first.typeArguments[0].getText(source),
          line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1});
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  for (const edit of edits.sort((a,b) => b.start-a.start)) text = text.slice(0, edit.start) + edit.text + text.slice(edit.end);
  if (edits.length) text = `import type { ${[...names].join(', ')} } from '../utils/types';\n` + text;
  return {text, matches};
}

function copyBaseline(destination) {
  const copied = [];
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
      const from = path.join(directory, entry.name);
      if (entry.isDirectory()) {walk(from); continue;}
      if (!entry.name.endsWith('.d.ts')) continue;
      const relative = path.relative(snapshot, from);
      const current = path.join(root, relative);
      const text = fs.readFileSync(fs.existsSync(current) ? current : from, 'utf8');
      const to = path.join(destination, relative);
      fs.mkdirSync(path.dirname(to), {recursive: true});
      fs.writeFileSync(to, text);
      copied.push({file: slash(relative), hash: hash(text)});
    }
  }
  walk(path.join(snapshot, 'packages'));
  return copied;
}

function prepare() {
  fs.mkdirSync(work, {recursive: true});
  const manifest = {compiler: ts.version, head: cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
    sourceDiff: cp.execFileSync('git',['diff','--','packages'],{encoding:'utf8'}), components: {}, files: []};
  for (const variant of ['baseline','own','all']) {
    const destination = path.join(work, variant);
    const files = copyBaseline(destination);
    if (variant === 'baseline') manifest.files = files;
    for (const name of targets) {
      const relative = componentFile(name);
      const file = path.join(destination,relative);
      if (!fs.existsSync(file)) throw new Error(`Missing declaration: ${file}`);
      const before = fs.readFileSync(file,'utf8');
      const transformed = transform(relative,before);
      if (variant === 'baseline') manifest.components[name] = {file: relative, matches: transformed.matches, hash: hash(before)};
      if (variant === 'all' && transformed.matches.length) fs.writeFileSync(file,transformed.text);
    }
    if (variant !== 'baseline') fs.appendFileSync(path.join(destination,utilsFile),helper);
  }
  const matches = Object.values(manifest.components).reduce((count, entry) => count+entry.matches.length,0);
  if (matches !== 64) throw new Error(`Expected 64 current direct matches, found ${matches}; inspect working-tree changes`);
  fs.writeFileSync(path.join(work,'manifest.json'),JSON.stringify(manifest,null,2));
  console.log(JSON.stringify({prepared: targets.length, matchedSlots: matches, head: manifest.head}));
}

function imports(name) {
  const from = name === 'SwitchBase' ? '@mui/material/internal/SwitchBase' : `@mui/material/${name}`;
  return `import * as React from 'react';\nimport Component from '${from}';\n`;
}

function fixture(name, kind = 'wrapper') {
  if (kind === 'generic') {
    if (name !== 'Autocomplete') throw new Error('Only Autocomplete has the separate fully-generic fixture');
    return imports(name) + `
import type { AutocompleteProps } from '@mui/material/Autocomplete';
import type { ChipTypeMap } from '@mui/material/Chip';
export function Wrapper<V, M extends boolean | undefined = false, D extends boolean | undefined = false,
  F extends boolean | undefined = false, C extends React.ElementType = ChipTypeMap['defaultComponent']>
  (props: AutocompleteProps<V,M,D,F,C>) { return <Component {...props} />; }
`;
  }
  if (kind === 'slot-props') {
    const manifest = JSON.parse(fs.readFileSync(path.join(work,'manifest.json'),'utf8'));
    let slots = manifest.components[name].matches.map(entry => entry.slot);
    if (name === 'SwipeableDrawer') slots = manifest.components.Drawer.matches.map(entry => entry.slot);
    if (name === 'CardHeader') slots = ['title','subheader'];
    if (name === 'ListItemText') slots = ['primary','secondary'];
    return imports(name) + `
export type Props = React.ComponentProps<typeof Component>;
declare const props: Props;
export const usage = <Component {...props} slotProps={{
  ${slots.map(slot => `${slot}: (ownerState) => ({className: 'probe'})`).join(',\n  ')}
}} />;
`;
  }
  return imports(name) + `
export type Props = React.ComponentProps<typeof Component>;
export function Wrapper(props: Props) { return <Component {...props} />; }
`;
}

function configFor(destination, source, strictDeclarations = false) {
  const config = JSON.parse(fs.readFileSync(path.join(snapshot,'tsconfig.base.json'),'utf8'));
  for (const [key,values] of Object.entries(config.compilerOptions.paths)) {
    config.compilerOptions.paths[key] = values.map(value => value.replace(slash(snapshot),slash(destination)));
  }
  config.compilerOptions.paths['@mui/icons-material/CloseRounded'] = [slash(path.join(__dirname,'icon-close-rounded.d.ts'))];
  config.compilerOptions.skipLibCheck = !strictDeclarations;
  // Browser-only declaration validation must not depend on unrelated Node ambient declarations.
  if (strictDeclarations) config.compilerOptions.types = ['react'];
  config.files = ['./consumer.tsx'];
  fs.writeFileSync(path.join(destination,'consumer.tsx'),source);
  fs.writeFileSync(path.join(destination,'tsconfig.json'),JSON.stringify(config,null,2));
  return path.join(destination,'tsconfig.json');
}

function setOwn(name) {
  // Restore the previous component, not its whole directory or any workspace files.
  const stateFile = path.join(work,'own-state.json');
  if (fs.existsSync(stateFile)) {
    const previous = JSON.parse(fs.readFileSync(stateFile,'utf8'));
    fs.copyFileSync(path.join(work,'baseline',previous.file),path.join(work,'own',previous.file));
  }
  const file = componentFile(name);
  const before = fs.readFileSync(path.join(work,'baseline',file),'utf8');
  const transformed = transform(file,before);
  fs.writeFileSync(path.join(work,'own',file),transformed.text);
  fs.writeFileSync(stateFile,JSON.stringify({file}));
  return transformed.matches.length;
}

function runOne(name,variant,compiler,repeat,kind,source,label,strictDeclarations = false) {
  if (variant === 'own') setOwn(name === 'Combined' || name === 'CombinedNoAutocomplete' ? 'Autocomplete' : name);
  const destination = path.join(work,variant);
  const consumer = source ?? fixture(name,kind);
  const fixtureFolder = path.join(work,'fixtures');
  fs.mkdirSync(fixtureFolder,{recursive:true});
  fs.writeFileSync(path.join(fixtureFolder,`${name}-${kind}.tsx`),consumer);
  const config = configFor(destination,consumer,strictDeclarations);
  const binary = compiler === '7' ? path.join(root,'node_modules/@typescript/native/bin/tsc')
    : path.join(path.dirname(require.resolve('typescript')),'../bin/tsc6');
  const start = performance.now();
  const result = cp.spawnSync(process.execPath,[binary,'-p',config,'--extendedDiagnostics'],{
    cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024,timeout:120000,
  });
  const output = (result.stdout ?? '') + (result.stderr ?? '');
  const record = {name,kind,variant,compiler,repeat,label,consumerHash:hash(consumer),status:result.status, signal:result.signal,
    error:result.error?.message, wallMs:Math.round(performance.now()-start),
    instantiations:Number(output.match(/Instantiations:\s*(\d+)/)?.[1]),
    checkSeconds:Number(output.match(/Check time:\s*([\d.]+)s/)?.[1]),
    memoryKB:Number(output.match(/Memory used:\s*([\d.]+)K/)?.[1]),output};
  fs.appendFileSync(log,JSON.stringify(record)+'\n');
  const {output: ignored,...brief} = record;
  console.log(JSON.stringify(brief));
  if (result.status !== 0) console.log(output.slice(0,3500));
  return record;
}

function run(compiler = '7', filter = 'all', repetitions = '1', kind = 'wrapper', pairOnly = '') {
  const manifest = JSON.parse(fs.readFileSync(path.join(work,'manifest.json'),'utf8'));
  const names = filter === 'all' ? targets : filter.split(',');
  for (const name of names) {
    if (!targets.includes(name)) throw new Error(`Unknown component: ${name}`);
    const variants = manifest.components[name].matches.length && pairOnly !== 'paired' ? ['baseline','own','all'] : ['baseline','all'];
    for (let repeat = 0; repeat < Number(repetitions); repeat++) {
      const order = repeat%2 ? [...variants].reverse() : variants;
      for (const variant of order) runOne(name,variant,compiler,repeat,kind,undefined,
        Number(repetitions)>1 ? 'repeat' : 'survey');
    }
  }
}

function verificationSource() {
  const declarations = ['import * as React from "react";',
    'import type { SlotProps } from "@mui/material/utils";',
    'import type { ProfileSlotProps, ProfileSlotComponentProps } from "@mui/material/utils/types";',
    'import type { SlotComponentProps } from "@mui/utils/types";',
    'type Owner = { disabled: boolean };',
    'type Assert<T extends true> = T;',
    'type Both<A,B> = [A] extends [B] ? [B] extends [A] ? true : false : false;',
    'type OldMaterial<P> = SlotProps<React.ElementType<P>,{extra?: number},Owner>;',
    'type OldBare<P> = SlotComponentProps<React.ElementType<P>,{extra?: number},Owner>;'];
  const cases = ['{size?: "small" | "large"; ref?: React.Ref<HTMLButtonElement>}',
    '{href: string}','React.ComponentPropsWithRef<"input">','any','unknown','never',
    '{foo: string} | {bar?: number}','{[key: string]: string}',
    'React.ComponentPropsWithRef<"div">','{children?: React.ReactNode}'];
  for (const [index,props] of cases.entries()) {
    declarations.push(`type P${index} = ${props};`,
      `type Old${index} = OldMaterial<P${index}>;`,
      `type New${index} = ProfileSlotProps<P${index},{extra?: number},Owner>;`,
      `type Check${index} = Assert<Both<Old${index},New${index}>>;`,
      `type Bare${index} = Assert<Both<OldBare<P${index}>,ProfileSlotComponentProps<P${index},{extra?: number},Owner>>>;`);
  }
  return declarations.join('\n');
}

function verify(compiler = '7') {
  runOne('Autocomplete','all',compiler,0,'compatibility',verificationSource(),'verify');
  for (const name of targets) {
    const before = slash(path.join(work,'baseline',componentFile(name))).replace(/\.d\.ts$/,'');
    const source = imports(name) + `
import Before from '${before}';
type Assert<T extends true> = T;
type Both<A,B> = [A] extends [B] ? [B] extends [A] ? true : false : false;
type Check = Assert<Both<React.ComponentProps<typeof Before>,React.ComponentProps<typeof Component>>>;
`;
    runOne(name,'all',compiler,0,'public-props-compatibility',source,'verify');
  }
  // Existing production type tests are checked against both trees, but never edited.
  for (const name of targets) {
    const directory = name === 'SwitchBase' ? 'internal' : name;
    const relative = `packages/mui-material/src/${directory}/${name}.spec.tsx`;
    const file = path.join(root,relative);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file,'utf8');
    for (const variant of ['baseline','all']) {
      const destination = path.join(work,variant);
      const to = path.join(destination,relative);
      fs.writeFileSync(to,text);
      const source = `import './${slash(relative)}';\n`;
      runOne(name,variant,compiler,0,'existing-type-tests',source,'verify');
    }
  }
  runOne('Autocomplete','all',compiler,0,'declarations',fixture('Autocomplete','generic'),'verify',true);
}

function verifyHelper(compiler = '7') {
  runOne('Autocomplete','all',compiler,0,'compatibility',verificationSource(),'verify');
}

function verifyExtra(compiler = '7') {
  const relationships = require('./scenarios.cjs')['autocomplete-compatibility-assert'];
  const augmentation = `
import * as React from 'react';
import type {AutocompleteProps} from '@mui/material/Autocomplete';
import type {IconButtonProps} from '@mui/material/IconButton';
declare module '@mui/material/Autocomplete' {
  interface AutocompletePopperSlotPropsOverrides {profileFlag?: boolean}
}
class CustomIcon extends React.Component<Partial<IconButtonProps>> {
  render() {return <button />}
}
const props: AutocompleteProps<string,false,false,false> = {
  options: ['one'], renderInput: () => null,
  slots: {popupIndicator: CustomIcon},
  slotProps: {
    popupIndicator: {ref: React.createRef<CustomIcon>(), size: 'small'},
    popper: ownerState => ({profileFlag: ownerState.disabled}),
  },
};
const bad: AutocompleteProps<string,false,false,false> = {
  options: ['one'], renderInput: () => null,
  slotProps: {popper: {
    // @ts-expect-error The augmented flag must remain boolean.
    profileFlag: 'wrong',
  }},
};
`;
  for (const variant of ['baseline','all']) {
    runOne('Autocomplete',variant,compiler,0,'generic-relationships',relationships,'verify');
    runOne('Autocomplete',variant,compiler,0,'augmentation-and-class-ref',augmentation,'verify');
  }
}

function verifyExisting(compiler = '7', filter = 'all', repetitions = '1') {
  const names = filter === 'all' ? targets : filter.split(',');
  for (const name of names) {
    const directory = name === 'SwitchBase' ? 'internal' : name;
    const relative = `packages/mui-material/src/${directory}/${name}.spec.tsx`;
    if (!fs.existsSync(path.join(root,relative))) continue;
    for (const variant of ['baseline','all']) fs.writeFileSync(path.join(work,variant,relative),fs.readFileSync(path.join(root,relative),'utf8'));
    for (let repeat=0; repeat<Number(repetitions); repeat++) {
      for (const variant of repeat%2 ? ['all','baseline'] : ['baseline','all']) {
        runOne(name,variant,compiler,repeat,'existing-type-tests',`import './${slash(relative)}';\n`,
          Number(repetitions)>1 ? 'repeat' : 'verify');
      }
    }
  }
}

function verifyDeclarations(compiler = '7') {
  for (const variant of ['baseline','all']) runOne('Autocomplete',variant,compiler,0,'declarations',
    fixture('Autocomplete','generic'),'verify',true);
}

function combinedSource(kind, names = targets) {
  let source = "import * as React from 'react';\n";
  for (const name of names) {
    const block = fixture(name,kind).replace("import * as React from 'react';\n",'');
    source += block.replace(/\b(Component|Props|Wrapper|props|usage)\b/g,word=>`${word}${name}`)+'\n';
  }
  if (kind === 'wrapper' && names.includes('Autocomplete')) {
    source += fixture('Autocomplete','generic').replace("import * as React from 'react';\n",'')
      .replace(/\b(Component|Wrapper|props)\b/g,word=>`${word}AutocompleteGeneric`);
  }
  return source;
}

function ablation(compiler = '7') {
  const directory = path.join(work,'other');
  function copy(from,to) {
    fs.mkdirSync(to,{recursive:true});
    for (const entry of fs.readdirSync(from,{withFileTypes:true})) {
      const input = path.join(from,entry.name);
      const output = path.join(to,entry.name);
      if (entry.isDirectory()) copy(input,output);
      else if (entry.name.endsWith('.d.ts')) fs.copyFileSync(input,output);
    }
  }
  copy(path.join(work,'all','packages'),path.join(directory,'packages'));
  const auto = componentFile('Autocomplete');
  fs.copyFileSync(path.join(work,'baseline',auto),path.join(directory,auto));
  for (const kind of ['wrapper','slot-props']) {
    const source = combinedSource(kind);
    for (const variant of ['own','other']) runOne('Combined',variant,compiler,0,`combined-${kind}`,source,'ablation');
    const withoutAuto = combinedSource(kind,targets.filter(name=>name!=='Autocomplete'));
    for (const variant of ['baseline','own','other','all']) runOne('CombinedNoAutocomplete',variant,compiler,0,`combined-${kind}`,withoutAuto,'ablation');
  }
}

function combined(compiler = '7', repetitions = '3') {
  for (const kind of ['wrapper','slot-props']) {
    const source = combinedSource(kind);
    for (let repeat=0; repeat<Number(repetitions); repeat++) {
      for (const variant of repeat%2 ? ['all','baseline'] : ['baseline','all']) {
        runOne('Combined',variant,compiler,repeat,`combined-${kind}`,source,'repeat');
      }
    }
  }
}

function median(values) {
  const sorted = [...values].sort((a,b) => a-b);
  const half = Math.floor(sorted.length/2);
  return sorted.length%2 ? sorted[half] : (sorted[half-1]+sorted[half])/2;
}

function report() {
  const records = fs.readFileSync(log,'utf8').trim().split(/\r?\n/).map(line=>JSON.parse(line));
  const manifest = JSON.parse(fs.readFileSync(path.join(work,'manifest.json'),'utf8'));
  const lines = ['# Component slot reflection profiling','',
    'Consumer-local diagnostics, not a whole-repository speedup. No library implementation was changed.',
    '',`Source HEAD: \`${manifest.head}\`. Baseline includes the captured working-tree Autocomplete edit.`,
    '', '## Common consumer','', '```tsx', 'type Props = React.ComponentProps<typeof Component>;',
    'function Wrapper(props: Props) { return <Component {...props} />; }','```','',
    'Own = only that component uses the experimental helper. All = all 64 direct matches use it.',
    'Both keep intrinsic and custom-component reflection branches; results are experimental.',
    '', '## Instantiations (TypeScript 7.0.2)','',
    '| Component | Baseline | Own | Own reduction | All | All reduction |',
    '| --- | ---: | ---: | ---: | ---: | ---: |'];
  const select = (name,kind,variant,compiler) => {
    const matches = records.filter(row=>row.name===name && row.kind===kind && row.variant===variant && row.compiler===compiler && row.status===0);
    const repeated = matches.filter(row=>row.label==='repeat');
    return repeated.length ? repeated : matches.filter(row=>row.label==='survey' || row.label==='ablation');
  };
  const percentage = (before,after) => Number.isFinite(after) ? `${((before-after)/before*100).toFixed(2)}%` : '—';
  for (const name of targets) {
    const get = variant => select(name,'wrapper',variant,'7');
    const values = ['baseline','own','all'].map(variant=>get(variant).length ? median(get(variant).map(row=>row.instantiations)) : undefined);
    const [base,own,all] = values;
    lines.push(`| ${name} | ${base?.toLocaleString('en-US') ?? 'failed/not run'} | ${own?.toLocaleString('en-US') ?? '—'} | ${percentage(base,own)} | ${all?.toLocaleString('en-US') ?? 'failed/not run'} | ${percentage(base,all)} |`);
  }
  lines.push('','## Explicit slot-prop callbacks (TypeScript 7.0.2)','',
    'Each candidate slot receives `(ownerState) => ({ className: "probe" })` in JSX.',
    '', '| Component | Baseline | Own | Own reduction | All | All reduction |',
    '| --- | ---: | ---: | ---: | ---: | ---: |');
  for (const name of targets) {
    const get = variant => select(name,'slot-props',variant,'7');
    const values = ['baseline','own','all'].map(variant=>get(variant).length ? median(get(variant).map(row=>row.instantiations)) : undefined);
    const [base,own,all] = values;
    lines.push(`| ${name} | ${base?.toLocaleString('en-US') ?? 'failed/not run'} | ${own?.toLocaleString('en-US') ?? '—'} | ${percentage(base,own)} | ${all?.toLocaleString('en-US') ?? 'failed/not run'} | ${percentage(base,all)} |`);
  }
  lines.push('','## Separate fully generic Autocomplete wrapper','');
  for (const compiler of ['7','6']) {
    const get = variant=>select('Autocomplete','generic',variant,compiler);
    for (const variant of ['baseline','own','all']) {
      const rows = get(variant);
      if (rows.length) lines.push(`- TS${compiler} ${variant}: ${median(rows.map(row=>row.instantiations)).toLocaleString('en-US')} instantiations; median check ${median(rows.map(row=>row.checkSeconds))}s; median memory ${median(rows.map(row=>row.memoryKB)).toLocaleString('en-US')} KB (${rows.length} runs).`);
    }
  }
  lines.push('','## Combined consumers','',
    'One compilation containing all 31 consumers. The wrapper case also includes the fully generic Autocomplete wrapper.',
    'These are synthetic consumer workloads, not the repository type-check suite.',
    '', '| Compiler | Fixture | Baseline | All | Reduction | Baseline check (s) | All check (s) |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: |');
  for (const compiler of ['7','6']) for (const kind of ['combined-wrapper','combined-slot-props']) {
    const before = select('Combined',kind,'baseline',compiler);
    const after = select('Combined',kind,'all',compiler);
    if (before.length && after.length) {
      const base = median(before.map(row=>row.instantiations));
      const all = median(after.map(row=>row.instantiations));
      lines.push(`| TS${compiler} | ${kind} | ${base.toLocaleString('en-US')} | ${all.toLocaleString('en-US')} | ${percentage(base,all)} | ${median(before.map(row=>row.checkSeconds))} | ${median(after.map(row=>row.checkSeconds))} |`);
    }
  }
  lines.push('','## Rollout scope controls (TypeScript 7.0.2)','',
    'Own here means Autocomplete-only (5 current matches); Other means the remaining 59 matches.',
    'Primary combined baseline/all counts above have three fresh runs. Scope-control counts use one fresh process; do not infer timing gains from them.',
    '', '| Consumers | Fixture | Baseline | Autocomplete-only | Other-only | All |',
    '| --- | --- | ---: | ---: | ---: | ---: |');
  for (const name of ['Combined','CombinedNoAutocomplete']) for (const kind of ['combined-wrapper','combined-slot-props']) {
    const values = ['baseline','own','other','all'].map(variant=> {
      const rows = select(name,kind,variant,'7');
      return rows.length ? median(rows.map(row=>row.instantiations)).toLocaleString('en-US') : 'not run';
    });
    lines.push(`| ${name} | ${kind} | ${values.join(' | ')} |`);
  }
  lines.push('','## Check times and compiler memory (TypeScript 7.0.2)','',
    '| Component | Baseline check (s) | All check (s) | Baseline memory (KB) | All memory (KB) | Runs/variant |',
    '| --- | ---: | ---: | ---: | ---: | ---: |');
  for (const name of targets) {
    const before = select(name,'wrapper','baseline','7');
    const after = select(name,'wrapper','all','7');
    if (before.length && after.length) lines.push(`| ${name} | ${median(before.map(r=>r.checkSeconds))} | ${median(after.map(r=>r.checkSeconds))} | ${median(before.map(r=>r.memoryKB))} | ${median(after.map(r=>r.memoryKB))} | ${before.length}/${after.length} |`);
  }
  lines.push('','## Explicit-slot check times and compiler memory (TypeScript 7.0.2)','',
    '| Component | Baseline check (s) | All check (s) | Baseline memory (KB) | All memory (KB) | Runs/variant |',
    '| --- | ---: | ---: | ---: | ---: | ---: |');
  for (const name of targets) {
    const before = select(name,'slot-props','baseline','7');
    const after = select(name,'slot-props','all','7');
    if (before.length && after.length) lines.push(`| ${name} | ${median(before.map(r=>r.checkSeconds))} | ${median(after.map(r=>r.checkSeconds))} | ${median(before.map(r=>r.memoryKB))} | ${median(after.map(r=>r.memoryKB))} | ${before.length}/${after.length} |`);
  }
  lines.push('','## TypeScript 6.0.3 cross-check','',
    'One fresh process per variant for each common consumer; counts are cross-checks, not repeated timing evidence.',
    '', '| Component | Wrapper baseline | Wrapper all | Reduction | Slot callbacks baseline | Slot callbacks all | Reduction |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const name of targets) {
    const get = (kind,variant) => {
      const rows = select(name,kind,variant,'6');
      return rows.length ? median(rows.map(row=>row.instantiations)) : undefined;
    };
    const before = get('wrapper','baseline'), after = get('wrapper','all');
    const slotBefore = get('slot-props','baseline'), slotAfter = get('slot-props','all');
    const format = value => value?.toLocaleString('en-US') ?? 'not run';
    lines.push(`| ${name} | ${format(before)} | ${format(after)} | ${percentage(before,after)} | ${format(slotBefore)} | ${format(slotAfter)} | ${percentage(slotBefore,slotAfter)} |`);
  }
  lines.push('','## Existing component type-test workloads (TypeScript 7.0.2)','',
    'These are separate diagnostic workloads; they are not added to, or substituted for, the common consumer results.',
    '', '| Component | Baseline | All | Reduction |', '| --- | ---: | ---: | ---: |');
  for (const name of targets) {
    const get = variant => {
      const rows = records.filter(row=>row.name===name && row.kind==='existing-type-tests' && row.variant===variant && row.compiler==='7' && row.status===0);
      return rows.length ? rows[rows.length-1].instantiations : undefined;
    };
    const before = get('baseline'), after = get('all');
    if (before !== undefined && after !== undefined) lines.push(`| ${name} | ${before.toLocaleString('en-US')} | ${after.toLocaleString('en-US')} | ${percentage(before,after)} |`);
  }
  lines.push('','## Verification','');
  const latestVerification = new Map();
  for (const row of records.filter(row=>row.label==='verify')) latestVerification.set(`${row.compiler}/${row.name}/${row.kind}/${row.variant}`,row);
  for (const row of latestVerification.values()) lines.push(`- TS${row.compiler} ${row.name} ${row.kind} ${row.variant}: ${row.status===0 ? 'passed' : `failed (status ${row.status})`}.`);
  const failures = records.filter(row=>row.status!==0);
  lines.push('',`Raw records: ${records.length}. Failed checks: ${failures.length}. Full diagnostics are in all-slots-results.jsonl.`,
    '', 'Initial harness failures are retained in the raw log: a literal never constraint in the test itself (fixed by the generic original-type alias),',
    'missing generated CloseRounded typings (supplied locally using the exact icon typing-generator body), and unrelated Node ambient errors',
    '(declaration validation now uses browser React globals only). The latest verification rows above supersede those initial runs.',
    '', 'An unmeasured compatibility case remains unverified. Check-time measurements are noisy; repeat runs before making timing claims.',
    'This does not establish compatibility with the minimum supported TypeScript release or every downstream augmentation.',
    'Negative reduction percentages mean more instantiations. Counts from separate programs must not be added together.',
    '', 'Fixtures, captured baseline hashes, source diff, and isolated declarations are in all-slots-cases/.');
  fs.writeFileSync(path.join(__dirname,'ALL-SLOTS-RESULTS.md'),lines.join('\n')+'\n');
  console.log(lines.join('\n'));
}

const [command,...args] = process.argv.slice(2);
if (command==='prepare') prepare();
else if (command==='run') run(...args);
else if (command==='verify') verify(...args);
else if (command==='verify-helper') verifyHelper(...args);
else if (command==='verify-extra') verifyExtra(...args);
else if (command==='verify-existing') verifyExisting(...args);
else if (command==='verify-declarations') verifyDeclarations(...args);
else if (command==='combined') combined(...args);
else if (command==='ablation') ablation(...args);
else if (command==='report') report();
else throw new Error('Use prepare, run [6|7] [all|names] [repetitions] [wrapper|generic|slot-props], verify [6|7], or report');
