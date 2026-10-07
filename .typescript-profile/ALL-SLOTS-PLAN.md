# Slot reflection profiling plan

Goal: measure every previously identified slot-reflection candidate without changing library files.

Scope: 27 public components, internal SwitchBase, inherited SwipeableDrawer, and the related
CardHeader/ListItemText controls. The baseline includes the user's current Autocomplete edit.
This is diagnostic research, not implementation of a production fix.

- [x] Prepare isolated declarations from the existing fresh source snapshot. Overlay current
      handwritten declarations, record their hashes, and fail if the identified pattern count changes.
- [x] For each component, check one consistent consumer: React.ComponentProps extraction followed
      by a JSX wrapper. Run baseline, component-local, and shared-rollout variants with real tsc.
- [x] Keep Autocomplete's fully generic wrapper as a separate trigger; do not mix its result into
      the common consumer table. Controls without direct matches receive no component-local edit.
- [x] Check helper compatibility, the affected component type tests, and changed declarations.
      Separate diagnostic failures from valid performance measurements.
- [x] Repeat important results in fresh, alternating processes. Record instantiations, check time,
      compiler memory, compiler versions, exact fixtures, and raw diagnostics.
- [x] Write a ranked report with every measured component and with regressions included. Do not
      claim a whole-repository speedup or a merge-ready fix. Confirm tracked files were not changed.

Artifacts: all-slots.cjs (generator and runner), all-slots-results.jsonl (raw diagnostics),
all-slots-cases/ (generated consumer projects), ALL-SLOTS-RESULTS.md (report).

Commands: node .typescript-profile/all-slots.cjs prepare;
node .typescript-profile/all-slots.cjs run 7;
node .typescript-profile/all-slots.cjs run 6;
node .typescript-profile/all-slots.cjs verify 7;
node .typescript-profile/all-slots.cjs report.

Review risks: class refs, compatible intrinsic tags, owner-state callbacks, slot override
augmentation, optional props/data attributes, generic component relationships, and timing noise.

Additional completed controls: explicit callbacks on each candidate slot, combined consumer
projects, Autocomplete-only/other-only rollout comparisons, and consumers excluding Autocomplete.
Findings and scope limits are in ALL-SLOTS-SUMMARY.md; every measured component is in ALL-SLOTS-RESULTS.md.
