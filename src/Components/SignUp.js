import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

import ErrorModal from "./ErrorModal";
import useErrorModal from "../hooks/useErrorModal";
import AvatarSelector from "./AvatarSelector";
import {
  ERROR_CODES,
  validateSignUpFields,
  resolveErrorFromException,
} from "../constants/errorCodes";
import { getAvatarById, DEFAULT_AVATAR_ID } from "../constants/avatarGallery";

const theme = createTheme();

const CREATE_USER_MUTATION = gql`
  mutation Mutation(
    $nombre: String!
    $apellido: String!
    $correo: String!
    $contrasena: String!
    $avatar: String
  ) {
    createUser(
      nombre: $nombre
      apellido: $apellido
      correo: $correo
      contrasena: $contrasena
      avatar: $avatar
    ) {
      _id
      nombre
      apellido
      correo
      contrasena
      direccion
      avatar
      Rol {
        nombre
      }
    }
  }
`;

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        cila
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignUp() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState(DEFAULT_AVATAR_ID);
  const [isAvatarSelectorOpen, setAvatarSelectorOpen] = useState(false);

  const navigate = useNavigate();
  const { modalState, showError, closeError } = useErrorModal();

  const [executeCreateUser] = useMutation(CREATE_USER_MUTATION);

  const selectedAvatar = getAvatarById(selectedAvatarId);

  function handleAvatarSelect(avatar) {
    setSelectedAvatarId(avatar.id);
  }

  function resetForm() {
    setNombre("");
    setApellido("");
    setCorreo("");
    setContrasena("");
  }

  function handleSuccessfulRegistration(userData) {
    localStorage.setItem("isLogged", true);
    localStorage.setItem("Rol", JSON.stringify(userData.Rol));
    localStorage.setItem("nombre", userData.nombre + userData.apellido);
    localStorage.setItem("id", userData._id);
    localStorage.setItem("avatar", userData.avatar || selectedAvatarId);
    resetForm();
    navigate("/");
  }

  function processGraphQLResponse(data) {
    const createdUser = data?.createUser;

    if (!createdUser) {
      showError(ERROR_CODES.SIGNUP_NULL_RESPONSE);
      return;
    }

    handleSuccessfulRegistration(createdUser);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateSignUpFields(nombre, apellido, correo, contrasena);
    if (validationError) {
      showError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, errors } = await executeCreateUser({
        variables: { nombre, apellido, correo, contrasena, avatar: selectedAvatarId },
      });

      if (errors && errors.length > 0) {
        const resolvedError = resolveErrorFromException({ graphQLErrors: errors });
        showError(resolvedError);
        return;
      }

      processGraphQLResponse(data);
    } catch (exception) {
      const resolvedError = resolveErrorFromException(exception);
      showError(resolvedError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            onClick={() => setAvatarSelectorOpen(true)}
            sx={{
              cursor: "pointer",
              position: "relative",
              m: 1,
              "&:hover": { opacity: 0.8 },
            }}
          >
            <img
              src={selectedAvatar.url}
              alt="avatar seleccionado"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: "3px solid #f20a95",
                objectFit: "cover",
                backgroundColor: "#f5f5f5",
              }}
            />
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "0.75rem",
                color: "#f20a95",
                mt: 0.5,
              }}
            >
              Elige tu avatar
            </Typography>
          </Box>
          <Typography component="h1" variant="h3" className="registro">
            Registro
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Nombre"
                  value={nombre}
                  onChange={(evt) => setNombre(evt.target.value)}
                  autoFocus
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Apellido"
                  name="lastName"
                  autoComplete="family-name"
                  value={apellido}
                  onChange={(evt) => setApellido(evt.target.value)}
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Direccion de correo"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={correo}
                  onChange={(evt) => setCorreo(evt.target.value)}
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contrasena"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={contrasena}
                  onChange={(evt) => setContrasena(evt.target.value)}
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="allowExtraEmails"
                      style={{ color: "#f20a95" }}
                    />
                  }
                  label="Quiero recibir promociones y actualizaciones via correo electronico."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2 }}
              style={{
                color: "black",
                backgroundColor: isSubmitting ? "#b2dfdb" : "aqua",
                fontSize: "15px",
                fontWeight: "bold",
                boxShadow: "10px 5px 5px #09b588",
              }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Registrate"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/signin" variant="body2" color="inherit">
                  ¿Ya tienes una cuenta? ingresa
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />

        <AvatarSelector
          open={isAvatarSelectorOpen}
          onClose={() => setAvatarSelectorOpen(false)}
          currentAvatarId={selectedAvatarId}
          onSelect={handleAvatarSelect}
        />

        <ErrorModal
          {...modalState}
          onClose={closeError}
          secondaryAction={{
            label: "Reintentar",
            onClick: () => {
              closeError();
              handleSubmit(new Event("submit"));
            },
          }}
        />
      </Container>
    </ThemeProvider>
  );
}
