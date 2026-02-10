# Bundle Size Audit Findings

## Executive Summary

This document catalogs every bundle size optimization opportunity found across `packages/mui-material` and `packages/mui-system`. **No code changes are proposed here** — only findings with exact file paths, line numbers, current code, suggested fixes, and estimated byte savings.

| Metric | Estimated Savings |
|--------|-------------------|
| **@mui/system** (minified) | ~4,100–5,200 bytes |
| **@mui/material** (minified) | ~2,000–3,000 bytes |
| **Combined** (minified) | ~6,100–8,200 bytes |
| **Combined** (gzipped) | ~1,800–2,800 bytes |
| **Total findings** | 45+ |
| **Cross-cutting patterns** | 7 |

---

## 1. Cross-Cutting Patterns (Highest Impact)

These patterns recur across many files and represent the largest aggregate savings.

### 1.1 `createSimplePaletteValueFilter()` repeated across 24+ components

**Impact: ~300–500 bytes aggregate (minified)**

The pattern `Object.entries(theme.palette).filter(createSimplePaletteValueFilter()).map(...)` appears **41+ times** across 24 component files. Each call creates a new filter function and iterates the entire palette.

**Files affected** (with call counts):
| File | Calls |
|------|-------|
| `Alert.js` | 3 (lines 62, 80, 96) |
| `Button.js` | 1 (line 171) |
| `ButtonGroup.js` | 2 (lines 174, 236) |
| `Badge.js` | 1 (line 94) |
| `Chip.js` | 4 (lines 166, 210, 245, 290) |
| `Slider.js` | 3 (lines 65, 207, 309) |
| `IconButton.js` | 2 (lines 113, 121) |
| `LinearProgress.js` | 5 (lines 149, 209, 262, 330, 360) |
| `Radio.js` | 2 (lines 66, 79) |
| `Checkbox.js` | 2 (lines 70, 83) |
| `Switch.js` | 1 (line 155) |
| `CircularProgress.js` | 1 (line 106) |
| `FilledInput.js` | 1 (line 144) |
| `Input.js` | 1 (line 121) |
| `OutlinedInput.js` | 1 (line 68) |
| `FormLabel.js` | 1 (line 53) |
| `Fab.js` | 1 (line 140) |
| `Icon.js` | 1 (line 108) |
| `Link.js` | 1 (line 107) |
| `PaginationItem.js` | 2 (lines 216, 240) |
| `Typography.js` | 1 (line 81) |
| `ToggleButton.js` | 1 (line 93) |
| `AppBar.js` | 1 (line 121) |

**Current code** (example from `Badge.js:92–101`):
```js
variants: [
  ...Object.entries(theme.palette)
    .filter(createSimplePaletteValueFilter(['contrastText']))
    .map(([color]) => ({
      props: { color },
      style: {
        backgroundColor: (theme.vars || theme).palette[color].main,
        color: (theme.vars || theme).palette[color].contrastText,
      },
    })),
```

**Suggested fix**: Extract a shared helper that caches the palette iteration result:
```js
// shared utility
function generatePaletteVariants(theme, additionalKeys, mapFn) {
  return Object.entries(theme.palette)
    .filter(createSimplePaletteValueFilter(additionalKeys))
    .map(([color]) => mapFn(color));
}
```

This avoids re-importing and re-calling `createSimplePaletteValueFilter` in every component, and the repetitive `.filter().map()` boilerplate saves ~10–15 bytes per call site.

---

### 1.2 Redundant `...props` spread in `ownerState` (107+ components)

**Impact: ~200–400 bytes aggregate (minified)**

The pattern `const ownerState = { ...props, <localVar> }` appears in **107+ component files**. The entire `props` object is spread into `ownerState`, which often duplicates values that are then overwritten on the same line.

**Example** (`AccordionSummary.js:132–137`):
```js
const ownerState = {
  ...props,
  expanded,
  disabled,
  disableGutters,
};
```

**Suggested fix**: Only include the properties actually used by `useUtilityClasses` and style functions:
```js
const ownerState = { expanded, disabled, disableGutters, className };
```

---

### 1.3 `capitalize()` called multiple times with same value (20+ files)

**Impact: ~80–120 bytes aggregate**

Components like `Snackbar.js` call `capitalize()` on the same string multiple times within a single render:

**Example** (`Snackbar.js:22`):
```js
`anchorOrigin${capitalize(anchorOrigin.vertical)}${capitalize(anchorOrigin.horizontal)}`,
```

When the same `anchorOrigin` values are used in style resolution and class generation, the calls are duplicated.

**Suggested fix**: Cache the result: `const capVertical = capitalize(anchorOrigin.vertical);`

---

### 1.4 `defaultSxConfig.js` massive repetition (800–1,000 bytes)

**Impact: ~800–1,000 bytes (minified)**

**File**: `packages/mui-system/src/styleFunctionSx/defaultSxConfig.js`

**Lines 84–204**: 21 padding keys and 21 margin keys each have an identical `{ style: padding }` or `{ style: margin }` object literal, creating 42 separate object allocations.

**Current code** (lines 84–143):
```js
p: { style: padding },
pt: { style: padding },
pr: { style: padding },
pb: { style: padding },
pl: { style: padding },
px: { style: padding },
py: { style: padding },
padding: { style: padding },
paddingTop: { style: padding },
// ... 12 more padding keys
```

**Lines 215–253**: 30+ empty `{}` config entries for display, flexbox, grid, and position properties.

```js
display: {},
overflow: {},
textOverflow: {},
// ... 27 more empty objects
```

**Suggested fix**: Generate programmatically:
```js
const paddingConfig = { style: padding };
const marginConfig = { style: margin };
const paddingEntries = Object.fromEntries(
  ['p','pt','pr','pb','pl','px','py','padding','paddingTop','paddingRight',
   'paddingBottom','paddingLeft','paddingX','paddingY','paddingInline',
   'paddingInlineStart','paddingInlineEnd','paddingBlock','paddingBlockStart',
   'paddingBlockEnd'].map(k => [k, paddingConfig])
);
// same for margin
const emptyConfig = {};
const emptyEntries = Object.fromEntries(
  ['display','overflow','textOverflow','visibility','whiteSpace',
   'flexBasis','flexDirection',...].map(k => [k, emptyConfig])
);
```

**Savings**: Eliminates 42 redundant object literals and 30 empty `{}` objects. ~800–1,000 bytes minified.

---

### 1.5 Verbose error messages (1,000–1,500 bytes)

**Impact: ~1,000–1,500 bytes (minified, in dev bundles)**

Multiple files contain long error message strings that are not tree-shaken even in production builds (depending on bundler configuration).

**Files affected**:
- `spacing.js:135–148` — long validation message with `.join('\n')`
- `cssContainerQueries.ts:60–63` — multi-line template literal error
- `colorManipulator.js:80–81` — range validation error

**Suggested fix**: Use error codes with URL references:
```js
// Before:
throw new Error(`MUI: The value provided ${value} is out of range [${min}, ${max}].`)
// After:
throw new Error(`MUI: Error #12. See https://mui.com/errors#12`)
```

---

### 1.6 Duplicate `overridesResolver` and `useUtilityClasses` patterns

**Impact: ~100–200 bytes aggregate**

Many components (e.g., `Divider.js`) duplicate the same conditional checks in both `useUtilityClasses` and `overridesResolver`.

**Example** (`Divider.js:11–56`):
```js
// useUtilityClasses (lines 21-27):
orientation === 'vertical' && 'vertical',
children && 'withChildren',
children && orientation === 'vertical' && 'withChildrenVertical',

// overridesResolver (lines 45-54):
ownerState.orientation === 'vertical' && styles.vertical,
ownerState.children && styles.withChildren,
ownerState.children && ownerState.orientation === 'vertical' && styles.withChildrenVertical,
```

**Suggested fix**: These could share a computed key array to avoid restating conditions.

---

### 1.7 Template literals with single variable

**Impact: ~30–50 bytes aggregate**

Pattern `` `${orientation}` `` is equivalent to `orientation` when the variable is already a string.

**Example** (`Collapse.js:22–26`):
```js
const slots = {
  root: ['root', `${orientation}`],
  entered: ['entered'],
  hidden: ['hidden'],
  wrapper: ['wrapper', `${orientation}`],
  wrapperInner: ['wrapperInner', `${orientation}`],
};
```

**Suggested fix**: Use `orientation` directly instead of `` `${orientation}` ``.

---

## 2. @mui/system Findings

### 2.1 `defaultSxConfig.js` — Programmatic generation

*See Cross-Cutting Pattern 1.4 above.*

**File**: `packages/mui-system/src/styleFunctionSx/defaultSxConfig.js`
**Lines**: 7–318
**Estimated savings**: 800–1,000 bytes

---

### 2.2 `spacing.js` — Duplicate key arrays

**File**: `packages/mui-system/src/spacing/spacing.js`
**Lines**: 47–93

**Current code**:
```js
// Lines 47-68: 22 margin key strings
export const marginKeys = ['m','mt','mr','mb','ml','mx','my','margin','marginTop',
  'marginRight','marginBottom','marginLeft','marginX','marginY','marginInline',
  'marginInlineStart','marginInlineEnd','marginBlock','marginBlockStart','marginBlockEnd'];

// Lines 70-91: 21 padding key strings
export const paddingKeys = ['p','pt','pr','pb','pl','px','py','padding','paddingTop',
  'paddingRight','paddingBottom','paddingLeft','paddingX','paddingY','paddingInline',
  'paddingInlineStart','paddingInlineEnd','paddingBlock','paddingBlockStart','paddingBlockEnd'];

// Line 93:
const spacingKeys = [...marginKeys, ...paddingKeys];
```

These same keys also appear in `defaultSxConfig.js`. The arrays are duplicated across modules.

**Suggested fix**: Generate from a shared set of prefixes and directions, or share a single source of truth.

**Estimated savings**: 150–200 bytes

---

### 2.3 `cssContainerQueries.ts` — Regex inside sort comparator

**File**: `packages/mui-system/src/cssContainerQueries/cssContainerQueries.ts`
**Lines**: 30–33

**Current code**:
```ts
.sort((a, b) => {
  const regex = /min-width:\s*([0-9.]+)/;
  return +(a.match(regex)?.[1] || 0) - +(b.match(regex)?.[1] || 0);
});
```

The regex `/min-width:\s*([0-9.]+)/` is recreated on every comparison during sort.

**Suggested fix**: Move regex to module level:
```ts
const MIN_WIDTH_REGEX = /min-width:\s*([0-9.]+)/;
// ... inside sort:
return +(a.match(MIN_WIDTH_REGEX)?.[1] || 0) - +(b.match(MIN_WIDTH_REGEX)?.[1] || 0);
```

**Estimated savings**: 30–50 bytes + minor perf improvement

---

### 2.4 `cssContainerQueries.ts` — Redundant method attachment

**File**: `packages/mui-system/src/cssContainerQueries/cssContainerQueries.ts`
**Lines**: 80–117

**Current code**:
```ts
function attachCq(node: any, name?: string) {
  node.up = (...args) => toContainerQuery(themeInput.breakpoints.up(...args), name);
  node.down = (...args) => toContainerQuery(themeInput.breakpoints.down(...args), name);
  node.between = (...args) => toContainerQuery(themeInput.breakpoints.between(...args), name);
  node.only = (...args) => toContainerQuery(themeInput.breakpoints.only(...args), name);
  node.not = (...args) => { /* 8 lines of logic */ };
}
const node = {};
const containerQueries = ((name) => { attachCq(node, name); return node; });
attachCq(containerQueries); // called twice: once for containerQueries, once for node
```

`attachCq` is called twice (lines 108, 112), creating 10 arrow functions total. The `node` object gets its methods overwritten every time `containerQueries(name)` is called.

**Suggested fix**: Create methods once using a factory that captures `name` via closure, or use a Proxy.

**Estimated savings**: 300–400 bytes

---

### 2.5 `style.js` — `getPath()` double reduce

**File**: `packages/mui-system/src/style/style.js`
**Lines**: 5–25

**Current code**:
```js
export function getPath(obj, path, checkVars = true) {
  if (!path || typeof path !== 'string') {
    return null;
  }
  if (obj && obj.vars && checkVars) {
    const val = `vars.${path}`
      .split('.')
      .reduce((acc, item) => (acc && acc[item] ? acc[item] : null), obj);
    if (val != null) {
      return val;
    }
  }
  return path.split('.').reduce((acc, item) => {
    if (acc && acc[item] != null) {
      return acc[item];
    }
    return null;
  }, obj);
}
```

Two nearly identical `.split('.').reduce(...)` calls. The reduce callbacks differ slightly (`acc[item] ? acc[item]` vs `acc[item] != null`).

**Suggested fix**: Extract a shared reduce helper:
```js
const lookup = (obj, keys) => keys.reduce((acc, k) => (acc && acc[k] != null ? acc[k] : null), obj);

export function getPath(obj, path, checkVars = true) {
  if (!path || typeof path !== 'string') return null;
  const keys = path.split('.');
  if (obj?.vars && checkVars) {
    const val = lookup(obj, ['vars', ...keys]);
    if (val != null) return val;
  }
  return lookup(obj, keys);
}
```

**Estimated savings**: 100–150 bytes

---

### 2.6 `compose.js` — Three separate reduce operations

**File**: `packages/mui-system/src/compose/compose.js`
**Lines**: 3–31

**Current code**:
```js
function compose(...styles) {
  const handlers = styles.reduce((acc, style) => {     // reduce #1
    style.filterProps.forEach((prop) => { acc[prop] = style; });
    return acc;
  }, {});

  const fn = (props) => {
    return Object.keys(props).reduce((acc, prop) => {   // reduce #2
      if (handlers[prop]) { return merge(acc, handlers[prop](props)); }
      return acc;
    }, {});
  };

  fn.propTypes = process.env.NODE_ENV !== 'production'
    ? styles.reduce((acc, style) => Object.assign(acc, style.propTypes), {})  // reduce #3
    : {};

  fn.filterProps = styles.reduce((acc, style) => acc.concat(style.filterProps), []);  // reduce #4
  return fn;
}
```

Four reduce operations, three of which iterate `styles`. Reduces #1, #3, and #4 could be combined into a single pass.

**Suggested fix**:
```js
function compose(...styles) {
  const handlers = {};
  const filterProps = [];
  const propTypes = {};
  for (const style of styles) {
    style.filterProps.forEach(prop => { handlers[prop] = style; });
    filterProps.push(...style.filterProps);
    if (process.env.NODE_ENV !== 'production') Object.assign(propTypes, style.propTypes);
  }
  // ...
}
```

**Estimated savings**: 50–80 bytes

---

### 2.7 `styleFunctionSx.js` — Redundant type checks in traverse

**File**: `packages/mui-system/src/styleFunctionSx/styleFunctionSx.js`
**Lines**: 92–138

**Current code**:
```js
function traverse(sxInput) {
  let sxObject = sxInput;
  if (typeof sxInput === 'function') {        // type check #1
    sxObject = sxInput(theme);
  } else if (typeof sxInput !== 'object') {   // type check #2
    return sxInput;
  }
  if (!sxObject) {                            // null check
    return null;
  }
  // ...
  Object.keys(sxObject).forEach((styleKey) => {
    const value = callIfFn(sxObject[styleKey], theme);
    if (value !== null && value !== undefined) {   // type check #3
      if (typeof value === 'object') {              // type check #4
        // ...
      } else {
        // ...
      }
    }
  });
}
```

The `typeof` checks are verbose. `value !== null && value !== undefined` could be `value != null`.

**Suggested fix**: Replace `value !== null && value !== undefined` with `value != null` (line 110).

**Estimated savings**: 30–40 bytes

---

### 2.8 `breakpoints.js` — Duplicate breakpoint key declarations

**File**: `packages/mui-system/src/breakpoints/breakpoints.js`

The default breakpoint keys `['xs', 'sm', 'md', 'lg', 'xl']` appear in multiple locations across the system package. `createBreakpoints.js` defines them, but `breakpoints.js` has its own hardcoded references.

**Estimated savings**: 50–100 bytes

---

### 2.9 `createCssVarsProvider.js` — Static context recreation

**File**: `packages/mui-system/src/cssVars/createCssVarsProvider.js`
**Lines**: ~34–43

The `defaultContext` object is created inside the factory function scope on every call to `createCssVarsProvider`. Since it contains only static values (`allColorSchemes: []`, `colorScheme: undefined`, etc.), it could be a module-level constant.

**Suggested fix**: Hoist to module level.

**Estimated savings**: 50–100 bytes

---

### 2.10 `createContainer.tsx` — Redundant ownerState spread

**File**: `packages/mui-system/src/Container/createContainer.tsx`
**Lines**: ~140–146

**Current code**:
```tsx
const ownerState = {
  ...props,
  component,
  disableGutters,
  fixed,
  maxWidth,
};
```

`component`, `disableGutters`, `fixed`, `maxWidth` are already in `props` (destructured from `props` on lines 130–138), so spreading `...props` duplicates them.

**Suggested fix**: Only include needed properties not already in props, or use `props` directly.

**Estimated savings**: 50–100 bytes

---

### 2.11 `createGrid.tsx` — Eager theme creation

**File**: `packages/mui-system/src/Grid/createGrid.tsx`
**Lines**: ~62–76

The `useUtilityClasses` function accesses `breakpoints.keys[0]` with hardcoded expectations. Grid generation code creates theme-dependent objects eagerly.

**Estimated savings**: 100–200 bytes

---

## 3. @mui/material Findings

### A

#### 3.1 `AccordionSummary.js` — Verbose callback handler

**File**: `packages/mui-material/src/AccordionSummary/AccordionSummary.js`
**Lines**: 123–130

**Current code**:
```js
const handleChange = (event) => {
  if (toggle) {
    toggle(event);
  }
  if (onClick) {
    onClick(event);
  }
};
```

**Suggested fix** (optional chaining):
```js
const handleChange = (event) => {
  toggle?.(event);
  onClick?.(event);
};
```

**Estimated savings**: 30–40 bytes

---

#### 3.2 `AccordionDetails.js` — Unnecessary ownerState alias

**File**: `packages/mui-material/src/AccordionDetails/AccordionDetails.js`
**Lines**: 32–33

**Current code**:
```js
const { className, ...other } = props;
const ownerState = props;
```

`ownerState` is just an alias for `props`. The separate variable is unnecessary.

**Estimated savings**: 15–20 bytes

---

#### 3.3 `Alert.js` — Triple palette filtering

**File**: `packages/mui-material/src/Alert/Alert.js`
**Lines**: 61–110

Three separate `.filter(createSimplePaletteValueFilter(...)).map(...)` calls for `standard`, `outlined`, and `filled` variants. Each iterates the entire palette.

**Suggested fix**: Iterate the palette once and generate all three variant objects per color:
```js
...Object.entries(theme.palette)
  .filter(createSimplePaletteValueFilter(['light', 'dark']))
  .flatMap(([color]) => [
    { props: { colorSeverity: color, variant: 'standard' }, style: { /* ... */ } },
    { props: { colorSeverity: color, variant: 'outlined' }, style: { /* ... */ } },
    { props: { colorSeverity: color, variant: 'filled' }, style: { /* ... */ } },
  ]),
```

**Estimated savings**: 80–120 bytes

---

#### 3.4 `AppBar.js` — Redundant optional chaining

**File**: `packages/mui-material/src/AppBar/AppBar.js`
**Line**: 26

**Current code**:
```js
const joinVars = (var1, var2) => (var1 ? `${var1?.replace(')', '')}, ${var2})` : var2);
```

`var1?.replace` is redundant — the ternary already confirms `var1` is truthy.

**Suggested fix**:
```js
const joinVars = (var1, var2) => (var1 ? `${var1.replace(')', '')}, ${var2})` : var2);
```

**Estimated savings**: 6 bytes

---

#### 3.5 `Autocomplete.js` — Repeated magic numbers

**File**: `packages/mui-material/src/Autocomplete/Autocomplete.js`
**Lines**: 51–76

Magic numbers `26`, `52`, `4`, `9` are repeated in padding calculations.

**Suggested fix**: Extract constants:
```js
const POPUP_ICON_SIZE = 26;
const CLEAR_ICON_SIZE = 26;
const ICON_MARGIN = 4;
```

**Estimated savings**: 20–30 bytes

---

#### 3.6 `Avatar.js` — Redundant double-bang

**File**: `packages/mui-material/src/Avatar/Avatar.js`
**Lines**: ~225

**Current code**:
```js
} else if (!!childrenProp || childrenProp === 0) {
```

The `!!` is redundant — any truthy value plus the `=== 0` check covers all cases.

**Suggested fix**:
```js
} else if (childrenProp || childrenProp === 0) {
```

**Estimated savings**: 2 bytes

---

### B

#### 3.7 `Badge.js` — 8 position variants could be generated

**File**: `packages/mui-material/src/Badge/Badge.js`
**Lines**: 111–200+

8 variant objects for position combinations (`top/bottom` x `right/left` x `rectangular/circular`) are written out manually, each with similar `transform` and `transformOrigin` styles.

**Suggested fix**: Generate from arrays:
```js
const positions = ['top', 'bottom'];
const horizontals = ['right', 'left'];
const overlaps = ['rectangular', 'circular'];
// generate 8 variants programmatically
```

**Estimated savings**: 50–80 bytes

---

#### 3.8 `Breadcrumbs.js` — Verbose reduce, use flatMap

**File**: `packages/mui-material/src/Breadcrumbs/Breadcrumbs.js`
**Lines**: 58–78

**Current code**:
```js
function insertSeparators(items, className, separator, ownerState) {
  return items.reduce((acc, current, index) => {
    if (index < items.length - 1) {
      acc = acc.concat(
        current,
        <BreadcrumbsSeparator aria-hidden key={`separator-${index}`}
          className={className} ownerState={ownerState}>
          {separator}
        </BreadcrumbsSeparator>,
      );
    } else {
      acc.push(current);
    }
    return acc;
  }, []);
}
```

**Suggested fix**:
```js
function insertSeparators(items, className, separator, ownerState) {
  return items.flatMap((current, index) =>
    index < items.length - 1
      ? [current, <BreadcrumbsSeparator ...>{separator}</BreadcrumbsSeparator>]
      : [current]
  );
}
```

**Estimated savings**: 35–45 bytes

---

#### 3.9 `Button.js` — Icon size styles from map

**File**: `packages/mui-material/src/Button/Button.js`

Icon size variants (`small`, `medium`, `large`) have separate style objects with hardcoded font sizes. These could be generated from a size map.

**Estimated savings**: 50–70 bytes

---

#### 3.10 `ButtonGroup.js` — Repetitive variant/orientation combinations

**File**: `packages/mui-material/src/ButtonGroup/ButtonGroup.js`
**Lines**: 165–244

Six separate variant blocks for `outlined`/`contained` x `horizontal`/`vertical` with very similar border styling logic.

**Current code** (lines 186–234):
```js
{
  props: { variant: 'outlined', orientation: 'horizontal' },
  style: { /* borderRight logic */ },
},
{
  props: { variant: 'outlined', orientation: 'vertical' },
  style: { /* borderBottom logic — same pattern, different axis */ },
},
{
  props: { variant: 'contained', orientation: 'horizontal' },
  style: { /* borderRight logic */ },
},
{
  props: { variant: 'contained', orientation: 'vertical' },
  style: { /* borderBottom logic */ },
},
```

**Suggested fix**: Generate from orientation/variant arrays.

**Estimated savings**: 100–130 bytes

---

#### 3.11 `BottomNavigationAction.js` — Verbose callback and hardcoded transition

**File**: `packages/mui-material/src/BottomNavigationAction/BottomNavigationAction.js`

**Finding 1** — Verbose callback handler (lines 111–119):
```js
const handleChange = (event) => {
  if (onChange) {
    onChange(event, value);
  }
  if (onClick) {
    onClick(event);
  }
};
```

**Suggested fix**:
```js
const handleChange = (event) => {
  onChange?.(event, value);
  onClick?.(event);
};
```

**Finding 2** — Hardcoded transition string (line 74):
```js
transition: 'font-size 0.2s, opacity 0.2s',
```

Should use `theme.transitions.create()` for consistency.

**Estimated savings**: 25–35 bytes

---

### C

#### 3.12 `Chip.js` — Quadruple palette filtering

**File**: `packages/mui-material/src/Chip/Chip.js`
**Lines**: 166, 210, 245, 290

Four separate `Object.entries(theme.palette).filter(createSimplePaletteValueFilter(...)).map(...)` calls for different variant/style combinations.

**Suggested fix**: Single iteration generating all four variant styles per color.

**Estimated savings**: 100–150 bytes

---

#### 3.13 `Chip.js` — Inline textColor variable

**File**: `packages/mui-material/src/Chip/Chip.js`
**Lines**: 81–83

**Current code**:
```js
const textColor =
  theme.palette.mode === 'light' ? theme.palette.grey[700] : theme.palette.grey[300];
```

Used only once — could be inlined at the use site.

**Estimated savings**: 15–20 bytes

---

#### 3.14 `Collapse.js` — Template literals with single variable

**File**: `packages/mui-material/src/Collapse/Collapse.js`
**Lines**: 22, 25, 26

**Current code**:
```js
root: ['root', `${orientation}`],
wrapper: ['wrapper', `${orientation}`],
wrapperInner: ['wrapperInner', `${orientation}`],
```

**Suggested fix**: Use `orientation` directly:
```js
root: ['root', orientation],
wrapper: ['wrapper', orientation],
wrapperInner: ['wrapperInner', orientation],
```

**Estimated savings**: 12–18 bytes

---

#### 3.15 `CssBaseline.js` — Duplicate color scheme logic

**File**: `packages/mui-material/src/CssBaseline/CssBaseline.js`
**Lines**: 32–55

The `colorSchemeStyles` generation block iterates `theme.colorSchemes` and handles `@media` vs class/data selectors. This same pattern is likely duplicated with `ScopedCssBaseline.js`.

**Estimated savings**: 40–60 bytes

---

### D

#### 3.16 `Dialog.js` — Duplicate capitalize() calls

**File**: `packages/mui-material/src/Dialog/Dialog.js`

`capitalize()` is called on the same `scroll` and `maxWidth` values in both `useUtilityClasses` and the style resolution, duplicating work.

**Estimated savings**: 15–20 bytes

---

#### 3.17 `Divider.js` — Double negation and repeated orientation checks

**File**: `packages/mui-material/src/Divider/Divider.js`
**Lines**: 11–56, 133

**Finding 1**: The condition `orientation === 'vertical'` appears 5 times between `useUtilityClasses` (lines 21, 24, 28) and `overridesResolver` (lines 45, 48). Similarly, `children &&` is checked 4 times (lines 23, 24, 47, 48).

**Finding 2**: Double negation at line 133 in variant props:
```js
props: ({ ownerState }) => !!ownerState.children,
```
The `!!` is unnecessary — `ownerState.children` already evaluates to a boolean in this context.

**Suggested fix**: Compute `isVertical` and `hasChildren` booleans once; remove `!!`.

**Estimated savings**: 20–30 bytes

---

### E–F

#### 3.18 `Fade.js` — Redundant `enableStrictModeCompat` constant

**File**: `packages/mui-material/src/Fade/Fade.js`
**Line**: 50

**Current code**:
```js
const enableStrictModeCompat = true;
// ... used at line 120:
nodeRef={enableStrictModeCompat ? nodeRef : undefined}
```

The constant is always `true`, so the ternary always evaluates to `nodeRef`. The variable and ternary are redundant.

**Suggested fix**: Replace with `nodeRef={nodeRef}`.

**Estimated savings**: 10–15 bytes (+ clearer intent)

---

#### 3.19 `FormControl.js` — Duplicate React.Children.forEach loops

**File**: `packages/mui-material/src/FormControl/FormControl.js`
**Lines**: 128–147, 149–167

**Current code** — two separate `useState` initializers, each iterating children:
```js
// Loop 1 (lines 128-147):
const [adornedStart, setAdornedStart] = React.useState(() => {
  let initialAdornedStart = false;
  if (children) {
    React.Children.forEach(children, (child) => {
      if (!isMuiElement(child, ['Input', 'Select'])) return;
      const input = isMuiElement(child, ['Select']) ? child.props.input : child;
      if (input && isAdornedStart(input.props)) initialAdornedStart = true;
    });
  }
  return initialAdornedStart;
});

// Loop 2 (lines 149-167):
const [filled, setFilled] = React.useState(() => {
  let initialFilled = false;
  if (children) {
    React.Children.forEach(children, (child) => {
      if (!isMuiElement(child, ['Input', 'Select'])) return;
      if (isFilled(child.props, true) || isFilled(child.props.inputProps, true))
        initialFilled = true;
    });
  }
  return initialFilled;
});
```

**Suggested fix**: Combine into a single `React.Children.forEach` pass computing both values.

**Estimated savings**: 60–80 bytes

---

#### 3.20 `FormHelperText.js` — Unnecessary `delete ownerState.ownerState`

**File**: `packages/mui-material/src/FormHelperText/FormHelperText.js`
**Line**: 117

**Current code**:
```js
const ownerState = {
  ...props,
  component,
  contained: fcs.variant === 'filled' || fcs.variant === 'outlined',
  variant: fcs.variant,
  // ...
};
delete ownerState.ownerState;
```

The `delete` is needed because `...props` can include a nested `ownerState` key. A more selective spread would avoid the need for `delete`.

**Estimated savings**: 15–20 bytes

---

#### 3.21 `FormControlLabel.js` — Intermediate externalForwardedProps

**File**: `packages/mui-material/src/FormControlLabel/FormControlLabel.js`
**Lines**: 165–171

**Current code**:
```js
const externalForwardedProps = {
  slots,
  slotProps: {
    ...componentsProps,
    ...slotProps,
  },
};
```

This intermediate object is only used as an argument to `useSlot`. Could be inlined.

**Estimated savings**: 15–20 bytes

---

### G–L

#### 3.22 `Grow.js` — Inefficient Safari workaround detection

**File**: `packages/mui-material/src/Grow/Grow.js`
**Lines**: 31–34

**Current code**:
```js
const isWebKit154 =
  typeof navigator !== 'undefined' &&
  /^((?!chrome|android).)*(safari|mobile)/i.test(navigator.userAgent) &&
  /(os |version\/)15(.|_)4/i.test(navigator.userAgent);
```

Two separate `.test()` calls on `navigator.userAgent` could be combined into a single regex. The detection runs on every module load.

**Estimated savings**: 15–25 bytes

---

#### 3.23 `LinearProgress.js` — 5 palette filter calls + 3 repeated animation ternaries

**File**: `packages/mui-material/src/LinearProgress/LinearProgress.js`

**Finding 1**: Five separate `Object.entries(theme.palette).filter(createSimplePaletteValueFilter()).map(...)` calls at lines 149, 209, 262, 330, 360 — the most of any component.

**Finding 2**: Three repeated animation ternary patterns:

```js
// Line 221-224:
bufferAnimation || {
  animation: `${bufferKeyframe} 3s infinite linear`,
},
// Line 296-298:
indeterminate1Animation || {
  animation: `${indeterminate1Keyframe} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite`,
},
// Line 378-380:
indeterminate2Animation || {
  animation: `${indeterminate2Keyframe} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite`,
},
```

Each follows the same `animationVar || { animation: \`...\` }` pattern. A helper could reduce this.

**Suggested fix**: Single palette iteration; extract animation fallback helper.

**Estimated savings**: 150–200 bytes (palette) + 20–30 bytes (animations)

---

#### 3.24 `ListItemButton.js` / `MenuItem.js` — Duplicate alpha calculations

**Files**:
- `packages/mui-material/src/ListItemButton/ListItemButton.js` (lines 81–104)
- `packages/mui-material/src/MenuItem/MenuItem.js` (lines 77–101)

**Current code** (nearly identical in both files):
```js
[`&.${classes.selected}`]: {
  backgroundColor: theme.alpha(
    (theme.vars || theme).palette.primary.main,
    (theme.vars || theme).palette.action.selectedOpacity,
  ),
  [`&.${classes.focusVisible}`]: {
    backgroundColor: theme.alpha(
      (theme.vars || theme).palette.primary.main,
      `${(theme.vars || theme).palette.action.selectedOpacity} + ${(theme.vars || theme).palette.action.focusOpacity}`,
    ),
  },
},
```

The `theme.alpha(...)` calculation with `(theme.vars || theme)` is repeated 3 times in each file.

**Estimated savings**: 30–40 bytes

---

### R–Z

#### 3.25 `Radio.js` / `Checkbox.js` — Duplicate palette filtering

**Files**:
- `packages/mui-material/src/Radio/Radio.js` (lines 66, 79)
- `packages/mui-material/src/Checkbox/Checkbox.js` (lines 70, 83)

Both have two separate `createSimplePaletteValueFilter()` calls — one for checked styles, one for hover styles.

**Suggested fix**: Single iteration per component.

**Estimated savings**: 40–60 bytes per file

---

#### 3.26 `Slider.js` — Triple palette filtering

**File**: `packages/mui-material/src/Slider/Slider.js`
**Lines**: 64–71, 206–224, 308–323

Three separate palette filter/map iterations for:
1. Root color (line 65)
2. Track inverted color (line 207)
3. Thumb hover/focus color (line 309)

**Suggested fix**: Single iteration generating all three variant blocks per color.

**Estimated savings**: 80–120 bytes

---

#### 3.27 `Rating.js` — `getDecimalPrecision` used only twice

**File**: `packages/mui-material/src/Rating/Rating.js`
**Lines**: 21–24

**Current code**:
```js
function getDecimalPrecision(num) {
  const decimalPart = num.toString().split('.')[1];
  return decimalPart ? decimalPart.length : 0;
}
```

This function is only called in `roundValueToPrecision`. Could be inlined.

**Estimated savings**: 20–30 bytes

---

#### 3.28 `Snackbar.js` — Props spread into ownerState

**File**: `packages/mui-material/src/Snackbar/Snackbar.js`

`ownerState` includes `...props` then overwrites keys like `anchorOrigin`, `autoHideDuration`, etc.

**Estimated savings**: 15–25 bytes

---

#### 3.29 `SvgIcon.js` — Unnecessary empty object pattern

**File**: `packages/mui-material/src/SvgIcon/SvgIcon.js`
**Lines**: 124–128

**Current code**:
```js
const more = {};

if (!inheritViewBox) {
  more.viewBox = viewBox;
}
```

Later spread at line 141: `{...more, ...other}`

**Suggested fix**:
```js
const more = inheritViewBox ? {} : { viewBox };
```

**Estimated savings**: 10–15 bytes

---

#### 3.30 `TextField.js` — Empty object conditionally filled

**File**: `packages/mui-material/src/TextField/TextField.js`
**Lines**: 153–169

**Current code**:
```js
const inputAdditionalProps = {};
const inputLabelSlotProps = externalForwardedProps.slotProps.inputLabel;

if (variant === 'outlined') {
  if (inputLabelSlotProps && typeof inputLabelSlotProps.shrink !== 'undefined') {
    inputAdditionalProps.notched = inputLabelSlotProps.shrink;
  }
  inputAdditionalProps.label = label;
}
if (select) {
  if (!SelectPropsProp || !SelectPropsProp.native) {
    inputAdditionalProps.id = undefined;
  }
  inputAdditionalProps['aria-describedby'] = undefined;
}
```

**Suggested fix**: Construct with conditional spreads:
```js
const inputAdditionalProps = {
  ...(variant === 'outlined' && { notched: inputLabelSlotProps?.shrink, label }),
  ...(select && { id: SelectPropsProp?.native ? undefined : undefined, 'aria-describedby': undefined }),
};
```

**Estimated savings**: 15–20 bytes

---

#### 3.31 `Tooltip.js` — Duplicated RTL checks and module-level state

**File**: `packages/mui-material/src/Tooltip/Tooltip.js`
**Lines**: 109–240, 293–295

**Finding 1**: Double negation — `!!ownerState.isRtl` is used at lines 118, 229, etc. when `ownerState.isRtl` suffices:
```js
// Line 109: !ownerState.isRtl
// Line 118: !!ownerState.isRtl  — unnecessary double negation
```

**Finding 2**: Module-level mutable state (lines 293–295):
```js
let hystersisOpen = false;
const hystersisTimer = new Timeout();
let cursorPosition = { x: 0, y: 0 };
```
These shared mutable variables could cause issues with concurrent renders and add to the module's baseline memory.

**Finding 3**: The `round()` helper (lines 24–26) is a single-use utility.

**Estimated savings**: 20–30 bytes

---

#### 3.32 `Typography.js` — defaultVariantMapping

**File**: `packages/mui-material/src/Typography/Typography.js`

The `defaultVariantMapping` object maps typography variants to HTML elements. The `v6Colors` object (lines 13–23) has 9 hardcoded keys.

**Estimated savings**: 15–20 bytes (minor)

---

#### 3.33 `Switch.js` — Palette filtering

**File**: `packages/mui-material/src/Switch/Switch.js`
**Line**: 155

Single `createSimplePaletteValueFilter(['light'])` call generating complex styles per color.

**Estimated savings**: Addressed by cross-cutting pattern 1.1

---

#### 3.34 `Tabs.js` — Single-use helper functions

**File**: `packages/mui-material/src/Tabs/Tabs.js`

Helper functions that are called exactly once could be inlined at their call site.

**Estimated savings**: 20–30 bytes

---

## 4. Summary Table

| # | File | Finding | Priority | Est. Savings (bytes) |
|---|------|---------|----------|---------------------|
| 1.1 | 24 files | `createSimplePaletteValueFilter` boilerplate | HIGH | 300–500 |
| 1.2 | 107 files | Redundant `...props` in ownerState | HIGH | 200–400 |
| 1.4 | `defaultSxConfig.js` | Repetitive padding/margin configs | HIGH | 800–1,000 |
| 1.5 | Multiple | Verbose error messages | MEDIUM | 1,000–1,500 |
| 2.2 | `spacing.js` | Duplicate key arrays | MEDIUM | 150–200 |
| 2.4 | `cssContainerQueries.ts` | Redundant method attachment | MEDIUM | 300–400 |
| 2.5 | `style.js` | Double reduce in getPath | MEDIUM | 100–150 |
| 2.6 | `compose.js` | 3 separate reduce passes | LOW | 50–80 |
| 2.7 | `styleFunctionSx.js` | Redundant type checks | LOW | 30–40 |
| 2.9 | `createCssVarsProvider.js` | Static context recreation | LOW | 50–100 |
| 2.10 | `createContainer.tsx` | Redundant ownerState spread | LOW | 50–100 |
| 3.1 | `AccordionSummary.js` | Verbose callback handler | LOW | 30–40 |
| 3.3 | `Alert.js` | Triple palette filtering | MEDIUM | 80–120 |
| 3.7 | `Badge.js` | 8 position variants manual | MEDIUM | 50–80 |
| 3.8 | `Breadcrumbs.js` | Verbose reduce → flatMap | LOW | 35–45 |
| 3.10 | `ButtonGroup.js` | Repetitive variant combos | MEDIUM | 100–130 |
| 3.12 | `Chip.js` | Quadruple palette filtering | MEDIUM | 100–150 |
| 3.14 | `Collapse.js` | Template literal with variable | LOW | 12–18 |
| 3.18 | `Fade.js` | Redundant constant + ternary | LOW | 10–15 |
| 3.19 | `FormControl.js` | Duplicate Children.forEach loops | MEDIUM | 60–80 |
| 3.23 | `LinearProgress.js` | 5 palette filter + 3 animation ternaries | HIGH | 170–230 |
| 3.26 | `Slider.js` | Triple palette filtering | MEDIUM | 80–120 |
| 1.3 | 20+ files | Duplicate capitalize() calls | LOW | 80–120 |
| 1.6 | Multiple | Duplicate overridesResolver | LOW | 100–200 |
| 1.7 | Multiple | Template literals single var | LOW | 30–50 |
| 2.3 | `cssContainerQueries.ts` | Regex in sort comparator | LOW | 30–50 |
| 2.8 | `breakpoints.js` | Duplicate key declarations | LOW | 50–100 |
| 3.15 | `CssBaseline.js` | Duplicate colorScheme logic | LOW | 40–60 |
| 3.17 | `Divider.js` | Repeated orientation checks + `!!` | LOW | 20–30 |
| 3.22 | `Grow.js` | Inefficient Safari regex detection | LOW | 15–25 |
| 3.25 | `Radio.js`/`Checkbox.js` | Dual palette filtering | LOW | 40–60 |
| 3.27 | `Rating.js` | Single-use utility function | LOW | 20–30 |
| 3.31 | `Tooltip.js` | RTL double negation + module state | LOW | 20–30 |

### Priority Guide

- **HIGH**: Cross-cutting pattern or >100 bytes savings, low risk
- **MEDIUM**: 50–100 bytes savings, moderate refactoring
- **LOW**: <50 bytes savings, or high risk of behavioral change

### Quick Wins (easiest to implement, lowest risk)

1. Move regex to module level in `cssContainerQueries.ts` (2.3)
2. Replace template literals with variables in `Collapse.js` (3.14)
3. Use optional chaining in `AccordionSummary.js` (3.1)
4. Replace `value !== null && value !== undefined` with `value != null` in `styleFunctionSx.js` (2.7)
5. Remove redundant `?.` in `AppBar.js` (3.4)
6. Remove `!!` in `Avatar.js` (3.6)
7. Use `flatMap` in `Breadcrumbs.js` (3.8)
8. Generate `defaultSxConfig` padding/margin entries programmatically (1.4)
