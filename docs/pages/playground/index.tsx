import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { StyledEngineProvider } from '@mui/styled-engine';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Icon, Typography } from '@mui/material';

function NestedMenuTrigger({ children }) {
  const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl1);
  const handleClick1 = (event: React.MouseEvent<HTMLLIElement>) => {
    setAnchorEl1(event.currentTarget);
  };
  console.log({ anchorEl1 });
  const handleClose1 = (event) => {
    // handleClose();
    console.log('sjisnjns', event);
    if (event) {
      event.stopPropagation();
    }
    setAnchorEl1(null);
  };
  return (
    <>
      <MenuItem
        onClick={handleClick1}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            handleClick1(event);
          }
        }}
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography>{children}</Typography>
        <Icon>
          <ChevronRightIcon />
        </Icon>
      </MenuItem>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl1}
        open={open1}
        onClose={handleClose1}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              handleClose1();
            }
          }}
          onClick={handleClose1}
        >
          Profile
        </MenuItem>
        <MenuItem
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              handleClose1();
            }
          }}
          onClick={handleClose1}
        >
          My account
        </MenuItem>
        <MenuItem
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              handleClose1();
            }
          }}
          onClick={handleClose1}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <StyledEngineProvider injectFirst>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          Dashboard
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <NestedMenuTrigger>Dashboard</NestedMenuTrigger>
        </Menu>
      </StyledEngineProvider>
    </div>
  );
}
