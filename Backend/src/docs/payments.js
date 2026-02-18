/**
 * @swagger
 * components:
 *   schemas:
 *     PreferenceRequest:
 *       type: object
 *       required:
 *         - items
 *         - buyerEmail
 *       properties:
 *         items:
 *           type: array
 *           description: Lista de productos del carrito
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Blusa Clásica
 *               unit_price:
 *                 type: number
 *                 example: 22000
 *               quantity:
 *                 type: integer
 *                 example: 2
 *         shippingAddress:
 *           type: object
 *           description: Dirección de envío (opcional)
 *           properties:
 *             street:
 *               type: string
 *               example: Calle 123
 *             city:
 *               type: string
 *               example: Bogotá
 *         buyerEmail:
 *           type: string
 *           example: comprador@email.com
 *     PreferenceResponse:
 *       type: object
 *       properties:
 *         preferenceId:
 *           type: string
 *           example: "123456789-abcdef"
 *         initPoint:
 *           type: string
 *           example: "https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=123"
 *         sandboxInitPoint:
 *           type: string
 *           example: "https://sandbox.mercadopago.com.co/checkout/v1/redirect?pref_id=123"
 *     PaymentStatus:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "12345678"
 *         status:
 *           type: string
 *           enum: [approved, pending, rejected, in_process]
 *           example: approved
 *         status_detail:
 *           type: string
 *           example: accredited
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: No se pudo crear la preferencia de pago
 */

/**
 * @swagger
 * /api/payments/create-preference:
 *   post:
 *     tags: [Payments]
 *     summary: Crear preferencia de pago
 *     description: Crea una preferencia de pago en MercadoPago para iniciar el checkout.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PreferenceRequest'
 *     responses:
 *       200:
 *         description: Preferencia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PreferenceResponse'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     tags: [Payments]
 *     summary: Webhook de MercadoPago
 *     description: Recibe notificaciones de MercadoPago cuando cambia el estado de un pago.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: payment
 *               data:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "12345678"
 *     responses:
 *       200:
 *         description: Notificación recibida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: paymentId no proporcionado
 *       500:
 *         description: Error procesando notificación
 */

/**
 * @swagger
 * /api/payments/status/{paymentId}:
 *   get:
 *     tags: [Payments]
 *     summary: Consultar estado de pago
 *     description: Consulta el estado de un pago en MercadoPago por su ID.
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago en MercadoPago
 *         example: "12345678"
 *     responses:
 *       200:
 *         description: Información del pago
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentStatus'
 *       400:
 *         description: paymentId es requerido
 *       500:
 *         description: Error consultando estado del pago
 */
