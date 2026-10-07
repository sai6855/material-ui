import * as React from 'react';
import Component from '@mui/material/SpeedDialAction';

export type Props = React.ComponentProps<typeof Component>;
declare const props: Props;
export const usage = <Component {...props} slotProps={{
  fab: (ownerState) => ({className: 'probe'}),
  tooltip: (ownerState) => ({className: 'probe'})
}} />;
