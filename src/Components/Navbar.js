import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logo from "./images/logo.png";
import { Badge, MenuItem } from "@mui/material";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Container } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import { actionTypes, getItemsTotal } from "../reducer";
import { useNavigate } from "react-router-dom";

const rol = JSON.parse(localStorage.getItem("Rol"));

function administracion(rol){
  console.log(rol)
  if (rol){
  if (rol.nombre =="administrador"){
     return [<Link to="/accountPage">Cuenta</Link>, "Administración"]
    } 
  else  { 
    return [<Link to="/accountPage">Cuenta</Link>]
  }
} else {
  return [<Link to="/signin">Cuenta</Link>]
}
}
const pages = [
  <Link
    className="link"
    to="/"
    style={{ color: "inherit", textDecoration: "inherit" }}
  >
    <span>Home</span>
  </Link>,
  <Link
    className="link"
    to="/caoticas"
    style={{ color: "inherit", textDecoration: "inherit" }}
  >
    <span>Caóticas</span>
  </Link>,
  <Link
  className="link"
  to="/encantadoras"
  style={{ color: "inherit", textDecoration: "inherit" }}
>
  <span>Encantadoras</span>
</Link>,
];
const settings = administracion(rol);

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [state, dispatch] = useStateValue();
  const { basket } = state;
  const isLogged = localStorage.getItem("isLogged");
  const history =useNavigate();

  const handleAuth = ()=>{
    if (isLogged){
      localStorage.removeItem("isLogged");
      localStorage.removeItem("Rol");
      localStorage.removeItem("nombre");
      localStorage.removeItem("id");
      dispatch({
        type: actionTypes.CLEAR_CART,
        basket: [],
      })
      history("/")
    }
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: "transparent",
        boxShadow: "0px 0px 0px 0px",
        color: "white",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters className="menu">
          <Link to="/">
            <img
              nowrap="true"
              component="div"
              src={logo}
              alt="logo"
              height={"50rem"}
              width={"50rem"}
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            ></img>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <div className="home">
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography>{page}</Typography>
                  </MenuItem>
                </div>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <div className="nav">
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#ffffff",
                  }}
                >
                  {page}
                </Button>
              ))}
            </div>
          </Box>
          <Link
            className="login"
            to="/signin"
            style={{ color: "inherit", textDecoration: "inherit" }}
          >
            <Button color="inherit" style={{fontSize:"20px"}} onClick={handleAuth}>
            <strong>{isLogged ?"Log out" : "Log in"}</strong>
            </Button>
          </Link>
          <Link to="carritoDeCompras">
            <div className="cart">
              <IconButton color="inherit">
                <Badge
                  badgeContent={getItemsTotal(basket)}
                  style={{ color: "#ffffff" }}
                >
                  <ShoppingCart fontSize="large" />
                </Badge>
              </IconButton>
            </div>
          </Link>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <div className="account">
                <IconButton
                  onClick={handleOpenUserMenu}
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ p: 0 }}
                >
                  <AccountCircleIcon fontSize="large" />
                </IconButton>
              </div>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <div className="settings">
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography
                      style={{ fontWeight: "bold", color: "#f20a95" }}
                    >
                      {setting}
                    </Typography>
                  </MenuItem>
                </div>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
