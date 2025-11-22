import { Router } from 'express';
import { UserController } from '../controller/user.controller';
import { authenticateJwt } from '../../auth/middleware/auth.middleware';

const router = Router();
const userController = new UserController();

// PATCH /users - Update user information
router.patch('/', authenticateJwt, userController.updateUser);

export default router;

