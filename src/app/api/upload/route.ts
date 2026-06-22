import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseClient } from '@/lib/supabase';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

/**
 * POST /api/upload
 * Securely uploads an image or video file to local storage (public/uploads/).
 * Restricted to authenticated Admins.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Session missing' }, { status: 401 });
    }

    // Verify user role is admin in Supabase profiles ledger
    const token = await getToken({ template: 'supabase' });
    const supabase = getSupabaseClient(token);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', userId)
      .single();

    if (profileError || !profileData || profileData.tier !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin authorization required' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate mime types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: `File type not supported: ${file.type}` }, { status: 400 });
    }

    // Save to public/uploads/
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Generate unique name to prevent collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${uniqueSuffix}-${sanitizedName}`;
    const filePath = join(uploadDir, filename);

    // Stream-based file writing to avoid buffering whole file in memory
    const writeStream = createWriteStream(filePath);
    try {
      await pipeline(
        Readable.fromWeb(file.stream() as unknown as Parameters<typeof Readable.fromWeb>[0]),
        writeStream
      );
    } catch (streamError) {
      writeStream.destroy();
      throw streamError;
    }

    const relativeUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: relativeUrl });
  } catch (error: unknown) {
    console.error('File upload API error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Upload failed: ' + errorMessage }, { status: 500 });
  }
}
