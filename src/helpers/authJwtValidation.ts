import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';
import { jwtHelpers } from './jwtHelpers';
import config from '../config';
import { Secret } from 'jsonwebtoken';

function authJwtValidation(
  token: string | undefined,
  requiredRoles: string[]
): any {
  // if no token found
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }
  // verify token
  let verifiedUser = null;

  verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

  // role guard
  if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  return verifiedUser;
}
export default authJwtValidation;
