import { Router } from 'express';
import { ImageController } from '../controller/image.controller';
import { authenticateJwt } from '../../auth/middleware/auth.middleware';

const router = Router();
const imageController = new ImageController();

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: Image management API (AWS S3)
 */

/**
 * @swagger
 * /api/images/presigned:
 *   post:
 *     summary: Generate S3 Presigned URL for image upload
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filename
 *               - fileType
 *               - type
 *             properties:
 *               filename:
 *                 type: string
 *                 description: Original filename
 *                 example: profile.jpg
 *               fileType:
 *                 type: string
 *                 description: MIME type (image/jpeg, image/png, etc.)
 *                 example: image/jpeg
 *               type:
 *                 type: string
 *                 enum: [profile, project]
 *                 description: Image usage type (profile or project)
 *                 example: profile
 *     responses:
 *       200:
 *         description: Presigned URL generated successfully
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
 *                         presignedUrl:
 *                           type: string
 *                           description: URL to upload file to (PUT request)
 *                         publicUrl:
 *                           type: string
 *                           description: Public URL to access the file after upload
 *                         key:
 *                           type: string
 *                           description: S3 object key
 */
router.post('/presigned', authenticateJwt, imageController.getPresignedUrl);

export default router;
