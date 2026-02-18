require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const { resolvers } = require("./src/resolvers");
const { types } = require("./src/types");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./src/config/swagger");
const paymentRoutes = require("./src/routes/paymentRoutes");
const Rol = require("./src/models/Rol");

const app = express();
const PORT = process.env.PORT || 5010;
const MONGODB_URI = process.env.MONGODB_URI;

const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  bufferCommands: true,
};

const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/payments", paymentRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.get("/health", (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const DB_STATES = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  const status = DB_STATES[dbState] || "unknown";
  const isHealthy = dbState === 1;
  const statusCode = isHealthy ? 200 : 503;
  res.status(statusCode).json({ status, database: status });
});

const server = new ApolloServer({
  typeDefs: types,
  resolvers: resolvers,
});

function createInitialRoles() {
  Rol.estimatedDocumentCount()
    .then((count) => {
      if (count > 0) {
        return;
      }
      const rolesToCreate = ["cliente", "administrador"];
      const savePromises = rolesToCreate.map((roleName) =>
        new Rol({ nombre: roleName })
          .save()
          .then(() => console.log(`Rol '${roleName}' agregado a la coleccion`))
          .catch((saveErr) => console.log(`Error creando rol '${roleName}':`, saveErr))
      );
      return Promise.all(savePromises);
    })
    .catch((err) => console.log("Error verificando roles:", err));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectToMongoDB() {
  for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
    try {
      console.log(`[MongoDB] Intento de conexion ${attempt}/${MAX_RETRY_ATTEMPTS}...`);
      await mongoose.connect(MONGODB_URI, MONGO_OPTIONS);
      console.log("[MongoDB] Conexion exitosa.");
      createInitialRoles();
      return;
    } catch (err) {
      console.error(`[MongoDB] Error en intento ${attempt}:`, err.message);
      const isLastAttempt = attempt === MAX_RETRY_ATTEMPTS;
      if (isLastAttempt) {
        console.error("[MongoDB] Se agotaron los intentos de conexion. El servidor seguira activo pero sin base de datos.");
        return;
      }
      console.log(`[MongoDB] Reintentando en ${RETRY_DELAY_MS / 1000}s...`);
      await sleep(RETRY_DELAY_MS);
    }
  }
}

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
    console.log(`GraphQL disponible en http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`Swagger UI disponible en http://localhost:${PORT}/api-docs`);
  });

  connectToMongoDB();
}

mongoose.connection.on("error", (err) => {
  console.error("[MongoDB] Error de conexion:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("[MongoDB] Desconectado. Intentando reconectar...");
});

mongoose.connection.on("reconnected", () => {
  console.log("[MongoDB] Reconexion exitosa.");
});

startServer();
