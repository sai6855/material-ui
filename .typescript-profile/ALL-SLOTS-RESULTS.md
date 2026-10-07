# Component slot reflection profiling

Consumer-local diagnostics, not a whole-repository speedup. No library implementation was changed.

Source HEAD: `86cdecf91f9524e718f50f7a5d8b43caf0f158e9`. Baseline includes the captured working-tree Autocomplete edit.

## Common consumer

```tsx
type Props = React.ComponentProps<typeof Component>;
function Wrapper(props: Props) { return <Component {...props} />; }
```

Own = only that component uses the experimental helper. All = all 64 direct matches use it.
Both keep intrinsic and custom-component reflection branches; results are experimental.

## Instantiations (TypeScript 7.0.2)

| Component | Baseline | Own | Own reduction | All | All reduction |
| --- | ---: | ---: | ---: | ---: | ---: |
| Accordion | 132,227 | 149,657 | -13.18% | 149,657 | -13.18% |
| AccordionSummary | 21,664 | 21,664 | 0.00% | 21,664 | 0.00% |
| Alert | 5,877 | 5,877 | 0.00% | 5,877 | 0.00% |
| Autocomplete | 364,927 | 346,285 | 5.11% | 346,285 | 5.11% |
| Avatar | 36,012 | 54,153 | -50.37% | 54,153 | -50.37% |
| Backdrop | 20,918 | 20,918 | 0.00% | 20,918 | 0.00% |
| BottomNavigationAction | 21,723 | 21,723 | 0.00% | 21,723 | 0.00% |
| CardActionArea | 41,357 | 59,757 | -44.49% | 59,757 | -44.49% |
| Checkbox | 7,895 | 7,895 | 0.00% | 7,895 | 0.00% |
| Dialog | 7,652 | 7,652 | 0.00% | 7,652 | 0.00% |
| Drawer | 5,655 | 5,655 | 0.00% | 5,655 | 0.00% |
| ListItem | 16,571 | 16,571 | 0.00% | 16,571 | 0.00% |
| Menu | 8,474 | 8,474 | 0.00% | 8,474 | 0.00% |
| MobileStepper | 5,604 | 5,604 | 0.00% | 5,604 | 0.00% |
| PaginationItem | 16,886 | 16,886 | 0.00% | 16,886 | 0.00% |
| Popover | 6,577 | 6,577 | 0.00% | 6,577 | 0.00% |
| Radio | 7,870 | 7,870 | 0.00% | 7,870 | 0.00% |
| Snackbar | 6,510 | 6,510 | 0.00% | 6,510 | 0.00% |
| SpeedDial | 5,985 | 5,985 | 0.00% | 5,985 | 0.00% |
| SpeedDialAction | 6,430 | 6,430 | 0.00% | 6,430 | 0.00% |
| StepContent | 4,599 | 4,599 | 0.00% | 4,599 | 0.00% |
| StepLabel | 4,424 | 4,424 | 0.00% | 4,424 | 0.00% |
| Switch | 7,871 | 7,871 | 0.00% | 7,871 | 0.00% |
| TablePagination | 98,646 | 116,579 | -18.18% | 116,579 | -18.18% |
| TableSortLabel | 130,106 | 149,135 | -14.63% | 149,135 | -14.63% |
| TextField | 9,674 | 9,674 | 0.00% | 9,674 | 0.00% |
| Tooltip | 6,427 | 6,427 | 0.00% | 6,427 | 0.00% |
| SwitchBase | 3,936 | 3,936 | 0.00% | 3,936 | 0.00% |
| SwipeableDrawer | 3,873 | — | — | 3,873 | 0.00% |
| CardHeader | 101,754 | — | — | 101,754 | 0.00% |
| ListItemText | 107,978 | — | — | 107,978 | 0.00% |

## Explicit slot-prop callbacks (TypeScript 7.0.2)

Each candidate slot receives `(ownerState) => ({ className: "probe" })` in JSX.

| Component | Baseline | Own | Own reduction | All | All reduction |
| --- | ---: | ---: | ---: | ---: | ---: |
| Accordion | 342,292 | 348,401 | -1.78% | 348,401 | -1.78% |
| AccordionSummary | 55,787 | 75,028 | -34.49% | 75,028 | -34.49% |
| Alert | 113,961 | 125,250 | -9.91% | 125,250 | -9.91% |
| Autocomplete | 858,782 | 858,956 | -0.02% | 858,956 | -0.02% |
| Avatar | 67,033 | 85,901 | -28.15% | 85,901 | -28.15% |
| Backdrop | 323,285 | 337,125 | -4.28% | 337,125 | -4.28% |
| BottomNavigationAction | 55,127 | 74,368 | -34.90% | 74,368 | -34.90% |
| CardActionArea | 55,147 | 74,369 | -34.86% | 74,369 | -34.86% |
| Checkbox | 24,483 | 43,395 | -77.25% | 43,395 | -77.25% |
| Dialog | 367,779 | 361,949 | 1.59% | 361,949 | 1.59% |
| Drawer | 366,691 | 360,859 | 1.59% | 360,859 | 1.59% |
| ListItem | 88,149 | 108,240 | -22.79% | 108,240 | -22.79% |
| Menu | 390,094 | 372,826 | 4.43% | 372,826 | 4.43% |
| MobileStepper | 53,502 | 73,413 | -37.22% | 73,413 | -37.22% |
| PaginationItem | 47,311 | 69,525 | -46.95% | 69,525 | -46.95% |
| Popover | 367,610 | 361,780 | 1.59% | 361,780 | 1.59% |
| Radio | 24,460 | 43,372 | -77.32% | 43,372 | -77.32% |
| Snackbar | 334,308 | 340,585 | -1.88% | 340,585 | -1.88% |
| SpeedDial | 309,455 | 323,272 | -4.46% | 323,272 | -4.46% |
| SpeedDialAction | 52,416 | 72,322 | -37.98% | 72,322 | -37.98% |
| StepContent | 120,712 | 134,389 | -11.33% | 134,389 | -11.33% |
| StepLabel | 16,237 | 35,145 | -116.45% | 35,145 | -116.45% |
| Switch | 24,461 | 43,373 | -77.31% | 43,373 | -77.31% |
| TablePagination | 112,984 | 124,321 | -10.03% | 124,321 | -10.03% |
| TableSortLabel | 258,281 | 278,317 | -7.76% | 278,317 | -7.76% |
| TextField | 174,510 | 166,179 | 4.77% | 166,179 | 4.77% |
| Tooltip | 320,294 | 340,406 | -6.28% | 340,406 | -6.28% |
| SwitchBase | 43,341 | 62,311 | -43.77% | 62,311 | -43.77% |
| SwipeableDrawer | 367,648 | — | — | 361,818 | 1.59% |
| CardHeader | 21,537 | — | — | 21,537 | 0.00% |
| ListItemText | 101,052 | — | — | 101,052 | 0.00% |

## Separate fully generic Autocomplete wrapper

- TS7 baseline: 1,105,402 instantiations; median check 3.122s; median memory 702,100 KB (3 runs).
- TS7 own: 725,475 instantiations; median check 2.043s; median memory 491,268 KB (3 runs).
- TS7 all: 725,475 instantiations; median check 2.075s; median memory 491,214 KB (3 runs).
- TS6 baseline: 1,101,943 instantiations; median check 5.1s; median memory 723,089 KB (3 runs).
- TS6 own: 764,069 instantiations; median check 4.01s; median memory 566,511 KB (3 runs).
- TS6 all: 764,069 instantiations; median check 4.08s; median memory 594,635 KB (3 runs).

## Combined consumers

One compilation containing all 31 consumers. The wrapper case also includes the fully generic Autocomplete wrapper.
These are synthetic consumer workloads, not the repository type-check suite.

| Compiler | Fixture | Baseline | All | Reduction | Baseline check (s) | All check (s) |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| TS7 | combined-wrapper | 1,301,627 | 884,590 | 32.04% | 3.611 | 2.415 |
| TS7 | combined-slot-props | 2,531,331 | 2,115,916 | 16.41% | 4.991 | 4.031 |
| TS6 | combined-wrapper | 1,282,555 | 936,157 | 27.01% | 5.32 | 5.16 |
| TS6 | combined-slot-props | 2,237,665 | 1,840,159 | 17.76% | 6.76 | 6.22 |

## Rollout scope controls (TypeScript 7.0.2)

Own here means Autocomplete-only (5 current matches); Other means the remaining 59 matches.
Primary combined baseline/all counts above have three fresh runs. Scope-control counts use one fresh process; do not infer timing gains from them.

| Consumers | Fixture | Baseline | Autocomplete-only | Other-only | All |
| --- | --- | ---: | ---: | ---: | ---: |
| Combined | combined-wrapper | 1,301,627 | 921,473 | 1,289,824 | 884,590 |
| Combined | combined-slot-props | 2,531,331 | 2,531,511 | 2,241,275 | 2,115,916 |
| CombinedNoAutocomplete | combined-wrapper | 300,889 | 300,889 | 314,909 | 314,909 |
| CombinedNoAutocomplete | combined-slot-props | 1,834,848 | 1,834,848 | 1,575,178 | 1,575,178 |

## Check times and compiler memory (TypeScript 7.0.2)

| Component | Baseline check (s) | All check (s) | Baseline memory (KB) | All memory (KB) | Runs/variant |
| --- | ---: | ---: | ---: | ---: | ---: |
| Accordion | 0.164 | 0.168 | 116744 | 117777 | 3/3 |
| AccordionSummary | 0.026 | 0.026 | 83503 | 83418 | 3/3 |
| Alert | 0.011 | 0.011 | 79375 | 79424 | 3/3 |
| Autocomplete | 2.11 | 1.526 | 606258 | 427549 | 3/3 |
| Avatar | 0.119 | 0.129 | 104397 | 105464 | 3/3 |
| Backdrop | 0.021 | 0.02 | 80700 | 80753 | 3/3 |
| BottomNavigationAction | 0.03 | 0.033 | 83496 | 83582 | 3/3 |
| CardActionArea | 0.136 | 0.146 | 109264 | 110369 | 3/3 |
| Checkbox | 0.013 | 0.014 | 79824 | 79872 | 3/3 |
| Dialog | 0.013 | 0.012 | 79665 | 79628 | 3/3 |
| Drawer | 0.012 | 0.012 | 79475 | 79544 | 3/3 |
| ListItem | 0.018 | 0.018 | 80567 | 80545 | 3/3 |
| Menu | 0.014 | 0.013 | 79797 | 79889 | 3/3 |
| MobileStepper | 0.011 | 0.012 | 79323 | 79376 | 3/3 |
| PaginationItem | 0.019 | 0.019 | 80522 | 80533 | 3/3 |
| Popover | 0.012 | 0.013 | 79613 | 79612 | 3/3 |
| Radio | 0.013 | 0.014 | 79841 | 79842 | 3/3 |
| Snackbar | 0.011 | 0.012 | 79380 | 79365 | 3/3 |
| SpeedDial | 0.011 | 0.012 | 79276 | 79329 | 3/3 |
| SpeedDialAction | 0.011 | 0.01 | 79044 | 79097 | 3/3 |
| StepContent | 0.009 | 0.009 | 78829 | 78795 | 3/3 |
| StepLabel | 0.009 | 0.009 | 78581 | 78579 | 3/3 |
| Switch | 0.014 | 0.013 | 79837 | 79795 | 3/3 |
| TablePagination | 0.208 | 0.212 | 114262 | 115198 | 3/3 |
| TableSortLabel | 0.197 | 0.207 | 119516 | 120623 | 3/3 |
| TextField | 0.017 | 0.018 | 80473 | 80473 | 3/3 |
| Tooltip | 0.011 | 0.011 | 79126 | 79125 | 3/3 |
| SwitchBase | 0.008 | 0.008 | 78121 | 78241 | 3/3 |
| SwipeableDrawer | 0.008 | 0.008 | 78023 | 78025 | 3/3 |
| CardHeader | 0.137 | 0.136 | 100970 | 101074 | 3/3 |
| ListItemText | 0.163 | 0.163 | 105788 | 105854 | 3/3 |

## Explicit-slot check times and compiler memory (TypeScript 7.0.2)

| Component | Baseline check (s) | All check (s) | Baseline memory (KB) | All memory (KB) | Runs/variant |
| --- | ---: | ---: | ---: | ---: | ---: |
| Accordion | 0.379 | 0.372 | 158703 | 159258 | 3/3 |
| AccordionSummary | 0.141 | 0.14 | 111366 | 112502 | 3/3 |
| Alert | 0.168 | 0.167 | 115466 | 115833 | 3/3 |
| Autocomplete | 2.261 | 1.649 | 636302 | 448982 | 3/3 |
| Avatar | 0.15 | 0.151 | 107649 | 108773 | 3/3 |
| Backdrop | 0.424 | 0.419 | 156744 | 157548 | 3/3 |
| BottomNavigationAction | 0.152 | 0.159 | 111207 | 112352 | 3/3 |
| CardActionArea | 0.154 | 0.155 | 111166 | 112359 | 3/3 |
| Checkbox | 0.111 | 0.132 | 104747 | 106018 | 3/3 |
| Dialog | 0.444 | 0.477 | 161600 | 160799 | 3/3 |
| Drawer | 0.448 | 0.454 | 161695 | 160854 | 3/3 |
| ListItem | 0.165 | 0.176 | 114426 | 115582 | 3/3 |
| Menu | 0.47 | 0.47 | 164027 | 162813 | 3/3 |
| MobileStepper | 0.135 | 0.152 | 108800 | 109951 | 3/3 |
| PaginationItem | 0.143 | 0.15 | 109936 | 111304 | 3/3 |
| Popover | 0.452 | 0.46 | 161754 | 160895 | 3/3 |
| Radio | 0.111 | 0.12 | 104663 | 105914 | 3/3 |
| Snackbar | 0.436 | 0.454 | 157994 | 158601 | 3/3 |
| SpeedDial | 0.395 | 0.407 | 155641 | 156464 | 3/3 |
| SpeedDialAction | 0.148 | 0.15 | 109141 | 110219 | 3/3 |
| StepContent | 0.18 | 0.187 | 117292 | 118200 | 3/3 |
| StepLabel | 0.063 | 0.069 | 96361 | 97670 | 3/3 |
| Switch | 0.111 | 0.118 | 104691 | 105966 | 3/3 |
| TablePagination | 0.194 | 0.2 | 115333 | 116112 | 3/3 |
| TableSortLabel | 0.314 | 0.309 | 133711 | 134734 | 3/3 |
| TextField | 0.265 | 0.251 | 126144 | 121220 | 3/3 |
| Tooltip | 0.42 | 0.432 | 156728 | 157962 | 3/3 |
| SwitchBase | 0.13 | 0.139 | 107548 | 108838 | 3/3 |
| SwipeableDrawer | 0.478 | 0.504 | 161833 | 160997 | 3/3 |
| CardHeader | 0.03 | 0.026 | 81880 | 81890 | 3/3 |
| ListItemText | 0.153 | 0.15 | 103226 | 103288 | 3/3 |

## TypeScript 6.0.3 cross-check

One fresh process per variant for each common consumer; counts are cross-checks, not repeated timing evidence.

| Component | Wrapper baseline | Wrapper all | Reduction | Slot callbacks baseline | Slot callbacks all | Reduction |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Accordion | 171,138 | 189,110 | -10.50% | 343,072 | 348,911 | -1.70% |
| AccordionSummary | 21,674 | 21,674 | 0.00% | 55,793 | 74,939 | -34.32% |
| Alert | 5,909 | 5,909 | 0.00% | 115,906 | 126,963 | -9.54% |
| Autocomplete | 354,395 | 376,721 | -6.30% | 629,760 | 572,544 | 9.09% |
| Avatar | 114,604 | 133,525 | -16.51% | 67,075 | 86,001 | -28.22% |
| Backdrop | 20,929 | 20,929 | 0.00% | 323,824 | 336,442 | -3.90% |
| BottomNavigationAction | 21,723 | 21,723 | 0.00% | 55,125 | 74,271 | -34.73% |
| CardActionArea | 121,935 | 140,773 | -15.45% | 55,155 | 74,282 | -34.68% |
| Checkbox | 7,925 | 7,925 | 0.00% | 24,490 | 43,043 | -75.76% |
| Dialog | 7,703 | 7,703 | 0.00% | 368,785 | 362,155 | 1.80% |
| Drawer | 5,695 | 5,695 | 0.00% | 367,686 | 361,053 | 1.80% |
| ListItem | 16,582 | 16,582 | 0.00% | 88,678 | 108,114 | -21.92% |
| Menu | 8,504 | 8,504 | 0.00% | 391,124 | 372,752 | 4.70% |
| MobileStepper | 5,636 | 5,636 | 0.00% | 55,546 | 75,106 | -35.21% |
| PaginationItem | 16,897 | 16,897 | 0.00% | 54,544 | 78,119 | -43.22% |
| Popover | 6,613 | 6,613 | 0.00% | 368,605 | 361,975 | 1.80% |
| Radio | 7,900 | 7,900 | 0.00% | 24,467 | 43,020 | -75.83% |
| Snackbar | 6,537 | 6,537 | 0.00% | 334,843 | 340,787 | -1.78% |
| SpeedDial | 6,009 | 6,009 | 0.00% | 308,898 | 322,601 | -4.44% |
| SpeedDialAction | 6,442 | 6,442 | 0.00% | 52,596 | 73,489 | -39.72% |
| StepContent | 4,611 | 4,611 | 0.00% | 120,016 | 133,339 | -11.10% |
| StepLabel | 4,437 | 4,437 | 0.00% | 16,482 | 35,033 | -112.55% |
| Switch | 7,901 | 7,901 | 0.00% | 24,468 | 43,021 | -75.83% |
| TablePagination | 170,737 | 189,171 | -10.80% | 112,871 | 123,499 | -9.42% |
| TableSortLabel | 130,099 | 149,004 | -14.53% | 259,739 | 278,187 | -7.10% |
| TextField | 9,711 | 9,711 | 0.00% | 176,265 | 165,806 | 5.93% |
| Tooltip | 6,439 | 6,439 | 0.00% | 320,754 | 339,290 | -5.78% |
| SwitchBase | 3,972 | 3,972 | 0.00% | 43,662 | 62,471 | -43.08% |
| SwipeableDrawer | 3,900 | 3,900 | 0.00% | 368,630 | 361,999 | 1.80% |
| CardHeader | 101,819 | 101,819 | 0.00% | 21,549 | 21,549 | 0.00% |
| ListItemText | 108,819 | 108,819 | 0.00% | 101,899 | 101,899 | 0.00% |

## Existing component type-test workloads (TypeScript 7.0.2)

These are separate diagnostic workloads; they are not added to, or substituted for, the common consumer results.

| Component | Baseline | All | Reduction |
| --- | ---: | ---: | ---: |
| Accordion | 431,072 | 350,883 | 18.60% |
| Alert | 53,099 | 71,174 | -34.04% |
| Autocomplete | 1,139,898 | 759,404 | 33.38% |
| Avatar | 17,145 | 17,145 | 0.00% |
| Backdrop | 414,754 | 329,963 | 20.44% |
| BottomNavigationAction | 17,156 | 17,156 | 0.00% |
| Checkbox | 15,977 | 34,397 | -115.29% |
| Dialog | 436,932 | 355,178 | 18.71% |
| Drawer | 432,745 | 350,954 | 18.90% |
| ListItem | 20,651 | 20,651 | 0.00% |
| Menu | 436,660 | 355,322 | 18.63% |
| Popover | 437,003 | 437,003 | 0.00% |
| Radio | 15,977 | 34,397 | -115.29% |
| Snackbar | 424,686 | 344,801 | 18.81% |
| SpeedDial | 403,439 | 318,668 | 21.01% |
| StepContent | 136,231 | 146,893 | -7.83% |
| StepLabel | 3,104 | 3,104 | 0.00% |
| TablePagination | 125,305 | 136,647 | -9.05% |
| TextField | 52,844 | 71,801 | -35.87% |
| Tooltip | 421,485 | 342,992 | 18.62% |
| CardHeader | 24,678 | 24,678 | 0.00% |
| ListItemText | 18,758 | 18,758 | 0.00% |

## Verification

- TS7 Autocomplete compatibility all: passed.
- TS7 Accordion public-props-compatibility all: passed.
- TS7 AccordionSummary public-props-compatibility all: passed.
- TS7 Alert public-props-compatibility all: passed.
- TS7 Autocomplete public-props-compatibility all: passed.
- TS7 Avatar public-props-compatibility all: passed.
- TS7 Backdrop public-props-compatibility all: passed.
- TS7 BottomNavigationAction public-props-compatibility all: passed.
- TS7 CardActionArea public-props-compatibility all: passed.
- TS7 Checkbox public-props-compatibility all: passed.
- TS7 Dialog public-props-compatibility all: passed.
- TS7 Drawer public-props-compatibility all: passed.
- TS7 ListItem public-props-compatibility all: passed.
- TS7 Menu public-props-compatibility all: passed.
- TS7 MobileStepper public-props-compatibility all: passed.
- TS7 PaginationItem public-props-compatibility all: passed.
- TS7 Popover public-props-compatibility all: passed.
- TS7 Radio public-props-compatibility all: passed.
- TS7 Snackbar public-props-compatibility all: passed.
- TS7 SpeedDial public-props-compatibility all: passed.
- TS7 SpeedDialAction public-props-compatibility all: passed.
- TS7 StepContent public-props-compatibility all: passed.
- TS7 StepLabel public-props-compatibility all: passed.
- TS7 Switch public-props-compatibility all: passed.
- TS7 TablePagination public-props-compatibility all: passed.
- TS7 TableSortLabel public-props-compatibility all: passed.
- TS7 TextField public-props-compatibility all: passed.
- TS7 Tooltip public-props-compatibility all: passed.
- TS7 SwitchBase public-props-compatibility all: passed.
- TS7 SwipeableDrawer public-props-compatibility all: passed.
- TS7 CardHeader public-props-compatibility all: passed.
- TS7 ListItemText public-props-compatibility all: passed.
- TS7 Accordion existing-type-tests baseline: passed.
- TS7 Accordion existing-type-tests all: passed.
- TS7 Alert existing-type-tests baseline: passed.
- TS7 Alert existing-type-tests all: passed.
- TS7 Autocomplete existing-type-tests baseline: passed.
- TS7 Autocomplete existing-type-tests all: passed.
- TS7 Avatar existing-type-tests baseline: passed.
- TS7 Avatar existing-type-tests all: passed.
- TS7 Backdrop existing-type-tests baseline: passed.
- TS7 Backdrop existing-type-tests all: passed.
- TS7 BottomNavigationAction existing-type-tests baseline: passed.
- TS7 BottomNavigationAction existing-type-tests all: passed.
- TS7 Checkbox existing-type-tests baseline: passed.
- TS7 Checkbox existing-type-tests all: passed.
- TS7 Dialog existing-type-tests baseline: passed.
- TS7 Dialog existing-type-tests all: passed.
- TS7 Drawer existing-type-tests baseline: passed.
- TS7 Drawer existing-type-tests all: passed.
- TS7 ListItem existing-type-tests baseline: passed.
- TS7 ListItem existing-type-tests all: passed.
- TS7 Menu existing-type-tests baseline: passed.
- TS7 Menu existing-type-tests all: passed.
- TS7 Popover existing-type-tests baseline: passed.
- TS7 Popover existing-type-tests all: passed.
- TS7 Radio existing-type-tests baseline: passed.
- TS7 Radio existing-type-tests all: passed.
- TS7 Snackbar existing-type-tests baseline: passed.
- TS7 Snackbar existing-type-tests all: passed.
- TS7 SpeedDial existing-type-tests baseline: passed.
- TS7 SpeedDial existing-type-tests all: passed.
- TS7 StepContent existing-type-tests baseline: passed.
- TS7 StepContent existing-type-tests all: passed.
- TS7 StepLabel existing-type-tests baseline: passed.
- TS7 StepLabel existing-type-tests all: passed.
- TS7 TablePagination existing-type-tests baseline: passed.
- TS7 TablePagination existing-type-tests all: passed.
- TS7 TextField existing-type-tests baseline: passed.
- TS7 TextField existing-type-tests all: passed.
- TS7 Tooltip existing-type-tests baseline: passed.
- TS7 Tooltip existing-type-tests all: passed.
- TS7 CardHeader existing-type-tests baseline: passed.
- TS7 CardHeader existing-type-tests all: passed.
- TS7 ListItemText existing-type-tests baseline: passed.
- TS7 ListItemText existing-type-tests all: passed.
- TS7 Autocomplete declarations all: passed.
- TS7 Autocomplete declarations baseline: passed.
- TS6 Autocomplete compatibility all: passed.
- TS7 Autocomplete generic-relationships baseline: passed.
- TS7 Autocomplete augmentation-and-class-ref baseline: passed.
- TS7 Autocomplete generic-relationships all: passed.
- TS7 Autocomplete augmentation-and-class-ref all: passed.
- TS6 Autocomplete generic-relationships baseline: passed.
- TS6 Autocomplete augmentation-and-class-ref baseline: passed.
- TS6 Autocomplete generic-relationships all: passed.
- TS6 Autocomplete augmentation-and-class-ref all: passed.
- TS6 Autocomplete declarations baseline: passed.
- TS6 Autocomplete declarations all: passed.

Raw records: 824. Failed checks: 4. Full diagnostics are in all-slots-results.jsonl.

Initial harness failures are retained in the raw log: a literal never constraint in the test itself (fixed by the generic original-type alias),
missing generated CloseRounded typings (supplied locally using the exact icon typing-generator body), and unrelated Node ambient errors
(declaration validation now uses browser React globals only). The latest verification rows above supersede those initial runs.

An unmeasured compatibility case remains unverified. Check-time measurements are noisy; repeat runs before making timing claims.
This does not establish compatibility with the minimum supported TypeScript release or every downstream augmentation.
Negative reduction percentages mean more instantiations. Counts from separate programs must not be added together.

Fixtures, captured baseline hashes, source diff, and isolated declarations are in all-slots-cases/.
