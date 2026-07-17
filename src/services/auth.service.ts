import bcrypt from "bcrypt";
import {
  logoutRepository,
  registerRepository,
} from "../repositories/auth.repository";
import { userFindExistingRepository } from "../repositories/user.repository";
import { CustomError } from "../errors/customError";
import { generateToken } from "../utils/token-service";
import {
  createSessionRepository,
  findSessionByRefreshTokenRepository,
  updateSessionByIdRepository,
} from "../repositories/sessions.repository";
import { REFRESH_TOKEN_MAX_AGE } from "../config/cookie";
import type { LoginDTO, RegisterDTO, TokenPayload } from "../dto/auth.dto";
import type { LoginResponse, UserResponse } from "../types/user.type";

export const registerService = async (
  payload: RegisterDTO,
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
  payload: LoginDTO,
): Promise<LoginResponse> => {
  const { email, password } = payload;

  const user = await userFindExistingRepository("", email);

  if (!user) throw new CustomError("Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new CustomError("Invalid credentials", 401);

  const tokenPayload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const { accessToken, refreshToken } = generateToken(tokenPayload);
  const expiredAt = new Date();
  expiredAt.setDate(expiredAt.getDate() + 7);

  await createSessionRepository({
    userId: user.id,
    refreshToken,
    expiredAt,
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    accessToken,
    refreshToken,
  };
};

export const refreshTokenService = async (refreshToken: string) => {
  const session = await findSessionByRefreshTokenRepository(refreshToken);

  if (!session) throw new CustomError("Session not found", 404);

  const now = new Date();

  if (session.expiredAt < now)
    throw new CustomError("Refresh token expired", 401);

  const tokenPayload: TokenPayload = {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role,
  };

  const { accessToken, refreshToken: newRefreshToken } =
    generateToken(tokenPayload);

  await updateSessionByIdRepository(session.id, {
    refreshToken: newRefreshToken,
    expiredAt: new Date(session.expiredAt.getTime() + REFRESH_TOKEN_MAX_AGE),
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutService = async (refreshToken: string): Promise<void> => {
  const session = await findSessionByRefreshTokenRepository(refreshToken);

  if (!session) throw new CustomError("Session not found", 404);

  await logoutRepository(session.id);
};
