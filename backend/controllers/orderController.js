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


// SUCCESS HANDLER
const verifyOrder = async (req, res) => {
    try {
        const { transaction_uuid } = req.query;

        //  Ideally verify with eSewa API here

        await orderModel.findByIdAndUpdate(transaction_uuid, {
            payment: true
        });

        res.redirect("http://localhost:5174/verify?success=true");

    } catch (error) {
        console.log(error);
        res.redirect("http://localhost:5174/verify?success=false");
    }
};


//  FAILURE HANDLER
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


