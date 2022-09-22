import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  const id = req.query.id.toString();

  if (req.method === "GET") {

    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    console.log("my user",user)
    res.status(200).json(user);

  } else if (req.method === "POST") {

    const user = await prisma.user.update({
      where: { id: id },
      data: { ...req.body },
    });
    return res.status(209).json(user);

  } else {

    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}
