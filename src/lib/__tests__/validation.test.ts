import { describe, it, expect } from 'vitest';
import { promptSchema } from '../validation';

describe('Validation Schema Constraints', () => {
  const validPrompt = {
    title: 'System Architect Audit Bot',
    model: 'GPT-5.5 (Agentic)',
    category: 'Security Audit',
    body: 'SYSTEM_ROLE: Analyze design system rules and verify implementation guidelines.',
  };

  it('accepts a valid prompt payload', () => {
    const result = promptSchema.safeParse(validPrompt);
    expect(result.success).toBe(true);
  });

  it('rejects titles that are too short (min 3 characters)', () => {
    const payload = { ...validPrompt, title: 'Ab' };
    const result = promptSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toContain(
        'Prompt title must be at least 3 characters long.'
      );
    }
  });

  it('rejects titles that exceed 100 characters', () => {
    const longTitle = 'a'.repeat(101);
    const payload = { ...validPrompt, title: longTitle };
    const result = promptSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toContain(
        'Prompt title cannot exceed 100 characters.'
      );
    }
  });

  it('rejects titles with forbidden HTML elements or tags', () => {
    const payload = { ...validPrompt, title: 'System <script>alert(1)</script>' };
    const result = promptSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toContain(
        'Title contains invalid characters. Only alphanumeric, space, hyphens, and basic brackets/punctuation/symbols allowed.'
      );
    }
  });

  it('rejects models outside the allowed enum set', () => {
    const payload = { ...validPrompt, model: 'GPT-3.5-Turbo-Invalid' as any };
    const result = promptSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.model).toContain(
        'Please select a valid target AI model from the list.'
      );
    }
  });

  it('rejects categories outside the allowed enum set', () => {
    const payload = { ...validPrompt, category: 'Marketing-Invalid' as any };
    const result = promptSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.category).toContain(
        'Please select a valid category from the list.'
      );
    }
  });

  it('rejects body content that is too short (min 10 characters)', () => {
    const payload = { ...validPrompt, body: 'Too short' };
    const result = promptSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.body).toContain(
        'Prompt body must be at least 10 characters long.'
      );
    }
  });

  it('rejects body content that exceeds 8192 characters', () => {
    const longBody = 'a'.repeat(8193);
    const payload = { ...validPrompt, body: longBody };
    const result = promptSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.body).toContain(
        'Prompt body size limit is 8192 characters.'
      );
    }
  });

  it('accepts image URLs from allowed domains', () => {
    const localhostPayload = { ...validPrompt, image_url: 'http://localhost:3000/uploads/test.png' };
    expect(promptSchema.safeParse(localhostPayload).success).toBe(true);

    const supabasePayload = { ...validPrompt, image_url: 'https://evseilmvdczvtnoxgsht.supabase.co/storage/v1/object/public/images/test.webp' };
    expect(promptSchema.safeParse(supabasePayload).success).toBe(true);

    const ngrokPayload = { ...validPrompt, image_url: 'https://semicolon-dingo-grueling.ngrok-free.dev/uploads/test.png' };
    expect(promptSchema.safeParse(ngrokPayload).success).toBe(true);

    const unsplashPayload = { ...validPrompt, image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80' };
    expect(promptSchema.safeParse(unsplashPayload).success).toBe(true);
  });

  it('rejects image URLs from foreign domains', () => {
    const payload = { ...validPrompt, image_url: 'https://hacker.com/malicious.png' };
    const result = promptSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.image_url).toContain(
        'Unauthorized asset domain'
      );
    }
  });
});
