const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Producto = require("./Producto")
const user = require("./user")

const ventaSchema = new Schema({
    fechaVenta: {
        type: Date,
        required: true
    },
    totalVenta : {
        type: Number,
        required: true
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    productos: [{
        type: Schema.Types.ObjectId,
        ref: "producto"
    }],
})

module.exports = mongoose.model("venta", ventaSchema)