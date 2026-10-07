import * as React from 'react';
import Component from '@mui/material/TablePagination';

export type Props = React.ComponentProps<typeof Component>;
declare const props: Props;
export const usage = <Component {...props} slotProps={{
  root: (ownerState) => ({className: 'probe'}),
  toolbar: (ownerState) => ({className: 'probe'}),
  menuItem: (ownerState) => ({className: 'probe'})
}} />;
