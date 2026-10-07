module.exports = {
  baseline: (_name, text) => text,
  'sc-private-cache-value-gate-legacy': (name, text) => module.exports['sc-private-cache-value-gate'](name, text)
    .replaceAll('CacheField<NoInfer<C>, "root">', 'CacheField<C, "root">'),
  'sc-private-cache-value-gate': (name, text) => module.exports['sc-private-factory-cache'](name, text)
    .replaceAll('typeof styledInfo extends keyof C ? unknown : never', '[CacheField<NoInfer<C>, "root">] extends [never] ? never : unknown'),
  'sc-private-cache-noinfer': (name, text) => module.exports['sc-private-factory-cache'](name, text)
    .replaceAll('typeof styledInfo extends keyof C ? unknown : never', 'typeof styledInfo extends keyof NoInfer<C> ? unknown : never'),
  'sc-private-cache-preserve-attrs': (name, text) => {
    if (name !== 'packages/mui-styled-engine-sc/src/index.ts') return text;
    const ts = require('typescript');
    const file = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const declaration = file.statements.find(node => ts.isInterfaceDeclaration(node) && node.name.text === 'ThemedBaseStyledInterface');
    let result = module.exports['sc-private-factory-cache'](name, text);
    for (const member of declaration.members.slice(0, 2)) {
      const original = member.getText(file);
      const returned = member.type.getText(file);
      const legacy = returned.replace('CreateStyledComponent<', 'LegacyCreateStyledComponent<');
      result = result.replace(original, original.replace(returned,
        `[StyledComponentInnerAttrs<C>] extends [never] ? ${returned} : ${legacy}`));
    }
    return result + '\ntype LegacyCreateStyledComponent<P extends {}, S extends {} = {}, J extends {} = {}, T extends object = {}, A extends keyof any = never> = ThemedStyledFunction<React.ComponentType<P>, T, S & J, A>;\n';
  },
  'sc-private-factory-cache': (name, text) => {
    if (name !== 'packages/mui-styled-engine-sc/src/index.ts') return text;
    const ts = require('typescript');
    const file = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const declaration = file.statements.find(node => ts.isInterfaceDeclaration(node) && node.name.text === 'ThemedBaseStyledInterface');
    const factory = file.statements.find(node => ts.isInterfaceDeclaration(node) && node.name.text === 'ThemedStyledFunctionBase');
    const alias = file.statements.find(node => ts.isTypeAliasDeclaration(node) && node.name.text === 'CreateStyledComponent');
    const fast = declaration.members.slice(0, 2).map(node => node.getText(file)
      .replaceAll('C extends StyledComponentInstance', 'C extends ShallowStyledInstance')
      .replaceAll('StyledComponentInnerProps<C, Theme>', 'CachedInnerProps<C, Theme>')
      .replaceAll('StyledComponentInnerOtherProps<C>', 'CacheField<C, "other">')
      .replaceAll('StyledComponentInnerAttrs<C>', 'CacheField<C, "attrs">')
      .replace(/(component:\s*)C(?=,)/, '$1C & (typeof styledInfo extends keyof C ? unknown : never)')).join('\n');
    const offset = text.indexOf('{', declaration.typeParameters.end);
    const modifiedAlias = alias.getText(file).replace('ThemedStyledFunction<', 'CachedStyledFunction<');
    let result = text.slice(0, alias.pos) + modifiedAlias + text.slice(alias.end);
    result = result.slice(0, offset + 1) + '\n' + fast + '\n' + result.slice(offset + 1);
    return result + '\n' + factory.getText(file).replace('export interface ThemedStyledFunctionBase<', 'interface CachedStyledFunction<')
      .replaceAll('): StyledComponent<', '): CachedStyledComponent<') + `
      declare const styledInfo: unique symbol;
      type CachedStyledComponent<C extends keyof React.JSX.IntrinsicElements | React.ComponentType<any>, T extends object, O extends object, A extends keyof any> = StyledComponent<C, T, O, A> & {[styledInfo]?: {root: C; other: O; attrs: A}};
      type ShallowStyledInstance = string & React.ComponentType<any> & {readonly $$typeof: symbol; withComponent: (component: any) => any};
      type CacheField<C, K extends 'root' | 'other' | 'attrs'> = C extends {[styledInfo]?: infer Info} ? Info extends Record<K, infer Value> ? Value : never : never;
      type CachedInnerProps<C extends ShallowStyledInstance, T extends object> = StyledComponentProps<Extract<CacheField<C, 'root'>, React.ComponentType<any> | keyof React.JSX.IntrinsicElements>, T, Extract<CacheField<C, 'other'>, object>, Extract<CacheField<C, 'attrs'>, keyof any>>;
    `;
  },
  'sc-cached-component-info': (name, text) => {
    if (name !== 'packages/mui-styled-engine-sc/src/index.ts') return text;
    const ts = require('typescript');
    const file = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const printer = ts.createPrinter();
    const info = '\ndeclare const styledInfo: unique symbol;\n';
    const statements = file.statements.map(node => {
      if (!ts.isTypeAliasDeclaration(node)) return node.getFullText(file);
      const alias = node.name.text;
      if (alias === 'StyledComponent') return node.getFullText(file).replace(/;\s*$/, ' & {[styledInfo]?: {root: C; other: O; attrs: A}};');
      const field = {StyledComponentInnerComponent: 'root', StyledComponentInnerOtherProps: 'other', StyledComponentInnerAttrs: 'attrs'}[alias];
      if (!field) return node.getFullText(file);
      const original = printer.printNode(ts.EmitHint.Unspecified, node.type, file);
      const prefix = node.getFullText(file).slice(0, node.getFullText(file).indexOf('=') + 1);
      return prefix + ` C extends unknown ? typeof styledInfo extends keyof C ? C extends {[styledInfo]?: {${field}: infer Result}} ? Result : never : (${original}) : never;`;
    });
    return statements.join('\n') + info;
  },
  'sc-cached-info-shallow': (name, text) => module.exports['sc-shallow-overloads-only'](name,
    module.exports['sc-cached-component-info'](name, text)),
  'sc-cached-info-fast-overloads': (name, text) => {
    if (name !== 'packages/mui-styled-engine-sc/src/index.ts') return text;
    const cached = module.exports['sc-cached-component-info'](name, text);
    const ts = require('typescript');
    const file = ts.createSourceFile(name, cached, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const declaration = file.statements.find(node => ts.isInterfaceDeclaration(node) && node.name.text === 'ThemedBaseStyledInterface');
    const fast = declaration.members.slice(0, 2).map(node => node.getText(file)
      .replaceAll('C extends StyledComponentInstance', 'C extends ShallowStyledInstance')
      .replaceAll('StyledComponentInnerProps<C, Theme>', 'ShallowStyledInnerProps<C, Theme>')
      .replace(/(component:\s*)C(?=,)/, '$1C & (typeof styledInfo extends keyof C ? unknown : never)')).join('\n');
    const offset = cached.indexOf('{', declaration.typeParameters.end);
    if (offset < 0) throw new Error('Interface body not found');
    return cached.slice(0, offset + 1) + '\n' + fast + '\n' + cached.slice(offset + 1) + `
      type ShallowStyledInstance = string & React.ComponentType<any> & {readonly $$typeof: symbol; withComponent: (component: any) => any};
      type ShallowStyledInnerProps<C extends AnyStyledComponent, T extends object> = StyledComponentProps<StyledComponentInnerComponent<C>, T, StyledComponentInnerOtherProps<C>, StyledComponentInnerAttrs<C>>;
    `;
  },
  'sc-shallow-overloads-only': (name, text) => {
    if (name !== 'packages/mui-styled-engine-sc/src/index.ts') return text;
    const start = text.indexOf('export interface ThemedBaseStyledInterface<');
    const end = text.indexOf('export type CreateMUIStyled<', start);
    if (start < 0 || end < 0) throw new Error('Styled interface not found');
    const body = text.slice(start, end).replaceAll('C extends StyledComponentInstance', 'C extends ShallowStyledInstance')
      .replaceAll('StyledComponentInnerProps<C, Theme>', 'ShallowStyledInnerProps<C, Theme>');
    return text.slice(0, start) + body + text.slice(end) + `
      type ShallowStyledInstance = string & React.ComponentType<any> & {readonly $$typeof: symbol; withComponent: (component: any) => any};
      type ShallowStyledInnerProps<C extends AnyStyledComponent, T extends object> = StyledComponentProps<StyledComponentInnerComponent<C>, T, StyledComponentInnerOtherProps<C>, StyledComponentInnerAttrs<C>>;
    `;
  },
  'sc-shallow-instance-constraint': (name, text) => name === 'packages/mui-styled-engine-sc/src/index.ts'
    ? text.replace(/type StyledComponentInstance\s*=\s*StyledComponent<any, any, any, any> \| StyledComponent<any, any, any>;/,
      'type StyledComponentInstance = string & React.ComponentType<any> & { readonly $$typeof: symbol; withComponent: (component: any) => any };') : text,
  'sc-shallow-never-constraint': (name, text) => module.exports['sc-shallow-instance-constraint'](name, text)
    .replace('type StyledComponentInstance = string & React.ComponentType<any>',
      'type StyledComponentInstance = string & React.JSXElementConstructor<never>'),
  'sc-shallow-with-deep-gate': (name, text) => {
    if (name !== 'packages/mui-styled-engine-sc/src/index.ts') return text;
    return module.exports['sc-shallow-instance-constraint'](name, text)
      .replace(/(<\s*C extends StyledComponentInstance[\s\S]*?>\(\s*component: )C(?=,)/g,
        '$1C & (C extends DeepStyledComponentInstance ? unknown : never)')
      + '\ntype DeepStyledComponentInstance = StyledComponent<any, any, any, any> | StyledComponent<any, any, any>;\n';
  },
  'sc-base-theme-variance': (name, text) => name === 'packages/mui-styled-engine-sc/src/index.ts'
    ? text.replace(/export interface StyledComponentBase<([\s\S]*?)> extends ForwardRefExoticBase/,
      (_match, params) => 'export interface StyledComponentBase<' + params.replace(/\bT extends/, 'in out T extends') + '> extends ForwardRefExoticBase') : text,
  'sc-base-root-variance': (name, text) => name === 'packages/mui-styled-engine-sc/src/index.ts'
    ? text.replace(/export interface StyledComponentBase<([\s\S]*?)> extends ForwardRefExoticBase/,
      (_match, params) => 'export interface StyledComponentBase<' + params.replace(/\bC extends/, 'in out C extends') + '> extends ForwardRefExoticBase') : text,
  'sc-base-attrs-variance': (name, text) => name === 'packages/mui-styled-engine-sc/src/index.ts'
    ? text.replace(/export interface StyledComponentBase<([\s\S]*?)> extends ForwardRefExoticBase/,
      (_match, params) => 'export interface StyledComponentBase<' + params.replace(/\bA extends/, 'in out A extends') + '> extends ForwardRefExoticBase') : text,
  'css-variants-named-ast': (name, text) => {
    if (name !== 'packages/mui-styled-engine/src/index.ts') return text;
    const ts = require('typescript');
    const file = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    let body;
    const transformed = ts.transform(file, [context => root => {
      const visit = node => {
        if (ts.isIntersectionTypeNode(node) && node.types.length === 2 &&
            ts.isTypeReferenceNode(node.types[0]) && node.types[0].typeName.getText(file) === 'CSSObject' &&
            ts.isTypeLiteralNode(node.types[1])) {
          body = node.types[1].members.map(member => member.getText(file)).join('\n');
          return ts.factory.createTypeReferenceNode('CSSObjectWithVariants', [ts.factory.createTypeReferenceNode('Props')]);
        }
        return ts.visitEachChild(node, visit, context);
      };
      return ts.visitNode(root, visit);
    }]);
    if (!body) throw new Error('Variant intersection not found');
    const result = ts.createPrinter().printFile(transformed.transformed[0]) +
      '\ninterface CSSObjectWithVariants<Props> extends CSSObject {\n' + body + '\n}\n';
    transformed.dispose();
    return result;
  },
  'overridable-default-first-guarded': (name, text) => {
    if (name !== 'packages/mui-types/src/index.ts' && name !== 'packages/mui-material/src/OverridableComponent/index.ts') return text;
    return text.replace(/export interface OverridableComponent<([A-Za-z]+) extends OverridableTypeMap> \{/, (match, parameter) =>
      match + `\n  (props: DefaultComponentProps<${parameter}> & { component?: never }): React.JSX.Element | null;\n`);
  },
  'overridable-never-default': (name, text) => name === 'packages/mui-material/src/OverridableComponent/index.ts'
    ? text.replace('<RootComponent extends React.ElementType>(', '<RootComponent extends React.ElementType = never>(')
    : name === 'packages/mui-types/src/index.ts'
      ? text.replace('<C extends React.ElementType>(', '<C extends React.ElementType = never>(') : text,
  'overridable-root-default': (name, text) => name === 'packages/mui-material/src/OverridableComponent/index.ts'
    ? text.replace('<RootComponent extends React.ElementType>(', "<RootComponent extends React.ElementType = TypeMap['defaultComponent']>(")
    : name === 'packages/mui-types/src/index.ts'
      ? text.replace('<C extends React.ElementType>(', "<C extends React.ElementType = M['defaultComponent']>(") : text,
  'overridable-root-noinfer': (name, text) => name === 'packages/mui-material/src/OverridableComponent/index.ts'
    ? text.replace('} & OverrideProps<TypeMap, RootComponent>', '} & OverrideProps<TypeMap, NoInfer<RootComponent>>')
    : name === 'packages/mui-types/src/index.ts'
      ? text.replace('} & OverrideProps<M, C>', '} & OverrideProps<M, NoInfer<C>>') : text,
  'overridable-props-noinfer': (name, text) => name === 'packages/mui-material/src/OverridableComponent/index.ts'
    ? text.replace('} & OverrideProps<TypeMap, RootComponent>', '} & NoInfer<OverrideProps<TypeMap, RootComponent>>')
    : name === 'packages/mui-types/src/index.ts'
      ? text.replace('} & OverrideProps<M, C>', '} & NoInfer<OverrideProps<M, C>>') : text,
  'input-base-props-intersection': (name, text) => name === 'packages/mui-material/src/InputBase/InputBase.d.ts'
    ? text.replace(/export interface InputBaseComponentProps\s*extends React\.HTMLAttributes<\s*HTMLInputElement \| HTMLTextAreaElement\s*> \{/,
      'export type InputBaseComponentProps = React.HTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {') : text,
  'input-base-props-generic': (name, text) => name === 'packages/mui-material/src/InputBase/InputBase.d.ts'
    ? text.replace(/export interface InputBaseComponentProps\s*extends React\.HTMLAttributes<\s*HTMLInputElement \| HTMLTextAreaElement\s*> \{/,
      'export interface InputBaseComponentProps<Element extends HTMLElement = HTMLInputElement | HTMLTextAreaElement> extends React.HTMLAttributes<Element> {') : text,
  'overridable-intrinsic-reflection': (name, text) => {
    if (name !== 'packages/mui-types/src/index.ts' && name !== 'packages/mui-material/src/OverridableComponent/index.ts') return text;
    return text.replaceAll('React.ComponentPropsWithRef<', 'RootPropsWithRef<') + `
      type RootPropsWithRef<C extends React.ElementType> = C extends keyof React.JSX.IntrinsicElements
        ? React.JSX.IntrinsicElements[C] : React.ComponentPropsWithRef<C>;
    `;
  },
  'overridable-intrinsic-and-never': (name, text) => module.exports['overridable-intrinsic-reflection'](name,
    module.exports['overridable-never-default'](name, text)),
  'autocomplete-owner-interface': (name, text) => name === 'packages/mui-material/src/Autocomplete/Autocomplete.d.ts'
    ? text.replace('export type AutocompleteOwnerState<', 'export interface AutocompleteOwnerState<')
      .replace(
        "> = AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo, ChipComponent> & {",
        '> extends AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo, ChipComponent> {',
      ) : text,
  'select-interfaces': (name, text) => name === 'packages/mui-material/src/Select/Select.d.ts'
    ? text.replace(
      /export type SelectProps<Value = unknown> =[\s\S]*?\| \(OutlinedSelectProps & BaseSelectProps<Value>\);/,
      `interface FilledSelectPropsWithValue<Value> extends FilledSelectProps, BaseSelectProps<Value> {}
       interface StandardSelectPropsWithValue<Value> extends StandardSelectProps, BaseSelectProps<Value> {}
       interface OutlinedSelectPropsWithValue<Value> extends OutlinedSelectProps, BaseSelectProps<Value> {}
       export type SelectProps<Value = unknown> = FilledSelectPropsWithValue<Value> | StandardSelectPropsWithValue<Value> | OutlinedSelectPropsWithValue<Value>;`,
    ) : text,
  'select-interfaces-invariant': (name, text) => module.exports['select-interfaces'](name, text)
    .replaceAll('SelectPropsWithValue<Value>', 'SelectPropsWithValue<in out Value>')
    .replaceAll('SelectPropsWithValue<in out Value> |', 'SelectPropsWithValue<Value> |')
    .replaceAll('SelectPropsWithValue<in out Value>;', 'SelectPropsWithValue<Value>;'),
  'string-union-fast-path': (name, text) => name === 'packages/mui-types/src/index.ts'
    ? text.replace('export type OverridableStringUnion<T extends string, U = {}> = GenerateStringUnion<',
      'export type OverridableStringUnion<T extends string, U = {}> = [keyof U] extends [never] ? T : GenerateStringUnion<') : text,
  'string-union-direct-record': (name, text) => name === 'packages/mui-types/src/index.ts'
    ? text.replace('Overwrite<Record<T, true>, U>', 'Record<Exclude<T, keyof U>, true> & U') : text,
  'string-union-key-filter': (name, text) => name === 'packages/mui-types/src/index.ts'
    ? text.replace(/type GenerateStringUnion<T> = Extract<[\s\S]*?,\s*string\s*>;/,
      'type GenerateStringUnion<T> = keyof { [Key in keyof T & string as true extends T[Key] ? Key : never]: unknown };') : text,
  'empty-data-fast-path': (name, text) => name === 'packages/mui-utils/src/types/DataAttributes.ts'
    ? text.replace('export type WithDataAttributes<T> = T | (T & DataAttributesOverrides);',
      'export type WithDataAttributes<T> = [keyof DataAttributesOverrides] extends [never] ? T : T | (T & DataAttributesOverrides);') : text,
  'autocomplete-invariant': (name, text) => name === 'packages/mui-material/src/Autocomplete/Autocomplete.d.ts'
    ? text.replace(/export interface AutocompleteProps<([\s\S]*?)>\s*extends/, (_match, parameters) =>
      `export interface AutocompleteProps<${parameters.replace(/\b(Value|Multiple|DisableClearable|FreeSolo|ChipComponent)(?=\s*[,\n]|\s+extends)/g, 'in out $1')}> extends`) : text,
  'autocomplete-invariant-value': (name, text) => name === 'packages/mui-material/src/Autocomplete/Autocomplete.d.ts'
    ? text.replace('export interface AutocompleteProps<\n  Value,', 'export interface AutocompleteProps<\n  in out Value,') : text,
  'autocomplete-invariant-chip': (name, text) => name === 'packages/mui-material/src/Autocomplete/Autocomplete.d.ts'
    ? text.replace(/export interface AutocompleteProps<([\s\S]*?)>\s*extends/, (_match, parameters) =>
      `export interface AutocompleteProps<${parameters.replace('ChipComponent extends', 'in out ChipComponent extends')}> extends`) : text,
  'autocomplete-invariant-booleans': (name, text) => name === 'packages/mui-material/src/Autocomplete/Autocomplete.d.ts'
    ? text.replace(/export interface AutocompleteProps<([\s\S]*?)>\s*extends/, (_match, parameters) =>
      `export interface AutocompleteProps<${parameters.replace(/\b(Multiple|DisableClearable|FreeSolo)(?=\s+extends)/g, 'in out $1')}> extends`) : text,
  'styled-nonrecursive-constraint': (name, text) => name === 'packages/mui-styled-engine/src/index.ts'
    ? text.replaceAll('C extends React.ComponentClass<React.ComponentProps<C>>', 'C extends React.ComponentClass<any>')
      .replaceAll('C extends React.JSXElementConstructor<React.ComponentProps<C>>', 'C extends React.JSXElementConstructor<any>') : text,
  'theme-vars-direct': (name, text) => name === 'packages/mui-material/src/styles/createThemeFoundation.ts'
    ? text.replace('type NormalizeVars<T> = ConcatDeep<Split<T>>;', [
      'type NormalizeVars<T> = {',
      '  [K in keyof T & (string | number)]: Exclude<T[K], undefined> extends infer V',
      '    ? V extends string | number ? K : keyof V extends string | number',
      '      ? `${K}-${NormalizeVars<V>}` : never : never;',
      '}[keyof T & (string | number)];',
    ].join('\n')) : text,
  'slot-intrinsic-first': (name, text) => name === 'packages/mui-utils/src/types/index.ts'
    ? text.replaceAll('React.ComponentPropsWithRef<TSlotComponent>', 'FastSlotProps<TSlotComponent>') + `
      type FastSlotProps<C extends React.ElementType> = C extends keyof React.JSX.IntrinsicElements
        ? React.JSX.IntrinsicElements[C] : React.ComponentPropsWithRef<C>;
    ` : text,
  'slot-props-named-interface': (name, text) => name === 'packages/mui-utils/src/types/index.ts'
    ? text.replaceAll('Partial<React.ComponentPropsWithRef<TSlotComponent>> & TOverrides',
      'Partial<React.ComponentPropsWithRef<TSlotComponent>> & TOverrides')
      .replace(/\| \(\(\s*ownerState: TOwnerState,\s*\) => WithDataAttributes<Partial<React.ComponentPropsWithRef<TSlotComponent>> & TOverrides>\);/,
        '| SlotPropsCallback<TOwnerState, WithDataAttributes<Partial<React.ComponentPropsWithRef<TSlotComponent>> & TOverrides>>;') + `
      interface SlotPropsCallback<in Owner, out Props> { (ownerState: Owner): Props; }
    ` : text,
  'chip-own-props-interface': (name, text) => name === 'packages/mui-material/src/Chip/Chip.d.ts'
    ? text.replace("export type ChipProps<", "export type ChipProps<")
      .replace(/= OverrideProps<ChipTypeMap<AdditionalProps, RootComponent>, RootComponent> & \{\s*component\?: React.ElementType \| undefined;\s*\};/,
        "= ChipOwnProps & DistributiveOmit<React.ComponentPropsWithRef<RootComponent>, keyof ChipOwnProps> & AdditionalProps & { component?: React.ElementType | undefined };\n") : text,
  'sx-variance': (name, text) => name === 'packages/mui-system/src/styleFunctionSx/styleFunctionSx.ts'
    ? text.replace('CSSPseudoSelectorProps<Theme extends', 'CSSPseudoSelectorProps<in Theme extends')
      .replace('CSSSelectorObject<Theme extends', 'CSSSelectorObject<in Theme extends')
      .replace('CSSSelectorObjectOrCssVariables<Theme extends', 'CSSSelectorObjectOrCssVariables<in Theme extends')
      .replace('SystemCssProperties<Theme extends', 'SystemCssProperties<in Theme extends') : text,
  'sx-system-variance': (name, text) => name === 'packages/mui-system/src/styleFunctionSx/styleFunctionSx.ts'
    ? text.replace('SystemCssProperties<Theme extends', 'SystemCssProperties<in Theme extends') : text,
  'overridable-variance': (name, text) => name === 'packages/mui-types/src/index.ts' || name === 'packages/mui-material/src/OverridableComponent/index.ts'
    ? text.replace('OverridableComponent<M extends', 'OverridableComponent<in M extends')
      .replace('OverridableComponent<TypeMap extends', 'OverridableComponent<in TypeMap extends') : text,
  'slots-map-variance': (name, text) => name === 'packages/mui-material/src/utils/types.ts'
    ? text.replace('CreateSlotsAndSlotProps<Slots, K extends', 'CreateSlotsAndSlotProps<out Slots, out K extends') : text,
  'interpolation-remove-redundant-css': (name, text) => name === 'packages/mui-styled-engine/src/index.ts'
    ? text.replace('  | CSSPropertiesWithMultiValues\n', '') : text,
  'interpolation-variant-aliases': (name, text) => name === 'packages/mui-styled-engine/src/index.ts'
    ? text.replace(
      "(Props extends { ownerState: infer O }\n                  ? Partial<Omit<Props, 'ownerState'> & O>\n                  : Partial<Props>)",
      'VariantMatchProps<Props>')
      .replace("Props extends { ownerState: infer O }\n                    ? Props & O & { ownerState: O }\n                    : Props", 'VariantPredicateProps<Props>') + `
        type VariantMatchProps<Props> = Props extends {ownerState: infer O} ? Partial<Omit<Props, 'ownerState'> & O> : Partial<Props>;
        type VariantPredicateProps<Props> = Props extends {ownerState: infer O} ? Props & O & {ownerState: O} : Props;
      ` : text,
  'select-invariant-value': (name, text) => name === 'packages/mui-material/src/Select/Select.d.ts'
    ? text.replace('BaseSelectProps<Value = unknown>', 'BaseSelectProps<in out Value = unknown>') : text,
  'use-autocomplete-invariant': (name, text) => name === 'packages/mui-material/src/useAutocomplete/useAutocomplete.d.ts'
    ? text.replace(/export interface UseAutocompleteProps<([\s\S]*?)>\s*\{/, (_match, parameters) =>
      `export interface UseAutocompleteProps<${parameters.replace(/\b(Value|Multiple|DisableClearable|FreeSolo)(?=\s*[,\n]|\s+extends)/g, 'in out $1')}> {`) : text,
  'css-variants-interface': (name, text) => {
    if (name !== 'packages/mui-styled-engine/src/index.ts') return text;
    const start = text.indexOf('  | (CSSObject & {');
    const end = text.indexOf('  | ArrayInterpolation<Props>;', start);
    const endMarker = text.indexOf('    })\n  | ArrayInterpolation<Props>', start);
    if (start < 0 || endMarker < 0) throw new Error('CSS variants block not found');
    const body = text.slice(start + '  | (CSSObject & {'.length, endMarker);
    return text.slice(0, start) + '  | CSSObjectWithVariants<Props>\n' + text.slice(endMarker + '    })\n'.length)
      + '\ninterface CSSObjectWithVariants<Props> extends CSSObject {' + body + '\n}\n';
  },
  'component-slots-direct-props': (name, text) => {
    if (!name.startsWith('packages/mui-material/src/') || !name.endsWith('.d.ts')) return text;
    if (!text.includes('SlotProps<')) return text;
    return text.replace(/React\.ElementType</g, 'React.JSXElementConstructor<');
  },
  'component-slots-known-props': (name, text) => {
    if (!name.startsWith('packages/mui-material/src/') || !name.endsWith('.d.ts')) return text;
    if (!text.includes('SlotProps<')) return text;
    return text.replace(/React\.ElementType</g, 'React.ComponentType<');
  },
  'slot-optional-fast-path': (name, text) => name === 'packages/mui-utils/src/types/index.ts'
    ? text.replaceAll('Partial<React.ComponentPropsWithRef<TSlotComponent>>', 'OptionalSlotProps<React.ComponentPropsWithRef<TSlotComponent>>') + `
      type OptionalSlotProps<T> = 0 extends (1 & T) ? Partial<T>
        : T extends object ? {} extends T ? T : Partial<T> : Partial<T>;
    ` : text,
  'slot-optional-dom-fast-path': (name, text) => name === 'packages/mui-utils/src/types/index.ts'
    ? text.replaceAll('Partial<React.ComponentPropsWithRef<TSlotComponent>>', 'OptionalSlotProps<TSlotComponent>') + `
      type OptionalSlotProps<C extends React.ElementType> = C extends keyof React.JSX.IntrinsicElements
        ? {} extends React.JSX.IntrinsicElements[C] ? React.JSX.IntrinsicElements[C] : Partial<React.JSX.IntrinsicElements[C]>
        : Partial<React.ComponentPropsWithRef<C>>;
    ` : text,
  'slot-trim-intrinsic-comparison': (name, text) => {
    if (name === 'packages/mui-material/src/utils/types.ts') return text + [
      'type IntrinsicKeys = { [Tag in keyof React.JSX.IntrinsicElements]: keyof React.JSX.IntrinsicElements[Tag] }[keyof React.JSX.IntrinsicElements];',
      'type IntrinsicCandidate<P> = P extends unknown ? Pick<P, Extract<IntrinsicKeys, keyof P>> : never;',
      'type MatchingTags<P> = { [Tag in keyof React.JSX.IntrinsicElements]: P extends React.JSX.IntrinsicElements[Tag] ? Tag : never }[keyof React.JSX.IntrinsicElements];',
      'export type TrimmedElementType<P> = MatchingTags<IntrinsicCandidate<P>> | React.ComponentType<P>;',
    ].join('\n');
    if (!name.startsWith('packages/mui-material/src/') || !name.endsWith('.d.ts') || !text.includes('SlotProps<') || !text.includes('React.ElementType<')) return text;
    return "import type { TrimmedElementType } from '../utils/types';\n" + text.replaceAll('React.ElementType<', 'TrimmedElementType<');
  },
  'omit-no-overlap-pick': (name, text) => name === 'packages/mui-types/src/index.ts'
    ? text.replace('T extends any ? Omit<T, K> : never;',
      'T extends any ? [Extract<keyof T, K>] extends [never] ? Pick<T, keyof T> : Omit<T, K> : never;') : text,
  'omit-no-overlap-identity': (name, text) => name === 'packages/mui-types/src/index.ts'
    ? text.replace('T extends any ? Omit<T, K> : never;',
      'T extends any ? [Extract<keyof T, K>] extends [never] ? T : Omit<T, K> : never;') : text,
  'omit-overlap-intersection': (name, text) => name === 'packages/mui-types/src/index.ts'
    ? text.replace('T extends any ? Omit<T, K> : never;',
      'T extends any ? [keyof T & K] extends [never] ? Pick<T, keyof T> : Omit<T, K> : never;') : text,
  'omit-overlap-intersection-identity': (name, text) => name === 'packages/mui-types/src/index.ts'
    ? text.replace('T extends any ? Omit<T, K> : never;',
      'T extends any ? [keyof T & K] extends [never] ? T : Omit<T, K> : never;') : text,
  'merge-slots-component-constraint': (name, text) => name === 'packages/mui-material/src/utils/mergeSlotProps.ts'
    ? text.replaceAll('SlotComponentProps<React.ElementType, {}, {}>', 'SlotComponentProps<React.ComponentType<any>, {}, {}>') : text,
  'merge-slots-any-props-constraint': (name, text) => name === 'packages/mui-material/src/utils/mergeSlotProps.ts'
    ? text.replaceAll('SlotComponentProps<React.ElementType, {}, {}>', 'Record<string, any> | ((ownerState: {}) => Record<string, any>)') : text,
  'chip-canonical-map': (name, text) => name === 'packages/mui-material/src/Chip/Chip.d.ts'
    ? text.replace('OverrideProps<ChipTypeMap<AdditionalProps, RootComponent>, RootComponent>',
      'OverrideProps<ChipTypeMap<AdditionalProps>, RootComponent>') : text,
  'props-canonical-map': (name, text) => name.startsWith('packages/mui-material/src/') && name.endsWith('.d.ts')
    ? text.replace(/OverrideProps<(\w+TypeMap)<AdditionalProps, RootComponent>, RootComponent>/g,
      'OverrideProps<$1<AdditionalProps>, RootComponent>') : text,
  'override-props-base-helper': (name, text) => {
    if (name !== 'packages/mui-material/src/OverridableComponent/index.ts' && name !== 'packages/mui-types/src/index.ts') return text;
    return text.replace(/>\s*=\s*\(\s*& BaseProps<([A-Za-z]+)>\s*& DistributiveOmit<React\.ComponentPropsWithRef<([A-Za-z]+)>, keyof BaseProps<\1>>\s*\);/g,
      '> = OverridePropsWithBase<BaseProps<$1>, $2>;') + '\ntype OverridePropsWithBase<Props, C extends React.ElementType> = Props & DistributiveOmit<React.ComponentPropsWithRef<C>, keyof Props>;\n';
  },
  'use-slot-single-flatten': (name, text) => {
    if (name !== 'packages/mui-utils/src/useSlotProps/useSlotProps.ts') return text;
    if (text.includes('declare function useSlotProps<')) {
      return text.replace(/\): import\("@mui\/types"\)\.Simplify<[\s\S]*?;\s*export default useSlotProps;/,
        '): UseSlotPropsResult<ElementType, SlotProps, AdditionalProps, OwnerState>;\nexport default useSlotProps;')
        .replace("MergeSlotPropsResult<SlotProps, object, object, AdditionalProps>['props']", 'SlotProps & AdditionalProps & {className?: string | undefined; style?: React.CSSProperties | undefined}');
    }
    return text.replace("MergeSlotPropsResult<SlotProps, object, object, AdditionalProps>['props']", 'SlotProps & AdditionalProps & {className?: string | undefined; style?: React.CSSProperties | undefined}')
      .replace('  >,\n) {', '  >,\n): UseSlotPropsResult<ElementType, SlotProps, AdditionalProps, OwnerState> {');
  },
  'styled-common-variance': (name, text) => name === 'packages/mui-system/src/createStyled/createStyled.ts'
    ? text.replace('MUIStyledCommonProps<Theme extends', 'MUIStyledCommonProps<in out Theme extends') : text,
  'styled-factory-variance': (name, text) => name === 'packages/mui-styled-engine/src/index.ts'
    ? text.replace(/interface CreateStyledComponent<([\s\S]*?)> \{/, (_match, parameters) =>
      `interface CreateStyledComponent<${parameters.replace(/\b(ComponentProps|SpecificComponentProps|JSXProps|T)(?=\s+extends)/g, 'in out $1')}> {`)
      .replace(/interface CreateMUIStyled<([\s\S]*?)> \{/, (_match, parameters) =>
      `interface CreateMUIStyled<${parameters.replace(/\b(MUIStyledCommonProps|MuiStyledOptions|Theme)(?=\s+extends|\s*[,\n])/g, 'in out $1')}> {`) : text,
  'slot-props-direct-equivalent': (name, text) => {
    if (name === 'packages/mui-material/src/utils/types.ts') return text + [
      "type CompatibleIntrinsicProps<P> = { [Tag in keyof React.JSX.IntrinsicElements]: P extends React.JSX.IntrinsicElements[Tag] ? React.JSX.IntrinsicElements[Tag] : never }[keyof React.JSX.IntrinsicElements];",
      "type PropsFromElementType<P> = P | (React.PropsWithoutRef<P> & React.RefAttributes<React.Component<P>>) | CompatibleIntrinsicProps<P>;",
      "export type SlotPropsFromProps<P, Overrides, Owner> = import('@mui/utils/types').WithDataAttributes<Partial<PropsFromElementType<P>> & SlotCommonProps & Overrides> | ((ownerState: Owner) => import('@mui/utils/types').WithDataAttributes<Partial<PropsFromElementType<P>> & SlotCommonProps & Overrides>);",
    ].join('\n');
    if (!name.startsWith('packages/mui-material/src/') || !name.endsWith('.d.ts') || !text.includes('SlotProps<')) return text;
    const ts = require('typescript');
    const source = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true);
    const edits = [];
    function visit(node) {
      if (ts.isTypeReferenceNode(node) && node.typeName.getText(source) === 'SlotProps') {
        const first = node.typeArguments?.[0];
        if (first && ts.isTypeReferenceNode(first) && first.typeName.getText(source) === 'React.ElementType' && first.typeArguments?.length === 1) {
          edits.push({start: node.typeName.getStart(source), end: node.typeName.end, text: 'SlotPropsFromProps'});
          edits.push({start: first.getStart(source), end: first.end, text: first.typeArguments[0].getText(source)});
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
    if (!edits.length) return text;
    for (const edit of edits.sort((a, b) => b.start - a.start)) text = text.slice(0, edit.start) + edit.text + text.slice(edit.end);
    return "import type { SlotPropsFromProps } from '../utils/types';\n" + text;
  },
  'theme-vars-join': (name, text) => name === 'packages/mui-material/src/styles/createThemeFoundation.ts'
    ? text.replace('type NormalizeVars<T> = ConcatDeep<Split<T>>;', [
      'type JoinVar<K extends string | number, V> = V extends string | number ? K',
      '  : keyof V extends string | number ? `${K}-${NormalizeVars<V>}` : never;',
      'type NormalizeVars<T> = {',
      '  [K in keyof T]: K extends string | number ? JoinVar<K, Exclude<T[K], undefined>> : never',
      '}[keyof T];',
    ].join('\n')) : text,
  'theme-vars-join-no-exclude': (name, text) => name === 'packages/mui-material/src/styles/createThemeFoundation.ts'
    ? text.replace('type NormalizeVars<T> = ConcatDeep<Split<T>>;', [
      'type JoinVar<K extends string | number, V> = V extends string | number ? K',
      '  : keyof V extends string | number ? `${K}-${NormalizeVars<V>}` : never;',
      'type NormalizeVars<T> = {',
      '  [K in keyof T]-?: K extends string | number ? JoinVar<K, T[K]> : never',
      '}[keyof T];',
    ].join('\n')) : text,
  'slot-props-direct-partial': (name, text) => module.exports['slot-props-direct-equivalent'](name, text)
    .replace('type PropsFromElementType<P> = P | (React.PropsWithoutRef<P> & React.RefAttributes<React.Component<P>>) | CompatibleIntrinsicProps<P>;',
      'type PropsFromElementType<P> = Partial<P> | (Partial<React.PropsWithoutRef<P>> & React.RefAttributes<React.Component<P>>) | Partial<CompatibleIntrinsicProps<P>>;')
    .replaceAll('Partial<PropsFromElementType<P>>', 'PropsFromElementType<P>'),
  'slot-props-direct-and-owner': (name, text) => module.exports['autocomplete-owner-interface'](name,
    module.exports['slot-props-direct-partial'](name, text)),
  'autocomplete-slot-roundtrip': (name, text) => name === 'packages/mui-material/src/utils/types.ts' || name === 'packages/mui-material/src/Autocomplete/Autocomplete.d.ts'
    ? module.exports['slot-props-direct-equivalent'](name, text) : text,
  'autocomplete-slot-component-reflection': (name, text) => module.exports['autocomplete-slot-roundtrip'](name, text)
    .replace('type PropsFromElementType<P> = P | (React.PropsWithoutRef<P> & React.RefAttributes<React.Component<P>>) | CompatibleIntrinsicProps<P>;',
      'type PropsFromElementType<P> = React.ComponentPropsWithRef<React.ComponentType<P>> | CompatibleIntrinsicProps<P>;'),
  'autocomplete-slot-split-reflection': (name, text) => module.exports['autocomplete-slot-roundtrip'](name, text)
    .replace('type CompatibleIntrinsicProps<P> = { [Tag in keyof React.JSX.IntrinsicElements]: P extends React.JSX.IntrinsicElements[Tag] ? React.JSX.IntrinsicElements[Tag] : never }[keyof React.JSX.IntrinsicElements];',
      'type CompatibleIntrinsicProps<P> = React.ComponentPropsWithRef<{ [Tag in keyof React.JSX.IntrinsicElements]: P extends React.JSX.IntrinsicElements[Tag] ? Tag : never }[keyof React.JSX.IntrinsicElements]>;')
    .replace('type PropsFromElementType<P> = P | (React.PropsWithoutRef<P> & React.RefAttributes<React.Component<P>>) | CompatibleIntrinsicProps<P>;',
      'type PropsFromElementType<P> = React.ComponentPropsWithRef<React.ComponentType<P>> | CompatibleIntrinsicProps<P>;'),
};
