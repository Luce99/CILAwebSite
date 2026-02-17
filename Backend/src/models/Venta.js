const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { PAYMENT_STATUS } = require("../constants/paymentStatus");

const shippingAddressSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, default: "" },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const orderItemSchema = new Schema(
  {
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  { _id: false }
);

const ventaSchema = new Schema({
  fechaVenta: {
    type: Date,
    required: true,
    default: Date.now,
  },
  totalVenta: {
    type: Number,
    required: true,
  },
  cliente: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  productos: [
    {
      type: Schema.Types.ObjectId,
      ref: "producto",
    },
  ],
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  mercadopagoPaymentId: {
    type: String,
    default: null,
    index: true,
  },
  mercadopagoPreferenceId: {
    type: String,
    default: null,
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING,
  },
});

module.exports = mongoose.model("venta", ventaSchema);
