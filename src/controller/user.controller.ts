import type { NextFunction, Request, Response } from "express";
import {
  createUserService,
  deleteUserService,
  getAllUserService,
  getUserByIdService,
  updateUserService,
} from "../services/user.service";
import type { CreateUserDTO, UpdateUserDTO } from "../dto/user.dto";
import { paginationResponse, successResponse } from "../utils/response";

export const getAllUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = res.locals.query;

    const result = await getAllUserService(query);

    return paginationResponse(
      res,
      "Users fetched successfully",
      result.data,
      result.meta,
    );
  } catch (error) {
    next(error);
  }
};

export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: CreateUserDTO = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    };

    const result = await createUserService(payload);
    return successResponse(res, result, "User created successfully");
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getUserByIdService(req.params.id as string);
    return successResponse(res, result, "User fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: UpdateUserDTO = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    };

    const result = await updateUserService(req.params.id as string, payload);
    return successResponse(res, result, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteUserService(req.params.id as string);
    return successResponse(res, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};
