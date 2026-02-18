import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

const STYLES = {
  section: {
    marginBottom: "8px",
    padding: "0 12px",
  },
  label: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#6E6E73",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "6px",
  },
  chipsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
};

const SELECTED_CHIP_STYLE = {
  backgroundColor: "#5E60CE",
  color: "#FFFFFF",
  fontWeight: 600,
  border: "none",
};

const DEFAULT_CHIP_STYLE = {
  backgroundColor: "transparent",
  color: "#1D1D1F",
  border: "1px solid #D1D1D6",
};

/** Selector de variaciones (colores, tallas) para un producto. */
export default function VariationSelector({
  colors,
  sizes,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}) {
  const hasColors = colors && colors.length > 0;
  const hasSize = sizes && sizes.length > 0;

  function resolveChipStyle(isSelected) {
    if (isSelected) {
      return SELECTED_CHIP_STYLE;
    }
    return DEFAULT_CHIP_STYLE;
  }

  function renderColorChips() {
    if (hasColors === false) {
      return null;
    }
    return (
      <Box sx={STYLES.section}>
        <Typography sx={STYLES.label}>Color</Typography>
        <Box sx={STYLES.chipsRow}>
          {colors.map((color) => {
            const isSelected = color === selectedColor;
            return (
              <Chip
                key={color}
                label={color}
                size="small"
                onClick={() => onColorChange(color)}
                sx={resolveChipStyle(isSelected)}
              />
            );
          })}
        </Box>
      </Box>
    );
  }

  function renderSizeChips() {
    if (hasSize === false) {
      return null;
    }
    return (
      <Box sx={STYLES.section}>
        <Typography sx={STYLES.label}>Talla</Typography>
        <Box sx={STYLES.chipsRow}>
          {sizes.map((size) => {
            const isSelected = size === selectedSize;
            return (
              <Chip
                key={size}
                label={size}
                size="small"
                onClick={() => onSizeChange(size)}
                sx={resolveChipStyle(isSelected)}
              />
            );
          })}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {renderColorChips()}
      {renderSizeChips()}
    </Box>
  );
}
