import * as React from 'react';
import Component from '@mui/material/Autocomplete';

import type { AutocompleteProps } from '@mui/material/Autocomplete';
import type { ChipTypeMap } from '@mui/material/Chip';
export function Wrapper<V, M extends boolean | undefined = false, D extends boolean | undefined = false,
  F extends boolean | undefined = false, C extends React.ElementType = ChipTypeMap['defaultComponent']>
  (props: AutocompleteProps<V,M,D,F,C>) { return <Component {...props} />; }
