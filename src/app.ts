import express, { Application } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport Config
import './auth/utils/passport.config';
import passport from 'passport';

// Routes
import authRoutes from './auth/routes/auth.routes';
import userRoutes from './user/routes/user.routes';
import { globalErrorHandler } from './common/middleware/errorHandler';
import { NotFoundError } from './common/error/AppError';

app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 404 Handler
app.use((req, res, next) => {
  next(new NotFoundError('Resource not found'));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;

