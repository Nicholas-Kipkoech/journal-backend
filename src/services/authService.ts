import { prisma } from "../../prisma/client";
import { LoginDto, UserDto } from "../shared";
import { checkUser } from "../utils/checkUser";
import { generateToken } from "../utils/jwtHelper";
import { checkPassword, hashPassword } from "../utils/passwordHelper";

export class AuthService {
  static async registerUser(userDto: UserDto) {
    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userDto.email },
    });
    if (existingUser) throw new Error("User already exists");

    // hash user password
    const hashedPassword = await hashPassword(userDto.password);
    return prisma.user.create({
      data: {
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        password: hashedPassword,
        email: userDto.email,
      },
    });
  }
  /**
   *
   * @param email email passed from the request
   * @param password user password
   * @returns success login or error
   */
  static async loginUser(loginDto: LoginDto) {
    // check if user exists else throw an error
    const user = await prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user) throw new Error("User not found");

    // check if password is valid
    const isMatch = await checkPassword(loginDto.password, user.password);
    if (!isMatch) throw new Error("Invalid password entered");

    // Pass only safe fields to token generator
    const tokenPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    // generate JWT token for logged in user
    const token = generateToken(tokenPayload);
    return {
      token,
    };
  }
  /**
   *
   * @param userId user id
   * @returns user
   */
  static async getUser(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });
  }

  // user profile or preferences update

  static async updateUser(userId: string, userData: Partial<UserDto>) {
    try {
      await checkUser(userId);
      const updateData: Partial<UserDto> = {
        firstName: userData.firstName,
        lastName: userData.lastName,
      };
      // only hash and update password if it is provided

      if (userData.password) {
        updateData.password = await hashPassword(userData.password);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });
      return updatedUser;
    } catch (error) {
      throw new Error("Error updating user profile " + error.message);
    }
  }
}
