export const CHECKOUT_STEPS = [
  "Dirección de envío",
  "Resumen del pedido",
  "Pagar",
];

export const STEP_INDEX = {
  ADDRESS: 0,
  REVIEW: 1,
  PAYMENT: 2,
};

export const PAYMENT_RESULT_STATUS = {
  APPROVED: "approved",
  PENDING: "pending",
  REJECTED: "rejected",
};

export const PAYMENT_RESULT_MESSAGES = {
  [PAYMENT_RESULT_STATUS.APPROVED]: {
    title: "¡Pago aprobado!",
    message: "Tu pedido ha sido procesado exitosamente. Te enviaremos un correo con los detalles.",
  },
  [PAYMENT_RESULT_STATUS.PENDING]: {
    title: "Pago pendiente",
    message: "Tu pago está siendo procesado. Te notificaremos cuando se confirme.",
  },
  [PAYMENT_RESULT_STATUS.REJECTED]: {
    title: "Pago rechazado",
    message: "No se pudo procesar tu pago. Por favor intenta con otro medio de pago.",
  },
};

export const EMPTY_ADDRESS = {
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};
