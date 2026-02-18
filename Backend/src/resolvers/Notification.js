const notificationService = require("../services/Notification");

const notificationResolvers = {
  Query: {
    getNotifications: async (parent, args) => {
      return notificationService.getNotifications(args.recipientId);
    },
    getUnreadCount: async (parent, args) => {
      return notificationService.getUnreadCount(args.recipientId);
    },
  },
  Mutation: {
    markNotificationRead: async (parent, args) => {
      return notificationService.markNotificationRead(args.notificationId);
    },
    markAllNotificationsRead: async (parent, args) => {
      return notificationService.markAllNotificationsRead(args.recipientId);
    },
  },
};

module.exports = { notificationResolvers };
