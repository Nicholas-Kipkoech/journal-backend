import bcrypt from "bcryptjs";

/**
 *
 * @param password plain user password in the request body
 * @returns {Promise} hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 *
 * @param password plain user password
 * @param hashedPassword hashed password saved in user database
 * @returns {Promise} boolean
 */
export async function checkPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
