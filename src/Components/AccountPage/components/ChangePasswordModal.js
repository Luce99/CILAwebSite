import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($id: ID!, $contrasena: String) {
    updateUser(_id: $id, contrasena: $contrasena) {
      _id
    }
  }
`;

const MODAL_STYLE = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 450,
  width: "90%",
  bgcolor: "#FAF6F1",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const BUTTON_STYLE = {
  backgroundColor: "#7C6A56",
  color: "#FFFFFF",
  fontWeight: 600,
  textTransform: "none",
  "&:hover": { backgroundColor: "#5C4A38" },
};

const CANCEL_STYLE = {
  color: "#7C6A56",
  borderColor: "#7C6A56",
  fontWeight: 600,
  textTransform: "none",
  "&:hover": { borderColor: "#5C4A38", color: "#5C4A38" },
};

const MIN_PASSWORD_LENGTH = 6;

/** Modal para cambiar la contrasena del usuario. Envia texto plano al backend. */
export default function ChangePasswordModal({ open, handleClose, id }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [changePassword] = useMutation(UPDATE_PASSWORD);

  function resetForm() {
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage("");
  }

  function handleCloseModal() {
    resetForm();
    handleClose();
  }

  function validatePasswords() {
    const isTooShort = newPassword.length < MIN_PASSWORD_LENGTH;
    if (isTooShort) {
      return "La contraseña debe tener al menos " + MIN_PASSWORD_LENGTH + " caracteres";
    }

    const passwordsMatch = newPassword === confirmPassword;
    if (passwordsMatch === false) {
      return "Las contraseñas no coinciden";
    }

    return "";
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationError = validatePasswords();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    changePassword({
      variables: { id: id, contrasena: newPassword },
    })
      .then(() => {
        handleCloseModal();
        window.location.reload();
      })
      .catch((err) => {
        setErrorMessage("Error al cambiar la contraseña: " + err.message);
      });
  }

  return (
    <Modal open={open} onClose={handleCloseModal} aria-labelledby="Cambiar contraseña">
      <Box component="form" onSubmit={handleSubmit} sx={MODAL_STYLE}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#2C2C2E", textAlign: "center" }}>
          Cambiar contraseña
        </Typography>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <TextField
          required
          fullWidth
          type="password"
          label="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <TextField
          required
          fullWidth
          type="password"
          label="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Box sx={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <Button variant="outlined" sx={CANCEL_STYLE} onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="contained" sx={BUTTON_STYLE} type="submit">
            Actualizar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
