const ventaService = require ("../services/Venta")

const ventaResolvers = {
    Query:{
        getVenta: async(parent, args)=> {
            let venta = ventaService.getVenta()
            return venta
        },
        getVentaById: async(parent, args)=>{
            let venta = ventaService.getVentaById(args._id)
            return venta
        }
    },
    Mutation:{
        createVenta: async (parent, args) =>{
            let venta = ventaService.createVenta(args)
            return venta
        },
        updateVenta: async (parent, args)=> {
            let venta = ventaService.updateVenta(args._id,args)
            return venta
        },
        deleteVenta: async(parent, args) =>{
            let ventaDelete = ventaService.deleteVenta(args._id, args)
            return ventaDelete
        }
    }
}

module.exports = { ventaResolvers}