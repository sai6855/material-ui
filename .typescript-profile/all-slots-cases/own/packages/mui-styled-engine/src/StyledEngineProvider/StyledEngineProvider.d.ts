import * as React from 'react';
export interface StyledEngineProviderProps {
    children?: React.ReactNode;
    enableCssLayer?: boolean | undefined;
    injectFirst?: boolean | undefined;
}
/**
 * @internal
 */
export declare const TEST_INTERNALS_DO_NOT_USE: {
    insert?: ((rule: string, options?: unknown) => unknown) | undefined;
};
export default function StyledEngineProvider(props: StyledEngineProviderProps): React.JSX.Element;
