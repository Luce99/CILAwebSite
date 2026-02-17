const Venta = require("../models/Venta");
const { PAYMENT_STATUS } = require("../constants/paymentStatus");

/**
 * Verifica si ya existe una orden con el mismo paymentId de MercadoPago.
 */
async function findOrderByPaymentId(paymentId) {
  const existingOrder = await Venta.findOne({
    mercadopagoPaymentId: String(paymentId),
  });
  return existingOrder;
}

/**
 * Crea una nueva orden (Venta) a partir de los datos de un pago de MercadoPago.
 */
async function createOrderFromPayment(paymentData, orderDetails) {
  const existingOrder = await findOrderByPaymentId(paymentData.paymentId);

  if (existingOrder) {
    return existingOrder;
  }

  const ventaData = {
    fechaVenta: new Date(),
    totalVenta: paymentData.transactionAmount,
    mercadopagoPaymentId: String(paymentData.paymentId),
    mercadopagoPreferenceId: orderDetails.preferenceId || null,
    paymentStatus: paymentData.status,
    items: orderDetails.items || [],
    shippingAddress: orderDetails.shippingAddress || null,
    cliente: orderDetails.clienteId || null,
  };

  const newOrder = new Venta(ventaData);
  const savedOrder = await newOrder.save();
  return savedOrder;
}

/**
 * Actualiza el estado de pago de una orden existente.
 */
async function updateOrderPaymentStatus(paymentId, newStatus) {
  const updatedOrder = await Venta.findOneAndUpdate(
    { mercadopagoPaymentId: String(paymentId) },
    { paymentStatus: newStatus },
    { new: true }
  );
  return updatedOrder;
}

/**
 * Busca una orden por su preferenceId de MercadoPago.
 */
async function findOrderByPreferenceId(preferenceId) {
  const order = await Venta.findOne({
    mercadopagoPreferenceId: preferenceId,
  });
  return order;
}

module.exports = {
  findOrderByPaymentId,
  createOrderFromPayment,
  updateOrderPaymentStatus,
  findOrderByPreferenceId,
};
