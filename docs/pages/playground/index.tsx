import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { StyledEngineProvider } from '@mui/styled-engine';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Icon, Typography } from '@mui/material';

function BasicMenu1({ onMouseEnter, onMouseLeave }) {
  return (
    <MenuItem
      onClick={onMouseEnter}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          onMouseEnter(event);
        }
      }}
      // onMouseLeave={onMouseLeave}
      sx={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Typography>Dashboard</Typography>
      <Icon>
        <ChevronRightIcon />
      </Icon>
    </MenuItem>
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

  const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl1);
  const handleClick1 = (event: React.MouseEvent<HTMLLIElement>) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose1 = () => {
    // handleClose();
    setAnchorEl1(null);
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
          <BasicMenu1 onMouseEnter={handleClick1} onMouseLeave={handleClose1} />
        </Menu>
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
      </StyledEngineProvider>
    </div>
  );
}
