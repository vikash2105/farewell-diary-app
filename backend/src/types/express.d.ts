import "express";
import "express-session";

/**
 * Express namespace augmentation
 * Extends Express types with custom properties, Multer, and Passport.js support
 * 
 * CRITICAL FOR PRODUCTION BUILDS:
 * - Multer file upload types
 * - Passport.js authentication methods
 * - Custom middleware properties
 */
declare global {
  namespace Express {
    /**
     * User object (populated by Passport.js)
     */
    interface User {
      id: string;
      email: string;
      name: string;
      profilePicture?: string | null;
    }

    /**
     * Request augmentation
     * Properties added by middleware
     */
    interface Request {
      // Custom auth properties (from auth middleware)
      userId?: string;
      userEmail?: string;
      userName?: string;

      // Passport.js methods
      logout(done: (err?: Error) => void): void;
      isAuthenticated(): boolean;
    }

    /**
     * Multer namespace
     * REQUIRED for file upload functionality
     * Provides type safety for uploaded files
     */
    namespace Multer {
      interface File {
        /** Field name specified in the form */
        fieldname: string;
        /** Name of the file on the user's computer */
        originalname: string;
        /** Encoding type of the file */
        encoding: string;
        /** Mime type of the file */
        mimetype: string;
        /** Size of the file in bytes */
        size: number;
        /** The folder to which the file has been saved */
        destination: string;
        /** The name of the file within the destination */
        filename: string;
        /** Full path to the uploaded file */
        path: string;
        /** A Buffer of the entire file (only if using memory storage) */
        buffer: Buffer;
      }
    }
  }
}

// Required for module augmentation
export {};
