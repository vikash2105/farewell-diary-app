/**
 * User Routes
 * Requires authentication
 */

import express from 'express';
import multer from 'multer';
import { 
  getProfile, 
  updateProfile, 
  uploadAvatar, 
  removeAvatar 
} from '../controllers/userController';
import { requireAuth } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimit';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/temp/',
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// All routes require authentication
router.use(requireAuth);

// Profile routes
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

// Avatar routes
router.post('/avatar', uploadLimiter, upload.single('avatar'), uploadAvatar);
router.delete('/avatar', removeAvatar);

export default router;
