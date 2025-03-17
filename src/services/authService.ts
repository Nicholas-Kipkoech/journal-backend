import { prisma } from "../../prisma/client";
import { LoginDto, UserDto } from "../shared";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtHelper";

export class AuthService {
  static async registerUser(userDto: UserDto) {
    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userDto.email },
    });
    if (existingUser) throw new Error("User already exists");
    // hash user password
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    return prisma.user.create({
      data: {
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        password: hashedPassword,
        roleId: userDto.roleId,
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
    if (!user) throw new Error("Invalid email entered");

    // check if password is valid
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new Error("Invalid password entered");

    // generate JWT token for logged in user
    const token = generateToken(user.id, user.roleId);
    return {
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName },
    };
  }
  /**
   *
   * @param userId user id
   * @returns user
   */
  static async getUser(userId: number) {
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
}
