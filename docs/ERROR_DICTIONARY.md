# Diccionario de Errores - CILA E-commerce

Este documento describe todos los codigos de error utilizados en la aplicacion, su significado tecnico y el mensaje que se le muestra al usuario final.

---

## Estructura de un Error

Cada error esta definido con las siguientes propiedades:

| Propiedad      | Tipo     | Descripcion                                                    |
|----------------|----------|----------------------------------------------------------------|
| `code`         | `string` | Identificador interno del error (para logs y desarrolladores). |
| `displayCode`  | `string` | Codigo corto alfanumerico que se muestra al usuario.           |
| `severity`     | `string` | Nivel: `error`, `warning`, `info`.                             |
| `logMessage`   | `string` | Mensaje tecnico para consola/logs del desarrollador.           |
| `userMessage`  | `string` | Mensaje amigable que se muestra al usuario en el modal.        |

---

## Convenciones de Codigos de Usuario

Los codigos que ve el usuario siguen el formato `XXX_NN` donde:

| Prefijo | Categoria         | Rango   |
|---------|--------------------|---------|
| `NET`   | Red / Conectividad | NET_01+ |
| `AUT`   | Autenticacion      | AUT_01+ |
| `REG`   | Registro           | REG_01+ |
| `VAL`   | Validacion         | VAL_01+ |
| `SRV`   | Servidor           | SRV_01+ |
| `GEN`   | General            | GEN_01+ |

---

## Niveles de Severidad

| Nivel     | Color     | Icono    | Descripcion                                          |
|-----------|-----------|----------|------------------------------------------------------|
| `error`   | Rojo      | Error    | Errores criticos que impiden completar la accion.    |
| `warning` | Naranja   | Warning  | Problemas que requieren atencion pero no son fatales.|
| `info`    | Azul      | Info     | Mensajes informativos para el usuario.               |

---

## Errores de Red (NET)

### NET_01 — `NETWORK_OFFLINE`
- **Severidad:** error
- **Causa tecnica:** El navegador no tiene conexion a internet (`navigator.onLine === false`).
- **Mensaje al usuario:** "Parece que no tienes conexion a internet. Verifica tu red e intenta de nuevo."
- **Accion recomendada:** El usuario debe verificar su conexion Wi-Fi o datos moviles.

### NET_02 — `NETWORK_TIMEOUT`
- **Severidad:** error
- **Causa tecnica:** La solicitud HTTP al servidor backend excedio el tiempo limite configurado.
- **Mensaje al usuario:** "El servidor esta tardando en responder. Por favor, intenta de nuevo en unos segundos."
- **Accion recomendada:** Esperar unos segundos y reintentar. Si persiste, puede ser un problema del servidor.

### NET_03 — `SERVER_UNREACHABLE`
- **Severidad:** error
- **Causa tecnica:** No se pudo establecer conexion con el servidor backend. Puede ocurrir por: el servidor esta caido, la URL esta mal configurada, problemas de CORS, o el servidor esta "dormido" en Render.com (free tier).
- **Mensaje al usuario:** "No pudimos conectar con el servidor. Puede estar en mantenimiento. Intenta de nuevo en un momento."
- **Accion recomendada:** Verificar que el backend este corriendo. En Render free tier, el primer request tras inactividad puede tardar ~30 seg.

---

## Errores de Autenticacion (AUT)

### AUT_01 — `LOGIN_FAILED`
- **Severidad:** warning
- **Causa tecnica:** Las credenciales proporcionadas (correo/contrasena) no coinciden con ningun usuario registrado.
- **Mensaje al usuario:** "Correo o contrasena incorrectos. Revisa los datos e intenta nuevamente."
- **Accion recomendada:** El usuario debe verificar que el correo y la contrasena sean correctos.

### AUT_02 — `LOGIN_NULL_RESPONSE`
- **Severidad:** error
- **Causa tecnica:** La mutacion `login` de GraphQL retorno `null`. Esto puede indicar que el resolver del backend no encontro al usuario o hubo un error silencioso.
- **Mensaje al usuario:** "No fue posible iniciar sesion. Verifica tus datos o intenta mas tarde."
- **Accion recomendada (dev):** Revisar los logs del backend. Verificar que el resolver `login` maneje correctamente todos los casos.

### AUT_03 — `LOGIN_USER_NOT_FOUND`
- **Severidad:** warning
- **Causa tecnica:** El backend respondio que no existe un usuario registrado con el correo proporcionado. El mensaje original del backend contiene "no existe".
- **Mensaje al usuario:** "No encontramos una cuenta con ese correo. Verifica que sea correcto o registrate."
- **Accion recomendada:** El usuario debe verificar el correo o crear una cuenta nueva.

### AUT_04 — `LOGIN_WRONG_PASSWORD`
- **Severidad:** warning
- **Causa tecnica:** El backend respondio que la contrasena es incorrecta. El mensaje original del backend contiene "incorrecta".
- **Mensaje al usuario:** "La contrasena es incorrecta. Revisa e intenta de nuevo."
- **Accion recomendada:** El usuario debe revisar la contrasena ingresada.

---

## Errores de Registro (REG)

### REG_01 — `SIGNUP_FAILED`
- **Severidad:** error
- **Causa tecnica:** La mutacion `createUser` fallo por una razon no especificada.
- **Mensaje al usuario:** "No se pudo completar el registro. Por favor, intenta de nuevo."
- **Accion recomendada (dev):** Revisar los logs del backend para identificar la causa del fallo.

### REG_02 — `SIGNUP_NULL_RESPONSE`
- **Severidad:** error
- **Causa tecnica:** La mutacion `createUser` retorno `null`. El backend no creo el usuario pero tampoco retorno un error GraphQL explicito.
- **Mensaje al usuario:** "El servidor no pudo crear tu cuenta en este momento. Intenta de nuevo mas tarde."
- **Posibles causas:**
  - El esquema de base de datos tiene restricciones que fallaron silenciosamente.
  - El Rol por defecto no existe en la coleccion `roles`.
  - La conexion a MongoDB fallo internamente.
- **Accion recomendada (dev):** Revisar el servicio `createUser` en el backend. Agregar logs y retornar errores explicitos en lugar de `null`.

### REG_03 — `SIGNUP_EMAIL_EXISTS`
- **Severidad:** warning
- **Causa tecnica:** Se intento registrar un correo que ya existe en la base de datos.
- **Mensaje al usuario:** "Este correo ya esta registrado. Intenta iniciar sesion o usa otro correo."
- **Accion recomendada:** El usuario debe usar un correo diferente o recuperar su contrasena.

---

## Errores de Validacion (VAL)

### VAL_01 — `VALIDATION_EMPTY_FIELDS`
- **Severidad:** warning
- **Causa tecnica:** Uno o mas campos obligatorios estan vacios al momento de enviar el formulario.
- **Mensaje al usuario:** "Por favor, completa todos los campos obligatorios."
- **Accion recomendada:** Completar los campos faltantes.

### VAL_02 — `VALIDATION_INVALID_EMAIL`
- **Severidad:** warning
- **Causa tecnica:** El formato del correo electronico no pasa la validacion regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
- **Mensaje al usuario:** "El correo ingresado no tiene un formato valido."
- **Accion recomendada:** Verificar que el correo tenga el formato correcto (ej: usuario@dominio.com).

### VAL_03 — `VALIDATION_WEAK_PASSWORD`
- **Severidad:** warning
- **Causa tecnica:** La contrasena tiene menos de 6 caracteres.
- **Mensaje al usuario:** "La contrasena debe tener al menos 6 caracteres."
- **Accion recomendada:** Ingresar una contrasena mas larga.

---

## Errores de Servidor (SRV)

### SRV_01 — `GRAPHQL_BAD_INPUT`
- **Severidad:** warning
- **Causa tecnica:** El servidor GraphQL retorno un error con codigo de extension `BAD_USER_INPUT`. Los datos enviados no cumplen con las validaciones del esquema.
- **Mensaje al usuario:** "Los datos ingresados no son validos. Revisa los campos e intenta de nuevo."
- **Accion recomendada:** Verificar que los datos del formulario cumplan con los requisitos del backend.

### SRV_02 — `GRAPHQL_INTERNAL_ERROR`
- **Severidad:** error
- **Causa tecnica:** El servidor GraphQL retorno un error interno (no `BAD_USER_INPUT`). Puede ser un fallo en el resolver, una excepcion no manejada, o un problema de base de datos.
- **Mensaje al usuario:** "Ocurrio un error en el servidor. Nuestro equipo ha sido notificado."
- **Accion recomendada (dev):** Revisar los logs del servidor inmediatamente. Agregar manejo de errores adecuado en los resolvers.

---

## Error Generico (GEN)

### GEN_01 — `UNKNOWN_ERROR`
- **Severidad:** error
- **Causa tecnica:** Error no categorizado. Ocurre cuando la excepcion no coincide con ninguno de los patrones conocidos.
- **Mensaje al usuario:** "Ocurrio un error inesperado. Por favor, intenta de nuevo."
- **Accion recomendada (dev):** Revisar la consola del navegador para obtener detalles del error. Considerar agregar un nuevo codigo de error si el patron se repite.

---

## Como Agregar un Nuevo Codigo de Error

1. Agregar la entrada en `src/constants/errorCodes.js` dentro del objeto `ERROR_CODES`.
2. Asignar un `displayCode` siguiendo la convencion `XXX_NN` segun la categoria.
3. Documentar el nuevo codigo en este archivo siguiendo el formato existente.
4. Si es necesario, actualizar `resolveErrorFromException()` para detectar el nuevo tipo de error automaticamente.
5. Usar `showError(ERROR_CODES.NUEVO_CODIGO)` en el componente correspondiente.

---

## Archivo fuente

Los codigos de error estan definidos en: `src/constants/errorCodes.js`

El componente modal esta en: `src/Components/ErrorModal.js`

El hook para gestionar el modal esta en: `src/hooks/useErrorModal.js`
