import bcrypt from "bcrypt";
import { registerRepository } from "../repositories/auth.repoistory";
import type { LoginDTO, RegisterDTO } from "../validations/auth.validation";
import { userFindExistingRepository } from "../repositories/user.repository";
import { CustomError } from "../errors/customError";
import { generateToken } from "../utils/token-service";
export const registerService = async (payload: RegisterDTO) => {
  const { username, email, password } = payload;

  const existingUser = await userFindExistingRepository(username, email);

  if (existingUser) {
    throw new CustomError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: RegisterDTO = {
    username,
    email,
    password: hashedPassword,
  };

  return await registerRepository(newUser);
};

export const loginService = async (payload: LoginDTO) => {
  const { email, password } = payload;

  const user = await userFindExistingRepository("", email);

  if (!user) throw new CustomError("Invalid credentials", 400);

  const isMatch = await bcrypt.compare(password, user?.password);

  if (!isMatch) throw new CustomError("Invalid credentials", 400);

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = generateToken(tokenPayload);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    token,
  };
};
