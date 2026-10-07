type StyleFunctionWithFilterProps = ((props: any) => any) & {
    filterProps: Iterable<string>;
};
/** @internal */
export declare const styleFunctionMapping: Record<string, StyleFunctionWithFilterProps>;
/** @internal */
export declare const propToStyleFunction: Record<string, (props: any) => any>;
declare function getThemeValue(prop: string, value: any, theme: object): any;
export default getThemeValue;
