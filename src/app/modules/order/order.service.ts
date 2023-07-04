import mongoose from 'mongoose';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { Cow } from '../cow/cow.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { JwtPayload } from 'jsonwebtoken';
import { ICow } from '../cow/cow.interface';

const createOrder = async (payload: IOrder): Promise<IOrder | null> => {
  const cowId = payload.cow;
  const buyerId = payload.buyer;

  const cow = await Cow.findOne({
    _id: cowId,
    label: 'for sale',
  });
  const buyer = await User.findOne({ _id: buyerId, role: 'buyer' });

  if (!cow) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cow not found!');
  }
  if (!buyer) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Buyer not found!');
  }

  //   checking seller exits or not
  const seller = await User.findOne({ _id: cow.seller, role: 'seller' });
  if (!seller) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Seller not found maybe seller account has been deleted!'
    );
  }

  //   checking does buyer have money
  if (cow.price > buyer.budget) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Buyer doesn't have enough budget to buy!"
    );
  }

  //   start session
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // change cow label to sold
    await Cow.findOneAndUpdate(
      { _id: cowId },
      { label: 'sold out' },
      { session }
    );
    // update seller Income
    await User.findOneAndUpdate(
      { _id: seller._id },
      { $inc: { income: cow.price } },
      { session }
    );

    // update buyer budget
    await User.findOneAndUpdate(
      { _id: buyer._id },
      { $inc: { budget: -cow.price } },
      { session }
    );
    const orderInfo = await Order.create({
      cow: cowId,
      buyer: buyerId,
    });
    await session.commitTransaction();
    await session.endSession();
    return orderInfo;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

const getAllOrders = async (): Promise<IOrder[] | null> => {
  const allORders = await Order.find({}).populate([
    { path: 'seller' },
    { path: 'buyer' },
    { path: 'cow' },
  ]);
  return allORders;
};

const getSingleOrder = async (
  user: JwtPayload,
  id: string
): Promise<IOrder | null> => {
  const getOrders = await Order.findOne({ _id: id })
    .populate([
      { path: 'buyer' },
      { path: 'cow', populate: { path: 'seller' } },
    ])
    .lean();

  // not found  null
  if (!getOrders) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Orders not found!');
  }

  //check buyer ore seller
  if (user.role === ENUM_USER_ROLE.BUYER) {
    // buyer
    if (getOrders?.buyer._id?.toString() !== user._id) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden!');
    }
  } else if (user.role === ENUM_USER_ROLE.SELLER) {
    // seller
    const cow = getOrders?.cow as ICow;

    if (cow.seller._id?.toString() !== user._id) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden!');
    }
  }

  return getOrders;
};
export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
};
