import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', authenticate, UserController.getProfile);
router.patch('/me', authenticate, UserController.updateProfile);
router.get('/search', authenticate, UserController.searchUsers);
router.get('/blocked', authenticate, UserController.getBlockedUsers);
router.get('/:id', authenticate, UserController.getUserById);
router.post('/:id/block', authenticate, UserController.blockUser);
router.delete('/:id/block', authenticate, UserController.unblockUser);

export default router;
