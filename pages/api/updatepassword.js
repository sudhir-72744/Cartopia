// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import connectDb from "@/middleware/mongoose";
import jsonwebtoken from "jsonwebtoken";
import User from "@/models/User";
const CryptoJS = require("crypto-js");

const handler = async (req, res) => {
  if (req.method == "POST") {
    let token = req.body.token;
    let password = req.body.password;
    let cpassword = req.body.cpassword;
    let user = jsonwebtoken.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    if (user) {
      user = await User.findOne({ email: user.email });
    }

    var originalPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.NEXT_PUBLIC_AES_SECRET
    ).toString(CryptoJS.enc.Utf8);
    originalPassword = originalPassword.toString(CryptoJS.enc.Utf8);
    console.log(originalPassword);
    console.log(cpassword);
    console.log(password);
    if (
      req.body.password == originalPassword &&
      req.body.password == req.body.cpassword
    ) {
      let dbuser = await User.findOneAndUpdate(
        { email: user.email },
        {
          password: CryptoJS.AES.encrypt(
            req.body.cpassword,
            process.env.NEXT_PUBLIC_AES_SECRET
          ).toString(),
        }
      );
      res.status(200).json({ success: true });
      return;
    } else {
      res.status(200).json({ sucess: false });
    }
  }
};

export default connectDb(handler);
