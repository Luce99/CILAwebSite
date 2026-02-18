import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import NavAdministrador from "./NavAdministrador";
import ProposeChangeModal from "./Modals/ProposeChangeModal";
import useModal from "../hooks/useModal";
import { gql, useQuery } from "@apollo/client";
import accounting from "accounting";

const GET_PRODUCTOS = gql`
  query getProductos {
    getProductos {
      _id
      name
      category
      price
      stock
      image
    }
  }
`;

const STYLES = {
  tableContainer: {
    mt: 2,
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    overflowX: "auto",
  },
  headerCell: {
    fontWeight: 700,
    color: "#2C2C2E",
    fontSize: "0.85rem",
    whiteSpace: "nowrap",
  },
  proposeButton: {
    backgroundColor: "#7C6A56",
    color: "#FFFFFF",
    fontSize: "0.75rem",
    textTransform: "none",
    "&:hover": { backgroundColor: "#5C4A38" },
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    py: 6,
  },
  productImage: {
    width: 48,
    height: 48,
    objectFit: "cover",
    borderRadius: "8px",
  },
};

/** Pagina de gestion de productos del panel de administracion. */
export default function ProductManagement() {
  const [isOpenProposeModal, openProposeModal, closeProposeModal] = useModal();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { data, loading } = useQuery(GET_PRODUCTOS);

  function handleProposeClick(product) {
    setSelectedProduct(product);
    openProposeModal();
  }

  function renderLoading() {
    return (
      <Box sx={STYLES.loading}>
        <CircularProgress sx={{ color: "#7C6A56" }} />
      </Box>
    );
  }

  function renderStockChip(stock) {
    const isLow = stock < 10;
    const color = isLow ? "error" : "success";
    return <Chip label={stock} color={color} size="small" variant="outlined" />;
  }

  function renderTable() {
    const productos = (data && data.getProductos) || [];

    return (
      <TableContainer component={Paper} sx={STYLES.tableContainer}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={STYLES.headerCell}>Imagen</TableCell>
              <TableCell sx={STYLES.headerCell}>Nombre</TableCell>
              <TableCell sx={STYLES.headerCell}>Categoría</TableCell>
              <TableCell sx={STYLES.headerCell}>Precio</TableCell>
              <TableCell sx={STYLES.headerCell}>Stock</TableCell>
              <TableCell sx={STYLES.headerCell}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((product) => (
              <TableRow key={product._id} hover>
                <TableCell>
                  <img src={product.image} alt={product.name} style={STYLES.productImage} />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                    {product.category}
                  </Typography>
                </TableCell>
                <TableCell>{accounting.formatMoney(product.price, "$", 0, ".", ",")}</TableCell>
                <TableCell>{renderStockChip(product.stock)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<EditIcon />}
                    sx={STYLES.proposeButton}
                    onClick={() => handleProposeClick(product)}
                  >
                    Proponer cambio
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <>
      <NavAdministrador />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#2C2C2E", textAlign: "center", mb: 2 }}>
          Gestión de Productos
        </Typography>

        {loading ? renderLoading() : renderTable()}
      </Container>

      {selectedProduct && (
        <ProposeChangeModal
          open={isOpenProposeModal}
          handleClose={closeProposeModal}
          product={selectedProduct}
        />
      )}
    </>
  );
}
