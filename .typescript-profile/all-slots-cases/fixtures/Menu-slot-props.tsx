import * as React from 'react';
import Component from '@mui/material/Menu';

export type Props = React.ComponentProps<typeof Component>;
declare const props: Props;
export const usage = <Component {...props} slotProps={{
  root: (ownerState) => ({className: 'probe'}),
  paper: (ownerState) => ({className: 'probe'}),
  list: (ownerState) => ({className: 'probe'}),
  transition: (ownerState) => ({className: 'probe'}),
  backdrop: (ownerState) => ({className: 'probe'})
}} />;
