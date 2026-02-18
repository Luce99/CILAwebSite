const productoService = require("../services/Producto");

const productoResolvers = {
  Query: {
    getProductos: async () => {
      return productoService.getProductos();
    },
    getProductosById: async (parent, args) => {
      return productoService.getProductosById(args._id);
    },
    getProductosByCategory: async (parent, args) => {
      return productoService.getProductosByCategory(args.category);
    },
  },
  Mutation: {
    createProducto: async (parent, args) => {
      return productoService.createProducto(args);
    },
    updateProductos: async (parent, args) => {
      return productoService.updateProductos(args._id, args);
    },
    deleteProductos: async (parent, args) => {
      return productoService.deleteProductos(args._id);
    },
  },
};

module.exports = { productoResolvers };
