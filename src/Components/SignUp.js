import * as React from "react";
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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

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

const theme = createTheme();

export default function SignUp() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [Rol, setRol] = useState("");
  const history = useNavigate();

  //crear usuario
  const createUser = gql`
    mutation Mutation(
      $nombre: String!
      $apellido: String!
      $correo: String!
      $contrasena: String!
    ) {
      createUser(
        nombre: $nombre
        apellido: $apellido
        correo: $correo
        contrasena: $contrasena
      ) {
        _id
        nombre
        apellido
        correo
        contrasena
        direccion
        Rol {
          nombre
        }
      }
    }
  `;

  const [CreateUser] = useMutation(createUser);
  const handleSubmit = async(e) => {
    e.preventDefault();

   var {data, error} = await CreateUser({
      variables: { nombre, apellido,correo, contrasena, Rol},
    });
    if (data){
      console.log(data)
      localStorage.setItem("isLogged", true);
      localStorage.setItem("Rol", JSON.stringify(data.createUser.Rol));
      localStorage.setItem("nombre", data.createUser.nombre + data.createUser.apellido);
      localStorage.setItem("id", data.createUser._id);
         history('/')
        //  window.location.reload()
    }
    else {
      console.log("Error al registrar")
    }
    setNombre("");
    setApellido("");
    setCorreo("");
    setContrasena("");
    setRol("");
  };

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
          <Avatar sx={{ m: 1, bgcolor: "#f20a95" }}>
            <LockOutlinedIcon />
          </Avatar>
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Dirección de correo"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={correo}
                onChange={(evt) => setCorreo(evt.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={contrasena}
                  onChange={(evt) => setContrasena(evt.target.value)}
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
                  label="Quiero recibir promociones y actualizaciones vía correo electrónico."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{
                color: "black",
                backgroundColor: "aqua",
                fontSize: "15px",
                fontWeight: "bold",
                boxShadow: "10px 5px 5px #09b588",
              }}
            >
              Registrate
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2" color="inherit">
                  ¿Ya tienes una cuenta? ingresa
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
