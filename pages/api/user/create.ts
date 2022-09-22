import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";


export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
  ){
  if (req.method === "POST") {
    const emailDoesNotExist : boolean = await checkEmail(res, req);
    if(emailDoesNotExist){
       await handlePOST(res, req); 
    }else{
        
        const body= JSON.stringify({message:"Email already used"});
        res.status(409).json(body)
    }
    
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}





async function handlePOST(res, req) {

  const user = await prisma.user.create({
    data: { ...req.body, password: req.body.password },
  });
  res.json(user);
}

async function checkEmail(res, req) {
    const user = await prisma.user.findFirst({
        where: {
            email: String(req.body.email),
          }
    });

    
    return (user? false : true);
}