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
    return res.sendStatus(401).json({ error: "Please login first" });
  }

  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    (err: any, user: any) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403).json({ error: "Unauthorized" });
      }

      req.user = user;

      next();
    }
  );
};

export default verifyToken;
