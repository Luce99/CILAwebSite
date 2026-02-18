import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const GET_ROLES = gql`
  query getRoles {
    getRoles {
      _id
      nombre
    }
  }
`;

const CREATE_STAFF_USER = gql`
  mutation CreateStaffUser(
    $nombre: String!
    $apellido: String!
    $correo: String!
    $contrasena: String!
    $Rol: ID!
  ) {
    createStaffUser(
      nombre: $nombre
      apellido: $apellido
      correo: $correo
      contrasena: $contrasena
      Rol: $Rol
    ) {
      _id
      nombre
      correo
      Rol {
        nombre
      }
    }
  }
`;

const STAFF_ROLE_NAMES = ["administrador", "colaborador"];

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
  maxHeight: "90vh",
  overflowY: "auto",
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

/** Modal para crear un usuario staff (administrador o colaborador). */
export default function CreateUserModal({ open, handleClose, refetchQuery, refetchVariables }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: rolesData, loading: rolesLoading } = useQuery(GET_ROLES);
  const [createStaffUser, { loading: creating }] = useMutation(CREATE_STAFF_USER, {
    refetchQueries: [{ query: refetchQuery, variables: refetchVariables }],
  });

  function resetForm() {
    setNombre("");
    setApellido("");
    setCorreo("");
    setContrasena("");
    setSelectedRoleId("");
    setErrorMessage("");
  }

  function handleCloseModal() {
    resetForm();
    handleClose();
  }

  function getStaffRoles() {
    if (rolesLoading || !rolesData) {
      return [];
    }
    return rolesData.getRoles.filter((rol) => STAFF_ROLE_NAMES.includes(rol.nombre));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    const hasEmptyFields = !nombre || !apellido || !correo || !contrasena || !selectedRoleId;
    if (hasEmptyFields) {
      setErrorMessage("Todos los campos son obligatorios");
      return;
    }

    createStaffUser({
      variables: {
        nombre,
        apellido,
        correo,
        contrasena,
        Rol: selectedRoleId,
      },
    })
      .then(() => {
        handleCloseModal();
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  }

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box component="form" sx={MODAL_STYLE} onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#2C2C2E", textAlign: "center" }}>
          Crear usuario
        </Typography>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <TextField required fullWidth label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <TextField required fullWidth label="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
        <TextField required fullWidth label="Correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <TextField required fullWidth label="Contraseña temporal" type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />

        {rolesLoading ? (
          <Box sx={{ textAlign: "center" }}><CircularProgress size={24} sx={{ color: "#7C6A56" }} /></Box>
        ) : (
          <TextField select fullWidth label="Rol" value={selectedRoleId} onChange={(e) => setSelectedRoleId(e.target.value)}>
            {getStaffRoles().map((rol) => (
              <MenuItem key={rol._id} value={rol._id}>
                {rol.nombre}
              </MenuItem>
            ))}
          </TextField>
        )}

        <Box sx={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <Button variant="outlined" sx={BUTTON_CANCEL} onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="contained" sx={BUTTON_SAVE} type="submit" disabled={creating}>
            {creating ? "Creando..." : "Crear"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
