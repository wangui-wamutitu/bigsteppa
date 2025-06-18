import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/auth";
import { AuthService } from "../services/auth";

export const register = async (req: Request, res: Response) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      formErrors: ["No input provided"],
      fieldErrors: {},
    });
  }
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  try {
    const {token, user} = await AuthService.register(
      parsed.data.email,
      parsed.data.username,
      parsed.data.password
    );
    return res.status(201).json({ token, message: "Successfully registered!", user });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  try {
    const {token, user} = await AuthService.login(parsed.data.email, parsed.data.password);
    return res.status(200).json({ token, user });
  } catch (e: any) {
    return res.status(401).json({ error: e.message });
  }
};
