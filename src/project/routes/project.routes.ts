import { Router } from 'express';
import { ProjectController } from '../controller/project.controller';
import { authenticateJwt } from '../../auth/middleware/auth.middleware';

const router = Router();
const projectController = new ProjectController();

// POST /projects/:projectId/helpful - Add helpful mark to project (더 구체적인 라우트를 먼저)
router.post('/:projectId/helpful', authenticateJwt, projectController.addHelpful);

// POST /projects - 프로젝트 업로드
router.post(
  '/',
  authenticateJwt,
  projectController.createProject
);

export default router;

