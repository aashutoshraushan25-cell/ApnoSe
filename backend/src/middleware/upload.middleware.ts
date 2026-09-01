import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { env } from '../config/env';
import { AppError } from './error.middleware';

// Ensure upload directory exists
const uploadDirectory = path.join(process.cwd(), env.UPLOAD_DIR);
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate safe, collision-free filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, safeName);
  },
});

// File Filter for Images and Videos
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('अमान्य फ़ाइल प्रारूप (Unsupported file format). केवल JPEG, PNG, WEBP, MP4, WebM समर्थित हैं।', 400, 'INVALID_FILE_TYPE'));
  }
};

const maxFileSize = env.UPLOAD_MAX_FILE_SIZE_MB * 1024 * 1024;

export const uploadSingleImage = multer({
  storage,
  limits: { fileSize: maxFileSize },
  fileFilter,
}).single('file');

export const uploadMultipleMedia = multer({
  storage,
  limits: { fileSize: maxFileSize },
  fileFilter,
}).array('files', 10);
