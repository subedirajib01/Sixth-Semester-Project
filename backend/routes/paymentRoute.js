import express from "express";
import {
  initiatePayment,
  handleSuccess,
  handleFailure,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/initiate", initiatePayment);
router.get("/success", handleSuccess);
router.get("/failure", handleFailure);

export default router;
