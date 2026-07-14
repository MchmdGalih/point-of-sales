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

export type UserQueryRepository = {
  skip: number;
  take: number;
  search?: string;
  role?: Role;
};
