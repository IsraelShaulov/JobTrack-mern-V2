import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import Job from '../models/JobModel.js';
import cloudinary from 'cloudinary';
import { promises as fs } from 'fs';
import { formatImage } from '../middleware/multerMiddleware.js';

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select('-password');
  res.status(StatusCodes.OK).json({ user });
};

// admin route - check how many users and jobs i have in my app
export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();
  res.status(StatusCodes.OK).json({ users: users, jobs: jobs });
};

export const updateUser = async (req, res) => {
  // console.log(req.file);
  // restrict user to try change password/role with req.body
  const newUserObject = { ...req.body };
  delete newUserObject.password;
  delete newUserObject.role;

  if (req.file) {
    const file = formatImage(req.file);

    // upload to cloudinary
    const response = await cloudinary.v2.uploader.upload(file);

    // create new properties to the object
    newUserObject.avatar = response.secure_url;
    newUserObject.avatarPublicId = response.public_id;
  }

  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user.userId },
    newUserObject
  );

  // if user update the avatar and i have already old avatar
  // i want to remove the old avatar from cloudinary
  if (req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
  }

  res.status(StatusCodes.OK).json({ msg: 'update user' });
};

// old... its with diskStorage(avatar) - just deleted the line await fs.unlink(req.file.path);
// export const updateUser = async (req, res) => {
//   // console.log(req.file);
//   // restrict user to try change password/role with req.body
//   const newUserObject = { ...req.body };
//   delete newUserObject.password;
//   delete newUserObject.role;

//   if (req.file) {
//     // upload to cloudinary
//     const response = await cloudinary.v2.uploader.upload(req.file.path);
//     // delete from my local computer the image
//     await fs.unlink(req.file.path);
//     // create new properties to the object
//     newUserObject.avatar = response.secure_url;
//     newUserObject.avatarPublicId = response.public_id;
//   }

//   const updatedUser = await User.findByIdAndUpdate(
//     { _id: req.user.userId },
//     newUserObject
//   );

//   // if user update the avatar and i have already old avatar
//   // i want to remove the old avatar from cloudinary
//   if (req.file && updatedUser.avatarPublicId) {
//     await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
//   }

//   res.status(StatusCodes.OK).json({ msg: 'update user' });
// };
