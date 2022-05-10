const router = require("express").Router();
const User = require("../models/User");
const Warehouse = require("../models/Warehouse");
const bcrypt = require("bcrypt");

// Create User-->Done
router.post("/create", async (req, res, next) => {
  try {
    const data = req.body;
    const password = data.password;
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);
    data.password = hash;
    const user = new User(data);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// Get User-->Done
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

//Get Name alone for certain pages-->Done
router.get("/getname/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user.name);
  } catch (error) {
    next(error);
  }
});

//Rent warehouse & has to be updated
router.put("/rent/:id", async (req, res, next) => {
  try {
    if (req.params.id == req.body.userId) {
      // Required landId,userId,required
      const { landId, userId, required } = req.body;
      const user = await User.findById(userId);
      const warehouse = await Warehouse.findById(landId);
      if (warehouse.availableUnits >= required && required > 0) {
        const cid=+new Date();
        const landObj = {
          lid: warehouse._id,
          quantity: required,
          name: warehouse.name,
          cid:cid,
        };
        await user.updateOne(
          {
            $push: {
              rented: landObj,
            },
            $set: {
              paid: false,
              dueAmount: required * warehouse.cost + user.dueAmount,
            },
          },
          {
            new: true,
          }
        );
        const renteesObj = {
          rid: user._id,
          cid:cid,
          quantity: required,
        };
        await warehouse.updateOne({
          $push: {
            rentees: renteesObj,
          },
          $set: {
            availableUnits: warehouse.availableUnits - required,
          },
        });
        res.status(200).send("Rented successfully");
      } else {
        res.status(401).send("Quantity Unavailable Or Quantity is 0");
      }
    } else {
      res.status(401).send("Access Denied");
    }
  } catch (error) {
    next(error);
  }
});

//Login in User-->Done
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({
      email: email,
    });
    if (user) {
      const match = bcrypt.compareSync(password, user.password);
      if (match) {
        const userLogged = await User.findById(user._id, { password: 0 });
        res.status(200).json({ status: "Logged In", user: userLogged });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    } else {
      res.status(400).send({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
});

//Exit warehouse completely
router.put("/exit", async (req, res, next) => {
  try {
    const { userId, landId, quan,cid } = req.body;
    const user = await User.findById(userId);
    console.log(cid)
    const warehouse = await Warehouse.findById(landId);
    await user.updateOne({
      $pull: {
        rented: {
          cid: cid,
        },
      },
    });
    await warehouse.updateOne({
      $pull: {
        rentees: {
          cid:cid,
        },
      },
      $set: {
        availableUnits: warehouse.availableUnits + quan,
      },
    });
    res.status(200).send("You have successfully exited the warehouse");
  } catch (error) {
    next(error);
  }
});

//Remove only certain quantity
router.put("/update", async (req, res, next) => {
  try {
    const { userId, landId, required } = req.body;
    const user = await User.findById(userId);
    const warehouse = await Warehouse.findById(landId);
    if (user.dueAmount == 0 && warehouse.availableUnits >= required) {
      const landObj = { lid: warehouse._id, quantity: required };
      const renteesObj = { rid: user._id, quantity: required };
      await user.updateOne({
        $push: {
          rented: landObj,
        },
        $set: {
          paid: false,
          dueAmount: required * warehouse.cost,
        },
      });
      await warehouse.updateOne({
        $push: {
          rentees: renteesObj,
        },
        $set: {
          availableUnits: warehouse.totalUnits - required,
        },
      });
      res.status(200).send("Rented successfully");
    } else {
      res.status(401).send("Error with the quantity");
    }
  } catch (error) {
    next(error);
  }
});

//Update password of user
router.put("/update/:id", async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    if (userId == req.params.id) {
      const user = await User.findById(req.params.id);
      if (user) {
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(password, salt);
        await user.updateOne({
          $set: {
            password: hash,
          },
        });
        res.status(200).send("Password updated successfully");
      }
    }
  } catch (error) {
    next(error);
  }
});

//Get leased Land & Warehouse:-->Done
router.get("/getAll/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    let landIds = user.owned;
    res.status(200).json(landIds);
  } catch (error) {
    next(error);
  }
});

router.get("/getRented/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    let landIds = user.rented;
    res.status(200).json(landIds);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
