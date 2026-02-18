const { ventaResolvers } = require("./Venta");
const { userResolvers } = require("./user");
const { productoResolvers } = require("./Producto");
const { rolResolvers } = require("./Rol");
const { pendingChangeResolvers } = require("./PendingChange");
const { notificationResolvers } = require("./Notification");
const dateTime = require("./datetime");

const resolvers = [
  productoResolvers,
  userResolvers,
  ventaResolvers,
  rolResolvers,
  pendingChangeResolvers,
  notificationResolvers,
  dateTime,
];

module.exports = { resolvers };
