import { Router } from 'express';
import { ProjectController } from '../controller/project.controller';
import { authenticateJwt } from '../../auth/middleware/auth.middleware';

const router = Router();
const projectController = new ProjectController();

// POST /projects - 프로젝트 업로드
router.post(
  '/',
  authenticateJwt,
  projectController.createProject
);

// GET /projects/:projectId - 프로젝트 조회
router.get(
  '/:projectId',
  authenticateJwt,
  projectController.getProject
);

// PATCH /projects/:projectId - 프로젝트 수정
router.patch(
  '/:projectId',
  authenticateJwt,
  projectController.updateProject
);

export default router;

