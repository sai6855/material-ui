import * as React from 'react';
import Button from '@mui/material/Button';const CustomButton=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);export const Buttona=<Button auditFamilyRequired='yes' onClick={e=>e.currentTarget.tagName}/>;export const Buttonb=<Button auditFamilyRequired='yes' href='/' target='_blank'/>;export const Buttonc=<Button auditFamilyRequired='yes' component={CustomButton} required='yes' ref={React.createRef<HTMLDivElement>()}/>;
import AccordionSummary from '@mui/material/AccordionSummary';const CustomAccordionSummary=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);export const AccordionSummarya=<AccordionSummary auditFamilyRequired='yes' onClick={e=>e.currentTarget.tagName}/>;export const AccordionSummaryb=<AccordionSummary auditFamilyRequired='yes' href='/' target='_blank'/>;export const AccordionSummaryc=<AccordionSummary auditFamilyRequired='yes' component={CustomAccordionSummary} required='yes' ref={React.createRef<HTMLDivElement>()}/>;
import BottomNavigationAction from '@mui/material/BottomNavigationAction';const CustomBottomNavigationAction=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);export const BottomNavigationActiona=<BottomNavigationAction auditFamilyRequired='yes' onClick={e=>e.currentTarget.tagName}/>;export const BottomNavigationActionb=<BottomNavigationAction auditFamilyRequired='yes' href='/' target='_blank'/>;export const BottomNavigationActionc=<BottomNavigationAction auditFamilyRequired='yes' component={CustomBottomNavigationAction} required='yes' ref={React.createRef<HTMLDivElement>()}/>;
import CardActionArea from '@mui/material/CardActionArea';const CustomCardActionArea=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);export const CardActionAreaa=<CardActionArea auditFamilyRequired='yes' onClick={e=>e.currentTarget.tagName}/>;export const CardActionAreab=<CardActionArea auditFamilyRequired='yes' href='/' target='_blank'/>;export const CardActionAreac=<CardActionArea auditFamilyRequired='yes' component={CustomCardActionArea} required='yes' ref={React.createRef<HTMLDivElement>()}/>;
import Fab from '@mui/material/Fab';const CustomFab=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);export const Faba=<Fab auditFamilyRequired='yes' onClick={e=>e.currentTarget.tagName}/>;export const Fabb=<Fab auditFamilyRequired='yes' href='/' target='_blank'/>;export const Fabc=<Fab auditFamilyRequired='yes' component={CustomFab} required='yes' ref={React.createRef<HTMLDivElement>()}/>;
import ListItemButton from '@mui/material/ListItemButton';const CustomListItemButton=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);export const ListItemButtona=<ListItemButton auditFamilyRequired='yes' onClick={e=>e.currentTarget.tagName}/>;export const ListItemButtonb=<ListItemButton auditFamilyRequired='yes' href='/' target='_blank'/>;export const ListItemButtonc=<ListItemButton auditFamilyRequired='yes' component={CustomListItemButton} required='yes' ref={React.createRef<HTMLDivElement>()}/>;
import IconButton from '@mui/material/IconButton';const CustomIconButton=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);export const IconButtona=<IconButton auditFamilyRequired='yes' onClick={e=>e.currentTarget.tagName}/>;export const IconButtonb=<IconButton auditFamilyRequired='yes' href='/' target='_blank'/>;export const IconButtonc=<IconButton auditFamilyRequired='yes' component={CustomIconButton} required='yes' ref={React.createRef<HTMLDivElement>()}/>;
import MenuItem from '@mui/material/MenuItem';const CustomMenuItem=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);export const MenuItema=<MenuItem auditFamilyRequired='yes' onClick={e=>e.currentTarget.tagName}/>;export const MenuItemb=<MenuItem auditFamilyRequired='yes' href='/' target='_blank'/>;export const MenuItemc=<MenuItem auditFamilyRequired='yes' component={CustomMenuItem} required='yes' ref={React.createRef<HTMLDivElement>()}/>;
import Tab from '@mui/material/Tab';const CustomTab=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);export const Taba=<Tab auditFamilyRequired='yes' onClick={e=>e.currentTarget.tagName}/>;export const Tabb=<Tab auditFamilyRequired='yes' href='/' target='_blank'/>;export const Tabc=<Tab auditFamilyRequired='yes' component={CustomTab} required='yes' ref={React.createRef<HTMLDivElement>()}/>;
import ToggleButton from '@mui/material/ToggleButton';const CustomToggleButton=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);export const ToggleButtona=<ToggleButton auditFamilyRequired='yes' value='v' onClick={e=>e.currentTarget.tagName}/>;export const ToggleButtonb=<ToggleButton auditFamilyRequired='yes' value='v' href='/' target='_blank'/>;export const ToggleButtonc=<ToggleButton auditFamilyRequired='yes' value='v' component={CustomToggleButton} required='yes' ref={React.createRef<HTMLDivElement>()}/>;
import TableSortLabel from '@mui/material/TableSortLabel';const CustomTableSortLabel=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);export const TableSortLabela=<TableSortLabel auditFamilyRequired='yes' onClick={e=>e.currentTarget.tagName}/>;export const TableSortLabelb=<TableSortLabel auditFamilyRequired='yes' href='/' target='_blank'/>;export const TableSortLabelc=<TableSortLabel auditFamilyRequired='yes' component={CustomTableSortLabel} required='yes' ref={React.createRef<HTMLDivElement>()}/>;
import StepButton from '@mui/material/StepButton';const CustomStepButton=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);export const StepButtona=<StepButton auditFamilyRequired='yes' onClick={e=>e.currentTarget.tagName}/>;export const StepButtonb=<StepButton auditFamilyRequired='yes' href='/' target='_blank'/>;export const StepButtonc=<StepButton auditFamilyRequired='yes' component={CustomStepButton} required='yes' ref={React.createRef<HTMLDivElement>()}/>;

declare module '@mui/material/ButtonBase' {interface ButtonBaseOwnProps {auditFamilyRequired:string}}
// @ts-expect-error augmented required inherited prop absent
const missingButton=<Button/>;
// @ts-expect-error augmented required inherited prop absent
const missingAccordionSummary=<AccordionSummary/>;
// @ts-expect-error augmented required inherited prop absent
const missingBottomNavigationAction=<BottomNavigationAction/>;
// @ts-expect-error augmented required inherited prop absent
const missingCardActionArea=<CardActionArea/>;
// @ts-expect-error augmented required inherited prop absent
const missingFab=<Fab/>;
// @ts-expect-error augmented required inherited prop absent
const missingListItemButton=<ListItemButton/>;
// @ts-expect-error augmented required inherited prop absent
const missingIconButton=<IconButton/>;
// @ts-expect-error augmented required inherited prop absent
const missingMenuItem=<MenuItem/>;
// @ts-expect-error augmented required inherited prop absent
const missingTab=<Tab/>;
// @ts-expect-error augmented required inherited prop absent
const missingToggleButton=<ToggleButton value='v'/>;
// @ts-expect-error augmented required inherited prop absent
const missingTableSortLabel=<TableSortLabel/>;
// @ts-expect-error augmented required inherited prop absent
const missingStepButton=<StepButton/>;
declare module '@mui/material/Button' {interface ButtonPropsColorOverrides {audit:true;primary:false}}
const customColor=<Button auditFamilyRequired='yes' color='audit'/>;
// @ts-expect-error disabled augmented color
const invalidColor=<Button auditFamilyRequired='yes' color='primary'/>;
