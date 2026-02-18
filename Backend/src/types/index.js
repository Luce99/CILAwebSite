const { userType } = require("./user");
const { ProductType } = require("./Producto");
const { VentaType } = require("./Venta");
const { rolType } = require("./Rol");
const { PendingChangeType } = require("./PendingChange");
const { NotificationType } = require("./Notification");

const types = [ProductType, userType, VentaType, rolType, PendingChangeType, NotificationType];

module.exports = { types };
