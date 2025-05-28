import { Prisma } from "@prisma/client";
import prisma from "../db";
import { comparePassword, generateToken, hashPassword } from "../utils/auth";

export const AuthService = {
  async register(email: string, username: string, password: string) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error("Email or username already exists");
    }

    const user = await prisma.user.create({
      data: {
        email,
        username,
        credentials: {
          create: { password: await hashPassword(password) },
        },
      },
    });
    return generateToken({ id: user.id, email });
  },

  async login(email: string, password: string) {
    if (!email) {
      throw new Error("Please provide either an email to login.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { credentials: true },
    });

    if (!user) {
      throw new Error(
        "Invalid credentials. If you don't have an account, create one first."
      );
    }

    const userPassword = user.credentials[0]?.password;
    if (!userPassword) {
      throw new Error("No password found for this user.");
    }

    const isMatch = await comparePassword(password, userPassword);
    if (!isMatch) {
      throw new Error("Invalid credentials. Password is incorrect.");
    }

    return generateToken({ id: user.id, email: user.email });
  },
};
