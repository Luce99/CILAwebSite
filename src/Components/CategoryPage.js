import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import Product from "./Product";
import products from "./product-data";

const VALID_CATEGORIES = {
  tops: "Tops",
  bottoms: "Bottoms",
  vestidos: "Vestidos",
  novedades: "Novedades",
};

const STYLES = {
  container: {
    padding: "2rem 1rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#1D1D1F",
    textAlign: "center",
    marginBottom: "2rem",
    letterSpacing: "2px",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#6E6E73",
    fontSize: "1.1rem",
    padding: "3rem 0",
  },
};

/** Pagina generica de categoria que filtra productos por URL param. */
export default function CategoryPage() {
  const { categoryName } = useParams();

  const categoryLabel = VALID_CATEGORIES[categoryName] || categoryName;

  function getFilteredProducts() {
    return products.filter(
      (product) => product.category.toLowerCase() === categoryLabel.toLowerCase()
    );
  }

  const filteredProducts = getFilteredProducts();
  const hasProducts = filteredProducts.length > 0;

  function renderProducts() {
    if (hasProducts === false) {
      return (
        <Typography sx={STYLES.emptyMessage}>
          No hay productos disponibles en esta categoría por el momento.
        </Typography>
      );
    }

    return (
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
            <Product product={product} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box sx={STYLES.container}>
      <Typography sx={STYLES.title}>
        {categoryLabel.toUpperCase()}
      </Typography>
      {renderProducts()}
    </Box>
  );
}
