import * as React from 'react';
import Component from '@mui/material/Menu';

export type Props = React.ComponentProps<typeof Component>;
export function Wrapper(props: Props) { return <Component {...props} />; }
