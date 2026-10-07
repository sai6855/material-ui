
import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import { createTheme, styled, type Theme } from '@mui/material/styles';

    import { mergeSlotProps } from '@mui/material/utils';
    import type { TooltipProps } from '@mui/material/Tooltip';
    export function Wrapper(props: TooltipProps) {
      return <Tooltip {...props} slotProps={{...props.slotProps,
        popper: mergeSlotProps(props.slotProps?.popper, {disablePortal: true}),
      }} />;
    }
  