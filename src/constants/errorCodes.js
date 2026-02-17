/**
 * Diccionario centralizado de errores de la aplicacion.
 * Cada codigo tiene un mensaje tecnico (para logs) y un mensaje de usuario (para UI).
 */

export const ERROR_CODES = {
  // --- Errores de red ---
  NETWORK_OFFLINE: {
    code: "NETWORK_OFFLINE",
    severity: "error",
    logMessage: "El navegador no tiene conexion a internet.",
    userMessage: "Parece que no tienes conexion a internet. Verifica tu red e intenta de nuevo.",
  },
  NETWORK_TIMEOUT: {
    code: "NETWORK_TIMEOUT",
    severity: "error",
    logMessage: "La solicitud al servidor tomo demasiado tiempo.",
    userMessage: "El servidor esta tardando en responder. Por favor, intenta de nuevo en unos segundos.",
  },
  SERVER_UNREACHABLE: {
    code: "SERVER_UNREACHABLE",
    severity: "error",
    logMessage: "No se pudo conectar con el servidor backend.",
    userMessage: "No pudimos conectar con el servidor. Puede estar en mantenimiento. Intenta de nuevo en un momento.",
  },

  // --- Errores de autenticacion ---
  LOGIN_FAILED: {
    code: "LOGIN_FAILED",
    severity: "warning",
    logMessage: "Las credenciales proporcionadas son incorrectas.",
    userMessage: "Correo o contrasena incorrectos. Revisa los datos e intenta nuevamente.",
  },
  LOGIN_NULL_RESPONSE: {
    code: "LOGIN_NULL_RESPONSE",
    severity: "error",
    logMessage: "El servidor retorno null para login.",
    userMessage: "No fue posible iniciar sesion. Verifica tus datos o intenta mas tarde.",
  },

  // --- Errores de registro ---
  SIGNUP_FAILED: {
    code: "SIGNUP_FAILED",
    severity: "error",
    logMessage: "El registro del usuario fallo en el servidor.",
    userMessage: "No se pudo completar el registro. Por favor, intenta de nuevo.",
  },
  SIGNUP_NULL_RESPONSE: {
    code: "SIGNUP_NULL_RESPONSE",
    severity: "error",
    logMessage: "El servidor retorno null para createUser.",
    userMessage: "El servidor no pudo crear tu cuenta en este momento. Intenta de nuevo mas tarde.",
  },
  SIGNUP_EMAIL_EXISTS: {
    code: "SIGNUP_EMAIL_EXISTS",
    severity: "warning",
    logMessage: "El correo ya esta registrado en el sistema.",
    userMessage: "Este correo ya esta registrado. Intenta iniciar sesion o usa otro correo.",
  },

  // --- Errores de validacion ---
  VALIDATION_EMPTY_FIELDS: {
    code: "VALIDATION_EMPTY_FIELDS",
    severity: "warning",
    logMessage: "Campos obligatorios vacios en el formulario.",
    userMessage: "Por favor, completa todos los campos obligatorios.",
  },
  VALIDATION_INVALID_EMAIL: {
    code: "VALIDATION_INVALID_EMAIL",
    severity: "warning",
    logMessage: "El formato del correo es invalido.",
    userMessage: "El correo ingresado no tiene un formato valido.",
  },
  VALIDATION_WEAK_PASSWORD: {
    code: "VALIDATION_WEAK_PASSWORD",
    severity: "warning",
    logMessage: "La contrasena no cumple con los requisitos minimos.",
    userMessage: "La contrasena debe tener al menos 6 caracteres.",
  },

  // --- Errores de GraphQL ---
  GRAPHQL_BAD_INPUT: {
    code: "GRAPHQL_BAD_INPUT",
    severity: "warning",
    logMessage: "Error de validacion en el input de GraphQL.",
    userMessage: "Los datos ingresados no son validos. Revisa los campos e intenta de nuevo.",
  },
  GRAPHQL_INTERNAL_ERROR: {
    code: "GRAPHQL_INTERNAL_ERROR",
    severity: "error",
    logMessage: "Error interno del servidor GraphQL.",
    userMessage: "Ocurrio un error en el servidor. Nuestro equipo ha sido notificado.",
  },

  // --- Error generico ---
  UNKNOWN_ERROR: {
    code: "UNKNOWN_ERROR",
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

/**
 * Determina el error apropiado basandose en el tipo de excepcion.
 */
export function resolveErrorFromException(exception) {
  if (!navigator.onLine) {
    return ERROR_CODES.NETWORK_OFFLINE;
  }

  if (exception?.networkError) {
    return ERROR_CODES.SERVER_UNREACHABLE;
  }

  if (exception?.graphQLErrors?.length > 0) {
    const firstError = exception.graphQLErrors[0];
    const extensionCode = firstError?.extensions?.code;

    if (extensionCode === "BAD_USER_INPUT") {
      return ERROR_CODES.GRAPHQL_BAD_INPUT;
    }

    return ERROR_CODES.GRAPHQL_INTERNAL_ERROR;
  }

  if (exception?.message?.includes("Failed to fetch")) {
    return ERROR_CODES.SERVER_UNREACHABLE;
  }

  return ERROR_CODES.UNKNOWN_ERROR;
}

/**
 * Valida los campos del formulario de registro.
 * Retorna null si todo es valido, o el error correspondiente.
 */
export function validateSignUpFields(nombre, apellido, correo, contrasena) {
  if (!nombre?.trim() || !apellido?.trim() || !correo?.trim() || !contrasena?.trim()) {
    return ERROR_CODES.VALIDATION_EMPTY_FIELDS;
  }

  if (!EMAIL_REGEX.test(correo)) {
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
  if (!correo?.trim() || !contrasena?.trim()) {
    return ERROR_CODES.VALIDATION_EMPTY_FIELDS;
  }

  if (!EMAIL_REGEX.test(correo)) {
    return ERROR_CODES.VALIDATION_INVALID_EMAIL;
  }

  return null;
}
