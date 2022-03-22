import React, { useState } from "react";
import { useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",


};

export default function EditModal({
  open,
  handleClose,
  id,
  nombreD,
  apellidoD,
  correoD,
  RolD,
}) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [Rol, setRol] = useState("");

  useEffect(() => {
    setNombre(nombreD);
    setApellido(apellidoD);
    setCorreo(correoD);
    setRol(RolD);
  }, [nombreD, apellidoD, correoD, RolD]);

  const handleSubmit = (e) => {
    e.preventDefault();
    changeUser({
      variables: {
        id: id,
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        Rol: Rol,
      },
    });
    handleClose();
    window.location.reload();
  };

  const updateUser = gql`
    mutation UpdateUser(
      $id: ID!
      $nombre: String
      $apellido: String
      $correo: String
      $direccion: String
    ) {
      updateUser(
        _id: $id
        nombre: $nombre
        apellido: $apellido
        correo: $correo
        direccion: $direccion
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
        carrito {
          name
        }
      }
    }
  `;

  const [changeUser] = useMutation(updateUser);

  return (
    <>
      <Modal open={open} onClose={handleClose} 
      aria-labelledby="Editar cuenta">
          <Box component="form" sx={style}>
          <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Nombre"
                  name="Name"
                  autoComplete="first-name"
                value={nombre}
                onChange={(evt) => setNombre(evt.target.value)}
                />
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
              <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo"
                  name="email"
                  autoComplete="email adress"
                value={correo}
                onChange={(evt) => setCorreo(evt.target.value)}
                />
                <div className="botonModal">
                <Button variant="contained" color="inherit" style={{backgroundColor:"#f20a95", marginRight: "1rem"}} onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="inherit"style={{backgroundColor:"#f20a95"}} onClick={handleSubmit}>
            Actualizar mi cuenta
          </Button>
          </div>
          </Box>
      </Modal>
    </>
  );
}
