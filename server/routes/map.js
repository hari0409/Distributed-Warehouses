const ImageMap = require("../models/ImageMap");
const router = require("express").Router();

router.post("/upload", async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);
    const map = await new ImageMap(data);
    await map.save();
    res.status(200).json(map);
  } catch (error) {
    next(error);
  }
});

router.get("/:wId", async (req, res, next) => {
  try {
    const { wId } = req.params;
    const map = await ImageMap.findOne({ warehouseId: wId });
    res.status(200).json(map);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
