import { padding, margin } from '../spacing';
import { borderRadius, borderTransform } from '../borders';
import { gap, rowGap, columnGap } from '../cssGrid';
import { paletteTransform } from '../palette';
import { maxWidth, sizingTransform } from '../sizing';

const styleKeys = {
  borderSide: ['border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft', 'outline'],
  borderColor: [
    'borderColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'outlineColor',
  ],
  margin: [
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
  ],
  padding: [
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
  ],

  display: ['display', 'overflow', 'textOverflow', 'visibility', 'whiteSpace'],
  grid: [
    'gridColumn',
    'gridRow',
    'gridAutoFlow',
    'gridAutoColumns',
    'gridAutoRows',
    'gridTemplateColumns',
    'gridTemplateRows',
    'gridTemplateAreas',
    'gridArea',
  ],
};

const createEntries = (keys, value) =>
  keys.reduce((acc, key) => {
    acc[key] = value;
    return acc;
  }, {});

const defaultSxConfig = {
  // borders
  ...createEntries(styleKeys.borderSide, {
    themeKey: 'borders',
    transform: borderTransform,
  }),

  ...createEntries(styleKeys.borderColor, {
    themeKey: 'palette',
  }),

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

  ...createEntries(styleKeys.padding, {
    style: padding,
  }),

  ...createEntries(styleKeys.margin, {
    style: margin,
  }),

  // display
  displayPrint: {
    cssProperty: false,
    transform: (value) => ({
      '@media print': {
        display: value,
      },
    }),
  },
  ...createEntries(styleKeys.display, {}),

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
  gap: {
    style: gap,
  },
  rowGap: {
    style: rowGap,
  },
  columnGap: {
    style: columnGap,
  },
  ...createEntries(styleKeys.grid, {}),

  // positions
  position: {},
  zIndex: {
    themeKey: 'zIndex',
  },
  top: {},
  right: {},
  bottom: {},
  left: {},

  // shadows
  boxShadow: {
    themeKey: 'shadows',
  },

  // sizing
  width: {
    transform: sizingTransform,
  },
  maxWidth: {
    style: maxWidth,
  },
  minWidth: {
    transform: sizingTransform,
  },
  height: {
    transform: sizingTransform,
  },
  maxHeight: {
    transform: sizingTransform,
  },
  minHeight: {
    transform: sizingTransform,
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
