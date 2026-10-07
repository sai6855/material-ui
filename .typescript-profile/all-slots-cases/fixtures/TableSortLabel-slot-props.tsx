import * as React from 'react';
import Component from '@mui/material/TableSortLabel';

export type Props = React.ComponentProps<typeof Component>;
declare const props: Props;
export const usage = <Component {...props} slotProps={{
  root: (ownerState) => ({className: 'probe'}),
  icon: (ownerState) => ({className: 'probe'})
}} />;
