# Frontend Interview Prep

A self-contained practice test for frontend engineers with roughly 5 years of experience.
100 questions: 40 React, 40 JavaScript, 10 HTML, 10 CSS — one question per topic, chosen so
that answering it correctly is real evidence you understand that topic.

Four kinds of question: 7 feature builds, 30 multiple choice, 35 find-the-bug and 28
write-code. The feature builds are machine-coding briefs — a feature statement plus the
behavioural requirements a working solution has to satisfy — and take a sitting each rather
than a few minutes, so they carry their own badge and a taller answer box.

**The machine-coding round comes first.** The 7 builds are Q1–Q7 in their own section above
the four areas, and they have their own filter, so the numbering matches the order you sit
them in. They keep their React or JavaScript badge; they are just listed separately from the
area sections.

## Running it

No build step, no dependencies. Open `index.html` in a browser:

```sh
open interview-prep/index.html          # macOS
xdg-open interview-prep/index.html      # Linux
```

Or serve it, which is nicer because the clipboard API works without a fallback:

```sh
npx http-server interview-prep -p 8080
```

## How it works

- **Answering** — multiple choice uses radios or checkboxes; find-the-bug and write-code
  questions use a code box (Tab inserts two spaces instead of moving focus).
- **Persistence** — answers are saved to `localStorage` as you type, so you can close the
  tab and come back. **Reset** clears them.
- **Filtering** — the sidebar filters by section: Machine coding, then each area. The
  numbered grid jumps to any question, with the builds marked. Answered questions turn green.
- **Evaluate** — copies every question together with your answers and a grading prompt to
  your clipboard. Paste that into any LLM and it replies with one line per question:

  ```
  1. yes
  2. no
  3. yes
  ```

  Nothing else — no score, no commentary. Unanswered questions are graded `no`.

The site deliberately ships **no answer key**. Nothing in `questions.js` reveals the correct
answer, so reading the source doesn't spoil the test, and grading is done by the LLM from its
own knowledge.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page shell |
| `styles.css` | All styling, no framework |
| `app.js` | Rendering, persistence, filtering, the Evaluate payload, and a small syntax highlighter |
| `questions.js` | The question bank — `window.QUESTIONS`, a plain array |

`questions.js` is loaded with a `<script>` tag rather than `fetch()` on purpose: `fetch()` of a
local JSON file is blocked by CORS under `file://`, which would break opening the page directly.

## Question format

```js
{
  area: 'react',              // react | javascript | html | css
  topic: 'useEffect cleanup', // the single topic this question proves
  type: 'debug',              // mcq | debug | write | build
  difficulty: 'senior',       // mid | senior | hard
  prompt: 'This search box…',
  code: 'function Search…',   // optional snippet shown above the answer box
  language: 'jsx',            // jsx | js | html | css — for highlighting
  options: [],                // mcq only
  multi: false,               // true when more than one option is correct
}
```

To add a question, append an object to the array in `questions.js`. The counts in the header
and sidebar update automatically. A `build` question puts its requirements in the prompt as
lines starting with `- `, and leaves `code` empty unless a starting snippet genuinely helps.

The bank deliberately does not test accessibility, and only one question uses a timer as its
scenario — correct markup and the occasional `setTimeout` still appear inside snippets where
real code would have them, they are just never the thing being graded.

## Publishing as a single file

`build-artifact.js` inlines the CSS, the question bank, and the app into one
self-contained page — no external requests, so it works anywhere including a
sandboxed iframe:

```sh
node interview-prep/build-artifact.js   # -> interview-prep/dist/frontend-interview-prep.html
```

Two behaviours exist for that environment. `window.confirm()` is unavailable in
a sandboxed iframe — it returns `false` without asking — so Reset confirms
through an in-page dialog instead. And when `localStorage` is blocked, answers
still work for the session; they just don't survive a reload.
