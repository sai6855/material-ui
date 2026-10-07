import * as React from 'react';
import Component from '@mui/material/Avatar';

export type Props = React.ComponentProps<typeof Component>;
declare const props: Props;
export const usage = <Component {...props} slotProps={{
  fallback: (ownerState) => ({className: 'probe'})
}} />;
