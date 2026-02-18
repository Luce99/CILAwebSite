const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3000";
const API_URL = process.env.E2E_API_URL || "http://localhost:5010";
const TIMEOUT_MS = 15000;
const IMPLICIT_WAIT_MS = 5000;

module.exports = {
  BASE_URL,
  API_URL,
  TIMEOUT_MS,
  IMPLICIT_WAIT_MS,
};
