import React, { useState } from "react";
import DeleteModal from "./components/DeleteModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import useModal from "../hooks/useModal";
import EditModal from "./components/EditModal";
import { gql, useMutation, useQuery } from "@apollo/client";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

export default function AccountPage() {
  const [isOpenDeleteModal, openDeleteModal, closeDeleteModal] = useModal();
  const [
    isOpenChangePasswordModal,
    openChangePasswordModal,
    closeChangePasswordModal,
  ] = useModal();
  const [isOpenEditModal, openEditModal, closeEditModal] = useModal();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const id = localStorage.getItem("id");

  const getUserById = gql`
    query GetUserById($id: String!) {
      getUserById(_id: $id) {
        _id
        apellido
        nombre
        correo
        contrasena
        direccion
        Rol {
          nombre
        }
      }
    }
  `;

  //Editar
  function toggle(users) {
    setNombre(users.nombre);
    setApellido(users.apellido);
    setCorreo(users.correo);
    openEditModal();
  }
  //Listar
  const { data, error, loading } = useQuery(getUserById, { variables: { id } });

  return (
    <>
      <img
        src="https://www.sanboni.edu.co/onu/wp-content/uploads/avatar-mujer.png"
        alt="profile"
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          display: "flex",
          marginLeft: "auto",
          marginRight: "auto",
          objectFit: "cover",
        }}
      ></img>
      {data ? (
        <Card
          sx={{
            maxWidth: 370,
            backgroundColor: "#78afa9",
            color: "#dedede",
            padding: "2rem",
            display: "flex",
            marginLeft: "auto",
            marginRight: "auto",
            flexDirection: "column",
            marginBottom: "3rem",
            marginTop: "2rem",
          }}
        >
          <CardContent>
            <p className="text-center">
              <b>Nombre: </b>
              {data.getUserById.nombre}
            </p>
            <p className="text-center">
              <b>Apellido: </b>
              {data.getUserById.apellido}
            </p>
            <p className="text-center">
              <b>Correo: </b>
              {data.getUserById.correo}
            </p>
            <p className="text-center">
              <b>Rol: </b>
              {data.getUserById.Rol.nombre}
            </p>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              style={{
                color: "#474444",
                backgroundColor: "#dedede",
                fontSize: "15px",
                fontWeight: "bold",
                boxShadow: "2.5px 2.5px #474444",
                width: 200,
                // textShadow: "0.2em 0.2em ",
              }}
              onClick={() => toggle(data.getUserById)}
            >
              Editar cuenta
            </Button>
            <Button
              variant="contained"
              style={{
                color: "#474444",
                backgroundColor: "#dedede",
                fontSize: "15px",
                fontWeight: "bold",
                boxShadow: " 2.5px 2.5px #474444",
                width: 370,
                // textShadow: "0.2em 0.2em white",
              }}
              onClick={openChangePasswordModal}
            >
              Cambiar contraseña
            </Button>
            <Button
              variant="contained"
              style={{
                color: "#474444",
                backgroundColor: "#dedede",
                fontSize: "15px",
                fontWeight: "bold",
                boxShadow: " 2.5px 2.5px #474444",
                width: 230,
              }}
              className="mt-3 text-danger"
              onClick={openDeleteModal}
            >
              Eliminar cuenta
            </Button>
          </CardActions>
        </Card>
      ) : (
        //  <span>error</span>
        console.log(error)
      )}
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
    </>
  );
}
