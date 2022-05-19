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
  uid: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
});

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
  paymentId: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
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
    phoneNumber: {
      type: Number,
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
    updateFlags: {
      type: [ActivitySchema],
    },
    deleteToken: {
      type: String,
      default: null,
    },
    unblockToken: {
      type: String,
      default: null,
    },
    pin: {
      type: String,
      default: null,
    },
    pinAttempts: {
      type: Number,
      default: 0,
    },
    blocked: {
      type: Boolean,
      default: true,
    },
    orders: {
      type: [OrderSchema],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", UserSchema);
