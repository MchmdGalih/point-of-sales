import bcrypt from "bcrypt";
import {
  logoutRepository,
  registerRepository,
} from "../repositories/auth.repository";
import {
  getUserByIdRepository,
  userFindExistingRepository,
} from "../repositories/user.repository";
import { CustomError } from "../errors/customError";
import { generateToken } from "../utils/token-service";
import type {
  CreateUserRequest,
  LoginUserRequest,
  UserResponse,
} from "../model/user-model";
export const registerService = async (
  payload: CreateUserRequest,
): Promise<UserResponse> => {
  const { username, email, password } = payload;

  const existingUser = await userFindExistingRepository(username, email);

  if (existingUser) {
    throw new CustomError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    username,
    email,
    password: hashedPassword,
  };

  return await registerRepository(newUser);
};

export const loginService = async (
  payload: LoginUserRequest,
): Promise<UserResponse> => {
  const { email, password } = payload;

  const user = await userFindExistingRepository("", email);

  if (!user) throw new CustomError("Invalid credentials", 400);

  const isMatch = await bcrypt.compare(password, user?.password);

  if (!isMatch) throw new CustomError("Invalid credentials", 400);

  const tokenPayload: object = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token: string = generateToken(tokenPayload);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    token,
  };
};

export const logoutService = async (id: string): Promise<void> => {
  const user = await getUserByIdRepository(id);

  if (!user) throw new CustomError("User not found", 404);

  await logoutRepository(id);
};
