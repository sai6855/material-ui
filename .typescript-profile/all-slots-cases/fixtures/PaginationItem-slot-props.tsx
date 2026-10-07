import * as React from 'react';
import Component from '@mui/material/PaginationItem';

export type Props = React.ComponentProps<typeof Component>;
declare const props: Props;
export const usage = <Component {...props} slotProps={{
  first: (ownerState) => ({className: 'probe'}),
  last: (ownerState) => ({className: 'probe'}),
  next: (ownerState) => ({className: 'probe'}),
  previous: (ownerState) => ({className: 'probe'})
}} />;
