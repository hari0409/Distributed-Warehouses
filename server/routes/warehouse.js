const router = require("express").Router();
const Warehouse = require("../models/Warehouse");
const User = require("../models/User");
const ImageMap = require("../models/ImageMap");

//Create Warehouse-->Done
router.post(
  "/create",
  async (req, res, next) => {
    try {
      const data = req.body;
      console.log(data);
      const warehouse = await new Warehouse(data);
      await warehouse.save();
      const user = await User.findById(data.owner);
      await user.updateOne({ $push: { owned: warehouse._id } });
      res.status(200).json(warehouse);
    } catch (error) {
      next(error);
    }
  }
);

//Get Warehouse-->Done
router.get("/:id", async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    res.status(200).json(warehouse);
  } catch (error) {
    next(error);
  }
});

// Update Warehouse-->Done
router.put(
  "/update/:id",
  async (req, res, next) => {
    try {
      const { ownerId, ...others } = req.body;
      const warehouse = await Warehouse.findById(req.params.id);
      if (warehouse) {
        if (warehouse.owner == ownerId) {
          await warehouse.updateOne(others);
          res.status(200).send("Updated successfully");
        } else {
          res
            .status(400)
            .send("You are not authorized to update this warehouse");
        }
      } else {
        res.status(404).send("No warehouse found");
      }
    } catch (error) {
      next(error);
    }
  }
);

//Kickout renter-->Done
router.put("/kickout", async (rq, res, next) => {
  try {
    const { warehouseId, renterId, quantity,cid } = rq.body;
    console.log(cid);
    const warehouse = await Warehouse.findById(warehouseId);
    if (warehouse) {
      await warehouse.updateOne({
        $set: {
          availableUnits: warehouse.availableUnits + quantity,
        },
      });
      await warehouse.updateOne({ $pull: { rentees: { cid: cid } } });
      const user = await User.findById(renterId);
      await user.updateOne({ $pull: { rented: { cid:cid } } });
      await user.updateOne({
        $push: {
          updateFlags: {
            lid: warehouse._id,
            msg: "You have been kicked out of the warehouse",
          },
        },
      });
      res.status(200).send("Kicked out successfully");
    } else {
      res.status(404).send("No warehouse found");
    }
  } catch (error) {
    next(error);
  }
});

//Delete Warehouse & update other users-->Done
router.post("/delete/:id", async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (warehouse) {
      const tenents = warehouse.rentees;
      const owner = await User.findById(warehouse.owner);
      await ImageMap.deleteOne({
        warehouseId: warehouse._id,
      });
      await User.updateOne(
        {
          _id: owner._id,
        },
        {
          $pull: { owned: warehouse._id },
        }
      );
      tenents.map(async (t) => {
        const user = await User.findById(t.rid.toString());
        await user.updateOne({ $pull: { rented: { lid: warehouse._id } } });
        await user.updateOne({
          $push: {
            updateFlags: {
              lid: warehouse._id,
              msg: "You have been kicked out of the warehouse",
            },
          },
        });
      });
      await Warehouse.deleteOne({ _id: warehouse._id });
      res.status(200).send("Will be deleted soon");
    } else {
      2;
      res.status(404).send("No warehouse found");
    }
  } catch (error) {
    next(error);
  }
});

//Get warehouse in a given location-->Done
router.patch("/locations", async (req, res, next) => {
  try {
    const locations = req.body;
    console.log(locations);
    const ids = await Warehouse.find({ locationTags: { $in: locations } });
    res.status(200).json(ids);
  } catch (error) {
    next(error);
  }
});

router.get("/getname/:id", async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    res.status(200).json(warehouse.name);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
