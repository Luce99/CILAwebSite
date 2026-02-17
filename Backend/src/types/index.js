const { userType } = require("./user");
const { ProductType } = require("./Producto");
const { VentaType } = require("./Venta");
const { rolType } = require("./Rol");

const types = [ProductType, userType, VentaType, rolType];
module.exports = {
  types,
};
