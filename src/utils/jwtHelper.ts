import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 *
 * @param userId user id
 * @param roleId role Id
 * @returns  token which expires in a certain duration
 */

export const generateToken = (user) => {
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: "1h" });
};
