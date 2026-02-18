import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useModal from "../hooks/useModal";
import EditModalUsers from "./Modals/EditModalUsers";
import NavAdministrador from "./NavAdministrador";
import { gql, useMutation, useQuery } from "@apollo/client";

const GET_USERS = gql`
  query getusers {
    getUsers {
      _id
      nombre
      apellido
      correo
      direccion
      Rol {
        _id
        nombre
      }
    }
  }
`;

const DELETE_USER = gql`
  mutation Mutation($id: ID!) {
    deleteUser(_id: $id) {
      _id
    }
  }
`;

const STYLES = {
  tableContainer: {
    mt: 2,
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    overflowX: "auto",
  },
  headerCell: {
    fontWeight: 700,
    color: "#2C2C2E",
    fontSize: "0.85rem",
    whiteSpace: "nowrap",
  },
  editButton: {
    backgroundColor: "#7C6A56",
    color: "#FFFFFF",
    fontSize: "0.75rem",
    textTransform: "none",
    mr: 1,
    "&:hover": { backgroundColor: "#5C4A38" },
  },
  deleteButton: {
    backgroundColor: "#C0392B",
    color: "#FFFFFF",
    fontSize: "0.75rem",
    textTransform: "none",
    "&:hover": { backgroundColor: "#96281B" },
  },
  idCell: {
    maxWidth: 120,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "0.8rem",
    color: "#6E6E73",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    py: 6,
  },
};

/** Pagina de gestion de usuarios del panel de administracion. */
export default function Users() {
  const [isOpenEditModal, openEditModal, closeEditModal] = useModal();
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const { data, loading } = useQuery(GET_USERS);
  const [deleteUserMutation] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  function handleEditClick(user) {
    setSelectedId(user._id);
    setSelectedRole(user.Rol);
    openEditModal();
  }

  function handleDeleteClick(userId) {
    const confirmed = window.confirm("¿Estás seguro que deseas eliminar este usuario?");
    if (confirmed) {
      deleteUserMutation({ variables: { id: userId } });
    }
  }

  function renderLoading() {
    return (
      <Box sx={STYLES.loading}>
        <CircularProgress sx={{ color: "#7C6A56" }} />
      </Box>
    );
  }

  function renderTable() {
    const users = (data && data.getUsers) || [];

    return (
      <TableContainer component={Paper} sx={STYLES.tableContainer}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={STYLES.headerCell}>Rol</TableCell>
              <TableCell sx={STYLES.headerCell}>Nombre</TableCell>
              <TableCell sx={STYLES.headerCell}>Apellido</TableCell>
              <TableCell sx={STYLES.headerCell}>Correo</TableCell>
              <TableCell sx={STYLES.headerCell}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                    {user.Rol ? user.Rol.nombre : "Sin rol"}
                  </Typography>
                </TableCell>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.apellido}</TableCell>
                <TableCell>{user.correo}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<EditIcon />}
                      sx={STYLES.editButton}
                      onClick={() => handleEditClick(user)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<DeleteIcon />}
                      sx={STYLES.deleteButton}
                      onClick={() => handleDeleteClick(user._id)}
                    >
                      Borrar
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <>
      <NavAdministrador />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#2C2C2E", textAlign: "center", mb: 2 }}>
          Gestión de Usuarios
        </Typography>

        {loading ? renderLoading() : renderTable()}
      </Container>

      <EditModalUsers
        open={isOpenEditModal}
        handleClose={closeEditModal}
        id={selectedId}
        rolD={selectedRole}
      />
    </>
  );
}
