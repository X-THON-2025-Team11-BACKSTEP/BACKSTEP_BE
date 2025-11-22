import { Router } from 'express';
import { ImageController } from '../controller/image.controller';
import { authenticateJwt } from '../../auth/middleware/auth.middleware';

const router = Router();
const imageController = new ImageController();

// Presigned URL route (Requires Authentication)
router.post('/presigned', authenticateJwt, imageController.getPresignedUrl);

export default router;
