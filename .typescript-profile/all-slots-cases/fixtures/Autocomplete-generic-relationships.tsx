
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

    import type { AutocompleteProps } from '@mui/material/Autocomplete';
    type ElementRoot = (props: { id?: string }) => React.JSX.Element;
    type NodeRoot = (props: { id?: string }) => React.ReactNode;
    type A<C extends React.ElementType> = AutocompleteProps<string, false, false, false, C>;
    type Extends<A, B> = [A] extends [B] ? true : false;
    export type CaseRootElementToNode = Extends<A<ElementRoot>, A<NodeRoot>>;
    export type CaseRootNodeToElement = Extends<A<NodeRoot>, A<ElementRoot>>;
    export type CaseDivToSpan = Extends<A<'div'>, A<'span'>>;
    export type CaseSpanToDiv = Extends<A<'span'>, A<'div'>>;
    export type CaseUnknown = Extends<AutocompleteProps<string, false, false, false>, AutocompleteProps<unknown, false, false, false>>;
    export type CaseAny = Extends<AutocompleteProps<string, false, false, false>, AutocompleteProps<any, false, false, false>>;
    export type CaseFalseToBoolean = Extends<AutocompleteProps<string, false, false, false>, AutocompleteProps<string, boolean, false, false>>;
    export type CaseUndefinedToFalse = Extends<AutocompleteProps<string, undefined, false, false>, AutocompleteProps<string, false, false, false>>;
  
  type Assert<T extends true> = T;
  type Eq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false;
  type Assertions = [
    Assert<Eq<CaseRootElementToNode, true>>, Assert<Eq<CaseRootNodeToElement, true>>,
    Assert<Eq<CaseDivToSpan, false>>, Assert<Eq<CaseSpanToDiv, false>>,
    Assert<Eq<CaseUnknown, false>>, Assert<Eq<CaseAny, true>>,
    Assert<Eq<CaseFalseToBoolean, false>>, Assert<Eq<CaseUndefinedToFalse, false>>
  ];
