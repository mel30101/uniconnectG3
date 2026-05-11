import { z } from 'zod';

export const GroupCategorySchema = z.enum([
  'academic',
  'social',
  'sports',
  'cultural',
  'professional',
  'other',
]);

export const GroupPrivacySchema = z.enum(['public', 'private']);

export const GroupSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  imageURL: z.string().url().optional(),
  category: GroupCategorySchema,
  privacy: GroupPrivacySchema,
  memberCount: z.number().int().min(0),
  createdBy: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateGroupSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  imageURL: z.string().url().optional(),
  category: GroupCategorySchema,
  privacy: GroupPrivacySchema,
});

export const UpdateGroupSchema = CreateGroupSchema.partial();

export const GroupSearchSchema = z.object({
  query: z.string().min(1).max(100).optional(),
  category: GroupCategorySchema.optional(),
  privacy: GroupPrivacySchema.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Type inference
export type GroupInput = z.infer<typeof GroupSchema>;
export type CreateGroupInput = z.infer<typeof CreateGroupSchema>;
export type UpdateGroupInput = z.infer<typeof UpdateGroupSchema>;
export type GroupSearchInput = z.infer<typeof GroupSearchSchema>;
