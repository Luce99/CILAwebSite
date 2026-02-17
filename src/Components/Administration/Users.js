import React, { useState } from "react";
import {
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { Button } from "@material-ui/core";
import { Container } from "@mui/material";
import useModal from "../../Components/hooks/useModal";
import EditModalUsers from "./Modals/EditModalUsers";
import NavAdministrador from "./NavAdministrador";
// Cambios
import { gql, useMutation, useQuery } from "@apollo/client";

export default function Users() {
    
  const [
    isOpenEditModalUsers,
    OpenEditModalUsers,
    closeEditModalUsers
  ] = useModal();

  const [id, setId] = useState();
  const [role, setRole] = useState("");

  const GetUsuario = gql`
    query getusers {
      getUsers {
        _id
        nombre
        apellido
        correo
        direccion
        Rol {
          nombre
        }
      }
    }
  `;
 //Eliminar

 const deleteUser = gql`
 mutation Mutation($id: ID!) {
  deleteUser(_id: $id) {
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
}`;

const [deleteUsers] = useMutation(deleteUser, {
  refetchQueries: [{query: GetUsuario}],
});

const DeleteUser = async (id) =>{
  var respuesta = window.confirm("¿Estas seguro que deseas eliminarlo?");

  if (respuesta ) {
    return true && (await deleteUsers({ variables: { id } }));
  } else {
    return false;
  }
};

  //Editar
  function toggle(users) {
    setId(users._id);
    setRole(users.Rol);
    OpenEditModalUsers();
  }
//Listar
  const { data, loading } = useQuery(GetUsuario);

  // if (error) return <span style={{color: 'red'}}>{error}</span>

  return (
    <>
    <NavAdministrador/>
    <Container>
      <h1>Gestión de Usuarios</h1>
      <div style={{ height: "800px", width: "80vw", marginTop: "2rem" }} className="principal-box">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Rol</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Direccion</th>
                <th>Editar</th>
              </tr>
            </thead>
            <TableBody>
              {loading ? (
                <TableRow></TableRow>
              ) : (
                <>
                  {data &&
                    data.getUsers.map((users) => (
                      <TableRow key={users._id}>
                        <TableCell>{users._id}</TableCell>
                        <TableCell>{users.Rol.nombre}</TableCell>
                        <TableCell>{users.nombre}</TableCell>
                        <TableCell>{users.apellido}</TableCell>
                        <TableCell>{users.correo}</TableCell>
                        <TableCell>{users.direccion}</TableCell>
                        <TableCell><Button
          startIcon={<EditIcon/>}
          variant="contained"
          color="primary"
          style={{ fontSize: 12}}
          onClick={() => toggle(users)}
        >
          Editar usuario
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
          {DeleteUser(users._id)} }}>
          Borrar
          </Button>
        </TableCell>
                      </TableRow>
                    ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
    </Container>
        <EditModalUsers 
        open= {isOpenEditModalUsers}
        handleClose= {closeEditModalUsers}
        id= {id}
        rolD={role}/>
    </>
  );
};
