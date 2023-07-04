import { IAdmin, ILoginResponse } from './admin.interface';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';
import config from '../../../config';

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const info = req.body;
    const result = await AdminService.createAdmin(info);

    sendResponse<Pick<IAdmin, 'name' | 'role' | 'address' | 'phoneNumber'>>(
      res,
      {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin created successfully!',
        data: result,
      }
    );
  }
);

const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = req.body;
  const result = await AdminService.loginAdmin(loginInfo);
  const { refreshToken, ...others } = result;

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User lohggedin successfully !',
    data: others,
  });
});

export const AdminController = {
  createAdmin,
  loginAdmin,
};
