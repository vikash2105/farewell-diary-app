import { Router } from 'express';
import authRoutes from './authRoutes';
import diaryRoutes from './diaryRoutes';
import farewellNoteRoutes from './farewellNoteRoutes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/diary', diaryRoutes);
router.use('/notes', farewellNoteRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Farewell Diary API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
