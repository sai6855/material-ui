const imports = `
import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import { createTheme, styled, type Theme } from '@mui/material/styles';
`;
const auto = `<Autocomplete options={['apple', 'orange']} renderInput={(params) => <TextField {...params} label="Fruit" />} />`;
const fs = require('node:fs');
const path = require('node:path');
const readTest = (relative) => fs.readFileSync(path.join(__dirname, '..', relative), 'utf8');
module.exports = {
  empty: `export {};`,
  dashboard: `${imports}
    export function Dashboard() {
      return <Box sx={{ display: 'flex', gap: 2, '&:hover': { color: 'primary.main' } }}>
        ${auto}
        <Select value="apple"><MenuItem value="apple">Apple</MenuItem></Select>
        <Tooltip title="Save"><Button variant="contained">Save</Button></Tooltip>
        <Alert severity="success" slotProps={{ closeButton: { size: 'small' } }}>Saved</Alert>
        <Dialog open={false}>Details</Dialog>
      </Box>;
    }
    export const theme = createTheme({ components: {
      MuiButton: { defaultProps: { variant: 'contained' }, styleOverrides: { root: { borderRadius: 8 } } },
      MuiTextField: { defaultProps: { size: 'small' } },
    }});
    export const StyledButton = styled(Button)(({ theme }) => ({ color: theme.palette.primary.main }));
  `,
  autocomplete: `${imports} export const example = ${auto};`,
  'autocomplete-props': `${imports}
    export type Props = React.ComponentProps<typeof Autocomplete>;
    export function Wrapper(props: Props) { return <Autocomplete {...props} />; }
  `,
  'autocomplete-styled': `${imports} export const Styled = styled(Autocomplete)({ width: 200 });`,
  textfield: `${imports} export const example = <TextField label="Name" />;`,
  button: `${imports} export const example = <Button variant="contained">Save</Button>;`,
  box: `${imports} export const example = <Box sx={{ p: 2, color: 'primary.main', '&:hover': { m: 1 } }} />;`,
  alert: `${imports} export const example = <Alert slotProps={{ closeButton: { size: 'small' } }}>Alert</Alert>;`,
  select: `${imports} export const example = <Select value="apple"><MenuItem value="apple">Apple</MenuItem></Select>;`,
  'theme-empty': `${imports} export const theme = createTheme({});`,
  'theme-button': `${imports} export const theme = createTheme({components: {MuiButton: {styleOverrides: {root: {color: 'red'}}}}});`,
  'styled-button': `${imports} export const Styled = styled(Button)(({theme}) => ({ color: theme.palette.primary.main }));`,
  'styled-box': `${imports} export const Styled = styled(Box)(({theme}) => ({ color: theme.palette.primary.main }));`,
  'theme-vars': `${imports}
    import type { ThemeCssVar, CssVarsTheme } from '@mui/material/styles';
    export const variable: ThemeCssVar = 'palette-primary-main';
    export function getColor(theme: CssVarsTheme) { return theme.getCssVar('palette-primary-main'); }
  `,
  'sx-wrapper': `${imports}
    import type { SxProps } from '@mui/system';
    export function Wrapper({sx}: {sx: SxProps<Theme>}) {return <Box sx={sx} />;}
  `,
  'sx-theme-relation': `${imports}
    import type { SxProps, Theme as SystemTheme } from '@mui/system';
    declare const sx: SxProps<SystemTheme>;
    export const styles: SxProps<Theme> = sx;
  `,
  'autocomplete-tests': fs.readFileSync(path.join(__dirname, '../packages/mui-material/src/Autocomplete/Autocomplete.spec.tsx'), 'utf8')
    .replace("from '../useAutocomplete'", "from '@mui/material/useAutocomplete'"),
  'autocomplete-styled-use': `${imports}
    const Styled = styled(Autocomplete)({ width: 200 });
    export const element = <Styled options={['one', 'two']} renderInput={(params) => <TextField {...params} />} />;
    // @ts-expect-error options are required.
    export const invalid = <Styled renderInput={() => null} />;
    // @ts-expect-error options must be an array.
    export const invalidOptions = <Styled options={123} renderInput={() => null} />;
  `,
  'polymorphic-wrapper': `${imports}
    import type { ButtonProps } from '@mui/material/Button';
    import type { BoxProps } from '@mui/material/Box';
    export function ButtonWrapper<C extends React.ElementType>(props: ButtonProps<C>) { return <Button {...props} />; }
    export function BoxWrapper<C extends React.ElementType>(props: BoxProps<C>) { return <Box {...props} />; }
  `,
  'polymorphic-styled': `${imports}
    import Chip from '@mui/material/Chip';
    import Typography from '@mui/material/Typography';
    import Stack from '@mui/material/Stack';
    import Link from '@mui/material/Link';
    export const A = styled(Button)({color: 'red'});
    export const B = styled(Box)({color: 'red'});
    export const C = styled(Chip)({color: 'red'});
    export const D = styled(Typography)({color: 'red'});
    export const E = styled(Stack)({color: 'red'});
    export const F = styled(Link)({color: 'red'});
  `,
  'sx-generic-wrapper': `${imports}
    import type { SxProps } from '@mui/system';
    export function passStyles<T extends Theme>(sx: SxProps<Theme>): SxProps<T> { return sx; }
  `,
  'styled-many': `${imports}
    ${Array.from({length: 12}, (_, index) => `
      export const Styled${index} = styled('div')<{count${index}: number}>(
        ({theme, count${index}}) => ({color: theme.palette.primary.main, padding: count${index}}),
        {variants: [{props: {count${index}: ${index}}, style: {color: 'red'}}]},
      );
    `).join('\n')}
  `,
  'select-props': `${imports}
    export type Props = React.ComponentProps<typeof Select>;
    export function Wrapper(props: Props) { return <Select {...props} />; }
  `,
  'select-styled': `${imports} export const Styled = styled(Select)({width: 200});`,
  'use-autocomplete': `${imports}
    import useAutocomplete from '@mui/material/useAutocomplete';
    export function useFruit() { return useAutocomplete({options: ['one', 'two']}); }
  `,
  'styled-autocomplete-generics': `${imports}
    import type { AutocompleteProps } from '@mui/material/Autocomplete';
    import type { ChipTypeMap } from '@mui/material/Chip';
    export function Wrapper<
      V, M extends boolean | undefined = false, D extends boolean | undefined = false,
      F extends boolean | undefined = false, C extends React.ElementType = ChipTypeMap['defaultComponent']
    >(props: AutocompleteProps<V, M, D, F, C>) { return <Autocomplete {...props} />; }
  `,
  'styled-sx': `${imports}
    import type { SxProps, SystemStyleObject } from '@mui/system';
    declare const styles: SystemStyleObject<Theme>;
    export const Styled = styled('div')(styles);
  `,
  'theme-styles-callback': `${imports}
    export const theme = createTheme({components: {
      MuiButton: {styleOverrides: {root: ({theme, ownerState}) => ({
        color: theme.palette.primary.main, padding: ownerState.size === 'small' ? 4 : 8,
      })}},
      MuiAutocomplete: {styleOverrides: {root: ({theme, ownerState}) => ({
        color: theme.palette.primary.main, opacity: ownerState.disabled ? 0.5 : 1,
      })}},
    }});
  `,
  'merge-slot-props': `${imports}
    import { mergeSlotProps } from '@mui/material/utils';
    export const props = mergeSlotProps({className: 'user'}, {className: 'default', tabIndex: 0});
  `,
  'merge-slot-tooltip': `${imports}
    import { mergeSlotProps } from '@mui/material/utils';
    import type { TooltipProps } from '@mui/material/Tooltip';
    export function Wrapper(props: TooltipProps) {
      return <Tooltip {...props} slotProps={{...props.slotProps,
        popper: mergeSlotProps(props.slotProps?.popper, {disablePortal: true}),
      }} />;
    }
  `,
  'autocomplete-compatibility': `${imports}
    import type { AutocompleteProps } from '@mui/material/Autocomplete';
    type ElementRoot = (props: { id?: string }) => React.JSX.Element;
    type NodeRoot = (props: { id?: string }) => React.ReactNode;
    type A<C extends React.ElementType> = AutocompleteProps<string, false, false, false, C>;
    type Extends<A, B> = [A] extends [B] ? true : false;
    export type CaseRootElementToNode = Extends<A<ElementRoot>, A<NodeRoot>>;
    export type CaseRootNodeToElement = Extends<A<NodeRoot>, A<ElementRoot>>;
    export type CaseDivToSpan = Extends<A<'div'>, A<'span'>>;
    export type CaseSpanToDiv = Extends<A<'span'>, A<'div'>>;
    export type CaseUnknown = Extends<AutocompleteProps<string, false, false, false>, AutocompleteProps<unknown, false, false, false>>;
    export type CaseAny = Extends<AutocompleteProps<string, false, false, false>, AutocompleteProps<any, false, false, false>>;
    export type CaseFalseToBoolean = Extends<AutocompleteProps<string, false, false, false>, AutocompleteProps<string, boolean, false, false>>;
    export type CaseUndefinedToFalse = Extends<AutocompleteProps<string, undefined, false, false>, AutocompleteProps<string, false, false, false>>;
  `,
  'merge-slot-tests': fs.readFileSync(path.join(__dirname, '../packages/mui-material/src/utils/mergeSlotProps.spec.tsx'), 'utf8'),
  'overridable-tests': readTest('packages/mui-material/test/typescript/OverridableComponent.spec.tsx'),
  'button-tests': readTest('packages/mui-material/src/Button/Button.spec.tsx'),
  'material-box-tests': readTest('packages/mui-material/src/Box/Box.spec.tsx') + '\n'
    + readTest('packages/mui-material/src/themeCssVarsAugmentation/index.ts'),
  'overridable-ref-checks': `${imports}
    import { expectType } from '@mui/types';
    import type { OverridableComponent, DefaultComponentProps, OverrideProps } from '@mui/material/OverridableComponent';
    type Map = {props: {count: number}; defaultComponent: 'button'};
    interface Original {
      <C extends React.ElementType>(props: {component: C} & OverrideProps<Map, C>): React.JSX.Element | null;
      (props: DefaultComponentProps<Map>): React.JSX.Element | null;
      propTypes?: any;
    }
    declare const old: Original;
    declare const current: OverridableComponent<Map>;
    const acceptsOld: Original = current;
    const acceptsCurrent: OverridableComponent<Map> = old;
    declare const extracted: React.ComponentProps<typeof current>;
    expectType<React.ComponentProps<Original>, typeof extracted>(extracted);
    const needsProp = React.forwardRef<HTMLAnchorElement, {to: string}>((props, ref) => <a href={props.to} ref={ref} />);
    const Current = current;
    <Current count={1} onClick={(event) => {expectType<React.MouseEvent<HTMLButtonElement>, typeof event>(event)}}
      ref={(element) => {expectType<HTMLButtonElement | null, typeof element>(element)}} />;
    <Current<'a'> component="a" count={1} href="/help" ref={(element) => {expectType<HTMLAnchorElement | null, typeof element>(element)}} />;
    <Current component={needsProp} count={1} to="/help" />;
    // @ts-expect-error Custom component requires to.
    <Current component={needsProp} count={1} />;
    // @ts-expect-error Arbitrary props are not accepted.
    <Current count={1} incorrect={1} />;
    // @ts-expect-error Default button does not accept href.
    <Current count={1} href="/help" />;
    // @ts-expect-error Default ref is a button ref.
    <Current count={1} ref={React.createRef<HTMLAnchorElement>()} />;
    // @ts-expect-error Invalid root element.
    <Current count={1} component="not-an-element" />;
    // @ts-expect-error Null is not a component.
    <Current count={1} component={null} />;
    const spread = {component: 'a' as const, count: 1};
    <Current {...spread} onClick={(event) => {expectType<React.MouseEvent<HTMLAnchorElement>, typeof event>(event)}} />;
  `,
  'system-box-tests': readTest('packages/mui-system/src/Box/Box.spec.tsx'),
  'system-styled-tests': readTest('packages/mui-system/src/styled/styled.spec.ts'),
  'system-index-tests': readTest('packages/mui-system/src/index.spec.tsx'),
  'system-cssvars-tests': readTest('packages/mui-system/src/cssVars/createCssVarsProvider.spec.tsx'),
  'system-sx-tests': readTest('packages/mui-system/src/styleFunctionSx/styleFunctionSx.spec.tsx'),
  'select-tests': readTest('packages/mui-material/src/Select/Select.spec.tsx'),
  'textfield-tests': readTest('packages/mui-material/src/TextField/TextField.spec.tsx'),
  'link-tests': readTest('packages/mui-material/src/Link/Link.spec.tsx'),
  'stack-tests': readTest('packages/mui-material/src/Stack/Stack.spec.tsx'),
  'typography-tests': readTest('packages/mui-material/src/Typography/typography.spec.tsx'),
  'polymorphic-defaults': `${imports}
    import Stack from '@mui/material/Stack';
    import Typography from '@mui/material/Typography';
    import Chip from '@mui/material/Chip';
    import Link from '@mui/material/Link';
    import Container from '@mui/material/Container';
    import Paper from '@mui/material/Paper';
    export function Page() {
      return <Container maxWidth="sm"><Paper elevation={2}><Stack spacing={2}>
        <Box sx={{p: 2}}><Typography variant="h4">Account</Typography></Box>
        <Chip label="Active" size="small" />
        <Link href="/help">Help</Link><Button variant="contained">Save</Button>
      </Stack></Paper></Container>;
    }
  `,
  'use-slot-props': `${imports}
    import useSlotProps from '@mui/utils/useSlotProps';
    export function Root(props: React.ComponentPropsWithRef<'div'>) {
      const slotProps = useSlotProps({elementType: 'div', getSlotProps: () => props,
        externalSlotProps: {}, additionalProps: {}, externalForwardedProps: {}, ownerState: {active: true},
      });
      return <div {...slotProps} />;
    }
  `,
  'use-slot-props-many': `${imports}
    import useSlotProps from '@mui/utils/useSlotProps';
    ${['div', 'button', 'input', 'a', 'label', 'span', 'form', 'ul', 'li', 'section'].map((tag, index) => `
      export function Root${index}(props: React.ComponentPropsWithRef<'${tag}'>) {
        const slotProps = useSlotProps({elementType: '${tag}', getSlotProps: () => props,
          externalSlotProps: {}, additionalProps: {}, externalForwardedProps: {}, ownerState: {active: true},
        });
        return <${tag} {...slotProps} />;
      }
    `).join('\n')}
  `,
  'styled-generic-factory': `${imports}
    export function withStyles<P extends object>(component: React.ComponentType<P>) {
      return styled(component)({color: 'red'});
    }
  `,
  'styled-chain': `${imports}
    const A = styled('div')({color: 'red'});
    const B = styled(A)({color: 'green'});
    const C = styled(B)({color: 'blue'});
    export function Wrapper(props: React.ComponentProps<typeof C>) { return <C {...props} />; }
  `,
  'sx-compatibility': `${imports}
    import type { SxProps, SystemCssProperties, CSSPseudoSelectorProps, CSSSelectorObjectOrCssVariables } from '@mui/system';
    type Base = {color: string};
    type Derived = {color: string; radius: number};
    type Extends<A, B> = [A] extends [B] ? true : false;
    export type CaseSxBaseToDerived = Extends<SxProps<Base>, SxProps<Derived>>;
    export type CaseSxDerivedToBase = Extends<SxProps<Derived>, SxProps<Base>>;
    export type CaseSystemBaseToDerived = Extends<SystemCssProperties<Base>, SystemCssProperties<Derived>>;
    export type CaseSystemDerivedToBase = Extends<SystemCssProperties<Derived>, SystemCssProperties<Base>>;
    export type CasePseudoBaseToDerived = Extends<CSSPseudoSelectorProps<Base>, CSSPseudoSelectorProps<Derived>>;
    export type CasePseudoDerivedToBase = Extends<CSSPseudoSelectorProps<Derived>, CSSPseudoSelectorProps<Base>>;
    export type CaseSelectorBaseToDerived = Extends<CSSSelectorObjectOrCssVariables<Base>, CSSSelectorObjectOrCssVariables<Derived>>;
    export type CaseSelectorDerivedToBase = Extends<CSSSelectorObjectOrCssVariables<Derived>, CSSSelectorObjectOrCssVariables<Base>>;
    export const styles: SxProps<Derived> = [{m: 2, '&:hover': (theme) => ({borderRadius: theme.radius})}, false];
    // @ts-expect-error A callback that requires Derived must not accept Base.
    export const unsafe: SxProps<Base> = (theme: Derived) => ({color: theme.color});
  `,
  'slot-props-equivalence': `${imports}
    import type { SlotProps, SlotCommonProps } from '@mui/material/utils';
    import type { SlotComponentProps, WithDataAttributes } from '@mui/utils/types';
    import type { AutocompleteProps } from '@mui/material/Autocomplete';
    type Intrinsics<P> = {[T in keyof React.JSX.IntrinsicElements]: P extends React.JSX.IntrinsicElements[T] ? React.JSX.IntrinsicElements[T] : never}[keyof React.JSX.IntrinsicElements];
    type Tags<P> = {[T in keyof React.JSX.IntrinsicElements]: P extends React.JSX.IntrinsicElements[T] ? T : never}[keyof React.JSX.IntrinsicElements];
    type Reflected<P> = React.ComponentPropsWithRef<React.ComponentType<P>> | React.ComponentPropsWithRef<Tags<P>>;
    type Direct<P, Overrides = {}, Owner = {}> = WithDataAttributes<Partial<Reflected<P>> & SlotCommonProps & Overrides> | ((ownerState: Owner) => WithDataAttributes<Partial<Reflected<P>> & SlotCommonProps & Overrides>);
    type Eq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false;
    type Props<P> = SlotProps<React.ElementType<P>, {}, {}>;
    export type CaseRequired = Eq<Props<{id: string}>, Direct<{id: string}>>;
    export type CaseOptional = Eq<Props<{id?: string}>, Direct<{id?: string}>>;
    export type CaseRef = Eq<Props<{ref?: React.Ref<HTMLDivElement>; id?: string}>, Direct<{ref?: React.Ref<HTMLDivElement>; id?: string}>>;
    export type CaseInput = Eq<Props<React.InputHTMLAttributes<HTMLInputElement>>, Direct<React.InputHTMLAttributes<HTMLInputElement>>>;
    export type CaseAny = Eq<Props<any>, Direct<any>>;
    export type CaseUnknown = Eq<Props<unknown>, Direct<unknown>>;
    export type CaseNever = Eq<Props<never>, Direct<never>>;
    export type CaseUnion = Eq<Props<{id?: string} | {disabled: boolean}>, Direct<{id?: string} | {disabled: boolean}>>;
    export type CaseIndex = Eq<Props<{[key: string]: any}>, Direct<{[key: string]: any}>>;
    export type CaseCallback = Eq<SlotProps<React.ElementType<{id?: string}>, {custom?: boolean}, {active: boolean}>, Direct<{id?: string}, {custom?: boolean}, {active: boolean}>>;
  `,
};

module.exports['autocomplete-compatibility-assert'] = module.exports['autocomplete-compatibility'] + `
  type Assert<T extends true> = T;
  type Eq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false;
  type Assertions = [
    Assert<Eq<CaseRootElementToNode, true>>, Assert<Eq<CaseRootNodeToElement, true>>,
    Assert<Eq<CaseDivToSpan, false>>, Assert<Eq<CaseSpanToDiv, false>>,
    Assert<Eq<CaseUnknown, false>>, Assert<Eq<CaseAny, true>>,
    Assert<Eq<CaseFalseToBoolean, false>>, Assert<Eq<CaseUndefinedToFalse, false>>
  ];
`;
module.exports['sx-compatibility-assert'] = module.exports['sx-compatibility'] + `
  type Assert<T extends true> = T;
  type Cases = [Assert<CaseSxBaseToDerived>, Assert<CaseSxDerivedToBase extends false ? true : false>,
    Assert<CaseSystemBaseToDerived>, Assert<CaseSystemDerivedToBase extends false ? true : false>,
    Assert<CasePseudoBaseToDerived>, Assert<CasePseudoDerivedToBase extends false ? true : false>,
    Assert<CaseSelectorBaseToDerived>, Assert<CaseSelectorDerivedToBase extends false ? true : false>];
`;
module.exports['slot-props-equivalence-assert'] = module.exports['slot-props-equivalence'] + `
  type Assert<T extends true> = T;
  type Cases = [Assert<CaseRequired>, Assert<CaseOptional>, Assert<CaseRef>, Assert<CaseInput>,
    Assert<CaseAny>, Assert<CaseUnknown>, Assert<CaseNever>, Assert<CaseUnion>, Assert<CaseIndex>, Assert<CaseCallback>];
`;

for (const name of ['dashboard', 'autocomplete-styled-use', 'styled-chain', 'styled-generic-factory', 'styled-many']) {
  module.exports['sc-' + name] = module.exports[name];
}
module.exports['sc-engine-tests'] = readTest('packages/mui-styled-engine-sc/src/styled.spec.tsx');
module.exports['sc-system-styled-tests'] = module.exports['system-styled-tests'];
module.exports['sc-style-compatibility'] = `
  import * as React from 'react';
  import type {CreateMUIStyled, StyledComponent} from '@mui/styled-engine-sc';
  import type * as Original from '${path.join(__dirname, 'snapshot-sc/packages/mui-styled-engine-sc/src/index').replaceAll('\\', '/')}';
  interface Theme {color: string}
  interface Common {theme?: Theme; as?: React.ElementType}
  declare const current: CreateMUIStyled<Common, {}, Theme>;
  declare const original: Original.CreateMUIStyled<Common, {}, Theme>;
  const A = current('button')<{must: string; count?: number}>({color: 'red'});
  const B = current(A)({color: 'green'});
  const C = current(B)<{extra?: boolean}>({color: 'blue'});
  <C must="ok" count={2} extra ref={React.createRef<HTMLButtonElement>()} />;
  // @ts-expect-error required base prop remains required
  <C count={2} />;
  // @ts-expect-error wrong base prop
  <C must={123} />;
  // @ts-expect-error wrong added prop
  <C must="ok" extra="yes" />;
  // @ts-expect-error incorrect root ref
  <C must="ok" ref={React.createRef<HTMLAnchorElement>()} />;
  const Anchor = C.withComponent('a');
  <Anchor must="ok" href="/" />;
  // @ts-expect-error the existing withComponent ref restriction is preserved
  <Anchor must="ok" href="/" ref={React.createRef<HTMLAnchorElement>()} />;
  // @ts-expect-error the original required prop is retained
  <Anchor href="/" />;
  const Target = React.forwardRef<HTMLAnchorElement, {to: string}>((props, ref) => <a href={props.to} ref={ref} />);
  const Custom = C.withComponent(Target);
  // @ts-expect-error the existing custom withComponent restriction is preserved
  <Custom must="ok" to="/" />;
  // @ts-expect-error required custom component prop
  <Custom must="ok" />;
  declare const WithAttrs: StyledComponent<'button', Theme, {must: string; size: 'sm' | 'lg'}, 'must'>;
  const Attrs = current(WithAttrs)({});
  <Attrs size="sm" />;
  // @ts-expect-error attrs does not remove the prop value type
  <Attrs size="sm" must={123} />;
  // @ts-expect-error required non-attrs prop
  <Attrs />;
  const Filtered = current(A, {shouldForwardProp: (key): key is 'must' | 'count' => key === 'must' || key === 'count'})({});
  <Filtered must="ok" count={2} />;
  // @ts-expect-error filtered base prop retains its type
  <Filtered must={123} />;
  const Outside = original('button')<{must: string; count?: number}>({});
  const WrappedOutside = current(Outside)({});
  <WrappedOutside must="ok" />;
  const OldA = original('button')<{must: string; count?: number}>({});
  const OldB = original(OldA)({});
  const OldC = original(OldB)<{extra?: boolean}>({});
  const OldFiltered = original(OldA, {shouldForwardProp: (key): key is 'must' | 'count' => key === 'must' || key === 'count'})({});
  type Assert<T extends true> = T;
  type Eq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false;
  type Cases = [
    Assert<Eq<StyledComponent<'button', Theme, {must: string}>, Original.StyledComponent<'button', Theme, {must: string}>>>,
    Assert<Eq<StyledComponent<'a', Theme, {id?: string}, never>, Original.StyledComponent<'a', Theme, {id?: string}, never>>>,
    Assert<Eq<StyledComponent<'button', Theme, {must: string}, 'must'>, Original.StyledComponent<'button', Theme, {must: string}, 'must'>>>,
    Assert<Eq<StyledComponent<typeof Target, Theme, {must: string}>, Original.StyledComponent<typeof Target, Theme, {must: string}>>>,
    Assert<Eq<React.ComponentProps<typeof B>, React.ComponentProps<typeof OldB>>>,
    Assert<Eq<typeof A, typeof OldA>>, Assert<Eq<typeof B, typeof OldB>>,
    Assert<Eq<typeof C, typeof OldC>>, Assert<Eq<typeof Filtered, typeof OldFiltered>>,
    Assert<Eq<React.ComponentProps<typeof C>, React.ComponentProps<typeof OldC>>>
  ];
`;

for (const [name, jsx] of Object.entries({
  typography: '<Typography variant="h4">Account</Typography>',
  chip: '<Chip label="Active" size="small" />',
  link: '<Link href="/help">Help</Link>',
  stack: '<Stack spacing={2}>Account</Stack>',
  container: '<Container maxWidth="sm">Account</Container>',
  paper: '<Paper elevation={2}>Account</Paper>',
})) {
  module.exports[`default-${name}`] = imports + `
    import Typography from '@mui/material/Typography'; import Chip from '@mui/material/Chip';
    import Link from '@mui/material/Link'; import Stack from '@mui/material/Stack';
    import Container from '@mui/material/Container'; import Paper from '@mui/material/Paper';
    export const element = ${jsx};
  `;
}
