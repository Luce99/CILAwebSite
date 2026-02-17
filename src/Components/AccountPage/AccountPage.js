import React, { useState } from "react";
import DeleteModal from "./components/DeleteModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import useModal from "../hooks/useModal";
import EditModal from "./components/EditModal";
import { gql, useQuery } from "@apollo/client";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import ErrorModal from "../ErrorModal";
import useErrorModal from "../../hooks/useErrorModal";
import { ERROR_CODES, resolveErrorFromException } from "../../constants/errorCodes";

const GET_USER_BY_ID = gql`
  query GetUserById($id: String!) {
    getUserById(_id: $id) {
      _id
      apellido
      nombre
      correo
      contrasena
      direccion
      Rol {
        nombre
      }
    }
  }
`;

const AVATAR_URL = "https://www.sanboni.edu.co/onu/wp-content/uploads/avatar-mujer.png";

const STYLES = {
  avatar: {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    objectFit: "cover",
  },
  card: {
    maxWidth: 370,
    backgroundColor: "#78afa9",
    color: "#dedede",
    padding: "2rem",
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "column",
    marginBottom: "3rem",
    marginTop: "2rem",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "3rem",
    marginBottom: "3rem",
    gap: "16px",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "2rem",
    marginBottom: "2rem",
    padding: "2rem",
    gap: "16px",
  },
  actionButton: {
    color: "#474444",
    backgroundColor: "#dedede",
    fontSize: "15px",
    fontWeight: "bold",
    boxShadow: "2.5px 2.5px #474444",
  },
};

const NO_DATA_MESSAGE = "No se encontraron datos de tu cuenta.";
const ROLE_FALLBACK = "Sin rol asignado";

function extractRoleName(user) {
  if (!user || !user.Rol) {
    return ROLE_FALLBACK;
  }
  return user.Rol.nombre || ROLE_FALLBACK;
}

export default function AccountPage() {
  const [isOpenDeleteModal, openDeleteModal, closeDeleteModal] = useModal();
  const [isOpenChangePasswordModal, openChangePasswordModal, closeChangePasswordModal] = useModal();
  const [isOpenEditModal, openEditModal, closeEditModal] = useModal();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const { modalState, showError, closeError } = useErrorModal();
  const id = localStorage.getItem("id");

  const { data, error, loading, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { id },
    skip: !id,
    onError: (queryError) => {
      const resolved = resolveErrorFromException(queryError);
      showError(resolved);
    },
  });

  function handleEditToggle(user) {
    setNombre(user.nombre);
    setApellido(user.apellido);
    setCorreo(user.correo);
    openEditModal();
  }

  function handleRetry() {
    closeError();
    refetch();
  }

  function renderLoading() {
    return (
      <Box sx={STYLES.loadingContainer}>
        <CircularProgress sx={{ color: "#f20a95" }} />
        <Typography variant="body1" color="text.secondary">
          Cargando tu informacion...
        </Typography>
      </Box>
    );
  }

  function renderNoSession() {
    return (
      <Box sx={STYLES.errorContainer}>
        <Typography variant="h6" color="text.secondary">
          No hay sesion activa
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Por favor, inicia sesion para ver tu cuenta.
        </Typography>
      </Box>
    );
  }

  function renderNoData() {
    return (
      <Box sx={STYLES.errorContainer}>
        <Typography variant="body1" color="text.secondary">
          {NO_DATA_MESSAGE}
        </Typography>
        <Button variant="outlined" onClick={handleRetry} sx={{ color: "#f20a95", borderColor: "#f20a95" }}>
          Reintentar
        </Button>
      </Box>
    );
  }

  function renderUserCard(user) {
    return (
      <Card sx={STYLES.card}>
        <CardContent>
          <p className="text-center">
            <b>Nombre: </b>
            {user.nombre}
          </p>
          <p className="text-center">
            <b>Apellido: </b>
            {user.apellido}
          </p>
          <p className="text-center">
            <b>Correo: </b>
            {user.correo}
          </p>
          <p className="text-center">
            <b>Rol: </b>
            {extractRoleName(user)}
          </p>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            style={{ ...STYLES.actionButton, width: 200 }}
            onClick={() => handleEditToggle(user)}
          >
            Editar cuenta
          </Button>
          <Button
            variant="contained"
            style={{ ...STYLES.actionButton, width: 370 }}
            onClick={openChangePasswordModal}
          >
            Cambiar contrasena
          </Button>
          <Button
            variant="contained"
            style={{ ...STYLES.actionButton, width: 230 }}
            className="mt-3 text-danger"
            onClick={openDeleteModal}
          >
            Eliminar cuenta
          </Button>
        </CardActions>
      </Card>
    );
  }

  function renderContent() {
    if (!id) {
      return renderNoSession();
    }

    if (loading) {
      return renderLoading();
    }

    if (error && !data) {
      return renderNoData();
    }

    const user = data?.getUserById;

    if (!user) {
      return renderNoData();
    }

    return renderUserCard(user);
  }

  return (
    <>
      <img src={AVATAR_URL} alt="profile" style={STYLES.avatar} />

      {renderContent()}

      <DeleteModal
        open={isOpenDeleteModal}
        handleClose={closeDeleteModal}
        id={id}
      />
      <ChangePasswordModal
        open={isOpenChangePasswordModal}
        handleClose={closeChangePasswordModal}
        id={id}
        contrasenaD={contrasena}
      />
      <EditModal
        open={isOpenEditModal}
        handleClose={closeEditModal}
        id={id}
        nombreD={nombre}
        apellidoD={apellido}
        correoD={correo}
      />

      <ErrorModal
        {...modalState}
        onClose={closeError}
        secondaryAction={{
          label: "Reintentar",
          onClick: handleRetry,
        }}
      />
    </>
  );
}
