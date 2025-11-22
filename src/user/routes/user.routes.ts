import { Router } from 'express';
import { UserController } from '../controller/user.controller';
import { authenticateJwt } from '../../auth/middleware/auth.middleware';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user description
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 */
router.get('/me', authenticateJwt, userController.getCurrentUser);

/**
 * @swagger
 * /api/users:
 *   patch:
 *     summary: Update user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *               profile_image:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 */
router.patch('/', authenticateJwt, userController.updateUser);

/**
 * @swagger
 * /api/users/{userId}/helpful:
 *   get:
 *     summary: Get projects marked as helpful by user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of helpful projects
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         data_total:
 *                           type: integer
 *                         projects:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Project'
 */
router.get('/:userId/helpful', authenticateJwt, userController.getHelpfulProjects);

/**
 * @swagger
 * /api/users/{userId}/post:
 *   get:
 *     summary: Get projects posted by user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user projects
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         data_total:
 *                           type: integer
 *                         projects:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Project'
 */
router.get('/:userId/post', authenticateJwt, userController.getUserPosts);

/**
 * @swagger
 * /api/users/{userId}/purchase:
 *   get:
 *     summary: Get projects purchased by user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of purchased projects
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         data_total:
 *                           type: integer
 *                         projects:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Project'
 */
router.get('/:userId/purchase', authenticateJwt, userController.getPurchasedProjects);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 */
router.get('/:userId', authenticateJwt, userController.getUserProfile);

/**
 * @swagger
 * /api/users/projects/{projectId}/helpful:
 *   post:
 *     summary: Mark a project as helpful
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Marked as helpful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post('/projects/:projectId/helpful', authenticateJwt, userController.addHelpful);

/**
 * @swagger
 * /api/users/projects/{projectId}/helpful:
 *   delete:
 *     summary: Remove helpful mark from a project
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Removed helpful mark
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.delete('/projects/:projectId/helpful', authenticateJwt, userController.removeHelpful);

/**
 * @swagger
 * /api/users/projects/{projectId}/purchase:
 *   post:
 *     summary: Purchase a project
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: integer
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Project purchased
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 */
router.post('/projects/:projectId/purchase', authenticateJwt, userController.purchaseProject);

export default router;

