import { z } from 'zod';

// User validation schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().min(2).max(100),
  photoURL: z.string().url().optional(),
  career: z.string().optional(),
  semester: z.number().int().min(1).max(10).optional(),
  bio: z.string().max(500).optional(),
  interests: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserProfileSchema = UserSchema.extend({
  academicInfo: z.object({
    career: z.string(),
    semester: z.number().int().min(1).max(10),
    faculty: z.string().optional(),
    enrollmentYear: z.number().int().optional(),
  }).optional(),
  socialStats: z.object({
    groupsCount: z.number().int().min(0),
    eventsCount: z.number().int().min(0),
    connectionsCount: z.number().int().min(0),
  }).optional(),
});

export const UserSearchSchema = z.object({
  query: z.string().min(1).max(100).optional(),
  career: z.string().optional(),
  semester: z.number().int().min(1).max(10).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const UpdateUserProfileSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  photoURL: z.string().url().optional(),
  career: z.string().optional(),
  semester: z.number().int().min(1).max(10).optional(),
  bio: z.string().max(500).optional(),
  interests: z.array(z.string()).optional(),
});

// Type inference exports
export type UserInput = z.infer<typeof UserSchema>;
export type UserProfileInput = z.infer<typeof UserProfileSchema>;
export type UserSearchInput = z.infer<typeof UserSearchSchema>;
export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>;
