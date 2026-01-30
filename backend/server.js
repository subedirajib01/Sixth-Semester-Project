import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import dotenv from "dotenv"

dotenv.config();

//app config
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// dB connection
connectDB();

// API endpoints 
app.use("/api/food",foodRouter);
app.use("/images",express.static('uploads'))

app.get("/", (req, res) => {
    res.send("API working");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



