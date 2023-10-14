import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';

export const authenticateUser = (req, res, next) => {
  // console.log(req.cookies);
  // verify the cookie
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError('authentication invalid');
  }
  // verify the jwt is valid
  try {
    const { userId, role } = verifyJWT(token);
    // check for test user
    const testUser = userId === '6519c86f8061ddc78b3fecc8';
    req.user = { userId: userId, role: role, testUser: testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid');
  }
};

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError('Demo User. Read Only!');
  }
  next();
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    // console.log(roles);
    if (roles.includes(req.user.role) === false) {
      throw new UnauthorizedError('Unauthorized to access admin route');
    }
    next();
  };
};
