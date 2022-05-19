const router = require("express").Router();

const { getImage, storeImage, upload } = require("../Controllers/image");

//Create an image in upload collection
router.post("/upload", upload.single("file"), storeImage);

//Get the respective image
router.get("/:wId", getImage);

module.exports = router;