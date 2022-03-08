import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import logo from '../images/logo.png';
import { Badge, MenuItem } from '@mui/material';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style ={{backgroundColor: "transparent",
      boxShadow: "0px 0px 0px 0px",
      color: "black"}}>
        <Toolbar className='menu'>
        <div className='left'>
        <div>
        <img
            noWrap
            component="div"
            src = {logo}
            alt = "logo"
            height={"50rem"}
            width={"50rem"}
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
          </img>
          </div>
          <div>
          <MenuItem>
                <Typography  variant = "h6" >Productos</Typography>
          </MenuItem>
          </div>
          </div>
          {/*<Typography variant = "h4">CILA</Typography>*/}
          <div className='right'>
              <div>
          <Button color="inherit">Login</Button>
             </div>
             <div>
          <IconButton size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}>
            <Badge badgeContent={2} style={{color: "#000000"}}>
          <ShoppingCart fontSize='large' />
           </Badge>
          </IconButton>
             </div>
             <div>
          <IconButton size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}>
          <AccountCircleIcon fontSize='large' />
          </IconButton>
          </div>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}