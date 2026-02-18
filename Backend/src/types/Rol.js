const {gql} = require("apollo-server-express")


const rolType = gql`

type Rol {
    _id: ID!
    nombre: String!
}

type Query {
    getRoles: [Rol]
}

`;

module.exports = {rolType}
