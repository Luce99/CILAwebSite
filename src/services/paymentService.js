import { API_ENDPOINTS } from "../constants/apiEndpoints";

const JSON_HEADERS = { "Content-Type": "application/json" };

/**
 * Crea una preferencia de pago en el backend.
 * Retorna el preferenceId necesario para iniciar el checkout de MercadoPago.
 */
export async function createPaymentPreference(cartItems, shippingAddress, buyerEmail) {
  const requestBody = {
    items: cartItems.map(formatCartItemForApi),
    shippingAddress,
    buyerEmail,
  };

  const response = await fetch(API_ENDPOINTS.CREATE_PREFERENCE, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al crear la preferencia de pago");
  }

  return response.json();
}

/**
 * Consulta el estado de un pago por su ID.
 */
export async function getPaymentStatus(paymentId) {
  const url = `${API_ENDPOINTS.PAYMENT_STATUS}/${paymentId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: JSON_HEADERS,
  });

  if (!response.ok) {
    throw new Error("Error al consultar el estado del pago");
  }

  return response.json();
}

/**
 * Formatea un item del carrito del frontend al formato que espera el API.
 */
function formatCartItemForApi(cartItem) {
  return {
    name: cartItem.name,
    price: cartItem.price,
    quantity: cartItem.quantity,
  };
}
