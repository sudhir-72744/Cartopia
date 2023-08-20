// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import MyOrders from "@/models/MyOrders";
import Product from "@/models/Product";
import { removeRequestMeta } from "next/dist/server/request-meta";
import PaytmChecksum from "paytmchecksum";
const Handler = async (req, res) => {
  let order;

  /////////////////////////////////////////////////////
  const https = require("https");
  var paytmParams = {};
  const paytmchecksum = "";
  const received_data = req.body;
  for (var key in received_data) {
    if (key == "CHECKSUMHASH") {
      paytmchecksum = received_data[key];
    } else {
      paytmParams[key] = received_data[key];
    }
  }
  var isValidChecksum = PaytmChecksum.verifySignature(
    paytmParams,
    process.env.PAYTM_MKEY,
    paytmchecksum
  );
  if (!isValidChecksum) {
    res.status(500).send("some error Occured");
    return;
  }

  //////////////////////////////////////////////////

  if (req.body.STATUS == "TXN_SUCESS") {
    order = await MyOrders.findOneAndUpdate(order.id, {
      status: "PAID",
      paymentInfo: JSON.stringify(req.body),
      transactionId: req.body.TXNID,
    });
    let products = order.products;
    for (let slug in products) {
      await Product.findOneAndUpdate(
        { slug: slug },
        { $inc: { availableQty: -products[slug].qty } }
      );
    }
  } else if (req.body.STATUS == "PENDING") {
    order = await MyOrders.findOneAndUpdate(order.id, {
      status: "pending",
      paymentInfo: JSON.stringify(req.body),
    });
  }

  //   res.status(200).json({ body: req.body });
  res.rediect("/order?clearCart=1&id=" + order._id, 200);
};
