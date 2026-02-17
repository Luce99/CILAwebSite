import React, { useState } from "react";
import DeleteModal from "./components/DeleteModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import useModal from "../hooks/useModal";
import EditModal from "./components/EditModal";
import { gql, useQuery, useMutation } from "@apollo/client";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import { useNavigate } from "react-router-dom";
import ErrorModal from "../ErrorModal";
import useErrorModal from "../../hooks/useErrorModal";
import { ERROR_CODES, resolveErrorFromException } from "../../constants/errorCodes";
import AvatarSelector from "../AvatarSelector";
import { getAvatarById, DEFAULT_AVATAR_ID } from "../../constants/avatarGallery";

const GET_USER_BY_ID = gql`
  query GetUserById($id: String!) {
    getUserById(_id: $id) {
      _id
      apellido
      nombre
      correo
      contrasena
      direccion
      genero
      avatar
      Rol {
        nombre
      }
    }
  }
`;

const UPDATE_USER_AVATAR = gql`
  mutation UpdateUser($id: ID!, $avatar: String) {
    updateUser(_id: $id, avatar: $avatar) {
      _id
      avatar
    }
  }
`;

const STYLES = {
  avatarContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem",
    marginBottom: "0.5rem",
  },
  avatarWrapper: {
    position: "relative",
    width: "200px",
    height: "200px",
  },
  avatar: {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #f20a95",
    backgroundColor: "#f5f5f5",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#f20a95",
    color: "white",
    width: 36,
    height: 36,
    "&:hover": { backgroundColor: "#d1087e" },
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
    marginTop: "1rem",
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
  avatarLabel: {
    textAlign: "center",
    color: "#f20a95",
    fontWeight: 500,
    fontSize: "0.85rem",
    marginBottom: "0.5rem",
    cursor: "pointer",
  },
};

const NO_DATA_MESSAGE = "No se encontraron datos de tu cuenta.";
const ROLE_FALLBACK = "Sin rol asignado";

function extractRoleName(user) {
  const hasRoleData = user && user.Rol;
  if (hasRoleData) {
    return user.Rol.nombre || ROLE_FALLBACK;
  }
  return ROLE_FALLBACK;
}

export default function AccountPage() {
  const [isOpenDeleteModal, openDeleteModal, closeDeleteModal] = useModal();
  const [isOpenChangePasswordModal, openChangePasswordModal, closeChangePasswordModal] = useModal();
  const [isOpenEditModal, openEditModal, closeEditModal] = useModal();
  const [isAvatarSelectorOpen, setAvatarSelectorOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const { modalState, showError, closeError } = useErrorModal();
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const isLogged = localStorage.getItem("isLogged");
  const hasSessionId = Boolean(id);
  const hasLoginFlag = Boolean(isLogged);

  const { data, error, loading, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { id },
    skip: hasSessionId === false,
    onError: (queryError) => {
      const resolved = resolveErrorFromException(queryError);
      showError(resolved);
    },
  });

  const [updateAvatar] = useMutation(UPDATE_USER_AVATAR);

  function getUserAvatarUrl() {
    const avatarId = data?.getUserById?.avatar || DEFAULT_AVATAR_ID;
    const avatarEntry = getAvatarById(avatarId);
    return avatarEntry ? avatarEntry.url : getAvatarById(DEFAULT_AVATAR_ID).url;
  }

  function getUserAvatarId() {
    return data?.getUserById?.avatar || DEFAULT_AVATAR_ID;
  }

  function handleOpenAvatarSelector() {
    setAvatarSelectorOpen(true);
  }

  function handleCloseAvatarSelector() {
    setAvatarSelectorOpen(false);
  }

  async function handleAvatarSelect(avatar) {
    try {
      await updateAvatar({
        variables: { id, avatar: avatar.id },
      });
      localStorage.setItem("avatar", avatar.id);
      refetch();
    } catch (exception) {
      const resolved = resolveErrorFromException(exception);
      showError(resolved);
    }
  }

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

  function handleForceRelogin() {
    localStorage.removeItem("isLogged");
    localStorage.removeItem("Rol");
    localStorage.removeItem("nombre");
    localStorage.removeItem("id");
    localStorage.removeItem("genero");
    localStorage.removeItem("avatar");
    navigate("/signin");
  }

  function renderNoSession() {
    const isCorruptedSession = hasLoginFlag && hasSessionId === false;

    if (isCorruptedSession) {
      return (
        <Box sx={STYLES.errorContainer}>
          <Typography variant="h6" color="text.secondary">
            Sesion incompleta
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", maxWidth: 400 }}>
            Tu sesion no tiene toda la informacion necesaria. Esto puede pasar si hubo un error durante el registro. Por favor, inicia sesion de nuevo.
          </Typography>
          <Button
            variant="contained"
            onClick={handleForceRelogin}
            sx={{
              mt: 2,
              backgroundColor: "#f20a95",
              "&:hover": { backgroundColor: "#d1087e" },
            }}
          >
            Ir a iniciar sesion
          </Button>
        </Box>
      );
    }

    return (
      <Box sx={STYLES.errorContainer}>
        <Typography variant="h6" color="text.secondary">
          No hay sesion activa
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Por favor, inicia sesion para ver tu cuenta.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/signin")}
          sx={{ mt: 2, color: "#f20a95", borderColor: "#f20a95" }}
        >
          Iniciar sesion
        </Button>
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

  function renderAvatar() {
    const avatarUrl = getUserAvatarUrl();

    return (
      <Box sx={STYLES.avatarContainer}>
        <Box sx={STYLES.avatarWrapper}>
          <img src={avatarUrl} alt="avatar de perfil" style={STYLES.avatar} />
          <IconButton
            onClick={handleOpenAvatarSelector}
            sx={STYLES.editAvatarButton}
            aria-label="cambiar avatar"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    );
  }

  function renderUserCard(user) {
    return (
      <>
        {renderAvatar()}
        <Typography
          sx={STYLES.avatarLabel}
          onClick={handleOpenAvatarSelector}
        >
          Cambiar avatar
        </Typography>
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
      </>
    );
  }

  function renderContent() {
    const hasActiveSession = hasSessionId && hasLoginFlag;
    if (hasActiveSession === false) {
      return renderNoSession();
    }

    if (loading) {
      return renderLoading();
    }

    const hasErrorWithoutData = error && data === null;
    if (hasErrorWithoutData) {
      return renderNoData();
    }

    const user = data?.getUserById;
    const hasUserData = Boolean(user);

    if (hasUserData === false) {
      return renderNoData();
    }

    return renderUserCard(user);
  }

  return (
    <>
      {renderContent()}

      <AvatarSelector
        open={isAvatarSelectorOpen}
        onClose={handleCloseAvatarSelector}
        currentAvatarId={getUserAvatarId()}
        onSelect={handleAvatarSelect}
      />

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
