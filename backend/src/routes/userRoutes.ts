/**
 * User Routes
 * Handles user profile and avatar management
 * Requires authentication for all routes
 */

import express from "express";
import multer from "multer";

import {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
} from "../controllers/userController";
import { requireAuth } from "../middleware/auth";
import { uploadLimiter } from "../middleware/rateLimit";

const router = express.Router();

/**
 * Multer file filter
 * Validates file types before upload
 * 
 * @param _req - Express request (unused)
 * @param file - Uploaded file
 * @param cb - Callback to accept/reject file
 */
const fileFilter = (
  _req: express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    // Accept file
    cb(null, true);
  } else {
    // Reject file with error
    cb(new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."));
  }
};

/**
 * Multer upload configuration
 * - Destination: uploads/temp/ (temporary storage)
 * - Size limit: 2MB
 * - File type: Images only (via fileFilter)
 */
const upload = multer({
  dest: "uploads/temp/",
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max
  },
  fileFilter,
});

// ==============================
// APPLY AUTHENTICATION TO ALL ROUTES
// ==============================
router.use(requireAuth);

// ==============================
// PROFILE MANAGEMENT ROUTES
// ==============================

/**
 * GET /api/user/profile
 * Retrieve current user's profile information
 */
router.get("/profile", getProfile);

/**
 * PATCH /api/user/profile
 * Update user profile (name, username, bio)
 */
router.patch("/profile", updateProfile);

// ==============================
// AVATAR MANAGEMENT ROUTES
// ==============================

/**
 * POST /api/user/avatar
 * Upload user profile picture
 * - Rate limited (uploadLimiter)
 * - Single file upload (field name: 'avatar')
 * - File validation (type, size)
 */
router.post(
  "/avatar",
  uploadLimiter,
  upload.single("avatar"),
  uploadAvatar
);

/**
 * DELETE /api/user/avatar
 * Remove user profile picture
 */
router.delete("/avatar", removeAvatar);

export default router;
