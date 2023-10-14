import multer from 'multer';

// i can store the files in memory storage or disk storage
// i choose disk storage because i will store it in cloudinary

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

export default upload;
