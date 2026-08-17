/* Question bank — 100 questions.
   react 40 · javascript 40 · html 10 · css 10
   7 feature-build · 30 multiple choice · 35 find-the-bug · 28 write-code
   Feature builds come first, so question numbers match the order you sit them in.
   Generated file — correct answers deliberately excluded; the Evaluate flow is graded by an LLM. */

window.QUESTIONS = [
  {
    "area": "react",
    "topic": "Feature build: search typeahead with cancellation",
    "type": "build",
    "difficulty": "senior",
    "prompt": "Build a typeahead search box over an injected async suggestion source (stub it locally) as the user types.\n- Rendered suggestions must always belong to the current input: a slow earlier request resolving after a newer one must never overwrite it.\n- Debounce keystrokes, skip queries under 2 characters, and cancel superseded requests rather than only ignoring their results.\n- Model idle, loading, no-matches and error as four distinct states, not booleans over an empty array.\n- Arrow keys move the highlight, Enter commits, Escape and an outside click close the list without committing.\n- Cache results per query so re-typing an earlier query renders from cache with no new request.",
    "code": "",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Feature build: multi-step checkout wizard",
    "type": "build",
    "difficulty": "senior",
    "prompt": "Build a 4-step checkout wizard — Address, Shipping, Payment, Review — with no form library, and with the step list held as data so a fifth step is one more entry.\n- Next advances only if the current step validates; errors appear after a failed Next or a blur, never on a pristine field\n- Back preserves everything entered, and returning to a step shows those values again\n- The indicator may jump to any completed step, never forward past an unvalidated one\n- Review reads the accumulated data and Submit sends one payload to a stubbed async endpoint\n- A rejection carrying per-field messages lands the user on the step owning the first failing field",
    "code": "",
    "language": "",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Feature build: data table with sorting, filtering and pagination",
    "type": "build",
    "difficulty": "senior",
    "prompt": "Build a reusable `<DataTable>` that renders any row shape from caller-supplied column definitions, over a fixed in-memory array of ~200 records.\n- The caller declares the columns — header, value accessor, sortable, cell renderer — and nothing about this data's shape is hardcoded in the table.\n- A text filter, single-column sort (asc / desc / off) and pagination stay correct in any combination.\n- The source array is never mutated: clearing the filter and the sort restores the original order.\n- Sorting handles numbers, strings, dates and missing values without throwing or scattering blanks.\n- Filtering or changing rows-per-page never strands the user on an empty page past the end.",
    "code": "",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Feature build: threaded comment tree",
    "type": "build",
    "difficulty": "senior",
    "prompt": "Build a threaded comment tree over a seed array held in memory — replies nest to any depth, no backend.\n- Posting a reply inserts it under its parent at any depth and leaves every unrelated branch untouched.\n- Any comment collapses to hide its subtree, and that collapsed state stays with the comment when siblings are added or deleted.\n- At most one reply box is open at a time; cancelling discards the draft without touching committed state.\n- Deleting a comment that has replies keeps the thread intact instead of orphaning the children.\n- Indentation is capped at a fixed depth for layout only — the model must still know each comment's true parent.",
    "code": "",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Feature build: windowed infinite-scroll feed",
    "type": "build",
    "difficulty": "hard",
    "prompt": "Build an activity feed that pages in events from a stubbed async page loader as the user scrolls, keeping the DOM small once 20,000 rows are loaded.\n- Reaching the end of the loaded rows fetches the next page exactly once, however fast the user scrolls, and paging stops at the end of the data.\n- Only rows near the viewport are in the DOM, while the scrollbar reflects the full loaded list; row heights vary and are measured, not assumed.\n- A page that fails offers a retry that resumes at that page without duplicating or skipping rows.\n- Per-row expanded state follows the row it belongs to, not the screen position, as the feed scrolls.\n- Scroll observation is torn down on unmount.",
    "code": "",
    "language": "",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Feature build: undo/redo history for an editable list",
    "type": "build",
    "difficulty": "senior",
    "prompt": "Build an editable list — add, rename, delete, reorder — in vanilla JS with undo and redo. No framework, no libraries.\n- Ctrl+Z and Ctrl+Shift+Z walk backwards and forwards through every edit, reorders included.\n- Making a fresh edit after undoing discards the redo branch.\n- A run of single-character renames on one item coalesces into one undoable step.\n- The DOM renders from current state only; history is never read to draw the list.\n- History is bounded, and what that costs the oldest edits is handled rather than ignored.",
    "code": "",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Feature build: drag-and-drop kanban board (vanilla JS)",
    "type": "build",
    "difficulty": "senior",
    "prompt": "Build a kanban board in vanilla JS — three columns of cards, moved within and between columns using native HTML5 drag and drop.\n- A dropped card lands at the position it was released over, not appended to the end of the column\n- Dropping onto an empty column works; releasing outside any column leaves the board unchanged\n- The board renders from one state object — the DOM is never the source of truth for card order\n- Card order survives a page reload\n- No libraries or frameworks, and listeners are delegated on the board rather than bound per card",
    "code": "",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "useEffect dependencies & stale closures",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "This checkout timer shows 10:00, then 09:59, and then never changes again; onExpire never fires. Why? Then show the fix — the interval must not be torn down every tick, and onExpire must fire exactly once at zero.",
    "code": "function SessionTimer({ sessionId, onExpire }) {\n  const [secondsLeft, setSecondsLeft] = useState(600);\n\n  useEffect(() => {\n    const id = setInterval(() => {\n      setSecondsLeft(secondsLeft - 1);\n      if (secondsLeft <= 1) {\n        onExpire(sessionId);\n      }\n    }, 1000);\n    return () => clearInterval(id);\n  }, []);\n\n  return <span>{formatClock(secondsLeft)}</span>;\n}\n\n// parent: <SessionTimer sessionId={id} onExpire={(id) => releaseCart(id)} />",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Derived state stored in useEffect",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "Two bugs: on first paint the table lists every invoice while the footer reads $0.00, and on a 6x-throttled CPU the previous filter's rows stay visible for a frame after the filter changes. What is the single underlying mistake, and how do you restructure this so both are impossible?",
    "code": "function InvoiceTable({ invoices, statusFilter }) {\n  const [visible, setVisible] = useState(invoices);\n  const [totalCents, setTotalCents] = useState(0);\n\n  useEffect(() => {\n    const next = invoices.filter((inv) => inv.status === statusFilter);\n    setVisible(next);\n    setTotalCents(next.reduce((sum, inv) => sum + inv.amountCents, 0));\n  }, [invoices, statusFilter]);\n\n  return (\n    <table>\n      <tbody>{visible.map((inv) => <InvoiceRow key={inv.id} invoice={inv} />)}</tbody>\n      <tfoot><tr><td>{formatMoney(totalCents)}</td></tr></tfoot>\n    </table>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "State shape modeling & single source of truth",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Eleven useState calls, and a support ticket: 'the footer says 3 selected but only 2 rows are checked.' Write the replacement state declarations, and name which deleted value is the direct cause of the ticket.",
    "code": "function TeamMembersPanel({ teamId }) {\n  const [members, setMembers] = useState([]);\n  const [isLoading, setIsLoading] = useState(false);\n  const [isError, setIsError] = useState(false);\n  const [errorMessage, setErrorMessage] = useState('');\n  const [isEmpty, setIsEmpty] = useState(false);\n  const [selectedIds, setSelectedIds] = useState([]);\n  const [selectedMembers, setSelectedMembers] = useState([]);\n  const [selectedCount, setSelectedCount] = useState(0);\n  const [editingMember, setEditingMember] = useState(null);\n  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);\n  const [draftName, setDraftName] = useState('');\n\n  // fetches on teamId; setters called from ~8 places. Renders: spinner,\n  // error banner, empty state, checkbox rows, \"N selected\" footer, rename dialog.\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "useState update semantics: batching and functional updaters",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "Freshly mounted with count at 0, React 19 production build, no StrictMode. likePost resolves after a real network round-trip. The user clicks once and nothing else touches the component. What does count end at, and what does the log print?",
    "code": "function LikeButton({ postId }) {\n  const [count, setCount] = useState(0);\n\n  async function handleClick() {\n    setCount(count + 1);\n    setCount(count + 1);\n    await likePost(postId);\n    setCount((c) => c + 1);\n    console.log(count);\n  }\n\n  return <button onClick={handleClick}>{count}</button>;\n}",
    "language": "jsx",
    "options": [
      "count ends at 2; the log prints 0",
      "count ends at 3; the log prints 0",
      "count ends at 2; the log prints 2",
      "count ends at 3; the log prints 3",
      "count ends at 1; the log prints 0"
    ],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Effect cleanup, subscriptions, and StrictMode double-invocation",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "Moving between rooms (the component stays mounted, only roomId changes) empties the presence list and it never repopulates until a page reload. The didInit ref came from a commit titled 'stop double connecting in dev'. What does that ref actually do here, and what should replace it?",
    "code": "function PresenceIndicator({ roomId }) {\n  const [peers, setPeers] = useState([]);\n  const didInit = useRef(false);\n\n  useEffect(() => {\n    if (didInit.current) return;\n    didInit.current = true;\n\n    const socket = new RoomSocket(roomId);\n    socket.on('peers', (list) => setPeers(list));\n    socket.connect();\n\n    return () => socket.close();\n  }, [roomId]);\n\n  return <AvatarStack users={peers} />;\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Query-cache semantics: keys, staleness, and invalidation",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "Three entries exist in the cache under this project's tasks — status 'open' (mounted, shown below), plus 'done' and 'all' with no mounted observer. None is past staleTime or garbage-collected. The rename mutation succeeds. Select every true statement.",
    "code": "useQuery({\n  queryKey: ['projects', projectId, 'tasks', { status }],\n  queryFn: () => fetchTasks(projectId, status),\n  staleTime: 60_000,\n});\n\nuseMutation({\n  mutationFn: renameTask,\n  onSuccess: () =>\n    queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] }),\n});",
    "language": "jsx",
    "options": [
      "All three entries are marked stale — the key matches as a prefix",
      "Only the mounted entry refetches now; the other two refetch on their next mount",
      "Nothing refetches for 60s, because staleTime gates invalidation",
      "setQueryData on the mounted key would skip the network but leave the other two stale",
      "refetch() here would be equivalent — it also re-runs every entry under this prefix"
    ],
    "multi": true
  },
  {
    "area": "react",
    "topic": "Why a component re-rendered",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "Panel is wrapped in React.memo; TabBar and ReportBody are ordinary components. The user clicks a tab and setTab is called with a new value. Exactly one statement about that update is true — which?",
    "code": "const Panel = React.memo(function Panel({ title, children }) {\n  return <section><h2>{title}</h2>{children}</section>;\n});\n\nfunction ReportsPage() {\n  const [tab, setTab] = useState('summary');\n  return (\n    <Panel title=\"Reports\">\n      <TabBar value={tab} onChange={setTab} />\n      <ReportBody tab={tab} />\n    </Panel>\n  );\n}",
    "language": "jsx",
    "options": [
      "memo bails out: React skips Panel and renders only TabBar and ReportBody below it",
      "Panel re-renders: children is a new element array each render, so shallow compare fails",
      "Panel re-renders; useMemo on the children with [tab] deps would restore the bail-out",
      "Panel re-renders, so React tears down and recreates its section and h2 DOM nodes",
      "TabBar is skipped: setTab is stable and its other prop is a primitive"
    ],
    "multi": false
  },
  {
    "area": "react",
    "topic": "When React.memo does nothing",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "The Profiler shows all 500 memoized rows re-rendering when one checkbox is ticked (React Compiler is off; toggleId returns a new Set). Wrapping the handler in useCallback does not help. Why does the bail-out still fail, and what do you change so only the changed row re-renders?",
    "code": "const MemberRow = React.memo(({ member, permissions, isSelected, onToggle }) => (\n  <li>\n    <input type=\"checkbox\" checked={isSelected} onChange={onToggle} />\n    <span>{member.name}</span>\n    {permissions.canRemove && <RemoveButton memberId={member.id} />}\n  </li>\n));\n\nfunction MemberList({ members, currentUser }) {\n  const [selected, setSelected] = useState(() => new Set());\n  const permissions = { canRemove: currentUser.role === 'admin' };\n  return (\n    <ul>\n      {members.map((m) => (\n        <MemberRow key={m.id} member={m} permissions={permissions} isSelected={selected.has(m.id)}\n          onToggle={() => setSelected(toggleId(selected, m.id))} />\n      ))}\n    </ul>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "useMemo/useCallback: referential identity vs computation cost",
    "type": "write",
    "difficulty": "senior",
    "prompt": "RecentOrders and ExportButton are both React.memo. Exactly two of these memoized values recompute on every render of OrdersToolbar, so the child each one exists to protect never bails out. Which two, what defeats them, and fix the root cause — for one of them the fix is not another hook inside this component.",
    "code": "function OrdersToolbar({ orders, currency, filters, onExport }) {\n  const formatter = useMemo(\n    () => new Intl.NumberFormat('en-US', { style: 'currency', currency }), [currency]);\n  const label = useMemo(() => `${orders.length} orders`, [orders.length]);\n  const buttonStyle = useMemo(() => ({ marginInlineStart: 8 }), []);\n  const sorted = useMemo(\n    () => [...orders].sort((a, b) => b.createdAt - a.createdAt), [orders, filters]);\n  const handleExport = useCallback(() => onExport(sorted, filters), [sorted, filters, onExport]);\n\n  return (\n    <>\n      <RecentOrders orders={sorted} formatter={formatter} />\n      <ExportButton style={buttonStyle} label={label} onClick={handleExport} />\n    </>\n  );\n}\n\n// parent (orders and exportOrders are referentially stable):\n// <OrdersToolbar orders={orders} currency=\"USD\" filters={{ status, q }} onExport={exportOrders} />",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Context re-render cost and provider value identity",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "Every keystroke in the search box re-renders all 400 memo'd InvoiceRows, yet the Profiler shows InvoiceTable itself never re-rendering. Explain both facts. Then: a PR wraps the provider value in useMemo keyed on [query, selectedIds] — does that fix it?",
    "code": "const FiltersContext = createContext(null);\n\nfunction FiltersProvider({ children }) {\n  const [query, setQuery] = useState('');\n  const [selectedIds, setSelectedIds] = useState([]);\n  return (\n    <FiltersContext value={{ query, setQuery, selectedIds, setSelectedIds }}>\n      {children}\n    </FiltersContext>\n  );\n}\n\nconst InvoiceRow = memo(function InvoiceRow({ invoice }) {\n  const { selectedIds } = useContext(FiltersContext);\n  return <tr aria-selected={selectedIds.includes(invoice.id)} />;\n});\n\n// <FiltersProvider><SearchBox /><InvoiceTable invoices={invoices} /></FiltersProvider>\n// SearchBox reads/sets query. InvoiceTable maps a referentially stable `invoices`\n// to <InvoiceRow key={inv.id} invoice={inv} /> and reads no context itself.",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Choosing where state lives: local, lifted, URL, server cache, or store",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Orders page; React Router v7 and TanStack Query are already in the app. Sketch ~15 lines of hooks (JSX stubbed) placing four things: the status filter, the orders from GET /orders, the checkbox selection a bulk-action bar reads, and the Edit drawer's unsaved fields. Then: when the filter changes, what happens to the selection?",
    "code": "",
    "language": "",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Keys, reconciliation, and key-driven remounting",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "people is [Ana, Ben, Cy]. The user checks the box on Ben's row and types \"call back\" into the note input on Cy's row, then removes Ana; the parent re-renders with [Ben, Cy]. What does the user see?",
    "code": "function AssigneeList({ people, onRemove }) {\n  return people.map((person, i) => (\n    <li key={i}>\n      <input type=\"checkbox\" defaultChecked={false} />\n      <span>{person.name}</span>\n      <NoteDraft />\n      <button onClick={() => onRemove(person.id)}>Remove</button>\n    </li>\n  ));\n}\n\nfunction NoteDraft() {\n  const [note, setNote] = useState('');\n  return <input value={note} onChange={(e) => setNote(e.target.value)} />;\n}",
    "language": "jsx",
    "options": [
      "Ben stays checked and Cy still shows \"call back\".",
      "Cy is now checked, and \"call back\" is gone.",
      "Cy is now checked and still shows \"call back\".",
      "Nothing is checked and both note inputs are empty.",
      "Nothing is checked, and \"call back\" has moved up to Ben's row."
    ],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Controlled vs uncontrolled inputs",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "Put the caret immediately after a dash and press Backspace: nothing happens — the dash is instantly back, and `digits` never changes, so no state update occurs. Why does the character come back? Then show the fix.",
    "code": "function PhoneField({ digits, onChange }) {\n  return (\n    <input\n      type=\"tel\"\n      value={format(digits)}\n      onChange={(e) => onChange(e.target.value.replace(/\\D/g, '').slice(0, 10))}\n    />\n  );\n}\n\nfunction format(d) {\n  if (d.length < 4) return d;\n  if (d.length < 7) return `${d.slice(0, 3)}-${d.slice(3)}`;\n  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;\n}\n\n// parent: const [digits, setDigits] = useState('');\n//         <PhoneField digits={digits} onChange={setDigits} />",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "React 19 Actions and useActionState",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "Select all that apply. inviteMember is a plain async function that resolves with { ok } and never throws on its own. Which statements are true of this component exactly as written?",
    "code": "function InviteForm({ teamId }) {\n  const [state, submitAction, isPending] = useActionState(\n    async (prev, formData) => {\n      const email = formData.get('email');\n      if (!email.includes('@')) return { error: 'Enter a valid email' };\n      const res = await inviteMember(teamId, email);\n      if (!res.ok) throw new Error('Invite failed');\n      return { sent: [...prev.sent, email] };\n    },\n    { sent: [] }\n  );\n  return (\n    <form action={submitAction}>\n      <input name=\"email\" defaultValue=\"\" />\n      <button disabled={isPending}>Invite</button>\n      {state.error && <p role=\"alert\">{state.error}</p>}\n      <p>{state.sent.length} invited</p>\n    </form>\n  );\n}",
    "language": "jsx",
    "options": [
      "A throw inside the action hits the nearest error boundary instead of becoming state.error.",
      "isPending only tracks the action when it is dispatched via the form's action prop.",
      "React resets this uncontrolled form once the action finishes, clearing the typed email.",
      "The returned object is merged into prev, so state.sent survives the validation path.",
      "useFormStatus() called in InviteForm's own body would report the same pending status."
    ],
    "multi": true
  },
  {
    "area": "react",
    "topic": "Optimistic UI with useOptimistic and rollback",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "`task` comes from a TanStack Query cache entry. React logs a warning, and clicking the checkbox flips it and immediately flips it back, before the request finishes. Why? Then rewrite it so the optimistic value holds for the life of the request.",
    "code": "function TaskRow({ task }) {\n  const [optimisticTask, setOptimisticTask] = useOptimistic(task);\n  const toggleTask = useToggleTask(); // async, resolves when the server responds\n\n  async function handleToggle() {\n    setOptimisticTask({ ...task, done: !task.done });\n    try {\n      await toggleTask(task.id);\n    } catch {\n      toast.error('Could not update task');\n    }\n  }\n\n  return (\n    <label>\n      <input type=\"checkbox\" checked={optimisticTask.done} onChange={handleToggle} />\n      {optimisticTask.title}\n    </label>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Suspense boundaries and lazy loading",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "ProjectHeader and ActivityFeed both suspend via use() on promises from a module-level cache keyed by projectId. ActivityFeed has local state: an open filter panel. projectId lives in a parent useState and is set directly, with no startTransition. Cold load, then the user opens the panel and switches projects. Which statement is true of both moments?",
    "code": "const UsageChart = lazy(() => import('./UsageChart'));\n\nfunction ProjectPage({ projectId }) {\n  return (\n    <Suspense fallback={<PageSkeleton />}>\n      <ProjectHeader projectId={projectId} />\n      <Suspense fallback={<ChartSkeleton />}>\n        <UsageChart projectId={projectId} />\n      </Suspense>\n      <ActivityFeed projectId={projectId} />\n    </Suspense>\n  );\n}",
    "language": "jsx",
    "options": [
      "Both PageSkeleton and ChartSkeleton show on cold load; the switch keeps the panel open.",
      "Only PageSkeleton shows on cold load; the panel is still open when content returns.",
      "Only PageSkeleton on cold load; the switch unmounts the subtree, collapsing the panel.",
      "Only PageSkeleton shows on cold load; the switch shows no fallback — that tree committed.",
      "Only ChartSkeleton shows on cold load; use() on a cached promise never suspends."
    ],
    "multi": false
  },
  {
    "area": "react",
    "topic": "The use() API for promises and context",
    "type": "debug",
    "difficulty": "hard",
    "prompt": "Client-side Vite + React Router v7 app. The spinner never goes away and GET /posts/1/comments repeats several times a second. Explain the loop. Then: does `const p = useMemo(() => fetchComments(postId), [postId]); const comments = use(p);` fix it?",
    "code": "function CommentsPanel({ postId }) {\n  const comments = use(fetchComments(postId));\n  return <ul>{comments.map((c) => <li key={c.id}>{c.body}</li>)}</ul>;\n}\n\nfunction PostView({ post }) {\n  return (\n    <article>\n      <PostBody post={post} />\n      <Suspense fallback={<Spinner />}>\n        <CommentsPanel postId={post.id} />\n      </Suspense>\n    </article>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Transitions vs deferred values",
    "type": "write",
    "difficulty": "senior",
    "prompt": "entries holds ~8,000 records and is referentially stable. Typing drops frames; clicking the Map tab freezes the UI for ~500ms with no feedback. Rewrite so the input never lags, the stale list stays visible but dimmed, and the clicked tab shows its own busy indicator — using useDeferredValue for one of the two and useTransition for the other, and guaranteeing the heavy list does not re-render on the urgent keystroke pass.",
    "code": "function AuditLogPage({ entries }) {\n  const [query, setQuery] = useState('');\n  const [tab, setTab] = useState('table');\n\n  const visible = entries.filter(\n    (e) =>\n      e.actor.toLowerCase().includes(query.toLowerCase()) ||\n      e.action.toLowerCase().includes(query.toLowerCase())\n  );\n\n  return (\n    <>\n      <input value={query} onChange={(e) => setQuery(e.target.value)} />\n      <TabBar value={tab} onChange={setTab} />\n      {tab === 'table' ? <EntryTable entries={visible} /> : <EntryMap entries={visible} />}\n    </>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Error boundaries and async error handling",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "An `<ErrorBoundary>` wraps a grid of function components. Which of these failures does it catch, so the fallback renders instead of the error escaping to `window.onerror` / `unhandledrejection`? Select all that apply.",
    "code": "",
    "language": "",
    "options": [
      "A widget throws in the body of its `useEffect`.",
      "A `.then(res => setRows(res.data.rows))` registered in an effect throws on `res.data`.",
      "A widget calls `use(widgetPromise)` and that promise rejects.",
      "A Retry button's `onClick` throws before calling any setter.",
      "A caught fetch error is put in state and re-thrown at the top of the next render."
    ],
    "multi": true
  },
  {
    "area": "react",
    "topic": "Custom hook design and extraction boundaries",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "`Toolbar` sits under a parent that re-renders constantly. `selection_changed` fires on every one of those renders, even when `selected` is byte-for-byte identical. Why? Fix the hook so it stops — and so that `React.memo(SelectionChips)` can actually bail out.",
    "code": "function useSelectionSync(boardId) {\n  const [selected, setSelected] = useState([]);\n  useEffect(() => {\n    const sub = presence.subscribe(boardId, setSelected);\n    return () => sub.unsubscribe();\n  }, [boardId]);\n  return {\n    selected,\n    clear: () => setSelected([]),\n    toggle: (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),\n  };\n}\n\nfunction Toolbar({ boardId }) {\n  const selection = useSelectionSync(boardId);\n  useEffect(() => {\n    analytics.track('selection_changed', { count: selection.selected.length });\n  }, [selection]);\n  return <SelectionChips items={selection.selected} onClear={selection.clear} />;\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "useReducer and action modeling",
    "type": "write",
    "difficulty": "mid",
    "prompt": "Change the country after picking a rate and the stale `rateId` still gets submitted. Rewrite this state layer as a `useReducer` whose action design makes that state unreachable rather than remembered-to-be-reset. Reducer plus action types only; no JSX needed.",
    "code": "const [step, setStep] = useState(0);\nconst [country, setCountry] = useState('');\nconst [region, setRegion] = useState('');\nconst [rates, setRates] = useState([]);\nconst [rateId, setRateId] = useState(null);\nconst [errors, setErrors] = useState({});\n\nfunction onCountryChange(next) {\n  setCountry(next);\n  setRegion('');\n  setRates([]);\n  setErrors({});\n}\n\nfunction onRatesLoaded(list) {\n  setRates(list);\n  setRateId(list[0]?.id ?? null);\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "useRef as a mutable box and ref callbacks",
    "type": "write",
    "difficulty": "senior",
    "prompt": "This panel publishes the list's height as `--drawer-h`. A `useEffect` keyed on `[expanded, filters]` measures on open, but goes stale when a late-loading font or a narrower container changes the height. Write the measuring layer so the height is always right, including across unmount/remount of the `<ul>`.",
    "code": "function FilterPanel({ filters }) {\n  const [expanded, setExpanded] = useState(false);\n\n  // measuring layer goes here\n\n  return (\n    <div className=\"panel\" style={{ '--drawer-h': `${height}px` }}>\n      <button onClick={() => setExpanded((e) => !e)}>Filters</button>\n      {expanded && (\n        <ul ref={/* yours */ null}>\n          {filters.map((f) => <li key={f.id}>{f.label}</li>)}\n        </ul>\n      )}\n    </div>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Route-level data loading and navigation patterns",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Restructure this for React Router v7 data mode. It must satisfy: a pasted URL and the back button restore the exact filtered page; no fetching in an effect; changing the status filter keeps the current rows on screen instead of swapping in a spinner; and `markShipped` leaves the list showing fresh data with no refetch call of your own.",
    "code": "function OrdersPage() {\n  const [status, setStatus] = useState('open');\n  const [page, setPage] = useState(1);\n  const [orders, setOrders] = useState(null);\n\n  useEffect(() => {\n    fetchOrders({ status, page }).then(setOrders);\n  }, [status, page]);\n\n  async function markShipped(id) {\n    await api.markShipped(id);\n    setOrders(await fetchOrders({ status, page }));\n  }\n\n  if (!orders) return <Spinner />;\n  return <OrdersTable orders={orders} onShip={markShipped} />;\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Server vs Client Component boundaries",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "`page.jsx` has no directive; `./chart` starts with `'use client'`; `./revenue-table` has no directive and queries Postgres directly. The route fails. Which statements are true? Select all that apply.",
    "code": "// app/dashboard/page.jsx\nimport { Chart } from './chart';\nimport { RevenueTable } from './revenue-table';\n\nexport default async function Page() {\n  const range = await getDefaultRange(); // { fromISO, toISO }\n\n  return (\n    <Chart range={range} onZoom={(next) => console.log(next)}>\n      <RevenueTable range={range} />\n    </Chart>\n  );\n}",
    "language": "jsx",
    "options": [
      "`onZoom` is the failure: functions can't be serialized across the server/client boundary.",
      "Nesting inside a Client Component pulls `RevenueTable` into the client bundle.",
      "Adding `'use client'` to `page.jsx` fixes it, and route files still fetch on the server.",
      "`range` is a plain object of strings, so it crosses into the client props fine.",
      "If `Chart` imported `RevenueTable` itself, `RevenueTable` would become a Client Component."
    ],
    "multi": true
  },
  {
    "area": "react",
    "topic": "Hydration mismatch debugging",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "This server-rendered table logs a hydration mismatch and blanks for a frame before reappearing — for nearly every user in production, and never in local dev, where one machine runs both the Node server and the browser. Which statement is the correct diagnosis and remedy?",
    "code": "export function OrderRow({ order }) {\n  const placed = new Date(order.placedAt);\n  const isRecent = Date.now() - placed.getTime() < 3600_000;\n\n  return (\n    <tr className={isRecent ? 'row row--new' : 'row'}>\n      <td>{placed.toLocaleString()}</td>\n      <td>{order.customer}</td>\n    </tr>\n  );\n}",
    "language": "jsx",
    "options": [
      "Locale and timezone resolve per runtime; pass an explicit locale and timeZone instead.",
      "It is a dev-only warning; a production build patches the text against the server markup.",
      "The only fix is a mounted flag, so the server renders nothing and the client fills it in.",
      "Give the row a `useId()`-derived key so React can match the server and client trees.",
      "Read `isRecent` via `useSyncExternalStore` so the server and client snapshots agree."
    ],
    "multi": false
  },
  {
    "area": "react",
    "topic": "TypeScript prop typing patterns for components",
    "type": "write",
    "difficulty": "hard",
    "prompt": "Write the props type and signature (body unchanged). Enforce: one element type shared by `items`, `value`, `onChange`, `getKey`, `getLabel`; `multiple: true` forcing array `value`/`onChange` and forbidding an array `value` otherwise; all native button attributes without listing them, minus collisions; `ref` React-19 style; no `children`.",
    "code": "export function Select({ items, value, onChange, getKey, getLabel, multiple, ref, ...buttonProps }) {\n  const isSelected = (item) =>\n    multiple\n      ? value.some((v) => getKey(v) === getKey(item))\n      : value != null && getKey(value) === getKey(item);\n\n  return (\n    <button {...buttonProps} ref={ref}>\n      {multiple ? `${value.length} selected` : value ? getLabel(value) : 'Choose…'}\n    </button>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "useLayoutEffect vs useEffect",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "QA: 'the popover flashes in the top-left corner for an instant, then snaps under the button.' Obvious on their old laptop, nearly impossible to catch on the developer's machine. Explain what the browser paints, and fix it. This page is server-rendered — what does your fix do during SSR?",
    "code": "function Popover({ anchorRef, open, children }) {\n  const ref = useRef(null);\n  const [pos, setPos] = useState({ top: 0, left: 0 });\n\n  useEffect(() => {\n    if (!open || !ref.current || !anchorRef.current) return;\n    const anchor = anchorRef.current.getBoundingClientRect();\n    const self = ref.current.getBoundingClientRect();\n    setPos({\n      top: anchor.bottom + 8,\n      left: anchor.left + anchor.width / 2 - self.width / 2,\n    });\n  }, [open, anchorRef]);\n  if (!open) return null;\n  return createPortal(\n    <div ref={ref} className=\"popover\" style={{ position: 'fixed', ...pos }}>{children}</div>,\n    document.body\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Imperative handles and ref forwarding in React 19",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Write `<LessonVideo>` (React 19, plain JSX) so the course page can call exactly `seekTo(seconds)` and `restart()` on it, and cannot reach the underlying `<video>` element through the ref. Then say in one sentence when that handle is populated relative to the parent's own effects.",
    "code": "",
    "language": "",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Render purity and concurrent rendering implications",
    "type": "debug",
    "difficulty": "hard",
    "prompt": "This shipped fine for months. After the team wrapped the category-filter update in `startTransition`, some notifications are reported as seen that the user never saw — and those same ones are then never reported again, even after the user really does scroll past them. Explain both symptoms, then give the fix.",
    "code": "const impressionsSent = new Set();\n\nexport function NotificationFeed({ notifications, filter }) {\n  const visible = notifications.filter((n) => n.category === filter);\n  return (\n    <ul>\n      {visible.map((n) => {\n        if (!impressionsSent.has(n.id)) {\n          impressionsSent.add(n.id);\n          analytics.track('notification_impression', { id: n.id, filter });\n        }\n        return <NotificationRow key={n.id} notification={n} />;\n      })}\n    </ul>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Profiling and measuring React performance",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "Typing in the filter box over a 900-row table is laggy. React DevTools Profiler: 8 commits for 8 keystrokes, `<DataTable>` self 4 ms / total 19 ms each. Performance panel: each keystroke is one ~140 ms long task, ~110 ms of it Recalculate Style and Layout. Which conclusion does this data support?",
    "code": "",
    "language": "",
    "options": [
      "DataTable re-renders more than it needs to; React.memo plus useCallback is the fix.",
      "React's work is a small slice; the cost is styling and laying out the DOM it produces.",
      "useDeferredValue on the filter takes the style and layout cost off the keystroke.",
      "4 ms self vs 19 ms total means the children are slow, so memoizing Row is the fix.",
      "The Profiler's 19 ms already includes style and layout, so the panel double-counts it."
    ],
    "multi": false
  },
  {
    "area": "react",
    "topic": "React Compiler: what it automates and what it doesn't",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "Your team is enabling React Compiler on an existing React 19 app that already has `useMemo` and `useCallback` scattered through it. Select all statements that are true.",
    "code": "",
    "language": "",
    "options": [
      "It won't make a computation cheaper when its inputs genuinely change every render.",
      "Existing useMemo/useCallback must be removed first, or they produce stale values.",
      "Components that mutate props or state during render can be skipped or miscompiled.",
      "Effect dependency arrays no longer need to list every reactive value.",
      "Code that relied on a prop object's identity changing each render can stop reacting."
    ],
    "multi": true
  },
  {
    "area": "react",
    "topic": "Subscribing to external stores and tearing",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Write `useCartSummary()` over this store with `useSyncExternalStore`, returning `{ count, total }` (total = sum of `price * qty`). It must not re-render on unrelated cart changes, and must work during SSR. Then state the invariant the snapshot function must satisfy and what React does when it is violated.",
    "code": "// cartStore.js — every mutation replaces state with a new object and notifies all listeners\nexport const cartStore = {\n  state: { items: [], coupon: null, address: null },\n  subscribe(listener) {\n    listeners.add(listener);\n    return () => listeners.delete(listener);\n  },\n  addItem(item) {\n    this.state = { ...this.state, items: [...this.state.items, item] };\n    listeners.forEach((l) => l());\n  },\n};",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Testing behavior with React Testing Library",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "`PromoCodeForm` always renders `<p className=\"promo-error\" role=\"alert\">{error}</p>`, empty until `onApply` rejects. This test stays green both when a teammate deletes the line that sets `error`, and when someone adds `hidden` to that `<p>`. Explain why it survives both, and write the assertion you'd use instead.",
    "code": "test('shows an error when the promo code is rejected', async () => {\n  const onApply = vi.fn().mockRejectedValue(new Error('invalid'));\n  const { container } = render(<PromoCodeForm onApply={onApply} />);\n\n  fireEvent.change(container.querySelector('input'), {\n    target: { value: 'SAVE10' },\n  });\n  fireEvent.click(container.querySelector('.promo-submit'));\n\n  await waitFor(() => expect(onApply).toHaveBeenCalledWith('SAVE10'));\n  expect(container.querySelector('.promo-error')).toBeInTheDocument();\n});",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Testing async UI, network, and providers",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "MSW is started globally with a default handler for `GET /api/invoices` returning `invoiceFixtures`. In CI the second test fails — the empty state never appears — but it passes when run on its own. Why? Also say what you'd replace the `setTimeout` in the first test with.",
    "code": "const queryClient = new QueryClient({\n  defaultOptions: { queries: { staleTime: Infinity } },\n});\n\nconst renderPage = (ui) =>\n  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);\n\ntest('renders a row per invoice', async () => {\n  renderPage(<InvoicesPage />);\n  await new Promise((r) => setTimeout(r, 300));\n  expect(screen.getAllByRole('row')).toHaveLength(invoiceFixtures.length + 1);\n});\n\ntest('shows the empty state', async () => {\n  server.use(http.get('/api/invoices', () => HttpResponse.json([])));\n  renderPage(<InvoicesPage />);\n  expect(await screen.findByText(/no invoices yet/i)).toBeInTheDocument();\n});",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Portals: rendering outside the tree",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "The row-actions menu is portaled to `document.body` so the table's `overflow: hidden` can't clip it. The app also registers `document.addEventListener('click', closeMenu)`, and the row sits inside a `<ThemeContext.Provider>`. A user opens the menu and clicks \"Archive\". Which statement is true?",
    "code": "function RowActions({ invoice, onSelectRow }) {\n  const [open, setOpen] = useState(false);\n  return (\n    <td onClick={() => onSelectRow(invoice.id)}>\n      <button onClick={() => setOpen(true)}>Actions</button>\n      {open &&\n        createPortal(\n          <ul className=\"row-menu\">\n            <button onClick={() => archive(invoice.id)}>Archive</button>\n          </ul>,\n          document.body\n        )}\n    </td>\n  );\n}",
    "language": "jsx",
    "options": [
      "Archive also fires the <td>'s onClick — React events bubble along the React tree.",
      "Archive does not fire the <td>'s onClick — the menu's DOM parent is document.body.",
      "The menu cannot read ThemeContext; a portal starts a fresh context boundary.",
      "The document-level click listener never fires for clicks inside the menu.",
      "overflow: hidden still clips the menu unless the <ul> is also position: fixed."
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Event loop ordering: microtasks vs macrotasks vs await",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "Nothing else is pending on any queue. What is the exact output order?",
    "code": "Promise.resolve()\n  .then(() => {\n    console.log('p1');\n    return Promise.resolve();\n  })\n  .then(() => console.log('p2'));\n\nPromise.resolve()\n  .then(() => console.log('q1'))\n  .then(() => console.log('q2'))\n  .then(() => console.log('q3'));",
    "language": "js",
    "options": [
      "p1 -> q1 -> q2 -> p2 -> q3",
      "p1 -> q1 -> q2 -> q3 -> p2",
      "p1 -> p2 -> q1 -> q2 -> q3",
      "p1 -> q1 -> p2 -> q2 -> q3",
      "q1 -> p1 -> q2 -> q3 -> p2"
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Sequential vs parallel async and await-in-loops",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "`normalize` is sync; `api.getInvoice` and `api.renderPdf` are independent per invoice with no rate limit. This takes 90s for 200 ids, and `summaries` comes back empty even though all 200 render requests reach the PDF service. What are the two defects, and how do you fix them? `summaries` must stay in `invoiceIds` order.",
    "code": "async function syncInvoices(invoiceIds) {\n  const results = [];\n  for (const id of invoiceIds) {\n    const invoice = await api.getInvoice(id);\n    results.push(normalize(invoice));\n  }\n\n  const summaries = [];\n  results.forEach(async (invoice) => {\n    const pdf = await api.renderPdf(invoice);\n    summaries.push({ id: invoice.id, url: pdf.url });\n  });\n\n  return { count: results.length, summaries };\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Async error handling and floating promises",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "When the webhook returns 500, `publishDraft` still resolves `{ ok: true }` and an unhandled rejection is logged. When `store.publish` rejects, the toast shows but `auditLog` never runs and a second unhandled rejection appears. Why does each rejection escape every handler here, and how do you fix both?",
    "code": "async function publishDraft(draftId) {\n  try {\n    const draft = await store.load(draftId);\n    sendWebhooks(draft);\n    await store.publish(draft);\n    return { ok: true, id: draftId };\n  } finally {\n    await store.releaseLock(draftId);\n  }\n}\n\nasync function sendWebhooks(draft) {\n  const res = await fetch(WEBHOOK_URL, { method: 'POST', body: JSON.stringify(draft) });\n  if (!res.ok) throw new Error('webhook rejected');\n}\n\npublishDraft(id)\n  .catch((err) => showToast(err.message))\n  .then((result) => auditLog(result.id));",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Promise combinators and their failure semantics",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "When `fetchAlerts` returns a 500 the whole widget renders blank, and the team is arguing about which combinator to switch to. Exactly one statement below is accurate. Which?",
    "code": "const [stats, alerts, usage] = await Promise.all([\n  fetchStats(range),\n  fetchAlerts(range),\n  fetchUsage(range),\n]);\n\nrender({ stats, alerts, usage });",
    "language": "js",
    "options": [
      "Promise.all rejects on the first rejection and aborts the requests still in flight.",
      "Promise.race settles on the first settle, rejection included; the losers still run.",
      "Promise.any rejects with the first error received when every input rejects.",
      "Promise.allSettled fulfills with only the values of the inputs that succeeded.",
      "After Promise.all rejects, a later rejection from another input goes unhandled."
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Closures over live bindings and stale captures",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "Clicking any row acts on the last row, and after `unmountRows` the handlers keep firing, so listeners accumulate on every re-render. A reviewer also insists `currentFilter` is \"captured wrong\". Which of these are real defects, and how do you fix them?",
    "code": "let currentFilter = 'all';\n\nexport function mountRows(rows) {\n  for (var i = 0; i < rows.length; i++) {\n    rows[i].addEventListener('click', () => select(i, currentFilter), { capture: true });\n  }\n}\n\nexport function unmountRows(rows) {\n  for (var i = 0; i < rows.length; i++) {\n    rows[i].removeEventListener('click', () => select(i, currentFilter));\n  }\n}\n\nexport function setFilter(next) {\n  currentFilter = next;\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Reference semantics, aliasing, and accidental shared mutation",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "Two bugs: adding a tag to one board makes that tag appear on every board created without an explicit `filters`, and dropping a card into column 0 puts it in all three columns. Explain both mechanisms and fix them. Would `Object.freeze(DEFAULT_FILTERS)` have prevented the first?",
    "code": "const DEFAULT_FILTERS = { status: 'open', tags: [] };\n\nexport function createBoard(name, filters = DEFAULT_FILTERS) {\n  return {\n    name,\n    filters,\n    columns: new Array(3).fill({ title: '', cards: [] }),\n  };\n}\n\nexport function addTag(board, tag) {\n  board.filters.tags.push(tag);\n  return board;\n}\n\nexport function addCard(board, columnIndex, card) {\n  board.columns[columnIndex].cards.push(card);\n  return board;\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Shallow vs deep copy: spread, structuredClone, JSON round-trip",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "Running in a current browser or Node 22+, which statements about copying `draft` are true? (Select all that apply.)",
    "code": "const draft = {\n  id: 42,\n  createdAt: new Date('2026-01-05T10:00:00Z'),\n  tags: new Set(['urgent']),\n  author: { name: 'Ana', avatar: undefined },\n  render() {\n    return `#${this.id}`;\n  },\n  get slug() {\n    return `draft-${this.id}`;\n  },\n};",
    "language": "js",
    "options": [
      "structuredClone(draft) as written throws a DataCloneError.",
      "The JSON round-trip turns tags into {} and drops author.avatar and render.",
      "{ ...draft } stores slug as the string 'draft-42' and shares author by reference.",
      "structuredClone, with render removed, keeps slug a live getter and createdAt a Date.",
      "Object.assign({}, draft) deep-copies author but shares tags by reference."
    ],
    "multi": true
  },
  {
    "area": "javascript",
    "topic": "Immutability patterns and object identity",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Write `toggleTaskDone(state, projectId, columnId, taskId)` returning a new state with that task's `done` flipped. Nothing reachable from `state` may be mutated, and deep-clone helpers (structuredClone, JSON round-trip, cloneDeep, Immer) are banned. Everything off the path - `state.ui`, `p2`, `c2`, sibling `t2` - must come back `===`. If any id is missing, return `state` itself. Then list which references changed.",
    "code": "const state = {\n  projects: {\n    p1: {\n      id: 'p1',\n      columns: {\n        c1: {\n          id: 'c1',\n          tasks: {\n            t1: { id: 't1', title: 'Copy review', done: false },\n            t2: { id: 't2', title: 'SEO pass', done: true },\n          },\n        },\n        c2: { id: 'c2', tasks: {} },\n      },\n    },\n    p2: { id: 'p2', columns: {} },\n  },\n  ui: { selectedProjectId: 'p1' },\n};",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Array mutation vs copying, and sort semantics",
    "type": "write",
    "difficulty": "mid",
    "prompt": "`rows` lives in a shared store and must be observably unchanged. Write `sortRows(rows)` returning a NEW array ordered by priority (high, medium, low), then dueDate ascending with missing dates last within their priority group, then title compared case- and accent-insensitively. Then give the resulting order of ids.",
    "code": "const rows = [\n  { id: 10,  title: 'Émile onboarding', priority: 'low',    dueDate: '2026-03-02' },\n  { id: 9,   title: 'audit log',        priority: 'high',   dueDate: null },\n  { id: 100, title: 'Audit Log v2',     priority: 'high',   dueDate: '2026-02-11' },\n  { id: 1,   title: 'billing retry',    priority: 'medium', dueDate: '2026-02-11' },\n  { id: 2,   title: 'audit log v2',     priority: 'high',   dueDate: '2026-02-11' },\n  { id: 30,  title: 'emile onboarding', priority: 'low',    dueDate: '2026-03-02' },\n];",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "reduce vs map/filter/flatMap and accumulator discipline",
    "type": "write",
    "difficulty": "mid",
    "prompt": "`summarizeByCustomer` takes about four seconds on 15k orders / 120k line items, and profiling puts the time here rather than in rendering. Rewrite it to return the same shape, and state the cost of the original versus yours.",
    "code": "// orders: ~15k rows; each { id, customerId, amountCents, lineItems: [...] }\nexport function summarizeByCustomer(orders) {\n  return orders.reduce((acc, order) => ({\n    ...acc,\n    [order.customerId]: {\n      customerId: order.customerId,\n      totalCents: (acc[order.customerId]?.totalCents ?? 0) + order.amountCents,\n      lineItems: [\n        ...(acc[order.customerId]?.lineItems ?? []),\n        ...order.lineItems,\n      ],\n    },\n  }), {});\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "`this` binding across call forms",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "The input listener throws on the first keystroke, and `analytics.trackAll([...])` throws too. Which statements are accurate? (Select all that apply.)",
    "code": "class SearchAnalytics {\n  constructor(client) {\n    this.client = client;\n    this.queue = [];\n  }\n\n  track(event) {\n    this.queue.push(event);\n    this.client.send(this.queue);\n  }\n\n  trackAll = (events) => {\n    events.forEach(function (e) {\n      this.track(e);\n    });\n  };\n}\n\nconst analytics = new SearchAnalytics(apiClient);\nsearchInput.addEventListener('input', analytics.track);",
    "language": "js",
    "options": [
      "In the listener `this` is the input element, so `this.queue` is undefined.",
      "In the listener `this` is `undefined` — a detached method always loses its receiver.",
      "In `trackAll`, the `function` callback gets `this === undefined` (strict class body).",
      "`analytics.trackAll.call(other, events)` runs the same logic against `other`.",
      "Making `track` an arrow field fixes the listener but adds nothing to the prototype."
    ],
    "multi": true
  },
  {
    "area": "javascript",
    "topic": "Equality and coercion",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "Filters come off the URL query string, so a present value is a string and an absent one is `undefined`. What is `merged`?",
    "code": "const defaultFilters = { page: 1, minRating: 0, q: '' };\n\nfunction applyFilters({ page, minRating, q }) {\n  const filters = {};\n  if (page) filters.page = Number(page);\n  if (minRating != null) filters.minRating = Number(minRating);\n  if (q !== '') filters.q = q;\n  return filters;\n}\n\nconst merged = {\n  ...defaultFilters,\n  ...applyFilters({ page: '0', minRating: 'all', q: undefined }),\n};",
    "language": "js",
    "options": [
      "`{ page: 0, minRating: NaN, q: undefined }`",
      "`{ page: 1, minRating: NaN, q: undefined }`",
      "`{ page: 0, minRating: 0, q: undefined }`",
      "`{ page: 0, minRating: NaN, q: '' }`",
      "`{ page: 1, minRating: 0, q: '' }`"
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Optional chaining and nullish coalescing precision",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "A backend release renamed `cart.taxes` to `cart.taxSummary`. Every order in one region shipped with zero tax for a week: nothing threw, nothing was logged. Explain the mechanism, and say what the `taxRate` line should do instead -- your answer has to hold up against the `credits` line, which uses the same operators and is correct.",
    "code": "const DEFAULT_SHIPPING_CENTS = 699;\n\nexport function getOrderTotals(cart, user) {\n  const subtotal = cart.lineItems.reduce((s, li) => s + li.priceCents * li.qty, 0);\n  const shipping = cart.shippingQuote?.costCents || DEFAULT_SHIPPING_CENTS;\n  const credits = user.wallet?.credits?.appliedCents ?? 0;\n  const taxRate = cart.taxes?.rate ?? 0;\n  const tax = Math.round((subtotal - credits) * taxRate);\n\n  return { subtotalCents: subtotal, shippingCents: shipping, taxCents: tax };\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Scope, hoisting, and the temporal dead zone",
    "type": "debug",
    "difficulty": "hard",
    "prompt": "Called as `initToolbar(root, { theme: 'compact' })`, this module throws `ReferenceError: applyTheme is not defined` -- and it throws that whatever `theme` is. Pasted into a classic non-module `<script>`, the same code throws `TypeError: applyTheme is not a function` instead. Explain the difference, then give the fix.",
    "code": "// toolbar.js -- an ES module\nexport function initToolbar(root, { theme } = {}) {\n  applyTheme();\n\n  if (theme === 'compact') {\n    function applyTheme() {\n      root.classList.add('theme-compact');\n    }\n  }\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Destructuring edge cases and default parameters",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "Payload A `{ displayName: null, address: { city: 'Austin' } }` renders the string `null` as the title. Payload B `{ displayName: null, address: null }` throws `Cannot destructure property 'city' of 'profile.address' as it is null`. What one rule explains both, and how do you fix it without abandoning destructuring?",
    "code": "export function formatProfile(profile = {}, { fallbackName = 'Unknown' } = {}) {\n  const {\n    displayName = fallbackName,\n    address: { city = '\\u2014', country = '\\u2014' } = {},\n    ...rest\n  } = profile;\n\n  return { title: displayName, subtitle: `${city}, ${country}`, rest };\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Map/Set vs plain objects and arrays",
    "type": "write",
    "difficulty": "mid",
    "prompt": "`annotateDocs` takes over a second (2k docs, up to ~50 collaborators each, 5k shared ids), and one user whose username is `constructor` sees `ownerRole` render as `function Object() { [native code] }`. Rewrite it so both problems are gone.",
    "code": "// sharedUserIds: ~5k id strings from the sharing service\n// roleByUsername: plain object literal, username -> role string\nexport function annotateDocs(docs, sharedUserIds, roleByUsername) {\n  return docs.map((doc) => ({\n    ...doc,\n    isShared: doc.collaboratorIds.some((id) => sharedUserIds.includes(id)),\n    ownerRole: roleByUsername[doc.ownerUsername] ?? 'viewer',\n  }));\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Memory leaks and garbage-collection intuition",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "Users who scroll a long list in one session see the tab pass a gigabyte, even though the returned teardown runs on every row unmount. Which retained object grows without bound, and what should the teardown actually be?",
    "code": "const rowStateById = new Map();\n\nexport function mountRow(container, row) {\n  const el = document.createElement('div');\n  el.textContent = row.label;\n  container.appendChild(el);\n\n  const impressions = [];\n  const observer = new IntersectionObserver((entries) => {\n    impressions.push({ ratio: entries[0].intersectionRatio, row });\n    analytics.report(impressions);\n  });\n  observer.observe(el);\n\n  analytics.on('flush', () => observer.takeRecords());\n  rowStateById.set(row.id, { el, row, impressions });\n\n  return () => container.removeChild(el);\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "WeakMap, WeakSet, and WeakRef",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "A virtualized grid keys measured row heights by the row's DOM node; rows are recycled and detached constantly. `totalMeasured` was added later for a debug overlay. Which statement is correct?",
    "code": "const measurements = new WeakMap();\n\nexport function recordHeight(node, height) {\n  measurements.set(node, { height, measuredAt: performance.now() });\n}\n\nexport function getHeight(node) {\n  return measurements.get(node)?.height;\n}\n\nexport function totalMeasured() {\n  return [...measurements.keys()].length;\n}",
    "language": "js",
    "options": [
      "`totalMeasured` throws: a WeakMap has no `keys`, no `size` and no iteration.",
      "It returns a count, but a stale one until the next GC sweeps collected keys out.",
      "It works, and a plain `Map` here would behave the same, since recycled rows leave the DOM.",
      "It works once the WeakMap is keyed by the row's `data-row-id` string instead of the node.",
      "Wrapping the nodes in `WeakRef`s inside a `Map` restores iteration with no retention."
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Implementing debounce and throttle",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Implement `debounce(fn, wait)` from scratch, with a `.flush()` that invokes any pending call immediately and returns its result. `this` and the most recent arguments must reach `fn`. Then, in one sentence: why is the debounced function's own return value misleading?",
    "code": "const saveDraft = debounce((doc) => api.save(doc), 800);\nsaveDraft(doc);      // repeated keystrokes coalesce\nsaveDraft.flush();   // run any pending call right now",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "fetch semantics and HTTP-layer error handling",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "Every data call in the app goes through this wrapper. Which two statements about it are true? (Select all that apply.)",
    "code": "async function apiRequest(path, { timeoutMs = 8000, ...init } = {}) {\n  const res = await fetch(`/api${path}`, {\n    ...init,\n    signal: AbortSignal.timeout(timeoutMs),\n  });\n  const data = await res.json();\n  if (!res.ok) throw new Error(data.message ?? 'Request failed');\n  return data;\n}",
    "language": "js",
    "options": [
      "A) A 500 response rejects the fetch promise, so !res.ok is reachable only for 4xx.",
      "B) A 502 returning an HTML error page throws a SyntaxError, hiding the status.",
      "C) A caller that passes its own signal in init has it silently discarded.",
      "D) Timeouts reach the caller's catch as an error with name 'AbortError'.",
      "E) On a parse failure the caller can retry the read with res.text() on the same Response."
    ],
    "multi": true
  },
  {
    "area": "javascript",
    "topic": "DOM event delegation, bubbling, and capture",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "Each delete button contains an `<svg>` icon and a `<span>Delete</span>`. Three symptoms: clicking a row never opens the invoice; delete fires only when the click lands on the button's padding; and a dropdown that closes via a document-level click listener stopped closing. Fix the handler.",
    "code": "const table = document.querySelector('#invoices');\n\ntable.addEventListener('click', (e) => {\n  if (e.target.dataset.action === 'delete') {\n    e.stopPropagation();\n    deleteInvoice(e.target.dataset.id);\n  }\n\n  const row = e.currentTarget.closest('tr');\n  if (row) openInvoice(row.dataset.id);\n});",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Prototypes and modern class semantics",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "The retry layer reads `err.retryable`; the logger serializes with `Object.keys`. Exactly one statement about `err` is true. Which?",
    "code": "class ApiError extends Error {\n  constructor(message, status) {\n    super(message);\n    this.status = status;\n    this.retryable = status >= 500;\n  }\n}\n\nclass RateLimitError extends ApiError {\n  retryable = true;\n  constructor(retryAfter) {\n    super('Rate limited', 429);\n    this.retryAfter = retryAfter;\n  }\n  describe() { return `retry in ${this.retryAfter}s`; }\n}\n\nconst err = new RateLimitError(30);",
    "language": "js",
    "options": [
      "A) err.retryable is false — the base constructor's assignment runs last.",
      "B) err.retryable is true and appears in Object.keys(err).",
      "C) err.retryable is true but Object.keys(err) is empty — fields live on the prototype.",
      "D) err instanceof ApiError is false.",
      "E) After `delete err.retryable`, err.retryable is still true."
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "ES modules vs CommonJS: live bindings, cycles, dynamic import",
    "type": "debug",
    "difficulty": "hard",
    "prompt": "main.js used to start with `import './session.js';` and booted fine. A refactor put `import { client } from './apiClient.js';` above it — nothing else changed — and startup now dies with `ReferenceError: Cannot access 'client' before initialization`. Why does the import order decide this, and what is your fix?",
    "code": "// apiClient.js\nimport { getToken } from './session.js';\n\nexport const client = {\n  async get(path) {\n    const res = await fetch(path, {\n      headers: { Authorization: `Bearer ${getToken()}` },\n    });\n    return res.json();\n  },\n};\n\n// session.js\nimport { client } from './apiClient.js';\n\nlet token = null;\nexport const refresher = startTokenRefresh(client);\nexport function getToken() {\n  return token;\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "JSON serialization pitfalls",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "An editor persists its draft through JSON and reads it back on the next visit. Which option describes `restored`?",
    "code": "const draft = {\n  updatedAt: new Date('2026-03-01T10:00:00Z'),\n  tags: new Set(['finance', 'draft']),\n  wordTarget: Infinity,\n  history: [1, undefined],\n  onSave: () => persist(draft),\n};\n\nconst restored = JSON.parse(JSON.stringify(draft));",
    "language": "js",
    "options": [
      "A) updatedAt a Date, tags ['finance','draft'], wordTarget null, history [1, null]",
      "B) updatedAt an ISO string, tags {}, wordTarget null, history [1, null], no onSave key",
      "C) JSON.stringify throws a TypeError on the function and on Infinity",
      "D) updatedAt an ISO string, tags {}, wordTarget Infinity, history [1], no onSave key",
      "E) updatedAt an ISO string, tags {}, wordTarget null, history [1, null], onSave null"
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Memoization and cache correctness",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Write `memoizeAsync(loader, ttlMs)` for `loader(orgId, filters)`, where `filters` is a plain JSON-safe object. Concurrent calls with equivalent arguments must produce exactly one `loader` call; a resolved value is served for `ttlMs` measured from when the load settled; a rejection is never cached — every waiter sees it and the next call retries.",
    "code": "const loadMembers = memoizeAsync(fetchOrgMembers, 30_000);\n\nconst [a, b] = await Promise.all([\n  loadMembers('org_7', { role: 'admin', active: true }),\n  loadMembers('org_7', { active: true, role: 'admin' }),\n]); // exactly one network request",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Concurrency-limited promise pool",
    "type": "write",
    "difficulty": "senior",
    "prompt": "An uploader must push ~5,000 files through an API that tolerates 6 simultaneous requests. Write `mapWithConcurrency(items, limit, worker)`: at most `limit` calls in flight, a new item starting the instant any one finishes (not batch by batch), results in input order, rejecting on the first error. One sentence: what happens to work already in flight when it rejects?",
    "code": "const results = await mapWithConcurrency(files, 6, (file, i) => uploadFile(file, i));",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Retry with exponential backoff",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Write `withRetry(operation, { maxAttempts, baseDelayMs, maxDelayMs, signal })`. `operation({ attempt, signal })` throws a `TypeError` on network failure and an `HttpError` carrying `status` on any non-2xx. Retry only network failures, 429, 408 and 5xx; back off exponentially with jitter, capped at `maxDelayMs`; an abort must reject while you are sleeping, not after the sleep elapses.",
    "code": "const res = await withRetry(({ signal }) => apiFetch('/reports/generate', { signal }), {\n  maxAttempts: 5,\n  baseDelayMs: 300,\n  maxDelayMs: 10_000,\n  signal: controller.signal,\n});",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Custom errors, error.cause, and typed failure handling",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "Users on a locked plan (fetchProfile rejects with a 403) get the generic error screen instead of the upgrade prompt — while an unrelated org occasionally gets the upgrade prompt for no reason. Explain both, then rewrite the throw site and the catch site.",
    "code": "async function loadDashboard(orgId) {\n  try {\n    const profile = await fetchProfile(orgId);\n    const metrics = await fetchMetrics(orgId);\n    return { profile, metrics };\n  } catch (err) {\n    throw new Error(`Failed to load dashboard for ${orgId}: ${err.message}`);\n  }\n}\n// route component\ntry {\n  data = await loadDashboard(orgId);\n} catch (err) {\n  if (err.message.includes('403') || err.message.includes('Forbidden')) {\n    showUpgradePrompt();\n  } else {\n    tracker.captureException(err);\n    showGenericError();\n  }\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Dates, timezones, and Intl formatting",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "Invoice dates arrive from the API as date-only strings. snooze(invoice, 7) on an invoice due '2026-03-05' returns '2026-03-11' for a user in Los Angeles but '2026-03-12' for one in Berlin. Why? Then show the fix.",
    "code": "// invoice: { id, dueDate: '2026-03-05' }\nexport function snooze(invoice, days) {\n  const d = new Date(invoice.dueDate);\n  d.setDate(d.getDate() + days);\n  return { ...invoice, dueDate: d.toISOString().slice(0, 10) };\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Numeric precision, money, and BigInt",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "A checkout service receives order IDs from a Postgres bigint column (19 digits) and line-item amounts as decimal strings. Which statements are true?",
    "code": "",
    "language": "",
    "options": [
      "A 19-digit id is already mangled by JSON.parse, so it must arrive as a string to survive.",
      "JSON.stringify emits a BigInt as an unquoted integer, so BigInt ids round-trip to the API.",
      "Minor-unit integers make + and - exact, but tax rates need an explicit rounding rule.",
      "BigInt holds 64-bit ids exactly but has no fractions, so rates must be scaled to integers.",
      "Math.abs(a - b) < Number.EPSILON is the right general test for equal cart totals."
    ],
    "multi": true
  },
  {
    "area": "javascript",
    "topic": "Generators, iterators, and custom iterables",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Write createAuditLog(fetchPage) so `for await (const e of log)` yields entries flattened across pages, requests a page only when the consumer reaches it, aborts the in-flight request if the consumer breaks early, and can be iterated a second time from page one. Then, in one line: what makes your cleanup run on break?",
    "code": "// GET /api/audit?cursor=<opaque> ->\n//   { entries: [{ id, actor, action, at }], nextCursor: 'c_82f' | null }\nasync function fetchPage(cursor, signal) { /* rejects on abort */ }",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Property descriptors, accessors, and freezing",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "Region overrides silently do nothing. forRegion('eu') returns an object whose apiBase is the EU host, but every URL read off eu.endpoints still points at prod. Why? Then show the fix.",
    "code": "// config.js\nexport const config = Object.freeze({\n  apiBase: 'https://api.prod.example.com',\n  featureFlags: { beta: false },\n  get endpoints() {\n    return { orders: `${this.apiBase}/orders`, users: `${this.apiBase}/users` };\n  },\n});\n\n// client.js\nexport function forRegion(region) {\n  return { ...config, apiBase: `https://api.${region}.example.com` };\n}\n\nconst eu = forRegion('eu');\nfetch(eu.endpoints.orders); // https://api.prod.example.com/orders",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Regex in real work",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "QA uploads a CSV in which every SKU is correctly formatted, but validateRows marks roughly every other row invalid. Re-uploading the identical file sometimes reproduces the same failures and sometimes flips which rows fail. Explain both observations, and give the fix you would ship.",
    "code": "const SKU_PATTERN = /^[A-Z]{3}-\\d{4}(?:-[A-Z]{2})?$/g;\n\nexport function validateRows(rows) {\n  return rows.map((row) => ({ ...row, valid: SKU_PATTERN.test(row.sku) }));\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Runtime type checking and validating untrusted data at boundaries",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "A teammate added this guard so a malformed /api/reports payload can never reach app state. Which statement is the most accurate critique?",
    "code": "function isReport(value) {\n  if (typeof value !== 'object') return false;\n  if (!(value.rows instanceof Array)) return false;\n  if (isNaN(value.total)) return false;\n  return true;\n}\n\nconst data = await (await fetch(`/api/reports/${id}`)).json();\nreturn isReport(data) ? data : null;",
    "language": "js",
    "options": [
      "typeof null is 'object', so a null body throws inside the guard, and isNaN(null) is false.",
      "The checks are sound; the only gap is that the objects inside rows are never validated.",
      "value?.constructor === Object should replace the typeof check; the rest is then correct.",
      "The one defect is isNaN vs Number.isNaN; the other checks are fine for parsed JSON.",
      "The checks are correct; the defect is returning null, which hides why validation failed."
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Unicode-safe string handling and locale-aware comparison",
    "type": "write",
    "difficulty": "mid",
    "prompt": "Write truncate(text, max) for a comment widget - at most max user-perceived characters, appending '…' only when something was actually cut. Built-ins only, no libraries, no regex. Then, in one line: why is [...text].slice(0, max).join('') not good enough?",
    "code": "",
    "language": "",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Symbols and well-known symbols",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "A caching package tags entities with bookkeeping metadata under a Symbol key so it cannot collide with real fields and does not leak into payloads. Which statement about this design is correct?",
    "code": "const ENTRY_META = Symbol('cache.entryMeta');\nexport const tag = (entity, meta) => {\n  entity[ENTRY_META] = { fetchedAt: Date.now(), ...meta };\n  return entity;\n};\n\n// app code\nconst user = tag(await getUser(id), { source: 'network' });\nawait postAudit(JSON.stringify(user));\nconst draft = { ...user, name: nextName };",
    "language": "js",
    "options": [
      "The symbol key makes String(user) route through it, so Symbol.toPrimitive must be defined.",
      "JSON.stringify, Object.keys and spread all skip the tag, so draft stays free of metadata.",
      "JSON and Object.keys skip the tag, but spread copies it and Reflect.ownKeys reveals it.",
      "Symbol.for would be the safer default here, since it avoids duplicate-package mismatches.",
      "Symbol keys are non-enumerable, which is why Object.keys and for...in skip them."
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Currying, partial application, and function composition",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Write curry(fn) - callable with its arguments split across any number of calls, taking arity from fn itself with a way to override it. A partial must be reusable: with const withVat = curry(applyTax)(0.2), calling withVat(a) then withVat(b) must not leak arguments between calls. Then name one signature where the arity it reads is wrong.",
    "code": "const applyTax = (rate, item) => ({ ...item, price: item.price * (1 + rate) });",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Proxy and Reflect in practice",
    "type": "debug",
    "difficulty": "hard",
    "prompt": "This dependency tracker passes its tests against plain object literals. Against the real Cart, cart.add({ price: 12.5 }) throws - yet reading cart.subtotal on its own works fine. Explain the difference, then show the trap you would ship.",
    "code": "function track(target) {\n  return new Proxy(target, {\n    get(obj, key) { deps.add(key); return obj[key]; },\n  });\n}\n\nclass Cart {\n  #lines = [];\n  add(line) { this.#lines.push(line); }\n  get subtotal() { return this.#lines.reduce((n, l) => n + l.price, 0); }\n}\n\nconst cart = track(new Cart());\ncart.add({ price: 12.5 });",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "html",
    "topic": "File inputs, drag-and-drop and object URL lifetime",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "Dropping a file on the zone makes the browser open that file instead of uploading it, and picking files with the button throws before any preview renders. QA also sees the tab past 1 GB after an hour of adding images. Explain the causes and give the corrected code.",
    "code": "function DropZone({ onFiles }) {\n  const [previews, setPreviews] = useState([]);\n  const handleDrop = (e) => {\n    e.stopPropagation();\n    const files = e.dataTransfer.files;\n    setPreviews(files.map((f) => URL.createObjectURL(f)));\n    onFiles(files);\n  };\n  return (\n    <div className=\"zone\" onDrop={handleDrop}>\n      <input\n        type=\"file\"\n        accept=\"image/png\"\n        multiple\n        onChange={(e) => setPreviews(e.target.files.map(URL.createObjectURL))}\n      />\n      {previews.map((src) => <img key={src} src={src} width={80} height={80} />)}\n    </div>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "html",
    "topic": "Links vs buttons and the interactive-element contract",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "`navigate` comes from useNavigate in a React Router SPA. Which statements are true of this code exactly as written?",
    "code": "<div\n  role=\"button\"\n  tabIndex={0}\n  onClick={() => navigate(`/projects/${id}/settings`)}\n>\n  Settings\n</div>\n<button onClick={() => deleteRow(id)}>Delete</button>",
    "language": "jsx",
    "options": [
      "Settings fires on neither Enter nor Space until a key handler is written by hand.",
      "With no href, middle-click, Cmd-click and 'Open in new tab' are unavailable.",
      "It changes the address, so it has to be a real <a href>, not a div.",
      "Settings can be disabled with the disabled attribute, exactly as Delete can.",
      "Delete has no type, so it defaults to type=\"button\" and is safe inside a <form>."
    ],
    "multi": true
  },
  {
    "area": "html",
    "topic": "Constraint validation: custom errors and validity state",
    "type": "write",
    "difficulty": "mid",
    "prompt": "Write the markup, the minimal JS and the one CSS rule so that 'Confirm password' blocks submission with the native message 'Passwords do not match' while it differs from 'Password', stops blocking the instant it matches, and is not styled red before the user has typed anything.",
    "code": "",
    "language": "html",
    "options": [],
    "multi": false
  },
  {
    "area": "html",
    "topic": "Native form submission semantics and constraint validation",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "Two bugs in production: the FormData reaching inviteMember contains only role=member, and is completely empty for users whose canAssignRoles is false; and clicking 'Save draft' (or pressing Enter in the Email field) saves a draft AND sends the invite. Explain the causes and give the corrected markup.",
    "code": "function InviteForm({ orgId, canAssignRoles }) {\n  const [state, formAction] = useActionState(inviteMember, null);\n  return (\n    <form action={formAction}>\n      <input type=\"hidden\" value={orgId} />\n      <label>\n        Email\n        <input type=\"email\" required />\n      </label>\n      <select name=\"role\" defaultValue=\"member\" disabled={!canAssignRoles}>\n        <option value=\"member\">Member</option>\n        <option value=\"admin\">Admin</option>\n      </select>\n      <button onClick={saveDraft}>Save draft</button>\n      <button type=\"submit\">Send invite</button>\n    </form>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "html",
    "topic": "Sandboxing untrusted iframes",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "Users paste HTML/CSS/JS into an editor and see it rendered in this preview pane. Security review pasted a snippet that read the app's auth token out of localStorage and posted it offsite — despite the sandbox. Explain how it got out, and give the corrected embed.",
    "code": "function Preview({ userHtml }) {\n  return (\n    <iframe\n      title=\"Preview\"\n      sandbox=\"allow-scripts allow-same-origin allow-forms allow-popups\"\n      srcDoc={userHtml}\n      className=\"preview-frame\"\n    />\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "html",
    "topic": "Responsive images and image loading performance",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Write the <img> for a project-grid card image, showing the arithmetic behind sizes. The grid has max-width 1200px, box-sizing: border-box, 16px horizontal padding each side, 24px column gap; 1 column below 640px, 2 from 640px, 4 from 1024px. Files are 300/600/900 wide, JPEG only, and the grid starts below the fold.",
    "code": "",
    "language": "html",
    "options": [],
    "multi": false
  },
  {
    "area": "html",
    "topic": "Declarative shadow DOM and template inertness",
    "type": "mcq",
    "difficulty": "hard",
    "prompt": "This block is server-rendered and `host` is the div; the client later re-renders the identical markup through innerHTML. Which single statement about it is true?",
    "code": "<div id=\"host\">\n  <template shadowrootmode=\"open\">\n    <style>p { color: red; }</style>\n    <slot name=\"title\"></slot>\n    <img src=\"/chart.png\" width=\"600\" height=\"200\">\n  </template>\n  <h2 slot=\"title\">Q3 results</h2>\n  <p>Revenue is up.</p>\n</div>\n\n<script>\n  host.innerHTML = MARKUP; // same string the server sent\n</script>",
    "language": "html",
    "options": [
      "The innerHTML pass leaves an inert <template> child and no shadow root at all.",
      "The <img> stays inert and is only fetched once the template is cloned.",
      "The shadow <style> reddens the light-DOM <p>, since shadow styles apply downward.",
      "Slotting moves the <h2> out of the light DOM and into the shadow tree.",
      "The unslotted <p> renders after the <h2>, in light-DOM source order."
    ],
    "multi": false
  },
  {
    "area": "html",
    "topic": "Valid nesting and how the HTML parser rewrites your markup",
    "type": "debug",
    "difficulty": "hard",
    "prompt": "This was fine in a client-only Vite build. Under Next.js SSR it throws a hydration error, and clicking 'Acknowledge' navigates to the incident page. Two nestings here are invalid, but only one causes the hydration error. Which one, and why did the client-only build hide it?",
    "code": "export function IncidentCard({ incident, ack }) {\n  return (\n    <a className=\"card\" href={`/incidents/${incident.id}`}>\n      <p className=\"meta\">\n        <span className=\"sev\">{incident.severity}</span>\n        <div className=\"title\">{incident.title}</div>\n      </p>\n      <p className=\"summary\">\n        {incident.summary}\n        <button type=\"button\" onClick={() => ack(incident.id)}>\n          Acknowledge\n        </button>\n      </p>\n    </a>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "html",
    "topic": "Native overlay and disclosure elements: dialog, popover, details, datalist",
    "type": "write",
    "difficulty": "senior",
    "prompt": "A row's Delete button opens a destructive confirmation overlay. Using platform elements only (no modal library, no focus-trap package), write the markup and the minimal JS. It must render above everything, make the page behind inert, dismiss on Escape, and let the caller tell cancelled from confirmed without a click handler per button.",
    "code": "",
    "language": "html",
    "options": [],
    "multi": false
  },
  {
    "area": "html",
    "topic": "The document head: render-blocking resources and mobile/SEO metadata",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "This is the <head> of a server-rendered product page. Which single statement about it is correct?",
    "code": "<head>\n  <title>Acme</title>\n  <meta name=\"viewport\"\n        content=\"width=device-width, initial-scale=1, user-scalable=no\" />\n  <link rel=\"stylesheet\" href=\"/assets/app.css\" />\n  <script src=\"https://cdn.analytics.example/tag.js\" async></script>\n  <script type=\"module\" src=\"/src/main.js\"></script>\n  <script src=\"/src/consent-banner.js\"></script>\n  <link rel=\"preconnect\" href=\"https://cdn.analytics.example\" />\n</head>",
    "language": "html",
    "options": [
      "main.js is deferred by default; consent-banner.js blocks the parser at its position.",
      "The async analytics tag is the main parser blocker, since async blocks during download.",
      "The stylesheet is declared first, so the classic script's position costs nothing extra.",
      "user-scalable=no is ignored by every current mobile browser, so it has no effect.",
      "preconnect must precede the stylesheet or the preload scanner discards it."
    ],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Flexbox sizing algorithm & the automatic minimum size trap",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "With a long message the preview never ellipsizes and pushes the timestamp out of the 320px row. A teammate adds `min-width: 0` to `.preview`; nothing changes. Why doesn't that fix it, and what is the minimal fix?",
    "code": "/*\n<li class=\"row\">\n  <img class=\"avatar\" alt=\"\" />\n  <div class=\"body\">\n    <span class=\"name\">Priya Raman</span>\n    <p class=\"preview\">Sure - I pushed the migration script this morning, ping me if CI is red</p>\n  </div>\n  <time class=\"stamp\">14:02</time>\n</li>\n*/\n\n.row { display: flex; align-items: center; gap: 12px; width: 320px; }\n.avatar { width: 40px; height: 40px; }\n.body { display: flex; flex-direction: column; flex: 1; }\n.name,\n.preview { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.stamp { flex: none; }",
    "language": "css",
    "options": [],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Cascade resolution: layers, specificity, !important, and inheritance",
    "type": "mcq",
    "difficulty": "hard",
    "prompt": "For `<div id=\"app\"><h3 class=\"title text-red\">Q3 revenue</h3></div>`, what color renders and why?",
    "code": "@layer components, utilities;\n\n@layer components {\n  .title { color: teal !important; }\n}\n\n@layer utilities {\n  .text-red { color: red; }\n}\n\n#app .title { color: green; }\n\n.text-red { color: orange !important; }",
    "language": "css",
    "options": [
      "green - unlayered declarations outrank layered ones, so the ID selector wins.",
      "teal - for `!important`, layer order reverses and unlayered important ranks lowest.",
      "orange - unlayered `!important` outranks any layered `!important`.",
      "red - `utilities` is the last layer named, so it beats `components` and unlayered.",
      "teal - among the `!important` declarations it has the higher specificity."
    ],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Grid track sizing: explicit vs implicit tracks, auto-fit/auto-fill, minmax",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "`.grid` sits in a container whose content box is exactly 1000px wide. Select all true statements.",
    "code": ".grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 16px;\n}",
    "language": "css",
    "options": [
      "With 2 cards, `auto-fit` gives ~492px cards; `auto-fill` ~323px plus an empty column.",
      "With 3 or more cards, `auto-fit` and `auto-fill` render identically.",
      "Four 232px columns fit here, because the `1fr` maximum can pull a track under 240px.",
      "In a 200px-wide pane the track overflows; `minmax(min(240px, 100%), 1fr)` prevents that.",
      "Wrapped rows are sized by the same `repeat()`, so each row is at least 240px tall."
    ],
    "multi": true
  },
  {
    "area": "css",
    "topic": "Stacking contexts and containing blocks (the transform side effects)",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "`.card__menu` is a DOM child of the card, positioned from `getBoundingClientRect()`. Only while the card is hovered, it lands offset by the card's own position, scrolls with the list, and paints under the next card's badge — z-index 2147483647 changes nothing. What's the cause, and what would you ship?",
    "code": ".card { position: relative; transition: transform 160ms ease; }\n.card:hover { transform: translateY(-4px); }\n\n.card__badge { position: absolute; top: 8px; right: 8px; z-index: 5; }\n\n.card__menu { position: fixed; z-index: 9999; width: 220px; }",
    "language": "css",
    "options": [],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Scroll containers, overflow, and position: sticky",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "The table header used to pin to the top of `.scroller`. It now just scrolls out of sight, and git blame says it broke the day `overflow-x: hidden` was added to `.table-wrap` to kill a stray horizontal scrollbar. Why does that kill sticky, and what exactly do you change?",
    "code": "/* .scroller > .table-wrap > table > thead.thead */\n\n.scroller { flex: 1; min-height: 0; overflow-y: auto; }\n.table-wrap { overflow-x: hidden; }\n.thead { position: sticky; top: 0; background: #fff; }",
    "language": "css",
    "options": [],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Custom properties, design tokens, and theming/dark mode",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Write the theming layer for a Next.js App Router design system: light by default, OS preference selects dark, and a persisted explicit choice forces either mode with no wrong-theme flash on first paint after SSR. Then say what `border-radius: var(--card-radius, 8px)` renders when a consumer sets `--card-radius: 12`.",
    "code": "",
    "language": "",
    "options": [],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Container queries vs media queries for component responsiveness",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "In a 640px-wide column the title does grow to 1.25rem, but the card never switches to two columns — it stays single column at every width. Why?",
    "code": ".card {\n  container-type: inline-size;\n  display: grid;\n  gap: 12px;\n}\n\n@container (min-width: 420px) {\n  .card { grid-template-columns: 160px 1fr; }\n  .card__title { font-size: 1.25rem; }\n}",
    "language": "css",
    "options": [
      "`.card` has no definite width, so its inline size evaluates as 0 and never matches.",
      "`min-width` in `@container` still resolves against the viewport; use `cqi` units.",
      "Layout properties can't be set inside `@container` — that's circular; `font-size` can.",
      "A query container can't be styled by its own query; only its descendants match.",
      "Unnamed containers aren't matched; you need `container: card / inline-size`."
    ],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Fluid sizing: clamp(), relative units, and viewport vs container math",
    "type": "write",
    "difficulty": "mid",
    "prompt": "Write one fluid `font-size` for an h1: exactly 28px at a 320px viewport, exactly 56px at 1440px, linear between, clamped at both ends — show the arithmetic. Then: the same h1 inside a 360px sidebar on a 1440px screen still renders 56px. Why, and what is the minimal fix?",
    "code": "",
    "language": "",
    "options": [],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Animation performance: the rendering pipeline and compositing",
    "type": "write",
    "difficulty": "senior",
    "prompt": "This accordion stutters on mid-range Android, and on long pages the whole list hitches for the duration of the animation. Rewrite it so the panel still animates open/closed with content of unknown height, with no JS measurement. Then say what `will-change: height` is buying here.",
    "code": "function FaqItem({ q, a }) {\n  const [open, setOpen] = useState(false);\n  const bodyRef = useRef(null);\n  const h = open ? (bodyRef.current?.scrollHeight ?? 0) : 0;\n\n  return (\n    <div className=\"faq\">\n      <button onClick={() => setOpen(!open)}>{q}</button>\n      <div className=\"faq__body\" ref={bodyRef} style={{ height: h }}>{a}</div>\n    </div>\n  );\n}\n\n.faq__body {\n  overflow: hidden;\n  transition: height 250ms ease;\n  will-change: height;\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Styling architecture tradeoffs: utility classes, CSS Modules, and runtime CSS-in-JS",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Write a `<Meter>` (labelled bar, fill width `value / max`, accent color per instance) that stays a Server Component, whose every CSS rule is extracted at build time, and where a 400th instance with a percentage and accent no other instance uses adds zero new rules. Then: what stops runtime styled-components from meeting this?",
    "code": "",
    "language": "",
    "options": [],
    "multi": false
  }
];
