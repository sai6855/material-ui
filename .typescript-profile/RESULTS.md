# Material UI type-check profiling

Status: three substantial, trigger-specific targets measured and compatibility-tested.
The investigation is complete; the experiments are not merge-ready library implementations.
No production files are changed.

## Scope and method

- Source checkout at the start of this investigation had no tracked local changes.
- Source commit: `86cdecf91f9524e718f50f7a5d8b43caf0f158e9`.
- Fresh declarations were emitted from the current source, rather than reusing the old build.
- TypeScript 6 resolves to compiler **6.0.3** in this installation. The native compiler is **7.0.2**.
- Initial profiling used the compiler API and source aliases. Final measurements use isolated
  consumer files against the fresh declaration snapshot, with strict checking and skipLibCheck.
- Results are local consumer/reproduction measurements, not full-repository CI speedups.
- Production substitutions run only in a compiler host or generated local declaration copies.
- `results.jsonl` retains API measurements. `cli-results.jsonl` retains complete tsc diagnostics.
- Traces are in `traces/`. Reproduction scenarios are in `scenarios.cjs`.

## Measured findings

### 1. Autocomplete converts slot props to component types and back

Location: `packages/mui-material/src/Autocomplete/Autocomplete.d.ts:173` and
`packages/mui-utils/src/types/index.ts:25`.

An existing props type is converted to `React.ElementType<Props>`. The slot helper then uses
`React.ComponentPropsWithRef` to extract props from that generated component union. Generic
wrappers force TypeScript to compare these recursive types, including chip props and owner state.

A minimal generic wrapper used **1,101,466** instantiations on TypeScript 7.0.2. A local experiment
that separates intrinsic-element reflection from component reflection used **716,232**:
**385,234 fewer (35.0%)**. Five fresh processes per variant produced the same counts.

Median check time was **4.185 seconds versus 2.114 seconds**. Median compiler memory was
**699,149 KB versus 487,972 KB**. Baseline times ranged from 2.775 to 5.284 seconds, so timings
are supporting local evidence, not a guarantee of the same speedup in other projects.

TypeScript 6.0.3 also improved from **1,098,186 to 755,068** instantiations:
**343,118 fewer (31.2%)**. That retained experiment has only one CLI timing run on this compiler.

The scoped experiment changes only the Autocomplete declaration and a shared local helper. It
does not remove the intrinsic branches or force slots to their default components. Existing
Autocomplete type tests compile. Ten bidirectional compatibility checks cover required/optional
props, refs, input props, any, unknown, never, unions, index signatures, and callbacks. Eight
additional checks compare different Autocomplete generic instantiations. Assertions compile on
TypeScript 7.0.2 for both the baseline and the retained experiment. In particular, swapping div
and span remains rejected, while matching component props with different return types retain
their original compatibility results.

This is the largest retained absolute reduction. A wider rollout needs component-specific tests
and module-augmentation checks; the experiment is not a merge-ready implementation. This is not
a universal Autocomplete speedup: the styled-with-JSX fixture increased from 279,983 to 290,310
instantiations, although its memory use dropped. The large gain is in generic prop relationships.

### 2. Comparing sx types for different themes expands the CSS type catalog

Location: `packages/mui-system/src/styleFunctionSx/styleFunctionSx.ts:28` and `:62`.

Assigning a system-theme sx value to a Material-theme sx value causes TypeScript to discover the
theme parameter's variance through large mapped CSS types and recursive selectors. The theme is
used as input to callbacks. The trace shows this relationship check expanding the CSS catalog.

The minimal assignment used **46,098** instantiations on TypeScript 7.0.2. Explicitly describing
the existing parameter direction in the relevant types used **2,975**: **43,123 fewer (93.5%)**.
Five fresh processes per variant reproduced these counts. Median check time was **0.093 seconds
versus 0.007 seconds**. Both installed compilers produced the same instantiation counts.

Eight theme-compatibility checks retain their results, including rejection of the unsafe reverse
assignment. Nested selectors and responsive arrays remain checked. A same-theme sx wrapper and
the ordinary dashboard did not reduce instantiations: this gain applies when comparing different
theme instantiations, not every use of sx.

### 3. Styled-components repeatedly reflects recursive styled-component types

Location: `packages/mui-styled-engine-sc/src/index.ts:232`, `:235`, and `:379`.

When one styled component wraps another, overload constraints and the
StyledComponentInnerComponent/OtherProps/Attrs helpers compare the full recursive
StyledComponent type to recover its root and props. That includes polymorphic call signatures,
withComponent, and mapped DOM props. The trace attributes a large nested relationship to
StyledComponentInstance and shows expensive variance discovery. Nested trace durations must not
be added together.

The measured consumer config uses the supported alternate styled-components engine. Its trigger
is three successive styled wrappers, followed by prop extraction and JSX usage:

```tsx
const A = styled('div')({ color: 'red' });
const B = styled(A)({ color: 'green' });
const C = styled(B)({ color: 'blue' });
function Wrapper(props: React.ComponentProps<typeof C>) {
  return <C {...props} />;
}
```

TypeScript 7.0.2 used **195,781** instantiations. A private factory-information experiment used
**78,194**: **117,587 fewer (60.1%)**. Five alternating fresh-process runs reproduced the counts.
Median check time was **0.383 seconds versus 0.177 seconds**; median wall time was **677 ms versus
458 ms**. Median memory was **145,699 KB versus 109,570 KB**. Check times ranged from 0.356 to
0.483 seconds for the baseline and 0.160 to 0.188 for the experiment.

TypeScript 6.0.3 also improved: **196,671 to 78,225**, **118,446 fewer (60.2%)**. These are separate
compiler measurements, not interchangeable counters.

The retained experiment is `sc-private-cache-value-gate-legacy`. It retains the original public
StyledComponent and reflection helpers, adds private optional information to factory results, and
uses the old overloads for inputs without that information. It does not use the newer NoInfer
intrinsic. The installed compiler versions were tested; TypeScript 4.9 was not tested.

Existing engine type tests pass on both installed compilers. The added compatibility fixture
passes on both, and covers required/optional/added props, filtered props, attrs, refs, withComponent,
and wrapping an original unmodified factory result. Ten bidirectional assertions cover public
component types, factory result types, and extracted props. Existing withComponent restrictions
remain restrictions; these tests do not fix or endorse those separate behaviors. Changed
declaration validation with skipLibCheck disabled reports no errors. Fair API declaration checks
used 342,285 instantiations for the original engine and 340,048 for the experiment; those validation
counts are not the consumer benchmark.

Exposure: design-system wrappers using @mui/styled-engine-sc. This is not an Emotion-engine gain.
It is also not a universal styled-components speedup: the dashboard increased from 131,422 to
131,670, and direct styling of Autocomplete from 311,235 to 311,483. The mixed compatibility fixture
increased from 462,553 to 465,378 (0.6%). The significant saving is repeated styled inheritance.
The experiment is more involved than a one-line cleanup and still needs implementation review.

### Smaller finding: mergeSlotProps expands all intrinsic elements

Location: `packages/mui-material/src/utils/mergeSlotProps.ts:6`.

The helper accepts props or a callback. Its generic constraint goes through
`SlotComponentProps<React.ElementType, {}, {}>`, which includes all intrinsic element types even
though the component branch already permits arbitrary props. This is avoidable setup work.

A minimal call used **6,193** instantiations on TypeScript 7.0.2. Keeping the existing constraint
shape while avoiding intrinsic-element expansion used **725**: **5,468 fewer (88.3%)**. The existing
mergeSlotProps type tests compile, including exact default return-type inference.
Five fresh processes per variant reproduced these counts. Median native check time was
**0.008 seconds versus 0.003 seconds**. Median wall time did not improve: **322 ms versus 328 ms**.

Important limitation: a realistic Tooltip wrapper improved only from **124,895** to **120,801**
instantiations (3.3%). Standalone native check time was only a few milliseconds. This is a small
cleanup, not a headline application-speed improvement. The first two findings are stronger.

## Rejected experiments

- The earlier direct slot-props calculation saved 505,399 instantiations, but changed div/span
  Autocomplete assignability. The 45.9% figure is not the retained compatible result. Rejected.
- Explicit invariant parameters on Autocomplete made styling dramatically faster, but changed
  assignability for component types with identical props and different return types. Rejected.
- Replacing the mergeSlotProps constraint directly with Record<string, any> reduced more work,
  but failed the existing exact return-type test. Rejected.
- An optional-props fast path increased an Autocomplete props benchmark to approximately
  2.5 million instantiations. Rejected.
- Dropping all compatible intrinsic slot branches reduced work but narrowed accepted types.
  Not retained as a compatibility-preserving experiment.
- CSS interpolation naming, styled recursive-constraint changes, and overridable variance
  annotations did not produce meaningful reductions in the representative fixtures.
- A no-overlap DistributiveOmit experiment increased work in several consumer fixtures. The older
  synthetic catalog measurement alone is not sufficient evidence for a broadly beneficial change.
- Theme CSS-variable path normalization saved approximately 29% in the minimal fixture, with a
  small absolute cost. Lower priority than the retained large hotspots.

## Additional investigation

- A guarded default-first OverridableComponent overload reduced a simple Button from 16,077 to
  6,300 instantiations, and Box from 14,691 to 4,767. However, an existing Material Box compatibility
  test increased from 71,362 to 158,190. Rejected as a general improvement.
- A default root type parameter kept the two original overloads and passed the tested component
  checks, but saved only about 4,100 instantiations in simple Button/Box fixtures. The dashboard
  improved from 101,853 to 97,753; this is not a third headline target.
- The Select extraction trace points into InputBaseComponentProps and DOM event-handler
  comparisons. Replacing that interface with an intersection increased the extraction fixture
  from 41,257 to 43,312. Adding a generic element parameter used 41,259. Neither reduced work.
  The intersection would also prevent augmentation of the public interface.
- Simplifying the styled factory's recursive component constraint was effective as a substitution,
  but changed the styled Autocomplete fixture only from 279,983 to 279,975. The large generic
  Autocomplete wrapper remained at 1,101,466.
- Naming the CSS variants intersection with an interface used 279,919 in the styled Autocomplete
  fixture, versus 279,983. This is not a meaningful consumer improvement.
- An empty DataAttributesOverrides fast path used 1,070,014 versus 1,101,466 in the generic
  Autocomplete wrapper (2.9%). The Select extraction and dashboard counts did not improve.

The benchmark runner now rejects a non-baseline experiment if it changes no declarations.
Some earlier exploratory substitutions did not match declaration-emitter formatting; results with
an empty `changes` list are not evidence of an effective experiment.

Existing type-test baselines added in this continuation: system styled 18,013, system sx 24,569,
Select 74,025, and TextField 52,844 instantiations on TypeScript 7.0.2. The system index fixture
needs its styled-components dependency resolved before it can be measured. The initial alternate
styled-engine fixtures also lacked a generated engine declaration and are invalid; they must not
be used as performance evidence. A separate snapshot with 677 generated/copied declarations now
resolves that engine and its dependencies. Only the corrected sc baselines support finding 3.

- Replacing StyledComponentInstance globally with a shallow shape saved 80.4% in the styling
  chain, but lost two existing prop checks. Rejected.
- Adding information to the public StyledComponent alias changed bidirectional assignability.
  Rejected in favor of keeping that public alias unchanged.
- A first private-cache gate checked only whether the symbol was in keyof C. The old static-prop
  mapping can include symbol keys with never values, so this misclassified uncached components
  and rejected a valid attrs call. The retained gate checks the cached value, not key membership.

## Reproduction

From the repository root:

```powershell
node .typescript-profile/build-snapshot.cjs
node .typescript-profile/build-snapshot.cjs sc
node .typescript-profile/balanced.cjs styled-autocomplete-generics autocomplete-slot-split-reflection 7 5
node .typescript-profile/balanced.cjs sx-theme-relation sx-variance 7 5
node .typescript-profile/balanced.cjs sc-styled-chain sc-private-cache-value-gate-legacy 7 5
node .typescript-profile/balanced.cjs merge-slot-props merge-slots-component-constraint 7 5
node .typescript-profile/cli.cjs autocomplete-tests autocomplete-slot-split-reflection 7
node .typescript-profile/cli.cjs autocomplete-compatibility-assert autocomplete-slot-split-reflection 7
node .typescript-profile/cli.cjs slot-props-equivalence-assert autocomplete-slot-split-reflection 7
node .typescript-profile/cli.cjs sx-compatibility-assert sx-variance 7
node .typescript-profile/cli.cjs sc-engine-tests sc-private-cache-value-gate-legacy 7
node .typescript-profile/cli.cjs sc-style-compatibility sc-private-cache-value-gate-legacy 7
node .typescript-profile/summarize.cjs balanced-final
```

Use compiler argument `6` instead of `7` to run the installed JavaScript compiler. Scenario and
experiment names select the retained fixture and isolated substitution. These commands generate
local benchmark artifacts only; they do not build into package directories or edit production.
