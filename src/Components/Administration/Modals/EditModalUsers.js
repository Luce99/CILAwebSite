import { useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
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

 export default function EditModalUsers({
    open,
    handleClose,
    id,
    rolD
 }){
    const [role, setRole] = useState("");
 //Editar

 useEffect(()=>{
    setRole(rolD);
  }, [rolD])

  const handleSubmit = (e) => {
    e.preventDefault();
    changeUser({variables: { id:id,
      Rol: role}})
      handleClose();
      window.location.reload();
      
  };

  const updateUser = gql`
  mutation updateUser($id: ID!, $rol: ID!) {
    updateUser(_id: $id, Rol: $rol) {
      _id
      Rol{
        nombre
      }
    }
  }`

  const [changeUser] = useMutation(updateUser);

return (
    <>
     <Modal show={open} onHide={handleClose}>
            <Box component="form" sx={style}>
            <TextField
                  required
                  fullWidth
                  id="_id"
                  label="Id"
                  name="Id"
                  type="text"
                  value={id}
                  readOnly
                />
                <TextField
                  required
                  fullWidth
                  id="sel1"
                  label="Rol"
                  name="rol"
                  value={role}
                  onChange={(evt) => setRole(evt.target.value)}>
                <select>
                  <option value={"6233db911b318e2e210cc8f1"}>Administrador</option>
                  <option value={"6233db911b318e2e210cc8f0"}>Cliente</option>
                </select>
                </TextField>
              <Button
                variant="primary"
                onClick={handleSubmit}
              >
                Aceptar
              </Button>
              <Button
                variant="danger"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              </Box>
        </Modal>
    </>
)
}