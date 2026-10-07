# Material UI type-check profiling

Goal: find the three largest actionable type-check costs, with reproducible measurements.

- [x] Establish compiler versions and a clean baseline.
- [x] Profile common JSX, wrappers, styled components, and theme overrides.
- [x] Trace the largest measured costs to their source declarations.
- [x] Test one hypothesis at a time through in-memory compiler-host substitutions.
- [x] Reject experiments that remove checks or change accepted props.
- [x] Repeat retained measurements, including check time and memory.
- [x] Save runnable fixtures, results, and measured issue descriptions.
- [x] Find a third target with substantial consumer impact: repeated styled inheritance in the
  styled-components engine. Keep mergeSlotProps as a smaller finding.
- [x] Verify retained third measurements in five alternating runs and on both installed compilers.
- [x] Check existing engine tests, added inference/assignability assertions, and changed declarations.

Constraints: do not edit production declarations, commit, or push. Keep experiments local.
Synthetic stress results must be distinguished from representative consumer results.
