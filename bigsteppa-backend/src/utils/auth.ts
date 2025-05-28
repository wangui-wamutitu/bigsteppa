import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};
export const comparePassword = async (password: string, hashedPassword:string) => {
  return bcrypt.compare(password, hashedPassword);
};


const JWT_SECRET = process.env.TOKEN_SECRET || 'youse-a-big-steppa-innit';
export const generateToken = (user: {id: string, email: string}) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1800s",
  });
};
