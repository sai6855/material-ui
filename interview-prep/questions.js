/* Question bank — 100 questions.
   react 40 · javascript 40 · html 10 · css 10
   30 multiple choice · 35 find-the-bug · 35 write-code
   Generated file — correct answers deliberately excluded; the Evaluate flow is graded by an LLM. */

window.QUESTIONS = [
  {
    "area": "react",
    "topic": "useEffect dependencies & stale closures",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "This checkout session timer is in production. `formatClock(seconds)` is a pure helper that renders mm:ss. On mount the span shows 10:00, one second later it shows 09:59, and after that the display never changes again; onExpire is never called, even after ten minutes.\n\nWalk through what happens on tick 1, tick 2 and tick 300 — including what React does with each queued update, and why the visible output stops changing after the first tick even though the callback keeps firing. Then rewrite the effect so the countdown runs to zero, onExpire fires exactly once at zero, and a new interval is created only when sessionId changes — never once per second.\n\nTwo things you must address explicitly: (a) the exhaustive-deps lint rule would tell you to add the values this effect reads to the dependency array — say what goes wrong if you do that, for each value it names; (b) where onExpire belongs, given the parent re-creates it inline on every render.",
    "code": "function SessionTimer({ sessionId, onExpire }) {\n  const [secondsLeft, setSecondsLeft] = useState(600);\n\n  useEffect(() => {\n    const id = setInterval(() => {\n      setSecondsLeft(secondsLeft - 1);\n      if (secondsLeft <= 1) {\n        onExpire(sessionId);\n      }\n    }, 1000);\n    return () => clearInterval(id);\n  }, []);\n\n  return <span className=\"session-timer\">{formatClock(secondsLeft)}</span>;\n}\n\n// parent: <SessionTimer sessionId={id} onExpire={(id) => releaseCart(id)} />",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Derived state stored in useEffect",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "QA filed two bugs against this table. (1) Reproduces every time: on first paint the table lists every invoice while the footer total reads $0.00, and only then snaps to the filtered rows. (2) Intermittent: when the user changes the status filter, the previous filter's rows stay visible for one frame before updating — it reproduces on a 6x-throttled CPU and almost never on the QA lead's laptop.\n\nExplain the mechanism behind each symptom, why (1) is deterministic while (2) is a race, and how many times this component renders per filter change. Rewrite it so both symptoms are structurally impossible.\n\nThen answer two follow-ups: would switching this effect to useLayoutEffect be an acceptable fix, and what is the one condition under which writing values into state from an effect here would genuinely be the right tool?",
    "code": "function InvoiceTable({ invoices, statusFilter }) {\n  const [visible, setVisible] = useState(invoices);\n  const [totalCents, setTotalCents] = useState(0);\n\n  useEffect(() => {\n    const next = invoices.filter((inv) => inv.status === statusFilter);\n    setVisible(next);\n    setTotalCents(next.reduce((sum, inv) => sum + inv.amountCents, 0));\n  }, [invoices, statusFilter]);\n\n  return (\n    <table>\n      <tbody>\n        {visible.map((inv) => <InvoiceRow key={inv.id} invoice={inv} />)}\n      </tbody>\n      <tfoot><tr><td>{formatMoney(totalCents)}</td></tr></tfoot>\n    </table>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "State shape modeling & single source of truth",
    "type": "write",
    "difficulty": "senior",
    "prompt": "This panel fetches a team's members, lets the user multi-select rows, shows a footer with the selection count, and opens a dialog to rename one member. It has eleven useState calls and a support ticket that reads 'the footer says 3 selected but only 2 rows are checked'.\n\nWrite the replacement state declarations. For every value you delete, give the one-line expression that produces it instead, and name which deleted value is the direct cause of the ticket.\n\nThen answer four things in one or two sentences each: (a) which of these values should not be React state at all, and what they should be instead; (b) a background refetch returns a member list with one selected person removed — what does your shape make happen to the footer count, and where (if anywhere) do you handle it; (c) the same refetch removes the member currently open in the rename dialog — what happens, and what does that imply about how the dialog's target is stored; (d) whether draftName stays, and where it lives.",
    "code": "function TeamMembersPanel({ teamId }) {\n  const [members, setMembers] = useState([]);\n  const [isLoading, setIsLoading] = useState(false);\n  const [isError, setIsError] = useState(false);\n  const [errorMessage, setErrorMessage] = useState('');\n  const [isEmpty, setIsEmpty] = useState(false);\n  const [selectedIds, setSelectedIds] = useState([]);\n  const [selectedMembers, setSelectedMembers] = useState([]);\n  const [selectedCount, setSelectedCount] = useState(0);\n  const [editingMember, setEditingMember] = useState(null);\n  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);\n  const [draftName, setDraftName] = useState('');\n\n  // fetches on teamId; the setters above are called from roughly eight places.\n  // Renders: spinner, error banner, empty state, checkbox rows,\n  // a footer reading \"N selected\", and a rename dialog seeded from editingMember.\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "useState update semantics: batching and functional updaters",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "LikeButton is freshly mounted with count at 0, in a React 19 production build (no StrictMode). likePost returns a promise that resolves after a real network round-trip. The user clicks once, the request succeeds, and nothing else touches this component. Which statement correctly describes the final value of count, what the console prints, and how many times LikeButton re-renders after its initial mount render?",
    "code": "function LikeButton({ postId }) {\n  const [count, setCount] = useState(0);\n  const [pending, setPending] = useState(false);\n\n  async function handleClick() {\n    setCount(count + 1);\n    setCount(count + 1);\n    setPending(true);\n    await likePost(postId);\n    setCount((c) => c + 1);\n    setPending(false);\n    console.log(count);\n  }\n\n  return <button onClick={handleClick} disabled={pending}>{count}</button>;\n}",
    "language": "jsx",
    "options": [
      "count ends at 2; the log prints 0; the component re-renders twice",
      "count ends at 3; the log prints 0; the component re-renders twice",
      "count ends at 2; the log prints 2; the component re-renders twice",
      "count ends at 2; the log prints 0; the component re-renders three times",
      "count ends at 3; the log prints 1; the component re-renders four times"
    ],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Effect cleanup, subscriptions, and StrictMode double-invocation",
    "type": "debug",
    "difficulty": "hard",
    "prompt": "RoomSocket exposes connect(), close(), on(event, handler) and off(event, handler). The didInit ref was added by a previous author whose commit message reads 'stop double connecting in dev'. Users now report that moving from one room to another inside the app (the component stays mounted, only roomId changes) empties the presence list, and it never repopulates until a full page reload.\n\nTrace what this effect does on the first run, on a roomId change, and on unmount. Then answer three things: what does this component actually do in development under StrictMode today — does the ref achieve what its author believed? Was the behavior the ref was added to suppress a bug at all, and what was it really telling the author? Finally, rewrite the effect, including what has to happen to `peers` when the room changes.",
    "code": "function PresenceIndicator({ roomId }) {\n  const [peers, setPeers] = useState([]);\n  const didInit = useRef(false);\n\n  useEffect(() => {\n    if (didInit.current) return;\n    didInit.current = true;\n\n    const socket = new RoomSocket(roomId);\n    socket.on('peers', (list) => setPeers(list));\n    socket.connect();\n\n    return () => socket.close();\n  }, [roomId]);\n\n  return <AvatarStack users={peers} />;\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Race conditions and cancellation in effect-based fetching",
    "type": "write",
    "difficulty": "senior",
    "prompt": "`ticketStore` is a module-level observable that the rest of the app reads (`get(id)`, `set(id, value)`, `subscribe`). A previous author already applied the fixes everyone knows — an `ignore` flag with a cleanup, and an AbortController — and the drawer is still wrong in production.\n\nThree symptoms: (1) switching tickets quickly sometimes leaves the header showing ticket A while the assignee list belongs to ticket B; (2) in development under StrictMode, `ticketStore` sometimes ends up holding the data from the run React threw away; (3) a user edits the owner, `save()` resolves and the drawer shows the new owner, and then a moment later the old owner reappears everywhere in the app without any further interaction.\n\nRewrite this component's data layer. It must satisfy all of:\n\n- every write that can happen after an await is guarded — state the number of guard points a two-request effect has, and why checking once before the final `setState` is not one of them;\n- the second request is genuinely cancelled when `ticketId` changes while it is in flight;\n- nothing from a superseded or discarded run ever reaches `ticketStore`, including under StrictMode's double invocation;\n- a GET that was issued before the PATCH and lands after it can never overwrite the saved values.\n\nThen answer: (a) why an AbortController cannot satisfy the last requirement even in principle, and name two mechanisms that can; (b) why writing to a module-level store from an effect is harder to make cancel-safe than writing to component state, and what that implies about where such writes belong; (c) which of these four problems disappear if you adopt a query library, which one does not disappear by itself, and what the cache key and the mutation's `onSuccess` would have to look like.",
    "code": "function TicketDrawer({ ticketId }) {\n  const [ticket, setTicket] = useState(null);\n  const [assignees, setAssignees] = useState([]);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    let ignore = false;\n    const controller = new AbortController();\n\n    async function load() {\n      const t = await fetch(`/api/tickets/${ticketId}`, {\n        signal: controller.signal,\n      }).then((r) => r.json());\n\n      ticketStore.set(ticketId, t);\n\n      const a = await fetch(`/api/groups/${t.groupId}/assignees`).then((r) =>\n        r.json()\n      );\n\n      if (!ignore) {\n        setTicket(t);\n        setAssignees(a);\n      }\n    }\n\n    load().catch((err) => setError(err));\n\n    return () => {\n      ignore = true;\n      controller.abort();\n    };\n  }, [ticketId]);\n\n  async function save(patch) {\n    const updated = await fetch(`/api/tickets/${ticketId}`, {\n      method: 'PATCH',\n      body: JSON.stringify(patch),\n    }).then((r) => r.json());\n\n    ticketStore.set(ticketId, updated);\n    setTicket(updated);\n  }\n\n  return <Drawer ticket={ticket} assignees={assignees} onSave={save} />;\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Query-cache semantics: keys, staleness, and invalidation",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "One task list is mounted with the query below, currently with status 'open'. Within the last thirty seconds the user also visited the same list with status 'done' and status 'all', so three entries exist in the cache under this project, none of them past staleTime and none garbage-collected; the other two have no mounted observer. A rename mutation then succeeds and runs the onSuccess shown. Select every statement that is true. Select all that apply.",
    "code": "const { data } = useQuery({\n  queryKey: ['projects', projectId, 'tasks', { status }],\n  queryFn: () => fetchTasks(projectId, status),\n  staleTime: 60_000,\n  gcTime: 5 * 60_000,\n});\n\nconst rename = useMutation({\n  mutationFn: renameTask,\n  onSuccess: () => {\n    queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] });\n  },\n});",
    "language": "jsx",
    "options": [
      "All three cached entries are marked stale: the key is matched as a prefix, so any entry whose key extends it — including the trailing filter object — matches",
      "Only the entry with a mounted observer refetches immediately; the other two stay flagged and refetch the next time a component subscribes to them",
      "Nothing refetches for another 60 seconds, because staleTime gates whether an invalidation is allowed to trigger a refetch",
      "Had onSuccess instead written the renamed task with setQueryData for the mounted key, the UI would update with no network round-trip, but the other two entries would keep the old title",
      "Calling refetch() from this useQuery result instead would be equivalent, since it also re-runs the query function for every cached entry under this project's tasks"
    ],
    "multi": true
  },
  {
    "area": "react",
    "topic": "Why a component re-rendered",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "Panel is wrapped in React.memo. TabBar and ReportBody are ordinary function components. The user clicks a tab, which calls setTab with a value different from the current one. Exactly one of the following statements about that update is true — which one?",
    "code": "const Panel = React.memo(function Panel({ title, children }) {\n  return (\n    <section className=\"panel\">\n      <h2>{title}</h2>\n      {children}\n    </section>\n  );\n});\n\nfunction ReportsPage() {\n  const [tab, setTab] = useState('summary');\n  return (\n    <Panel title=\"Reports\">\n      <TabBar value={tab} onChange={setTab} />\n      <ReportBody tab={tab} />\n    </Panel>\n  );\n}",
    "language": "jsx",
    "options": [
      "Panel's memo bails out, so React skips Panel and renders only the subtree that changed — TabBar and ReportBody — beneath it",
      "Panel re-renders: ReportsPage re-runs and builds new child elements, so the children prop is a new value and memo's shallow comparison fails",
      "Panel re-renders, but wrapping the two children in useMemo inside ReportsPage with [tab] as the dependency would restore the bail-out",
      "Panel re-renders, and because it re-rendered React tears down and recreates its section and h2 DOM nodes before inserting the new children",
      "TabBar is skipped: setTab is referentially stable across renders and its other prop is a primitive, so its props are shallow-equal to the previous render's"
    ],
    "multi": false
  },
  {
    "area": "react",
    "topic": "When React.memo does nothing",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "MemberRow is memoized, yet the Profiler shows all 500 rows re-rendering — about 0.4ms each — every time the user ticks one checkbox. `toggleId(set, id)` returns a new Set. Assume React Compiler is not enabled.\n\nName every reason the bail-out fails here (there is more than one, and each is independently fatal), then rewrite MemberList so that ticking one checkbox re-renders only the row whose checked state changed. Be specific about why the obvious version of the handler fix still fails.\n\nThen answer two judgment questions: is memo the right tool for this component once your fix is in, and what would you do instead if the list were 12 rows rather than 500? And: if your team switched React Compiler on, which of the problems you listed does it remove, and which does it not?",
    "code": "const MemberRow = React.memo(function MemberRow({ member, permissions, isSelected, onToggle }) {\n  return (\n    <li>\n      <input type=\"checkbox\" checked={isSelected} onChange={onToggle} />\n      <span>{member.name}</span>\n      {permissions.canRemove && <RemoveButton memberId={member.id} />}\n    </li>\n  );\n});\n\nfunction MemberList({ members, currentUser }) {\n  const [selected, setSelected] = useState(() => new Set());\n  const permissions = { canEdit: currentUser.role === 'admin', canRemove: currentUser.role === 'admin' };\n\n  return (\n    <ul>\n      {members.map((member) => (\n        <MemberRow\n          key={member.id}\n          member={member}\n          permissions={permissions}\n          isSelected={selected.has(member.id)}\n          onToggle={() => setSelected(toggleId(selected, member.id))}\n        />\n      ))}\n    </ul>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "useMemo/useCallback: referential identity vs computation cost",
    "type": "write",
    "difficulty": "hard",
    "prompt": "RecentOrders and ExportButton are both wrapped in React.memo. The parent renders OrdersToolbar exactly as shown at the bottom of the snippet.\n\nFor each of the five memoized values, say keep or delete and give a one-line reason.\n\nExactly two of them recompute on literally every render of OrdersToolbar, which means the memoized child each one exists to protect never bails out. Name those two, explain precisely what defeats each, and fix the root cause — for at least one of them the fix is not another hook inside OrdersToolbar. Then rewrite the component with your changes.\n\nLast: React reserves the right to throw away a useMemo cache and recompute. What would have to be true of your rewritten code for that to be safe, and what kind of code would it break?",
    "code": "function OrdersToolbar({ orders, currency, filters, onExport }) {\n  const formatter = useMemo(\n    () => new Intl.NumberFormat('en-US', { style: 'currency', currency }),\n    [currency]\n  );\n  const label = useMemo(() => `${orders.length} orders`, [orders.length]);\n  const buttonStyle = useMemo(() => ({ marginInlineStart: 8 }), []);\n  const sorted = useMemo(\n    () => [...orders].sort((a, b) => b.createdAt - a.createdAt),\n    [orders, filters]\n  );\n  const handleExport = useCallback(() => onExport(sorted, filters), [sorted, filters, onExport]);\n\n  return (\n    <>\n      <RecentOrders orders={sorted} formatter={formatter} />\n      <ExportButton style={buttonStyle} label={label} onClick={handleExport} />\n    </>\n  );\n}\n\n// parent render (orders and exportOrders are referentially stable):\n// <OrdersToolbar orders={orders} currency=\"USD\" filters={{ status, q }} onExport={exportOrders} />",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Context re-render cost and provider value identity",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "InvoiceTable renders about 400 InvoiceRow elements. Typing one character into the search box takes ~300ms, and the React Profiler shows all 400 rows re-rendering on every keystroke even though no row's selection changed, no row's invoice prop changed identity, and InvoiceRow is wrapped in memo.\n\n(a) Explain precisely why memo is not stopping these re-renders, and why InvoiceTable itself does not show up as re-rendering in the Profiler.\n(b) A teammate opens a PR that wraps the provider's value in useMemo with [query, status, selectedIds] as deps — say whether that alone fixes this case, and why.\n(c) Give two structurally different fixes and name the cost of each.\n(d) After your fix, another teammate says the memo() around InvoiceRow is now dead weight and should be deleted. Are they right?",
    "code": "const FiltersContext = createContext(null);\n\nexport function FiltersProvider({ children }) {\n  const [query, setQuery] = useState('');\n  const [status, setStatus] = useState('all');\n  const [selectedIds, setSelectedIds] = useState([]);\n\n  return (\n    <FiltersContext value={{ query, setQuery, status, setStatus, selectedIds, setSelectedIds }}>\n      {children}\n    </FiltersContext>\n  );\n}\n\nfunction SearchBox() {\n  const { query, setQuery } = useContext(FiltersContext);\n  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;\n}\n\nfunction InvoiceTable({ invoices }) {\n  return (\n    <tbody>\n      {invoices.map((inv) => (\n        <InvoiceRow key={inv.id} invoice={inv} />\n      ))}\n    </tbody>\n  );\n}\n\nconst InvoiceRow = memo(function InvoiceRow({ invoice }) {\n  const { selectedIds, setSelectedIds } = useContext(FiltersContext);\n  const checked = selectedIds.includes(invoice.id);\n  return <tr aria-selected={checked}>{/* cells */}</tr>;\n});\n\n// invoices comes from the query cache and is referentially stable while typing.\nexport function InvoicesPage({ invoices }) {\n  return (\n    <FiltersProvider>\n      <SearchBox />\n      <table><InvoiceTable invoices={invoices} /></table>\n    </FiltersProvider>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Choosing where state lives: local, lifted, URL, server cache, or store",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Design the state for an Orders page. The page is roughly a dozen components: page shell, toolbar, search box, status chip bar, table, table row, expanded line-items panel, bulk action bar, an Edit Order drawer, and the drawer's form. The app already uses React Router v7 and TanStack Query; use whatever is appropriate.\n\nThese seven things need to live somewhere:\n1. the text in the search box\n2. the active status filter (all / open / shipped / cancelled)\n3. the current page number\n4. the list of orders and the total count coming from GET /orders\n5. which rows are expanded to show line items\n6. the order ids checked via row checkboxes (a bulk action bar appears when non-empty)\n7. the unsaved field values in the Edit Order drawer\n\nWrite the skeleton (~60 lines): the hooks, and how each value reaches the components that need it. Stub the JSX bodies and the network call; no styling. For each of the seven, state in one line where it lives, and name the concrete failure mode of the most tempting wrong placement — the failure has to be a user-visible bug or a specific performance cost, not 'it's bad practice'.\n\nThen answer: when the user changes the status filter, what should happen to (5) and (6)? Defend your choice, and show how your placement produces that behavior structurally instead of via a hand-written reset.",
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
    "prompt": "people starts as [Ana, Ben, Cy] and no box is checked. The user checks the star box on Ben's row and types \"call back\" into the note input on Cy's row. Then they click Remove on Ana's row and the parent re-renders with people = [Ben, Cy].\n\nWhat does the user see immediately after that re-render?",
    "code": "function AssigneeList({ people, onRemove }) {\n  return (\n    <ul>\n      {people.map((person, i) => (\n        <li key={i}>\n          <input type=\"checkbox\" defaultChecked={false} aria-label={`Star ${person.name}`} />\n          <span>{person.name}</span>\n          <NoteDraft personId={person.id} />\n          <button onClick={() => onRemove(person.id)}>Remove</button>\n        </li>\n      ))}\n    </ul>\n  );\n}\n\nfunction NoteDraft({ personId }) {\n  const [note, setNote] = useState('');\n  return (\n    <input value={note} onChange={(e) => setNote(e.target.value)} placeholder=\"Add note\" />\n  );\n}",
    "language": "jsx",
    "options": [
      "Ben's row still shows the checked box and Cy's row still shows \"call back\", because React matches list items by their key and keys 0 and 1 are both still present after the removal.",
      "Cy's row now shows the checked box, and \"call back\" is gone, because the first two list items were reused with shifted data while the third item was unmounted along with its state.",
      "Cy's row now shows the checked box and still shows \"call back\", because the checkbox node and the NoteDraft state both travel with the reused list item and only the third item is destroyed.",
      "No box is checked and both note inputs are empty, because the array length changed and React discards and rebuilds the whole list rather than diffing it item by item.",
      "Ben's row loses its check because defaultChecked={false} is re-applied on every render, while Cy's row still shows \"call back\" since component state is keyed to the personId prop."
    ],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Controlled vs uncontrolled inputs",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "Two support tickets on this field, both reproducible in current Chrome and Firefox. (1) After typing a full number, clicking into the middle to correct one digit sends the caret to the end of the input after every keystroke. (2) Placing the caret immediately after a dash and pressing Backspace appears to do nothing at all — the dash reappears instantly.\n\nBoth symptoms come from the same property of this component. Name that property, then explain the specific mechanism behind each symptom (they are not the same mechanism). Then describe the fix you would ship, including which point in the render/commit lifecycle your fix has to run at and why it cannot run later.",
    "code": "function PhoneForm() {\n  const [digits, setDigits] = useState('');\n  return <PhoneField digits={digits} onChange={setDigits} />;\n}\n\nfunction PhoneField({ digits, onChange }) {\n  return (\n    <input\n      type=\"tel\"\n      value={format(digits)}\n      onChange={(e) => onChange(e.target.value.replace(/\\D/g, '').slice(0, 10))}\n    />\n  );\n}\n\nfunction format(digits) {\n  if (digits.length < 4) return digits;\n  if (digits.length < 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;\n  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Form submission and validation architecture",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Write the validation architecture for a checkout address form with eight fields: name, line1, line2, city, region, postalCode, country, phone. No form library — write it yourself.\n\nRequirements:\n(a) A field shows its error only after the user has left it once, or after a failed submit attempt; from that point on the error updates as they type.\n(b) The submit endpoint can reject with a form-level message (\"This address could not be verified\") and/or per-field messages keyed by field name, e.g. { postalCode: 'Not valid for GB' }. Both must display, and a per-field server error must clear when the user edits that field — but must not be wiped out by an unrelated field's edit.\n(c) Typing in one field must not re-render the other seven. State explicitly what in your design makes that true, and name one design that looks like it satisfies this but does not.\n(d) Screen readers must announce each field's error, and a failed submit must move focus somewhere useful.\n\nShow the state shape, the submit path including how server errors merge with client errors, and one field component. Stub the network call and the per-field validators. Keep it around 50 lines.",
    "code": "",
    "language": "",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "React 19 Actions and useActionState",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "Select all that apply. Which of the following are true of this component exactly as written? Assume inviteMember is a plain async function that resolves with a { ok } object and never throws on its own.",
    "code": "function InviteForm({ teamId }) {\n  const [state, submitAction, isPending] = useActionState(\n    async (prev, formData) => {\n      const email = formData.get('email');\n      if (!email.includes('@')) return { error: 'Enter a valid email' };\n      const res = await inviteMember(teamId, email);\n      if (!res.ok) throw new Error('Invite failed');\n      return { sent: [...prev.sent, email] };\n    },\n    { sent: [] }\n  );\n\n  return (\n    <form action={submitAction}>\n      <input name=\"email\" defaultValue=\"\" />\n      <button disabled={isPending}>Invite</button>\n      {state.error && <p role=\"alert\">{state.error}</p>}\n      <p>{state.sent.length} invited</p>\n    </form>\n  );\n}",
    "language": "jsx",
    "options": [
      "If inviteMember resolves with ok: false, the error thrown inside the action is rethrown during render and reaches the nearest error boundary rather than showing up as state.error.",
      "isPending covers the whole action only when it is dispatched through the form's action prop; invoking submitAction from a click handler instead requires you to track your own submitting flag.",
      "After a successful invite the email input is empty even though nothing in the JSX changed, because React resets a form whose action prop is a function once that action finishes.",
      "On the validation path the returned object is merged into the previous state, so state.sent is preserved and only state.error is added to what was already there.",
      "useFormStatus() called in the body of InviteForm would report the same pending status as isPending, since InviteForm is the component that renders this form element."
    ],
    "multi": true
  },
  {
    "area": "react",
    "topic": "Optimistic UI with useOptimistic and rollback",
    "type": "debug",
    "difficulty": "hard",
    "prompt": "`task` is handed down from a TanStack Query cache entry in the parent list. This component ships with a console warning from React, and clicking the checkbox makes it flip and immediately flip back before the request has even finished.\n\n(a) Explain the mechanism behind that behavior.\n(b) A teammate proposes wrapping only the setOptimisticTask(...) call in startTransition and leaving the await where it is — say whether that fixes it and why.\n(c) Rewrite the component so the optimistic value holds for the life of the request and the row does not flicker back to the old value after the server responds. State what must be true about the incoming `task` prop, and when, for the flicker to be gone.\n(d) If the user clicks three times in quick succession, what does the checkbox end up showing, and what would you change about the useOptimistic call itself to handle that correctly?",
    "code": "function TaskRow({ task }) {\n  const [optimisticTask, setOptimisticTask] = useOptimistic(task);\n  const toggleTask = useToggleTask(); // async mutate fn, resolves when the server responds\n\n  async function handleToggle() {\n    setOptimisticTask({ ...task, done: !task.done });\n    try {\n      await toggleTask(task.id);\n    } catch (err) {\n      toast.error('Could not update task');\n    }\n  }\n\n  return (\n    <label>\n      <input type=\"checkbox\" checked={optimisticTask.done} onChange={handleToggle} />\n      {optimisticTask.title}\n    </label>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Suspense boundaries and lazy loading",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "ProjectHeader and ActivityFeed each read data with use(), from promises held in a module-level cache keyed by projectId (created outside render). ActivityFeed also has local state: an expanded filter panel. projectId lives in a parent's useState and is changed by a project switcher calling setProjectId directly, with no startTransition.\n\nThe user loads the page cold (nothing cached, both data reads and the lazy chunk pending), opens the filter panel, then switches from project A to project B. Which statement describes both moments correctly?",
    "code": "const UsageChart = lazy(() => import('./UsageChart'));\n\nfunction ProjectPage({ projectId }) {\n  return (\n    <Suspense fallback={<PageSkeleton />}>\n      <ProjectHeader projectId={projectId} />\n      <Suspense fallback={<ChartSkeleton />}>\n        <UsageChart projectId={projectId} />\n      </Suspense>\n      <ActivityFeed projectId={projectId} />\n    </Suspense>\n  );\n}",
    "language": "jsx",
    "options": [
      "On the cold load PageSkeleton and ChartSkeleton appear on screen together, because the inner boundary resolves its lazy chunk independently of whatever the outer boundary happens to be waiting on.",
      "On the cold load only PageSkeleton appears. Switching projects keeps the previous project's content on screen while the new data loads, because React never re-shows a fallback for a tree it has already committed.",
      "On the cold load only PageSkeleton appears; ChartSkeleton cannot show while it is inside the fallen-back subtree. Switching projects swaps the page for PageSkeleton again, and because the committed tree is hidden rather than unmounted, the filter panel is still open when the content returns.",
      "On the cold load only PageSkeleton appears; ChartSkeleton cannot show while it is inside the fallen-back subtree. Switching projects swaps the page for PageSkeleton again, tearing down the subtree, so the filter panel is collapsed again once the new data arrives.",
      "On the cold load only ChartSkeleton appears, since a lazy import is the one thing that suspends a client render; use() reads a promise from a cache synchronously and never reaches a boundary."
    ],
    "multi": false
  },
  {
    "area": "react",
    "topic": "The use() API for promises and context",
    "type": "debug",
    "difficulty": "hard",
    "prompt": "This is a client component tree in a Vite + React Router v7 app. The spinner never goes away, and the network tab shows GET /posts/1/comments repeating forever, several times a second.\n\n(a) Explain exactly what loop is happening.\n(b) A teammate proposes: const promise = useMemo(() => fetchComments(postId), [postId]); const comments = use(promise); — does that stop the loop, and is it correct to ship?\n(c) State the general rule for where the promise passed to use() must come from, and give two concrete places it can legitimately be created in this app.\n(d) A second teammate wraps the use() call in try/catch to render \"Couldn't load comments\" — what is wrong with that?",
    "code": "function CommentsPanel({ postId }) {\n  const comments = use(fetchComments(postId));\n  return (\n    <ul>\n      {comments.map((c) => (\n        <li key={c.id}>{c.body}</li>\n      ))}\n    </ul>\n  );\n}\n\n// PostBody is a plain synchronous component; the post itself is already in memory.\nfunction PostView({ post }) {\n  return (\n    <article>\n      <PostBody post={post} />\n      <Suspense fallback={<Spinner />}>\n        <CommentsPanel postId={post.id} />\n      </Suspense>\n    </article>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Transitions vs deferred values",
    "type": "write",
    "difficulty": "senior",
    "prompt": "entries holds about 8,000 audit records and is referentially stable. Typing in the filter box drops frames — characters appear a beat late — and clicking the Map tab freezes the UI for roughly half a second with no feedback.\n\nRewrite this page to meet all of the following:\n- the text in the input updates on every keystroke with no perceptible delay\n- while the filtered results are catching up, the old list stays visible and is visually dimmed\n- clicking a tab does not freeze the input or the tab bar, and the tab the user clicked shows a busy indicator on itself until the new panel is ready\n- use exactly one of useTransition / useDeferredValue for the filter and exactly one for the tabs, and justify each choice in a sentence\n- make sure the heavy list does not re-render at all for the urgent keystroke update; say what you had to do to guarantee that, and name the one line of your rewrite that would be useless without it\n\nThen answer: if rendering a single row genuinely costs 20ms, what does your rewrite fix and what does it not fix — and what would you actually do about it?",
    "code": "function AuditLogPage({ entries }) {\n  const [query, setQuery] = useState('');\n  const [tab, setTab] = useState('table');\n\n  const visible = entries.filter(\n    (e) =>\n      e.actor.toLowerCase().includes(query.toLowerCase()) ||\n      e.action.toLowerCase().includes(query.toLowerCase())\n  );\n\n  return (\n    <>\n      <input value={query} onChange={(e) => setQuery(e.target.value)} />\n      <TabBar value={tab} onChange={setTab} />\n      {tab === 'table' ? <EntryTable entries={visible} /> : <EntryMap entries={visible} />}\n      <label>{visible.length} of {entries.length}</label>\n    </>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Error boundaries and async error handling",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "A dashboard renders `<ErrorBoundary fallback={<CrashedPanel />}>` around its widget grid; every widget below it is a function component. Select all that apply: which of these failures does React route to that boundary, so that `<CrashedPanel />` replaces the grid instead of the error escaping to `window.onerror` / `unhandledrejection`?",
    "code": "",
    "language": "",
    "options": [
      "A widget throws synchronously in the body of its `useEffect` when a required config value is missing.",
      "Inside an effect, `loadWidget(id).then((res) => setRows(res.data.rows))` throws because `res.data` is undefined.",
      "A widget calls `use(widgetPromise)` and that promise rejects with a 500 response.",
      "A widget's \"Retry\" button has an `onClick` that throws before it calls any state setter.",
      "A widget stores a rejected fetch's error via `setError(err)` in a `.catch`, then runs `if (error) throw error;` at the top of its render."
    ],
    "multi": true
  },
  {
    "area": "react",
    "topic": "Custom hook design and extraction boundaries",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "`Toolbar` sits under a parent that re-renders often (a zoom slider, an unrelated search field). Analytics reports that `selection_changed` fires on essentially every render of `Toolbar` — including renders where the selection is byte-for-byte identical. Explain precisely why the effect re-runs, and change the hook so this consumer (and any other) behaves as intended; say what your fix does to `SelectionChips` if it is wrapped in `React.memo`. Separately: the team assumes that because `Toolbar` and a `Sidebar` elsewhere in the tree both call `useSelectionSync('board-1')`, they are looking at the same selection. Are they? Describe what actually exists at runtime, and what it would take to make the assumption true.",
    "code": "function useSelectionSync(boardId) {\n  const [selected, setSelected] = useState([]);\n\n  useEffect(() => {\n    const sub = presence.subscribe(boardId, setSelected);\n    return () => sub.unsubscribe();\n  }, [boardId]);\n\n  return {\n    selected,\n    clear: () => setSelected([]),\n    toggle: (id) =>\n      setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),\n  };\n}\n\nfunction Toolbar({ boardId, zoom }) {\n  const selection = useSelectionSync(boardId);\n\n  useEffect(() => {\n    analytics.track('selection_changed', { count: selection.selected.length });\n  }, [selection]);\n\n  return <SelectionChips items={selection.selected} onClear={selection.clear} />;\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "useReducer and action modeling",
    "type": "write",
    "difficulty": "mid",
    "prompt": "This wizard has grown to six pieces of state, every handler pokes four or five setters in the right order, and a bug just shipped: change the country after picking a rate and the old `rateId` is still what gets submitted. Rewrite the state layer. Requirements: (1) one state value and one update function; (2) the update function must be pure — safe to invoke twice with the same input under StrictMode's dev double-invoke, no mutation, no fetching, no `Date.now()`/`Math.random()` inside it; (3) action shapes must be named after what happened in the product, not after which fields to write — a reviewer reading the list of action types should be able to describe the user flow; (4) keeping a rate selection across a country change must be structurally impossible, not merely remembered-to-be-reset; (5) the update function must be safe to pass to a memoized `<RateList />` with no `useCallback` wrapper, and safe to reference inside an effect or an async fetch without re-running it or capturing stale state — explain why that holds. Write the state module and the three handlers. Finally: name one piece of state on a screen like this that you would deliberately leave in `useState`, and why.",
    "code": "function ShipmentWizard() {\n  const [step, setStep] = useState(0);\n  const [country, setCountry] = useState('');\n  const [region, setRegion] = useState('');\n  const [rates, setRates] = useState([]);\n  const [rateId, setRateId] = useState(null);\n  const [errors, setErrors] = useState({});\n\n  function onCountryChange(next) {\n    setCountry(next);\n    setRegion('');\n    setRates([]);\n    setErrors({});\n  }\n\n  function onRatesLoaded(list) {\n    setRates(list);\n    setRateId(list[0]?.id ?? null);\n  }\n\n  function onNext() {\n    if (!country) return setErrors({ country: 'Required' });\n    setErrors({});\n    setStep((s) => s + 1);\n  }\n  // ...\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "useRef as a mutable box and ref callbacks",
    "type": "write",
    "difficulty": "senior",
    "prompt": "This panel publishes the height of its (conditionally rendered) list as a CSS custom property `--drawer-h`, which the stylesheet uses to animate the drawer. The obvious implementations all fail: a `useEffect` with `[]` reads a ref that is still `null`; adding `expanded` to the array measures on open but goes stale when `filters` grows the list from 3 rows to 12; adding `filters` too still misses a resize caused by a late-loading font or a narrower container.\n\nWrite the measuring layer as a reusable hook, plus the component that uses it. Requirements:\n1. it measures when the element attaches, re-measures whenever the element's size actually changes for ANY reason, and resets when the element leaves the tree;\n2. no dependency array anywhere in it that lists things which merely correlate with size;\n3. the user must never see a frame with a wrong `--drawer-h` value;\n4. it must not tear down and rebuild its observation on every render of the consumer;\n5. it must work when the element is unmounted and remounted repeatedly.\n\nThen answer: (a) why a dependency array is the wrong SHAPE of tool here, not one that just needs more entries — and what property of refs makes that so; (b) why the component cannot simply read the element's size during render and skip all of this, giving both the mechanical reason and the concurrent-rendering reason; (c) which React version your cleanup style requires and what you would write instead on an older one; (d) when `useLayoutEffect` is the right answer for this and when it is not.",
    "code": "function FilterPanel({ filters }) {\n  const [expanded, setExpanded] = useState(false);\n\n  // measuring layer goes here\n\n  return (\n    <div className=\"panel\" style={{ '--drawer-h': `${height}px` }}>\n      <button onClick={() => setExpanded((e) => !e)}>Filters</button>\n      {expanded && (\n        <ul ref={/* yours */ null}>\n          {filters.map((f) => (\n            <li key={f.id}>{f.label}</li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Route-level data loading and navigation patterns",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Restructure this screen for React Router v7 in framework/data mode. Write the route module and the component. It must satisfy all of: (1) a user can copy the address bar, send it to a teammate, and the teammate lands on the identical filtered page of results — and refresh and the back button also restore it; (2) no data fetching in an effect, and the list data is resolved before this route's UI renders; (3) changing the status filter must not swap the table for a spinner — the previous rows stay on screen with a pending treatment; (4) the 'Mark as shipped' mutation must leave the visible list showing fresh data without you calling any refetch function yourself, and without navigating away from the current scroll position; (5) the route is behind auth, and an unauthenticated user must never see the page chrome before the redirect — say where the check lives and why that specific location, not merely 'early', is what prevents the flash. Then name two pieces of state on a screen like this you would deliberately keep OUT of the URL, and one non-obvious one you would put IN.",
    "code": "function OrdersPage() {\n  const [status, setStatus] = useState('open');\n  const [page, setPage] = useState(1);\n  const [orders, setOrders] = useState(null);\n\n  useEffect(() => {\n    fetchOrders({ status, page }).then(setOrders);\n  }, [status, page]);\n\n  async function markShipped(id) {\n    await api.markShipped(id);\n    const fresh = await fetchOrders({ status, page });\n    setOrders(fresh);\n  }\n\n  if (!orders) return <Spinner />;\n  return <OrdersTable orders={orders} onShip={markShipped} />;\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Server vs Client Component boundaries",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "In this Next.js App Router route, `page.jsx` has no directive; `./chart` starts with `'use client'`; `./revenue-table` has no directive and queries Postgres directly inside `RevenueTable`. The route currently fails. Select all that apply: which statements about this code are true?",
    "code": "// app/dashboard/page.jsx\nimport { Chart } from './chart';\nimport { RevenueTable } from './revenue-table';\nimport { getDefaultRange } from '@/lib/ranges';\n\nexport default async function Page() {\n  const range = await getDefaultRange(); // { fromISO: string, toISO: string }\n\n  return (\n    <Chart range={range} onZoom={(next) => console.log(next)}>\n      <RevenueTable range={range} />\n    </Chart>\n  );\n}",
    "language": "jsx",
    "options": [
      "The `onZoom` prop is the failure: functions are not serializable in the RSC payload, so passing an inline handler from a Server Component to a Client Component throws.",
      "Because `RevenueTable` is rendered inside a Client Component, it is pulled into the client bundle and its database query will run in the browser.",
      "Adding `'use client'` to the top of `page.jsx` resolves the error, and the data fetching still runs on the server because `page.jsx` is a route file.",
      "`range` is a plain object of strings, so it crosses the boundary fine; the RSC payload serializes it for the client component's props.",
      "If `Chart` imported `RevenueTable` itself and rendered `<RevenueTable />` internally, `RevenueTable` would become a Client Component."
    ],
    "multi": true
  },
  {
    "area": "react",
    "topic": "Hydration mismatch debugging",
    "type": "mcq",
    "difficulty": "hard",
    "prompt": "After deploying this server-rendered orders table, the console logs \"Hydration failed because the server rendered HTML didn't match the client\" and the whole table blanks for a frame before reappearing. It happens on the deployed site for essentially every user, and never in local development, where the same machine runs both the Node server and the browser. Which single statement is the correct diagnosis and remedy?",
    "code": "// formatMoney formats with a hard-coded locale and currency; it is deterministic.\nexport function OrderRow({ order }) {\n  const placed = new Date(order.placedAt);\n  const isRecent = Date.now() - placed.getTime() < 60 * 60 * 1000;\n\n  return (\n    <tr className={isRecent ? 'row row--new' : 'row'}>\n      <td>{placed.toLocaleString()}</td>\n      <td>{order.customer}</td>\n      <td>{formatMoney(order.total)}</td>\n    </tr>\n  );\n}",
    "language": "jsx",
    "options": [
      "`toLocaleString()` resolves against the server runtime's locale and timezone and then against the browser's, so the text differs per environment; render with an explicit locale and timeZone on both sides, or emit the raw value and localize after mount.",
      "The mismatch is only a development warning — in a production build React reconciles the differing text against the server markup and patches it, so nothing needs to change.",
      "A mismatch of this kind is only fixable by gating the row behind a mounted flag, so the server renders nothing and the browser fills it in on the first client render.",
      "The row needs a stable identity across the two renders; generate one with `useId()` and use it as the row's key so React can match the server and client trees.",
      "`isRecent` is the problem and should be read through `useSyncExternalStore`, so that the server snapshot and the client snapshot are guaranteed to agree."
    ],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Composition over configuration: children, slots, compound components",
    "type": "write",
    "difficulty": "hard",
    "prompt": "This call site is typical: `DataPanel` is a 400-line component with fourteen props, and each of the last three feature requests added another boolean. Redesign its public API and write (a) the new call site covering exactly the usage below, (b) the implementation of the container plus two of its parts, including how collapsed state reaches the parts without being passed as a prop through the call site and without being lifted into the consumer, and (c) the guard that fires when a part is rendered outside the container. Then answer two things: which of the current props you would deliberately keep as a plain flat prop and why, and what this refactor changes about how much of the tree re-renders when the panel is collapsed and expanded.",
    "code": "<DataPanel\n  title=\"Failed payments\"\n  subtitle=\"Last 24 hours\"\n  showHeaderDivider\n  headerAction={<Button onClick={retryAll}>Retry all</Button>}\n  showFilters\n  filterOptions={statusOptions}\n  onFilterChange={setStatus}\n  collapsible\n  defaultCollapsed={false}\n  footerText=\"Updated 2 minutes ago\"\n  showFooterBorder\n  emptyState={<EmptyPayments />}\n  rows={rows}\n  renderRow={(row) => <PaymentRow payment={row} />}\n/>",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "TypeScript prop typing patterns for components",
    "type": "write",
    "difficulty": "hard",
    "prompt": "This `Select` shipped as plain JS with its props documented as `items: any[]; value: any; onChange: (v: any) => void; multiple?: boolean`, and it has caused two production incidents. Write the TypeScript type for its props and the component signature — you do not need to retype the body. It must enforce at compile time: (1) whatever element type `items` holds, `value`, `onChange`'s parameter, `getKey` and `getLabel` all refer to that same type, so `items={users}` with `getLabel={(o: Order) => o.ref}` is an error; (2) when `multiple` is true, `value` is an array and `onChange` receives an array, otherwise `value` is a single item or null and `onChange` receives a single item — and no call site can pass an array `value` without `multiple`; (3) the component accepts every native attribute of the button it renders (className, disabled, aria-*, id, …) without listing them by hand, while a caller's native `value`/`onChange` cannot collide with the component's own; (4) `ref` typed for the underlying button, in the React 19 style the code already uses; (5) `children` is not accepted at all. Then, in one or two sentences each: point to the specific `any` in that original prop list that let a real runtime crash through, naming the line in the body that crashes and why the compiler could not have stopped it; and state what a reviewer should suspect when they see a props type in which nearly every field is optional.",
    "code": "export function Select({ items, value, onChange, getKey, getLabel, multiple, ref, ...buttonProps }) {\n  const [open, setOpen] = useState(false);\n\n  const isSelected = (item) =>\n    multiple\n      ? value.some((v) => getKey(v) === getKey(item))\n      : value != null && getKey(value) === getKey(item);\n\n  return (\n    <>\n      <button {...buttonProps} ref={ref} onClick={() => setOpen((o) => !o)}>\n        {multiple ? `${value.length} selected` : value ? getLabel(value) : 'Choose…'}\n      </button>\n      {open &&\n        items.map((item) => (\n          <div key={getKey(item)} role=\"option\" aria-selected={isSelected(item)}\n               onClick={() => onChange(multiple ? toggle(value, item, getKey) : item)}>\n            {getLabel(item)}\n          </div>\n        ))}\n    </>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "useLayoutEffect vs useEffect",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "QA files this: 'When you click the row menu, the popover flashes in the top-left corner of the screen for an instant and then snaps under the button.' It is obvious on their older laptop and nearly impossible to catch on the developer's machine. Explain what the browser is actually doing in each frame to produce that flash, and why machine speed changes how visible it is. Fix it. Then answer both of: what your fix costs (be specific about what it blocks and when that becomes a real problem), and — since this page is server-rendered — what your fix does during the server render and how you keep that clean without turning off SSR for the page.",
    "code": "function Popover({ anchorRef, open, children }) {\n  const ref = useRef(null);\n  const [pos, setPos] = useState({ top: 0, left: 0 });\n\n  useEffect(() => {\n    if (!open || !ref.current || !anchorRef.current) return;\n    const anchor = anchorRef.current.getBoundingClientRect();\n    const self = ref.current.getBoundingClientRect();\n    setPos({\n      top: anchor.bottom + 8,\n      left: anchor.left + anchor.width / 2 - self.width / 2,\n    });\n  }, [open, anchorRef]);\n\n  if (!open) return null;\n\n  return createPortal(\n    <div ref={ref} className=\"popover\" style={{ position: 'fixed', ...pos }}>\n      {children}\n    </div>,\n    document.body\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Imperative handles and ref forwarding in React 19",
    "type": "write",
    "difficulty": "senior",
    "prompt": "You own the design-system `<LessonVideo>` component. It wraps an hls.js instance around a `<video>` element and is used on the course page, which needs to jump to a timestamp when the learner clicks a chapter marker, and start over from zero when a new lesson is selected.\n\nWrite the React 19 component (plain JSX, no TypeScript required) so that:\n\n1. The course page can call exactly two methods on it - `seekTo(seconds)` and `restart()` - and cannot reach the underlying `<video>` element or the hls instance through the ref.\n2. The design system also ships `<LessonPlayerCard>`, which renders `<LessonVideo>` plus a title bar and analytics; show how the course page's ref reaches the inner `<LessonVideo>` through that wrapper, and note what you did NOT have to write compared to React 18.\n3. Your app also consumes a `<Tooltip>` from a third-party library that is still authored with `forwardRef`. State what, if anything, changes for you as the consumer.\n4. The course page supports deep links like `/course/3?t=180`: on first load it must seek to 180s. Show where that call goes and justify why it is safe there - i.e. say when the ref you exposed is actually populated relative to the parent's render and effects.\n\nThen answer in two or three sentences: why is `seekTo` an imperative method rather than a `currentTime` prop that the component syncs to in an effect? Give a concrete scenario where the prop version misbehaves.",
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
    "prompt": "This component shipped and analytics looked fine for months. After the team wrapped the category-filter update in `startTransition` and turned on StrictMode in development, impression numbers started disagreeing with reality: some notifications are reported as seen when the user never saw them on screen, and those same notifications are then never reported again, even after the user really does scroll past them.\n\nWhat is wrong with this component, why do the recent changes expose it, and how would you fix it?",
    "code": "import { useState } from 'react';\nimport { analytics } from '../lib/analytics';\nimport { NotificationRow } from './NotificationRow';\n\nconst impressionsSent = new Set();\n\nexport function NotificationFeed({ notifications, filter }) {\n  const [expandedId, setExpandedId] = useState(null);\n  const visible = notifications.filter((n) => n.category === filter);\n\n  return (\n    <ul className=\"feed\">\n      {visible.map((n) => {\n        if (!impressionsSent.has(n.id)) {\n          impressionsSent.add(n.id);\n          analytics.track('notification_impression', { id: n.id, filter });\n        }\n        return (\n          <NotificationRow\n            key={n.id}\n            notification={n}\n            expanded={n.id === expandedId}\n            onToggle={() => setExpandedId(n.id)}\n          />\n        );\n      })}\n    </ul>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Profiling and measuring React performance",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "Typing in the filter box above a 900-row table feels laggy. You record the same interaction twice: once with the React DevTools Profiler and once with the browser's Performance panel.\n\nReact DevTools Profiler: 8 commits for 8 keystrokes. In every commit `<DataTable>` shows self time 4 ms, total 19 ms, and the \"why did this render\" panel says it rendered because \"Hook 3 changed\".\n\nPerformance panel: each keystroke produces one long task of roughly 140 ms; the bottom-up view attributes about 110 ms of it to Recalculate Style and Layout and about 25 ms to scripting.\n\nWhich conclusion is supported by this data?",
    "code": "",
    "language": "",
    "options": [
      "React is re-rendering more often than it needs to, so wrapping DataTable in React.memo and stabilizing the row callbacks with useCallback is what will bring the per-keystroke cost down.",
      "React's own work is a small slice of each keystroke; the cost is the browser styling and laying out the DOM that render produces, so cut the number of rendered nodes or the per-row style cost.",
      "The \"Hook 3 changed\" entry pins the filter state as the culprit, so moving it behind useDeferredValue takes the long task off the keystroke and removes the style and layout cost.",
      "A 4 ms self time against a 19 ms total means DataTable itself is fine and its children are slow, making memoization of Row the highest-leverage fix this data points to.",
      "The Profiler's 19 ms already includes the browser's style, layout and paint for that commit, so the Performance panel numbers are re-counting work you have already measured."
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
      "It can remove the need for most hand-written useMemo and useCallback, but it will not make a genuinely expensive computation cheaper when that computation's inputs really do change on every render.",
      "Existing useMemo and useCallback calls have to be deleted before you turn it on, otherwise the compiler's memoization and the hand-written memoization fight each other and produce stale values.",
      "Components that mutate props or state objects during render can be skipped by the compiler or compiled into wrong behavior, since it assumes the Rules of React hold; the lint rule and its bail-out reporting are how you find those violations.",
      "Effect dependency arrays no longer need to list every reactive value, because the compiler derives an effect's real dependencies and keeps it from over-firing.",
      "A third-party component that resets its internal state when a prop object's identity changes will stop resetting, because the compiler now hands it the same object across renders when the contents have not changed."
    ],
    "multi": true
  },
  {
    "area": "react",
    "topic": "Subscribing to external stores and tearing",
    "type": "write",
    "difficulty": "hard",
    "prompt": "`cartStore` is a small vanilla store shared by the whole app: it holds a `state` object with an `items` array, exposes `subscribe(listener)` returning an unsubscribe function, and replaces `state` with a brand-new object on every mutation. It is also read on the server during SSR.\n\nWrite the React 19 hooks layer over it: `useCartSummary()` returning `{ count, total }` (total = sum of `price * qty`), and a general `useCartSelector(selector, isEqual)` that components use to subscribe to one slice.\n\nRequirements, all of which must be visible in the code you write:\n1. State the invariant the snapshot function has to satisfy, and say exactly what React does when it is violated — including the error message the user sees.\n2. `useCartSummary` must not re-render a consumer when an unrelated part of the cart changes, and must survive the store notifying with no actual change.\n3. Give two structurally different implementations of the derived summary and say when you would pick each.\n4. Handle the server snapshot correctly, and say what goes wrong during hydration if it is written the naive way.\n5. Say what the `subscribe` argument's identity has to be and what happens on every render if you get it wrong.\n\nThen answer two things. A teammate's first attempt was to wrap the snapshot function in `useCallback` — say whether that helps and why. And in one or two sentences: what class of bug does this API exist to prevent that a plain `useState` + `useEffect` subscription would not?",
    "code": "// cartStore.js (given — you may add to it, but not change how it notifies)\nexport const cartStore = {\n  state: { items: [], coupon: null, address: null },\n  subscribe(listener) {\n    listeners.add(listener);\n    return () => listeners.delete(listener);\n  },\n  addItem(item) {\n    // every mutation replaces state with a new object and notifies every listener\n    this.state = { ...this.state, items: [...this.state.items, item] };\n    listeners.forEach((l) => l());\n  },\n};\n\n// consumers look like:\n// const { count, total } = useCartSummary();\n// const coupon = useCartSelector((s) => s.coupon);",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Testing behavior with React Testing Library",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "`PromoCodeForm` renders `<p className=\"promo-error\" role=\"alert\">{error}</p>` inside the form at all times, whether or not there is an error. When `onApply` rejects, the component sets `error` to \"That promo code isn't valid.\"\n\nThis test is green. It also stays green after each of these two changes, both of which mean the user now sees nothing when a code is rejected:\n- a teammate deletes the line that sets the error message state;\n- a teammate adds the `hidden` attribute to that `<p>` and forgets to remove it.\n\nList every reason this test fails to test the feature, then rewrite it (Vitest + React Testing Library + @testing-library/user-event).",
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
    "prompt": "MSW is started in the global test setup (`server.listen()` in `beforeAll`, `server.close()` in `afterAll`, nothing else) with a default handler for `GET /api/invoices` that returns `invoiceFixtures`. `InvoicesPage` loads its data through `useInvoices`, a hook wrapping a TanStack Query `useQuery`, and renders a loading state, an empty state (\"No invoices yet\"), or a table.\n\nIn CI: the second test fails - the empty state never appears - the first test is flaky, and both tests print \"An update to InvoicesPage inside a test was not wrapped in act(...)\".\n\nExplain the cause of each of the three symptoms, then rewrite the setup and both tests. Finally: a teammate proposes fixing the second test with `vi.mock('../hooks/useInvoices', () => ({ useInvoices: () => ({ data: [], isPending: false, error: null }) }))`. Say whether you would take that fix and why.",
    "code": "const queryClient = new QueryClient({\n  defaultOptions: { queries: { staleTime: Infinity } },\n});\n\nfunction renderPage(ui) {\n  return render(\n    <QueryClientProvider client={queryClient}>\n      <MemoryRouter initialEntries={['/invoices']}>{ui}</MemoryRouter>\n    </QueryClientProvider>\n  );\n}\n\ntest('renders a row per invoice', async () => {\n  renderPage(<InvoicesPage />);\n  await new Promise((resolve) => setTimeout(resolve, 300));\n  expect(screen.getAllByRole('row')).toHaveLength(invoiceFixtures.length + 1);\n});\n\ntest('shows the empty state', async () => {\n  server.use(http.get('/api/invoices', () => HttpResponse.json([])));\n  renderPage(<InvoicesPage />);\n  expect(await screen.findByText(/no invoices yet/i)).toBeInTheDocument();\n});",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Accessibility and focus management in components",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Build `<ConfirmDeleteProject>` in plain JSX. No native `<dialog>`, no headless UI library - the point is the wiring. It is opened by a \"Delete project\" button in a toolbar, and contains a heading, a text input (\"Type the project name to confirm\"), a Cancel button and a Delete button. Delete calls `await deleteProject(id)`, which takes a couple of seconds and can fail. The app mounts at `#root`.\n\nRequirements your code must satisfy:\n1. When it opens, focus lands on the confirmation input, and the rest of the page is unreachable by Tab and hidden from screen readers - say explicitly where the dialog's own DOM node lives, so that whatever you do to the rest of the page does not neutralise the dialog too.\n2. Tab from the last focusable element goes to the first, and Shift+Tab from the first goes to the last. The Delete button is disabled until the typed name matches, so the set of focusable elements changes while the dialog is open.\n3. Escape closes it, and focus returns to the \"Delete project\" button - including when the component unmounts on close.\n4. The dialog has an accessible name derived from its heading.\n5. If the typed name does not match on submit, an error message is programmatically associated with the input and focus moves to the input.\n6. Success and failure of the async delete are announced to a screen reader exactly once, without the reader chattering during typing or on unrelated re-renders.\n\nThen answer in one sentence: why can't you create the live region element in the same render in which you put the message into it?",
    "code": "",
    "language": "",
    "options": [],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Portals: rendering outside the tree",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "The invoices table row has an `onClick` that selects the row. The row-actions menu is portaled to `document.body` so it is not clipped by the table's `overflow: hidden`. Elsewhere the app registers `document.addEventListener('click', closeMenu)` to close the menu on outside clicks, and the row sits inside a `<ThemeContext.Provider>`.\n\nA user opens the menu and clicks \"Archive\". Which statement is true?",
    "code": "function RowActions({ invoice, onSelectRow }) {\n  const [open, setOpen] = useState(false);\n  return (\n    <td onClick={() => onSelectRow(invoice.id)}>\n      <button onClick={() => setOpen(true)}>Actions</button>\n      {open &&\n        createPortal(\n          <ul className=\"row-menu\">\n            <li>\n              <button onClick={() => archive(invoice.id)}>Archive</button>\n            </li>\n          </ul>,\n          document.body\n        )}\n    </td>\n  );\n}",
    "language": "jsx",
    "options": [
      "The click on \"Archive\" also runs the <td>'s onClick and selects the row, because React events propagate along the React tree rather than the DOM tree.",
      "The click on \"Archive\" does not run the <td>'s onClick, because the menu's DOM parent is document.body and events propagate through the DOM tree.",
      "The menu cannot read ThemeContext, because a portal renders into a separate DOM subtree and therefore begins a fresh context boundary.",
      "The document-level click listener never fires for clicks inside the menu, because React dispatches the synthetic event at the root container and stops it there.",
      "The table's overflow: hidden still clips the menu until the <ul> is also given position: fixed, because clipping is resolved from the React tree."
    ],
    "multi": false
  },
  {
    "area": "react",
    "topic": "Virtualizing large lists",
    "type": "write",
    "difficulty": "hard",
    "prompt": "A team activity feed renders about 20,000 entries. Rows are variable height (some have a thumbnail, some have a two-line summary that expands on click). The page currently renders every row and takes several seconds to become interactive. Product requirements: date group headers stay stuck to the top while scrolling through that day, links of the form `/feed?focus=event-9184` must land on and highlight that entry, and rows are keyboard navigable with arrow keys.\n\nWrite the windowed implementation (plain JSX, `@tanstack/react-virtual` or equivalent - the exact API matters less than the structure): dynamic per-row measurement, stable keys, the scroll container and total-size spacer, re-measurement when a row expands on click, and the code that lands on the deep-linked entry on first load.\n\nThen answer the harder half: name at least four things this change breaks or degrades for users, and for each say what you would actually do about it. Finally state, in one or two sentences, the condition under which you would not virtualize this list at all.",
    "code": "",
    "language": "",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Event loop ordering: microtasks vs macrotasks vs await",
    "type": "mcq",
    "difficulty": "hard",
    "prompt": "This module body runs once at app startup, with nothing else pending on any queue. Which sequence is the exact output?",
    "code": "console.log('A');\n\nsetTimeout(() => console.log('timeout'), 0);\n\nasync function inner() {\n  console.log('inner:sync');\n  await null;\n  console.log('inner:after-await');\n}\n\ninner().then(() => console.log('inner:done'));\n\nPromise.resolve()\n  .then(() => {\n    console.log('p1');\n    return Promise.resolve();\n  })\n  .then(() => console.log('p2'));\n\nPromise.resolve()\n  .then(() => console.log('q1'))\n  .then(() => console.log('q2'))\n  .then(() => console.log('q3'))\n  .then(() => console.log('q4'));\n\nconsole.log('B');",
    "language": "js",
    "options": [
      "A -> inner:sync -> B -> inner:after-await -> p1 -> q1 -> inner:done -> q2 -> q3 -> p2 -> q4 -> timeout",
      "A -> inner:sync -> B -> inner:after-await -> p1 -> q1 -> inner:done -> p2 -> q2 -> q3 -> q4 -> timeout",
      "A -> inner:sync -> inner:after-await -> B -> inner:done -> p1 -> q1 -> q2 -> q3 -> p2 -> q4 -> timeout",
      "A -> inner:sync -> B -> inner:after-await -> p1 -> q1 -> timeout -> inner:done -> q2 -> q3 -> p2 -> q4",
      "A -> inner:sync -> B -> inner:after-await -> inner:done -> p1 -> q1 -> q2 -> q3 -> p2 -> q4 -> timeout"
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Sequential vs parallel async and await-in-loops",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "A nightly job syncs invoices. `normalize` is synchronous and pure; `api.getInvoice` and `api.renderPdf` each return a promise, are independent per invoice, and the provider imposes no rate limit. In production the job takes about 90 seconds for 200 ids, and the `summaries` array in the returned object is always empty - even though the PDF service's own logs show all 200 render requests arriving, and the process occasionally logs an unhandled rejection. Explain both defects and the exact mechanism behind each, rewrite `syncInvoices` correctly so that the order of `summaries` still matches the order of `invoiceIds`, and name the parts of a job like this you would deliberately keep sequential and why.",
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
    "prompt": "Assume `store`, `fetch`, `WEBHOOK_URL`, `showToast` and `auditLog` are defined elsewhere. Two separate production reports: (a) when the webhook endpoint answers 500, monitoring records an unhandled rejection with message 'webhook rejected', yet `publishDraft` still resolves and the user is never told anything went wrong; (b) when `store.publish` rejects, the user does see a toast, but no audit entry is ever written and monitoring records a second unhandled rejection, 'Cannot read properties of undefined (reading id)'. Trace where each rejection is created and why it escapes every handler present in this code, state precisely what the `finally` block does and does not do to the value `publishDraft` settles with (including what happens if `releaseLock` itself rejects), and fix both defects.",
    "code": "async function publishDraft(draftId) {\n  try {\n    const draft = await store.load(draftId);\n    sendWebhooks(draft);\n    await store.publish(draft);\n    return { ok: true, id: draftId };\n  } finally {\n    await store.releaseLock(draftId);\n  }\n}\n\nasync function sendWebhooks(draft) {\n  const res = await fetch(WEBHOOK_URL, {\n    method: 'POST',\n    body: JSON.stringify(draft),\n  });\n  if (!res.ok) throw new Error('webhook rejected');\n}\n\n// call site\npublishDraft(id)\n  .catch((err) => showToast(err.message))\n  .then((result) => auditLog(result.id));",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Promise combinators and their failure semantics",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "A billing dashboard loads three independent panels with the code below. When `fetchAlerts` returns a 500 the whole widget renders blank instead of showing the two panels that succeeded, and the team is arguing about which combinator to switch to. Exactly one of the following statements about these combinators is accurate. Which one?",
    "code": "const [stats, alerts, usage] = await Promise.all([\n  fetchStats(range),\n  fetchAlerts(range),\n  fetchUsage(range),\n]);\n\nrender({ stats, alerts, usage });",
    "language": "js",
    "options": [
      "Promise.all rejects as soon as one input rejects and aborts the requests still in flight, so no further server work or bandwidth is spent on them.",
      "Promise.race settles with the first input to settle - a rejection counts as settling - and the losing requests run to completion, side effects included.",
      "Promise.any resolves with the first fulfillment, and if every input rejects it rejects with the first error received, the same way Promise.all reports a failure.",
      "Promise.allSettled rejects only when every input rejects; otherwise it fulfills with an array containing just the values of the inputs that succeeded.",
      "Once Promise.all has rejected, a rejection arriving later from one of the other inputs surfaces as an unhandled rejection, because nothing is observing it any more."
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Closures over live bindings and stale captures",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "This is used as `const status = createSessionMonitor(socket)` and the caller renders `status.idleSeconds` on every frame. Two bugs: users get disconnected with `idle-timeout` roughly five minutes after opening the app no matter how much activity the socket reports, and the `status` object the caller holds always reports `idleSeconds: 0`. Both callbacks close over the same set of variables, yet one of them plainly sees fresh data and the other does not. Explain exactly which reads are live and which are snapshots and why they differ, then fix both bugs while keeping the return value a plain object the caller reads as `status.idleSeconds` / `status.lastActivity` (no new API for the caller to adopt). Finally, say what else this function does wrong that a long-lived app would notice.",
    "code": "export function createSessionMonitor(socket) {\n  let lastActivity = Date.now();\n  let idleSeconds = 0;\n\n  socket.on('activity', () => {\n    lastActivity = Date.now();\n  });\n\n  const status = { lastActivity, idleSeconds };\n\n  setInterval(() => {\n    idleSeconds = Math.round((Date.now() - status.lastActivity) / 1000);\n    if (idleSeconds >= 300) socket.emit('idle-timeout', status);\n  }, 1000);\n\n  return status;\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Race conditions and cancellation with AbortController",
    "type": "write",
    "difficulty": "hard",
    "prompt": "Search-as-you-type keeps showing results for a query the user has already typed past, because a slow earlier request sometimes resolves after a faster later one. Write `createSearchRunner(fetchResults)` from scratch. `fetchResults(query, signal)` performs the HTTP call and forwards the signal it is given. It returns `{ run(query, options) }`, where `options` may include a caller `signal` (for example from a component teardown). Assume a current runtime where `AbortSignal.any` and `AbortSignal.timeout` are available. Requirements: (1) starting a run cancels the request still in flight from the previous run; (2) a response belonging to a superseded query must never be delivered to its caller, even if it arrives after a newer response; (3) every request gives up after 5000ms; (4) a caller-supplied signal also cancels the request; (5) `fetchResults` receives exactly one signal reflecting all three cancellation sources; (6) the caller can distinguish 'superseded or torn down' from 'timed out' from 'the server actually failed', and you must state exactly how each is signalled. Include one example call site showing the error handling, and explain why debouncing alone would not satisfy requirement 2.",
    "code": "",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Reference semantics, aliasing, and accidental shared mutation",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "Two bugs were filed against this board module. First: adding a tag to one board makes that tag appear on every other board that was created without an explicit `filters` argument - including boards created earlier in the session. Second: dropping a card into the first column makes the same card appear in all three columns. Explain the precise mechanism behind each, then answer two follow-ups before fixing them: (a) would writing the default inline as `filters = { status: 'open', tags: [] }` fix the first bug, and which evaluation rule for default parameters decides that; (b) would `Object.freeze(DEFAULT_FILTERS)` at module scope have prevented the first bug, and what exactly would happen at the `push` call.",
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
    "prompt": "Given the `draft` object below, running in a current browser or Node 22+, select all statements that are true. (Select all that apply.)",
    "code": "const draft = {\n  id: 42,\n  createdAt: new Date('2026-01-05T10:00:00Z'),\n  tags: new Set(['urgent']),\n  author: { name: 'Ana', avatar: undefined },\n  render() {\n    return `#${this.id}`;\n  },\n  get slug() {\n    return `draft-${this.id}`;\n  },\n};",
    "language": "js",
    "options": [
      "Calling structuredClone(draft) as written throws a DataCloneError instead of returning a copy.",
      "JSON.parse(JSON.stringify(draft)) yields createdAt as an ISO string, omits author.avatar and render entirely, and turns tags into an empty object.",
      "{ ...draft } stores slug as the plain string 'draft-42' and leaves author pointing at the very same nested object as the original.",
      "With render deleted first, structuredClone(draft) succeeds and the copy exposes slug as a live getter and createdAt as a real Date instance.",
      "Object.assign({}, draft) deep-copies author into a new object while sharing tags with the original by reference."
    ],
    "multi": true
  },
  {
    "area": "javascript",
    "topic": "Immutability patterns and object identity",
    "type": "write",
    "difficulty": "hard",
    "prompt": "Write `toggleTaskDone(state, projectId, columnId, taskId)` for the state shape below; it returns a new state with that task's `done` flag flipped. Constraints: nothing reachable from `state` may be mutated; deep-clone helpers (structuredClone, JSON round-trip, lodash cloneDeep, Immer) are banned; every branch that was not on the path to the toggled task must come back reference-equal (`===`) to the original - including `state.ui`, `state.projects.p2`, `state.projects.p1.columns.c2` and the sibling task `t2`; and if the project, column or task id does not exist, return the original `state` object itself. Then list exactly which object references differ between input and output for `toggleTaskDone(state, 'p1', 'c1', 't1')`. Finally, explain in terms of reference identity why a teammate's version - `const next = { ...state }; next.projects[projectId].columns[columnId].tasks[taskId].done = !next.projects[projectId].columns[columnId].tasks[taskId].done; return next;` - causes a React.memo'd `TaskRow` that receives the task object as a prop to skip re-rendering while a component reading from the root re-renders, and why comparing the captured 'before' state against the 'after' state later shows no difference at all.",
    "code": "const state = {\n  projects: {\n    p1: {\n      id: 'p1',\n      name: 'Website',\n      columns: {\n        c1: {\n          id: 'c1',\n          title: 'Todo',\n          tasks: {\n            t1: { id: 't1', title: 'Copy review', done: false },\n            t2: { id: 't2', title: 'SEO pass', done: true },\n          },\n        },\n        c2: { id: 'c2', title: 'Done', tasks: {} },\n      },\n    },\n    p2: { id: 'p2', name: 'Mobile', columns: {} },\n  },\n  ui: { selectedProjectId: 'p1' },\n};",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Array mutation vs copying, and sort semantics",
    "type": "write",
    "difficulty": "mid",
    "prompt": "`rows` below lives in a shared store and is rendered by several components. Write `sortRows(rows)` returning the rows ordered by priority (high, then medium, then low), then dueDate ascending, then title compared case- AND accent-insensitively; rows with no dueDate come last within their priority group. `rows` itself must be observably unchanged afterwards and the returned array must be a new array. Then: name the array method you would reach for in 2026 and why; name the language guarantee that would make it safe to implement this as several separate sorting passes instead of one comparator; give the resulting order of ids for the data below and justify the two adjacent pairs that tie; and finally state exactly what `rows.map((r) => r.id).sort()` returns for these rows and why.",
    "code": "const rows = [\n  { id: 10,  title: 'Émile onboarding', priority: 'low',    dueDate: '2026-03-02' },\n  { id: 9,   title: 'audit log',        priority: 'high',   dueDate: null },\n  { id: 100, title: 'Audit Log v2',     priority: 'high',   dueDate: '2026-02-11' },\n  { id: 1,   title: 'billing retry',    priority: 'medium', dueDate: '2026-02-11' },\n  { id: 2,   title: 'audit log v2',     priority: 'high',   dueDate: '2026-02-11' },\n  { id: 30,  title: 'emile onboarding', priority: 'low',    dueDate: '2026-03-02' },\n];",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "reduce vs map/filter/flatMap and accumulator discipline",
    "type": "write",
    "difficulty": "senior",
    "prompt": "The customer report page freezes for several seconds after a data-volume increase: ~15k orders, ~120k line items in total, a few thousand distinct customers. A profile shows the time is spent inside `summarizeByCustomer`, not in React rendering.\n\n(a) Rewrite `summarizeByCustomer` so it returns the same shape without the performance problem. State the cost of the original and of your version in terms of n (orders), c (distinct customers) and L (total line items), and say which term dominates in each.\n(b) `largestOrder` is called with the result of a filter that can legitimately be empty. State exactly what happens in that case, and what happens when the filtered array has exactly one element. Fix it.\n(c) Justify any mutation your rewrite performs: why it is safe here, and what change to the surrounding code would make the same mutation unsafe.",
    "code": "// orders: ~15k rows from GET /api/orders\n// each order: { id, customerId, amountCents, lineItems: [...] }\n\nexport function summarizeByCustomer(orders) {\n  return orders.reduce((acc, order) => ({\n    ...acc,\n    [order.customerId]: {\n      customerId: order.customerId,\n      totalCents: (acc[order.customerId]?.totalCents ?? 0) + order.amountCents,\n      lineItems: [\n        ...(acc[order.customerId]?.lineItems ?? []),\n        ...order.lineItems,\n      ],\n    },\n  }), {});\n}\n\nexport function largestOrder(orders) {\n  return orders.reduce((a, b) => (a.amountCents > b.amountCents ? a : b));\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "`this` binding across call forms",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "Both the input listener and a call to `analytics.trackAll([...])` fail at runtime. Select every statement that is accurate. (Select all that apply.)",
    "code": "const apiClient = { send(queue) { /* POST */ } };\nconst searchInput = document.querySelector('#search');\n\nclass SearchAnalytics {\n  constructor(client) {\n    this.client = client;\n    this.queue = [];\n  }\n\n  track(event) {\n    this.queue.push(event);\n    this.client.send(this.queue);\n  }\n\n  trackAll = (events) => {\n    events.forEach(function (e) {\n      this.track(e);\n    });\n  };\n}\n\nconst analytics = new SearchAnalytics(apiClient);\nsearchInput.addEventListener('input', analytics.track);",
    "language": "js",
    "options": [
      "The listener throws on the first input event because the DOM invokes a handler with `this` set to the element the listener was registered on, so `this.queue` is `undefined` on that element and `.push` throws.",
      "The listener throws on the first input event because a method detached from its object always runs with `this === undefined` in strict-mode class code, no matter how the caller ends up invoking it.",
      "Inside `trackAll`, the `function (e)` callback runs with `this === undefined` because class bodies are strict-mode code, so `this.track` throws; an arrow callback or `forEach(cb, this)` fixes it.",
      "Because `trackAll` is an arrow class field, `analytics.trackAll.call(other, events)` is a supported way to run the same logic against another instance's queue without touching the prototype.",
      "Making `track` an arrow class field fixes the listener, but it allocates a function per instance and leaves `SearchAnalytics.prototype.track` undefined, breaking `super.track()` in a subclass and prototype-level test spies."
    ],
    "multi": true
  },
  {
    "area": "javascript",
    "topic": "Equality and coercion",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "Filter values are read off the URL query string, so a present value is always a string and an absent value is `undefined`. The parsed filters are merged over a set of defaults before being sent to the API. Which statement about `merged` is correct?",
    "code": "const defaultFilters = { page: 1, minRating: 0, q: '' };\n\nfunction applyFilters({ page, minRating, q }) {\n  const filters = {};\n  if (page) filters.page = Number(page);\n  if (minRating != null) filters.minRating = Number(minRating);\n  if (q !== '') filters.q = q;\n  return filters;\n}\n\nconst merged = {\n  ...defaultFilters,\n  ...applyFilters({ page: '0', minRating: 'all', q: undefined }),\n};",
    "language": "js",
    "options": [
      "`merged` is `{ page: 0, minRating: NaN, q: undefined }`: `'0'` is a non-empty string so the truthiness test passes, `!= null` never coerces the other operand, and the own `q` property holding `undefined` is copied by spread over the `''` default.",
      "`merged` is `{ page: 1, minRating: NaN, q: undefined }`: the truthiness test converts the string `'0'` to the number `0`, which is falsy, so `filters.page` is never assigned and the default `page` survives the spread.",
      "`merged` is `{ page: 0, minRating: 0, q: undefined }`: `'all' != null` coerces `'all'` to `NaN` before comparing, and `NaN` comparisons are falsy, so the `minRating` branch is skipped and the default survives.",
      "`merged` is `{ page: 0, minRating: NaN, q: '' }`: object spread copies only own properties whose value is not `undefined`, so `filters.q` is skipped and the `''` default is preserved in the result.",
      "`merged` is `{ page: 0, minRating: NaN, q: undefined }`, and because the key exists with an undefined value, `JSON.stringify(merged)` serializes it as `\"q\":null` and the API receives an explicit null for `q`."
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Optional chaining and nullish coalescing precision",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "Two separate incidents were traced to this function.\n\n(1) Loyalty members who qualify for free shipping — the quote service returns `costCents: 0` for them — were still charged 699.\n(2) A backend release renamed the `taxes` object on the cart payload to `taxSummary`. Every order in one region shipped with zero tax for a week; nothing was logged and nothing threw.\n\nExplain the precise mechanism behind each incident and fix both, keeping the existing behaviour for carts that genuinely have no shipping quote yet. Then state the rule you would apply in code review for when these operators belong at an API boundary and when they do not, and apply it to the `credits` line to show the distinction.",
    "code": "const DEFAULT_SHIPPING_CENTS = 699;\n\nexport function getOrderTotals(cart, user) {\n  const subtotal = cart.lineItems.reduce(\n    (sum, li) => sum + li.priceCents * li.qty,\n    0\n  );\n  const shipping = cart.shippingQuote?.costCents || DEFAULT_SHIPPING_CENTS;\n  const credits = user.wallet?.credits?.appliedCents ?? 0;\n  const taxRate = cart.taxes?.rate ?? 0;\n  const tax = Math.round((subtotal - credits) * taxRate);\n\n  return {\n    subtotalCents: subtotal,\n    shippingCents: shipping,\n    taxCents: tax,\n    totalCents: subtotal + shipping - credits + tax,\n  };\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Scope, hoisting, and the temporal dead zone",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "This module ships in a rich-text editor and is called as `initToolbar(root, { theme: 'compact' })`. Three failures came out of it, each one surfacing only after the previous line was commented out to get past it:\n\n1. `Uncaught ReferenceError: applyTheme is not defined` on the first line of the function body — and the message is identical whether `theme` is `'compact'` or anything else. The author insists function declarations are hoisted, and points out that the same code pasted into a classic non-module `<script>` fails differently: `TypeError: applyTheme is not a function`.\n2. On a toolbar that was rendered with a previously active button, `Uncaught ReferenceError: Cannot access 'activate' before initialization` — even though the click handlers registered a few lines later call `activate` all day without complaint.\n3. With both worked around, clicking any of the three buttons sets `data-active=\"undefined\"` and puts `.is-active` on the link button, whichever button was actually clicked.\n\nFor each failure name the binding involved, the scope it actually lives in, the moment it is created and the moment it is initialised. Then answer: (a) why the classic-script version fails with a TypeError instead, and what that tells you about which rule is in play; (b) why the click handlers can call `activate` when line 2 cannot; (c) whether guarding with `typeof activate === 'function'` would have avoided failure 2, and what makes `typeof` different for an undeclared identifier; (d) what failure 2 turns into if `const activate` becomes `var activate`, and which of the two failures you would rather ship. Finally give the smallest fix for each of the three, and say how many bindings the loop ends up creating after your fix versus before.",
    "code": "// toolbar.js  — an ES module\nconst BUTTONS = ['bold', 'italic', 'link'];\n\nexport function initToolbar(root, { theme } = {}) {\n  applyTheme();\n\n  if (root.dataset.active) {\n    activate(root.dataset.active, root.querySelector('.is-active'));\n  }\n\n  for (var i = 0; i < BUTTONS.length; i++) {\n    var el = root.querySelector(`[data-btn=\"${BUTTONS[i]}\"]`);\n    el.addEventListener('click', function () {\n      activate(BUTTONS[i], el);\n    });\n  }\n\n  if (theme === 'compact') {\n    function applyTheme() {\n      root.classList.add('theme-compact');\n    }\n  }\n\n  const activate = (name, node) => {\n    root.dataset.active = name;\n    node.classList.add('is-active');\n  };\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Destructuring edge cases and default parameters",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "After a backend change, some users see the literal text `null` where a display name should be, and other users crash the page with `TypeError: Cannot destructure property 'city' of 'profile.address' as it is null`. Two representative payloads:\n\nA: `{ displayName: null, address: { city: 'Austin', country: 'US' }, points: 1200, tier: 'gold' }`\nB: `{ displayName: null, address: null, tier: 'gold' }`\n\nFor each payload, walk the destructuring in evaluation order and say which bindings are produced and with what values — and, for the payload that throws, say which bindings are never created at all and why. State the single language rule that explains both symptoms. Then fix `formatProfile` so it is robust for both payloads without abandoning destructuring, and say what `formatProfile(null)` does before and after your fix.",
    "code": "export function formatProfile(\n  profile = {},\n  { locale = 'en-US', fallbackName = 'Unknown' } = {}\n) {\n  const {\n    displayName = fallbackName,\n    address: { city = '—', country = '—' } = {},\n    ...rest\n  } = profile;\n\n  return {\n    title: displayName,\n    subtitle: `${city}, ${country}`,\n    meta: new Intl.NumberFormat(locale).format(rest.points ?? 0),\n    rest,\n  };\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Map/Set vs plain objects and arrays",
    "type": "write",
    "difficulty": "senior",
    "prompt": "`annotateDocs` runs on ~2k documents (each with up to ~50 collaborator ids) against ~5k shared user ids, and building the list takes over a second. Separately, a support ticket says one user sees `ownerRole` rendered as `function Object() { [native code] }` instead of a role name; that user's chosen username is `constructor`.\n\nRewrite `annotateDocs` so both problems are gone. You may change the shape of the inputs, but say exactly how callers must build them and where that construction has to happen. State the cost before and after in terms of the input sizes. Explain precisely why the username `constructor` produces that output, name at least two other usernames that would misbehave and how each differs, and explain why your change eliminates the whole class rather than one case. Finally, say what would change if user identifiers were objects rather than strings.",
    "code": "// docs: ~2k documents, each with up to ~50 collaboratorIds\n// sharedUserIds: ~5k ids from the sharing service (array of strings)\n// roleByUsername: plain object literal, username -> role string\nexport function annotateDocs(docs, sharedUserIds, roleByUsername) {\n  return docs.map((doc) => ({\n    ...doc,\n    isShared: doc.collaboratorIds.some((id) => sharedUserIds.includes(id)),\n    ownerRole: roleByUsername[doc.ownerUsername] ?? 'viewer',\n  }));\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Memory leaks and garbage-collection intuition",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "Users who watch several tickers in one session report the tab climbing past a gigabyte and eventually going unresponsive. Each navigation between symbols does call the teardown function returned by `mountLiveChart`. The chart itself renders correctly and no errors are logged.\n\nList every path by which objects from a previous mount remain reachable after teardown runs, and for each path name the specific object it retains — including which retained object grows without bound and why. Then write the teardown this function should return. Finally describe how you would confirm the diagnosis in DevTools rather than guessing: what you would capture, what you would compare, what filter you would use, and which panel tells you the reference chain.",
    "code": "import { Chart } from './chart-lib.js';\nimport { openSocket } from './socket.js';\n\nconst chartsBySymbol = new Map();\n\nexport function mountLiveChart(container, symbol) {\n  const canvas = document.createElement('canvas');\n  container.appendChild(canvas);\n\n  const chart = new Chart(canvas);\n  const history = [];\n\n  const socket = openSocket(symbol);\n  socket.on('tick', (tick) => {\n    history.push(tick);\n    chart.render(history);\n  });\n\n  window.addEventListener('resize', () => chart.resize(canvas.clientWidth));\n  const timer = setInterval(() => chart.pulse(), 1000);\n\n  chartsBySymbol.set(symbol, { chart, canvas, history });\n\n  return () => {\n    container.removeChild(canvas);\n  };\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "WeakMap, WeakSet, and WeakRef",
    "type": "mcq",
    "difficulty": "hard",
    "prompt": "A virtualized grid stores measured row heights keyed by the row's DOM node; rows are recycled and detached constantly. `totalMeasured` was added later for a debug overlay. Which statement about this module is correct?",
    "code": "const measurements = new WeakMap();\n\nexport function recordHeight(node, height) {\n  measurements.set(node, { height, measuredAt: performance.now() });\n}\n\nexport function getHeight(node) {\n  return measurements.get(node)?.height;\n}\n\nexport function totalMeasured() {\n  return [...measurements.keys()].length;\n}",
    "language": "js",
    "options": [
      "`totalMeasured` throws, because a WeakMap has no `keys`, no `size` and no iteration at all — exposing the live key count would let a program observe when collection happened. A count needs a separate counter or a parallel strong structure, which reintroduces retention.",
      "`totalMeasured` returns a number, but a stale one: entries whose keys have been collected stay enumerable until the next major GC pass sweeps them out of the WeakMap, so the overlay lags behind reality by one collection cycle.",
      "`totalMeasured` works as written, and swapping the WeakMap for a `Map` keyed by the same nodes would not change memory behaviour here, since a recycled row is dropped from the DOM and its entry becomes unreachable along with it.",
      "`totalMeasured` should be backed by a `Map` of `WeakRef`s to the nodes: that restores enumeration while still permitting collection, and a `FinalizationRegistry` callback then deletes each entry deterministically once its node is collected.",
      "`totalMeasured` works once the WeakMap is keyed by the row's `data-row-id` string instead of the node: string keys keep exactly the same non-retaining behaviour and additionally make the entries enumerable for the overlay."
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Implementing debounce and throttle",
    "type": "write",
    "difficulty": "hard",
    "prompt": "Implement `debounce(fn, wait, options)` from scratch — no lodash, no other dependencies — supporting `{ leading = false, trailing = true, maxWait }` plus `.cancel()` and `.flush()` on the returned function.\n\nThe implementation must satisfy: `this` and all arguments are forwarded to `fn`, and a trailing invocation uses the most recent arguments; `maxWait` guarantees `fn` runs at least once every `maxWait` ms while calls keep arriving; `flush()` invokes any pending call immediately and returns its result; `cancel()` discards a pending call without invoking it and leaves the function usable afterwards; the debounced function returns the result of the most recent actual invocation of `fn`; with `{ leading: true, trailing: false }` a single isolated call fires exactly once. State the leading+trailing rule you chose for a burst, since it is a design decision.\n\nThen answer briefly: (a) for a typeahead search box, an infinite-scroll handler, and a document autosave, which of debounce or throttle fits each, with the leading/trailing choice and why the other option fails; (b) what a React component must do with the debounced function when it unmounts mid-flight, what must be true about where the debounced function is created, and what breaks if neither is done; (c) why the debounced function's return value is misleading and what you would return instead when the caller needs the result.",
    "code": "// Target usage:\nconst saveDraft = debounce((doc) => api.save(doc), 800, { maxWait: 5000 });\n\nsaveDraft(doc);      // repeated keystrokes coalesce\nsaveDraft.flush();   // run any pending call right now\nsaveDraft.cancel();  // drop any pending call",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "fetch semantics and HTTP-layer error handling",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "This wrapper is used by every data-fetching call in the app. Select every statement that is true of it exactly as written. (Select all that apply.)",
    "code": "async function apiRequest(path, { timeoutMs = 8000, ...init } = {}) {\n  const res = await fetch(`/api${path}`, {\n    ...init,\n    signal: AbortSignal.timeout(timeoutMs),\n  });\n\n  const data = await res.json();\n\n  if (!res.ok) {\n    throw new Error(data.message ?? 'Request failed');\n  }\n  return data;\n}",
    "language": "js",
    "options": [
      "A) A 500 response makes the promise returned by fetch reject, so the !res.ok branch can only ever be reached for 4xx responses.",
      "B) Because res.json() runs before the res.ok check, a 502 that returns an HTML error page from a proxy makes the wrapper throw a SyntaxError, so the caller sees a parse failure and never learns the status code.",
      "C) Wrapping res.json() in a try and falling back to res.text() on the same Response does not work: the body is already consumed, so the fallback read rejects. You must read the body once as text and JSON.parse it, or clone the Response before the first read.",
      "D) A caller that passes its own signal in init has it silently ignored, because the signal property is written after the init spread; keeping both requires composing them, e.g. AbortSignal.any([...].filter(Boolean)).",
      "E) A caller can detect the timeout in its catch with err.name === 'AbortError', since AbortSignal.timeout aborts the request exactly the way an AbortController does."
    ],
    "multi": true
  },
  {
    "area": "javascript",
    "topic": "DOM event delegation, bubbling, and capture",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "An invoice table renders rows, each containing a delete button whose contents are an `<svg>` icon and a `<span>Delete</span>`. Three things broke when this shipped: clicking a row never opens the invoice; delete only fires when the user happens to hit the button's padding rather than the icon or the label; and an unrelated dropdown elsewhere on the page (closed by a click listener on document) no longer closes when the user clicks delete. Explain each of the three precisely, then rewrite the handler. Finally: a colleague proposes re-registering this listener with `{ capture: true }` to 'fix the ordering' with the dropdown's document listener — say exactly what that would and would not change.",
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
    "prompt": "The retry layer decides whether to retry by reading `err.retryable`, and the logger serializes errors with `Object.keys`. Exactly one statement about `err` is correct. Which one?",
    "code": "class ApiError extends Error {\n  constructor(message, status) {\n    super(message);\n    this.name = 'ApiError';\n    this.status = status;\n    this.retryable = status >= 500;\n  }\n}\n\nclass RateLimitError extends ApiError {\n  retryable = true;\n  constructor(retryAfter) {\n    super('Rate limited', 429);\n    this.retryAfter = retryAfter;\n  }\n  describe() {\n    return `${this.name}: retry in ${this.retryAfter}s`;\n  }\n}\n\nconst err = new RateLimitError(30);",
    "language": "js",
    "options": [
      "A) err.retryable is false, because the base constructor's assignment runs after the subclass's field initializer, so `429 >= 500` is the value that sticks.",
      "B) err.retryable is true and appears in Object.keys(err), because the subclass's field initializers run on the instance as soon as super() returns, overwriting what the base constructor assigned.",
      "C) err.retryable is true but Object.keys(err) is empty, because class fields and methods alike are installed on RateLimitError.prototype rather than on the instance.",
      "D) err instanceof ApiError is false, because ApiError's constructor implicitly returns the object built by Error instead of a RateLimitError.",
      "E) delete err.retryable leaves err.retryable === true, because the lookup then falls through to the field's definition on RateLimitError.prototype."
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "ES modules vs CommonJS: live bindings, cycles, dynamic import",
    "type": "debug",
    "difficulty": "hard",
    "prompt": "main.js used to begin with `import './session.js';` and the app booted fine. A refactor added `import { client } from './apiClient.js';` as the first line of main.js, above the session import, and now the app dies at startup with `ReferenceError: Cannot access 'client' before initialization` — nothing else changed. Explain precisely why the failure depends on which module the graph reaches first, which binding is in which state at the moment of the throw, and why the getToken import in apiClient.js does not blow up the same way. Give two structurally different fixes. Then answer this: a teammate proposes deleting getToken, writing `export let token` in session.js, reassigning it on each refresh, and importing `token` directly in apiClient.js — would apiClient observe the refreshed value, and why?",
    "code": "// apiClient.js\nimport { getToken } from './session.js';\n\nexport const client = {\n  async get(path) {\n    const res = await fetch(path, {\n      headers: { Authorization: `Bearer ${getToken()}` },\n    });\n    return res.json();\n  },\n};\n\n// session.js\nimport { client } from './apiClient.js';\n\nlet token = null;\nexport const refresher = startTokenRefresh(client);\nexport function getToken() {\n  return token;\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "JSON serialization pitfalls",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "An editor persists its draft to localStorage and reloads it on the next visit. Which option correctly describes `restored`?",
    "code": "const draft = {\n  title: 'Q3 report',\n  updatedAt: new Date('2026-03-01T10:00:00Z'),\n  tags: new Set(['finance', 'draft']),\n  collaborators: new Map([['u_18', 'editor']]),\n  wordTarget: Infinity,\n  history: [1, undefined, () => audit()],\n  onSave: () => persist(draft),\n  reviewer: undefined,\n};\n\nlocalStorage.setItem('draft', JSON.stringify(draft));\nconst restored = JSON.parse(localStorage.getItem('draft'));",
    "language": "js",
    "options": [
      "A) updatedAt is a Date instance, tags and collaborators are arrays, wordTarget is null, history is [1, null, null], and the onSave and reviewer keys are absent.",
      "B) updatedAt is the string '2026-03-01T10:00:00.000Z', tags and collaborators are both {}, wordTarget is null, history is [1, null, null], and the onSave and reviewer keys are absent.",
      "C) JSON.stringify throws a TypeError, because a function value and a non-finite number have no JSON representation.",
      "D) updatedAt is the ISO string, tags is ['finance','draft'], collaborators is { u_18: 'editor' }, wordTarget is null, and history is [1] because the unserializable entries are dropped.",
      "E) updatedAt is the ISO string, tags and collaborators are both {}, wordTarget round-trips as Infinity, history is [1, null, null], and reviewer comes back as null."
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Memoization and cache correctness",
    "type": "write",
    "difficulty": "hard",
    "prompt": "Write `memoizeAsync(loader, options)`. `loader` is an async function called as `loader(orgId, filters)` where `filters` is a plain object such as `{ role: 'admin', active: true }`. Requirements: (1) N concurrent calls with equivalent arguments must produce exactly one call to `loader` — later callers share the in-flight promise; (2) a resolved value is served from cache for `ttlMs` measured from when the load settled, then reloaded on the next call; (3) a rejection must never be cached — every concurrent caller sees the rejection, and the next call retries; (4) at most `maxSize` entries, evicting least-recently-used; (5) `{ role:'admin', active:true }` and `{ active:true, role:'admin' }` must hit the same entry, and the key must not collide for `('a', {x:'b'})` vs `('a|b', {})` — state any limits of your key function; (6) expose `invalidate(orgId, filters)` and `clear()`, and say what happens when `invalidate` is called while that entry's load is still in flight. Then, in two sentences, say when a WeakMap-keyed cache would be the right tool instead and why it cannot be used here.",
    "code": "const loadMembers = memoizeAsync(fetchOrgMembers, { ttlMs: 30_000, maxSize: 200 });\n\nconst [a, b] = await Promise.all([\n  loadMembers('org_7', { role: 'admin', active: true }),\n  loadMembers('org_7', { active: true, role: 'admin' }),\n]); // must produce exactly one network request",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Concurrency-limited promise pool",
    "type": "write",
    "difficulty": "senior",
    "prompt": "A bulk uploader must process ~5,000 files through an API that tolerates only 6 simultaneous requests. Write `mapWithConcurrency(items, limit, worker, { signal, mode } = {})` where `worker(item, index)` returns a promise and `mode` defaults to `'fail-fast'`. Requirements: (1) at most `limit` workers in flight at any instant, and a new item starts the moment any one finishes — not after the current group finishes; (2) the resolved array is in input order regardless of completion order; (3) `'fail-fast'` rejects with the first error and starts no further items; `'settle'` resolves with one entry per item shaped `{ status, value }` or `{ status, reason }`; (4) do not invoke `worker` for all items up front, and do not use recursion depth proportional to the number of items; (5) handle `limit` greater than `items.length`, empty input, `limit < 1`, and a signal that is already aborted or aborts mid-run — state and justify what `'settle'` mode does on abort; (6) say what happens to work already in flight when you fail fast or abort, and explain how your implementation avoids an unhandled rejection when several in-flight workers reject at once.",
    "code": "const results = await mapWithConcurrency(files, 6, (file, i) => uploadFile(file, i), {\n  mode: 'settle',\n  signal: controller.signal,\n});",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Retry with exponential backoff",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Write `withRetry(operation, options)` for the app's HTTP layer. `operation` is called as `operation({ attempt, signal })`; it resolves with a Response only on success, throws a `TypeError` on network failure, and throws an `HttpError` carrying `status` and `headers` (a `Headers` object) for every non-2xx response — so `withRetry` never has to inspect a resolved Response. Requirements: (1) exponential backoff from `baseDelayMs` with a growth factor, jittered — name the jitter strategy you chose and why — capped at `maxDelayMs`; (2) both an attempt cap and an overall `deadlineMs` for the whole call, never sleeping past the deadline; (3) retry only on network failures, 429, 408 and 5xx, never on other 4xx; (4) honor a `Retry-After` header (delta-seconds or HTTP-date) in place of the computed delay, and say what you do when it exceeds `maxDelayMs`; (5) an `AbortSignal` must reject the call promptly while it is sleeping, not after the sleep elapses; (6) the error thrown at the end must expose the last failure as its `cause` plus a per-attempt history. Finally, state the rule you would enforce about which callers may use this at all, and how you would make an unsafe caller safe.",
    "code": "const res = await withRetry(({ signal }) => apiFetch('/reports/generate', { signal }), {\n  maxAttempts: 5,\n  baseDelayMs: 300,\n  maxDelayMs: 10_000,\n  deadlineMs: 20_000,\n  signal: controller.signal,\n});",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Custom errors, error.cause, and typed failure handling",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "Since this shipped, three things went wrong: users whose org is on a locked plan (fetchProfile rejects with a 403) get the generic error screen instead of the upgrade prompt, while an unrelated org occasionally gets the upgrade prompt for no reason; the error tracker groups every dashboard failure into one issue whose stack points only at loadDashboard; and when both metrics mirrors are down the logged message carries no information at all. Explain the root cause of each, then rewrite both the throw site and the catch site. Also say which of these failures should reach the route's error boundary and which should not.",
    "code": "export async function loadDashboard(orgId) {\n  try {\n    const profile = await fetchProfile(orgId);\n    const metrics = await Promise.any([\n      fetchMetrics(orgId, PRIMARY),\n      fetchMetrics(orgId, REPLICA),\n    ]);\n    return { profile, metrics };\n  } catch (err) {\n    throw new Error(`Failed to load dashboard for ${orgId}: ${err.message}`);\n  }\n}\n\n// route component\ntry {\n  data = await loadDashboard(orgId);\n} catch (err) {\n  if (err.message.includes('403') || err.message.includes('Forbidden')) {\n    showUpgradePrompt();\n  } else {\n    tracker.captureException(err);\n    showGenericError();\n  }\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Timers, scheduling, and main-thread responsiveness",
    "type": "write",
    "difficulty": "senior",
    "prompt": "An inbox screen needs to poll for new messages in a thread. The naive version below shipped and produced duplicated messages, a list that occasionally jumped backwards on slow connections, and cross-talk once a second thread was open.\n\nWrite the replacement: `startInboxPolling(threadId, render, { intervalMs = 3000 } = {})`, returning a stop function. No libraries. It must satisfy, and your answer must point at the line that satisfies each:\n1. exactly one request in flight per poller at any instant, no matter how slow the network gets — and the next run is scheduled from when the previous one finished, including when it failed;\n2. no shared state between two pollers running for different threads;\n3. the cursor only ever moves forward, and a response that arrives after the poller was stopped renders nothing;\n4. teardown cancels the in-flight request, not just the timer;\n5. repeated failures back off instead of hammering at a fixed rate, and recover when the server does;\n6. while the tab is hidden the poller does not fight the browser's throttling, and becoming visible again produces one immediate catch-up run.\n\nThen answer three things. With `intervalMs` at 3000, give two distinct reasons the requests still will not land exactly 3s apart, and say what your code does about each. Second: `render()` inserts DOM nodes and the team now wants the list to smooth-scroll to the newest message — which scheduling primitive belongs where, and why not simply measure right after the insertion? Third: name the point at which you would tell the team to stop improving this and change transport, and what you would change it to.",
    "code": "// the version that shipped\nlet lastSeen = 0;\n\nexport function startInboxPolling(threadId, render) {\n  const timer = setInterval(async () => {\n    const res = await fetch(`/api/threads/${threadId}/messages?since=${lastSeen}`);\n    const { messages, cursor } = await res.json();\n    lastSeen = cursor;\n    messages.forEach((m) => render(m));\n  }, 3000);\n\n  return () => clearInterval(timer);\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Dates, timezones, and Intl formatting",
    "type": "debug",
    "difficulty": "hard",
    "prompt": "Two support tickets landed against this invoicing dashboard. Everything below runs in the browser, in the user's own zone.\n\n1. Users in Los Angeles (America/Los_Angeles) see every due date rendered one calendar day earlier than the value stored in the database; users in Berlin (Europe/Berlin) see the correct day.\n2. \"Snooze 7 days\" on an invoice due 2026-03-05 produces a new dueDate of '2026-03-11' for Los Angeles users, but '2026-03-12' for Berlin users.\n\nAnswer all of the following. (a) The precise mechanism behind each ticket — for ticket 2 your explanation must also account for why Berlin is unaffected. (b) A rewrite of all three functions so that every user gets identical results regardless of zone. (c) `isPastGracePeriod` has never been reported as broken, but it is also wrong — say in what observable way. (d) Which parts of your rewrite Temporal makes unnecessary, and why.",
    "code": "// Invoices arrive from the API with date-only strings: { id, dueDate: '2026-03-05' }\nconst DAY_MS = 24 * 60 * 60 * 1000;\n\nexport function formatDueDate(invoice) {\n  const due = new Date(invoice.dueDate);\n  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });\n}\n\n// Collections chase an invoice once it is more than 30 days past due.\nexport function isPastGracePeriod(invoice, now = new Date()) {\n  return now.getTime() - new Date(invoice.dueDate).getTime() > 30 * DAY_MS;\n}\n\nexport function snooze(invoice, days) {\n  const d = new Date(invoice.dueDate);\n  d.setDate(d.getDate() + days);\n  return { ...invoice, dueDate: d.toISOString().slice(0, 10) };\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Numeric precision, money, and BigInt",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "You are choosing the representation strategy for a checkout service. Line-item amounts arrive as decimal strings, and order IDs arrive from a Postgres bigint column (19 digits). Select all statements that are true.",
    "code": "",
    "language": "",
    "options": [
      "JSON.parse('{\"id\":9007199254740993}') silently yields 9007199254740992, so a 19-digit id must be transported as a string (or read with a reviver that has access to the source text) to survive the round trip at all.",
      "JSON.stringify emits a BigInt as an unquoted integer literal, so once an id has been converted to BigInt it can be sent back to the API in a request body with no further handling.",
      "Storing money as integer minor units removes representation error for addition and subtraction, but tax and percentage-discount multiplication still requires an explicitly chosen rounding mode and rounding point.",
      "BigInt is a correct representation for 64-bit identifiers and for exact minor-unit arithmetic, but it cannot represent fractions, so any rate has to be scaled to an integer before it is multiplied in.",
      "Math.abs(a - b) < Number.EPSILON is the correct general-purpose way to decide whether two computed cart totals are equal."
    ],
    "multi": true
  },
  {
    "area": "javascript",
    "topic": "Generators, iterators, and custom iterables",
    "type": "write",
    "difficulty": "senior",
    "prompt": "The audit-log endpoint is cursor-paginated. Write `createAuditLog(fetchPage)` and a helper `take(source, n)` in plain JS, no libraries, meeting all of these:\n\n1. `for await (const entry of createAuditLog(fetchPage))` yields individual entries flattened across all pages, and a page request is issued only once the consumer has actually consumed everything from the previous page — never eagerly, never all pages up front.\n2. `break`ing out of the loop early must issue no further requests and must abort the in-flight one, with the abort placed somewhere that runs no matter how the consumer stops.\n3. The returned value must be re-iterable: two separate `for await` loops over the same object each start from the first page, and the second loop must work correctly even if the first one was broken out of early.\n4. `take(source, n)` returns an array of the first `n` entries and must not leave the underlying source suspended mid-iteration.\n\nThen explain what mechanism causes your cleanup in (2) to run, and why your object satisfies (3).",
    "code": "// GET /api/audit?cursor=<opaque> resolves to:\n//   { entries: [{ id, actor, action, at }], nextCursor: 'c_82f' | null }\n// Provided for you:\nasync function fetchPage(cursor, signal) { /* performs the request, rejects on abort */ }",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Property descriptors, accessors, and freezing",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "After about fifteen minutes the app starts getting 401s from every request: the interval never calls `refreshToken()`. Logging shows that at that moment `session.isExpired` is `true` while `ctx.isExpired` is `false` — and `ctx.isExpired` has been `false` since the very first tick.\n\nExplain exactly why, then fix it. Also answer: what is the `Object.freeze` call actually protecting here, and what does it not protect? Finally: if `isExpired` had instead been a getter declared on a `Session` class, what would `ctx.isExpired` be, and would the symptom look different?",
    "code": "// src/auth/session.js\nexport function createSession(rawToken, user) {\n  const createdAt = Date.now();\n  return Object.freeze({\n    user,\n    token: rawToken,\n    get isExpired() {\n      return Date.now() - createdAt > 15 * 60 * 1000;\n    },\n  });\n}\n\n// src/api/client.js\nexport function withHeaders(session, headers) {\n  return { ...session, headers: { ...headers, Authorization: `Bearer ${session.token}` } };\n}\n\n// src/api/bootstrap.js  (ES module; imports createSession, withHeaders, refreshToken, login)\nconst session = createSession(await login(), currentUser);\nconst baseHeaders = { Accept: 'application/json' };\nconst ctx = withHeaders(session, baseHeaders);\n\nsetInterval(() => {\n  if (ctx.isExpired) refreshToken();\n}, 30_000);",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Regex in real work",
    "type": "debug",
    "difficulty": "mid",
    "prompt": "QA uploads a CSV in which every row has a correctly formatted SKU. `validateRows` marks roughly half of them invalid. Re-uploading the exact same file sometimes reproduces the same failures exactly and sometimes flips which rows fail — QA cannot find the pattern. `linkMentions` has never been reported as buggy.\n\nExplain precisely what is happening; why the failures alternate; what determines whether a re-upload reproduces or flips (be specific about the condition); why the second function is unaffected; and the fix you would actually ship.",
    "code": "// src/import/validate.js\nconst SKU_PATTERN = /^[A-Z]{3}-\\d{4}(?:-[A-Z]{2})?$/g;\nconst MENTION_PATTERN = /@([A-Za-z0-9_]{2,20})/g;\n\nexport function validateRows(rows) {\n  return rows.map((row) => ({ ...row, valid: SKU_PATTERN.test(row.sku) }));\n}\n\nexport function linkMentions(text) {\n  return text.replace(MENTION_PATTERN, (m, handle) => `<a href=\"/u/${handle}\">${m}</a>`);\n}",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Runtime type checking and validating untrusted data at boundaries",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "A teammate added this guard so that a malformed /api/reports payload can never reach app state. Which single statement is the most accurate critique of the code as written?",
    "code": "// src/api/reports.js\nfunction isReport(value) {\n  if (typeof value !== 'object') return false;\n  if (!(value.rows instanceof Array)) return false;\n  if (isNaN(value.total)) return false;\n  return true;\n}\n\nexport async function loadReport(id) {\n  const res = await fetch(`/api/reports/${id}`);\n  const data = await res.json();\n  return isReport(data) ? data : null;\n}",
    "language": "js",
    "options": [
      "typeof null is 'object', so a null body reaches value.rows and throws a TypeError out of a guard whose entire job is to return false; instanceof Array is not the robust array test; and isNaN coerces, so null, '' and [] all pass as a valid total.",
      "The checks are sound as far as they go; the only real gap is that isReport never validates the shape of the objects inside rows, so it needs a per-row check or a schema library.",
      "The real hole is that arrays and Date instances also satisfy typeof value === 'object', so the guard should test value?.constructor === Object instead; with that swap the remaining checks are correct.",
      "isNaN should be Number.isNaN, and that is the only defect: the typeof and instanceof checks are fine here because JSON.parse always produces same-realm plain objects and arrays.",
      "The checks themselves are correct for parsed JSON; the defect is returning null on failure, which leaves the caller unable to distinguish a malformed payload from a report that does not exist."
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Unicode-safe string handling and locale-aware comparison",
    "type": "write",
    "difficulty": "senior",
    "prompt": "You own the comment widget. Implement these three functions in plain JS using only built-ins — no libraries and no regex:\n\n1. `truncate(text, max)` — returns at most `max` user-perceived characters, appending '…' only when something was actually cut. An emoji built from several joined parts, a flag, or a letter typed as a base character followed by a combining accent must never be split, and the result must never render a lone broken glyph.\n2. `remaining(text, limit)` — the number shown in the \"characters left\" counter under the textarea.\n3. `sortAuthors(names)` — orders display names for a Swedish (`sv`) audience, case-insensitively, so that 'Åsa' and 'Ängla' land where a Swedish reader expects them, and so that 'José' typed as `e` + U+0301 orders identically to precomposed 'José'.\n\nThen state, for each function, one concrete input for which your implementation still produces a result the user would consider wrong, and why.",
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
    "prompt": "A caching package tags entities with bookkeeping metadata under a Symbol key, so the tag cannot collide with real fields and does not leak into the payloads the app sends. Which statement about the consequences of this design is correct?",
    "code": "// packages/cache/tag.js\nconst ENTRY_META = Symbol('cache.entryMeta');\n\nexport function tag(entity, meta) {\n  entity[ENTRY_META] = { fetchedAt: Date.now(), ...meta };\n  return entity;\n}\n\nexport function readMeta(entity) {\n  return entity[ENTRY_META];\n}\n\n// app code, elsewhere (ES module, top-level await)\nconst user = tag(await getUser(id), { source: 'network' });\nawait postAudit(JSON.stringify(user));\nconst draft = { ...user, name: nextName };",
    "language": "js",
    "options": [
      "Because the key is a symbol, String(user) and user + '' now route through it, so the package must also define Symbol.toPrimitive if it wants coercion of tagged entities to behave as before.",
      "JSON.stringify, Object.keys and object spread all skip the tag, so both the audit payload and the draft copy stay free of the package's bookkeeping.",
      "JSON.stringify and Object.keys skip the tag, but object spread and Object.assign copy it onto draft, and Object.getOwnPropertySymbols / Reflect.ownKeys hand it to anyone who looks — a symbol key prevents collisions, not access.",
      "Because Symbol('cache.entryMeta') is unique per module instance, two copies of this package on one page would each see only their own tag, which is why Symbol.for is the safer default for library metadata in every case.",
      "Symbol-keyed properties are created non-enumerable, which is exactly why for…in and Object.keys skip them; making this one enumerable with defineProperty would expose it to JSON.stringify."
    ],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Currying, partial application, and function composition",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Given the three transforms below, write:\n\n1. `curry(fn)` — returns a function callable with its arguments split across any number of calls, invoking `fn` and returning its result once enough arguments have been supplied. It must determine how many arguments are enough from `fn` itself, with a way to override that. Critically, an intermediate partial must be reusable: given `const withVat = curry(applyTax)(0.2)`, calling `withVat(a)` and then `withVat(b)` must not leak arguments from the first call into the second.\n2. `pipe(...fns)` — left-to-right composition of unary functions.\n3. `formatLineItem` — built from `curry` and `pipe` over the three transforms: 10% discount, then 8.75% tax, then USD display, with no intermediate named variables.\n\nThen answer two things. (a) What exactly does your `curry` read to decide the argument count, and for which function signatures does that reading silently give the wrong answer? (b) Name one concrete situation where you would reject this abstraction in code review, with the specific cost it imposes.",
    "code": "const applyDiscount = (rate, item) => ({ ...item, price: item.price * (1 - rate) });\nconst applyTax = (rate, item) => ({ ...item, price: item.price * (1 + rate) });\nconst toDisplay = (currency, item) =>\n  `${item.name}: ${new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(item.price)}`;",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "javascript",
    "topic": "Proxy and Reflect in practice",
    "type": "debug",
    "difficulty": "hard",
    "prompt": "This dependency tracker passes its unit tests, which exercise it only against plain object literals. The first line that runs against the real `Cart` throws.\n\nAnswer all of the following. (a) What does `cart.add({ price: 12.5 })` throw, and why — noting that `cart.subtotal` on its own would have worked. (b) Whether rewriting the get trap in terms of Reflect fixes it. (c) What actually happens at `cart.currency = 42`, given that this file is an ES module. (d) At least one class of mutation this proxy can never observe, no matter how the traps are written. (e) One Proxy invariant that can make a correctly written trap throw anyway. Then rewrite the traps as you would actually ship them, and state the tradeoff your rewrite accepts.",
    "code": "const deps = new Set();\n\nfunction track(target) {\n  return new Proxy(target, {\n    get(obj, key) {\n      deps.add(key);\n      return obj[key];\n    },\n    set(obj, key, value) {\n      if (key === 'currency' && typeof value !== 'string') return false;\n      obj[key] = value;\n      return true;\n    },\n  });\n}\n\nclass Cart {\n  #lines = [];\n  currency = 'USD';\n  add(line) { this.#lines.push(line); }\n  get subtotal() { return this.#lines.reduce((n, l) => n + l.price, 0); }\n}\n\nconst cart = track(new Cart());\ncart.add({ price: 12.5 });\ncart.currency = 42;",
    "language": "js",
    "options": [],
    "multi": false
  },
  {
    "area": "html",
    "topic": "Semantic structure, landmarks & heading hierarchy",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "This is the whole page shell for a projects dashboard. It passes the team's CI accessibility gate (axe-core, configured with only the WCAG 2.0/2.1/2.2 A + AA rule tags enabled; the 'best-practice' rule set is switched off) with zero violations. A screen-reader user testing the page reports that the landmark list is ambiguous and that the heading list is useless for skimming.\n\nList every structural defect. For each one, say what a browser actually exposes in the accessibility tree for the element as written, then give the corrected element / attribute / heading decision. Finally explain, per defect, why the automated run did not catch it.",
    "code": "function ProjectsPage({ projects }) {\n  return (\n    <div className=\"app\">\n      <header>\n        <h1>Acme</h1>\n        <nav><a href=\"/projects\">Projects</a><a href=\"/billing\">Billing</a></nav>\n      </header>\n      <aside>\n        <nav><a href=\"/p/active\">Active</a><a href=\"/p/archived\">Archived</a></nav>\n      </aside>\n      <main>\n        <section className=\"filters\">\n          <h3>Filters</h3>\n          <FilterForm />\n        </section>\n        <section className=\"results\">\n          <h3>Results</h3>\n          {projects.map((p) => (\n            <div className=\"card\" key={p.id}>\n              <h1>{p.name}</h1>\n              <p>{p.summary}</p>\n              <a href={`/p/${p.id}`}>Open</a>\n            </div>\n          ))}\n        </section>\n      </main>\n      <footer><small>(c) Acme</small></footer>\n    </div>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "html",
    "topic": "Links vs buttons and the interactive-element contract",
    "type": "mcq",
    "difficulty": "mid",
    "prompt": "Inside a React Router v7 SPA, `navigate` comes from useNavigate and `deleteRow` runs a mutation. Select every statement that is true of this code exactly as written.",
    "code": "<div className=\"row-actions\">\n  <div\n    className=\"link\"\n    role=\"button\"\n    tabIndex={0}\n    onClick={() => navigate(`/projects/${id}/settings`)}\n  >\n    Settings\n  </div>\n  <button onClick={() => deleteRow(id)}>Delete</button>\n</div>",
    "language": "jsx",
    "options": [
      "The Settings control fires its handler on neither Enter nor Space: the role and tabIndex supply an announced role and a tab stop, but activation from the keyboard is behaviour the browser grants only to the built-in element, so a key handler has to be written by hand.",
      "Even once key handling is added, there is still no href, so middle-click and Cmd/Ctrl-click to open in a new tab, the status-bar URL preview, prefetch-on-hover, and the context menu's 'Open in new tab' / 'Copy link address' are all unavailable.",
      "The role is wrong independently of the keyboard gap: this control changes the address, so it must be announced as a link and rendered from an element carrying a real href whose click the router intercepts.",
      "role plus tabIndex is the sanctioned recipe for a custom control: between them they restore the announced role, the tab stop and the browser's default activation behaviour, so the only thing left to add is a visible focus style.",
      "The Delete element carries no type attribute, so it defaults to type=\"button\" and its handler stays safe even if this row is later moved inside a <form> element."
    ],
    "multi": true
  },
  {
    "area": "html",
    "topic": "Labeling, grouping and error wiring for form controls in the accessibility tree",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Write the plain HTML (no framework) for one fieldset of a 'Workspace settings' form containing:\n\n(a) A text input for the workspace name, with visible label text 'Workspace name', a visible hint 'Shown to everyone in your organization', and a server-side validation error 'That name is already taken' that appears only after submit and must be announced by a screen reader when it appears (not merely styled red).\n(b) A group of three radio buttons for the default visibility of new projects: Private, Organization, Public — with the group's purpose exposed to assistive tech.\n\nConstraints: no placeholder used as a label; no aria-label on any control that already has visible text; the name input must be operable by a voice-control user who speaks the words printed on screen.\n\nAlongside the markup, answer three things. (1) For each control, which attribute or element produces the accessible NAME and which produces the accessible DESCRIPTION. (2) A colleague ships the error markup as a <p role=\"alert\"> that is inserted into the DOM at the same moment as the error text — say what typically happens and why. (3) Someone adds aria-labelledby=\"ws-name-lbl\" to the name input, but no element in the document has that id. State the resulting accessible name and the rule that produces it.",
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
    "prompt": "This invite form is in production. Two reports:\n\n(1) Logging the incoming FormData at the top of the inviteMember action shows a single entry, role=member, when an admin submits — and a completely empty FormData for users whose canAssignRoles is false.\n(2) QA reports that pressing Enter while typing a valid address in the Email field writes a draft row to the database exactly as if 'Save draft' had been clicked, and that clicking 'Save draft' with the mouse writes the draft AND fires the invite action. They also note that pressing Enter with the Email field empty does nothing at all.\n\nAssume inviteMember and saveDraft are each implemented correctly. Explain every cause, including why the empty-field case behaves differently, and give the corrected markup.",
    "code": "function InviteForm({ orgId, canAssignRoles }) {\n  const [state, formAction] = useActionState(inviteMember, null);\n  return (\n    <form action={formAction}>\n      <input type=\"hidden\" value={orgId} />\n      <label>\n        Email\n        <input type=\"email\" required />\n      </label>\n      <label>\n        Role\n        <select name=\"role\" defaultValue=\"member\" disabled={!canAssignRoles}>\n          <option value=\"member\">Member</option>\n          <option value=\"admin\">Admin</option>\n        </select>\n      </label>\n      <button onClick={saveDraft}>Save draft</button>\n      <button type=\"submit\">Send invite</button>\n      {state?.error && <p>{state.error}</p>}\n    </form>\n  );\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "html",
    "topic": "Focus management for dynamic UI and client-side routing",
    "type": "debug",
    "difficulty": "hard",
    "prompt": "Every route in this React Router v7 app renders inside this layout. Three reports come in: (1) keyboard users say that after activating a link in the header they have to Tab from the very top of the page again; (2) screen-reader users say nothing tells them the page changed, even though the URL and the content update; (3) a designer reports that 'Skip to content' appears to do nothing in Safari.\n\nExplain the cause of each and write the corrected code. Then answer separately: in a data table where every row has its own Delete button, where exactly must focus go after the user deletes the row they were focused in, and why?",
    "code": "function AppLayout() {\n  const { pathname } = useLocation();\n  useEffect(() => {\n    window.scrollTo(0, 0);\n  }, [pathname]);\n  return (\n    <>\n      <a className=\"skip-link\" href=\"#main\">Skip to content</a>\n      <SiteHeader />\n      <main id=\"main\">\n        <Outlet />\n      </main>\n    </>\n  );\n}\n\n/* app.css */\n.skip-link { position: absolute; left: -9999px; }\n.skip-link:focus { left: 8px; }\na:focus, button:focus { outline: none; }",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "html",
    "topic": "Responsive images and image loading performance",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Write the markup for the two images on a marketing landing page.\n\n(1) HERO — full-bleed, spanning the viewport width up to a 1440px cap. Below 700px the design calls for a different, tighter crop of the same photograph (portrait framing), not merely a scaled-down version. This element is the page's LCP. Files exist at 640/960/1280/1920/2560 wide in AVIF, WebP and JPEG; the narrow crop exists at 480/720/960 in the same three formats.\n\n(2) THUMBNAIL — one card image in a project grid. The grid container has max-width: 1200px, box-sizing: border-box, and 16px horizontal padding on each side. Column gap is 24px. The grid is 1 column below 640px, 2 columns from 640px to 1023px, and 4 columns from 1024px up. Thumbnails exist at 300/600/900 wide, JPEG only. The grid starts below the fold.\n\nRequirements: w descriptors plus a correct sizes for the thumbnail, with the arithmetic shown; the appropriate loading, decoding and fetchpriority attributes for each image, each choice justified; and no layout shift for either. Then, in a sentence or two each: why sizes must be right even though CSS lays the image out correctly regardless, and when x descriptors are the better tool.",
    "code": "",
    "language": "html",
    "options": [],
    "multi": false
  },
  {
    "area": "html",
    "topic": "ARIA used only where native HTML falls short",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "A reviewer leaves five comments on this pull request, which adds a collapsible shipping-options panel and the app's toast outlet. Exactly one comment identifies a real defect in the code as written. Which one?",
    "code": "<button\n  className=\"disclosure\"\n  aria-selected={open}\n  aria-controls=\"shipping-panel\"\n  onClick={() => setOpen(!open)}\n>\n  Shipping options\n</button>\n\n<div id=\"shipping-panel\" role=\"region\" aria-label=\"Shipping options\" hidden={!open}>\n  <ShippingFields />\n</div>\n\n<div className=\"toast\" role=\"status\" aria-live=\"assertive\" aria-atomic=\"true\">\n  {toast}\n</div>",
    "language": "jsx",
    "options": [
      "The state attribute on the trigger is not one that a plain button supports, so the open/closed state is never exposed at all; the attribute this pattern actually requires is a different one that lives on the trigger.",
      "The trigger and the panel should carry role=\"tab\" and role=\"tabpanel\", since that is the pattern that formally binds a control to the content it shows and hides.",
      "aria-controls is what causes the open/closed state to be announced, so without it assistive tech would have no way to report that the panel is currently collapsed.",
      "role=\"status\" already implies polite announcement, so pairing it with an explicit assertive value is contradictory and the toast will not be announced at all until one of the two is deleted.",
      "Because the panel is hidden with the hidden attribute rather than unmounted, its contents stay exposed to screen readers while collapsed, so aria-hidden=\"true\" has to be added alongside it."
    ],
    "multi": false
  },
  {
    "area": "html",
    "topic": "Valid nesting and how the HTML parser rewrites your markup",
    "type": "debug",
    "difficulty": "hard",
    "prompt": "This card renders fine in a client-only Vite build. After the team moved the page to the Next.js App Router with SSR, the console shows a nesting warning plus a hydration error, and users report that clicking 'Acknowledge' navigates to the incident page instead of acknowledging. Someone proposes fixing it by rendering the card with ssr: false.\n\nExplain precisely what happens to this markup between the server response and React's first client render; which of the two invalid constructions here actually produces the hydration error and which does not, and why; why the client-only build hid the problem; why disabling SSR is the wrong fix; and rewrite the component so that the whole card is clickable AND the Acknowledge button still works.",
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
    "prompt": "A data table has a per-row 'Delete' button. Using platform elements only (no modal library, no focus-trap package), write the markup plus the minimal JS for the destructive confirmation overlay it opens. Every requirement below must be satisfied by the element/API you pick rather than by hand-written code wherever the platform provides it — and for each requirement, say which API call or attribute delivers it:\n\n- it must render above everything regardless of an ancestor with overflow: hidden, a transform, or a competing z-index;\n- the rest of the page must be non-interactive and unreachable by Tab while it is up;\n- Escape must dismiss it, and the calling code must be able to distinguish 'cancelled' from 'confirmed' without attaching a separate click handler to each button;\n- focus must land somewhere sensible inside on open, and end up on the right control once the overlay closes;\n- the page behind must be dimmed, styled from CSS.\n\nThen two follow-ups. (a) A teammate proposes replacing it with <div popover=\"auto\"> because 'popovers are the new native overlay' — state precisely what you would lose. (b) The same row needs an expandable details panel with an animated open/close; is <details>/<summary> a suitable base? Say what it gives you and what it does not.",
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
    "code": "<head>\n  <title>Acme</title>\n  <meta name=\"viewport\"\n        content=\"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no\" />\n  <link rel=\"stylesheet\" href=\"/assets/app.css\" />\n  <script src=\"https://cdn.analytics.example/tag.js\" async></script>\n  <script type=\"module\" src=\"/src/main.js\"></script>\n  <script src=\"/src/consent-banner.js\"></script>\n  <link rel=\"preload\" as=\"image\" href=\"/img/hero-2400.avif\" />\n  <link rel=\"preconnect\" href=\"https://cdn.analytics.example\" />\n</head>",
    "language": "html",
    "options": [
      "/src/main.js does not hold up the parser, because that script type is deferred by default, whereas /src/consent-banner.js carries neither defer nor async and therefore halts parsing at its position until it has been fetched and executed.",
      "The analytics tag is the main parser blocker here, because a script marked async holds up parsing for the whole time it is being downloaded; that is why third-party tags belong at the end of <body>.",
      "Because the stylesheet is declared ahead of all three scripts, it is fetched first and no script may execute until it has arrived, so the position of the classic script costs nothing extra.",
      "Blocking zoom the way this viewport tag does is ignored by every current mobile browser, so while the two extra directives are dead weight in the markup they cannot cause an accessibility failure.",
      "The preconnect has to be declared before the stylesheet or the preload scanner discards it, which is why the analytics connection here is opened later than it should be."
    ],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Flexbox sizing algorithm & the automatic minimum size trap",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "This conversation-list row is fixed at 320px. With short messages it looks fine. With a long last message the content spills past the 320px card, the timestamp is pushed out of view, and the ellipsis never appears — the preview text just runs on underneath the timestamp. Answer four things: (a) why `flex: 1` on `.body` does not let it shrink; (b) why `text-overflow: ellipsis` never fires on `.preview` even though that element already has `overflow: hidden`; (c) a teammate proposes adding `min-width: 0` to `.preview` — does that fix it, and why or why not; (d) the minimal correct fix, plus the general rule for where it has to go.",
    "code": "/*\n<li class=\"row\">\n  <img class=\"avatar\" src=\"/a.png\" alt=\"\" />\n  <div class=\"body\">\n    <span class=\"name\">Priya Raman</span>\n    <p class=\"preview\">Sure — I pushed the migration script to the release branch this morning, ping me if CI is red</p>\n  </div>\n  <time class=\"stamp\">14:02</time>\n</li>\n*/\n\n.row { display: flex; align-items: center; gap: 12px; width: 320px; }\n.avatar { width: 40px; height: 40px; border-radius: 50%; }\n.body { display: flex; flex-direction: column; flex: 1; }\n.name,\n.preview {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.stamp { flex: none; color: #6b7280; }",
    "language": "css",
    "options": [],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Cascade resolution: layers, specificity, !important, and inheritance",
    "type": "mcq",
    "difficulty": "hard",
    "prompt": "Given the stylesheet below and the markup `<div id=\"app\"><div class=\"card\"><h3 class=\"title text-red\">Q3 revenue</h3></div></div>`, what color does the `<h3>` render, and for what reason?",
    "code": "@layer reset, components, utilities;\n\n@layer components {\n  .card .title { color: navy; }\n}\n\n@layer utilities {\n  .text-red { color: red; }\n}\n\n#app .title { color: green; }\n\n@layer components {\n  .title { color: teal !important; }\n}\n\n.text-red { color: orange !important; }",
    "language": "css",
    "options": [
      "navy — inside `components` the more specific `.card .title` (0,2,0) beats the bare `.title`, and layered declarations outrank unlayered ones.",
      "green — unlayered declarations always outrank layered ones, so the ID selector takes it and the `!important` rules only compete inside their own layers.",
      "teal — for `!important` the layer ordering is reversed, which lifts the `components` layer above the unlayered important declaration and above every normal one.",
      "orange — the reversal of layer order for `!important` applies only among the layers themselves; unlayered important still sits above every layered important.",
      "red — `utilities` is the last layer named in the `@layer` statement, so any declaration in it beats anything in `components` or unlayered."
    ],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Grid track sizing: explicit vs implicit tracks, auto-fit/auto-fill, minmax",
    "type": "mcq",
    "difficulty": "senior",
    "prompt": "The `.grid` below is rendered in a container whose content box is exactly 1000px wide, and each child is a card. Select all statements that are true.",
    "code": ".grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 16px;\n}",
    "language": "css",
    "options": [
      "With exactly 2 cards each card is about 492px wide; swapping `auto-fit` for `auto-fill` makes each about 323px and leaves an empty third column on the right.",
      "With 3 or more cards, replacing `auto-fit` with `auto-fill` produces an identical rendering.",
      "1000px fits four 232px columns here, because the `1fr` maximum lets a track be used below the 240px minimum when the repetition count demands it.",
      "Dropped into a 200px-wide pane this grid still lays out one 240px track and overflows its container; writing `minmax(min(240px, 100%), 1fr)` prevents that.",
      "Cards past the third wrap into implicit rows that are sized by the same `repeat()` expression, so every row is at least 240px tall until `grid-auto-rows` says otherwise."
    ],
    "multi": true
  },
  {
    "area": "css",
    "topic": "Stacking contexts and containing blocks (the transform side effects)",
    "type": "debug",
    "difficulty": "senior",
    "prompt": "Clicking the ⋯ button in a product card opens `.card__menu`, which is rendered as a DOM child of that card and positioned from JS using the button's `getBoundingClientRect()` (`menu.style.top = r.bottom + 8 + 'px'; menu.style.left = r.left + 'px'`). QA reports two things, and both happen only while the pointer is over the card: (1) the menu lands in the wrong place — roughly offset by the card's own position on screen — and then scrolls away with the list instead of staying pinned; (2) where it overlaps the next card, the menu paints *underneath* that card's badge, even though the menu is z-index 9999 and the badge is z-index 5. Raising the menu to 2147483647 changes nothing. Name the single declaration responsible, give the distinct mechanism behind each symptom, explain why adding `z-index: 10` to `.card:hover` makes symptom (2) go away while symptom (1) survives, and give the fix you would actually ship.",
    "code": ".grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }\n\n.card {\n  position: relative;\n  transition: transform 160ms ease;\n}\n.card:hover { transform: translateY(-4px); }\n\n.card__badge { position: absolute; top: 8px; right: 8px; z-index: 5; }\n\n.card__menu { position: fixed; z-index: 9999; width: 220px; }",
    "language": "css",
    "options": [],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Scroll containers, overflow, and position: sticky",
    "type": "debug",
    "difficulty": "hard",
    "prompt": "This app shell is meant to keep the sidebar and toolbar fixed while only the data table scrolls, with the table's header row pinned to the top of the scrolling area. With ~500 rows two things are wrong. First, the whole window scrolls and the toolbar scrolls off the top, even though `.scroller` is the only element in the tree with `overflow-y: auto`. Second, the table header never pins — it just scrolls out of sight; git blame shows it worked until `overflow-x: hidden` was added to `.table-wrap` last month to kill a stray horizontal scrollbar. These are two independent bugs. Explain the mechanism of each and give the exact declarations you would change.",
    "code": "/*\n<div class=\"shell\">\n  <nav class=\"sidebar\">…</nav>\n  <div class=\"main\">\n    <div class=\"toolbar\">…</div>\n    <section class=\"pane\">\n      <div class=\"scroller\">\n        <div class=\"table-wrap\">\n          <table><thead class=\"thead\">…</thead><tbody>…</tbody></table>\n        </div>\n      </div>\n    </section>\n  </div>\n</div>\n*/\n\n.shell { display: flex; height: 100dvh; }\n.sidebar { flex: 0 0 240px; }\n.main { flex: 1; display: flex; flex-direction: column; }\n.toolbar { flex: 0 0 56px; }\n.pane { flex: 1; display: flex; flex-direction: column; }\n.scroller { flex: 1; overflow-y: auto; }\n.table-wrap { overflow-x: hidden; }\n.thead { position: sticky; top: 0; background: #fff; }",
    "language": "css",
    "options": [],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Custom properties, design tokens, and theming/dark mode",
    "type": "write",
    "difficulty": "senior",
    "prompt": "Write the CSS (plus the minimum non-CSS glue) for the theming layer of a design system used by a Next.js App Router app. Requirements: (1) a token architecture in which a component's own rules never contain a raw hex value; (2) light is the default, the OS preference selects dark automatically, and an explicit user choice persisted in localStorage must be able to force either mode — with no flash of the wrong theme on first paint after SSR; (3) any subtree can be re-themed by adding one class (an inverted footer, say) so that every nested component follows, without touching those components' CSS and without re-rendering them in React; (4) a `--card-radius` token that product teams sometimes set incorrectly. Then answer two things: given `border-radius: var(--card-radius, 8px)`, what is actually rendered when a consumer sets `--card-radius: 12` (no unit) versus when `--card-radius` is never set at all, and why can you not write `@media (max-width: var(--bp-md))`?",
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
    "prompt": "This card component is used both in a 640px-wide main column and in a 300px sidebar. In the 640px column the title does grow to 1.25rem as intended, but the card never switches to the two-column media-plus-text layout — it stays single column at every width. What is the reason?",
    "code": ".card {\n  container-type: inline-size;\n  display: grid;\n  gap: 12px;\n  border: 1px solid var(--color-border);\n}\n\n@container (min-width: 420px) {\n  .card { grid-template-columns: 160px 1fr; }\n  .card__title { font-size: 1.25rem; }\n}",
    "language": "css",
    "options": [
      "`container-type: inline-size` needs a definite width to query against; `.card` is stretched by its parent rather than given a width, so its inline size evaluates as 0 and the condition never matches.",
      "`min-width` inside `@container` is still resolved against the viewport; a container-relative condition has to be written in container units, e.g. `(min-inline-size: 65cqi)`.",
      "`grid-template-columns` cannot be set inside a `@container` block because the container's own inline size would then depend on the query result; the engine drops such declarations, while `font-size` has no such dependency.",
      "A query container can never be styled by its own query — only its descendants are eligible to match, which is why the `.card__title` rule applies and the `.card` rule does not.",
      "Unnamed containers are not matched by `@container`; the element needs `container: card / inline-size` and the query has to be written `@container card (min-width: 420px)`."
    ],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Fluid sizing: clamp(), relative units, and accessible/mobile viewport math",
    "type": "write",
    "difficulty": "mid",
    "prompt": "Write the CSS for two things, and justify each in a sentence or two.\n\n(a) A single fluid type token used by the marketing h1: exactly 28px when the viewport is 320px wide, exactly 56px when it is 1440px wide, linear in between, clamped at both ends. Show the arithmetic that produces the numbers in your expression.\n\n(b) The height rule for a landing hero that fills a phone screen on first load, is never clipped behind the browser's chrome, and does not make the page resize while the user is scrolling. Say explicitly why you rejected the other viewport units.\n\nThen: a teammate proposes `font-size: clamp(28px, 20px + 2.5vw, 56px)` for (a) and demonstrates that on their machine it computes to the identical pixel value as yours at every window width. Name the concrete user for whom it is not identical, describe exactly what breaks for them, and explain why this bug is invisible in normal testing.",
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
    "prompt": "This FAQ accordion is janky on a mid-range Android: expanding one item stutters, and on long pages the whole list visibly hitches for the duration of the animation. Rewrite it. Requirements: the panel must still animate open and closed with content of unknown height (rich text, sometimes with images that load late); the items below must still be pushed down, never overlapped; each item must fade in the first time it is inserted into the list (items stream in from a CMS query) with no JS 'mounted' flag; users who prefer reduced motion get no animation; and no JavaScript measurement of any kind. Show your JSX and CSS. Then explain, specifically: what `will-change` is actually doing in the current stylesheet, why animating `height` is expensive in a way animating `transform` is not, and what is wrong with how `h` is computed.",
    "code": "function FaqItem({ q, a }) {\n  const [open, setOpen] = useState(false);\n  const bodyRef = useRef(null);\n  const h = open ? (bodyRef.current?.scrollHeight ?? 0) : 0;\n\n  return (\n    <div className=\"faq\">\n      <button className=\"faq__q\" onClick={() => setOpen(!open)}>{q}</button>\n      <div className=\"faq__body\" ref={bodyRef} style={{ height: h }}>{a}</div>\n    </div>\n  );\n}\n\n/* faq.css */\n.faq__body {\n  overflow: hidden;\n  transition: height 250ms ease, box-shadow 250ms ease;\n  will-change: height, box-shadow;\n}",
    "language": "jsx",
    "options": [],
    "multi": false
  },
  {
    "area": "css",
    "topic": "Styling architecture tradeoffs: utility classes, CSS Modules, and runtime CSS-in-JS",
    "type": "write",
    "difficulty": "senior",
    "prompt": "You own the styling layer of a component library consumed by three Next.js App Router products. Write the implementation of a `<Meter>` component — a labelled bar whose fill width is `value / max` and whose fill color is a per-instance accent passed as a prop — subject to these constraints: it must remain a Server Component (no `\"use client\"`); every CSS *rule* it relies on must live in a stylesheet extracted at build time; and rendering a 400th instance with a percentage and accent no other instance uses must add zero new rules to that stylesheet. Show the JSX and the CSS.\n\nThen argue, in a few sentences each: (a) what specifically prevents runtime styled-components/Emotion from satisfying these constraints; (b) what you give up by choosing your approach over vanilla-extract; (c) what contract a utility-class framework depends on so that a consumer's override class actually wins, and what silently breaks its dead-code elimination.",
    "code": "",
    "language": "",
    "options": [],
    "multi": false
  }
];
