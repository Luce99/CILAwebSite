import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";

const ADMIN_PAGES = [
  { label: "Productos", path: "/" },
  { label: "Usuarios", path: "/users" },
  { label: "Ventas", path: "/ventas" },
];

const STYLES = {
  appBar: {
    backgroundColor: "#2C2C2E",
    boxShadow: "0 2px 8px rgba(0,0,0,.15)",
  },
  navButton: {
    fontSize: { xs: "0.75rem", sm: "0.85rem", md: "1rem" },
    fontWeight: 700,
    letterSpacing: { xs: "1px", md: "2px" },
    color: "#F5EDE3",
    textTransform: "uppercase",
    padding: { xs: "8px 12px", sm: "10px 24px" },
    "&:hover": {
      backgroundColor: "rgba(245, 237, 227, 0.15)",
    },
  },
  navLink: {
    color: "inherit",
    textDecoration: "none",
  },
};

/** Barra de navegacion del panel de administracion. */
export default function NavAdministrador() {
  return (
    <AppBar position="static" sx={STYLES.appBar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "center", gap: "8px" }}>
          {ADMIN_PAGES.map((page) => (
            <Button key={page.path} sx={STYLES.navButton}>
              <Link to={page.path} style={STYLES.navLink}>
                {page.label}
              </Link>
            </Button>
          ))}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
