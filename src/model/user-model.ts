import type { Role } from "../../generated/prisma/enums";
import type { PaginationResponse } from "./paginations";

export type UserResponse = {
  id: string;
  username: string;
  email: string;
  token?: string;
  role?: Role;
};

export type UserListResponse = PaginationResponse<UserResponse>;

export type CreateUserRequest = {
  username: string;
  email: string;
  password: string;
  role?: Role;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type UpdateUserRequest = {
  username?: string;
  email?: string;
  password?: string;
  role?: Role;
};

export type UserQueryRequest = {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
};

export type UserQueryRepository = UserQueryRequest & {
  skip: number;
  take: number;
};
