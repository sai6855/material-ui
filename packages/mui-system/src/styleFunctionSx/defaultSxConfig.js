import { padding, margin } from '../spacing';
import { borderRadius, borderTransform } from '../borders';
import { gap, rowGap, columnGap } from '../cssGrid';
import { paletteTransform } from '../palette';
import { maxWidth, sizingTransform } from '../sizing';

const defaultSxConfig = {
  // borders

  ...Object.fromEntries([
    'border',
    'borderTop',
    'borderRight',
    'borderBottom',
    'borderLeft',
    'outline',
  ]).map((prop) => [
    prop,
    {
      themeKey: 'borders',
      transform: borderTransform,
    },
  ]),
  ...Object.fromEntries([
    'borderColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'outlineColor',
  ]).map((prop) => [
    prop,
    {
      themeKey: 'palette',
    },
  ]),

  borderRadius: {
    themeKey: 'shape.borderRadius',
    style: borderRadius,
  },

  // palette
  color: {
    themeKey: 'palette',
    transform: paletteTransform,
  },
  bgcolor: {
    themeKey: 'palette',
    cssProperty: 'backgroundColor',
    transform: paletteTransform,
  },
  backgroundColor: {
    themeKey: 'palette',
    transform: paletteTransform,
  },

  // spacing

  ...Object.fromEntries(
    [
      'p',
      'pt',
      'pr',
      'pb',
      'pl',
      'px',
      'py',
      'padding',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
      'paddingX',
      'paddingY',
      'paddingInline',
      'paddingInlineStart',
      'paddingInlineEnd',
      'paddingBlock',
      'paddingBlockStart',
      'paddingBlockEnd',
    ].map((prop) => [prop, { style: padding }]),
  ),

  ...Object.fromEntries(
    [
      'm',
      'mt',
      'mr',
      'mb',
      'ml',
      'mx',
      'my',
      'margin',
      'marginTop',
      'marginRight',
      'marginBottom',
      'marginLeft',
      'marginX',
      'marginY',
      'marginInline',
      'marginInlineStart',
      'marginInlineEnd',
      'marginBlock',
      'marginBlockStart',
      'marginBlockEnd',
    ].map((prop) => [prop, { style: margin }]),
  ),

  // display
  displayPrint: {
    cssProperty: false,
    transform: (value) => ({
      '@media print': {
        display: value,
      },
    }),
  },

  ...Object.fromEntries(
    ['displayPrint', 'display', 'overflow', 'textOverflow', 'visibility', 'whiteSpace'].map(
      (prop) => [prop, {}],
    ),
  ),

  // flexbox
  ...Object.fromEntries(
    [
      'flexBasis',
      'flexDirection',
      'flexWrap',
      'justifyContent',
      'alignItems',
      'alignContent',
      'order',
      'flex',
      'flexGrow',
      'flexShrink',
      'alignSelf',
      'justifyItems',
      'justifySelf',
    ].map((prop) => [prop, {}]),
  ),

  // grid
  ...Object.fromEntries([
    'gridColumn',
    'gridRow',
    'gridAutoFlow',
    'gridAutoColumns',
    'gridAutoRows',
    'gridTemplateColumns',
    'gridTemplateRows',
    'gridTemplateAreas',
    'gridArea',
  ]).map((prop) => [prop, {}]),

  gap: {
    style: gap,
  },
  rowGap: {
    style: rowGap,
  },
  columnGap: {
    style: columnGap,
  },

  // positions
  ...Object.fromEntries(['position', 'top', 'right', 'bottom', 'left']).map((prop) => [prop, {}]),
  zIndex: {
    themeKey: 'zIndex',
  },

  // shadows
  boxShadow: {
    themeKey: 'shadows',
  },

  // sizing
  ...Object.fromEntries(['width', 'minWidth', 'height', 'maxHeight', 'minHeight']).map((prop) => [
    prop,
    {
      transform: sizingTransform,
    },
  ]),

  maxWidth: {
    style: maxWidth,
  },
  boxSizing: {},

  // typography
  font: {
    themeKey: 'font',
  },
  fontFamily: {
    themeKey: 'typography',
  },
  fontSize: {
    themeKey: 'typography',
  },
  fontStyle: {
    themeKey: 'typography',
  },
  fontWeight: {
    themeKey: 'typography',
  },
  letterSpacing: {},
  textTransform: {},
  lineHeight: {},
  textAlign: {},
  typography: {
    cssProperty: false,
    themeKey: 'typography',
  },
};

export default defaultSxConfig;
