const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5010";

export const API_ENDPOINTS = {
  CREATE_PREFERENCE: `${API_BASE_URL}/api/payments/create-preference`,
  PAYMENT_STATUS: `${API_BASE_URL}/api/payments/status`,
};

export const MP_PUBLIC_KEY = process.env.REACT_APP_MP_PUBLIC_KEY;
