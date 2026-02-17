const {gql} = require("apollo-server-express")
const VentaType = gql`

scalar DateTime

type User{
    _id: ID!
    nombre: String!
    apellido: String!
    correo: String!
    contrasena: String!
    direccion: String!
    Rol: Rol!
    carrito: [Producto!]
    
}
type Producto {
    _id: ID!
    name: String!
    productType: String!
    category: String!
    price: Float!
    image: String!
    description: String!
    quantity: Float!
    stock: Int!
}
type Venta {
    _id: String!
    fechaVenta: DateTime!
    totalVenta: Float!
    cliente: ID!
    productos: [Producto!]
}
type Query {
    getVenta: [Venta]
    getVentaById(_id:String!):Venta
}
type Mutation {
createVenta(
    fechaVenta: DateTime!
    totalVenta: Float!
    cliente: ID!
    productos: [ID!]
    ): Venta
updateVenta (
    _id: String!
    fechaVenta: DateTime
    totalVenta: Float
    cliente: ID
    productos: [ID]
    ): Venta
deleteVenta (
    _id: String!
    fechaVenta: DateTime
    totalVenta: Float
    cliente: ID
    productos: [ID]
    ): Venta
}
`;

module.exports = {VentaType}
