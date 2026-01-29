/**
 * User Routes
 * Requires authentication
 */

import express, { Request } from "express";
import multer, { FileFilterCallback } from "multer";

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
 * Multer file filter (STRICTLY TYPED)
 */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};

/**
 * Multer configuration
 */
const upload = multer({
  dest: "uploads/temp/",
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter,
});

// ==============================
// AUTHENTICATION (ALL ROUTES)
// ==============================
router.use(requireAuth);

// ==============================
// PROFILE ROUTES
// ==============================
router.get("/profile", getProfile);
router.patch("/profile", updateProfile);

// ==============================
// AVATAR ROUTES
// ==============================
router.post(
  "/avatar",
  uploadLimiter,
  upload.single("avatar"),
  uploadAvatar
);

router.delete("/avatar", removeAvatar);

export default router;
