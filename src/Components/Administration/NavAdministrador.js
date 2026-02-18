import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";

const ADMIN_ROLE = "administrador";

const ALL_PAGES = [
  { label: "Productos", path: "/administracion/productos", roles: [ADMIN_ROLE, "colaborador"] },
  { label: "Usuarios", path: "/administracion/usuarios", roles: [ADMIN_ROLE] },
  { label: "Aprobaciones", path: "/administracion/aprobaciones", roles: [ADMIN_ROLE] },
  { label: "Mis propuestas", path: "/administracion/mis-propuestas", roles: ["colaborador"] },
  { label: "Ventas", path: "/administracion/ventas", roles: [ADMIN_ROLE] },
];

const STYLES = {
  appBar: {
    backgroundColor: "#2C2C2E",
    boxShadow: "0 2px 8px rgba(0,0,0,.15)",
  },
  navButton: {
    fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
    fontWeight: 700,
    letterSpacing: { xs: "0.5px", md: "1.5px" },
    color: "#F5EDE3",
    textTransform: "uppercase",
    padding: { xs: "6px 8px", sm: "8px 16px" },
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "rgba(245, 237, 227, 0.15)",
    },
  },
};

/** Barra de navegacion del panel de administracion con permisos por rol. */
export default function NavAdministrador() {
  const rolRaw = localStorage.getItem("Rol");
  const currentRole = rolRaw ? String(rolRaw).toLowerCase().trim() : "";

  function getVisiblePages() {
    return ALL_PAGES.filter((page) => page.roles.includes(currentRole));
  }

  const visiblePages = getVisiblePages();

  return (
    <AppBar position="static" sx={STYLES.appBar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "center", gap: "4px", flexWrap: "wrap" }}>
          {visiblePages.map((page) => (
            <Button
              key={page.path}
              component={Link}
              to={page.path}
              sx={STYLES.navButton}
            >
              {page.label}
            </Button>
          ))}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
