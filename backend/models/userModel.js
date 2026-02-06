import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    },
    { minimize: false },
);

// here we do minimize false so that the cartData will be provided with no data.and also
//we create the cartData with no data..

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
//if the model is created already it will use the Schema created otherwise it will create the model

export default userModel;
