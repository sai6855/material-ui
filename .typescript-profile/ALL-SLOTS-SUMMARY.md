# Slot-reflection performance analysis

All 31 previously listed entries were profiled: 27 public components, internal SwitchBase,
inherited SwipeableDrawer, and the related CardHeader/ListItemText controls.

The same source pattern does not imply the same performance improvement. Autocomplete's fully
generic wrapper is the clearest individual target. A blanket migration of every matching slot
is not justified by these results.

The [complete results](./ALL-SLOTS-RESULTS.md) contain every component's instantiations, check
times, compiler memory, isolated-versus-shared comparisons, and verification results.

## Main results

The experiment preserves both compatible intrinsic-element and custom-component reflection
branches. It is not the simple `Partial<Props>` shortcut and does not force every slot to its
default component. These are compatibility-tested research results, not a merge-ready fix.

| Workload | Compiler | Before | After | Fewer instantiations |
| --- | --- | ---: | ---: | ---: |
| Fully generic Autocomplete wrapper | 7.0.2 | 1,105,402 | 725,475 | 379,927 (34.37%) |
| Fully generic Autocomplete wrapper | 6.0.3 | 1,101,943 | 764,069 | 337,874 (30.66%) |
| Combined wrappers, including generic Autocomplete | 7.0.2 | 1,301,627 | 884,590 | 417,037 (32.04%) |
| Combined explicit slot callbacks | 7.0.2 | 2,531,331 | 2,115,916 | 415,415 (16.41%) |
| Combined explicit slot callbacks, excluding Autocomplete | 7.0.2 | 1,834,848 | 1,575,178 | 259,670 (14.15%) |

The combined projects are synthetic consumers, not the Material UI repository's CI type-check
suite. Instantiation counts from separate compilations must not be added together.

For the fully generic Autocomplete wrapper, TS7 median check time fell from 3.122 seconds to
2.075 seconds (33.54%). Median compiler memory fell from 702,100 KB to 491,214 KB (30.04%).
There were three fresh processes per variant. These local timings are supporting evidence,
not a promise of the same improvement in another project.

## Smaller individual gains

These TS7 results use JSX with a callback on each candidate slot:
`(ownerState) => ({ className: 'probe' })`.

| Component | Before | After | Fewer instantiations |
| --- | ---: | ---: | ---: |
| TextField | 174,510 | 166,179 | 8,331 (4.77%) |
| Menu | 390,094 | 372,826 | 17,268 (4.43%) |
| Dialog | 367,779 | 361,949 | 5,830 (1.59%) |
| Drawer | 366,691 | 360,859 | 5,832 (1.59%) |
| Popover | 367,610 | 361,780 | 5,830 (1.59%) |
| SwipeableDrawer | 367,648 | 361,818 | 5,830 (1.59%) |

The ordinary props-extraction wrapper did not improve for these components. Their existing
type-test files sometimes show a different result again; those workloads are reported separately.

## Regressions and controls

- Autocomplete's ordinary `React.ComponentProps<typeof Autocomplete>` wrapper improved by
  5.11% on TS7, but used 6.30% more instantiations on TS6. Its fully generic wrapper improved
  on both compilers. These are different triggers.
- Explicit slot callbacks increased TS7 instantiations for Checkbox by 77.24%, Radio by 77.32%,
  Switch by 77.31%, and StepLabel by 116.45%. Many other individual cases also increased.
- The combined non-Autocomplete wrapper-only project increased from 300,889 to 314,909
  instantiations (4.66%). Its explicit-slot project improved by 14.15%. The surrounding consumer
  code matters, even when the component set is the same.
- CardHeader and ListItemText were unchanged. Their related Typography generic defaults do
  not use the wrapper targeted by this experiment and need a separate investigation.

Do not interpret increased instantiations as a measured timing regression in every case. Check
time and memory are separate measurements; small timing differences can be noise.

## Method and verification

- Source HEAD: `86cdecf91f9524e718f50f7a5d8b43caf0f158e9`.
- The baseline includes the current working-tree `clearIndicator: SlotProps<typeof IconButton, ...>`
  edit. This analysis does not approve or fix the custom-ref regression identified in that edit.
- Isolated declaration projects use strict checking, no emit, and real `tsc --extendedDiagnostics`.
  Consumer measurements use `skipLibCheck`; declaration validation disables it.
- Both common consumers were measured for all 31 entries on TS6.0.3 and TS7.0.2.
- TS7 baseline/shared comparisons have three fresh, alternating-process runs per common consumer.
  TS6 common consumers have one fresh run per variant. Generic Autocomplete has three on each compiler.
- Per-component scoped edits were also measured on TS7. Shared rollout changes all 64 current
  direct matches. Scope controls separately measure Autocomplete-only and the other 59 matches.
- Repeated instantiation counts were stable. Scope-control runs without Autocomplete have one
  fresh process per variant, so they are count evidence, not repeated timing evidence.
- All 31 reflected public props types passed bidirectional assignability checks on TS7.
- All 22 available component `.spec.tsx` files in this set compiled against baseline and shared
  declarations on TS7.
- Twenty generic helper-equivalence assertions, eight Autocomplete generic-relationship assertions,
  and an augmentation/custom-class-ref fixture passed on both compilers.
- Baseline and altered browser declarations passed checking on both compilers.
- The final audit found 89 latest verification checks, with no failures. Four initial harness
  failures are retained in the raw log and explained in the complete results.
- This does not prove every downstream augmentation or the minimum supported TypeScript version.
  No production declarations were changed by this investigation; the existing source diff was
  confirmed unchanged.

## Reproduction files

- [Runner](./all-slots.cjs): project generation, fixtures, experiment, diagnostics, verification,
  shared-workload controls, and report generation.
- [Manifest](./all-slots-cases/manifest.json): captured source diff, declaration hashes, and 64 matches.
- [Raw results](./all-slots-results.jsonl): 824 compiler runs with full diagnostics.
- [Generic Autocomplete consumer](./all-slots-cases/fixtures/Autocomplete-generic.tsx).
- [Explicit TextField slots](./all-slots-cases/fixtures/TextField-slot-props.tsx).
- [Explicit Checkbox slots](./all-slots-cases/fixtures/Checkbox-slot-props.tsx).

Run from the repository root. `prepare` captures the current checkout again; do not use it when
trying to preserve the already recorded baseline.

```powershell
node .typescript-profile/all-slots.cjs run 7 Autocomplete 3 generic
node .typescript-profile/all-slots.cjs run 7 TextField,Checkbox 3 slot-props paired
node .typescript-profile/all-slots.cjs run 6 TextField,Checkbox 1 slot-props paired
node .typescript-profile/all-slots.cjs report
```
