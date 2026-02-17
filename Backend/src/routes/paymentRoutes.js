const express = require("express");
const router = express.Router();
const PaymentService = require("../services/PaymentService");
const OrderService = require("../services/OrderService");
const { validateCreatePreference } = require("../middleware/validatePaymentRequest");
const { WEBHOOK_TOPIC } = require("../constants/paymentStatus");

/**
 * POST /api/payments/create-preference
 * Crea una preferencia de pago en MercadoPago a partir de los items del carrito.
 */
router.post("/create-preference", validateCreatePreference, async (req, res) => {
  try {
    const { items, shippingAddress, buyerEmail } = req.body;

    const preferenceResult = await PaymentService.createPreference(items, buyerEmail);

    return res.status(200).json({
      preferenceId: preferenceResult.preferenceId,
      initPoint: preferenceResult.initPoint,
      sandboxInitPoint: preferenceResult.sandboxInitPoint,
    });
  } catch (error) {
    console.error("Error al crear preferencia de pago:", error.message);
    return res.status(500).json({
      error: "No se pudo crear la preferencia de pago",
    });
  }
});

/**
 * POST /api/payments/webhook
 * Recibe notificaciones de MercadoPago cuando cambia el estado de un pago.
 */
router.post("/webhook", async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type !== WEBHOOK_TOPIC.PAYMENT) {
      return res.status(200).json({ received: true });
    }

    const paymentId = data?.id;
    if (!paymentId) {
      return res.status(400).json({ error: "paymentId no proporcionado" });
    }

    const paymentInfo = await PaymentService.getPaymentInfo(paymentId);

    const existingOrder = await OrderService.findOrderByPaymentId(paymentId);

    if (existingOrder) {
      await OrderService.updateOrderPaymentStatus(paymentId, paymentInfo.status);
    } else {
      await OrderService.createOrderFromPayment(paymentInfo, {
        preferenceId: null,
        items: [],
        shippingAddress: null,
      });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error procesando webhook de MercadoPago:", error.message);
    return res.status(500).json({ error: "Error procesando notificacion" });
  }
});

/**
 * GET /api/payments/status/:paymentId
 * Consulta el estado de un pago por su ID.
 */
router.get("/status/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ error: "paymentId es requerido" });
    }

    const paymentInfo = await PaymentService.getPaymentInfo(paymentId);

    return res.status(200).json(paymentInfo);
  } catch (error) {
    console.error("Error consultando estado del pago:", error.message);
    return res.status(500).json({
      error: "No se pudo consultar el estado del pago",
    });
  }
});

module.exports = router;
