import User from "@/models/User";
import connectDb from "@/middleware/mongoose";
const CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  if (req.method == "POST") {
    let user = await User.findOne({ email: req.body.email });
    // console.log(user);
    if (user) {
      var bytes = CryptoJS.AES.decrypt(
        user.password,
        process.env.NEXT_PUBLIC_AES_SECRET
      );
      var storedPassword = bytes.toString(CryptoJS.enc.Utf8);
      // console.log(req.body.password, storedPassword);
      if (req.body.email == user.email && storedPassword == req.body.password) {
        var token = jwt.sign(
          { email: user.email, name: user.name },
          process.env.NEXT_PUBLIC_JWT_SECRET,
          { expiresIn: "2d" }
        );
        res.status(200).json({ success: "true", token, email: user.email });
      } else {
        res.status(200).json({ error: "false", error: "wrong passord" });
      }
    } else {
      res.status(200).json({ error: "false", error: "no user found" });
    }
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDb(handler);
// NEXT_PUBLIC_AES_SECRET = secret123
// NEXT_PUBLIC_JWT_SECRET = secret123
