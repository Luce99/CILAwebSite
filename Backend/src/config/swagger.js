const swaggerJsdoc = require("swagger-jsdoc");

const SWAGGER_OPTIONS = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LIMO API",
      version: "1.0.0",
      description:
        "API de la tienda LIMO. Incluye endpoints REST para pagos y salud del servidor, " +
        "y un endpoint GraphQL para gestión de productos, usuarios, ventas y roles.",
      contact: {
        name: "Lucero Mojica",
      },
    },
    servers: [
      {
        url: "http://localhost:5010",
        description: "Servidor de desarrollo",
      },
      {
        url: "https://cilawebsite-backend.onrender.com",
        description: "Servidor de producción (Render)",
      },
    ],
    tags: [
      { name: "Health", description: "Estado del servidor y base de datos" },
      { name: "Payments", description: "Operaciones de pago con MercadoPago" },
      { name: "GraphQL", description: "Endpoint GraphQL para productos, usuarios, ventas y roles" },
    ],
  },
  apis: [
    "./src/docs/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(SWAGGER_OPTIONS);

module.exports = { swaggerSpec };
