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
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import NavAdministrador from "./NavAdministrador";
import NotificationBell from "./NotificationBell";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_PENDING_CHANGES = gql`
  query getPendingChanges($status: String) {
    getPendingChanges(status: $status) {
      _id
      changeType
      producto {
        _id
        name
      }
      proposedBy {
        nombre
        apellido
      }
      status
      oldValue
      newValue
      description
      createdAt
    }
  }
`;

const REVIEW_CHANGE = gql`
  mutation ReviewPendingChange(
    $changeId: ID!
    $status: String!
    $reviewedBy: ID!
    $reviewNote: String
  ) {
    reviewPendingChange(
      changeId: $changeId
      status: $status
      reviewedBy: $reviewedBy
      reviewNote: $reviewNote
    ) {
      _id
      status
    }
  }
`;

const CHANGE_TYPE_LABELS = {
  price: "Precio",
  stock: "Stock",
  promotion: "Promoción",
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
  approveButton: {
    backgroundColor: "#27AE60",
    color: "#FFFFFF",
    fontSize: "0.75rem",
    textTransform: "none",
    "&:hover": { backgroundColor: "#1E8449" },
  },
  rejectButton: {
    backgroundColor: "#C0392B",
    color: "#FFFFFF",
    fontSize: "0.75rem",
    textTransform: "none",
    "&:hover": { backgroundColor: "#96281B" },
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    py: 6,
  },
};

/** Pagina de aprobaciones pendientes para el administrador. */
export default function PendingApprovals() {
  const [reviewNotes, setReviewNotes] = useState({});
  const adminId = localStorage.getItem("id");

  const { data, loading } = useQuery(GET_PENDING_CHANGES, {
    variables: { status: "pending" },
  });

  const [reviewChange] = useMutation(REVIEW_CHANGE, {
    refetchQueries: [{ query: GET_PENDING_CHANGES, variables: { status: "pending" } }],
  });

  function handleNoteChange(changeId, note) {
    setReviewNotes((prev) => ({ ...prev, [changeId]: note }));
  }

  function handleReview(changeId, status) {
    reviewChange({
      variables: {
        changeId,
        status,
        reviewedBy: adminId,
        reviewNote: reviewNotes[changeId] || "",
      },
    });
  }

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
    const changes = (data && data.getPendingChanges) || [];

    if (changes.length === 0) {
      return (
        <Typography variant="body1" sx={{ textAlign: "center", color: "#6E6E73", mt: 4 }}>
          No hay cambios pendientes de aprobación.
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
              <TableCell sx={STYLES.headerCell}>Actual</TableCell>
              <TableCell sx={STYLES.headerCell}>Propuesto</TableCell>
              <TableCell sx={STYLES.headerCell}>Propuesto por</TableCell>
              <TableCell sx={STYLES.headerCell}>Fecha</TableCell>
              <TableCell sx={STYLES.headerCell}>Nota</TableCell>
              <TableCell sx={STYLES.headerCell}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {changes.map((change) => (
              <TableRow key={change._id} hover>
                <TableCell>{change.producto ? change.producto.name : "-"}</TableCell>
                <TableCell>
                  <Chip
                    label={CHANGE_TYPE_LABELS[change.changeType] || change.changeType}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{change.oldValue}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{change.newValue}</TableCell>
                <TableCell>
                  {change.proposedBy
                    ? change.proposedBy.nombre + " " + change.proposedBy.apellido
                    : "-"}
                </TableCell>
                <TableCell>{formatDate(change.createdAt)}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Nota opcional"
                    value={reviewNotes[change._id] || ""}
                    onChange={(e) => handleNoteChange(change._id, e.target.value)}
                    sx={{ minWidth: 120 }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      sx={STYLES.approveButton}
                      onClick={() => handleReview(change._id, "approved")}
                    >
                      Aprobar
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CancelIcon />}
                      sx={STYLES.rejectButton}
                      onClick={() => handleReview(change._id, "rejected")}
                    >
                      Rechazar
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap" }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#2C2C2E" }}>
            Aprobaciones pendientes
          </Typography>
          <NotificationBell />
        </Box>

        {loading ? renderLoading() : renderTable()}
      </Container>
    </>
  );
}
