import React from 'react'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import {gql, useMutation} from "@apollo/client"
import {useNavigate} from "react-router-dom";
import { Box } from "@mui/material";
import Alert from '@mui/material/Alert';


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
export default function DeleteModal({ open,handleClose}){
    
  
    const id = localStorage.getItem("id")
    const history = useNavigate();

    function logout(){
        localStorage.removeItem("isLogged")
        localStorage.removeItem("nombre")
        localStorage.removeItem("Rol")
        localStorage.removeItem("id")
        history('/')
       }

    const deleteUser = gql `
  mutation DeleteUser($id: ID!) {
  deleteUser(_id: $id) {
    nombre
    apellido
    correo
  }
}`
    const [deleteUsers] = useMutation(deleteUser)

    const DeleteUser = async (id) => {
        var respuesta = window.confirm("¿Estas seguro que deseas eliminarlo?");
        
    if (respuesta == true) {
      return true && (await deleteUsers({ variables: { id } }));
    } else {
      return false;
    }
  };

    const handleDelete = async() => {
        var result = await DeleteUser(id)
        if (result){
        logout()
    }}

    return (
          <Modal open={open} onClose={handleClose}
      aria-labelledby="Eliminar cuenta">
           <Box sx={style}>
                <Alert variant="danger">
                    ¿Estas seguro que deseas eliminar permanentemente tu cuenta?
                    <b>perderás toda tu información</b>
                </Alert>
                <div className='botonModal'>
                <Button variant="contained" style={{backgroundColor:"#f20a95", marginRight: "1rem"}} onClick={handleClose}>Cancelar</Button>
                <Button variant="contained" style={{backgroundColor:"#f20a95"}} onClick= {handleDelete}>Eliminar mi cuenta</Button>
                </div>
                </Box>
        </Modal>
    )
}