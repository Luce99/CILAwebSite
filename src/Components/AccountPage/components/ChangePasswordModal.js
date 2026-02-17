import { gql,useMutation } from '@apollo/client';
import React, { useState } from 'react'
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
const bcrypt = require("bcryptjs");
const rondasDeSal = 10;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  };

export default function ChangePasswordModal({open, handleClose, id, contrasenaD}){

    const [contrasena, setContrasena]= useState("")


    useEffect(() =>{
        setContrasena(contrasenaD);
    }, [contrasenaD])

    const handleSubmit = (e) => {
        e.preventDefault();
        const hashedPassword = bcrypt.hash(contrasena, rondasDeSal);
        changePassword({
          variables: {
            id: id,
            contrasena: hashedPassword,
          },
        });
        handleClose();
        window.location.reload()
      };

      const updateUser = gql`
     mutation Mutation($id: ID!, $contrasena: String) {
  updateUser(_id: $id, contrasena: $contrasena) {
    _id
    contrasena
  }
}`

    const [changePassword] = useMutation(updateUser);

    return (
        <Modal open={open} onClose={handleClose}  aria-labelledby="Cambiar contraseña">
            <Box component="form" onSubmit={handleSubmit} sx={style}>
            <TextField
                  required
                  fullWidth
                  id="password"
                  label="Nueva contraseña"
                  name="password"
                  autoComplete="password"
                value={contrasena}
                onChange={(evt) => setContrasena(evt.target.value)}
                />
                <div claassName="botonModal">
                <Button variant="contained" style={{backgroundColor:"#f20a95", marginRight: "6rem", marginTop: "1rem"}} onClick={handleClose}>Cancelar</Button>
                <Button variant="contained" style={{backgroundColor:"#f20a95", marginTop: "1rem"}} onClick= {handleSubmit}>Actualizar</Button>
                </div>
            </Box>
        </Modal>
    )
}