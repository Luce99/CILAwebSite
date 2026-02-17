require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const { resolvers } = require("./src/resolvers");
const { types } = require("./src/types");
const cors = require("cors");
const paymentRoutes = require("./src/routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 5010;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.use("/api/payments", paymentRoutes);

const server = new ApolloServer({
  typeDefs: types,
  resolvers: resolvers,
});

const Rol = require("./src/models/Rol");

function createInitialRoles() {
  Rol.estimatedDocumentCount((err, count) => {
    if (err || count > 0) {
      return;
    }

    const rolesToCreate = ["cliente", "administrador"];

    rolesToCreate.forEach((roleName) => {
      new Rol({ nombre: roleName }).save((saveErr) => {
        if (saveErr) {
          console.log(`Error creando rol '${roleName}':`, saveErr);
          return;
        }
        console.log(`Rol '${roleName}' agregado a la coleccion`);
      });
    });
  });
}

mongoose.connect(MONGODB_URI, async () => {
  createInitialRoles();

  app.listen(PORT, async () => {
    await server.start();
    server.applyMiddleware({ app });
    console.log(`Servidor iniciado en el puerto ${PORT}`);
  });
});
