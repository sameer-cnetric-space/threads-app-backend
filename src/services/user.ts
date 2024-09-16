import { createHmac, randomBytes } from "crypto";
import { prismaClient } from "../lib/db";
import JWT from "jsonwebtoken";

const JWTsecret = "$uperM@n123";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashedPassword;
  }

  public static getUserById(id: string) {
    return prismaClient.user.findUnique({ where: { id } });
  }

  public static createuser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString("hex");
    const hashedPassword = UserService.generateHash(salt, password);

    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPassword,
      },
    });
  }

  private static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }

  public static async getUserToken(paylaod: GetUserTokenPayload) {
    const { email, password } = paylaod;
    const user = await UserService.getUserByEmail(email);

    if (!user) throw new Error("User Not found");

    const userSalt = user.salt;
    const hashedPassword = UserService.generateHash(userSalt, password);

    if (hashedPassword !== user.password)
      throw new Error("Invalid Credentials");

    //Genrate Token
    const token = JWT.sign({ id: user.id, email: user.email }, JWTsecret);
    return token;
  }

  public static decodeJWTToken(token: string) {
    return JWT.verify(token, JWTsecret);
  }
}

export default UserService;
