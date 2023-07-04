import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { cowSearchableFields } from './cow.constant';
import { ICow, ICowFilters, IFilterByPrice } from './cow.interface';
import { Cow } from './cow.model';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const getAllCow = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  // all cow
  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  const filterByPrice: Partial<IFilterByPrice> = {};

  //   add filtering by min max
  if (minPrice) {
    filterByPrice['$gte'] = parseInt(minPrice);
  }
  if (maxPrice) {
    filterByPrice['$lte'] = parseInt(maxPrice);
  }

  if (Object.keys(filterByPrice).length) {
    andConditions.push({ price: filterByPrice });
  }

  //   search text
  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  // make and query
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Cow.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate('seller');

  const total = await Cow.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const createCow = async (payload: ICow): Promise<ICow | null> => {
  const newCow = (await Cow.create(payload)).populate('seller');
  return newCow;
};

const updateCow = async (
  id: string,
  payload: Partial<ICow>
): Promise<ICow | null> => {
  if (payload.seller) {
    const isSellerExits = await User.findById(payload.seller);
    if (!isSellerExits) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'seller not found!');
    }
  }
  const result = await Cow.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate('seller');
  return result;
};
const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id).populate('seller');
  return result;
};

const deleteCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findByIdAndDelete(id).populate('seller');
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found!');
  }
  return result;
};

export const CowService = {
  getAllCow,
  createCow,
  updateCow,
  getSingleCow,
  deleteCow,
};
