import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";

const STYLES = {
  container: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    borderRadius: "8px",
    backgroundColor: "#F0F0F0",
  },
  image: {
    width: "100%",
    height: "330px",
    objectFit: "cover",
    display: "block",
    transition: "opacity 0.3s ease",
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(255,255,255,0.85)",
    color: "#1D1D1F",
    width: "36px",
    height: "36px",
    zIndex: 2,
  },
  arrowLeft: {
    left: "8px",
  },
  arrowRight: {
    right: "8px",
  },
  dotsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "6px",
    padding: "8px 0",
    position: "absolute",
    bottom: "8px",
    width: "100%",
  },
  dotBase: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
};

/** Carousel de imagenes con flechas izquierda/derecha y puntos indicadores. */
export default function ImageCarousel({ images, altText }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasMultipleImages = images && images.length > 1;

  function handlePrevious() {
    setCurrentIndex((prev) => {
      const isAtStart = prev === 0;
      if (isAtStart) {
        return images.length - 1;
      }
      return prev - 1;
    });
  }

  function handleNext() {
    setCurrentIndex((prev) => {
      const isAtEnd = prev === images.length - 1;
      if (isAtEnd) {
        return 0;
      }
      return prev + 1;
    });
  }

  function handleDotClick(index) {
    setCurrentIndex(index);
  }

  function resolveCurrentImage() {
    if (images && images.length > 0) {
      return images[currentIndex];
    }
    return "";
  }

  function resolveDotColor(index) {
    if (index === currentIndex) {
      return "#5E60CE";
    }
    return "rgba(255,255,255,0.6)";
  }

  return (
    <Box sx={STYLES.container}>
      <img
        src={resolveCurrentImage()}
        alt={altText || "Producto"}
        style={STYLES.image}
      />

      {hasMultipleImages && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{ ...STYLES.arrowButton, ...STYLES.arrowLeft }}
            size="small"
          >
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{ ...STYLES.arrowButton, ...STYLES.arrowRight }}
            size="small"
          >
            <ChevronRightIcon />
          </IconButton>

          <Box sx={STYLES.dotsContainer}>
            {images.map((_, index) => (
              <Box
                key={index}
                onClick={() => handleDotClick(index)}
                sx={{
                  ...STYLES.dotBase,
                  backgroundColor: resolveDotColor(index),
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
