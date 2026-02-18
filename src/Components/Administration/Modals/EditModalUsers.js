import React, { useState, useEffect } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const GET_ROLES = gql`
  query getRoles {
    getRoles {
      _id
      nombre
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUser($id: ID!, $rol: ID!) {
    updateUser(_id: $id, Rol: $rol) {
      _id
      Rol {
        nombre
      }
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
  gap: "20px",
};

const BUTTON_SAVE_STYLE = {
  backgroundColor: "#7C6A56",
  color: "#FFFFFF",
  fontWeight: 600,
  "&:hover": { backgroundColor: "#5C4A38" },
};

const BUTTON_CANCEL_STYLE = {
  color: "#7C6A56",
  borderColor: "#7C6A56",
  fontWeight: 600,
  "&:hover": { borderColor: "#5C4A38", color: "#5C4A38" },
};

/** Modal para editar el rol de un usuario. */
export default function EditModalUsers({ open, handleClose, id, rolD }) {
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const { data: rolesData, loading: rolesLoading } = useQuery(GET_ROLES);
  const [changeUser] = useMutation(UPDATE_USER);

  useEffect(() => {
    if (rolD && rolD._id) {
      setSelectedRoleId(rolD._id);
      return;
    }
    if (rolD && typeof rolD === "string") {
      setSelectedRoleId(rolD);
    }
  }, [rolD]);

  function handleRoleChange(event) {
    setSelectedRoleId(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    changeUser({ variables: { id: id, rol: selectedRoleId } });
    handleClose();
    window.location.reload();
  }

  function renderRoleOptions() {
    if (rolesLoading) {
      return (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <CircularProgress size={24} sx={{ color: "#7C6A56" }} />
        </Box>
      );
    }

    const roles = (rolesData && rolesData.getRoles) || [];
    return (
      <TextField
        select
        fullWidth
        label="Rol"
        value={selectedRoleId}
        onChange={handleRoleChange}
      >
        {roles.map((rol) => (
          <MenuItem key={rol._id} value={rol._id}>
            {rol.nombre}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box component="form" sx={MODAL_STYLE} onSubmit={handleSubmit}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#2C2C2E", textAlign: "center" }}
        >
          Editar rol de usuario
        </Typography>

        <TextField
          fullWidth
          label="ID del usuario"
          value={id || ""}
          InputProps={{ readOnly: true }}
        />

        {renderRoleOptions()}

        <Box sx={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <Button variant="outlined" sx={BUTTON_CANCEL_STYLE} onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" sx={BUTTON_SAVE_STYLE} type="submit">
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
