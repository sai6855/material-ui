import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { StyledEngineProvider } from '@mui/styled-engine';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Icon, Typography } from '@mui/material';

const options = [
  {
    value: 'a',
  },
  {
    value: 'b',
    triggerMenulevel: 1,
    nestedOptions: [
      {
        value: 'e',
        triggerMenulevel: 2,
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
    triggerMenulevel: 1,
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

  const [anchors, setAnchors] = React.useState({
    elements: new Array(MENU_LEVELS).fill(null),
    options: new Array(MENU_LEVELS).fill(null),
  });

  const handleClick = (event, level = 0, nestedOptions = options) => {
    const target = event.currentTarget;

    setAnchors((prevAnchors) => ({
      elements: prevAnchors.elements.map((element, index) => (index === level ? target : element)),
      options: prevAnchors.options.map((element, index) =>
        index === level ? nestedOptions : element,
      ),
    }));
  };
  const handleClose = () => {
    setAnchors({
      elements: new Array(MENU_LEVELS).fill(null),
      options: new Array(MENU_LEVELS).fill(null),
    });
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

        {anchors.elements.map((anchorElement, index) =>
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
              {(anchors.options[index] || []).map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={(event) => {
                    if (option.triggerMenulevel) {
                      handleClick(event, option.triggerMenulevel, option.nestedOptions);
                    } else {
                      handleClose();
                    }
                  }}
                  {...(option.triggerMenulevel
                    ? {
                        onKeyDown: (event) => {
                          if (event.key === 'ArrowRight') {
                            handleClick(event, option.triggerMenulevel, option.nestedOptions);
                          }
                        },
                      }
                    : {})}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography>{option.value}</Typography>
                    {option.triggerMenulevel ? (
                      <Icon>
                        <ChevronRightIcon />
                      </Icon>
                    ) : null}
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          ) : null,
        )}
      </StyledEngineProvider>
    </div>
  );
}
