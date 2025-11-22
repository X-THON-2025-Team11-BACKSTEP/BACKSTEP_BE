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
import projectRoutes from './project/routes/project.routes';
import { globalErrorHandler } from './common/middleware/errorHandler';
import { NotFoundError } from './common/error/AppError';

app.use(passport.initialize());

// 디버깅용 미들웨어 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

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