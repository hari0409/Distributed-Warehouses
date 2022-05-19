const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const conn = require("../app");
const multer = require("multer");

//Base declaration
let gfs;
conn.once("open", () => {
  gfs = new Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

//Create Storage Engine
var storage = new GridFsStorage.GridFsStorage({
  url: process.env.MONGODB_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

//Store Image
const storeImage = async (req, res, next) => {
  try {
    res.status(201).json({
      file: req.file,
    });
  } catch (error) {
    next(error);
  }
};

const getImage = async (req, res, next) => {
  try {
    gfs.files.find().toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "No files exist",
        });
      } else {
        const file = files.filter((f) => {
          if (f._id.toString() === req.params.wId) {
            return f;
          }
        });
        const readStream = gfs.createReadStream(file[0].filename);
        readStream.pipe(res);
      }
    });
  } catch (error) {
    next(error);
  }
};

//Get image using warehouse Id
module.exports = {
  storeImage,
  getImage,
  upload,
};
