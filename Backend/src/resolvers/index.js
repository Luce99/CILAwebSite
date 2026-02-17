const {ventaResolvers} = require('./Venta')
const {userResolvers} = require('./user')
const {productoResolvers} = require ('./Producto')
const {rolResolvers} = require ('./Rol')
const dateTime  = require('./datetime')

const resolvers = [productoResolvers, userResolvers, ventaResolvers, rolResolvers, dateTime]

module.exports = {resolvers}
