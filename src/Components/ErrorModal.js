import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { SEVERITY_CONFIG } from "../constants/errorCodes";

const SEVERITY_ICONS = {
  error: ErrorOutlineIcon,
  warning: WarningAmberIcon,
  info: InfoOutlinedIcon,
};

const DEFAULT_TITLES = {
  error: "Ha ocurrido un error",
  warning: "Atencion",
  info: "Informacion",
};

const DEFAULT_SEVERITY = "error";

const STYLES = {
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px",
  },
  iconCircle: (backgroundColor) => ({
    width: 72,
    height: 72,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor,
  }),
  title: {
    textAlign: "center",
    fontWeight: 600,
    paddingBottom: 0,
  },
  content: {
    textAlign: "center",
    paddingTop: "8px",
  },
  codeBox: {
    marginTop: "12px",
    padding: "8px 12px",
    borderRadius: "6px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #e0e0e0",
    display: "inline-block",
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: "0.8rem",
    color: "#616161",
  },
  actions: {
    justifyContent: "center",
    padding: "16px 24px 24px",
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    color: "#9e9e9e",
  },
};

/**
 * Componente ErrorModal parametizable.
 *
 * Props:
 * - open (boolean): Controla la visibilidad del modal.
 * - onClose (function): Callback al cerrar el modal.
 * - errorCode (string|null): Codigo del error para mostrar al usuario (ej: "NETWORK_OFFLINE").
 * - severity ("error"|"warning"|"info"): Nivel de severidad para estilo visual.
 * - title (string|null): Titulo personalizado. Si no se provee, se usa uno por defecto segun severidad.
 * - message (string): Mensaje principal para el usuario.
 * - showCode (boolean): Si se muestra el codigo de error en el modal. Default: true.
 * - primaryAction (object|null): { label: string, onClick: function } para boton primario.
 * - secondaryAction (object|null): { label: string, onClick: function } para boton secundario.
 */
function ErrorModal({
  open = false,
  onClose,
  errorCode = null,
  severity = DEFAULT_SEVERITY,
  title = null,
  message = "",
  showCode = true,
  primaryAction = null,
  secondaryAction = null,
}) {
  const safeSeverity = SEVERITY_CONFIG[severity] ? severity : DEFAULT_SEVERITY;
  const config = SEVERITY_CONFIG[safeSeverity];
  const IconComponent = SEVERITY_ICONS[safeSeverity];
  const displayTitle = title || DEFAULT_TITLES[safeSeverity];

  const defaultPrimaryAction = {
    label: "Entendido",
    onClick: onClose,
  };

  const resolvedPrimaryAction = primaryAction || defaultPrimaryAction;

  function renderIcon() {
    return (
      <Box sx={STYLES.iconContainer}>
        <Box sx={STYLES.iconCircle(config.backgroundColor)}>
          <IconComponent sx={{ fontSize: 40, color: config.color }} />
        </Box>
      </Box>
    );
  }

  function renderErrorCode() {
    if (!showCode || !errorCode) {
      return null;
    }

    return (
      <Box sx={STYLES.codeBox}>
        <Typography sx={STYLES.codeText}>
          Codigo: {errorCode}
        </Typography>
      </Box>
    );
  }

  function renderActions() {
    return (
      <DialogActions sx={STYLES.actions}>
        {secondaryAction && (
          <Button
            onClick={secondaryAction.onClick}
            variant="outlined"
            sx={{
              color: config.color,
              borderColor: config.borderColor,
              "&:hover": { borderColor: config.color },
            }}
          >
            {secondaryAction.label}
          </Button>
        )}
        <Button
          onClick={resolvedPrimaryAction.onClick}
          variant="contained"
          sx={{
            backgroundColor: config.color,
            "&:hover": { backgroundColor: config.color, opacity: 0.9 },
            minWidth: 120,
          }}
        >
          {resolvedPrimaryAction.label}
        </Button>
      </DialogActions>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          borderTop: `4px solid ${config.color}`,
          overflow: "visible",
        },
      }}
    >
      <IconButton onClick={onClose} sx={STYLES.closeButton} aria-label="cerrar">
        <CloseIcon />
      </IconButton>

      <DialogTitle sx={STYLES.title}>
        {renderIcon()}
        {displayTitle}
      </DialogTitle>

      <DialogContent sx={STYLES.content}>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {message}
        </Typography>
        {renderErrorCode()}
      </DialogContent>

      {renderActions()}
    </Dialog>
  );
}

export default ErrorModal;
