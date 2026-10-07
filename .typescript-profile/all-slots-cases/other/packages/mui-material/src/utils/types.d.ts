import { SxProps } from '@mui/system';
import { SlotComponentProps } from '@mui/utils/types';
import { Theme } from '../styles';
export type { EventHandlers, WithOptionalOwnerState, SlotComponentProps, SlotComponentPropsWithSlotState, DataAttributesOverrides, WithDataAttributes, } from '@mui/utils/types';
export type SlotCommonProps = {
    component?: React.ElementType | undefined;
    sx?: SxProps<Theme> | undefined;
};
export type SlotProps<TSlotComponent extends React.ElementType, TOverrides, TOwnerState> = SlotComponentProps<TSlotComponent, SlotCommonProps & TOverrides, TOwnerState>;
/**
 * Use the keys of `Slots` to make sure that K contains all of the keys
 *
 * @example CreateSlotsAndSlotProps<{ root: React.ElementType, decorator: React.ElementType }, { root: ..., decorator: ... }>
 */
export type CreateSlotsAndSlotProps<Slots, K extends Record<keyof Slots, any>> = {
    /**
     * The components used for each slot inside.
     * @default {}
     */
    slots?: Partial<Slots> | undefined;
    /**
     * The props used for each slot inside.
     * @default {}
     */
    slotProps?: {
        [P in keyof K]?: K[P];
    } | undefined;
};

import type * as React from 'react';
type ProfileIntrinsicProps<P> = React.ComponentPropsWithRef<{
  [Tag in keyof React.JSX.IntrinsicElements]: P extends React.JSX.IntrinsicElements[Tag] ? Tag : never
}[keyof React.JSX.IntrinsicElements]>;
type ProfileReflectedProps<P> = React.ComponentPropsWithRef<React.ComponentType<P>> | ProfileIntrinsicProps<P>;
export type ProfileSlotComponentProps<P, Overrides, Owner> =
  | import('@mui/utils/types').WithDataAttributes<Partial<ProfileReflectedProps<P>> & Overrides>
  | ((ownerState: Owner) => import('@mui/utils/types').WithDataAttributes<Partial<ProfileReflectedProps<P>> & Overrides>);
export type ProfileSlotProps<P, Overrides, Owner> = ProfileSlotComponentProps<P, SlotCommonProps & Overrides, Owner>;
export type ProfileSlotComponentPropsWithSlotState<P, Overrides, Owner, State> =
  | import('@mui/utils/types').WithDataAttributes<Partial<ProfileReflectedProps<P>> & Overrides>
  | ((ownerState: Owner, slotState: State) => import('@mui/utils/types').WithDataAttributes<Partial<ProfileReflectedProps<P>> & Overrides>);
