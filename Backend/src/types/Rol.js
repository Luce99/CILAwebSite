const {gql} = require("apollo-server-express")


const rolType = gql`

type Rol {
    nombre: String!
}


type Query {
    getRoles: [Rol]
}

`;

module.exports = {rolType}
