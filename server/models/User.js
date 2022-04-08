const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    name:{
      type:String,
      required:true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 3,
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
      lid: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      type:Array
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
    updateFlags:{
      type:Array,
      default:[],
      lid:{
        type:mongoose.SchemaTypes.ObjectId,
      }
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", UserSchema);