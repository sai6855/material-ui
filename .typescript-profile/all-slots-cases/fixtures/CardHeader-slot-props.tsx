import * as React from 'react';
import Component from '@mui/material/CardHeader';

export type Props = React.ComponentProps<typeof Component>;
declare const props: Props;
export const usage = <Component {...props} slotProps={{
  title: (ownerState) => ({className: 'probe'}),
  subheader: (ownerState) => ({className: 'probe'})
}} />;
