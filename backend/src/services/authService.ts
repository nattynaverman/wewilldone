import { prisma } from "../config/database";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";

export const createAccount = async (
  email: string,
  username: string,
  password: string
) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });
  if (existingUser) {
    throw new Error("Email or username already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      username: username.toLowerCase().trim(),
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const token = generateToken(user);

  return {
    user,
    token,
  };
};

export const loginAccount = async (identify: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identify.toLowerCase().trim() },
        { username: identify.toLowerCase().trim() },
      ],
    },
    select: {
      id: true,
      email: true,
      username: true,
      password: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  const { password: _, ...userWithoutPassword } = user;
  const token = generateToken(userWithoutPassword);

  return {
    user: userWithoutPassword,
    token,
  };
};