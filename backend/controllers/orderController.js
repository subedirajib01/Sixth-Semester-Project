import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

import crypto from "crypto";

const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5174";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: false
        });

        await newOrder.save();

        // clear cart
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // eSewa required fields
        const transaction_uuid = newOrder._id.toString();
        const product_code = "EPAYTEST";
        const total_amount = req.body.amount;

        // signature message
        const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

        // generate signature
        const signature = crypto
            .createHmac("sha256", process.env.ESEWA_SECRET_KEY)
            .update(message)
            .digest("base64");

        // send data to frontend
        res.json({
            success: true,
            paymentData: {
                amount: total_amount,
                tax_amount: 0,
                total_amount,
                transaction_uuid,
                product_code,
                product_service_charge: 0,
                product_delivery_charge: 0,
                success_url: `http://localhost:5000/api/order/success`,
                failure_url: `http://localhost:5000/api/order/failure`,
                signed_field_names: "total_amount,transaction_uuid,product_code",
                signature
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error placing order" });
    }
};


// ✅ SUCCESS HANDLER
const verifyOrder = async (req, res) => {
    try {
        const { transaction_uuid } = req.query;

        // ⚠️ Ideally verify with eSewa API here

        await orderModel.findByIdAndUpdate(transaction_uuid, {
            payment: true
        });

        res.redirect("http://localhost:5174/verify?success=true");

    } catch (error) {
        console.log(error);
        res.redirect("http://localhost:5174/verify?success=false");
    }
};


// ❌ FAILURE HANDLER
const paymentFailure = async (req, res) => {
    try {
        const { transaction_uuid } = req.query;

        await orderModel.findByIdAndDelete(transaction_uuid);

        res.redirect("http://localhost:5174/verify?success=false");

    } catch (error) {
        console.log(error);
        res.redirect("http://localhost:5174/verify?success=false");
    }
};

// user orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId: req.body.userId})
        res.json({success: true, data: orders})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}

// Listing orders for admin panel
const listOrders= async (req,res) =>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// api for updating order status
const updateStatus = async (req,res) =>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus,paymentFailure};

// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import paymentModel from "../models/paymentModel.js";
// import { getEsewaPaymentHash } from "../esewa.js";

// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5174";
// const ESEWA_GATEWAY_URL = process.env.ESEWA_GATEWAY_URL;
// const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE;

// // Place Order and return eSewa payment data
// const placeOrder = async (req, res) => {
//   try {
//     // 1️⃣ Save the order
//     const newOrder = new orderModel({
//       userId: req.body.userId,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address,
//     });
//     await newOrder.save();

//     // 1.5️⃣ Create payment record
//     const payment = new paymentModel({
//       transactionId: newOrder._id.toString(), // Use order ID as transaction ID
//       orderId: newOrder._id,
//       userId: req.body.userId,
//       amount: newOrder.amount,
//       paymentGateway: "esewa",
//       status: "pending",
//     });
//     await payment.save();

//     // 2️⃣ Clear user's cart
//     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//     // 3️⃣ Prepare eSewa payment data
//     // Generate signature for eSewa
//     const signatureData = await getEsewaPaymentHash({
//       amount: newOrder.amount,
//       transaction_uuid: newOrder._id.toString(),
//     });

//     const paymentData = {
//       amount: newOrder.amount,
//       tax_amount: 0,
//       total_amount: newOrder.amount,
//       transaction_uuid: newOrder._id,
//       product_code: ESEWA_PRODUCT_CODE,
//       product_service_charge: 0,
//       product_delivery_charge: 0,
//       success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
//       failure_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
//       signature: signatureData.signature,
//       signed_field_names: signatureData.signed_field_names,
//     };

//     res.json({ success: true, payment: paymentData });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error placing order" });
//   }
// };

// // Fetch orders of a user
// const userOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find({ userId: req.body.userId });
//     res.json({ success: true, data: orders });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error fetching orders" });
//   }
// };

// // Fetch all orders (admin)
// const listOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find({});
//     res.json({ success: true, data: orders });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error fetching orders" });
//   }
// };

// // Update order status (admin)
// const updateStatus = async (req, res) => {
//   try {
//     await orderModel.findByIdAndUpdate(req.body.orderId, {
//       status: req.body.status,
//     });
//     res.json({ success: true, message: "Status Updated" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error updating status" });
//   }
// };

// // Verify payment after eSewa redirect
// const verifyOrder = async (req, res) => {
//   const { orderId, success } = req.body;
//   try {
//     if (success === "true") {
//       await orderModel.findByIdAndUpdate(orderId, { payment: true });
//       await paymentModel.findOneAndUpdate({ orderId }, { status: "success" });
//       res.json({ success: true, message: "Paid" });
//     } else {
//       await orderModel.findByIdAndDelete(orderId);
//       await paymentModel.findOneAndUpdate({ orderId }, { status: "failed" });
//       res.json({ success: false, message: "Not Paid" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };

// export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
