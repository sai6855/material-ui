import * as React from 'react';
import Component from '@mui/material/Snackbar';

export type Props = React.ComponentProps<typeof Component>;
declare const props: Props;
export const usage = <Component {...props} slotProps={{
  content: (ownerState) => ({className: 'probe'}),
  transition: (ownerState) => ({className: 'probe'})
}} />;
