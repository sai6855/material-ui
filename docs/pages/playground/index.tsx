import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { StyledEngineProvider } from '@mui/styled-engine';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Icon, Typography } from '@mui/material';

export default function BasicMenu() {
  const [anchorElements, setAnchorElements] = React.useState([null, null, null]);

  const handleClick = (event, level = 0) => {
    setAnchorElements((prev) =>
      prev.map((element, index) => (index === level ? event.currentTarget : element)),
    );
  };
  const handleClose = (level = 0) => {
    setAnchorElements((prev) => prev.map(() => null));
  };

  return (
    <div>
      <StyledEngineProvider injectFirst>
        <Button onClick={handleClick}>Dashboard</Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorElements[0]}
          open={Boolean(anchorElements[0])}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={(event) => handleClick(event, 1)}>Dashboard</MenuItem>
        </Menu>
        <Menu
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          anchorEl={anchorElements[1]}
          open={Boolean(anchorElements[1])}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={(event) => handleClick(event, 2)}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Dashboard</MenuItem>
        </Menu>

        <Menu
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          anchorEl={anchorElements[2]}
          open={Boolean(anchorElements[2])}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Dashboard</MenuItem>
        </Menu>
      </StyledEngineProvider>
    </div>
  );
}
