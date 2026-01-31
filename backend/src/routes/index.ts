import { Router } from 'express';
import authRoutes from './authRoutes';
import diaryRoutes from './diaryRoutes';
import farewellNoteRoutes from './farewellNoteRoutes';
import userRoutes from './userRoutes';
import publicRoutes from './publicRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/diary', diaryRoutes);
router.use('/notes', farewellNoteRoutes);
router.use('/user', userRoutes);
router.use('/public', publicRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Farewell Diary API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
