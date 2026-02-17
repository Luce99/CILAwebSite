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

const PAGES = [
  { label: "Home", path: "/" },
  { label: "Caoticas", path: "/caoticas" },
  { label: "Encantadoras", path: "/encantadoras" },
];

const ADMIN_ROLE_NAME = "administrador";

function buildUserMenuItems(isLogged, rolString) {
  if (!isLogged) {
    return [{ label: "Cuenta", path: "/signin" }];
  }

  const isAdmin = rolString && rolString.includes(ADMIN_ROLE_NAME);

  if (isAdmin) {
    return [
      { label: "Cuenta", path: "/accountPage" },
      { label: "Administracion", path: "/admistracion" },
    ];
  }

  return [{ label: "Cuenta", path: "/accountPage" }];
}

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [state, dispatch] = useStateValue();
  const { basket } = state;
  const navigate = useNavigate();

  const isLogged = localStorage.getItem("isLogged");
  const rolRaw = localStorage.getItem("Rol");
  const rolString = rolRaw ? String(rolRaw) : "";
  const settings = buildUserMenuItems(isLogged, rolString);

  function handleAuth() {
    if (isLogged) {
      localStorage.removeItem("isLogged");
      localStorage.removeItem("Rol");
      localStorage.removeItem("nombre");
      localStorage.removeItem("id");
      dispatch({
        type: actionTypes.CLEAR_CART,
        basket: [],
      });
      navigate("/");
    }
  }

  function handleOpenNavMenu(event) {
    setAnchorElNav(event.currentTarget);
  }

  function handleOpenUserMenu(event) {
    setAnchorElUser(event.currentTarget);
  }

  function handleCloseNavMenu() {
    setAnchorElNav(null);
  }

  function handleCloseUserMenu() {
    setAnchorElUser(null);
  }

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
              src={logo}
              alt="logo"
              height={"50rem"}
              width={"50rem"}
              style={{ marginRight: 8, display: "flex" }}
            />
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu de navegacion"
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
              {PAGES.map((page) => (
                <div className="home" key={page.path}>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography>
                      <Link
                        to={page.path}
                        style={{ color: "inherit", textDecoration: "inherit" }}
                      >
                        {page.label}
                      </Link>
                    </Typography>
                  </MenuItem>
                </div>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <div className="nav">
              {PAGES.map((page) => (
                <Button
                  key={page.path}
                  onClick={handleCloseNavMenu}
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#ffffff",
                  }}
                >
                  <Link
                    className="link"
                    to={page.path}
                    style={{ color: "inherit", textDecoration: "inherit" }}
                  >
                    <span>{page.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </Box>
          <Link
            className="login"
            to="/signin"
            style={{ color: "inherit", textDecoration: "inherit" }}
          >
            <Button color="inherit" style={{ fontSize: "20px" }} onClick={handleAuth}>
              <strong>{isLogged ? "Log out" : "Log in"}</strong>
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
            <Tooltip title="Opciones">
              <div className="account">
                <IconButton
                  onClick={handleOpenUserMenu}
                  edge="start"
                  color="inherit"
                  aria-label="menu de usuario"
                  sx={{ p: 0 }}
                >
                  <AccountCircleIcon fontSize="large" />
                </IconButton>
              </div>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar-user"
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
                <div className="settings" key={setting.path}>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography
                      style={{ fontWeight: "bold", color: "#f20a95" }}
                    >
                      <Link
                        to={setting.path}
                        style={{ color: "inherit", textDecoration: "inherit" }}
                      >
                        {setting.label}
                      </Link>
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
