import * as React from 'react';
import Component from '@mui/material/ListItemText';

export type Props = React.ComponentProps<typeof Component>;
declare const props: Props;
export const usage = <Component {...props} slotProps={{
  primary: (ownerState) => ({className: 'probe'}),
  secondary: (ownerState) => ({className: 'probe'})
}} />;
