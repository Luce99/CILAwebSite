const productoService = require ("../services/Producto")
const productoResolvers = {

    Query:{
        getProductos: async(parent, args)=> {
            let producto = productoService.getProductos()
            return producto
        },
        getProductosById: async(parent, args)=>{
            let producto = productoService.getProductosById(args._id)
            return producto
        }
    },
    Mutation:{
        createProducto: async (parent, args) =>{
            let productos = productoService.createProducto(args)
            return productos
        },
        updateProductos: async (parent, args)=> {
            let productos = productoService.updateProductos(args._id,args)
            return productos
        },
        deleteProductos: async(parent, args) =>{
            let productoDelete = productoService.deleteProductos(args._id, args)
            return productoDelete
        }
    }
}

module.exports = { productoResolvers}