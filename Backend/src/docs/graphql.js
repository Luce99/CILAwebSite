/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a1b2c3d4e5f6g7h8i9j0k1"
 *         name:
 *           type: string
 *           example: Blusa Clásica
 *         productType:
 *           type: string
 *           example: Blusa
 *         category:
 *           type: string
 *           enum: [Tops, Bottoms, Vestidos, Novedades]
 *           example: Tops
 *         price:
 *           type: number
 *           example: 22000
 *         image:
 *           type: string
 *           example: "/images/blusa.png"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["/images/blusa.png", "/images/blusa2.png"]
 *         colors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Blanco", "Negro", "Rosa"]
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["S", "M", "L"]
 *         description:
 *           type: string
 *           example: "Blusa versátil de corte clásico"
 *         quantity:
 *           type: number
 *           example: 1
 *         stock:
 *           type: integer
 *           example: 50
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a1b2c3d4e5f6g7h8i9j0k2"
 *         nombre:
 *           type: string
 *           example: Lucero
 *         apellido:
 *           type: string
 *           example: Mojica
 *         correo:
 *           type: string
 *           example: lucero@email.com
 *         direccion:
 *           type: string
 *           example: "Calle 123, Bogotá"
 *         genero:
 *           type: string
 *           enum: [masculino, femenino, prefiero_no_decir]
 *           example: femenino
 *         avatar:
 *           type: string
 *           example: "adventurer-1"
 *         Rol:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               example: cliente
 *     Venta:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         fechaVenta:
 *           type: string
 *           format: date-time
 *         totalVenta:
 *           type: number
 *           example: 44000
 *         cliente:
 *           type: string
 *         productos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Producto'
 *     Rol:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           enum: [cliente, administrador]
 *           example: cliente
 *     GraphQLQuery:
 *       type: object
 *       required:
 *         - query
 *       properties:
 *         query:
 *           type: string
 *           description: Query o Mutation en sintaxis GraphQL
 *         variables:
 *           type: object
 *           description: Variables para la operación
 */

/**
 * @swagger
 * /graphql:
 *   post:
 *     tags: [GraphQL]
 *     summary: Endpoint GraphQL
 *     description: |
 *       Endpoint único para todas las operaciones GraphQL de la API.
 *       Soporta queries y mutations para Productos, Usuarios, Ventas y Roles.
 *
 *       ## Queries disponibles
 *
 *       ### Productos
 *       - `getProductos` — Listar todos los productos
 *       - `getProductosById(_id: String!)` — Obtener producto por ID
 *       - `getProductosByCategory(category: String!)` — Filtrar productos por categoría (Tops, Bottoms, Vestidos, Novedades)
 *
 *       ### Usuarios
 *       - `getUsers` — Listar todos los usuarios
 *       - `getUserById(_id: String!)` — Obtener usuario por ID
 *
 *       ### Ventas
 *       - `getVenta` — Listar todas las ventas
 *       - `getVentaById(_id: String!)` — Obtener venta por ID
 *
 *       ### Roles
 *       - `getRoles` — Listar todos los roles
 *
 *       ## Mutations disponibles
 *
 *       ### Productos
 *       - `createProducto(...)` — Crear un producto
 *       - `updateProductos(_id: ID!, ...)` — Actualizar un producto
 *       - `deleteProductos(_id: ID!)` — Eliminar un producto
 *
 *       ### Usuarios
 *       - `createUser(nombre, apellido, correo, contrasena, ...)` — Registrar usuario
 *       - `login(correo, contrasena)` — Iniciar sesión
 *       - `updateUser(_id: ID!, ...)` — Actualizar usuario
 *       - `deleteUser(_id: ID!)` — Eliminar usuario
 *
 *       ### Ventas
 *       - `createVenta(fechaVenta, totalVenta, cliente, productos)` — Registrar venta
 *       - `updateVenta(_id, ...)` — Actualizar venta
 *       - `deleteVenta(_id)` — Eliminar venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GraphQLQuery'
 *           examples:
 *             getProductos:
 *               summary: Listar todos los productos
 *               value:
 *                 query: "{ getProductos { _id name price category image images colors sizes } }"
 *             getProductosByCategory:
 *               summary: Filtrar productos por categoría
 *               value:
 *                 query: "query ($category: String!) { getProductosByCategory(category: $category) { _id name price image } }"
 *                 variables:
 *                   category: "Tops"
 *             createUser:
 *               summary: Registrar usuario
 *               value:
 *                 query: "mutation ($nombre: String!, $apellido: String!, $correo: String!, $contrasena: String!) { createUser(nombre: $nombre, apellido: $apellido, correo: $correo, contrasena: $contrasena) { _id nombre correo } }"
 *                 variables:
 *                   nombre: "Ana"
 *                   apellido: "López"
 *                   correo: "ana@email.com"
 *                   contrasena: "secreto123"
 *             login:
 *               summary: Iniciar sesión
 *               value:
 *                 query: "mutation ($correo: String!, $contrasena: String!) { login(correo: $correo, contrasena: $contrasena) { _id nombre Rol { nombre } } }"
 *                 variables:
 *                   correo: "ana@email.com"
 *                   contrasena: "secreto123"
 *             getRoles:
 *               summary: Listar roles
 *               value:
 *                 query: "{ getRoles { nombre } }"
 *     responses:
 *       200:
 *         description: Respuesta GraphQL exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: Datos de la operación
 *                 errors:
 *                   type: array
 *                   description: Errores si los hubo
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                       locations:
 *                         type: array
 *                         items:
 *                           type: object
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 */
