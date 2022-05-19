const router = require("express").Router();
const User = require("../models/User");
const Warehouse = require("../models/Warehouse");
const bcrypt = require("bcrypt");
const sendEmail = require("../lib/email");
const crypto = require("crypto");
const Temp = require("../models/Temp");
const Order = require("../models/Order");
const Razorpay = require("razorpay");
const ImageMap = require("../models/ImageMap");
const mongoose = require("mongoose");

// Create User-->Done
router.post("/create", async (req, res, next) => {
  try {
    const data = req.body;
    const password = data.password;
    let pin = data.pin;
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);
    let hasedPin = await bcrypt.hashSync(pin, salt);
    let user = await User.findOne({ email: data.email });
    const temp = await Temp.findOne({ email: data.email });
    if ((temp.token = data.token)) {
      user.password = hash;
      user.phoneNumber = data.phone;
      user.pin = hasedPin;
      await user.save();
      sendEmail(
        user.email,
        `Welcome to the Warehouse Management System.\nThanks for creating an account with us.\nYour login details are as follows:\nUsername: ${user.email}\nPassword: as-you-have-given`,
        "Welcome to Warehouse Management System"
      );
      await Temp.deleteOne({ email: data.email });
      res.status(200).json(user);
    } else {
      res.status(400).send("Invalid Token");
    }
  } catch (error) {
    console.log(error);
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
        const cid = +new Date();
        const landObj = {
          lid: warehouse._id,
          quantity: required,
          name: warehouse.name,
          cid: cid.toString(),
          createdAt: Date.now(),
        };
        await user.updateOne({
          $push: {
            rented: landObj,
          },
        });
        const renteesObj = {
          rid: user._id,
          cid: cid,
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
        sendEmail(
          user.email,
          `Your rent is confirmed for ${warehouse.name} for ${required} tonnes. Your rent id is ${cid}`,
          "Rent Confirmed"
        );
        res.status(200).send("Rented successfully");
      } else {
        res.status(401).send("Quantity Unavailable Or Quantity is 0");
      }
    } else {
      res.status(401).send("Access Denied");
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
});

//Login in User-->Done
router.post("/login", async (req, res, next) => {
  try {
    const { email, password, ip, bName, bVersion, os, osV } = req.body;
    const user = await User.findOne({
      email: email,
    });
    if (user) {
      const match = bcrypt.compareSync(password, user.password);
      if (match) {
        const userLogged = await User.findById(user._id, {
          password: 0,
          deleteToken: 0,
          phoneNumber: 0,
          pin: 0,
          blocked: 0,
          invalidPinFlags: 0,
        });
        res.status(200).json({ status: "Logged In", user: userLogged });
        sendEmail(
          user.email,
          `You have been logged into the system from the IP ${ip}\nBrowser: ${bName} Version:${bVersion} from ${os} ${osV}\nIf you have not done this please change your password.`,
          "Welcome to Warerent"
        );
      } else {
        res.status(401).json({
          message: "Invalid Credentials or Your email is not verified",
        });
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
    const { userId, landId, quan, cid } = req.body;
    const user = await User.findById(userId);
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
          cid: cid,
        },
      },
      $set: {
        availableUnits: warehouse.availableUnits + quan,
      },
    });
    sendEmail(
      user.email,
      `You have exited the ${warehouse.name} thus reducing the your available storage by ${quan} tones`,
      "Warerent"
    );
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
    console.log(error);
  }
});

//Update password of user
router.post("/update/:id", async (req, res, next) => {
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
        res.status(200).json({ msg: "Updated" });
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

router.get("/getRecent/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const recent = await User.findById(id, { updateFlags: 1, _id: 0 });
    res.status(200).json(recent);
  } catch (error) {
    next(error);
  }
});

router.post("/dismiss", async (req, res, next) => {
  try {
    const { userId, nid } = req.body;
    await User.updateOne(
      { _id: userId },
      { $pull: { updateFlags: { _id: nid } } }
    );
    res.status(200).send("Dismissed");
  } catch (error) {
    next(error);
  }
});

router.post("/verify", async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(401).json({ msg: "User already exists" });
    } else {
      const tempAct = await Temp.findOne({ email: email });
      const token = await crypto.randomBytes(50).toString("hex");
      if (tempAct) {
        await Temp.updateOne({ email: email }, { $set: { token: token } });
      } else {
        const user = new Temp({
          email: email,
          name: name,
          token: token,
        });
        await user.save();
      }
      let url = `http://localhost:3000/verify?token=${token}&email=${email}`;
      sendEmail(
        email,
        `Please click on the link to verify your account \n URL: ${url}`,
        "Verify your Email"
      );
      res.status(200).json({ msg: "Success" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/verification", async (req, res, next) => {
  try {
    const { email, token } = req.body;
    let tokenReceived = await Temp.findOne({ email: email }, { token: 1 });
    if (token === tokenReceived.token) {
      const user = new User({
        email: email,
        name: await Temp.findOne({ email: email }, { name: 1 }).then(
          (res) => res.name
        ),
      });
      await user.save();
      res.status(200).json({ msg: "Verified" });
    } else {
      res.status(401).json({ msg: "Invalid Token" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/initdelete/:id", async (req, res, next) => {
  try {
    const { uid, email } = req.body;
    const token = await crypto.randomBytes(50).toString("hex");
    sendEmail(
      email,
      `Please click on the link to confirm the deletion of your account with WareRent. URL: http://localhost:3000/delete?token=${token}&uid=${uid}`,
      "WareRent-Delete your account"
    );
    await User.updateOne({ email: email }, { $set: { deleteToken: token } });
    const user = await User.find({ email: email });
    res.status(200).json({ msg: "Success" });
  } catch (error) {
    next(error);
  }
});

router.post("/deleteconfirm", async (req, res, next) => {
  try {
    const { uid, token } = req.body;
    const user = await User.findById(uid);
    if (user) {
      if (user.deleteToken === token) {
        let warehouses = await User.findById(uid);
        warehouses = warehouses.owned;
        if (warehouses.length > 0) {
          warehouses.map(async (w) => {
            const warehouse = await Warehouse.findById(w);
            const tenents = warehouse.rentees;
            await ImageMap.deleteOne({
              warehouseId: w,
            });
            tenents.map(async (t) => {
              const user = await User.findById(t.rid.toString());
              await user.updateOne({
                $pull: {
                  rented: { lid: warehouse._id },
                },
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
          });
          console.log("Warehouses deleted successfully");
        }
        await User.deleteOne({ _id: uid });
        res.status(200).json({ msg: "Deleted" });
      } else {
        res.status(401).json({ msg: "Invalid Token" });
      }
    } else {
      res.status(401).json({ msg: "Account doesnt exists" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/updatephone", async (req, res, next) => {
  try {
    const { email, phone } = req.body;
    console.log(email, phone);
    const user = await User.findOne({ email: email });
    if (user) {
      await User.updateOne({ email: email }, { $set: { phoneNumber: phone } });
      res.status(200).json({ msg: "Updated" });
    } else {
      res.status(401).json({ msg: "User not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/verifypin", async (req, res, next) => {
  try {
    const { email, pin } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      const match = bcrypt.compareSync(pin, user.pin);
      if (match && user.pinAttempts < 3) {
        if (user.pinAttempts > 0) {
          user.pinAttempts = 0;
          await user.save();
        }
        res.status(200).json({ msg: "Success" });
      } else if (user.pinAttempts < 3) {
        user.pinAttempts += 1;
        await user.save();
        res.status(401).json({
          msg: `Invalid Pin. ${4 - user.pinAttempts} chances remaining.`,
        });
      } else {
        user.blocked = true;
        await user.save();
        const token = await crypto.randomBytes(50).toString("hex");
        user.unblockToken = token;
        let url = `http://localhost:3000/unblock?token=${token}&email=${email}`;
        sendEmail(
          email,
          `Please click on the link to unblock your account & please change your password if this action was not performed by you.\n URL: ${url}`,
          "Unblock your account"
        );
        await user.save();
        res.status(401).json({
          msg: "User Blocked & unblocking link has been sent to the email.",
        });
      }
    } else {
      res.status(401).json({ msg: "User not found" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/unblock", async (req, res, next) => {
  try {
    const { token, email } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      if (user.unblockToken == token) {
        user.unblockToken = null;
        user.blocked = false;
        user.pinAttempts = 0;
        await user.save();
        res.status(200).json({ msg: "Unblocked" });
      } else {
        res.status(401).json({ msg: "Invalid Token" });
      }
    }
  } catch (error) {
    next(error);
  }
});

const instance = new Razorpay({
  key_id: "rzp_test_qHmvfhw7g6wviY",
  key_secret: "LWtJm6SIsK5pichkoH2nmmHt",
});

router.post("/order", async (req, res, next) => {
  try {
    const { amount, uuid } = req.body;
    const responce = await instance.orders.create({
      amount: amount.toString(),
      currency: "INR",
      receipt: uuid.toString(),
      payment_capture: 1,
    });
    res.status(200).json({ responce });
  } catch (error) {
    next(error);
  }
});

router.patch("/confirmpayment", async (req, res, next) => {
  try {
    const { pid, email, amount, lid, quantity } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      const order = new Order({
        amount: amount,
        paymentId: pid,
        lid: lid,
        quantity: quantity,
        createdAt: Date.now(),
      });
      await User.updateOne(
        { email: email },
        {
          $push: {
            orders: order,
          },
        }
      );
      res.status(200).json({ msg: "Success" });
    }
  } catch (error) {
    next(error);
  }
});

//Length of orders
router.get("/orderlength/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const length = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      { $unwind: "$orders" },
      { $group: { _id: "$_id", length: { $sum: 1 } } },
    ]);
    res.status(200).json(length);
  } catch (error) {
    next(error);
  }
});

//Get Orders by pagination
router.post("/getOrders", async (req, res, next) => {
  try {
    console.log(req.body);
    const orders = await User.findOne(
      {
        _id: mongoose.Types.ObjectId(req.body.id),
      },
      {
        orders: {
          $slice: [req.body.limit * (req.body.pgNo - 1), req.body.limit],
        },
      }
    );
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//Get Rented lands-->Done
router.post("/getRented", async (req, res, next) => {
  try {
    const { uid, pgNo, limit } = req.body;
    const landIds = await User.findOne(
      {
        _id: mongoose.Types.ObjectId(uid),
      },
      {
        rented: {
          $slice: [limit * (pgNo - 1), limit],
        },
      }
    );
    res.status(200).json(landIds.rented);
  } catch (error) {
    next(error);
  }
});

//Get length of rented lands-->Done
router.get("/rentedlength/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const length = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      { $unwind: "$rented" },
      { $group: { _id: "$_id", length: { $sum: 1 } } },
    ]);
    res.status(200).json(length);
  } catch (error) {
    next(error);
  }
});

router.get("/rentedall/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const lands = await User.findOne(
      { _id: mongoose.Types.ObjectId(id) },
      { rented: 1, _id: 0 }
    );
    console.log(lands);
    res.status(200).json(lands.rented);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
