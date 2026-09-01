import { Router } from 'express';
import { SearchController } from '../controllers/search.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, SearchController.searchAll);

export default router;
