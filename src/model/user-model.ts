import type { Role } from "../../generated/prisma/enums";
import type { PaginationResponse } from "./paginations";

export type UserResponse = {
  id: string;
  username: string;
  email: string;
  role?: Role;
};

export type LoginResponse = UserResponse & {
  accessToken: string;
  refreshToken: string;
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

export type UserQueryRepository = {
  skip: number;
  take: number;
  search?: string;
  role?: Role;
};

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}
