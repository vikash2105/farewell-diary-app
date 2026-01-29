import type { Multer } from "multer";
import "express-serve-static-core";
import "express-session";

/**
 * Express type augmentation
 * This file is REQUIRED for strict TypeScript + Render builds
 */

declare module "express-serve-static-core" {
  interface Request {
    // Custom auth properties
    userId?: string;
    userEmail?: string;
    userName?: string;

    // Multer (file uploads)
    file?: Multer.File;
  }
}

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      profilePicture?: string | null;
    }
  }
}

export {};
