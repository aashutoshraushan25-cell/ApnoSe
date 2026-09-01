import { Router } from 'express';
import { z } from 'zod';
import { PostController } from '../controllers/post.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

const createPostSchema = z.object({
  body: z.object({
    content: z.string().optional(),
    media: z.array(z.string()).optional(),
    mediaType: z.enum(['text', 'image', 'video', 'audio']).optional(),
    visibility: z.enum(['public', 'friends', 'family', 'private']).optional(),
    location: z.string().optional(),
    feeling: z.string().optional(),
    isEncrypted: z.boolean().optional(),
    encryptedData: z.string().optional(),
  }),
});

router.post('/', authenticate, validate(createPostSchema), PostController.createPost);
router.get('/feed', authenticate, PostController.getFeed);
router.get('/:id', authenticate, PostController.getPostById);
router.patch('/:id', authenticate, PostController.updatePost);
router.delete('/:id', authenticate, PostController.deletePost);
router.post('/:id/like', authenticate, PostController.reactToPost);
router.delete('/:id/like', authenticate, PostController.removeReaction);
router.post('/:id/share', authenticate, PostController.sharePost);

export default router;
