import * as React from 'react';
import Component from '@mui/material/Alert';

export type Props = React.ComponentProps<typeof Component>;
declare const props: Props;
export const usage = <Component {...props} slotProps={{
  root: (ownerState) => ({className: 'probe'}),
  closeButton: (ownerState) => ({className: 'probe'}),
  closeIcon: (ownerState) => ({className: 'probe'})
}} />;
