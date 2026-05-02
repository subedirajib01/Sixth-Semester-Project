import crypto from "crypto";
import Payment from "../models/paymentModel.js";

export const initiatePayment = async (req, res) => {
  try {
    const amount = req.body.amount;

    const transaction_uuid = "TXN_" + Date.now();
    const product_code = "EPAYTEST";

    // Create message
    const message = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

    const secret = "YOUR_SECRET_KEY";

    const signature = crypto
      .createHmac("sha256", secret)
      .update(message)
      .digest("base64");

    // Save in DB
    await Payment.create({
      transaction_uuid,
      amount,
      product_code,
    });

    // Send data to frontend
    res.json({
      amount,
      transaction_uuid,
      product_code,
      signature,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const handleSuccess = async (req, res) => {
  try {
    const { transaction_uuid } = req.query;

    // ⚠️ Ideally verify with eSewa API here

    await Payment.findOneAndUpdate({ transaction_uuid }, { status: "SUCCESS" });

    res.send("Payment Successful ✅");
  } catch (err) {
    res.send("Error in payment");
  }
};

export const handleFailure = async (req, res) => {
  const { transaction_uuid } = req.query;

  await Payment.findOneAndUpdate({ transaction_uuid }, { status: "FAILED" });

  res.send("Payment Failed ❌");
};
