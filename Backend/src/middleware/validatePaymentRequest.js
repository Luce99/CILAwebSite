const REQUIRED_ITEM_FIELDS = ["name", "price", "quantity"];
const REQUIRED_ADDRESS_FIELDS = ["firstName", "lastName", "address1", "city", "zip", "country"];
const MIN_ITEMS_COUNT = 1;

/**
 * Verifica que un item del carrito tenga todos los campos requeridos.
 */
function isValidCartItem(item) {
  const hasAllFields = REQUIRED_ITEM_FIELDS.every((field) => {
    return item[field] !== undefined && item[field] !== null;
  });

  if (!hasAllFields) {
    return false;
  }

  const hasValidPrice = Number(item.price) > 0;
  const hasValidQuantity = Number(item.quantity) > 0;

  return hasValidPrice && hasValidQuantity;
}

/**
 * Verifica que la direccion de envio tenga todos los campos requeridos.
 */
function isValidShippingAddress(address) {
  if (!address) {
    return false;
  }

  return REQUIRED_ADDRESS_FIELDS.every((field) => {
    const value = address[field];
    return value !== undefined && value !== null && String(value).trim() !== "";
  });
}

/**
 * Middleware que valida el request de creacion de preferencia de pago.
 */
function validateCreatePreference(req, res, next) {
  const { items, shippingAddress } = req.body;

  if (!items || !Array.isArray(items) || items.length < MIN_ITEMS_COUNT) {
    return res.status(400).json({
      error: "Se requiere al menos un item en el carrito",
    });
  }

  const allItemsValid = items.every(isValidCartItem);
  if (!allItemsValid) {
    return res.status(400).json({
      error: "Todos los items deben tener nombre, precio mayor a 0 y cantidad mayor a 0",
    });
  }

  if (!isValidShippingAddress(shippingAddress)) {
    return res.status(400).json({
      error: "La direccion de envio es obligatoria con los campos: nombre, apellido, direccion, ciudad, codigo postal y pais",
    });
  }

  return next();
}

module.exports = {
  validateCreatePreference,
  isValidCartItem,
  isValidShippingAddress,
  REQUIRED_ITEM_FIELDS,
  REQUIRED_ADDRESS_FIELDS,
};
