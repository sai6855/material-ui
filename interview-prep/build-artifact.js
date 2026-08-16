#!/usr/bin/env node
/* Inline styles.css, questions.js and app.js into one self-contained page.
   Artifacts wrap the file in their own doctype/html/head/body, so the output
   carries only page content — title, style, markup, scripts. */

const fs = require('fs');
const SRC = __dirname;
const DEST = `${SRC}/dist/frontend-interview-prep.html`;

const html = fs.readFileSync(`${SRC}/index.html`, 'utf8');
const css = fs.readFileSync(`${SRC}/styles.css`, 'utf8');
const app = fs.readFileSync(`${SRC}/app.js`, 'utf8');
const questions = fs.readFileSync(`${SRC}/questions.js`, 'utf8');

/* Pull the body markup out of the standalone page. */
const body = html.match(/<body>([\s\S]*)<\/body>/)[1];
const markup = body
  .replace(/\s*<script src="[^"]*"><\/script>/g, '')
  .replace(/^\n/, '');

/* </script> inside a string literal would close the inline block early. */
const safe = (js) => js.replace(/<\/script>/gi, '<\\/script>');

const out = `<title>100 Frontend Questions</title>
<style>
${css.trim()}
</style>

${markup.trimEnd()}

<script>
${safe(questions.trim())}
</script>
<script>
${safe(app.trim())}
</script>
`;

fs.mkdirSync(`${SRC}/dist`, { recursive: true });
fs.writeFileSync(DEST, out);

const bytes = Buffer.byteLength(out);
console.log(`wrote ${DEST}`);
console.log(`size:  ${(bytes / 1024 / 1024).toFixed(2)} MB (limit 16 MB)`);
console.log(`checks: doctype=${/<!doctype/i.test(out)} htmltag=${/<html[\s>]/i.test(out)} bodytag=${/<body[\s>]/i.test(out)} externalsrc=${/(src|href)="https?:/i.test(out)}`);
