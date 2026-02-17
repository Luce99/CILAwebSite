import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  AVATAR_GALLERY,
  AVATAR_CATEGORIES,
  getAvatarsByCategory,
} from "../constants/avatarGallery";

const STYLES = {
  avatarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    padding: "16px 0",
    maxHeight: "400px",
    overflowY: "auto",
  },
  avatarItem: (isSelected) => ({
    position: "relative",
    cursor: "pointer",
    borderRadius: "50%",
    border: isSelected ? "4px solid #f20a95" : "4px solid transparent",
    transition: "all 0.2s ease",
    overflow: "hidden",
    aspectRatio: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: isSelected ? "#fce4ec" : "#f5f5f5",
    "&:hover": {
      transform: "scale(1.05)",
    },
  }),
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
  },
  checkIcon: {
    position: "absolute",
    bottom: 2,
    right: 2,
    color: "#f20a95",
    backgroundColor: "white",
    borderRadius: "50%",
    fontSize: "22px",
  },
  label: {
    textAlign: "center",
    fontSize: "0.7rem",
    marginTop: "4px",
    color: "#666",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    color: "#9e9e9e",
  },
  dialogTitle: {
    textAlign: "center",
    fontWeight: 600,
    color: "#f20a95",
  },
  tabsContainer: {
    borderBottom: 1,
    borderColor: "divider",
  },
};

/**
 * AvatarSelector - Modal para seleccionar avatar de perfil.
 *
 * Props:
 * - open (boolean): Controla la visibilidad.
 * - onClose (function): Callback al cerrar.
 * - currentAvatarId (string): ID del avatar actualmente seleccionado.
 * - onSelect (function): Callback con el avatar seleccionado { id, url, category, label }.
 */
function AvatarSelector({ open, onClose, currentAvatarId, onSelect }) {
  const [selectedId, setSelectedId] = useState(currentAvatarId || "");
  const [activeTab, setActiveTab] = useState(0);

  function handleTabChange(event, newValue) {
    setActiveTab(newValue);
  }

  function handleAvatarClick(avatar) {
    setSelectedId(avatar.id);
  }

  function handleConfirm() {
    const selected = AVATAR_GALLERY.find((a) => a.id === selectedId);
    if (selected) {
      onSelect(selected);
    }
    onClose();
  }

  function renderAvatarItem(avatar) {
    const isSelected = avatar.id === selectedId;

    return (
      <Box key={avatar.id} sx={{ textAlign: "center" }}>
        <Box
          onClick={() => handleAvatarClick(avatar)}
          sx={STYLES.avatarItem(isSelected)}
        >
          <img
            src={avatar.url}
            alt={avatar.label}
            style={STYLES.avatarImage}
            loading="lazy"
          />
          {isSelected && <CheckCircleIcon sx={STYLES.checkIcon} />}
        </Box>
        <Typography sx={STYLES.label}>{avatar.label}</Typography>
      </Box>
    );
  }

  function renderAvatarGrid() {
    const currentCategory = AVATAR_CATEGORIES[activeTab];
    const filteredAvatars = getAvatarsByCategory(currentCategory);

    return (
      <Box sx={STYLES.avatarGrid}>
        {filteredAvatars.map(renderAvatarItem)}
      </Box>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          borderTop: "4px solid #f20a95",
        },
      }}
    >
      <IconButton onClick={onClose} sx={STYLES.closeButton} aria-label="cerrar">
        <CloseIcon />
      </IconButton>

      <DialogTitle sx={STYLES.dialogTitle}>
        Elige tu avatar
      </DialogTitle>

      <DialogContent>
        <Box sx={STYLES.tabsContainer}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            TabIndicatorProps={{ style: { backgroundColor: "#f20a95" } }}
          >
            {AVATAR_CATEGORIES.map((category) => (
              <Tab
                key={category}
                label={category}
                sx={{
                  fontWeight: 600,
                  "&.Mui-selected": { color: "#f20a95" },
                }}
              />
            ))}
          </Tabs>
        </Box>

        {renderAvatarGrid()}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", padding: "16px 24px 24px" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "#666",
            borderColor: "#ccc",
            "&:hover": { borderColor: "#999" },
            minWidth: 120,
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={selectedId === "" || selectedId === null}
          sx={{
            backgroundColor: "#f20a95",
            "&:hover": { backgroundColor: "#d1087e" },
            minWidth: 120,
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AvatarSelector;
