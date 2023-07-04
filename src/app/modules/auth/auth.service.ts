import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';
import { ILogin, ILoginResponse } from '../admin/admin.interface';
import { IRefreshTokenResponse } from './auth.Interface';

const createUser = async (
  user: IUser
): Promise<Omit<IUser, 'password'> | null> => {
  // checking is user buyer
  if (user.role === 'buyer' && !user.budget) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'buyer must be have budget');
  }
  if (user.role === 'seller' && user.budget > 0) {
    user.budget = 0;
  }

  //make income 0
  user.income = 0;

  const newUser = await User.create(user);
  // eslint-disable-next-line no-unused-vars
  const { password, ...data } = newUser.toObject();
  return data;
};

const loginUser = async (payload: ILogin): Promise<ILoginResponse> => {
  const { phoneNumber: givenPhoneNumber, password } = payload;

  const isUserExist = await User.isUserExist(givenPhoneNumber);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token & refresh token

  const { role, _id } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { _id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { _id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { _id } = verifiedToken;
  // checking deleted user's refresh token

  const isUserExist = await User.findById(_id);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new Access token

  const newAccessToken = jwtHelpers.createToken(
    {
      _id: isUserExist._id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
};
