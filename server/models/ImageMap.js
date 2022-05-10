const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  fileId: {
    type: String,
    required: true,
  },
  warehouseId: {
    type: String,
    required: true,
  },
});

module.exports=mongoose.model("ImgSchema",imageSchema);