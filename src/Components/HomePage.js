import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Product from "./Product";
import products, { CATEGORIES } from "./product-data";
import { Slideshow, Slide, TextoSlide } from "./Slideshow";
import { blusa, cila1, cila2, cila3, cila4, cila5, cila6 } from "./images";

const FEATURED_COUNT = 8;
const BRAND_NAME = "LIMO";

const STYLES = {
  hero: {
    textAlign: "center",
    padding: "4rem 1rem 2rem",
  },
  heroTitle: {
    fontSize: "3.5rem",
    fontWeight: 800,
    letterSpacing: "8px",
    color: "#1D1D1F",
    marginBottom: "12px",
  },
  heroSubtitle: {
    fontSize: "1.1rem",
    color: "#6E6E73",
    maxWidth: "500px",
    margin: "0 auto 2rem",
    fontFamily: "system-ui, -apple-system, sans-serif",
    lineHeight: 1.6,
  },
  categoriesRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "3rem",
  },
  categoryButton: {
    backgroundColor: "#5E60CE",
    color: "#FFFFFF",
    borderRadius: "24px",
    textTransform: "none",
    fontWeight: 600,
    padding: "8px 24px",
    "&:hover": {
      backgroundColor: "#4A4CC4",
    },
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#1D1D1F",
    textAlign: "center",
    margin: "3rem 0 1.5rem",
    letterSpacing: "2px",
  },
  productsSection: {
    padding: "0 1rem",
    maxWidth: "1200px",
    margin: "0 auto 3rem",
  },
  slideshowContainer: {
    maxWidth: "900px",
    margin: "0 auto 2rem",
  },
};

/** Pagina principal con hero, categorias destacadas, slideshow y productos destacados. */
export default function HomePage() {
  function getFeaturedProducts() {
    return products.slice(0, FEATURED_COUNT);
  }

  function renderCategoryButtons() {
    return (
      <Box sx={STYLES.categoriesRow}>
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.path}
            component={Link}
            to={cat.path}
            variant="contained"
            sx={STYLES.categoryButton}
          >
            {cat.name}
          </Button>
        ))}
      </Box>
    );
  }

  function renderSlideshow() {
    return (
      <Box sx={STYLES.slideshowContainer}>
        <Slideshow controles={true} autoplay={true} velocidad="3000" intervalo="5000">
          <Slide>
            <Link to="/categoria/tops">
              <img src={blusa} alt="Blusa destacada" />
            </Link>
            <TextoSlide>
              <p>NUEVO</p>
            </TextoSlide>
          </Slide>
          <Slide>
            <Link to="/categoria/tops">
              <img src={cila1} alt="Producto destacado" />
            </Link>
            <TextoSlide>
              <p>TENDENCIA</p>
            </TextoSlide>
          </Slide>
          <Slide>
            <Link to="/categoria/vestidos">
              <img src={cila2} alt="Vestido destacado" />
            </Link>
            <TextoSlide>
              <p>NUEVO</p>
            </TextoSlide>
          </Slide>
          <Slide>
            <Link to="/categoria/tops">
              <img src={cila3} alt="Top destacado" />
            </Link>
            <TextoSlide>
              <p>POPULAR</p>
            </TextoSlide>
          </Slide>
          <Slide>
            <Link to="/categoria/bottoms">
              <img src={cila4} alt="Bottom destacado" />
            </Link>
            <TextoSlide>
              <p>OFERTA</p>
            </TextoSlide>
          </Slide>
          <Slide>
            <Link to="/categoria/novedades">
              <img src={cila5} alt="Novedad" />
            </Link>
            <TextoSlide>
              <p>NUEVO</p>
            </TextoSlide>
          </Slide>
          <Slide>
            <Link to="/categoria/vestidos">
              <img src={cila6} alt="Vestido" />
            </Link>
            <TextoSlide>
              <p>TENDENCIA</p>
            </TextoSlide>
          </Slide>
        </Slideshow>
      </Box>
    );
  }

  function renderFeaturedProducts() {
    const featured = getFeaturedProducts();
    return (
      <Box sx={STYLES.productsSection}>
        <Grid container spacing={3}>
          {featured.map((product) => (
            <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
              <Product product={product} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <main>
      <Box sx={STYLES.hero}>
        <Typography sx={STYLES.heroTitle}>{BRAND_NAME}</Typography>
        <Typography sx={STYLES.heroSubtitle}>
          Moda para todos. Descubre nuestra colección con estilo, calidad y
          variedad para expresar tu personalidad.
        </Typography>
        {renderCategoryButtons()}
      </Box>

      {renderSlideshow()}

      <Typography sx={STYLES.sectionTitle}>DESTACADOS</Typography>
      {renderFeaturedProducts()}
    </main>
  );
}
