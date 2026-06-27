import bcrypt from "bcrypt";
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
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserListResponse,
  UserQueryRequest,
  UserResponse,
} from "../model/user-model";

export const getAllUserService = async (
  query: UserQueryRequest,
): Promise<UserListResponse> => {
  const { page = 1, limit = 10, search, role } = query;
  const skip = (page - 1) * limit;

  const result = await getAllUserRepository({
    skip,
    take: limit,
    ...(search && { search }),
    ...(role && { role }),
  });

  return {
    data: result.users,
    meta: {
      page,
      limit,
      totalPage: Math.ceil(result.totalData / limit),
      totalData: result.totalData,
    },
  };
};

export const createUserService = async (
  payload: CreateUserRequest,
): Promise<UserResponse> => {
  const { username, email, password, role } = payload;

  const existingUser = await userFindExistingRepository(username, email);

  if (existingUser) throw new CustomError("User already exists", 409);

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await createUserRepository({
    username,
    email,
    password: hashedPassword,
    role: role ?? Role.CASHIER,
  });

  return result;
};

export const getUserByIdService = async (id: string): Promise<UserResponse> => {
  const user = await getUserByIdRepository(id);

  if (!user) throw new CustomError("User not found", 404);

  return user;
};

export const updateUserService = async (
  id: string,
  payload: UpdateUserRequest,
): Promise<UserResponse> => {
  const data = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined),
  );
  if (payload.password) {
    data.password = await bcrypt.hash(payload.password, 10);
  }

  return await updateUserRepository(id, data);
};

export const deleteUserService = async (id: string): Promise<void> => {
  const user = await getUserByIdRepository(id);

  if (!user) throw new CustomError("User not found", 404);

  await deleteUserRepository(id);
};
