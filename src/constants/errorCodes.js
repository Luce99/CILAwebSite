/**
 * Diccionario centralizado de errores de la aplicacion.
 * Cada codigo tiene un mensaje tecnico (para logs) y un mensaje de usuario (para UI).
 */

export const ERROR_CODES = {
  // --- Errores de red (NET) ---
  NETWORK_OFFLINE: {
    code: "NETWORK_OFFLINE",
    displayCode: "NET_01",
    severity: "error",
    logMessage: "El navegador no tiene conexion a internet.",
    userMessage: "Parece que no tienes conexion a internet. Verifica tu red e intenta de nuevo.",
  },
  NETWORK_TIMEOUT: {
    code: "NETWORK_TIMEOUT",
    displayCode: "NET_02",
    severity: "error",
    logMessage: "La solicitud al servidor tomo demasiado tiempo.",
    userMessage: "El servidor esta tardando en responder. Por favor, intenta de nuevo en unos segundos.",
  },
  SERVER_UNREACHABLE: {
    code: "SERVER_UNREACHABLE",
    displayCode: "NET_03",
    severity: "error",
    logMessage: "No se pudo conectar con el servidor backend.",
    userMessage: "No pudimos conectar con el servidor. Puede estar en mantenimiento. Intenta de nuevo en un momento.",
  },

  // --- Errores de autenticacion (AUT) ---
  LOGIN_FAILED: {
    code: "LOGIN_FAILED",
    displayCode: "AUT_01",
    severity: "warning",
    logMessage: "Las credenciales proporcionadas son incorrectas.",
    userMessage: "Correo o contrasena incorrectos. Revisa los datos e intenta nuevamente.",
  },
  LOGIN_NULL_RESPONSE: {
    code: "LOGIN_NULL_RESPONSE",
    displayCode: "AUT_02",
    severity: "error",
    logMessage: "El servidor retorno null para login.",
    userMessage: "No fue posible iniciar sesion. Verifica tus datos o intenta mas tarde.",
  },
  LOGIN_USER_NOT_FOUND: {
    code: "LOGIN_USER_NOT_FOUND",
    displayCode: "AUT_03",
    severity: "warning",
    logMessage: "El correo no esta registrado en el sistema.",
    userMessage: "No encontramos una cuenta con ese correo. Verifica que sea correcto o registrate.",
  },
  LOGIN_WRONG_PASSWORD: {
    code: "LOGIN_WRONG_PASSWORD",
    displayCode: "AUT_04",
    severity: "warning",
    logMessage: "La contrasena ingresada no coincide.",
    userMessage: "La contrasena es incorrecta. Revisa e intenta de nuevo.",
  },

  // --- Errores de registro (REG) ---
  SIGNUP_FAILED: {
    code: "SIGNUP_FAILED",
    displayCode: "REG_01",
    severity: "error",
    logMessage: "El registro del usuario fallo en el servidor.",
    userMessage: "No se pudo completar el registro. Por favor, intenta de nuevo.",
  },
  SIGNUP_NULL_RESPONSE: {
    code: "SIGNUP_NULL_RESPONSE",
    displayCode: "REG_02",
    severity: "error",
    logMessage: "El servidor retorno null para createUser.",
    userMessage: "El servidor no pudo crear tu cuenta en este momento. Intenta de nuevo mas tarde.",
  },
  SIGNUP_EMAIL_EXISTS: {
    code: "SIGNUP_EMAIL_EXISTS",
    displayCode: "REG_03",
    severity: "warning",
    logMessage: "El correo ya esta registrado en el sistema.",
    userMessage: "Este correo ya esta registrado. Intenta iniciar sesion o usa otro correo.",
  },

  // --- Errores de validacion (VAL) ---
  VALIDATION_EMPTY_FIELDS: {
    code: "VALIDATION_EMPTY_FIELDS",
    displayCode: "VAL_01",
    severity: "warning",
    logMessage: "Campos obligatorios vacios en el formulario.",
    userMessage: "Por favor, completa todos los campos obligatorios.",
  },
  VALIDATION_INVALID_EMAIL: {
    code: "VALIDATION_INVALID_EMAIL",
    displayCode: "VAL_02",
    severity: "warning",
    logMessage: "El formato del correo es invalido.",
    userMessage: "El correo ingresado no tiene un formato valido.",
  },
  VALIDATION_WEAK_PASSWORD: {
    code: "VALIDATION_WEAK_PASSWORD",
    displayCode: "VAL_03",
    severity: "warning",
    logMessage: "La contrasena no cumple con los requisitos minimos.",
    userMessage: "La contrasena debe tener al menos 6 caracteres.",
  },

  // --- Errores de servidor (SRV) ---
  GRAPHQL_BAD_INPUT: {
    code: "GRAPHQL_BAD_INPUT",
    displayCode: "SRV_01",
    severity: "warning",
    logMessage: "Error de validacion en el input de GraphQL.",
    userMessage: "Los datos ingresados no son validos. Revisa los campos e intenta de nuevo.",
  },
  GRAPHQL_INTERNAL_ERROR: {
    code: "GRAPHQL_INTERNAL_ERROR",
    displayCode: "SRV_02",
    severity: "error",
    logMessage: "Error interno del servidor GraphQL.",
    userMessage: "Ocurrio un error en el servidor. Nuestro equipo ha sido notificado.",
  },

  // --- Error generico (GEN) ---
  UNKNOWN_ERROR: {
    code: "UNKNOWN_ERROR",
    displayCode: "GEN_01",
    severity: "error",
    logMessage: "Error desconocido no categorizado.",
    userMessage: "Ocurrio un error inesperado. Por favor, intenta de nuevo.",
  },
};

/**
 * Mapeo de severidades a colores y etiquetas para la UI.
 */
export const SEVERITY_CONFIG = {
  error: {
    color: "#d32f2f",
    backgroundColor: "#fce4ec",
    borderColor: "#ef9a9a",
    icon: "error",
    label: "Error",
  },
  warning: {
    color: "#f57c00",
    backgroundColor: "#fff3e0",
    borderColor: "#ffcc80",
    icon: "warning",
    label: "Atencion",
  },
  info: {
    color: "#1976d2",
    backgroundColor: "#e3f2fd",
    borderColor: "#90caf9",
    icon: "info",
    label: "Informacion",
  },
};

const MIN_PASSWORD_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmptyValue(value) {
  return value === null || value === undefined || value === "";
}

function isBlankString(value) {
  return isEmptyValue(value) || value.trim() === "";
}

function isValidEmail(correo) {
  return EMAIL_REGEX.test(correo);
}

function isOffline() {
  return navigator.onLine === false;
}

/**
 * Extrae el mensaje legible de un error GraphQL del backend.
 */
function extractBackendMessage(graphQLError) {
  if (isEmptyValue(graphQLError)) {
    return null;
  }

  const validationErrors = graphQLError?.extensions?.errors;
  const hasValidationErrors = Array.isArray(validationErrors) && validationErrors.length > 0;
  if (hasValidationErrors) {
    return validationErrors.map((e) => e.message).join(". ");
  }

  return graphQLError.message || null;
}

/**
 * Detecta errores especificos de login basandose en el mensaje del backend.
 */
function resolveLoginSpecificError(backendMessage) {
  if (isEmptyValue(backendMessage)) {
    return null;
  }

  const lowerMessage = backendMessage.toLowerCase();

  if (lowerMessage.includes("no existe") || lowerMessage.includes("usuario no existe")) {
    return ERROR_CODES.LOGIN_USER_NOT_FOUND;
  }

  if (lowerMessage.includes("incorrecta") || lowerMessage.includes("contrasena")) {
    return ERROR_CODES.LOGIN_WRONG_PASSWORD;
  }

  if (lowerMessage.includes("ya existe") || lowerMessage.includes("already exists")) {
    return ERROR_CODES.SIGNUP_EMAIL_EXISTS;
  }

  return null;
}

/**
 * Determina el error apropiado basandose en el tipo de excepcion.
 * Incluye el mensaje real del backend como detalle adicional.
 */
export function resolveErrorFromException(exception) {
  if (isOffline()) {
    return ERROR_CODES.NETWORK_OFFLINE;
  }

  if (exception?.networkError) {
    const statusCode = exception.networkError.statusCode;
    const networkMessage = exception.networkError.message || "";
    const isServerStarting = statusCode === 502 || statusCode === 503 || networkMessage.includes("ECONNREFUSED");

    if (isServerStarting) {
      return {
        ...ERROR_CODES.SERVER_UNREACHABLE,
        detail: "El servidor puede estar iniciandose. Render.com apaga servicios gratuitos tras inactividad. Espera 30 segundos e intenta de nuevo.",
      };
    }

    return {
      ...ERROR_CODES.SERVER_UNREACHABLE,
      detail: networkMessage || null,
    };
  }

  const hasGraphQLErrors = exception?.graphQLErrors?.length > 0;
  if (hasGraphQLErrors) {
    const firstError = exception.graphQLErrors[0];
    const extensionCode = firstError?.extensions?.code;
    const backendMessage = extractBackendMessage(firstError);

    const specificError = resolveLoginSpecificError(backendMessage);
    if (specificError) {
      return { ...specificError, detail: backendMessage };
    }

    if (extensionCode === "BAD_USER_INPUT") {
      return {
        ...ERROR_CODES.GRAPHQL_BAD_INPUT,
        userMessage: backendMessage || ERROR_CODES.GRAPHQL_BAD_INPUT.userMessage,
        detail: backendMessage,
      };
    }

    return {
      ...ERROR_CODES.GRAPHQL_INTERNAL_ERROR,
      detail: backendMessage || "Sin detalles adicionales del servidor.",
    };
  }

  const isFailedToFetch = exception?.message?.includes("Failed to fetch");
  if (isFailedToFetch) {
    return {
      ...ERROR_CODES.SERVER_UNREACHABLE,
      detail: "No se pudo conectar con el servidor. Puede estar inactivo o en mantenimiento.",
    };
  }

  return {
    ...ERROR_CODES.UNKNOWN_ERROR,
    detail: exception?.message || null,
  };
}

/**
 * Valida los campos del formulario de registro.
 * Retorna null si todo es valido, o el error correspondiente.
 */
export function validateSignUpFields(nombre, apellido, correo, contrasena) {
  const hasEmptyFields = isBlankString(nombre) || isBlankString(apellido) || isBlankString(correo) || isBlankString(contrasena);
  if (hasEmptyFields) {
    return ERROR_CODES.VALIDATION_EMPTY_FIELDS;
  }

  if (isValidEmail(correo) === false) {
    return ERROR_CODES.VALIDATION_INVALID_EMAIL;
  }

  if (contrasena.length < MIN_PASSWORD_LENGTH) {
    return ERROR_CODES.VALIDATION_WEAK_PASSWORD;
  }

  return null;
}

/**
 * Valida los campos del formulario de login.
 * Retorna null si todo es valido, o el error correspondiente.
 */
export function validateSignInFields(correo, contrasena) {
  const hasEmptyFields = isBlankString(correo) || isBlankString(contrasena);
  if (hasEmptyFields) {
    return ERROR_CODES.VALIDATION_EMPTY_FIELDS;
  }

  if (isValidEmail(correo) === false) {
    return ERROR_CODES.VALIDATION_INVALID_EMAIL;
  }

  return null;
}
