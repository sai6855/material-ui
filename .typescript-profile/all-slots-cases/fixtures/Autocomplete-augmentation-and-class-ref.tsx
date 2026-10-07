
import * as React from 'react';
import type {AutocompleteProps} from '@mui/material/Autocomplete';
import type {IconButtonProps} from '@mui/material/IconButton';
declare module '@mui/material/Autocomplete' {
  interface AutocompletePopperSlotPropsOverrides {profileFlag?: boolean}
}
class CustomIcon extends React.Component<Partial<IconButtonProps>> {
  render() {return <button />}
}
const props: AutocompleteProps<string,false,false,false> = {
  options: ['one'], renderInput: () => null,
  slots: {popupIndicator: CustomIcon},
  slotProps: {
    popupIndicator: {ref: React.createRef<CustomIcon>(), size: 'small'},
    popper: ownerState => ({profileFlag: ownerState.disabled}),
  },
};
const bad: AutocompleteProps<string,false,false,false> = {
  options: ['one'], renderInput: () => null,
  slotProps: {popper: {
    // @ts-expect-error The augmented flag must remain boolean.
    profileFlag: 'wrong',
  }},
};
