import { Router } from 'express';
import { ProjectController } from '../controller/project.controller';
import { authenticateJwt } from '../../auth/middleware/auth.middleware';

const router = Router();
const projectController = new ProjectController();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management API
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - period
 *               - personnel
 *               - intent
 *               - my_role
 *               - growth_point
 *               - sale_status
 *               - is_free
 *               - price
 *               - failure_category
 *               - failure
 *             properties:
 *               name:
 *                 type: string
 *               period:
 *                 type: string
 *               personnel:
 *                 type: integer
 *               intent:
 *                 type: string
 *               my_role:
 *                 type: string
 *               growth_point:
 *                 type: string
 *               sale_status:
 *                 type: string
 *                 enum: [NOTSALE, FREE, ONSALE]
 *               is_free:
 *                 type: boolean
 *               price:
 *                 type: integer
 *               result_url:
 *                 type: string
 *               image:
 *                 type: string
 *               failure_category:
 *                 type: array
 *                 items:
 *                   type: string
 *               failure:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Project created successfully
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
 *                         name:
 *                           type: string
 *                         project_id:
 *                           type: integer
 *                         project_image:
 *                           type: string
 *                         user:
 *                           type: string
 *                         user_id:
 *                           type: integer
 *                         nickname:
 *                           type: string
 *                         profile_image:
 *                           type: string
 */
router.post(
  '/',
  authenticateJwt,
  projectController.createProject
);

/**
 * @swagger
 * /api/projects/popular:
 *   get:
 *     summary: Get top 7 popular projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of popular projects
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
 *                         projects:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               project_id:
 *                                 type: integer
 *                               helpful_count:
 *                                 type: integer
 *                               user:
 *                                 type: string
 */
router.get(
  '/popular',
  projectController.getPopularProjects
);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   get:
 *     summary: Get project details
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
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
 *                         name:
 *                           type: string
 *                         project_id:
 *                           type: integer
 *                         helpful_count:
 *                           type: integer
 *                         is_helpful:
 *                           type: boolean
 *                         user:
 *                           type: string
 */
router.get(
  '/:projectId',
  projectController.getProject
);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   patch:
 *     summary: Update project
 *     tags: [Projects]
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
 *               name:
 *                 type: string
 *               period:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.patch(
  '/:projectId',
  authenticateJwt,
  projectController.updateProject
);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
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
 *         description: Project deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.delete(
  '/:projectId',
  authenticateJwt,
  projectController.deleteProject
);

export default router;

