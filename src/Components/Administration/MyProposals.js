import React from "react";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import NavAdministrador from "./NavAdministrador";
import { gql, useQuery } from "@apollo/client";

const GET_MY_PROPOSALS = gql`
  query getPendingChangesByUser($userId: String!) {
    getPendingChangesByUser(userId: $userId) {
      _id
      changeType
      producto {
        name
      }
      status
      oldValue
      newValue
      description
      reviewNote
      createdAt
    }
  }
`;

const CHANGE_TYPE_LABELS = {
  price: "Precio",
  stock: "Stock",
  promotion: "Promoción",
};

const STATUS_COLORS = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

const STATUS_LABELS = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
};

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
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    py: 6,
  },
};

/** Pagina que muestra las propuestas de cambio del colaborador actual. */
export default function MyProposals() {
  const userId = localStorage.getItem("id");
  const { data, loading } = useQuery(GET_MY_PROPOSALS, {
    variables: { userId: userId || "" },
    skip: !userId,
  });

  function formatDate(dateStr) {
    if (!dateStr) {
      return "-";
    }
    return new Date(dateStr).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function renderLoading() {
    return (
      <Box sx={STYLES.loading}>
        <CircularProgress sx={{ color: "#7C6A56" }} />
      </Box>
    );
  }

  function renderTable() {
    const proposals = (data && data.getPendingChangesByUser) || [];

    if (proposals.length === 0) {
      return (
        <Typography variant="body1" sx={{ textAlign: "center", color: "#6E6E73", mt: 4 }}>
          No has realizado propuestas de cambio aún.
        </Typography>
      );
    }

    return (
      <TableContainer component={Paper} sx={STYLES.tableContainer}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={STYLES.headerCell}>Producto</TableCell>
              <TableCell sx={STYLES.headerCell}>Tipo</TableCell>
              <TableCell sx={STYLES.headerCell}>Valor anterior</TableCell>
              <TableCell sx={STYLES.headerCell}>Valor propuesto</TableCell>
              <TableCell sx={STYLES.headerCell}>Estado</TableCell>
              <TableCell sx={STYLES.headerCell}>Nota revisión</TableCell>
              <TableCell sx={STYLES.headerCell}>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proposals.map((proposal) => (
              <TableRow key={proposal._id} hover>
                <TableCell>{proposal.producto ? proposal.producto.name : "-"}</TableCell>
                <TableCell>{CHANGE_TYPE_LABELS[proposal.changeType] || proposal.changeType}</TableCell>
                <TableCell>{proposal.oldValue}</TableCell>
                <TableCell>{proposal.newValue}</TableCell>
                <TableCell>
                  <Chip
                    label={STATUS_LABELS[proposal.status] || proposal.status}
                    color={STATUS_COLORS[proposal.status] || "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{proposal.reviewNote || "-"}</TableCell>
                <TableCell>{formatDate(proposal.createdAt)}</TableCell>
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
          Mis propuestas
        </Typography>

        {loading ? renderLoading() : renderTable()}
      </Container>
    </>
  );
}
