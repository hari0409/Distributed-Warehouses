const mongoose = require("mongoose");

const RenteeSchema = new mongoose.Schema({
  rid: {
    type: mongoose.Schema.Types.ObjectId,
  },
  quantity: {
    type: Number,
  },
  cid:{
    type:Number,
  }
});

const warehouseSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rentees: {
      type: [RenteeSchema],
    },
    airConditioner: {
      type: Boolean,
      default: false,
    },
    totalUnits: {
      type: Number,
      default: 0,
    },
    availableUnits: {
      type: Number,
      default: 0,
    },
    cost: {
      type: Number,
      default: 0,
    },
    locationTags: {
      type: [String],
      default: [],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    desc: {
      type: String,
      default: null,
    },
    file: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Warehouse", warehouseSchema);
