// Verify the examples displayed in the HTML, without emitting or changing library files.
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const ts = require('typescript');
const {chromium} = require('@playwright/test');
const file = path.join(__dirname, 'autocomplete-problem.html');
const html = fs.readFileSync(file, 'utf8');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'snapshot/tsconfig.base.json'), 'utf8'));
const options = ts.convertCompilerOptionsFromJson(config.compilerOptions, __dirname).options;
const decode = text => text.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
const examples = [...html.matchAll(/<code data-tsx>([\s\S]*?)<\/code>/g)].map(match => decode(match[1]));
if (examples.length !== 4) throw new Error('Expected four independent TypeScript examples');
let failures = 0;
for (const [index, source] of (process.argv.includes('--render-only') ? [] : examples.entries())) {
  const name = path.join(__dirname, `explainer-virtual-${index}.tsx`);
  const check = text => {
    const host = ts.createCompilerHost(options);
    const read = host.readFile.bind(host);
    const exists = host.fileExists.bind(host);
    host.readFile = item => path.resolve(item) === name ? text : read(item);
    host.fileExists = item => path.resolve(item) === name || exists(item);
    const program = ts.createProgram([name], options, host);
    const fixture = program.getSourceFile(name);
    return [...program.getOptionsDiagnostics(), ...program.getSyntacticDiagnostics(fixture), ...program.getSemanticDiagnostics(fixture)];
  };
  const errors = check(source);
  if (errors.length) {
    failures += 1;
    console.log(ts.formatDiagnosticsWithColorAndContext(errors, {
      getCurrentDirectory: () => __dirname, getCanonicalFileName: name => name, getNewLine: () => '\n',
    }));
  }
  console.log(JSON.stringify({example: index + 1, compiler: ts.version, errors: errors.length}));
  if (source.includes('@ts-expect-error')) {
    const negative = check(source.replaceAll('@ts-expect-error', 'Expected error:'));
    if (!negative.some(error => error.code === 2353 && ts.flattenDiagnosticMessageText(error.messageText, ' ').includes('size'))) {
      throw new Error('Removing the expected-error directive must expose the missing size prop');
    }
    console.log(JSON.stringify({example: index + 1, missingSizeNegativeControl: 'passed'}));
  }
}
if (failures) process.exit(1);
(async () => {
  const browser = await chromium.launch({headless: true, channel: 'chrome'});
  try {
    const page = await browser.newPage();
    for (const width of [900, 360]) {
      await page.setViewportSize({width, height: 850});
      await page.goto(pathToFileURL(file).href);
      const result = await page.evaluate(() => ({
        title: document.title,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        sections: document.querySelectorAll('section').length,
        examples: document.querySelectorAll('code[data-tsx]').length,
      }));
      console.log(JSON.stringify({width, ...result}));
      if (result.overflow || result.sections !== 5 || result.examples !== 4) throw new Error('Layout/content check failed');
      await page.screenshot({path: path.join(__dirname, `autocomplete-problem-${width}.png`), fullPage: true});
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
