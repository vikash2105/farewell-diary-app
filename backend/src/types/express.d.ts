import "express";

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
