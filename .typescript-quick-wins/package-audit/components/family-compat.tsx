import * as React from 'react';import {ExtendButtonBase,ButtonBaseTypeMap} from '@mui/material/ButtonBase';
import Button,{ButtonTypeMap} from '@mui/material/Button';declare const originalButton:ExtendButtonBase<ButtonTypeMap>;const relationButton:typeof Button=originalButton;const reverseButton:typeof originalButton=Button;const CustomButton=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);const customButton=<Button component={CustomButton} required='yes' ref={React.createRef<HTMLDivElement>()}/>;const hrefButton=<Button href='/' onClick={e=>{const a:HTMLAnchorElement=e.currentTarget;}}/>;
// @ts-expect-error required custom prop absent
const missingButton=<Button component={CustomButton}/>;
// @ts-expect-error incorrect custom ref
const wrongRefButton=<Button component={CustomButton} required='yes' ref={React.createRef<HTMLAnchorElement>()}/>;
import AccordionSummary,{AccordionSummaryTypeMap} from '@mui/material/AccordionSummary';declare const originalAccordionSummary:ExtendButtonBase<AccordionSummaryTypeMap>;const relationAccordionSummary:typeof AccordionSummary=originalAccordionSummary;const reverseAccordionSummary:typeof originalAccordionSummary=AccordionSummary;const CustomAccordionSummary=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);const customAccordionSummary=<AccordionSummary component={CustomAccordionSummary} required='yes' ref={React.createRef<HTMLDivElement>()}/>;const hrefAccordionSummary=<AccordionSummary href='/' onClick={e=>{const a:HTMLAnchorElement=e.currentTarget;}}/>;
// @ts-expect-error required custom prop absent
const missingAccordionSummary=<AccordionSummary component={CustomAccordionSummary}/>;
// @ts-expect-error incorrect custom ref
const wrongRefAccordionSummary=<AccordionSummary component={CustomAccordionSummary} required='yes' ref={React.createRef<HTMLAnchorElement>()}/>;
import BottomNavigationAction,{BottomNavigationActionTypeMap} from '@mui/material/BottomNavigationAction';declare const originalBottomNavigationAction:ExtendButtonBase<BottomNavigationActionTypeMap<{}, ButtonBaseTypeMap['defaultComponent']>>;const relationBottomNavigationAction:typeof BottomNavigationAction=originalBottomNavigationAction;const reverseBottomNavigationAction:typeof originalBottomNavigationAction=BottomNavigationAction;const CustomBottomNavigationAction=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);const customBottomNavigationAction=<BottomNavigationAction component={CustomBottomNavigationAction} required='yes' ref={React.createRef<HTMLDivElement>()}/>;const hrefBottomNavigationAction=<BottomNavigationAction href='/' onClick={e=>{const a:HTMLAnchorElement=e.currentTarget;}}/>;
// @ts-expect-error required custom prop absent
const missingBottomNavigationAction=<BottomNavigationAction component={CustomBottomNavigationAction}/>;
// @ts-expect-error incorrect custom ref
const wrongRefBottomNavigationAction=<BottomNavigationAction component={CustomBottomNavigationAction} required='yes' ref={React.createRef<HTMLAnchorElement>()}/>;
import CardActionArea,{CardActionAreaTypeMap} from '@mui/material/CardActionArea';declare const originalCardActionArea:ExtendButtonBase<CardActionAreaTypeMap<{}, ButtonBaseTypeMap['defaultComponent']>>;const relationCardActionArea:typeof CardActionArea=originalCardActionArea;const reverseCardActionArea:typeof originalCardActionArea=CardActionArea;const CustomCardActionArea=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);const customCardActionArea=<CardActionArea component={CustomCardActionArea} required='yes' ref={React.createRef<HTMLDivElement>()}/>;const hrefCardActionArea=<CardActionArea href='/' onClick={e=>{const a:HTMLAnchorElement=e.currentTarget;}}/>;
// @ts-expect-error required custom prop absent
const missingCardActionArea=<CardActionArea component={CustomCardActionArea}/>;
// @ts-expect-error incorrect custom ref
const wrongRefCardActionArea=<CardActionArea component={CustomCardActionArea} required='yes' ref={React.createRef<HTMLAnchorElement>()}/>;
import Fab,{FabTypeMap} from '@mui/material/Fab';declare const originalFab:ExtendButtonBase<FabTypeMap>;const relationFab:typeof Fab=originalFab;const reverseFab:typeof originalFab=Fab;const CustomFab=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);const customFab=<Fab component={CustomFab} required='yes' ref={React.createRef<HTMLDivElement>()}/>;const hrefFab=<Fab href='/' onClick={e=>{const a:HTMLAnchorElement=e.currentTarget;}}/>;
// @ts-expect-error required custom prop absent
const missingFab=<Fab component={CustomFab}/>;
// @ts-expect-error incorrect custom ref
const wrongRefFab=<Fab component={CustomFab} required='yes' ref={React.createRef<HTMLAnchorElement>()}/>;
import ListItemButton,{ListItemButtonTypeMap} from '@mui/material/ListItemButton';declare const originalListItemButton:ExtendButtonBase<ListItemButtonTypeMap>;const relationListItemButton:typeof ListItemButton=originalListItemButton;const reverseListItemButton:typeof originalListItemButton=ListItemButton;const CustomListItemButton=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);const customListItemButton=<ListItemButton component={CustomListItemButton} required='yes' ref={React.createRef<HTMLDivElement>()}/>;const hrefListItemButton=<ListItemButton href='/' onClick={e=>{const a:HTMLAnchorElement=e.currentTarget;}}/>;
// @ts-expect-error required custom prop absent
const missingListItemButton=<ListItemButton component={CustomListItemButton}/>;
// @ts-expect-error incorrect custom ref
const wrongRefListItemButton=<ListItemButton component={CustomListItemButton} required='yes' ref={React.createRef<HTMLAnchorElement>()}/>;
import IconButton,{IconButtonTypeMap} from '@mui/material/IconButton';declare const originalIconButton:ExtendButtonBase<IconButtonTypeMap>;const relationIconButton:typeof IconButton=originalIconButton;const reverseIconButton:typeof originalIconButton=IconButton;const CustomIconButton=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);const customIconButton=<IconButton component={CustomIconButton} required='yes' ref={React.createRef<HTMLDivElement>()}/>;const hrefIconButton=<IconButton href='/' onClick={e=>{const a:HTMLAnchorElement=e.currentTarget;}}/>;
// @ts-expect-error required custom prop absent
const missingIconButton=<IconButton component={CustomIconButton}/>;
// @ts-expect-error incorrect custom ref
const wrongRefIconButton=<IconButton component={CustomIconButton} required='yes' ref={React.createRef<HTMLAnchorElement>()}/>;
import MenuItem,{MenuItemTypeMap} from '@mui/material/MenuItem';declare const originalMenuItem:ExtendButtonBase<MenuItemTypeMap>;const relationMenuItem:typeof MenuItem=originalMenuItem;const reverseMenuItem:typeof originalMenuItem=MenuItem;const CustomMenuItem=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);const customMenuItem=<MenuItem component={CustomMenuItem} required='yes' ref={React.createRef<HTMLDivElement>()}/>;const hrefMenuItem=<MenuItem href='/' onClick={e=>{const a:HTMLAnchorElement=e.currentTarget;}}/>;
// @ts-expect-error required custom prop absent
const missingMenuItem=<MenuItem component={CustomMenuItem}/>;
// @ts-expect-error incorrect custom ref
const wrongRefMenuItem=<MenuItem component={CustomMenuItem} required='yes' ref={React.createRef<HTMLAnchorElement>()}/>;
import Tab,{TabTypeMap} from '@mui/material/Tab';declare const originalTab:ExtendButtonBase<TabTypeMap>;const relationTab:typeof Tab=originalTab;const reverseTab:typeof originalTab=Tab;const CustomTab=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);const customTab=<Tab component={CustomTab} required='yes' ref={React.createRef<HTMLDivElement>()}/>;const hrefTab=<Tab href='/' onClick={e=>{const a:HTMLAnchorElement=e.currentTarget;}}/>;
// @ts-expect-error required custom prop absent
const missingTab=<Tab component={CustomTab}/>;
// @ts-expect-error incorrect custom ref
const wrongRefTab=<Tab component={CustomTab} required='yes' ref={React.createRef<HTMLAnchorElement>()}/>;
import ToggleButton,{ToggleButtonTypeMap} from '@mui/material/ToggleButton';declare const originalToggleButton:ExtendButtonBase<ToggleButtonTypeMap>;const relationToggleButton:typeof ToggleButton=originalToggleButton;const reverseToggleButton:typeof originalToggleButton=ToggleButton;const CustomToggleButton=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);const customToggleButton=<ToggleButton value='v' component={CustomToggleButton} required='yes' ref={React.createRef<HTMLDivElement>()}/>;const hrefToggleButton=<ToggleButton value='v' href='/' onClick={e=>{const a:HTMLElement=e.currentTarget;}}/>;
// @ts-expect-error required custom prop absent
const missingToggleButton=<ToggleButton value='v' component={CustomToggleButton}/>;
// @ts-expect-error incorrect custom ref
const wrongRefToggleButton=<ToggleButton value='v' component={CustomToggleButton} required='yes' ref={React.createRef<HTMLAnchorElement>()}/>;
import TableSortLabel,{TableSortLabelTypeMap} from '@mui/material/TableSortLabel';declare const originalTableSortLabel:ExtendButtonBase<TableSortLabelTypeMap>;const relationTableSortLabel:typeof TableSortLabel=originalTableSortLabel;const reverseTableSortLabel:typeof originalTableSortLabel=TableSortLabel;const CustomTableSortLabel=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);const customTableSortLabel=<TableSortLabel component={CustomTableSortLabel} required='yes' ref={React.createRef<HTMLDivElement>()}/>;const hrefTableSortLabel=<TableSortLabel href='/' onClick={e=>{const a:HTMLAnchorElement=e.currentTarget;}}/>;
// @ts-expect-error required custom prop absent
const missingTableSortLabel=<TableSortLabel component={CustomTableSortLabel}/>;
// @ts-expect-error incorrect custom ref
const wrongRefTableSortLabel=<TableSortLabel component={CustomTableSortLabel} required='yes' ref={React.createRef<HTMLAnchorElement>()}/>;
import StepButton,{StepButtonTypeMap} from '@mui/material/StepButton';declare const originalStepButton:ExtendButtonBase<StepButtonTypeMap<{}, ButtonBaseTypeMap['defaultComponent']>>;const relationStepButton:typeof StepButton=originalStepButton;const reverseStepButton:typeof originalStepButton=StepButton;const CustomStepButton=React.forwardRef<HTMLDivElement,{required:string}>((p,r)=><div ref={r}/>);const customStepButton=<StepButton component={CustomStepButton} required='yes' ref={React.createRef<HTMLDivElement>()}/>;const hrefStepButton=<StepButton href='/' onClick={e=>{const a:HTMLAnchorElement=e.currentTarget;}}/>;
// @ts-expect-error required custom prop absent
const missingStepButton=<StepButton component={CustomStepButton}/>;
// @ts-expect-error incorrect custom ref
const wrongRefStepButton=<StepButton component={CustomStepButton} required='yes' ref={React.createRef<HTMLAnchorElement>()}/>;
