import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddShoppingCart from "@mui/icons-material/AddShoppingCart";
import ShareIcon from "@mui/icons-material/Share";
import accounting from "accounting";
import { actionTypes } from "../reducer";
import { useStateValue } from "../StateProvider";
import ImageCarousel from "./ImageCarousel";
import VariationSelector from "./VariationSelector";

const STYLES = {
  card: {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    backgroundColor: "#FFFFFF",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    },
  },
  header: {
    padding: "12px 12px 8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  productName: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#1D1D1F",
    lineHeight: 1.3,
  },
  price: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#5E60CE",
    whiteSpace: "nowrap",
  },
  productType: {
    fontSize: "0.75rem",
    color: "#6E6E73",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    padding: "0 12px",
    marginBottom: "4px",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px 12px",
  },
  addButton: {
    backgroundColor: "#5E60CE",
    color: "#FFFFFF",
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.85rem",
    padding: "6px 16px",
    "&:hover": {
      backgroundColor: "#4A4CC4",
    },
  },
  shareIcon: {
    color: "#6E6E73",
  },
};

/** Tarjeta de producto con carousel de imagenes y selector de variaciones. */
export default function Product({ product }) {
  const { id, name, productType, image, images, price, description, colors, sizes } = product;
  const [, dispatch] = useStateValue();
  const [selectedColor, setSelectedColor] = useState(resolveDefaultColor());
  const [selectedSize, setSelectedSize] = useState(resolveDefaultSize());

  function resolveDefaultColor() {
    if (colors && colors.length > 0) {
      return colors[0];
    }
    return "";
  }

  function resolveDefaultSize() {
    if (sizes && sizes.length > 0) {
      return sizes[0];
    }
    return "";
  }

  function resolveImages() {
    if (images && images.length > 0) {
      return images;
    }
    return [image];
  }

  function buildVariantId() {
    return id + "-" + selectedColor + "-" + selectedSize;
  }

  function handleAddToBasket() {
    dispatch({
      type: actionTypes.ADD_TO_BASKET,
      item: {
        id: buildVariantId(),
        productId: id,
        name: name,
        productType: productType,
        image: resolveImages()[0],
        price: price,
        description: description,
        selectedColor: selectedColor,
        selectedSize: selectedSize,
        quantity: 1,
      },
    });
  }

  function buildShareUrl() {
    return "https://api.whatsapp.com/send?text=" + encodeURIComponent(name + " - LIMO");
  }

  return (
    <Card sx={STYLES.card}>
      <ImageCarousel images={resolveImages()} altText={name} />

      <Box sx={STYLES.header}>
        <Typography sx={STYLES.productName}>{name}</Typography>
        <Typography sx={STYLES.price}>
          {accounting.formatMoney(price, "$", 0, ".", ",")}
        </Typography>
      </Box>

      <Typography sx={STYLES.productType}>{productType}</Typography>

      <VariationSelector
        colors={colors}
        sizes={sizes}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        onColorChange={setSelectedColor}
        onSizeChange={setSelectedSize}
      />

      <CardActions sx={STYLES.actions}>
        <Button
          variant="contained"
          startIcon={<AddShoppingCart />}
          onClick={handleAddToBasket}
          sx={STYLES.addButton}
        >
          Agregar
        </Button>
        <IconButton
          aria-label="Compartir"
          href={buildShareUrl()}
          target="_blank"
          sx={STYLES.shareIcon}
        >
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
