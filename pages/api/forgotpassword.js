// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Link from "next/link";
import Forgot from "../../models/Forgot";
import User from "@/models/User";
import CryptoJS from "crypto-js";

export default async function Handler(req, res) {
  if (req.body.sendEmail) {
    let token = "asdasdasdadsfsdfsdfdsfdsfds";
    let forgot = new Forgot({
      email: req.body.email,
      token: token,
    });

    let email = `Hello [name],
            Somebody requested a new password for the [customer portal] account associated with [email].
            No changes have been made to your account yet.
            You can reset your password by clicking the link below:
            
              <a href=${`http://localhost:3000/forgot?token=${token}`}>
                click here to reset password
              </a>
            
            If you did not request a new password, please let us know immediately by replying to this email.
            
            Yours,
            The Codeswear team`;
    res.status(200).json({ name: "John Doe" });
  } else {
    let dbuser = await User.findOneAndUpdate(
      { email: user.email },
      {
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.NEXT_PUBLIC_AES_SECRET
        ).toString(),
      }
    );
  }
}
