/**
 * User Controller
 * Handles user profile management
 */

import { Request, Response } from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { eq, and, ne } from "drizzle-orm";
import { sanitizeText, sanitizeUsername } from "../utils/sanitize";

/**
 * GET /api/user/profile
 * Get current user's profile
 */
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const result = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        username: users.username,
        bio: users.bio,
        profilePicture: users.profilePicture,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!result.length) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("❌ getProfile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

/**
 * PATCH /api/user/profile
 * Update user profile
 */
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { name, username, bio } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    // ==============================
    // Validate & sanitize name
    // ==============================
    if (
      !name ||
      typeof name !== "string" ||
      name.length < 2 ||
      name.length > 255
    ) {
      res.status(400).json({
        error: "Invalid name",
        message: "Name must be between 2 and 255 characters",
      });
      return;
    }

    // ✅ CORRECT TYPE FOR DRIZZLE UPDATE
    const updateData: Partial<typeof users.$inferInsert> = {
      name: sanitizeText(name, 255),
      updatedAt: new Date(),
    };

    // ==============================
    // Username handling
    // ==============================
    if (username !== undefined) {
      if (username === null || username.trim() === "") {
        updateData.username = null;
      } else {
        try {
          const sanitizedUsername = sanitizeUsername(username);

          const existing = await db
            .select({ id: users.id })
            .from(users)
            .where(
              and(
                eq(users.username, sanitizedUsername),
                ne(users.id, userId)
              )
            )
            .limit(1);

          if (existing.length > 0) {
            res.status(400).json({
              error: "Username taken",
              message: "This username is already in use",
            });
            return;
          }

          updateData.username = sanitizedUsername;
        } catch (err: any) {
          res.status(400).json({
            error: "Invalid username",
            message: err.message,
          });
          return;
        }
      }
    }

    // ==============================
    // Bio handling
    // ==============================
    if (bio !== undefined) {
      if (bio === null || bio.trim() === "") {
        updateData.bio = null;
      } else if (typeof bio !== "string" || bio.length > 500) {
        res.status(400).json({
          error: "Bio too long",
          message: "Bio must be less than 500 characters",
        });
        return;
      } else {
        updateData.bio = sanitizeText(bio, 500);
      }
    }

    await db.update(users).set(updateData).where(eq(users.id, userId));

    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("❌ updateProfile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

/**
 * POST /api/user/avatar
 * Upload user avatar (placeholder implementation)
 */
export const uploadAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const file = req.file;

    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!file) {
      res.status(400).json({
        error: "No file uploaded",
        message: "Please select an image to upload",
      });
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      res.status(400).json({
        error: "Invalid file type",
        message: "Only JPEG, PNG, WebP, and GIF images are allowed",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      res.status(400).json({
        error: "File too large",
        message: "Image must be less than 2MB",
      });
      return;
    }

    // Placeholder URL (cloud storage later)
    const avatarUrl = `/uploads/avatars/${userId}/${file.filename}`;

    await db
      .update(users)
      .set({
        profilePicture: avatarUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    res.json({
      success: true,
      avatarUrl,
      message: "Avatar uploaded successfully",
    });
  } catch (error) {
    console.error("❌ uploadAvatar error:", error);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
};

/**
 * DELETE /api/user/avatar
 * Remove user avatar
 */
export const removeAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    await db
      .update(users)
      .set({
        profilePicture: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    res.json({
      success: true,
      message: "Avatar removed successfully",
    });
  } catch (error) {
    console.error("❌ removeAvatar error:", error);
    res.status(500).json({ error: "Failed to remove avatar" });
  }
};
