// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import MyOrders from "@/models/MyOrders";
import connectDb from "@/middleware/mongoose";
import jsonwebtoken from "jsonwebtoken";
import Order from "../order";

const Handler = async (req, res) => {
  const token = req.body.token;
  const data = jsonwebtoken.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
  let orders = await MyOrders.find({ email: data.email });
  console.log(orders)
  res.status(200).json({ orders });
};
export default connectDb(Handler);
