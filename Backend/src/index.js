const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const { resolvers } = require("./resolvers");
const { types } = require("./types");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = new ApolloServer({
  typeDefs: types,
  resolvers: resolvers,
});

const Rol = require("./models/Rol");

function initial() {
  Rol.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Rol({
        nombre: "cliente",
      }).save(async (err, liderRol) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'cliente' to roles collection");
      });

      new Rol({
        nombre: "administrador",
      }).save(async(err, administradorRol) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'administrador' to roles collection");
      });
    }
  });
}

mongoose.connect(
  "mongodb+srv://proyecto:proyectoCADEL@cluster0.6zaxb.mongodb.net/cila",
  async () => {
    initial();

    app.listen(5010, async () => {
      await server.start();
      server.applyMiddleware({ app });
      console.log("servidor inicializado en puerto 5010");
    });
  }
);