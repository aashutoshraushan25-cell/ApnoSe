import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import postRoutes from './post.routes';
import commentRoutes from './comment.routes';
import friendRoutes from './friend.routes';
import familyRoutes from './family.routes';
import messageRoutes from './message.routes';
import communityRoutes from './community.routes';
import notificationRoutes from './notification.routes';
import reportRoutes from './report.routes';
import birthdayRoutes from './birthday.routes';
import searchRoutes from './search.routes';
import { uploadSingleImage, uploadMultipleMedia } from '../middleware/upload.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// Health Check API
router.get('/health', (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  return sendSuccess(res, {
    status: 'healthy',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Secure Media Upload APIs
router.post('/upload/single', authenticate, (req: Request, res: Response): any => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      return sendError(res, err.message, 400, 'UPLOAD_ERROR');
    }
    if (!req.file) {
      return sendError(res, 'फ़ाइल अपलोड नहीं की गई।', 400, 'NO_FILE_PROVIDED');
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    return sendSuccess(res, { url: fileUrl, filename: req.file.filename, size: req.file.size });
  });
});

router.post('/upload/multiple', authenticate, (req: Request, res: Response): any => {
  uploadMultipleMedia(req, res, (err) => {
    if (err) {
      return sendError(res, err.message, 400, 'UPLOAD_ERROR');
    }
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return sendError(res, 'कोई फ़ाइल नहीं मिली।', 400, 'NO_FILES_PROVIDED');
    }

    const fileUrls = files.map((f) => ({
      url: `/uploads/${f.filename}`,
      filename: f.filename,
      size: f.size,
    }));
    return sendSuccess(res, fileUrls);
  });
});

// Mount modular sub-routers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/posts/:postId/comments', commentRoutes);
router.use('/comments', commentRoutes);
router.use('/friends', friendRoutes);
router.use('/family', familyRoutes);
router.use('/', messageRoutes); // provides /conversations and /messages
router.use('/communities', communityRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/birthdays', birthdayRoutes);
router.use('/search', searchRoutes);

export default router;
