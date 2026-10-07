import * as React from 'react';
import Component from '@mui/material/StepContent';

export type Props = React.ComponentProps<typeof Component>;
declare const props: Props;
export const usage = <Component {...props} slotProps={{
  transition: (ownerState) => ({className: 'probe'})
}} />;
