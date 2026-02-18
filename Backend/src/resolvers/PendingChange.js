const pendingChangeService = require("../services/PendingChange");

const pendingChangeResolvers = {
  Query: {
    getPendingChanges: async (parent, args) => {
      return pendingChangeService.getPendingChanges(args.status);
    },
    getPendingChangesByUser: async (parent, args) => {
      return pendingChangeService.getPendingChangesByUser(args.userId);
    },
  },
  Mutation: {
    createPendingChange: async (parent, args) => {
      return pendingChangeService.createPendingChange(args, args.proposedBy);
    },
    reviewPendingChange: async (parent, args) => {
      return pendingChangeService.reviewPendingChange(
        args.changeId,
        args.status,
        args.reviewedBy,
        args.reviewNote
      );
    },
  },
};

module.exports = { pendingChangeResolvers };
