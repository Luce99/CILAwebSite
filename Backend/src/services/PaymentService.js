const { Preference, Payment } = require("mercadopago");
const { v4: uuidv4 } = require("uuid");
const { createMercadoPagoClient } = require("../constants/mercadopagoConfig");
const { CURRENCY_ID } = require("../constants/paymentStatus");

let preferenceClient = null;
let paymentClient = null;

/**
 * Inicializa los clientes de MercadoPago de forma lazy.
 * Permite que los tests puedan ejecutarse sin credenciales.
 */
function getPreferenceClient() {
  if (!preferenceClient) {
    const client = createMercadoPagoClient();
    preferenceClient = new Preference(client);
  }
  return preferenceClient;
}

function getPaymentClient() {
  if (!paymentClient) {
    const client = createMercadoPagoClient();
    paymentClient = new Payment(client);
  }
  return paymentClient;
}

/**
 * Transforma un item del carrito al formato requerido por MercadoPago.
 */
function buildPreferenceItem(cartItem) {
  return {
    title: cartItem.name,
    unit_price: Number(cartItem.price),
    quantity: Number(cartItem.quantity),
    currency_id: CURRENCY_ID,
  };
}

/**
 * Transforma la lista completa de items del carrito al formato de MercadoPago.
 */
function buildPreferenceItems(cartItems) {
  return cartItems.map(buildPreferenceItem);
}

/**
 * Construye las URLs de retorno tras el pago en MercadoPago.
 */
function buildBackUrls() {
  const frontendBaseUrl = process.env.FRONTEND_BASE_URL;

  return {
    success: `${frontendBaseUrl}/payment/result?status=approved`,
    failure: `${frontendBaseUrl}/payment/result?status=rejected`,
    pending: `${frontendBaseUrl}/payment/result?status=pending`,
  };
}

/**
 * Construye el objeto completo de preferencia para MercadoPago.
 */
function buildPreferenceBody(cartItems, buyerEmail) {
  const items = buildPreferenceItems(cartItems);
  const backUrls = buildBackUrls();

  const preferenceBody = {
    items,
    back_urls: backUrls,
    auto_return: "approved",
    notification_url: `${process.env.BACKEND_BASE_URL || "https://cilawebsite-backend.onrender.com"}/api/payments/webhook`,
  };

  if (buyerEmail) {
    preferenceBody.payer = { email: buyerEmail };
  }

  return preferenceBody;
}

/**
 * Crea una preferencia de pago en MercadoPago.
 * Retorna el ID de la preferencia y la URL de inicio del checkout.
 */
async function createPreference(cartItems, buyerEmail) {
  const preferenceBody = buildPreferenceBody(cartItems, buyerEmail);
  const idempotencyKey = uuidv4();

  const response = await getPreferenceClient().create({
    body: preferenceBody,
    requestOptions: { idempotencyKey },
  });

  return {
    preferenceId: response.id,
    initPoint: response.init_point,
    sandboxInitPoint: response.sandbox_init_point,
  };
}

/**
 * Consulta la informacion de un pago por su ID en MercadoPago.
 */
async function getPaymentInfo(paymentId) {
  const response = await getPaymentClient().get({ id: paymentId });

  return {
    paymentId: response.id,
    status: response.status,
    statusDetail: response.status_detail,
    transactionAmount: response.transaction_amount,
    payerEmail: response.payer?.email,
    externalReference: response.external_reference,
  };
}

module.exports = {
  buildPreferenceItem,
  buildPreferenceItems,
  buildBackUrls,
  buildPreferenceBody,
  createPreference,
  getPaymentInfo,
};
