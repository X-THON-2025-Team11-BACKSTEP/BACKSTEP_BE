import { Router } from 'express';
import { SearchController } from '../controller/search.controller';
import { authenticateJwt } from '../../auth/middleware/auth.middleware';

const router = Router();
const searchController = new SearchController();

// POST /search - 검색
router.post(
  '/',
  authenticateJwt,
  searchController.search
);

export default router;

