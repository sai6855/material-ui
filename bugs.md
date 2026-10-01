# Bugs

## TypeScript performance

The original measurements below use TypeScript 6.0.2 against the built Material UI declarations.
Newer entries identify measurements made with TypeScript 7.0.2. An instantiation is one application
of a generic type to type arguments. The numbers are totals for isolated minimal compilations, not
runtime measurements or the cost of a single source line.

### AvatarGroup surplus slot scans intrinsic elements

- Location: `packages/mui-material/src/AvatarGroup/AvatarGroup.d.ts:26`
- Trigger:

  ```tsx
  <AvatarGroup slotProps={{ surplus: {} }} />
  ```

- Finding: `React.ElementType<React.ComponentPropsWithRef<typeof Avatar>>` checks the Avatar props
  against the HTML/SVG intrinsic-element catalog even though the runtime default is already known
  to be `Avatar`.
- Measurement: 39,431 instantiations with the current declaration and 15,827 when the unnecessary
  catalog scan is removed (23,604 fewer, approximately 60%).
- Status: Open.

### styled() prop extraction expands system props

- Location: `packages/mui-system/src/createStyled/createStyled.ts:20`
- Trigger:

  ```tsx
  type Props = React.ComponentProps<typeof StyledComponent>;

  function Wrapper(props: Props) {
    return <StyledComponent {...props} />;
  }
  ```

- Finding: extracting the props is relatively cheap, but checking a spread of those props expands
  the injected `as` and `sx` types. The `sx` expansion includes the mapped CSS-property catalog.
- Measurement: prop extraction alone used 1,230 instantiations. Spreading the extracted props used
  7,568. In an isolated breakdown, the styled-engine baseline used 3,483, `as` added approximately
  1,350, and `sx` added approximately 2,622.
- Status: Deferred for later investigation.

### Snackbar rebuilds DOM props with a no-op Omit

- Location: `packages/mui-material/src/Snackbar/Snackbar.d.ts:88`
- Finding: the declaration removes `slots` and `slotProps` from
  `StandardProps<React.HTMLAttributes<HTMLDivElement>>`, but neither key exists in that type.
  TypeScript still rebuilds the complete DOM-props object through the mapped `Omit` type.
- Measurement: `<Snackbar open />` used 2,653 instantiations with the no-op mapping and 1,801
  without it (852 fewer, approximately 32%). `React.ComponentProps<typeof Snackbar>` decreased
  from 1,801 to 953 (approximately 47%).
- Status: PR raised.

### SpeedDial rebuilds DOM props with a no-op Omit

- Location: `packages/mui-material/src/SpeedDial/SpeedDial.d.ts:49`
- Finding: as in Snackbar, `slots` and `slotProps` are omitted from a base DOM-props type that does
  not contain either key. The mapped type therefore performs work without changing the result.
- Measurement: extracting `SpeedDialProps` used 1,731 instantiations with the mapping and 886
  without it (845 fewer, approximately 49%).
- Status: Open.

### Several components map inherited props twice

- Locations:
  - `packages/mui-material/src/Dialog/Dialog.d.ts:89`
  - `packages/mui-material/src/Popover/Popover.d.ts:103`
  - `packages/mui-material/src/Menu/Menu.d.ts:93`
  - `packages/mui-material/src/OutlinedInput/OutlinedInput.d.ts:29`
  - `packages/mui-material/src/SpeedDialAction/SpeedDialAction.d.ts:82`
- Finding: these declarations nest `Omit` around or inside `StandardProps`. `StandardProps` already
  performs a distributive omission, so inherited props are mapped once by `Omit` and again by
  `StandardProps`.
- Measurements for isolated named-props extraction:

  | Component       | Current | Single mapping | Difference |
  | --------------- | ------: | -------------: | ---------: |
  | Menu            |   4,766 |          3,831 |        935 |
  | Popover         |   2,876 |          1,965 |        911 |
  | Dialog          |   2,866 |          1,965 |        901 |
  | OutlinedInput   |   2,774 |          1,850 |        924 |
  | SpeedDialAction |   2,753 |          1,850 |        903 |

- Status: Open.

### Autocomplete generic prop extraction causes structural comparison explosion

- Location: `packages/mui-material/src/Autocomplete/Autocomplete.d.ts:417`
- Trigger:

  ```ts
  type Props = React.ComponentProps<typeof Autocomplete>;
  ```

- Finding: TypeScript attempts to infer one props type from Autocomplete's generic component
  signature and structurally relates the large `AutocompleteProps<Value, ...>` type. The boolean
  generic cross-product is not the primary cause: a test signature generic only in `Value` remained
  at approximately the same cost.
- Measurement: `React.ComponentProps<typeof Autocomplete>` used 265,253 instantiations. A concrete
  `AutocompleteProps<string, false, false, false>` used 1,355, while a minimal inferred JSX usage
  used 56,740.
- Status: Open; no type-safe minimal change has been confirmed.

### SelectChangeEvent distributes over every value-union member

- Location: `packages/mui-material/src/Select/SelectInput.d.ts:12`
- Trigger:

  ```ts
  type Value = 'apple' | 'orange' | 'banana';
  type Event = SelectChangeEvent<Value>;
  ```

- Finding: `Value extends ...` is a distributive conditional. TypeScript constructs each event
  branch separately for every member of `Value`, even though consumers usually observe the combined
  union through `event.target.value`. Each string or number member creates both a React change-event
  branch and a custom-event branch.
- Measurement: the isolated event type used 1,206 instantiations for one value member and 5,186 for
  200 members. The work grows linearly with the union size.
- Status: Open.

### DistributiveOmit maps types when no removal keys match

- Location: `packages/mui-types/src/index.ts:43`
- Exposure: 20 direct uses on this branch, including shared component and `StandardProps` type
  machinery.
- Finding: `DistributiveOmit<T, K>` reconstructs every property of every member of `T`, even when
  none of the keys in `K` exist in `T`. Common cases remove `classes`, `slots`, or `slotProps` from
  React intrinsic-element props that do not declare those properties.
- Measurement (TypeScript 7.0.2): applying the representative no-overlap case across the complete
  React intrinsic-element catalog used 143,028 instantiations. Avoiding the unnecessary mappings
  used 96,116, which is 46,912 fewer (approximately 32.8%). Equivalence checks passed for unions
  with no overlap, partial overlap, and full overlap.
- Status: Open.

### Styled engines remap the CSS fallback catalog

- Locations:
  - `packages/mui-styled-engine/src/index.ts:89`
  - `packages/mui-styled-engine-sc/src/index.ts:153`
- Exposure: the resulting CSS type is used throughout the `styled()` type surface in both styled
  engines.
- Finding: `CSS.PropertiesFallback` already maps every CSS property to include fallback arrays.
  `CSSPropertiesWithMultiValues` then maps the entire property catalog again to add array support,
  repeating work that is already represented by the input type.
- Measurement (TypeScript 7.0.2): materializing the current mapped CSS values used 81,161
  instantiations. The behavior-equivalent direct fallback type used 7,775, which is 73,386 fewer
  (approximately 90.4%). Bidirectional assignability passed.
- Status: Open.

### Component-backed slots scan the intrinsic-element catalog

- Example locations:
  - `packages/mui-material/src/Alert/Alert.d.ts:68`
  - `packages/mui-material/src/Alert/Alert.d.ts:89`
  - `packages/mui-material/src/Alert/Alert.d.ts:98`
- Exposure: `React.ElementType<Props>` appears 74 times across 34 Material UI declaration files on
  this branch.
- Finding: `React.ElementType<Props>` compares the supplied component props against every HTML and
  SVG intrinsic element to construct a compatible-element union. `SlotProps` then processes that
  union through `React.ComponentPropsWithRef`, even when the runtime default component is already
  known.
- Measurement (TypeScript 7.0.2): Alert's three component-backed slots used 50,744 instantiations
  with the catalog scans and 12,261 when represented by their known default components. This is
  38,483 fewer (approximately 75.8%). Compatibility checks confirmed that the intended Paper,
  IconButton, and SvgIcon slot props remain accepted.
- Status: Open.

### Empty OverridableStringUnion overrides run the complete transformation

- Location: `packages/mui-types/src/index.ts:54`
- Exposure: 79 uses across 41 component and system package files.
- Finding: most override interfaces are empty, but the default `OverridableStringUnion<T>` path
  still creates a record, applies `Overwrite` and `DistributiveOmit`, maps all resulting keys, and
  extracts the string keys. The result of this work is the original literal union `T`.
- Measurement (TypeScript 7.0.2): 20 representative literal unions used 3,477 instantiations with
  the current transformation and 1,917 with an empty-override path, which is 1,560 fewer
  (approximately 44.9%). Type-equivalence checks passed for default, augmented, and optional
  override records.
- Status: Open.

### Slot utilities eagerly flatten wide prop intersections

- Locations:
  - `packages/mui-utils/src/mergeSlotProps/mergeSlotProps.ts:51`
  - `packages/mui-utils/src/appendOwnerState/appendOwnerState.ts:17`
- Exposure: `mergeSlotProps` and `appendOwnerState` have 39 call sites across the inspected
  component, system, and utility packages.
- Finding: their return types apply `Simplify` to intersections containing the slot's props.
  `Simplify` eagerly reconstructs every property, so using an intrinsic slot can map hundreds of
  React DOM properties solely to flatten the displayed type.
- Measurement (TypeScript 7.0.2): ten representative intrinsic-slot results used 22,811
  instantiations with eager flattening and 9,324 as equivalent intersections. This is 13,487 fewer
  (approximately 59.1%). Bidirectional assignability passed.
- Status: Open.
