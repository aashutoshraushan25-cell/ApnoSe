import { Router } from 'express';
import { FriendController } from '../controllers/friend.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, FriendController.getFriends);
router.get('/requests', authenticate, FriendController.getFriendRequests);
router.get('/suggestions', authenticate, FriendController.getSuggestions);
router.post('/:userId/request', authenticate, FriendController.sendFriendRequest);
router.post('/:userId/accept', authenticate, FriendController.acceptFriendRequest);
router.post('/:userId/reject', authenticate, FriendController.rejectFriendRequest);
router.delete('/:userId', authenticate, FriendController.removeFriend);

export default router;
