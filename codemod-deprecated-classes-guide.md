# Adding Codemods for Deprecated Classes - Guide

## Overview

Based on the analysis of the existing codemod structure in `packages/mui-codemod/src/deprecations`, here's a comprehensive guide on how to add codemods for deprecated classes.

## Existing Pattern Structure

Each deprecated classes codemod follows this structure:

```
packages/mui-codemod/src/deprecations/{component-name}-classes/
├── index.js                    # Entry point
├── {component-name}-classes.js  # Main transformer logic
├── {component-name}-classes.test.js # Tests
├── postcss-plugin.js           # PostCSS plugin with class mappings
├── postcss.config.js           # PostCSS configuration
└── test-cases/                 # Test case files
```

## Steps to Add a New Codemod

### 1. Create the Directory Structure

Create a new directory under `packages/mui-codemod/src/deprecations/` with the pattern `{component-name}-classes/`.

### 2. Define Deprecated Classes (`postcss-plugin.js`)

This file contains the mapping between deprecated classes and their replacements:

```javascript
const classes = [
  {
    deprecatedClass: '.MuiComponent-oldClass',
    replacementSelector: '.MuiComponent-newClass',
  },
  {
    deprecatedClass: '.MuiComponent-oldClassVariant',
    replacementSelector: '.MuiComponent-newClass.MuiComponent-variant',
  },
  // Add more mappings as needed
];

const plugin = () => {
  return {
    postcssPlugin: `Replace deprecated ComponentName classes with new classes`,
    Rule(rule) {
      const { selector } = rule;

      classes.forEach(({ deprecatedClass, replacementSelector }) => {
        const selectorRegex = new RegExp(`${deprecatedClass}`);

        if (selector.match(selectorRegex)) {
          rule.selector = selector.replace(selectorRegex, replacementSelector);
        }
      });
    },
  };
};
plugin.postcss = true;

module.exports = {
  plugin,
  classes,
};
```

### 3. Create the Main Transformer (`{component-name}-classes.js`)

Two main patterns exist depending on the component:

**Pattern 1: Simple replacement (like Alert)**
```javascript
import { classes } from './postcss-plugin';

/**
 * @param {import('jscodeshift').FileInfo} file
 * @param {import('jscodeshift').API} api
 */
export default function transformer(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const printOptions = options.printOptions;
  
  classes.forEach(({ deprecatedClass, replacementSelector }) => {
    // Handle JavaScript member expressions
    root
      .find(j.ImportDeclaration)
      .filter((path) =>
        path.node.source.value.match(
          new RegExp(`^${options.packageName || '@mui/material'}(/ComponentName)?$`),
        ),
      )
      .forEach((path) => {
        path.node.specifiers.forEach((specifier) => {
          if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'componentClasses') {
            const deprecatedAtomicClass = deprecatedClass.replace('.MuiComponent-', '');
            
            root
              .find(j.MemberExpression, {
                object: { name: specifier.local.name },
                property: { name: deprecatedAtomicClass },
              })
              .forEach((memberExpression) => {
                // Handle template literals for styled components
                // Implementation varies based on complexity
              });
          }
        });
      });

    // Handle CSS selector strings
    const selectorRegex = new RegExp(`^&${deprecatedClass}`);
    root
      .find(
        j.Literal,
        (literal) => typeof literal.value === 'string' && literal.value.match(selectorRegex),
      )
      .forEach((path) => {
        path.replace(j.literal(path.value.value.replace(selectorRegex, `&${replacementSelector}`)));
      });
  });
  
  return root.toSource(printOptions);
}
```

**Pattern 2: Complex replacement with nested selectors (like Button)**
For components with more complex class combinations, the transformer handles:
- Multiple atomic classes in template literals
- Child selector combinations (` > `)
- Multiple class combinations (`.class1.class2`)

### 4. Create Entry Point (`index.js`)

```javascript
export { default } from './component-classes';
```

### 5. Create PostCSS Config (`postcss.config.js`)

```javascript
const { plugin } = require('./postcss-plugin');

module.exports = {
  plugins: [plugin],
};
```

### 6. Add Tests (`{component-name}-classes.test.js`)

Follow the existing test patterns from other components:

```javascript
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import transform from './component-classes';
import readFile from '../../util/readFile';

function read(fileName) {
  return readFile(__dirname, fileName);
}

describe('@mui/codemod', () => {
  describe('deprecations', () => {
    describe('component-classes', () => {
      it('transforms as needed', () => {
        const actual = transform(
          {
            path: 'test.js',
            source: read('./test-cases/actual.js'),
          },
          { jscodeshift: jscodeshift },
          {}
        );

        const expected = read('./test-cases/expected.js');
        expect(actual).to.equal(expected, 'The transformed version should be correct');
      });
    });
  });
});
```

### 7. Create Test Cases

Create `test-cases/` directory with:
- `actual.js` - Input code with deprecated classes
- `expected.js` - Expected output after transformation

## Real Examples from Codebase

### Simple Example: Alert Classes
- **Deprecated**: `.MuiAlert-standardSuccess` 
- **Replacement**: `.MuiAlert-standard.MuiAlert-colorSuccess`

### Complex Example: Button Classes  
- **Deprecated**: `.MuiButton-textPrimary`
- **Replacement**: `.MuiButton-text.MuiButton-colorPrimary`
- **Additional handling**: Icon size classes with child selectors

### Child Selector Example: Linear Progress
- **Deprecated**: ` .MuiLinearProgress-bar1Buffer`
- **Replacement**: `.MuiLinearProgress-buffer > .MuiLinearProgress-bar1`

## Integration Points

### 1. Add to Deprecations All Index
Add the new codemod to `packages/mui-codemod/src/deprecations/all/deprecations-all.js`:

```javascript
// Add import at the top
import transformYourComponentClasses from '../your-component-classes';

// Add transform call in the main function
export default function deprecationsAll(file, api, options) {
  // ... existing transforms
  file.source = transformYourComponentClasses(file, api, options);
  // ... rest of transforms
  return file.source;
}
```

### 2. CLI Usage
The codemod will be automatically available via the CLI once the file structure is in place:

```bash
# Run specific component codemod
npx @mui/codemod deprecations/your-component-classes src

# Run all deprecations codemods
npx @mui/codemod deprecations/all src
```

### 3. Update Documentation
Update migration guides and documentation to reference the new codemod.

## Key Patterns Observed

1. **Class Naming**: Deprecated classes typically combine variant + color/size into single class names
2. **New Structure**: New classes separate concerns (`.variant.color` instead of `.variantColor`)
3. **Child Selectors**: Some deprecations move from single classes to parent-child relationships
4. **Template Literal Handling**: Complex logic for handling styled-components template literals
5. **Import Handling**: Different components have different import patterns to match

## Missing Information

Since PR #46316 wasn't found, specific deprecated classes that need codemods weren't identified. To complete this task, you would need to:

1. Identify the specific component and deprecated classes from the actual PR
2. Determine the mapping from deprecated to new class structure
3. Follow the patterns above to implement the specific codemod

Would you like me to help implement a specific codemod once you provide the details of which component and classes were deprecated?

## Next Steps

To proceed with adding the codemod for PR #46316:

1. **Identify the Deprecated Classes**: We need to determine which component and specific classes were deprecated in that PR
2. **Determine the Mapping**: Understand the new class structure and how deprecated classes should be replaced
3. **Implement Following the Pattern**: Use one of the existing patterns (Alert-style for simple replacements, Button-style for complex nested replacements)
4. **Add Integration**: Register in the `deprecations-all.js` file
5. **Test**: Create comprehensive test cases

Since I couldn't locate PR #46316, you'll need to provide:
- The component name (e.g., Button, Alert, TextField, etc.)
- The deprecated class names and their replacement classes
- Any specific transformation rules or complex mappings

Once you provide these details, I can help you implement the complete codemod following the established patterns.