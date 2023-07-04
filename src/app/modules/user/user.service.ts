import httpStatus from 'http-status';
import { IUser } from './user.interface';
import { User } from './user.model';
import ApiError from '../../../errors/ApiError';
import bcrypt from 'bcrypt';
import config from '../../../config';

const getAllUser = async (): Promise<IUser[] | null> => {
  // all users
  const allUsers = await User.find({});

  return allUsers;
};
const getUserById = async (id: string): Promise<IUser | null> => {
  //  users
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }
  return user;
};
const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');
  }

  const { name, password, ...userData } = payload;

  const updatedUserData: Partial<IUser> = { ...userData };

  // if password exits
  if (password) {
    updatedUserData.password = await bcrypt.hash(
      password,
      Number(config.bycrypt_salt_rounds)
    );
  }

  // handle if user role change
  if (isExist.role !== updatedUserData.role) {
    if (updatedUserData.role === 'buyer') {
      if (!updatedUserData.budget) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'minimum budget require to change role to buyer'
        );
      } else {
        // update role to buyer so change income to 0
        updatedUserData.income = 0;
      }
    } else if (updatedUserData.role === 'seller') {
      updatedUserData.budget = 0;
    }
  }
  // dynamically handling

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>; // `name.fisrtName`
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findByIdAndUpdate(id, updatedUserData, {
    new: true,
  });
  return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  //  users
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
  return user;
};

export const UserService = {
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
};
