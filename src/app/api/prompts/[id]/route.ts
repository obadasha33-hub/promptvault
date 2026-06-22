import { auth } from '@clerk/nextjs/server';
import { getSupabaseClient } from '@/lib/supabase';
import { promptSchema } from '@/lib/validation';
import { NextResponse } from 'next/server';

/**
 * DELETE /api/prompts/[id]
 * Deletes a specific prompt. Supabase RLS policy prevents deleting entries owned by other users.
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

    // Run delete. The RLS policy ('Allow users to delete their own prompts') enforces that 
    // the auth.jwt() 'sub' matches the user_id in the prompts table.
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Prompt deleted successfully' });
  } catch (error) {
    console.error('API DELETE prompt error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/prompts/[id]
 * Updates a specific prompt's image_url.
 * Accessible by prompt owner or any admin.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Session missing' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { image_url } = body;

    // Strict schema validation for image_url
    const validationResult = promptSchema.shape.image_url.safeParse(image_url);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten().formErrors },
        { status: 400 }
      );
    }

    const token = await getToken({ template: 'supabase' });
    const supabaseUser = getSupabaseClient(token);

    // Fetch the prompt to check ownership
    const { data: promptData, error: fetchError } = await supabaseUser
      .from('prompts')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Fetch prompt ownership error:', fetchError);
      return NextResponse.json({ error: 'Prompt not found or access denied' }, { status: 404 });
    }

    const isOwner = promptData && promptData.user_id === userId;

    // Fetch user's profile to check if they are an admin
    const { data: profileData, error: profileError } = await supabaseUser
      .from('profiles')
      .select('tier')
      .eq('id', userId)
      .single();

    const isAdmin = profileData && profileData.tier === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized to modify this prompt' }, { status: 403 });
    }

    // Perform update: use admin client if user is admin (to bypass RLS), else use user client
    const { getSupabaseAdmin } = await import('@/lib/supabase');
    const client = isAdmin ? getSupabaseAdmin() : supabaseUser;

    const { data, error } = await client
      .from('prompts')
      .update({ image_url: image_url || null })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API PATCH prompt error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

