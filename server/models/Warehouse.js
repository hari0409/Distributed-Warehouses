const mongoose = require("mongoose");
const warehouseSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    name:{
      type:String,
      required:true,
    },
    rentees: {
      rid: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      type:Array,
      default:[]
    },
    totalUnits: {
      type: Number,
      default: 0,
    },
    availableUnits: {
      type: Number,
      default:0,
    },
    cost: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
module.exports=mongoose.model("Warehouse",warehouseSchema);