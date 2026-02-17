import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {useNavigate, Link as RouterLink} from "react-router-dom";
import { gql, isApolloError, useMutation, useQuery } from "@apollo/client";

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
  const [correo, setCorreo] = useState();
  const [contrasena, setContrasena] = useState();
  const [errors, setError] = useState();
  const history = useNavigate();


  const login = gql`
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

  const [dispatchLogin, {error}] = useMutation(login);
  let errorMessage;
    if (error){
      if (
        error.networkError && 
        typeof window !== 'undefined' &&
        !window.navigator.onLine
      ){
        errorMessage = "Parece que no tienes conexión a internet"; 
      } else {
          if (!errorMessage){
            errorMessage = "Ocurrió un error, revisa los datos e intenta nuevamente."
          }
          }
        }
  const handleSubmit = async (e) => {
    try {e.preventDefault();

    let { data, error, loading } = await dispatchLogin({
      variables: { correo, contrasena },
    });
    if (data){
      console.log(data)
      localStorage.setItem("isLogged", true);
      localStorage.setItem("Rol", JSON.stringify(data.login.Rol));
      localStorage.setItem("nombre", data.login.nombre + data.login.apellido);
      localStorage.setItem("id", data.login._id);
      setCorreo("");
      setContrasena("");   
      history('/')  
    }   

  }catch(e) {
    console.log({e})
    if (isApolloError(e)){
      for (const gqlError of e.graphQLErrors){
        if (gqlError.extensions?.code=== "BAD_USER_INPUT"){
          if (Array.isArray(gqlError.extensions?.errors)){
              for (const fieldError of gqlError.extensions.errors){
                setError( fieldError.message)
              }
          }
        }
      }
    }
  };
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
          {errorMessage && <p style={{color: "#ff0000"}}>{errorMessage}</p>}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
             {errors && <p>{errors}</p>}
            <TextField
              value={correo}
              onChange={(evt) => setCorreo(evt.target.value)}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Dirección de correo"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              value={contrasena}
              onChange={(evt) => setContrasena(evt.target.value)}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" style={{color:"#f20a95"}} />}
              label="Remember me"
            /> */}
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
              Ingresa
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" color="inherit">
                  ¿Olvidaste tu contraseña?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2" color="inherit" >
                  {"¿No tienes una cuenta? Registrate"}
                </Link>
              </Grid>
            </Grid>
          </Box> 
        </Box> 
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
  )}
