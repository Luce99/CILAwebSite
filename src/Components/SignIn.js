import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

import ErrorModal from "./ErrorModal";
import useErrorModal from "../hooks/useErrorModal";
import {
  ERROR_CODES,
  validateSignInFields,
  resolveErrorFromException,
} from "../constants/errorCodes";

const LOGIN_MUTATION = gql`
  mutation Mutation($correo: String!, $contrasena: String!) {
    login(correo: $correo, contrasena: $contrasena) {
      _id
      nombre
      apellido
      correo
      contrasena
      direccion
      Rol {
        nombre
      }
      carrito {
        _id
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

export default function SignIn() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { modalState, showError, closeError } = useErrorModal();

  const [executeLogin] = useMutation(LOGIN_MUTATION);

  function handleSuccessfulLogin(loginData) {
    localStorage.setItem("isLogged", true);
    localStorage.setItem("Rol", JSON.stringify(loginData.Rol));
    localStorage.setItem("nombre", loginData.nombre + loginData.apellido);
    localStorage.setItem("id", loginData._id);
    setCorreo("");
    setContrasena("");
    navigate("/");
  }

  function processLoginResponse(data) {
    const loggedUser = data?.login;

    if (!loggedUser) {
      showError(ERROR_CODES.LOGIN_NULL_RESPONSE);
      return;
    }

    handleSuccessfulLogin(loggedUser);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateSignInFields(correo, contrasena);
    if (validationError) {
      showError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, errors } = await executeLogin({
        variables: { correo, contrasena },
      });

      if (errors && errors.length > 0) {
        const resolvedError = resolveErrorFromException({ graphQLErrors: errors });
        showError(resolvedError);
        return;
      }

      processLoginResponse(data);
    } catch (exception) {
      const resolvedError = resolveErrorFromException(exception);
      showError(resolvedError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "#f20a95" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h3">
          Ingresa
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            value={correo}
            onChange={(evt) => setCorreo(evt.target.value)}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Direccion de correo"
            name="email"
            autoComplete="email"
            autoFocus
            disabled={isSubmitting}
          />
          <TextField
            value={contrasena}
            onChange={(evt) => setContrasena(evt.target.value)}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contrasena"
            type="password"
            id="password"
            autoComplete="current-password"
            disabled={isSubmitting}
          />
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
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Ingresa"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2" color="inherit">
                ¿Olvidaste tu contrasena?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/signup" variant="body2" color="inherit">
                {"¿No tienes una cuenta? Registrate"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />

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
  );
}
