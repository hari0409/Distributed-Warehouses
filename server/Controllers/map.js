const ImageMap = require("../models/ImageMap");

//Create Map
const createMap = async (req, res, next) => {
  try {
    const data = req.body;
    const map = await new ImageMap(data);
    await map.save();
    res.status(200).json(map);
  } catch (error) {
    next(error);
  }
};

//Get Map
const getMap = async (req, res, next) => {
  try {
    const { wId } = req.params;
    const map = await ImageMap.findOne({ warehouseId: wId });
    res.status(200).json(map);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMap,
  createMap,
};
