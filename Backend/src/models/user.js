const mongoose = require('mongoose')
const Schema = mongoose.Schema
const producto = require("./Producto")
const Rol = require("./Rol")

const UserSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    contrasena:{
        type: String,
        required: true
    },
    direccion:{
        type: String,
        required: false
    },
    Rol: { 
        type: Schema.Types.ObjectId,
        ref: "Rol" },
    
    avatar: {
        type: String,
        required: false,
        default: "fem-1"
    },
    carrito: [{
        type: Schema.Types.ObjectId,
        ref: "producto"
    }]
})

module.exports = mongoose.model("user", UserSchema)