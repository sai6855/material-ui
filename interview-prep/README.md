# Frontend Interview Prep

A self-contained practice test for frontend engineers with roughly 5 years of experience.
100 questions: 40 React, 40 JavaScript, 10 HTML, 10 CSS — one question per topic, chosen so
that answering it correctly is real evidence you understand that topic.

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
- **Filtering** — the sidebar filters by area, and the numbered grid jumps to any question.
  Answered questions turn green.
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
  type: 'debug',              // mcq | debug | write
  difficulty: 'senior',       // mid | senior | hard
  prompt: 'This search box…',
  code: 'function Search…',   // optional snippet shown above the answer box
  language: 'jsx',            // jsx | js | html | css — for highlighting
  options: [],                // mcq only
  multi: false,               // true when more than one option is correct
}
```

To add a question, append an object to the array in `questions.js`. The counts in the header
and sidebar update automatically.
