import multer from 'multer';
import DataParser from 'datauri/parser.js';
import path from 'path';

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const parser = new DataParser();

export const formatImage = (file) => {
  // console.log(file);
  const fileExtension = path.extname(file.originalname).toString();
  return parser.format(fileExtension, file.buffer).content;
};

export default upload;
// i can store the files in memory storage or disk storage
// i choose disk storage because i will store it in cloudinary

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads');
//   },
//   filename: (req, file, cb) => {
//     const fileName = file.originalname;
//     cb(null, fileName);
//   },
// });

// const upload = multer({ storage: storage });
