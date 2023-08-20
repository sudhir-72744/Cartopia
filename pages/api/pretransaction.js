// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import MyOrders from "@/models/MyOrders";
import connectDb from "@/middleware/mongoose";
import PaytmChecksum from "paytmchecksum";
import { resolve } from "path";
import Product from "@/models/Product";
import { Router } from "next/router";
import pincodes from "../../pincodes.json";

const https = require("https");

const handler = async (req, res) => {
  // console.log(req.body);
  if (req.method == "POST") {
    if (!Object.keys(pincodes).includes(req.body.pincode)) {
      res.status(200).json({
        sucess: false,
        error: "pincode not servicible",
        clearcart: false,
      });

      return;
    }

    let cart = req.body.cart;
    let product;
    let sumTotal = 0;
    if (req.body.subTotal <= 0) {
      res.status(200).json({
        success: false,
        error: "your cart is empty, please bulid your cart and try again",
        clearcart: false,
      });
    }
    for (let item in cart) {
      product = await Product.findOne({ slug: item });
      sumTotal += product.price * cart[item].qty;
      if (product.availabilityQty < cart[item].qty) {
        res.status(200).json({
          success: false,
          error: "some items went out of stock",
          clearcart: true,
        });

        return;
      }
      if (product.price != cart[item].price) {
        res.status(200).json({
          success: false,
          error: "the price of cart items was tampered",
          clearcart: true,
        });
        retrun;
      }
    }

    if (sumTotal != req.body.subTotal) {
      res.status(200).json({
        success: false,
        error: "the price of cart items was tampered",
        clearcart: true,
      });
      return;
    }
    // console.log("hello");

    let order = new MyOrders({
      email: req.body.email,
      name: req.body.name,
      orderId: req.body.oid,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      phone: req.body.phone,
      amount: req.body.subTotal,
      products: req.body.cart,
    });
    await order.save();

    res
      .status(200)
      .json({ sucess: "23543534545644565464565465476878", clearcart: false });

    /*
     * import checksum generation utility
     * You can get this utility from https://developer.paytm.com/docs/checksum/
     */

    //   var paytmParams = {};

    //   paytmParams.body = {
    //     requestType: "Payment",
    //     mid: process.env.NEXT_PUBLIC_PAYTM_MID,
    //     websiteName: "YOUR_WEBSITE_NAME",
    //     orderId: req.body.oid,
    //     callbackUrl: `${NEXT_PUBLIC_HOST}/api/posttransaction`,
    //     txnAmount: {
    //       value: req.body.subTotal,
    //       currency: "INR",
    //     },
    //     userInfo: {
    //       custId: req.body.email,
    //     },
    //   };

    //   /*
    //    * Generate checksum by parameters we have in body
    //    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
    //    */
    //   const checksum = await PaytmChecksum.generateSignature(
    //     JSON.stringify(paytmParams.body),
    //     process.env.NEXT_PUBLIC_PAYTM_MKEY
    //   );
    //   paytmParams.head = { signature: checksum };

    //   var post_data = JSON.stringify(paytmParams);

    //   const requestAsync = async () => {
    //     return new Promise((resolve, reject) => {
    //       var options = {
    //         /* for Staging */
    //         // hostname: "securegw-stage.paytm.in",

    //         /* for Production */
    //         hostname: "securegw.paytm.in",

    //         port: 443,
    //         path: `/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID}&orderId=${req.body.oid}`,
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "Content-Length": post_data.length,
    //         },
    //       };

    //       var response = "";
    //       var post_req = https.request(options, function (post_res) {
    //         post_res.on("data", function (chunk) {
    //           response += chunk;
    //         });

    //         post_res.on("end", function () {
    //           console.log("Response: ", response);
    // let ress = JSON.parse(response).body;
    // resss.sucess=true
    // ress.clearCart=false
    // resolve(JSON.PARSE(ress).body);
    //         });
    //       });

    //       post_req.write(post_data);
    //       post_req.end();
    //     });
    //   };

    //   let myr = await requestAsync();
    // res.status(200).json(myr)
  }
};
export default connectDb(handler);
