const Producto = require("../models/Producto");

const DEFAULT_QUANTITY = 1;

/** Crea un producto nuevo con todos sus campos incluyendo variaciones. */
async function createProducto(args) {
  const productosInstance = new Producto({
    name: args.name,
    productType: args.productType,
    category: args.category,
    price: args.price,
    image: args.image,
    images: args.images || [],
    colors: args.colors || [],
    sizes: args.sizes || [],
    description: args.description,
    stock: args.stock,
    quantity: DEFAULT_QUANTITY,
  });
  const createdProducto = await productosInstance.save();
  return createdProducto;
}

/** Retorna todos los productos. */
async function getProductos() {
  const productos = await Producto.find({});
  return productos;
}

/** Retorna un producto por su ID. */
async function getProductosById(productosId) {
  const productos = await Producto.findById(productosId).exec();
  return productos;
}

/** Retorna productos filtrados por categoria. */
async function getProductosByCategory(category) {
  const productos = await Producto.find({ category: category });
  return productos;
}

/** Elimina un producto por su ID. */
async function deleteProductos(productosId) {
  const productoEliminado = await Producto.findByIdAndDelete(productosId);
  return productoEliminado;
}

/** Actualiza un producto por su ID con los campos proporcionados. */
async function updateProductos(productosId, productos) {
  const newProducts = await Producto.findByIdAndUpdate(
    productosId,
    productos,
    { new: true }
  );
  return newProducts;
}

/** Agrega una referencia de venta al producto. */
async function updateVenta(productoId, ventaId) {
  const producto = await Producto.findByIdAndUpdate(productoId, {
    $push: {
      venta: ventaId,
    },
  });
  return producto;
}

module.exports = {
  createProducto,
  getProductos,
  getProductosById,
  getProductosByCategory,
  deleteProductos,
  updateProductos,
  updateVenta,
};
