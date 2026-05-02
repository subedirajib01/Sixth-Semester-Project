import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import dotenv from "dotenv";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import bodyParser from "body-parser";
import paymentRouter from "./routes/paymentRoute.js";

// const { getEsewaPaymentHash, verifyEsewaPayment } = require("./esewa");
// const Payment = require("./models/paymentModel.js");
// const food = require("./models/foodModel.js");
// const order = require("./models/orderModel.js");

dotenv.config();

//app config
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// dB connection
connectDB();

// //dummy data
app.get("/create-item", async (req, res) => {
  let itemData = await Item.create({
    name: "Headphone",
    price: 500,
    inStock: true,
    category: "vayo pardaina",
  });
  res.json({
    success: true,
    item: itemData,
  });
});

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
