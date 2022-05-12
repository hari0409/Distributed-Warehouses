const mongoose = require("mongoose");

const RentedSchema = new mongoose.Schema({
  lid: {
    type: mongoose.Schema.Types.ObjectId,
  },
  quantity: {
    type: Number,
  },
  name: {
    type: String,
  },
  cid: {
    type: String,
  },
});

const ActivitySchema = new mongoose.Schema({
  lid: {
    type: String,
  },
  msg: {
    type: String,
  },
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      default: null,
      max: 20,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    owned: {
      type: Array,
      default: [],
    },
    rented: {
      type: [RentedSchema],
    },
    balance: {
      type: Number,
      default: 0,
    },
    dueAmount: {
      type: Number,
      default: 0,
    },
    paid: {
      type: Boolean,
      default: true,
    },
    updateFlags: {
      type: [ActivitySchema],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", UserSchema);
