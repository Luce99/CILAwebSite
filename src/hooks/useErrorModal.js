import { useState, useCallback } from "react";

const INITIAL_STATE = {
  open: false,
  errorCode: null,
  severity: "error",
  title: null,
  message: "",
};

/**
 * Hook personalizado para gestionar el estado del ErrorModal.
 *
 * Uso:
 *   const { modalState, showError, closeError } = useErrorModal();
 *
 *   showError(ERROR_CODES.SIGNUP_NULL_RESPONSE);
 *   // o con override:
 *   showError(ERROR_CODES.SIGNUP_NULL_RESPONSE, { title: "Titulo personalizado" });
 *
 *   <ErrorModal {...modalState} onClose={closeError} />
 */
function useErrorModal() {
  const [modalState, setModalState] = useState(INITIAL_STATE);

  /**
   * Muestra el modal con la informacion del error.
   * @param {object} errorEntry - Entrada del diccionario ERROR_CODES.
   * @param {object} overrides - Propiedades adicionales para sobreescribir (title, message, severity).
   */
  const showError = useCallback((errorEntry, overrides = {}) => {
    const errorCode = errorEntry?.code || "UNKNOWN_ERROR";
    const severity = overrides.severity || errorEntry?.severity || "error";
    const message = overrides.message || errorEntry?.userMessage || "Ocurrio un error inesperado.";
    const title = overrides.title || null;

    console.error(`[${errorCode}] ${errorEntry?.logMessage || message}`);

    setModalState({
      open: true,
      errorCode,
      severity,
      title,
      message,
    });
  }, []);

  const closeError = useCallback(() => {
    setModalState(INITIAL_STATE);
  }, []);

  return { modalState, showError, closeError };
}

export default useErrorModal;
