import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import { UserService } from './user.service';
import { JwtPayload } from 'jsonwebtoken';

const getAllUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.getAllUser();

    sendResponse<IUser[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user retrieved successfully!',
      data: result,
    });
  }
);

const getUserByTokenId: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userInfo = req.user as JwtPayload;
    const result = await UserService.getUserById(userInfo._id);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user retrieved successfully!',
      data: result,
    });
  }
);

const getUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await UserService.getUserById(id);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user retrieved successfully!',
      data: result,
    });
  }
);
const updateUserByTokenId: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userInfo = req.user as JwtPayload;
    const id = userInfo._id;
    const updateAbleData = req.body;

    const result = await UserService.updateUser(id, updateAbleData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user retrieved successfully!',
      data: result,
    });
  }
);
const updateUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await UserService.updateUser(id, updateAbleData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user retrieved successfully!',
      data: result,
    });
  }
);

const deleteUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await UserService.deleteUser(id);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user deleted successfully!',
      data: result,
    });
  }
);
export const UserController = {
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByTokenId,
  updateUserByTokenId,
};
