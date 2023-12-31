import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';

// security packages
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

// routers
import jobRouter from './routes/jobRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import connectDB from './db/connect.js';

// public folder
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

//middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.set('trust proxy', 1);

const __dirname = dirname(fileURLToPath(import.meta.url));
// app.use(express.static(path.resolve(__dirname, './public')));
app.use(express.static(path.resolve(__dirname, '../client/dist')));

app.use(cookieParser());
app.use(express.json());

app.use(helmet());
app.use(mongoSanitize());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.use('/api/v1/jobs', authenticateUser, jobRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/auth', authRouter);

// index.html
app.get('*', (req, res) => {
  // res.sendFile(path.resolve(__dirname, './public', 'index.html'));
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

// page not found(404) middleware
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'page not found' });
});

// error middleware
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
