import { Router } from 'express';
import { CommunityController } from '../controllers/community.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, CommunityController.getCommunities);
router.post('/', authenticate, CommunityController.createCommunity);
router.get('/:id', optionalAuth, CommunityController.getCommunityById);
router.patch('/:id', authenticate, CommunityController.updateCommunity);
router.delete('/:id', authenticate, CommunityController.deleteCommunity);
router.post('/:id/join', authenticate, CommunityController.joinCommunity);
router.post('/:id/leave', authenticate, CommunityController.leaveCommunity);
router.get('/:id/members', optionalAuth, CommunityController.getCommunityMembers);

export default router;
