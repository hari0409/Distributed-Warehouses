const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();
const mongoose=require("mongoose");
const cors=require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true },()=>{
  console.log("Database connected Successfully 👍");
});

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});
const userRoutes=require("./routes/user");
const warehouseRoutes=require("./routes/warehouse");
app.use('/api/users', userRoutes);
app.use("/api/warehouse", warehouseRoutes);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,  
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
