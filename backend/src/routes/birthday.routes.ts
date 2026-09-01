import { Router } from 'express';
import { BirthdayController } from '../controllers/birthday.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/today', authenticate, BirthdayController.getTodayBirthdays);
router.get('/upcoming', authenticate, BirthdayController.getUpcomingBirthdays);

export default router;
