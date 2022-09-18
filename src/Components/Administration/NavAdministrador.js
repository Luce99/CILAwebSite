import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Badge, MenuItem } from "@mui/material";
import { IconButton } from "@mui/material";
import { Container } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const pages = [
  <Link
    className="link"
    to="/"
    style={{ color: "inherit", textDecoration: "inherit" }}
  >
    <span>Productos</span>
  </Link>,
  <Link
    className="link"
    to="/users"
    style={{ color: "inherit", textDecoration: "inherit" }}
  >
    <span>Usuarios</span>
  </Link>,
  <Link
  className="link"
  to="/users"
  style={{ color: "inherit", textDecoration: "inherit" }}
>
  <span>Ventas</span>
</Link>,
];

export default function NavAdministrador() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const isLogged = localStorage.getItem("isLogged");
  const history =useNavigate();

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
        <Toolbar disableGutters className="menuAdmin">
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <div className="navAdmin">
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
        </Toolbar>
      </Container>
    </AppBar>
  );
}
