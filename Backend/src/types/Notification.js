const { gql } = require("apollo-server-express");

const NotificationType = gql`
  type Notification {
    _id: ID!
    recipient: User
    type: String!
    pendingChange: PendingChange
    read: Boolean!
    createdAt: DateTime
  }

  extend type Query {
    getNotifications(recipientId: String!): [Notification]
    getUnreadCount(recipientId: String!): Int
  }

  extend type Mutation {
    markNotificationRead(notificationId: ID!): Notification
    markAllNotificationsRead(recipientId: String!): Boolean
  }
`;

module.exports = { NotificationType };
