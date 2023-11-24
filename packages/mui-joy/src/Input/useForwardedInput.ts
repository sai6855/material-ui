'use client';
import * as React from 'react';
import { useInput } from '@mui/base/useInput';
import FormControlContext from '../FormControl/FormControlContext';
import { InputProps } from './InputProps';
import { InputClasses } from './inputClasses';

export default function useForwardedInput(
  props: InputProps,
  classes: Pick<InputClasses, 'disabled' | 'error' | 'focused' | 'formControl'>,
) {
  const formControl = React.useContext(FormControlContext);
  const {
    'aria-describedby': ariaDescribedby,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    autoComplete,
    autoFocus,
    className,
    defaultValue,
    disabled: disabledProp,
    error: errorProp,
    id,
    name,
    onClick,
    onChange,
    onKeyDown,
    onKeyUp,
    onFocus,
    onBlur,
    placeholder,
    readOnly,
    required,
    type,
    value,
    ...other
  } = props;

  const { getRootProps, getInputProps, focused, error, disabled } = useInput({
    disabled: disabledProp ?? formControl?.disabled,
    defaultValue,
    error: errorProp,
    onBlur,
    onClick,
    onChange,
    onFocus,
    required: required ?? formControl?.required,
    value,
  });

  const rootStateClasses = {
    [classes.disabled]: disabled,
    [classes.error]: error,
    [classes.focused]: focused,
    [classes.formControl]: Boolean(formControl),
    [className!]: className,
  };

  const inputStateClasses = {
    [classes.disabled]: disabled,
  };

  const propsToForward = {
    'aria-describedby': ariaDescribedby,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    autoComplete,
    autoFocus,
    disabled,
    id,
    onKeyDown,
    onKeyUp,
    name,
    placeholder,
    readOnly,
    type,
  };
  return {
    formControl,
    propsToForward,
    rootStateClasses,
    inputStateClasses,
    getRootProps,
    getInputProps,
    focused,
    error,
    disabled,
    ...other,
  }
}
