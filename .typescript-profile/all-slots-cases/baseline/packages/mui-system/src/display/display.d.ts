import type { PropsFor, SimpleStyleFunction } from '../style';
export declare const displayPrint: import("..").StyleFunction<{
    displayPrint?: unknown;
} & {
    theme?: object | undefined;
}> & {
    filterProps: string[];
    propTypes: any;
};
export declare const displayRaw: import("..").StyleFunction<{
    display?: unknown;
} & {
    theme?: object | undefined;
}> & {
    filterProps: string[];
    propTypes: any;
};
export declare const overflow: import("..").StyleFunction<{
    overflow?: unknown;
} & {
    theme?: object | undefined;
}> & {
    filterProps: string[];
    propTypes: any;
};
export declare const textOverflow: import("..").StyleFunction<{
    textOverflow?: unknown;
} & {
    theme?: object | undefined;
}> & {
    filterProps: string[];
    propTypes: any;
};
export declare const visibility: import("..").StyleFunction<{
    visibility?: unknown;
} & {
    theme?: object | undefined;
}> & {
    filterProps: string[];
    propTypes: any;
};
export declare const whiteSpace: import("..").StyleFunction<{
    whiteSpace?: unknown;
} & {
    theme?: object | undefined;
}> & {
    filterProps: string[];
    propTypes: any;
};
declare const display: SimpleStyleFunction<"display" | "displayPrint" | "overflow" | "textOverflow" | "visibility" | "whiteSpace">;
export type DisplayProps = PropsFor<typeof display>;
export default display;
