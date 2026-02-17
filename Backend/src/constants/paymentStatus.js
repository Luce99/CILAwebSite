const PAYMENT_STATUS = {
  APPROVED: "approved",
  PENDING: "pending",
  IN_PROCESS: "in_process",
  REJECTED: "rejected",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
  CHARGED_BACK: "charged_back",
};

const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.APPROVED]: "Aprobado",
  [PAYMENT_STATUS.PENDING]: "Pendiente",
  [PAYMENT_STATUS.IN_PROCESS]: "En proceso",
  [PAYMENT_STATUS.REJECTED]: "Rechazado",
  [PAYMENT_STATUS.REFUNDED]: "Reembolsado",
  [PAYMENT_STATUS.CANCELLED]: "Cancelado",
  [PAYMENT_STATUS.CHARGED_BACK]: "Contracargo",
};

const WEBHOOK_TOPIC = {
  PAYMENT: "payment",
  MERCHANT_ORDER: "merchant_order",
};

const CURRENCY_ID = "COP";

module.exports = {
  PAYMENT_STATUS,
  PAYMENT_STATUS_LABELS,
  WEBHOOK_TOPIC,
  CURRENCY_ID,
};
