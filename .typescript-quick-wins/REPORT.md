# TypeScript performance findings: four packages

Scope: `@mui/material`, `@mui/types`, `@mui/system`, and `@mui/utils`. Findings only; no replacement declarations or production changes are retained.

## Coverage

The static scan parsed every tracked code file in these packages, including implementation files, declaration files, tests, and configuration. Focused measurements cover selected public type consumers, not every possible application.

| Package | Tracked files | Code files scanned |
| --- | ---: | ---: |
| @mui/material | 1,243 | 1,211 |
| @mui/types | 8 | 4 |
| @mui/system | 165 | 161 |
| @mui/utils | 174 | 170 |
| Total | 1,590 | 1,546 |

`package-audit/inventory.json` and `package-audit/file-coverage.jsonl` record the final package-wide scan at commit `741d96fb78`, with zero parser errors. The initial scan covered 1,549 code files before three files were removed by the user's checkout cleanup. Component and shared audits contain additional per-file inventories.

## Strongest new finding

Twelve components declare their public JSX component type using a ButtonBase extension over a type map that already inherits ButtonBase. This repeats mapped-type work during overload resolution.

| Published-declaration consumer | Compiler | Baseline instantiations | Experimental count | Reduction |
| --- | --- | ---: | ---: | ---: |
| Button: default, href, and custom component | TS7 7.0.2 | 16,207 | 13,516 | 2,691 (16.6%) |
| All twelve components together | TS7 7.0.2 | 45,862 | 39,123 | 6,739 (14.7%) |
| All twelve components together | TS6 6.0.3 | 45,891 | 39,152 | 6,739 (14.7%) |

Native TS7 counters repeated identically across two fresh runs per variant, with no consumer diagnostics. An independent TS6 compiler-host experiment reproduced the combined reduction: 45,855 to 39,117, with no consumer diagnostics. Its React-only ambient configuration and independently formed equivalent overload account for the small absolute counter differences.

Locations are the public component declarations in:

- `src/AccordionSummary/AccordionSummary.d.ts:103`
- `src/BottomNavigationAction/BottomNavigationAction.d.ts:104`
- `src/Button/Button.d.ts:146`
- `src/CardActionArea/CardActionArea.d.ts:79`
- `src/Fab/Fab.d.ts:91`
- `src/IconButton/IconButton.d.ts:100`
- `src/ListItemButton/ListItemButton.d.ts:86`
- `src/MenuItem/MenuItem.d.ts:71`
- `src/StepButton/StepButton.d.ts:52`
- `src/Tab/Tab.d.ts:76`
- `src/TableSortLabel/TableSortLabel.d.ts:109`
- `src/ToggleButton/ToggleButton.d.ts:105`

All paths above are relative to `packages/mui-material`. Each separate TS6 family fixture saved 2,691 instantiations. Those separate savings must not be added together: the combined fixture measures shared work only once.

Per-component counters, compatibility checks, and limitations are included below.

## Smaller candidates

| Location / trigger | Compiler | Baseline | Experimental count | Reduction |
| --- | --- | ---: | ---: | ---: |
| Badge owner-state mapping: wrapper and slot callbacks | TS6 | 12,462 | 12,127 | 335 (2.7%) |
| System style helper types: direct style composition | TS6 | 245 | 191 | 54 (22.0%) |
| OverridableStringUnion: Button consumer | TS7 | 16,319 | 16,287 | 32 (0.20%) |
| Material optional theme-variable mapping: theme callbacks | TS6 | 3,197 | 3,176 | 21 (0.66%) |

These are smaller cleanup opportunities. Badge's isolated existing spec saves only six instantiations, so its callback-fixture percentage does not generalize to all Badge usage. The style-helper percentage concerns a very small direct consumer; system JSX layout and sx consumers had no saving from that experiment.

The OverridableStringUnion observation concerns redundant distribution on a known record input, preserving the public distributive helper. More aggressive union algorithms failed compatibility checks and were rejected.

Shared helper and theme locations, validation, and rejected alternatives are included below. The shared audit found no additional worthwhile compatible quick win in `@mui/utils`.

## Limits

Counts are compiler instantiations, not bundle sizes or application build-time percentages. Performance fixtures enable `skipLibCheck`; compatibility checks and targeted declaration validation use stricter settings separately. No full repository type-check or downstream application benchmark was run.

Previously reported omission cleanups, mergeSlotProps, and sx theme relationships are not new findings in this audit. Their measurements and validation notes are included later in this report. Temporary experimental declaration copies were removed; retained fixtures use the original public API.

## Material component details

The strongest new finding is repeated ButtonBase inheritance expansion in twelve public component declarations. Each component TypeMap already includes ButtonBase inheritance; its public component type expands the inheritance helper again. Ordinary default-root, href, and custom-component JSX exercise this extra mapping.

| Component declaration | TypeMap inheritance line | TS 6.0.3 baseline | In-memory probe | Fewer instantiations |
| --- | ---: | ---: | ---: | ---: |
| packages/mui-material/src/Button/Button.d.ts:146 | 109 | 16,234 | 13,543 | 2,691 |
| packages/mui-material/src/AccordionSummary/AccordionSummary.d.ts:103 | 82 | 16,210 | 13,519 | 2,691 |
| packages/mui-material/src/BottomNavigationAction/BottomNavigationAction.d.ts:104 | 88 | 16,261 | 13,570 | 2,691 |
| packages/mui-material/src/CardActionArea/CardActionArea.d.ts:79 | 63 | 16,246 | 13,555 | 2,691 |
| packages/mui-material/src/Fab/Fab.d.ts:91 | 75 | 16,233 | 13,542 | 2,691 |
| packages/mui-material/src/ListItemButton/ListItemButton.d.ts:86 | 69 | 16,189 | 13,498 | 2,691 |
| packages/mui-material/src/IconButton/IconButton.d.ts:100 | 81 | 16,239 | 13,548 | 2,691 |
| packages/mui-material/src/MenuItem/MenuItem.d.ts:71 | 55 | 16,215 | 13,524 | 2,691 |
| packages/mui-material/src/Tab/Tab.d.ts:76 | 60 | 16,191 | 13,500 | 2,691 |
| packages/mui-material/src/ToggleButton/ToggleButton.d.ts:105 | 89 | 16,216 | 13,525 | 2,691 |
| packages/mui-material/src/TableSortLabel/TableSortLabel.d.ts:109 | 92 | 16,213 | 13,522 | 2,691 |
| packages/mui-material/src/StepButton/StepButton.d.ts:52 | 34 | 16,243 | 13,552 | 2,691 |

The shared helper locations are packages/mui-material/src/ButtonBase/ButtonBase.d.ts:114 and :120. ButtonBase itself is not one of the twelve findings because its TypeMap has not already expanded the inheritance helper.

The combined consumer fixture measures the total effect together, including shared compiler work: TypeScript 6.0.3 uses 45,891 versus 39,152 instantiations, a reduction of 6,739 (14.7%). TypeScript 7.0.2 uses 45,862 versus 39,123, also 6,739 fewer (14.7%). Two fresh native compiler processes per variant produce identical counters and zero errors. The independent Button consumer uses 16,207 versus 13,516 on TypeScript 7.0.2, 2,691 fewer (16.6%). Independent component savings must not be summed.

Measurements use strict consumer checking, skipLibCheck, React and Node ambient types, and the existing emitted dependency declaration snapshot with current Material .d.ts files overlaid. These are consumer measurements, not repository-wide build improvements. Small native timings vary; deterministic instantiation counts are the primary evidence.

Compatibility fixtures check both assignment directions between original and probed overloaded component types for all twelve components, custom component required props, custom refs, href handler inference, default-root handler context, and expected rejections. Checks include declaration semantic diagnostics with skipLibCheck disabled and exactOptionalPropertyTypes enabled and disabled. Final results are recorded in package-audit/components/family-validation.jsonl.

The complete existing Button spec could not be validated because the installed react-router declaration file is unreadable in this sandbox (EPERM, reported by TypeScript as TS2307). This environment failure occurs on both baselines and probes and is excluded from speed and passing-test claims. The dedicated compatibility fixtures do not use a shim for this dependency.

A weaker additional signal is packages/mui-material/src/Badge/Badge.d.ts:43: BadgeOwnerState applies a mapped Simplify expansion over its inherited owner-state shape. A generic Badge wrapper with owner-state slot callbacks uses 12,462 versus 12,127 instantiations (335 fewer; 2.7%) on TypeScript 6.0.3. The existing Badge spec with its declaration checked saves only 6 instantiations (15,299 versus 15,293), also 6 with exactOptionalPropertyTypes enabled. Both variants pass bidirectional owner-state compatibility, slot augmentation and required-prop checks. Its gain is narrow; it is lower priority than the twelve-component finding.

Coverage: every current tracked TypeScript/TSX file in packages/mui-material was read and parsed: 753 files, including 282 .d.ts files, with zero parser errors. package-audit/components/coverage.json records path, byte count, source hash, classification and type-shape metrics for every file. Theme findings appear below. Already investigated nested Omit, Link, mergeSlotProps, broad slot reflection, and failed Partial removals were excluded as new findings.

All library experiments ran in compiler-host memory, except native measurements which staged temporary declarations and removed them in finally blocks. No production files were edited and no modified declarations, replacement snippets, experiment code, or native temporary directories remain. Retained TSX fixtures are baseline consumers and compatibility assertions.

## System, types, and utils details

Findings only. No proposed replacement declarations or implementation scripts are retained.
All tracked source/type/config/test files were read and parsed: 335 files total.
mui-system: 161 total, 158 under src, 113 production src, 45 src tests/specs.
mui-types: 4 total, 3 under src, 2 production src, 1 src spec.
mui-utils: 170 total, 168 under src, 126 production src, 42 src tests/specs.
package-audit/shared/coverage.json records each file, source hash, and syntax-feature counts. Files with mapped,
conditional, omission, intersection, or generic signatures were inspected for candidate relevance.

### Shared string-union helper setup
Location: packages/mui-types/src/index.ts:54-56.
This helper combines several generic mapping helpers before selecting enabled string keys.
A small local experiment reduced setup work while retaining the tested concrete results.
This is a code-quality-scale candidate, with no demonstrated substantial application speedup.

TS6.0.3 Button consumer: 16,330 -> 16,298 instantiations, 32 fewer (0.20%).
TS7.0.2 Button consumer: 16,319 -> 16,287, 32 fewer (0.20%).
TS6.0.3 Grid/Stack/Container JSX consumer: 14,265 -> 14,245, 20 fewer (0.14%).
TS7.0.2 Grid/Stack/Container JSX consumer: 14,253 -> 14,233, 20 fewer (0.14%).
TS7 counters repeated identically in two fresh CLI processes per variant and consumer.
All four consumers had zero diagnostics. The sx and style-composition controls were unchanged.

76 concrete exact-type assertions covered four default-key inputs (literal union, never,
string, any) and 19 override forms (empty, unknown, any, never, null, undefined, void,
primitive types, enabled/disabled/optional/readonly keys, string/template indexes, unions).
These passed on TS6 and TS7. The existing mui-types index.spec.ts passed on TS7.
The TS7 combined concrete assertions and existing spec used 7,164 -> 6,878 instantiations.
Button color augmentation, disabled-default rejection and button refs passed on TS7:
16,165 -> 16,145 instantiations. Declaration checking with skipLibCheck disabled and
React ambient types only passed on TS7: 132,300 -> 132,291 (validation, not consumer cost).
A separate unresolved-generic comparison between independently copied helpers was rejected
by the compiler for both the unchanged baseline and the experiment; it is not passing evidence
or evidence of a new regression. These concrete tests do not prove every abstract generic relation.

### Simple system-style prop mappings
Locations: packages/mui-system/src/style/style.ts:11-14 and
packages/mui-system/src/styleFunctionSx/defaultSxConfig.ts:8.
The system helpers use nested mappings to describe optional props for a known key set.
A normal compose(spacing, borders, palette, typography) consumer used 245 -> 191
instantiations on both TS6.0.3 and TS7.0.2: 54 fewer (22.04%). Absolute cost is small.
Button, Grid/Stack/Container JSX and ordinary sx controls were unchanged.
Eight exact-property assertions (literal, union, string, number, symbol, any, never,
template-string keys), generic bidirectional assignment, custom-style key inference,
and style-composition calls passed on TS7: 946 -> 872 instantiations (validation only).
Fresh declarations were generated from current source in memory for TS6 and in a temporary
workspace for TS7, with zero emit diagnostics. Native temporary declarations were removed.

### Rejected and deprioritized work
Alternative string-union algorithms changed concrete results for any, nullable or union overrides.
An empty-override guarded experiment passed the 76 concrete TS6 assertions but increased the
compatibility fixture from 6,656 to 6,766; its unguarded form failed union overrides.
The aggressive string-union algorithm measured Button 16,330 -> 16,045 and the system JSX
consumer 14,265 -> 14,136, but is rejected because it changed type semantics.
A typed ownerState property experiment was rejected because the original nested mapping
preserves readonly modifiers; ordinary property declarations would lose that behavior.
No-overlap DistributiveOmit, default-root overload tuning, broad slot reflection, and theme
variance were not repeated: prior research already measures their limitations or known findings.
The existing larger styled-engine-sc research is outside this narrowed package scope.
No independently justified large new hotspot was retained in these three packages.

### Method and limits
Strict consumers, no emit, skipLibCheck for consumer benchmarks. TS6 compiler API measurements
used 243 freshly emitted/copied declarations from current source. TS7 native CLI consumer
measurements used current string-helper declarations with the existing consumer snapshot;
the system-style native measurements used 243 fresh current declarations in a temporary tree.
Results are isolated consumer counts, not repository-wide CI improvements. Counts from separate
projects must not be added. Timings were not promoted as evidence for these tiny changes.
package-audit/shared/measurements.json, package-audit/shared/native-measurements.json and package-audit/shared/validation.json contain diagnostic results.
Only baseline consumers, findings, measurements and the coverage inventory are retained.

## Material theme details

Findings and counters only; no replacement declarations are retained.

### Small cleanup candidate

`packages/mui-material/src/styles/createThemeNoVars.d.ts:102`: the non-CSS-variable branch of `CssVarsProperties` creates two mapped types for one optional property.

| TS 6.0.3 workload | Baseline instantiations | Experimental count | Reduction |
| --- | ---: | ---: | ---: |
| Theme with two component override callbacks | 3,197 | 3,176 | 21 (0.66%) |
| CSS-variable theme and a valid CSS-variable key | 10,589 | 10,577 | 12 (0.11%) |

This is a readability cleanup with a small compiler benefit. Bidirectional compatibility checks and complete declaration validation passed with the normal optional-property configuration. With `exactOptionalPropertyTypes`, the baseline and experiment both report the same unrelated existing Collapse/Fade declaration errors; the compatibility fixture has no new errors. Retain optional-property semantics when investigating this candidate.

No native TS7 measurement or full repository type check was run for this small candidate. Counts above concern isolated published-declaration consumers.

### Deprioritized observations

- `styles/overrides.ts:136`: a repeated record intersection produces no saving in the component override callback fixture.
- `styles/createThemeFoundation.ts:237`: the mapped wrapper around a primitive produces only three fewer instantiations in the CSS-variable consumer and no saving in the ordinary theme fixture.
- Recursive CSS-variable name normalization was already investigated in the existing research; it is not a new finding here.

The `package-audit/themes/measurements.jsonl` file contains valid exploratory consumer measurements. `package-audit/themes/verified.jsonl` contains corrected optional-property experiments and declaration validation. The fixtures are original API consumers and assertions against the original declarations.

## Earlier measured candidates

Candidate locations, measured costs, and compatibility findings only. No patches or proposed replacement declarations are included. No production files were changed by this investigation.

The current checkout was clean at the start of this batch, at commit 3453eac983. The measurements incorporate the current source declarations, including the previously completed omission cleanups.

### Candidates

| Location | Workload | TS7 baseline | Experimental count | Reduction | TS6 baseline | Experimental count |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| packages/mui-material/src/utils/mergeSlotProps.ts:6 | Minimal call | 6,181 | 713 | 88.5% | 6,193 | 725 |
| Same helper | Tooltip wrapper | 123,671 | 119,577 | 3.3% | 123,466 | 119,372 |
| packages/mui-system/src/styleFunctionSx/styleFunctionSx.ts:28,35,44,62 | Comparing different theme instantiations | 46,084 | 2,967 | 93.6% | 46,084 | 2,967 |
| Same sx declarations | Wrapper using one theme | 14,620 | 14,620 | 0% | 14,632 | 14,632 |
| packages/mui-material/src/Link/Link.d.ts:9 | Minimal JSX | 11,949 | 11,924 | 0.21% | 11,961 | 11,936 |

These are compiler instantiation counts, not whole-application build-time improvements. Different consumers compile separately; their counts must not be added together.

#### mergeSlotProps

The generic constraint causes setup work involving the entire intrinsic-element catalog. This is the clearest small helper candidate. The standalone percentage is large because the starting consumer is tiny. The realistic Tooltip wrapper saves about 4,100 instantiations, with no clear timing improvement in these runs.

The existing helper type tests include an exact default return-type assertion, typed callbacks, contextual inference, and Tooltip/Dialog usage. Those checks passed for the measured experiment.

#### Theme-dependent sx declarations

Comparing System-theme and Material-theme sx types expands the mapped CSS catalog. This candidate concerns the relationship between different theme instantiations. The same-theme control has no instantiation reduction.

Eight assertions checked the direction of assignability for sx values, SystemStyleObject, pseudo selectors, and nested selectors. Both safe assignments and rejected reverse assignments retained their outcomes. Existing styleFunctionSx type tests also passed.

This is a small declaration change to investigate, but the public generic relationships warrant more care than the Link cleanup.

#### Link

LinkOwnProps performs an omission of a key that its LinkBaseProps input has already excluded. This matches the redundant-omission pattern in PR #49214.

The measured saving is only 25 instantiations. Treat this as a readability cleanup with a small compiler benefit. Existing Link type tests and bidirectional compatibility checks passed. Compatibility also held when the upstream Typography props interface gained a required property through module augmentation.

### Excluded candidates

Several types look as though their Partial wrappers are redundant in the unaugmented checkout. They are not reliable compatibility-preserving quick wins.

| Location | Initial observation | Reason excluded |
| --- | --- | --- |
| Autocomplete/Autocomplete.d.ts:197,241,265 | 43,960 to 41,090 instantiations in an explicit-slot TS6 fixture | Required IconButton augmentation changed assignability in both directions |
| Backdrop/Backdrop.d.ts:48 | Only 22 fewer instantiations | Required Fade augmentation changed assignability |
| SpeedDial/SpeedDial.d.ts:78 | Only 21 fewer instantiations | Required Fab augmentation changed assignability |
| TablePaginationActions/TablePaginationActions.d.ts:33-40 | Only 33 fewer instantiations | Required IconButton augmentation changed assignability |
| ButtonBase/ButtonBase.d.ts:88 | Only 12 fewer instantiations | Too small to prioritize; broader compatibility was not investigated |
| transitions/types.ts:90 | Only 15 fewer instantiations | Too small to prioritize; broader compatibility was not investigated |
| Select/Select.d.ts:157,168 | Some excluded keys are absent today | No measured instantiation reduction |

The initial observations use TS6 compiler-API consumer measurements with Node ambient types. The retained CLI measurements use React ambient types and are separate counters.

### Evidence and limits

- Compiler versions: TypeScript 6.0.3 and 7.0.2.
- TS7 consumer counts repeated identically across three fresh CLI processes per variant.
- TS6 consumer measurements used one fresh CLI process per variant.
- All retained baseline and experimental validation runs passed on both compilers with skipLibCheck disabled.
- Consumer performance measurements enable skipLibCheck.
- No full repository type-check, minimum-supported-compiler matrix, or downstream application benchmark was run.
- Temporary modified declaration copies were removed after measurement. Only counters and baseline consumer/type-test fixtures remain.
- round2/verified.jsonl contains the retained CLI runs; round2/measurements.jsonl contains the exploratory compiler-API measurements and augmentation checks.

### Baseline fixtures

The round2/fixtures directory contains original API consumers and type-test fixtures for independent investigation. It contains no proposed declaration changes.

## Historical omission baselines

The five omission cleanups below were subsequently implemented. These measurements record the earlier baseline.

Candidate locations and baseline measurements only. No production declarations were changed by this investigation.

Reference: https://github.com/mui/material-ui/pull/49214

| Component | Source location | TS7 baseline instantiations | TS6 baseline instantiations |
| --- | --- | ---: | ---: |
| Dialog | packages/mui-material/src/Dialog/Dialog.d.ts:89 | 3,778 | 3,817 |
| Menu | packages/mui-material/src/Menu/Menu.d.ts:93 | 5,680 | 5,710 |
| SpeedDialAction | packages/mui-material/src/SpeedDialAction/SpeedDialAction.d.ts:82 | 3,704 | 3,744 |
| OutlinedInput | packages/mui-material/src/OutlinedInput/OutlinedInput.d.ts:29 | 3,546 | 3,558 |
| Popover | packages/mui-material/src/Popover/Popover.d.ts:103 | 3,782 | 3,818 |
| All five in one consumer | Combined minimal JSX fixture | 13,113 | 13,196 |

These declarations contain nested omission operations worth investigating. Each individual baseline uses a separate minimal JSX consumer with strict checking and skipLibCheck. TypeScript versions were 7.0.2 and 6.0.3. TS7 baseline counts repeated identically across three fresh CLI processes.

These counters describe compiler instantiations in small fixtures, not application build-time costs. Menu inherits from Popover, so measurements across components are not independent.

Existing type specs are available for Dialog, Menu, OutlinedInput, and Popover. SpeedDialAction has no component-specific .spec.tsx in this checkout.

Baseline-only raw measurements remain in results.jsonl and cli-results.jsonl. The audit script remains available:

```powershell
node .typescript-quick-wins/audit.cjs
```
