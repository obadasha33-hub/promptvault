import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET env variable is missing');
    return new Response('Server configuration error', { status: 500 });
  }

  // Get headers for svix verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  // Get raw body payload
  const body = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Error: Verification failed', { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const eventType = evt.type;

  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const email = email_addresses?.[0]?.email_address;

      if (!email) {
        return new Response('Error: User has no email address', { status: 400 });
      }

      const profileData = {
        id,
        first_name: first_name ?? '',
        last_name: last_name ?? '',
        email,
        image_url: image_url ?? '',
        updated_at: new Date().toISOString(),
      };

      if (eventType === 'user.created') {
        const { error } = await supabase.from('profiles').insert([
          {
            ...profileData,
            tier: 'free',
            created_at: new Date().toISOString(),
          },
        ]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', id);
        if (error) throw error;
      }
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;
      if (!id) {
        return new Response('Error: Missing user ID for deletion', { status: 400 });
      }

      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (dbError) {
    console.error('Database sync failed:', dbError);
    return new Response('Database operations failed', { status: 500 });
  }
}
