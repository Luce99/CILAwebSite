import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import { actionTypes, getItemsTotal } from "../reducer";
import { CATEGORIES } from "./product-data";

const BRAND_NAME = "LIMO";
const ADMIN_ROLE_NAME = "administrador";

const STYLES = {
  appBar: {
    backgroundColor: "#2C2C2E",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
  },
  brandName: {
    fontWeight: 800,
    fontSize: "1.6rem",
    letterSpacing: "4px",
    color: "#F5EDE3",
    textDecoration: "none",
    marginRight: "16px",
  },
  navLink: {
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "#D4C5B5",
    textTransform: "uppercase",
    letterSpacing: "1px",
    "&:hover": {
      color: "#E8DDD1",
    },
  },
  authButton: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#F5EDE3",
    textTransform: "none",
  },
  iconColor: {
    color: "#F5EDE3",
  },
  menuItemText: {
    fontWeight: 600,
    color: "#7C6A56",
  },
};

function buildUserMenuItems(isLogged, rolString) {
  const hasSession = Boolean(isLogged);
  if (hasSession === false) {
    return [{ label: "Cuenta", path: "/signin" }];
  }

  const isAdmin = rolString && rolString.includes(ADMIN_ROLE_NAME);
  if (isAdmin) {
    return [
      { label: "Cuenta", path: "/accountPage" },
      { label: "Administración", path: "/admistracion" },
    ];
  }

  return [{ label: "Cuenta", path: "/accountPage" }];
}

function resolveAuthLabel(isLogged) {
  if (Boolean(isLogged)) {
    return "Salir";
  }
  return "Ingresar";
}

/** Barra de navegacion principal con marca LIMO y categorias de productos. */
export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [state, dispatch] = useStateValue();
  const { basket } = state;
  const navigate = useNavigate();

  const isLogged = localStorage.getItem("isLogged");
  const rolRaw = localStorage.getItem("Rol");
  const rolString = rolRaw ? String(rolRaw) : "";
  const settings = buildUserMenuItems(isLogged, rolString);

  function handleAuth() {
    if (Boolean(isLogged)) {
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

  function renderMobileMenu() {
    return (
      <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
        <IconButton
          size="large"
          aria-label="menú de navegación"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          sx={STYLES.iconColor}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <MenuItem onClick={handleCloseNavMenu}>
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Inicio
            </Link>
          </MenuItem>
          {CATEGORIES.map((cat) => (
            <MenuItem key={cat.path} onClick={handleCloseNavMenu}>
              <Link to={cat.path} style={{ color: "inherit", textDecoration: "none" }}>
                {cat.name}
              </Link>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  function renderDesktopMenu() {
    return (
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: "4px" }}>
        <Button component={Link} to="/" sx={STYLES.navLink}>
          Inicio
        </Button>
        {CATEGORIES.map((cat) => (
          <Button key={cat.path} component={Link} to={cat.path} sx={STYLES.navLink}>
            {cat.name}
          </Button>
        ))}
      </Box>
    );
  }

  function renderUserMenu() {
    return (
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Opciones">
          <IconButton
            onClick={handleOpenUserMenu}
            sx={STYLES.iconColor}
          >
            <AccountCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar-user"
          anchorEl={anchorElUser}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {settings.map((setting) => (
            <MenuItem key={setting.path} onClick={handleCloseUserMenu}>
              <Typography sx={STYLES.menuItemText}>
                <Link to={setting.path} style={{ color: "inherit", textDecoration: "none" }}>
                  {setting.label}
                </Link>
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  return (
    <AppBar position="sticky" sx={STYLES.appBar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            component={Link}
            to="/"
            sx={STYLES.brandName}
          >
            {BRAND_NAME}
          </Typography>

          {renderMobileMenu()}
          {renderDesktopMenu()}

          <Link to="/signin" style={{ textDecoration: "none" }}>
            <Button sx={STYLES.authButton} onClick={handleAuth}>
              {resolveAuthLabel(isLogged)}
            </Button>
          </Link>

          <Link to="/carritoDeCompras">
            <IconButton sx={STYLES.iconColor}>
              <Badge badgeContent={getItemsTotal(basket)} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Link>

          {renderUserMenu()}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
