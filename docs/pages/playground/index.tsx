import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { StyledEngineProvider } from '@mui/styled-engine';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Icon, Typography } from '@mui/material';

const options = [
  {
    value: 'a',
  },
  {
    value: 'b',
    triggerLevel: 1,
    nestedOptions: [
      {
        value: 'e',
        triggerLevel: 2,
        nestedOptions: [
          {
            value: 'h',
          },
          {
            value: 'i',
          },
          {
            value: 'j',
          },
        ],
      },
      {
        value: 'f',
      },
      {
        value: 'g',
      },
    ],
  },
  {
    value: 'c',
  },
  {
    value: 'd',
    triggerLevel: 1,
    nestedOptions: [
      {
        value: 'm',
      },
      {
        value: 'n',
      },
      {
        value: '0',
      },
    ],
  },
];

export default function BasicMenu() {
  const MENU_LEVELS = 3;

  const [anchorElements, setAnchorElements] = React.useState(new Array(MENU_LEVELS).fill(null));

  const [menuOptions, setMenuOptions] = React.useState(new Array(MENU_LEVELS).fill(null));

  const handleClick = (event, level = 0, nestedOptions = options) => {
    const target = event.currentTarget;
    setAnchorElements((prev) => prev.map((element, index) => (index === level ? target : element)));

    setMenuOptions((prev) =>
      prev.map((element, index) => (index === level ? nestedOptions : element)),
    );
  };
  const handleClose = () => {
    setAnchorElements((prev) => prev.map(() => null));
    setMenuOptions((prev) => prev.map(() => null));
  };

  return (
    <div>
      <StyledEngineProvider injectFirst>
        <Button
          onClick={(event) => {
            handleClick(event);
          }}
        >
          Dashboard
        </Button>

        {anchorElements.map((anchorElement, index) =>
          anchorElement ? (
            <Menu
              id="basic-menu"
              anchorEl={anchorElement}
              open={Boolean(anchorElement)}
              onClose={handleClose}
              {...(index > 0
                ? {
                    anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'right',
                    },
                  }
                : {})}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {(menuOptions[index] || []).map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={(event) => {
                    if (option.triggerLevel) {
                      console.log('snhnshb');
                      handleClick(event, option.triggerLevel, option.nestedOptions);
                    } else handleClose();
                  }}
                >
                  {option.value}
                </MenuItem>
              ))}
            </Menu>
          ) : null,
        )}
      </StyledEngineProvider>
    </div>
  );
}
