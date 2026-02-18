import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Link } from "react-router-dom";
import { CATEGORIES } from "./product-data";

const BRAND_NAME = "LIMO";

const STYLES = {
  footer: {
    backgroundColor: "#2C2C2E",
    color: "#D4C5B5",
    padding: { xs: "2rem 0 1.5rem", sm: "3rem 0 2rem" },
    marginTop: { xs: "2rem", md: "4rem" },
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: "0.85rem",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "16px",
  },
  contactLink: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#D4C5B5",
    textDecoration: "none",
    fontSize: "0.9rem",
    marginBottom: "8px",
    "&:hover": {
      color: "#F5EDE3",
    },
  },
  categoryLink: {
    color: "#D4C5B5",
    textDecoration: "none",
    display: "block",
    fontSize: "0.9rem",
    marginBottom: "8px",
  },
  copyright: {
    textAlign: "center",
    paddingTop: "2rem",
    fontSize: "0.8rem",
    color: "#6E6E73",
    borderTop: "1px solid #333",
    marginTop: "2rem",
  },
  socialRow: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
  socialIcon: {
    color: "#D4C5B5",
    "&:hover": {
      color: "#F5EDE3",
    },
  },
};

/** Footer con contacto, categorias y redes sociales de LIMO. */
export default function Footer() {
  return (
    <Box sx={STYLES.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography sx={STYLES.sectionTitle}>Contacto</Typography>
            <Box
              component="a"
              href="https://wa.me/message/OTCJZJCQNK2JO1"
              target="_blank"
              sx={STYLES.contactLink}
            >
              <WhatsAppIcon fontSize="small" />
              +57 3125511227
            </Box>
            <Box
              component="a"
              href="mailto:cila.autenticas@gmail.com"
              target="_blank"
              sx={STYLES.contactLink}
            >
              <EmailIcon fontSize="small" />
              contacto@limo.com
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography sx={STYLES.sectionTitle}>Categorías</Typography>
            {CATEGORIES.map((cat) => (
              <Link key={cat.path} to={cat.path} style={STYLES.categoryLink}>
                {cat.name}
              </Link>
            ))}
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography sx={STYLES.sectionTitle}>Síguenos</Typography>
            <Box sx={STYLES.socialRow}>
              <IconButton
                component="a"
                href="https://instagram.com/cila.autenticas?utm_medium=copy_link"
                target="_blank"
                sx={STYLES.socialIcon}
                size="small"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.facebook.com/CILAutenticas/"
                target="_blank"
                sx={STYLES.socialIcon}
                size="small"
              >
                <FacebookIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Typography sx={STYLES.copyright}>
          {BRAND_NAME} &reg; {new Date().getFullYear()} &mdash; Desarrollado
          por Lucero Mojica
        </Typography>
      </Container>
    </Box>
  );
}
