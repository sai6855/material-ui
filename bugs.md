# Bugs

## TypeScript performance

The measurements below use TypeScript 6.0.2 against the built Material UI declarations. An
instantiation is one application of a generic type to type arguments. The numbers are totals for
isolated minimal compilations, not runtime measurements or the cost of a single source line.

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

  | Component | Current | Single mapping | Difference |
  | --- | ---: | ---: | ---: |
  | Menu | 4,766 | 3,831 | 935 |
  | Popover | 2,876 | 1,965 | 911 |
  | Dialog | 2,866 | 1,965 | 901 |
  | OutlinedInput | 2,774 | 1,850 | 924 |
  | SpeedDialAction | 2,753 | 1,850 | 903 |

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
