import * as React from 'react';import Button from '@mui/material/Button';import Badge from '@mui/material/Badge';
declare module '@mui/material/ButtonBase' {interface ButtonBaseOwnProps {auditRequired:string;auditOptional?:number}}
declare module '@mui/material/Button' {interface ButtonPropsColorOverrides {audit:true;primary:false}}
declare module '@mui/material/Badge' {interface BadgeOwnProps {auditRequired:string}interface BadgePropsColorOverrides {audit:true;primary:false}interface BadgeRootSlotPropsOverrides {auditSlot:string}}
const aug=<Button auditRequired='yes' color='audit'/>;
// @ts-expect-error augmented prop required
const missing=<Button/>;
// @ts-expect-error primary disabled by augmentation
const disabled=<Button auditRequired='yes' color='primary'/>;
const badge=<Badge auditRequired='yes' color='audit' slotProps={{root:s=>({auditSlot:s.auditRequired})}}/>;
// @ts-expect-error root slot augmented prop required
const invalid=<Badge auditRequired='yes' slotProps={{root:{}}}/>;
