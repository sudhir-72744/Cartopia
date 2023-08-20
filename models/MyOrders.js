const mongoose = require("mongoose");
const { Monomaniac_One } = require("next/font/google");

const OrderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    orderId: { type: String, required: true },
    paymentInfo: { type: String, default: "" },
    products: [{ type: Object, required: true }],
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    transactionId: { type: String, default: "" },
    amount: { type: Number, required: true },
    status: { type: String, default: "initated", required: true },
    deliveryStatus: { type: String, default: "unshipped", required: true },
  },
  { timestamps: true }
);
mongoose.models = {};
export default mongoose.model("MyOrder", OrderSchema);
