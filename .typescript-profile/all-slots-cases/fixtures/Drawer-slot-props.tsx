import * as React from 'react';
import Component from '@mui/material/Drawer';

export type Props = React.ComponentProps<typeof Component>;
declare const props: Props;
export const usage = <Component {...props} slotProps={{
  root: (ownerState) => ({className: 'probe'}),
  backdrop: (ownerState) => ({className: 'probe'}),
  paper: (ownerState) => ({className: 'probe'}),
  transition: (ownerState) => ({className: 'probe'})
}} />;
