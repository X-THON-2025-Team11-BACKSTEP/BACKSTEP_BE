import { Router } from 'express';
import { UserController } from '../controller/user.controller';
import { authenticateJwt } from '../../auth/middleware/auth.middleware';

const router = Router();
const userController = new UserController();

// GET /users/me - Get current authenticated user info (to check user_id)
router.get('/me', authenticateJwt, userController.getCurrentUser);

// PATCH /users - Update user information
router.patch('/', authenticateJwt, userController.updateUser);

// GET /users/:userId/helpful - Get helpful projects for a user
router.get('/:userId/helpful', authenticateJwt, userController.getHelpfulProjects);

// GET /users/:userId/post - Get user's posts (projects)
router.get('/:userId/post', authenticateJwt, userController.getUserPosts);

// GET /users/:userId/purchase - Get user's purchased projects
router.get('/:userId/purchase', authenticateJwt, userController.getPurchasedProjects);

// GET /users/:userId - Get user profile
router.get('/:userId', authenticateJwt, userController.getUserProfile);

// POST /projects/:projectId/helpful - Add helpful (like)
router.post('/projects/:projectId/helpful', authenticateJwt, userController.addHelpful);

// DELETE /projects/:projectId/helpful - Remove helpful (unlike)
router.delete('/projects/:projectId/helpful', authenticateJwt, userController.removeHelpful);

// POST /projects/:projectId/purchase - Purchase project
router.post('/projects/:projectId/purchase', authenticateJwt, userController.purchaseProject);

export default router;

