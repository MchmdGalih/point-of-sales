import bcrypt from "bcrypt";
import type {
  CreateUserDTO,
  UpdateUserDTO,
  UserQueryDTO,
} from "../dto/user.dto";
import { CustomError } from "../errors/customError";
import {
  createUserRepository,
  deleteUserRepository,
  getAllUserRepository,
  getUserByIdRepository,
  updateUserRepository,
  userFindExistingRepository,
} from "../repositories/user.repository";
import { Role } from "../../generated/prisma/enums";

export const getAllUserService = async (query: UserQueryDTO) => {
  return await getAllUserRepository(query);
};

export const createUserService = async (payload: CreateUserDTO) => {
  const { username, email, password, role } = payload;

  const existingUser = await userFindExistingRepository(username, email);

  if (existingUser) throw new CustomError("User already exists", 409);

  const hashedPassword = await bcrypt.hash(password, 10);

  return await createUserRepository({
    username,
    email,
    password: hashedPassword,
    role: role ?? Role.CASHIER,
  });
};

export const getUserByIdService = async (id: string) => {
  const user = await getUserByIdRepository(id);

  if (!user) throw new CustomError("User not found", 404);

  return user;
};

export const updateUserService = async (id: string, payload: UpdateUserDTO) => {
  const data = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined),
  );
  if (payload.password) {
    data.password = await bcrypt.hash(payload.password, 10);
  }

  return await updateUserRepository(id, data);
};

export const deleteUserService = async (id: string) => {
  return await deleteUserRepository(id);
};
