const router = require("express").Router();
const User = require("../models/User");
const Warehouse = require("../models/Warehouse");
const bcrypt = require("bcrypt");

// Create User
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

// Get User
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
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
        res.status(401).send("Please pay previous Dues..");
      }
    } else {
      res.status(401).send("Access Denied");
    }
  } catch (error) {
    next(error);
  }
});

//Login in User
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
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
    const { userId, landId } = req.body;
    const user = await User.findById(userId);
    const warehouse = await Warehouse.findById(landId);
    if (user.dueAmount == 0) {
      const landObj = { lid: warehouse._id, quantity: warehouse.totalUnits };
      const renteesObj = { rid: user._id, quantity: warehouse.totalUnits };
      await user.updateOne({
        $push: {
          rented: landObj,
        },
        $set: {
          paid: false,
          dueAmount: warehouse.totalUnits * warehouse.cost,
        },
      });
      await warehouse.updateOne({
        $push: {
          rentees: renteesObj,
        },
        $set: {
          availableUnits: 0,
        },
      });
      res.status(200).send("Rented successfully");
    } else {
      res.status(401).send("Please pay previous Dues..");
    }
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
      res.status(401).send("Please pay previous Dues..");
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

//Get leased Land & Warehouse:
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


module.exports = router;
