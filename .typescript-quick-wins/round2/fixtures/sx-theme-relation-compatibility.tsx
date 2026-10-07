
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

    import type { SxProps, SystemCssProperties, CSSPseudoSelectorProps, CSSSelectorObjectOrCssVariables } from '@mui/system';
    type Base = {color: string};
    type Derived = {color: string; radius: number};
    type Extends<A, B> = [A] extends [B] ? true : false;
    export type CaseSxBaseToDerived = Extends<SxProps<Base>, SxProps<Derived>>;
    export type CaseSxDerivedToBase = Extends<SxProps<Derived>, SxProps<Base>>;
    export type CaseSystemBaseToDerived = Extends<SystemCssProperties<Base>, SystemCssProperties<Derived>>;
    export type CaseSystemDerivedToBase = Extends<SystemCssProperties<Derived>, SystemCssProperties<Base>>;
    export type CasePseudoBaseToDerived = Extends<CSSPseudoSelectorProps<Base>, CSSPseudoSelectorProps<Derived>>;
    export type CasePseudoDerivedToBase = Extends<CSSPseudoSelectorProps<Derived>, CSSPseudoSelectorProps<Base>>;
    export type CaseSelectorBaseToDerived = Extends<CSSSelectorObjectOrCssVariables<Base>, CSSSelectorObjectOrCssVariables<Derived>>;
    export type CaseSelectorDerivedToBase = Extends<CSSSelectorObjectOrCssVariables<Derived>, CSSSelectorObjectOrCssVariables<Base>>;
    export const styles: SxProps<Derived> = [{m: 2, '&:hover': (theme) => ({borderRadius: theme.radius})}, false];
    // @ts-expect-error A callback that requires Derived must not accept Base.
    export const unsafe: SxProps<Base> = (theme: Derived) => ({color: theme.color});
  
  type Assert<T extends true> = T;
  type Cases = [Assert<CaseSxBaseToDerived>, Assert<CaseSxDerivedToBase extends false ? true : false>,
    Assert<CaseSystemBaseToDerived>, Assert<CaseSystemDerivedToBase extends false ? true : false>,
    Assert<CasePseudoBaseToDerived>, Assert<CasePseudoDerivedToBase extends false ? true : false>,
    Assert<CaseSelectorBaseToDerived>, Assert<CaseSelectorDerivedToBase extends false ? true : false>];
