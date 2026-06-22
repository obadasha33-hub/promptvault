import { auth } from '@clerk/nextjs/server';
import { getSupabaseClient } from '@/lib/supabase';
import { promptSchema } from '@/lib/validation';
import { NextResponse } from 'next/server';

/**
 * GET /api/prompts
 * Returns filtered prompt records including author profile details.
 */
export async function GET(req: Request) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Session missing' }, { status: 401 });
    }

    const token = await getToken({ template: 'supabase' });
    const supabase = getSupabaseClient(token);

    const { searchParams } = new URL(req.url);
    const model = searchParams.get('model');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build the query
    let dbQuery = supabase.from('prompts').select(`
      id,
      user_id,
      title,
      model,
      category,
      body,
      likes_count,
      created_at,
      image_url,
      profiles (
        first_name,
        last_name,
        image_url,
        tier
      )
    `);

    // Dynamic filters
    if (model && model !== 'All') {
      dbQuery = dbQuery.eq('model', model);
    }
    if (category && category !== 'All') {
      dbQuery = dbQuery.eq('category', category);
    }
    if (search) {
      dbQuery = dbQuery.or(`title.ilike.%${search}%,body.ilike.%${search}%`);
    }

    const { data, error } = await dbQuery.order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error('API GET prompts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/prompts
 * Validates inputs via Zod and inserts a new prompt under the authenticated user.
 */
export async function POST(req: Request) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Session missing' }, { status: 401 });
    }

    const body = await req.json();

    // Strict Zod Validation
    const validationResult = promptSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, model, category, body: promptBody, image_url } = validationResult.data;

    const token = await getToken({ template: 'supabase' });
    const supabase = getSupabaseClient(token);

    // Insert new prompt record under authenticated userId (Clerk ID matches RLS check)
    const { data, error } = await supabase
      .from('prompts')
      .insert([
        {
          user_id: userId,
          title,
          model,
          category,
          body: promptBody,
          image_url: image_url || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API POST prompt error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
