import * as React from 'react';
import Component from '@mui/material/Autocomplete';

export type Props = React.ComponentProps<typeof Component>;
declare const props: Props;
export const usage = <Component {...props} slotProps={{
  chip: (ownerState) => ({className: 'probe'}),
  listbox: (ownerState) => ({className: 'probe'}),
  paper: (ownerState) => ({className: 'probe'}),
  popper: (ownerState) => ({className: 'probe'}),
  popupIndicator: (ownerState) => ({className: 'probe'})
}} />;
