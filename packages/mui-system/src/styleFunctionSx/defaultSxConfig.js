import { padding, margin } from '../spacing';
import { borderRadius, borderTransform } from '../borders';
import { gap, rowGap, columnGap } from '../cssGrid';
import { paletteTransform } from '../palette';
import { maxWidth, sizingTransform } from '../sizing';

const defaultSxConfig = {
  // borders

  ...Object.fromEntries(
    ['border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft', 'outline'].map((prop) => [
      prop,
      {
        themeKey: 'borders',
        transform: borderTransform,
      },
    ]),
  ),
  ...Object.fromEntries(
    [
      'borderColor',
      'borderTopColor',
      'borderRightColor',
      'borderBottomColor',
      'borderLeftColor',
      'outlineColor',
    ].map((prop) => [
      prop,
      {
        themeKey: 'palette',
      },
    ]),
  ),

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
    [
      // display
      'display',
      'overflow',
      'textOverflow',
      'visibility',
      'whiteSpace',
      // flexbox
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
      // grid
      'gridColumn',
      'gridRow',
      'gridAutoFlow',
      'gridAutoColumns',
      'gridAutoRows',
      'gridTemplateColumns',
      'gridTemplateRows',
      'gridTemplateAreas',
      'gridArea',
      // positions
      'position',
      'top',
      'right',
      'bottom',
      'left',
      // typography
      'letterSpacing',
      'textTransform',
      'lineHeight',
      'textAlign',
    ].map((prop) => [prop, {}]),
  ),
  // grid
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
  zIndex: {
    themeKey: 'zIndex',
  },

  // shadows
  boxShadow: {
    themeKey: 'shadows',
  },

  // sizing
  ...Object.fromEntries(
    ['width', 'minWidth', 'height', 'maxHeight', 'minHeight'].map((prop) => [
      prop,
      {
        transform: sizingTransform,
      },
    ]),
  ),

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
  typography: {
    cssProperty: false,
    themeKey: 'typography',
  },
};

export default defaultSxConfig;
