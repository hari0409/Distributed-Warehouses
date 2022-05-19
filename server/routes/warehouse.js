const router = require("express").Router();
const Warehouse = require("../models/Warehouse");
const User = require("../models/User");
const ImageMap = require("../models/ImageMap");
const sendEmail = require("../lib/email");
const mongoose = require("mongoose");

//Create Warehouse-->Done
router.post("/create", async (req, res, next) => {
  try {
    const data = req.body;
    const warehouse = await new Warehouse(data);
    await warehouse.save();
    const user = await User.findById(data.owner);
    await user.updateOne({ $push: { owned: warehouse._id } });
    sendEmail(
      user.email,
      `Your warehouse has been created in the name of ${warehouse.name} with a cost of ${warehouse.cost}`,
      "Warehouse Created"
    );
    res.status(200).json(warehouse);
  } catch (error) {
    next(error);
  }
});

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
router.put("/update/:id", async (req, res, next) => {
  try {
    const { ownerId, ...others } = req.body;
    const warehouse = await Warehouse.findById(req.params.id);
    const email = await User.findById(ownerId, { email: 1 });
    if (warehouse) {
      if (warehouse.owner == ownerId) {
        await warehouse.updateOne(others);
        res.status(200).send("Updated successfully");
        sendEmail(
          email,
          `Your warehouse has been updated in the name of ${warehouse.name} with a cost of ${warehouse.cost}`,
          "Warehouse Updated"
        );
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

//Kickout renter-->Done
router.put("/kickout", async (rq, res, next) => {
  try {
    const { warehouseId, renterId, quantity, cid } = rq.body;
    const warehouse = await Warehouse.findById(warehouseId);
    if (warehouse) {
      await warehouse.updateOne({
        $set: {
          availableUnits: warehouse.availableUnits + quantity,
        },
      });
      await warehouse.updateOne({ $pull: { rentees: { cid: cid } } });
      const user = await User.findById(renterId);
      await user.updateOne({ $pull: { rented: { cid: cid } } });
      await user.updateOne({
        $push: {
          updateFlags: {
            lid: warehouse.name,
            msg: "You have been kicked out of the warehouse",
          },
        },
      });
      sendEmail(
        user.email,
        `You have been kicked out of the ${warehouse.name}`,
        "You have been kicked out-Warerent"
      );
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
              lid: warehouse.name,
              msg: "You have been kicked out of the warehouse",
            },
          },
        });
        sendEmail(
          user.email,
          `You have been kicked out of the ${warehouse.name} because the warehouse has been deleted from existance`,
          "You have been kicked out-Warerent"
        );
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
    const locations = req.body.locations;
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

//Get rentees by pagination
router.post("/getrentees", async (req, res, next) => {
  try {
    const { id, pgNo, limit } = req.body;
    const rentees = await Warehouse.findOne(
      { _id: mongoose.Types.ObjectId(id) },
      { rentees: { $slice: [limit * (pgNo - 1), limit] } }
    );
    res.status(200).json(rentees.rentees);
  } catch (error) {}
});

//Get length of rentees
router.get("/renteeslength/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const length = await Warehouse.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      { $unwind: "$rentees" },
      { $group: { _id: "$_id", length: { $sum: 1 } } },
    ]);
    res.status(200).json(length);
  } catch (error) {
    next(error);
  }
});

router.get("/allrentees/:id", async (req, res, next) => {
  try {
    const rentes = await Warehouse.findById(req.params.id, { rentees: 1 });
    res.status(200).json(rentes.rentees);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
