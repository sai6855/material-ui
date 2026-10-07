import type { PropsFor, SimpleStyleFunction } from '../style';
export declare const position: import("..").StyleFunction<{
    position?: unknown;
} & {
    theme?: object | undefined;
}> & {
    filterProps: string[];
    propTypes: any;
};
export declare const zIndex: import("..").StyleFunction<{
    zIndex?: unknown;
} & {
    theme?: object | undefined;
}> & {
    filterProps: string[];
    propTypes: any;
};
export declare const top: import("..").StyleFunction<{
    top?: unknown;
} & {
    theme?: object | undefined;
}> & {
    filterProps: string[];
    propTypes: any;
};
export declare const right: import("..").StyleFunction<{
    right?: unknown;
} & {
    theme?: object | undefined;
}> & {
    filterProps: string[];
    propTypes: any;
};
export declare const bottom: import("..").StyleFunction<{
    bottom?: unknown;
} & {
    theme?: object | undefined;
}> & {
    filterProps: string[];
    propTypes: any;
};
export declare const left: import("..").StyleFunction<{
    left?: unknown;
} & {
    theme?: object | undefined;
}> & {
    filterProps: string[];
    propTypes: any;
};
declare const positions: SimpleStyleFunction<"zIndex" | "position" | "top" | "right" | "bottom" | "left">;
export type PositionsProps = PropsFor<typeof positions>;
export default positions;
