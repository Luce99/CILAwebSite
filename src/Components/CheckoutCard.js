import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import accounting from "accounting";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";

const STYLES = {
  card: {
    display: "flex",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    backgroundColor: "#FFFFFF",
    marginBottom: "12px",
  },
  image: {
    width: 120,
    minHeight: 120,
    objectFit: "cover",
  },
  content: {
    flex: 1,
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  name: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#1D1D1F",
  },
  price: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#5E60CE",
  },
  variationChip: {
    fontSize: "0.7rem",
    height: "22px",
    backgroundColor: "#F0F0F5",
    color: "#6E6E73",
  },
  chipRow: {
    display: "flex",
    gap: "4px",
    marginTop: "4px",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  quantity: {
    fontWeight: 700,
    fontSize: "1rem",
    color: "#1D1D1F",
    minWidth: "30px",
    textAlign: "center",
  },
};

/** Tarjeta de producto en el carrito de compras con controles de cantidad. */
export default function CheckoutCard({ product }) {
  const { id, name, image, price, quantity, selectedColor, selectedSize } = product;
  const [, dispatch] = useStateValue();

  function handleAddOne() {
    dispatch({
      type: actionTypes.ADD_TO_BASKET,
      item: product,
    });
  }

  function handleRemoveOne() {
    dispatch({
      type: actionTypes.REMOVE_ONE_FROM_BASKET,
      id: id,
    });
  }

  function handleRemoveAll() {
    dispatch({
      type: actionTypes.REMOVE_ALL,
      id: id,
    });
  }

  function renderVariationChips() {
    const hasColor = Boolean(selectedColor);
    const hasSize = Boolean(selectedSize);
    const hasAnyVariation = hasColor || hasSize;

    if (hasAnyVariation === false) {
      return null;
    }

    return (
      <Box sx={STYLES.chipRow}>
        {hasColor && <Chip label={selectedColor} size="small" sx={STYLES.variationChip} />}
        {hasSize && <Chip label={selectedSize} size="small" sx={STYLES.variationChip} />}
      </Box>
    );
  }

  return (
    <Card sx={STYLES.card}>
      <CardMedia
        component="img"
        image={image}
        alt={name}
        sx={STYLES.image}
      />
      <Box sx={STYLES.content}>
        <Box>
          <Typography sx={STYLES.name}>{name}</Typography>
          {renderVariationChips()}
          <Typography sx={STYLES.price}>
            {accounting.formatMoney(price, "$", 0, ".", ",")}
          </Typography>
        </Box>
        <CardActions sx={STYLES.actions} disableSpacing>
          <IconButton aria-label="Eliminar todo" onClick={handleRemoveAll} size="small">
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
          <IconButton aria-label="Reducir cantidad" onClick={handleRemoveOne} size="small">
            <RemoveCircleOutlineIcon fontSize="small" />
          </IconButton>
          <Typography sx={STYLES.quantity}>{quantity}</Typography>
          <IconButton aria-label="Aumentar cantidad" onClick={handleAddOne} size="small">
            <AddCircleIcon fontSize="small" sx={{ color: "#5E60CE" }} />
          </IconButton>
        </CardActions>
      </Box>
    </Card>
  );
}
