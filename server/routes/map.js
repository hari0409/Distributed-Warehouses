const { createMap, getMap } = require("../Controllers/map");
const router = require("express").Router();

//Create a map for a location
router.post("/upload", createMap);

//Get the respective map
router.get("/:wId", getMap);

module.exports = router;
