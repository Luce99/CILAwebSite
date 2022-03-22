const Venta = require("../models/Venta")
const userService = require('./user')
const productService = require('./Producto')
const fechaHora = new Date();

createVenta = async(args) =>{
    let ventaInstance = new Venta({
        fechaVenta: fechaHora.getTime(),
        totalVenta: args.totalVenta,
        cliente: args.cliente,
        productos: args.productos,
    })
    created_venta = await ventaInstance.save()
    await userService.updateVenta(args['cliente'], created_venta['_id'])
    await productService.updateVenta(args['productos'], created_venta['_id'])
    return created_venta
}

getVenta = async() => {
    let venta = await Venta.find({}).populate("productos")
    return venta
}

getVentaById = async(ventaId)=>{
    let venta = await Venta.findById(ventaId).populate("productos")
    return venta
}

deleteVenta = async(ventaId, venta, callback)=>{
    let ventad = Venta.findByIdAndDelete(ventaId, venta, callback, {new: true})
    return ventad
}

updateVenta = async(ventaId, args)=>{
    let newVenta = await Venta.findByIdAndUpdate(ventaId, args,{new:true})
    await userService.updateVenta(args['cliente'], newVenta['_id'])
    await productService.updateVenta(args['productos'], newVenta['_id'])
    return newVenta
}

module.exports = {
    createVenta,
    getVenta,
    getVentaById,
    deleteVenta,
    updateVenta
}