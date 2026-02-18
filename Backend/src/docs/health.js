/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Estado del servidor
 *     description: Retorna el estado del servidor y la conexión a MongoDB.
 *     responses:
 *       200:
 *         description: Servidor y base de datos saludables
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: connected
 *                 database:
 *                   type: string
 *                   example: connected
 *       503:
 *         description: Base de datos no disponible
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: disconnected
 *                 database:
 *                   type: string
 *                   example: disconnected
 */
