const router = require("express").Router();
const Warehouse = require("../models/Warehouse");
const User = require("../models/User");

//Create Warehouse
router.post("/create", async (req, res, next) => {
  try {
    const data = req.body;
    const warehouse = await new Warehouse(data);
    await warehouse.save();
    const user = await User.findById(data.owner);
    await user.updateOne({ $push: { owned: user._id } });
    res.status(200).json(warehouse);
  } catch (error) {
    next(error);
  }
});

//Get Warehouse
router.get("/:id", async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    res.status(200).json(warehouse);
  } catch (error) {
    next(error);
  }
});

// Update Warehouse
router.put("/update/:id", async (req, res, next) => {
  try {
    const { ownerId, ...others } = req.body;
    const warehouse = await Warehouse.findById(req.params.id);
    if (warehouse) {
      if (warehouse.owner == ownerId) {
        await warehouse.updateOne(others);
        res.status(200).send("Updated successfully");
      } else {
        res.status(400).send("You are not authorized to update this warehouse");
      }
    } else {
      res.status(404).send("No warehouse found");
    }
  } catch (error) {
    next(error);
  }
});

//Kickout renter
router.put("/kickout", async (rq, res, next) => {
  try {
    const { warehouseId, renterId } = rq.body;
    const warehouse = await Warehouse.findById(warehouseId);
    if (warehouse) {
      if (warehouse.owner == renterId) {
        await warehouse.updateOne({ $pull: { rented: { lid: renterId } } });
        const user = await User.findById(renterId);
        await user.updateOne({ $pull: { rented: { lid: warehouseId } } });
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
        res.status(400).send("You are not authorized to kick out this renter");
      }
    } else {
      res.status(404).send("No warehouse found");
    }
  } catch (error) {
    next(error);
  }
});

//Delete Warehouse & update other users
router.delete("/:id", async (req, res, next) => {
  try {
    const { ownerId } = req.body;
    const warehouse = await Warehouse.findById(req.params.id);
    if (warehouse) {
      if (warehouse.owner == ownerId) {
        const tenents = warehouse.rentees;
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
        res.status(200).send("Will be deleted soon");
      } else {
        res.status(400).send("You are not authorized to delete this warehouse");
      }
    } else {
      res.status(404).send("No warehouse found");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
