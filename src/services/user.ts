import { createHmac, randomBytes } from "crypto";
import { prismaClient } from "../lib/db";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

class UserService {
  public static createuser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString();
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

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
}

export default UserService;
