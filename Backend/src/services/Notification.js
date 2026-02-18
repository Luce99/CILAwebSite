const Notification = require("../models/Notification");

const POPULATE_FIELDS = [
  { path: "recipient", model: "user" },
  {
    path: "pendingChange",
    model: "PendingChange",
    populate: [
      { path: "producto", model: "producto" },
      { path: "proposedBy", model: "user" },
    ],
  },
];

/** Retorna las notificaciones de un usuario ordenadas por fecha. */
async function getNotifications(recipientId) {
  return Notification.find({ recipient: recipientId })
    .populate(POPULATE_FIELDS)
    .sort({ createdAt: -1 });
}

/** Retorna la cantidad de notificaciones no leidas de un usuario. */
async function getUnreadCount(recipientId) {
  return Notification.countDocuments({ recipient: recipientId, read: false });
}

/** Marca una notificacion como leida. */
async function markNotificationRead(notificationId) {
  return Notification.findByIdAndUpdate(
    notificationId,
    { read: true },
    { new: true }
  ).populate(POPULATE_FIELDS);
}

/** Marca todas las notificaciones de un usuario como leidas. */
async function markAllNotificationsRead(recipientId) {
  await Notification.updateMany(
    { recipient: recipientId, read: false },
    { read: true }
  );
  return true;
}

module.exports = {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
};
