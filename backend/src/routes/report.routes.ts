import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, ReportController.createReport);
router.get('/', authenticate, requireRole(['moderator', 'admin']), ReportController.getReports);
router.patch('/:id', authenticate, requireRole(['moderator', 'admin']), ReportController.updateReportStatus);

export default router;
