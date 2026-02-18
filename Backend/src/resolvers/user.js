const userService = require("../services/user");

const userResolvers = {
  Query: {
    getUsers: async () => {
      return userService.getUsers();
    },
    getUserById: async (parent, args) => {
      return userService.getUserById(args._id);
    },
    getUsersByRoles: async (parent, args) => {
      return userService.getUsersByRoles(args.roles);
    },
  },
  Mutation: {
    login: async (parent, args) => {
      return userService.login(args);
    },
    createUser: async (parent, args) => {
      return userService.createUser(args);
    },
    updateUser: async (parent, args) => {
      return userService.updateUser(args._id, args);
    },
    deleteUser: async (parent, args) => {
      return userService.deleteUser(args._id, args);
    },
    createStaffUser: async (parent, args) => {
      return userService.createStaffUser(args);
    },
  },
};

module.exports = { userResolvers };
