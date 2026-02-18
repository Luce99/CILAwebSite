const { gql } = require("apollo-server-express");

const PendingChangeType = gql`
  type PendingChange {
    _id: ID!
    changeType: String!
    producto: Producto
    proposedBy: User
    status: String!
    oldValue: Float!
    newValue: Float!
    description: String
    reviewedBy: User
    reviewNote: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  extend type Query {
    getPendingChanges(status: String): [PendingChange]
    getPendingChangesByUser(userId: String!): [PendingChange]
  }

  extend type Mutation {
    createPendingChange(
      changeType: String!
      producto: ID!
      proposedBy: ID!
      oldValue: Float!
      newValue: Float!
      description: String
    ): PendingChange

    reviewPendingChange(
      changeId: ID!
      status: String!
      reviewedBy: ID!
      reviewNote: String
    ): PendingChange
  }
`;

module.exports = { PendingChangeType };
