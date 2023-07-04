import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IAdmin, ILogin, ILoginResponse } from './admin.interface';
import { Admin } from './admin.model';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

const createAdmin = async (
  info: IAdmin
): Promise<Pick<
  IAdmin,
  'name' | 'role' | 'address' | 'phoneNumber'
> | null> => {
  const newAdmin = await Admin.create(info);
  //   deleting password
  // eslint-disable-next-line no-unused-vars
  const { password, ...data } = newAdmin.toObject();
  return data;
};

const loginAdmin = async (payload: ILogin): Promise<ILoginResponse> => {
  const { phoneNumber: givenPhoneNumber, password } = payload;

  //   check is admin exits with phone number
  const isAdminExist = await Admin.isAdminExist(givenPhoneNumber);

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (
    isAdminExist.password &&
    !(await Admin.isPasswordMatched(password, isAdminExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token & refresh token

  const { role, _id } = isAdminExist;
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

export const AdminService = {
  createAdmin,
  loginAdmin,
};
