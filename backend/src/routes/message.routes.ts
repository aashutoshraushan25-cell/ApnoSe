import { Router } from 'express';
import { MessageController } from '../controllers/message.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/conversations', authenticate, MessageController.getConversations);
router.post('/conversations', authenticate, MessageController.createOrGetConversation);
router.get('/conversations/:id/messages', authenticate, MessageController.getMessages);
router.post('/conversations/:id/messages', authenticate, MessageController.sendMessage);
router.post('/conversations/:id/read', authenticate, MessageController.markRead);
router.delete('/messages/:id', authenticate, MessageController.deleteMessage);

export default router;
