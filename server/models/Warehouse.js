const mongoose = require("mongoose");
const warehouseSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
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
    airConditioner: {
      type:Boolean,
      default:false,
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
    locationTags: {
      type: [String],
      default: [],
    },
    address:{
      type:String,
      required:[true,"Please add an address"],
    },
    image:{
      data:Buffer,
      contentType:String
    }
  },
  { timestamps: true }
);
module.exports=mongoose.model("Warehouse",warehouseSchema);