import { auth } from '@clerk/nextjs/server';
import { getSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * POST /api/prompts/[id]/save
 * Saves (bookmarks) a specific prompt for the authenticated user.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Session missing' }, { status: 401 });
    }

    const { id } = await params;

    const token = await getToken({ template: 'supabase' });
    const supabase = getSupabaseClient(token);

    // Insert user bookmark. RLS ensures user_id matches auth.jwt() 'sub'.
    const { error } = await supabase
      .from('saved_prompts')
      .insert([
        {
          user_id: userId,
          prompt_id: id,
        },
      ]);

    if (error) {
      console.error('Supabase save error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, saved: true, message: 'Prompt bookmarked' });
  } catch (error) {
    console.error('API POST save prompt error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/prompts/[id]/save
 * Removes (unbookmarks) a saved prompt for the authenticated user.
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Session missing' }, { status: 401 });
    }

    const { id } = await params;

    const token = await getToken({ template: 'supabase' });
    const supabase = getSupabaseClient(token);

    // Delete bookmark. RLS ensures only user's own bookmark can be deleted.
    const { error } = await supabase
      .from('saved_prompts')
      .delete()
      .eq('user_id', userId)
      .eq('prompt_id', id);

    if (error) {
      console.error('Supabase unsave error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, saved: false, message: 'Prompt bookmark removed' });
  } catch (error) {
    console.error('API DELETE save prompt error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
