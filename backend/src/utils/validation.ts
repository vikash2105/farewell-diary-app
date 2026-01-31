import { z } from 'zod';

/**
 * User registration validation schema
 */
export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  profilePicture: z.string().url().optional(),
});

/**
 * Diary creation validation schema
 */
export const createDiarySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().max(1000).optional(),
  settings: z.object({
    allowAnonymous: z.boolean().default(true),
    requireApproval: z.boolean().default(false),
    theme: z.enum(['default', 'dark', 'minimal']).default('default'),
  }).optional(),
});

/**
 * Farewell note creation validation schema
 */
export const createFarewellNoteSchema = z.object({
  content: z.string().min(10, 'Note must be at least 10 characters').max(5000),
  fontStyle: z.enum(['default', 'handwriting', 'serif', 'cursive']).default('default'),
  isAnonymous: z.boolean().default(false),
  authorName: z.string().optional(),
});

/**
 * Diary link validation schema
 */
export const diaryLinkSchema = z.object({
  link: z.string().regex(/^[a-zA-Z0-9]{8,20}$/, 'Invalid diary link format'),
});

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid('Invalid UUID format');
