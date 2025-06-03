import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

type User ={
    id: string,
    email: string,
}
declare module 'express' {
    interface Request {
      user?: User
    }
  }

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "No token. Please login first" });
  }

  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    (err: any, user: any) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ error: "Unauthorized: ", err });
      }
      req.user = user;
      next();
    }
  );
};

export default verifyToken;
