const {gql} = require("apollo-server-express")


const userType = gql`
scalar DateTime

type User{
    _id: ID!
    nombre: String!
    apellido: String!
    correo: String!
    contrasena: String!
    direccion: String!
    genero: String
    avatar: String
    Rol: Rol!
    carrito: [Producto]
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
}

type Rol {
    _id: ID!
    nombre: String!
}

type Query {
    getUsers: [User]
    getUserById(_id:String!): User
}
type Mutation {
    createUser(
        nombre: String!
        apellido: String!
        correo: String!
        contrasena: String!
        direccion: String
        genero: String
        avatar: String
        Rol: ID
        ): User

    login(
        correo: String!, 
        contrasena: String!
        ): User
    updateUser(
        _id: ID!
        nombre: String
        apellido: String
        correo: String
        contrasena: String
        direccion: String
        genero: String
        avatar: String
        Rol: ID
        ): User
    deleteUser(
        _id: ID!
        nombre: String
        apellido: String
        correo: String
        contrasena: String
        direccion: String
        avatar: String
        Rol: ID
        ): User
}
`;

module.exports = {userType}
