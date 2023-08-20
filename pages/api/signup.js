import User from "@/models/User";
import connectDb from "@/middleware/mongoose";
const CryptoJS = require("crypto-js");

const handler = async (req, res) => {
  if (req.method == "POST") {
    const { name, email } = req.body;

    try {
      let u = new User({
        name: name,
        email: email,
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.NEXT_PUBLIC_AES_SECRET
        ).toString(),
      });
      u.save();

      res.status(200).json({ message: "Signup/ successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDb(handler);
