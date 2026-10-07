import type { CSSObject } from '@mui/styled-engine';
import type { Breakpoints } from '../createBreakpoints/createBreakpoints';
import type { Breakpoint, Theme } from '../createTheme';
import type { ResponsiveStyleValue } from '../styleFunctionSx';
import type { StyleFunction } from '../style';
/** @internal */
export declare const values: Record<string, number>;
export declare const DEFAULT_BREAKPOINTS: Breakpoints;
export declare function handleBreakpoints<Props>(props: Props, propValue: any, styleFromPropValue: (value: any, breakpoint?: Breakpoint) => any): any;
export declare function iterateBreakpoints(target: any, theme: Theme | undefined, propValue: any, callback: (mediaKey: string | undefined, value: any, initialKey?: string) => any): any;
type DefaultBreakPoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
declare function setupBreakpoints<Props, BreakpointsInput extends string = DefaultBreakPoints>(styleFunction: StyleFunction<Props>): StyleFunction<Partial<Record<BreakpointsInput, Props>> & Props>;
/** @internal */
export declare function createEmptyBreakpointObject(breakpoints?: Breakpoints): Record<string, object>;
/** @internal */
export declare function removeUnusedBreakpoints(breakpoints: Breakpoints, style: Record<string, any>): Record<string, any>;
export declare function mergeBreakpointsInOrder(breakpoints: Breakpoints, ...styles: CSSObject[]): CSSObject;
/** @internal */
export declare function computeBreakpointsBase(breakpointValues: any, themeBreakpoints: Record<string, number>): Record<string, true>;
export interface ResolveBreakpointValuesOptions<T> {
    values: ResponsiveStyleValue<T>;
    breakpoints?: Breakpoints['values'] | undefined;
    base?: Record<string, boolean> | undefined;
}
export declare function resolveBreakpointValues<T>(options: ResolveBreakpointValuesOptions<T>): Record<string, T>;
export declare function hasBreakpoint(breakpoints: Breakpoints, value: any): boolean;
export default setupBreakpoints;
