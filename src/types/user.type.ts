import type { Role } from "../../generated/prisma/enums";
import type { PaginationResponse } from "../types/pagination";

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role?: Role;
}

export interface LoginResponse extends UserResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserQueryRepository {
  skip: number;
  take: number;
  search?: string;
  role?: Role;
}
export interface UserListResponse extends PaginationResponse<UserResponse> {}
