const { gql } = require("apollo-server-express");

const ProductType = gql`
  scalar DateTime

  type Producto {
    _id: ID!
    name: String!
    productType: String!
    category: String!
    price: Float!
    image: String!
    images: [String]
    colors: [String]
    sizes: [String]
    description: String!
    quantity: Float!
    stock: Int!
  }

  type Query {
    getProductos: [Producto]
    getProductosById(_id: String!): Producto
    getProductosByCategory(category: String!): [Producto]
  }

  type Mutation {
    createProducto(
      name: String!
      productType: String!
      category: String!
      price: Float!
      image: String!
      images: [String]
      colors: [String]
      sizes: [String]
      description: String!
      quantity: Float
      stock: Int!
    ): Producto

    updateProductos(
      _id: ID!
      name: String
      productType: String
      category: String
      price: Float
      image: String
      images: [String]
      colors: [String]
      sizes: [String]
      description: String
      quantity: Float
      stock: Int
    ): Producto

    deleteProductos(
      _id: ID!
      name: String
      productType: String
      category: String
      price: Float
      image: String
      description: String
      quantity: Float
      stock: Int
    ): Producto
  }
`;

module.exports = { ProductType };
