const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  lid: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  paymentId: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
  },
});
module.exports = mongoose.model("Order", OrderSchema);
