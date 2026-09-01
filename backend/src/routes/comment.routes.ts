import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

// Mounted under /api/v1/posts/:postId/comments and /api/v1/comments
router.post('/', authenticate, CommentController.createComment);
router.get('/', authenticate, CommentController.getComments);
router.patch('/:id', authenticate, CommentController.updateComment);
router.delete('/:id', authenticate, CommentController.deleteComment);

export default router;
