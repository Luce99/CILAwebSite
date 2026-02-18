import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

const CREATE_PENDING_CHANGE = gql`
  mutation CreatePendingChange(
    $changeType: String!
    $producto: ID!
    $proposedBy: ID!
    $oldValue: Float!
    $newValue: Float!
    $description: String
  ) {
    createPendingChange(
      changeType: $changeType
      producto: $producto
      proposedBy: $proposedBy
      oldValue: $oldValue
      newValue: $newValue
      description: $description
    ) {
      _id
      status
    }
  }
`;

const CHANGE_TYPES = [
  { value: "price", label: "Precio" },
  { value: "stock", label: "Stock" },
  { value: "promotion", label: "Promoción" },
];

const MODAL_STYLE = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 500,
  width: "90%",
  bgcolor: "#FAF6F1",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const BUTTON_SAVE = {
  backgroundColor: "#7C6A56",
  color: "#FFFFFF",
  fontWeight: 600,
  textTransform: "none",
  "&:hover": { backgroundColor: "#5C4A38" },
};

const BUTTON_CANCEL = {
  color: "#7C6A56",
  borderColor: "#7C6A56",
  fontWeight: 600,
  textTransform: "none",
  "&:hover": { borderColor: "#5C4A38", color: "#5C4A38" },
};

/** Modal para proponer un cambio de precio, stock o promocion sobre un producto. */
export default function ProposeChangeModal({ open, handleClose, product }) {
  const [changeType, setChangeType] = useState("price");
  const [newValue, setNewValue] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const userId = localStorage.getItem("id");
  const [createPendingChange, { loading }] = useMutation(CREATE_PENDING_CHANGE);

  function resetForm() {
    setChangeType("price");
    setNewValue("");
    setDescription("");
    setErrorMessage("");
    setSuccessMessage("");
  }

  function handleCloseModal() {
    resetForm();
    handleClose();
  }

  function resolveOldValue() {
    if (changeType === "price") {
      return product.price;
    }
    if (changeType === "stock") {
      return product.stock;
    }
    return 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const parsedValue = parseFloat(newValue);
    const isInvalidNumber = isNaN(parsedValue);
    if (isInvalidNumber) {
      setErrorMessage("Ingresa un valor numérico válido");
      return;
    }

    createPendingChange({
      variables: {
        changeType,
        producto: product._id,
        proposedBy: userId,
        oldValue: resolveOldValue(),
        newValue: parsedValue,
        description,
      },
    })
      .then(() => {
        setSuccessMessage("Propuesta enviada para aprobación");
        setTimeout(handleCloseModal, 1500);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  }

  const productName = product ? product.name : "";

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box component="form" sx={MODAL_STYLE} onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#2C2C2E", textAlign: "center" }}>
          Proponer cambio
        </Typography>
        <Typography variant="body2" sx={{ color: "#6E6E73", textAlign: "center" }}>
          Producto: {productName}
        </Typography>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <TextField select fullWidth label="Tipo de cambio" value={changeType} onChange={(e) => setChangeType(e.target.value)}>
          {CHANGE_TYPES.map((ct) => (
            <MenuItem key={ct.value} value={ct.value}>{ct.label}</MenuItem>
          ))}
        </TextField>

        <TextField
          required
          fullWidth
          label="Nuevo valor"
          type="number"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          helperText={product ? "Valor actual: " + resolveOldValue() : ""}
        />

        <TextField
          fullWidth
          label="Descripción (opcional)"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Box sx={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <Button variant="outlined" sx={BUTTON_CANCEL} onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="contained" sx={BUTTON_SAVE} type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Proponer"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
