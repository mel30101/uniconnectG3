import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(1000),
  imageURL: z.string().url().optional(),
  location: z.string().min(3).max(200),
  startDate: z.date(),
  endDate: z.date(),
  groupId: z.string().uuid().optional(),
  createdBy: z.string().uuid(),
  attendeeCount: z.number().int().min(0),
  maxAttendees: z.number().int().min(1).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const CreateEventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(1000),
  imageURL: z.string().url().optional(),
  location: z.string().min(3).max(200),
  startDate: z.date(),
  endDate: z.date(),
  groupId: z.string().uuid().optional(),
  maxAttendees: z.number().int().min(1).optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const UpdateEventSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(1000).optional(),
  imageURL: z.string().url().optional(),
  location: z.string().min(3).max(200).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  groupId: z.string().uuid().optional(),
  maxAttendees: z.number().int().min(1).optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return data.endDate > data.startDate;
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const EventSearchSchema = z.object({
  query: z.string().min(1).max(100).optional(),
  groupId: z.string().uuid().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Type inference
export type EventInput = z.infer<typeof EventSchema>;
export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
export type EventSearchInput = z.infer<typeof EventSearchSchema>;
