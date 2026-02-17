import express from 'express'
import { addFood, listFood, removeFood } from '../controllers/foodController.js'
import multer from "multer";

const foodRouter =express.Router();


// Image storage Engine

const storage=multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
    })

const upload=multer({storage})

foodRouter.post("/add",upload.single("image"),addFood)
foodRouter.get("/list",listFood);
foodRouter.post("/remove",removeFood);


export default foodRouter;

// import express from 'express';
// import { addFood } from '../controllers/foodController.js';
// import multer from 'multer';
// import fs from 'fs';

// // const multer = require('multer');
// const foodRouter = express.Router();

// // Ensure uploads folder exists
// const uploadDir = "uploads";
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// // Multer storage
// const storage = multer.diskStorage({
//     destination: uploadDir,
//     filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// const upload = multer({ storage });

// // POST /api/food/add
// foodRouter.post("/add", upload.single('image'), addFood);

// export default foodRouter;
