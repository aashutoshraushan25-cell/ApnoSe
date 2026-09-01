import { Router } from 'express';
import { FamilyController } from '../controllers/family.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, FamilyController.addFamilyMember);
router.get('/', authenticate, FamilyController.getFamilyMembers);
router.patch('/:id', authenticate, FamilyController.updateFamilyMember);
router.delete('/:id', authenticate, FamilyController.removeFamilyMember);

export default router;
