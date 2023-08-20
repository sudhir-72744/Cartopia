const mongoose = require("mongoose");
const { Monomaniac_One } = require("next/font/google");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // address: { type: String, required: true },
    address: { type: String, default: "" },
    // pincode: { type: String, required: true },
    pincode: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { timestamps: true }
);
mongoose.models = {};
export default mongoose.model("User", userSchema);
// export default mongoose.models.User || mongoose.model("User", userSchema);
