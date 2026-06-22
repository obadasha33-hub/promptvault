import { z } from 'zod';

// List of allowed model identifiers to enforce enum constraints
export const ALLOWED_MODELS = [
  'GPT-5.5 (Agentic)',
  'Claude 4.8 Opus',
  'Claude Fable 5',
  'Gemini 3.5 Pro',
  'Gemini 3.5 Flash',
  'Flux 1.1 Pro',
  'Midjourney v7',
  'Runway Gen-3',
  'Kling v3.0',
] as const;

// List of allowed prompt categories
export const ALLOWED_CATEGORIES = [
  'Photo Editing',
  'Photo Generation',
  'Video Generation',
  'Vibe Widgets',
  'Agentic Loops',
  'Fullstack Dev',
  'Security Audit',
] as const;

/**
 * Strict validator schema for prompt publishing.
 * Validates length limits, model enums, and trims inputs.
 */
export const promptSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: 'Prompt title must be at least 3 characters long.' })
    .max(100, { message: 'Prompt title cannot exceed 100 characters.' })
    .regex(/^[\w\s\-\[\]\(\)\:\.\,\/\+\#\&\!\@]+$/, {
      message: 'Title contains invalid characters. Only alphanumeric, space, hyphens, and basic brackets/punctuation/symbols allowed.',
    }),
  model: z.enum(ALLOWED_MODELS, {
    message: 'Please select a valid target AI model from the list.',
  }),
  category: z.enum(ALLOWED_CATEGORIES, {
    message: 'Please select a valid category from the list.',
  }),
  body: z
    .string()
    .trim()
    .min(10, { message: 'Prompt body must be at least 10 characters long.' })
    .max(8192, { message: 'Prompt body size limit is 8192 characters.' }),
  image_url: z
    .string()
    .trim()
    .url({ message: 'Please enter a valid image URL.' })
    .refine(
      (val) => {
        try {
          const url = new URL(val);
          const host = url.hostname;
          return (
            host === 'localhost' ||
            host === '127.0.0.1' ||
            host === 'images.unsplash.com' ||
            host === 'unsplash.com' ||
            host.endsWith('.supabase.co') ||
            host.endsWith('.ngrok-free.dev')
          );
        } catch {
          return false;
        }
      },
      { message: 'Unauthorized asset domain' }
    )
    .optional()
    .or(z.literal('')),
});

export type PromptInput = z.infer<typeof promptSchema>;

