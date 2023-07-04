import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CowService } from './cow.service';
import { ICow } from './cow.interface';
import pick from '../../../shared/pick';
import { cowFilterByPrice, cowSearchableFields } from './cow.constant';
import { paginationFields } from '../../../constants/pagination';

const createCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const cowData = req.body;

    const result = await CowService.createCow(cowData);
    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow Created successfully!',
      data: result,
    });
  }
);

const getAllCow = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    ...cowSearchableFields,
    ...cowFilterByPrice,
  ]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CowService.getAllCow(filters, paginationOptions);

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const updateCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await CowService.updateCow(id, updateAbleData);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow Updated successfully!',
      data: result,
    });
  }
);
const getSingleCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CowService.getSingleCow(id);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow retrieved  successfully!',
      data: result,
    });
  }
);
const deleteCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CowService.deleteCow(id);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow deleted successfully!',
      data: result,
    });
  }
);

export const CowController = {
  getAllCow,
  createCow,
  updateCow,
  getSingleCow,
  deleteCow,
};
