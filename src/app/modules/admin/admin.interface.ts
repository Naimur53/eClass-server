/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IAdmin = {
  phoneNumber: string;
  _id?: string;
  role: 'admin' | 'seller' | 'buyer';
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
};

export type ILogin = {
  phoneNumber: string;
  password: string;
};
export type ILoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type AdminModel = {
  isAdminExist(
    phoneNumber: string
  ): Promise<Pick<IAdmin, '_id' | 'phoneNumber' | 'password' | 'role'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IAdmin>;

// interface IAdminWithId extends IAdmin {
//     _id: string;
//   }
// export type AdminModel = Model<IAdmin, Record<string, unknown>>;
