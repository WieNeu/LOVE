import { z } from 'zod';

export const createStorySchema = z.object({
  anonymousName: z.string().trim().min(2).max(40),
  title: z.string().trim().min(4).max(140),
  content: z.string().trim().min(30).max(5000),
  categoryId: z.string().min(1),
  contentWarning: z.string().trim().max(200).optional().or(z.literal(''))
});

export const commentSchema = z.object({
  anonymousName: z.string().trim().min(2).max(40),
  content: z.string().trim().min(3).max(1000)
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(72),
  publicName: z.string().trim().min(2).max(30).optional().or(z.literal(''))
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(72)
});
