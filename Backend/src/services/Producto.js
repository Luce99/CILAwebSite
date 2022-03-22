const Producto = require('../models/Producto')
// const userService = require('./user')
// const carritoService = require('./Project')
// const fechaHora = new Date();

createProducto = async(args) =>{
    let productosInstance = new Producto({
        // fechaAvance: fechaHora.getTime(),
        name: args.name,
        productType: args.productType,
        category: args.category,
        price: args.price,
        image: args.image,
        description: args.description,
        stock: args.stock,
        quantity: 1
    })
    created_producto = await productosInstance.save()
    // await userService.updateAvances(args['estudiante'], created_avances['_id'])
    // await projectService.updateAvances(args['projects'], created_avances['_id'])
    return created_producto
}

getProductos = async() => {
    let productos = await Producto.find({})
    return productos
}

getProductosById = async(productosId)=>{
    let productos = await Producto.findById(productosId).exec()
    return productos
}

deleteProductos = async(productosId, producto, callback)=>{
    let productosd = Producto.findByIdAndDelete(productosId, producto, callback, {new: true})
    return productosd
}

updateProductos = async(productosId, productos)=>{
    let newProducts = await Producto.findByIdAndUpdate(productosId, productos,{new:true})
    // await userService.updateAvances(avances['estudiante'], newAvances['_id'])
    // await projectService.updateAvances(avances['projects'], newAvances['_id'])
    return newProducts
}

updateVenta = async (productoId, ventaId) => {
    let producto = await Producto.findByIdAndUpdate(productoId, {
      $push: {
        venta: ventaId,
      },
    });
    return producto;
  };

module.exports = {
    createProducto,
    getProductos,
    getProductosById,
    deleteProductos,
    updateProductos,
    updateVenta
}