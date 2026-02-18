import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_NOTIFICATIONS = gql`
  query getNotifications($recipientId: String!) {
    getNotifications(recipientId: $recipientId) {
      _id
      type
      read
      createdAt
      pendingChange {
        changeType
        status
        producto {
          name
        }
        proposedBy {
          nombre
        }
      }
    }
  }
`;

const GET_UNREAD_COUNT = gql`
  query getUnreadCount($recipientId: String!) {
    getUnreadCount(recipientId: $recipientId)
  }
`;

const MARK_ALL_READ = gql`
  mutation markAllNotificationsRead($recipientId: String!) {
    markAllNotificationsRead(recipientId: $recipientId)
  }
`;

const NOTIFICATION_LABELS = {
  pending_approval: "Nueva propuesta de cambio",
  change_approved: "Tu propuesta fue aprobada",
  change_rejected: "Tu propuesta fue rechazada",
};

const STYLES = {
  bellIcon: {
    color: "#7C6A56",
  },
  menuPaper: {
    maxWidth: 360,
    maxHeight: 400,
    overflowY: "auto",
  },
  notifItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    py: 1.5,
    px: 2,
    maxWidth: 340,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#E74C3C",
    flexShrink: 0,
  },
};

/** Campana de notificaciones con badge de no leidas y dropdown. */
export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState(null);
  const userId = localStorage.getItem("id");

  const { data: countData } = useQuery(GET_UNREAD_COUNT, {
    variables: { recipientId: userId || "" },
    skip: !userId,
    pollInterval: 30000,
  });

  const { data: notifsData } = useQuery(GET_NOTIFICATIONS, {
    variables: { recipientId: userId || "" },
    skip: !userId,
  });

  const [markAllRead] = useMutation(MARK_ALL_READ, {
    refetchQueries: [
      { query: GET_UNREAD_COUNT, variables: { recipientId: userId || "" } },
      { query: GET_NOTIFICATIONS, variables: { recipientId: userId || "" } },
    ],
  });

  function handleOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleMarkAllRead() {
    markAllRead({ variables: { recipientId: userId } });
  }

  function formatDate(dateStr) {
    if (!dateStr) {
      return "";
    }
    return new Date(dateStr).toLocaleDateString("es-CO", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const unreadCount = (countData && countData.getUnreadCount) || 0;
  const notifications = (notifsData && notifsData.getNotifications) || [];
  const isOpen = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleOpen} sx={STYLES.bellIcon}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        PaperProps={{ sx: STYLES.menuPaper }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Notificaciones
          </Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAllRead} sx={{ textTransform: "none", fontSize: "0.75rem" }}>
              Marcar todas como leídas
            </Button>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 && (
          <MenuItem disabled>
            <Typography variant="body2" sx={{ color: "#6E6E73" }}>
              Sin notificaciones
            </Typography>
          </MenuItem>
        )}

        {notifications.slice(0, 20).map((notif) => (
          <MenuItem key={notif._id} onClick={handleClose} sx={STYLES.notifItem}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {notif.read === false && <Box sx={STYLES.unreadDot} />}
              <Typography variant="body2" sx={{ fontWeight: notif.read ? 400 : 700, fontSize: "0.85rem" }}>
                {NOTIFICATION_LABELS[notif.type] || notif.type}
              </Typography>
            </Box>
            {notif.pendingChange && notif.pendingChange.producto && (
              <Typography variant="caption" sx={{ color: "#6E6E73" }}>
                {notif.pendingChange.producto.name} - {notif.pendingChange.changeType}
              </Typography>
            )}
            <Typography variant="caption" sx={{ color: "#999" }}>
              {formatDate(notif.createdAt)}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
