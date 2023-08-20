// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import pincodes from "../../pincodes.json";

export default function Handler(req, res) {
  res.status(200).json(pincodes);
}
