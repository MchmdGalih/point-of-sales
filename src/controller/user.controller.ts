import type { NextFunction, Request, Response } from "express";
import {
  createUserService,
  deleteUserService,
  getAllUserService,
  getUserByIdService,
  updateUserService,
} from "../services/user.service";

export const getAllUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = res.locals.query;

    const result = await getAllUserService(query);

    res.status(200).json({
      status: true,
      message: "User fetched successfully",
      data: result.data,
      meta: result.meta,
    });
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
    const result = await createUserService(req.body);
    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: result,
    });
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
    res.status(200).json({
      status: true,
      message: "User fetched successfully",
      data: result,
    });
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
    const result = await updateUserService(req.params.id as string, req.body);
    res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: result,
    });
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
    res.status(200).json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
