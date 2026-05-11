import { z } from 'zod';

export const MessageTypeSchema = z.enum(['text', 'image', 'file', 'system']);

export const MessageSchema = z.object({
  id: z.string().uuid(),
  chatId: z.string().uuid(),
  senderId: z.string().uuid(),
  content: z.string().min(1).max(5000),
  type: MessageTypeSchema,
  fileURL: z.string().url().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().int().min(0).optional(),
  createdAt: z.date(),
  readBy: z.array(z.string().uuid()),
});

export const SendMessageSchema = z.object({
  chatId: z.string().uuid(),
  content: z.string().min(1).max(5000),
  type: MessageTypeSchema.default('text'),
  fileURL: z.string().url().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().int().min(0).optional(),
});

export const ChatTypeSchema = z.enum(['direct', 'group']);

export const ChatSchema = z.object({
  id: z.string().uuid(),
  type: ChatTypeSchema,
  participants: z.array(z.string().uuid()).min(2),
  lastMessageAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateChatSchema = z.object({
  type: ChatTypeSchema,
  participants: z.array(z.string().uuid()).min(2),
});

// Type inference
export type MessageInput = z.infer<typeof MessageSchema>;
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
export type ChatInput = z.infer<typeof ChatSchema>;
export type CreateChatInput = z.infer<typeof CreateChatSchema>;
