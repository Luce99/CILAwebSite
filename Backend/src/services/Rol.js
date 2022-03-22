const Rol = require('../models/Rol')

getRoles = async() => {
    let roles = await Rol.find({})
    return roles
}

module.exports = {
    getRoles
   
}