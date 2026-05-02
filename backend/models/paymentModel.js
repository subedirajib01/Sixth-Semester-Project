import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
    transaction_uuid: String,
    amount: Number,
    status: {
    type: String,
    default: "PENDING",
    },
    product_code: String,
    },
    { timestamps: true },
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
