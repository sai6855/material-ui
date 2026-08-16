/* placeholder — replaced by the generated bank */
window.QUESTIONS = [
  {
    area: "react", topic: "useEffect cleanup", type: "debug", difficulty: "senior",
    prompt: "This search box fires a request on every keystroke. A user types \"react\" quickly and the results list ends up showing matches for \"reac\". Why, and how would you fix it?",
    code: "function Search({ query }) {\n  const [results, setResults] = useState([]);\n\n  useEffect(() => {\n    fetch(`/api/search?q=${query}`)\n      .then((res) => res.json())\n      .then(setResults);\n  }, [query]);\n\n  return <ResultList items={results} />;\n}",
    language: "jsx", options: [], multi: false
  },
  {
    area: "javascript", topic: "event loop ordering", type: "mcq", difficulty: "senior",
    prompt: "What is logged, in order?",
    code: "console.log('a');\nsetTimeout(() => console.log('b'), 0);\nPromise.resolve().then(() => console.log('c'));\nqueueMicrotask(() => console.log('d'));\nconsole.log('e');",
    language: "js",
    options: ["a, e, c, d, b", "a, e, b, c, d", "a, c, d, e, b", "a, e, d, c, b"],
    multi: false
  },
  {
    area: "html", topic: "form semantics", type: "write", difficulty: "mid",
    prompt: "Write the markup for an email signup form: a labelled email field that is required and validated as an email, plus a submit button. No JavaScript, no ARIA attributes that native elements already provide.",
    code: "", language: "", options: [], multi: false
  },
  {
    area: "css", topic: "flexbox overflow trap", type: "debug", difficulty: "senior",
    prompt: "The sidebar is supposed to stay at 240px and the content should scroll horizontally when its table is wide. Instead the sidebar shrinks and the table overflows the page. What is going on?",
    code: ".layout {\n  display: flex;\n}\n\n.sidebar {\n  width: 240px;\n}\n\n.content {\n  flex: 1;\n  overflow-x: auto;\n}",
    language: "css", options: [], multi: false
  }
];
